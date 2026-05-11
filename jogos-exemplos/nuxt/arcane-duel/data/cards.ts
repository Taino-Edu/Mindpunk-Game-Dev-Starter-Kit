export type CardType = 'attack' | 'defense' | 'heal' | 'drain'

export interface CardDef {
  id: string
  name: string
  type: CardType
  attack: number
  defense: number
  heal: number
  cost: number
  description: string
  art: string[]
  color: string
}

export interface GameCard extends CardDef {
  uid: string
}

const CARD_DEFS: CardDef[] = [
  {
    id: 'fireball',
    name: 'BOLA DE FOGO',
    type: 'attack',
    attack: 8,
    defense: 0,
    heal: 0,
    cost: 3,
    description: 'Esfera de fogo pura',
    art: [
      ' ) ( ( ',
      '( ( ) )',
      ' ) ( ( ',
      '  ~~~  ',
    ],
    color: '#fb923c',
  },
  {
    id: 'lightning',
    name: 'RAIO',
    type: 'attack',
    attack: 11,
    defense: 0,
    heal: 0,
    cost: 4,
    description: 'Destruicao eletrica',
    art: [
      '  \\|/  ',
      '  -o-  ',
      '  /|\\  ',
      ' ~~~~~ ',
    ],
    color: '#fbbf24',
  },
  {
    id: 'ice_shard',
    name: 'GELO',
    type: 'attack',
    attack: 5,
    defense: 0,
    heal: 0,
    cost: 2,
    description: 'Lancas de gelo',
    art: [
      '  *|*  ',
      ' * | * ',
      '  * *  ',
      '  ^^^  ',
    ],
    color: '#67e8f9',
  },
  {
    id: 'dragon_strike',
    name: 'GARRA DRAGAO',
    type: 'attack',
    attack: 7,
    defense: 0,
    heal: 0,
    cost: 3,
    description: 'Ataque draconico',
    art: [
      ' /\\ /\\ ',
      '|  V  |',
      ' \\   / ',
      '  \\ /  ',
    ],
    color: '#f97316',
  },
  {
    id: 'berserker',
    name: 'BERSERKER',
    type: 'attack',
    attack: 15,
    defense: 0,
    heal: 0,
    cost: 6,
    description: 'Furia devastadora',
    art: [
      ' \\O/!  ',
      '  |    ',
      ' / \\   ',
      ' RAGE! ',
    ],
    color: '#ef4444',
  },
  {
    id: 'stone_wall',
    name: 'MURO PEDRA',
    type: 'defense',
    attack: 0,
    defense: 8,
    heal: 0,
    cost: 2,
    description: 'Barreira solida',
    art: [
      ' ##### ',
      ' # | # ',
      ' ##### ',
      ' # | # ',
    ],
    color: '#9ca3af',
  },
  {
    id: 'magic_shield',
    name: 'ESCUDO MAGICO',
    type: 'defense',
    attack: 0,
    defense: 5,
    heal: 0,
    cost: 1,
    description: 'Protecao arcana',
    art: [
      ' .oOo. ',
      'o  **  o',
      ' o ** o ',
      '  \\  /  ',
    ],
    color: '#a78bfa',
  },
  {
    id: 'iron_fortress',
    name: 'FORTALEZA',
    type: 'defense',
    attack: 0,
    defense: 12,
    heal: 0,
    cost: 4,
    description: 'Muralha impenetravel',
    art: [
      '[=====]',
      '| /^\\ |',
      '|/___\\|',
      '[=====]',
    ],
    color: '#6b7280',
  },
  {
    id: 'shadow_clone',
    name: 'CLONE SOMBRIO',
    type: 'drain',
    attack: 4,
    defense: 4,
    heal: 0,
    cost: 3,
    description: 'Ataca e defende',
    art: [
      ' o   o ',
      '  \\ /  ',
      '   X   ',
      '  / \\  ',
    ],
    color: '#7c3aed',
  },
  {
    id: 'drain_life',
    name: 'DRENO VIDA',
    type: 'drain',
    attack: 5,
    defense: 0,
    heal: 4,
    cost: 3,
    description: 'Rouba vida inimiga',
    art: [
      '}-->-{ ',
      '}     {',
      '}--<--{',
      ' drain ',
    ],
    color: '#c084fc',
  },
  {
    id: 'healing_potion',
    name: 'POCAO CURA',
    type: 'heal',
    attack: 0,
    defense: 0,
    heal: 8,
    cost: 2,
    description: 'Restaura 8 de vida',
    art: [
      '  (+)  ',
      ' /   \\ ',
      '|  +  |',
      ' \\___/ ',
    ],
    color: '#4ade80',
  },
  {
    id: 'holy_light',
    name: 'LUZ SAGRADA',
    type: 'heal',
    attack: 0,
    defense: 0,
    heal: 15,
    cost: 5,
    description: 'Cura divina maxima',
    art: [
      ' * + * ',
      '+ + + +',
      ' * + * ',
      '  ~~~  ',
    ],
    color: '#fde047',
  },
]

export default CARD_DEFS
