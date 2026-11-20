import { describe, expect, it } from 'vitest'
import { fractionToProbability, rewards } from '../data/rewards'
import { cumulativeEstimate, distributionAfterSteps, twoStateMatrix } from './model'

describe('modelo teórico de dos estados', () => {
  it('construye la matriz y es absorbente', () => {
    const p = 0.25
    expect(twoStateMatrix(p)).toEqual([[0.75, 0.25], [0, 1]])
  })

  it('calcula la probabilidad acumulada para 1, 3, 5 y 10 pasos', () => {
    const p = 1 / 127
    for (const n of [1, 3, 5, 10]) {
      expect(cumulativeEstimate(p, n)).toBeCloseTo(1 - Math.pow(1 - p, n), 12)
    }
  })

  it('conserva la distribución entre estados tras cada potencia', () => {
    const p = 0.2
    for (const n of [1, 3, 5, 10]) {
      const [notObtained, obtained] = distributionAfterSteps(p, n)
      expect(notObtained + obtained).toBeCloseTo(1, 12)
      expect(obtained).toBeCloseTo(cumulativeEstimate(p, n), 12)
    }
  })

  it('mantiene coherencia con las catorce tasas del catálogo en 1, 3, 5 y 10 pasos', () => {
    for (const reward of rewards) {
      for (const rate of Object.values(reward.rates)) {
        const probability = fractionToProbability(rate)
        const matrix = twoStateMatrix(probability)
        expect(matrix[0][1]).toBeCloseTo(1 / rate.denominator, 15)
        expect(matrix[1]).toEqual([0, 1])

        for (const steps of [1, 3, 5, 10]) {
          const expected = 1 - Math.pow(1 - probability, steps)
          const [notObtained, obtained] = distributionAfterSteps(probability, steps)
          expect(cumulativeEstimate(probability, steps)).toBeCloseTo(expected, 12)
          expect(obtained).toBeCloseTo(expected, 12)
          expect(notObtained).toBeCloseTo(1 - expected, 12)
          expect(notObtained + obtained).toBeCloseTo(1, 12)
        }
      }
    }
  })
})
