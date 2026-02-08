import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MemeService } from './services/meme.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MemeListComponent } from './components/meme-list/meme-list.component';
import { MemeModalComponent } from './components/meme-modal/meme-modal.component';
import { Meme } from './models/meme.model';

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
        [userPrefs]="memeService.userPrefs()"
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
  memeService = inject(MemeService);
  dialog = inject(MatDialog);

  // Filter state
  searchTerm = signal('');
  teamFilter = signal('');
  moodFilter = signal('');
  showLikedOnly = signal(false);
  showSavedOnly = signal(false);
  sortOrder = signal('newest');

  // Computed
  filteredMemes = computed(() => {
    let memes = this.memeService.memes();
    const term = this.searchTerm().toLowerCase();
    const team = this.teamFilter();
    const mood = this.moodFilter();
    const likedOnly = this.showLikedOnly();
    const savedOnly = this.showSavedOnly();
    const userPrefs = this.memeService.userPrefs();

    // 1. Text Search (Title & Body Only)
    if (term) {
      memes = memes.filter(m =>
        (m.title?.toLowerCase().includes(term) || false) ||
        m.content.toLowerCase().includes(term)
      );
    }

    // 2. Team Filter
    if (team) {
      memes = memes.filter(m => m.team === team);
    }

    // 3. Mood Filter
    if (mood) {
      memes = memes.filter(m => m.mood === mood);
    }

    // 4. Liked Only Filter
    if (likedOnly) {
      memes = memes.filter(m => userPrefs.likedMemeIds.includes(m.id));
    }

    // 5. Saved Only Filter
    if (savedOnly) {
      memes = memes.filter(m => userPrefs.bookmarkedMemeIds.includes(m.id));
    }

    // 6. Sort
    const order = this.sortOrder();
    memes = [...memes].sort((a, b) => {
        if (order === 'newest') return b.timestamp - a.timestamp;
        if (order === 'oldest') return a.timestamp - b.timestamp;
        return 0;
    });

    return memes;
  });

  updateSearch(term: string) {
    this.searchTerm.set(term);
  }

  updateTeam(team: string) {
    this.teamFilter.set(team);
  }

  updateMood(mood: string) {
    this.moodFilter.set(mood);
  }

  toggleLiked(enabled: boolean) {
    this.showLikedOnly.set(enabled);
  }

  toggleSaved(enabled: boolean) {
    this.showSavedOnly.set(enabled);
  }

  updateSort(order: string) {
    this.sortOrder.set(order);
  }

  onLike(id: string) {
    this.memeService.toggleLike(id);
  }

  onBookmark(id: string) {
    this.memeService.toggleBookmark(id);
  }

  onEdit(meme: Meme) {
    const dialogRef = this.dialog.open(MemeModalComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { meme }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memeService.updateMeme(meme.id, result);
      }
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this meme?')) {
      this.memeService.deleteMeme(id);
    }
  }

  onFlag(id: string) {
    if (confirm('Report this meme as inappropriate?')) {
      this.memeService.toggleFlag(id);
    }
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(MemeModalComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memeService.addMeme(result);
      }
    });
  }
}
