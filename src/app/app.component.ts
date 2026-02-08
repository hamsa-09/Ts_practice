import { Component, computed, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MemeListComponent } from './components/meme-list/meme-list.component';
import { MemeModalComponent } from './components/meme-modal/meme-modal.component';
import { Meme, UserPrefs, DraftContent } from './models/meme.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MemeListComponent],
  template: `
    <app-navbar
      (search)="updateSearch($event)"
      (filterTeam)="updateTeam($event)"
      (filterMood)="updateMood($event)"
      (toggleLikedFilter)="toggleLiked($event)"
      (toggleSavedFilter)="toggleSaved($event)"
      (sortChange)="updateSort($event)"
      (create)="openCreateModal()">
    </app-navbar>

    <main class="main-content">
      <app-meme-list
        [memes]="filteredMemes()"
        [userPrefs]="userPrefs()"
        (like)="onLike($event)"
        (bookmark)="onBookmark($event)"
        (edit)="onEdit($event)"
        (deleteAction)="onDelete($event)"
        (flag)="onFlag($event)">
      </app-meme-list>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #121212;
      color: #e0e0e0;
    }
  `]
})
export class AppComponent {
  private readonly MEMES_KEY = 'MEMES_DATA';
  private readonly USER_KEY = 'USER_PREFS';
  dialog = inject(MatDialog);

  // --- State (Moved from Service) ---
  memes = signal<Meme[]>([]);
  userPrefs = signal<UserPrefs>({
    username: 'CodeNinja',
    likedMemeIds: [],
    bookmarkedMemeIds: [],
    flaggedMemeIds: [],
    drafts: {}
  });

  // --- Filtering & Sorting State ---
  searchTerm = signal('');
  teamFilter = signal('');
  moodFilter = signal('');
  showLikedOnly = signal(false);
  showSavedOnly = signal(false);
  sortOrder = signal('newest');

  constructor() {
    this.loadFromStorage();

    // Auto-save logic (runs whenever state changes)
    effect(() => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.userPrefs()));
        localStorage.setItem(this.MEMES_KEY, JSON.stringify(this.memes()));
    });
  }

  // --- LocalStorage Helpers ---
  private loadFromStorage() {
    const storedMemes = localStorage.getItem(this.MEMES_KEY);
    if (storedMemes) {
      try {
        const parsed = JSON.parse(storedMemes);
        // Basic migration to ensure new fields exist
        this.memes.set(parsed.map((m: any) => ({
          ...m,
          bookmarks: m.bookmarks || 0,
          flags: m.flags || 0
        })));
      } catch (e) { this.memes.set([]); }
    } else {
      this.memes.set([{
        id: '1', title: 'Welcome to Meme Forum', author: 'Admin', team: 'Engineering',
        mood: 'Happy', content: 'Happy coding! ||reveal me||', tags: ['welcome'],
        timestamp: Date.now(), likes: 0, bookmarks: 0, flags: 0
      }]);
    }

    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        this.userPrefs.set({
          ...parsed,
          likedMemeIds: parsed.likedMemeIds || [],
          bookmarkedMemeIds: parsed.bookmarkedMemeIds || [],
          flaggedMemeIds: parsed.flaggedMemeIds || [],
          drafts: parsed.drafts || {}
        });
      } catch (e) { /* use default */ }
    }
  }

  // --- Computed (Filter Logic) ---
  filteredMemes = computed(() => {
    let list = this.memes();
    const term = this.searchTerm().toLowerCase();
    const team = this.teamFilter();
    const mood = this.moodFilter();
    const likedOnly = this.showLikedOnly();
    const savedOnly = this.showSavedOnly();
    const prefs = this.userPrefs();

    if (term) {
      list = list.filter(m => (m.title?.toLowerCase().includes(term) || m.content.toLowerCase().includes(term)));
    }
    if (team) list = list.filter(m => m.team === team);
    if (mood) list = list.filter(m => m.mood === mood);
    if (likedOnly) list = list.filter(m => prefs.likedMemeIds.includes(m.id));
    if (savedOnly) list = list.filter(m => prefs.bookmarkedMemeIds.includes(m.id));

    return [...list].sort((a, b) => this.sortOrder() === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
  });

  // --- Actions (Called from child components) ---
  updateSearch(term: string) { this.searchTerm.set(term); }
  updateTeam(team: string) { this.teamFilter.set(team); }
  updateMood(mood: string) { this.moodFilter.set(mood); }
  toggleLiked(enabled: boolean) { this.showLikedOnly.set(enabled); }
  toggleSaved(enabled: boolean) { this.showSavedOnly.set(enabled); }
  updateSort(order: string) { this.sortOrder.set(order); }

  onLike(id: string) {
    const prefs = this.userPrefs();
    const isLiked = prefs.likedMemeIds.includes(id);
    this.userPrefs.update(p => ({
      ...p,
      likedMemeIds: isLiked ? p.likedMemeIds.filter(mid => mid !== id) : [...p.likedMemeIds, id]
    }));
    this.memes.update(ms => ms.map(m => m.id === id ? { ...m, likes: m.likes + (isLiked ? -1 : 1) } : m));
  }

  onBookmark(id: string) {
    const prefs = this.userPrefs();
    const isBookmarked = prefs.bookmarkedMemeIds.includes(id);
    this.userPrefs.update(p => ({
      ...p,
      bookmarkedMemeIds: isBookmarked ? p.bookmarkedMemeIds.filter(mid => mid !== id) : [...p.bookmarkedMemeIds, id]
    }));
    this.memes.update(ms => ms.map(m => m.id === id ? { ...m, bookmarks: m.bookmarks + (isBookmarked ? -1 : 1) } : m));
  }

  onFlag(id: string) {
    if (!this.userPrefs().flaggedMemeIds.includes(id) && confirm('Report this post?')) {
      this.userPrefs.update(p => ({ ...p, flaggedMemeIds: [...p.flaggedMemeIds, id] }));
      this.memes.update(ms => ms.map(m => m.id === id ? { ...m, flags: m.flags + 1 } : m));
    }
  }

  onDelete(id: string) {
    if (confirm('Delete this post?')) this.memes.update(ms => ms.filter(m => m.id !== id));
  }

  onEdit(meme: Meme) {
    const dialogRef = this.dialog.open(MemeModalComponent, { width: '600px', data: { meme } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.memes.update(ms => ms.map(m => m.id === meme.id ? { ...m, ...result, updatedAt: Date.now() } : m));
    });
  }

  openCreateModal() {
    const draft = this.userPrefs().drafts['new_meme'];
    const dialogRef = this.dialog.open(MemeModalComponent, { width: '600px', data: { draft } });

    // Save draft when modal writes to it (handled via output or listener)
    const sub = dialogRef.componentInstance.draftSaved.subscribe((d: DraftContent) => {
      this.userPrefs.update(p => ({ ...p, drafts: { ...p.drafts, 'new_meme': d } }));
    });

    dialogRef.afterClosed().subscribe(result => {
      sub.unsubscribe();
      if (result) {
        const newMeme: Meme = { ...result, id: crypto.randomUUID(), timestamp: Date.now(), likes: 0, bookmarks: 0, flags: 0 };
        this.memes.update(ms => [newMeme, ...ms]);
        this.userPrefs.update(p => {
          const { new_meme, ...rest } = p.drafts;
          return { ...p, drafts: rest };
        });
      }
    });
  }
}
