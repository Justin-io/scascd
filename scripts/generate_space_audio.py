import wave
import struct
import math
import random
import os

SAMPLE_RATE = 44100
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "media", "sounds")

def save_wav(filename, samples, sample_rate=SAMPLE_RATE):
    filepath = os.path.join(OUT_DIR, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    clipped = [int(max(-1.0, min(1.0, s)) * 32767) for s in samples]
    with wave.open(filepath, "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(struct.pack(f"<{len(clipped)}h", *clipped))
    print(f"Generated {filepath} ({len(clipped)} samples, {len(clipped)/sample_rate:.2f}s)")

# ==============================================================================
# HELPER: PNEUMATIC PRESSURE RELEASE BLOWDOWN PURGE
# ==============================================================================
def synthesize_pressure_release_sample(t_rel, decay_tau=0.75):
    """
    Simulates high-pressure helium/propellant blowdown relief valve purge:
    Sudden relief valve crack, choked supersonic sonic jet hiss (1.5kHz-5kHz bandpass),
    exponential pressure decay, and hot nozzle thermal contraction pings.
    """
    if t_rel < 0.0:
        return 0.0
    
    white = random.random() * 2.0 - 1.0
    
    # Initial relief valve mechanical snap (12ms)
    valve_crack = 0.0
    if t_rel < 0.012:
        valve_crack = math.sin(2.0 * math.pi * 3400.0 * t_rel) * math.exp(-t_rel * 320.0) * 0.45
        
    # Choked supersonic turbulent gas hiss through orifice
    gas_decay = math.exp(-t_rel / decay_tau)
    # Bandpass acoustic resonance around 2.8kHz - 4.5kHz
    gas_hiss = (
        math.sin(2.0 * math.pi * 3200.0 * t_rel) * 0.25 +
        math.sin(2.0 * math.pi * 4400.0 * t_rel) * 0.18 +
        white * 0.65
    ) * gas_decay
    
    # Thermal engine casing cooling ping at t = 0.8s and 1.6s
    cooling_ping = 0.0
    for ping_t in [0.72, 1.45]:
        dt = t_rel - ping_t
        if 0.0 <= dt < 0.04:
            cooling_ping += math.sin(2.0 * math.pi * 2100.0 * dt) * math.exp(-dt * 120.0) * 0.22
            
    return (valve_crack + gas_hiss * 0.75 + cooling_ping)

# ==============================================================================
# 1. ROCKET DESCENT PROPULSION (Apollo DPS & Mars Hydrazine Engines)
# ==============================================================================
def gen_rocket_descent_engine():
    """Authentic hypergolic combustion roar with chamber Helmholtz resonance & supersonic crackle."""
    duration = 3.2
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(19690720)
    
    brown_acc = 0.0
    helmholtz_state1 = 0.0
    helmholtz_state2 = 0.0
    cabin_phase = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        brown_acc = (brown_acc * 0.965) + (white * 0.035)
        flutter = 0.8 + 0.2 * math.sin(2.0 * math.pi * 4.8 * t)
        helmholtz_state1 = (helmholtz_state1 * 0.86) + (white * 0.14 * flutter)
        helmholtz_state2 = (helmholtz_state2 * 0.78) + ((white - helmholtz_state1) * 0.22)
        
        cabin_phase += 2.0 * math.pi * 62.0 / SAMPLE_RATE
        cabin_hum = math.sin(cabin_phase) * 0.18
        
        raw = (brown_acc * 4.6 * 0.65) + (helmholtz_state1 * 0.22) + (helmholtz_state2 * 0.13) + cabin_hum
        
        if raw > 0.32:
            raw = 0.32 + (raw - 0.32) * 1.7
        sig = math.tanh(raw * 1.35)
        
        if t < 0.25:
            env = t / 0.25
        elif t > (duration - 0.45):
            env = (duration - t) / 0.45
        else:
            env = 1.0
            
        samples.append(sig * env * 0.88)
        
    save_wav("rocket_descent_engine.wav", samples)

# ==============================================================================
# 2. STANDALONE: INCREASING THRUSTER SOUND BEFORE TOUCHING SURFACE
# ==============================================================================
def gen_landing_increasing_thruster():
    """
    24.0s soft, warm thrust increasing sound as rocket approaches the surface to reduce impact:
    - Progressive, soft retro-propulsion throttle ramp: 30% -> 100% full cushioning thrust over 24.0s
    - Warm, soft turbopump spooling (gentle pitch ramp from 180 Hz to 420 Hz, no harsh harmonics)
    - Velvety low-frequency combustion chamber Helmholtz resonance & deep regolith-coupling sub-bass (38-56 Hz)
    - Soft, diffused pink noise exhaust plume cushion
    - Diffused ground proximity acoustic reflection and regolith wash (non-piercing)
    - Soft, warm hyperbolic tangent saturation (zero harsh clipping crackle)
    - Calibrated to soft ambient volume (-8.4 dB peak: 0.38)
    - STRICTLY NO touchdown impact thud, NO contact sensor chime, NO pressure vent hiss
    """
    duration = 24.0
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(19690720)
    
    brown_acc = 0.0
    pink_b = [0.0] * 7
    pump_phase = 0.0
    cabin_phase = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        p = t / duration  # 0.0 -> 1.0 over 24.0s
        
        # Progressive, soft thrust throttle ramp: 30% -> 100% full cushioning thrust
        throttle = 0.30 + 0.70 * (p ** 1.3)
        
        # 1. Warm, soft turbopump spooling (gentle pitch ramp from 180 Hz to 420 Hz)
        pump_freq = 180.0 + 240.0 * (p ** 1.2) + 2.0 * math.sin(2.0 * math.pi * 0.8 * t)
        pump_phase += 2.0 * math.pi * pump_freq / SAMPLE_RATE
        turbopump = (math.sin(pump_phase) * 0.07 + math.sin(pump_phase * 2.0) * 0.025) * throttle
        
        # 2. Velvety low-frequency combustion chamber Helmholtz resonance & sub-bass
        white = random.random() * 2.0 - 1.0
        brown_acc = (brown_acc * 0.975) + (white * 0.025)
        
        flutter_rate = 3.5 + 4.5 * p
        flutter = 0.85 + 0.15 * math.sin(2.0 * math.pi * flutter_rate * t)
        
        sub_freq = 38.0 + 18.0 * p
        sub_bass = (
            math.sin(2.0 * math.pi * sub_freq * t) * 0.32 +
            math.sin(2.0 * math.pi * (sub_freq * 1.5) * t) * 0.14
        ) * flutter
        
        # 3. Pink noise exhaust body (softened with gentle filter decay)
        pink_b[0] = 0.99886 * pink_b[0] + white * 0.0555179
        pink_b[1] = 0.99332 * pink_b[1] + white * 0.0750759
        pink_b[2] = 0.96900 * pink_b[2] + white * 0.1538520
        pink_b[3] = 0.86650 * pink_b[3] + white * 0.3104856
        pink_b[4] = 0.55000 * pink_b[4] + white * 0.5329522
        pink_b[5] = -0.7616 * pink_b[5] - white * 0.0168980
        pink = (sum(pink_b) + white * 0.5362) * 0.055
        
        # 4. Ground-effect acoustic cushion & regolith wash (soft, diffused, non-piercing)
        ground_proximity = max(0.0, p - 0.20) / 0.80
        ground_cushion = (pink * 0.70) * (ground_proximity ** 1.6) * 0.35
        
        # Structural hull vibration (subtle warm tone)
        cabin_phase += 2.0 * math.pi * (48.0 + 12.0 * p) / SAMPLE_RATE
        cabin_res = math.sin(cabin_phase) * 0.08 * throttle
        
        # Sum raw acoustic elements (warm & deep balance)
        raw = (brown_acc * 5.2 * 0.55 * flutter) + (sub_bass * 0.35) + (pink * 0.42) + turbopump + ground_cushion + cabin_res
        
        # Soft tanh saturation: NO harsh clipping or jagged crackle
        sig = math.tanh(raw * (0.85 + 0.35 * p)) * throttle
        
        # Clean micro boundary: 30ms anti-pop at start, 80ms gentle taper at 24s
        if t < 0.03:
            env = t / 0.03
        elif t > duration - 0.08:
            env = (duration - t) / 0.08
        else:
            env = 1.0
            
        samples.append(sig * env)
        
    # Peak normalize full 24s track to soft ambient level (-8.4 dB: 0.38)
    peak = max(abs(s) for s in samples) or 1.0
    scaled_24s = [s * (0.38 / peak) for s in samples]
    save_wav("landing_increasing_thruster.wav", scaled_24s)

    # Divide 24s audio into two 12.0s segments for CH 5 and CH 6
    half_samples = n_samples // 2

    # Part 1: First 12.0s (Chapter 5: Powered Descent Initiation)
    part1 = list(scaled_24s[:half_samples])
    ramp_start = int(SAMPLE_RATE * 0.03)
    ramp_end = int(SAMPLE_RATE * 0.005)
    for i in range(ramp_start):
        part1[i] *= (i / ramp_start)
    for i in range(ramp_end):
        part1[-1 - i] *= (i / ramp_end)
    save_wav("landing_increasing_thruster_ch5.wav", part1)

    # Part 2: Second 12.0s (Chapter 6: Terminal Touchdown Deceleration Cushion)
    part2 = list(scaled_24s[half_samples:])
    ramp_tail = int(SAMPLE_RATE * 0.08)
    for i in range(ramp_end):
        part2[i] *= (i / ramp_end)
    for i in range(ramp_tail):
        part2[-1 - i] *= (i / ramp_tail)
    save_wav("landing_increasing_thruster_ch6.wav", part2)

# ==============================================================================
# 3. STANDALONE: TOUCHDOWN CONTACT (Landing Gear Footpad / Cleats Impact)
# ==============================================================================
def gen_landing_touchdown_contact():
    """Mechanical strut compression thud, regolith crunch, sensor chime & instant engine cutoff."""
    duration = 0.65
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(11)
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        
        # 1. Structural oleo strut compression thud (sub-bass 75Hz)
        strut_thud = math.sin(2.0 * math.pi * 75.0 * t) * math.exp(-t * 22.0) * 0.55
        
        # 2. Footpad crunch into lunar/Martian regolith
        white = random.random() * 2.0 - 1.0
        regolith_crunch = white * math.exp(-t * 35.0) * 0.40
        
        # 3. Blue contact sensor light chime (1420Hz pure sine)
        contact_chime = math.sin(2.0 * math.pi * 1420.0 * t) * math.exp(-t * 8.5) * 0.38
        
        sig = (strut_thud + regolith_crunch + contact_chime) * 0.88
        samples.append(sig)
        
    save_wav("landing_touchdown_contact.wav", samples)

# ==============================================================================
# 4. STANDALONE: PRESSURE RELEASE SOUND AFTER LANDING (Propellant Purge Vent)
# ==============================================================================
def gen_landing_pressure_release():
    """Post-landing helium/propellant blowdown relief valve purge & cooling ticks."""
    duration = 2.6
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(55)
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        sig = synthesize_pressure_release_sample(t, decay_tau=0.78)
        
        env = 1.0
        if t > (duration - 0.25):
            env = (duration - t) / 0.25
            
        samples.append(sig * env * 0.85)
        
    save_wav("landing_pressure_release.wav", samples)

# ==============================================================================
# 4B. FULL UNIFIED LANDING SEQUENCE (Increasing Thruster -> Touchdown -> Pressure Vent)
# ==============================================================================
def gen_landing_sequence_full():
    """
    Seamless full sequence of the complete landing event (7.05s total):
    - 0.00s - 3.80s: INCREASING THRUSTERS before equipment touches surface (throttle 35% -> 100%, ground-effect reflection, crackle).
    - 3.80s - 4.45s: TOUCHDOWN CONTACT (Oleo strut impact thud, regolith crunch, 1,420 Hz contact light chime & instant thruster cutoff).
    - 3.98s - 7.05s: PRESSURE RELEASE SOUND after landing (hypergolic helium manifold blowdown purge hiss & nozzle cooling pings).
    """
    duration = 7.05
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(19690720)
    
    brown_acc = 0.0
    helmholtz = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        # 1. Increasing Thruster Sound (t = 0.00s to 3.85s)
        thruster_sig = 0.0
        if t < 3.85:
            progress = min(1.0, t / 3.80)
            brown_acc = (brown_acc * 0.96) + (white * 0.04)
            flutter_rate = 4.2 + 3.8 * progress
            flutter = 0.7 + 0.3 * math.sin(2.0 * math.pi * flutter_rate * t)
            helmholtz = (helmholtz * 0.84) + (white * 0.16 * flutter)
            
            raw = (brown_acc * 4.8 * 0.68) + (helmholtz * 0.32)
            crackle_thresh = 0.40 - 0.12 * progress
            if raw > crackle_thresh:
                raw = crackle_thresh + (raw - crackle_thresh) * (1.4 + 0.8 * progress)
                
            throttle_ramp = 0.35 + 0.65 * (progress ** 1.3)
            thruster_sig = math.tanh(raw * (1.2 + 0.6 * progress)) * throttle_ramp
            
            # Instant cutoff at touchdown moment
            if t > 3.80:
                thruster_sig *= max(0.0, 1.0 - (t - 3.80) / 0.05)
                
        # 2. Touchdown Contact Moment at t = 3.80s
        touchdown_impact = 0.0
        if 3.80 <= t < 4.45:
            dt = t - 3.80
            thud = math.sin(2.0 * math.pi * 75.0 * dt) * math.exp(-dt * 22.0) * 0.60
            crunch = (random.random() * 2.0 - 1.0) * math.exp(-dt * 35.0) * 0.42
            chime = math.sin(2.0 * math.pi * 1420.0 * dt) * math.exp(-dt * 8.5) * 0.42
            touchdown_impact = thud + crunch + chime
            
        # 3. Pressure Release Sound After Landing (t = 3.98s to 7.05s)
        pressure_release = 0.0
        if t >= 3.98:
            t_rel = t - 3.98
            pressure_release = synthesize_pressure_release_sample(t_rel, decay_tau=0.78) * 0.88
            
        env = 1.0
        if t < 0.10:
            env = t / 0.10
        elif t > (duration - 0.25):
            env = max(0.0, (duration - t) / 0.25)
            
        total = (thruster_sig * 0.90 + touchdown_impact + pressure_release) * env * 0.88
        samples.append(total)
        
    save_wav("landing_sequence_full.wav", samples)

# ==============================================================================
# 5. REACTION CONTROL SYSTEM (Apollo R-4D Hypergolic Quads / Pneumatic Bursts)
# ==============================================================================
def gen_rcs_thruster_pulse():
    """Sharp pneumatic attitude thruster puff with solenoid valve clicks."""
    duration = 0.22
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(42)
    prev = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        valve_open = 0.0
        if t < 0.012:
            valve_open = math.sin(2.0 * math.pi * 2600.0 * t) * math.exp(-t * 280.0) * 0.45
            
        hp = white - prev
        prev = white * 0.70
        
        if t < 0.003:
            gas_env = t / 0.003
        else:
            gas_env = math.exp(-22.0 * (t - 0.003))
            
        gas_burst = math.tanh(hp * 2.2) * gas_env * 0.85
        
        valve_close = 0.0
        if 0.14 <= t < 0.16:
            dt = t - 0.14
            valve_close = math.sin(2.0 * math.pi * 1800.0 * dt) * math.exp(-dt * 300.0) * 0.35
            
        sig = valve_open + gas_burst + valve_close
        samples.append(sig * 0.88)
        
    save_wav("rcs_thruster_pulse.wav", samples)

# ==============================================================================
# 6. ROVER WHEEL LOCOMOTION (Perseverance / Opportunity Titanium Cleats on Basalt)
# ==============================================================================
def gen_rover_wheel_crunch():
    """Hollow titanium wheel drum resonance & granular Martian regolith crunch."""
    duration = 0.95
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(20210218)
    
    lp_regolith = 0.0
    drum_phase1 = 0.0
    drum_phase2 = 0.0
    cleat_impacts = [0.09, 0.28, 0.51, 0.74]
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        lp_regolith = lp_regolith * 0.83 + white * 0.17
        drum_phase1 += 2.0 * math.pi * 280.0 / SAMPLE_RATE
        drum_phase2 += 2.0 * math.pi * 520.0 / SAMPLE_RATE
        drum_resonance = (math.sin(drum_phase1) * 0.18 + math.sin(drum_phase2) * 0.10) * abs(lp_regolith)
        
        cleat_snap = 0.0
        for strike in cleat_impacts:
            dt = t - strike
            if 0.0 <= dt < 0.05:
                cleat_snap += (
                    math.sin(2.0 * math.pi * 840.0 * dt) * 0.35 +
                    (random.random() * 2.0 - 1.0) * 0.45
                ) * math.exp(-dt * 75.0)
                
        sig = (lp_regolith * 0.55 + drum_resonance * 0.25 + cleat_snap * 0.45)
        
        if t < 0.06:
            env = t / 0.06
        elif t > (duration - 0.10):
            env = (duration - t) / 0.10
        else:
            env = 1.0
            
        samples.append(math.tanh(sig * 1.4) * env * 0.82)
        
    save_wav("rover_wheel_crunch.wav", samples)

# ==============================================================================
# 7. STEPPER MOTOR SERVOS (Robotic Arm, Coring Drill & Mastcam Actuators)
# ==============================================================================
def gen_robotic_arm_servo():
    """Discrete stepper motor micro-steps with PWM harmonics & harmonic gearbox whine."""
    duration = 0.55
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(101)
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        
        speed_curve = math.sin(math.pi * progress) ** 0.85
        fund_freq = 145.0 + 40.0 * speed_curve
        
        f1 = math.sin(2.0 * math.pi * fund_freq * t)
        f3 = 0.38 * math.sin(2.0 * math.pi * (fund_freq * 3.0) * t)
        f5 = 0.18 * math.sin(2.0 * math.pi * (fund_freq * 5.0) * t)
        f7 = 0.08 * math.sin(2.0 * math.pi * (fund_freq * 7.0) * t)
        
        gear_whine = math.sin(2.0 * math.pi * (fund_freq * 10.0) * t) * 0.08 * speed_curve
        
        brake_click = 0.0
        if t < 0.015:
            brake_click = math.sin(2.0 * math.pi * 3200.0 * t) * math.exp(-t * 220.0) * 0.35
        elif t > (duration - 0.018):
            dt = t - (duration - 0.018)
            brake_click = math.sin(2.0 * math.pi * 2800.0 * dt) * math.exp(-dt * 200.0) * 0.30
            
        sig = (f1 + f3 + f5 + f7 + gear_whine) * 0.38 * speed_curve + brake_click
        samples.append(sig * 0.85)
        
    save_wav("robotic_arm_servo.wav", samples)

# ==============================================================================
# 8. DSN TELEMETRY CARRIER & PHASE-LOCKED LOOP PING
# ==============================================================================
def gen_telemetry_ping():
    """NASA Deep Space Network 1850Hz carrier acquisition & BPSK symbol telemetry ping."""
    duration = 0.08
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    
    phase = 0.0
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        freq = 1850.0 + 35.0 * math.exp(-t * 180.0)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        
        carrier = math.sin(phase)
        data_pulse = (random.random() * 2.0 - 1.0) * 0.06 * math.exp(-t * 80.0)
        
        env = math.exp(-t * 42.0)
        sig = (carrier + data_pulse) * env * 0.65
        samples.append(sig)
        
    save_wav("telemetry_ping.wav", samples)

# ==============================================================================
# 9. HARDWARE INSPECTOR EXPLODED VIEW (Titanium Guide Rail Slide & Clink)
# ==============================================================================
def gen_metal_exploded_slide():
    """Precision aerospace linear guide rail slide with ball-detent lock clink."""
    duration = 0.38
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(999)
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        friction = (random.random() * 2.0 - 1.0) * math.exp(-t * 12.0) * 0.35
        
        latch = 0.0
        if 0.08 <= t < 0.16:
            dt = t - 0.08
            latch = math.sin(2.0 * math.pi * 3150.0 * dt) * math.exp(-dt * 90.0) * 0.40
            
        chime = math.sin(2.0 * math.pi * 1420.0 * t) * math.exp(-t * 16.0) * 0.28
        
        sig = (friction + latch + chime) * 0.85
        samples.append(sig)
        
    save_wav("metal_exploded_slide.wav", samples)

# ==============================================================================
# 10. CELESTIAL CAMERA TRANSIT (Gravitational Slingshot Spatial Whoosh)
# ==============================================================================
def gen_celestial_transit():
    """Deep sub-bass gravitational slingshot Doppler sweep with solar wind turbulence."""
    duration = 1.6
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(777)
    
    phase = 0.0
    wind_lp = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        
        freq = 135.0 - 97.0 * (progress ** 0.85)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        
        sub = math.sin(phase) + 0.25 * math.sin(phase * 2.0)
        white = random.random() * 2.0 - 1.0
        wind_lp = wind_lp * 0.93 + white * 0.07
        
        env = math.sin(math.pi * progress) ** 1.35
        sig = (sub * 0.70 + wind_lp * 0.30) * env * 0.85
        samples.append(sig)
        
    save_wav("celestial_transit.wav", samples)

# ==============================================================================
# 11. VOYAGER 1 INTERSTELLAR PLASMA SONIFICATION (Authentic NASA PWS Multi-Mode Chorus)
# ==============================================================================
def synthesize_plasma_track(duration, filename):
    """Authentic NASA / Univ of Iowa PWS plasma sonification with dual whistling chorus & dust clicks."""
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(19770820)
    
    phase1, phase2, phase3, phase_sub, rtg_phase = 0.0, 0.0, 0.0, 0.0, 0.0
    bp_state1, bp_state2 = 0.0, 0.0
    
    dust_events = [
        (1.24, 85.0, 0.18),
        (2.85, 110.0, 0.22),
        (4.35, 95.0, 0.19),
        (5.92, 120.0, 0.25),
        (6.78, 140.0, 0.16)
    ]
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        
        base_freq = 2050.0 + 1050.0 * (progress ** 1.35)
        flutter1 = 28.0 * math.sin(2.0 * math.pi * 3.7 * t) + 12.0 * math.sin(2.0 * math.pi * 1.5 * t)
        flutter2 = 32.0 * math.sin(2.0 * math.pi * 4.3 * t + 1.2) + 14.0 * math.cos(2.0 * math.pi * 2.1 * t)
        flutter3 = 18.0 * math.sin(2.0 * math.pi * 2.8 * t + 2.5)
        
        f1 = base_freq + flutter1
        f2 = (base_freq * 1.14) + flutter2
        f3 = (base_freq * 0.82) + flutter3
        f_sub = 180.0 + 40.0 * math.sin(2.0 * math.pi * 0.4 * t)
        
        phase1 += 2.0 * math.pi * f1 / SAMPLE_RATE
        phase2 += 2.0 * math.pi * f2 / SAMPLE_RATE
        phase3 += 2.0 * math.pi * f3 / SAMPLE_RATE
        phase_sub += 2.0 * math.pi * f_sub / SAMPLE_RATE
        rtg_phase += 2.0 * math.pi * 60.0 / SAMPLE_RATE
        
        if phase1 > math.pi * 20000: phase1 -= math.pi * 20000
        if phase2 > math.pi * 20000: phase2 -= math.pi * 20000
        if phase3 > math.pi * 20000: phase3 -= math.pi * 20000
        if phase_sub > math.pi * 20000: phase_sub -= math.pi * 20000
        if rtg_phase > math.pi * 20000: rtg_phase -= math.pi * 20000
        
        jitter = (random.random() * 2.0 - 1.0) * 0.08
        tone1 = math.sin(phase1 + jitter) + 0.18 * math.sin(2.0 * phase1)
        tone2 = math.sin(phase2 + jitter * 0.8) + 0.12 * math.sin(2.0 * phase2)
        tone3 = math.sin(phase3)
        sub_drone = math.sin(phase_sub) * 0.15
        rtg_hum = (math.sin(rtg_phase) * 0.08 + math.sin(rtg_phase * 2.0) * 0.04)
        
        swell1 = 0.55 + 0.45 * math.sin(math.pi * (progress ** 0.85))
        swell2 = 0.35 + 0.35 * math.sin(2.0 * math.pi * 0.28 * t + 0.4)
        swell3 = 0.25 + 0.25 * math.sin(2.0 * math.pi * 0.42 * t + 1.8)
        
        plasma_voices = (
            tone1 * swell1 * 0.45 +
            tone2 * swell2 * 0.35 +
            tone3 * swell3 * 0.22 +
            sub_drone * 0.15
        )
        
        white = random.random() * 2.0 - 1.0
        bp_state1 = bp_state1 * 0.78 + white * 0.22
        bp_state2 = bp_state2 * 0.82 + (white - bp_state1) * 0.18
        space_hiss = bp_state2 * 0.09
        
        dust_impulse = 0.0
        for ev_time, decay, amp in dust_events:
            dt = t - ev_time
            if 0.0 <= dt < 0.08:
                dust_impulse += math.sin(2.0 * math.pi * 4200.0 * dt) * math.exp(-dt * decay) * amp
                
        raw_composite = (plasma_voices + space_hiss + rtg_hum + dust_impulse)
        
        env = 1.0
        if t < 0.35:
            env = (t / 0.35) ** 1.2
        elif t > (duration - 0.45):
            env = max(0.0, (duration - t) / 0.45) ** 1.2
            
        shaped = math.tanh(raw_composite * 1.35) * env * 0.88
        samples.append(shaped)
        
    save_wav(filename, samples)

def gen_voyager_plasma_whistle():
    synthesize_plasma_track(2.8, "voyager_plasma_whistle.wav")

def gen_voyager1_plasma_8s():
    synthesize_plasma_track(8.0, "voyager1_plasma_8s.wav")

# ==============================================================================
# 12. APOLLO 11 POWERED DESCENT STORY AUDIO (Exact 12.0s Video Duration)
# ==============================================================================
def gen_apollo11_story_12s():
    """
    Exact 12.0s Apollo 11 Lunar Module Descent Video Audio Track:
    - 0.0s: Quindar intro tone (2522 Hz).
    - 0.25s - 5.5s: Steady braking burn.
    - 5.5s - 8.8s: INCREASING THRUSTER SOUND as equipment approaches lunar surface.
    - 8.8s: Touchdown contact thud, footpad regolith crunch, Neil Armstrong "Contact light!" chime, engine shutoff.
    - 9.0s - 11.5s: PRESSURE RELEASE SOUND after landing (hypergolic helium line blowdown purge).
    - 11.6s: Quindar outro tone (2475 Hz).
    """
    duration = 12.0
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(19690720)
    
    brown_acc = 0.0
    band_acc = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        # 1. Quindar Intro Tone (2522 Hz, 0.05s to 0.28s)
        quindar_intro = 0.0
        if 0.05 <= t < 0.28:
            quindar_intro = math.sin(2.0 * math.pi * 2522.0 * (t - 0.05)) * 0.42
            
        # 2. Quindar Outro Tone (2475 Hz, 11.60s to 11.85s)
        quindar_outro = 0.0
        if 11.60 <= t < 11.85:
            quindar_outro = math.sin(2.0 * math.pi * 2475.0 * (t - 11.60)) * 0.42
            
        # 3. Descent Engine Combustion Roar (runs t=0.25s up to touchdown at t=8.8s)
        engine_sig = 0.0
        if 0.25 <= t < 8.95:
            brown_acc = (brown_acc * 0.96) + (white * 0.04)
            
            # Increasing thruster sound: throttle builds from t=5.0s to 8.8s
            if t < 5.0:
                throttle = 0.65
            else:
                # Approach ramp: throttle swells dramatically up to 1.35
                ramp_factor = (t - 5.0) / 3.8
                throttle = 0.65 + 0.70 * (ramp_factor ** 1.4)
                
            flutter_rate = 4.2 + (2.5 if t >= 5.0 else 0.0)
            flutter = 0.8 + 0.2 * math.sin(2.0 * math.pi * flutter_rate * t)
            band_acc = (band_acc * 0.86) + (white * 0.14 * flutter)
            
            raw = ((brown_acc * 4.5 * 0.70) + (band_acc * 0.30)) * throttle
            
            # Ground reflection crackle as exhaust deflects off regolith near touchdown
            if t >= 5.5 and raw > 0.30:
                raw = 0.30 + (raw - 0.30) * 1.8
                
            engine_sig = math.tanh(raw * 1.25)
            
            # Sudden cutoff at contact light (t = 8.8s)
            if t > 8.8:
                engine_sig *= max(0.0, 1.0 - (t - 8.8) / 0.12)
                
        # 4. Touchdown Contact Moment at t = 8.8s ("Contact light! Engine stop!")
        touchdown_impact = 0.0
        if 8.80 <= t < 9.15:
            dt = t - 8.80
            # 4 oleo-strut mechanical contact thud + footpad regolith crunch
            thud = math.sin(2.0 * math.pi * 68.0 * dt) * math.exp(-dt * 20.0) * 0.60
            # Contact probe blue sensor chime (1420 Hz)
            chime = math.sin(2.0 * math.pi * 1420.0 * dt) * math.exp(-dt * 9.0) * 0.45
            touchdown_impact = thud + chime
            
        # 5. PRESSURE RELEASE SOUND AFTER LANDING (t = 9.0s to 11.5s)
        # Hypergolic propellant lines and helium pressurization blowdown purge vent hiss
        pressure_release = 0.0
        if t >= 8.98:
            t_rel = t - 8.98
            pressure_release = synthesize_pressure_release_sample(t_rel, decay_tau=0.75) * 0.85
            
        # Radio background carrier white hiss (subtle throughout)
        radio_carrier = (random.random() * 2.0 - 1.0) * 0.025
        
        env = 1.0
        if t < 0.1:
            env = t / 0.1
        elif t > 11.85:
            env = max(0.0, (12.0 - t) / 0.15)
            
        total = (quindar_intro + quindar_outro + engine_sig * 0.78 + touchdown_impact + pressure_release + radio_carrier) * env * 0.88
        samples.append(total)
        
    save_wav("apollo11_story_12s.wav", samples)

# ==============================================================================
# 13. PERSEVERANCE EDL STORY AUDIO (Exact 10.0s Video Duration)
# ==============================================================================
def gen_perseverance_edl_10s():
    """
    Exact 10.0s Mars 2020 Perseverance EDL Video Audio Track:
    - 0.0s - 4.2s: Sky Crane atmospheric deceleration retro-rockets.
    - 4.2s - 7.8s: INCREASING THRUSTER ROAR as Sky Crane hovers and lowers rover towards surface.
    - 7.8s: Touchdown contact of 6 titanium wheels on Martian basalt & bridle cable cutter snap.
    - 8.0s - 10.0s: PRESSURE RELEASE SOUND after landing + Sky Crane flyaway.
    """
    duration = 10.0
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(20210218)
    
    brown_acc = 0.0
    band_acc = 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        # 1. Sky Crane 8-Rocket Retro-Thrusters (runs up to touchdown at t=7.8s)
        skycrane_sig = 0.0
        if t < 7.95:
            brown_acc = (brown_acc * 0.95) + (white * 0.05)
            
            # Increasing thruster sound before wheels touch the surface
            if t < 4.0:
                throttle = 0.65
            else:
                ramp = (t - 4.0) / 3.8
                throttle = 0.65 + 0.65 * (ramp ** 1.3)
                
            flutter = 0.75 + 0.25 * math.sin(2.0 * math.pi * 5.4 * t)
            band_acc = (band_acc * 0.85) + (white * 0.15 * flutter)
            raw = ((brown_acc * 4.2 * 0.75) + (band_acc * 0.25)) * throttle
            skycrane_sig = math.tanh(raw * 1.35)
            
            if t > 7.8:
                skycrane_sig *= max(0.0, 1.0 - (t - 7.8) / 0.12)
                
        # 2. Bridle Tether Deployment Winch Servo (t=3.2 to 7.8s)
        tether_whir = 0.0
        if 3.2 <= t < 7.8:
            tether_whir = (
                math.sin(2.0 * math.pi * 240.0 * t) * 0.18 +
                math.sin(2.0 * math.pi * 720.0 * t) * 0.08
            )
            
        # 3. Touchdown Contact Moment at t = 7.8s (Wheels hit Martian basalt + Cable Cutters)
        touchdown_impact = 0.0
        if 7.80 <= t < 8.25:
            dt = t - 7.80
            # 6 titanium wheels impact basalt rock
            wheel_thud = math.sin(2.0 * math.pi * 92.0 * dt) * math.exp(-dt * 25.0) * 0.55
            # Pyrotechnic cable cutter snap
            pyro_snap = (random.random() * 2.0 - 1.0) * math.exp(-dt * 65.0) * 0.45
            # NASA Telemetry chime ("Touchdown confirmed!")
            chime = (
                math.sin(2.0 * math.pi * 920.0 * dt) * 0.30 +
                math.sin(2.0 * math.pi * 1380.0 * dt) * 0.22
            ) * math.exp(-dt * 6.0)
            touchdown_impact = wheel_thud + pyro_snap + chime
            
        # 4. PRESSURE RELEASE SOUND AFTER LANDING (t=7.95s to 10.0s)
        pressure_release = 0.0
        if t >= 7.95:
            t_rel = t - 7.95
            pressure_release = synthesize_pressure_release_sample(t_rel, decay_tau=0.65) * 0.80
            
        # 5. Sky Crane Flyaway burn in distant Mars atmosphere (t=8.2s to 10.0s)
        flyaway = 0.0
        if t >= 8.2:
            dt = t - 8.2
            flyaway = (random.random() * 2.0 - 1.0) * math.exp(-dt * 1.5) * 0.20
            
        env = 1.0
        if t < 0.2:
            env = t / 0.2
        elif t > 9.7:
            env = max(0.0, (10.0 - t) / 0.3)
            
        total = (skycrane_sig * 0.76 + tether_whir + touchdown_impact + pressure_release + flyaway) * env * 0.88
        samples.append(total)
        
    save_wav("perseverance_edl_10s.wav", samples)

# ==============================================================================
# 14. GENERIC MISSION STORY AUDIO (Exact 12.0s Duration)
# ==============================================================================
def gen_generic_mission_story_12s():
    """
    Exact 12.0s Mission Story Track for all other spacecraft:
    - 0.0s - 5.0s: Trajectory glide.
    - 5.0s - 8.8s: Increasing thruster sound as ground approaches.
    - 8.8s: Touchdown contact thud & chime.
    - 8.95s - 11.5s: Post-landing pressure release gas purge.
    """
    duration = 12.0
    n_samples = int(SAMPLE_RATE * duration)
    samples = []
    random.seed(42)
    
    brown_acc = 0.0
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        white = random.random() * 2.0 - 1.0
        
        # 1. Trajectory glide and increasing thruster sound
        thruster_sig = 0.0
        if t < 8.95:
            brown_acc = (brown_acc * 0.95) + (white * 0.05)
            if t < 5.0:
                throttle = 0.60
            else:
                ramp = (t - 5.0) / 3.8
                throttle = 0.60 + 0.65 * (ramp ** 1.3)
                
            freq = 75.0 + 35.0 * math.sin(2.0 * math.pi * 0.15 * t)
            drone = math.sin(2.0 * math.pi * freq * t) * 0.30
            rumble = math.tanh(brown_acc * 3.8) * 0.45 * throttle
            thruster_sig = (drone + rumble)
            if t > 8.8:
                thruster_sig *= max(0.0, 1.0 - (t - 8.8) / 0.12)
                
        # 2. Touchdown contact at t = 8.8s
        touchdown_impact = 0.0
        if 8.80 <= t < 9.15:
            dt = t - 8.80
            thud = math.sin(2.0 * math.pi * 72.0 * dt) * math.exp(-dt * 22.0) * 0.55
            chime = math.sin(2.0 * math.pi * 1750.0 * dt) * math.exp(-dt * 6.0) * 0.40
            touchdown_impact = thud + chime
            
        # 3. Post-landing pressure release
        pressure_release = 0.0
        if t >= 8.95:
            t_rel = t - 8.95
            pressure_release = synthesize_pressure_release_sample(t_rel, decay_tau=0.72) * 0.80
            
        env = 1.0
        if t < 0.3:
            env = t / 0.3
        elif t > 11.5:
            env = max(0.0, (12.0 - t) / 0.5)
            
        total = (thruster_sig + touchdown_impact + pressure_release) * env * 0.85
        samples.append(total)
        
    save_wav("generic_mission_story_12s.wav", samples)

# ==============================================================================
# 8. ROCKET TRAVELING IN DEEP SPACE (12.0s Story Intro Soundscape)
# ==============================================================================
def gen_rocket_space_travel_12s():
    """
    12.0s audio of a rocket traveling through the deep space void:
    - Low-frequency structural hull resonance (vacuum internal vibration: 42Hz, 84Hz, 126Hz)
    - Pink noise vacuum exhaust body with Brownian low-pass filtering
    - Ion drive / turbopump continuous electrical whine (240Hz / 480Hz)
    - Deep Space Network 2,295 MHz carrier telemetry lock & phase tone
    - Periodic fine-pointing RCS cold-gas attitude thruster micro-bursts (t=3.4s and t=7.8s)
    - Smooth cinematic 12.0s arc with 1.0s fade in and 1.2s tail decay
    """
    samples = []
    duration = 12.0
    total_samples = int(SAMPLE_RATE * duration)
    b0, b1, b2, b3, b4, b5, b6 = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        # Constant steady envelope across all 12s (NO fade-in, NO fade-out)
        # Only a 2ms anti-pop micro-ramp to eliminate digital boundary clicks
        if i < 88:
            env = i / 88.0
        elif i > total_samples - 88:
            env = (total_samples - i) / 88.0
        else:
            env = 1.0

        # 1. Low-frequency hull vibration rumble (vacuum structural conduction)
        rumble = (
            math.sin(2.0 * math.pi * 42.0 * t) * 0.30 +
            math.sin(2.0 * math.pi * 42.6 * t) * 0.18 + # beating
            math.sin(2.0 * math.pi * 84.0 * t) * 0.14 +
            math.sin(2.0 * math.pi * 126.0 * t) * 0.08
        )

        # Filtered Brownian/Pink noise for rocket thruster exhaust body
        white = random.random() * 2.0 - 1.0
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06
        b6 = white * 0.115926

        # 2. Electric / Ion propulsion & turbopump drive whine (240 Hz & 480 Hz)
        turbopump_freq = 240.0 + 3.0 * math.sin(2.0 * math.pi * 0.3 * t)
        turbopump = (
            math.sin(2.0 * math.pi * turbopump_freq * t) * 0.08 +
            math.sin(2.0 * math.pi * turbopump_freq * 2.0 * t) * 0.04
        )

        # 3. Telemetry carrier tone (Deep Space Network carrier ping ~ 2,295 Hz)
        carrier_fm = 2295.0 + 6.0 * math.sin(2.0 * math.pi * 1.5 * t)
        carrier = math.sin(2.0 * math.pi * carrier_fm * t) * 0.018

        # 4. Periodic RCS Attitude Control Cold-Gas Thruster Bursts
        rcs_thrust = 0.0
        for burst_t in [3.4, 7.8]:
            dt = t - burst_t
            if 0.0 <= dt < 0.65:
                valve = math.sin(2.0 * math.pi * 3200.0 * dt) * math.exp(-dt * 60.0) * 0.15 if dt < 0.03 else 0.0
                hiss = (random.random() * 2.0 - 1.0) * math.sin(math.pi * (dt / 0.65)) * 0.20
                rcs_thrust += (valve + hiss)

        # Sum all acoustic components
        signal = (rumble * 0.55 + pink * 0.65 + turbopump * 0.5 + carrier + rcs_thrust) * env
        samples.append(signal)

    # Normalize to -9.0 dB soft ambient peak (0.35)
    max_peak = max(abs(s) for s in samples) or 1.0
    scale = 0.35 / max_peak
    scaled_samples = [s * scale for s in samples]

    save_wav("rocket_space_travel_12s.wav", scaled_samples)

if __name__ == "__main__":
    print("Generating authentic scientific space audio assets...")
    gen_rocket_space_travel_12s()
    gen_landing_increasing_thruster()
    print("Space audio generated successfully!")
