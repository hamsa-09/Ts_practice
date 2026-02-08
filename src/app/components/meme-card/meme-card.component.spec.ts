import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemeCardComponent } from './meme-card.component';
import { Meme } from '../../models/meme.model';

describe('MemeCardComponent', () => {
  let component: MemeCardComponent;
  let fixture: ComponentFixture<MemeCardComponent>;
  let mockMeme: Meme;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MemeCardComponent);
    component = fixture.componentInstance;

    // Create mock meme
    mockMeme = {
      id: '1',
      author: 'TestUser',
      team: 'Engineering',
      mood: 'Happy',
      content: 'Test content with ||spoiler||',
      tags: ['test', 'angular'],
      timestamp: Date.now(),
      likes: 5
    };

    component.meme = mockMeme;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display meme author', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('TestUser');
  });

  it('should parse spoiler content correctly', () => {
    component.ngOnChanges({
      meme: {
        currentValue: mockMeme,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.parsedContent.length).toBeGreaterThan(0);
    const spoilerPart = component.parsedContent.find(p => p.isSpoiler);
    expect(spoilerPart).toBeTruthy();
    expect(spoilerPart?.text).toBe('spoiler');
  });

  it('should toggle spoiler reveal state', () => {
    component.ngOnChanges({
      meme: {
        currentValue: mockMeme,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    const spoilerPart = component.parsedContent.find(p => p.isSpoiler);
    expect(spoilerPart?.revealed).toBe(false);

    component.toggleSpoiler(spoilerPart!);
    expect(spoilerPart?.revealed).toBe(true);

    component.toggleSpoiler(spoilerPart!);
    expect(spoilerPart?.revealed).toBe(false);
  });

  it('should emit like event when like button clicked', () => {
    spyOn(component.like, 'emit');

    component.onLike();

    expect(component.like.emit).toHaveBeenCalledWith('1');
  });

  it('should display like count', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('5');
  });

  it('should display tags', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('#test');
    expect(compiled.textContent).toContain('#angular');
  });
});
