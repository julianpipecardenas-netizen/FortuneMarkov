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
  sourceReferences,
  type Scenario,
} from './data/rewards'
import {
  cumulativeEstimate,
  distributionAfterSteps,
  twoStateMatrix,
} from './math/model'
import { simulateReward } from './math/simulation'

const steps = [1, 3, 5, 10]

function RewardThumbnail({ name, src }: { name: string; src: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (failedSrc === src) {
    return (
      <span
        className="reward-thumbnail reward-thumbnail-fallback"
        role="img"
        aria-label={`Imagen no disponible para ${name}`}
        title="Imagen no disponible"
      >
        <span aria-hidden="true">✦</span>
      </span>
    )
  }

  return (
    <img
      className="reward-thumbnail"
      src={src}
      alt={`Imagen de ${name}`}
      onError={() => setFailedSrc(src)}
    />
  )
}

export function percent(value: number) {
  const percentage = value * 100
  const maximumFractionDigits = percentage < 0.000001 ? 15 : 6
  return (
    percentage.toLocaleString('es-ES', { maximumFractionDigits }) + ' %'
  )
}

function provenance(rate: (typeof rewards)[number]['rates'][Scenario]) {
  if (rate.classification === 'published') {
    return `Fuente: ${rate.source}; tasa publicada (verificada)`
  }
  return `Fuente: ${rate.source}; fracción derivada de multiplicador publicado (verificada)`
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
        <div className="brand-mark" aria-hidden="true">FM</div>
        <div className="hero-copy">
          <p className="eyebrow">Análisis de botín <span>·</span> Modelo teórico</p>
          <h1>Fortune<span>Markov</span></h1>
          <p>
            Explora las tasas de referencia y la adquisición individual con sus hipótesis a la vista.
          </p>
        </div>
        <span className="hero-tag">RECOMPENSAS</span>
      </header>

      <section className="notice" aria-label="Advertencia del modelo">
        <span className="notice-icon" aria-hidden="true">!</span>
        <p>
          <strong>Modelo teórico:</strong> las estimaciones suponen intentos independientes y una tasa
          constante mientras no se obtenga la recompensa. No confirman el funcionamiento real de los
          cofres de Fortnite ni justifican probabilidades conjuntas.
        </p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Probabilidades de obtención</p>
            <h2>Catálogo de recompensas</h2>
          </div>
          <span className="count-badge">07 ELEMENTOS</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recompensa</th>
                <th>Normal <span className="th-unit">POR APERTURA</span></th>
                <th>Hora del tesoro <span className="th-unit">POR APERTURA</span></th>
                <th>Procedencia</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="reward-identity">
                      <RewardThumbnail name={item.name} src={item.imageSrc} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{formatFraction(item.rates.normal)}</td>
                  <td>{formatFraction(item.rates['treasure-hour'])}</td>
                  <td className="provenance-cell">
                    <span>{provenance(item.rates.normal)}</span>
                    <span>{provenance(item.rates['treasure-hour'])}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Probabilidad individual</p>
            <h2>Analizar una recompensa</h2>
          </div>
        </div>
        <div className="controls">
          <label>
            Recompensa
            <span className="select-with-thumbnail">
              <RewardThumbnail name={reward.name} src={reward.imageSrc} />
              <select
                aria-label="Recompensa"
                value={rewardId}
                onChange={(event) => setRewardId(event.target.value)}
              >
                {rewards.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <label>
            Escenario
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as Scenario)}
            >
              <option value="normal">Normal</option>
              <option value="treasure-hour">{scenarioLabel['treasure-hour']}</option>
            </select>
          </label>
        </div>

        <div className="metrics">
          <article>
            <span>Tasa individual por apertura</span>
            <strong>{formatFraction(rate)}</strong>
            <small>{percent(probability)} <span className="metric-unit">por apertura</span></small>
          </article>
          <article>
            <span>Escenario seleccionado</span>
            <strong>{scenarioLabel[scenario]}</strong>
            <small className={`status-label ${rate.classification}`}>{provenance(rate)}</small>
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
            <p className="small">El estado «Recompensa obtenida» es absorbente: permanece en 1.</p>
          </article>

          <article>
            <h3>Probabilidad acumulada estimada</h3>
            <table>
              <thead>
                <tr>
                  <th>Pasos</th>
                  <th>Cofre sin recompensa</th>
                  <th>Recompensa obtenida</th>
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
            <p className="small">
              «Cofre sin recompensa» indica que aún no se ha obtenido la recompensa seleccionada;
              no significa que el cofre esté vacío.
            </p>
          </article>
        </div>

        <h3 className="subsection-title">Comparación acumulada <span>Normal / Hora del tesoro</span></h3>
        <div className="chart" aria-label="Gráfico de comparación acumulada">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison}>
              <CartesianGrid stroke="#303236" strokeDasharray="3 3" />
              <XAxis dataKey="step" stroke="#8c9097" tickLine={false} axisLine={false} />
              <YAxis unit="%" stroke="#8c9097" tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => percent(Number(value) / 100)}
                labelFormatter={(value) => `${value} pasos`}
                contentStyle={{
                  background: '#17191b',
                  border: '1px solid #3a3b3e',
                  borderRadius: '10px',
                  color: '#f4f1e9',
                }}
                labelStyle={{ color: '#d8b15a' }}
              />
              <Legend
                content={() => (
                  <ul className="chart-legend" aria-label="Leyenda del gráfico">
                    <li>
                      <span className="chart-legend-marker normal" aria-hidden="true" />
                      Normal
                    </li>
                    <li>
                      <span className="chart-legend-marker treasure-hour" aria-hidden="true" />
                      Hora del tesoro
                    </li>
                  </ul>
                )}
              />
              <Bar dataKey="Normal" name="Normal" fill="#d8b15a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Treasure Hour" name="Hora del tesoro" fill="#92979e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="text-alternative" aria-label="Alternativa textual del gráfico">
          <thead>
            <tr>
              <th>Pasos</th>
              <th>Normal</th>
              <th>Hora del tesoro</th>
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
        <div className="section-heading">
          <div>
            <p className="eyebrow">Experimento aleatorio</p>
            <h2>Simulador de una recompensa</h2>
          </div>
          <span className="count-badge">UNA RECOMPENSA</span>
        </div>
        <div className="simulator-reward">
          <RewardThumbnail name={reward.name} src={reward.imageSrc} />
          <div>
            <span>Recompensa y escenario seleccionados</span>
            <strong>{reward.name}</strong>
          </div>
          <span className="scenario-chip">{scenarioLabel[scenario]}</span>
        </div>
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
          <span className="notice-icon" aria-hidden="true">!</span>
          <span>Esta simulación usa Bernoulli por intento y detiene una secuencia al adquirir la
          recompensa. Es una ilustración del modelo teórico, no una reproducción confirmada de la
          mecánica real de Fortnite.</span>
        </p>
        <p className="small">
          No se simula el botín completo ni resultados conjuntos. Las siete tasas marginales no
          permiten inferir exclusividad, probabilidades condicionales ni un estado residual.
        </p>
      </section>

      <footer>
        Fuente oficial principal:{' '}
        <a href={sourceReferences.epicGames.url} target="_blank" rel="noreferrer">
          Epic Games
        </a>
        {' · '}Referencia complementaria para las tasas normales:{' '}
        <a href={sourceReferences.fortniteGG.url} target="_blank" rel="noreferrer">
          Fortnite.GG
        </a>
        . Las fracciones de Hora del tesoro expresan las tasas resultantes de los multiplicadores
        publicados por Epic; los denominadores originales se conservan. El balance puede cambiar
        con las actualizaciones del juego.
      </footer>
    </main>
  )
}

export default App
