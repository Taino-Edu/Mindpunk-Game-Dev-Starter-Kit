import { reactive, readonly } from 'vue'
import CARD_DEFS from '~/data/cards'
import type { GameCard } from '~/data/cards'

export interface LogEntry {
  id: number
  text: string
  type: 'player' | 'ai' | 'system' | 'heal' | 'damage'
}

export interface GameState {
  phase: 'start' | 'player_turn' | 'ai_thinking' | 'game_over'
  playerHP: number
  aiHP: number
  playerMana: number
  aiMana: number
  playerDefense: number
  aiDefense: number
  playerHand: GameCard[]
  aiHand: GameCard[]
  playerDeckSize: number
  aiDeckSize: number
  log: LogEntry[]
  turn: number
  winner: 'player' | 'ai' | null
  lastPlayerCard: GameCard | null
  lastAiCard: GameCard | null
  aiHandSize: number
}

const MAX_HP = 30
const MAX_MANA = 10
const STARTING_MANA = 3
const STARTING_HAND = 3
const MAX_HAND = 7

let uidCounter = 0
let logIdCounter = 0

function mkUid() { return `c${++uidCounter}` }

function buildDeck(): GameCard[] {
  const deck = [...CARD_DEFS, ...CARD_DEFS].map(c => ({ ...c, uid: mkUid() }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function createInitialState(): GameState {
  const pd = buildDeck()
  const ad = buildDeck()
  const ph = pd.splice(0, STARTING_HAND)
  const ah = ad.splice(0, STARTING_HAND)
  return {
    phase: 'start',
    playerHP: MAX_HP,
    aiHP: MAX_HP,
    playerMana: STARTING_MANA,
    aiMana: STARTING_MANA,
    playerDefense: 0,
    aiDefense: 0,
    playerHand: ph,
    aiHand: ah,
    playerDeckSize: pd.length,
    aiDeckSize: ad.length,
    log: [],
    turn: 1,
    winner: null,
    lastPlayerCard: null,
    lastAiCard: null,
    aiHandSize: ah.length,
    _playerDeck: pd,
    _aiDeck: ad,
  } as any
}

// Module-level singleton so all components share same state
const _internal = reactive<any>(createInitialState())

export function useGame() {
  const state = _internal as GameState

  function addLog(text: string, type: LogEntry['type']) {
    state.log.unshift({ id: logIdCounter++, text, type })
    if (state.log.length > 35) state.log.splice(35)
  }

  function drawCard(who: 'player' | 'ai') {
    const deck: GameCard[] = who === 'player' ? _internal._playerDeck : _internal._aiDeck
    const hand: GameCard[] = who === 'player' ? state.playerHand : state.aiHand

    if (!deck.length) {
      if (who === 'player') addLog('! Deck vazio — sem compra!', 'system')
      return
    }
    if (hand.length >= MAX_HAND) return

    const card = deck.splice(0, 1)[0]
    hand.push(card)

    if (who === 'player') {
      state.playerDeckSize = deck.length
      addLog(`+ Comprou: ${card.name}`, 'player')
    } else {
      state.aiDeckSize = deck.length
      state.aiHandSize = hand.length
    }
  }

  function checkOver(): boolean {
    if (state.playerHP <= 0) {
      state.playerHP = 0
      state.winner = 'ai'
      state.phase = 'game_over'
      addLog('╔══════════════════════════╗', 'damage')
      addLog('║   DERROTA! IA VENCEU!    ║', 'damage')
      addLog('╚══════════════════════════╝', 'damage')
      return true
    }
    if (state.aiHP <= 0) {
      state.aiHP = 0
      state.winner = 'player'
      state.phase = 'game_over'
      addLog('╔══════════════════════════╗', 'heal')
      addLog('║  VITORIA! VOCE GANHOU!   ║', 'heal')
      addLog('╚══════════════════════════╝', 'heal')
      return true
    }
    return false
  }

  function startGame() {
    const fresh = createInitialState() as any
    Object.assign(_internal, fresh)
    _internal.phase = 'player_turn'
    addLog('╔══════════════════════════╗', 'system')
    addLog('║   ARCANE DUEL INICIADO!  ║', 'system')
    addLog('╚══════════════════════════╝', 'system')
    addLog(`> Turno 1 — Mana: ${_internal.playerMana} ◆`, 'system')
  }

  function playCard(uid: string) {
    if (state.phase !== 'player_turn') return

    const idx = state.playerHand.findIndex(c => c.uid === uid)
    if (idx === -1) return

    const card = state.playerHand[idx]

    if (card.cost > state.playerMana) {
      addLog(`! Mana insuficiente! Custo: ${card.cost}, tem: ${state.playerMana}`, 'system')
      return
    }

    state.playerHand.splice(idx, 1)
    state.playerMana -= card.cost
    state.lastPlayerCard = { ...card }

    if (card.attack > 0) {
      const absorbed = Math.min(card.attack, state.aiDefense)
      const dmg = card.attack - absorbed
      state.aiDefense = Math.max(0, state.aiDefense - card.attack)
      state.aiHP -= dmg
      if (absorbed > 0)
        addLog(`> ${card.name}: ${card.attack} ATK | ${absorbed} bloq. + ${dmg} dano`, 'player')
      else
        addLog(`> ${card.name}: ${card.attack} ATK → ${dmg} dano na IA!`, 'player')
    }

    if (card.defense > 0) {
      state.playerDefense += card.defense
      addLog(`> ${card.name}: +${card.defense} armadura (total ${state.playerDefense})`, 'player')
    }

    if (card.heal > 0) {
      const prev = state.playerHP
      state.playerHP = Math.min(MAX_HP, state.playerHP + card.heal)
      addLog(`> ${card.name}: recuperou +${state.playerHP - prev} vida!`, 'heal')
    }

    checkOver()
  }

  function endPlayerTurn() {
    if (state.phase !== 'player_turn') return

    state.phase = 'ai_thinking'
    state.turn++
    state.playerMana = Math.min(MAX_MANA, state.playerMana + 1)

    addLog(`--- IA pensando... (turno ${state.turn}) ---`, 'ai')

    setTimeout(() => {
      if (state.phase === 'game_over') return
      runAiTurn()
    }, 1400)
  }

  // ── AI strategy ──────────────────────────────────────────────────────────
  function aiPickCard(): GameCard | null {
    const playable = state.aiHand.filter(c => c.cost <= state.aiMana)
    if (!playable.length) return null

    const atk = playable.filter(c => c.attack > 0)

    // Kill shot
    for (const c of atk) {
      const dmg = Math.max(0, c.attack - state.playerDefense)
      if (dmg >= state.playerHP) return c
    }

    // Heal when critically low
    if (state.aiHP <= 8) {
      const heals = playable.filter(c => c.heal > 0).sort((a, b) => b.heal - a.heal)
      if (heals.length) return heals[0]
    }

    // Drain when injured and player unguarded
    if (state.aiHP <= 15 && state.playerDefense === 0) {
      const drains = playable.filter(c => c.type === 'drain' && c.heal > 0)
      if (drains.length) return drains[0]
    }

    // Occasionally defend when low HP
    if (state.aiHP <= 12 && Math.random() < 0.45) {
      const defs = playable.filter(c => c.defense > 0 && c.attack === 0).sort((a, b) => b.defense - a.defense)
      if (defs.length) return defs[0]
    }

    // Maximize damage — weight raw ATK when player is nearly dead
    if (atk.length) {
      const sortFn = state.playerHP < 12
        ? (a: GameCard, b: GameCard) => b.attack - a.attack
        : (a: GameCard, b: GameCard) => (b.attack / b.cost) - (a.attack / a.cost)
      return [...atk].sort(sortFn)[0]
    }

    // Drain cards as fallback
    const drains = playable.filter(c => c.type === 'drain')
    if (drains.length) return drains[0]

    const heals = playable.filter(c => c.type === 'heal')
    if (heals.length) return heals[0]

    return playable.sort((a, b) => b.cost - a.cost)[0]
  }

  function runAiTurn() {
    if (state.phase === 'game_over') return

    drawCard('ai')
    state.aiMana = Math.min(MAX_MANA, state.aiMana + 1)

    let plays = 0
    const maxPlays = 2

    while (plays < maxPlays) {
      const card = aiPickCard()
      if (!card) break

      const idx = state.aiHand.findIndex(c => c.uid === card.uid)
      if (idx === -1) break

      state.aiHand.splice(idx, 1)
      state.aiMana -= card.cost
      state.lastAiCard = { ...card }
      state.aiHandSize = state.aiHand.length

      if (card.attack > 0) {
        const absorbed = Math.min(card.attack, state.playerDefense)
        const dmg = card.attack - absorbed
        state.playerDefense = Math.max(0, state.playerDefense - card.attack)
        state.playerHP -= dmg
        if (absorbed > 0)
          addLog(`< IA: ${card.name} | ${absorbed} bloq. + ${dmg} dano em VOCE`, 'damage')
        else
          addLog(`< IA: ${card.name} → ${dmg} dano em VOCE!`, 'damage')
      }

      if (card.defense > 0) {
        state.aiDefense += card.defense
        addLog(`< IA: ${card.name} → +${card.defense} armadura`, 'ai')
      }

      if (card.heal > 0) {
        const prev = state.aiHP
        state.aiHP = Math.min(MAX_HP, state.aiHP + card.heal)
        addLog(`< IA: ${card.name} → curou +${state.aiHP - prev} vida`, 'ai')
      }

      if (checkOver()) return

      plays++
      // 40 % chance to stop after first play (adds unpredictability)
      if (plays === 1 && Math.random() > 0.6) break
    }

    if (!plays) addLog('< IA passou o turno', 'ai')

    // Begin player turn
    state.phase = 'player_turn'
    drawCard('player')
    addLog(`--- SEU TURNO ${state.turn} | Mana: ${state.playerMana} ◆ ---`, 'system')
  }

  return {
    state: state as Readonly<GameState>,
    startGame,
    playCard,
    endPlayerTurn,
  }
}
