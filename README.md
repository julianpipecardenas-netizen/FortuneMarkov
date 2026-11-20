# FortuneMarkov

Aplicación React/TypeScript estática para explorar las tasas de referencia de siete recompensas
de cofres en los escenarios Normal y Hora del tesoro.

## Tasas y procedencia

| Recompensa | Normal | Hora del tesoro |
|---|---:|---:|
| Traje dorado semanal | 1/1.562.500 | 1/208.333 |
| Acceso a la tienda pirata | 1/137.500 | 1/91.667 |
| Vehículo y calcomanía semanal | 1/7.813 | 1/781 |
| Pico o accesorio mochilero semanal | 1/568 | 1/568 |
| Pista musical semanal | 1/391 | 1/391 |
| Pantalla de carga semanal | 1/272 | 1/272 |
| Cualquier artilugio | 1/127 | 1/127 |

Fuente oficial principal: [Epic Games](https://www.epicgames.com/help/c-34254770/c-33726977/what-are-the-drop-rates-of-treasure-in-chests-in-fortnite-battle-royale-s-pirate-treasure-event-a14361627).
Como referencia complementaria para las tasas normales: [Fortnite.GG](https://fortnite.gg/treasure-hunt/odds).
Las tasas normales se identifican como publicadas por Epic. Las fracciones de Hora del tesoro
expresan los resultados de multiplicadores publicados por Epic; no son los multiplicadores mismos.
Los puntos separan millares.

## Modelo teórico

Para una recompensa con probabilidad individual `p`, la interfaz presenta los estados
«Cofre sin recompensa» y «Recompensa obtenida» y la matriz:

```text
[[1 - p, p],
 [0,     1]]
```

«Recompensa obtenida» es absorbente. «Cofre sin recompensa» indica que aún no se ha obtenido
la recompensa seleccionada; no significa que el cofre esté vacío. La distribución inicial es
`[1, 0]`; tras elevar la matriz a
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

Las probabilidades porcentuales se calculan multiplicando primero `p` por 100; por ejemplo,
`1/1.562.500` se muestra como `0,000064 %`.

## Desarrollo

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run test
npm.cmd run build
```
