# FortuneMarkov

Aplicación React/TypeScript estática para explorar las tasas de referencia de siete recompensas
de cofres en los escenarios Normal y Treasure Hour.

## Modelo teórico

Para una recompensa con probabilidad individual `p`, el sistema utiliza los estados
`Not Obtained` y `Obtained` y la matriz:

```text
[[1 - p, p],
 [0,     1]]
```

`Obtained` es absorbente. La distribución inicial es `[1, 0]`; tras elevar la matriz a
`n` pasos, la segunda componente representa la estimación teórica de haber adquirido al
menos una vez la recompensa:

```text
1 - (1 - p)^n
```

Esta fórmula requiere intentos independientes y una tasa `p` constante mientras la
recompensa no se haya obtenido. No describe de forma confirmada la mecánica real de los
cofres de Fortnite. La regla de no duplicación no aporta las probabilidades condicionales
necesarias para validar esos supuestos.

Las tasas marginales disponibles no permiten calcular exclusividad, estados residuales,
probabilidades conjuntas ni categorías completas de botín.

## Simulación

El simulador ejecuta secuencias Bernoulli para una sola recompensa. Cada intento usa
`p` hasta que la recompensa se adquiere; entonces esa secuencia termina. El generador
aleatorio es inyectable para pruebas deterministas.

## Desarrollo

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run test
npm.cmd run build
```
