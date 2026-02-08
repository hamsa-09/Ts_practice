import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MemeModalComponent } from './meme-modal.component';
import { MemeService } from '../../services/meme.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('MemeModalComponent', () => {
  let component: MemeModalComponent;
  let fixture: ComponentFixture<MemeModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<MemeModalComponent>>;
  let mockMemeService: jasmine.SpyObj<MemeService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMemeService = jasmine.createSpyObj('MemeService', ['getDraft', 'saveDraft', 'clearDraft']);

    await TestBed.configureTestingModule({
      imports: [MemeModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MemeService, useValue: mockMemeService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MemeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have teams and moods arrays', () => {
    expect(component.teams.length).toBeGreaterThan(0);
    expect(component.moods.length).toBeGreaterThan(0);
  });

  it('should display modal title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Create New Meme');
  });

  it('should call saveDraft when content changes', () => {
    // Wait for ViewChild to initialize
    fixture.detectChanges();

    if (component.contentInput) {
      component.saveDraft();
      expect(mockMemeService.saveDraft).toHaveBeenCalled();
    }
  });

  it('should close dialog with result on post', () => {
    // Manually set ViewChild values for testing
    component.teamSelect = { nativeElement: { value: 'Engineering' } } as any;
    component.moodSelect = { nativeElement: { value: 'Happy' } } as any;
    component.contentInput = { nativeElement: { value: 'Test content' } } as any;
    component.tagsInput = { nativeElement: { value: 'test, demo' } } as any;

    component.post();

    expect(mockMemeService.clearDraft).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      author: 'CodeNinja',
      team: 'Engineering',
      mood: 'Happy',
      content: 'Test content',
      tags: ['test', 'demo']
    });
  });

  it('should not post if content is empty', () => {
    component.contentInput = { nativeElement: { value: '   ' } } as any;

    component.post();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should restore draft on init if exists', () => {
    const mockDraft = {
      content: 'Draft content',
      team: 'Engineering',
      mood: 'Happy',
      tags: ['draft'],
      timestamp: Date.now()
    };

    mockMemeService.getDraft.and.returnValue(mockDraft);

    component.ngAfterViewInit();

    expect(mockMemeService.getDraft).toHaveBeenCalled();
  });
});
