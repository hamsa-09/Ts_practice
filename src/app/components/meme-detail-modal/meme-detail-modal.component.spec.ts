import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeDetailModalComponent } from './meme-detail-modal.component';

describe('MemeDetailModalComponent', () => {
  let component: MemeDetailModalComponent;
  let fixture: ComponentFixture<MemeDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
