// =============================================================
// SRC_COMENTADO_useGame.ts — Arcane Duel
// =============================================================
// Este arquivo contém TODO o estado do jogo e TODA a lógica.
// É o "cérebro" do Arcane Duel.
//
// Padrão usado: Singleton Composable
//   → useGame() sempre retorna o MESMO estado
//   → Não importa quantos componentes chamem useGame()
//   → Todos compartilham o mesmo objeto reativo
// =============================================================

import { reactive, readonly } from 'vue'
import CARD_DEFS from '~/data/cards'
import type { GameCard } from '~/data/cards'


// ── INTERFACES (TIPOS) ────────────────────────────────────────

// Uma entrada no log de batalha
export interface LogEntry {
  id: number        // para o v-for no template (key única)
  text: string      // mensagem exibida
  type: 'player' | 'ai' | 'system' | 'heal' | 'damage'  // define a cor
}

// O estado COMPLETO do jogo em um único objeto
// Tudo que a UI precisa saber está aqui
export interface GameState {
  phase: 'start' | 'player_turn' | 'ai_thinking' | 'game_over'
  playerHP: number        // vida do jogador (0–30)
  aiHP: number            // vida da IA (0–30)
  playerMana: number      // mana atual do jogador (0–10)
  aiMana: number          // mana atual da IA (0–10)
  playerDefense: number   // armadura acumulada do jogador
  aiDefense: number       // armadura acumulada da IA
  playerHand: GameCard[]  // cartas na mão do jogador
  aiHand: GameCard[]      // cartas na mão da IA
  playerDeckSize: number  // quantas cartas restam no deck (para exibir)
  aiDeckSize: number
  log: LogEntry[]         // histórico de ações (mais recente primeiro)
  turn: number            // número do turno atual
  winner: 'player' | 'ai' | null  // null até o jogo terminar
  lastPlayerCard: GameCard | null  // última carta jogada (exibida no campo)
  lastAiCard: GameCard | null
  aiHandSize: number      // usado para exibir cartas viradas (sem revelar)
}


// ── CONSTANTES ────────────────────────────────────────────────

const MAX_HP = 30       // vida máxima de ambos os jogadores
const MAX_MANA = 10     // mana máxima (cresce +1/turno até 10)
const STARTING_MANA = 3 // mana inicial (ambos começam com 3)
const STARTING_HAND = 3 // cartas iniciais na mão
const MAX_HAND = 7      // limite de cartas na mão


// ── GERADORES DE ID ───────────────────────────────────────────
// Variáveis de módulo — persistem enquanto o app está rodando

let uidCounter = 0
let logIdCounter = 0

function mkUid() { return `c${++uidCounter}` }
// Gera: 'c1', 'c2', 'c3'...
// Cada INSTÂNCIA de carta recebe um uid único


// ── CONSTRUÇÃO DO DECK ────────────────────────────────────────

function buildDeck(): GameCard[] {
  // Pega as 12 definições de cartas (CARD_DEFS)
  // Cria 2 cópias de cada → 24 cartas no deck
  // Cada cópia recebe um uid único (mesmo 'id' de tipo, uid diferente)
  const deck = [...CARD_DEFS, ...CARD_DEFS].map(c => ({ ...c, uid: mkUid() }))

  // Embaralha usando o algoritmo Fisher-Yates
  // É o algoritmo de embaralhamento mais correto (sem viés)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]  // swap
    //           ↑ desestruturação para trocar sem variável temporária
  }
  return deck
}


// ── ESTADO INICIAL ────────────────────────────────────────────

function createInitialState(): GameState {
  const pd = buildDeck()  // player deck
  const ad = buildDeck()  // ai deck (baralhos independentes)

  // Cada jogador começa com 3 cartas (removidas do início do deck)
  const ph = pd.splice(0, STARTING_HAND)  // player hand
  const ah = ad.splice(0, STARTING_HAND)  // ai hand

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
    playerDeckSize: pd.length,   // 21 (24 - 3 iniciais)
    aiDeckSize: ad.length,
    log: [],
    turn: 1,
    winner: null,
    lastPlayerCard: null,
    lastAiCard: null,
    aiHandSize: ah.length,
    _playerDeck: pd,  // deck interno (não faz parte de GameState, mas é armazenado)
    _aiDeck: ad,
  } as any
}


// ── SINGLETON ─────────────────────────────────────────────────
//
// 🧠 CONCEITO IMPORTANTE: Singleton Reativo
//
// Esta linha cria o objeto reativo FORA da função useGame().
// Isso significa que ele é criado UMA VEZ quando o módulo carrega.
// Todas as chamadas a useGame() acessam o MESMO _internal.
//
// Comparação com React:
//   React useState(): cada componente tem seu próprio estado
//   Vue reactive() (módulo): estado compartilhado entre todos

const _internal = reactive<any>(createInitialState())


// ── O COMPOSABLE ──────────────────────────────────────────────

