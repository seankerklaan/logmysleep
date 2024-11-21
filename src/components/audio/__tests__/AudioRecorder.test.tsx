import { render, fireEvent, waitFor } from '@testing-library/react';
import AudioRecorder from '../AudioRecorder';

// Mock MediaRecorder and getUserMedia
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: jest.fn(),
};

const mockMediaStream = {};

beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks();
  
  // Mock navigator.mediaDevices.getUserMedia
  global.navigator.mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(mockMediaStream),
  };
  
  // Mock MediaRecorder
  global.MediaRecorder = jest.fn().mockImplementation(() => mockMediaRecorder);
  
  // Mock AudioContext
  global.AudioContext = jest.fn().mockImplementation(() => ({
    createAnalyser: () => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: jest.fn(),
    }),
    createMediaStreamSource: () => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
    }),
  }));
});

describe('AudioRecorder', () => {
  it('requests microphone permissions on mount', async () => {
    render(<AudioRecorder />);
    
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    });
  });

  it('starts recording when clicking the record button', async () => {
    const { getByRole } = render(<AudioRecorder />);
    
    // Wait for permissions to be granted
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
    
    // Click record button
    const recordButton = getByRole('button', { name: /start recording/i });
    fireEvent.click(recordButton);
    
    expect(mockMediaRecorder.start).toHaveBeenCalled();
  });

  it('stops recording when clicking stop', async () => {
    const { getByRole } = render(<AudioRecorder />);
    
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
    
    // Start recording
    const recordButton = getByRole('button', { name: /start recording/i });
    fireEvent.click(recordButton);
    
    // Stop recording
    const stopButton = getByRole('button', { name: /stop recording/i });
    fireEvent.click(stopButton);
    
    expect(mockMediaRecorder.stop).toHaveBeenCalled();
  });

  it('updates dB threshold when sliding the range input', async () => {
    const { getByRole } = render(<AudioRecorder />);
    
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
    
    const thresholdSlider = getByRole('slider');
    fireEvent.change(thresholdSlider, { target: { value: '70' } });
    
    expect(thresholdSlider.value).toBe('70');
  });
});