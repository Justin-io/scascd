import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Database,
  Film,
  Filter,
  GitBranch,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  Volume2,
  X,
} from 'lucide-react';
import {
  ArtifactCategory,
  ArtifactRecord,
  CelestialBodyId,
  DataConnectorStatus,
  EducationalChallenge,
  LegacyEdge,
  LegacyNode,
  MediaAsset,
  MediaJobRecord,
  MissionEvent,
  OperationalStatus,
  ScientificClaim,
  ScientificSource,
  ViewportMode,
  WorkspacePanel,
} from '../types/afterlight';
import {
  evaluateEducationalSubmission,
  formatCoordinate,
  getPrimaryCoordinate,
  searchAndFilterArtifacts,
  validateScientificDataset,
} from '../utils/scientificEngine';

interface ScientificWorkspacesModalProps {
  activePanel:
    | 'search_catalog'
    | 'timeline_legacy'
    | 'media_pipeline'
    | 'education_academy'
    | 'data_provenance';
  artifacts: ArtifactRecord[];
  claims: ScientificClaim[];
  sources: ScientificSource[];
  events: MissionEvent[];
  legacyNodes: LegacyNode[];
  legacyEdges: LegacyEdge[];
  mediaAssets: MediaAsset[];
  challenges: EducationalChallenge[];
  connectors: DataConnectorStatus[];
  savedArtifactIds: string[];
  onSwitchPanel: (panel: WorkspacePanel) => void;
  onSelectArtifactAndOpenDossier: (artifactId: string) => void;
  onFocusArtifactIn3D: (artifact: ArtifactRecord, mode?: ViewportMode) => void;
  onToggleSaveArtifact: (artifactId: string) => void;
  onClose: () => void;
}

