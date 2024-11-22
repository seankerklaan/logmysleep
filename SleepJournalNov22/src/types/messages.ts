export interface DailyMessage {
  day: number;
  message: string;
  emoji: string;
}

export interface UserProgress {
  userId: string;
  currentDay: number;
  lastMessageSent: string;
  isPaused: boolean;
  isUnsubscribed: boolean;
  startDate: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: number;
  category: 'Sleep Tips' | 'Science' | 'Wellness' | 'Success Stories';
  imageUrl: string;
}