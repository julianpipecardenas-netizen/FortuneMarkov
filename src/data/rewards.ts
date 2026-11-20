export type Scenario = 'normal' | 'treasure-hour'

export type RewardRate = {
  numerator: 1
  denominator: number
  source: 'Epic Games'
  sourceUrl: string
  provenanceVerified: true
  classification: 'published' | 'derived'
}

export type Reward = {
  id: string
  name: string
  imageSrc: string
  rates: Record<Scenario, RewardRate>
}

export const sourceReferences = {
  epicGames: {
    name: 'Epic Games',
    url: 'https://www.epicgames.com/help/c-34254770/c-33726977/what-are-the-drop-rates-of-treasure-in-chests-in-fortnite-battle-royale-s-pirate-treasure-event-a14361627',
  },
  fortniteGG: {
    name: 'Fortnite.GG',
    url: 'https://fortnite.gg/treasure-hunt/odds',
  },
} as const

const epicPublished = (denominator: number): RewardRate => ({
  numerator: 1,
  denominator,
  source: 'Epic Games',
  sourceUrl: sourceReferences.epicGames.url,
  provenanceVerified: true,
  classification: 'published',
})

const epicMultiplierDerived = (denominator: number): RewardRate => ({
  numerator: 1,
  denominator,
  source: 'Epic Games',
  sourceUrl: sourceReferences.epicGames.url,
  provenanceVerified: true,
  classification: 'derived',
})

export const rewards: Reward[] = [
  {
    id: 'weekly-gold',
    name: 'Traje dorado semanal',
    imageSrc: '/images/rewards/weekly-gold-outfit.jpg',
    rates: {
      normal: epicPublished(1562500),
      'treasure-hour': epicMultiplierDerived(208333),
    },
  },
  {
    id: 'pirate-shop',
    name: 'Acceso a la tienda pirata',
    imageSrc: '/images/rewards/pirate-shop.webp',
    rates: {
      normal: epicPublished(137500),
      'treasure-hour': epicMultiplierDerived(91667),
    },
  },
  {
    id: 'vehicle-decal',
    name: 'Vehículo y calcomanía semanal',
    imageSrc: '/images/rewards/weekly-vehicle.webp',
    rates: {
      normal: epicPublished(7813),
      'treasure-hour': epicMultiplierDerived(781),
    },
  },
  {
    id: 'pickaxe-blings',
    name: 'Pico o accesorio mochilero semanal',
    imageSrc: '/images/rewards/weekly-pickaxe-backbling.jpg',
    rates: {
      normal: epicPublished(568),
      'treasure-hour': epicMultiplierDerived(568),
    },
  },
  {
    id: 'jam-track',
    name: 'Pista musical semanal',
    imageSrc: '/images/rewards/weekly-jam-track.jpg',
    rates: {
      normal: epicPublished(391),
      'treasure-hour': epicMultiplierDerived(391),
    },
  },
  {
    id: 'loading-screen',
    name: 'Pantalla de carga semanal',
    imageSrc: '/images/rewards/weekly-loading-screen.jpg',
    rates: {
      normal: epicPublished(272),
      'treasure-hour': epicMultiplierDerived(272),
    },
  },
  {
    id: 'gizmo',
    name: 'Cualquier artilugio',
    imageSrc: '/images/rewards/any-gizmo.webp',
    rates: {
      normal: epicPublished(127),
      'treasure-hour': epicMultiplierDerived(127),
    },
  },
]

export const scenarioLabel: Record<Scenario, string> = {
  normal: 'Normal',
  'treasure-hour': 'Hora del tesoro',
}

export const formatFraction = (rate: RewardRate) =>
  `1/${new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(rate.denominator)}`

export const fractionToProbability = (rate: RewardRate) =>
  rate.numerator / rate.denominator
