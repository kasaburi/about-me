import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elora } from './elora';

describe('Elora', () => {
  let component: Elora;
  let fixture: ComponentFixture<Elora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elora]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Elora);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
