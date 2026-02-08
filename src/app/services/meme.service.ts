
import { Injectable, signal, computed, effect } from '@angular/core';
import { Meme, UserPrefs, DraftContent } from '../models/meme.model';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private readonly MEMES_KEY = 'MEMES_DATA';
  private readonly USER_KEY = 'USER_PREFS';

  memes = signal<Meme[]>([]);
  userPrefs = signal<UserPrefs>({
    username: 'CodeNinja',
    likedMemeIds: [],
    bookmarkedMemeIds: [],
    flaggedMemeIds: [],
    drafts: {}
  });

  constructor() {
    this.loadFromStorage();
    // Auto-save effect
    effect(() => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.userPrefs()));
        localStorage.setItem(this.MEMES_KEY, JSON.stringify(this.memes()));
    });
  }

  private loadFromStorage() {
    const storedMemes = localStorage.getItem(this.MEMES_KEY);
    if (storedMemes) {
      this.memes.set(JSON.parse(storedMemes));
    } else {
        // Seed initial data if empty
        this.memes.set([
            {
                id: '1',
                title: 'When the code works',
                author: 'DevOne',
                team: 'Engineering',
                mood: 'Confused',
                content: 'When the code works... ||but I do not know why||',
                tags: ['coding', 'magic'],
                timestamp: Date.now(),
                likes: 5,
                bookmarks: 0,
                flags: 0
            }
        ]);
    }

    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.userPrefs.set(JSON.parse(storedUser));
    }
  }

  // --- Meme Actions ---
  addMeme(meme: Omit<Meme, 'id' | 'timestamp' | 'likes' | 'bookmarks' | 'flags'>) {
    const newMeme: Meme = {
      ...meme,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      likes: 0,
      bookmarks: 0,
      flags: 0,
      updatedAt: Date.now()
    };
    this.memes.update(current => [newMeme, ...current]);
  }

  updateMeme(id: string, updates: Partial<Meme>) {
    this.memes.update(current =>
      current.map(m => m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m)
    );
  }

  deleteMeme(id: string) {
    this.memes.update(current => current.filter(m => m.id !== id));
  }

  // --- User Actions ---
  toggleLike(memeId: string) {
    const prefs = this.userPrefs();
    const isLiked = prefs.likedMemeIds.includes(memeId);

    if (isLiked) {
        // Unlike
        this.userPrefs.update(p => ({
            ...p,
            likedMemeIds: p.likedMemeIds.filter(id => id !== memeId)
        }));
        this.memes.update(ms => ms.map(m => m.id === memeId ? { ...m, likes: m.likes - 1 } : m));
    } else {
        // Like
        this.userPrefs.update(p => ({
            ...p,
            likedMemeIds: [...p.likedMemeIds, memeId]
        }));
        this.memes.update(ms => ms.map(m => m.id === memeId ? { ...m, likes: m.likes + 1 } : m));
    }
  }

  // --- Drafts ---
  saveDraft(content: DraftContent) {
      this.userPrefs.update(p => ({
          ...p,
          drafts: { ...p.drafts, 'new_meme': content }
      }));
  }

  getDraft(): DraftContent | null {
      return this.userPrefs().drafts['new_meme'] || null;
  }

  clearDraft() {
      this.userPrefs.update(p => {
          const { new_meme, ...rest } = p.drafts;
          return { ...p, drafts: rest };
      });
  }

  // --- Bookmark Actions ---
  toggleBookmark(memeId: string) {
    const prefs = this.userPrefs();
    const isBookmarked = prefs.bookmarkedMemeIds.includes(memeId);

    if (isBookmarked) {
      this.userPrefs.update(p => ({
        ...p,
        bookmarkedMemeIds: p.bookmarkedMemeIds.filter(id => id !== memeId)
      }));
      this.memes.update(ms => ms.map(m => m.id === memeId ? { ...m, bookmarks: m.bookmarks - 1 } : m));
    } else {
      this.userPrefs.update(p => ({
        ...p,
        bookmarkedMemeIds: [...p.bookmarkedMemeIds, memeId]
      }));
      this.memes.update(ms => ms.map(m => m.id === memeId ? { ...m, bookmarks: m.bookmarks + 1 } : m));
    }
  }

  // --- Flag Actions ---
  toggleFlag(memeId: string) {
    const prefs = this.userPrefs();
    const isFlagged = prefs.flaggedMemeIds.includes(memeId);

    if (!isFlagged) {
      this.userPrefs.update(p => ({
        ...p,
        flaggedMemeIds: [...p.flaggedMemeIds, memeId]
      }));
      this.memes.update(ms => ms.map(m => m.id === memeId ? { ...m, flags: m.flags + 1 } : m));
    }
  }
}
