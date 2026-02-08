import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemeListComponent } from './meme-list.component';
import { Meme, UserPrefs } from '../../models/meme.model';

describe('MemeListComponent', () => {
  let component: MemeListComponent;
  let fixture: ComponentFixture<MemeListComponent>;
  let mockMemes: Meme[];
  let mockUserPrefs: UserPrefs;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MemeListComponent);
    component = fixture.componentInstance;

    // Create mock data
    mockMemes = [
      {
        id: '1',
        author: 'User1',
        team: 'Engineering',
        mood: 'Happy',
        content: 'First meme',
        tags: ['test'],
        timestamp: Date.now(),
        likes: 3
      },
      {
        id: '2',
        author: 'User2',
        team: 'Product',
        mood: 'Excited',
        content: 'Second meme',
        tags: ['demo'],
        timestamp: Date.now(),
        likes: 7
      }
    ];

    mockUserPrefs = {
      username: 'TestUser',
      likedMemeIds: ['1'],
      bookmarkedMemeIds: [],
      drafts: {}
    };

    component.memes = mockMemes;
    component.userPrefs = mockUserPrefs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all memes', () => {
    const compiled = fixture.nativeElement;
    const memeCards = compiled.querySelectorAll('app-meme-card');
    expect(memeCards.length).toBe(2);
  });

  it('should show empty state when no memes', () => {
    component.memes = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No memes found');
  });

  it('should check if meme is liked', () => {
    expect(component.isLiked('1')).toBe(true);
    expect(component.isLiked('2')).toBe(false);
  });

  it('should emit like event', () => {
    spyOn(component.like, 'emit');

    component.onLike('1');

    expect(component.like.emit).toHaveBeenCalledWith('1');
  });

  it('should track memes by id', () => {
    const meme = mockMemes[0];
    const trackResult = component.trackById(0, meme);
    expect(trackResult).toBe('1');
  });
});
