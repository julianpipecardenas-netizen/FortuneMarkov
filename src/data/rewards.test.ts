import { describe, expect, it } from 'vitest'
import { formatFraction, fractionToProbability, rewards } from './rewards'

describe('catálogo de recompensas', () => {
  it('incluye exactamente siete recompensas', () => {
    expect(rewards).toHaveLength(7)
  })

  it('conserva los denominadores proporcionados', () => {
    expect(formatFraction(rewards[0].rates.normal)).toBe('1/1.562.500')
    expect(rewards[1].rates.normal.denominator).toBe(137500)
  })

  it('distingue procedencia Epic publicada, derivada y no verificada', () => {
    expect(rewards[0].rates.normal.provenanceVerified).toBe(true)
    expect(rewards[0].rates.normal.classification).toBe('published')
    expect(rewards[0].rates['treasure-hour'].classification).toBe('derived')
    expect(rewards[6].rates['treasure-hour'].provenanceVerified).toBe(false)
  })

  it('convierte fracciones sin cambiar los datos originales', () => {
    expect(fractionToProbability(rewards[6].rates.normal)).toBeCloseTo(1 / 127, 12)
  })
})
