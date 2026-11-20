# Proposal

## Why

FortuneMarkov necesita presentar de forma clara las probabilidades publicadas para recompensas de cofres y explicar qué significan a lo largo de varios intentos. El análisis debe evitar presentar como exactos resultados que no pueden deducirse de probabilidades individuales cuando no se conocen las dependencias entre recompensas.

## What Changes

- Crear una aplicación web adaptable que consulte y compare las tasas normales y de Treasure Hour de las siete recompensas proporcionadas, conservándolas como fracciones `1/N` y mostrando su procedencia y fecha de revisión.
- Representar la adquisición de una recompensa seleccionada con dos estados: `Not Obtained` y `Obtained`, siendo el segundo absorbente en un modelo teórico que no confirma el funcionamiento real de los cofres ni representa por sí mismo la regla de no duplicación.
- Mostrar la tasa individual proporcionada por apertura por separado de la probabilidad acumulada estimada. Calcular esta última con `1 - (1 - p)^n` únicamente como estimación bajo un modelo teórico que supone intentos independientes y probabilidad constante mientras la recompensa no se haya obtenido; no presentar estos supuestos como una descripción confirmada del funcionamiento real de los cofres.
- Presentar matrices y resultados teóricos estimados para 1, 3, 5 y 10 pasos, gráficos y comparación de escenarios, además de un simulador limitado a una recompensa seleccionada y a las mismas hipótesis declaradas.
- Documentar las fórmulas, fuentes y limitaciones. No crear un estado residual mediante el complemento de las tasas ni afirmar que existe una matriz conjunta de recompensas: las probabilidades marginales compartidas no demuestran exclusividad ni proporcionan las probabilidades condicionales necesarias.
- Incorporar pruebas automatizadas de las conversiones, matrices y cálculos acumulados.

## Capabilities

### New Capabilities
- `treasure-reward-analysis`: consulta y comparación de tasas, modelo de adquisición de una recompensa, cálculos, visualizaciones, simulación acotada y comunicación de procedencia, hipótesis y limitaciones.

### Modified Capabilities
- Ninguna.

## Impact

El repositorio no contiene código de aplicación ni especificaciones previas; el cambio crea la aplicación web y su primera especificación. La matriz exacta de adquisición conjunta de varias recompensas queda fuera de lo que permiten los datos actuales. Las tasas de Treasure Hour se conservarán como fracciones proporcionadas y solo se describirán como derivadas de multiplicadores cuando la fuente del multiplicador esté disponible. La arquitectura y las herramientas de pruebas se definirán en `design.md`.
