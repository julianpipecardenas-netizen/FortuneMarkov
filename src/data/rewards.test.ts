import { describe, expect, it } from 'vitest'
import { formatFraction, fractionToProbability, rewards, sourceReferences } from './rewards'

describe('catálogo de recompensas', () => {
  it('incluye exactamente siete recompensas', () => {
    expect(rewards).toHaveLength(7)
  })

  it('asocia una imagen local con cada recompensa', () => {
    expect(rewards.map(({ id, imageSrc }) => [id, imageSrc])).toEqual([
      ['weekly-gold', '/images/rewards/weekly-gold-outfit.jpg'],
      ['pirate-shop', '/images/rewards/pirate-shop.webp'],
      ['vehicle-decal', '/images/rewards/weekly-vehicle.webp'],
      ['pickaxe-blings', '/images/rewards/weekly-pickaxe-backbling.jpg'],
      ['jam-track', '/images/rewards/weekly-jam-track.jpg'],
      ['loading-screen', '/images/rewards/weekly-loading-screen.jpg'],
      ['gizmo', '/images/rewards/any-gizmo.webp'],
    ])
  })

  it('conserva los denominadores proporcionados', () => {
    expect(
      rewards.map(({ id, name, rates }) => ({
        id,
        name,
        normal: rates.normal.denominator,
        treasureHour: rates['treasure-hour'].denominator,
      })),
    ).toEqual([
      {
        id: 'weekly-gold',
        name: 'Traje dorado semanal',
        normal: 1562500,
        treasureHour: 208333,
      },
      {
        id: 'pirate-shop',
        name: 'Acceso a la tienda pirata',
        normal: 137500,
        treasureHour: 91667,
      },
      {
        id: 'vehicle-decal',
        name: 'Vehículo y calcomanía semanal',
        normal: 7813,
        treasureHour: 781,
      },
      {
        id: 'pickaxe-blings',
        name: 'Pico o accesorio mochilero semanal',
        normal: 568,
        treasureHour: 568,
      },
      {
        id: 'jam-track',
        name: 'Pista musical semanal',
        normal: 391,
        treasureHour: 391,
      },
      {
        id: 'loading-screen',
        name: 'Pantalla de carga semanal',
        normal: 272,
        treasureHour: 272,
      },
      { id: 'gizmo', name: 'Cualquier artilugio', normal: 127, treasureHour: 127 },
    ])
  })

  it('distingue tasas normales publicadas de fracciones de Hora del tesoro derivadas', () => {
    for (const reward of rewards) {
      expect(reward.rates.normal).toMatchObject({
        source: 'Epic Games',
        sourceUrl: sourceReferences.epicGames.url,
        provenanceVerified: true,
        classification: 'published',
      })
      expect(reward.rates['treasure-hour']).toMatchObject({
        source: 'Epic Games',
        sourceUrl: sourceReferences.epicGames.url,
        provenanceVerified: true,
        classification: 'derived',
      })
    }
  })

  it('conserva las referencias oficiales y complementarias indicadas', () => {
    expect(sourceReferences).toEqual({
      epicGames: {
        name: 'Epic Games',
        url: 'https://www.epicgames.com/help/c-34254770/c-33726977/what-are-the-drop-rates-of-treasure-in-chests-in-fortnite-battle-royale-s-pirate-treasure-event-a14361627',
      },
      fortniteGG: {
        name: 'Fortnite.GG',
        url: 'https://fortnite.gg/treasure-hunt/odds',
      },
    })
  })

  it('formatea las catorce fracciones con agrupación española uniforme', () => {
    expect(
      rewards.flatMap(({ rates }) => [
        formatFraction(rates.normal),
        formatFraction(rates['treasure-hour']),
      ]),
    ).toEqual([
      '1/1.562.500',
      '1/208.333',
      '1/137.500',
      '1/91.667',
      '1/7.813',
      '1/781',
      '1/568',
      '1/568',
      '1/391',
      '1/391',
      '1/272',
      '1/272',
      '1/127',
      '1/127',
    ])
  })

  it('convierte fracciones sin cambiar los datos originales', () => {
    expect(fractionToProbability(rewards[6].rates.normal)).toBeCloseTo(1 / 127, 12)
  })
})
