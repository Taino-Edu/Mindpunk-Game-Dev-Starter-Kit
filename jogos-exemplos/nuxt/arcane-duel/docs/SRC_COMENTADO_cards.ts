// =============================================================
// SRC_COMENTADO_cards.ts — Arcane Duel
// =============================================================
// Este arquivo define os DADOS do jogo.
// Importante: ele NÃO tem lógica. Só descreve o que existe.
// A lógica de como as cartas funcionam fica em useGame.ts.
//
// Princípio: "Separação de Dados e Lógica"
// =============================================================


// ── TIPOS ────────────────────────────────────────────────────
//
// TypeScript usa "types" e "interfaces" para descrever formatos.
// Aqui definimos o formato de uma carta.

export type CardType = 'attack' | 'defense' | 'heal' | 'drain'
//                      ↑ ataca     ↑ defende    ↑ cura   ↑ combinado

// CardDef = "Card Definition" = a DEFINIÇÃO de um tipo de carta
// É como a "classe" ou "receita" da carta, não uma instância específica.
export interface CardDef {
  id: string          // identificador único do TIPO: 'fireball', 'stone_wall', etc.
  name: string        // nome exibido na tela
  type: CardType      // qual categoria (afeta como a IA prioriza)
  attack: number      // quanto de dano causa (0 se não ataca)
  defense: number     // quanto de armadura adiciona (0 se não defende)
  heal: number        // quanto de vida restaura (0 se não cura)
  cost: number        // quantos pontos de mana custa para jogar (1–6)
  description: string // texto descritivo exibido na carta
  art: string[]       // array de 4 strings = arte ASCII da carta
  color: string       // cor hex para destacar visualmente
}

// GameCard = uma instância específica da carta NO JOGO
// Herda tudo de CardDef, mas adiciona 'uid' (unique id)
// Por quê? O deck tem 2 cópias de cada carta.
// Ambas têm o mesmo 'id' (tipo), mas 'uid' diferentes (instâncias).
export interface GameCard extends CardDef {
  uid: string  // 'c1', 'c2', 'c47'... gerado quando a carta entra no deck
}


// ── DADOS DAS CARTAS ──────────────────────────────────────────
//
// Este array define TODAS as 12 cartas do jogo.
// Cada carta é um objeto JavaScript simples — só dados, sem métodos.
//
// 🧠 Exercício mental: o que aconteceria se você mudar
//    attack: 8 para attack: 20 na Bola de Fogo?
//    (Dica: procure onde 'attack' é usado em useGame.ts)

const CARD_DEFS: CardDef[] = [

  // ── CARTAS DE ATAQUE ────────────────────────────────────────

  {
    id: 'fireball',
    name: 'BOLA DE FOGO',
    type: 'attack',   // ← IA sabe que esta carta ataca
    attack: 8,        // ← causa 8 de dano (antes da armadura)
    defense: 0,       // ← não adiciona armadura
    heal: 0,          // ← não cura
    cost: 3,          // ← custa 3 de mana
    description: 'Esfera de fogo pura',
    art: [            // ← 4 linhas de arte ASCII (aparecem na carta)
      ' ) ( ( ',
      '( ( ) )',
      ' ) ( ( ',
      '  ~~~  ',
    ],
    color: '#fb923c', // ← cor laranja (CSS hex)
  },

  {
    id: 'lightning',
    name: 'RAIO',
    type: 'attack',
    attack: 11,       // ← alto dano — "quebra" defesas médias
    defense: 0,
    heal: 0,
    cost: 4,          // ← custa mais, mas eficiente (2.75 ATK/◆)
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
    attack: 5,        // ← dano baixo, mas custo baixo (2)
    defense: 0,       // ← bom para começar o jogo (só precisa de 2 mana)
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
    cost: 3,          // ← similar à Bola de Fogo, mas 1 dano a menos
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
    attack: 15,       // ← maior dano do jogo! Pode matar de uma vez
    defense: 0,
    heal: 0,
    cost: 6,          // ← custo alto — só possível nos turnos finais
    description: 'Furia devastadora',
    // 🧠 Exercício: qual turno mínimo você consegue jogar esta carta?
    //    (Mana começa em 3, aumenta +1/turno, máximo 10)
    art: [
      ' \\O/!  ',
      '  |    ',
      ' / \\   ',
      ' RAGE! ',
    ],
    color: '#ef4444',
  },


  // ── CARTAS DE DEFESA ────────────────────────────────────────

  {
    id: 'stone_wall',
    name: 'MURO PEDRA',
    type: 'defense',  // ← IA sabe que esta carta defende
    attack: 0,
    defense: 8,       // ← adiciona 8 de armadura (absorve 8 de dano)
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
    defense: 5,       // ← defesa menor, mas custo de apenas 1 mana!
    heal: 0,
    cost: 1,          // ← a carta mais barata do jogo (5 DEF/◆ = melhor custo-benefício)
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
    defense: 12,      // ← maior armadura do jogo! Aguenta um Berserker (15) com sobra
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


  // ── CARTAS DE DRENO (híbrido) ────────────────────────────────

  {
    id: 'shadow_clone',
    name: 'CLONE SOMBRIO',
    type: 'drain',    // ← tipo especial: faz duas coisas ao mesmo tempo
    attack: 4,        // ← ataca...
    defense: 4,       // ← ...E defende no mesmo turno!
    heal: 0,
    cost: 3,          // ← custo moderado para efeito duplo
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
    attack: 5,        // ← ataca...
    defense: 0,
    heal: 4,          // ← ...E CURA ao mesmo tempo!
    cost: 3,
    description: 'Rouba vida inimiga',
    // 🧠 Conceito: "lifestealing" — clássico em jogos de cartas
    art: [
      '}-->-{ ',
      '}     {',
      '}--<--{',
      ' drain ',
    ],
    color: '#c084fc',
  },


  // ── CARTAS DE CURA ────────────────────────────────────────────

  {
    id: 'healing_potion',
    name: 'POCAO CURA',
    type: 'heal',
    attack: 0,
    defense: 0,
    heal: 8,          // ← restaura 8 HP
    cost: 2,          // ← bom custo-benefício (4 HP/◆)
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
    heal: 15,         // ← cura massiva — pode virar o jogo completamente
    cost: 5,          // ← custo alto, só disponível nos turnos finais
    description: 'Cura divina maxima',
    // 🧠 A IA prioriza esta carta quando HP < 8
    //    Veja aiPickCard() em useGame.ts
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

// =============================================================
// RESUMO DO QUE VOCÊ APRENDEU:
//
// 1. TypeScript usa interfaces para descrever o formato dos dados
// 2. 'extends' herda campos de outra interface (GameCard extends CardDef)
// 3. Dados puros (sem métodos) são mais fáceis de modificar
// 4. A IA em useGame.ts usa 'card.type', 'card.attack', 'card.heal'
//    para tomar decisões — mudar esses valores MUDA o comportamento da IA!
// =============================================================
