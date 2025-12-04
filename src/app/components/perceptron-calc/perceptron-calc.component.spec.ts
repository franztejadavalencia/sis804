import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerceptronCalcComponent } from './perceptron-calc.component';

describe('PerceptronCalcComponent', () => {
  let component: PerceptronCalcComponent;
  let fixture: ComponentFixture<PerceptronCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerceptronCalcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerceptronCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
