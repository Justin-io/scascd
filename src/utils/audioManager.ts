/**
 * AFTERLIGHT — High-Fidelity Scientific Space Acoustic Engine
 * Grounded in authentic physical acoustics (vacuum structural conduction,
 * Mars atmospheric frequency absorption, pneumatic cold-gas bursts, DSN carrier pings).
 *
 * Implements strict frequency de-confliction, single-voice limiting,
 * slider throttling, and bus volume ducking to eliminate audio clutter.
 */

import { StoryChapterNumber } from '../types/afterlight';

type SoundId =
  | 'rocket_space_travel_12s'
  | 'landing_increasing_thruster'
  | 'landing_increasing_thruster_ch5'
  | 'landing_increasing_thruster_ch6'
  | 'landing_touchdown_contact'
  | 'landing_pressure_release'
  | 'landing_sequence_full'
  | 'apollo11_story_12s'
  | 'perseverance_edl_10s'
  | 'generic_mission_story_12s';

const SOUND_PATHS: Partial<Record<SoundId, string>> = {
  rocket_space_travel_12s: '/media/sounds/rocket_space_travel_12s.wav',
  landing_increasing_thruster: '/media/sounds/landing_increasing_thruster.wav',
  landing_increasing_thruster_ch5: '/media/sounds/landing_increasing_thruster_ch5.wav',
  landing_increasing_thruster_ch6: '/media/sounds/landing_increasing_thruster_ch6.wav',
};

class SpaceAudioManager {
  private static instance: SpaceAudioManager | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private mechanicalGain: GainNode | null = null;

  private audioBuffers: Map<SoundId, AudioBuffer> = new Map();
  private pendingBufferLoads: Map<SoundId, Promise<AudioBuffer | null>> = new Map();
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private activeStorySource: AudioBufferSourceNode | null = null;
  private activeStoryGain: GainNode | null = null;
  private activeStoryId: string | null = null;
  private activeStoryChapter: number | null = null;
  private activeStoryStartTime: number = 0;
  private activeStoryBufferDuration: number = 12.0;
  private activeSyntheticNodes: Set<AudioScheduledSourceNode> = new Set();
  private storyAudioGeneration: number = 0;
  private isStoryPlaybackActive: boolean = false;

  private isMuted: boolean = false;
  private masterVolume: number = 0.55;

  // Rate-limiting timestamps (ms) to prevent slider/hover spam
  private lastTriggerTimes: Map<string, number> = new Map();

  private constructor() {
    // Read user mute preference from localStorage if available
    try {
      const savedMute = localStorage.getItem('afterlight_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch {
      // Fallback if localStorage is disabled
    }
  }

  public static getInstance(): SpaceAudioManager {
    if (!SpaceAudioManager.instance) {
      SpaceAudioManager.instance = new SpaceAudioManager();
    }
    return SpaceAudioManager.instance;
  }

  /**
   * Initializes the Web Audio context on the first user interaction.
   * Browsers restrict audio until a click or touch event occurs.
   */
  private ensureContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;

      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0.0 : this.masterVolume,
        this.ctx.currentTime
      );
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus (UI clicks, telemetry pings)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.65;
      this.sfxGain.connect(this.masterGain);

      // Mechanical/Physics Bus (Engines, wheels, servos - ducks automatically)
      this.mechanicalGain = this.ctx.createGain();
      this.mechanicalGain.gain.value = 0.85;
      this.mechanicalGain.connect(this.masterGain);

      // Preload critical audio buffers in background
      this.preloadBuffers();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public async loadAudioBuffer(soundId: SoundId): Promise<AudioBuffer | null> {
    if (this.audioBuffers.has(soundId)) {
      return this.audioBuffers.get(soundId)!;
    }
    if (this.pendingBufferLoads.has(soundId)) {
      return await this.pendingBufferLoads.get(soundId)!;
    }
    const path = SOUND_PATHS[soundId];
    if (!path) return null;

    const ctx = this.ensureContext();
    if (!ctx) return null;

    const promise = (async () => {
      try {
        const resp = await fetch(path);
        if (resp.ok) {
          const ab = await resp.arrayBuffer();
          const decoded = await ctx.decodeAudioData(ab);
          this.audioBuffers.set(soundId, decoded);
          return decoded;
        }
      } catch (err) {
        console.warn('Audio fetch failed for', path, err);
      } finally {
        this.pendingBufferLoads.delete(soundId);
      }
      return null;
    })();

    this.pendingBufferLoads.set(soundId, promise);
    return await promise;
  }

  private async preloadBuffers(): Promise<void> {
    for (const id of Object.keys(SOUND_PATHS) as SoundId[]) {
      void this.loadAudioBuffer(id);
    }
  }

