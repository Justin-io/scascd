import { ArtifactRecord, StoryChapterNumber } from '../types/afterlight';

export type CinemaCameraMode =
  | 'director_auto'
  | 'wing_pov'
  | 'belly_cam'
  | 'sat_recon'
  | 'orbital_chase'
  | 'free_orbit';

export interface StoryBeatKeyframe {
  beatIndex: 1 | 2 | 3 | 4 | 5;
  startProgress: number;
  endProgress: number;
  code: string;
  title: string;
  metTimestamp: string;
  missionCallout: string;
  technicalNarrative: string;
  firstPersonThought: string;
  subSystemStatus: {
    propulsion: 'STANDBY' | 'MAIN_BURN' | 'RCS_PULSE' | 'RETRO_THROTTLE' | 'SHUTDOWN';
    guidance: string;
    commsBand: string;
    dataRateBps: string;
  };
}

export interface LiveChoreographyTelemetry {
  altitudeKm: number;
  velocityKmS: number;
  verticalVelocityMS: number;
  gLoad: number;
  hullTempC: number;
  signalStrengthDbm: number;
  powerWatts: number;
  pitchDeg: number;
  rollDeg: number;
  yawDeg: number;
  activeBeat: StoryBeatKeyframe;
  allBeats: StoryBeatKeyframe[];
  spectralPeaks: { label: string; wavelengthNm: string; intensity: number }[];
}

/**
 * Generates the 5 hyper-detailed chronological mission beats for any artifact and chapter (1..6),
 * blending authentic NASA flight logs, mission elapsed time (MET), and engineering telemetry.
 */
