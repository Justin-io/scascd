import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  ExternalLink,
  FileCheck2,
  Layers,
  Volume2,
  VolumeX,
  X,
  Bookmark,
  BookmarkCheck,
  Box,
} from 'lucide-react';
import {
  ArtifactRecord,
  ScientificClaim,
  ScientificSource,
  ViewportMode,
  WorkspacePanel,
} from '../types/afterlight';
import { formatCoordinate } from '../utils/scientificEngine';

interface ArtifactAndStoryModalProps {
  activePanel: 'artifact_dossier' | 'storytelling';
  artifact: ArtifactRecord;
  allArtifacts: ArtifactRecord[];
  claims: ScientificClaim[];
  sources: ScientificSource[];
  savedArtifactIds: string[];
  onSwitchPanel: (panel: WorkspacePanel) => void;
  onSelectArtifact: (artifactId: string) => void;
  onToggleSaveArtifact: (artifactId: string) => void;
  onInspect3DHardware: (artifactId: string, mode: ViewportMode) => void;
  onClose: () => void;
}

export const ArtifactAndStoryModal: React.FC<ArtifactAndStoryModalProps> = ({
  activePanel,
  artifact,
  allArtifacts,
  claims,
  sources,
  savedArtifactIds,
  onSwitchPanel,
  onSelectArtifact,
  onToggleSaveArtifact,
  onInspect3DHardware,
  onClose,
}) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [narrativeMode, setNarrativeMode] = useState<'archival' | 'first_person'>('archival');
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(false);
  const [largeReadingSize, setLargeReadingSize] = useState<boolean>(false);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(
    artifact.claimIds[0] || null
  );
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    setSelectedChapterNum(1);
    setActiveClaimId(artifact.claimIds[0] || null);
    setImageFailed(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
  }, [artifact.id]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentChapter =
    artifact.storyChapters.find((c) => c.chapterNumber === selectedChapterNum) ||
    artifact.storyChapters[0];

  const activeClaim = claims.find((c) => c.id === activeClaimId) || null;
  const activeSource = activeClaim
    ? sources.find((s) => s.id === activeClaim.sourceId) || null
    : null;

  const isSaved = savedArtifactIds.includes(artifact.id);

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
        ? currentChapter.firstPersonPassage.replace('[CREATIVE NARRATIVE]', '')
        : currentChapter.factualParagraphs
            .map((p) => (simpleLanguage ? p.simpleText : p.text))
            .join(' ');

    const utterance = new SpeechSynthesisUtterance(
      `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}. ${textToSpeak}`
    );
    utterance.rate = 0.98;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  const coordinateRows = [
    {
      label: 'Landing / Touchdown Site',
      record: artifact.coordinates.landingLocation,
    },
    {
      label: 'Final Operating Site',
      record: artifact.coordinates.finalOperatingLocation,
    },
    {
      label: 'Final Documented Site (Optical)',
      record: artifact.coordinates.finalDocumentedLocation,
    },
    {
      label: 'Current Estimated Site',
      record: artifact.coordinates.currentEstimatedLocation,
    },
    {
      label: 'Terminal Impact Site',
      record: artifact.coordinates.impactLocation,
    },
  ].filter((row) => Boolean(row.record));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="artifact-modal-title"
      className="fixed inset-x-0 top-24 md:top-16 bottom-4 z-30 flex items-center justify-center px-3 md:px-4 pointer-events-none"
    >
      <div className="w-full max-w-[1220px] h-full max-h-[820px] bg-[#0B0E17] border border-slate-800 rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#07090E] border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>NSSDCA {artifact.nssdcaId}</span>
              <span aria-hidden="true">·</span>
              <span>{artifact.agency}</span>
              <span aria-hidden="true">·</span>
              <span>{artifact.category}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  artifact.operationalStatus === 'Operational' ||
                  artifact.operationalStatus === 'Extended mission'
                    ? 'text-emerald-400 font-medium'
                    : artifact.operationalStatus === 'Impacted'
                    ? 'text-amber-400 font-medium'
                    : 'text-cyan-400 font-medium'
                }
              >
                Status: {artifact.operationalStatus}
              </span>
            </div>
            <h2
              id="artifact-modal-title"
              className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight truncate mt-0.5"
            >
              {artifact.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Segmented Mode Switcher: Dossier vs 6-Chapter Storytelling */}
            <div className="flex items-center bg-slate-900 p-1 rounded-md border border-slate-800">
              <button
                type="button"
                onClick={() => onSwitchPanel('artifact_dossier')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activePanel === 'artifact_dossier'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Archaeological Dossier
              </button>
              <button
                type="button"
                onClick={() => onSwitchPanel('storytelling')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activePanel === 'storytelling'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                6-Chapter Narrative
              </button>
            </div>

            <button
              type="button"
              onClick={() => onInspect3DHardware(artifact.id, 'hardware_inspector')}
              className="px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Box className="w-3.5 h-3.5" />
              3D Hardware Stage
            </button>

            <button
              type="button"
              onClick={() => onToggleSaveArtifact(artifact.id)}
              aria-label={isSaved ? 'Remove from Expedition List' : 'Save to Expedition List'}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  Save Site
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Artifact Workspace"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body Split: Content Left (8 cols) + Live Provenance Drawer Right (4 cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {activePanel === 'artifact_dossier' ? (
            <div className="lg:col-span-8 overflow-y-auto p-6 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-800">
              {/* Hero Archival Visual & Core Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-7 relative rounded-md overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between min-h-[220px]">
                  {!imageFailed ? (
                    <img
                      src={artifact.heroImageUrl}
                      alt={artifact.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImageFailed(true)}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                      <Layers className="w-8 h-8 text-cyan-400 mb-2" />
                      <span className="text-sm font-medium text-slate-200">{artifact.name}</span>
                      <span className="text-xs text-slate-400 mt-1">{artifact.regionName}</span>
                    </div>
                  )}
                  <div className="p-3 bg-[#07090E] border-t border-slate-800 text-xs text-slate-400">
                    {artifact.heroImageCaption}
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col justify-between bg-[#07090E] border border-slate-800 rounded-md p-4 space-y-3">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-mono">
                      Primary Region & Body
                    </div>
                    <div className="text-sm font-semibold text-slate-100 mt-0.5">
                      {artifact.regionName} ({artifact.bodyId.toUpperCase()})
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Launch Date</div>
                      <div className="text-sm font-mono font-semibold text-slate-100 tabular-nums">
                        {artifact.launchDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Arrival / Touchdown</div>
                      <div className="text-sm font-mono font-semibold text-slate-100 tabular-nums">
                        {artifact.landingOrArrivalDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Dry Mass</div>
                      <div className="text-sm font-mono font-semibold text-slate-100 tabular-nums">
                        {artifact.massDryKg.toLocaleString()}{' '}
                        <span className="text-xs text-slate-400">kg</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Traverse Distance</div>
                      <div className="text-sm font-mono font-semibold text-cyan-400 tabular-nums">
                        {artifact.traverseDistanceKm !== undefined
                          ? `${artifact.traverseDistanceKm.toFixed(2)} km`
                          : 'Stationary'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-xs text-slate-400 font-mono">
                      Operational Classification Note
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {artifact.statusExplanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Coordinate Geodetic Provenance Table */}
              <div>
                <h3 className="text-base font-semibold text-slate-100 mb-1">
                  01. Multi-Coordinate Geodetic Provenance & Accuracy
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Independent tracking of landing, final operating, optically documented, and impact coordinates.
                </p>

                {coordinateRows.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-800 rounded-md">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#07090E] text-slate-400 font-mono border-b border-slate-800">
                          <th className="py-2.5 px-3">Coordinate Type</th>
                          <th className="py-2.5 px-3">Planetographic Lat / Lon</th>
                          <th className="py-2.5 px-3">Elevation</th>
                          <th className="py-2.5 px-3">Uncertainty</th>
                          <th className="py-2.5 px-3">Epistemic Status</th>
                          <th className="py-2.5 px-3">Reference Frame / Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 font-mono tabular-nums">
                        {coordinateRows.map((row) => {
                          const rec = row.record!;
                          return (
                            <tr key={row.label} className="hover:bg-slate-900/50">
                              <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                                {row.label}
                              </td>
                              <td className="py-2.5 px-3 text-cyan-300">
                                {formatCoordinate(rec.lat, rec.lon)}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300">
                                {rec.elevationM !== undefined ? `${rec.elevationM} m` : 'N/A'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300">
                                ±{rec.confidenceRadiusM >= 1000
                                  ? `${(rec.confidenceRadiusM / 1000).toFixed(1)} km`
                                  : `${rec.confidenceRadiusM} m`}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={
                                    rec.verification === 'VERIFIED'
                                      ? 'text-emerald-400 font-semibold'
                                      : 'text-amber-400 font-semibold'
                                  }
                                >
                                  ● {rec.verification}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-sans text-slate-400">
                                {rec.imagingReference || rec.datum}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  artifact.coordinates.heliocentricPosition && (
                    <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md font-mono text-xs space-y-1">
                      <div className="text-cyan-400 font-semibold">
                        Heliocentric Interstellar Trajectory ({artifact.coordinates.heliocentricPosition.epoch})
                      </div>
                      <div className="text-slate-300 tabular-nums">
                        Heliocentric Distance: {artifact.coordinates.heliocentricPosition.distanceAU} AU · Ecliptic Lat: {artifact.coordinates.heliocentricPosition.eclipticLatDeg}° · Ecliptic Lon: {artifact.coordinates.heliocentricPosition.eclipticLonDeg}° · Velocity: {artifact.coordinates.heliocentricPosition.velocityKmS} km/s
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Engineering Specifications & Scientific Instruments */}
              <div>
                <h3 className="text-base font-semibold text-slate-100 mb-3">
                  02. Scientific Instruments & Payload Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artifact.instruments.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {inst.name} ({inst.acronym})
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {inst.massKg} kg · {inst.powerWatts} W
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {inst.type} · PI: {inst.principalInvestigator}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-slate-200">Findings:</strong> {inst.keyFindings}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Scientific Achievements & Present Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-2">
                  <h4 className="text-sm font-semibold text-slate-100">
                    03. Primary Scientific Achievements
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
                    {artifact.scientificAchievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#07090E] border border-slate-800 rounded-md space-y-3">
                  <h4 className="text-sm font-semibold text-slate-100">
                    04. Documented Present Condition & Related Hardware
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {artifact.presentConditionSummary}
                  </p>
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-400 mb-2">Related Planetary Artifacts:</div>
                    <div className="flex flex-wrap gap-2">
                      {artifact.relatedArtifactIds.map((relId) => {
                        const rel = allArtifacts.find((a) => a.id === relId);
                        if (!rel) return null;
                        return (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => onSelectArtifact(rel.id)}
                            className="px-2.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded transition-colors"
                          >
                            {rel.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 6-CHAPTER IMMERSIVE STORYTELLING ENGINE */
            <div className="lg:col-span-8 overflow-y-auto p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800">
              {/* Storytelling Controls & Accessibility Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#07090E] border border-slate-800 rounded-md">
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setNarrativeMode('archival')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      narrativeMode === 'archival'
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Verified Archival Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setNarrativeMode('first_person')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      narrativeMode === 'first_person'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    First-Person Voice (Creative)
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSimpleLanguage((s) => !s)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      simpleLanguage
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {simpleLanguage ? 'Simple Language: ON' : 'Simple Language: OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLargeReadingSize((s) => !s)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      largeReadingSize
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {largeReadingSize ? 'Text Size: Large' : 'Text Size: Standard'}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleNarration}
                    className={`px-3 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
                      isNarrating
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isNarrating ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        Stop Narration
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        Listen to Chapter
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 6-Chapter Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {artifact.storyChapters.map((ch) => {
                  const isCurrent = ch.chapterNumber === selectedChapterNum;
                  return (
                    <button
                      key={ch.chapterNumber}
                      type="button"
                      onClick={() => setSelectedChapterNum(ch.chapterNumber)}
                      className={`p-2.5 text-left rounded-md border transition-colors ${
                        isCurrent
                          ? 'bg-slate-900 border-cyan-500 text-slate-100'
                          : 'bg-[#07090E] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-mono text-cyan-400">
                        Chapter 0{ch.chapterNumber}
                      </div>
                      <div className="text-xs font-semibold truncate mt-0.5">{ch.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Chapter Reading Canvas */}
              <div className="p-6 bg-[#07090E] border border-slate-800 rounded-md space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      Chapter 0{currentChapter.chapterNumber} · {currentChapter.title}
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mt-1">
                      {currentChapter.subtitle}
                    </h3>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">
                      {currentChapter.telemetryHighlight.label}
                    </div>
                    <div className="text-lg font-bold text-slate-100 tabular-nums">
                      {currentChapter.telemetryHighlight.value}{' '}
                      <span className="text-xs text-slate-400">
                        {currentChapter.telemetryHighlight.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Always show verified factual statements with clickable Claim IDs */}
                <div className="space-y-4">
                  <div className="text-xs font-mono text-emerald-400">
                    ● VERIFIED ARCHIVAL RECORD {simpleLanguage ? '(SIMPLE LANGUAGE ADAPTATION)' : ''}
                  </div>
                  {currentChapter.factualParagraphs.map((para, idx) => (
                    <div key={idx} className="space-y-2">
                      <p
                        className={`text-slate-200 leading-relaxed ${
                          largeReadingSize ? 'text-lg' : 'text-sm md:text-base'
                        }`}
                      >
                        {simpleLanguage ? para.simpleText : para.text}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">
                          Synchronized Evidence Claims:
                        </span>
                        {para.claimIds.map((cid) => (
                          <button
                            key={cid}
                            type="button"
                            onClick={() => setActiveClaimId(cid)}
                            className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                              activeClaimId === cid
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                                : 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-500'
                            }`}
                          >
                            [{cid}] Inspect Source
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* First-Person Creative Narrative Block (explicitly distinguished from archival facts) */}
                <div
                  className={`p-4 rounded-md border transition-colors ${
                    narrativeMode === 'first_person'
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-amber-400">
                      ▲ FIRST-PERSON STORYTELLING MODE (CREATIVE INTERPRETATION — DISTINCT FROM ARCHIVAL RECORD)
                    </span>
                  </div>
                  <p
                    className={`italic text-slate-200 leading-relaxed ${
                      largeReadingSize ? 'text-lg' : 'text-sm'
                    }`}
                  >
                    {currentChapter.firstPersonPassage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Scientific Evidence & Provenance Panel (Right 4 Columns) */}
          <div className="lg:col-span-4 bg-[#07090E] p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  Evidence & Provenance Inspector
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every factual claim is bound to an auditable NASA archival record.
                </p>
              </div>
            </div>

            {/* Claim Selector Buttons for this Artifact */}
            <div>
              <div className="text-xs text-slate-400 font-mono mb-2">
                Artifact Claims ({artifact.claimIds.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {artifact.claimIds.map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setActiveClaimId(cid)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                      activeClaimId === cid
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cid}
                  </button>
                ))}
              </div>
            </div>

            {activeClaim ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#0B0E17] border border-slate-800 rounded-md space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">{activeClaim.id}</span>
                    <span
                      className={
                        activeClaim.verificationStatus === 'VERIFIED'
                          ? 'text-emerald-400 font-semibold'
                          : 'text-amber-400 font-semibold'
                      }
                    >
                      ● {activeClaim.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeClaim.statement}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400">Evidence Modality: </span>
                      <span className="text-slate-200 font-mono">{activeClaim.evidenceType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Uncertainty & Epistemic Notes: </span>
                      <span className="text-slate-300">{activeClaim.uncertaintyNotes}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Reviewed: </span>
                      <span className="text-slate-300 font-mono tabular-nums">
                        {activeClaim.reviewTimestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {activeSource && (
                  <div className="p-4 bg-[#0B0E17] border border-slate-800 rounded-md space-y-2.5">
                    <div className="text-xs font-mono text-slate-400">
                      Authoritative Source Record ({activeSource.id})
                    </div>
                    <div className="text-xs font-semibold text-slate-100">
                      {activeSource.title}
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      {activeSource.citation}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Dataset ID: <span className="text-slate-200">{activeSource.datasetId}</span>
                    </div>
                    <div className="pt-2">
                      <a
                        href={activeSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Open NASA Archive ({activeSource.archiveName})
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Select any claim badge to inspect its source citation and uncertainty parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
