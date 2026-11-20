# Tasks

## 1. Base del proyecto

- [x] 1.1 Inicializar la SPA React/TypeScript con Vite y scripts de desarrollo, pruebas y compilación; verificar que la instalación y `npm run build` terminan correctamente.
- [x] 1.2 Preparar la configuración mínima de CI para instalar dependencias, ejecutar pruebas y compilar en GitHub Actions; verificar la ejecución del workflow en una rama de prueba.

## 2. Datos y modelo matemático

- [x] 2.1 Crear el catálogo tipado con las siete recompensas, los catorce denominadores originales y la procedencia diferenciada: tasas normales publicadas por Epic y fracciones de Hora del tesoro derivadas de multiplicadores publicados por Epic. Añadir pruebas para denominadores y clasificación de fuentes.
- [x] 2.2 Verificar la conversión y el modelo de dos estados para las catorce tasas del catálogo y los pasos 1, 3, 5 y 10; comprobar la absorción y la equivalencia con `1 - (1 - p)^n` sin cambiar la matriz ni la fórmula.
- [x] 2.3 Implementar una simulación aleatoria de una recompensa con selección de recompensa y escenario, intentos por secuencia y cantidad de secuencias; mostrar resultados y frecuencia de adquisición comparados con la estimación teórica. Mantener el generador aleatorio inyectable y advertir que la simulación ilustra el modelo teórico, no necesariamente la mecánica real de Fortnite; añadir pruebas deterministas y verificar con `npm test`.
- [x] 2.4 Armonizar `spec.md`, `design.md` y `README.md` con los nombres en español, las fracciones originales, los enlaces a fuentes, la diferencia entre tasas publicadas y fracciones derivadas, y las hipótesis y límites del modelo.

## 3. Interfaz y análisis

- [x] 3.1 Mantener el dashboard en español y mostrar las catorce tasas como fracciones exactas con agrupación española uniforme, incluyendo `1/7.813`; añadir pruebas de formato y presentación.
- [x] 3.2 Formatear los porcentajes convirtiendo primero la probabilidad a porcentaje, conservar precisión para valores pequeños y probar valores pequeños, medios y grandes junto con las estimaciones de 1, 3, 5 y 10 pasos; mantener visibles los supuestos y límites teóricos.
- [x] 3.3 Añadir gráficos comparativos y vista adaptable con alternativas tabulares/textuales; verificar el uso con viewport estrecho y la lectura de valores sin depender del gráfico.
- [x] 3.4 Integrar el simulador con controles para recompensa, escenario, intentos por secuencia y número de secuencias; presentar la frecuencia simulada junto a la estimación teórica y mensajes que aclaren su diferencia, el carácter teórico y los límites para resultados conjuntos. Probar los controles, resultados y límites, y verificar con `npm test`.

## 4. Validación y publicación

- [x] 4.1 Conservar los enlaces proporcionados a Epic Games y Fortnite.GG, marcar las tasas normales como publicadas por Epic y las fracciones de Hora del tesoro como derivadas de sus multiplicadores; no inferir cifras de multiplicadores no documentadas.
- [x] 4.2 Ejecutar pruebas, compilación, `git diff --check` y revisión visual en pantallas amplias y estrechas; comprobar en navegador la representación correcta de probabilidades pequeñas antes de cerrar el cambio.