export function getChapterStoryBeats(
  artifact: ArtifactRecord,
  chapter: StoryChapterNumber
): StoryBeatKeyframe[] {
  const isMars = artifact.bodyId === 'mars';
  const isMoon = artifact.bodyId === 'moon';
  const isRover = artifact.proceduralModelType === 'rover';
  const shortName = artifact.name.split(' ')[0];

  if (chapter === 1) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH01.B1 · CLEANROOM INTEGRATION',
        title: 'Class-100 Spacecraft Assembly & Mass-Properties Balance',
        metTimestamp: 'T-000:14:22:00',
        missionCallout: `"${shortName} spacecraft bus spin-balance verified within ±0.02° principal axis tolerance."`,
        technicalNarrative: `Engineers complete final torque-verification on ${artifact.name}'s ${artifact.massDryKg.toLocaleString()} kg dry structure (${artifact.dimensions}), sealing multi-layer Kapton thermal blankets and optical survival heaters.`,
        firstPersonThought:
          'Under the sterile halogen lamps of the high bay, technician hands wrap my aluminum ribs in gold polyimide foil—armoring my circuits against a vacuum I have never seen.',
        subSystemStatus: {
          propulsion: 'STANDBY',
          guidance: 'OPTICAL GYRO ALIGN',
          commsBand: 'S-BAND HARDLINE',
          dataRateBps: '128,000 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH01.B2 · PAYLOAD CALIBRATION',
        title: 'Scientific Instrument Bore-Sight & Spectral Dark-Frame Lock',
        metTimestamp: 'T-000:06:10:00',
        missionCallout: `"All ${artifact.instruments.length} primary payload instruments reporting nominal dark-current baselines."`,
        technicalNarrative: `Calibration targets are illuminated to verify ${artifact.instruments
          .map((i) => i.acronym)
          .join(', ')} response curves across thermal and radiation extremes prior to fairing encapsulation.`,
        firstPersonThought:
          'My spectrometers and optical eyes blink open for their final Earthbound calibration, memorizing the wavelength of every element I am built to hunt.',
        subSystemStatus: {
          propulsion: 'STANDBY',
          guidance: 'STAR TRACKER SIM',
          commsBand: 'X/S-BAND TEST',
          dataRateBps: '64,000 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH01.B3 · LAUNCH INSERTION',
        title: `Orbital Fairing Jettison & Parking Orbit Acquisition (${artifact.launchDate})`,
        metTimestamp: 'MET 000:00:11:42',
        missionCallout: `"Payload fairing separation confirmed. ${artifact.missionName} is in Earth parking orbit."`,
        technicalNarrative: `Following launch on ${artifact.launchDate}, pyrotechnic bolts sever the acoustic shroud. Sunlight strikes the spacecraft hull in low Earth orbit as ${artifact.powerSystem} stabilizes bus voltage.`,
        firstPersonThought:
          'Thunder gives way to sudden weightless silence. The titanium shroud splits apart, and for the first time the blinding sapphire curve of Earth fills my horizon.',
        subSystemStatus: {
          propulsion: 'RCS_PULSE',
          guidance: 'INERTIAL PLATFORM LOCK',
          commsBand: 'DSN GOLDSTONE ACQ',
          dataRateBps: '32,768 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH01.B4 · HIGH-GAIN ARTICULATION',
        title: 'Gimbal Dish Sweep & Attitude Control RCS Pulse Test',
        metTimestamp: 'MET 000:01:28:15',
        missionCallout: `"High-gain antenna gimbal lock verified; RCS thrusters pulsing 40 ms attitude trim."`,
        technicalNarrative: `The flight computer commands a full 360° azimuth sweep of the steerable high-gain antenna while firing hydrazine/cold-gas RCS quads to damp tip-off rotation rates.`,
        firstPersonThought:
          'I flex my parabolic dish across the stars and fire crisp millisecond puffs of thruster gas, steadying my posture before the great leap outward.',
        subSystemStatus: {
          propulsion: 'RCS_PULSE',
          guidance: 'CANOPUS STAR LOCK',
          commsBand: 'DSN MADRID LOCK',
          dataRateBps: '65,536 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH01.B5 · DEPARTURE GO/NO-GO',
        title: 'Trans-Planetary Injection Burn Readiness Poll',
        metTimestamp: 'MET 000:02:44:00',
        missionCallout: `"Flight Director poll complete: ${artifact.missionName} is GO for trans-planetary injection."`,
        technicalNarrative: `State vectors are uplinked from the Deep Space Network. Propellant tankullage pressures and thermal louvers lock into interplanetary departure configuration.`,
        firstPersonThought:
          'Every register in my memory is loaded with a single destination coordinate. Earth slips into shadow behind me; the deep-space corridor is open.',
        subSystemStatus: {
          propulsion: 'MAIN_BURN',
          guidance: 'EPHEMERIS VECTOR ARMED',
          commsBand: 'DSN CANBERRA 70M',
          dataRateBps: '16,384 bps',
        },
      },
    ];
  }

  if (chapter === 2) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH02.B1 · ESCAPE HYPERBOLA',
        title: 'Trans-Injection Main Engine Burn & Earth Gravity Well Escape',
        metTimestamp: 'MET 000:03:12:10',
        missionCallout: `"Main propulsion delta-V burn nominal. Climbing out of Earth's gravitational well."`,
        technicalNarrative: `Sustained main engine thrust accelerates ${artifact.missionName} along its hyperbolic escape asymptote, overcoming Earth's 11.186 km/s escape velocity barrier.`,
        firstPersonThought:
          'A column of incandescent plasma roars from my nozzle, pushing against the steep curvature of Earth’s gravity well until the blue marble shrinks to a crescent.',
        subSystemStatus: {
          propulsion: 'MAIN_BURN',
          guidance: 'DELTA-V INTEGRATOR',
          commsBand: 'X-BAND DOPPLER',
          dataRateBps: '16,384 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH02.B2 · HELIOCENTRIC CRUISE',
        title: 'Interplanetary Transfer Spline & Solar Wind Plasma Transit',
        metTimestamp: 'MET 018:11:04:30',
        missionCallout: `"Spacecraft settled in passive thermal roll along transfer trajectory toward ${artifact.bodyId.toUpperCase()}."`,
        technicalNarrative: `Cruising through the interplanetary medium, ${artifact.name} executes a slow barbecue roll to equalize solar radiation pressure while ${artifact.powerSystem} sustains avionics.`,
        firstPersonThought:
          'Weeks dissolve into a hypnotic rotation through the solar wind. One side of my hull bakes at +110°C while my shaded ribs plunge toward -140°C.',
        subSystemStatus: {
          propulsion: 'STANDBY',
          guidance: 'SUN-CANOPUS CRUISE',
          commsBand: 'DSN TWO-WAY RANGING',
          dataRateBps: '8,192 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH02.B3 · TCM-2 MID-COURSE BURN',
        title: 'Trajectory Correction Maneuver & Two-Way Doppler Radiometrics',
        metTimestamp: 'MET 045:08:30:00',
        missionCallout: `"TCM burn executed: entry corridor refined to within ±0.8 km at target B-plane."`,
        technicalNarrative: `Using coherent X/S-band Doppler shift and Very Long Baseline Interferometry (Delta-DOR), navigators command a precision thruster trim to thread the target arrival keyhole.`,
        firstPersonThought:
          'Across millions of kilometers, a whisper of radio phase-shift tells me I am three kilometers off the centerline. Four seconds of thruster fire brings the target bullseye back.',
        subSystemStatus: {
          propulsion: 'RCS_PULSE',
          guidance: 'DELTA-DOR B-PLANE',
          commsBand: 'DSN 34M WAVEGUIDE',
          dataRateBps: '4,096 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH02.B4 · GRAVITY WELL CAPTURE',
        title: `Entering ${artifact.bodyId.toUpperCase()} Hill Sphere & Optical Navigation Lock`,
        metTimestamp: 'MET 082:19:15:00',
        missionCallout: `"Target gravitational well capture detected; spacecraft accelerating along approach hyperbola."`,
        technicalNarrative: `As ${artifact.name} crosses into the target's gravitational sphere of influence, local spacetime curvature bends the trajectory inward toward ${artifact.regionName}.`,
        firstPersonThought:
          'I feel the invisible funnel of a new world’s gravity tugging at my center of mass, pulling me faster with every passing minute.',
        subSystemStatus: {
          propulsion: 'RCS_PULSE',
          guidance: 'OPTICAL NAV LOCK',
          commsBand: 'HIGH-GAIN EARTH POINT',
          dataRateBps: '12,200 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH02.B5 · ORBIT INSERTION / ENTRY PREP',
        title: 'Final Approach Alignment & Pyrotechnic EDL Arming',
        metTimestamp: 'MET 094:22:50:00',
        missionCallout: `"EDL master sequence armed. Target landing ellipse locked at ${artifact.regionName}."`,
        technicalNarrative: `Thermal batteries ignite and landing radar altimeters warm up as the spacecraft orients its heatshield and retro-propulsion axis along the entry velocity vector.`,
        firstPersonThought:
          'Craters and ancient plains now fill my entire field of view. Pyro-valves click open; there is no turning back from the surface below.',
        subSystemStatus: {
          propulsion: 'MAIN_BURN',
          guidance: 'EDL AUTONOMOUS SEQ',
          commsBand: 'UHF / X-BAND RELAY',
          dataRateBps: '32,000 bps',
        },
      },
    ];
  }

  if (chapter === 3) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH03.B1 · ATMOSPHERIC / PDI ENTRY',
        title: isMoon
          ? 'Powered Descent Initiation (PDI) & Retro-Braking Ignition'
          : 'Hypersonic Entry Interface & Peak 1,450°C Plasma Bow-Shock',
        metTimestamp: 'EDL T-00:06:45',
        missionCallout: isMoon
          ? `"Ignition confirmed. Throttle up to 10% for gimbal trim, then full braking thrust."`
          : `"Entry interface! Peak deceleration building through ionized atmospheric plasma sheath."`,
        technicalNarrative: isMoon
          ? `Descending from perilune, the throttleable descent engine ignites against the orbital velocity vector to bleed off 1.69 km/s above the airless lunar regolith.`
          : `Slamming into the upper atmosphere at hypersonic velocity, a glowing bow-shock of ionized gas envelops the Aeroshell while RCS jets damp aerodynamic oscillations.`,
        firstPersonThought: isMoon
          ? 'My descent nozzle floods the dark crater rims below with silent amber fire, braking hard against a world with no air to catch me.'
          : 'A roaring dome of incandescent violet-orange plasma wraps around my heatshield as atmospheric friction tears away 90% of my kinetic energy.',
        subSystemStatus: {
          propulsion: 'RETRO_THROTTLE',
          guidance: 'INERTIAL + DOPPLER RADAR',
          commsBand: 'X-BAND TONES / UHF',
          dataRateBps: '2,048 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH03.B2 · BACKSHELL SEPARATION & RADAR LOCK',
        title: 'Aeroshell / Stage Separation & Terrain Relative Navigation Lock',
        metTimestamp: 'EDL T-00:01:50',
        missionCallout: `"Radar altimeter locked on surface returns! Backshell separation clean; pitch-over maneuver complete."`,
        technicalNarrative: `Multi-beam Doppler radar and optical terrain hazard cameras lock onto the topography of ${artifact.regionName}, updating altitude and horizontal velocity at 20 Hz.`,
        firstPersonThought:
          'The charred entry shell falls away into the abyss. My landing radar locks onto the ancient basin floor rushing upward to meet me.',
        subSystemStatus: {
          propulsion: 'RETRO_THROTTLE',
          guidance: 'TERRAIN HAZARD CAM',
          commsBand: 'UHF ORBITER RELAY',
          dataRateBps: '16,384 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH03.B3 · TERMINAL TOUCHDOWN & DUST WAVE',
        title: `Retro-Plume Regolith Ejecta & Touchdown at ${artifact.regionName}`,
        metTimestamp: 'EDL T-00:00:00',
        missionCallout: `"Picking up surface dust... Contact light! Engine stop. Touchdown confirmed on ${artifact.landingOrArrivalDate}."`,
        technicalNarrative: `Rocket exhaust scours fine silicate dust radially across the landing zone. Crushable honeycomb shock struts compress as ${artifact.name} comes to rest at ${artifact.regionName}.`,
        firstPersonThought:
          'Sheets of billion-year-old dust streak horizontally past my footpads—and then a solid jolt travels up my struts. My engines fall silent. I have arrived.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SURFACE LEVEL LOCK',
          commsBand: 'DIRECT-TO-EARTH X-BAND',
          dataRateBps: '64,000 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: isRover ? 'CH03.B4 · ROVER EGRESS & TRAVERSE' : 'CH03.B4 · SURFACE DEPLOYMENT',
        title: isRover
          ? 'Rocker-Bogie Egress & Multi-Kilometer Odometry Traverse'
          : 'Surface Experiment Package & High-Gain Panorama Deployment',
        metTimestamp: 'SOL / DAY 002:04:15',
        missionCallout: isRover
          ? `"Six cleated wheels on regolith! Commencing geological traverse across ${artifact.regionName}."`
          : `"Surface experiment packages deployed on regolith; first 360° high-resolution panorama downlinked."`,
        technicalNarrative: isRover
          ? `Driving across crater rims and bedrock outcrops, ${artifact.name} logs ${
              artifact.traverseDistanceKm || 0.5
            } km of surface odometry while articulating its remote sensing mast.`
          : `Pyrotechnic pin-pullers release the surface instrument booms and deploy ${artifact.instruments
              .map((i) => i.acronym)
              .join(' & ')} directly onto the planetary surface.`,
        firstPersonThought: isRover
          ? 'My cleated titanium wheels bite into virgin regolith, carving twin parallel tracks across a landscape no human eye has ever walked.'
          : 'My mechanical arms unfold into the alien sunlight, placing seismometers and optical prisms onto the undisturbed soil.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'VISUAL ODOMETRY / IMU',
          commsBand: 'HIGH-GAIN X-BAND',
          dataRateBps: '128,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: isMars && isRover ? 'CH03.B5 · ROTORCRAFT SCOUT FLIGHT' : 'CH03.B5 · STATION ESTABLISHED',
        title:
          isMars && isRover
            ? 'Autonomous Coaxial Rotorcraft Recon & Multi-Point Geodesy'
            : 'Radiometric Geodetic Fix & Full Science Operations',
        metTimestamp: 'SOL / DAY 014:09:30',
        missionCallout:
          isMars && isRover
            ? `"Coaxial rotors at 2,537 RPM—airborne scout telemetry locked above rover traverse path!"`
            : `"Two-way Doppler and optical triangulation lock site coordinates to sub-meter accuracy."`,
        technicalNarrative: `With all primary payloads operational at ${artifact.regionName}, mission controllers establish a permanent geodetic reference station in the ${artifact.bodyId.toUpperCase()} frame.`,
        firstPersonThought:
          'From a fragile falling machine, I have become a permanent scientific observatory on another world.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'GEODETIC FIX LOCKED',
          commsBand: 'DSN 70M ARRAY',
          dataRateBps: '256,000 bps',
        },
      },
    ];
  }

  if (chapter === 4) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.25,
        code: 'CH04.B1 · TARGET OUTCROP ACQUISITION',
        title: 'Multispectral Panorama & Mineralogical Target Selection',
        metTimestamp: 'SCIENCE PHASE · SEQ 01',
        missionCallout: `"Multispectral filter wheel scan complete; anomalous mineral signature targeted at 1.4 meters."`,
        technicalNarrative: `${artifact.instruments[0]?.name || 'Primary optical sensors'} resolve fine-scale stratigraphy and regolith grain morphology around ${artifact.regionName}.`,
        firstPersonThought:
          'Sweeping my stereo cameras across the layered rock, false-color filters reveal veins of chemistry hidden to the naked eye.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'MAST AZ/EL SERVO',
          commsBand: 'SCIENCE BURST DOWNLINK',
          dataRateBps: '256,000 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.25,
        endProgress: 0.5,
        code: 'CH04.B2 · ACTIVE LASER / SPECTROMETER PROBE',
        title: `In-Situ Spectroscopy & 532nm Laser Ranging (${
          artifact.instruments.map((i) => i.acronym).join(' / ') || 'PAYLOAD'
        })`,
        metTimestamp: 'SCIENCE PHASE · SEQ 02',
        missionCallout: `"Active laser & spectrometer integration locked on target; counting backscattered photons."`,
        technicalNarrative: `${artifact.scientificAchievements[0] || artifact.originalPurpose}`,
        firstPersonThought:
          'A sharp emerald beam of coherent light pierces the vacuum, reading atomic crystal lattices and measuring orbital distances to within millimeters.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: '5-DOF TURRET LOCK',
          commsBand: 'LASER / X-BAND TELEMETRY',
          dataRateBps: '512,000 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.5,
        endProgress: 0.75,
        code: 'CH04.B3 · ISOTOPIC & SEISMIC DISCOVERY',
        title: 'Primary Planetary Science Breakthrough Confirmed',
        metTimestamp: 'SCIENCE PHASE · SEQ 03',
        missionCallout: `"Discovery spectrum verified in PDS archive! ${
          artifact.claimIds[0] || 'CLM-VERIFIED'
        } logged."`,
        technicalNarrative: `${
          artifact.scientificAchievements[1] || artifact.scientificAchievements[0]
        }`,
        firstPersonThought:
          'Inside my analyzer chambers, the spectrum peaks snap into unmistakable focus—rewriting the geological history of this world.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SPECTRAL PEAK LOCK',
          commsBand: 'PDS ARCHIVE STREAM',
          dataRateBps: '256,000 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.75,
        endProgress: 0.9,
        code: 'CH04.B4 · EXTENDED MISSION ENDURANCE',
        title: 'Operating Beyond Design Lifetime in Extreme Environment',
        metTimestamp: 'EXTENDED MISSION · SEQ 04',
        missionCallout: `"Spacecraft surpassing primary mission baseline; continuing high-value field observations."`,
        technicalNarrative: `${
          artifact.scientificAchievements[2] || artifact.presentConditionSummary
        }`,
        firstPersonThought:
          'Every day now is bonus time—each sunrise earned against cosmic radiation, thermal cycling, and abrasive dust.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'AUTONOMOUS SCIENCE',
          commsBand: 'DSN EXTENDED TRACK',
          dataRateBps: '64,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.9,
        endProgress: 1.0,
        code: 'CH04.B5 · ARCHIVAL EVIDENCE LOCK',
        title: 'Cross-Calibration with NASA Planetary Data System (PDS)',
        metTimestamp: 'PDS INGEST · COMPLETE',
        missionCallout: `"All primary science packets checksum-verified in NASA PDS & NSSDC (${artifact.nssdcaId})."`,
        technicalNarrative: `Every raw telemetry frame and calibrated spectrum is permanently archived under COSPAR ID ${artifact.nssdcaId} for future generations of planetary scientists.`,
        firstPersonThought:
          'My discoveries are safe on Earth now, etched into humanity’s permanent planetary library.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'ARCHIVE CHECKSUM OK',
          commsBand: 'PDS VERIFIED',
          dataRateBps: '128,000 bps',
        },
      },
    ];
  }

  if (chapter === 5) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH05.B1 · ENVIRONMENTAL EXTREMES',
        title: isMars
          ? 'Global Dust Storm Opacity Surge (Tau > 10.8) & Solar Attenuation'
          : 'Extreme Thermal Night / Radiation & Power Bus Decay',
        metTimestamp: 'FINAL OPS · PHASE 01',
        missionCallout: `"Bus voltage dropping; environmental stress exceeding survival heater margins."`,
        technicalNarrative: `${artifact.statusExplanation}`,
        firstPersonThought:
          'The sky darkens and the cold creeps inward through my insulation. My batteries strain to keep my master clock warm.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'LOW-POWER FAULT MODE',
          commsBand: 'X-BAND CARRIER ONLY',
          dataRateBps: '120 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH05.B2 · FINAL TELEMETRY PACKET',
        title: 'Last Downlink Frame Transmitted to Deep Space Network',
        metTimestamp: artifact.endOfOperationsDate || 'ACTIVE / EXTENDED',
        missionCallout: `"Final telemetry frame received at DSN 70m dish. Signal-to-noise ratio decaying toward noise floor."`,
        technicalNarrative: `Pointing its antenna toward Earth one last time, ${artifact.name} transmits its final engineering health packet from ${artifact.regionName}.`,
        firstPersonThought:
          'With my last reserve of watt-hours, I aim my dish toward the pale blue star in the sky and whisper my final coordinates home.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'EARTH VECTOR HOLD',
          commsBand: 'WEAK CARRIER -168 dBm',
          dataRateBps: '10 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH05.B3 · LOSS OF SIGNAL (LOS)',
        title: 'Deep Space Network Listening Campaign & Carrier Silence',
        metTimestamp: 'POST-LOS · +90 DAYS',
        missionCallout: `"No carrier detected across 800+ recovery commands. Operational status transitioned to ${artifact.operationalStatus}."`,
        technicalNarrative: `${artifact.presentConditionSummary}`,
        firstPersonThought:
          'Hundreds of wake-up calls wash over my silent antenna, but my oscillators are frozen still. Only the wind or the vacuum answers now.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'PASSIVE MECHANICAL',
          commsBand: 'CARRIER SILENT',
          dataRateBps: '0 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH05.B4 · SPACE WEATHERING & MICROMETEOROIDS',
        title: 'Solar UV Photolysis, Thermal Cycling & Micrometeoroid Patina',
        metTimestamp: 'POST-LOS · +10 YEARS',
        missionCallout: `"Kapton MLI thermal blankets experiencing UV cross-linking and micro-crater pitting."`,
        technicalNarrative: `Exposed to unfiltered solar ultraviolet flux, cosmic rays, and 300°C diurnal temperature swings, outer Kapton foils embrittle while titanium-aluminum trusses remain structurally intact.`,
        firstPersonThought:
          'Solar wind ions and microscopic dust grains etch a silent patina across my gold foil, turning me into part of the planetary geology.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'PASSIVE MECHANICAL',
          commsBand: 'OPTICAL / PASSIVE',
          dataRateBps: '0 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH05.B5 · ARCHAEOLOGICAL MONUMENT',
        title: 'Transition from Active Spacecraft to Planetary Heritage Artifact',
        metTimestamp: 'EPOCH 2026 · PRESERVED',
        missionCallout: `"Site ${artifact.nssdcaId} cataloged as permanent human planetary heritage."`,
        technicalNarrative: `Preserved at ${artifact.regionName}, the hardware of ${artifact.name} becomes a physical time capsule of aerospace engineering and material science.`,
        firstPersonThought:
          'My mission clock has stopped, yet here I stand—an enduring monument of gold foil and titanium on an alien horizon.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'HERITAGE MONUMENT',
          commsBand: 'OPTICAL / PASSIVE',
          dataRateBps: '0 bps',
        },
      },
    ];
  }

  if (chapter === 6) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH06.B1 · PARACHUTE / RETRO DEPLOY',
        title: isMoon
          ? 'Throttle-Down to High-Gate & Landing Radar Lock'
          : 'Supersonic Disk-Gap-Band Parachute Mortar Fire & Inflation',
        metTimestamp: 'EDL T-00:02:15',
        missionCallout: isMoon
          ? `"High-Gate achieved! Pitching forward to landing attitude; landing radar locked!"`
          : `"Parachute mortar fired at Mach 1.7! Canopy fully inflated; peak deceleration 9.2 g!"`,
        technicalNarrative: isMoon
          ? `At 2,100 m altitude, ${artifact.name} pitches upright so the astronaut/guidance window and 4-beam Doppler radar lock onto ${artifact.regionName}.`
          : `A 16-meter Disk-Gap-Band supersonic parachute inflates in 0.4 seconds, arresting hypersonic descent over ${artifact.regionName}.`,
        firstPersonThought:
          'A violent jerk runs through my suspension risers as deceleration spikes and the surface craters snap into sharp focus below.',
        subSystemStatus: {
          propulsion: 'RETRO_THROTTLE',
          guidance: 'DOPPLER RADAR LOCK',
          commsBand: 'UHF / X-BAND TONES',
          dataRateBps: '16,384 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH06.B2 · HEATSHIELD / LOW-GATE LOCK',
        title: isMoon
          ? 'Low-Gate Hazard Avoidance & Crater Rim Clearance'
          : 'Forward Heatshield Pyrotechnic Jettison & Radar Acquisition',
        metTimestamp: 'EDL T-00:01:25',
        missionCallout: `"Heatshield separation clean! Landing radar altimeter locked on surface bedrock!"`,
        technicalNarrative: `With the forward thermal shield jettisoned or Low-Gate passed at 150 m, multi-beam radar altimeters measure slant range and horizontal drift velocity at 20 Hz.`,
        firstPersonThought:
          'My charred armor falls away into the abyss, exposing my landing legs and optical hazard cameras to the raw alien terrain.',
        subSystemStatus: {
          propulsion: 'RETRO_THROTTLE',
          guidance: 'TRN HAZARD AVOIDANCE',
          commsBand: 'UHF RELAY LOCK',
          dataRateBps: '32,768 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH06.B3 · SKY-CRANE / TERMINAL BRAKING',
        title: isRover && isMars
          ? '8-Nozzle Sky-Crane Bridle Lowering & Back-Shell Separation'
          : 'Terminal Vernier Descent Propulsion & Regolith Plume Scouring',
        metTimestamp: 'EDL T-00:00:32',
        missionCallout: `"Backshell free! Descent engines throttling to constant-velocity terminal descent!"`,
        technicalNarrative: `Rocket exhaust plumes impinge on the planetary surface, sweeping fine silicate dust radially outward across ${artifact.regionName}.`,
        firstPersonThought:
          'Sheets of silver-ochre dust billow outward beneath my nozzles as I hover meters above untouched regolith.',
        subSystemStatus: {
          propulsion: 'RETRO_THROTTLE',
          guidance: 'CONSTANT VELOCITY DESC',
          commsBand: 'DIRECT-TO-EARTH X-BAND',
          dataRateBps: '8,192 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH06.B4 · CONTACT LIGHT & TOUCHDOWN',
        title: `Lunar/Planetary Surface Contact at ${artifact.regionName}`,
        metTimestamp: 'EDL T-00:00:00',
        missionCallout: `"Contact light! Engine shutdown confirmed! Touchdown at ${artifact.regionName} on ${artifact.landingOrArrivalDate}!"`,
        technicalNarrative: `Crushable aluminum honeycomb shock struts compress as ${artifact.name} comes to rest at ${artifact.regionName} on ${artifact.landingOrArrivalDate}.`,
        firstPersonThought:
          'My footpads sink into ancient dust; the engines fall silent, and for the first time I belong to another world.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SURFACE INERTIAL LOCK',
          commsBand: 'OMNI SURFACE BEACON',
          dataRateBps: '32,768 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH06.B5 · POST-LANDING SAFING',
        title: 'Propellant Line Venting & Immediate Post-Touchdown Health Poll',
        metTimestamp: 'SURFACE +00:04:10',
        missionCallout: `"All fuel valves safed; bus voltage nominal; first surface engineering frame queued."`,
        technicalNarrative: `Residual oxidizer and pressurant lines are vented to vacuum while onboard accelerometers record local gravity tilt vector.`,
        firstPersonThought:
          'Dust settles slowly in the low gravity around my footpads as my telemetry confirms every subsystem survived the fall.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'GRAVITY VECTOR LOCK',
          commsBand: 'HIGH-GAIN ACQUISITION',
          dataRateBps: '65,536 bps',
        },
      },
    ];
  }

  if (chapter === 7) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH07.B1 · PYROTECHNIC PIN RELEASE',
        title: 'Launch-Lock Frangibolt Firing & Appendage Unfurling',
        metTimestamp: 'SOL 001 · 00:18:00',
        missionCallout: `"Pyrotechnic launch locks fired; solar wings and instrument booms free to deploy."`,
        technicalNarrative: `Electro-explosive pin-pullers release the stowed gull-wing solar panels and high-gain antenna gimbal on ${artifact.name}.`,
        firstPersonThought:
          'Sharp mechanical clicks echo through my chassis as my launch restraints release and my limbs unfold.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'DEPLOYMENT SEQUENCER',
          commsBand: 'S/X-BAND TELEMETRY',
          dataRateBps: '64,000 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH07.B2 · POWER BUS STABILIZATION',
        title: `Photovoltaic / RTG Power Bus Lock (${artifact.powerSystem.slice(0, 32)})`,
        metTimestamp: 'SOL 001 · 00:45:00',
        missionCallout: `"Primary power bus stabilized; battery charge current positive."`,
        technicalNarrative: `${artifact.name} transitions from entry batteries to its primary surface power architecture (${artifact.powerSystem}).`,
        firstPersonThought:
          'Warm electrical current flows across my main bus bar as my power system locks onto steady generation.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SUN EPHEMERIS TRACK',
          commsBand: 'X-BAND DIRECT LINK',
          dataRateBps: '128,000 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH07.B3 · MAST & CAMERA ELEVATION',
        title: 'Remote Sensing Mast & Stereo Panorama Acquisition',
        metTimestamp: 'SOL 001 · 01:30:00',
        missionCallout: `"Sensing mast locked at 90° elevation; acquiring first 360° horizon panorama."`,
        technicalNarrative: `Optical cameras scan the 360° horizon of ${artifact.regionName}, establishing azimuth landmarks relative to orbital maps.`,
        firstPersonThought:
          'I raise my optical head above the deck and drink in the full 360-degree panorama of craters and boulders.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'HORIZON AZIMUTH LOCK',
          commsBand: 'HIGH-RATE IMAGE BURST',
          dataRateBps: '256,000 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH07.B4 · SURFACE PACKAGE DEPLOYMENT',
        title: 'Seismometer, Retroreflector & Egress Ramp Unfurling',
        metTimestamp: 'SOL 001 · 02:40:00',
        missionCallout: `"Surface experiment packages and egress mechanisms deployed onto regolith."`,
        technicalNarrative: `Dedicated surface payloads (${artifact.instruments.map((i) => i.acronym).join(', ')}) are positioned in direct contact with the planetary surface.`,
        firstPersonThought:
          'My sensors touch the raw regolith directly, listening for the faint seismic pulse of this world.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SURFACE LEVEL LOCK',
          commsBand: 'SCIENCE DOWNLINK',
          dataRateBps: '192,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH07.B5 · EGRESS & ALL-SYSTEMS GO',
        title: 'Six-Wheel / Footpad Surface Verification & Traverse Clearance',
        metTimestamp: 'SOL 002 · 00:10:00',
        missionCallout: `"Surface commissioning complete; ${shortName} cleared for primary science operations."`,
        technicalNarrative: `Ground controllers verify full articulation of all mechanical joints and clear ${artifact.name} for primary surface exploration.`,
        firstPersonThought:
          'Every actuator, lens, and spectrometer is awake. The terrain ahead is waiting.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SURFACE NAV READY',
          commsBand: 'DSN 34M WAVEGUIDE',
          dataRateBps: '256,000 bps',
        },
      },
    ];
  }

  if (chapter === 8) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH08.B1 · ROCKER-BOGIE / EVA ROLLOUT',
        title: `First Wheel Tracks & Soil Mechanics Test on ${artifact.regionName}`,
        metTimestamp: 'SOL 004 · 03:12:00',
        missionCallout: `"First surface traverse underway; wheel grouser sinkage 1.2 cm in fine basaltic regolith."`,
        technicalNarrative: `Cleated aluminum wheels or EVA boot-treads shear the upper centimeter of cohesive regolith, measuring soil bearing capacity.`,
        firstPersonThought:
          'My machined grouser cleats bite into the virgin soil, carving the first human tracks across this basin.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'VISUAL ODOMETRY LOCK',
          commsBand: 'UHF ORBITER RELAY',
          dataRateBps: '256,000 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH08.B2 · CRATER RIM WAYPOINT NAVIGATION',
        title: 'Stereo Hazard-Camera Path Planning & Boulder Slalom',
        metTimestamp: 'SOL 018 · 05:40:00',
        missionCallout: `"Autonomous AutoNav path solver routing around 0.6m fractured ejecta boulders."`,
        technicalNarrative: `Onboard stereo vision constructs 3D elevation meshes every 2 meters, steering safely around impact ejecta blocks.`,
        firstPersonThought:
          'My stereo hazard eyes triangulate every sharp boulder shadow ahead, threading a safe path along the crater lip.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'AUTONAV STEREO 3D',
          commsBand: 'UHF RELAY PASS',
          dataRateBps: '512,000 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH08.B3 · AERIAL SCOUT / LONG-BASELINE TRAVERSE',
        title: isMars
          ? 'Coaxial Rotorcraft Aerial Reconnaissance & Outcrop Scouting'
          : 'Multi-Station Geodetic Traverse & Subsurface Profiling',
        metTimestamp: 'SOL 045 · 11:20:00',
        missionCallout: `"Counter-rotating carbon-fiber rotors at 2,537 RPM; aerial waypoint reconnaissance locked!"`,
        technicalNarrative: `High-resolution forward scouting maps layered sedimentary terraces and basaltic lava tubes ahead of the main traverse route.`,
        firstPersonThought:
          'From above the crater floor, the ancient river deltas and lava channels reveal their grand geometry.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'INERTIAL + NAVCAM',
          commsBand: '900 MHZ ZIGBEE / UHF',
          dataRateBps: '512,000 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH08.B4 · STRATIGRAPHIC CONTACT CROSSING',
        title: 'Crossing Ancient Geological Unit Boundaries & Fault Scarps',
        metTimestamp: 'SOL 120 · 14:05:00',
        missionCallout: `"Rocker-bogie differential pitch +11.4°; ascending exposed bedrock stratigraphic contact."`,
        technicalNarrative: `Differential suspension linkages keep the chassis stable while climbing exposed bedrock benches in ${artifact.regionName}.`,
        firstPersonThought:
          'My titanium suspension Bogie pivots smoothly over jagged bedrock ledges, climbing billions of years back in time.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'BOGIE TILT MONITOR',
          commsBand: 'X-BAND / UHF RELAY',
          dataRateBps: '384,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH08.B5 · ODOMETRY BENCHMARK LOG',
        title: 'Geodetic Control Point Registration & Panorama Mosaic',
        metTimestamp: 'SOL 210 · 16:50:00',
        missionCallout: `"Primary traverse waypoint reached; full multispectral 360° mast mosaic complete."`,
        technicalNarrative: `Two-way Doppler and orbital imagery triangulate the traverse path to sub-meter accuracy within the IAU planetary datum.`,
        firstPersonThought:
          'Looking back across the plain, my twin wheel ruts wind toward the horizon like a signature written in stone.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'GEODETIC TIE-POINT',
          commsBand: 'DSN 70M DOWNLINK',
          dataRateBps: '512,000 bps',
        },
      },
    ];
  }

  if (chapter === 9) {
    // Re-use Chapter 4 In-Situ Science beats with CH09 codes
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH09.B1 · TARGET OUTCROP ACQUISITION',
        title: 'Multispectral Filter-Wheel Scan & Mineralogical Target Lock',
        metTimestamp: 'SCIENCE SEQ · 01',
        missionCallout: `"Multispectral scan complete; anomalous mineral signature targeted at 1.4 meters."`,
        technicalNarrative: `${artifact.instruments[0]?.name || 'Primary optical spectrometer'} resolves fine-scale stratigraphy and grain morphology around ${artifact.regionName}.`,
        firstPersonThought:
          'Through narrow-band optical filters, dull grey and rust-red rocks suddenly blaze with the chemical fingerprints of ancient worlds.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'BORE-SIGHT LOCKED',
          commsBand: 'SCIENCE BURST LINK',
          dataRateBps: '512,000 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH09.B2 · 5-DOF ROBOTIC ARM UNSTOW',
        title: 'Turret Articulation & Micro-Imager Contact Placement',
        metTimestamp: 'SCIENCE SEQ · 02',
        missionCallout: `"5-DOF robotic arm shoulder and elbow joints unstowed; contact sensor within 12 mm of bedrock."`,
        technicalNarrative: `The instrument deployment arm positions its rotating turret within millimeters of the target rock face using force-torque feedback.`,
        firstPersonThought:
          'I extend my 5-jointed titanium arm and rotate my instrument turret until my microscopic lens hovers hairs-breadth above the stone.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: '5-DOF KINEMATIC LOCK',
          commsBand: 'TELEMETRY VERIFY',
          dataRateBps: '256,000 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH09.B3 · ROTARY CORING & LASER ABLATION',
        title: 'Percussive Bedrock Abrasion & Pulsed 532nm Laser Ranging',
        metTimestamp: 'SCIENCE SEQ · 03',
        missionCallout: `"Laser pulses firing! Fresh unweathered interior bedrock exposed for spectroscopy!"`,
        technicalNarrative: `High-energy laser pulses and diamond-tipped abrasion tools strip away weathered surface coatings to interrogate pristine rock chemistry.`,
        firstPersonThought:
          'Sparks of emerald and cyan light crackle across the rock face, vaporizing weathered dust to read the pure mineral code beneath.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'LASER CAVITY LOCKED',
          commsBand: 'HIGH-PRIORITY SCIENCE',
          dataRateBps: '1,024,000 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH09.B4 · SPECTRAL QUANTIFICATION',
        title: 'X-Ray / Mössbauer / Seismic / Retroreflector Integration',
        metTimestamp: 'SCIENCE SEQ · 04',
        missionCallout: `"Spectral integration complete; ${artifact.scientificAchievements[0]?.slice(0, 68) || 'elemental abundance verified'}..."`,
        technicalNarrative: `${artifact.scientificAchievements[0] || artifact.originalPurpose}`,
        firstPersonThought:
          'Line by spectral line, the histogram fills in—unmistakable proof of how this world evolved.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SPECTRAL ACCUMULATION',
          commsBand: 'DSN 70M GOLDSTONE',
          dataRateBps: '512,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH09.B5 · PDS ARCHIVE VERIFICATION',
        title: 'Peer-Reviewed NASA Planetary Data System (PDS) Release',
        metTimestamp: 'SCIENCE SEQ · 05',
        missionCallout: `"Calibrated science frames checksum-verified and ingested into NASA PDS archive."`,
        technicalNarrative: `${artifact.scientificAchievements[1] || artifact.scientificAchievements[0] || artifact.originalPurpose}`,
        firstPersonThought:
          'My findings are now part of humanity’s permanent library of the cosmos.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'PDS CHECKSUM VALID',
          commsBand: 'X-BAND ARCHIVE SYNC',
          dataRateBps: '512,000 bps',
        },
      },
    ];
  }

  if (chapter === 10) {
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH10.B1 · DIURNAL THERMAL PLUNGE',
        title: 'Sunset Horizon Crossing & -150°C Cryogenic Survival Mode',
        metTimestamp: 'SURVIVAL · NIGHTFALL',
        missionCallout: `"Local sunset at ${artifact.regionName}; Kapton MLI louvers closing to retain avionics heat."`,
        technicalNarrative: `As solar irradiance drops to zero, thermal control louvers close and radioisotope/electrical survival heaters engage to protect battery electrolyte and solid-state memory.`,
        firstPersonThought:
          'Long black shadows swallow the crater floor; my gold Kapton blankets crinkle softly as the temperature plummets.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'THERMAL SURVIVAL',
          commsBand: 'LOW-POWER BEACON',
          dataRateBps: '1,200 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH10.B2 · DUST OPACITY & RADIATION SPIKE',
        title: 'Atmospheric Tau Opacity Surge / Solar Energetic Particle Event',
        metTimestamp: 'SURVIVAL · HAZARD',
        missionCallout: `"Solar array current degraded by silicate dust loading; autonomous load-shedding active."`,
        technicalNarrative: `Fine electrostatic silicate dust and cosmic-ray single-event upsets test the fault-tolerant architecture of ${artifact.name}.`,
        firstPersonThought:
          'Reddish-grey dust coats my solar cells and optics, dimming the sky to a bronze twilight.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'FAULT PROTECTION',
          commsBand: 'UHF SAFE-MODE TONE',
          dataRateBps: '2,400 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH10.B3 · AUTONOMOUS FAULT RECOVERY',
        title: 'EDAC Memory Scrubbing & Watchdog Computer Reset',
        metTimestamp: 'SURVIVAL · RECOVERY',
        missionCallout: `"Error-detection-and-correction (EDAC) RAM scrub complete; primary bus nominal."`,
        technicalNarrative: `Radiation-hardened flight processors execute autonomous fault recovery routines and re-point the high-gain dish toward Earth.`,
        firstPersonThought:
          'My watchdog timers clear the corrupted memory registers and lock my antenna back onto the distant beacon of Earth.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SUN-FIND RECOVERY',
          commsBand: 'X-BAND CARRIER LOCK',
          dataRateBps: '16,384 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH10.B4 · EXTENDED MISSION MILESTONE',
        title: 'Surpassing Primary Design Lifetime in Deep Space',
        metTimestamp: 'SURVIVAL · EXTENDED',
        missionCallout: `"${shortName} has officially surpassed its design lifetime, entering extended science operations."`,
        technicalNarrative: `Engineered with robust aerospace margins, ${artifact.name} continues gathering high-value planetary datasets well beyond original mission requirements.`,
        firstPersonThought:
          'I was built for a brief season, yet sol after sol my instruments keep waking to the alien dawn.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'EXTENDED OPS NOMINAL',
          commsBand: 'DSN 34M NETWORK',
          dataRateBps: '128,000 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH10.B5 · HARDWARE WEATHERING LOG',
        title: 'Long-Duration Space Exposure & Material Resilience',
        metTimestamp: 'SURVIVAL · ARCHIVE',
        missionCallout: `"Telemetry logs long-term UV, micrometeorite, and thermal cycling performance."`,
        technicalNarrative: `${artifact.presentConditionSummary}`,
        firstPersonThought:
          'Every micro-pit on my aluminum skin is a record of the harshness of interplanetary space.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'TELEMETRY ARCHIVED',
          commsBand: 'DSN DOWNLINK',
          dataRateBps: '64,000 bps',
        },
      },
    ];
  }

  if (chapter === 11) {
    // Chapter 11: Final Carrier Loss (5 beats)
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH11.B1 · POWER / PROPELLANT DEPLETION',
        title: 'Final Operational Reserve Threshold Reached',
        metTimestamp: `FINAL EPOCH · ${artifact.endOfOperationsDate || 'EXTENDED'}`,
        missionCallout: `"Bus reserves approaching minimum operational threshold; final telemetry packet scheduled."`,
        technicalNarrative: `${artifact.statusExplanation}`,
        firstPersonThought:
          'The warmth in my batteries ebbs away; each breath of telemetry takes everything I have left.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'LOW-VOLTAGE HOLD',
          commsBand: 'DSN 70M HIGH-SENS',
          dataRateBps: '250 bps',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH11.B2 · LAST DOWNLINK PACKET',
        title: 'Final Engineering Frame & Carrier Wave Transmission to Earth',
        metTimestamp: `LOS -00:02:15 · ${artifact.endOfOperationsDate || 'ACTIVE'}`,
        missionCallout: `"Final telemetry frame received at Deep Space Network 70-meter aperture (-168.4 dBm)."`,
        technicalNarrative: `The 70-meter dishes at Goldstone, Madrid, and Canberra record the final coherent carrier phase from ${artifact.name} (${artifact.nssdcaId}).`,
        firstPersonThought:
          'I whisper one last stream of numbers across the void toward the blue star of home.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'FINAL EARTH POINT',
          commsBand: 'CARRIER THRESHOLD',
          dataRateBps: '16 bps',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH11.B3 · LOSS OF SIGNAL (LOS)',
        title: `Transition to ${artifact.operationalStatus} Status (${artifact.endOfOperationsDate || 'Ongoing'})`,
        metTimestamp: `LOS 00:00:00 · ${artifact.endOfOperationsDate || 'ACTIVE'}`,
        missionCallout: `"Downlink carrier dropped below noise floor. ${artifact.name} status logged as ${artifact.operationalStatus}."`,
        technicalNarrative: `${artifact.presentConditionSummary}`,
        firstPersonThought:
          'The radio waterfall fades to static. My voice is gone, but my work is complete.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'PASSIVE REST',
          commsBand: 'NO CARRIER (-185 dBm)',
          dataRateBps: '0 bps',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH11.B4 · DEEP-SPACE / SURFACE STILLNESS',
        title: 'Unbroken Silence Across Planetary Seasons',
        metTimestamp: 'POST-LOS · ARCHIVAL',
        missionCallout: `"DSN listening campaign concluded; hardware confirmed in permanent resting configuration."`,
        technicalNarrative: `Resting at ${artifact.regionName}, ${artifact.name} endures only slow micrometeorite gardening and solar UV exposure.`,
        firstPersonThought:
          'Centuries of silent sunrises and star-filled nights wash over my gold-wrapped ribs.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'INERT',
          commsBand: 'SILENT',
          dataRateBps: '0 bps',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH11.B5 · ARCHAEOLOGICAL MONUMENT',
        title: 'Permanent Entry into the Human Planetary Heritage Catalog',
        metTimestamp: 'EPOCH 2026 · MONUMENT',
        missionCallout: `"Site ${artifact.nssdcaId} registered as an enduring monument of planetary exploration."`,
        technicalNarrative: `${artifact.name} transitions from an active flight project to a verified archaeological site on ${artifact.regionName}.`,
        firstPersonThought:
          'I am no longer just a machine; I am a milestone marking how far humanity dared to reach.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'HERITAGE MONUMENT',
          commsBand: 'PASSIVE RETROREFLECT',
          dataRateBps: '0 bps',
        },
      },
    ];
  }

  // Chapter 12: Orbital Recon & Legacy (5 beats)
  if (chapter === 12) {
    return [
    {
      beatIndex: 1,
      startProgress: 0.0,
      endProgress: 0.2,
      code: 'CH12.B1 · ORBITAL RECONNAISSANCE PASS',
      title: isMoon
        ? 'LROC Narrow Angle Camera (0.50 m/px) Nadir Overflight'
        : 'MRO HiRISE (0.25 m/px) Sub-Meter Optical Verification Pass',
      metTimestamp: 'RECON EPOCH · NADIR PASS',
      missionCallout: `"Orbital push-broom camera swath locked over ${artifact.regionName}; hardware shadow and descent blast zone resolved!"`,
      technicalNarrative: `Decades or years after touchdown, next-generation orbital push-broom cameras image ${artifact.name} from low polar orbit, resolving the hardware, wheel tracks, and blast halo at sub-meter scale.`,
      firstPersonThought:
        'High overhead, a new generation of robotic eyes sweeps a ribbon of cyan light across my resting place—proving to Earth that I am still here.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'NADIR SWATH LOCK',
        commsBand: 'RECON ORBITER DOWNLINK',
        dataRateBps: '1,200,000 bps',
      },
    },
    {
      beatIndex: 2,
      startProgress: 0.2,
      endProgress: 0.4,
      code: 'CH12.B2 · GEODETIC DATUM TRIANGULATION',
      title: 'Sub-Meter Photogrammetric Control Network & Relief Mapping',
      metTimestamp: 'GEODESY · STEREO DTM',
      missionCallout: `"Stereo digital terrain model (DTM) locks artifact elevation and blast-zone albedo profile."`,
      technicalNarrative: `Off-nadir stereo pairs from ${
        isMoon ? 'LRO LROC NAC & LOLA laser altimetry' : 'MRO HiRISE & MGS MOLA'
      } anchor ${artifact.name} within the international planetary cartographic reference frame.`,
      firstPersonThought:
        'Every boulder, crater rim, and wheel rut around me is mapped into a three-dimensional digital twin.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'STEREO DTM LOCK',
        commsBand: 'PDS CARTOGRAPHY',
        dataRateBps: '850,000 bps',
      },
    },
    {
      beatIndex: 3,
      startProgress: 0.4,
      endProgress: 0.6,
      code: 'CH12.B3 · CAUSAL ENGINEERING LINEAGE',
      title: 'Direct Heritage to Next-Generation Planetary Missions',
      metTimestamp: 'LEGACY GRAPH · VERIFIED',
      missionCallout: `"Engineering telemetry and geological findings directly enabled successor missions across the Solar System."`,
      technicalNarrative: `Every structural alloy, EDL algorithm, and mineralogical discovery from ${artifact.name} forms an auditable link in humanity's planetary exploration graph.`,
      firstPersonThought:
        'My blueprints live on inside the rovers, helicopters, and human landers that follow the trail I blazed.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'LEGACY LINEAGE ACTIVE',
        commsBand: 'NASA ARCHIVE NETWORK',
        dataRateBps: 'VERIFIED',
      },
    },
    {
      beatIndex: 4,
      startProgress: 0.6,
      endProgress: 0.8,
      code: 'CH12.B4 · ASTROMATERIALS & ARCHIVAL WITNESS',
      title: 'Returned Samples, Calibrated Spectra & Planetary Protection',
      metTimestamp: 'CURATION · LONG-TERM',
      missionCallout: `"Archival datasets cross-linked across NASA PDS, NSSDC, and international research laboratories."`,
      technicalNarrative: `Scientists worldwide continue to mine ${artifact.name}'s calibrated PDS volumes with modern machine-vision and spectroscopic models, yielding new discoveries decades after flight.`,
      firstPersonThought:
        'Even in silence, the data I gathered continues to answer questions that had not yet been imagined when I launched.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'PDS OPEN SCIENCE',
        commsBand: 'GLOBAL ARCHIVE',
        dataRateBps: 'PERPETUAL',
      },
    },
    {
      beatIndex: 5,
      startProgress: 0.8,
      endProgress: 1.0,
      code: 'CH12.B5 · PLANETARY ARCHAEOLOGY SANCTUARY',
      title: 'Protected Archaeological Site for Future Field Expeditions',
      metTimestamp: 'SANCTUARY · ETERNAL',
      missionCallout: `"Site coordinates locked in IAU / NASA Planetary Protection & Heritage Registry."`,
      technicalNarrative: `Protected against contamination and plume impingement from future landings, ${artifact.name} awaits future planetary archaeologists who will study how terrestrial materials weather in deep space.`,
      firstPersonThought:
        'One day, booted footsteps will crunch across this regolith again and look down at my serial plate. Until then, I keep watch over the stars.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'HERITAGE REGISTRY',
        commsBand: 'ETERNAL BEACON',
        dataRateBps: 'IMMORTAL',
      },
    },
  ];
  }

  if (chapter === 13) {
    // CHAPTER 13 — Legacy Deep-Space Scientific Observatory (5 beats)
    return [
      {
        beatIndex: 1,
        startProgress: 0.0,
        endProgress: 0.2,
        code: 'CH13.B1 · DSN 70M CARRIER WAVE LOCK',
        title: 'Deep Space Network 70-Meter Parabolic Array Frequency Tracking',
        metTimestamp: 'OBSERVATORY · DSN 70M',
        missionCallout: `"DSN Goldstone DSS-14 & Madrid DSS-63 acquisition: 2.295 GHz X-band carrier locked at SNR +28.4 dB."`,
        technicalNarrative: `Using 70-meter parabolic Cassegrain dish antennas, the Deep Space Network cross-correlates carrier frequencies and telemetry harmonics from ${artifact.name}'s final documented state.`,
        firstPersonThought:
          'From across the solar void, the great terrestrial dishes turn together, tracking the faint coordinates where my signal last pierced the atmosphere.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'EPHEMERIS CARRIER LOCK',
          commsBand: 'DSN 70M ARRAY',
          dataRateBps: 'CARRIER TONE',
        },
      },
      {
        beatIndex: 2,
        startProgress: 0.2,
        endProgress: 0.4,
        code: 'CH13.B2 · 1,420 MHZ H-LINE & WATER MASER FFT',
        title: 'Neutral Hydrogen 21cm Line (1,420.405 MHz) & Water Maser Spectral Dispersion',
        metTimestamp: 'RADIO SPECTRA · 21CM H-LINE',
        missionCallout: `"Hydrogen 21 cm line (1,420.405751 MHz) & 22.2 GHz water maser transition resolved in FFT correlator."`,
        technicalNarrative: `Radio astronomical spectrometers isolate the 1,420.405 MHz neutral hydrogen transition and maser peaks against the galactic synchrotron background, establishing an absolute frequency reference.`,
        firstPersonThought:
          'The fundamental note of the universe—the 21-centimeter resonance of hydrogen—frames the quiet frequency channel where human telemetry traveled.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'SPECTRAL FFT LOCK',
          commsBand: '1,420.405 MHZ H-LINE',
          dataRateBps: 'SPECTROMETRIC',
        },
      },
      {
        beatIndex: 3,
        startProgress: 0.4,
        endProgress: 0.6,
        code: 'CH13.B3 · MULTI-SPECTRAL INFRARED RADIOMETRY',
        title: 'MRO CRISM / LROC Diviner Calibrated Thermal Infrared Imaging',
        metTimestamp: 'INFRARED · 1.25 - 4.26 µM',
        missionCallout: `"Thermal infrared radiance mapped across 1.25 µm, 2.31 µm, and 4.26 µm diagnostic absorption bands."`,
        technicalNarrative: `Orbital imaging spectrometers map surface radiance temperature and mineral absorption signatures around ${artifact.regionName}, documenting diurnal thermal inertia across the landing ellipse.`,
        firstPersonThought:
          'Through infrared vision, my metal chassis appears as a cool silhouette against the daytime heat of the surrounding regolith.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'INFRARED RADIOMETER',
          commsBand: 'CRISM / DIVINER',
          dataRateBps: 'CALIBRATED',
        },
      },
      {
        beatIndex: 4,
        startProgress: 0.6,
        endProgress: 0.8,
        code: 'CH13.B4 · NASA PDS / NSSDC ARCHIVAL CROSS-LINK',
        title: 'Peer-Reviewed Archival Records & Open Science Data Verification',
        metTimestamp: 'DATASET · PDS ARCHIVE',
        missionCallout: `"NASA PDS Cartography & Imaging Node: EDR and RDR dataset volumes linked with permanent DOI identifiers."`,
        technicalNarrative: `Raw and calibrated telemetry packets are archived within the Planetary Data System, allowing researchers worldwide to verify spatial, temporal, and physical mission records.`,
        firstPersonThought:
          'Every byte of engineering status I ever transmitted is preserved in the global archives, accessible to any mind that seeks to understand our journey.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'PDS REPOSITORY',
          commsBand: 'OPEN SCIENCE REST API',
          dataRateBps: 'ARCHIVAL WITNESS',
        },
      },
      {
        beatIndex: 5,
        startProgress: 0.8,
        endProgress: 1.0,
        code: 'CH13.B5 · DEEP-SPACE INTERFEROMETRIC SYNTHESIS',
        title: 'Global Very Long Baseline Interferometry (VLBI) Coordinate Anchor',
        metTimestamp: 'ASTROMETRY · VLBI NET',
        missionCallout: `"Very Long Baseline Interferometry geodetic solution complete: residual position variance < 0.12 mas."`,
        technicalNarrative: `Combining radio telescope baselines spanning thousands of kilometers on Earth, astrometric interferometry locks ${artifact.name}'s position into the International Celestial Reference Frame.`,
        firstPersonThought:
          'A planetary triangle of radio telescopes on Earth holds my resting site pinned forever against the distant quasar grid.',
        subSystemStatus: {
          propulsion: 'SHUTDOWN',
          guidance: 'ICRF GEODETIC LOCK',
          commsBand: 'VLBI CORRELATOR',
          dataRateBps: 'SUB-METER ANCHOR',
        },
      },
    ];
  }

  // CHAPTER 14 — The Quiet Monuments (Cinematic Epilogue) (5 beats)
  return [
    {
      beatIndex: 1,
      startProgress: 0.0,
      endProgress: 0.2,
      code: 'CH14.B1 · APOLLO TRANQUILLITY MONUMENT',
      title: 'Historical Callback: The Lunar Descent Stages & Laser Retroreflectors',
      metTimestamp: 'EPILOGUE · MOON 1969',
      missionCallout: `"Apollo 11 Tranquillity Base: Stainless steel plaque and laser reflector active after 57+ terrestrial years."`,
      technicalNarrative: `In the silent vacuum of Mare Tranquillitatis, the Apollo 11 descent stage stands untouched, its laser ranging retroreflector still returning green photons back to Earth with millimeter precision.`,
      firstPersonThought:
        'Fifty-seven years of silent lunar noons and freezing fortnights have washed over my footpads. The plaque on my front leg still reads: We came in peace for all mankind.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'PERMANENT MONUMENT',
        commsBand: 'PASSIVE LASER RETRO',
        dataRateBps: 'PHOTON RETURN',
      },
    },
    {
      beatIndex: 2,
      startProgress: 0.2,
      endProgress: 0.4,
      code: 'CH14.B2 · MARTIAN BASIN TRAVERSES',
      title: 'Historical Callback: The Wheel Tracks of Spirit, Opportunity & Perseverance',
      metTimestamp: 'EPILOGUE · MARS 2004-2026',
      missionCallout: `"Meridiani Planum to Jezero Crater: Over 45 kilometers of wheel cleats pressed into Martian hematite and basalt."`,
      technicalNarrative: `Across Meridiani Planum, Gusev Crater, Gale, and Jezero, robotic wheels carved the first tracks into Martian soil, their silicon eyes reading the watery history of an ancient planet.`,
      firstPersonThought:
        'The dust of Mars covers my solar wings, but beneath the red frost, every meter I rolled remains pressed into the basalt stone.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'FIELD MONUMENT',
        commsBand: 'ORBITAL HIGH-GAIN',
        dataRateBps: 'HERITAGE ARCHIVE',
      },
    },
    {
      beatIndex: 3,
      startProgress: 0.4,
      endProgress: 0.6,
      code: 'CH14.B3 · VOYAGER INTERSTELLAR HORIZON',
      title: 'Historical Callback: The Golden Record Entering Interstellar Plasma',
      metTimestamp: 'EPILOGUE · HELIOPAUSE',
      missionCallout: `"Voyager 1: Beyond the heliopause at > 160 AU; carrier tone whispering across 22 light-hours."`,
      technicalNarrative: `Drifting through interstellar plasma beyond the solar termination shock, Voyager 1 carries the Golden Record, an electroplated copper phonograph containing the sounds and hopes of 1977 Earth.`,
      firstPersonThought:
        'The Sun is now just the brightest star in my sky. Behind me lies everything human beings have ever built; ahead lies the quiet galaxy.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'INTERSTELLAR CRUISE',
        commsBand: 'DSN CARRIER PING',
        dataRateBps: '160 BPS',
      },
    },
    {
      beatIndex: 4,
      startProgress: 0.6,
      endProgress: 0.8,
      code: 'CH14.B4 · REGOLITH SPACE WEATHERING',
      title: 'Micro-Meteoroid Weathering & Cosmic Ray Protection Physics',
      metTimestamp: 'EPILOGUE · GEOLOGIC DECAY',
      missionCallout: `"Space weathering rate: ~1 mm per million years. Artifacts will endure for over 100,000 millennia."`,
      technicalNarrative: `Without rain, tectonic drift, or liquid water, spacecraft resting on airless planetary surfaces weather solely through hypervelocity micrometeoroid impacts and solar wind ion sputtering.`,
      firstPersonThought:
        'The universe wears us down atom by single atom. A hundred thousand centuries will pass, and my silhouette will still rise above this crater floor.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'GEOLOGIC WITNESS',
        commsBand: 'COSMIC MEMORY',
        dataRateBps: 'MILLENNIAL WITNESS',
      },
    },
    {
      beatIndex: 5,
      startProgress: 0.8,
      endProgress: 1.0,
      code: 'CH14.B5 · THE QUIET MONUMENTS',
      title: 'Final Epilogue: Humanity\'s Quiet Monuments of Extraterrestrial Exploration',
      metTimestamp: 'EPILOGUE · ETERNAL',
      missionCallout: `"AFTERLIGHT: They remain where they fell, not as debris, but as the quiet monuments of human curiosity."`,
      technicalNarrative: `Every fallen lander, discarded descent stage, and resting rover stands as an enduring archaeological testament to the species that reached beyond its cradle to touch the stars.`,
      firstPersonThought:
        'We were the scouts of Earth. We answered the question of what lay beyond the dark. And here, in the quiet dust of other worlds, we belong to eternity.',
      subSystemStatus: {
        propulsion: 'SHUTDOWN',
        guidance: 'QUIET MONUMENT',
        commsBand: 'HUMAN HERITAGE',
        dataRateBps: 'ETERNAL HERITAGE',
      },
    },
  ];
}

