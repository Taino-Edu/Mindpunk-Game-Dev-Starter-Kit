# 📖 Fragmento 01 - Visão Geral

> Um jogo tático de grid baseado em estratégia e decisões críticas.

---

## 🎯 O Que É Este Jogo?

**Fragmento 01** é um jogo de exploração de um sistema corrompido onde você:
- Navega por um **grid tático** (tabuleiro)
- Enfrenta **inimigos com IA**
- Toma **decisões estratégicas** (atacar, esperar, mover)
- Gerencia **recursos limitados** (energia para agir)
- Sobe de **nível** coletando XP

---

## 🧠 Conceitos-Chave Que Você Aprende

| Conceito | O Que Significa | Onde Está |
|----------|-----------------|-----------|
| **Game Loop** | Update → Render → Input | `useGameStore.ts` + `App.tsx` |
| **State Management** | Armazenar estado do jogo | `useGameStore.ts` (Zustand) |
| **Grid-Based Movement** | Mover célula por célula | `logic/movement.ts` |
| **IA** | Inimigos com comportamento | `logic/ai.ts` |
| **Pathfinding** | Encontrar caminho até algo | `logic/pathfinding.ts` |
| **Turn-Based System** | Mundo só avança com ações | `useGameStore.ts` |

---

## 📂 Estrutura Essencial

```
mindpunk-fragment-01/
├── src/
│   ├── main.tsx              ← Entry point (carga)
│   ├── App.tsx               ← Componente principal (teclado + lógica)
│   │
│   ├── store/
│   │   └── useGameStore.ts   ← TODO o estado do jogo (Zustand)
│   │
│   ├── logic/
│   │   ├── movement.ts       ← Mover player
│   │   ├── ai.ts             ← Comportamento inimigos
│   │   ├── combat.ts         ← Cálculo de dano
│   │   ├── pathfinding.ts    ← A* para IA
│   │   └── procedural.ts     ← Gerar mapa
│   │
│   ├── components/
│   │   ├── Game/Grid.tsx     ← Renderizar tabuleiro
│   │   ├── Ui/HUD.tsx        ← Vida, XP, Stats
│   │   └── Ui/Overlay.tsx    ← Menu, Status
│   │
│   └── config/
│       └── constants.ts      ← Números do jogo (dano, HP, etc)
└── docs/
    ├── 00_visao-geral.md     ← Você está aqui
    ├── 01_game-loop.md       ← Como funciona o fluxo
    ├── 02_movement.md        ← Sistema de movimento
    ├── 03_state-management.md ← Zustand + Armazenamento
    ├── 04_ai-combate.md      ← Inimigos + Combate
    └── exercicios/
        ├── nivel-1.md        ← Copie e modifique
        ├── nivel-2.md        ← Crie features novas
        └── nivel-3.md        ← Complete código incompleto
```

---

## 🚀 Quick Start: Como Rodar

```bash
# 1. Entrar na pasta
cd jogos-exemplos/mindpunk-fragment-01

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev

# 4. Abrir http://localhost:5173 no navegador
```

---

## 🎮 Como Jogar

**Controles:**
- `W` / `Seta ↑` → Mover acima
- `S` / `Seta ↓` → Mover abaixo
- `A` / `Seta ←` → Mover esquerda
- `D` / `Seta →` → Mover direita
- `ESPAÇO` → Esperar (não fazer nada, próximo turno)
- `CLIQUE em inimigo` → Atacar
- `R` → Reiniciar jogo
- `ENTER` → Próximo nível (quando ganhar)

**Objetivo:**
- ✅ Derrotar TODOS os inimigos
- ✅ Chegar ao **▶ (saída)**
- ✅ Não deixar sua vida chegar a 0

---

## 📊 Fluxo do Jogo (Resumido)

```
START
  ↓
Gera mapa + inimigos
  ↓
GAME LOOP:
  1. Aguarda input do jogador (teclado/clique)
  2. Valida movimento/ação
  3. Executa ação (mover, atacar, esperar)
  4. Inimigos fazem turnos (IA)
  5. Verifica vitória/derrota
  ↓ (repete)
  
VITÓRIA: Player chega na saída
DERROTA: HP do player = 0
```

---

## 💡 Próximo Passo

Leia **`01_game-loop.md`** para entender como tudo isso funciona junto!
