import { useState, useEffect } from 'react';

export const useStreakCounter = () => {
  const [streak, setStreak] = useState(7);
  const [lastEntry, setLastEntry] = useState(new Date());

  // In a real app, this would fetch from an API/database
  useEffect(() => {
    // Simulated data
    setStreak(7);
    setLastEntry(new Date());
  }, []);

  return { streak, lastEntry };
};