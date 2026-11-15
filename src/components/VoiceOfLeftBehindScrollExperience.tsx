import React, { useState, useEffect, useRef } from 'react';
import {
  ArtifactRecord,
  CelestialBodyId,
  StoryChapterNumber,
  ViewportMode,
  WorkspacePanel,
} from '../types/afterlight';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowUp,
  Layers,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Boxes,
  Database,
  Film,
  GraduationCap,
  Sliders,
  Eye,
} from 'lucide-react';
import { spaceAudio } from '../utils/audioManager';

interface VoiceOfLeftBehindScrollExperienceProps {
  viewportMode: ViewportMode;
  selectedBodyId: CelestialBodyId;
  selectedArtifactId: string;
  onSwitchViewportMode: (mode: ViewportMode) => void;
  onSelectBody: (bodyId: CelestialBodyId) => void;
  onSelectArtifact: (artifactId: string) => void;
  onOpenWorkspace: (panel: WorkspacePanel) => void;
  onLaunchStoryCinema: (chapter?: StoryChapterNumber) => void;
  onToggleFreeOrbit?: () => void;
  onActiveSectionChange?: (section: 'hero' | 'moon' | 'mars' | 'lab') => void;
}

interface ExhibitItem {
  id: string;
  figNo: string;
  title: string;
  mission: string;
  year: number;
  world: 'Moon' | 'Mars';
  site: string;
  image: string;
  status: string;
  quote: string;
  targetArtifactId: string;
}

const EXHIBITS: ExhibitItem[] = [
  {
    id: 'eagle',
    figNo: 'FIG. 01',
    title: "Eagle's Descent Stage",
    mission: 'APOLLO 11',
    year: 1969,
    world: 'Moon',
    site: 'Sea of Tranquility',
    image: '/media/eagle.webp',
    status: 'Landed · Inactive',
    quote: 'The ladder and commemorative plaque stayed behind as the ascent stage lifted off.',
    targetArtifactId: 'ART-APOLLO11-LM-DS',
  },
  {
    id: 'reflector',
    figNo: 'FIG. 02',
    title: 'Laser Ranging Retroreflector',
    mission: 'APOLLO 11',
    year: 1969,
    world: 'Moon',
    site: 'Sea of Tranquility',
    image: '/media/reflector.webp',
    status: 'Active · Reflecting lasers today',
    quote: '100 fused silica corner-cubes still return photons back to Earth telescopes.',
    targetArtifactId: 'ART-APOLLO11-LM-DS',
  },
  {
    id: 'seismic',
    figNo: 'FIG. 03',
    title: 'Passive Seismic Experiment',
    mission: 'APOLLO 11',
    year: 1969,
    world: 'Moon',
    site: 'Sea of Tranquility',
    image: '/media/seismic.webp',
    status: 'Silent since 1969',
    quote: 'Sensitive enough to feel Neil Armstrong footsteps travel through the lunar crust.',
    targetArtifactId: 'ART-APOLLO11-LM-DS',
  },
  {
    id: 'alsep',
    figNo: 'FIG. 04',
    title: 'ALSEP Instruments Hub',
    mission: 'APOLLO 14',
    year: 1971,
    world: 'Moon',
    site: 'Fra Mauro',
    image: '/media/alsep.webp',
    status: 'Landed · Inactive',
    quote: 'Geophone arrays timed thumper vibrations to decode the subsurface strata.',
    targetArtifactId: 'ART-SURVEYOR3-LANDER',
  },
  {
    id: 'rover',
    figNo: 'FIG. 05',
    title: 'Lunar Roving Vehicle (LRV-1)',
    mission: 'APOLLO 15',
    year: 1971,
    world: 'Moon',
    site: 'Hadley–Apennine',
    image: '/media/rover.webp',
    status: 'Parked · Inactive',
    quote: 'Flexible wire mesh wheels carried astronauts 27.76 km along the edge of Hadley Rille.',
    targetArtifactId: 'ART-APOLLO15-LRV',
  },
  {
    id: 'viking',
    figNo: 'FIG. 06',
    title: 'Viking 1 Lander',
    mission: 'VIKING 1',
    year: 1976,
    world: 'Mars',
    site: 'Chryse Planitia',
    image: '/media/viking.webp',
    status: 'Silent since 1982',
    quote: 'Sent the first clear photograph from the Martian surface showing red dust on its footpad.',
    targetArtifactId: 'ART-VIKING1-LANDER',
  },
  {
    id: 'pathfinder',
    figNo: 'FIG. 07',
    title: 'Pathfinder & Sojourner',
    mission: 'MARS PATHFINDER',
    year: 1997,
    world: 'Mars',
    site: 'Ares Vallis',
    image: '/media/pathfinder.webp',
    status: 'Silent since 1997',
    quote: 'Bounced on airbags, opened petals, and rolled down the ramp to inspect Barnacle Bill.',
    targetArtifactId: 'ART-MERB-OPPORTUNITY',
  },
];

