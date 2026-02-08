
import { Component, Inject, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TEAMS, MOODS, Meme, DraftContent } from '../../models/meme.model';
import { MemeService } from '../../services/meme.service';

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
          <input #titleInput type="text" class="input-dark"
            placeholder="e.g., POV: Standup at 9:30"
            (input)="saveDraft()">
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
          <textarea #contentInput class="input-dark textarea"
            placeholder="Use ||spoiler|| format for spoilers. This is a plain UI; validation would be handled in app logic."
            (input)="saveDraft()"></textarea>
          <small>Use ||text|| for spoilers</small>
        </div>

        <div class="form-group">
          <label>Tags</label>
          <input #tagsInput type="text" class="input-dark"
            placeholder="frontend, backend, platform, qa, pov"
            (input)="saveDraft()">
          <small>In a real app, this would be a multi-select chips input.</small>
        </div>

      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="btn-cancel">Cancel</button>
        <button mat-flat-button color="primary"
          (click)="post()"
          [disabled]="!contentInput.value.trim()">
          {{ isEdit ? 'Save' : 'Post' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .modal-container {
      background-color: #2c2c2c;
      color: #e0e0e0;
      padding: 10px;
      min-width: 500px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.9rem;
      color: #aaa;
    }
    .input-dark {
      width: 100%;
      padding: 10px;
      background-color: #1e1e1e;
      border: 1px solid #444;
      color: white;
      border-radius: 4px;
      font-family: inherit;
    }
    .input-dark:focus {
      outline: 2px solid #3f51b5;
    }
    .textarea {
      min-height: 100px;
      resize: vertical;
    }
    .disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    small {
      color: #777;
      font-size: 0.8rem;
      display: block;
      margin-top: 4px;
    }
  `]
})
export class MemeModalComponent implements AfterViewInit {
  teams = TEAMS;
  moods = MOODS;
  isEdit = false;

  memeService = inject(MemeService);

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamSelect') teamSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('moodSelect') moodSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('contentInput') contentInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<MemeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { meme?: Meme }
  ) {
    this.isEdit = !!data?.meme;
  }

  ngAfterViewInit() {
    // If editing, populate fields
    if (this.data?.meme) {
      setTimeout(() => {
        const meme = this.data.meme!;
        if (this.titleInput) this.titleInput.nativeElement.value = meme.title || '';
        if (this.teamSelect) this.teamSelect.nativeElement.value = meme.team;
        if (this.moodSelect) this.moodSelect.nativeElement.value = meme.mood;
        if (this.contentInput) this.contentInput.nativeElement.value = meme.content;
        if (this.tagsInput) this.tagsInput.nativeElement.value = meme.tags.join(', ');
      });
    } else {
      // Restore draft if exists
      const draft = this.memeService.getDraft();
      if (draft) {
        setTimeout(() => {
          if (this.titleInput) this.titleInput.nativeElement.value = draft.title || '';
          if (this.teamSelect) this.teamSelect.nativeElement.value = draft.team;
          if (this.moodSelect) this.moodSelect.nativeElement.value = draft.mood;
          if (this.contentInput) this.contentInput.nativeElement.value = draft.content;
          if (this.tagsInput) this.tagsInput.nativeElement.value = draft.tags.join(', ');
        });
      }
    }
  }

  saveDraft() {
    if (this.isEdit) return; // Don't save drafts when editing

    const draft: DraftContent = {
      title: this.titleInput.nativeElement.value,
      team: this.teamSelect.nativeElement.value,
      mood: this.moodSelect.nativeElement.value,
      content: this.contentInput.nativeElement.value,
      tags: this.tagsInput.nativeElement.value.split(',').map(t => t.trim()).filter(t => t),
      timestamp: Date.now()
    };
    this.memeService.saveDraft(draft);
  }

  post() {
    const content = this.contentInput.nativeElement.value;
    if (!content.trim()) return;

    const tags = this.tagsInput.nativeElement.value.split(',').map(t => t.trim()).filter(t => t);

    const result = {
      title: this.titleInput.nativeElement.value || undefined,
      author: 'CodeNinja',
      team: this.teamSelect.nativeElement.value,
      mood: this.moodSelect.nativeElement.value,
      content,
      tags
    };

    if (!this.isEdit) {
      this.memeService.clearDraft(); // Clear draft on successful post
    }

    this.dialogRef.close(result);
  }
}
