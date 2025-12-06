import { Component, signal, computed, effect } from '@angular/core';

interface Punto {
  x: number | null;
  y: number | null;
  t: 0 | 1;
}
type Estados = '' | 'separados' | 'no_separados' | 'alcanzo_limite';

@Component({
  selector: 'app-perceptron-calc',
  standalone: false,
  templateUrl: './perceptron-calc.component.html',
  styleUrl: './perceptron-calc.component.scss',
})
export class PerceptronCalcComponent {
  cantPuntos = signal(2);
  puntos = signal<Punto[]>([
    { x: 2, y: 2, t: 0 },
    { x: -2, y: -2, t: 1 },
  ]);
  primerMitadT = signal<0 | 1>(0);
  wXInput = signal<number | null>(null);
  wYInput = signal<number | null>(null);
  bInput  = signal<number | null>(null);
  paraGraficoWX = signal(0);
  paraGraficoWY = signal(0);
  paraGraficoB  = signal(0);
  nroIteraciones = signal(0);
  paraGraficoBiasEje = signal<'x' | 'y'>('x');
  estadoCalculo = signal<Estados>('no_separados');


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
    const actual = this.primerMitadT();
    const inverso: 0 | 1 = actual === 0 ? 1 : 0;
    this.primerMitadT.set(inverso);

    this.puntos.update((arr) =>
      arr.map((p, idx) => ({
        ...p,
        t: this.tPorIndex(idx),
      })),
    );
  }

  cambioX(index: number, value: string) {
    const num = value === '' ? null : Number(value);
    this.puntos.update((arr) => {
      const copia = [...arr];
      copia[index] = { ...copia[index], x: num };
      return copia;
    });
  }

  cambioY(index: number, value: string) {
    const num = value === '' ? null : Number(value);
    this.puntos.update((arr) => {
      const copia = [...arr];
      copia[index] = { ...copia[index], y: num };
      return copia;
    });
  }

  paraGraficoPuntos = computed(() => {
    return this.puntos()
      .filter((p) => p.x !== null && p.y !== null)
      .map((p) => ({
        x: p.x as number,
        y: p.y as number,
        t: p.t,
      }));
  });

  private numeroRandom(): number {
    const min = -4;
    const max = 4;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    return n;
  }

  onGraficar() {
    this.paraGraficoWX.set(this.wXInput() ?? 0);
    this.paraGraficoWY.set(this.wYInput() ?? 0);
    this.paraGraficoB.set(this.bInput() ?? 0);
    this.nroIteraciones.set(0);
    this.estadoCalculo.set('no_separados');
    this.paraGraficoBiasEje.set('x');
  }

  onIniciarCalculo() {
    let wX = this.wXInput();
    let wY = this.wYInput();
    let b  = this.bInput();
    const maxIteraciones = 10;
    let iteracion = 0;
    let estadoFinal: Estados = 'alcanzo_limite';
 
    const pts = this.paraGraficoPuntos();
    if (pts.length === 0) {
      alert('Debes ingresar puntos válidos para iniciar.');
      return;
    }

    if (wX === null || Number.isNaN(wX)) wX = this.numeroRandom();
    if (wY === null || Number.isNaN(wY)) wY = this.numeroRandom();
    if (b  === null || Number.isNaN(b))  b  = this.numeroRandom();

    this.wXInput.set(wX);
    this.wYInput.set(wY);
    this.bInput.set(b);

    this.paraGraficoWX.set(wX);
    this.paraGraficoWY.set(wY);
    this.paraGraficoB.set(b);


    const hardlim = (n: number) => (n > 0 ? 1 : 0);

    for (iteracion = 1; iteracion <= maxIteraciones; iteracion++) {
      let errorCont = 0;

      for (const p of pts) {
        const n = wX * p.x + wY * p.y + b;
        const a = hardlim(n);
        const e = p.t - a;

        if (e !== 0) {
          wX = wX + e * p.x;
          wY = wY + e * p.y;
          b  = b  + e;
          errorCont++;
        }
      }

      const sepX = this.estanSeparados(pts, wX, wY, b, 'x');
      if (sepX) {
        estadoFinal = 'separados';
        this.paraGraficoBiasEje.set('x');
        break;
      }
      const sepY = this.estanSeparados(pts, wX, wY, b, 'y');
      if (sepY) {
        estadoFinal = 'separados';
        this.paraGraficoBiasEje.set('y');
        break;
      }

      if (errorCont === 0) {
        estadoFinal = 'no_separados';
        break;
      }
    }

    this.paraGraficoWX.set(wX);
    this.paraGraficoWY.set(wY);
    this.paraGraficoB.set(b);
    this.nroIteraciones.set(iteracion);
    this.estadoCalculo.set(estadoFinal);
  }

  private estanSeparados(
    pts: { x: number; y: number; t: 0 | 1 }[],
    wX: number,
    wY: number,
    b: number,
    ejeBias: 'x' | 'y',
  ): boolean {
    const f = (p: { x: number; y: number }) => {
      if (ejeBias === 'x') {
        // (b, 0)
        return wX * p.x + wY * p.y - wX * b;
      } else {
        // (0, b)
        return wX * p.x + wY * p.y - wY * b;
      }
    };

    const clase1: number[] = [];
    const clase0: number[] = [];

    for (const p of pts) {
      const val = f(p);
      if (p.t === 1) {
        clase1.push(val);
      } else {
        clase0.push(val);
      }
    }

    // Queremos una separación estricta:
    // todos t=1 a un lado, todos t=0 al otro lado
    const positivos1 = clase1.every((v) => v > 0);
    const negativos1 = clase1.every((v) => v < 0);
    const positivos0 = clase0.every((v) => v > 0);
    const negativos0 = clase0.every((v) => v < 0);

    const condicion1 = positivos1 && negativos0; // t=1 arriba, t=0 abajo
    const conficion2 = negativos1 && positivos0; // t=1 abajo, t=0 arriba

    return condicion1 || conficion2;
  }

}