export const ScientificWorkspacesModal: React.FC<ScientificWorkspacesModalProps> = ({
  activePanel,
  artifacts,
  claims,
  sources,
  events,
  legacyNodes,
  legacyEdges,
  mediaAssets,
  challenges,
  connectors,
  savedArtifactIds,
  onSwitchPanel,
  onSelectArtifactAndOpenDossier,
  onFocusArtifactIn3D,
  onToggleSaveArtifact,
  onClose,
}) => {
  // --- PHASE 09 SEARCH & DISCOVERY STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBody, setFilterBody] = useState<CelestialBodyId | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ArtifactCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<OperationalStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'name_asc' | 'mass_desc'>('date_asc');
  const [onlySavedExpedition, setOnlySavedExpedition] = useState(false);

  const filteredArtifacts = useMemo(() => {
    const base = searchAndFilterArtifacts(artifacts, {
      query: searchQuery,
      bodyId: filterBody,
      category: filterCategory,
      status: filterStatus,
      sortBy,
    });
    if (onlySavedExpedition) {
      return base.filter((a) => savedArtifactIds.includes(a.id));
    }
    return base;
  }, [artifacts, searchQuery, filterBody, filterCategory, filterStatus, sortBy, onlySavedExpedition, savedArtifactIds]);

  // --- PHASE 08 TIMELINE & LEGACY GRAPH STATE ---
  const [timelineBodyFilter, setTimelineBodyFilter] = useState<CelestialBodyId | 'all'>('all');
  const [timelineEventTypeFilter, setTimelineEventTypeFilter] = useState<string>('all');
  const [selectedLegacyChain, setSelectedLegacyChain] = useState<'moon' | 'mars'>('moon');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>(legacyEdges[0]?.id || 'LE-01');

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        if (timelineBodyFilter !== 'all' && e.bodyId !== timelineBodyFilter) return false;
        if (timelineEventTypeFilter !== 'all' && e.eventType !== timelineEventTypeFilter) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, timelineBodyFilter, timelineEventTypeFilter]);

  // --- PHASE 06 FFMPEG MEDIA PIPELINE STATE ---
  const [selectedMediaId, setSelectedMediaId] = useState<string>(mediaAssets[0]?.id || 'MED-A11-DESCENT');
  const [mediaJobs, setMediaJobs] = useState<MediaJobRecord[]>([]);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const selectedMedia = useMemo(
    () => mediaAssets.find((m) => m.id === selectedMediaId) || mediaAssets[0],
    [mediaAssets, selectedMediaId]
  );

  const handleRunMediaOperation = async (
    operation:
      | 'ffprobe_inspect'
      | 'extract_thumbnail'
      | 'transcode_h264'
      | 'generate_contact_sheet'
      | 'normalize_audio'
  ) => {
    setIsProcessingMedia(true);
    setMediaError(null);
    try {
      const response = await fetch('/api/media/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: selectedMedia.id,
          operation,
        }),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${response.status}`);
      }
      const job: MediaJobRecord = await response.json();
      setMediaJobs((prev) => [job, ...prev]);
    } catch (err: any) {
      setMediaError(err.message || 'Media pipeline request failed');
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const handlePlaySynthesizedTelemetryTone = () => {
    setIsPlayingPreview(true);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = selectedMedia.mediaType === 'audio' ? 'sine' : 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(selectedMedia.mediaType === 'audio' ? 2400 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(
        selectedMedia.mediaType === 'audio' ? 3100 : 880,
        now + 1.2
      );
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
      setTimeout(() => setIsPlayingPreview(false), 1300);
    } catch {
      setTimeout(() => setIsPlayingPreview(false), 1000);
    }
  };

  // --- PHASE 10 EDUCATIONAL ACADEMY STATE ---
  const [eduDifficulty, setEduDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeChallenges = useMemo(() => {
    if (eduDifficulty === 'All') return challenges;
    return challenges.filter((c) => c.difficulty === eduDifficulty);
  }, [challenges, eduDifficulty]);

  const quizEvaluation = useMemo(
    () => evaluateEducationalSubmission(activeChallenges, selectedAnswers),
    [activeChallenges, selectedAnswers]
  );

  // --- PHASE 05 SCIENTIFIC VALIDATION REPORT ---
  const [validationRunCount, setValidationRunCount] = useState(1);
  const validationReport = useMemo(
    () => validateScientificDataset(artifacts, claims, sources, events),
    [artifacts, claims, sources, events, validationRunCount]
  );

  const panelMeta: Record<
    ScientificWorkspacesModalProps['activePanel'],
    { title: string; subtitle: string }
  > = {
    search_catalog: {
      title: 'Unified Planetary Artifact Search & Discovery Catalog',
      subtitle: 'Filter verified spacecraft hardware by celestial body, category, operational status, or instrument findings',
    },
    timeline_legacy: {
      title: 'Chronological Mission Timeline & Scientific Legacy Graph',
      subtitle: 'Trace verified mission milestones and evidence-backed causal relationships across decades of exploration',
    },
    media_pipeline: {
      title: 'FFmpeg & FFprobe Media Intelligence Pipeline',
      subtitle: 'Controlled subprocess stream inspection, H.264 transcoding, contact sheet generation, and audio normalization',
    },
    education_academy: {
      title: 'Space Archaeology Educational Academy',
      subtitle: 'Interactive artifact identification, instrument matching, and evidence challenges derived from NASA archives',
    },
    data_provenance: {
      title: 'Scientific Data Ingestion & Epistemic Validation Console',
      subtitle: 'Live connector telemetry for NASA PDS, LROC, NSSDC, and JPL Horizons with automated provenance verification',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-modal-title"
      className="fixed inset-x-0 top-24 md:top-16 bottom-4 z-30 flex items-center justify-center px-3 md:px-4 pointer-events-none"
    >
      <div className="w-full max-w-[1220px] h-full max-h-[820px] bg-[#0B0E17] border border-slate-800 rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#07090E] border-b border-slate-800">
          <div>
            <h2
              id="workspace-modal-title"
              className="text-lg md:text-xl font-bold text-slate-100 tracking-tight"
            >
              {panelMeta[activePanel].title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {panelMeta[activePanel].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Workspace Quick Switcher */}
            <div className="hidden xl:flex items-center bg-slate-900 p-1 rounded-md border border-slate-800 gap-1">
              {(
                [
                  ['search_catalog', 'Catalog'],
                  ['timeline_legacy', 'Timeline & Graph'],
                  ['media_pipeline', 'FFmpeg Lab'],
                  ['education_academy', 'Academy'],
                  ['data_provenance', 'Data Audit'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSwitchPanel(id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    activePanel === id
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Workspace"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 1. PHASE 09: SEARCH & DISCOVERY CATALOG */}
          {activePanel === 'search_catalog' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-[#07090E] border border-slate-800 rounded-md">
                <div className="md:col-span-4 relative">
                  <label htmlFor="artifact-search-input" className="sr-only">
                    Search artifacts, missions, instruments, or discoveries
                  </label>
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="artifact-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artifact, mission, instrument, mineral (e.g. jarosite)..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="filter-body-select" className="sr-only">
                    Filter by Celestial Body
                  </label>
                  <select
                    id="filter-body-select"
                    value={filterBody}
                    onChange={(e) => setFilterBody(e.target.value as CelestialBodyId | 'all')}
                    className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="all">All Bodies ({artifacts.length})</option>
                    <option value="moon">The Moon (Luna)</option>
                    <option value="mars">Mars</option>
                    <option value="saturn">Saturn & Titan</option>
                    <option value="neptune">Heliopause / Interstellar</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="filter-category-select" className="sr-only">
                    Filter by Category
                  </label>
                  <select
                    id="filter-category-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as ArtifactCategory | 'all')}
                    className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="all">All Categories</option>
                    <option value="Rover">Rover</option>
                    <option value="Lander">Lander</option>
                    <option value="Descent stage">Descent stage</option>
                    <option value="Probe">Probe</option>
                    <option value="Spacecraft">Spacecraft</option>
                    <option value="Impacted hardware">Impacted hardware</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="filter-status-select" className="sr-only">
                    Filter by Operational Status
                  </label>
                  <select
                    id="filter-status-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as OperationalStatus | 'all')}
                    className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200"
                  >
                    <option value="all">All Operational Statuses</option>
                    <option value="Operational">Operational</option>
                    <option value="Extended mission">Extended mission</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Retired">Retired</option>
                    <option value="Impacted">Impacted</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOnlySavedExpedition((prev) => !prev)}
                    className={`w-full px-3 py-2 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                      onlySavedExpedition
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Saved List ({savedArtifactIds.length})
                  </button>
                </div>
              </div>

              {/* Results Count & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="font-mono tabular-nums">
                  Showing {filteredArtifacts.length} of {artifacts.length} documented planetary artifacts
                </div>
                <div className="flex items-center gap-2">
                  <span>Sort by:</span>
                  {(
                    [
                      ['date_asc', 'Chronological (Oldest)'],
                      ['date_desc', 'Chronological (Newest)'],
                      ['mass_desc', 'Dry Mass (kg)'],
                      ['name_asc', 'Alphabetical'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSortBy(key)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        sortBy === key
                          ? 'bg-slate-800 text-cyan-300 font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Grid */}
              {filteredArtifacts.length === 0 ? (
                <div className="p-12 text-center bg-[#07090E] border border-slate-800 rounded-md space-y-3">
                  <Filter className="w-6 h-6 text-slate-500 mx-auto" />
                  <div className="text-sm font-medium text-slate-200">
                    No planetary artifacts match the current filter combination
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterBody('all');
                      setFilterCategory('all');
                      setFilterStatus('all');
                      setOnlySavedExpedition(false);
                    }}
                    className="px-4 py-2 text-xs font-medium bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArtifacts.map((art) => {
                    const primaryCoord = getPrimaryCoordinate(art);
                    const isSaved = savedArtifactIds.includes(art.id);
                    return (
                      <div
                        key={art.id}
                        className="p-5 bg-[#07090E] border border-slate-800 hover:border-slate-700 rounded-md flex flex-col justify-between space-y-4 transition-colors"
                      >
                        <div className="space-y-1.5">
                          {/* Clean unboxed inline metadata with · separators (Zero-Pill Discipline) */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400 tabular-nums">
                            <span>{art.bodyId.toUpperCase()}</span>
                            <span aria-hidden="true">·</span>
                            <span>{art.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{art.landingOrArrivalDate}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                art.operationalStatus === 'Operational' ||
                                art.operationalStatus === 'Extended mission'
                                  ? 'text-emerald-400'
                                  : art.operationalStatus === 'Impacted'
                                  ? 'text-amber-400'
                                  : 'text-cyan-400'
                              }
                            >
                              {art.operationalStatus}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-100">
                            {art.name}
                          </h3>

                          <div className="text-xs text-slate-400 font-mono">
                            {art.regionName} · NSSDCA {art.nssdcaId} · {art.massDryKg} kg
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed pt-1">
                            {art.originalPurpose}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs font-mono text-slate-400 tabular-nums">
                            {primaryCoord ? (
                              <span>
                                {formatCoordinate(primaryCoord.record.lat, primaryCoord.record.lon, 3)} (
                                {primaryCoord.record.verification})
                              </span>
                            ) : (
                              <span>Heliocentric: {art.coordinates.heliocentricPosition?.distanceAU} AU</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleSaveArtifact(art.id)}
                              className="px-2.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition-colors"
                            >
                              {isSaved ? 'Saved ★' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onFocusArtifactIn3D(art)}
                              className="px-2.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded transition-colors"
                            >
                              Locate in 3D
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectArtifactAndOpenDossier(art.id)}
                              className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                            >
                              Inspect Dossier
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. PHASE 08: MISSION TIMELINE & SCIENTIFIC LEGACY GRAPH */}
          {activePanel === 'timeline_legacy' && (
            <div className="space-y-8">
              {/* Interactive Scientific Legacy Graph Section */}
              <div className="p-5 bg-[#07090E] border border-slate-800 rounded-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      01. Evidence-Backed Scientific Legacy Graph
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mission → Artifact → Instrument → Observation → Discovery → Later Mission (Every edge requires verified historical documentation).
                    </p>
                  </div>

                  <div className="flex items-center bg-slate-900 p-1 rounded border border-slate-800 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLegacyChain('moon');
                        setSelectedEdgeId('LE-01');
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        selectedLegacyChain === 'moon'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Lunar Lineage (Surveyor 3 → Apollo)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLegacyChain('mars');
                        setSelectedEdgeId('LE-06');
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        selectedLegacyChain === 'mars'
                          ? 'bg-cyan-500 text-slate-950 font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Martian Lineage (Opportunity → Perseverance)
                    </button>
                  </div>
                </div>

                {/* 6-Stage Causal Chain Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
                  {legacyNodes
                    .filter((n) => n.bodyId === selectedLegacyChain)
                    .map((node, idx, arr) => {
                      const outgoingEdge = legacyEdges.find((e) => e.fromId === node.id);
                      const isEdgeActive = outgoingEdge && outgoingEdge.id === selectedEdgeId;
                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            if (outgoingEdge) setSelectedEdgeId(outgoingEdge.id);
                          }}
                          className={`p-3.5 rounded-md border cursor-pointer transition-colors flex flex-col justify-between ${
                            isEdgeActive
                              ? 'bg-slate-900 border-cyan-500'
                              : 'bg-[#0B0E17] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-[11px] font-mono text-cyan-400 uppercase">
                              0{idx + 1}. {node.type} ({node.year})
                            </div>
                            <div className="text-xs font-bold text-slate-100 mt-1">
                              {node.label}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{node.sublabel}</div>
                          </div>
                          {idx < arr.length - 1 && outgoingEdge && (
                            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
                              → {outgoingEdge.relationship}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Selected Edge Historical Evidence Inspector */}
                {(() => {
                  const edge =
                    legacyEdges.find((e) => e.id === selectedEdgeId) || legacyEdges[0];
                  const fromNode = legacyNodes.find((n) => n.id === edge.fromId);
                  const toNode = legacyNodes.find((n) => n.id === edge.toId);
                  return (
                    <div className="p-4 bg-[#0B0E17] border border-slate-800 rounded-md flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-cyan-400">
                          Verified Relationship: {fromNode?.label} → [{edge.relationship}] → {toNode?.label}
                        </div>
                        <p className="text-xs text-slate-200">{edge.historicalBasis}</p>
                      </div>
                      <div className="text-xs font-mono text-emerald-400 shrink-0">
                        Supporting Claim: [{edge.evidenceClaimId}]
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Chronological Mission Events Timeline */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      02. Chronological Exploration Timeline (1967 – Present)
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label="Filter Timeline by Planet"
                      value={timelineBodyFilter}
                      onChange={(e) => setTimelineBodyFilter(e.target.value as CelestialBodyId | 'all')}
                      className="px-2.5 py-1.5 text-xs bg-[#07090E] border border-slate-800 rounded text-slate-200"
                    >
                      <option value="all">All Celestial Bodies</option>
                      <option value="moon">The Moon</option>
                      <option value="mars">Mars</option>
                      <option value="saturn">Saturn / Titan</option>
                      <option value="neptune">Heliopause</option>
                    </select>

                    <select
                      aria-label="Filter Timeline by Event Type"
                      value={timelineEventTypeFilter}
                      onChange={(e) => setTimelineEventTypeFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-[#07090E] border border-slate-800 rounded text-slate-200"
                    >
                      <option value="all">All Event Types</option>
                      <option value="Landing">Landing</option>
                      <option value="Discovery">Discovery</option>
                      <option value="Milestone">Milestone</option>
                      <option value="Observation">Observation</option>
                      <option value="Last Communication">Last Communication</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-[#07090E] border border-slate-800 rounded-md flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                          <span className="text-cyan-400 font-semibold">{evt.date}</span>
                          <span>
                            {evt.bodyId.toUpperCase()} · {evt.eventType} · [{evt.claimId}]
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">{evt.title}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onSelectArtifactAndOpenDossier(evt.artifactId)}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Open Artifact Dossier →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. PHASE 06: FFMPEG MEDIA INTELLIGENCE PIPELINE */}
          {activePanel === 'media_pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Asset Selection & Mission Footage / Audio Player */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono text-slate-400 uppercase">
                  01. Select Archival NASA Media Stream
                </div>
                <div className="space-y-2">
                  {mediaAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setSelectedMediaId(asset.id)}
                      className={`w-full p-3.5 text-left rounded-md border transition-colors ${
                        selectedMedia.id === asset.id
                          ? 'bg-slate-900 border-cyan-500 text-slate-100'
                          : 'bg-[#07090E] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                        <span>NASA ID: {asset.nasaId}</span>
                        <span>
                          {asset.format} · {asset.durationSec}s
                        </span>
                      </div>
                      <div className="text-sm font-semibold mt-1">{asset.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        Codec: {asset.videoCodec !== 'none' ? asset.videoCodec : asset.audioCodec}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Interactive Telemetry Media Player & Caption Monitor */}
                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      Mission Telemetry Playback Monitor
                    </span>
                    <span className="tabular-nums">{selectedMedia.resolution}</span>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400">
                        ● STREAM READY ({selectedMedia.fileKey})
                      </span>
                      <button
                        type="button"
                        onClick={handlePlaySynthesizedTelemetryTone}
                        className="px-3 py-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded flex items-center gap-1.5 transition-colors"
                      >
                        {isPlayingPreview ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            Playing Stream...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            Audition Telemetry Stream
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedMedia.description}
                    </p>

                    <div className="p-2.5 bg-[#07090E] border border-slate-800 rounded text-xs font-mono text-amber-300">
                      [CAPTIONS]: {selectedMedia.transcriptCaption}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Backend FFmpeg / FFprobe Subprocess Controller & Output Log */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        02. Execute Controlled FFmpeg / FFprobe Backend Job
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Executes via argument-array subprocess isolation in managed directory without modifying original NASA source files.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(
                      [
                        ['ffprobe_inspect', '1. Inspect Streams (ffprobe JSON)'],
                        ['extract_thumbnail', '2. Extract Keyframe Thumbnail'],
                        ['generate_contact_sheet', '3. Generate 2×2 Contact Sheet'],
                        ['transcode_h264', '4. Transcode H.264 MP4 (CRF 23)'],
                        ['normalize_audio', '5. EBU R128 Audio Loudnorm'],
                      ] as const
                    ).map(([op, label]) => (
                      <button
                        key={op}
                        type="button"
                        disabled={isProcessingMedia}
                        onClick={() => handleRunMediaOperation(op)}
                        className="px-3 py-2 text-xs font-mono bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-cyan-300 border border-slate-700 rounded transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {mediaError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded text-xs text-rose-300 font-mono">
                      Pipeline Error: {mediaError}
                    </div>
                  )}
                </div>

                {/* Job Execution Output Log */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    03. Subprocess Job Telemetry & Stream Inspection Output ({mediaJobs.length} runs)
                  </div>

                  {mediaJobs.length === 0 ? (
                    <div className="p-8 bg-[#07090E] border border-slate-800 rounded-md text-center space-y-2">
                      <Terminal className="w-6 h-6 text-slate-500 mx-auto" />
                      <div className="text-xs text-slate-300">
                        Select any FFprobe or FFmpeg operation above to inspect stream headers, extract contact sheets, or transcode archival footage.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mediaJobs.map((job) => (
                        <div
                          key={job.jobId}
                          className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-2.5 font-mono text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <span className="text-cyan-400 font-semibold">
                              Job {job.jobId} · {job.operation}
                            </span>
                            <span className="text-emerald-400 tabular-nums">
                              ● {job.status.toUpperCase()} ({job.durationMs} ms)
                            </span>
                          </div>

                          <div className="text-slate-400 break-all">
                            $ {job.commandArgs.join(' ')}
                          </div>

                          <div className="text-slate-200 font-sans">
                            {job.outputSummary}
                          </div>

                          {job.probeData && (
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1 text-[11px] text-slate-300 tabular-nums">
                              <div>
                                Format: {job.probeData.formatName} · Duration: {job.probeData.durationSec}s · Size: {job.probeData.sizeBytes.toLocaleString()} bytes · Bitrate: {job.probeData.bitRateBps.toLocaleString()} bps
                              </div>
                              {job.probeData.streams.map((st) => (
                                <div key={st.index} className="text-cyan-300">
                                  Stream #{st.index} [{st.codecType}]: {st.codecName}{' '}
                                  {st.width ? `${st.width}x${st.height}` : ''}{' '}
                                  {st.sampleRate ? `${st.sampleRate} Hz` : ''}
                                </div>
                              ))}
                            </div>
                          )}

                          {job.contactSheetFrames && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {job.contactSheetFrames.map((fr) => (
                                <div
                                  key={fr.timestampSec}
                                  className="p-2 bg-slate-950 border border-slate-800 rounded space-y-1"
                                >
                                  <div className="text-[10px] text-cyan-400 tabular-nums">
                                    T+00:0{fr.timestampSec}.00 · {fr.telemetryTag}
                                  </div>
                                  <div className="text-[11px] font-sans text-slate-300">
                                    {fr.caption}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. PHASE 10: EDUCATIONAL EXPERIENCE */}
          {activePanel === 'education_academy' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#07090E] border border-slate-800 rounded-md">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Difficulty Tier:</span>
                  {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        setEduDifficulty(tier);
                        setQuizSubmitted(false);
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                        eduDifficulty === tier
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
                  {quizSubmitted && (
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Score: {quizEvaluation.earnedPoints}/{quizEvaluation.maxPoints} pts ({quizEvaluation.accuracyPercent}%) · {quizEvaluation.rankTitle}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                  >
                    Verify Answers & Show Evidence
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {activeChallenges.map((ch, idx) => {
                  const chosenId = selectedAnswers[ch.id] || '';
                  const itemEval = quizEvaluation.itemResults.find(
                    (r) => r.challengeId === ch.id
                  );
                  return (
                    <div
                      key={ch.id}
                      className="p-5 bg-[#07090E] border border-slate-800 rounded-md space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <span>
                          Challenge 0{idx + 1} · {ch.difficulty} Tier · {ch.points} pts
                        </span>
                        <span> Linked Claim: [{ch.claimId}]</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-100">{ch.question}</h3>
                      <p className="text-xs text-slate-400">{ch.contextClue}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {ch.options.map((opt) => {
                          const isSelected = chosenId === opt.id;
                          const isCorrectOption = opt.id === ch.correctOptionId;
                          let borderClass = 'border-slate-800 hover:border-slate-700 bg-[#0B0E17]';
                          if (quizSubmitted) {
                            if (isCorrectOption) {
                              borderClass = 'border-emerald-500 bg-emerald-950/20';
                            } else if (isSelected && !isCorrectOption) {
                              borderClass = 'border-rose-500 bg-rose-950/20';
                            }
                          } else if (isSelected) {
                            borderClass = 'border-cyan-500 bg-slate-900';
                          }

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [ch.id]: opt.id,
                                }))
                              }
                              className={`p-3.5 text-left rounded-md border transition-colors ${borderClass}`}
                            >
                              <div className="text-xs font-semibold text-slate-100">
                                {opt.label}
                              </div>
                              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {opt.detail}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && itemEval && (
                        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded text-xs space-y-1">
                          <div
                            className={`font-mono font-semibold ${
                              itemEval.isCorrect ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {itemEval.isCorrect
                              ? '● CORRECT — Verified Archival Explanation:'
                              : '▲ REVIEW ARCHIVAL EVIDENCE:'}
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            {itemEval.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. PHASE 05: SCIENTIFIC DATA & PROVENANCE CONSOLE */}
          {activePanel === 'data_provenance' && (
            <div className="space-y-6">
              {/* Validation Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    Validation Pipeline Status
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    {validationReport.isValid ? '100% PASS' : 'FAIL'}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 tabular-nums">
                    Errors: {validationReport.errors.length} · Runs: #{validationRunCount}
                  </div>
                </div>

                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    Documented Artifacts
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-1 tabular-nums">
                    {validationReport.totalArtifacts}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    COSPAR / NSSDCA Verified
                  </div>
                </div>

                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    Optically Verified Claims
                  </div>
                  <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
                    {validationReport.verifiedClaims}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    LROC NAC / HiRISE / VLBI
                  </div>
                </div>

                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md">
                  <div className="text-xs font-mono text-slate-400 uppercase">
                    Explicitly Flagged Estimates
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
                    {validationReport.estimatedClaims}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Separated from Exact Fixes
                  </div>
                </div>
              </div>

              {/* Connectors Table */}
              <div className="p-5 bg-[#07090E] border border-slate-800 rounded-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      NASA Archival Ingestion Connectors & Schema Normalization
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValidationRunCount((c) => c + 1)}
                    className="px-3 py-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Re-Run Schema & Provenance Audit
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                        <th className="py-2.5 px-3">Connector Source</th>
                        <th className="py-2.5 px-3">Schema Standard</th>
                        <th className="py-2.5 px-3">Records</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Audit Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 font-mono tabular-nums">
                      {connectors.map((con) => (
                        <tr key={con.id}>
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-100">
                            {con.sourceName}
                          </td>
                          <td className="py-2.5 px-3 text-cyan-300">{con.schemaVersion}</td>
                          <td className="py-2.5 px-3 text-slate-200">{con.recordsIngested}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                            ● {con.validationStatus}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-300">{con.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Epistemic Warnings */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-mono text-amber-400">
                    Epistemic Uncertainty Disclosures (Non-Fabrication Enforcement):
                  </div>
                  {validationReport.warnings.map((w, i) => (
                    <div key={i} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
