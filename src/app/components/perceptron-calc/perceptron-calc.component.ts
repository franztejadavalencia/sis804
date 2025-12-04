import { Component, signal, computed, effect } from '@angular/core';

interface Punto {
  x: number | null;
  y: number | null;
  t: 0 | 1;
}

@Component({
  selector: 'app-perceptron-calc',
  standalone: false,
  templateUrl: './perceptron-calc.component.html',
  styleUrl: './perceptron-calc.component.scss',
})
export class PerceptronCalcComponent {
  cantPuntos = signal(6);
  puntos = signal<Punto[]>([]);
  primerMitadT = signal<0 | 1>(0);

  constructor() {
    this.resetPuntos();
  }

  private tPorIndex(idx: number): 0 | 1 {
    const n = this.cantPuntos();
    const mitad = n / 2;
    const tPrimeros = this.primerMitadT();
    const tUltimos: 0 | 1 = tPrimeros === 0 ? 1 : 0;
    return idx < mitad ? tPrimeros : tUltimos;
  }

  resetPuntos() {
    const n = this.cantPuntos();
    const previos = this.puntos();
    const lista: Punto[] = [];

    for (let i = 0; i < n; i++) {
      const previo = previos[i];
      lista.push({
        x: previo?.x ?? null,
        y: previo?.y ?? null,
        t: this.tPorIndex(i),
      });
    }
    this.puntos.set(lista);
  }

  onCambiarCantidad(event: any) {
    let value = Number(event.target.value);
    if (isNaN(value) || value < 2) {
      value = 2;
    }
    if (value % 2 !== 0) value += 1;

    this.cantPuntos.set(value);
    this.resetPuntos();
  }

  onInvertirT() {
    const current = this.primerMitadT();
    const next: 0 | 1 = current === 0 ? 1 : 0;
    this.primerMitadT.set(next);

    this.puntos.update((arr) =>
      arr.map((p, idx) => ({
        ...p,
        t: this.tPorIndex(idx),
      })),
    );
  }

  onChangeX(index: number, value: string) {
    const num = value === '' ? null : Number(value);
    this.puntos.update((arr) => {
      const copia = [...arr];
      copia[index] = { ...copia[index], x: num };
      return copia;
    });
  }

  onChangeY(index: number, value: string) {
    const num = value === '' ? null : Number(value);
    this.puntos.update((arr) => {
      const copia = [...arr];
      copia[index] = { ...copia[index], y: num };
      return copia;
    });
  }

  puntosValidos = computed(() => {
    return this.puntos()
      .filter((p) => p.x !== null && p.y !== null)
      .map((p) => ({
        x: p.x as number,
        y: p.y as number,
        t: p.t,
      }));
  });
}
