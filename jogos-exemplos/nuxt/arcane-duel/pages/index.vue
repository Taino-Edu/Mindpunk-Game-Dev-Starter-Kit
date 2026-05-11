<template>
  <div class="root">

    <!-- ══════ START SCREEN ══════ -->
    <div v-if="state.phase === 'start'" class="start-screen">
      <pre class="title-art">{{ TITLE_ART }}</pre>
      <div class="start-meta">
        <div class="meta-line">12 cartas &bull; IA estrategica &bull; Visual ASCII</div>
        <div class="meta-line">Compre cartas &bull; Gerencie mana &bull; Destrua o inimigo</div>
      </div>
      <button class="btn-primary" @click="startGame">[ INICIAR DUELO ]</button>
      <pre class="help-art">{{ HELP_ART }}</pre>
    </div>

    <!-- ══════ GAME SCREEN ══════ -->
    <div v-else class="game-board">

      <!-- AI ROW -->
      <div class="ai-row">
        <div class="status-strip ai-strip">
          <span class="strip-label ai-label">[ IA ]</span>
          <span class="hp-display">
            HP:&nbsp;<span :style="{ color: hpColor(state.aiHP) }">{{ bar(state.aiHP, 30, 14) }}&nbsp;{{ state.aiHP }}/30</span>
          </span>
          <span v-if="state.aiDefense > 0" class="def-display">
            &nbsp;&#9646;DEF:{{ state.aiDefense }}
          </span>
          <span class="mana-display">&nbsp;MANA:&nbsp;<span class="mana-gems">{{ manaGems(state.aiMana) }}</span></span>
          <span class="deck-small">&nbsp;&#9632;{{ state.aiDeckSize }}</span>
        </div>

        <div class="ai-hand-row">
          <div v-for="i in state.aiHandSize" :key="i" class="card-back">
            <pre>{{ CARD_BACK }}</pre>
          </div>
        </div>
      </div>

      <!-- BATTLE FIELD -->
      <div class="battle-row">

        <!-- Last played cards -->
        <div class="played-zone">
          <div class="played-slot ai-played">
            <div class="slot-header ai-color">&lt; IA JOGOU</div>
            <div v-if="state.lastAiCard" class="card played-card" :style="cardStyle(state.lastAiCard)">
              <div class="card-cost">&#9830;{{ state.lastAiCard.cost }}</div>
              <div class="card-name">{{ state.lastAiCard.name }}</div>
              <pre class="card-art">{{ state.lastAiCard.art.join('\n') }}</pre>
              <div class="card-type">{{ typeLabel(state.lastAiCard.type) }}</div>
              <div class="card-stats">
                <span v-if="state.lastAiCard.attack">&#9876;&nbsp;{{ state.lastAiCard.attack }}&nbsp;</span>
                <span v-if="state.lastAiCard.defense">&#9646;&nbsp;{{ state.lastAiCard.defense }}&nbsp;</span>
                <span v-if="state.lastAiCard.heal">&#9829;&nbsp;+{{ state.lastAiCard.heal }}</span>
              </div>
            </div>
            <div v-else class="empty-slot">[ vazio ]</div>
          </div>

          <div class="vs-col">
            <pre class="vs-art">{{ VS_ART }}</pre>
            <div class="turn-badge" :class="{ ai: state.phase === 'ai_thinking' }">
              {{ state.phase === 'ai_thinking' ? 'TURNO IA' : 'SEU TURNO' }}
            </div>
          </div>

          <div class="played-slot player-played">
            <div class="slot-header player-color">VOCE JOGOU &gt;</div>
            <div v-if="state.lastPlayerCard" class="card played-card" :style="cardStyle(state.lastPlayerCard)">
              <div class="card-cost">&#9830;{{ state.lastPlayerCard.cost }}</div>
              <div class="card-name">{{ state.lastPlayerCard.name }}</div>
              <pre class="card-art">{{ state.lastPlayerCard.art.join('\n') }}</pre>
              <div class="card-type">{{ typeLabel(state.lastPlayerCard.type) }}</div>
              <div class="card-stats">
                <span v-if="state.lastPlayerCard.attack">&#9876;&nbsp;{{ state.lastPlayerCard.attack }}&nbsp;</span>
                <span v-if="state.lastPlayerCard.defense">&#9646;&nbsp;{{ state.lastPlayerCard.defense }}&nbsp;</span>
                <span v-if="state.lastPlayerCard.heal">&#9829;&nbsp;+{{ state.lastPlayerCard.heal }}</span>
              </div>
            </div>
            <div v-else class="empty-slot">[ vazio ]</div>
          </div>
        </div>

        <!-- Battle log -->
        <div class="log-panel">
          <div class="log-header">[ LOG DE BATALHA ]</div>
          <div class="log-body" ref="logBodyRef">
            <div
              v-for="e in state.log"
              :key="e.id"
              class="log-line"
              :class="`ltype-${e.type}`"
            >{{ e.text }}</div>
          </div>
        </div>

      </div>

      <!-- PLAYER ROW -->
      <div class="player-row">
        <div class="status-strip player-strip">
          <span class="strip-label player-label">[ VOCE ]</span>
          <span class="hp-display">
            HP:&nbsp;<span :style="{ color: hpColor(state.playerHP) }">{{ bar(state.playerHP, 30, 14) }}&nbsp;{{ state.playerHP }}/30</span>
          </span>
          <span v-if="state.playerDefense > 0" class="def-display">
            &nbsp;&#9646;DEF:{{ state.playerDefense }}
          </span>
          <span class="mana-display">&nbsp;MANA:&nbsp;<span class="mana-gems">{{ manaGems(state.playerMana) }}</span></span>
          <span class="deck-small">&nbsp;&#9632;{{ state.playerDeckSize }}</span>
          <span v-if="state.phase === 'ai_thinking'" class="thinking-badge">IA PENSANDO...</span>
        </div>

        <!-- Player hand -->
        <div class="player-hand">
          <div
            v-for="card in state.playerHand"
            :key="card.uid"
            class="card hand-card"
            :class="{
              playable: card.cost <= state.playerMana && state.phase === 'player_turn',
              unplayable: card.cost > state.playerMana || state.phase !== 'player_turn',
            }"
            :style="cardStyle(card)"
            @click="onCardClick(card.uid)"
          >
            <div class="card-cost">&#9830;{{ card.cost }}</div>
            <div class="card-name">{{ card.name }}</div>
            <pre class="card-art">{{ card.art.join('\n') }}</pre>
            <div class="card-type">{{ typeLabel(card.type) }}</div>
            <div class="card-stats">
              <span v-if="card.attack">&#9876;&nbsp;{{ card.attack }}&nbsp;</span>
              <span v-if="card.defense">&#9646;&nbsp;{{ card.defense }}&nbsp;</span>
              <span v-if="card.heal">&#9829;&nbsp;+{{ card.heal }}</span>
            </div>
            <div class="card-desc">{{ card.description }}</div>
          </div>

          <div v-if="!state.playerHand.length" class="empty-hand">
            [ sem cartas na mao ]
          </div>
        </div>

        <!-- Actions -->
        <div class="action-bar">
          <button
            class="btn-secondary"
            :disabled="state.phase !== 'player_turn'"
            @click="endPlayerTurn"
          >[ PASSAR TURNO &rarr; ]</button>
          <span class="turn-counter">Turno {{ state.turn }}</span>
        </div>
      </div>

    </div>

    <!-- ══════ GAME OVER OVERLAY ══════ -->
    <Transition name="fade">
      <div v-if="state.phase === 'game_over'" class="overlay">
        <div class="over-box">
          <pre v-if="state.winner === 'player'" class="over-art player-win-art">{{ VICTORY_ART }}</pre>
          <pre v-else class="over-art ai-win-art">{{ DEFEAT_ART }}</pre>
          <div class="final-stats">
            <div>&#9632; Turno final : {{ state.turn }}</div>
            <div>&#9632; Sua vida    : {{ state.playerHP }}/30</div>
            <div>&#9632; Vida da IA  : {{ state.aiHP }}/30</div>
          </div>
          <button class="btn-primary" @click="startGame">[ JOGAR NOVAMENTE ]</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGame } from '~/composables/useGame'
