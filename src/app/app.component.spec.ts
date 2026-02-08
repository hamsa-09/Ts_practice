import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('AppComponent', () => {
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        provideAnimationsAsync()
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update search term', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.updateSearch('test');
    expect(app.searchTerm()).toBe('test');
  });

  it('should update team filter', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.updateTeam('Engineering');
    expect(app.teamFilter()).toBe('Engineering');
  });

  it('should update mood filter', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.updateMood('Happy');
    expect(app.moodFilter()).toBe('Happy');
  });

  it('should toggle liked filter', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.showLikedOnly()).toBe(false);
    app.toggleLiked(true);
    expect(app.showLikedOnly()).toBe(true);
  });

  it('should update sort order', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.updateSort('oldest');
    expect(app.sortOrder()).toBe('oldest');
  });

  it('should filter memes by search term', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.updateSearch('code');
    const filtered = app.filteredMemes();

    // Should filter based on content or tags
    expect(filtered.every(m =>
      m.content.toLowerCase().includes('code') ||
      m.tags.some(t => t.toLowerCase().includes('code'))
    )).toBe(true);
  });

  it('should open create modal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const mockDialogRef = {
      afterClosed: () => ({ subscribe: () => {} })
    };
    mockDialog.open.and.returnValue(mockDialogRef as any);

    app.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call toggleLike on service', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(app.memeService, 'toggleLike');

    app.onLike('test-id');

    expect(app.memeService.toggleLike).toHaveBeenCalledWith('test-id');
  });
});
