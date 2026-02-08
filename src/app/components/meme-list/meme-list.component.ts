
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemeCardComponent } from '../meme-card/meme-card.component';
import { Meme, UserPrefs } from '../../models/meme.model';

@Component({
  selector: 'app-meme-list',
  standalone: true,
  imports: [CommonModule, MemeCardComponent],
  template: `
    <div class="meme-list">
      <div *ngIf="memes.length === 0" class="empty-state">
        <p>No memes found. Try adjusting your filters or create a new meme!</p>
      </div>

      <app-meme-card
        *ngFor="let meme of memes; trackBy: trackById"
        [meme]="meme"
        [isLiked]="isLiked(meme.id)"
        [isBookmarked]="isBookmarked(meme.id)"
        [isFlagged]="isFlagged(meme.id)"
        (like)="onLike($event)"
        (bookmark)="onBookmark($event)"
        (edit)="onEdit($event)"
        (deleteAction)="onDelete($event)"
        (flag)="onFlag($event)">
      </app-meme-card>
    </div>
  `,
  styles: [`
    .meme-list {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #aaa;
    }
  `]
})
export class MemeListComponent {
  @Input() memes: Meme[] = [];
  @Input() userPrefs!: UserPrefs;
  @Output() like = new EventEmitter<string>();
  @Output() bookmark = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Meme>();
  @Output() deleteAction = new EventEmitter<string>();
  @Output() flag = new EventEmitter<string>();

  isLiked(id: string): boolean {
    return (this.userPrefs?.likedMemeIds || []).includes(id);
  }

  isBookmarked(id: string): boolean {
    return (this.userPrefs?.bookmarkedMemeIds || []).includes(id);
  }

  isFlagged(id: string): boolean {
    return (this.userPrefs?.flaggedMemeIds || []).includes(id);
  }

  onLike(id: string) {
    this.like.emit(id);
  }

  onBookmark(id: string) {
    this.bookmark.emit(id);
  }

  onEdit(meme: Meme) {
    this.edit.emit(meme);
  }

  onDelete(id: string) {
    this.deleteAction.emit(id);
  }

  onFlag(id: string) {
    this.flag.emit(id);
  }

  trackById(index: number, meme: Meme): string {
    return meme.id;
  }
}
