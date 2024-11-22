import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { dailyMessages } from '../data/dailyMessages';
import type { UserProgress } from '../types/messages';

interface MessageContextType {
  userProgress: UserProgress | null;
  pauseMessages: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  resumeMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (user) {
      // In a real app, fetch from API
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        const newProgress: UserProgress = {
          userId: user.id,
          currentDay: 1,
          lastMessageSent: new Date().toISOString(),
          isPaused: false,
          isUnsubscribed: false,
          startDate: new Date().toISOString()
        };
        setUserProgress(newProgress);
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
      }
    }
  }, [user]);

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user || !userProgress) return;

    const updatedProgress = {
      ...userProgress,
      ...updates
    };

    // In a real app, send to API
    setUserProgress(updatedProgress);
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(updatedProgress));
  };

  const pauseMessages = async () => {
    await updateProgress({ isPaused: true });
  };

  const unsubscribe = async () => {
    await updateProgress({ isUnsubscribed: true });
  };

  const resumeMessages = async () => {
    await updateProgress({ isPaused: false, isUnsubscribed: false });
  };

  return (
    <MessageContext.Provider 
      value={{ 
        userProgress, 
        pauseMessages, 
        unsubscribe, 
        resumeMessages 
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};