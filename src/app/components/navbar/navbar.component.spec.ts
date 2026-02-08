import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('HashedIn Meme Forum');
  });

  it('should emit search event on input', () => {
    spyOn(component.search, 'emit');

    const event = { target: { value: 'test search' } } as any;
    component.onSearch(event);

    expect(component.search.emit).toHaveBeenCalledWith('test search');
  });

  it('should emit filterTeam event on team change', () => {
    spyOn(component.filterTeam, 'emit');

    const event = { target: { value: 'Engineering' } } as any;
    component.onTeamChange(event);

    expect(component.filterTeam.emit).toHaveBeenCalledWith('Engineering');
  });

  it('should emit filterMood event on mood change', () => {
    spyOn(component.filterMood, 'emit');

    const event = { target: { value: 'Happy' } } as any;
    component.onMoodChange(event);

    expect(component.filterMood.emit).toHaveBeenCalledWith('Happy');
  });

  it('should toggle liked filter', () => {
    spyOn(component.toggleLikedFilter, 'emit');

    expect(component.filterLiked).toBe(false);

    component.toggleLiked();

    expect(component.filterLiked).toBe(true);
    expect(component.toggleLikedFilter.emit).toHaveBeenCalledWith(true);

    component.toggleLiked();

    expect(component.filterLiked).toBe(false);
    expect(component.toggleLikedFilter.emit).toHaveBeenCalledWith(false);
  });

  it('should emit sortChange event', () => {
    spyOn(component.sortChange, 'emit');

    const event = { target: { value: 'oldest' } } as any;
    component.onSortChange(event);

    expect(component.sortChange.emit).toHaveBeenCalledWith('oldest');
  });

  it('should emit create event when New Meme button clicked', () => {
    spyOn(component.create, 'emit');

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button[color="accent"]');
    button.click();

    expect(component.create.emit).toHaveBeenCalled();
  });

  it('should have teams and moods arrays', () => {
    expect(component.teams.length).toBeGreaterThan(0);
    expect(component.moods.length).toBeGreaterThan(0);
  });
});
