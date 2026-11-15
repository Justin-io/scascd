import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';
import {
  ArtifactRecord,
  ScientificClaim,
  ScientificSource,
  StoryChapterNumber,
  ViewportMode,
  WorkspacePanel,
} from '../types/afterlight';
import {
  CinemaCameraMode,
  LiveChoreographyTelemetry,
} from '../utils/storyChoreographyEngine';
import { spaceAudio } from '../utils/audioManager';

interface StorylineDirectorHUDProps {
  artifact: ArtifactRecord;
  allArtifacts: ArtifactRecord[];
  claims: ScientificClaim[];
  sources: ScientificSource[];
  activeChapter: StoryChapterNumber;
  storyProgress: number;
  isStoryPlaying: boolean;
  autoAdvanceChapters: boolean;
  cameraMode: CinemaCameraMode;
  showMotionGraphics: boolean;
  telemetry: LiveChoreographyTelemetry;
  chapterDurationSec?: number;
  onSelectChapter: (chapter: StoryChapterNumber) => void;
  onScrubProgress: (progress: number) => void;
  onTogglePlay: () => void;
  onToggleAutoAdvance: () => void;
  onChangeCameraMode: (mode: CinemaCameraMode) => void;
  onToggleMotionGraphics: () => void;
  onSelectArtifact: (artifactId: string) => void;
  onOpenFullDossierModal: (panel: WorkspacePanel) => void;
  onSwitchViewportMode: (mode: ViewportMode) => void;
}

const CHAPTER_SHORT_LABELS: Record<StoryChapterNumber, string> = {
  1: 'Launch & Pad',
  2: 'Orbit Injection',
  3: 'Deep Cruise',
  4: 'Gravity Capture',
  5: 'Entry / PDI',
  6: 'Touchdown',
  7: 'Unfurl & Deploy',
  8: 'Surface Traverse',
  9: 'Core Discovery',
  10: 'Night Survival',
  11: 'Signal Loss',
  12: 'Satellite Recon',
  13: 'Observatory',
  14: 'Quiet Monuments',
};