/**
 * Computes real-time physics, attitude, thermal, signal, and spectral telemetry
 * at any exact `storyProgress` (0.0 .. 1.0) inside `chapter` (1..12) for the Motion Graphics HUD.
 */
export function computeLiveChoreographyTelemetry(
  artifact: ArtifactRecord,
  chapter: StoryChapterNumber,
  progress: number
): LiveChoreographyTelemetry {
  const clamped = Math.max(0, Math.min(1, progress));
  const beats = getChapterStoryBeats(artifact, chapter);
  const activeBeat =
    beats.find((b) => clamped >= b.startProgress && clamped <= b.endProgress) ||
    beats[beats.length - 1];

  const isMars = artifact.bodyId === 'mars';
  const isMoon = artifact.bodyId === 'moon';

  let altitudeKm = 0;
  let velocityKmS = 0;
  let verticalVelocityMS = 0;
  let gLoad = 1.0;
  let hullTempC = 22;
  let signalStrengthDbm = -114;
  let powerWatts = 280;
  let pitchDeg = 0;
  let rollDeg = 0;
  let yawDeg = 0;

  if (chapter === 1) {
    // CH 01: Cleanroom & Launch Pad (0..0.4) -> Liftoff & Fairing Sep (0.4..1.0)
    if (clamped < 0.4) {
      altitudeKm = 0;
      velocityKmS = 0;
      gLoad = 1.0;
      hullTempC = 21.5;
      signalStrengthDbm = -62;
    } else {
      const t = (clamped - 0.4) / 0.6;
      altitudeKm = Number((t * 185.4).toFixed(2));
      velocityKmS = Number((t * 7.79).toFixed(2));
      gLoad = Number((1.2 + Math.sin(t * Math.PI) * 2.8).toFixed(2));
      hullTempC = 22 - t * 14;
      signalStrengthDbm = -78 - t * 16;
      pitchDeg = Number(((1 - t) * 65).toFixed(1));
    }
  } else if (chapter === 2) {
    // CH 02: Orbital Injection & Upper Stage Escape Burn
    altitudeKm = Number((185.4 + clamped * 4250).toFixed(1));
    velocityKmS = Number((7.79 + clamped * 3.42).toFixed(2));
    gLoad = clamped < 0.75 ? 2.65 : 0.0;
    hullTempC = 8 - clamped * 36;
    signalStrengthDbm = -96 - clamped * 12;
    pitchDeg = Number((Math.sin(clamped * Math.PI * 2) * 12).toFixed(1));
    yawDeg = Number((clamped * 180).toFixed(1));
  } else if (chapter === 3) {
    // CH 03: Deep-Space Heliocentric Cruise & TCM Burns
    const maxDist = isMoon ? 384400 : isMars ? 54600000 : 620000000;
    altitudeKm = Math.round((0.85 - clamped * 0.65) * maxDist);
    velocityKmS = isMoon ? 1.42 : isMars ? 21.8 : 31.4;
    gLoad = Math.abs(clamped - 0.5) < 0.08 ? 0.45 : 0.0;
    hullTempC = -65 + Math.sin(clamped * Math.PI * 4) * 25;
    signalStrengthDbm = isMoon ? -106 : isMars ? -134 : -152;
    rollDeg = Number(((clamped * 360) % 360).toFixed(1));
  } else if (chapter === 4) {
    // CH 04: Planetary Gravitational Capture & Approach Corridor
    altitudeKm = Number(((1 - clamped * 0.85) * 8500).toFixed(1));
    velocityKmS = Number(((isMoon ? 2.3 : 5.4) + clamped * 0.8).toFixed(2));
    gLoad = clamped > 0.6 ? 1.45 : 0.0;
    hullTempC = -42 + clamped * 28;
    signalStrengthDbm = isMoon ? -110 : -138;
    pitchDeg = Number((Math.cos(clamped * Math.PI * 3) * 16).toFixed(1));
  } else if (chapter === 5) {
    // CH 05: Hypersonic Entry Interface / Powered Descent Initiation (125 km -> 12 km)
    const inv = 1 - clamped;
    altitudeKm = Number((12.0 + inv * 113.0).toFixed(2));
    velocityKmS = Number((0.48 + inv * (isMoon ? 1.22 : 5.32)).toFixed(2));
    verticalVelocityMS = -Number((65 + inv * 180).toFixed(1));
    gLoad = isMoon ? 1.95 : Number((1.8 + Math.sin(clamped * Math.PI) * 7.6).toFixed(2));
    hullTempC = isMoon ? 78 : Math.round(280 + Math.sin(clamped * Math.PI) * 1170);
    signalStrengthDbm = -126 - Math.sin(clamped * Math.PI) * 18;
    pitchDeg = Number((inv * 28).toFixed(1));
    rollDeg = Number((Math.sin(clamped * Math.PI * 8) * 5.2).toFixed(1));
  } else if (chapter === 6) {
    // CH 06: Terminal Touchdown (Parachute / Sky-Crane / DPS Braking -> Surface 0.00 km)
    if (clamped < 0.72) {
      const descT = clamped / 0.72;
      const inv = 1 - descT;
      altitudeKm = Number((inv * inv * 12.0).toFixed(3));
      velocityKmS = Number((inv * 0.48).toFixed(3));
      verticalVelocityMS = -Number((inv * 42.0 + 0.75).toFixed(1));
      gLoad = isMoon ? 1.65 : Number((1.2 + inv * 2.4).toFixed(2));
      hullTempC = isMoon ? 92 : 68;
      signalStrengthDbm = -121;
      pitchDeg = Number((inv * 14).toFixed(1));
    } else {
      altitudeKm = 0.0;
      velocityKmS = 0.0;
      verticalVelocityMS = 0.0;
      gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
      hullTempC = isMoon ? 96 : -24;
      signalStrengthDbm = -116;
    }
  } else if (chapter === 7) {
    // CH 07: Surface Deployment (Solar Wings, Mast & EASEP/ALSEP Unfurling)
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? 102 : -28;
    signalStrengthDbm = -115;
    powerWatts = Math.round(140 + clamped * 210);
    yawDeg = Number((clamped * 90).toFixed(1));
  } else if (chapter === 8) {
    // CH 08: Primary Surface Traverse & Ingenuity Aerial Scout
    altitudeKm = 0.0;
    velocityKmS = Number((0.00004 * Math.sin(clamped * Math.PI)).toFixed(5));
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? 106 : -22;
    signalStrengthDbm = -117;
    powerWatts = 320 + Math.round(Math.sin(clamped * Math.PI * 6) * 35);
    pitchDeg = Number((Math.sin(clamped * Math.PI * 8) * 4.2).toFixed(1));
    rollDeg = Number((Math.cos(clamped * Math.PI * 6) * 3.8).toFixed(1));
  } else if (chapter === 9) {
    // CH 09: In-Situ Science, 5-DOF Robotic Arm Coring & LIBS Laser Spectrometry
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? 98 : -34;
    signalStrengthDbm = -114;
    powerWatts = 360 + Math.round(Math.sin(clamped * Math.PI * 8) * 45);
    yawDeg = Number((Math.sin(clamped * Math.PI * 4) * 42).toFixed(1));
  } else if (chapter === 10) {
    // CH 10: Anomaly, Cryogenic Night & Dust Storm Survival
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = Math.round((isMoon ? -145 : -98) + Math.cos(clamped * Math.PI * 2) * 32);
    signalStrengthDbm = -126 - Math.round(Math.sin(clamped * Math.PI) * 14);
    powerWatts = Math.round(95 + Math.cos(clamped * Math.PI) * 40);
  } else if (chapter === 11) {
    // CH 11: Final Carrier Loss & End of Operations
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? -178 : -88 - clamped * 25;
    signalStrengthDbm = Math.round(-128 - clamped * 48);
    powerWatts = Math.max(0, Math.round((1 - clamped) * 125));
  } else if (chapter === 12) {
    // CH 12: Orbital Reconnaissance Overflight (LRO / MRO Sub-Meter Swath Pass)
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? -15 : -42;
    signalStrengthDbm = -108;
    powerWatts = 0;
  } else if (chapter === 13) {
    // CH 13: Legacy Deep-Space Scientific Observatory (DSN 70m, 1420MHz H-Line & IR Radiometry)
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? -22 : -55;
    signalStrengthDbm = -96; // High SNR in DSN correlator
    powerWatts = 0;
  } else {
    // CH 14: The Quiet Monuments (Cinematic Ending & Archaeological Epilogue)
    altitudeKm = 0.0;
    velocityKmS = 0.0;
    gLoad = isMoon ? 0.165 : isMars ? 0.379 : 0.14;
    hullTempC = isMoon ? -35 : -62;
    signalStrengthDbm = -135;
    powerWatts = 0;
  }

  const spectralPeaks =
    chapter === 13
      ? [
          {
            label: 'Neutral Hydrogen 21cm Line',
            wavelengthNm: '1,420.405 MHz',
            intensity: Math.round(96 + Math.sin(clamped * 16) * 4),
          },
          {
            label: 'Water Maser Spectral Emission',
            wavelengthNm: '22.235 GHz',
            intensity: Math.round(84 + Math.cos(clamped * 12) * 12),
          },
          {
            label: 'MRO/LROC Calibrated Infrared Band',
            wavelengthNm: '2,310 nm CRISM',
            intensity: Math.round(79 + Math.sin(clamped * 10) * 15),
          },
        ]
      : chapter === 14
      ? [
          {
            label: 'Tranquillity Laser Retroreflector',
            wavelengthNm: '532.0 nm Nd:YAG',
            intensity: Math.round(98 + Math.sin(clamped * 6) * 2),
          },
          {
            label: 'Ancient Basalt Weathering Rind',
            wavelengthNm: '1,050 nm Fe²⁺',
            intensity: Math.round(72 + Math.cos(clamped * 8) * 14),
          },
          {
            label: 'Voyager Interstellar Carrier Harmonics',
            wavelengthNm: '2,295.0 MHz',
            intensity: Math.round(89 + Math.sin(clamped * 10) * 8),
          },
        ]
      : isMars
      ? [
          {
            label: 'Fe³⁺ Jarosite / Hematite',
            wavelengthNm: '532 nm / 14.4 keV',
            intensity: Math.round(78 + Math.sin(clamped * 12) * 18),
          },
          {
            label: 'Mg/Fe Phyllosilicate Smectite',
            wavelengthNm: '2,310 nm NIR',
            intensity: Math.round(64 + Math.cos(clamped * 10) * 22),
          },
          {
            label: 'CO₂ / Ar Atmospheric Line',
            wavelengthNm: '4,260 nm TIR',
            intensity: Math.round(85 + Math.sin(clamped * 8) * 12),
          },
        ]
      : isMoon
      ? [
        {
          label: 'LRRR 532nm Nd:YAG Return Pulse',
          wavelengthNm: '532.0 nm',
          intensity: Math.round(92 + Math.sin(clamped * 14) * 7),
        },
        {
          label: 'TiO₂ Ilmenite Mare Basalt',
          wavelengthNm: '415 / 750 nm',
          intensity: Math.round(74 + Math.cos(clamped * 9) * 16),
        },
        {
          label: 'CaAl₂Si₂O₈ Anorthosite Plagioclase',
          wavelengthNm: '1,250 nm NIR',
          intensity: Math.round(61 + Math.sin(clamped * 11) * 19),
        },
      ]
    : [
        {
          label: 'CH₄ / N₂ Atmospheric Hydrocarbons',
          wavelengthNm: '1,650 nm DISR',
          intensity: Math.round(88 + Math.sin(clamped * 10) * 10),
        },
        {
          label: 'H₂ / He Ionosphere Plasma Wave',
          wavelengthNm: '3.1 kHz PWS',
          intensity: Math.round(76 + Math.cos(clamped * 12) * 15),
        },
        {
          label: 'H₂O Ice Bedrock Reflectance',
          wavelengthNm: '2,010 nm',
          intensity: Math.round(69 + Math.sin(clamped * 8) * 18),
        },
      ];

  return {
    altitudeKm,
    velocityKmS,
    verticalVelocityMS,
    gLoad: Number(gLoad.toFixed(2)),
    hullTempC: Math.round(hullTempC),
    signalStrengthDbm,
    powerWatts,
    pitchDeg: Number(pitchDeg.toFixed(1)),
    rollDeg: Number(rollDeg.toFixed(1)),
    yawDeg: Number(yawDeg.toFixed(1)),
    activeBeat,
    allBeats: beats,
    spectralPeaks,
  };
}
