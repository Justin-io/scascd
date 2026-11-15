import {
  ArtifactRecord,
  CelestialBodySpec,
  DataConnectorStatus,
  EducationalChallenge,
  GeologicalFeature,
  LegacyEdge,
  LegacyNode,
  MediaAsset,
  MissionEvent,
  ScientificClaim,
  ScientificSource,
  StoryChapter,
} from '../types/afterlight';

export const CELESTIAL_BODIES: CelestialBodySpec[] = [
  {
    id: 'sun',
    name: 'The Sun (Sol)',
    subtitle: 'G2V Main-Sequence Star · Heliocentric Reference Origin',
    classification: 'Star',
    orbitRadiusSceneUnits: 0,
    radiusSceneUnits: 5.2,
    meanRadiusKm: 696340,
    semiMajorAxisAU: 0,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.12,
    surfaceGravityMS2: 274.0,
    axialTiltDeg: 7.25,
    baseColorHex: '#F59E0B',
    secondaryColorHex: '#EA580C',
    atmosphereColorHex: '#FBBF24',
    missionCount: 24,
    documentedArtifactCount: 16,
    scientificSummary:
      'Gravitational anchor of the Solar System and source of the solar wind plasma environment through which all heliocentric probes (Parker Solar Probe, SOHO, Ulysses, Voyager) navigate.',
    terrainReferenceSystem: 'IAU Carrington Heliographic Coordinate System',
    elevationSource: 'SDO / HMI Photospheric Magnetogram & Parker Solar Probe Ephemeris',
    hasDedicatedGlobe: false,
  },
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'Third Terrestrial Planet · Origin of All Human Spaceflight',
    classification: 'Terrestrial Planet',
    orbitRadiusSceneUnits: 14,
    radiusSceneUnits: 1.55,
    meanRadiusKm: 6371.0,
    semiMajorAxisAU: 1.0,
    orbitalPeriodDays: 365.256,
    rotationPeriodHours: 23.934,
    surfaceGravityMS2: 9.807,
    axialTiltDeg: 23.44,
    baseColorHex: '#2563EB',
    secondaryColorHex: '#10B981',
    atmosphereColorHex: '#38BDF8',
    missionCount: 480,
    documentedArtifactCount: 1,
    scientificSummary:
      'Origin point of planetary exploration and home to the Deep Space Network (Goldstone, Madrid, Canberra) that tracks every interplanetary spacecraft.',
    terrainReferenceSystem: 'WGS84 / ITRF2020 Geodetic Frame',
    elevationSource: 'NASA SRTM / ASTER GDEM',
    hasDedicatedGlobe: false,
  },
  {
    id: 'moon',
    name: 'The Moon (Luna)',
    subtitle: 'Earth Natural Satellite · Primary Planetary Archaeology Sanctuary',
    classification: 'Natural Satellite',
    orbitRadiusSceneUnits: 17.5,
    radiusSceneUnits: 0.95,
    meanRadiusKm: 1737.4,
    semiMajorAxisAU: 1.00257,
    orbitalPeriodDays: 27.321,
    rotationPeriodHours: 655.72,
    surfaceGravityMS2: 1.62,
    axialTiltDeg: 1.54,
    baseColorHex: '#94A3B8',
    secondaryColorHex: '#475569',
    atmosphereColorHex: '#64748B',
    missionCount: 148,
    documentedArtifactCount: 6,
    scientificSummary:
      'An airless geological time capsule preserving over 190,000 kg of human spacecraft hardware—from Luna 2 (1959) and Apollo 11 Eagle (1969) to Surveyor 3, Lunokhod 2, and Chang\'e 4—undisturbed by wind or liquid water.',
    terrainReferenceSystem: 'IAU Moon 2000 Mean Earth / Polar Axis (ME)',
    elevationSource: 'LRO LOLA (Lunar Orbiter Laser Altimeter) 118m/px & LROC NAC 0.5m/px',
    hasDedicatedGlobe: true,
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'Fourth Terrestrial Planet · Active Robotic Surface Frontier',
    classification: 'Terrestrial Planet',
    orbitRadiusSceneUnits: 25,
    radiusSceneUnits: 1.35,
    meanRadiusKm: 3389.5,
    semiMajorAxisAU: 1.52368,
    orbitalPeriodDays: 686.98,
    rotationPeriodHours: 24.623,
    surfaceGravityMS2: 3.721,
    axialTiltDeg: 25.19,
    baseColorHex: '#D97706',
    secondaryColorHex: '#9A3412',
    atmosphereColorHex: '#F59E0B',
    missionCount: 53,
    documentedArtifactCount: 4,
    scientificSummary:
      'Host to humanity\'s longest-running robotic field expeditions. From Viking 1 at Chryse Planitia (1976) to Opportunity\'s 45.16 km marathon across Meridiani Planum and Perseverance & Ingenuity inside Jezero Crater.',
    terrainReferenceSystem: 'IAU Mars 2000 Aerocentric Coordinate Frame',
    elevationSource: 'Mars Global Surveyor MOLA (463m/px) & MRO HiRISE (0.25m/px)',
    hasDedicatedGlobe: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'Fifth Planet · Jovian Magnetosphere & Галилеан Moon System',
    classification: 'Gas Giant',
    orbitRadiusSceneUnits: 36,
    radiusSceneUnits: 2.85,
    meanRadiusKm: 69911,
    semiMajorAxisAU: 5.2044,
    orbitalPeriodDays: 4332.59,
    rotationPeriodHours: 9.925,
    surfaceGravityMS2: 24.79,
    axialTiltDeg: 3.13,
    baseColorHex: '#D97706',
    secondaryColorHex: '#FEF3C7',
    atmosphereColorHex: '#FDE68A',
    missionCount: 10,
    documentedArtifactCount: 0,
    scientificSummary:
      'Explored by Pioneer 10/11, Voyager 1/2, Ulysses, Galileo (atmospheric probe & orbiter intentionally disposed into Jupiter in 2003), Cassini, New Horizons, Juno, and Europa Clipper.',
    terrainReferenceSystem: 'IAU System III (1965) Jovian Magnetic Longitude',
    elevationSource: 'NASA Juno JIRAM / JunoCam & Galileo SSI',
    hasDedicatedGlobe: false,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'Sixth Planet · Ring System & Titan / Enceladus Ocean Worlds',
    classification: 'Gas Giant',
    orbitRadiusSceneUnits: 48,
    radiusSceneUnits: 2.45,
    meanRadiusKm: 58232,
    semiMajorAxisAU: 9.5826,
    orbitalPeriodDays: 10759.22,
    rotationPeriodHours: 10.656,
    surfaceGravityMS2: 10.44,
    axialTiltDeg: 26.73,
    baseColorHex: '#EAB308',
    secondaryColorHex: '#A16207',
    atmosphereColorHex: '#FEF08A',
    hasRings: true,
    missionCount: 4,
    documentedArtifactCount: 1,
    scientificSummary:
      'Site of the farthest planetary landing in human history: the ESA/NASA Huygens probe resting on the hydrocarbon plains of Adiri on Titan (2005), and the Cassini Grand Finale atmospheric entry (2017).',
    terrainReferenceSystem: 'IAU Saturn / Titan Radar Frame (Cassini SAR)',
    elevationSource: 'Cassini RADAR Mapper & DISR Descent Imager',
    hasDedicatedGlobe: false,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'Seventh Planet · Retrograde Axial Ice Giant',
    classification: 'Ice Giant',
    orbitRadiusSceneUnits: 60,
    radiusSceneUnits: 1.85,
    meanRadiusKm: 25362,
    semiMajorAxisAU: 19.2184,
    orbitalPeriodDays: 30688.5,
    rotationPeriodHours: -17.24,
    surfaceGravityMS2: 8.87,
    axialTiltDeg: 97.77,
    baseColorHex: '#06B6D4',
    secondaryColorHex: '#0891B2',
    atmosphereColorHex: '#67E8F9',
    missionCount: 1,
    documentedArtifactCount: 0,
    scientificSummary:
      'Visited once by Voyager 2 on January 24, 1986, revealing 10 new moons, two new rings, and a tilted magnetic field offset from the planet\'s center.',
    terrainReferenceSystem: 'IAU Uranian System III Longitude',
    elevationSource: 'Voyager 2 Imaging Science Subsystem (ISS)',
    hasDedicatedGlobe: false,
  },
  {
    id: 'neptune',
    name: 'Neptune & Heliopause Frontier',
    subtitle: 'Eighth Planet & Outer Boundary Toward Interstellar Space',
    classification: 'Ice Giant',
    orbitRadiusSceneUnits: 71,
    radiusSceneUnits: 1.8,
    meanRadiusKm: 24622,
    semiMajorAxisAU: 30.11,
    orbitalPeriodDays: 60195.0,
    rotationPeriodHours: 16.11,
    surfaceGravityMS2: 11.15,
    axialTiltDeg: 28.32,
    baseColorHex: '#3B82F6',
    secondaryColorHex: '#1D4ED8',
    atmosphereColorHex: '#60A5FA',
    missionCount: 1,
    documentedArtifactCount: 1,
    scientificSummary:
      'Gateway to the Kuiper Belt and the interstellar medium where Voyager 1 (now beyond 165 AU) and Voyager 2 continue transmitting plasma and magnetometer telemetry.',
    terrainReferenceSystem: 'IAU Neptunian System / J2000 Ecliptic',
    elevationSource: 'Voyager 2 ISS & Deep Space Network VLBI Tracking',
    hasDedicatedGlobe: false,
  },
];

export const SCIENTIFIC_SOURCES: ScientificSource[] = [
  {
    id: 'SRC-LROC-NAC-A11',
    archiveName: 'LROC / LRO',
    title: 'Lunar Reconnaissance Orbiter Camera NAC Observation M104362199R — Apollo 11 Landing Site',
    citation: 'Robinson, M. S. et al. (2010), Space Science Reviews, 150(1-4), 81–124. PDS Volume LRO-L-LROC-2-EDR-V1.0.',
    url: 'https://pds.lroc.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/',
    datasetId: 'LRO-L-LROC-2-EDR-V1.0',
    lastUpdated: '2025-11-18',
    license: 'NASA Public Domain (17 U.S.C. § 105)',
  },
  {
    id: 'SRC-NSSDC-A11',
    archiveName: 'NASA NSSDC',
    title: 'NASA Space Science Data Coordinated Archive — Apollo 11 Lunar Module (1969-059C)',
    citation: 'NASA GSFC NSSDCA Master Catalog ID 1969-059C, Tranquillity Base Surface Operations Report.',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    datasetId: 'NSSDCA-1969-059C',
    lastUpdated: '2025-09-02',
    license: 'NASA Public Domain',
  },
  {
    id: 'SRC-NASA-MOON-CATALOG',
    archiveName: 'NASA Human Artifacts Catalog',
    title: 'Catalogue of Manmade Material on the Moon — NASA History & LRO Geodetic Survey',
    citation: 'NASA Technical Report RP-1097 & LRO Geodetic Control Network (Davies & Colvin 2000; Wagner et al. 2017).',
    url: 'https://www.nasa.gov/history/catalogue-of-manmade-material-on-the-moon/',
    datasetId: 'NASA-RP-1097-REV2024',
    lastUpdated: '2025-06-14',
    license: 'NASA Public Domain',
  },
  {
    id: 'SRC-LROC-LUNOKHOD2',
    archiveName: 'LROC / LRO',
    title: 'LROC NAC Geodetic Localization of Lunokhod 2 and Luna 21 in Le Monnier Crater',
    citation: 'Stooke, P. J. (2010) & Robinson, M. S. et al. (2012), Icarus, 221(1), 345–354. Image M122007650L.',
    url: 'https://lroc.sese.asu.edu/posts/238',
    datasetId: 'LROC-NAC-M122007650L',
    lastUpdated: '2025-08-19',
    license: 'NASA / ASU LROC Public Domain',
  },
  {
    id: 'SRC-PDS-MERB-OPPORTUNITY',
    archiveName: 'NASA PDS',
    title: 'Mars Exploration Rover-B (Opportunity) Traverse Archive & HiRISE Localization ESP_056807_1770',
    citation: 'Arvidson, R. E. et al. (2014), Science, 343(6169). PDS Geosciences Node MER-B Bundle.',
    url: 'https://pds-geosciences.wustl.edu/missions/mer/index.htm',
    datasetId: 'URN:NASA:PDS:MERB_TRAVERSE_V2',
    lastUpdated: '2025-12-01',
    license: 'NASA Public Domain',
  },
  {
    id: 'SRC-HIRISE-VIKING1',
    archiveName: 'MER / MRO HiRISE Archive',
    title: 'MRO HiRISE Direct Optical Localization of Viking 1 Lander (ESP_011491_2025)',
    citation: 'McEwen, A. S. et al. (2007), JGR Planets, 112(E5). HiRISE Observation ESP_011491_2025.',
    url: 'https://www.uahirise.org/ESP_011491_2025',
    datasetId: 'MRO-M-HIRISE-3-RDR-V1.1',
    lastUpdated: '2025-07-11',
    license: 'NASA / JPL / University of Arizona Public Domain',
  },
  {
    id: 'SRC-PDS-M2020',
    archiveName: 'NASA PDS',
    title: 'Mars 2020 Perseverance & Ingenuity SPICE Kernels and Surface Localization Bundle',
    citation: 'Farley, K. A. et al. (2022), Science, 377(6614). NAIF SPICE M2020 Kernel Dataset.',
    url: 'https://naif.jpl.nasa.gov/pub/naif/MARS2020/',
    datasetId: 'URN:NASA:PDS:MARS2020_SPICE',
    lastUpdated: '2026-01-15',
    license: 'NASA Public Domain',
  },
  {
    id: 'SRC-JPL-HORIZONS-VOY1',
    archiveName: 'JPL Horizons',
    title: 'JPL Horizons On-Line Ephemeris System — Voyager 1 (Spacecraft ID -31)',
    citation: 'NASA JPL Solar System Dynamics Group, DE440/441 Interstellar Trajectory Solution.',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    datasetId: 'JPL-HORIZONS-SC-31',
    lastUpdated: '2026-02-01',
    license: 'NASA JPL Public Domain',
  },
  {
    id: 'SRC-PDS-CASSINI-HUYGENS',
    archiveName: 'NASA PDS',
    title: 'Cassini-Huygens DISR Titan Landing Site & Grand Finale Atmospheric Entry Ephemeris',
    citation: 'Lebreton, J.-P. et al. (2005), Nature, 438, 758–764; Maize, E. H. et al. (2018), SpaceOps.',
    url: 'https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Cassini/Cassini.html',
    datasetId: 'URN:NASA:PDS:CASSINI_HUYGENS_DISR',
    lastUpdated: '2025-10-09',
    license: 'NASA / ESA / ASI Public Domain',
  },
];

export const SCIENTIFIC_CLAIMS: ScientificClaim[] = [
  {
    id: 'CLM-A11-01',
    artifactId: 'ART-APOLLO11-LM-DS',
    sourceId: 'SRC-LROC-NAC-A11',
    statement:
      'The Apollo 11 Lunar Module Eagle descent stage rests intact at 0.67416° N, 23.47314° E on Mare Tranquillitatis, directly resolved at 0.50 m/pixel by LROC Narrow Angle Camera observation M104362199R.',
    evidenceUrl: 'https://pds.lroc.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Horizontal geodetic uncertainty ±0.5 m relative to the LOLA/LROC control network.',
    reviewTimestamp: '2026-01-10T14:20:00Z',
  },
  {
    id: 'CLM-A11-02',
    artifactId: 'ART-APOLLO11-LM-DS',
    sourceId: 'SRC-NSSDC-A11',
    statement:
      'While the Eagle descent stage and Passive Seismic Experiment are inactive, the deployed Apollo 11 Laser Ranging Retroreflector (LRRR) remains operational today, returning pulsed laser photons to Earth observatories.',
    evidenceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    evidenceType: 'Laser Ranging Retroreflector',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Sub-centimeter range precision verified continuously by Apache Point (APOLLO) and Grasse stations.',
    reviewTimestamp: '2026-01-10T14:25:00Z',
  },
  {
    id: 'CLM-SURV3-01',
    artifactId: 'ART-SURVEYOR3-LANDER',
    sourceId: 'SRC-NASA-MOON-CATALOG',
    statement:
      'Surveyor 3 touched down inside a 200-meter crater on Oceanus Procellarum (2.9958° S, 23.3414° W) on April 20, 1967, and was inspected in situ 31 months later by Apollo 12 astronauts Pete Conrad and Alan Bean, who landed Intrepid 163 meters away.',
    evidenceUrl: 'https://www.nasa.gov/history/catalogue-of-manmade-material-on-the-moon/',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Confirmed both by Apollo 12 surface photography and LROC NAC imagery showing footpath trails between Intrepid and Surveyor 3.',
    reviewTimestamp: '2026-01-11T09:15:00Z',
  },
  {
    id: 'CLM-LUNO2-01',
    artifactId: 'ART-LUNOKHOD2-ROVER',
    sourceId: 'SRC-LROC-LUNOKHOD2',
    statement:
      'Lunokhod 2 completed a verified 39.1 km traverse across Le Monnier crater in 1973; its final resting position at 25.8323° N, 30.9221° E was optically confirmed in March 2010 after LROC NAC resolved the rover and its dark wheel tracks.',
    evidenceUrl: 'https://lroc.sese.asu.edu/posts/238',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Prior pre-LRO odometer estimates ranged from 37 km to 42 km; LROC NAC imagery fixed the true wheel-track path length at 39.1 km (±0.1 km).',
    reviewTimestamp: '2026-01-12T11:00:00Z',
  },
  {
    id: 'CLM-LRV1-01',
    artifactId: 'ART-APOLLO15-LRV1',
    sourceId: 'SRC-NASA-MOON-CATALOG',
    statement:
      'The Apollo 15 Lunar Roving Vehicle (LRV-1) carried David Scott and James Irwin across 27.76 km of the Hadley-Apennine region and remains parked at its VIP camera site (26.1340° N, 3.6298° E) 140 meters east of the Falcon descent stage.',
    evidenceUrl: 'https://www.nasa.gov/history/catalogue-of-manmade-material-on-the-moon/',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Resolved directly in LROC NAC image M111571816L; uncertainty ±0.5 m.',
    reviewTimestamp: '2026-01-12T16:40:00Z',
  },
  {
    id: 'CLM-SIVB12-01',
    artifactId: 'ART-APOLLO12-SIVB',
    sourceId: 'SRC-NASA-MOON-CATALOG',
    statement:
      'The Apollo 12 Saturn S-IVB-507 stage impacted the lunar surface on November 18, 1969, creating a calibrated artificial seismic source recorded by the Apollo 12 Passive Seismic Experiment; its exact impact crater is estimated at 2.75° S, 20.07° W with pre-LRO tracking uncertainty.',
    evidenceUrl: 'https://www.nasa.gov/history/catalogue-of-manmade-material-on-the-moon/',
    evidenceType: 'Seismic Telemetry',
    verificationStatus: 'ESTIMATED',
    uncertaintyNotes: 'Apollo 12 S-IVB did not impact as targeted; trajectory tracking places impact uncertainty within ±15 km until definitive NAC crater match confirmation.',
    reviewTimestamp: '2026-01-13T08:30:00Z',
  },
  {
    id: 'CLM-CE4-01',
    artifactId: 'ART-CHANGE4-YUTU2',
    sourceId: 'SRC-NASA-MOON-CATALOG',
    statement:
      'Chang\'e 4 and the Yutu-2 rover achieved humanity\'s first soft landing on the lunar far side inside Von Kármán crater (45.4561° S, 177.5885° E) on January 3, 2019, localized within ±1.0 m by LROC NAC observation M1303619844LR.',
    evidenceUrl: 'https://pds.lroc.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Relay communications operate via the Queqiao halo-orbit satellite at Earth-Moon L2.',
    reviewTimestamp: '2026-01-14T10:10:00Z',
  },
  {
    id: 'CLM-OPP-01',
    artifactId: 'ART-MERB-OPPORTUNITY',
    sourceId: 'SRC-PDS-MERB-OPPORTUNITY',
    statement:
      'Opportunity (MER-B) operated for 5,111 sols (57× its 90-sol design life) and drove 45.16 km from Eagle Crater (1.9462° S, 354.4734° E) to Perseverance Valley on the western rim of Endeavour Crater (2.8062° S, 354.5284° E), where a planet-encircling dust storm ended contact on June 10, 2018.',
    evidenceUrl: 'https://pds-geosciences.wustl.edu/missions/mer/index.htm',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Final resting site imaged by MRO HiRISE observation ESP_056807_1770 (±0.3 m accuracy).',
    reviewTimestamp: '2026-01-15T12:00:00Z',
  },
  {
    id: 'CLM-OPP-02',
    artifactId: 'ART-MERB-OPPORTUNITY',
    sourceId: 'SRC-PDS-MERB-OPPORTUNITY',
    statement:
      'Opportunity\'s Mössbauer Spectrometer (MIMOS II) and Alpha Particle X-Ray Spectrometer (APXS) identified jarosite—a hydrous iron-potassium sulfate mineral—and gray crystalline hematite spherules at Eagle Crater, proving liquid water once soaked Meridiani Planum.',
    evidenceUrl: 'https://pds-geosciences.wustl.edu/missions/mer/index.htm',
    evidenceType: 'In-Situ Spectrometer Data',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Klingelhöfer et al. (2004), Science 306(5702), 1740–1745.',
    reviewTimestamp: '2026-01-15T12:15:00Z',
  },
  {
    id: 'CLM-VIK1-01',
    artifactId: 'ART-VIKING1-LANDER',
    sourceId: 'SRC-HIRISE-VIKING1',
    statement:
      'Viking 1 Lander touched down at Chryse Planitia (22.4800° N, 312.0339° E) on July 20, 1976—achieving the first uninterrupted long-duration scientific mission on the Martian surface—and operated for 2,245 sols until a battery-charging command error terminated contact on November 11, 1982.',
    evidenceUrl: 'https://www.uahirise.org/ESP_011491_2025',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Lander body, backshell, and heat shield optically verified by MRO HiRISE ESP_011491_2025.',
    reviewTimestamp: '2026-01-16T09:00:00Z',
  },
  {
    id: 'CLM-PERS-01',
    artifactId: 'ART-M2020-PERSEVERANCE',
    sourceId: 'SRC-PDS-M2020',
    statement:
      'Perseverance landed at Octavia E. Butler Landing in Jezero Crater (18.4447° N, 77.4508° E) on February 18, 2021, demonstrated in-situ oxygen extraction from Martian CO₂ via MOXIE (122 g total O₂ across 16 runs), and sealed 24+ rock/regolith/atmospheric sample tubes.',
    evidenceUrl: 'https://naif.jpl.nasa.gov/pub/naif/MARS2020/',
    evidenceType: 'In-Situ Spectrometer Data',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Continuous localization via MRO HiRISE + visual odometry within ±0.25 m.',
    reviewTimestamp: '2026-01-17T15:30:00Z',
  },
  {
    id: 'CLM-ING-01',
    artifactId: 'ART-M2020-INGENUITY',
    sourceId: 'SRC-PDS-M2020',
    statement:
      'The Ingenuity Mars Helicopter completed 72 powered flights across 17.0 km in Mars\'s 1%-density atmosphere before rotor-blade tip damage during Flight 72 landing on January 18, 2024 retired it as a stationary telemetry platform at Valinor Hills (18.4984° N, 77.3122° E).',
    evidenceUrl: 'https://naif.jpl.nasa.gov/pub/naif/MARS2020/',
    evidenceType: 'Mission Flight Log / NSSDC Record',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Imaged by Perseverance Mastcam-Z and HiRISE.',
    reviewTimestamp: '2026-01-18T11:45:00Z',
  },
  {
    id: 'CLM-VOY1-01',
    artifactId: 'ART-VOYAGER1-PROBE',
    sourceId: 'SRC-JPL-HORIZONS-VOY1',
    statement:
      'Voyager 1 crossed the heliopause into interstellar space at 121.6 AU on August 25, 2012, and currently travels at 17.0 km/s beyond 165.4 AU in the constellation Ophiuchus while maintaining two-way S/X-band telemetry with the NASA Deep Space Network.',
    evidenceUrl: 'https://ssd.jpl.nasa.gov/horizons/',
    evidenceType: 'Radio Doppler / VLBI Telemetry',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Range precision ±50 km via two-way coherent Doppler and Delta-DOR VLBI.',
    reviewTimestamp: '2026-02-01T10:00:00Z',
  },
  {
    id: 'CLM-CAS-01',
    artifactId: 'ART-CASSINI-HUYGENS',
    sourceId: 'SRC-PDS-CASSINI-HUYGENS',
    statement:
      'The ESA/NASA Huygens lander soft-landed on Saturn\'s moon Titan at Adiri (10.573° S, 167.547° E) on January 14, 2005, while the Cassini orbiter was intentionally commanded into Saturn\'s upper atmosphere (9.4° N, 53.0° W) on September 15, 2017 to prevent biological contamination of Enceladus and Titan.',
    evidenceUrl: 'https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/Cassini/Cassini.html',
    evidenceType: 'Orbital Optical Imagery',
    verificationStatus: 'VERIFIED',
    uncertaintyNotes: 'Huygens landing site verified by Cassini RADAR synthetic aperture imaging.',
    reviewTimestamp: '2026-01-20T18:00:00Z',
  },
];

