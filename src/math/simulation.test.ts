import { describe, expect, it } from 'vitest'
import { simulateReward } from './simulation'

describe('simulador de una recompensa', () => {
  it('usa un generador inyectable y produce un resultado determinista', () => {
    const alwaysSuccess = () => 0
    const result = simulateReward(0.5, 10, 100, alwaysSuccess)
    expect(result.acquiredSequences).toBe(100)
    expect(result.frequency).toBe(1)
  })

  it('rechaza intentos o secuencias no válidos', () => {
    expect(() => simulateReward(0.5, 0, 10)).toThrow()
  })
})
