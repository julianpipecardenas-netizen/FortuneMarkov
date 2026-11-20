# Spec Delta

## Purpose

Permite explorar tasas publicadas de recompensas de cofres y analizar la adquisición de una recompensa a través de intentos, con hipótesis matemáticas visibles y sin inferir una distribución conjunta no respaldada por los datos.

## ADDED Requirements

### Requirement: Catálogo de tasas con procedencia
El sistema SHALL conservar y presentar las siete tasas de referencia como fracciones exactas `1/N` para los escenarios Normal y Hora del tesoro. Cada valor SHALL identificar su recompensa y escenario; el sistema MUST NOT inventar ni inferir valores ausentes.

#### Scenario: Consultar tasas de referencia
- **WHEN** una persona consulta el catálogo
- **THEN** ve los siguientes valores exactos para Normal y Hora del tesoro:

| Recompensa | Normal | Hora del tesoro |
|---|---:|---:|
| Traje dorado semanal | 1/1.562.500 | 1/208.333 |
| Acceso a la tienda pirata | 1/137.500 | 1/91.667 |
| Vehículo y calcomanía semanal | 1/7.813 | 1/781 |
| Pico o accesorio mochilero semanal | 1/568 | 1/568 |
| Pista musical semanal | 1/391 | 1/391 |
| Pantalla de carga semanal | 1/272 | 1/272 |
| Cualquier artilugio | 1/127 | 1/127 |

Los puntos separan millares en los denominadores y se usan de forma uniforme en la interfaz y la documentación.

