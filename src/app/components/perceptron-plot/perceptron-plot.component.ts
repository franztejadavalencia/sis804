import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

interface Punto {
  x: number;
  y: number;
  t: 0 | 1;
}
type Estados = '' | 'separados' | 'no_separados' | 'alcanzo_limite';

@Component({
  selector: 'app-perceptron-plot',
  standalone: false,
  templateUrl: './perceptron-plot.component.html',
  styleUrl: './perceptron-plot.component.scss',
})
export class PerceptronPlotComponent implements OnChanges, OnInit {
  @Input() puntos: Punto[] = [];

  @Input() wX = 0;
  @Input() wY = 0;
  @Input() b = 0;
  @Input() ejeBias: 'x' | 'y' = 'x';
  @Input() estadoCalculo: Estados = 'no_separados';
  @Input() nroIteraciones = 0;

  public chartData: ChartConfiguration<'scatter'>['data'] = {
    datasets: [],
  };

  public chartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -10,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        type: 'linear',
        min: -10,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] || changes['wX'] || changes['wY'] || changes['b'] || changes['ejeBias']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const clase0 = this.puntos
      .filter((p) => p.t === 0)
      .map((p) => ({ x: p.x, y: p.y }));

    const clase1 = this.puntos
      .filter((p) => p.t === 1)
      .map((p) => ({ x: p.x, y: p.y }));

    const minX = -10;
    const maxX = 10;
    const minY = -10;
    const maxY = 10;

    // Pendiente de la recta perpendicular a W
    // const m = -(this.wX / this.wY);
    let m = 0;
    if (this.wY !== 0) {
      m = -(this.wX / this.wY);
    }

    // Recta perpendicular por el origen (B = 0): wX*x + wY*y = 0
    // => y = m * x
    const lineaOrigen =  [
    { x: minX, y: m * minX },
    { x: maxX, y: m * maxX },
  ];

    // Recta con bias real del perceptrón: wX*x + wY*y + b = 0
    // => y = m*x - b/wY
    let lineaBias: { x: number; y: number }[];
    if (this.ejeBias === 'x') {
      // Recta con pendiente m que pasa por (B, 0)
      // y = m (x - B)
      const bx = this.b;
      lineaBias = [
        { x: minX, y: m * (minX - bx) },
        { x: maxX, y: m * (maxX - bx) },
      ];
    } else {
      // Recta con pendiente m que pasa por (0, B)
      // y = m x + B
      const by = this.b;
      lineaBias = [
        { x: minX, y: m * minX + by },
        { x: maxX, y: m * maxX + by },
      ];
    }

    // Vector W desde el origen hasta (wX, wY)
    const wVector = [
      { x: 0, y: 0 },
      { x: this.wX, y: this.wY },
    ];

    const ejeX = [
      { x: minX, y: 0 },
      { x: maxX, y: 0 },
    ];

    const ejeY = [
      { x: 0, y: minY },
      { x: 0, y: maxY },
    ];

    this.chartData = {
      datasets: [
        {
          label: 't = 0',
          data: clase0,
          pointRadius: 4,
          pointStyle: 'circle',
          showLine: false,
          backgroundColor: '#ff0000',
          borderColor: '#ff0000',
        },
        {
          label: 't = 1',
          data: clase1,
          pointRadius: 4,
          pointStyle: 'circle',
          showLine: false,
          backgroundColor: '#0000ff',
          borderColor: '#0000ff',
        },
        {
          label: 'Pesos W',
          data: wVector,
          showLine: true,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: 'rgba(0, 200, 255, 1)',
          borderColor: 'rgba(0, 200, 255, 1)',
        },
        {
          label: 'Perpendicular de W',
          data: lineaOrigen,
          showLine: true,
          pointRadius: 0,
          borderWidth: 1,
          borderColor: '#6c757d',
          backgroundColor: '#6c757d',
        },
        {
          label: 'Paralela con bias',
          data: lineaBias,
          showLine: true,
          pointRadius: 0,
          borderWidth: 2,
          borderColor: '#f7993b',
          backgroundColor: '#f7993b',
        },
        {
          label: 'Eje X',
          data: ejeX,
          showLine: true,
          pointRadius: 0,
          borderWidth: 1.5,
          borderColor: 'black',
          backgroundColor: 'black',
        },
        {
          label: 'Eje Y',
          data: ejeY,
          showLine: true,
          pointRadius: 0,
          borderWidth: 1.5,
          borderColor: 'black',
          backgroundColor: 'black',
        },
      ],
    };
  }

  onApply(): void {
    this.updateChart();
  }
}
