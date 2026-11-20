import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'
import {
  formatFraction,
  fractionToProbability,
  rewards,
  scenarioLabel,
  type Scenario,
} from './data/rewards'
import {
  cumulativeEstimate,
  distributionAfterSteps,
  twoStateMatrix,
} from './math/model'
import { simulateReward } from './math/simulation'

const steps = [1, 3, 5, 10]

function percent(value: number) {
  if (value === 0) return '0%'
  if (value < 0.000001) return value.toExponential(3) + '%'
  return (value * 100).toLocaleString('es-ES', { maximumFractionDigits: 6 }) + '%'
}

function provenance(rate: (typeof rewards)[number]['rates'][Scenario]) {
  if (rate.classification === 'published') return 'Epic publicado; verificado'
  if (rate.classification === 'derived') return 'Epic multiplicador; derivado; verificado'
  return 'Datos proporcionados; no verificados'
}

function App() {
  const [rewardId, setRewardId] = useState(rewards[0].id)
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [attempts, setAttempts] = useState(10)
  const [sequences, setSequences] = useState(1000)
  const [simulation, setSimulation] = useState(() =>
    simulateReward(fractionToProbability(rewards[0].rates.normal), 10, 1000),
  )

  const reward = rewards.find((item) => item.id === rewardId) ?? rewards[0]
  const rate = reward.rates[scenario]
  const probability = fractionToProbability(rate)
  const matrix = twoStateMatrix(probability)

  const comparison = useMemo(
    () =>
      steps.map((step) => ({
        step,
        Normal: cumulativeEstimate(fractionToProbability(reward.rates.normal), step) * 100,
        'Treasure Hour':
          cumulativeEstimate(fractionToProbability(reward.rates['treasure-hour']), step) * 100,
      })),
    [reward],
  )

  const runSimulation = () => {
    setSimulation(simulateReward(probability, attempts, sequences))
  }

  return (
    <main>
      <header className="hero-header">
        <p className="eyebrow">Análisis teórico de recompensas</p>
        <h1>FortuneMarkov</h1>
        <p>
          Exploración de tasas de referencia y adquisición individual bajo hipótesis explícitas.
        </p>
      </header>

      <section className="notice" aria-label="Advertencia del modelo">
        <strong>Importante:</strong> las estimaciones usan intentos independientes y una tasa
        constante mientras no se haya obtenido la recompensa. No confirman el funcionamiento real
        de los cofres de Fortnite ni justifican probabilidades conjuntas.
      </section>

      <section className="panel">
        <h2>Catálogo de tasas</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recompensa</th>
                <th>Normal</th>
                <th>Treasure Hour</th>
                <th>Procedencia</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{formatFraction(item.rates.normal)}</td>
                  <td>{formatFraction(item.rates['treasure-hour'])}</td>
                  <td>{provenance(item.rates.normal)} / {provenance(item.rates['treasure-hour'])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Analizar una recompensa</h2>
        <div className="controls">
          <label>
            Recompensa
            <select value={rewardId} onChange={(event) => setRewardId(event.target.value)}>
              {rewards.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Escenario
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as Scenario)}
            >
              <option value="normal">Normal</option>
              <option value="treasure-hour">Treasure Hour</option>
            </select>
          </label>
        </div>

        <div className="metrics">
          <article>
            <span>Tasa individual por apertura</span>
            <strong>{formatFraction(rate)}</strong>
            <small>{percent(probability)}</small>
          </article>
          <article>
            <span>Escenario seleccionado</span>
            <strong>{scenarioLabel[scenario]}</strong>
            <small>
              {rate.classification === 'published'
                ? 'Publicado por Epic; verificado'
                : rate.classification === 'derived'
                  ? 'Derivado de multiplicador Epic; verificado'
                  : 'Referencia no verificada'}
            </small>
          </article>
        </div>

        <div className="grid-two">
          <article>
            <h3>Matriz teórica de dos estados</h3>
            <p>[[1-p, p], [0, 1]] · Filas: estado actual; columnas: estado siguiente</p>
            <table className="matrix" aria-label="Matriz teórica">
              <tbody>
                {matrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((value, columnIndex) => (
                      <td key={columnIndex}>{value.toPrecision(10)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small">El estado `Obtained` es absorbente: permanece en 1.</p>
          </article>

          <article>
            <h3>Probabilidad acumulada estimada</h3>
            <table>
              <thead>
                <tr>
                  <th>Pasos</th>
                  <th>Not Obtained</th>
                  <th>Al menos una vez</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => {
                  const [notObtained, obtained] = distributionAfterSteps(probability, step)
                  return (
                    <tr key={step}>
                      <td>{step}</td>
                      <td>{percent(notObtained)}</td>
                      <td>{percent(obtained)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </article>
        </div>

        <h3>Comparación Normal / Treasure Hour</h3>
        <div className="chart" aria-label="Gráfico de comparación acumulada">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis unit="%" />
              <Tooltip
                formatter={(value) => percent(Number(value) / 100)}
                labelFormatter={(value) => `${value} pasos`}
              />
              <Legend />
              <Bar dataKey="Normal" fill="#4f46e5" />
              <Bar dataKey="Treasure Hour" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="text-alternative" aria-label="Alternativa textual del gráfico">
          <thead>
            <tr>
              <th>Pasos</th>
              <th>Normal</th>
              <th>Treasure Hour</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.step}>
                <td>{row.step}</td>
                <td>{percent(row.Normal / 100)}</td>
                <td>{percent(row['Treasure Hour'] / 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Simulador de una recompensa</h2>
        <div className="controls">
          <label>
            Intentos por secuencia
            <input
              type="number"
              min="1"
              max="100000"
              value={attempts}
              onChange={(event) => setAttempts(Number(event.target.value))}
            />
          </label>
          <label>
            Cantidad de secuencias
            <input
              type="number"
              min="1"
              max="100000"
              value={sequences}
              onChange={(event) => setSequences(Number(event.target.value))}
            />
          </label>
          <button type="button" onClick={runSimulation}>
            Ejecutar simulación
          </button>
        </div>
        {simulation && (
          <div className="metrics">
            <article>
              <span>Frecuencia simulada</span>
              <strong>{percent(simulation.frequency)}</strong>
              <small>
                {simulation.acquiredSequences} de {simulation.sequenceCount} secuencias
              </small>
            </article>
            <article>
              <span>Estimación teórica</span>
              <strong>{percent(simulation.theoreticalEstimate)}</strong>
              <small>1 - (1 - p)^n</small>
            </article>
          </div>
        )}
        <p className="notice">
          Esta simulación usa Bernoulli por intento y detiene una secuencia al adquirir la
          recompensa. Es una ilustración del modelo teórico, no una reproducción confirmada de la
          mecánica real de Fortnite.
        </p>
        <p className="small">
          No se simula el botín completo ni resultados conjuntos. Las siete tasas marginales no
          permiten inferir exclusividad, probabilidades condicionales ni un estado residual.
        </p>
      </section>

      <footer>
        Las fuentes o tasas pueden cambiar. Los valores normales están respaldados por Epic
        Games Support; tres denominadores de Treasure Hour son cálculos derivados de
        multiplicadores publicados y no tasas publicadas directamente. Fortnite.GG no está
        registrado como fuente verificada. Consulta: 20/11/2026.
      </footer>
    </main>
  )
}

export default App
