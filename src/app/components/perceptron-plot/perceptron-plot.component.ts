import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

interface LabeledPoint {
  x: number;
  y: number;
  t: 0 | 1;
}

@Component({
  selector: 'app-perceptron-plot',
  standalone: false,
  templateUrl: './perceptron-plot.component.html',
  styleUrl: './perceptron-plot.component.scss',
})
export class PerceptronPlotComponent implements OnInit {
  points: LabeledPoint[] = [
    { x: 1,  y: -2, t: 1 },
    { x: 2,  y:  2, t: 1 },
    { x: -2, y:  2, t: 1 },
    { x: 1,  y: -4, t: 0 },
    { x: -3, y: -4, t: 0 },
    { x: -4, y:  0, t: 0 },
  ];

  w1 = 2;
  w2 = -1;
  b  = 2;

  // Datos y opciones del gráfico
  public chartData: ChartConfiguration<'scatter'>['data'] = {
    datasets: [],
  };

  public chartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        grid: {
          display: true, 
        },
      },
      y: {
        type: 'linear',
        grid: {
          display: true, 
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

  // ----- Lógica para recalcular las series -----
  updateChart(): void {
    if (this.w2 === 0) {
      // evitar división por cero; puedes manejarlo mejor luego
      this.w2 = 0.0001;
    }

    const class0 = this.points
      .filter((p) => p.t === 0)
      .map((p) => ({ x: p.x, y: p.y }));

    const class1 = this.points
      .filter((p) => p.t === 1)
      .map((p) => ({ x: p.x, y: p.y }));

    // Rango de X para dibujar las rectas
    const xs = this.points.map((p) => p.x).concat([0, this.w1]);
    const minX = Math.min(...xs) - 1;
    const maxX = Math.max(...xs) + 1;

    // Recta perpendicular por el origen (B = 0): w1*x + w2*y = 0
    // => y = -(w1/w2) * x
    const originLine = [
      { x: minX, y: -(this.w1 / this.w2) * minX },
      { x: maxX, y: -(this.w1 / this.w2) * maxX },
    ];

    // Recta con bias real del perceptrón: w1*x + w2*y + b = 0
    // => y = -(w1/w2)*x - b/w2
    const biasLine = [
      { x: minX, y: -(this.w1 / this.w2) * minX - this.b / this.w2 },
      { x: maxX, y: -(this.w1 / this.w2) * maxX - this.b / this.w2 },
    ];

    // Vector W desde el origen hasta (w1, w2)
    const wVector = [
      { x: 0, y: 0 },
      { x: this.w1, y: this.w2 },
    ];

    this.chartData = {
      datasets: [
        {
          label: 'Clase 0',
          data: class0,
          pointRadius: 5,
          pointStyle: 'circle',
        },
        {
          label: 'Clase 1',
          data: class1,
          pointRadius: 5,
          pointStyle: 'rect',
        },
        {
          label: 'Vector W',
          data: wVector,
          showLine: true,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: 'Recta B=0',
          data: originLine,
          showLine: true,
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          label: 'Recta con bias',
          data: biasLine,
          showLine: true,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };
  }

  // botón para actualizar al cambiar inputs
  onApply(): void {
    this.updateChart();
  }
}
