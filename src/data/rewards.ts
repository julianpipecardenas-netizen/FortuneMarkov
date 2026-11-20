export type Scenario = 'normal' | 'treasure-hour'

export type RewardRate = {
  numerator: 1
  denominator: number
  source: 'Epic Games Support' | 'Fortnite.GG' | 'Referencia proporcionada'
  sourceUrl?: string
  reviewedAt?: string
  provenanceVerified: boolean
  classification: 'published' | 'derived' | 'unverified'
}

export type Reward = {
  id: string
  name: string
  rates: Record<Scenario, RewardRate>
}

const epicUrl =
  'https://www.epicgames.com/help/c-34254770/c-33726977/what-are-the-drop-rates-of-treasure-in-chests-in-fortnite-battle-royale-s-pirate-treasure-event-a14361627'

const unverified = (denominator: number): RewardRate => ({
  numerator: 1,
  denominator,
  source: 'Referencia proporcionada',
  provenanceVerified: false,
  classification: 'unverified',
})

const epicPublished = (denominator: number): RewardRate => ({
  numerator: 1,
  denominator,
  source: 'Epic Games Support',
  sourceUrl: epicUrl,
  reviewedAt: '2026-11-20',
  provenanceVerified: true,
  classification: 'published',
})

const epicDerived = (denominator: number): RewardRate => ({
  numerator: 1,
  denominator,
  source: 'Epic Games Support',
  sourceUrl: epicUrl,
  reviewedAt: '2026-11-20',
  provenanceVerified: true,
  classification: 'derived',
})

export const rewards: Reward[] = [
  {
    id: 'weekly-gold',
    name: 'Weekly Gold Outfit',
    rates: {
      normal: epicPublished(1562500),
      'treasure-hour': epicDerived(208333),
    },
  },
  {
    id: 'pirate-shop',
    name: 'Pirate Shop Access',
    rates: {
      normal: epicPublished(137500),
      'treasure-hour': epicDerived(91667),
    },
  },
  {
    id: 'vehicle-decal',
    name: 'Weekly Vehicle & Decal',
    rates: {
      normal: epicPublished(7813),
      'treasure-hour': epicDerived(781),
    },
  },
  {
    id: 'pickaxe-blings',
    name: 'Weekly Pickaxe or Back Bling',
    rates: {
      normal: epicPublished(568),
      'treasure-hour': unverified(568),
    },
  },
  {
    id: 'jam-track',
    name: 'Weekly Jam Track',
    rates: {
      normal: epicPublished(391),
      'treasure-hour': unverified(391),
    },
  },
  {
    id: 'loading-screen',
    name: 'Weekly Loading Screen',
    rates: {
      normal: epicPublished(272),
      'treasure-hour': unverified(272),
    },
  },
  {
    id: 'gizmo',
    name: 'Any Gizmo',
    rates: {
      normal: epicPublished(127),
      'treasure-hour': unverified(127),
    },
  },
]

export const scenarioLabel: Record<Scenario, string> = {
  normal: 'Normal',
  'treasure-hour': 'Treasure Hour',
}

export const formatFraction = (rate: RewardRate) =>
  `1/${new Intl.NumberFormat('es-ES').format(rate.denominator)}`

export const fractionToProbability = (rate: RewardRate) =>
  rate.numerator / rate.denominator
