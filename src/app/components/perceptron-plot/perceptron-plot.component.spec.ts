import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerceptronPlotComponent } from './perceptron-plot.component';

describe('PerceptronPlotComponent', () => {
  let component: PerceptronPlotComponent;
  let fixture: ComponentFixture<PerceptronPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerceptronPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerceptronPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