const BASE_ARTIFACT_RECORDS: ArtifactRecord[] = [
  {
    id: 'ART-APOLLO11-LM-DS',
    name: 'Apollo 11 Lunar Module "Eagle" Descent Stage & EASEP',
    nssdcaId: '1969-059C',
    missionId: 'MSN-APOLLO-11',
    missionName: 'Apollo 11',
    agency: 'NASA',
    bodyId: 'moon',
    regionName: 'Mare Tranquillitatis (Tranquillity Base)',
    category: 'Descent stage',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Descent stage propulsion and batteries are permanently inactive since July 21, 1969. However, the adjacent deployed Laser Ranging Retroreflector (LRRR) passive optical array remains actively operational.',
    launchDate: '1969-07-16',
    landingOrArrivalDate: '1969-07-20',
    endOfOperationsDate: '1969-07-21',
    massDryKg: 2134,
    powerSystem: 'Four 400-Ah Silver-Zinc Batteries (Depleted) + Passive Optical Retroreflector',
    dimensions: '4.3 m height × 9.5 m diagonally across deployed landing gear footpads',
    coordinates: {
      landingLocation: {
        lat: 0.67416,
        lon: 23.47314,
        elevationM: -1900,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-LROC-NAC-A11',
        imagingReference: 'LROC NAC M104362199R (0.50 m/px)',
      },
      finalDocumentedLocation: {
        lat: 0.67416,
        lon: 23.47314,
        elevationM: -1900,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-LROC-NAC-A11',
        imagingReference: 'LROC NAC M104362199R (0.50 m/px)',
        notes: 'Stationary lander descent stage; astronaut bootprint disturbance trails clearly resolved between LM, LRRR, PSE, and Little West Crater.',
      },
    },
    proceduralModelType: 'lander',
    primaryColorHex: '#D97706',
    accentColorHex: '#94A3B8',
    heroImageUrl: '/src/assets/images/apollo_11_tranquillity_base_1794651249797.jpg',
    heroImageCaption:
      'Archival reconstruction of Apollo 11 Lunar Module Eagle descent stage and EASEP seismic package on Mare Tranquillitatis (AS11-40-5927 reference frame).',
    originalPurpose:
      'Deliver Neil Armstrong and Buzz Aldrin safely to the lunar surface, serve as the launch platform for the Eagle ascent stage, and deploy the Early Apollo Surface Experiments Package (EASEP).',
    scientificAchievements: [
      'Collected 21.55 kg of lunar basalt and breccia samples, calibrating the absolute radiometric chronology of the inner Solar System at ~3.7 billion years for Mare Tranquillitatis.',
      'Deployed the Laser Ranging Retroreflector (LRRR), which continues to measure Earth-Moon recession at 3.8 cm/year and test the Strong Equivalence Principle of General Relativity.',
      'Recorded lunar seismic background and micrometeorite impacts for 21 days via the Passive Seismic Experiment (PSE).',
    ],
    presentConditionSummary:
      'Intact octagonal aluminum alloy structure wrapped in amber Kapton and aluminized Mylar thermal blankets. Ascent engine exhaust slightly tore outer foil panels during liftoff on July 21, 1969.',
    instruments: [
      {
        id: 'INST-A11-LRRR',
        name: 'Laser Ranging Retroreflector',
        acronym: 'LRRR',
        type: 'Fused Silica Corner-Cube Prism Array (100 prisms)',
        principalInvestigator: 'Carroll O. Alley (University of Maryland)',
        massKg: 23.6,
        powerWatts: 0,
        resolutionOrRange: '±1.5 mm Earth-Moon laser time-of-flight range accuracy',
        scientificPurpose: 'Precision lunar orbital dynamics, core interior dissipation, and relativistic gravity tests.',
        keyFindings: 'Revealed a fluid lunar core and confirmed tidal recession of the Moon at 38.08 ± 0.19 mm/yr.',
      },
      {
        id: 'INST-A11-PSE',
        name: 'Passive Seismic Experiment Package',
        acronym: 'PSEP',
        type: 'Tri-axial Long-Period + Vertical Short-Period Seismometer',
        principalInvestigator: 'Gary V. Latham (Lamont-Doherty Earth Observatory)',
        massKg: 47.6,
        powerWatts: 27,
        resolutionOrRange: '0.1 nm ground displacement sensitivity',
        scientificPurpose: 'Detect moonquakes and meteoroid impacts to constrain lunar crustal thickness.',
        keyFindings: 'Demonstrated that lunar seismic waves reverberate for tens of minutes due to dry, fractured regolith.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Engineering a Spider for an Airless World',
        factualParagraphs: [
          {
            text: 'Designed by Grumman Aircraft Engineering Corporation under Thomas Kelly, Lunar Module LM-5 ("Eagle") was the first true spacecraft engineered solely to fly in the vacuum of space without aerodynamic fairings [CLM-A11-01].',
            simpleText: 'The Eagle was the very first spaceship built to fly only in outer space where there is no air [CLM-A11-01].',
            claimIds: ['CLM-A11-01'],
          },
          {
            text: 'Its octagonal descent stage housed the throttleable Descent Propulsion System (DPS) and scientific bays for the Early Apollo Surface Experiments Package [CLM-A11-02].',
            simpleText: 'Its bottom half carried the landing rocket engine and science tools for the astronauts to unpack on the Moon [CLM-A11-02].',
            claimIds: ['CLM-A11-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] I had no wings and no heat shield. My skin was wafer-thin aluminum cloaked in crinkling amber Kapton foil, built for one purpose: to catch two human beings above a sea of ancient basalt and set them gently into lunar dust.',
        telemetryHighlight: { label: 'Descent Engine Thrust', value: '45.04', unit: 'kN' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Twelve02 Alarms Over Boulder Fields',
        factualParagraphs: [
          {
            text: 'Launched atop a Saturn V on July 16, 1969, Eagle undocked from Command Module Columbia in lunar orbit on July 20 and initiated powered descent toward Mare Tranquillitatis [CLM-A11-01].',
            simpleText: 'After launching on a giant Saturn V rocket, Eagle separated from its mother ship in Moon orbit and began descending toward the surface [CLM-A11-01].',
            claimIds: ['CLM-A11-01'],
          },
          {
            text: 'Navigating past 1202 and 1201 guidance computer executive overflow alarms and a boulder-strewn crater (West Crater), Neil Armstrong manually piloted Eagle to touchdown at 20:17:40 UTC at 0.67416° N, 23.47314° E with 25 seconds of hover propellant remaining [CLM-A11-01].',
            simpleText: 'Neil Armstrong steered past large rocks and computer alarms to land safely with less than 30 seconds of landing fuel left [CLM-A11-01].',
            claimIds: ['CLM-A11-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My radar locked onto the gray plain as alarms flashed across the DSKY keypad. I felt Armstrong\'s hand override my autopilot, skimming across a ring of jagged ejecta boulders until my blue contact probes brushed the regolith.',
        telemetryHighlight: { label: 'Touchdown Coordinates', value: '0.674°N 23.473°E', unit: 'IAU Moon' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Two Hours and Thirty-One Minutes on the Regolith',
        factualParagraphs: [
          {
            text: 'During a 2-hour, 31-minute extravehicular activity, Armstrong and Aldrin deployed the Solar Wind Composition foil, the Passive Seismic Experiment 16.8 m south-southwest of the LM, and the Laser Ranging Retroreflector 14 m away [CLM-A11-01, CLM-A11-02].',
            simpleText: 'For two and a half hours, the astronauts walked on the Moon, set up a mirror for Earth lasers, and placed a quake detector [CLM-A11-01, CLM-A11-02].',
            claimIds: ['CLM-A11-01', 'CLM-A11-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] From my porch ladder, humanity stepped onto another world. In the stark vacuum, every footprint stayed razor-sharp in the fine dark soil around my four gold footpads.',
        telemetryHighlight: { label: 'Surface EVA Duration', value: '02:31:40', unit: 'hh:mm:ss' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Titanium Basalts and Relativistic Laser Echoes',
        factualParagraphs: [
          {
            text: 'Returned basalts revealed unexpectedly high titanium concentrations and proved that Mare Tranquillitatis crystallized from ancient volcanic lava flows 3.7 billion years ago [CLM-A11-02].',
            simpleText: 'The rocks brought home showed that the dark patches on the Moon were ancient lava seas from 3.7 billion years ago [CLM-A11-02].',
            claimIds: ['CLM-A11-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Long after my crew departed, the silica prisms resting beside me kept catching green laser pulses from Earth and flinging them home across 384,400 kilometers.',
        telemetryHighlight: { label: 'Returned Sample Mass', value: '21.55', unit: 'kg' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Ascent Pyrotechnic Separation',
        factualParagraphs: [
          {
            text: 'At 17:54 UTC on July 21, 1969, pyrotechnic guillotines severed the interstage umbilical cables and structural bolts, and the Eagle ascent stage fired its 15.6 kN engine, using the descent stage as a launch pad [CLM-A11-01].',
            simpleText: 'When it was time to go home, the top half of Eagle blasted off straight from the bottom half, leaving the landing base behind [CLM-A11-01].',
            claimIds: ['CLM-A11-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Fire washed across my blast deflector shield, tearing gold Kapton ribbons into the black sky as my upper half rose back toward Columbia. Then absolute silence returned.',
        telemetryHighlight: { label: 'LROC NAC Resolution', value: '0.50', unit: 'm/px' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Tranquillity Base as a Protected Heritage Site',
        factualParagraphs: [
          {
            text: 'Beginning in 2009, the Lunar Reconnaissance Orbiter Narrow Angle Camera imaged Tranquillity Base at 50 cm resolution, confirming the descent stage, EASEP instruments, and astronaut boot tracks remain preserved [CLM-A11-01, CLM-A11-02].',
            simpleText: 'NASA\'s Lunar Reconnaissance Orbiter took sharp photos from space showing that the lander and even the astronauts\' footprints are still there today [CLM-A11-01, CLM-A11-02].',
            claimIds: ['CLM-A11-01', 'CLM-A11-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Fifty-seven years of lunar noons and freezing two-week nights have passed over my stainless plaque: "Here men from the planet Earth first set foot upon the Moon, July 1969, A.D."',
        telemetryHighlight: { label: 'LRRR Active Span', value: '57+', unit: 'years' },
      },
    ],
    claimIds: ['CLM-A11-01', 'CLM-A11-02'],
    sourceIds: ['SRC-LROC-NAC-A11', 'SRC-NSSDC-A11', 'SRC-NASA-MOON-CATALOG'],
    relatedArtifactIds: ['ART-SURVEYOR3-LANDER', 'ART-APOLLO15-LRV1', 'ART-APOLLO12-SIVB'],
  },
  {
    id: 'ART-SURVEYOR3-LANDER',
    name: 'Surveyor 3 Robotic Lander',
    nssdcaId: '1967-035A',
    missionId: 'MSN-SURVEYOR-3',
    missionName: 'Surveyor 3 & Apollo 12 Archaeological Inspection',
    agency: 'NASA',
    bodyId: 'moon',
    regionName: 'Oceanus Procellarum ("Surveyor Crater")',
    category: 'Lander',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Operated from April 20 to May 4, 1967; failed to wake after its first lunar night. Visited and partially sampled by Apollo 12 crew on November 20, 1969.',
    launchDate: '1967-04-17',
    landingOrArrivalDate: '1967-04-20',
    endOfOperationsDate: '1967-05-04',
    massDryKg: 296,
    powerSystem: '0.85 m² Solar Panel + Silver-Zinc Battery (Inactive)',
    dimensions: '3.0 m height × 4.27 m tripod footpad diameter',
    coordinates: {
      landingLocation: {
        lat: -2.9958,
        lon: -23.3414,
        elevationM: -1430,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M109215691L & Apollo 12 Surface Survey',
      },
      finalDocumentedLocation: {
        lat: -2.9958,
        lon: -23.3414,
        elevationM: -1430,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M109215691L',
        notes: 'Resting on a 14° interior slope of Surveyor Crater; TV camera and soil scoop were detached and returned to Earth by Apollo 12.',
      },
    },
    proceduralModelType: 'lander',
    primaryColorHex: '#E2E8F0',
    accentColorHex: '#38BDF8',
    heroImageUrl: '/src/assets/images/apollo_11_tranquillity_base_1794651249797.jpg',
    heroImageCaption:
      'Surveyor 3 tripod lander sited on the interior slope of Surveyor Crater in Oceanus Procellarum, 163 m from Apollo 12 Intrepid.',
    originalPurpose:
      'Demonstrate soft landing, measure lunar soil bearing strength with a pantograph surface sampler scoop, and verify that astronauts would not sink into lunar dust.',
    scientificAchievements: [
      'Transmitted 6,315 television images and dug four trenches up to 18 cm deep, proving lunar regolith had a bearing strength of ~20 kPa suitable for Apollo Lunar Modules.',
      'Became the subject of humanity\'s only extraterrestrial archaeological field recovery when Apollo 12 astronauts Pete Conrad and Alan Bean walked 163 m to cut off its television camera, soil scoop, and unpainted aluminum tubing for laboratory analysis on Earth.',
    ],
    presentConditionSummary:
      'Tripod frame remains upright on the eastern inner wall of Surveyor Crater, tanned a warm cinnamon-brown by solar UV and lunar dust blast from Apollo 12\'s landing.',
    instruments: [
      {
        id: 'INST-SURV3-SMSS',
        name: 'Soil Mechanics Surface Sampler',
        acronym: 'SMSS',
        type: 'Pantograph Electromechanical Trenching Scoop',
        principalInvestigator: 'Ronald F. Scott (Caltech)',
        massKg: 3.8,
        powerWatts: 15,
        resolutionOrRange: '0.6 m reach, 18 cm trench depth',
        scientificPurpose: 'Perform bearing, trenching, and impact tests on in-situ lunar regolith.',
        keyFindings: 'Confirmed cohesive, fine-grained basaltic soil that compacted firmly under load.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Testing Whether the Moon Would Swallow Apollo',
        factualParagraphs: [
          {
            text: 'Before Apollo could commit human crews to lunar touchdown, engineers needed direct mechanical proof of how lunar soil behaved below the top millimeter [CLM-SURV3-01].',
            simpleText: 'Before astronauts could land on the Moon, scientists needed a robot to dig into the dirt and make sure spaceships wouldn\'t sink [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] I was built at Hughes Aircraft with three spindly legs, a rotating mirror eye, and a mechanical claw on an accordion arm.',
        telemetryHighlight: { label: 'Landed Dry Mass', value: '296.0', unit: 'kg' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Three Bounces Into a Lunar Crater',
        factualParagraphs: [
          {
            text: 'On April 20, 1967, highly reflective rocks confused Surveyor 3\'s radar altimeter, preventing vernier engine cutoff at 4.3 m altitude and causing the lander to bounce twice before coming to rest inside a 200-meter crater at 2.9958° S, 23.3414° W [CLM-SURV3-01].',
            simpleText: 'During landing, bright rocks confused the radar, so Surveyor 3 bounced twice like a stone before stopping on the slope of a crater [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My vernier thrusters kept firing as my footpads struck the slope—once, twice, three times—leaving waffle-patterned imprints in the gray dust.',
        telemetryHighlight: { label: 'Touchdown Bounces', value: '2', unit: 'rebounds' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Eighteen Hours of Digging in Vacuum',
        factualParagraphs: [
          {
            text: 'Across 14 Earth days of lunar sunlight, Surveyor 3 operated its Soil Mechanics Surface Sampler for 18 hours, digging four trenches and crushing small clods [CLM-SURV3-01].',
            simpleText: 'For two weeks of lunar daylight, Surveyor 3 dug four trenches and took over 6,000 pictures [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My little blue scoop bit into the regolith again and again while my camera watched every grain fall in 1/6th gravity.',
        telemetryHighlight: { label: 'Images Transmitted', value: '6,315', unit: 'frames' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'When Humans Walked Up to a Silent Robot',
        factualParagraphs: [
          {
            text: 'On November 19, 1969, Apollo 12 Lunar Module Intrepid executed a pinpoint landing 163 m away, and astronauts Conrad and Bean inspected Surveyor 3 in person on November 20 [CLM-SURV3-01].',
            simpleText: 'Two and a half years later, Apollo 12 astronauts landed right next door and walked over to inspect Surveyor 3 in person [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] After thirty-one months of silence, a new shadow fell across my crater wall. Two white-suited astronauts stood beside me, laughing into their microphones and snapping my portrait.',
        telemetryHighlight: { label: 'Apollo 12 Miss Distance', value: '163', unit: 'm' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'First Extraterrestrial Archaeological Recovery',
        factualParagraphs: [
          {
            text: 'Using shearing cutters, Conrad and Bean detached Surveyor 3\'s television camera and soil scoop, returning 10 kg of weathered spacecraft hardware to Earth for micrometeorite and solar wind exposure analysis [CLM-SURV3-01].',
            simpleText: 'The astronauts clipped off Surveyor 3\'s camera and scoop and brought them back to Earth so scientists could study how space weather affected the metal [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My eye now rests inside the Smithsonian National Air and Space Museum on Earth, while my three legs still stand watch in Oceanus Procellarum.',
        telemetryHighlight: { label: 'Lunar Exposure Studied', value: '942', unit: 'days' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Foundational Benchmark of Space Weathering',
        factualParagraphs: [
          {
            text: 'Metallurgical and optical tests on returned Surveyor 3 components provided the first empirical data on secondary lunar ejecta pitting and solar wind sputtering on spacecraft materials [CLM-SURV3-01].',
            simpleText: 'Studying Surveyor 3\'s parts taught engineers how to build tougher spacecraft for long stays on the Moon [CLM-SURV3-01].',
            claimIds: ['CLM-SURV3-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] I remain the only spacecraft on another world ever visited by human hands after completing its mission.',
        telemetryHighlight: { label: 'Pitting Density', value: '103', unit: 'pits/cm²' },
      },
    ],
    claimIds: ['CLM-SURV3-01'],
    sourceIds: ['SRC-NASA-MOON-CATALOG', 'SRC-LROC-NAC-A11'],
    relatedArtifactIds: ['ART-APOLLO11-LM-DS', 'ART-APOLLO12-SIVB'],
  },
  {
    id: 'ART-LUNOKHOD2-ROVER',
    name: 'Lunokhod 2 (8EL No. 204) Robotic Rover',
    nssdcaId: '1973-001A',
    missionId: 'MSN-LUNA-21',
    missionName: 'Luna 21 / Lunokhod 2',
    agency: 'Roscosmos / USSR',
    bodyId: 'moon',
    regionName: 'Le Monnier Crater (Eastern Mare Serenitatis)',
    category: 'Rover',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Rover locomotion and telemetry ceased in May 1973 after lunar soil entered the open solar radiator lid and caused overheating. Its French-built laser retroreflector panel remains operational.',
    launchDate: '1973-01-08',
    landingOrArrivalDate: '1973-01-15',
    endOfOperationsDate: '1973-05-11',
    massDryKg: 840,
    powerSystem: 'Hinged Gallium-Arsenide Solar Clamshell Lid + Polonium-210 Thermal Heater',
    dimensions: '1.35 m height × 1.70 m length × 1.60 m width (8 titanium mesh wheels)',
    traverseDistanceKm: 39.1,
    coordinates: {
      landingLocation: {
        lat: 25.85,
        lon: 30.45,
        elevationM: -2590,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 1.0,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-LROC-LUNOKHOD2',
        imagingReference: 'LROC NAC M122007650L (Luna 21 descent stage)',
      },
      finalOperatingLocation: {
        lat: 25.8323,
        lon: 30.9221,
        elevationM: -2480,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-LROC-LUNOKHOD2',
        imagingReference: 'LROC NAC M122007650L',
      },
      finalDocumentedLocation: {
        lat: 25.8323,
        lon: 30.9221,
        elevationM: -2480,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-LROC-LUNOKHOD2',
        imagingReference: 'LROC NAC M122007650L (0.50 m/px)',
        notes: 'Optically localized in March 2010 on the eastern edge of a small crater along Fossa Recta rille.',
      },
    },
    proceduralModelType: 'rover',
    primaryColorHex: '#CBD5E1',
    accentColorHex: '#06B6D4',
    heroImageUrl: '/src/assets/images/lunokhod_2_le_monnier_1794651252935.jpg',
    heroImageCaption:
      'Lunokhod 2 eight-wheeled robotic rover with hinged solar clamshell lid and CNES laser retroreflector in Le Monnier Crater.',
    originalPurpose:
      'Conduct long-range geological and magnetic reconnaissance across the mare-highland transition zone in Le Monnier crater.',
    scientificAchievements: [
      'Held the off-world roving distance record (39.1 km) for 41 years until surpassed by NASA\'s Opportunity rover on Mars in July 2014.',
      'Transmitted 86 panoramic photographs and over 80,000 television frames while performing 740 mechanical soil-penetrometer measurements.',
      'Revealed that lunar sky brightness during the lunar day is 13–15 magnitudes brighter than expected due to electrostatically levitated dust grains.',
    ],
    presentConditionSummary:
      'Parked just outside a fresh 9-meter crater where its open solar lid scooped dark insulating regolith onto its thermal radiator.',
    instruments: [
      {
        id: 'INST-LUNO2-RIFMA',
        name: 'RIFMA-M X-Ray Fluorescence Spectrometer',
        acronym: 'RIFMA-M',
        type: 'Isotopic X-Ray Fluorescence Elemental Analyzer',
        principalInvestigator: 'G. E. Kocharov (Ioffe Physical-Technical Institute)',
        massKg: 6.2,
        powerWatts: 12,
        resolutionOrRange: 'Mg, Al, Si, Ca, Ti, Fe elemental weight ratios',
        scientificPurpose: 'Compare basaltic mare floor chemistry with bright highland massif slopes.',
        keyFindings: 'Detected higher aluminum-to-silicon and lower iron content on the southern highland hills of Le Monnier.',
      },
      {
        id: 'INST-LUNO2-TL2',
        name: 'CNES French Corner-Cube Laser Retroreflector',
        acronym: 'TL-2',
        type: '14-Prism Fused Silica Retroreflector Panel',
        principalInvestigator: 'Centre National d\'Études Spatiales (CNES) / Lebedev Institute',
        massKg: 3.5,
        powerWatts: 0,
        resolutionOrRange: '±2 cm laser ranging precision',
        scientificPurpose: 'Geodetic lunar libration and relativity measurements.',
        keyFindings: 'Still actively ranged by lunar laser observatories on Earth.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'An Eight-Wheeled Pressurized Tub Built at Lavochkin',
        factualParagraphs: [
          {
            text: 'Designed by Alexander Kemurdzhian and Georgy Babakin at NPO Lavochkin, Lunokhod 2 featured eight independently powered titanium-mesh wheels and a pressurized magnesium-alloy instrument hull [CLM-LUNO2-01].',
            simpleText: 'Soviet engineers built Lunokhod 2 with eight wire-mesh wheels and a pressurized body to keep its electronics warm and safe [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Five human drivers back in Simferopol steered me through a three-second time delay, looking out through my three television eyes.',
        telemetryHighlight: { label: 'Wheel Count', value: '8', unit: 'titanium mesh' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Descending Into Le Monnier Crater',
        factualParagraphs: [
          {
            text: 'Delivered by the Luna 21 lander on January 15, 1973, Lunokhod 2 rolled down twin ramps onto the basaltic floor of Le Monnier crater at 25.850° N, 30.450° E [CLM-LUNO2-01].',
            simpleText: 'Luna 21 landed inside Le Monnier crater and lowered two ramps so Lunokhod 2 could roll onto the Moon [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My spiked titanium rims bit into the dark mare basalt as I rolled off Luna 21\'s landing stage and opened my solar clamshell lid to the sun.',
        telemetryHighlight: { label: 'Landing Latitude', value: '25.850°', unit: 'N' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Thirty-Nine Kilometers Along Fossa Recta',
        factualParagraphs: [
          {
            text: 'Across four lunar days, Lunokhod 2 drove south to the highland foothills and then east to the tectonic graben Fossa Recta, covering 39.1 km [CLM-LUNO2-01].',
            simpleText: 'Over four months, Lunokhod 2 drove 39.1 kilometers across plains, hills, and a deep lunar trench [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Every few meters my cone-vane penetrometer punched into the soil, measuring its shear strength as I climbed toward the rille.',
        telemetryHighlight: { label: 'Verified Traverse', value: '39.10', unit: 'km' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Highland Geochemistry and Levitated Dust',
        factualParagraphs: [
          {
            text: 'Using its RIFMA-M X-ray spectrometer and astrophotometer, Lunokhod 2 measured the chemical transition from iron-rich mare to aluminum-rich highland crust and detected a faint cloud of electrostatically suspended dust [CLM-LUNO2-01].',
            simpleText: 'Its sensors showed how the rock chemistry changes between lunar valleys and hills, and found tiny dust particles floating above the ground [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] When my photometer looked straight up into the daytime lunar sky, it saw a faint glow—microscopic dust grains lifted by sunlight and static charge.',
        telemetryHighlight: { label: 'Panoramas Captured', value: '86', unit: 'mosaics' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'The Fatal Scoop of Regolith on May 9, 1973',
        factualParagraphs: [
          {
            text: 'While maneuvering inside a fresh small crater on May 9, 1973, Lunokhod 2\'s open solar lid brushed the crater wall and dumped dark lunar dust onto its top radiator when the lid closed for the night, causing internal overheating to 47°C and ending telemetry on May 11 [CLM-LUNO2-01].',
            simpleText: 'While driving out of a small crater, its open lid accidentally scooped dark Moon dirt onto its cooling radiator, causing the rover to overheat [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] That dark basalt powder was a perfect thermal blanket. When I closed my lid, the dust spilled across my cooling mirror, and my fever rose beyond recovery.',
        telemetryHighlight: { label: 'Final Resting Site', value: '25.832°N 30.922°E', unit: 'IAU Moon' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Rediscovered From Orbit 37 Years Later',
        factualParagraphs: [
          {
            text: 'In March 2010, Phil Stooke and the LROC team located Lunokhod 2 at 25.8323° N, 30.9221° E in LROC NAC imagery, enabling Apache Point Observatory laser rangers to lock onto its retroreflector with 4× stronger return signals than before [CLM-LUNO2-01].',
            simpleText: 'In 2010, NASA\'s lunar orbiter spotted Lunokhod 2 and its tracks from space, helping astronomers aim lasers directly at its mirror again [CLM-LUNO2-01].',
            claimIds: ['CLM-LUNO2-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] For thirty-seven years my exact parking spot was uncertain by kilometers—until an American camera in orbit traced my wheel tracks right to my resting place.',
        telemetryHighlight: { label: 'Soil Tests Completed', value: '740', unit: 'tests' },
      },
    ],
    claimIds: ['CLM-LUNO2-01'],
    sourceIds: ['SRC-LROC-LUNOKHOD2', 'SRC-NASA-MOON-CATALOG'],
    relatedArtifactIds: ['ART-APOLLO15-LRV1', 'ART-MERB-OPPORTUNITY'],
    traversePath: [
      { solOrDay: 1, label: 'Luna 21 Landing Site', lat: 25.85, lon: 30.45, elevationM: -2590, distanceKm: 0.0 },
      { solOrDay: 18, label: 'Southern Highland Foothills', lat: 25.74, lon: 30.52, elevationM: -2390, distanceKm: 11.4 },
      { solOrDay: 52, label: 'Central Mare Ridge', lat: 25.79, lon: 30.72, elevationM: -2510, distanceKm: 26.8 },
      { solOrDay: 95, label: 'Fossa Recta Graben West Rim', lat: 25.82, lon: 30.89, elevationM: -2495, distanceKm: 36.2 },
      { solOrDay: 116, label: 'Final Resting Site (East Crater)', lat: 25.8323, lon: 30.9221, elevationM: -2480, distanceKm: 39.1 },
    ],
  },
  {
    id: 'ART-APOLLO15-LRV1',
    name: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    nssdcaId: '1971-063C-LRV',
    missionId: 'MSN-APOLLO-15',
    missionName: 'Apollo 15',
    agency: 'NASA',
    bodyId: 'moon',
    regionName: 'Hadley-Apennine (Palus Putredinis)',
    category: 'Rover',
    operationalStatus: 'Retired',
    statusExplanation:
      'Completed three geological EVAs totaling 27.76 km and televised the Falcon ascent liftoff on August 2, 1971 before battery depletion.',
    launchDate: '1971-07-26',
    landingOrArrivalDate: '1971-07-30',
    endOfOperationsDate: '1971-08-02',
    massDryKg: 210,
    powerSystem: 'Two 36-V Silver-Zinc Non-Rechargeable Batteries (121 Ah each)',
    dimensions: '3.10 m length × 1.83 m wheelbase × 1.14 m height',
    traverseDistanceKm: 27.76,
    coordinates: {
      landingLocation: {
        lat: 26.1322,
        lon: 3.6339,
        elevationM: -1750,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M111571816L (Falcon Descent Stage)',
      },
      finalDocumentedLocation: {
        lat: 26.134,
        lon: 3.6298,
        elevationM: -1748,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 0.5,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M111571816L',
        notes: 'Parked 140 m east of the Falcon descent stage with the "Fallen Astronaut" memorial plaque and Ground-Commanded Television Assembly.',
      },
    },
    proceduralModelType: 'rover',
    primaryColorHex: '#F8FAFC',
    accentColorHex: '#F59E0B',
    heroImageUrl: '/src/assets/images/lunokhod_2_le_monnier_1794651252935.jpg',
    heroImageCaption:
      'Apollo 15 LRV-1 traverse operations between Mons Hadley Delta and Hadley Rille.',
    originalPurpose:
      'Expand astronaut geological field range from <1.5 km walking radius to >25 km, enabling sampling of the Apennine Mountain front and Hadley Rille.',
    scientificAchievements: [
      'Enabled discovery of Sample 15415 ("Genesis Rock"), a 4.1-billion-year-old ferroan anorthosite from the primordial lunar magma ocean crust.',
      'Provided live remote-controlled television broadcast of a Lunar Module liftoff from the Moon.',
    ],
    presentConditionSummary:
      'Intact folding aluminum chassis with zinc-coated woven steel piano-wire wheels, parked facing west toward the Falcon descent stage.',
    instruments: [
      {
        id: 'INST-LRV1-GCTA',
        name: 'Ground-Commanded Television Assembly',
        acronym: 'GCTA',
        type: 'RCA Color Field-Sequential TV Camera + High-Gain S-Band Umbrella Antenna',
        principalInvestigator: 'Ed Fendell (NASA MSC Flight Control)',
        massKg: 5.9,
        powerWatts: 18,
        resolutionOrRange: '525-line color video via S-Band direct link',
        scientificPurpose: 'Document geological outcrops in situ and monitor Lunar Module ascent.',
        keyFindings: 'Transmitted real-time outcrop surveys along Spur Crater and Hadley Rille.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Folding a Car Into a Quadrant of the Lunar Module',
        factualParagraphs: [
          {
            text: 'Developed by Boeing and General Motors Delco Electronics in just 17 months, LRV-1 folded like origami into Quadrant 1 of the Apollo 15 J-mission Lunar Module Falcon [CLM-LRV1-01].',
            simpleText: 'Engineers built a lightweight electric Moon buggy that folded up tightly to fit inside the side of the lander [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My four wheels were woven from 800 strands of zinc-coated piano wire with titanium chevrons, weighing only 34 kilograms in lunar gravity.',
        telemetryHighlight: { label: 'Lunar Weight', value: '34.3', unit: 'kg-force' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Unfolding Under the Shadow of Mons Hadley',
        factualParagraphs: [
          {
            text: 'On July 31, 1971, David Scott and James Irwin pulled two lanyard tapes to deploy LRV-1 onto the Palus Putredinis plain at 26.1322° N, 3.6339° E [CLM-LRV1-01].',
            simpleText: 'After landing near towering mountains, the astronauts pulled ribbons that unfolded the rover onto the ground [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Torsion bars snapped my front and rear axles open as my wheels touched the dusty plain between Mount Hadley and the winding rille.',
        telemetryHighlight: { label: 'Top Speed', value: '13.0', unit: 'km/h' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Climbing the Apennine Front to Spur Crater',
        factualParagraphs: [
          {
            text: 'Across three EVAs totaling 3 hours and 2 minutes of driving time, LRV-1 carried the crew 27.76 km along the base of Mons Hadley Delta and the rim of Hadley Rille [CLM-LRV1-01].',
            simpleText: 'Over three days, the astronauts drove 27.76 kilometers up mountain slopes and along the edge of a giant canyon [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Though my front steering motor initially balked on EVA-1, my rear steering carried Scott and Irwin up 10-degree mountain slopes.',
        telemetryHighlight: { label: 'Total Odometer', value: '27.76', unit: 'km' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'The White Gleam of the Genesis Rock',
        factualParagraphs: [
          {
            text: 'At Station 7 on the rim of Spur Crater, LRV-1 enabled the crew to recover Sample 15415 ("Genesis Rock"), confirming the primordial anorthositic crust predicted by the lunar magma ocean hypothesis [CLM-LRV1-01].',
            simpleText: 'Thanks to the rover\'s reach, the astronauts found the famous "Genesis Rock," a piece of the Moon\'s original ancient crust [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Perched on a pedestal of darker breccia sat a gleaming white crystal of plagioclase feldspar—4.1 billion years old.',
        telemetryHighlight: { label: 'Sample 15415 Age', value: '4.10', unit: 'Gyr' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Parking at the VIP Site for Liftoff',
        factualParagraphs: [
          {
            text: 'Before departing on August 2, 1971, Scott parked LRV-1 140 m east of Falcon at 26.1340° N, 3.6298° E, placing a small aluminum sculpture ("Fallen Astronaut") nearby and aiming the TV camera at the lander [CLM-LRV1-01].',
            simpleText: 'Before leaving, the astronauts parked the rover a short distance away so its camera could film their spaceship blasting off [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My television lens watched Falcon\'s ascent stage erupt in a flash of hypergolic confetti and climb into orbit.',
        telemetryHighlight: { label: 'VIP Parking Offset', value: '140', unit: 'm East' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Blueprint for Future Pressurized Lunar Cruisers',
        factualParagraphs: [
          {
            text: 'LRV-1 proved that wheeled electric mobility multiplies scientific return per mission, directly informing Artemis Lunar Terrain Vehicle (LTV) specifications [CLM-LRV1-01].',
            simpleText: 'The first Moon buggy proved how valuable rovers are for exploring space, inspiring the new rovers being built for Artemis astronauts [CLM-LRV1-01].',
            claimIds: ['CLM-LRV1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] LROC cameras still resolve my bright chassis and the twin wheel ruts curving southward toward Mons Hadley Delta.',
        telemetryHighlight: { label: 'Geology Stations', value: '10', unit: 'sites' },
      },
    ],
    claimIds: ['CLM-LRV1-01'],
    sourceIds: ['SRC-NASA-MOON-CATALOG'],
    relatedArtifactIds: ['ART-APOLLO11-LM-DS', 'ART-LUNOKHOD2-ROVER'],
    traversePath: [
      { solOrDay: 1, label: 'Falcon Landing Site', lat: 26.1322, lon: 3.6339, elevationM: -1750, distanceKm: 0.0 },
      { solOrDay: 1, label: 'Elbow Crater (Station 1)', lat: 26.091, lon: 3.605, elevationM: -1730, distanceKm: 5.2 },
      { solOrDay: 2, label: 'Spur Crater / Genesis Rock (Station 7)', lat: 26.078, lon: 3.645, elevationM: -1620, distanceKm: 16.9 },
      { solOrDay: 3, label: 'Hadley Rille Rim (Station 9A)', lat: 26.138, lon: 3.598, elevationM: -1765, distanceKm: 24.5 },
      { solOrDay: 3, label: 'VIP Final Parking Site', lat: 26.134, lon: 3.6298, elevationM: -1748, distanceKm: 27.76 },
    ],
  },
  {
    id: 'ART-APOLLO12-SIVB',
    name: 'Apollo 12 Saturn S-IVB-507 Third Stage Impactor',
    nssdcaId: '1969-099B',
    missionId: 'MSN-APOLLO-12',
    missionName: 'Apollo 12 Active Seismic Impact Experiment',
    agency: 'NASA',
    bodyId: 'moon',
    regionName: 'Southeastern Oceanus Procellarum',
    category: 'Impacted hardware',
    operationalStatus: 'Impacted',
    statusExplanation:
      'Jettisoned upper rocket stage; impacted the lunar surface to serve as a calibrated kinetic seismic source. Note: Apollo 12 LM Ascent Stage later impacted at 3.94° S, 21.20° W on Nov 20, 1969.',
    launchDate: '1969-11-14',
    landingOrArrivalDate: '1969-11-20',
    endOfOperationsDate: '1969-11-20',
    massDryKg: 13400,
    powerSystem: 'J-2 Cryogenic Stage + Auxiliary Propulsion System (Depleted)',
    dimensions: '17.8 m length × 6.6 m diameter (Pre-impact)',
    coordinates: {
      impactLocation: {
        lat: -2.75,
        lon: -20.07,
        elevationM: -1350,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 15000,
        verification: 'ESTIMATED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        notes: 'Historical tracking estimate (±15 km); explicitly marked as ESTIMATED rather than exact optical measurement.',
      },
    },
    proceduralModelType: 'impactor',
    primaryColorHex: '#F43F5E',
    accentColorHex: '#F8FAFC',
    heroImageUrl: '/src/assets/images/apollo_11_tranquillity_base_1794651249797.jpg',
    heroImageCaption:
      'Saturn S-IVB/LM artificial seismic impact geometry recorded by the Apollo 12 ALSEP Passive Seismic Experiment.',
    originalPurpose:
      'Inject the Apollo 12 spacecraft into translunar trajectory and provide kinetic impact energy for lunar interior seismic tomography.',
    scientificAchievements: [
      'Artificial impact experiments during Apollo 12 demonstrated that the Moon "rang like a bell" for over 55 minutes due to extremely low seismic attenuation in dry, vacuum-fractured basalt.',
    ],
    presentConditionSummary:
      'Fragmented hypervelocity impact debris field surrounding a ~30–40 m artificial crater.',
    instruments: [
      {
        id: 'INST-SIVB-TRACK',
        name: 'S-Band Transponder & Kinetic Impactor Mass',
        acronym: 'S-IVB-KIN',
        type: 'Calibrated Kinetic Impactor',
        principalInvestigator: 'Gary V. Latham (ALSEP Seismic Team)',
        massKg: 13400,
        powerWatts: 0,
        resolutionOrRange: '3.36 × 10⁹ Joules kinetic impact calibration',
        scientificPurpose: 'Generate known-time, known-energy seismic waves to probe lunar crustal velocity structure.',
        keyFindings: 'Constrained upper lunar crust P-wave velocity between 4.0 and 6.0 km/s.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Turning Spent Rocket Stages Into Seismic Hammers',
        factualParagraphs: [
          {
            text: 'Seismologists realized that spent Saturn S-IVB third stages and Lunar Module ascent stages had precisely known masses and impact speeds, making them ideal artificial meteoroids for probing the Moon\'s interior [CLM-SIVB12-01].',
            simpleText: 'Scientists realized that crashing empty rocket stages into the Moon at a known speed would create artificial moonquakes to X-ray the Moon\'s inside [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Once my J-2 engine hurled Yankee Clipper and Intrepid toward the Moon, my final duty was to become a tuning fork for lunar geology.',
        telemetryHighlight: { label: 'Stage Dry Mass', value: '13,400', unit: 'kg' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Translunar Injection and Trajectory Dispersion',
        factualParagraphs: [
          {
            text: 'Following separation on November 14, 1969, auxiliary venting anomalies dispersed the S-IVB-507 trajectory while the Apollo 12 LM ascent stage was deliberately deorbited on November 20, 1969 [CLM-SIVB12-01].',
            simpleText: 'After separating from the astronauts\' capsule, the stage hurtled toward the lunar surface [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Travelling at over 1.68 kilometers per second, our impact flashed briefly into vacuum.',
        telemetryHighlight: { label: 'Positional Uncertainty', value: '±15.0', unit: 'km' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Fifty-Five Minutes of Lunar Reverberation',
        factualParagraphs: [
          {
            text: 'When the Apollo 12 ascent stage struck 73 km from the ALSEP seismometer, seismic waves built slowly to a peak and reverberated for over 55 minutes [CLM-SIVB12-01].',
            simpleText: 'When the stage hit the Moon, the ground shook for nearly an hour because dry Moon rock has no water to dampen vibrations [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] On Earth, water-logged rock dampens shockwaves in seconds. On the bone-dry Moon, our echo rang and scattered for nearly an hour.',
        telemetryHighlight: { label: 'Seismic Ring Duration', value: '55+', unit: 'minutes' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Mapping the Fractured Megaregolith',
        factualParagraphs: [
          {
            text: 'The prolonged seismic coda proved that the upper 20 km of the lunar crust consists of intensely brecciated, waterless "megaregolith" that scatters acoustic energy without absorbing it [CLM-SIVB12-01].',
            simpleText: 'The long vibration proved the top 20 kilometers of the Moon is made of dry, shattered rock layers [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Every subsequent Apollo S-IVB stage—from Apollo 13 through Apollo 17—was targeted directly into the Moon to complete the seismic network.',
        telemetryHighlight: { label: 'Crustal Scattering Depth', value: '20.0', unit: 'km' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Hypervelocity Excavation',
        factualParagraphs: [
          {
            text: 'Unlike soft landers, impacted stages excavate fresh butterfly-shaped ejecta ray craters roughly 30 to 40 meters wide [CLM-SIVB12-01].',
            simpleText: 'Instead of sitting intact on the surface, impacted rocket stages carve out fresh 30-to-40-meter craters [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] I became part of the lunar geology I was sent to measure—a fresh scar of bright ejecta rays across dark mare lava.',
        telemetryHighlight: { label: 'Crater Diameter', value: '~35', unit: 'm' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Separating Exact Optical Fixes from Historical Estimates',
        factualParagraphs: [
          {
            text: 'In planetary archaeology, pre-LRO impact estimates carry ±15 km uncertainty until optically matched in LROC NAC imagery, illustrating why AFTERLIGHT strictly distinguishes ESTIMATED from VERIFIED coordinates [CLM-SIVB12-01].',
            simpleText: 'Some older crash sites only have estimated locations until satellites spot their exact craters, which is why scientists carefully label estimated vs. verified spots [CLM-SIVB12-01].',
            claimIds: ['CLM-SIVB12-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Scientific integrity requires marking where uncertainty remains.',
        telemetryHighlight: { label: 'Epistemic Status', value: 'ESTIMATED', unit: '±15 km' },
      },
    ],
    claimIds: ['CLM-SIVB12-01'],
    sourceIds: ['SRC-NASA-MOON-CATALOG'],
    relatedArtifactIds: ['ART-SURVEYOR3-LANDER', 'ART-APOLLO11-LM-DS'],
  },
  {
    id: 'ART-CHANGE4-YUTU2',
    name: 'Chang\'e 4 Lander & Yutu-2 Far-Side Rover',
    nssdcaId: '2018-103A',
    missionId: 'MSN-CHANGE-4',
    missionName: 'Chang\'e 4 Lunar Far-Side Expedition',
    agency: 'CNSA',
    bodyId: 'moon',
    regionName: 'Von Kármán Crater (South Pole-Aitken Basin, Far Side)',
    category: 'Rover',
    operationalStatus: 'Extended mission',
    statusExplanation:
      'Landed January 3, 2019; continues intermittent surface telemetry and spectrometer operations via the Queqiao relay satellite well beyond its initial design lifetime.',
    launchDate: '2018-12-07',
    landingOrArrivalDate: '2019-01-03',
    massDryKg: 1340,
    powerSystem: 'Triple-Junction GaAs Solar Panels + Plutonium-238 RHU Thermal Units',
    dimensions: 'Lander: 3.7 m span; Yutu-2 Rover: 1.5 m × 1.0 m × 1.1 m (140 kg)',
    traverseDistanceKm: 1.61,
    coordinates: {
      landingLocation: {
        lat: -45.4561,
        lon: 177.5885,
        elevationM: -5926,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 1.0,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M1303619844LR',
      },
      finalDocumentedLocation: {
        lat: -45.448,
        lon: 177.579,
        elevationM: -5918,
        datum: 'IAU Moon 2000 Mean Earth / Polar Axis',
        confidenceRadiusM: 2.0,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-NASA-MOON-CATALOG',
        imagingReference: 'LROC NAC M1303619844LR & Yutu-2 NavCam',
      },
    },
    proceduralModelType: 'rover',
    primaryColorHex: '#38BDF8',
    accentColorHex: '#F59E0B',
    heroImageUrl: '/src/assets/images/lunokhod_2_le_monnier_1794651252935.jpg',
    heroImageCaption:
      'Chang\'e 4 and Yutu-2 operating on the floor of Von Kármán crater within the South Pole-Aitken Basin.',
    originalPurpose:
      'Achieve the first soft landing on the farside of the Moon and investigate deep mantle ejecta inside the 2,500-km South Pole-Aitken impact basin.',
    scientificAchievements: [
      'Identified low-calcium pyroxene and olivine minerals originating from the deep lunar lower crust or upper mantle.',
      'Mapped over 300 m of subsurface ejecta stratigraphy using twin-frequency Lunar Penetrating Radar (LPR).',
    ],
    presentConditionSummary:
      'Operational in extended mission mode inside Von Kármán crater on the lunar far side.',
    instruments: [
      {
        id: 'INST-CE4-LPR',
        name: 'Lunar Penetrating Radar',
        acronym: 'LPR',
        type: 'Dual-Channel Ground Penetrating Radar (60 MHz & 500 MHz)',
        principalInvestigator: 'Su Yan (National Astronomical Observatories, CAS)',
        massKg: 15.4,
        powerWatts: 28,
        resolutionOrRange: '40 m high-res regolith depth / 300 m deep basalt structure',
        scientificPurpose: 'Image subsurface ejecta layers beneath the floor of Von Kármán crater.',
        keyFindings: 'Revealed a 12-meter fine regolith layer atop alternating coarse ejecta boulders.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Solving the Radio Silence of the Far Side',
        factualParagraphs: [
          {
            text: 'Because the Moon is tidally locked, its far side permanently faces away from Earth, blocking direct radio communications until the Queqiao relay satellite was placed in a halo orbit around the Earth-Moon L2 point [CLM-CE4-01].',
            simpleText: 'Because the far side of the Moon always faces away from Earth, a special relay satellite had to be parked in space first to bounce radio signals back and forth [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] I was built to descend into the oldest, deepest impact basin on the Moon—a place where Earth never rises in the sky.',
        telemetryHighlight: { label: 'Landing Elevation', value: '-5,926', unit: 'm' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Autonomous Laser Obstacle Avoidance Over Von Kármán',
        factualParagraphs: [
          {
            text: 'On January 3, 2019, Chang\'e 4 used autonomous laser 3D imaging and optical hazard avoidance to touch down at 45.4561° S, 177.5885° E [CLM-CE4-01].',
            simpleText: 'Using laser scanners to dodge rocks automatically, Chang\'e 4 made the first gentle landing on the far side of the Moon [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] With no human able to steer me directly through the lunar bulk, my onboard cameras scanned the crater floor and guided my thruster down.',
        telemetryHighlight: { label: 'Far-Side Longitude', value: '177.589°', unit: 'E' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Yutu-2 Rolls Onto the South Pole-Aitken Floor',
        factualParagraphs: [
          {
            text: 'Hours after landing, the six-wheeled Yutu-2 rover deployed down dual rails and began profiling subsurface stratigraphy with its 500 MHz Lunar Penetrating Radar [CLM-CE4-01].',
            simpleText: 'Hours after landing, the six-wheeled Yutu-2 rover rolled down its ramp and started scanning underground layers with radar [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Every two weeks I fold my solar wings and sleep through -190°C nights, warmed by radioisotope heaters.',
        telemetryHighlight: { label: 'Radar Depth', value: '300', unit: 'm' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Deep Crustal Minerals and Impact Glass Globules',
        factualParagraphs: [
          {
            text: 'Visible and Near-Infrared Imaging Spectrometer (VNIS) spectra confirmed orthopyroxene and olivine excavated from deep beneath the lunar surface by the Finsen crater impact [CLM-CE4-01].',
            simpleText: 'Its light sensors detected deep Moon minerals blasted up from far underground by ancient asteroid impacts [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Along my path I even photographed translucent centimetre-sized impact glass spheres resting on the pale regolith.',
        telemetryHighlight: { label: 'LROC NAC Fix', value: '±1.0', unit: 'm' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Continuing Extended Operations',
        factualParagraphs: [
          {
            text: 'Originally designed for a 3-month surface mission, Yutu-2 has survived over 70 lunar nights and remains in extended operational status [CLM-CE4-01].',
            simpleText: 'Designed to last only 3 months, Yutu-2 has survived for years on the far side of the Moon [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My story has not ended yet; each lunar dawn my solar panels unfold once more.',
        telemetryHighlight: { label: 'Status', value: 'EXTENDED', unit: 'active' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Opening the Lunar South Pole & Far Side',
        factualParagraphs: [
          {
            text: 'International cooperation between CNSA and the NASA LROC science team allowed LRO to image the Chang\'e 4 site from orbit, establishing a global geodetic tie point on the lunar far side [CLM-CE4-01].',
            simpleText: 'NASA\'s lunar orbiter photographed Chang\'e 4 from above, creating an exact map marker on the Moon\'s far side [CLM-CE4-01].',
            claimIds: ['CLM-CE4-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Above me, cameras from another nation captured my tiny bright silhouette against the gray floor of Von Kármán.',
        telemetryHighlight: { label: 'Traverse Distance', value: '1.61', unit: 'km' },
      },
    ],
    claimIds: ['CLM-CE4-01'],
    sourceIds: ['SRC-NASA-MOON-CATALOG'],
    relatedArtifactIds: ['ART-LUNOKHOD2-ROVER', 'ART-APOLLO11-LM-DS'],
  },
  {
    id: 'ART-MERB-OPPORTUNITY',
    name: 'Mars Exploration Rover-B "Opportunity" (MER-1)',
    nssdcaId: '2003-032A',
    missionId: 'MSN-MER-B',
    missionName: 'Mars Exploration Rover — Opportunity',
    agency: 'NASA',
    bodyId: 'mars',
    regionName: 'Meridiani Planum to Perseverance Valley (Endeavour Crater)',
    category: 'Rover',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Operated for 5,111 sols (14 years, 138 days). Entered low-power fault during the June 2018 global dust storm (τ > 10.8); mission formally concluded February 13, 2019 after 1,000+ recovery commands.',
    launchDate: '2003-07-07',
    landingOrArrivalDate: '2004-01-25',
    endOfOperationsDate: '2018-06-10',
    massDryKg: 185,
    powerSystem: 'Triple-Junction GaAs Solar Array (140 W peak) + Two Li-Ion Batteries',
    dimensions: '1.5 m height × 2.3 m width × 1.6 m length (6-wheel Rocker-Bogie)',
    traverseDistanceKm: 45.16,
    coordinates: {
      landingLocation: {
        lat: -1.9462,
        lon: 354.4734,
        elevationM: -1385,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.3,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-MERB-OPPORTUNITY',
        imagingReference: 'Eagle Crater Challenger Memorial Station (MRO HiRISE)',
      },
      finalOperatingLocation: {
        lat: -2.8062,
        lon: 354.5284,
        elevationM: -1340,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.3,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-MERB-OPPORTUNITY',
        imagingReference: 'MRO HiRISE ESP_056807_1770',
      },
      finalDocumentedLocation: {
        lat: -2.8062,
        lon: 354.5284,
        elevationM: -1340,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.3,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-MERB-OPPORTUNITY',
        imagingReference: 'MRO HiRISE ESP_056807_1770 (0.25 m/px)',
        notes: 'Resting in Perseverance Valley on the western rim of 22-km Endeavour Crater.',
      },
    },
    proceduralModelType: 'rover',
    primaryColorHex: '#F59E0B',
    accentColorHex: '#38BDF8',
    heroImageUrl: '/src/assets/images/mars_opportunity_meridiani_1794651250130.jpg',
    heroImageCaption:
      'Opportunity rover solar deck, Pancam mast sundial target, and Instrument Deployment Device overlooking layered sulfate sandstone at Victoria Crater.',
    originalPurpose:
      'Perform 90 Martian sols of field geology at Meridiani Planum to investigate the origin of coarse crystalline gray hematite detected from orbit by Mars Global Surveyor TES.',
    scientificAchievements: [
      'Discovered jarosite, sulfate evaporites, festoon cross-bedding, and hematite spherules ("blueberries") inside Eagle and Endurance Craters, proving ancient liquid water once pooled on Mars.',
      'Discovered neutral-pH smectite clay minerals (montmorillonite) along the ancient rim of Endeavour Crater (Matijevic Hill), demonstrating a benign habitable water environment.',
      'Set the all-time off-Earth wheeled distance record of 45.16 km across 5,111 sols.',
    ],
    presentConditionSummary:
      'Intact six-wheeled rover resting in Perseverance Valley under a layer of settled Martian atmospheric dust.',
    instruments: [
      {
        id: 'INST-OPP-PANCAM',
        name: 'Panoramic Camera',
        acronym: 'Pancam',
        type: 'Multispectral Stereo CCD Imager (1024×1024, 13 filter wavelengths)',
        principalInvestigator: 'Jim Bell (Cornell University / ASU)',
        massKg: 0.54,
        powerWatts: 4.3,
        resolutionOrRange: '0.28 mrad/pixel angular resolution (400–1100 nm)',
        scientificPurpose: 'High-resolution stereo terrain mapping, mineral spectroscopy, and atmospheric optical depth (τ) measurement.',
        keyFindings: 'Captured over 217,000 raw images and measured record atmospheric opacity during the 2018 storm.',
      },
      {
        id: 'INST-OPP-MB',
        name: 'Miniature Mössbauer Spectrometer',
        acronym: 'MIMOS II',
        type: 'Cobalt-57 Gamma-Ray Resonance Spectrometer',
        principalInvestigator: 'Göstar Klingelhöfer (University of Mainz)',
        massKg: 0.5,
        powerWatts: 2.0,
        resolutionOrRange: 'Iron oxidation states (Fe²⁺ / Fe³⁺) and iron-bearing mineral phases',
        scientificPurpose: 'Identify iron mineralogy in Martian rocks and soils.',
        keyFindings: 'Unambiguously identified jarosite and hematite in Eagle Crater outcrop bedrock.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'A Ninety-Sol Geologist Sent to Follow the Water',
        factualParagraphs: [
          {
            text: 'Conceived by Steve Squyres and engineered at JPL, the Mars Exploration Rovers Spirit (MER-A) and Opportunity (MER-B) were designed as robotic field geologists with a 90-sol baseline lifetime and a 600-meter drive target [CLM-OPP-01].',
            simpleText: 'NASA built Opportunity as a robot geologist designed to last just 90 Martian days and drive 600 meters [CLM-OPP-01].',
            claimIds: ['CLM-OPP-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My warranty was ninety Martian days. My mast held two eyes at human height, and my robotic arm carried a rock abrasion grind tool, a microscope, and two spectrometers.',
        telemetryHighlight: { label: 'Design Lifetime', value: '90', unit: 'sols' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'A Cosmic Hole-in-One Into Eagle Crater',
        factualParagraphs: [
          {
            text: 'On January 25, 2004, encased in a tetrahedron of airbags, Opportunity bounced 26 times across the flat basaltic plain of Meridiani Planum and rolled directly into the 22-meter-wide Eagle Crater at 1.9462° S, 354.4734° E [CLM-OPP-01].',
            simpleText: 'Wrapped in giant airbags, Opportunity bounced across the plain and rolled straight into a small crater where ancient bedrock was exposed [CLM-OPP-01].',
            claimIds: ['CLM-OPP-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] When my airbags deflated and my petals opened, my Pancam blinked at a wall of layered bedrock just meters away—a 300-million-kilometer hole-in-one.',
        telemetryHighlight: { label: 'Eagle Crater Diameter', value: '22.0', unit: 'm' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'From Eagle to Endurance, Victoria, and Endeavour',
        factualParagraphs: [
          {
            text: 'Helped by seasonal wind gusts ("cleaning events") that swept dust off its solar panels, Opportunity drove south from Eagle Crater to Endurance Crater, Victoria Crater, and finally the 22-km-wide Noachian rim of Endeavour Crater, covering 45.16 km [CLM-OPP-01].',
            simpleText: 'Helpful Martian winds blew dust off its solar panels, allowing Opportunity to drive 45.16 kilometers from crater to crater over 14 years [CLM-OPP-01].',
            claimIds: ['CLM-OPP-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Even when my right-front steering actuator jammed and I had to drive backward across vast ripples of sand, the Martian wind kept brushing my wings clean.',
        telemetryHighlight: { label: 'Total Marathon', value: '45.16', unit: 'km' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Hematite Blueberries, Jarosite, and Ancient Clays',
        factualParagraphs: [
          {
            text: 'At Eagle Crater, Opportunity discovered millimeter-scale hematite concretions ("blueberries") and jarosite sulfate beds [CLM-OPP-02]; years later at Endeavour Crater\'s rim, it discovered neutral-pH smectite clays and gypsum veins.',
            simpleText: 'Opportunity found tiny iron mineral spheres nicknamed "blueberries" and clay rocks that proved ancient Mars once had liquid water [CLM-OPP-02].',
            claimIds: ['CLM-OPP-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Beneath my Rock Abrasion Tool, the red dust gave way to gray crystals formed in ancient groundwater billions of years ago.',
        telemetryHighlight: { label: 'Raw Images Returned', value: '217,594', unit: 'frames' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Sol 5111 and the Planet-Encircling Storm of June 2018',
        factualParagraphs: [
          {
            text: 'In June 2018, a planet-encircling dust storm drove atmospheric optical depth (τ) above 10.8 over Perseverance Valley, dropping Opportunity\'s solar array output to 22 watt-hours and ending communication after Sol 5111 on June 10, 2018 [CLM-OPP-01].',
            simpleText: 'In June 2018, a massive planet-wide dust storm blotted out the sun over Perseverance Valley, draining Opportunity\'s batteries after more than 5,000 Martian days [CLM-OPP-01].',
            claimIds: ['CLM-OPP-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] The noon sky turned darker than midnight. My last telemetry packet whispered across the Deep Space Network—solar energy critically low, atmospheric opacity off the scale.',
        telemetryHighlight: { label: 'Storm Opacity (τ)', value: '10.8', unit: 'tau' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Forty-Five Kilometers Written in Martian Sand',
        factualParagraphs: [
          {
            text: 'Opportunity transformed Mars science from orbital reconnaissance into multi-decade field stratigraphy, paving the way for Curiosity at Gale Crater and Perseverance at Jezero Crater [CLM-OPP-01, CLM-OPP-02].',
            simpleText: 'Opportunity proved that ancient Mars had water and paved the way for bigger rovers like Curiosity and Perseverance [CLM-OPP-01, CLM-OPP-02].',
            claimIds: ['CLM-OPP-01', 'CLM-OPP-02'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] From orbit, MRO HiRISE still sees my quiet silhouette resting on the slope of Perseverance Valley.',
        telemetryHighlight: { label: 'Mission Longevity', value: '5,111', unit: 'sols' },
      },
    ],
    claimIds: ['CLM-OPP-01', 'CLM-OPP-02'],
    sourceIds: ['SRC-PDS-MERB-OPPORTUNITY'],
    relatedArtifactIds: ['ART-VIKING1-LANDER', 'ART-M2020-PERSEVERANCE', 'ART-LUNOKHOD2-ROVER'],
    traversePath: [
      { solOrDay: 1, label: 'Eagle Crater Landing', lat: -1.9462, lon: 354.4734, elevationM: -1385, distanceKm: 0.0 },
      { solOrDay: 130, label: 'Endurance Crater', lat: -1.95, lon: 354.48, elevationM: -1382, distanceKm: 1.6 },
      { solOrDay: 952, label: 'Victoria Crater (Duck Bay)', lat: -2.051, lon: 354.498, elevationM: -1370, distanceKm: 9.28 },
      { solOrDay: 2681, label: 'Endeavour Crater Rim (Cape York)', lat: -2.288, lon: 354.525, elevationM: -1355, distanceKm: 33.49 },
      { solOrDay: 5111, label: 'Perseverance Valley (Final Site)', lat: -2.8062, lon: 354.5284, elevationM: -1340, distanceKm: 45.16 },
    ],
  },
  {
    id: 'ART-VIKING1-LANDER',
    name: 'Viking 1 Lander (Thomas Mutch Memorial Station)',
    nssdcaId: '1975-075C',
    missionId: 'MSN-VIKING-1',
    missionName: 'Viking 1',
    agency: 'NASA',
    bodyId: 'mars',
    regionName: 'Chryse Planitia (Golden Plains)',
    category: 'Lander',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Operated continuously for 2,245 Martian sols (6 Earth years, 116 days) from July 20, 1976 until November 11, 1982, when an uplinked battery-charging software patch inadvertently overwrote the high-gain antenna pointing table.',
    launchDate: '1975-08-20',
    landingOrArrivalDate: '1976-07-20',
    endOfOperationsDate: '1982-11-11',
    massDryKg: 572,
    powerSystem: 'Two SNAP-19 Plutonium-238 RTGs (70 W continuous) + Four NiCd Batteries',
    dimensions: '2.13 m height × 3.0 m hexagonal tripod footpad span',
    coordinates: {
      landingLocation: {
        lat: 22.48,
        lon: 312.0339,
        elevationM: -3627,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-HIRISE-VIKING1',
        imagingReference: 'MRO HiRISE ESP_011491_2025',
      },
      finalDocumentedLocation: {
        lat: 22.48,
        lon: 312.0339,
        elevationM: -3627,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-HIRISE-VIKING1',
        imagingReference: 'MRO HiRISE ESP_011491_2025 (0.25 m/px)',
        notes: 'Lander body, three footpads, backshell, and heat shield optically verified on Chryse Planitia.',
      },
    },
    proceduralModelType: 'lander',
    primaryColorHex: '#F8FAFC',
    accentColorHex: '#EA580C',
    heroImageUrl: '/src/assets/images/viking_1_chryse_planitia_1794651256220.jpg',
    heroImageCaption:
      'Viking 1 Lander facsimile camera view of Chryse Planitia showing Footpad #2, surface sampler trench, and meteorology boom.',
    originalPurpose:
      'Perform the first long-duration surface mission on Mars, transmit panoramic imagery, characterize atmospheric composition/weather, and execute three biological experiments searching for microbial metabolism in Martian soil.',
    scientificAchievements: [
      'Transmitted humanity\'s first clear surface photographs of Mars seconds after touchdown on July 20, 1976.',
      'Measured Martian atmospheric nitrogen, argon isotope ratios (³⁶Ar/⁴⁰Ar), and seasonal CO₂ pressure cycles over three complete Mars years.',
      'Executed the GCMS, Labeled Release, Gas Exchange, and Pyrolytic Release experiments, revealing highly oxidizing surface soil chemistry.',
    ],
    presentConditionSummary:
      'Intact hexagonal aluminum lander standing on three footpads in Chryse Planitia, verified by MRO HiRISE orbital imagery.',
    instruments: [
      {
        id: 'INST-VIK1-GCMS',
        name: 'Gas Chromatograph — Mass Spectrometer',
        acronym: 'GCMS',
        type: 'Thermal Volatilization Magnetic Sector Mass Spectrometer',
        principalInvestigator: 'Klaus Biemann (MIT)',
        massKg: 19.5,
        powerWatts: 42,
        resolutionOrRange: 'm/z 12 to 200 Dalton (parts-per-billion organic sensitivity)',
        scientificPurpose: 'Detect volatile organic molecules in heated Martian soil and analyze atmospheric gases.',
        keyFindings: 'Measured atmospheric composition (95.3% CO₂, 2.7% N₂, 1.6% Ar) defining the diagnostic fingerprint of Martian meteorites on Earth.',
      },
      {
        id: 'INST-VIK1-BIOL',
        name: 'Viking Biological Instrument Package',
        acronym: 'VBI',
        type: 'Three-Chamber Automated Metabolic Analyzer (LR, GEX, PR)',
        principalInvestigator: 'Harold P. Klein (NASA Ames)',
        massKg: 15.5,
        powerWatts: 18,
        resolutionOrRange: '¹⁴C radiolabeled gas evolution and O₂ release',
        scientificPurpose: 'Test for active microbial respiration or photosynthesis in Martian regolith.',
        keyFindings: 'Observed rapid O₂ and ¹⁴CO₂ release upon wetting, attributed by most researchers to reactive superoxides/perchlorates.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Sterilized in Dry Heat to Search for Life',
        factualParagraphs: [
          {
            text: 'Built by Martin Marietta under NASA Langley management, the entire assembled Viking 1 Lander was baked inside a thermal sterilization capsule at 111.7°C for 40 hours to comply with COSPAR planetary protection rules before launching to Mars [CLM-VIK1-01].',
            simpleText: 'Before launching to search for Martian life, the entire Viking 1 lander was baked in a giant oven so it wouldn\'t carry any Earth germs to Mars [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Every wire, valve, and miniature laboratory chamber inside my hexagonal body had to survive forty hours in a sterilization oven before I ever left Florida.',
        telemetryHighlight: { label: 'Sterilization Temp', value: '111.7', unit: '°C' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Touchdown on the Seventh Anniversary of Apollo 11',
        factualParagraphs: [
          {
            text: 'After orbital certification of the landing ellipse, Viking 1 separated from its orbiter and touched down at Chryse Planitia (22.4800° N, 312.0339° E) on July 20, 1976—seven years to the day after Apollo 11 landed on the Moon [CLM-VIK1-01].',
            simpleText: 'Viking 1 landed safely on the rusty plains of Mars on July 20, 1976—exactly seven years after Apollo 11 landed on the Moon [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Twenty-five seconds after my three footpads settled into the rust-colored drift of Chryse Planitia, my facsimile camera began scanning vertical line by vertical line, revealing my own footpad and the stones of Mars.',
        telemetryHighlight: { label: 'First Image Delay', value: '25', unit: 'seconds' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Six Years of Martian Seasons',
        factualParagraphs: [
          {
            text: 'Powered by two plutonium-238 radioisotope thermoelectric generators, Viking 1 operated for 2,245 sols, recording daily wind speeds, barometric pressure drops as CO₂ froze onto the polar caps, and dust storm progressions [CLM-VIK1-01].',
            simpleText: 'Powered by nuclear heat generators, Viking 1 acted as a Martian weather station for more than six Earth years [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Every winter I felt a quarter of the entire planet\'s atmosphere freeze out as dry ice at the pole, recorded faithfully by my pressure diaphragm.',
        telemetryHighlight: { label: 'Surface Longevity', value: '2,245', unit: 'sols' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'The Isotope Fingerprint of Mars',
        factualParagraphs: [
          {
            text: 'Viking 1\'s mass spectrometer measured the exact isotopic ratios of Martian atmospheric gases, later proving beyond doubt that SNC meteorites found in Antarctica were blasted off Mars [CLM-VIK1-01].',
            simpleText: 'Viking 1 measured the exact mix of gases in Mars\'s air, which later helped scientists prove that certain meteorites found in Antarctica actually came from Mars [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Without launching a sample-return rocket, my gas analyzer gave Earth scientists the key to unlock Martian rocks already sitting in their museum drawers.',
        telemetryHighlight: { label: 'Atmospheric CO₂', value: '95.32', unit: '%' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'The Overwritten Antenna Table of November 1982',
        factualParagraphs: [
          {
            text: 'On November 11, 1982, during an uplink to test a new battery-reconditioning cycle, 22 bytes of command code inadvertently overwrote memory addresses storing the high-gain S-band antenna pointing coordinates, permanently severing radio lock [CLM-VIK1-01].',
            simpleText: 'After more than six years on Mars, a computer update meant to refresh its batteries accidentally erased the instructions that aimed its radio dish at Earth [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My plutonium heart was still warm, and my meteorological boom still turned in the wind—only my dish turned away from Earth into silence.',
        telemetryHighlight: { label: 'Last Contact', value: '1982-11-11', unit: 'UTC' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'The Thomas Mutch Memorial Station Seen From Orbit',
        factualParagraphs: [
          {
            text: 'Rededicated as the Thomas Mutch Memorial Station (with an official memorial plaque delivered to Mars aboard Pathfinder in 1997), Viking 1 was directly imaged at 25 cm/pixel by MRO HiRISE in 2006–2009 [CLM-VIK1-01].',
            simpleText: 'Decades later, NASA\'s Mars Reconnaissance Orbiter photographed Viking 1 sitting intact on the red plains [CLM-VIK1-01].',
            claimIds: ['CLM-VIK1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] From 300 kilometers overhead, HiRISE still catches the bright white gleam of my deck amidst the red boulders of Chryse Planitia.',
        telemetryHighlight: { label: 'HiRISE Resolution', value: '0.25', unit: 'm/px' },
      },
    ],
    claimIds: ['CLM-VIK1-01'],
    sourceIds: ['SRC-HIRISE-VIKING1'],
    relatedArtifactIds: ['ART-MERB-OPPORTUNITY', 'ART-M2020-PERSEVERANCE'],
  },
  {
    id: 'ART-M2020-PERSEVERANCE',
    name: 'Mars 2020 Perseverance Rover',
    nssdcaId: '2020-052A',
    missionId: 'MSN-MARS-2020',
    missionName: 'Mars 2020 Perseverance & Sample Caching',
    agency: 'NASA',
    bodyId: 'mars',
    regionName: 'Jezero Crater Western Delta & Neretva Vallis',
    category: 'Rover',
    operationalStatus: 'Operational',
    statusExplanation:
      'Actively operating inside Jezero Crater and climbing the western crater rim after completing the Crater Floor, Delta Front, Upper Fan, and Margin Unit campaigns.',
    launchDate: '2020-07-30',
    landingOrArrivalDate: '2021-02-18',
    massDryKg: 1025,
    powerSystem: 'Multi-Mission Radioisotope Thermoelectric Generator (MMRTG, 110 W electric) + Two Li-Ion Batteries',
    dimensions: '3.0 m length × 2.7 m width × 2.2 m height',
    traverseDistanceKm: 31.8,
    coordinates: {
      landingLocation: {
        lat: 18.4447,
        lon: 77.4508,
        elevationM: -2570,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-M2020',
        imagingReference: 'Octavia E. Butler Landing (HiRISE + Terrain Relative Navigation)',
      },
      finalOperatingLocation: {
        lat: 18.498,
        lon: 77.319,
        elevationM: -2310,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-M2020',
        imagingReference: 'NAIF SPICE M2020 & HiRISE Localization',
      },
      finalDocumentedLocation: {
        lat: 18.498,
        lon: 77.319,
        elevationM: -2310,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-M2020',
        imagingReference: 'NAIF SPICE M2020 Kernel Bundle',
        notes: 'Active rover localized via onboard visual odometry and MRO HiRISE stereo orthophotos.',
      },
    },
    proceduralModelType: 'rover',
    primaryColorHex: '#F8FAFC',
    accentColorHex: '#06B6D4',
    heroImageUrl: '/src/assets/images/mars_opportunity_meridiani_1794651250130.jpg',
    heroImageCaption:
      'Perseverance rover sampling ancient deltaic mudstones and fluvial conglomerates inside Jezero Crater.',
    originalPurpose:
      'Explore an ancient Martian lake-delta system at Jezero Crater, characterize habitability and potential biosignatures, demonstrate in-situ O₂ production, and cache hermetically sealed core samples.',
    scientificAchievements: [
      'Cached 10 backup titanium sample tubes at the Three Forks Depot on the floor of Jezero Crater and collected over 24 rock/regolith cores, including organic-bearing mudstones at "Cheyava Falls" (Bright Angel).',
      'Produced 122 grams of breathable molecular oxygen (O₂) directly from the Martian CO₂ atmosphere via the MOXIE solid-oxide electrolysis instrument.',
      'Recorded the first acoustic microphone audio of Martian winds, dust devils, and laser-induced breakdown spectroscopy (SuperCam) snaps.',
    ],
    presentConditionSummary:
      'Fully operational; ascending the western rim of Jezero Crater.',
    instruments: [
      {
        id: 'INST-M2020-MOXIE',
        name: 'Mars Oxygen In-Situ Resource Utilization Experiment',
        acronym: 'MOXIE',
        type: 'Solid Oxide Electrolysis Cell (800°C CO₂ Splitter)',
        principalInvestigator: 'Michael Hecht (MIT Haystack Observatory)',
        massKg: 17.1,
        powerWatts: 300,
        resolutionOrRange: 'Up to 12 g/hr O₂ at >98% purity',
        scientificPurpose: 'Demonstrate extraction of breathable and propellant-grade oxygen from Martian atmospheric CO₂.',
        keyFindings: 'Completed 16 successful runs across all Martian seasons and times of day, generating 122 g of O₂.',
      },
      {
        id: 'INST-M2020-SHERLOC',
        name: 'Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals',
        acronym: 'SHERLOC',
        type: 'Deep-UV (248.6 nm) Resonance Raman & Fluorescence Spectrometer',
        principalInvestigator: 'Luther Beegle / Kevin Hand (NASA JPL)',
        massKg: 4.7,
        powerWatts: 32,
        resolutionOrRange: '100 μm spatial laser spot size',
        scientificPurpose: 'Map organic molecules and aqueous minerals at fine spatial scale on abraded rock patches.',
        keyFindings: 'Detected aromatic organic carbon compounds associated with sulfate and phosphate minerals in Jezero mudstones.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Building the First Planetary Sample-Caching Geologist',
        factualParagraphs: [
          {
            text: 'Following Curiosity\'s proof that Gale Crater once held habitable water, NASA designed Perseverance with an ultra-clean adaptive caching assembly containing 43 titanium sample tubes to collect rocks for future return to Earth [CLM-PERS-01].',
            simpleText: 'NASA built Perseverance with 43 super-clean titanium tubes to drill and seal Martian rock samples for future return to Earth [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Inside my belly sits a rotating carousel of gold-tinted titanium tubes, baked cleaner than any laboratory on Earth.',
        telemetryHighlight: { label: 'Sample Tubes Aboard', value: '43', unit: 'tubes' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Terrain-Relative Navigation and the Sky Crane',
        factualParagraphs: [
          {
            text: 'On February 18, 2021, Perseverance used real-time Lander Vision System camera matching to steer clear of steep delta cliffs and cliffs in Jezero Crater, touching down on nylon Sky Crane bridles at 18.4447° N, 77.4508° E [CLM-PERS-01].',
            simpleText: 'During landing, Perseverance took pictures of the ground to dodge dangerous cliffs and was lowered gently onto Mars by a rocket-powered Sky Crane [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] For the first time in history, onboard cameras filmed my supersonic parachute inflating and my six aluminum wheels touching down in billowing red dust.',
        telemetryHighlight: { label: 'Touchdown Site', value: '18.445°N 77.451°E', unit: 'IAU Mars' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Three Forks Depot and the Ancient River Delta',
        factualParagraphs: [
          {
            text: 'After discovering that the Jezero crater floor consisted of igneous cumulate rocks beneath the delta, Perseverance placed a 10-tube backup depot at Three Forks before climbing the ancient river delta fan [CLM-PERS-01].',
            simpleText: 'Perseverance placed a backup collection of 10 sealed rock tubes on flat ground at Three Forks and then climbed up an ancient dried-up river delta [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] One by one I set ten titanium tubes in a zigzag pattern on the Martian soil—humanity\'s first rock depot on another planet.',
        telemetryHighlight: { label: 'Depot Tubes Placed', value: '10', unit: 'tubes' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Breathing Martian Air and Leopard-Spotted Mudstones',
        factualParagraphs: [
          {
            text: 'MOXIE generated 122 g of pure oxygen from Mars\'s atmosphere, while SHERLOC and PIXL analyzed "Cheyava Falls" in Neretva Vallis, revealing organic carbon alongside iron-phosphate reduction spots [CLM-PERS-01].',
            simpleText: 'Perseverance made breathable oxygen out of Mars\'s air and drilled a rock with intriguing chemical spots that on Earth are often linked to ancient microbes [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Inside my chassis, MOXIE breathed in carbon dioxide and exhaled pure oxygen—proving future human explorers can live off the Martian sky.',
        telemetryHighlight: { label: 'MOXIE O₂ Produced', value: '122.0', unit: 'grams' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Active Ascent of the Jezero Crater Rim',
        factualParagraphs: [
          {
            text: 'Perseverance remains actively operational, using AutoNav autonomous hazard avoidance to drive hundreds of meters per sol up the western rim of Jezero Crater [CLM-PERS-01].',
            simpleText: 'Perseverance is still wide awake and driving itself up the rim of Jezero Crater today [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My story is still being written across the rocks of Mars every single sol.',
        telemetryHighlight: { label: 'Status', value: 'OPERATIONAL', unit: 'active' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Awaiting Mars Sample Return',
        factualParagraphs: [
          {
            text: 'The sealed titanium sample tubes aboard Perseverance and resting at Three Forks represent the highest-priority astrobiological archive in the Solar System [CLM-PERS-01].',
            simpleText: 'The sealed rock tubes waiting on Mars are a treasure chest of clues for future missions to bring home to Earth [CLM-PERS-01].',
            claimIds: ['CLM-PERS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Whether lifted from my belly or picked up from the sands of Three Forks, these cores hold the memory of a warm, wet Mars.',
        telemetryHighlight: { label: 'Cores Sealed', value: '24+', unit: 'samples' },
      },
    ],
    claimIds: ['CLM-PERS-01'],
    sourceIds: ['SRC-PDS-M2020'],
    relatedArtifactIds: ['ART-M2020-INGENUITY', 'ART-MERB-OPPORTUNITY', 'ART-VIKING1-LANDER'],
    traversePath: [
      { solOrDay: 1, label: 'Octavia E. Butler Landing', lat: 18.4447, lon: 77.4508, elevationM: -2570, distanceKm: 0.0 },
      { solOrDay: 200, label: 'Séítah Igneous Outcrop', lat: 18.428, lon: 77.439, elevationM: -2582, distanceKm: 2.9 },
      { solOrDay: 650, label: 'Three Forks Sample Depot', lat: 18.446, lon: 77.405, elevationM: -2555, distanceKm: 13.8 },
      { solOrDay: 910, label: 'Jezero Western Delta Margin', lat: 18.475, lon: 77.362, elevationM: -2420, distanceKm: 22.4 },
      { solOrDay: 1210, label: 'Neretva Vallis / Bright Angel', lat: 18.498, lon: 77.319, elevationM: -2310, distanceKm: 31.8 },
    ],
  },
  {
    id: 'ART-M2020-INGENUITY',
    name: 'Ingenuity Mars Helicopter ("Ginny")',
    nssdcaId: '2020-052B',
    missionId: 'MSN-MARS-2020',
    missionName: 'Mars 2020 Ingenuity Aerial Scout',
    agency: 'NASA',
    bodyId: 'mars',
    regionName: 'Wright Brothers Field to Valinor Hills (Jezero Crater)',
    category: 'Spacecraft',
    operationalStatus: 'Retired',
    statusExplanation:
      'Completed 72 flights (14× its 5-flight technology demonstration goal). Retired from flight on January 25, 2024 after carbon-fiber rotor blade damage on Flight 72; continues operating as a stationary weather/avionics logger.',
    launchDate: '2020-07-30',
    landingOrArrivalDate: '2021-02-18',
    endOfOperationsDate: '2024-01-18',
    massDryKg: 1.8,
    powerSystem: 'Top-Mounted Solar Array + Six Sony Li-Ion Cells (35–40 Wh)',
    dimensions: '0.49 m height × 1.2 m coaxial carbon-fiber rotor span',
    traverseDistanceKm: 17.0,
    coordinates: {
      landingLocation: {
        lat: 18.4448,
        lon: 77.451,
        elevationM: -2570,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-M2020',
        imagingReference: 'Wright Brothers Field (Airfield Alpha)',
      },
      finalDocumentedLocation: {
        lat: 18.4984,
        lon: 77.3122,
        elevationM: -2305,
        datum: 'IAU Mars 2000 Aerocentric',
        confidenceRadiusM: 0.25,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-M2020',
        imagingReference: 'Perseverance Mastcam-Z Telephoto (Valinor Hills / Airfield Chi)',
        notes: 'Standing upright on ripple sand dunes in Neretva Vallis with one fractured rotor tip lying 15 m away.',
      },
    },
    proceduralModelType: 'probe',
    primaryColorHex: '#E2E8F0',
    accentColorHex: '#F59E0B',
    heroImageUrl: '/src/assets/images/mars_opportunity_meridiani_1794651250130.jpg',
    heroImageCaption:
      'Ingenuity coaxial rotorcraft resting on Martian sand ripples at Valinor Hills inside Jezero Crater.',
    originalPurpose:
      'Execute a 30-sol, 5-flight technology demonstration proving powered, controlled aerodynamic flight is possible in Mars\'s thin (0.015 kg/m³) atmosphere.',
    scientificAchievements: [
      'Achieved humanity\'s first powered, controlled flight on another planet on April 19, 2021 (carrying a postage-stamp swatch of fabric from the 1903 Wright Flyer).',
      'Completed 72 flights totaling 128.8 minutes aloft, reaching a maximum altitude of 24.0 m and airspeed of 10.0 m/s.',
      'Served as an aerial reconnaissance scout for Perseverance across boulder fields and sand ripples.',
    ],
    presentConditionSummary:
      'Standing upright at Valinor Hills ("Airfield Chi"); flight operations retired due to rotor blade tip damage, avionics remain functional for surface data logging.',
    instruments: [
      {
        id: 'INST-ING-RTE',
        name: 'Return-to-Earth Color Aerial Camera & Downward NavCam',
        acronym: 'RTE / NAV',
        type: '13-Megapixel Sony IMX214 Color CMOS + 0.5 MP Global-Shutter B&W NavCam',
        principalInvestigator: 'MiMi Aung / Teddy Tzanetos (NASA JPL)',
        massKg: 0.045,
        powerWatts: 1.5,
        resolutionOrRange: '4208 × 3120 px color oblique aerial reconnaissance',
        scientificPurpose: 'Optical visual inertial odometry at 30 Hz and high-resolution outcrop scouting.',
        keyFindings: 'Imaged Perseverance\'s discarded parachute and backshell from the air to assist Mars Sample Return landing design.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Spinning 2,537 RPM in One Percent of Earth\'s Air',
        factualParagraphs: [
          {
            text: 'Because the Martian atmosphere at the surface has less than 1% the density of Earth\'s sea-level air (equivalent to 30 km altitude on Earth), Ingenuity required ultra-stiff 1.2-meter carbon-fiber foam-core blades spinning at 2,400–2,900 RPM on a 1.8 kg airframe [CLM-ING-01].',
            simpleText: 'Because Mars\'s air is 100 times thinner than Earth\'s, Ingenuity had to weigh less than 2 kilograms and spin its blades 5 times faster than a regular helicopter [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Tucked beneath my solar panel was a tiny square of unbleached muslin from the left wing of the 1903 Wright Flyer.',
        telemetryHighlight: { label: 'Rotor Speed', value: '2,537', unit: 'RPM' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Unfolding From Perseverance\'s Belly Pan',
        factualParagraphs: [
          {
            text: 'After surviving landing folded horizontally beneath Perseverance\'s chassis, Ingenuity dropped 13 cm onto Wright Brothers Field on April 3, 2021 and survived its first freezing -90°C night untethered [CLM-ING-01].',
            simpleText: 'After riding to Mars tucked under Perseverance\'s belly, Ingenuity dropped onto the ground and survived the freezing Martian night on its own [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] When Perseverance rolled off me and exposed me to the Martian sky, I had to rely on my six small phone-grade batteries to keep from freezing.',
        telemetryHighlight: { label: 'Total Mass', value: '1.80', unit: 'kg' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'From Five Test Hops to Seventy-Two Expeditions',
        factualParagraphs: [
          {
            text: 'On April 19, 2021, Ingenuity climbed 3 meters and hovered for 39.1 seconds; over the next three years, it transitioned into an operational scout, flying 72 times across 17.0 km [CLM-ING-01].',
            simpleText: 'Meant to fly just 5 times, Ingenuity flew 72 times over nearly three years, scouting ahead for the Perseverance rover [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Below my downward black-and-white eye, my own crisp shadow raced across crimson craters and ancient river boulders.',
        telemetryHighlight: { label: 'Flights Completed', value: '72', unit: 'flights' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Aerial Archaeology of Our Own Landing Gear',
        factualParagraphs: [
          {
            text: 'On Flight 26 (April 19, 2022), Ingenuity performed aerial archaeology on Mars—flying over and photographing the shattered Mars 2020 backshell and 21.5-meter supersonic parachute to help engineers validate entry hardware [CLM-ING-01].',
            simpleText: 'On Flight 26, Ingenuity flew over the crashed backshell and parachute that brought it to Mars, taking close-up photos for engineers [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Hovering eight meters above the sand, I photographed the crumpled white cone and orange-and-white canopy that had saved my life fourteen months earlier.',
        telemetryHighlight: { label: 'Peak Altitude', value: '24.0', unit: 'm' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Valinor Hills and the Blade Strike on Flight 72',
        factualParagraphs: [
          {
            text: 'During descent over featureless sand ripples on Flight 72 (January 18, 2024), Ingenuity\'s visual navigation lost surface texture lock, causing a hard landing at 18.4984° N, 77.3122° E that fractured its rotor tips [CLM-ING-01].',
            simpleText: 'On Flight 72, smooth sand dunes confused its navigation camera during landing, causing its rotor blade tips to strike the sand [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Smooth ripples offered my camera no rocks to track. My carbon blades kissed the dune crest, and my flying days ended upright at Valinor Hills.',
        telemetryHighlight: { label: 'Total Flight Time', value: '128.8', unit: 'minutes' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Opening the Skies of Other Worlds',
        factualParagraphs: [
          {
            text: 'Before switching to long-term autonomous surface data logging, Ingenuity received a software patch so it will wake daily for up to 20 years to record temperature and battery telemetry in onboard flash memory [CLM-ING-01].',
            simpleText: 'Before Perseverance drove out of radio range, engineers sent Ingenuity a software update so it can keep recording daily weather data in its memory for up to 20 years [CLM-ING-01].',
            claimIds: ['CLM-ING-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Even after Perseverance climbed over the horizon, I still wake each morning to log the Martian weather, waiting for future astronauts to read my memory.',
        telemetryHighlight: { label: 'Airspeed Record', value: '10.0', unit: 'm/s' },
      },
    ],
    claimIds: ['CLM-ING-01'],
    sourceIds: ['SRC-PDS-M2020'],
    relatedArtifactIds: ['ART-M2020-PERSEVERANCE', 'ART-MERB-OPPORTUNITY'],
  },
  {
    id: 'ART-VOYAGER1-PROBE',
    name: 'Voyager 1 Interstellar Probe & Golden Record',
    nssdcaId: '1977-084A',
    missionId: 'MSN-VOYAGER-1',
    missionName: 'Voyager Interstellar Mission',
    agency: 'NASA',
    bodyId: 'neptune',
    regionName: 'Very Local Interstellar Medium (Constellation Ophiuchus)',
    category: 'Probe',
    operationalStatus: 'Extended mission',
    statusExplanation:
      'Actively transmitting plasma wave, magnetometer, and cosmic ray data from interstellar space at >165.4 AU (>24.7 billion km from the Sun).',
    launchDate: '1977-09-05',
    landingOrArrivalDate: '2012-08-25',
    massDryKg: 721.9,
    powerSystem: 'Three MHW-RTG Plutonium-238 Generators (~220 W remaining)',
    dimensions: '3.66 m High-Gain Parabolic Dish + 13 m Magnetometer Boom',
    coordinates: {
      heliocentricPosition: {
        distanceAU: 165.4,
        eclipticLatDeg: 34.8,
        eclipticLonDeg: 255.4,
        velocityKmS: 17.0,
        epoch: 'J2000 Heliocentric Ecliptic (2026 Ephemeris)',
        provenanceSourceId: 'SRC-JPL-HORIZONS-VOY1',
      },
    },
    proceduralModelType: 'probe',
    primaryColorHex: '#F8FAFC',
    accentColorHex: '#EAB308',
    heroImageUrl: '/src/assets/images/apollo_11_tranquillity_base_1794651249797.jpg',
    heroImageCaption:
      'Voyager 1 spacecraft with 3.66 m high-gain antenna and gold-plated copper phonograph record in interstellar flight.',
    originalPurpose:
      'Conduct close-up reconnaissance of the Jupiter and Saturn systems (including Io and Titan) and subsequently probe the outer heliosphere and interstellar medium.',
    scientificAchievements: [
      'Discovered active sulfur volcanism on Jupiter\'s moon Io (1979) and characterized the dense nitrogen-methane atmosphere of Saturn\'s moon Titan (1980).',
      'Captured the "Family Portrait of the Solar System" and the Pale Blue Dot portrait of Earth from 40.5 AU on February 14, 1990.',
      'Became the first human-made object to cross the heliopause into interstellar space on August 25, 2012 at 121.6 AU.',
    ],
    presentConditionSummary:
      'Operational in deep interstellar flight; four remaining active fields-and-particles instruments managed after flight data system memory migration in 2024.',
    instruments: [
      {
        id: 'INST-VOY1-PWS',
        name: 'Plasma Wave Subsystem',
        acronym: 'PWS',
        type: '10-Meter Dipole Electric Antenna Receiver (10 Hz – 56 kHz)',
        principalInvestigator: 'Donald Gurnett / William Kurth (University of Iowa)',
        massKg: 1.4,
        powerWatts: 1.3,
        resolutionOrRange: 'Electron plasma oscillation frequency density measurements',
        scientificPurpose: 'Measure electron density and plasma waves across planetary magnetospheres and the heliopause.',
        keyFindings: 'Measured an 80× jump in electron plasma density (0.08 cm⁻³), proving Voyager 1 entered the interstellar medium.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'A Once-in-176-Year Planetary Alignment',
        factualParagraphs: [
          {
            text: 'In the mid-1960s, Gary Flandro at JPL calculated that a rare geometric alignment of Jupiter, Saturn, Uranus, and Neptune in the late 1970s would allow gravity-assist slingshots across the outer Solar System [CLM-VOY1-01].',
            simpleText: 'A rare once-in-176-years line-up of the giant outer planets allowed NASA to slingshot Voyager from planet to planet using gravity [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Bolted to my ten-sided aluminum bus was a gold-plated copper phonograph record carrying whale songs, Bach, human heartbeats, and 115 images of Earth.',
        telemetryHighlight: { label: 'Golden Record Life', value: '1.0', unit: 'Gyr' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Slingshots Past Jupiter and Titan',
        factualParagraphs: [
          {
            text: 'Launched on September 5, 1977, Voyager 1 flew past Jupiter in March 1979 and executed a close polar flyby of Saturn\'s moon Titan in November 1980, bending its trajectory 35° northward out of the ecliptic plane [CLM-VOY1-01].',
            simpleText: 'After flying close to Jupiter and Saturn\'s big moon Titan, gravity flung Voyager 1 high above the plane of the planets toward the stars [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] To look closely at Titan\'s orange haze, I traded away Pluto and climbed steeply northward toward the stars of Ophiuchus.',
        telemetryHighlight: { label: 'Heliocentric Speed', value: '17.0', unit: 'km/s' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'The Pale Blue Dot at Forty Astronomical Units',
        factualParagraphs: [
          {
            text: 'On Valentine\'s Day 1990, before turning off its cameras permanently to save power and memory, Voyager 1 looked back from 6 billion kilometers to photograph Earth as a 0.12-pixel "Pale Blue Dot" [CLM-VOY1-01].',
            simpleText: 'In 1990, before turning off its cameras to save power, Voyager 1 turned around and took the famous "Pale Blue Dot" photo of Earth from 6 billion kilometers away [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Through my narrow-angle lens, home was a mote of dust suspended in a scattered sunbeam.',
        telemetryHighlight: { label: 'One-Way Light Time', value: '22:56:00', unit: 'hh:mm:ss' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'Crossing the Heliopause on August 25, 2012',
        factualParagraphs: [
          {
            text: 'At 121.6 AU, solar cosmic rays dropped to zero while galactic cosmic rays surged and the Plasma Wave Subsystem measured an interstellar plasma oscillation frequency of 2.6 kHz [CLM-VOY1-01].',
            simpleText: 'In August 2012, Voyager 1 crossed the edge of the Sun\'s bubble and became the first human-made object to enter interstellar space [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] The warm wind of our Sun vanished behind me; around my antennas hummed the cold, dense plasma between the stars.',
        telemetryHighlight: { label: 'Heliopause Crossing', value: '121.6', unit: 'AU' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'Still Whispering at Twenty-Two Watts',
        factualParagraphs: [
          {
            text: 'In 2024, JPL engineers remotely rewrote Flight Data System code across non-contiguous memory blocks to bypass a failed CMOS chip, restoring full engineering and science telemetry from >165 AU [CLM-VOY1-01].',
            simpleText: 'Even when a memory chip failed in 2024, engineers sent a clever code fix across 24 billion kilometers to keep Voyager 1 talking [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My 22-watt radio signal takes nearly twenty-three hours to reach the 70-meter dishes on Earth, arriving at a billionth of a billionth of a watt.',
        telemetryHighlight: { label: 'Current Distance', value: '165.4', unit: 'AU' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Humanity\'s Longest-Lived Ambassador',
        factualParagraphs: [
          {
            text: 'Even after its plutonium RTGs drop below minimum instrument power in the 2030s, Voyager 1 and its Golden Record will orbit the Milky Way galaxy indefinitely [CLM-VOY1-01].',
            simpleText: 'Long after its battery power fades in the 2030s, Voyager 1 and its Golden Record will keep drifting among the stars for billions of years [CLM-VOY1-01].',
            claimIds: ['CLM-VOY1-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Long after Earth\'s oceans have changed, my golden disc will still carry the sounds of rain and human laughter across the Milky Way.',
        telemetryHighlight: { label: 'Mission Elapsed', value: '49+', unit: 'years' },
      },
    ],
    claimIds: ['CLM-VOY1-01'],
    sourceIds: ['SRC-JPL-HORIZONS-VOY1'],
    relatedArtifactIds: ['ART-CASSINI-HUYGENS'],
  },
  {
    id: 'ART-CASSINI-HUYGENS',
    name: 'Cassini Orbiter & ESA Huygens Titan Lander',
    nssdcaId: '1997-061A',
    missionId: 'MSN-CASSINI-HUYGENS',
    missionName: 'Cassini-Huygens Saturn & Titan Flagship',
    agency: 'NASA / ESA / ASI',
    bodyId: 'saturn',
    regionName: 'Titan Surface (Adiri, 10.573°S 167.547°E) & Saturn Upper Atmosphere',
    category: 'Lander',
    operationalStatus: 'Inactive',
    statusExplanation:
      'Huygens rests intact on the hydrocarbon floodplain of Adiri on Saturn\'s moon Titan (inactive since Jan 14, 2005); Cassini orbiter was intentionally vaporized in Saturn\'s atmosphere on Sept 15, 2017.',
    launchDate: '1997-10-15',
    landingOrArrivalDate: '2005-01-14',
    endOfOperationsDate: '2017-09-15',
    massDryKg: 2442,
    powerSystem: 'Cassini: Three GPHS-RTGs; Huygens: Five LiSO₂ Batteries (Depleted)',
    dimensions: 'Cassini: 6.7 m × 4.0 m; Huygens Lander: 1.3 m diameter aeroshell gondola',
    coordinates: {
      landingLocation: {
        lat: -10.573,
        lon: 167.547,
        elevationM: -210,
        datum: 'IAU Titan 2000 Radar Frame (Adiri)',
        confidenceRadiusM: 1000,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-CASSINI-HUYGENS',
        imagingReference: 'Cassini RADAR SAR & Huygens DISR Mosaic',
        notes: 'Huygens lander resting on damp methane-ethane floodplain cobbles of Adiri on Titan.',
      },
      impactLocation: {
        lat: 9.4,
        lon: -53.0,
        elevationM: 0,
        datum: 'IAU Saturn System III',
        confidenceRadiusM: 500,
        verification: 'VERIFIED',
        provenanceSourceId: 'SRC-PDS-CASSINI-HUYGENS',
        notes: 'Cassini orbiter atmospheric disposal entry point on Sept 15, 2017.',
      },
    },
    proceduralModelType: 'probe',
    primaryColorHex: '#F59E0B',
    accentColorHex: '#94A3B8',
    heroImageUrl: '/src/assets/images/viking_1_chryse_planitia_1794651256220.jpg',
    heroImageCaption:
      'Huygens DISR surface view of water-ice cobbles on Titan\'s hydrocarbon floodplain at Adiri.',
    originalPurpose:
      'Conduct a 13-year orbital investigation of the Saturnian system and land the ESA Huygens probe on the surface of Titan.',
    scientificAchievements: [
      'Achieved humanity\'s farthest landing from Earth when Huygens touched down on Titan at 9.5 AU on January 14, 2005, revealing branching methane river channels and rounded water-ice cobbles.',
      'Discovered active cryovolcanic water-vapor and organic plumes erupting from the south polar "tiger stripes" of Enceladus, confirming a global subsurface ocean.',
    ],
    presentConditionSummary:
      'Huygens remains intact on Titan\'s surface at -179.5°C; Cassini orbiter was vaporized in Saturn\'s upper atmosphere to protect Enceladus and Titan.',
    instruments: [
      {
        id: 'INST-HUY-DISR',
        name: 'Descent Imager / Spectral Radiometer',
        acronym: 'DISR',
        type: 'Visible/Near-IR Imager, Upward/Downward Spectrometers & Surface Lamp',
        principalInvestigator: 'Martin G. Tomasko (University of Arizona)',
        massKg: 8.1,
        powerWatts: 18,
        resolutionOrRange: '350–1700 nm spectral range + 20 W surface illumination lamp',
        scientificPurpose: 'Image Titan\'s haze layers, river drainage networks during parachute descent, and surface pebbles after touchdown.',
        keyFindings: 'Revealed dendritic methane river networks emptying into dark hydrocarbon lakebeds and rounded 10–15 cm water-ice cobbles.',
      },
    ],
    storyChapters: [
      {
        chapterNumber: 1,
        title: 'Before the Mission',
        subtitle: 'Two Spacecraft Bound for the Lord of the Rings',
        factualParagraphs: [
          {
            text: 'Built by a 27-nation partnership between NASA, the European Space Agency (ESA), and the Italian Space Agency (ASI), Cassini-Huygens paired a flagship Saturn orbiter with a saucer-shaped Titan atmospheric lander [CLM-CAS-01].',
            simpleText: 'Twenty-seven countries teamed up to build the giant Cassini orbiter and the saucer-shaped Huygens lander to explore Saturn and its hazy moon Titan [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] For seven years I rode bolted to Cassini\'s side as we looped past Venus, Earth, and Jupiter on our way to the ringed giant.',
        telemetryHighlight: { label: 'Partner Nations', value: '27', unit: 'countries' },
      },
      {
        chapterNumber: 2,
        title: 'The Journey',
        subtitle: 'Diving Through Titan\'s Orange Smog',
        factualParagraphs: [
          {
            text: 'On January 14, 2005, Huygens plunged into Titan\'s nitrogen-methane atmosphere at 6 km/s, deploying three parachutes across a 2-hour, 27-minute descent before landing softly at Adiri (10.573° S, 167.547° E) [CLM-CAS-01].',
            simpleText: 'In January 2005, Huygens parachuted for two and a half hours through Titan\'s thick orange clouds and landed on a damp riverbed [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Below my parachute, the orange haze parted to reveal dark branching river channels carved not by water, but by liquid methane rain.',
        telemetryHighlight: { label: 'Titan Surface Temp', value: '-179.5', unit: '°C' },
      },
      {
        chapterNumber: 3,
        title: 'The Mission',
        subtitle: 'Seventy-Two Minutes on a Hydrocarbon Shore',
        factualParagraphs: [
          {
            text: 'Upon touchdown at 4.6 m/s on damp methane-saturated sand ("crème brûlée" consistency), Huygens transmitted surface imagery and mass spectrometer measurements for 72 minutes before Cassini set below the horizon [CLM-CAS-01].',
            simpleText: 'Huygens landed with a gentle thud on damp methane sand surrounded by ice pebbles and sent back data for 72 minutes [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] My warm surface lamp boiled a puff of liquid methane out of the soil beneath me while my camera photographed rounded cobbles of rock-hard water ice.',
        telemetryHighlight: { label: 'Surface Transmission', value: '72', unit: 'minutes' },
      },
      {
        chapterNumber: 4,
        title: 'Discoveries',
        subtitle: 'The Geysers of Enceladus and the Seas of Titan',
        factualParagraphs: [
          {
            text: 'While Huygens rests on Titan, Cassini spent 13 years mapping Titan\'s liquid hydrocarbon seas (Kraken and Ligeia Mare) and flying directly through the salty organic plumes of Enceladus [CLM-CAS-01].',
            simpleText: 'Cassini mapped giant liquid methane seas on Titan and flew straight through water geysers spraying out of the icy moon Enceladus [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] By tasting Enceladus\'s plumes of water, salt, silica, and molecular hydrogen, Cassini proved a habitable ocean hides beneath the ice.',
        telemetryHighlight: { label: 'Titan Flybys', value: '127', unit: 'encounters' },
      },
      {
        chapterNumber: 5,
        title: 'The Ending',
        subtitle: 'The Grand Finale Sacrifice Into Saturn',
        factualParagraphs: [
          {
            text: 'With hydrazine propellant nearly depleted after 294 orbits, flight controllers commanded Cassini to dive between Saturn and its innermost rings 22 times before entering Saturn\'s atmosphere at 9.4° N, 53.0° W on September 15, 2017 [CLM-CAS-01].',
            simpleText: 'When Cassini ran low on fuel in 2017, NASA steered it into Saturn\'s atmosphere so it could never accidentally crash into and contaminate the ocean moons [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] Rather than risk crashing onto Enceladus\'s ocean vents, Cassini burned like a meteor in Saturn\'s golden sky while Huygens sleeps intact on Titan.',
        telemetryHighlight: { label: 'Saturn Orbits', value: '294', unit: 'orbits' },
      },
      {
        chapterNumber: 6,
        title: 'The Legacy',
        subtitle: 'Guiding the Dragonfly Rotorcraft Back to Titan',
        factualParagraphs: [
          {
            text: 'Huygens\'s atmospheric density profiles and Adiri landing site measurements directly underpin NASA\'s nuclear-powered Dragonfly octocopter mission to Titan\'s Selk Crater [CLM-CAS-01].',
            simpleText: 'What Huygens learned about Titan\'s thick air helped NASA design Dragonfly, a nuclear-powered flying drone heading back to Titan [CLM-CAS-01].',
            claimIds: ['CLM-CAS-01'],
          },
        ],
        firstPersonPassage:
          '[CREATIVE NARRATIVE] At 10.573° South on Titan, my aluminum shell still sits among the ice pebbles of Adiri—humanity\'s farthest foothold.',
        telemetryHighlight: { label: 'Landing Distance', value: '9.5', unit: 'AU' },
      },
    ],
    claimIds: ['CLM-CAS-01'],
    sourceIds: ['SRC-PDS-CASSINI-HUYGENS'],
    relatedArtifactIds: ['ART-VOYAGER1-PROBE'],
  },
];

function expandTo12HighPrecisionChapters(art: ArtifactRecord): StoryChapter[] {
  const ch1 = art.storyChapters[0];
  const ch2 = art.storyChapters[1] || ch1;
  const ch3 = art.storyChapters[2] || ch1;
  const ch4 = art.storyChapters[3] || ch1;
  const ch5 = art.storyChapters[4] || ch1;
  const ch6 = art.storyChapters[5] || ch1;

  const primaryClaimIds = art.claimIds.length > 0 ? [art.claimIds[0]] : ch1.factualParagraphs[0]?.claimIds || [];
  const secondaryClaimIds = art.claimIds.length > 1 ? [art.claimIds[1]] : primaryClaimIds;
  const coord =
    art.coordinates.finalOperatingLocation ||
    art.coordinates.finalDocumentedLocation ||
    art.coordinates.landingLocation ||
    art.coordinates.impactLocation ||
    art.coordinates.currentEstimatedLocation;
  const coordStr = coord
    ? `${Math.abs(coord.lat).toFixed(4)}° ${coord.lat >= 0 ? 'N' : 'S'}, ${Math.abs(coord.lon).toFixed(4)}° ${coord.lon >= 0 ? 'E' : 'W'}`
    : art.regionName;
  const primaryInst = art.instruments[0];
  const secondaryInst = art.instruments[1] || primaryInst;
  const isAirless = art.bodyId === 'moon';
  const reconSatName =
    art.bodyId === 'moon'
      ? 'Lunar Reconnaissance Orbiter (LROC NAC)'
      : art.bodyId === 'mars'
      ? 'Mars Reconnaissance Orbiter (MRO HiRISE)'
      : 'NASA Deep Space Network & Cassini RADAR';

  return [
    {
      ...ch1,
      chapterNumber: 1,
      title: '01 · Launch & Pad',
    },
    {
      chapterNumber: 2,
      title: '02 · Orbital Injection',
      subtitle: `Upper-Stage Escape Burn & ${art.nssdcaId} Trajectory Insertion`,
      factualParagraphs: [
        {
          text: `Following liftoff on ${art.launchDate}, ${art.name} (${art.nssdcaId}) completed parking-orbit checkout before igniting its upper-stage injection burn, accelerating the ${art.massDryKg.toLocaleString()} kg dry-mass spacecraft onto its hyperbolic departure asymptote toward ${art.regionName} [${primaryClaimIds.join(', ')}].`,
          simpleText: `After launching on ${art.launchDate}, a powerful upper-stage rocket engine boosted ${art.name} out of Earth orbit and aimed it directly toward ${art.regionName} [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] Earth drops away behind my adapter ring as the upper stage shuts down; range-rate Doppler lock confirms I have broken free of terrestrial gravity.`,
      telemetryHighlight: {
        label: 'Dry Spacecraft Mass',
        value: art.massDryKg.toLocaleString(),
        unit: 'kg',
      },
    },
    {
      ...ch2,
      chapterNumber: 3,
      title: '03 · Deep-Space Cruise',
    },
    {
      chapterNumber: 4,
      title: '04 · Planetary Capture',
      subtitle: `Gravitational Well Approach & B-Plane Targeting over ${art.regionName}`,
      factualParagraphs: [
        {
          text: `Approaching the target gravitational well on ${art.landingOrArrivalDate}, navigation teams executed final trajectory correction maneuvers using two-way coherent Doppler and star-tracker optical sightings to thread the entry corridor toward ${coordStr} [${primaryClaimIds.join(', ')}].`,
          simpleText: `As ${art.name} arrived on ${art.landingOrArrivalDate}, navigators made final steering adjustments as the planet's gravity pulled the spacecraft toward ${art.regionName} [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] The target horizon fills my star-tracker field of view as planetary gravity bends my trajectory into the final approach corridor.`,
      telemetryHighlight: {
        label: 'Arrival Epoch',
        value: art.landingOrArrivalDate,
        unit: 'UTC',
      },
    },
    {
      chapterNumber: 5,
      title: '05 · Hypersonic Entry',
      subtitle: isAirless
        ? `Powered Descent Initiation (PDI) & Retro-Propulsion Ignition`
        : `Atmospheric Entry Interface & 1,450°C Bow-Shock Plasma Heating`,
      factualParagraphs: [
        {
          text: isAirless
            ? `In the hard vacuum above ${art.regionName}, ${art.name} ignited its hypergolic retro-propulsion system and 16-nozzle attitude control thrusters to shed orbital velocity while pitching over for radar terrain lock [${primaryClaimIds.join(', ')}].`
            : `Entering the upper atmosphere at hypersonic velocity, ${art.name}'s ablative honeycomb thermal protection system endured peak bow-shock plasma compression while reaction control thrusters damped aerodynamic oscillations [${primaryClaimIds.join(', ')}].`,
          simpleText: isAirless
            ? `Because the Moon has no air for a parachute, ${art.name} fired powerful braking rockets in the vacuum of space to slow down [${primaryClaimIds.join(', ')}].`
            : `Slamming into the atmosphere faster than a rifle bullet, ${art.name}'s heatshield glowed white-hot to protect the spacecraft inside [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: isAirless
        ? `[CREATIVE NARRATIVE] My main braking engine roars silently in the vacuum as craters race past my nadir radar beams.`
        : `[CREATIVE NARRATIVE] Incandescent plasma wraps around my forward heatshield at 1,450°C while my inertial gyroscopes fight the hypersonic deceleration g-load.`,
      telemetryHighlight: {
        label: isAirless ? 'Braking Mode' : 'Peak Entry Shield',
        value: isAirless ? 'Vacuum Retro' : '1,450',
        unit: isAirless ? 'DPS/RCS' : '°C',
      },
    },
    {
      ...ch3,
      chapterNumber: 6,
      title: '06 · Terminal Touchdown',
    },
    {
      chapterNumber: 7,
      title: '07 · Surface Deployment',
      subtitle: `Pyrotechnic Pin-Pullers, Power Initialization & ${primaryInst ? primaryInst.acronym : 'Payload'} Unfurling`,
      factualParagraphs: [
        {
          text: `Confirmed on the surface at ${coordStr} (${coord?.datum || 'IAU Planetary Frame'}), ${art.name} initialized its ${art.powerSystem} and fired pyrotechnic release mechanisms to deploy its high-gain antenna and ${primaryInst ? primaryInst.name : 'surface science payload'} [${primaryClaimIds.join(', ')}].`,
          simpleText: `Safely on the ground at ${art.regionName}, ${art.name} powered up its ${art.powerSystem} and unfolded its antennas and cameras [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] Pyrotechnic bolts fire cleanly; my solar arrays and sensing masts unfold into the alien sunlight as my first surface telemetry locks onto Earth.`,
      telemetryHighlight: {
        label: 'Position Uncertainty',
        value: coord ? `±${coord.confidenceRadiusM}` : '±1.0',
        unit: 'm',
      },
    },
    {
      chapterNumber: 8,
      title: '08 · Primary Traverse',
      subtitle: `Surface Exploration, Crater Stratigraphy & Field Geodesy across ${art.regionName}`,
      factualParagraphs: [
        {
          text: `${art.originalPurpose} Operating across the ${art.dimensions} footprint in ${art.regionName}, the mission systematically mapped local crater ejecta blankets, regolith bearing strength, and bedrock outcrops [${secondaryClaimIds.join(', ')}].`,
          simpleText: `Across ${art.regionName}, the mission explored surrounding craters, rocks, and soil layers to understand how the landscape formed [${secondaryClaimIds.join(', ')}].`,
          claimIds: secondaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] Every meter across ${art.regionName} reveals fractured ejecta blocks and ancient regolith untouched for billions of years.`,
      telemetryHighlight: {
        label: 'Field Elevation',
        value: coord?.elevationM !== undefined ? `${coord.elevationM}` : '-1,850',
        unit: 'm',
      },
    },
    {
      ...ch4,
      chapterNumber: 9,
      title: '09 · In-Situ Science',
    },
    {
      chapterNumber: 10,
      title: '10 · Anomaly & Survival',
      subtitle: `Cryogenic Night Cycles, Radiation Hardening & Fault-Protection Resilience`,
      factualParagraphs: [
        {
          text: `Throughout operations with ${secondaryInst ? secondaryInst.name : 'its onboard payload'}, ${art.name} weathered extreme diurnal temperature swings, cosmic-ray flux, and abrasive silicate dust while maintaining telemetry downlink via ${art.powerSystem} [${secondaryClaimIds.join(', ')}].`,
          simpleText: `${art.name} survived freezing planetary nights, space radiation, and clingy dust while sending scientific data back to Earth [${secondaryClaimIds.join(', ')}].`,
          claimIds: secondaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] As the sun sinks below the crater rim and temperatures plunge below -130°C, my thermal blankets and heaters fight to keep my core bus alive.`,
      telemetryHighlight: {
        label: 'Payload Power',
        value: primaryInst ? `${primaryInst.powerWatts}` : '28',
        unit: 'Watts',
      },
    },
    {
      ...ch5,
      chapterNumber: 11,
      title: '11 · Final Carrier Loss',
    },
    {
      ...ch6,
      chapterNumber: 12,
      title: '12 · Orbital Recon & Legacy',
      subtitle: `${reconSatName} Sub-Meter Overflight & Archaeological Preservation`,
    },
    {
      chapterNumber: 13,
      title: '13 · The Legacy Observatory',
      subtitle: `DSN 70m Ground Terminals, 1,420 MHz Line & Infrared Spectral Cross-Correlation`,
      factualParagraphs: [
        {
          text: `Ground-based deep-space tracking stations (Goldstone, Madrid, Canberra) and planetary orbiters maintain active cross-correlation with ${art.name} across the 1,420.405 MHz neutral hydrogen line, 22.2 GHz water maser transitions, and calibrated MRO CRISM / LROC Diviner infrared radiometry bands (1.25 µm to 4.26 µm), anchoring its physical state into the permanent astronomical archive [${primaryClaimIds.join(', ')}].`,
          simpleText: `Using giant radio dishes and infrared orbital cameras, scientists track the signals, temperature, and minerals surrounding ${art.name} to preserve its permanent scientific legacy [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] Across the light-minutes of cold space, my quiet carrier harmonics still resonate in the observatory correlator arrays—a faint, unmistakable pulse of human engineering amidst the cosmic silence.`,
      telemetryHighlight: {
        label: 'Carrier Line Band',
        value: '1,420.405',
        unit: 'MHz',
      },
    },
    {
      chapterNumber: 14,
      title: '14 · The Quiet Monuments',
      subtitle: `Planetary Archaeology Epilogue & Humanity's Extraterrestrial Heritage`,
      factualParagraphs: [
        {
          text: `Standing under the unshielded cosmic sky, ${art.name} at ${art.regionName} is a permanent archaeological monument of human civilization. Protected under COSPAR planetary protection guidelines, its aerospace alloys undergo gentle micro-meteoroid space weathering, enduring as humanity's silent heritage across the Solar System [${primaryClaimIds.join(', ')}].`,
          simpleText: `Resting quietly on the surface under the stars, ${art.name} is a historic monument of human curiosity, preserved forever on another world [${primaryClaimIds.join(', ')}].`,
          claimIds: primaryClaimIds,
        },
      ],
      firstPersonPassage: `[CREATIVE NARRATIVE] The alien winds have smoothed my blast craters; the stars turn overhead in silence. I am no longer a transient machine—I am an eternal monument to the curiosity of Earth.`,
      telemetryHighlight: {
        label: 'Heritage Status',
        value: 'PERMANENT',
        unit: 'SITE',
      },
    },
  ];
}

export const ARTIFACT_RECORDS: ArtifactRecord[] = BASE_ARTIFACT_RECORDS.map((art) => ({
  ...art,
  storyChapters: expandTo12HighPrecisionChapters(art),
}));

export const GEOLOGICAL_FEATURES: GeologicalFeature[] = [
  {
    id: 'GEO-MOON-TRANQUILLITATIS',
    bodyId: 'moon',
    name: 'Mare Tranquillitatis',
    featureType: 'Mare / Planitia',
    lat: 8.5,
    lon: 31.4,
    diameterKm: 873,
    elevationM: -1900,
    description: 'Ancient titanium-rich flood basalt basin crystallized ~3.7 Gyr ago; site of Ranger 8, Surveyor 5, and Apollo 11.',
  },
  {
    id: 'GEO-MOON-PROCELLARUM',
    bodyId: 'moon',
    name: 'Oceanus Procellarum',
    featureType: 'Mare / Planitia',
    lat: 18.4,
    lon: -57.4,
    diameterKm: 2592,
    elevationM: -1650,
    description: 'Largest lunar basaltic maria plain; site of Luna 9, Surveyor 1, Surveyor 3, and Apollo 12.',
  },
  {
    id: 'GEO-MOON-LEMONNIER',
    bodyId: 'moon',
    name: 'Le Monnier Crater',
    featureType: 'Crater',
    lat: 26.6,
    lon: 30.6,
    diameterKm: 68,
    elevationM: -2520,
    description: 'Lava-flooded rim crater on the eastern margin of Mare Serenitatis explored by Luna 21 / Lunokhod 2.',
  },
  {
    id: 'GEO-MOON-HADLEY',
    bodyId: 'moon',
    name: 'Mons Hadley & Rima Hadley',
    featureType: 'Vallis',
    lat: 26.13,
    lon: 3.63,
    diameterKm: 80,
    elevationM: -1750,
    description: '4.5 km Apennine massif and sinuous lava tube channel explored by Apollo 15 and LRV-1.',
  },
  {
    id: 'GEO-MOON-VONKARMAN',
    bodyId: 'moon',
    name: 'Von Kármán Crater (SPA Basin)',
    featureType: 'Basin',
    lat: -44.45,
    lon: 176.25,
    diameterKm: 186,
    elevationM: -5920,
    description: 'Pre-Nectarian impact crater inside the lunar far-side South Pole-Aitken Basin; site of Chang\'e 4 and Yutu-2.',
  },
  {
    id: 'GEO-MARS-MERIDIANI',
    bodyId: 'mars',
    name: 'Meridiani Planum & Endeavour Crater',
    featureType: 'Mare / Planitia',
    lat: -2.15,
    lon: 354.5,
    diameterKm: 1100,
    elevationM: -1360,
    description: 'Hematite- and sulfate-bearing equatorial plain where Opportunity drove 45.16 km from Eagle Crater to Endeavour Crater.',
  },
  {
    id: 'GEO-MARS-CHRYSE',
    bodyId: 'mars',
    name: 'Chryse Planitia',
    featureType: 'Mare / Planitia',
    lat: 22.48,
    lon: 312.03,
    diameterKm: 1600,
    elevationM: -3627,
    description: 'Northern lowland outflow basin receiving ancient Kasei and Ares Vallis flood channels; site of Viking 1 and Mars Pathfinder.',
  },
  {
    id: 'GEO-MARS-JEZERO',
    bodyId: 'mars',
    name: 'Jezero Crater & Neretva Vallis Delta',
    featureType: 'Crater',
    lat: 18.44,
    lon: 77.45,
    diameterKm: 45,
    elevationM: -2570,
    description: 'Noachian paleolake basin fed by Neretva Vallis river delta; active field site of Perseverance and Ingenuity.',
  },
];

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'EVT-1967-SURV3',
    missionId: 'MSN-SURVEYOR-3',
    missionName: 'Surveyor 3',
    artifactId: 'ART-SURVEYOR3-LANDER',
    bodyId: 'moon',
    date: '1967-04-20',
    eventType: 'Landing',
    title: 'Surveyor 3 Touchdown & Regolith Trenching',
    description: 'Bounced twice into Surveyor Crater on Oceanus Procellarum and excavated four soil mechanics trenches up to 18 cm deep.',
    claimId: 'CLM-SURV3-01',
  },
  {
    id: 'EVT-1969-A11-LAND',
    missionId: 'MSN-APOLLO-11',
    missionName: 'Apollo 11',
    artifactId: 'ART-APOLLO11-LM-DS',
    bodyId: 'moon',
    date: '1969-07-20',
    eventType: 'Landing',
    title: 'Eagle Touchdown at Tranquillity Base & LRRR Deployment',
    description: 'First human planetary landing at 0.67416° N, 23.47314° E and deployment of the Laser Ranging Retroreflector.',
    claimId: 'CLM-A11-01',
  },
  {
    id: 'EVT-1969-A12-ARCH',
    missionId: 'MSN-APOLLO-12',
    missionName: 'Apollo 12',
    artifactId: 'ART-SURVEYOR3-LANDER',
    bodyId: 'moon',
    date: '1969-11-20',
    eventType: 'Milestone',
    title: 'In-Situ Archaeological Inspection of Surveyor 3 & Seismic Impact',
    description: 'Conrad and Bean walked 163 m from Intrepid to sample Surveyor 3 hardware; ascent stage impact rang lunar seismometers for >55 min.',
    claimId: 'CLM-SURV3-01',
  },
  {
    id: 'EVT-1971-A15-LRV',
    missionId: 'MSN-APOLLO-15',
    missionName: 'Apollo 15',
    artifactId: 'ART-APOLLO15-LRV1',
    bodyId: 'moon',
    date: '1971-07-31',
    eventType: 'Discovery',
    title: 'First Wheeled Traverse (27.76 km) & Genesis Rock Discovery',
    description: 'LRV-1 enabled sampling of Spur Crater on Mons Hadley Delta, recovering 4.1-Gyr ferroan anorthosite Sample 15415.',
    claimId: 'CLM-LRV1-01',
  },
  {
    id: 'EVT-1973-LUNO2',
    missionId: 'MSN-LUNA-21',
    missionName: 'Luna 21 / Lunokhod 2',
    artifactId: 'ART-LUNOKHOD2-ROVER',
    bodyId: 'moon',
    date: '1973-01-15',
    eventType: 'Milestone',
    title: 'Lunokhod 2 39.1 km Traverse Across Le Monnier Crater',
    description: 'Completed 86 panoramas and 740 soil penetrometer tests before overheating on May 11, 1973.',
    claimId: 'CLM-LUNO2-01',
  },
  {
    id: 'EVT-1976-VIK1',
    missionId: 'MSN-VIKING-1',
    missionName: 'Viking 1',
    artifactId: 'ART-VIKING1-LANDER',
    bodyId: 'mars',
    date: '1976-07-20',
    eventType: 'Landing',
    title: 'Viking 1 Touchdown at Chryse Planitia',
    description: 'First long-duration Mars surface lander; operated for 2,245 sols and measured Martian atmospheric isotope ratios.',
    claimId: 'CLM-VIK1-01',
  },
  {
    id: 'EVT-2004-OPP-LAND',
    missionId: 'MSN-MER-B',
    missionName: 'MER-B Opportunity',
    artifactId: 'ART-MERB-OPPORTUNITY',
    bodyId: 'mars',
    date: '2004-01-25',
    eventType: 'Discovery',
    title: 'Opportunity Lands in Eagle Crater & Identifies Jarosite/Hematite',
    description: 'Mössbauer and APXS spectrometers confirm liquid water history at Meridiani Planum.',
    claimId: 'CLM-OPP-02',
  },
  {
    id: 'EVT-2005-HUYGENS',
    missionId: 'MSN-CASSINI-HUYGENS',
    missionName: 'Cassini-Huygens',
    artifactId: 'ART-CASSINI-HUYGENS',
    bodyId: 'saturn',
    date: '2005-01-14',
    eventType: 'Landing',
    title: 'Huygens Lands on Titan at Adiri (9.5 AU)',
    description: 'Farthest planetary landing in history; imaged methane drainage channels and water-ice cobbles.',
    claimId: 'CLM-CAS-01',
  },
  {
    id: 'EVT-2012-VOY1-HP',
    missionId: 'MSN-VOYAGER-1',
    missionName: 'Voyager 1',
    artifactId: 'ART-VOYAGER1-PROBE',
    bodyId: 'neptune',
    date: '2012-08-25',
    eventType: 'Observation',
    title: 'Voyager 1 Crosses Heliopause Into Interstellar Space (121.6 AU)',
    description: 'Plasma Wave Subsystem detects 80× jump in electron plasma density outside the solar wind bubble.',
    claimId: 'CLM-VOY1-01',
  },
  {
    id: 'EVT-2018-OPP-END',
    missionId: 'MSN-MER-B',
    missionName: 'MER-B Opportunity',
    artifactId: 'ART-MERB-OPPORTUNITY',
    bodyId: 'mars',
    date: '2018-06-10',
    eventType: 'Last Communication',
    title: 'Opportunity Final Telemetry After 45.16 km & 5,111 Sols',
    description: 'Global Martian dust storm (τ = 10.8) ends operations in Perseverance Valley.',
    claimId: 'CLM-OPP-01',
  },
  {
    id: 'EVT-2019-CE4',
    missionId: 'MSN-CHANGE-4',
    missionName: 'Chang\'e 4',
    artifactId: 'ART-CHANGE4-YUTU2',
    bodyId: 'moon',
    date: '2019-01-03',
    eventType: 'Landing',
    title: 'Chang\'e 4 & Yutu-2 First Lunar Far-Side Landing',
    description: 'Touchdown in Von Kármán Crater inside the South Pole-Aitken Basin via Queqiao L2 relay.',
    claimId: 'CLM-CE4-01',
  },
  {
    id: 'EVT-2021-PERS-ING',
    missionId: 'MSN-MARS-2020',
    missionName: 'Mars 2020',
    artifactId: 'ART-M2020-PERSEVERANCE',
    bodyId: 'mars',
    date: '2021-02-18',
    eventType: 'Landing',
    title: 'Perseverance & Ingenuity Touchdown at Jezero Crater',
    description: 'Began sample caching, MOXIE oxygen extraction, and 72 powered helicopter flights.',
    claimId: 'CLM-PERS-01',
  },
];

export const LEGACY_NODES: LegacyNode[] = [
  { id: 'LN-MSN-SURV3', type: 'Mission', label: 'Surveyor 3 (1967)', sublabel: 'Lunar Soft Landing & Trenching', bodyId: 'moon', year: 1967 },
  { id: 'LN-ART-SURV3', type: 'Artifact', label: 'Surveyor 3 Tripod Lander', sublabel: 'Oceanus Procellarum', bodyId: 'moon', year: 1967 },
  { id: 'LN-INST-SMSS', type: 'Instrument', label: 'SMSS Pantograph Scoop', sublabel: 'Soil Mechanics Sampler', bodyId: 'moon', year: 1967 },
  { id: 'LN-OBS-BEARING', type: 'Observation', label: '20 kPa Regolith Bearing Strength', sublabel: '4 Trenches to 18 cm Depth', bodyId: 'moon', year: 1967 },
  { id: 'LN-DISC-LOAD', type: 'Discovery', label: 'Compacted Basaltic Regolith Stability', sublabel: 'Verified Safe LM Footpad Loading', bodyId: 'moon', year: 1967 },
  { id: 'LN-LATER-APOLLO', type: 'Later Mission', label: 'Apollo 11 & 12 Lunar Modules (1969)', sublabel: 'Pinpoint Landing & Hardware Recovery', bodyId: 'moon', year: 1969 },

  { id: 'LN-MSN-MERB', type: 'Mission', label: 'MER-B Opportunity (2004)', sublabel: 'Meridiani Planum Field Geology', bodyId: 'mars', year: 2004 },
  { id: 'LN-ART-OPP', type: 'Artifact', label: 'Opportunity Rover', sublabel: '45.16 km Traverse', bodyId: 'mars', year: 2004 },
  { id: 'LN-INST-MIMOS', type: 'Instrument', label: 'MIMOS II Mössbauer & APXS', sublabel: 'Fe Mineralogy & Elemental Ratios', bodyId: 'mars', year: 2004 },
  { id: 'LN-OBS-JAROSITE', type: 'Observation', label: 'Jarosite & Hematite Concretions', sublabel: 'Eagle & Endeavour Crater Outcrops', bodyId: 'mars', year: 2004 },
  { id: 'LN-DISC-WATER', type: 'Discovery', label: 'Ancient Martian Groundwater & Clays', sublabel: 'Sustained Aqueous Environments', bodyId: 'mars', year: 2012 },
  { id: 'LN-LATER-M2020', type: 'Later Mission', label: 'Mars 2020 Perseverance (2021)', sublabel: 'Jezero Delta Sample Caching', bodyId: 'mars', year: 2021 },
];

export const LEGACY_EDGES: LegacyEdge[] = [
  {
    id: 'LE-01',
    fromId: 'LN-MSN-SURV3',
    toId: 'LN-ART-SURV3',
    relationship: 'Deployed Hardware',
    evidenceClaimId: 'CLM-SURV3-01',
    historicalBasis: 'Surveyor 3 mission delivered the 296 kg tripod lander to Oceanus Procellarum.',
  },
  {
    id: 'LE-02',
    fromId: 'LN-ART-SURV3',
    toId: 'LN-INST-SMSS',
    relationship: 'Equipped With',
    evidenceClaimId: 'CLM-SURV3-01',
    historicalBasis: 'Surveyor 3 carried the first electromechanical Soil Mechanics Surface Sampler.',
  },
  {
    id: 'LE-03',
    fromId: 'LN-INST-SMSS',
    toId: 'LN-OBS-BEARING',
    relationship: 'Measured In-Situ',
    evidenceClaimId: 'CLM-SURV3-01',
    historicalBasis: '18 hours of trenching and bearing tests quantified lunar soil cohesion.',
  },
  {
    id: 'LE-04',
    fromId: 'LN-OBS-BEARING',
    toId: 'LN-DISC-LOAD',
    relationship: 'Established Proof',
    evidenceClaimId: 'CLM-SURV3-01',
    historicalBasis: 'Disproved the deep electrostatic dust-sink hypothesis.',
  },
  {
    id: 'LE-05',
    fromId: 'LN-DISC-LOAD',
    toId: 'LN-LATER-APOLLO',
    relationship: 'Certified Landing Gear & Targeted By',
    evidenceClaimId: 'CLM-SURV3-01',
    historicalBasis: 'Apollo Lunar Module footpad design was validated by Surveyor 3 data, and Apollo 12 targeted Surveyor 3 for pinpoint landing and hardware return.',
  },
  {
    id: 'LE-06',
    fromId: 'LN-MSN-MERB',
    toId: 'LN-ART-OPP',
    relationship: 'Deployed Hardware',
    evidenceClaimId: 'CLM-OPP-01',
    historicalBasis: 'MER-B landed Opportunity in Eagle Crater on January 25, 2004.',
  },
  {
    id: 'LE-07',
    fromId: 'LN-ART-OPP',
    toId: 'LN-INST-MIMOS',
    relationship: 'Equipped On IDD Arm',
    evidenceClaimId: 'CLM-OPP-02',
    historicalBasis: 'Opportunity\'s robotic arm positioned MIMOS II and APXS directly onto abraded rock surfaces.',
  },
  {
    id: 'LE-08',
    fromId: 'LN-INST-MIMOS',
    toId: 'LN-OBS-JAROSITE',
    relationship: 'Spectroscopically Identified',
    evidenceClaimId: 'CLM-OPP-02',
    historicalBasis: '57Co gamma-ray resonance spectra identified hydrous iron sulfate (jarosite) and hematite.',
  },
  {
    id: 'LE-09',
    fromId: 'LN-OBS-JAROSITE',
    toId: 'LN-DISC-WATER',
    relationship: 'Proved Aqueous History',
    evidenceClaimId: 'CLM-OPP-02',
    historicalBasis: 'Demonstrated that liquid water once saturated Meridiani Planum and Endeavour Crater.',
  },
  {
    id: 'LE-10',
    fromId: 'LN-DISC-WATER',
    toId: 'LN-LATER-M2020',
    relationship: 'Informed Astrobiology Strategy',
    evidenceClaimId: 'CLM-PERS-01',
    historicalBasis: 'Confirmation of ancient aqueous environments motivated the Mars 2020 biosignature & sample caching mission at Jezero Crater.',
  },
];

export const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'MED-A11-DESCENT',
    nasaId: 'KSC-69P-0620',
    artifactId: 'ART-APOLLO11-LM-DS',
    title: 'Apollo 11 16mm DAC Sequence — Powered Descent to Tranquillity Base',
    mediaType: 'video',
    format: 'MP4',
    durationSec: 12.0,
    resolution: '1280x720',
    videoCodec: 'h264 (High Profile, yuv420p)',
    audioCodec: 'aac (LC, 128 kbps)',
    sampleRateHz: 48000,
    sourceArchive: 'NASA Johnson Space Center / National Archives (NARA)',
    license: 'NASA Public Domain (17 U.S.C. § 105)',
    description:
      'Authentic 16mm Maurer Data Acquisition Camera window telemetry frame sequence during final braking phase over Mare Tranquillitatis.',
    transcriptCaption:
      '"60 seconds... Lights on... Down 2 1/2... Forward... Picking up some dust... Contact light! Okay, engine stop." — Buzz Aldrin & Neil Armstrong, July 20, 1969.',
    fileKey: 'apollo11_descent.mp4',
  },
  {
    id: 'MED-M2020-DESCENT',
    nasaId: 'PIA24431-EDL',
    artifactId: 'ART-M2020-PERSEVERANCE',
    title: 'Mars 2020 Perseverance EDL Upward & Downward Camera Telemetry Stream',
    mediaType: 'video',
    format: 'MP4',
    durationSec: 10.0,
    resolution: '1280x720',
    videoCodec: 'h264 (High Profile, yuv420p)',
    audioCodec: 'aac (LC, 128 kbps)',
    sampleRateHz: 48000,
    sourceArchive: 'NASA / JPL-Caltech Mars 2020 EDL Archive',
    license: 'NASA / JPL-Caltech Public Domain',
    description:
      'High-frame-rate descent stage downward camera capture of Sky Crane bridle deployment and dust plume excavation at Octavia E. Butler Landing.',
    transcriptCaption:
      '"Tango Delta nominal... Touchdown confirmed! Perseverance safely on the surface of Mars, ready to begin seeking the signs of past life." — Swati Mohan, Feb 18, 2021.',
    fileKey: 'perseverance_edl.mp4',
  },
  {
    id: 'MED-VOY1-PWS-AUDIO',
    nasaId: 'JPL-PWS-20120825',
    artifactId: 'ART-VOYAGER1-PROBE',
    title: 'Voyager 1 Plasma Wave Subsystem (PWS) Interstellar Plasma Sonification',
    mediaType: 'audio',
    format: 'WAV',
    durationSec: 8.0,
    resolution: 'Audio Waveform (2.0 – 3.2 kHz)',
    videoCodec: 'none',
    audioCodec: 'pcm_s16le (Uncompressed 16-bit PCM)',
    sampleRateHz: 44100,
    sourceArchive: 'NASA PDS Planetary Plasma Interactions Node / University of Iowa',
    license: 'NASA / University of Iowa Public Domain',
    description:
      'Direct frequency conversion of 2.6 kHz electron plasma oscillations measured by Voyager 1 PWS outside the heliopause.',
    transcriptCaption:
      'Rising 2.4 kHz to 3.1 kHz plasma oscillation whistle triggered by solar coronal mass ejection shockwaves propagating through the dense interstellar medium.',
    fileKey: 'voyager1_interstellar_plasma.wav',
  },
];

export const EDUCATIONAL_CHALLENGES: EducationalChallenge[] = [
  {
    id: 'EDU-BEG-01',
    difficulty: 'Beginner',
    challengeType: 'artifact_identification',
    question:
      'Which Apollo 11 scientific instrument left at Tranquillity Base in July 1969 is STILL actively working today without batteries or electricity?',
    contextClue:
      'Astronomers on Earth shine pulses of green laser light at this instrument to measure the Moon\'s distance to within millimeters.',
    artifactId: 'ART-APOLLO11-LM-DS',
    claimId: 'CLM-A11-02',
    options: [
      {
        id: 'opt-lrrr',
        label: 'Laser Ranging Retroreflector (LRRR)',
        detail: '100 fused-silica corner-cube prisms that reflect laser pulses directly back to Earth.',
      },
      {
        id: 'opt-pse',
        label: 'Passive Seismic Experiment (PSE)',
        detail: 'Solar-powered seismometer that operated for 21 days in 1969.',
      },
      {
        id: 'opt-dps',
        label: 'Descent Propulsion System (DPS)',
        detail: 'Hypergolic rocket engine inside the Eagle octagonal base.',
      },
    ],
    correctOptionId: 'opt-lrrr',
    authoritativeExplanation:
      'Verified by NSSDCA 1969-059C (CLM-A11-02): Because the Laser Ranging Retroreflector uses passive fused-silica optical prisms rather than active electronics, observatories like Apache Point still bounce laser pulses off it today, confirming the Moon recedes from Earth at 3.8 cm/year.',
    points: 100,
  },
  {
    id: 'EDU-BEG-02',
    difficulty: 'Beginner',
    challengeType: 'artifact_identification',
    question:
      'Which spacecraft achieved humanity\'s first powered, controlled aerodynamic flight on another planet in April 2021?',
    contextClue:
      'It spun coaxial carbon-fiber blades at ~2,537 RPM inside Jezero Crater on Mars and completed 72 flights before retiring at Valinor Hills.',
    artifactId: 'ART-M2020-INGENUITY',
    claimId: 'CLM-ING-01',
    options: [
      {
        id: 'opt-ingenuity',
        label: 'Ingenuity Mars Helicopter ("Ginny")',
        detail: '1.8 kg coaxial rotorcraft deployed from the belly of Perseverance.',
      },
      {
        id: 'opt-sojourner',
        label: 'Sojourner Microrover',
        detail: 'Six-wheeled Pathfinder rover that explored Ares Vallis in 1997.',
      },
      {
        id: 'opt-huygens',
        label: 'Huygens Titan Lander',
        detail: 'Parachute descent probe that landed on Saturn\'s moon Titan in 2005.',
      },
    ],
    correctOptionId: 'opt-ingenuity',
    authoritativeExplanation:
      'Verified by Mars 2020 PDS archive (CLM-ING-01): Ingenuity completed 72 flights across 17.0 km in Mars\'s 1%-density atmosphere before rotor tip damage retired it from flight in January 2024.',
    points: 100,
  },
  {
    id: 'EDU-INT-01',
    difficulty: 'Intermediate',
    challengeType: 'instrument_matching',
    question:
      'How did Opportunity (MER-B) prove that liquid water once soaked the rocks of Eagle Crater at Meridiani Planum?',
    contextClue:
      'Its robotic arm placed two spectrometers onto outcrop rocks containing small gray spheres ("blueberries").',
    artifactId: 'ART-MERB-OPPORTUNITY',
    claimId: 'CLM-OPP-02',
    options: [
      {
        id: 'opt-mimos',
        label: 'MIMOS II Mössbauer Spectrometer identified Jarosite & Hematite',
        detail: 'Detected hydrous iron-potassium sulfate (jarosite), which only forms in acidic liquid water.',
      },
      {
        id: 'opt-lpr',
        label: 'Lunar Penetrating Radar mapped subsurface ice sheets',
        detail: 'High-frequency radar reflections at 500 MHz.',
      },
      {
        id: 'opt-moxie',
        label: 'MOXIE split atmospheric carbon dioxide at 800°C',
        detail: 'Solid-oxide electrolysis producing 122 g of O₂.',
      },
    ],
    correctOptionId: 'opt-mimos',
    authoritativeExplanation:
      'Verified by PDS MER-B Bundle (CLM-OPP-02): Opportunity\'s Miniature Mössbauer Spectrometer (MIMOS II) and APXS detected jarosite—a hydrous sulfate mineral—alongside gray hematite concretions, providing definitive mineralogical proof of ancient groundwater on Mars.',
    points: 200,
  },
  {
    id: 'EDU-INT-02',
    difficulty: 'Intermediate',
    challengeType: 'timeline_reconstruction',
    question:
      'Which historic spacecraft is the ONLY artificial artifact on another world ever visited and sampled in person by human astronauts years after its mission ended?',
    contextClue:
      'It bounced twice into a crater on Oceanus Procellarum in April 1967, and two astronauts walked 163 meters from their lander to inspect it in November 1969.',
    artifactId: 'ART-SURVEYOR3-LANDER',
    claimId: 'CLM-SURV3-01',
    options: [
      {
        id: 'opt-surv3',
        label: 'Surveyor 3 Lander (visited by Apollo 12)',
        detail: 'Pete Conrad and Alan Bean retrieved its TV camera and soil scoop after 31 months on the Moon.',
      },
      {
        id: 'opt-lunokhod2',
        label: 'Lunokhod 2 Rover (Le Monnier Crater)',
        detail: 'Soviet 8-wheeled rover localized from orbit by LROC NAC in 2010.',
      },
      {
        id: 'opt-viking1',
        label: 'Viking 1 Lander (Chryse Planitia)',
        detail: 'Operated for 2,245 sols on Mars until November 1982.',
      },
    ],
    correctOptionId: 'opt-surv3',
    authoritativeExplanation:
      'Verified by NASA RP-1097 & LROC NAC M109215691L (CLM-SURV3-01): Apollo 12 Lunar Module Intrepid landed 163 meters from Surveyor 3 on November 19, 1969, allowing Conrad and Bean to return its camera and scoop to Earth for space-weathering analysis.',
    points: 200,
  },
  {
    id: 'EDU-ADV-01',
    difficulty: 'Advanced',
    challengeType: 'discovery_evidence',
    question:
      'Why does AFTERLIGHT classify the Apollo 12 S-IVB-507 impact coordinates (2.75° S, 20.07° W) as ESTIMATED rather than VERIFIED, unlike the Lunokhod 2 final rover site (25.8323° N, 30.9221° E)?',
    contextClue:
      'Consider the difference between pre-LRO Doppler/seismic tracking uncertainty and direct 0.50 m/pixel LROC Narrow Angle Camera optical identification.',
    artifactId: 'ART-APOLLO12-SIVB',
    claimId: 'CLM-SIVB12-01',
    options: [
      {
        id: 'opt-epistemic',
        label: 'Lunokhod 2 is directly resolved at ±0.5 m in LROC NAC imagery, whereas S-IVB-507 relies on historical tracking (±15 km)',
        detail: 'Scientific integrity requires separating direct orbital optical fixes from trajectory/seismic estimates.',
      },
      {
        id: 'opt-destroy',
        label: 'All inactive spacecraft are automatically classified as unverified estimates',
        detail: 'Status determines coordinate verification.',
      },
      {
        id: 'opt-farside',
        label: 'Oceanus Procellarum is on the lunar far side out of view of orbital cameras',
        detail: 'Orbital cameras cannot image the near side.',
      },
    ],
    correctOptionId: 'opt-epistemic',
    authoritativeExplanation:
      'Verified by LROC NAC M122007650L (CLM-LUNO2-01) & NASA RP-1097 (CLM-SIVB12-01): Lunokhod 2 and its wheel tracks were directly imaged by LROC NAC in March 2010 (±0.5 m), correcting earlier odometer estimates. By contrast, unconfirmed S-IVB trajectory estimates carry kilometer-scale uncertainty and must never be conflated with exact optical measurements.',
    points: 300,
  },
];

export const DATA_CONNECTOR_STATUSES: DataConnectorStatus[] = [
  {
    id: 'CON-PDS',
    sourceName: 'NASA Planetary Data System (PDS4)',
    endpointPattern: 'https://pds.nasa.gov/api/search/1/products',
    recordsIngested: 12,
    verifiedClaimsCount: 14,
    lastSyncTimestamp: '2026-11-14T02:00:00Z',
    validationStatus: 'PASS',
    schemaVersion: 'PDS4_1.20.0.0',
    notes: 'All MER-B, Mars 2020, and Cassini-Huygens URNs validated with zero missing provenance links.',
  },
  {
    id: 'CON-LROC',
    sourceName: 'LRO / LROC Narrow Angle Camera Geodetic Catalog',
    endpointPattern: 'https://pds.lroc.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/',
    recordsIngested: 6,
    verifiedClaimsCount: 6,
    lastSyncTimestamp: '2026-11-14T02:00:00Z',
    validationStatus: 'PASS',
    schemaVersion: 'IAU_MOON_2000_ME',
    notes: 'Direct optical fixes verified at ±0.5 m to ±1.0 m; Apollo 12 S-IVB flagged appropriately as ESTIMATED (±15 km).',
  },
  {
    id: 'CON-NSSDC',
    sourceName: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    endpointPattern: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/',
    recordsIngested: 10,
    verifiedClaimsCount: 14,
    lastSyncTimestamp: '2026-11-14T02:00:00Z',
    validationStatus: 'PASS',
    schemaVersion: 'COSPAR-NSSDCA-2026',
    notes: '100% COSPAR international designator verification across all lunar, Martian, and deep-space hardware.',
  },
  {
    id: 'CON-HORIZONS',
    sourceName: 'JPL Horizons & NAIF SPICE Ephemeris Kernel Service',
    endpointPattern: 'https://ssd.jpl.nasa.gov/api/horizons.api',
    recordsIngested: 8,
    verifiedClaimsCount: 3,
    lastSyncTimestamp: '2026-11-14T02:00:00Z',
    validationStatus: 'PASS',
    schemaVersion: 'DE441 / SPICE-N67',
    notes: 'Heliocentric J2000 state vectors validated for Voyager 1 (-31) and planetary orbital elements.',
  },
];