export const StorylineDirectorHUD: React.FC<StorylineDirectorHUDProps> = ({
  artifact,
  allArtifacts,
  claims,
  sources,
  activeChapter,
  storyProgress,
  isStoryPlaying,
  autoAdvanceChapters,
  cameraMode,
  showMotionGraphics,
  telemetry,
  chapterDurationSec = 12.0,
  onSelectChapter,
  onScrubProgress,
  onTogglePlay,
  onToggleAutoAdvance,
  onChangeCameraMode,
  onToggleMotionGraphics,
  onSelectArtifact,
  onOpenFullDossierModal,
  onSwitchViewportMode,
}) => {
  const [narrativeMode, setNarrativeMode] = useState<'archival' | 'first_person'>('archival');
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(false);
  const [isStoryCardExpanded, setIsStoryCardExpanded] = useState<boolean>(true);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  useEffect(() => {
    setActiveClaimId(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
  }, [artifact.id, activeChapter]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentChapter =
    artifact.storyChapters.find((c) => c.chapterNumber === activeChapter) ||
    artifact.storyChapters[0];

  const activeClaim = claims.find((c) => c.id === activeClaimId) || null;
  const activeSource = activeClaim
    ? sources.find((s) => s.id === activeClaim.sourceId) || null
    : null;

  const { activeBeat } = telemetry;

  // Standalone Landing Audio Sequence state & timer tracking
  const [standaloneAudioPhase, setStandaloneAudioPhase] = useState<
    'idle' | 'thruster' | 'touchdown' | 'pressure'
  >('idle');
  const standaloneTimerRef = useRef<number[]>([]);

  const handlePlayFullLandingSequence = () => {
    standaloneTimerRef.current.forEach(window.clearTimeout);
    standaloneTimerRef.current = [];
    spaceAudio.playLandingSequence();
    setStandaloneAudioPhase('thruster');
    const t1 = window.setTimeout(() => setStandaloneAudioPhase('touchdown'), 3800);
    const t2 = window.setTimeout(() => setStandaloneAudioPhase('pressure'), 4050);
    const t3 = window.setTimeout(() => setStandaloneAudioPhase('idle'), 7050);
    standaloneTimerRef.current = [t1, t2, t3];
  };

  useEffect(() => {
    return () => {
      standaloneTimerRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const currentChapterTimeSec = storyProgress * chapterDurationSec;
  const isPerseverance = artifact.id === 'ART-M2020-PERSEVERANCE';

  let liveLandingPhase: 'approach' | 'thruster' | 'touchdown' | 'pressure' = 'approach';
  if (activeChapter === 6) {
    if (isPerseverance) {
      if (currentChapterTimeSec < 4.0) liveLandingPhase = 'approach';
      else if (currentChapterTimeSec < 7.8) liveLandingPhase = 'thruster';
      else if (currentChapterTimeSec < 8.2) liveLandingPhase = 'touchdown';
      else liveLandingPhase = 'pressure';
    } else {
      if (currentChapterTimeSec < 5.0) liveLandingPhase = 'approach';
      else if (currentChapterTimeSec < 8.8) liveLandingPhase = 'thruster';
      else if (currentChapterTimeSec < 9.15) liveLandingPhase = 'touchdown';
      else liveLandingPhase = 'pressure';
    }
  }

  const activeDisplayPhase =
    standaloneAudioPhase !== 'idle'
      ? standaloneAudioPhase
      : activeChapter === 6 && isStoryPlaying
      ? liveLandingPhase
      : 'idle';

  const handleToggleNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsNarrating((prev) => !prev);
      return;
    }
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak =
      narrativeMode === 'first_person'
        ? `${activeBeat.firstPersonThought} ${currentChapter.firstPersonPassage.replace(
            '[CREATIVE NARRATIVE]',
            ''
          )}`
        : `${activeBeat.technicalNarrative} ${currentChapter.factualParagraphs
            .map((p) => (simpleLanguage ? p.simpleText : p.text))
            .join(' ')}`;

    const utterance = new SpeechSynthesisUtterance(
      `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}. ${activeBeat.title}. ${textToSpeak}`
    );
    utterance.rate = 0.98;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* 1. COMPACT TOP-LEFT PLAYBACK & CAMERA PILL (Leaves Left & Center 3D Viewport Open!) */}
      <aside
        aria-label="3D Story Playback & Camera Controls"
        className="fixed top-26 md:top-18 left-4 z-20 w-[min(360px,92vw)] bg-[#0B0E17]/92 backdrop-blur-md border border-slate-800/90 rounded-lg p-3.5 space-y-3 pointer-events-auto shadow-2xl"
      >
        {/* Spacecraft Selector */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              14-Chapter 3D Mission Cinema
            </div>
            <h1 className="text-sm font-bold text-slate-100 truncate mt-0.5">
              {artifact.name}
            </h1>
          </div>
          <select
            aria-label="Select Mission Storyline"
            value={artifact.id}
            onChange={(e) => onSelectArtifact(e.target.value)}
            className="px-2 py-1 text-xs bg-[#07090E] border border-slate-700 rounded text-slate-100 font-medium max-w-[140px] truncate cursor-pointer"
          >
            {allArtifacts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transport Bar: Prev | Play/Pause | Scrubber | Next */}
        <div className="space-y-1.5 bg-[#07090E] p-2.5 rounded-md border border-slate-800/90">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-amber-300 font-semibold">
              CH {String(activeChapter).padStart(2, '0')}/14 · {CHAPTER_SHORT_LABELS[activeChapter]}
            </span>
            <span className="text-slate-400 tabular-nums">
              {(storyProgress * chapterDurationSec).toFixed(1)}s / {chapterDurationSec.toFixed(1)}s ({Math.round(storyProgress * 100)}%)
            </span>
          </div>

          {activeChapter >= 1 && activeChapter <= 4 && (
            <div className="text-[10px] font-mono text-cyan-400/90 flex items-center gap-1.5 pb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Flight Sound: Rocket Deep Space Cruise (12s)</span>
            </div>
          )}

          {activeChapter === 5 && (
            <div className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1.5 pb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Descent Sound: Increasing Thrusters · Part 1 of 2 (12s)</span>
            </div>
          )}

          {activeChapter === 6 && (
            <div className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1.5 pb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Terminal Cushion: Increasing Thrusters · Part 2 of 2 (12s)</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onSelectChapter(
                  (activeChapter > 1 ? activeChapter - 1 : 14) as StoryChapterNumber
                )
              }
              title="Previous Chapter"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="px-3 py-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded flex items-center gap-1 shrink-0 transition-colors"
            >
              {isStoryPlaying ? (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Play
                </>
              )}
            </button>

            <input
              aria-label="Chapter Timeline Progress"
              type="range"
              min={0}
              max={0.99}
              step={0.01}
              value={storyProgress}
              onChange={(e) => onScrubProgress(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer"
            />

            <button
              type="button"
              onClick={() =>
                onSelectChapter(
                  (activeChapter < 14 ? activeChapter + 1 : 1) as StoryChapterNumber
                )
              }
              title="Next Chapter"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-800"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onScrubProgress(0)}
              title="Restart Chapter"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Landing Acoustic Sequence Controller (Active in Chapter 6: Touchdown) */}
        {activeChapter === 6 && (
          <div className="p-2 bg-[#060A12] border border-cyan-500/40 rounded space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-cyan-400" /> Landing Acoustic Sequence
              </span>
              <button
                type="button"
                onClick={handlePlayFullLandingSequence}
                className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded flex items-center gap-1 transition-colors"
              >
                <Play className="w-2.5 h-2.5" /> Full (7.0s)
              </button>
            </div>

            {/* 3 Phases Indicators */}
            <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
              <button
                type="button"
                onClick={() => spaceAudio.playLandingIncreasingThruster()}
                title="Increasing Thrusters (24s Total): CH 5 Part 1 (12s) + CH 6 Part 2 (12s)"
                className={`p-1 rounded border text-left flex flex-col justify-between transition-colors ${
                  activeDisplayPhase === 'thruster'
                    ? 'bg-amber-400/25 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <Flame className="w-2.5 h-2.5" /> 1. Thruster
                </span>
                <span className="text-[8px] text-slate-400">CH 5+6 (12s+12s)</span>
              </button>

              <button
                type="button"
                onClick={() => spaceAudio.playLandingTouchdownContact()}
                title="Touchdown Contact (0.65s): Strut compression thud & 1,420 Hz contact sensor chime"
                className={`p-1 rounded border text-left flex flex-col justify-between transition-colors ${
                  activeDisplayPhase === 'touchdown'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1 font-semibold text-cyan-300">
                  <Zap className="w-2.5 h-2.5" /> 2. Contact
                </span>
                <span className="text-[8px] text-slate-400">0.65s Impact</span>
              </button>

              <button
                type="button"
                onClick={() => spaceAudio.playLandingPressureRelease()}
                title="Pressure Release (2.60s): Pneumatic helium blowdown purge hiss & nozzle cooling ticks"
                className={`p-1 rounded border text-left flex flex-col justify-between transition-colors ${
                  activeDisplayPhase === 'pressure'
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1 font-semibold text-emerald-300">
                  <Wind className="w-2.5 h-2.5" /> 3. Vent
                </span>
                <span className="text-[8px] text-slate-400">2.60s Hiss</span>
              </button>
            </div>
          </div>
        )}

        {/* Clean Camera Angle Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Camera className="w-3 h-3 text-cyan-400" /> Camera Angle
            </span>
            <button
              type="button"
              onClick={onToggleMotionGraphics}
              className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Crosshair className="w-3 h-3" />
              Reticle: {showMotionGraphics ? 'On' : 'Off'}
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {(
              [
                ['director_auto', 'Auto'],
                ['wing_pov', 'Wing'],
                ['belly_cam', 'Belly'],
                ['sat_recon', 'Sat Recon'],
                ['free_orbit', 'Free 3D'],
              ] as const
            ).map(([modeId, label]) => (
              <button
                key={modeId}
                type="button"
                onClick={() => onChangeCameraMode(modeId)}
                className={`px-1.5 py-1 text-[11px] font-medium rounded border transition-colors truncate ${
                  cameraMode === modeId
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
                    : 'bg-[#07090E] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. COLLAPSIBLE RIGHT-HAND STORY GUIDE PANEL */}
      {!isStoryCardExpanded ? (
        <button
          type="button"
          onClick={() => setIsStoryCardExpanded(true)}
          className="fixed top-26 md:top-18 right-4 z-20 px-3.5 py-2 bg-[#0B0E17]/95 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-cyan-300 flex items-center gap-2 shadow-2xl pointer-events-auto"
        >
          <Eye className="w-4 h-4" />
          Show 14-Chapter Story Guide
        </button>
      ) : (
        <section
          aria-label="Synchronized 14-Chapter Narrative & Telemetry"
          className="fixed top-26 md:top-18 right-4 bottom-16 z-20 w-[min(410px,92vw)] bg-[#0B0E17]/94 backdrop-blur-md border border-slate-800/90 rounded-lg flex flex-col pointer-events-auto shadow-2xl overflow-hidden"
        >
          {/* Header + Collapse Button */}
          <div className="px-4 py-3 bg-[#07090E] border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Mission Story Guide
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleNarration}
                className={`px-2.5 py-1 text-[11px] rounded border flex items-center gap-1 transition-colors ${
                  isNarrating
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {isNarrating ? (
                  <>
                    <VolumeX className="w-3 h-3" /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" /> Listen
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsStoryCardExpanded(false)}
                title="Hide Story Guide for unobstructed 3D view"
                className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded flex items-center gap-1"
              >
                <EyeOff className="w-3 h-3" /> Hide
              </button>
            </div>
          </div>

          {/* Clean 12-Chapter Selector Grid (4 columns x 3 rows with clear labels) */}
          <div className="p-3 bg-[#07090E]/60 border-b border-slate-800/80 space-y-2">
            <div className="grid grid-cols-4 gap-1">
              {artifact.storyChapters.map((ch) => {
                const isSelected = ch.chapterNumber === activeChapter;
                return (
                  <button
                    key={ch.chapterNumber}
                    type="button"
                    onClick={() => onSelectChapter(ch.chapterNumber)}
                    className={`px-2 py-1 rounded text-left transition-colors border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                        : 'bg-[#07090E] text-slate-300 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono leading-tight">
                      CH {String(ch.chapterNumber).padStart(2, '0')}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      {CHAPTER_SHORT_LABELS[ch.chapterNumber]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reading Style Toggle */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center bg-[#07090E] p-0.5 rounded border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setNarrativeMode('archival')}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    narrativeMode === 'archival'
                      ? 'bg-slate-800 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  NASA Facts
                </button>
                <button
                  type="button"
                  onClick={() => setNarrativeMode('first_person')}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    narrativeMode === 'first_person'
                      ? 'bg-amber-400/20 text-amber-300 font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  First-Person Story
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simpleLanguage}
                    onChange={() => setSimpleLanguage((s) => !s)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Simple Text</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAdvanceChapters}
                    onChange={onToggleAutoAdvance}
                    className="accent-cyan-400 rounded"
                  />
                  <span>Auto 1→12</span>
                </label>
              </div>
            </div>
          </div>

          {/* Scrollable Story Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase">
                Chapter {String(currentChapter.chapterNumber).padStart(2, '0')} ·{' '}
                {currentChapter.title}
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {currentChapter.subtitle}
              </h2>
            </div>

            {/* Active Live Event Box */}
            <div className="p-3 bg-[#07090E] border-l-2 border-cyan-400 rounded-r space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-300 font-semibold">{activeBeat.title}</span>
                <span className="text-slate-400">{activeBeat.metTimestamp}</span>
              </div>
              <p className="text-xs text-cyan-200 font-mono">
                {activeBeat.missionCallout}
              </p>
            </div>

            {/* Dedicated Landing Sequence Acoustic Suite (When in Chapter 6: Touchdown) */}
            {activeChapter === 6 && (
              <div className="p-3.5 bg-gradient-to-b from-slate-900/90 to-[#070A12] border border-cyan-500/40 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                      Terminal Landing Acoustic Suite
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlayFullLandingSequence}
                    className="px-2.5 py-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded flex items-center gap-1 shadow transition-colors"
                  >
                    <Play className="w-3 h-3" /> Play Full Sequence (7.05s)
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Authentic acoustic reproduction grounded in physical rocket plume dynamics, regolith boundary layer reflection, structural oleo strut compression, and post-touchdown pneumatic blowdown.
                </p>

                {/* 3 Interactive Timeline Cards */}
                <div className="space-y-1.5">
                  {/* Step 1: Thrusters */}
                  <div
                    className={`p-2 rounded border transition-colors flex items-start justify-between gap-2 ${
                      activeDisplayPhase === 'thruster'
                        ? 'bg-amber-400/20 border-amber-400 text-slate-100 ring-1 ring-amber-400/50'
                        : 'bg-[#0B0E17] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 font-mono">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>1. Increasing Thruster Sound</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          (24.00s · 30% → 100% Soft Throttle)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Soft throttle ramps from 30% to 100% full retro-burn over 24 seconds to gently arrest descent velocity and reduce impact before touchdown.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => spaceAudio.playLandingIncreasingThrusterPart1()}
                        title="Play CH 5 Part 1: Initial Descent Swell (12.0s)"
                        className="px-2 py-1 text-[10px] font-mono font-medium bg-slate-800 hover:bg-amber-400 hover:text-slate-950 rounded border border-slate-700 transition-colors"
                      >
                        CH5 (12s) 🔊
                      </button>
                      <button
                        type="button"
                        onClick={() => spaceAudio.playLandingIncreasingThrusterPart2()}
                        title="Play CH 6 Part 2: Terminal Cushion (12.0s)"
                        className="px-2 py-1 text-[10px] font-mono font-medium bg-slate-800 hover:bg-amber-400 hover:text-slate-950 rounded border border-slate-700 transition-colors"
                      >
                        CH6 (12s) 🔊
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Touchdown Contact */}
                  <div
                    className={`p-2 rounded border transition-colors flex items-start justify-between gap-2 ${
                      activeDisplayPhase === 'touchdown'
                        ? 'bg-cyan-500/25 border-cyan-400 text-slate-100 ring-1 ring-cyan-400/50'
                        : 'bg-[#0B0E17] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 font-mono">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>2. Touchdown Contact Moment</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          (0.65s · Impact & Engine Cutoff)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Oleo strut honeycomb compression thud (75 Hz), regolith crunch, 1,420 Hz blue contact sensor chime, and immediate engine shutoff.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => spaceAudio.playLandingTouchdownContact()}
                      title="Play Standalone Touchdown Impact (0.65s)"
                      className="px-2 py-1 text-[10px] font-mono font-medium bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 rounded border border-slate-700 transition-colors shrink-0"
                    >
                      0.65s 🔊
                    </button>
                  </div>

                  {/* Step 3: Pressure Release */}
                  <div
                    className={`p-2 rounded border transition-colors flex items-start justify-between gap-2 ${
                      activeDisplayPhase === 'pressure'
                        ? 'bg-emerald-500/25 border-emerald-400 text-slate-100 ring-1 ring-emerald-400/50'
                        : 'bg-[#0B0E17] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 font-mono">
                        <Wind className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3. Post-Landing Pressure Release</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          (2.60s · Blowdown Purge)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        High-pressure helium/propellant lines safed through sonic relief orifice (Pshhhhh-shhhh-ssss) decaying with nozzle contraction ticks.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => spaceAudio.playLandingPressureRelease()}
                      title="Play Standalone Pressure Vent (2.60s)"
                      className="px-2 py-1 text-[10px] font-mono font-medium bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 rounded border border-slate-700 transition-colors shrink-0"
                    >
                      2.6s 🔊
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dedicated Chapter 13: Legacy Deep-Space Scientific Observatory Console */}
            {activeChapter === 13 && (
              <div className="p-3.5 bg-gradient-to-b from-slate-900/95 to-[#050811] border border-cyan-500/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                      Legacy Deep-Space Radio & IR Observatory
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded">
                    DSN 70M INTERFEROMETRY
                  </span>
                </div>

                {/* Real-time Frequency Spectrum & Hydrogen 21cm Line */}
                <div className="p-2.5 bg-[#07090E] rounded border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">Carrier FFT · 1,420.405 MHz H-Line</span>
                    <span className="text-cyan-400 font-semibold tabular-nums">SNR +28.4 dB</span>
                  </div>
                  {/* Real-Time FFT Bar Graph */}
                  <div className="flex items-end gap-1 h-12 pt-1 border-b border-slate-800">
                    {[38, 52, 44, 68, 92, 100, 84, 58, 48, 62, 74, 50, 42, 60, 88, 70].map(
                      (h, i) => {
                        const dynamicH = Math.min(
                          100,
                          Math.max(
                            18,
                            Math.round(
                              h + Math.sin(storyProgress * Math.PI * 8 + i * 0.6) * 14
                            )
                          )
                        );
                        const isCenterPeak = i === 5 || i === 6;
                        return (
                          <div
                            key={i}
                            className={`flex-1 rounded-t transition-all duration-75 ${
                              isCenterPeak ? 'bg-amber-400' : 'bg-cyan-500/80'
                            }`}
                            style={{ height: `${dynamicH}%` }}
                            title={`Bin ${i}: ${dynamicH}% spectral power`}
                          />
                        );
                      }
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>1,420.35 MHz</span>
                    <span className="text-amber-300 font-semibold">1,420.405 MHz (H I)</span>
                    <span>1,420.46 MHz</span>
                  </div>
                </div>

                {/* Calibrated Infrared Radiometry Channels */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Orbital Radiometry Channels (LROC Diviner / MRO CRISM)
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="p-1.5 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">1.25 µm NIR</div>
                      <div className="text-xs font-semibold text-cyan-300 mt-0.5">0.68 mW/m²</div>
                      <div className="text-[9px] text-slate-500">Surface Reflectance</div>
                    </div>
                    <div className="p-1.5 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">2.31 µm SWIR</div>
                      <div className="text-xs font-semibold text-amber-300 mt-0.5">0.42 mW/m²</div>
                      <div className="text-[9px] text-slate-500">Mineral Band</div>
                    </div>
                    <div className="p-1.5 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">4.26 µm TIR</div>
                      <div className="text-xs font-semibold text-emerald-300 mt-0.5">238 K Radiance</div>
                      <div className="text-[9px] text-slate-500">Thermal Inertia</div>
                    </div>
                  </div>
                </div>

                {/* DSN Ground Terminals & PDS Archives */}
                <div className="p-2.5 bg-[#07090E] rounded border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Active DSN Complex:</span>
                    <span className="text-cyan-300">DSS-14 (Goldstone, 70m)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Archive Catalog:</span>
                    <span className="text-amber-300 truncate max-w-[200px]">
                      NASA PDS Geosciences / {artifact.nssdcaId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Astrometric Accuracy:</span>
                    <span className="text-emerald-300 font-semibold">±0.25 mas (ICRF-3)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dedicated Chapter 14: The Quiet Monuments (Cinematic Ending Console) */}
            {activeChapter === 14 && (
              <div className="p-4 bg-gradient-to-b from-slate-900/95 via-[#060912] to-[#04060c] border border-amber-500/50 rounded-lg space-y-3 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 text-base">✦</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200 font-mono">
                    Planetary Archaeology Sanctuary · Epilogue
                  </span>
                </div>

                {/* Dominant Final Quote Banner */}
                <div className="p-3.5 bg-amber-500/10 border-l-2 border-amber-400 rounded-r space-y-1.5">
                  <p className="text-xs text-slate-100 font-serif italic leading-relaxed">
                    "They remain where they fell, not as debris, but as the quiet monuments of human curiosity."
                  </p>
                  <div className="text-[10px] font-mono text-amber-300/80 uppercase">
                    — Planetary Archaeology Heritage Charter · AFTERLIGHT
                  </div>
                </div>

                {/* Historical Artifact Callbacks across Moon & Mars */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Permanent Extraterrestrial Heritage Callbacks
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    <div className="p-2 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-amber-300 font-semibold text-[11px]">Apollo 11 Tranquillity</div>
                      <div className="text-[10px] text-slate-400">57+ Years · LRRR Active</div>
                    </div>
                    <div className="p-2 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-cyan-300 font-semibold text-[11px]">Opportunity Meridiani</div>
                      <div className="text-[10px] text-slate-400">45.16 km Wheel Tracks</div>
                    </div>
                    <div className="p-2 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-emerald-300 font-semibold text-[11px]">Perseverance Jezero</div>
                      <div className="text-[10px] text-slate-400">Ingenuity Flight Line</div>
                    </div>
                    <div className="p-2 bg-[#07090E] rounded border border-slate-800">
                      <div className="text-purple-300 font-semibold text-[11px]">Voyager 1 Interstellar</div>
                      <div className="text-[10px] text-slate-400">&gt; 160 AU · Golden Record</div>
                    </div>
                  </div>
                </div>

                {/* Preservation Timeline */}
                <div className="p-2.5 bg-[#07090E] rounded border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Space Weathering Rate:</span>
                    <span className="text-slate-200">~1 mm / 1,000,000 Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cosmic Endurance:</span>
                    <span className="text-amber-300 font-semibold">&gt; 100,000 Millennia</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter Narrative Paragraphs */}
            {narrativeMode === 'archival' ? (
              <div className="space-y-2.5">
                {currentChapter.factualParagraphs.map((para, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-[#07090E]/80 border border-slate-800/80 rounded space-y-2"
                  >
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {simpleLanguage ? para.simpleText : para.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        Verified Source:
                      </span>
                      {para.claimIds.map((cid) => (
                        <button
                          key={cid}
                          type="button"
                          onClick={() =>
                            setActiveClaimId(activeClaimId === cid ? null : cid)
                          }
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                            activeClaimId === cid
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                              : 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
                          }`}
                        >
                          [{cid}]
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded space-y-2">
                <div className="text-[10px] font-mono text-amber-300 uppercase">
                  First-Person Spacecraft Perspective
                </div>
                <p className="text-xs text-slate-100 italic leading-relaxed">
                  {currentChapter.firstPersonPassage}
                </p>
              </div>
            )}

            {/* Expanded Source Drawer (Only shown when a citation chip is clicked) */}
            {activeClaim && (
              <div className="p-3 bg-slate-900/90 border border-cyan-500/40 rounded space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-cyan-300 flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    {activeClaim.id} · {activeClaim.verificationStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveClaimId(null)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <p className="text-slate-200 leading-relaxed">{activeClaim.statement}</p>
                {activeSource && (
                  <a
                    href={activeSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline pt-1"
                  >
                    {activeSource.archiveName} · {activeSource.datasetId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="px-4 py-2.5 bg-[#07090E] border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                onSwitchViewportMode(
                  artifact.bodyId === 'mars' ? 'mars_globe' : 'moon_globe'
                )
              }
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded transition-colors"
            >
              View Landing Site on Globe
            </button>
            <button
              type="button"
              onClick={() => onOpenFullDossierModal('artifact_dossier')}
              className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
            >
              Open Full Dossier
            </button>
          </div>
        </section>
      )}
    </>
  );
};
