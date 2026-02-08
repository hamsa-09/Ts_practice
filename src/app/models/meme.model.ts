export interface Meme {
  id: string;
  title?: string; // Optional title
  author: string;
  team: string;
  mood: string;
  content: string; // Body text with potential spoilers
  tags: string[];
  timestamp: number;
  updatedAt?: number;
  likes: number;
  bookmarks: number;
  flags: number;
}

export interface UserPrefs {
  username: string;
  likedMemeIds: string[];
  bookmarkedMemeIds: string[];
  flaggedMemeIds: string[];
  drafts: Record<string, DraftContent>;
}

export interface DraftContent {
  title?: string;
  content: string;
  team: string;
  mood: string;
  tags: string[];
  timestamp: number;
}

export const TEAMS = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'HR', 'Support'];
export const MOODS = ['Happy', 'Sad', 'Excited', 'Bored', 'Angry', 'Confused', 'Sarcastic', 'Relieved'];