export const VoiceOfLeftBehindScrollExperience: React.FC<VoiceOfLeftBehindScrollExperienceProps> = ({
  viewportMode,
  selectedBodyId,
  selectedArtifactId,
  onSwitchViewportMode,
  onSelectBody,
  onSelectArtifact,
  onOpenWorkspace,
  onLaunchStoryCinema,
  onToggleFreeOrbit,
  onActiveSectionChange,
}) => {
  const [activeSection, setActiveSection] = useState<'hero' | 'moon' | 'mars' | 'lab'>('hero');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => !spaceAudio.getIsMuted());

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const moonRef = useRef<HTMLElement>(null);
  const marsRef = useRef<HTMLElement>(null);
  const labRef = useRef<HTMLElement>(null);

  const SECTIONS = ['hero', 'moon', 'mars', 'lab'] as const;

  // Silenced for introductory scroll experience; audio strictly reserved for Watch Story Intro
  const playBeep = (_freq = 440, _duration = 0.15) => {
    // Silent
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    playBeep(620, 0.1);
  };

  const scrollToNext = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    const nextIndex = Math.min(SECTIONS.length - 1, currentIndex + 1);
    const targetRef =
      nextIndex === 0
        ? heroRef
        : nextIndex === 1
        ? moonRef
        : nextIndex === 2
        ? marsRef
        : labRef;
    scrollToSection(targetRef);
  };

  const scrollToPrev = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    const prevIndex = Math.max(0, currentIndex - 1);
    const targetRef =
      prevIndex === 0
        ? heroRef
        : prevIndex === 1
        ? moonRef
        : prevIndex === 2
        ? marsRef
        : labRef;
    scrollToSection(targetRef);
  };

  // Keyboard arrow listeners for automatic section scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  // Automatic timed tour when isAutoScrolling is active
  useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = window.setInterval(() => {
      const currentIndex = SECTIONS.indexOf(activeSection);
      if (currentIndex >= SECTIONS.length - 1) {
        scrollToSection(heroRef);
      } else {
        scrollToNext();
      }
    }, 6500);
    return () => window.clearInterval(interval);
  }, [isAutoScrolling, activeSection]);

  const onSelectBodyRef = useRef(onSelectBody);
  const onSwitchViewportModeRef = useRef(onSwitchViewportMode);
  const onActiveSectionChangeRef = useRef(onActiveSectionChange);
  const currentSectionRef = useRef<string>('hero');

  useEffect(() => {
    onSelectBodyRef.current = onSelectBody;
    onSwitchViewportModeRef.current = onSwitchViewportMode;
    onActiveSectionChangeRef.current = onActiveSectionChange;
  });

  // Scroll spy with IntersectionObserver for smooth world transitions
  useEffect(() => {
    if (!containerRef.current) return;

    const options: IntersectionObserverInit = {
      root: containerRef.current,
      threshold: 0.45,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === currentSectionRef.current) return;
          currentSectionRef.current = id;

          if (id === 'section-hero') {
            setActiveSection('hero');
            onActiveSectionChangeRef.current?.('hero');
            onSelectBodyRef.current('sun');
            onSwitchViewportModeRef.current('solar_system');
          } else if (id === 'section-moon') {
            setActiveSection('moon');
            onActiveSectionChangeRef.current?.('moon');
            onSelectBodyRef.current('moon');
            onSwitchViewportModeRef.current('moon_globe');
          } else if (id === 'section-mars') {
            setActiveSection('mars');
            onActiveSectionChangeRef.current?.('mars');
            onSelectBodyRef.current('mars');
            onSwitchViewportModeRef.current('mars_globe');
          } else if (id === 'section-lab') {
            setActiveSection('lab');
            onActiveSectionChangeRef.current?.('lab');
            onSelectBodyRef.current('sun');
            onSwitchViewportModeRef.current('solar_system');
          }
        }
      });
    }, options);

    const elHero = heroRef.current;
    const elMoon = moonRef.current;
    const elMars = marsRef.current;
    const elLab = labRef.current;

    if (elHero) observer.observe(elHero);
    if (elMoon) observer.observe(elMoon);
    if (elMars) observer.observe(elMars);
    if (elLab) observer.observe(elLab);

    return () => {
      observer.disconnect();
    };
  }, []);

  const moonExhibits = EXHIBITS.filter((e) => e.world === 'Moon');
  const marsExhibits = EXHIBITS.filter((e) => e.world === 'Mars');

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      {/* 1. TOP BRAND MASTHEAD (Styled faithfully from Left Behind) */}
      <div
        className={`pointer-events-auto transition-opacity duration-500 flex items-center justify-between px-6 py-3.5 bg-[#0A0B0A]/85 backdrop-blur-md border-b border-[#31322E]/80 ${
          isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Orbit SVG Icon */}
          <svg
            className="w-8 h-8 text-[#F7C558]"
            viewBox="0 0 46 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.65"
          >
            <circle cx="23" cy="23" r="13" />
            <ellipse cx="23" cy="23" rx="22" ry="6.8" transform="rotate(-37 23 23)" />
            <path d="M18 11c4 4 7 11 8 21" />
            <circle cx="38.8" cy="9" r="2" fill="currentColor" stroke="none" />
          </svg>
          <div>
            <div className="text-xs font-bold tracking-[2px] text-[#F5F3ED] font-mono">
              SURFACE ARCHIVE
            </div>
            <div className="text-[9px] tracking-[1.4px] text-[#94978C] font-mono">
              LUNAR & MARTIAN EXPLORATION · 1969—1997
            </div>
          </div>
        </div>

        {/* Center Current Stage Status */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-[#141611]/80 border border-[#363833] rounded-full text-[10px] font-mono tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#F7C558] animate-pulse" />
          <span className="text-[#F7C558] font-bold">LIVE STAGE:</span>
          <span className="text-slate-300 uppercase">
            {activeSection === 'hero'
              ? 'Heliocentric Solar System'
              : activeSection === 'moon'
              ? 'Moon Globe (Hadley / Tranquillity)'
              : activeSection === 'mars'
              ? 'Mars Globe (Chryse / Ares)'
              : 'Gravity Physics Lab'}
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              const isMuted = spaceAudio.toggleMute();
              setSoundEnabled(!isMuted);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#C1C4BA] hover:text-[#F7C558] transition-colors"
            title="Toggle synthesized telemetry sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#F7C558]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
          </button>

          <div className="h-4 w-px bg-[#363833]" />

          <button
            type="button"
            onClick={() => setIsZenMode((z) => !z)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono bg-[#141611] hover:bg-[#1E211A] text-[#E4E3DA] border border-[#363833] rounded transition-colors"
            title="Toggle Free 3D Orbit Canvas Mode"
          >
            {isZenMode ? <Minimize2 className="w-3 h-3 text-[#F7C558]" /> : <Maximize2 className="w-3 h-3 text-[#F7C558]" />}
            <span>{isZenMode ? 'Resume Story' : 'Free 3D Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 2. STICKY PROGRESS DOTS (Jump smoothly to Solar System, Moon, Mars, Lab) */}
      <nav
        aria-label="Storyline sections"
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-end gap-3 transition-opacity duration-300 ${
          isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {[
          { id: 'hero', label: 'Solar System', ref: heroRef },
          { id: 'moon', label: 'Moon Globe', ref: moonRef },
          { id: 'mars', label: 'Mars Globe', ref: marsRef },
          { id: 'lab', label: 'Solar Simulation', ref: labRef },
        ].map((item) => {
          const isCurrent = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.ref)}
              className="group flex items-center gap-2 text-right focus:outline-none"
            >
              <span
                className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded transition-all duration-300 ${
                  isCurrent
                    ? 'text-[#F7C558] bg-[#141611]/90 border border-[#F7C558]/40 shadow-lg'
                    : 'text-slate-400 opacity-0 group-hover:opacity-100 bg-[#0A0B0A]/80'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  isCurrent
                    ? 'bg-[#F7C558] border-[#F7C558] shadow-[0_0_12px_#F7C558]'
                    : 'bg-transparent border-[#55594D] group-hover:border-[#F7C558]'
                }`}
              >
                {isCurrent && <span className="w-1 h-1 rounded-full bg-black" />}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 2B. FLOATING ARROW SCROLL CONTROLLER (Auto & Manual Section Transitions) */}
      <aside
        aria-label="Automatic Scroll Navigation"
        className={`fixed bottom-6 right-6 z-40 pointer-events-auto flex flex-col items-center gap-1.5 bg-[#0A0B0A]/95 backdrop-blur-md border border-[#363833] p-1.5 rounded-xl shadow-2xl transition-opacity duration-300 ${
          isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={scrollToPrev}
          disabled={activeSection === 'hero'}
          title="Auto-Scroll to Previous Section (Arrow Up / PageUp)"
          className="p-2 bg-[#141611] hover:bg-[#1E211A] disabled:opacity-30 disabled:hover:bg-[#141611] text-[#E4E3DA] hover:text-[#F7C558] border border-[#363833] rounded-lg transition-all"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Auto Tour Play / Pause */}
        <button
          type="button"
          onClick={() => {
            const next = !isAutoScrolling;
            setIsAutoScrolling(next);
            playBeep(next ? 800 : 400, 0.12);
          }}
          title={isAutoScrolling ? 'Pause Automatic Scroll Tour' : 'Start Automatic 6.5s Scroll Tour'}
          className={`px-2 py-1 text-[9px] font-mono rounded-md border flex items-center gap-1 transition-colors ${
            isAutoScrolling
              ? 'bg-[#F7C558] text-[#19170C] font-bold border-[#F7C558] shadow-[0_0_10px_#F7C558]'
              : 'bg-[#141611] text-[#C1C4BA] hover:text-white border-[#363833]'
          }`}
        >
          {isAutoScrolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          <span>{isAutoScrolling ? 'PAUSE' : 'AUTO'}</span>
        </button>

        <button
          type="button"
          onClick={scrollToNext}
          disabled={activeSection === 'lab'}
          title="Auto-Scroll to Next Section (Arrow Down / PageDown)"
          className="p-2 bg-[#141611] hover:bg-[#1E211A] disabled:opacity-30 disabled:hover:bg-[#141611] text-[#E4E3DA] hover:text-[#F7C558] border border-[#363833] rounded-lg transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </aside>

      {/* 3. SMOOTH VERTICAL SCROLL TRACK (Containing Hero, Moon, Mars, Lab) */}
      <div
        ref={containerRef}
        className={`w-full h-[calc(100vh-53px)] overflow-y-auto scroll-smooth transition-opacity duration-500 ${
          isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ scrollSnapType: 'y proximity' }}
      >
        {/* ============================================================ */}
        {/* SECTION 1: THE VOICE OF LEFT BEHIND — HERO (Solar System BG) */}
        {/* ============================================================ */}
        <section
          id="section-hero"
          ref={heroRef}
          style={{ scrollSnapAlign: 'start' }}
          className="relative min-h-[calc(100vh-53px)] flex flex-col justify-between p-6 md:p-14 lg:p-20 overflow-hidden"
        >
          {/* Subtle gradient vignette to let the Three.js solar system shine through */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#030403]/90 via-[#030403]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#030403] via-transparent to-transparent pointer-events-none" />

          {/* Hero Content */}
          <div className="max-w-2xl mt-4 md:mt-8 pointer-events-auto">
            {/* Pulsing Eyebrow */}
            <div className="flex items-center gap-2.5 text-[#F7C558] font-mono text-[11px] tracking-[1.6px] font-semibold uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F7C558] shadow-[0_0_12px_#FFD875]" />
              <span>INTERACTIVE SPACE EXHIBITION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F5F3ED] my-5 leading-[0.95]">
              The voice of
              <br />
              <em
                className="italic font-normal text-[#F7C558] font-serif pr-2"
                style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
              >
                left behind.
              </em>
            </h1>

            {/* Subtitle paragraph */}
            <p className="text-base sm:text-lg text-[#D3D2CA] leading-relaxed max-w-lg mb-8">
              Seven exhibits trace the machines we left on the Moon and Mars. Explore the worlds they
              touched and the stories they still tell across deep space.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection(moonRef)}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#F7C558] hover:bg-[#FFDB85] text-[#19170C] font-bold text-sm rounded shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="w-4 h-4" />
                <span>Enter the Atlas</span>
                <span className="text-base font-mono">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLaunchStoryCinema(1);
                }}
                className="flex items-center gap-2.5 px-5 py-3.5 bg-[#141611]/80 hover:bg-[#1E211A] text-[#F5F3ED] border border-[#55594D] hover:border-[#F7C558] text-sm font-semibold rounded shadow transition-colors"
              >
                <span className="w-6 h-6 rounded-full border border-[#85877D] flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span>Watch Story Intro</span>
              </button>

              <button
                type="button"
                onClick={() => setIsZenMode(true)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-mono text-[#A8AAA0] hover:text-[#F7C558] transition-colors"
              >
                <span>[Free 3D Orbit]</span>
              </button>
            </div>
          </div>

          {/* HUD Reticle Target (Apollo 15 Lunar Rover) */}
          <div className="hidden lg:block absolute right-[18%] top-[45%] pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                onSelectArtifact('ART-APOLLO15-LRV');
                scrollToSection(moonRef);
              }}
              className="relative group p-4 flex items-center justify-center"
              title="Inspect Apollo 15 Lunar Roving Vehicle"
            >
              <div className="w-12 h-12 rounded-full border border-[#F7C558]/80 group-hover:scale-110 group-hover:border-[#F7C558] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(247,197,88,0.25)]">
                <div className="w-2 h-2 rounded-full bg-[#F7C558] animate-ping" />
              </div>
              <div className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0B0C0B]/90 backdrop-blur-md border-l-2 border-[#F7C558] pl-3 py-1 text-left font-mono text-[10px]">
                <div className="text-[#F7C558] font-bold">FIG. 05 · LUNAR ROVING VEHICLE</div>
                <div className="text-[#C4C6BB] text-[9px]">APOLLO 15 / HADLEY–APENNINE</div>
                <div className="text-cyan-400 text-[8px] mt-0.5">27.76 KM TRAVERSE POLYLINE</div>
              </div>
            </button>
          </div>

          {/* Bottom Telemetry & Mission Strip */}
          <div className="pointer-events-auto mt-8">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#BFC0B7] tracking-wider mb-3">
              <span className="flex items-center gap-1.5">
                <span className="text-[#F7C558] font-bold">+</span>
                SURFACE VIEW / HELIOCENTRIC FRONTIER
              </span>
              <span className="text-cyan-400">PDS ARCHIVAL CITATIONS VERIFIED</span>
            </div>

            {/* Mission Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-6 bg-[#10120F]/90 backdrop-blur-md border-y border-[#363833] text-xs font-mono text-[#AAA99E]">
              <div className="flex items-center gap-6">
                <div>
                  MISSION SPAN <strong className="text-[#E4E3DA] ml-1 font-sans">1969 — 1997</strong>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-[#696D60] rounded-full" />
                <div>
                  DESTINATIONS <strong className="text-[#E4E3DA] ml-1 font-sans">Moon & Mars</strong>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-[#696D60] rounded-full" />
                <div>
                  EXHIBITS <strong className="text-[#F7C558] ml-1 font-sans">07 records</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollToSection(moonRef)}
                className="flex items-center gap-2 text-[#BABBAF] hover:text-[#F7C558] text-[10px] uppercase font-bold tracking-wider transition-colors ml-auto"
              >
                <span>SCROLL TO EXPLORE THE MOON</span>
                <ChevronDown className="w-4 h-4 text-[#F7C558] animate-bounce" />
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: THE MOON GLOBE (Smooth 3D Moon Surface Transition) */}
        {/* ============================================================ */}
        <section
          id="section-moon"
          ref={moonRef}
          style={{ scrollSnapAlign: 'start' }}
          className="relative min-h-[calc(100vh-53px)] flex flex-col justify-between p-6 md:p-14 lg:p-20 overflow-hidden"
        >
          {/* Subtle dark gradient overlay allowing the 3D Moon Globe to dominate */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#030403]/95 via-[#030403]/60 to-transparent pointer-events-none" />

          {/* Section Header */}
          <div className="max-w-2xl pointer-events-auto">
            <div className="flex items-center gap-2 text-[#F7C558] font-mono text-[10px] tracking-[1.6px] font-semibold uppercase">
              <span className="w-5 h-px bg-[#F7C558]" />
              <span>DESTINATION 01 · 384,400 KM FROM EARTH</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F5F3ED] my-3 leading-tight">
              The Silent Regolith
              <span className="text-[#F7C558]">.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#D3D2CA] leading-relaxed max-w-xl">
              <em className="text-[#F7C558] not-italic font-semibold">
                &ldquo;Before a human boot touched the Moon, four metal feet got there first.
              </em>{' '}
              They belonged to one of us, the bottom half of a spacecraft called Eagle. When Eagle’s
              upper cabin lifted Neil and Buzz back toward lunar orbit, the ladder stayed. So did the
              seismic listener and 100 glass prisms tilted toward Earth.&rdquo;
            </p>

            <div className="flex items-center gap-3 mt-4 text-xs font-mono">
              <span className="px-2.5 py-1 bg-[#161812] border border-[#7C7D66]/40 text-[#E4E4D7] rounded">
                LROC WAC/NAC TOPOGRAPHY
              </span>
              <span className="text-slate-400">GRAVITY: 1.62 m/s²</span>
              <span className="text-cyan-400">MARIA TRANQUILLITATIS & HADLEY</span>
            </div>
          </div>

          {/* Moon Exhibits Cards Grid */}
          <div className="pointer-events-auto my-6">
            <div className="text-[10px] font-mono tracking-wider text-[#A8AAA0] uppercase mb-3 flex items-center justify-between">
              <span>LUNAR SURFACE HARDWARE CATALOG</span>
              <span className="text-[#F7C558]">CLICK TO INSPECT ON 3D GLOBE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {moonExhibits.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectArtifact(item.targetArtifactId);
                    playBeep(580, 0.1);
                  }}
                  className="group relative bg-[#10120F]/90 hover:bg-[#181B15] border border-[#33352F] hover:border-[#F7C558] rounded p-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded bg-[#1A1C17] mb-2.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-black/70 text-[#E4E4D7] rounded border border-white/10">
                      {item.world}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-[#F7C558] bg-black/80 px-1 rounded">
                      {item.figNo}
                    </span>
                  </div>

                  {/* Card Metadata */}
                  <div className="text-[9px] font-mono text-[#C5AB75] uppercase">
                    {item.mission} · {item.year}
                  </div>
                  <h3 className="text-xs font-bold text-[#F5F3ED] mt-0.5 group-hover:text-[#F7C558] transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                    {item.site}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Nav / Next Scroll Trigger */}
          <div className="pointer-events-auto flex items-center justify-between pt-4 border-t border-[#363833] text-xs font-mono">
            <button
              type="button"
              onClick={() => onOpenWorkspace('search_catalog')}
              className="flex items-center gap-1.5 text-[#F7C558] hover:underline"
            >
              <span>Explore Complete Lunar Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(marsRef)}
              className="flex items-center gap-2 text-[#BABBAF] hover:text-[#F7C558] text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <span>SCROLL DOWN FOR MARS</span>
              <ChevronDown className="w-4 h-4 text-[#F7C558] animate-bounce" />
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: THE MARS GLOBE (Smooth 3D Mars Surface Transition) */}
        {/* ============================================================ */}
        <section
          id="section-mars"
          ref={marsRef}
          style={{ scrollSnapAlign: 'start' }}
          className="relative min-h-[calc(100vh-53px)] flex flex-col justify-between p-6 md:p-14 lg:p-20 overflow-hidden"
        >
          {/* Subtle dark gradient overlay allowing the 3D Mars Globe to dominate */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#030403]/95 via-[#030403]/60 to-transparent pointer-events-none" />

          {/* Section Header */}
          <div className="max-w-2xl pointer-events-auto">
            <div className="flex items-center gap-2 text-[#F7C558] font-mono text-[10px] tracking-[1.6px] font-semibold uppercase">
              <span className="w-5 h-px bg-[#F7C558]" />
              <span>DESTINATION 02 · 225,000,000 KM AVERAGE DISTANCE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F5F3ED] my-3 leading-tight">
              The Red Horizon
              <span className="text-[#F7C558]">.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#D3D2CA] leading-relaxed max-w-xl">
              <em className="text-[#F7C558] not-italic font-semibold">
                &ldquo;On Mars, we had to explore without a driver.
              </em>{' '}
              In 1976, Viking 1 opened its camera eye and sent Earth a picture of pebbles beside its
              own dusty foot. In 1997, Pathfinder bounced in on airbags. When its petals opened,
              little Sojourner rolled down a ramp on six wheels to inspect Barnacle Bill.&rdquo;
            </p>

            <div className="flex items-center gap-3 mt-4 text-xs font-mono">
              <span className="px-2.5 py-1 bg-[#161812] border border-[#7C7D66]/40 text-[#E4E4D7] rounded">
                MOLA ELEVATION RELIEF
              </span>
              <span className="text-amber-400">GRAVITY: 3.71 m/s²</span>
              <span className="text-orange-400">CHRYSE PLANITIA & ARES VALLIS</span>
            </div>
          </div>

          {/* Mars Exhibits Cards Grid */}
          <div className="pointer-events-auto my-6">
            <div className="text-[10px] font-mono tracking-wider text-[#A8AAA0] uppercase mb-3 flex items-center justify-between">
              <span>MARTIAN SURFACE HARDWARE CATALOG</span>
              <span className="text-[#F7C558]">CLICK TO FOCUS ON 3D MARS GLOBE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {marsExhibits.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectArtifact(item.targetArtifactId);
                    playBeep(640, 0.1);
                  }}
                  className="group relative bg-[#10120F]/90 hover:bg-[#181B15] border border-[#33352F] hover:border-[#F7C558] rounded p-3.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded bg-[#1A1C17] mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-black/70 text-orange-300 rounded border border-orange-500/30">
                      {item.world}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-[#F7C558] bg-black/80 px-1 rounded">
                      {item.figNo}
                    </span>
                  </div>

                  {/* Card Metadata */}
                  <div className="text-[9px] font-mono text-[#C5AB75] uppercase">
                    {item.mission} · {item.year}
                  </div>
                  <h3 className="text-sm font-bold text-[#F5F3ED] mt-0.5 group-hover:text-[#F7C558] transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                    {item.site}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {item.quote}
                  </p>
                </div>
              ))}

              {/* Opportunity Rover Bonus Card */}
              <div
                onClick={() => {
                  onSelectArtifact('ART-MERB-OPPORTUNITY');
                  playBeep(640, 0.1);
                }}
                className="group relative bg-[#10120F]/90 hover:bg-[#181B15] border border-[#33352F] hover:border-[#F7C558] rounded p-3.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded bg-[#1A1C17] mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-amber-900/60 to-slate-900 flex items-center justify-center p-3 text-center">
                    <div>
                      <div className="text-amber-300 font-mono text-xs font-bold">
                        45.16 KM TRAVERSE
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">
                        MERIDIANI TO PERSEVERANCE VALLEY
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-black/70 text-orange-300 rounded border border-orange-500/30">
                    Mars
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-cyan-400 bg-black/80 px-1 rounded">
                    5,352 SOLS
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#C5AB75] uppercase">
                  MER-B · 2004—2018
                </div>
                <h3 className="text-sm font-bold text-[#F5F3ED] mt-0.5 group-hover:text-[#F7C558] transition-colors truncate">
                  Opportunity Rover
                </h3>
                <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                  Endeavour Crater Outcrops
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  Operated for nearly 15 years in Martian regolith, discovering hematite spherules
                  and aqueous ancient clay environments.
                </p>
              </div>

              {/* Perseverance Rover Bonus Card */}
              <div
                onClick={() => {
                  onSelectArtifact('ART-M2020-PERSEVERANCE');
                  playBeep(640, 0.1);
                }}
                className="group relative bg-[#10120F]/90 hover:bg-[#181B15] border border-[#33352F] hover:border-[#F7C558] rounded p-3.5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded bg-[#1A1C17] mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-red-900/60 to-slate-900 flex items-center justify-center p-3 text-center">
                    <div>
                      <div className="text-red-300 font-mono text-xs font-bold">
                        SAMPLE RETURN CACHING
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">
                        JEZERO CRATER DELTA
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-black/70 text-orange-300 rounded border border-orange-500/30">
                    Mars
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-emerald-400 bg-black/80 px-1 rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#C5AB75] uppercase">
                  MARS 2020 · 2021—PRESENT
                </div>
                <h3 className="text-sm font-bold text-[#F5F3ED] mt-0.5 group-hover:text-[#F7C558] transition-colors truncate">
                  Perseverance & Ingenuity
                </h3>
                <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                  Neretva Vallis Delta
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  Caching sealed geological core samples for future Mars Sample Return while
                  documenting atmospheric and regolith dynamics.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Nav / Next Scroll Trigger */}
          <div className="pointer-events-auto flex items-center justify-between pt-4 border-t border-[#363833] text-xs font-mono">
            <button
              type="button"
              onClick={() => onOpenWorkspace('search_catalog')}
              className="flex items-center gap-1.5 text-[#F7C558] hover:underline"
            >
              <span>Explore Complete Martian Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(labRef)}
              className="flex items-center gap-2 text-[#BABBAF] hover:text-[#F7C558] text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <span>EXPLORE SOLAR SYSTEM SIMULATION</span>
              <ChevronDown className="w-4 h-4 text-[#F7C558] animate-bounce" />
            </button>
          </div>
        </section>

        {/* SECTION 4: SIMULATION SYSTEM (Full Solar System 3D View) */}
        <section
          id="section-lab"
          ref={labRef}
          style={{ scrollSnapAlign: 'start' }}
          className="relative min-h-[calc(100vh-53px)] flex flex-col justify-between p-6 md:p-14 lg:p-20 overflow-hidden bg-transparent pointer-events-none"
        >
          {/* Top subtle indicator badge */}
          <div className="pointer-events-auto max-w-xl">
            <div className="flex items-center gap-2 text-[#F7C558] font-mono text-[10px] tracking-[1.6px] font-semibold uppercase">
              <span className="w-5 h-px bg-[#F7C558]" />
              <span>HELIOCENTRIC SIMULATION · THE SUN & DEEP SPACE</span>
            </div>
          </div>

          {/* Bottom navigation controls strip */}
          <div className="pointer-events-auto flex items-center justify-between pt-4 border-t border-[#363833]/40 text-xs font-mono">
            <button
              type="button"
              onClick={scrollToPrev}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B0E17]/85 hover:bg-[#141824] border border-slate-800 hover:border-[#F7C558] text-[#D3D2CA] hover:text-[#F7C558] rounded transition-colors shadow-lg"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#F7C558]" />
              <span>Scroll Up to Mars</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(heroRef)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B0E17]/85 hover:bg-[#141824] border border-slate-800 hover:border-[#F7C558] text-[#F5F3ED] hover:text-[#F7C558] rounded transition-colors shadow-lg"
            >
              <ChevronUp className="w-3.5 h-3.5 text-[#F7C558]" />
              <span>Back to Solar System Top ↑</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
