
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Meme } from '../../models/meme.model';

interface ContentPart {
  text: string;
  isSpoiler: boolean;
  revealed: boolean;
}

@Component({
  selector: 'app-meme-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule],
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css']
})
export class MemeCardComponent implements OnChanges {
  @Input({ required: true }) meme!: Meme;
  @Input() isLiked: boolean = false;
  @Input() isBookmarked: boolean = false;
  @Input() isFlagged: boolean = false;
  @Output() like = new EventEmitter<string>();
  @Output() bookmark = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Meme>();
  @Output() deleteAction = new EventEmitter<string>();
  @Output() flag = new EventEmitter<string>();

  parsedContent: ContentPart[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['meme'] && this.meme) {
      this.parsedContent = this.parseContent(this.meme.content);
    }
  }

  onLike() {
    this.like.emit(this.meme.id);
  }

  onBookmark() {
    this.bookmark.emit(this.meme.id);
  }

  onEdit() {
    this.edit.emit(this.meme);
  }

  onDelete() {
    this.deleteAction.emit(this.meme.id);
  }

  onFlag() {
    this.flag.emit(this.meme.id);
  }

  toggleSpoiler(part: ContentPart) {
    if (part.isSpoiler) {
      part.revealed = !part.revealed;
    }
  }

  private parseContent(text: string): ContentPart[] {
    const parts: ContentPart[] = [];
    const regex = /\|\|(.*?)\|\|/gs;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index), isSpoiler: false, revealed: false });
      }
      parts.push({ text: match[1], isSpoiler: true, revealed: false });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isSpoiler: false, revealed: false });
    }
    return parts;
  }
}