export function useGame() {
  const state = _internal as GameState  // alias tipado


  // ── AUXILIARES ──────────────────────────────────────────────

  // Adiciona uma linha no log de batalha
  // O unshift() coloca no INÍCIO (mais recente em cima)
  function addLog(text: string, type: LogEntry['type']) {
    state.log.unshift({ id: logIdCounter++, text, type })
    if (state.log.length > 35) state.log.splice(35)  // limpa entradas antigas
  }


  // ── INICIALIZAÇÃO ───────────────────────────────────────────

  function startGame() {
    // Object.assign() copia todas as propriedades de 'fresh' para '_internal'
    // Isso reseta o estado sem perder a referência reativa
    // (se você fizesse _internal = createInitialState(), perderia a reatividade)
    const fresh = createInitialState() as any
    Object.assign(_internal, fresh)
    _internal.phase = 'player_turn'
    addLog('╔══════════════════════════╗', 'system')
    addLog('║   ARCANE DUEL INICIADO!  ║', 'system')
    addLog('╚══════════════════════════╝', 'system')
    addLog(`> Turno 1 — Mana: ${_internal.playerMana} ◆`, 'system')
  }


  // ── COMPRA DE CARTA ─────────────────────────────────────────

  function drawCard(who: 'player' | 'ai') {
    // Acessa o deck interno (não faz parte da interface GameState)
    const deck: GameCard[] = who === 'player' ? _internal._playerDeck : _internal._aiDeck
    const hand: GameCard[] = who === 'player' ? state.playerHand : state.aiHand

    if (!deck.length) {
      if (who === 'player') addLog('! Deck vazio — sem compra!', 'system')
      return  // sem cartas, simplesmente não compra
    }
    if (hand.length >= MAX_HAND) return  // mão cheia (máx. 7)

    const card = deck.splice(0, 1)[0]  // remove e retorna a primeira carta
    hand.push(card)                      // adiciona na mão

    if (who === 'player') {
      state.playerDeckSize = deck.length
      addLog(`+ Comprou: ${card.name}`, 'player')
    } else {
      state.aiDeckSize = deck.length
      state.aiHandSize = hand.length  // atualiza contador para a UI
    }
  }


  // ── VERIFICAÇÃO DE FIM DE JOGO ───────────────────────────────

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


  // ── JOGAR CARTA (ação do jogador) ───────────────────────────

  function playCard(uid: string) {
    if (state.phase !== 'player_turn') return  // guarda: só age no seu turno

    const idx = state.playerHand.findIndex(c => c.uid === uid)
    if (idx === -1) return  // carta não encontrada

    const card = state.playerHand[idx]

    if (card.cost > state.playerMana) {
      addLog(`! Mana insuficiente! Custo: ${card.cost}, tem: ${state.playerMana}`, 'system')
      return
    }

    // Remove carta da mão e desconta mana
    state.playerHand.splice(idx, 1)
    state.playerMana -= card.cost
    state.lastPlayerCard = { ...card }  // spread para criar cópia (evita mutação)

    // ── APLICAÇÃO DE EFEITOS ──
    // attack > 0: causa dano (descontando a armadura do oponente primeiro)
    if (card.attack > 0) {
      const absorbed = Math.min(card.attack, state.aiDefense)  // armadura absorve
      const dmg = card.attack - absorbed                        // dano real
      state.aiDefense = Math.max(0, state.aiDefense - card.attack)  // reduz armadura
      state.aiHP -= dmg

      if (absorbed > 0)
        addLog(`> ${card.name}: ${card.attack} ATK | ${absorbed} bloq. + ${dmg} dano`, 'player')
      else
        addLog(`> ${card.name}: ${card.attack} ATK → ${dmg} dano na IA!`, 'player')
    }

    // defense > 0: adiciona armadura (acumula, não substitui)
    if (card.defense > 0) {
      state.playerDefense += card.defense
      addLog(`> ${card.name}: +${card.defense} armadura (total ${state.playerDefense})`, 'player')
    }

    // heal > 0: cura (não pode passar de MAX_HP)
    if (card.heal > 0) {
      const prev = state.playerHP
      state.playerHP = Math.min(MAX_HP, state.playerHP + card.heal)
      addLog(`> ${card.name}: recuperou +${state.playerHP - prev} vida!`, 'heal')
    }

    checkOver()
  }


  // ── PASSAR TURNO ────────────────────────────────────────────

  function endPlayerTurn() {
    if (state.phase !== 'player_turn') return

    state.phase = 'ai_thinking'
    state.turn++
    state.playerMana = Math.min(MAX_MANA, state.playerMana + 1)  // +1 mana no próximo turno

    addLog(`--- IA pensando... (turno ${state.turn}) ---`, 'ai')

    // 🧠 CONCEITO: setTimeout para simular "pensamento" da IA
    // O delay de 1400ms cria a sensação de que a IA está deliberando.
    // Durante esse tempo, a UI mostra o badge "IA PENSANDO..." piscando.
    setTimeout(() => {
      if (state.phase === 'game_over') return  // segurança: jogo pode ter acabado
      runAiTurn()
    }, 1400)
  }


  // ── ALGORITMO DE DECISÃO DA IA ───────────────────────────────
  //
  // 🧠 CONCEITO: IA por Prioridade
  //
  // Esta IA NÃO usa machine learning nem aleatoriedade pura.
  // É uma série de "se...então" ordenada por importância.
  // Isso cria um adversário previsível o suficiente para ser derrotável,
  // mas inteligente o suficiente para ser desafiador.

  function aiPickCard(): GameCard | null {
    // Filtra apenas cartas que cabem no mana atual da IA
    const playable = state.aiHand.filter(c => c.cost <= state.aiMana)
    if (!playable.length) return null  // sem opções: passa o turno

    const atk = playable.filter(c => c.attack > 0)  // cartas ofensivas

    // ── PRIORIDADE 1: Kill Shot ──────────────────────────────
    // Se alguma carta causa dano suficiente para zerar o HP do jogador, usa!
    // Isso garante que a IA nunca "desperdice" uma oportunidade de vitória.
    for (const c of atk) {
      const dmg = Math.max(0, c.attack - state.playerDefense)
      if (dmg >= state.playerHP) return c
    }

    // ── PRIORIDADE 2: Auto-preservação (HP crítico) ──────────
    // Com HP ≤ 8, a IA SEMPRE tenta curar antes de atacar.
    // Isso a torna mais resistente no final de jogo.
    if (state.aiHP <= 8) {
      const heals = playable.filter(c => c.heal > 0).sort((a, b) => b.heal - a.heal)
      if (heals.length) return heals[0]
    }

    // ── PRIORIDADE 3: Dreno estratégico ─────────────────────
    // Com HP baixo e o jogador sem armadura, a IA usa dreno (ataca + cura).
    // playerDefense === 0 é condição porque dreno com 5 ATK vs 8 DEF = desperdício.
    if (state.aiHP <= 15 && state.playerDefense === 0) {
      const drains = playable.filter(c => c.type === 'drain' && c.heal > 0)
      if (drains.length) return drains[0]
    }

    // ── PRIORIDADE 4: Defesa situacional ────────────────────
    // Com HP baixo, 45% de chance de defender.
    // O 45% é intencional: torna a IA imprevisível (não defende SEMPRE).
    if (state.aiHP <= 12 && Math.random() < 0.45) {
      const defs = playable.filter(c => c.defense > 0 && c.attack === 0)
                            .sort((a, b) => b.defense - a.defense)
      if (defs.length) return defs[0]
    }

    // ── PRIORIDADE 5: Melhor eficiência ofensiva ─────────────
    // Padrão: maximizar dano por mana gasto.
    // Se o jogador está quase morto (HP < 12), prioriza dano bruto.
    if (atk.length) {
      const sortFn = state.playerHP < 12
        ? (a: GameCard, b: GameCard) => b.attack - a.attack           // dano máximo
        : (a: GameCard, b: GameCard) => (b.attack / b.cost) - (a.attack / a.cost)  // eficiência
      return [...atk].sort(sortFn)[0]
    }

    // Fallback: qualquer carta disponível (prioriza mais cara)
    return playable.sort((a, b) => b.cost - a.cost)[0]
  }


  // ── TURNO DA IA ─────────────────────────────────────────────

  function runAiTurn() {
    if (state.phase === 'game_over') return

    drawCard('ai')                                        // compra uma carta
    state.aiMana = Math.min(MAX_MANA, state.aiMana + 1)  // ganha +1 mana

    let plays = 0
    const maxPlays = 2  // IA pode jogar no máximo 2 cartas

    while (plays < maxPlays) {
      const card = aiPickCard()
      if (!card) break  // sem cartas disponíveis: fim do turno da IA

      const idx = state.aiHand.findIndex(c => c.uid === card.uid)
      if (idx === -1) break

      // Remove da mão e aplica efeitos (mesma lógica do jogador)
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

      if (checkOver()) return  // alguém morreu, sai imediatamente

      plays++
      // 🧠 60% de chance de parar após 1ª carta = imprevisibilidade controlada
      // Sem isso, a IA seria sempre determinística demais.
      if (plays === 1 && Math.random() > 0.6) break
    }

    if (!plays) addLog('< IA passou o turno', 'ai')

    // Devolve o controle ao jogador
    state.phase = 'player_turn'
    drawCard('player')
    addLog(`--- SEU TURNO ${state.turn} | Mana: ${state.playerMana} ◆ ---`, 'system')
  }


  // ── RETORNO DO COMPOSABLE ────────────────────────────────────
  //
  // Expõe apenas o que a UI precisa:
  // - state: leitura do estado (tipo Readonly para evitar mutação externa)
  // - 3 funções de ação

  return {
    state: state as Readonly<GameState>,
    startGame,
    playCard,
    endPlayerTurn,
  }
}

// =============================================================
// RESUMO DO QUE VOCÊ APRENDEU:
//
// 1. reactive() cria um objeto cujas mudanças são detectadas pelo Vue
// 2. Singleton (módulo-level) = estado compartilhado entre componentes
// 3. Separação: dados em cards.ts, lógica aqui, UI em index.vue
// 4. IA por prioridade: mais simples que machine learning, mas eficaz
// 5. setTimeout() para criar delay (ilusão de "pensamento")
// 6. checkOver() chamado após cada efeito (pode terminar em qualquer ponto)
// =============================================================
