import { SleepState } from '../diary/types';

export const processAudioChunk = async (blob: Blob): Promise<number> => {
  try {
    // Create a new audio context for each processing
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    
    // Wrap decodeAudioData in a try-catch block
    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      let sum = 0;
      let peak = 0;
      
      // Calculate RMS (Root Mean Square) and peak values
      for (let i = 0; i < channelData.length; i++) {
        const amplitude = Math.abs(channelData[i]);
        sum += amplitude * amplitude;
        peak = Math.max(peak, amplitude);
      }
      
      const rms = Math.sqrt(sum / channelData.length);
      
      // Use both RMS and peak values for more accurate dB calculation
      const db = 20 * Math.log10(Math.max(rms, peak / 2) / 0.00002);
      
      // Cleanup
      await audioContext.close();
      
      return Math.round(Math.max(0, Math.min(db, 120))); // Clamp between 0 and 120 dB
    } catch (decodeError) {
      console.warn('Failed to decode audio data:', decodeError);
      return 0;
    }
  } catch (error) {
    console.error('Error processing audio chunk:', error);
    return 0;
  }
};

export const calculateSleepStats = (sleepStates: SleepState) => {
  const days = Object.keys(sleepStates).reduce((acc: { [key: string]: number[] }, key) => {
    const [day, hour] = key.split('-');
    if (!acc[day]) acc[day] = [];
    if (sleepStates[key].isAsleep) {
      acc[day].push(parseInt(hour));
    }
    return acc;
  }, {});

  const stats = Object.entries(days).map(([day, hours]) => {
    const sortedHours = hours.sort((a, b) => a - b);
    const sleepDuration = sortedHours.length;
    return { day, duration: sleepDuration };
  });

  const averageSleep = stats.reduce((sum, stat) => sum + stat.duration, 0) / (stats.length || 1);
  const consistency = calculateConsistency(stats.map(s => s.duration));

  return {
    dailyStats: stats,
    averageSleep,
    consistency,
    quality: calculateQuality(sleepStates)
  };
};

const calculateConsistency = (durations: number[]) => {
  if (durations.length === 0) return 100;
  
  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance = durations.reduce((sum, duration) => {
    return sum + Math.pow(duration - average, 2);
  }, 0) / durations.length;
  
  return Math.max(0, 100 - (Math.sqrt(variance) * 10));
};

const calculateQuality = (sleepStates: SleepState) => {
  let quality = 85;
  let factors = 0;
  
  Object.values(sleepStates).forEach(state => {
    if (state.activity === 'alcohol') {
      quality -= 2;
      factors++;
    }
    if (state.activity === 'coffee' && state.isAsleep) {
      quality -= 3;
      factors++;
    }
  });
  
  // Normalize quality based on number of factors
  if (factors > 0) {
    quality = quality - (factors * 2);
  }
  
  return Math.max(0, Math.min(100, quality));
};