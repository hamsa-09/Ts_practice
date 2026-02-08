
import { Component, Inject, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TEAMS, MOODS, Meme, DraftContent } from '../../models/meme.model';

@Component({
  selector: 'app-meme-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>{{ isEdit ? 'Edit Meme' : 'Compose Meme' }}</h2>
      <mat-dialog-content>
        <div class="form-group">
          <label>Title (optional)</label>
          <input #titleInput type="text" class="input-dark" placeholder="e.g., POV: Standup at 9:30" (input)="saveDraft()">
        </div>
        <div class="form-group">
          <label>Team</label>
          <select #teamSelect class="input-dark" (change)="saveDraft()">
            <option *ngFor="let t of teams" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Mood</label>
          <select #moodSelect class="input-dark" (change)="saveDraft()">
            <option *ngFor="let m of moods" [value]="m">{{ m }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Body (required)</label>
          <textarea #contentInput class="input-dark textarea" placeholder="Use ||spoiler|| for spoilers." (input)="saveDraft()"></textarea>
        </div>
        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input #tagsInput type="text" class="input-dark" placeholder="tag1, tag2" (input)="saveDraft()">
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" (click)="post()" [disabled]="!contentInput.value.trim()">{{ isEdit ? 'Save' : 'Post' }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .modal-container { background-color: #2c2c2c; color: #e0e0e0; padding: 10px; min-width: 500px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: #aaa; }
    .input-dark { width: 100%; padding: 10px; background-color: #1e1e1e; border: 1px solid #444; color: white; border-radius: 4px; }
    .textarea { min-height: 100px; resize: vertical; }
  `]
})
export class MemeModalComponent implements AfterViewInit {
  teams = TEAMS;
  moods = MOODS;
  isEdit = false;

  @Output() draftSaved = new EventEmitter<DraftContent>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamSelect') teamSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('moodSelect') moodSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('contentInput') contentInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<MemeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { meme?: Meme, draft?: DraftContent }
  ) {
    this.isEdit = !!data?.meme;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const source = this.data?.meme || this.data?.draft;
      if (source) {
        if (this.titleInput) this.titleInput.nativeElement.value = source.title || '';
        if (this.teamSelect) this.teamSelect.nativeElement.value = source.team;
        if (this.moodSelect) this.moodSelect.nativeElement.value = source.mood;
        if (this.contentInput) this.contentInput.nativeElement.value = source.content;
        if (this.tagsInput) this.tagsInput.nativeElement.value = source.tags.join(', ');
      }
    });
  }

  saveDraft() {
    if (this.isEdit) return;
    this.draftSaved.emit({
      title: this.titleInput.nativeElement.value,
      team: this.teamSelect.nativeElement.value,
      mood: this.moodSelect.nativeElement.value,
      content: this.contentInput.nativeElement.value,
      tags: this.tagsInput.nativeElement.value.split(',').map(t => t.trim()).filter(t => t),
      timestamp: Date.now()
    });
  }

  post() {
    const content = this.contentInput.nativeElement.value;
    if (!content.trim()) return;

    this.dialogRef.close({
      title: this.titleInput.nativeElement.value || undefined,
      author: 'CodeNinja',
      team: this.teamSelect.nativeElement.value,
      mood: this.moodSelect.nativeElement.value,
      content,
      tags: this.tagsInput.nativeElement.value.split(',').map(t => t.trim()).filter(t => t)
    });
  }
}
