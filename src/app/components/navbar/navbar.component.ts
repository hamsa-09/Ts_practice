
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TEAMS, MOODS } from '../../models/meme.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span class="logo">HashedIn Meme Forum</span>
      <span class="spacer"></span>

      <div class="search-bar">
        <mat-icon class="search-icon">search</mat-icon>
        <input type="text" placeholder="Search memes..."
               (input)="onSearch($event)"
               class="search-input">
      </div>

      <div class="filters">
        <select class="filter-select" (change)="onTeamChange($event)">
          <option value="">Team: All</option>
          <option *ngFor="let team of teams" [value]="team">{{ team }}</option>
        </select>

        <select class="filter-select" (change)="onMoodChange($event)">
          <option value="">Mood: Any</option>
          <option *ngFor="let mood of moods" [value]="mood">{{ mood }}</option>
        </select>
      </div>

      <button mat-flat-button color="accent" (click)="create.emit()">
        <mat-icon>add</mat-icon> New Meme
      </button>
    </mat-toolbar>

    <div class="sub-toolbar">
       <button class="toggle-btn"
        [class.active]="filterSaved"
        (click)="toggleSaved()">
         Saved only
       </button>

       <button class="toggle-btn"
        [class.active]="filterLiked"
        (click)="toggleLiked()">
         Liked by me
       </button>

       <span class="spacer"></span>

       <select class="sort-select" (change)="onSortChange($event)">
         <option value="newest">Newest first</option>
         <option value="oldest">Oldest first</option>
       </select>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      gap: 16px;
      padding: 0 24px;
      background-color: #1f1f1f;
      color: white;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .logo {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: #333;
      border-radius: 20px;
      padding: 4px 12px;
      width: 300px;
    }
    .search-icon {
      color: #aaa;
      margin-right: 8px;
    }
    .search-input {
      background: transparent;
      border: none;
      color: white;
      outline: none;
      width: 100%;
    }
    .filters {
      display: flex;
      gap: 8px;
    }
    .filter-select {
      background: #333;
      color: white;
      border: none;
      padding: 8px;
      border-radius: 8px;
      outline: none;
    }
    .sub-toolbar {
      display: flex;
      padding: 12px 24px;
      background-color: #121212;
      align-items: center;
      border-bottom: 1px solid #333;
    }
    .toggle-btn {
      background: transparent;
      border: 1px solid #444;
      color: #aaa;
      padding: 6px 12px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .toggle-btn.active {
      background-color: #3f51b5;
      color: white;
      border-color: #3f51b5;
    }
    .sort-select {
       background: transparent;
       color: #aaa;
       border: none;
       outline: none;
    }
  `]
})
export class NavbarComponent {
  @Output() search = new EventEmitter<string>();
  @Output() filterTeam = new EventEmitter<string>();
  @Output() filterMood = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();
  @Output() toggleLikedFilter = new EventEmitter<boolean>();
  @Output() toggleSavedFilter = new EventEmitter<boolean>();
  @Output() sortChange = new EventEmitter<string>();

  teams = TEAMS;
  moods = MOODS;

  filterLiked = false;
  filterSaved = false;

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }

  onTeamChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterTeam.emit(select.value);
  }

  onMoodChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterMood.emit(select.value);
  }

  toggleLiked() {
    this.filterLiked = !this.filterLiked;
    this.toggleLikedFilter.emit(this.filterLiked);
  }

  toggleSaved() {
    this.filterSaved = !this.filterSaved;
    this.toggleSavedFilter.emit(this.filterSaved);
  }

  onSortChange(event: Event) {
     const select = event.target as HTMLSelectElement;
     this.sortChange.emit(select.value);
  }
}