import type { GameCard } from '~/data/cards'

const { state, startGame, playCard, endPlayerTurn } = useGame()

const logBodyRef = ref<HTMLElement | null>(null)

watch(() => state.log.length, () => {
  // Keep log scrolled to top (newest entries are prepended)
})

// ── Helpers ────────────────────────────────────────────────────────────────
function bar(v: number, max: number, len: number): string {
  const filled = Math.round((v / max) * len)
  return '[' + '█'.repeat(filled) + '░'.repeat(len - filled) + ']'
}

function manaGems(n: number): string {
  return '◆'.repeat(n) + '◇'.repeat(Math.max(0, 10 - n))
}

function hpColor(hp: number): string {
  if (hp > 18) return 'var(--green)'
  if (hp > 9)  return 'var(--yellow)'
  return 'var(--red)'
}

function typeLabel(t: string): string {
  return ({ attack: '[ATQ]', defense: '[DEF]', heal: '[CURA]', drain: '[DRN]' } as any)[t] ?? t
}

function cardStyle(card: GameCard) {
  return { '--c': card.color }
}

function onCardClick(uid: string) {
  if (state.phase !== 'player_turn') return
  playCard(uid)
}

// ── ASCII art constants ────────────────────────────────────────────────────
const TITLE_ART = `
 ██████╗  ██╗   ██╗███████╗██╗
██╔══██╗ ██║   ██║██╔════╝██║
██║  ██║ ██║   ██║█████╗  ██║
██║  ██║ ██║   ██║██╔══╝  ██║
██████╔╝ ╚██████╔╝███████╗███████╗
╚═════╝   ╚═════╝ ╚══════╝╚══════╝

 ██████╗  ██████╗  ██████╗ ██████╗
██╔═══██╗██╔═══██╗██╔════╝ ██╔══██╗
██║   ██║██║   ██║██║  ███╗██║  ██║
██║   ██║██║   ██║██║   ██║██║  ██║
╚██████╔╝╚██████╔╝╚██████╔╝██████╔╝
 ╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝    `.trim()

