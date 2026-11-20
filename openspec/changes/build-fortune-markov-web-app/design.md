# Design

## Context

El repositorio no tiene aplicación, manifiesto de dependencias ni especificaciones anteriores. La tabla de referencia contiene tasas individuales para siete recompensas y dos escenarios; no incluye probabilidades conjuntas o condicionales. Véanse `proposal.md` y `specs/treasure-reward-analysis/spec.md` para motivación y contrato de comportamiento.

## Goals / Non-Goals

**Goals:**
- Separar catálogo y procedencia de datos, funciones matemáticas puras, simulación y componentes de interfaz.
- Hacer visibles las hipótesis del modelo teórico, distinguir tasas individuales proporcionadas de estimaciones acumuladas y conservar trazabilidad de las fracciones utilizadas.
- Producir una aplicación web estática que pueda compilarse, probarse y publicarse desde GitHub.

**Non-Goals:**
- Modelar la adquisición conjunta de varias recompensas, las probabilidades condicionales de un cofre o un resultado residual sin datos que los respalden.
- Consultar automáticamente servicios de Fortnite.GG o Epic Games durante el uso de la aplicación.
- Simular el conjunto completo de botín de un cofre como si sus resultados fueran una categoría exclusiva.

## Decisions

1. **Aplicación cliente estática:** usar React, TypeScript y Vite, sin servidor ni base de datos. Una SPA estática basta para estos cálculos, simplifica la publicación desde GitHub y evita transmitir datos de usuario. Se prefiere a un backend porque no se requiere persistencia ni acceso privado; HTML/JS sin componentes se descarta para mantener modular la interfaz interactiva.

2. **Datos versionados como fracciones:** definir un registro tipado por recompensa y escenario que conserve numerador y denominador enteros, fuente o referencia disponible y estado explícito de verificación de procedencia. Si no hay documentación verificable, identificar la procedencia como no verificada; clasificar un valor como publicado directamente o derivado de un multiplicador solo cuando la documentación lo respalde. Los decimales se derivan en tiempo de cálculo. Las siete parejas de tasas indicadas por el usuario son los valores iniciales, no una verificación independiente de las páginas citadas.

3. **Motor matemático puro y por recompensa:** construir para la recompensa seleccionada la matriz teórica con filas como estado actual y columnas como estado siguiente, `[[1-p, p], [0, 1]]`, con estado inicial `[1, 0]`. Calcular potencias para 1, 3, 5 y 10 pasos. La probabilidad acumulada de al menos una obtención es `1 - (1 - p)^n` bajo los supuestos de independencia entre intentos y probabilidad constante mientras no se haya obtenido la recompensa. Mostrarla como estimación del modelo teórico, separada de la tasa individual proporcionada; no afirmar que la matriz, los supuestos o el resultado describan el funcionamiento real de los cofres. La regla de no duplicación no valida esos supuestos ni aporta las probabilidades condicionales necesarias para confirmar ese comportamiento. No se combinan las siete recompensas en una matriz de 8 estados ni en una matriz de subconjuntos, ya que las tasas marginales no determinan sus transiciones conjuntas.

4. **Simulación educativa aislada:** permitir elegir una recompensa, escenario, cantidad de intentos por secuencia y cantidad de secuencias a simular. Generar secuencias Bernoulli únicamente para la recompensa elegida, con la misma tasa `p` en cada intento no adquirido y transición absorbente tras adquirirla. Mostrar los resultados y la frecuencia de secuencias con una adquisición, comparándolos con `1 - (1 - p)^n` para la cantidad de intentos por secuencia. Identificar la simulación como ilustración del modelo teórico bajo independencia y tasa constante, no como reproducción confirmada de la mecánica real de Fortnite ni del botín completo; la frecuencia simulada puede diferir de la estimación teórica. Inyectar el generador aleatorio en el motor para que las pruebas puedan ser reproducibles sin alterar la experiencia normal.

5. **Presentación y visualizaciones:** mantener las fracciones de las tasas individuales como referencia primaria, mostrar decimales/porcentajes con precisión suficiente y diferenciar de forma persistente la tasa individual por apertura de la probabilidad acumulada estimada bajo el modelo teórico. La interfaz expone los supuestos de independencia y tasa constante, y aclara que no son una descripción confirmada del funcionamiento real de los cofres. Utilizar Recharts para comparaciones y conservar tablas o valores textuales equivalentes para accesibilidad y pantallas estrechas.

6. **Pruebas automatizadas:** usar Vitest para probar conversión de fracciones, matriz, absorción, potencias y resultados acumulados de ambos escenarios; usar React Testing Library para verificar que la interfaz mantiene diferenciadas las dos clases de probabilidad y las advertencias. Para probabilidades decimales se usarán tolerancias numéricas, no igualdad exacta de punto flotante.

## Risks / Trade-offs

- [Las fuentes o tasas pueden cambiar] → conservar procedencia y fracciones originales, indicar que pueden variar y actualizar manualmente los datos con una referencia y fecha de revisión.
- [Las páginas citadas no se pudieron verificar durante la planificación] → etiquetar los valores como datos de referencia proporcionados para el proyecto y confirmar enlaces y fecha de consulta antes de una publicación inicial.
- [La fórmula acumulada solo corresponde al modelo teórico de intentos independientes y tasa constante antes de la adquisición] → etiquetar el resultado como estimación, mostrar ambos supuestos y no presentarlos como mecánica real confirmada; si una fuente futura documenta tasas condicionales distintas, no usar esta fórmula como resultado exacto ni inventar probabilidades condicionales.
- [No hay información conjunta suficiente] → excluir explícitamente resultados conjuntos, estado residual y simulación completa de cofres; solicitar probabilidades condicionales validadas antes de ampliar el modelo.
- [Probabilidades pequeñas pueden redondearse a cero en porcentajes] → conservar y mostrar siempre `1/N` y usar formato decimal con precisión adecuada.

## Migration Plan

No hay aplicación existente que migrar. Inicializar la SPA y sus pruebas, implementar los datos y cálculos antes de la interfaz, ejecutar compilación y pruebas en CI, y publicar el resultado estático desde GitHub. Si falla una publicación, se revierte al artefacto estático anterior; no hay migraciones de datos ni servicios de backend.