  private playBuffer(
    soundId: SoundId,
    bus: 'sfx' | 'mechanical',
    volumeScale = 1.0,
    rateLimitMs = 80
  ): void {
    if (this.isMuted) return;

    const now = performance.now();
    const lastTime = this.lastTriggerTimes.get(soundId) || 0;
    if (now - lastTime < rateLimitMs) {
      return; // Debounced to prevent acoustic piling
    }
    this.lastTriggerTimes.set(soundId, now);

    const ctx = this.ensureContext();
    if (!ctx) return;

    const buffer = this.audioBuffers.get(soundId);
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volumeScale, ctx.currentTime);

      const targetBus = bus === 'mechanical' ? this.mechanicalGain : this.sfxGain;
      source.connect(gain);
      gain.connect(targetBus || ctx.destination);

      this.activeSources.add(source);
      source.onended = () => {
        this.activeSources.delete(source);
        source.disconnect();
        gain.disconnect();
      };

      source.start();
    } else {
      // Procedural synthetic fallback in case buffer is still loading
      this.playSyntheticFallback(soundId, volumeScale);
    }
  }

  private registerSyntheticNode(node: AudioScheduledSourceNode): void {
    this.activeSyntheticNodes.add(node);
    node.onended = () => {
      this.activeSyntheticNodes.delete(node);
    };
  }

  /**
   * Procedural Web Audio API synthesis fallback for landing sounds
   */
  private playSyntheticFallback(soundId: SoundId, volumeScale: number): void {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (soundId === 'landing_touchdown_contact') {
      // Impact thud + contact sensor chime (1,420 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1420, now);
      gain.gain.setValueAtTime(0.35 * volumeScale, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.mechanicalGain || ctx.destination);
      this.registerSyntheticNode(osc);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (soundId === 'landing_pressure_release') {
      // Pneumatic gas vent hiss
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.value = 0.4 * volumeScale;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.mechanicalGain || ctx.destination);
      this.registerSyntheticNode(noise);
      noise.start(now);
    } else if (
      soundId === 'landing_increasing_thruster' ||
      soundId === 'landing_sequence_full' ||
      soundId === 'landing_increasing_thruster_ch5' ||
      soundId === 'landing_increasing_thruster_ch6'
    ) {
      // Soft procedural thruster swell to cushion landing impact
      const duration = (soundId === 'landing_increasing_thruster_ch5' || soundId === 'landing_increasing_thruster_ch6') ? 12.0 : 24.0;
      const isCh6 = soundId === 'landing_increasing_thruster_ch6';
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.995 * b0 + white * 0.03;
        b1 = 0.975 * b1 + white * 0.10;
        b2 = 0.89 * b2 + white * 0.20;
        data[i] = (b0 + b1 + b2) * 0.25;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Soft spooling turbopump sine tone
      const startFreq = isCh6 ? 300 : 180;
      const endFreq = isCh6 ? 420 : 300;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      const oscGain = ctx.createGain();
      const startOscGain = isCh6 ? 0.08 : 0.04;
      const endOscGain = isCh6 ? 0.12 : 0.08;
      oscGain.gain.setValueAtTime(startOscGain * volumeScale, now);
      oscGain.gain.linearRampToValueAtTime(endOscGain * volumeScale, now + duration);
      osc.connect(oscGain);
      oscGain.connect(this.mechanicalGain || ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const startFilter = isCh6 ? 320 : 150;
      const endFilter = isCh6 ? 550 : 320;
      filter.frequency.setValueAtTime(startFilter, now);
      filter.frequency.exponentialRampToValueAtTime(endFilter, now + duration);

      const gain = ctx.createGain();
      const startNoiseGain = isCh6 ? 0.22 : 0.08;
      const endNoiseGain = isCh6 ? 0.38 : 0.22;
      gain.gain.setValueAtTime(startNoiseGain * volumeScale, now);
      gain.gain.linearRampToValueAtTime(endNoiseGain * volumeScale, now + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.mechanicalGain || ctx.destination);

      this.registerSyntheticNode(osc);
      this.registerSyntheticNode(noise);
      osc.start(now);
      noise.start(now);
      osc.stop(now + duration);
      noise.stop(now + duration);
    } else if (soundId === 'rocket_space_travel_12s') {
      // Procedural synthetic fallback for 12s rocket traveling in space
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(42, now);
      osc.frequency.linearRampToValueAtTime(84, now + 6);
      osc.frequency.linearRampToValueAtTime(42, now + 12);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.20 * volumeScale, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.mechanicalGain || ctx.destination);
      this.registerSyntheticNode(osc);
      osc.start(now);
      osc.stop(now + 12.0);
    }
  }

  // --- PUBLIC HIGH-LEVEL ACOUSTIC TRIGGERS ---

  /** 12s audio of a rocket traveling in deep space for the Watch Story Intro (reduced gentle volume) */
  public async playStoryIntroAudio(progress = 0.0, volume = 0.35): Promise<void> {
    await this.startStoryAudio('STORY_INTRO', progress, 'rocket_space_travel_12s', volume);
  }

  /** Alias for 12s rocket space travel sound */
  public async playRocketSpaceTravel(progress = 0.0, volume = 0.35): Promise<void> {
    await this.startStoryAudio('STORY_INTRO', progress, 'rocket_space_travel_12s', volume);
  }

  /** Soft 24.0s increasing thruster sound building in power as equipment nears the surface to reduce impact */
  public playLandingIncreasingThruster(volume = 0.38): void {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
    this.playBuffer('landing_increasing_thruster', 'mechanical', volume, 600);
  }

  /** Part 1 (CH 5): First 12.0s of increasing thrusters during powered descent initiation */
  public playLandingIncreasingThrusterPart1(volume = 0.38): void {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
    this.playBuffer('landing_increasing_thruster_ch5', 'mechanical', volume, 600);
  }

  /** Part 2 (CH 6): Second 12.0s of increasing thrusters during terminal touchdown cushion */
  public playLandingIncreasingThrusterPart2(volume = 0.38): void {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
    this.playBuffer('landing_increasing_thruster_ch6', 'mechanical', volume, 600);
  }

  /** Mechanical landing gear / wheel impact thud & contact sensor chime */
  public playLandingTouchdownContact(volume = 0.85): void {
    this.playBuffer('landing_touchdown_contact', 'mechanical', volume, 300);
  }

  /** Post-landing high-pressure helium/propellant blowdown relief valve purge hiss */
  public playLandingPressureRelease(volume = 0.85): void {
    this.playBuffer('landing_pressure_release', 'mechanical', volume, 500);
  }

  /** Complete unified landing acoustic sequence (Increasing Thruster -> Touchdown -> Pressure Release) */
  public playLandingSequence(volume = 0.90): void {
    this.playBuffer('landing_sequence_full', 'mechanical', volume, 800);
  }

  /** Backwards-compatible aliases mapping to landing acoustic suite */
  public playRocketDescentEngine(volume = 0.85): void {
    this.playLandingIncreasingThruster(volume);
  }

  public playRcsThruster(volume = 0.65): void {
    this.playLandingTouchdownContact(volume * 0.75);
  }

  public playRoverWheelCrunch(volume = 0.55): void {
    this.playLandingTouchdownContact(volume);
  }

  public playServoMotor(_volume = 0.5): void {
    // Silent
  }

  public playVoyagerPlasma(_volume = 0.6): void {
    // Silent
  }

  public playExplodedSlide(_volume = 0.45): void {
    // Silenced: strictly no background sound effects during general exploration
  }

  public playTelemetryPing(_volume = 0.4): void {
    // Silenced: strictly no background telemetry pings during general exploration
  }

  public playCelestialTransit(_volume = 0.65): void {
    // Silent
  }

  // --- 12-CHAPTER STORY CINEMA AUDIO SYNCHRONIZED TO EXACT VIDEO DURATION ---

  /**
   * Starts playing the authentic archival mission descent / flight soundscape
   * matching the exact historical video duration.
   * Plays rocket space travel audio across Chapters 1 to 4 in story cinema mode.
   * Plays soft landing increasing thrusters part 1 for Chapter 5 and part 2 for Chapter 6.
   * Strictly silences all other chapters.
   */
  public async startStoryAudio(
    _artifactId: string,
    progress = 0.0,
    _soundOverride?: SoundId,
    volume = 0.35,
    chapter?: StoryChapterNumber | number
  ): Promise<void> {
    if (this.isMuted) return;

    // Strict chapter assignment:
    // Only chapters 1 to 6 have assigned audio in Watch Story Intro:
    // - Chapters 1 to 4: rocket_space_travel_12s (deep space travel cruise audio)
    // - Chapter 5: landing_increasing_thruster_ch5 (first 12s part: descent thrusters)
    // - Chapter 6: landing_increasing_thruster_ch6 (second 12s part: terminal cushion thrusters to reduce impact)
    // - All other chapters (7 to 14) or missing chapter: strictly silent!
    if (chapter === undefined || chapter < 1 || chapter > 6) {
      this.stopStoryAudio();
      return;
    }

    let soundId: SoundId;
    if (chapter >= 1 && chapter <= 4) {
      soundId = 'rocket_space_travel_12s';
    } else if (chapter === 5) {
      soundId = 'landing_increasing_thruster_ch5';
    } else if (chapter === 6) {
      soundId = 'landing_increasing_thruster_ch6';
    } else {
      this.stopStoryAudio();
      return;
    }

    const currentGen = ++this.storyAudioGeneration;
    this.isStoryPlaybackActive = true;

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignore
      }
    }

    if (this.storyAudioGeneration !== currentGen || !this.isStoryPlaybackActive) {
      return;
    }

    // Check if the current audio is already playing and properly aligned within this chapter:
    if (
      this.activeStorySource &&
      this.activeStoryId === soundId &&
      this.activeStoryChapter === chapter
    ) {
      const elapsed = (ctx.currentTime - this.activeStoryStartTime) % this.activeStoryBufferDuration;
      const expectedProgress = elapsed / this.activeStoryBufferDuration;
      const progressDelta = Math.abs(expectedProgress - progress);
      // If delta is under 0.08 (standard 50ms interval animation progression), keep playing smoothly!
      if (progressDelta < 0.08 || progressDelta > 0.92) {
        return;
      }
    }

    this.stopStoryAudioInternal();

    const buffer = await this.loadAudioBuffer(soundId);
    if (this.storyAudioGeneration !== currentGen || !this.isStoryPlaybackActive) {
      return;
    }

    if (!buffer) {
      if (this.storyAudioGeneration === currentGen && this.isStoryPlaybackActive) {
        this.playSyntheticFallback(soundId, volume);
      }
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    const effectiveVolume =
      soundId === 'rocket_space_travel_12s'
        ? Math.min(volume, 0.35)
        : Math.min(volume, 0.38);
    gain.gain.setValueAtTime(effectiveVolume, ctx.currentTime);

    source.connect(gain);
    gain.connect(this.mechanicalGain || ctx.destination);

    const safeProgress = Math.max(0.0, Math.min(0.99, progress));
    const offsetSec = (safeProgress * buffer.duration) % buffer.duration;
    source.start(0, offsetSec);

    this.activeStorySource = source;
    this.activeStoryGain = gain;
    this.activeStoryId = soundId;
    this.activeStoryChapter = chapter;
    this.activeStoryBufferDuration = buffer.duration;
    this.activeStoryStartTime = ctx.currentTime - offsetSec;

    source.onended = () => {
      if (this.activeStorySource === source) {
        this.activeStorySource = null;
        this.activeStoryGain = null;
        this.activeStoryId = null;
        this.activeStoryChapter = null;
      }
    };
  }

  /** Internal cleanup of active story audio nodes without resetting generation */
  private stopStoryAudioInternal(): void {
    if (this.activeStoryGain) {
      try {
        this.activeStoryGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
        this.activeStoryGain.disconnect();
      } catch {
        // Ignore
      }
      this.activeStoryGain = null;
    }

    if (this.activeStorySource) {
      try {
        this.activeStorySource.stop(0);
        this.activeStorySource.disconnect();
      } catch {
        // Ignore if already ended
      }
      this.activeStorySource = null;
    }
    this.activeStoryId = null;
    this.activeStoryChapter = null;

    // Immediately stop any procedural synthetic nodes
    for (const node of this.activeSyntheticNodes) {
      try {
        node.stop(0);
        node.disconnect();
      } catch {
        // Ignore
      }
    }
    this.activeSyntheticNodes.clear();
  }

  /** Stops and disconnects all active story audio, standalone sounds, and synthetic nodes */
  public stopStoryAudio(): void {
    ++this.storyAudioGeneration;
    this.isStoryPlaybackActive = false;
    this.stopStoryAudioInternal();

    // Immediately stop any standalone sources
    for (const source of this.activeSources) {
      try {
        source.stop(0);
        source.disconnect();
      } catch {
        // Ignore
      }
    }
    this.activeSources.clear();
  }

  /** Pauses story cinema audio */
  public pauseStoryAudio(): void {
    this.stopStoryAudio();
  }

  /** Immediately stops all audio playback */
  public stopAllAudio(): void {
    this.stopStoryAudio();
  }

  /** Seeks story cinema audio to an exact progress ratio (0.0 to 1.0) inside a chapter */
  public seekStoryAudio(
    artifactId: string,
    progress: number,
    chapter: StoryChapterNumber | number,
    volume = 0.35
  ): void {
    this.stopStoryAudio();
    void this.startStoryAudio(artifactId, progress, undefined, volume, chapter);
  }

  // --- MUTE & VOLUME CONTROLS ---

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('afterlight_audio_muted', String(this.isMuted));
    } catch {
      // Ignore
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0.0 : this.masterVolume,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.masterVolume = Math.max(0.0, Math.min(1.0, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }
}

export const spaceAudio = SpaceAudioManager.getInstance();
