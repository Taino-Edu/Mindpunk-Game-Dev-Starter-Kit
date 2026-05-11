# 📖 Arcane Duel — Visão Geral

> Um duelo de cartas ASCII onde você e uma IA adversária batalham turno a turno.

---

## 🎯 O Que É Este Jogo?

**Arcane Duel** é um jogo de cartas turno-a-turno onde você:
- Gerencia uma **mão de cartas** (3 no início, +1 por turno)
- Controla **mana** (recurso para jogar cartas, cresce por turno)
- Causa **dano**, constrói **defesa** e recupera **vida**
- Enfrenta uma **IA adversária** que toma decisões com base no estado do jogo

---

## 🧠 Conceitos-Chave Que Você Aprende

| Conceito | O Que Significa | Onde Está |
|----------|-----------------|-----------|
| **Singleton Reativo** | Um único objeto reativo compartilhado | `composables/useGame.ts` |
| **Composable Vue 3** | Função que encapsula lógica e estado | `composables/useGame.ts` |
| **Dados Separados da Lógica** | Cards são dados puros, sem lógica | `data/cards.ts` |
| **IA por Prioridade** | Algoritmo de decisão sem randomness puro | `useGame.ts → aiPickCard()` |
| **Turno-a-Turno** | Mundo avança por ações do jogador | Fases: `player_turn` / `ai_thinking` |
| **Efeitos de Composição** | Uma carta pode atacar + curar | `type: 'drain'` |

---

## 📂 Estrutura Essencial

```
arcane-duel/
│
├── data/cards.ts          ← DADOS: 12 cartas com stats e arte ASCII
│                             (sem lógica, só definições)
│
├── composables/useGame.ts ← LÓGICA: estado + ações + IA
│   ├── _internal          ← objeto reactive() — única fonte de verdade
│   ├── startGame()        ← reinicia tudo
│   ├── playCard(uid)      ← jogador joga uma carta
│   ├── endPlayerTurn()    ← passa o turno para a IA
│   ├── aiPickCard()       ← algoritmo de decisão da IA
│   └── runAiTurn()        ← executa o turno da IA
│
├── pages/index.vue        ← UI: renderiza estado, captura cliques
│   ├── Template           ← HTML reativo (v-if, v-for)
│   └── <script setup>     ← usa useGame(), funções de display
│
└── assets/css/main.css    ← ESTILO: variáveis CSS, animações, tema dark
```

---

## 🚀 Quick Start: Como Rodar

```bash
# 1. Entrar na pasta
cd jogos-exemplos/nuxt/arcane-duel

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev

# 4. Abrir http://localhost:3000 no navegador
```

---

## 🃏 Como Jogar

**Tela inicial:** clique `[ INICIAR DUELO ]`

**Durante o jogo:**
- Cartas com brilho colorido = você pode jogar (tem mana suficiente)
- Cartas acinzentadas = sem mana (custo maior que mana atual)
- Clique na carta para jogá-la
- Clique `[ PASSAR TURNO → ]` quando terminar

**Objetivo:** levar o HP da IA a 0 antes que ela faça o mesmo com você.

---

## 📊 Fluxo Completo do Jogo

```
START → startGame()
  ↓
Cria dois decks embaralhados (24 cartas cada = 12 tipos × 2)
Distribui 3 cartas para cada lado
Define mana inicial = 3
  ↓
GAME LOOP (phase = 'player_turn'):
  1. Jogador vê sua mão
  2. Clica em cartas para jogá-las (gasta mana)
  3. Clica "Passar turno"
  ↓
phase muda para 'ai_thinking'
  ↓
setTimeout(1400ms) → IA "pensa"
  ↓
runAiTurn():
  1. IA compra carta
  2. IA ganha +1 mana
  3. aiPickCard() escolhe a melhor carta
  4. IA joga 1 ou 2 cartas
  5. Verifica vitória/derrota
  ↓
phase volta para 'player_turn'
Jogador compra carta, ganha +1 mana
  ↓ (repete)

VITÓRIA:  aiHP  <= 0 → winner = 'player'
DERROTA:  playerHP <= 0 → winner = 'ai'
```

---

## 💡 Próximo Passo

Leia **`01_game-loop.md`** para entender em detalhe como o sistema de turnos funciona!
