import { TestBed } from '@angular/core/testing';
import { MemeService } from './meme.service';

describe('MemeService', () => {
  let service: MemeService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(MemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load seed data if localStorage is empty', () => {
    expect(service.memes().length).toBeGreaterThan(0);
  });

  it('should add a new meme', () => {
    const initialCount = service.memes().length;

    service.addMeme({
      author: 'TestUser',
      team: 'Engineering',
      mood: 'Happy',
      content: 'Test meme content',
      tags: ['test']
    });

    expect(service.memes().length).toBe(initialCount + 1);
    expect(service.memes()[0].content).toBe('Test meme content');
  });

  it('should toggle like on a meme', () => {
    const memeId = service.memes()[0].id;
    const initialLikes = service.memes()[0].likes;
    const isLikedBefore = service.userPrefs().likedMemeIds.includes(memeId);

    service.toggleLike(memeId);

    const isLikedAfter = service.userPrefs().likedMemeIds.includes(memeId);
    const finalLikes = service.memes()[0].likes;

    expect(isLikedAfter).toBe(!isLikedBefore);

    if (isLikedAfter) {
      expect(finalLikes).toBe(initialLikes + 1);
    } else {
      expect(finalLikes).toBe(initialLikes - 1);
    }
  });

  it('should save and retrieve draft', () => {
    const draft = {
      content: 'Draft content',
      team: 'Engineering',
      mood: 'Happy',
      tags: ['draft'],
      timestamp: Date.now()
    };

    service.saveDraft(draft);
    const retrieved = service.getDraft();

    expect(retrieved).toBeTruthy();
    expect(retrieved?.content).toBe('Draft content');
  });

  it('should clear draft', () => {
    const draft = {
      content: 'Draft to clear',
      team: 'Engineering',
      mood: 'Happy',
      tags: [],
      timestamp: Date.now()
    };

    service.saveDraft(draft);
    expect(service.getDraft()).toBeTruthy();

    service.clearDraft();
    expect(service.getDraft()).toBeNull();
  });
});
