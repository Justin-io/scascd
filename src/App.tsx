import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Database,
  Eye,
  EyeOff,
  Layers,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  ARTIFACT_RECORDS,
  CELESTIAL_BODIES,
  DATA_CONNECTOR_STATUSES,
  EDUCATIONAL_CHALLENGES,
  GEOLOGICAL_FEATURES,
  LEGACY_EDGES,
  LEGACY_NODES,
  MEDIA_ASSETS,
  MISSION_EVENTS,
  SCIENTIFIC_CLAIMS,
  SCIENTIFIC_SOURCES,
} from './data/scientificData';
import {
  ArtifactRecord,
  CelestialBodyId,
  CinematicShotPreset,
  ExperiencePresentationMode,
  StoryChapterNumber,
  ViewportMode,
  WorkspacePanel,
} from './types/afterlight';
import {
  LayerVisibilityState,
  PlanetaryCanvas3D,
} from './components/PlanetaryCanvas3D';
import {
  AstronomicalScaleMode,
  NATURAL_SATELLITES_CATALOG,
  NaturalSatelliteSpec,
  ScientificCelestialMetadata,
} from './three/scientificScaleSystem';
import { CINEMATIC_SHOT_PRESETS } from './three/celestialWorldsEngine';
import { ArtifactAndStoryModal } from './components/ArtifactAndStoryModal';
import { ScientificWorkspacesModal } from './components/ScientificWorkspacesModal';
import { StorylineDirectorHUD } from './components/StorylineDirectorHUD';
import { CinematicMotionGraphicsHUD } from './components/CinematicMotionGraphicsHUD';
import { formatCoordinate, getPrimaryCoordinate } from './utils/scientificEngine';
import {
  CinemaCameraMode,
  computeLiveChoreographyTelemetry,
} from './utils/storyChoreographyEngine';
import { VoiceOfLeftBehindScrollExperience } from './components/VoiceOfLeftBehindScrollExperience';
import { spaceAudio } from './utils/audioManager';