const HELP_ART = `
 ┌─────────────────────────────────────┐
 │  ⚔  Ataque  — causa dano direto    │
 │  ◆  Defesa  — absorve dano         │
 │  ♥  Cura    — restaura HP          │
 │  ☯  Dreno   — ataca e/ou cura      │
 │                                     │
 │  Clique na carta para jogar         │
 │  Cartas cinzas = mana insuficiente  │
 └─────────────────────────────────────┘`.trim()

const CARD_BACK = `╔═══════╗
║ ? ? ? ║
║ ? ◆ ? ║
║ ? ? ? ║
╚═══════╝`

const VS_ART = `
 \\  /\\  /
  \\/  \\/
  /\\  /\\
 /  \\/  \\`.trim()

const VICTORY_ART = `
 ██╗   ██╗██╗████████╗ ██████╗ ██████╗ ██╗ █████╗ ██╗
 ██║   ██║██║╚══██╔══╝██╔═══██╗██╔══██╗██║██╔══██╗██║
 ██║   ██║██║   ██║   ██║   ██║██████╔╝██║███████║██║
 ╚██╗ ██╔╝██║   ██║   ██║   ██║██╔══██╗██║██╔══██║╚═╝
  ╚████╔╝ ██║   ██║   ╚██████╔╝██║  ██║██║██║  ██║██╗
   ╚═══╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝`.trim()

const DEFEAT_ART = `
 ██████╗ ███████╗██████╗ ██████╗  ██████╗ ████████╗ █████╗ ██╗
 ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗██║
 ██║  ██║█████╗  ██████╔╝██████╔╝██║   ██║   ██║   ███████║██║
 ██║  ██║██╔══╝  ██╔══██╗██╔══██╗██║   ██║   ██║   ██╔══██║╚═╝
 ██████╔╝███████╗██║  ██║██║  ██║╚██████╔╝   ██║   ██║  ██║██╗
 ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝`.trim()
</script>

<style scoped>
/* ── Layout root ─────────────────────────────────────────── */
.root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-primary);
}

/* ── Start screen ─────────────────────────────────────────── */
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px;
}

.title-art {
  color: var(--purple);
  font-size: 11px;
  line-height: 1.2;
  text-shadow: 0 0 20px var(--purple);
  animation: blink 3s infinite;
}

.start-meta { text-align: center; color: var(--text-dim); font-size: 13px; }
.meta-line + .meta-line { margin-top: 4px; }

.help-art {
  color: var(--text-dim);
  font-size: 12px;
  border: 1px solid var(--border);
  padding: 4px 8px;
}

/* ── Game board ───────────────────────────────────────────── */
.game-board {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Status strips ────────────────────────────────────────── */
.status-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  background: var(--bg-secondary);
}

.ai-strip   { border-color: #2a1a1a; background: #100a0a; }
.player-strip { border-color: #1a1a2a; background: #0a0a14; }

.strip-label { font-weight: bold; margin-right: 6px; }
.ai-label    { color: var(--red); }
.player-label { color: var(--purple); }

.hp-display  { font-size: 11px; }
.def-display { color: var(--cyan); font-size: 11px; }
.mana-display { font-size: 11px; }
.mana-gems { color: var(--mana-color); letter-spacing: 1px; }
.deck-small { color: var(--text-dim); font-size: 10px; }

.thinking-badge {
  margin-left: auto;
  color: var(--red);
  font-size: 11px;
  animation: blink 0.8s infinite;
}

/* ── AI row ───────────────────────────────────────────────── */
.ai-row {
  flex: 0 0 auto;
  border-bottom: 1px solid var(--border);
}

.ai-hand-row {
  display: flex;
  gap: 6px;
  padding: 6px 10px;
  background: #0d0808;
  overflow-x: auto;
}

.card-back pre {
  color: #3a2040;
  font-size: 11px;
  line-height: 1.3;
  cursor: default;
  user-select: none;
}

/* ── Battle row ───────────────────────────────────────────── */
.battle-row {
  flex: 1 1 0;
  display: flex;
  gap: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

/* Played zone (left 60 %) */
.played-zone {
  flex: 0 0 60%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  overflow: hidden;
}

.played-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; }

.slot-header { font-size: 11px; margin-bottom: 2px; }
.ai-color    { color: var(--red); }
.player-color { color: var(--purple); }

.empty-slot { color: var(--text-dim); font-size: 11px; border: 1px dashed var(--border); padding: 20px 12px; }

.vs-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }

.vs-art { color: var(--text-dim); font-size: 10px; line-height: 1.3; }

.turn-badge {
  font-size: 11px;
  color: var(--purple);
  border: 1px solid var(--purple-dim);
  padding: 2px 6px;
}
.turn-badge.ai {
  color: var(--red);
  border-color: #4a1010;
  animation: blink 0.9s infinite;
}

/* Log panel (right 40 %) */
.log-panel {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-primary);
}

