"""Generate the project's original, gentle synthesized piano loop (standard library only)."""
import math
import struct
import wave
from pathlib import Path

RATE = 22050
DURATION = 32
samples = [0.0] * (RATE * DURATION)


def note(midi, start, velocity=0.2, duration=3.8):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    offset = round(start * RATE)
    for i in range(round(duration * RATE)):
        t = i / RATE
        attack = 1 - math.exp(-t * 110)
        release = min(1, (duration - t) / 0.2)
        envelope = attack * math.exp(-t * 1.55) * release
        tone = (math.sin(2 * math.pi * frequency * t)
                + 0.28 * math.sin(2 * math.pi * frequency * 2 * t) * math.exp(-t * 1.2)
                + 0.09 * math.sin(2 * math.pi * frequency * 3 * t) * math.exp(-t * 2)
                + 0.025 * math.sin(2 * math.pi * frequency * 4 * t) * math.exp(-t * 3))
        samples[(offset + i) % len(samples)] += tone * envelope * velocity


# Eight bars at 60 BPM. Original D-major arpeggio and melody; no sampled recording.
chords = [(50, 57, 62, 66), (47, 54, 59, 62), (43, 50, 55, 59), (45, 52, 57, 61)] * 2
melody = [(74, 73, 69), (71, 69, 66), (67, 71, 74), (73, 71, 69),
          (78, 76, 74), (73, 71, 69), (71, 69, 67), (69, 73, 74)]
for bar, chord in enumerate(chords):
    start = bar * 4
    note(chord[0] - 12, start, 0.12, 4.5)
    for beat, index in enumerate([1, 2, 3, 2, 1, 2, 3, 2]):
        note(chord[index], start + beat * 0.5, 0.105 if beat % 2 else 0.13)
    for pitch, beat in zip(melody[bar], [0.05, 1.55, 2.55]):
        note(pitch, start + beat, 0.14, 4.5)

dry = samples[:]
for delay, gain in [(0.131, 0.13), (0.277, 0.08), (0.443, 0.045)]:
    shift = round(delay * RATE)
    for i in range(len(samples)):
        samples[i] += dry[(i - shift) % len(samples)] * gain

peak = max(abs(value) for value in samples)
pcm = bytearray()
for i, value in enumerate(samples):
    left = value * 0.68 / peak
    right = (value * 0.93 + samples[(i - 157) % len(samples)] * 0.07) * 0.68 / peak
    pcm.extend(struct.pack('<hh', round(left * 32767), round(right * 32767)))

target = Path(__file__).resolve().parents[1] / 'public' / 'audio' / 'wedding-piano.wav'
target.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(target), 'wb') as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(pcm)
print(f'Created {target.name}: {DURATION}s, stereo, {RATE} Hz')
