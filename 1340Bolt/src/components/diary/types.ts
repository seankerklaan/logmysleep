export interface SleepState {
  [key: string]: {
    isAsleep: boolean;
    activity?: 'coffee' | 'alcohol' | 'exercise';
    position?: 'supine' | 'leftLateral' | 'rightLateral' | 'prone' | 'sitting';
  };
}

export interface SleepStats {
  dailyStats: Array<{ day: string; duration: number }>;
  averageSleep: number;
  consistency: number;
  quality: number;
}