.log-header {
  font-size: 11px;
  color: var(--text-dim);
  padding: 4px 8px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.log-body {
  flex: 1 1 0;
  overflow-y: auto;
  padding: 4px 8px;
  font-size: 11px;
  line-height: 1.5;
}

.log-line { animation: fadeIn 0.3s ease-out; }
.ltype-player  { color: var(--purple); }
.ltype-ai      { color: var(--red); }
.ltype-system  { color: var(--text-dim); }
.ltype-heal    { color: var(--green); }
.ltype-damage  { color: var(--orange); }

/* ── Player row ───────────────────────────────────────────── */
.player-row {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
}

.player-hand {
  display: flex;
  gap: 6px;
  padding: 8px 10px;
  overflow-x: auto;
  background: #080810;
  min-height: 170px;
  align-items: flex-end;
}

.empty-hand {
  color: var(--text-dim);
  font-size: 11px;
  align-self: center;
  margin: 0 auto;
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
}

.turn-counter { color: var(--text-dim); font-size: 11px; }

/* ── Cards ────────────────────────────────────────────────── */
.card {
  flex: 0 0 auto;
  width: 100px;
  border: 1px solid color-mix(in srgb, var(--c) 40%, var(--border));
  background: var(--bg-card);
  padding: 5px 6px;
  font-size: 10px;
  line-height: 1.4;
  position: relative;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}

.card-cost {
  color: var(--mana-color);
  font-size: 10px;
  margin-bottom: 2px;
}

.card-name {
  color: color-mix(in srgb, var(--c) 80%, white);
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.card-art {
  color: color-mix(in srgb, var(--c) 60%, var(--text));
  font-size: 10px;
  line-height: 1.2;
  margin: 3px 0;
  display: block;
}

.card-type {
  font-size: 9px;
  color: var(--text-dim);
  margin-bottom: 2px;
}

.card-stats {
  color: var(--text-bright);
  font-size: 10px;
  margin-bottom: 2px;
}

.card-desc {
  font-size: 9px;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hand card states */
.hand-card.playable {
  cursor: pointer;
  border-color: color-mix(in srgb, var(--c) 70%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--c) 30%, transparent);
  animation: card-appear 0.25s ease-out;
}

.hand-card.playable:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 0 18px color-mix(in srgb, var(--c) 60%, transparent);
  z-index: 10;
  border-color: var(--c);
}

.hand-card.unplayable {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(60%);
}

/* Played card (slightly larger) */
.played-card {
  width: 110px;
  font-size: 11px;
  border-color: color-mix(in srgb, var(--c) 60%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--c) 35%, transparent);
}

.played-card .card-art { font-size: 11px; }
.played-card .card-name { font-size: 11px; }
.played-card .card-stats { font-size: 11px; }

/* ── Buttons ──────────────────────────────────────────────── */
.btn-primary {
  background: var(--purple-dim);
  color: var(--text-bright);
  border: 1px solid var(--purple);
  padding: 10px 24px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  background: var(--purple);
  box-shadow: 0 0 16px var(--purple);
}

.btn-secondary {
  background: transparent;
  color: var(--cyan);
  border: 1px solid var(--cyan);
  padding: 5px 14px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover:not(:disabled) {
  background: rgba(103, 232, 249, 0.1);
}
.btn-secondary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Game over overlay ───────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.over-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px 40px;
  border: 1px solid var(--border-bright);
  background: var(--bg-secondary);
  max-width: 90vw;
  overflow: hidden;
}

.over-art {
  font-size: 10px;
  line-height: 1.2;
}

.player-win-art { color: var(--green); text-shadow: 0 0 16px var(--green); }
.ai-win-art     { color: var(--red);   text-shadow: 0 0 16px var(--red);   }

.final-stats {
  color: var(--text);
  font-size: 13px;
  line-height: 1.9;
  text-align: left;
}

/* ── Transitions ─────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