export default function App() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('solar_system');
  const [selectedBodyId, setSelectedBodyId] = useState<CelestialBodyId>('sun');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(
    'ART-APOLLO11-LM-DS'
  );
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspacePanel>('none');
  const [isBottomDockCollapsed, setIsBottomDockCollapsed] = useState<boolean>(false);
  const [isInfoCardHidden, setIsInfoCardHidden] = useState<boolean>(false);
  const [isSceneOptionsOpen, setIsSceneOptionsOpen] = useState<boolean>(false);
  const [isScrollStoryActive, setIsScrollStoryActive] = useState<boolean>(true);
  const [activeStorySection, setActiveStorySection] = useState<'hero' | 'moon' | 'mars' | 'lab'>('hero');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => spaceAudio.getIsMuted());

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({
    showArtifacts: true,
    showTraverses: true,
    showGeology: true,
    showGraticule: true,
    showOrbits: true,
    categoryFilter: 'all',
  });

  const [simulationSpeed, setSimulationSpeed] = useState<number>(1.0);
  const [wellDepth, setWellDepth] = useState<number>(1.0);
  const [explodedFactor, setExplodedFactor] = useState<number>(0.0);
  const [cameraPresetKey, setCameraPresetKey] = useState<number>(0);
  const [scaleMode, setScaleMode] = useState<AstronomicalScaleMode>(
    'scientific_exploration'
  );
  const [selectedSatellite, setSelectedSatellite] =
    useState<ScientificCelestialMetadata | null>(null);
  const [selectedSatelliteId, setSelectedSatelliteId] =
    useState<string>('sat-europa');
  const [presentationMode, setPresentationMode] =
    useState<ExperiencePresentationMode>('scientific');
  const [cinematicShotPreset, setCinematicShotPreset] =
    useState<CinematicShotPreset>('GRAND_REVEAL');

  const activeSatelliteSpec: NaturalSatelliteSpec = useMemo(
    () =>
      NATURAL_SATELLITES_CATALOG.find((s) => s.id === selectedSatelliteId) ||
      NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-europa') ||
      NATURAL_SATELLITES_CATALOG[0],
    [selectedSatelliteId]
  );

  // 12-Chapter / 60-Beat 3D Storyline Choreography & Cinema Rig State
  const [activeStoryChapter, setActiveStoryChapter] = useState<StoryChapterNumber>(1);
  const [storyProgress, setStoryProgress] = useState<number>(0.0);
  const [isStoryPlaying, setIsStoryPlaying] = useState<boolean>(false);
  const [autoAdvanceChapters, setAutoAdvanceChapters] = useState<boolean>(true);
  const [cinemaCameraMode, setCinemaCameraMode] =
    useState<CinemaCameraMode>('director_auto');
  const [showMotionGraphics, setShowMotionGraphics] = useState<boolean>(true);

  const [hoverCoord, setHoverCoord] = useState<{
    lat: number;
    lon: number;
    datum: string;
  } | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  const [savedArtifactIds, setSavedArtifactIds] = useState<string[]>([
    'ART-APOLLO11-LM-DS',
    'ART-MERB-OPPORTUNITY',
  ]);

  const selectedBody = useMemo(
    () =>
      CELESTIAL_BODIES.find((b) => b.id === selectedBodyId) || CELESTIAL_BODIES[2],
    [selectedBodyId]
  );

  const selectedArtifact = useMemo(
    () =>
      ARTIFACT_RECORDS.find((a) => a.id === selectedArtifactId) ||
      ARTIFACT_RECORDS[0],
    [selectedArtifactId]
  );

  const liveTelemetry = useMemo(
    () =>
      computeLiveChoreographyTelemetry(
        selectedArtifact,
        activeStoryChapter,
        storyProgress
      ),
    [selectedArtifact, activeStoryChapter, storyProgress]
  );

  const activeMediaAsset = useMemo(
    () =>
      MEDIA_ASSETS.find((m) => m.artifactId === selectedArtifact.id) ||
      MEDIA_ASSETS[0],
    [selectedArtifact.id]
  );
  const chapterDurationSec = activeMediaAsset.durationSec;

  // Advance 12-Chapter 3D Storyline Animation Progress matching EXACT archival video duration
  useEffect(() => {
    if (viewportMode !== 'story_cinema' || !isStoryPlaying || activeWorkspace !== 'none') {
      spaceAudio.stopStoryAudio();
      return;
    }

    // Strict chapter audio mapping in Watch Story Intro:
    // - CH 1 to 4: rocket_space_travel_12s (deep space travel cruise audio)
    // - CH 5: landing_increasing_thruster_ch5 (first 12s part: descent thrusters)
    // - CH 6: landing_increasing_thruster_ch6 (second 12s part: terminal cushion thrusters)
    // - CH 7+: strictly silent
    if (activeStoryChapter < 1 || activeStoryChapter > 6) {
      spaceAudio.stopStoryAudio();
    } else {
      void spaceAudio.startStoryAudio(selectedArtifact.id, storyProgress, undefined, 0.35, activeStoryChapter);
    }

    const tickMs = 50;
    const progressPerTick = (tickMs / 1000) / chapterDurationSec;

    const interval = window.setInterval(() => {
      setStoryProgress((prev) => {
        const next = prev + progressPerTick;
        if (next >= 1.0) {
          if (autoAdvanceChapters) {
            setActiveStoryChapter((ch) => ((ch % 14) + 1) as StoryChapterNumber);
            return 0.0;
          } else {
            setIsStoryPlaying(false);
            return 1.0;
          }
        }
        return next;
      });
    }, tickMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    viewportMode,
    isStoryPlaying,
    activeWorkspace,
    autoAdvanceChapters,
    chapterDurationSec,
    activeStoryChapter,
    selectedArtifact.id,
  ]);

  // Keyboard shortcuts: Escape closes workspace modal or scene options, 'h' toggles Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key === 'Escape') {
        if (activeWorkspace !== 'none') {
          setActiveWorkspace('none');
        } else if (isSceneOptionsOpen) {
          setIsSceneOptionsOpen(false);
        }
      } else if (e.key.toLowerCase() === 'h' && activeWorkspace === 'none') {
        setIsBottomDockCollapsed((prev) => !prev);
      } else if (e.code === 'Space' && viewportMode === 'story_cinema' && activeWorkspace === 'none') {
        e.preventDefault();
        setIsStoryPlaying((prev) => {
          const next = !prev;
          if (!next) {
            spaceAudio.stopStoryAudio();
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWorkspace, isSceneOptionsOpen, viewportMode]);

  const handleSelectBody = (bodyId: CelestialBodyId) => {
    setSelectedSatellite(null);
    setSelectedBodyId(bodyId);
    const firstBodyArtifact = ARTIFACT_RECORDS.find((a) => a.bodyId === bodyId);
    if (firstBodyArtifact) {
      setSelectedArtifactId(firstBodyArtifact.id);
    }
  };

  const handleSelectArtifactFrom3D = (artifactId: string) => {
    const art = ARTIFACT_RECORDS.find((a) => a.id === artifactId);
    if (!art) return;

    // Exploration click is silent; audio is strictly reserved for Watch Story Intro
    setSelectedArtifactId(art.id);
    setSelectedBodyId(art.bodyId);
  };

  const handleToggleSaveArtifact = (artifactId: string) => {
    setSavedArtifactIds((prev) =>
      prev.includes(artifactId)
        ? prev.filter((id) => id !== artifactId)
        : [...prev, artifactId]
    );
  };

  const handleFocusArtifactIn3D = (art: ArtifactRecord, targetMode?: ViewportMode) => {
    setSelectedArtifactId(art.id);
    setSelectedBodyId(art.bodyId);
    if (targetMode) {
      setViewportMode(targetMode);
    } else if (art.bodyId === 'moon') {
      setViewportMode('moon_globe');
    } else if (art.bodyId === 'mars') {
      setViewportMode('mars_globe');
    } else {
      setViewportMode('story_cinema');
    }
    setActiveWorkspace('none');
  };

  const handleLaunchStoryCinema = (chapter: StoryChapterNumber = 1) => {
    setActiveWorkspace('none');
    setIsSceneOptionsOpen(false);
    setActiveStoryChapter(chapter);
    setStoryProgress(0.0);
    setIsStoryPlaying(true);
    setViewportMode('story_cinema');
    void spaceAudio.startStoryAudio(selectedArtifact.id, 0.0, undefined, 0.35, chapter);
  };

  const primaryArtCoord = getPrimaryCoordinate(selectedArtifact);
  const childMoons = NATURAL_SATELLITES_CATALOG.filter(
    (s) => s.parentId === selectedBody.id
  );

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#07090E] text-slate-100 select-none"
      data-state={viewportMode}
    >
      {/* 1. FULL-BLEED THREE.JS 3D SPATIAL ENGINE (100vw x 100vh) */}
      <PlanetaryCanvas3D
        viewportMode={viewportMode}
        celestialBodies={CELESTIAL_BODIES}
        selectedBodyId={selectedBodyId}
        artifacts={ARTIFACT_RECORDS}
        selectedArtifactId={selectedArtifactId}
        geologicalFeatures={GEOLOGICAL_FEATURES}
        layerVisibility={layerVisibility}
        simulationSpeed={simulationSpeed}
        wellDepth={wellDepth}
        explodedFactor={explodedFactor}
        activeStoryChapter={activeStoryChapter}
        storyProgress={storyProgress}
        isStoryPlaying={isStoryPlaying}
        cinemaCameraMode={cinemaCameraMode}
        cameraPresetKey={cameraPresetKey}
        scaleMode={scaleMode}
        selectedSatelliteId={selectedSatelliteId}
        presentationMode={presentationMode}
        cinematicShotPreset={cinematicShotPreset}
        onSelectBody={handleSelectBody}
        onSelectArtifact={handleSelectArtifactFrom3D}
        onSelectSatellite={(sat) => {
          setSelectedSatellite(sat);
          if (sat && sat.id.startsWith('sat-')) {
            setSelectedSatelliteId(sat.id);
          }
          setIsInfoCardHidden(false);
        }}
        onHoverCoordinate={setHoverCoord}
        onHoverObjectLabel={setHoverLabel}
      />

      {/* 2. THE VOICE OF LEFT BEHIND — GUIDED HERITAGE SCROLL EXPERIENCE */}
      {isScrollStoryActive &&
        activeWorkspace === 'none' &&
        viewportMode !== 'story_cinema' &&
        viewportMode !== 'hardware_inspector' && (
          <VoiceOfLeftBehindScrollExperience
            viewportMode={viewportMode}
            selectedBodyId={selectedBodyId}
            selectedArtifactId={selectedArtifactId}
            onSwitchViewportMode={setViewportMode}
            onSelectBody={handleSelectBody}
            onSelectArtifact={handleSelectArtifactFrom3D}
            onOpenWorkspace={setActiveWorkspace}
            onLaunchStoryCinema={handleLaunchStoryCinema}
            onToggleFreeOrbit={() => setIsScrollStoryActive(false)}
            onActiveSectionChange={setActiveStorySection}
          />
        )}

      {/* 3. CLEAN 3-ZONE TOP NAVIGATION BAR (Active in Free 3D Mode or when on Physics Lab) */}
      {(!isScrollStoryActive ||
        activeStorySection === 'lab' ||
        activeWorkspace !== 'none' ||
        viewportMode === 'story_cinema' ||
        viewportMode === 'hardware_inspector') && (
        <header className="relative z-20 flex items-center justify-between gap-8 px-6 h-14 bg-[#07090E]/92 backdrop-blur-md border-b border-slate-800/90">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveWorkspace('none');
              setIsSceneOptionsOpen(false);
              setViewportMode('solar_system');
              setIsScrollStoryActive(true);
            }}
            className="text-lg font-bold tracking-wider text-slate-100 whitespace-nowrap shrink-0 font-display"
          >
            AFTERLIGHT
          </a>

          {/* Zone 2: 5 Clear Navigation Links */}
          <nav
            aria-label="Primary Scientific Workspaces"
            className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300"
          >
            <button
              type="button"
              onClick={() =>
                setActiveWorkspace(
                  activeWorkspace === 'search_catalog' ? 'none' : 'search_catalog'
                )
              }
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeWorkspace === 'search_catalog' ? 'text-cyan-400 underline' : ''
              }`}
            >
              Artifact Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                if (viewportMode === 'story_cinema' && activeWorkspace === 'none') {
                  setActiveWorkspace('storytelling');
                } else {
                  handleLaunchStoryCinema(1);
                }
              }}
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                viewportMode === 'story_cinema' || activeWorkspace === 'storytelling'
                  ? 'text-cyan-400 underline'
                  : ''
              }`}
            >
              Storytelling
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveWorkspace(
                  activeWorkspace === 'timeline_legacy' ? 'none' : 'timeline_legacy'
                )
              }
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeWorkspace === 'timeline_legacy' ? 'text-cyan-400 underline' : ''
              }`}
            >
              Timeline & Graph
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveWorkspace(
                  activeWorkspace === 'media_pipeline' ? 'none' : 'media_pipeline'
                )
              }
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeWorkspace === 'media_pipeline' ? 'text-cyan-400 underline' : ''
              }`}
            >
              Media Lab
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveWorkspace(
                  activeWorkspace === 'education_academy' ? 'none' : 'education_academy'
                )
              }
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeWorkspace === 'education_academy' ? 'text-cyan-400 underline' : ''
              }`}
            >
              Academy
            </button>
          </nav>

          {/* Zone 3: Primary Action + Audio Mute + Return to Story Scroll */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextMute = spaceAudio.toggleMute();
                setIsAudioMuted(nextMute);
              }}
              title={isAudioMuted ? 'Unmute Space Audio' : 'Mute Space Audio'}
              className="p-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded transition-colors flex items-center gap-1.5"
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
              <span className="hidden sm:inline font-mono text-[11px]">
                {isAudioMuted ? 'Muted' : 'Audio'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveWorkspace('none');
                setIsScrollStoryActive(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Story Scroll (Hero · Moon · Mars)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveWorkspace(
                  activeWorkspace === 'artifact_dossier' ? 'none' : 'artifact_dossier'
                )
              }
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              Inspect Dossier
            </button>
          </div>
        </header>
      )}

      {/* Mobile Sub-Navigation Bar (<768px) */}
      {(!isScrollStoryActive ||
        activeStorySection === 'lab' ||
        activeWorkspace !== 'none' ||
        viewportMode === 'story_cinema' ||
        viewportMode === 'hardware_inspector') && (
        <nav
          aria-label="Mobile Scientific Workspaces"
          className="relative z-20 flex md:hidden items-center gap-2 px-4 py-2 bg-[#07090E]/95 border-b border-slate-800 overflow-x-auto text-xs font-medium text-slate-300"
        >
        <button
          type="button"
          onClick={() =>
            setActiveWorkspace(
              activeWorkspace === 'search_catalog' ? 'none' : 'search_catalog'
            )
          }
          className={`px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors ${
            activeWorkspace === 'search_catalog'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          Catalog
        </button>
        <button
          type="button"
          onClick={() => handleLaunchStoryCinema(1)}
          className={`px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors ${
            viewportMode === 'story_cinema'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          12-Chapter Story
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveWorkspace(
              activeWorkspace === 'timeline_legacy' ? 'none' : 'timeline_legacy'
            )
          }
          className={`px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors ${
            activeWorkspace === 'timeline_legacy'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          Timeline
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveWorkspace(
              activeWorkspace === 'media_pipeline' ? 'none' : 'media_pipeline'
            )
          }
          className={`px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors ${
            activeWorkspace === 'media_pipeline'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          Media Lab
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveWorkspace(
              activeWorkspace === 'education_academy' ? 'none' : 'education_academy'
            )
          }
          className={`px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors ${
            activeWorkspace === 'education_academy'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          Academy
        </button>
      </nav>
      )}

      {/* 3A. CLEAN 12-CHAPTER STORY CINEMA HUD (When in `story_cinema` mode) */}
      {activeWorkspace === 'none' && viewportMode === 'story_cinema' && (
        <>
          {showMotionGraphics && (
            <CinematicMotionGraphicsHUD
              artifact={selectedArtifact}
              activeChapter={activeStoryChapter}
              storyProgress={storyProgress}
              cameraMode={cinemaCameraMode}
              telemetry={liveTelemetry}
              onScrubProgress={(p) => {
                setIsStoryPlaying(false);
                setStoryProgress(p);
                spaceAudio.stopStoryAudio();
              }}
            />
          )}
          <StorylineDirectorHUD
            artifact={selectedArtifact}
            allArtifacts={ARTIFACT_RECORDS}
            claims={SCIENTIFIC_CLAIMS}
            sources={SCIENTIFIC_SOURCES}
            activeChapter={activeStoryChapter}
            storyProgress={storyProgress}
            isStoryPlaying={isStoryPlaying}
            autoAdvanceChapters={autoAdvanceChapters}
            cameraMode={cinemaCameraMode}
            showMotionGraphics={showMotionGraphics}
            telemetry={liveTelemetry}
            chapterDurationSec={chapterDurationSec}
            onSelectChapter={(ch) => {
              setActiveStoryChapter(ch);
              setStoryProgress(0.0);
              spaceAudio.stopStoryAudio();
            }}
            onScrubProgress={(p) => {
              setIsStoryPlaying(false);
              setStoryProgress(p);
              spaceAudio.stopStoryAudio();
            }}
            onTogglePlay={() => {
              setIsStoryPlaying((prev) => {
                const next = !prev;
                if (!next) {
                  spaceAudio.stopStoryAudio();
                }
                return next;
              });
            }}
            onToggleAutoAdvance={() => setAutoAdvanceChapters((a) => !a)}
            onChangeCameraMode={setCinemaCameraMode}
            onToggleMotionGraphics={() => setShowMotionGraphics((m) => !m)}
            onSelectArtifact={handleSelectArtifactFrom3D}
            onOpenFullDossierModal={(panel) => setActiveWorkspace(panel)}
            onSwitchViewportMode={setViewportMode}
          />
        </>
      )}

      {/* 3B. CLEAN, COLLAPSIBLE TOP-LEFT TARGET SUMMARY CARD (Solar System / Globe / 3D Spacecraft) */}
      {(!isScrollStoryActive || activeStorySection === 'lab') &&
        activeWorkspace === 'none' &&
        viewportMode !== 'story_cinema' && (
        isInfoCardHidden ? (
          <button
            type="button"
            onClick={() => setIsInfoCardHidden(false)}
            className="fixed top-26 md:top-18 left-4 z-10 px-3.5 py-2 bg-[#0B0E17]/92 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-cyan-300 flex items-center gap-2 shadow-xl pointer-events-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            Show Target Info
          </button>
        ) : (
          <aside
            aria-label="Active Target Scientific Telemetry"
            className="fixed top-26 md:top-18 left-4 z-10 w-[min(365px,92vw)] bg-[#0B0E17]/92 backdrop-blur-md border border-slate-800/90 rounded-lg p-4 space-y-3 pointer-events-auto shadow-2xl"
          >
            {viewportMode === 'solar_system' ? (
              selectedSatellite ? (
                <>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>SATELLITE · {selectedSatellite.parentBody.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSatellite(null)}
                      className="text-slate-400 hover:text-white underline"
                    >
                      ← Back to {selectedSatellite.parentBody}
                    </button>
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-slate-100">
                      {selectedSatellite.name}
                    </h1>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {selectedSatellite.provenanceDataset}
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedSatellite.surfaceCharacteristics}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-xs tabular-nums">
                    <div>
                      <div className="text-[10px] text-slate-400">Radius</div>
                      <div className="font-semibold text-slate-100">
                        {selectedSatellite.meanRadiusKm.toLocaleString()} km
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Orbit Dist</div>
                      <div className="font-semibold text-cyan-300">
                        {selectedSatellite.semimajorAxisKm.toLocaleString()} km
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Period</div>
                      <div className="font-semibold text-amber-400">
                        {selectedSatellite.orbitalPeriodDays} d
                        {selectedSatellite.retrograde ? ' (Retro)' : ''}
                      </div>
                    </div>
                  </div>
                  {selectedSatellite.id.startsWith('sat-') && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSatelliteId(selectedSatellite.id);
                          setViewportMode('satellite_world');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                      >
                        Explore 3D Satellite World
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSatelliteId(selectedSatellite.id);
                          setCinematicShotPreset('PLANET_IN_SKY');
                          setPresentationMode('cinematic');
                          setViewportMode('satellite_world');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors"
                      >
                        {selectedSatellite.parentBody} in Sky
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>
                      {selectedBody.classification.toUpperCase()} · {selectedBody.semiMajorAxisAU} AU
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsInfoCardHidden(true)}
                      title="Hide info card"
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <EyeOff className="w-3 h-3" /> Hide
                    </button>
                  </div>

                  <div>
                    <h1 className="text-base font-bold text-slate-100">
                      {selectedBody.name}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedBody.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {selectedBody.scientificSummary}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-xs tabular-nums">
                    <div>
                      <div className="text-[10px] text-slate-400">Mean Radius</div>
                      <div className="font-semibold text-slate-100">
                        {selectedBody.meanRadiusKm.toLocaleString()} km
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Gravity</div>
                      <div className="font-semibold text-amber-400">
                        {selectedBody.surfaceGravityMS2} m/s²
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Artifacts</div>
                      <div className="font-semibold text-cyan-400">
                        {selectedBody.documentedArtifactCount} sites
                      </div>
                    </div>
                  </div>

                  {childMoons.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                        <span>Natural Moons ({childMoons.length} Worlds)</span>
                        <span className="text-cyan-400">Click to Explore 3D</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {childMoons.map((sat) => (
                          <button
                            key={sat.id}
                            type="button"
                            onClick={() => {
                              setSelectedSatellite(sat);
                              setSelectedSatelliteId(sat.id);
                              setViewportMode('satellite_world');
                            }}
                            className="px-2 py-0.5 text-[11px] font-mono bg-[#07090E] hover:bg-slate-900 text-cyan-300 border border-slate-800 rounded transition-colors"
                          >
                            {sat.name.split(' ')[0]} ({sat.meanRadiusKm} km)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {selectedBody.id === 'moon' && (
                      <button
                        type="button"
                        onClick={() => setViewportMode('moon_globe')}
                        className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                      >
                        Explore Lunar Globe
                      </button>
                    )}
                    {selectedBody.id === 'mars' && (
                      <button
                        type="button"
                        onClick={() => setViewportMode('mars_globe')}
                        className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                      >
                        Explore Martian Globe
                      </button>
                    )}
                    {childMoons.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSatelliteId(childMoons[0].id);
                          setViewportMode('satellite_world');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                      >
                        Explore {childMoons[0].name.split(' ')[0]} 3D
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleLaunchStoryCinema(1)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      12-Chapter Story
                    </button>
                  </div>
                </>
              )
            ) : viewportMode === 'satellite_world' ? (
              <>
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>
                    {activeSatelliteSpec.parentBody.toUpperCase()} SATELLITE WORLD
                    {activeSatelliteSpec.retrograde ? ' · RETROGRADE' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsInfoCardHidden(true)}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" /> Hide
                  </button>
                </div>

                <div>
                  <h1 className="text-base font-bold text-slate-100">
                    {activeSatelliteSpec.name}
                  </h1>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {activeSatelliteSpec.provenanceDataset}
                  </p>
                </div>

                {/* 3 Presentation Modes Switcher (Scientific | Cinematic | Geological) */}
                <div
                  role="group"
                  aria-label="Presentation Experience Mode"
                  className="grid grid-cols-3 gap-1 bg-[#07090E] p-1 rounded border border-slate-800"
                >
                  {(
                    [
                      ['scientific', 'Scientific'],
                      ['cinematic', 'Cinematic'],
                      ['geological', 'Geological'],
                    ] as const
                  ).map(([mId, mLabel]) => (
                    <button
                      key={mId}
                      type="button"
                      data-testid={`pres-mode-${mId}`}
                      onClick={() => setPresentationMode(mId)}
                      className={`py-1 text-[11px] font-semibold rounded transition-colors ${
                        presentationMode === mId
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {mLabel}
                    </button>
                  ))}
                </div>

                {/* 8 Cinematic Camera Shot Presets */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>8-Shot Camera Director</span>
                    <span className="text-amber-300">{cinematicShotPreset.replace('_', ' ')}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {CINEMATIC_SHOT_PRESETS.map((shot) => (
                      <button
                        key={shot.id}
                        type="button"
                        data-testid={`shot-preset-${shot.id}`}
                        onClick={() => {
                          setCinematicShotPreset(shot.id);
                          setCameraPresetKey((k) => k + 1);
                        }}
                        title={shot.description}
                        className={`px-1.5 py-1 text-[10px] font-mono rounded border truncate transition-colors ${
                          cinematicShotPreset === shot.id
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                            : 'bg-[#07090E] hover:bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {shot.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode-Specific Content (Scientific Telemetry vs Cinematic Storytelling vs Geological Formations & Asset Manifest) */}
                {presentationMode === 'geological' ? (
                  <div className="space-y-2 pt-1 border-t border-slate-800 max-h-48 overflow-y-auto pr-1">
                    <div className="text-[10px] font-mono uppercase text-cyan-400">
                      Named Geological Formations ({activeSatelliteSpec.namedFormations.length})
                    </div>
                    {activeSatelliteSpec.namedFormations.map((form) => (
                      <div
                        key={form.id}
                        className="p-2 bg-[#07090E] border border-slate-800/90 rounded text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-semibold text-amber-300">{form.name}</span>
                          <span className="text-slate-400">Ø {form.diameterKm} km</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {form.description}
                        </p>
                      </div>
                    ))}
                    <div className="p-2 bg-[#07090E] border border-slate-800 rounded font-mono text-[10px] space-y-1 text-slate-300">
                      <div className="text-emerald-400 font-semibold">
                        ASSET MANIFEST · {activeSatelliteSpec.assetManifest.scientificConfidence}
                      </div>
                      <div>Source: {activeSatelliteSpec.assetManifest.datasetSource}</div>
                      <div>Resolution: {activeSatelliteSpec.assetManifest.datasetResolution}</div>
                      <div>Elevation: {activeSatelliteSpec.assetManifest.elevationScale}</div>
                      <div className="text-amber-300/90">
                        Coverage Note: {activeSatelliteSpec.assetManifest.missingDataRegions}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {presentationMode === 'cinematic'
                        ? activeSatelliteSpec.cinematicStorytellingSummary
                        : activeSatelliteSpec.surfaceCharacteristics}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-xs tabular-nums">
                      <div>
                        <div className="text-[10px] text-slate-400">Mean Radius</div>
                        <div className="font-semibold text-slate-100">
                          {activeSatelliteSpec.meanRadiusKm.toLocaleString()} km
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Orbit Dist</div>
                        <div className="font-semibold text-cyan-300">
                          {activeSatelliteSpec.semimajorAxisKm.toLocaleString()} km
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Gravity</div>
                        <div className="font-semibold text-amber-400">
                          {activeSatelliteSpec.surfaceGravityMS2} m/s²
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {hoverCoord && (
                  <div className="text-[11px] font-mono text-amber-300 tabular-nums">
                    Cursor: {formatCoordinate(hoverCoord.lat, hoverCoord.lon, 3)}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">{selectedArtifact.nssdcaId}</span>
                  <button
                    type="button"
                    onClick={() => setIsInfoCardHidden(true)}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" /> Hide
                  </button>
                </div>

                <div>
                  <h1 className="text-base font-bold text-slate-100">
                    {selectedArtifact.name}
                  </h1>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedArtifact.regionName} ·{' '}
                    <span className="text-emerald-400">
                      {selectedArtifact.operationalStatus}
                    </span>
                  </div>
                </div>

                {primaryArtCoord && (
                  <div className="p-2.5 bg-[#07090E] border border-slate-800 rounded font-mono text-xs space-y-1 tabular-nums">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{primaryArtCoord.typeLabel}</span>
                      <span
                        className={
                          primaryArtCoord.record.verification === 'VERIFIED'
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        ● {primaryArtCoord.record.verification} (±
                        {primaryArtCoord.record.confidenceRadiusM}m)
                      </span>
                    </div>
                    <div className="text-cyan-300 font-semibold">
                      {formatCoordinate(
                        primaryArtCoord.record.lat,
                        primaryArtCoord.record.lon
                      )}
                    </div>
                  </div>
                )}

                {hoverCoord && (
                  <div className="text-[11px] font-mono text-amber-300 tabular-nums">
                    Cursor: {formatCoordinate(hoverCoord.lat, hoverCoord.lon, 3)}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleLaunchStoryCinema(1)}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    12-Chapter Story
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveWorkspace('artifact_dossier')}
                    className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                  >
                    Open Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => spaceAudio.playLandingSequence()}
                    title="Play Full 7.05s Landing Sequence: Increasing Thrusters (3.8s) → Touchdown Contact (0.65s) → Pressure Release (2.6s)"
                    className="px-2.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Landing Audio (7.0s)
                  </button>
                </div>
              </>
            )}

            {hoverLabel && (
              <div className="pt-2 border-t border-slate-800 text-xs font-mono text-cyan-300 truncate">
                {hoverLabel}
              </div>
            )}
          </aside>
        )
      )}

      {/* 4. ACTIVE WORKSPACE MODALS */}
      {(activeWorkspace === 'artifact_dossier' ||
        activeWorkspace === 'storytelling') && (
        <ArtifactAndStoryModal
          activePanel={activeWorkspace}
          artifact={selectedArtifact}
          allArtifacts={ARTIFACT_RECORDS}
          claims={SCIENTIFIC_CLAIMS}
          sources={SCIENTIFIC_SOURCES}
          savedArtifactIds={savedArtifactIds}
          onSwitchPanel={setActiveWorkspace}
          onSelectArtifact={(id) => {
            const found = ARTIFACT_RECORDS.find((a) => a.id === id);
            if (found) {
              setSelectedArtifactId(found.id);
              setSelectedBodyId(found.bodyId);
            }
          }}
          onToggleSaveArtifact={handleToggleSaveArtifact}
          onInspect3DHardware={(id, mode) => {
            setSelectedArtifactId(id);
            setViewportMode(mode);
            setActiveWorkspace('none');
          }}
          onClose={() => setActiveWorkspace('none')}
        />
      )}

      {(activeWorkspace === 'search_catalog' ||
        activeWorkspace === 'timeline_legacy' ||
        activeWorkspace === 'media_pipeline' ||
        activeWorkspace === 'education_academy' ||
        activeWorkspace === 'data_provenance') && (
        <ScientificWorkspacesModal
          activePanel={activeWorkspace}
          artifacts={ARTIFACT_RECORDS}
          claims={SCIENTIFIC_CLAIMS}
          sources={SCIENTIFIC_SOURCES}
          events={MISSION_EVENTS}
          legacyNodes={LEGACY_NODES}
          legacyEdges={LEGACY_EDGES}
          mediaAssets={MEDIA_ASSETS}
          challenges={EDUCATIONAL_CHALLENGES}
          connectors={DATA_CONNECTOR_STATUSES}
          savedArtifactIds={savedArtifactIds}
          onSwitchPanel={setActiveWorkspace}
          onSelectArtifactAndOpenDossier={(id) => {
            const found = ARTIFACT_RECORDS.find((a) => a.id === id);
            if (found) {
              setSelectedArtifactId(found.id);
              setSelectedBodyId(found.bodyId);
              setActiveWorkspace('artifact_dossier');
            }
          }}
          onFocusArtifactIn3D={handleFocusArtifactIn3D}
          onToggleSaveArtifact={handleToggleSaveArtifact}
          onClose={() => setActiveWorkspace('none')}
        />
      )}

      {/* 5. STREAMLINED, EASY-TO-USE BOTTOM NAVIGATION DOCK (Active in Free 3D Mode or on Physics Lab) */}
      {(!isScrollStoryActive || activeStorySection === 'lab') && activeWorkspace === 'none' && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-max max-w-[96vw] flex flex-col items-center pointer-events-none">
          {/* Scene Options Popover (Only opens when user clicks "Scene Options") */}
          {!isBottomDockCollapsed && isSceneOptionsOpen && (
            <div className="mb-2 w-[min(480px,94vw)] bg-[#0B0E17]/96 backdrop-blur-md border border-slate-800 rounded-lg p-4 shadow-2xl pointer-events-auto space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  3D Scene & Physics Settings
                </span>
                <button
                  type="button"
                  onClick={() => setIsSceneOptionsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Gravity Well Depth Slider */}
              {viewportMode !== 'hardware_inspector' && (
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="well-depth-slider"
                    className="text-xs text-slate-300 font-medium"
                  >
                    Spacetime Gravity Well Depth
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="well-depth-slider"
                      type="range"
                      min={0}
                      max={2}
                      step={0.05}
                      value={wellDepth}
                      onChange={(e) => setWellDepth(parseFloat(e.target.value))}
                      className="w-28 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-amber-400 w-10 text-right tabular-nums">
                      {Math.round(wellDepth * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Explode Assembly Slider (When in 3D Hardware mode) */}
              {viewportMode === 'hardware_inspector' && (
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="exploded-view-slider"
                    className="text-xs text-slate-300 font-medium"
                  >
                    Explode Spacecraft Sub-Assemblies
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="exploded-view-slider"
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={explodedFactor}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setExplodedFactor(val);
                      }}
                      className="w-28 accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-cyan-400 w-10 text-right tabular-nums">
                      {Math.round(explodedFactor * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Scale Mode & Orbit Speed (When in Solar System mode) */}
              {viewportMode === 'solar_system' && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300 font-medium">
                    Astronomical Scale & Orbit Speed
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setScaleMode((m) =>
                          m === 'scientific_exploration'
                            ? 'scientific_scale'
                            : 'scientific_exploration'
                        )
                      }
                      className={`px-2.5 py-1 text-xs font-mono border rounded transition-colors ${
                        scaleMode === 'scientific_scale'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                          : 'bg-[#07090E] text-slate-300 border-slate-800'
                      }`}
                    >
                      {scaleMode === 'scientific_scale'
                        ? '1:1 True Scale'
                        : 'Exploration Scale'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSimulationSpeed((s) => (s === 0 ? 1 : s === 1 ? 3 : 0))
                      }
                      className="px-2.5 py-1 text-xs font-mono bg-[#07090E] text-slate-300 border border-slate-800 rounded tabular-nums"
                    >
                      Speed: {simulationSpeed}×
                    </button>
                  </div>
                </div>
              )}

              {/* Map Layer Toggles */}
              <div className="pt-1 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[11px] text-slate-400 font-medium">
                  Visible 3D Overlays
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      ['showArtifacts', 'Spacecraft'],
                      ['showTraverses', 'Traverses'],
                      ['showGeology', 'Geology'],
                      ['showGraticule', 'Coord Grid'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setLayerVisibility((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                        layerVisibility[key]
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#07090E] border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PDS Provenance Audit */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  NASA PDS / LROC / JPL Horizons Data Audit
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSceneOptionsOpen(false);
                    setActiveWorkspace('data_provenance');
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded border flex items-center gap-1 bg-[#07090E] hover:bg-slate-900 text-emerald-400 border-slate-800"
                >
                  <Database className="w-3 h-3" />
                  Open PDS Audit
                </button>
              </div>
            </div>
          )}

          {/* Main Compact Dock Bar */}
          {isBottomDockCollapsed ? (
            <button
              type="button"
              onClick={() => setIsBottomDockCollapsed(false)}
              className="px-4 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-[#0B0E17]/95 border border-slate-800 rounded-full flex items-center gap-1.5 pointer-events-auto shadow-xl"
            >
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              Show Navigation Bar (H)
            </button>
          ) : (
            <div className="w-full bg-[#0B0E17]/94 backdrop-blur-md border border-slate-800/90 rounded-lg px-3 py-2 shadow-2xl pointer-events-auto flex flex-wrap items-center justify-center gap-2.5">
              {/* 1. Clean 6-Mode View Switcher */}
              <div
                role="group"
                aria-label="3D Viewport Mode"
                className="flex flex-wrap items-center bg-[#07090E] p-1 rounded-md border border-slate-800/90 gap-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsScrollStoryActive(true);
                    setViewportMode('solar_system');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40"
                  title="Switch back to Guided Heritage Story Scroll"
                >
                  ✦ Story Scroll
                </button>
                {(
                  [
                    ['solar_system', 'Solar System'],
                    ['satellite_world', 'Satellite Worlds (22)'],
                    ['moon_globe', 'Moon Globe'],
                    ['mars_globe', 'Mars Globe'],
                    ['story_cinema', 'Story Cinema'],
                    ['hardware_inspector', '3D Hardware'],
                  ] as const
                ).map(([modeId, label]) => (
                  <button
                    key={modeId}
                    type="button"
                    data-testid={`dock-mode-${modeId}`}
                    onClick={() => {
                      setViewportMode(modeId);
                      setIsSceneOptionsOpen(false);
                      if (modeId === 'moon_globe') {
                        handleSelectBody('moon');
                      } else if (modeId === 'mars_globe') {
                        handleSelectBody('mars');
                      } else if (modeId === 'solar_system') {
                        handleSelectBody('sun');
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      viewportMode === modeId
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 2. Target Selector Dropdown */}
              <div className="flex items-center gap-1.5">
                {viewportMode === 'solar_system' ? (
                  <>
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <select
                      aria-label="Select Celestial Body"
                      value={selectedBodyId}
                      onChange={(e) => handleSelectBody(e.target.value as CelestialBodyId)}
                      className="px-2.5 py-1 text-xs bg-[#07090E] border border-slate-800 rounded text-slate-100 font-medium cursor-pointer"
                    >
                      {CELESTIAL_BODIES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : viewportMode === 'satellite_world' ? (
                  <>
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <select
                      aria-label="Select Natural Satellite World"
                      data-testid="select-satellite-world"
                      value={selectedSatelliteId}
                      onChange={(e) => setSelectedSatelliteId(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-[#07090E] border border-slate-800 rounded text-slate-100 font-medium max-w-[210px] truncate cursor-pointer"
                    >
                      {NATURAL_SATELLITES_CATALOG.map((sat) => (
                        <option key={sat.id} value={sat.id}>
                          {sat.parentBody}: {sat.name} ({sat.meanRadiusKm} km)
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <select
                      aria-label="Select Planetary Artifact"
                      value={selectedArtifactId}
                      onChange={(e) => handleSelectArtifactFrom3D(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-[#07090E] border border-slate-800 rounded text-slate-100 font-medium max-w-[185px] truncate cursor-pointer"
                    >
                      {ARTIFACT_RECORDS.filter((a) =>
                        viewportMode === 'moon_globe'
                          ? a.bodyId === 'moon'
                          : viewportMode === 'mars_globe'
                          ? a.bodyId === 'mars'
                          : true
                      ).map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {/* 3. Scene Options Popover Button + Reset Cam + Hide Dock */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-testid="btn-toggle-scene-options"
                  onClick={() => setIsSceneOptionsOpen((prev) => !prev)}
                  className={`px-2.5 py-1 text-xs font-medium rounded border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isSceneOptionsOpen
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-[#07090E] hover:bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Scene Options
                </button>

                <button
                  type="button"
                  onClick={() => setCameraPresetKey((k) => k + 1)}
                  title="Reset 3D Camera View"
                  className="px-2.5 py-1 text-xs font-medium bg-[#07090E] hover:bg-slate-900 text-slate-300 border border-slate-800 rounded flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSceneOptionsOpen(false);
                    setIsBottomDockCollapsed(true);
                  }}
                  title="Hide bottom bar (Press H)"
                  className="p-1.5 bg-[#07090E] hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
