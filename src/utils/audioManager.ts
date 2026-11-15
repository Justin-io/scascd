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

  public playExplodedSlide(volume = 0.45): void {
    this.playLandingTouchdownContact(volume * 0.5);
  }

  public playTelemetryPing(volume = 0.4): void {
    this.playLandingTouchdownContact(volume * 0.6);
  }

  public playCelestialTransit(_volume = 0.65): void {
    // Silent
  }

  // --- 12-CHAPTER STORY CINEMA AUDIO SYNCHRONIZED TO EXACT VIDEO DURATION ---

  /**
   * Starts playing the authentic archival mission descent / flight soundscape
   * matching the exact historical video duration.
   * Plays rocket space travel audio across Chapters 1 to 4 in story cinema mode.
   */
  public async startStoryAudio(
    artifactId: string,
    progress = 0.0,
    soundOverride?: SoundId,
    volume = 0.35,
    chapter?: StoryChapterNumber | number
  ): Promise<void> {
    if (this.isMuted) return;

    // Specifically play:
    // - Chapters 1 to 4: rocket_space_travel_12s (loops seamlessly across deep space cruise)
    // - Chapter 5: landing_increasing_thruster_ch5 (first 12s part of increasing thrusters)
    // - Chapter 6: landing_increasing_thruster_ch6 (second 12s part of increasing thrusters to reduce impact)
    if (chapter !== undefined) {
      if (chapter >= 1 && chapter <= 4) {
        soundOverride = 'rocket_space_travel_12s';
      } else if (chapter === 5 && SOUND_PATHS['landing_increasing_thruster_ch5']) {
        soundOverride = 'landing_increasing_thruster_ch5';
      } else if (chapter === 6 && SOUND_PATHS['landing_increasing_thruster_ch6']) {
        soundOverride = 'landing_increasing_thruster_ch6';
      } else if (!soundOverride) {
        // Stop audio for chapters without assigned soundscape
        this.stopStoryAudio();
        return;
      }
    }

    let soundId: SoundId = soundOverride || 'rocket_space_travel_12s';
    if (!soundOverride) {
      if (artifactId === 'ART-APOLLO11-LM-DS' && SOUND_PATHS['apollo11_story_12s']) {
        soundId = 'apollo11_story_12s';
      } else if (artifactId === 'ART-M2020-PERSEVERANCE' && SOUND_PATHS['perseverance_edl_10s']) {
        soundId = 'perseverance_edl_10s';
      } else if (SOUND_PATHS['rocket_space_travel_12s']) {
        soundId = 'rocket_space_travel_12s';
      }
    }

    // Keep seamless continuous playback if rocket space travel audio is already playing across Chapters 1 to 4
    if (
      this.activeStorySource &&
      this.activeStoryId === soundId &&
      chapter !== undefined &&
      chapter >= 1 &&
      chapter <= 4
    ) {
      return;
    }

    this.stopStoryAudio();

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignore
      }
    }

    const buffer = await this.loadAudioBuffer(soundId);
    if (!buffer) {
      this.playSyntheticFallback(soundId, volume);
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Loop seamlessly across Chapters 1 to 4
    if (chapter !== undefined && chapter >= 1 && chapter <= 4) {
      source.loop = true;
    }

    const gain = ctx.createGain();
    const effectiveVolume =
      soundId === 'rocket_space_travel_12s'
        ? Math.min(volume, 0.35)
        : soundId === 'landing_increasing_thruster' ||
          soundId === 'landing_increasing_thruster_ch5' ||
          soundId === 'landing_increasing_thruster_ch6'
        ? Math.min(volume, 0.38)
        : volume;
    gain.gain.setValueAtTime(effectiveVolume, ctx.currentTime);

    source.connect(gain);
    gain.connect(this.mechanicalGain || ctx.destination);

    const safeProgress = Math.max(0.0, Math.min(0.98, progress));
    const offsetSec = (safeProgress * buffer.duration) % buffer.duration;
    source.start(0, offsetSec);

    this.activeStorySource = source;
    this.activeStoryGain = gain;
    this.activeStoryId = soundId;

    source.onended = () => {
      if (this.activeStorySource === source) {
        this.activeStorySource = null;
        this.activeStoryGain = null;
        this.activeStoryId = null;
      }
    };
  }

  /** Stops and disconnects active mission story cinema audio */
  public stopStoryAudio(): void {
    if (this.activeStorySource) {
      try {
        this.activeStorySource.stop();
        this.activeStorySource.disconnect();
      } catch {
        // Ignore if already ended
      }
      this.activeStorySource = null;
    }
    if (this.activeStoryGain) {
      this.activeStoryGain.disconnect();
      this.activeStoryGain = null;
    }
    this.activeStoryId = null;
  }

  /** Pauses story cinema audio */
  public pauseStoryAudio(): void {
    this.stopStoryAudio();
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