#### Scenario: Identificar procedencia y vigencia
- **WHEN** se muestra un valor de probabilidad
- **THEN** las tasas normales se identifican como publicadas por [Epic Games](https://www.epicgames.com/help/c-34254770/c-33726977/what-are-the-drop-rates-of-treasure-in-chests-in-fortnite-battle-royale-s-pirate-treasure-event-a14361627), con [Fortnite.GG](https://fortnite.gg/treasure-hunt/odds) como referencia complementaria; las fracciones de Hora del tesoro se identifican como derivadas de multiplicadores publicados por Epic, y se señala que el balance puede cambiar con actualizaciones del juego

### Requirement: Probabilidad individual por apertura
El sistema SHALL presentar la tasa de una recompensa para una apertura individual separada de cualquier probabilidad acumulada, conservando la fracción de origen y su equivalente decimal o porcentual.

#### Scenario: Consultar una probabilidad individual
- **WHEN** se selecciona una recompensa y un escenario
- **THEN** se muestran por separado la fracción `1/N` y el valor equivalente para una apertura, sin describirlo como probabilidad acumulada

#### Scenario: Mostrar un porcentaje pequeño
- **WHEN** se muestra como porcentaje una probabilidad pequeña, como `1/1.562.500`
- **THEN** primero se multiplica la probabilidad por 100 y se muestra `0,000064 %` de forma legible, sin notación científica

### Requirement: Verificación de procedencia de tasas
El sistema SHALL mostrar enlaces a las fuentes y marcar explícitamente la procedencia de cada tasa. MUST distinguir las tasas normales publicadas directamente por Epic de las fracciones de Hora del tesoro derivadas de sus multiplicadores, sin alterar los denominadores originales ni presentar el multiplicador como si fuera la fracción.

#### Scenario: Identificar procedencia y vigencia
- **WHEN** se muestra un valor de probabilidad
- **THEN** se identifica su categoría de procedencia, se enlaza Epic Games como fuente principal y Fortnite.GG como referencia complementaria para las tasas normales, y se distingue la fracción de Hora del tesoro de los multiplicadores que la originan

### Requirement: Modelo de adquisición de una recompensa
Para una recompensa y escenario seleccionados, el sistema SHALL representar en un modelo teórico los estados «Cofre sin recompensa» y «Recompensa obtenida», siendo «Recompensa obtenida» absorbente, con la matriz `[[1-p, p], [0, 1]]`, donde `p` es la tasa individual por apertura. «Cofre sin recompensa» significa que todavía no se ha obtenido la recompensa seleccionada, no que el cofre esté vacío. Este modelo MUST NOT presentarse como una descripción confirmada del funcionamiento real de los cofres; la regla de no duplicación no confirma sus supuestos ni determina probabilidades condicionales.

#### Scenario: Calcular pasos del modelo individual
- **WHEN** se solicita el resultado para 1, 3, 5 o 10 pasos partiendo de «Cofre sin recompensa»
- **THEN** se calcula la potencia correspondiente de la matriz y se presenta la distribución entre ambos estados

#### Scenario: Representar la no duplicación
- **WHEN** el modelo ya está en «Recompensa obtenida»
- **THEN** el siguiente estado permanece en «Recompensa obtenida» con probabilidad 1

### Requirement: Probabilidad acumulada estimada bajo un modelo teórico
El sistema SHALL calcular la probabilidad estimada de adquirir al menos una vez la recompensa en `n` intentos con `1 - (1 - p)^n`, suponiendo intentos independientes y una tasa `p` constante mientras no se haya obtenido la recompensa.

#### Scenario: Identificar claramente una estimación acumulada
- **WHEN** se muestran resultados de varios intentos
- **THEN** se identifica explícitamente la probabilidad acumulada como estimación bajo el modelo teórico, se distingue de la tasa individual proporcionada por apertura y se explican los supuestos de independencia entre intentos y tasa constante mientras no se haya obtenido la recompensa

### Requirement: Comunicar los límites del modelo teórico
La interfaz SHALL distinguir la tasa individual proporcionada de la estimación acumulada y MUST NOT presentar los supuestos del modelo como una descripción confirmada del funcionamiento real de los cofres. El sistema MUST NOT modificar las tasas originales ni inventar probabilidades condicionales.

#### Scenario: No atribuir el modelo a la mecánica real
- **WHEN** la interfaz presenta la matriz, estimación acumulada o simulación
- **THEN** aclara que los supuestos son teóricos y que el modelo no confirma el funcionamiento real de los cofres, incluida su regla de no duplicación

#### Scenario: Hipótesis no respaldada por datos futuros
- **WHEN** la fuente de datos indique que la tasa condicional cambia antes de obtener la recompensa
- **THEN** el sistema no presenta la fórmula de tasa constante como resultado exacto ni inventa probabilidades condicionales, y señala que se necesitan probabilidades condicionales validadas

### Requirement: Comparación de escenarios
El sistema SHALL permitir comparar, para una recompensa seleccionada, las tasas por apertura y los resultados de 1, 3, 5 y 10 pasos de los escenarios Normal y Hora del tesoro en visualizaciones comprensibles.

#### Scenario: Comparar escenarios
- **WHEN** una persona abre la comparación de una recompensa
- **THEN** se muestran ambos escenarios con escalas, unidades y etiquetas en español, sin confundir los resultados por apertura con los acumulados

### Requirement: Límites del modelo y simulación
El sistema MUST NOT tratar las siete tasas marginales como categorías mutuamente excluyentes, calcular `Other / Unlisted` como complemento de su suma ni presentar una matriz conjunta o simulación de resultados de cofres como exacta sin probabilidades condicionales validadas. La simulación SHALL limitarse al modelo de adquisición de una recompensa y explicitar sus hipótesis.

#### Scenario: Simular una recompensa
- **WHEN** una persona selecciona una recompensa, un escenario, la cantidad de intentos por secuencia y la cantidad de secuencias simuladas, y ejecuta la simulación con generación de números aleatorios
- **THEN** se muestran los resultados de las secuencias simuladas y su frecuencia de adquisición junto a la estimación teórica `1 - (1 - p)^n` para la cantidad de intentos seleccionada; se informa la tasa individual y se explicitan los supuestos de independencia y tasa constante mientras no se haya obtenido la recompensa

#### Scenario: Solicitar un resultado conjunto no sustentado
- **WHEN** se intenta interpretar o simular en conjunto la adquisición de varias recompensas con solo las tasas marginales disponibles
- **THEN** el sistema explica que faltan probabilidades condicionales y no genera una matriz, estado residual ni resultado conjunto presentado como exacto

#### Scenario: Interpretar resultados de simulación
- **WHEN** se muestran resultados de una simulación
- **THEN** se aclara que se generaron bajo el modelo teórico seleccionado y no necesariamente reproducen la mecánica real de Fortnite; la frecuencia simulada puede diferir de la estimación teórica

### Requirement: Interfaz accesible y adaptable
El sistema SHALL ofrecer una interfaz web completamente en español, legible y operable en distintos tamaños de pantalla, con los nombres traducidos de las recompensas y etiquetas matemáticas inequívocas.

#### Scenario: Consultar desde una pantalla estrecha
- **WHEN** se consulta la aplicación en una pantalla móvil o estrecha
- **THEN** el contenido, controles, matrices y gráficos siguen siendo legibles y utilizables sin depender de una aplicación móvil

### Requirement: Verificación automatizada de cálculos
La entrega SHALL incluir pruebas automatizadas que verifiquen los catorce denominadores del catálogo, las conversiones desde las fracciones, las matrices de dos estados y las probabilidades acumuladas para 1, 3, 5 y 10 pasos en ambos escenarios.

#### Scenario: Validar cálculos matemáticos
- **WHEN** se ejecuta la suite de pruebas automatizadas
- **THEN** las pruebas comprueban resultados de ambos escenarios para los pasos 1, 3, 5 y 10 y la propiedad absorbente del estado «Recompensa obtenida»
