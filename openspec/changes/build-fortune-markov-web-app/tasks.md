# Tasks

## 1. Base del proyecto

- [x] 1.1 Inicializar la SPA React/TypeScript con Vite y scripts de desarrollo, pruebas y compilación; verificar que la instalación y `npm run build` terminan correctamente.
- [ ] 1.2 Preparar la configuración mínima de CI para instalar dependencias, ejecutar pruebas y compilar en GitHub Actions; verificar la ejecución del workflow en una rama de prueba.

## 2. Datos y modelo matemático

- [x] 2.1 Crear el catálogo tipado de siete recompensas con sus fracciones `1/N`, escenarios, referencias disponibles y estado de verificación de procedencia; no clasificar tasas como publicadas directamente o derivadas de multiplicadores sin documentación verificable. Añadir pruebas que comprueben los denominadores y la indicación de procedencia no verificada, y verificar con `npm test`.
- [x] 2.2 Implementar conversión de fracciones, matriz teórica de adquisición de dos estados y potencias para 1, 3, 5 y 10 pasos; añadir pruebas de absorción y comparación con `1 - (1 - p)^n` bajo los supuestos de independencia y tasa constante, y verificar con `npm test`.
- [x] 2.3 Implementar una simulación aleatoria de una recompensa con selección de recompensa y escenario, intentos por secuencia y cantidad de secuencias; mostrar resultados y frecuencia de adquisición comparados con la estimación teórica. Mantener el generador aleatorio inyectable y advertir que la simulación ilustra el modelo teórico, no necesariamente la mecánica real de Fortnite; añadir pruebas deterministas y verificar con `npm test`.
- [x] 2.4 Documentar las fórmulas, el significado de los estados, las hipótesis de independencia/tasa constante, su carácter teórico y los límites para resultados conjuntos; verificar que la documentación coincide con las funciones y la especificación, sin modificar tasas originales ni inventar probabilidades condicionales.

## 3. Interfaz y análisis

- [x] 3.1 Crear el dashboard en español con catálogo, selector de recompensa y escenario, tasas individuales como fracciones exactas y valores por apertura; añadir pruebas de presentación y verificar con `npm test`.
- [x] 3.2 Mostrar matrices, resultados teóricos estimados por paso y tasas individuales separadamente para ambos escenarios; etiquetar explícitamente las estimaciones, exponer independencia y tasa constante como supuestos y aclarar que no describen de forma confirmada los cofres reales; probar etiquetas y valores de referencia y verificar con `npm test`.
- [x] 3.3 Añadir gráficos comparativos y vista adaptable con alternativas tabulares/textuales; verificar el uso con viewport estrecho y la lectura de valores sin depender del gráfico.
- [x] 3.4 Integrar el simulador con controles para recompensa, escenario, intentos por secuencia y número de secuencias; presentar la frecuencia simulada junto a la estimación teórica y mensajes que aclaren su diferencia, el carácter teórico y los límites para resultados conjuntos. Probar los controles, resultados y límites, y verificar con `npm test`.

## 4. Validación y publicación

- [x] 4.1 Confirmar antes de publicar los enlaces exactos y la fecha de consulta de Epic Games Support y Fortnite.GG, sin cambiar tasas salvo que la fuente lo respalde; verificar que cada valor mostrado conserva su procedencia.
- [x] 4.2 Ejecutar la suite completa, la compilación de producción y una revisión visual de los escenarios normal y Treasure Hour en tamaños de pantalla amplio y estrecho; verificar que todos pasan antes de habilitar la publicación estática desde GitHub.
