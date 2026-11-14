import React, { useState, useEffect } from 'react';
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
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
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
              12-Chapter 3D Mission Cinema
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
              CH {String(activeChapter).padStart(2, '0')}/12 · {CHAPTER_SHORT_LABELS[activeChapter]}
            </span>
            <span className="text-slate-400 tabular-nums">
              {Math.round(storyProgress * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onSelectChapter(
                  (activeChapter > 1 ? activeChapter - 1 : 12) as StoryChapterNumber
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
                  (activeChapter < 12 ? activeChapter + 1 : 1) as StoryChapterNumber
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
          Show 12-Chapter Story Guide
        </button>
      ) : (
        <section
          aria-label="Synchronized 12-Chapter Narrative & Telemetry"
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
