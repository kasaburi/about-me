import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Restoran } from './restoran';

describe('Restoran', () => {
  let component: Restoran;
  let fixture: ComponentFixture<Restoran>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Restoran]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Restoran);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
