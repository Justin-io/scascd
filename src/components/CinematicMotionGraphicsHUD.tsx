import React from 'react';
import { ArtifactRecord, StoryChapterNumber } from '../types/afterlight';
import {
  CinemaCameraMode,
  LiveChoreographyTelemetry,
} from '../utils/storyChoreographyEngine';

interface CinematicMotionGraphicsHUDProps {
  artifact: ArtifactRecord;
  activeChapter: StoryChapterNumber;
  storyProgress: number;
  cameraMode: CinemaCameraMode;
  telemetry: LiveChoreographyTelemetry;
  onScrubProgress: (progress: number) => void;
}

export const CinematicMotionGraphicsHUD: React.FC<CinematicMotionGraphicsHUDProps> = ({
  artifact,
  activeChapter: chapter,
  storyProgress: progress,
  telemetry,
}) => {
  const { activeBeat } = telemetry;
  const compassAngle = (progress * 360 + chapter * 45) % 360;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden select-none"
    >
      {/* Subtle Top-Center Mission Phase Pill */}
      <div className="hidden xl:flex items-center justify-center pt-16 pr-[50px]">
        <div className="max-w-[540px] bg-[#07090E]/85 backdrop-blur-md border border-slate-800/80 rounded-full px-3.5 py-1 flex items-center gap-2.5 font-mono text-[11px] tabular-nums shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-cyan-300 font-semibold truncate max-w-[210px]">
            CH {String(chapter).padStart(2, '0')} · {activeBeat.title}
          </span>
          <span className="text-slate-600 shrink-0">•</span>
          <span className="text-amber-300 shrink-0">{activeBeat.metTimestamp}</span>
          <span className="text-slate-600 shrink-0">•</span>
          <span className="text-slate-300 shrink-0">
            ALT{' '}
            {telemetry.altitudeKm > 1000
              ? `${(telemetry.altitudeKm / 1000).toFixed(1)}k km`
              : `${telemetry.altitudeKm.toFixed(2)} km`}
          </span>
          <span className="text-slate-600 shrink-0">•</span>
          <span className="text-emerald-300 shrink-0">
            {telemetry.velocityKmS.toFixed(2)} km/s
          </span>
        </div>
      </div>

      {/* Whisper-Quiet Center Target-Lock Framing Reticle (Leaves 3D Spacecraft Unobstructed) */}
      <div className="hidden md:flex items-center justify-center absolute left-[42%] top-[48%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-[260px] h-[260px] flex items-center justify-center opacity-55">
          <svg viewBox="0 0 280 280" className="w-full h-full overflow-visible">
            <path
              d="M 24 46 L 24 24 L 46 24 M 234 24 L 256 24 L 256 46 M 256 234 L 256 256 L 234 256 M 46 256 L 24 256 L 24 234"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.25"
              strokeOpacity="0.6"
            />
            <circle
              cx="140"
              cy="140"
              r="104"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeDasharray="4 12"
              strokeOpacity="0.35"
              transform={`rotate(${compassAngle.toFixed(1)} 140 140)`}
            />
            <circle
              cx="140"
              cy="140"
              r="3.5"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <text
              x="140"
              y="14"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="8.5"
              fontFamily="JetBrains Mono, monospace"
            >
              {artifact.nssdcaId} · AZ {compassAngle.toFixed(0)}°
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
