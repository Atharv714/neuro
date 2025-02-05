import cv2
import numpy as np
from scipy.signal import find_peaks
from scipy.fft import fft, ifft
import matplotlib.pyplot as plt
from collections import deque
import time

# Eulerian Video Magnification Function for real-time
def temporal_ideal_filter(tensor, low, high, fps):
    fft_result = fft(tensor, axis=0)
    frequencies = np.fft.fftfreq(tensor.shape[0], d=1.0 / fps)
    mask = (frequencies > low) & (frequencies < high)
    fft_result[~mask] = 0
    return np.abs(ifft(fft_result, axis=0))

def magnify_motion_realtime(frames, alpha=50, freq_min=0.1, freq_max=0.5, fps=30, pyramid_levels=3):
    frame_tensor = np.stack(frames).astype(np.float32) / 255.0

    if len(frame_tensor.shape) != 4 or frame_tensor.shape[-1] != 3:
        raise ValueError(f"Invalid frame shape: {frame_tensor.shape}. Expected (frames, height, width, 3).")

    laplacian_pyramid = [frame_tensor]

    for level in range(1, pyramid_levels + 1):
        if frame_tensor.shape[1] < 2 or frame_tensor.shape[2] < 2:
            raise ValueError(f"Frame too small for pyramid level {level}. Current shape: {frame_tensor.shape}")
        
        frame_tensor = np.array([cv2.pyrDown(frame) for frame in frame_tensor])
        laplacian_pyramid.append(frame_tensor)

    filtered = temporal_ideal_filter(laplacian_pyramid[0], freq_min, freq_max, fps)
    amplified = alpha * filtered
    return (amplified + laplacian_pyramid[0]) * 255


# Real-Time Breath Rate Detection
def real_time_breath_detection(alpha=50, freq_min=0.1, freq_max=0.5, fps=30):
    cap = cv2.VideoCapture(0)  # Open webcam
    frame_buffer = deque(maxlen=100)  # Buffer for 100 frames (~3s of data at 30 FPS)

    while True:
        ret, frame = cap.read()
        if not ret or frame.size == 0:
            continue

        frame = cv2.resize(frame, (320, 240))
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_buffer.append(frame_rgb)

        if len(frame_buffer) >= frame_buffer.maxlen:
            try:
                amplified_frames = magnify_motion_realtime(
                    list(frame_buffer), alpha=alpha, freq_min=freq_min, freq_max=freq_max, fps=fps
                )
                avg_signal = np.mean(amplified_frames[:, :, :, 1], axis=(1, 2))

                peaks, _ = find_peaks(avg_signal, distance=fps * 2)
                breath_rate = len(peaks) * 60 / (len(avg_signal) / fps)

                cv2.putText(frame, f'Breath Rate: {breath_rate:.2f} BPM', (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                cv2.imshow('Real-Time Breathing Detection', frame)

            except ValueError as e:
                print(f"Error in pyramid processing: {e}")
                break  # Optionally, stop if pyramid errors

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


# Start real-time breath detection
real_time_breath_detection()


# scrimba