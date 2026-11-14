# AFTERLIGHT — Controlled FFmpeg / FFprobe Media Pipeline Report

## 1. Architecture & Security Controls

The Phase 06 Media Intelligence Pipeline (`/api/media/process` in `server.ts` and `buildSafeFfmpegArgs` in `src/utils/scientificEngine.ts`) provides non-interactive media inspection and archival derivative generation without shell injection vectors.

### Key Engineering Safeguards
1. **Zero Shell Interpolation**: Subprocesses are invoked via Node's `execFile(binary, args, { shell: false, timeout: 8000 })`.
2. **Path Sanitization**: Input filenames are validated against `/^[a-zA-Z0-9._/-]+$/` and checked to reject directory traversal (`..`).
3. **Separation of Concerns**: FFmpeg and FFprobe are used strictly for media stream inspection, contact sheet generation, thumbnail extraction, and audio/video normalization—never as pre-rendered substitutes for the interactive Three.js planetary engine.

## 2. Supported Pipeline Operations

| Operation | Binary | Argument Array Template | Purpose |
| :--- | :--- | :--- | :--- |
| `ffprobe_inspect` | `ffprobe` | `['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', inputPath]` | Extracts container format, codec, pixel format, resolution, and frame rate metadata. |
| `extract_thumbnail` | `ffmpeg` | `['-y', '-ss', '00:00:02.000', '-i', inputPath, '-frames:v', '1', '-vf', 'scale=640:-1', outputPath]` | Generates a 640px archival keyframe thumbnail. |
| `generate_contact_sheet` | `ffmpeg` | `['-y', '-i', inputPath, '-vf', 'fps=1/5,scale=320:-1,tile=4x3', '-frames:v', '1', outputPath]` | Produces a 4×3 chronological forensic contact sheet for EVA/rover traverse video logs. |
| `transcode_h264` | `ffmpeg` | `['-y', '-i', inputPath, '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputPath]` | Normalizes historical mission footage into web-streamable H.264 MP4 (`yuv420p`). |
| `normalize_audio` | `ffmpeg` | `['-y', '-i', inputPath, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', outputPath]` | Applies EBU R128 loudness normalization (`-16 LUFS`) to archival mission audio transcripts. |
