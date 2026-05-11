# 🃏 Arcane Duel: Jogo de Cartas com IA

Um jogo educacional de cartas turno-a-turno que ensina os fundamentos de **gerenciamento de estado reativo**, **lógica de IA**, e **design de sistemas de jogo** com Nuxt 3 e Vue 3.

## 🎯 O Que É?

Arcane Duel é um duelo de cartas ASCII onde você enfrenta uma IA adversária. Cada turno você joga cartas de ataque, defesa e cura, enquanto a IA toma decisões estratégicas baseadas no estado atual do jogo. Quem zerar o HP do oponente primeiro vence.

**Objetivo:** Reduzir o HP da IA a 0 antes que ela faça o mesmo com você.

## 🏗️ Arquitetura

```
arcane-duel/
├── data/
│   └── cards.ts            ← Definições das 12 cartas (dados puros)
├── composables/
│   └── useGame.ts          ← Estado do jogo + Lógica da IA
├── pages/
│   └── index.vue           ← Interface principal (UI)
├── assets/css/
│   └── main.css            ← Tema dark estilo terminal
└── docs/
    ├── 00_visao-geral.md   ← Você está aqui
    ├── 01_game-loop.md     ← Fluxo turno-a-turno
    ├── GDD.md              ← Game Design Document
    ├── SRC_COMENTADO_useGame.ts  ← Lógica comentada
    └── SRC_COMENTADO_cards.ts   ← Dados comentados
```

## 📚 Documentação Educacional

Leia em ordem:

1. **[00_visao-geral.md](./docs/00_visao-geral.md)** - Visão geral da arquitetura
2. **[01_game-loop.md](./docs/01_game-loop.md)** - Como funciona o loop de turnos
3. **[SRC_COMENTADO_cards.ts](./docs/SRC_COMENTADO_cards.ts)** - Estrutura de dados das cartas
4. **[SRC_COMENTADO_useGame.ts](./docs/SRC_COMENTADO_useGame.ts)** - Estado e IA explicados
5. **[GDD.md](./docs/GDD.md)** - Documento de design completo

## 🎓 Exercícios Práticos

- **[nivel-1-basico.md](./exercicios/nivel-1-basico.md)** - Explore e observe o código
- **[nivel-2-intermediario.md](./exercicios/nivel-2-intermediario.md)** - Modifique cartas e balanceamento
- **[nivel-3-avancado.md](./exercicios/nivel-3-avancado.md)** - Implemente novas mecânicas

## 🚀 Como Rodar

```bash
# Entrar na pasta
cd jogos-exemplos/nuxt/arcane-duel

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Abra `http://localhost:3000` no navegador.

## 🃏 Como Jogar

| Ação | Como Fazer |
|------|-----------|
| Jogar uma carta | Clique na carta na sua mão |
| Passar o turno | Botão `[ PASSAR TURNO → ]` |
| Ver status | Barra superior (HP + DEF + MANA) |
| Log de batalha | Painel direito da tela |

**Tipos de carta:**
- ⚔ **Ataque** — causa dano direto ao HP inimigo
- ◆ **Defesa** — adiciona armadura (absorve dano futuro)
- ♥ **Cura** — restaura seu HP
- ☯ **Dreno** — ataca e/ou cura ao mesmo tempo

## 🧠 Conceitos-Chave

### Singleton Reativo (o "Cérebro" do Jogo)
```
composable useGame()
  └── _internal (reactive) ← UMA fonte de verdade
       ├── playerHP, aiHP
       ├── playerHand, aiHand
       ├── playerMana, aiMana
       └── log (histórico)
```

### Loop de Turnos
```
TURNO DO JOGADOR:
  1. Compra uma carta
  2. Ganha +1 mana (máx. 10)
  3. Joga 0 ou mais cartas
  4. Passa o turno →
  
TURNO DA IA (1.4s de delay):
  1. Compra uma carta
  2. Ganha +1 mana
  3. Escolhe a melhor carta (algoritmo de prioridade)
  4. Joga 1 ou 2 cartas
  5. Devolve o turno →
```

### Algoritmo da IA (Prioridades em Ordem)
```typescript
1. Kill shot  → se pode matar você, mata
2. Cura        → se HP < 8, sempre cura primeiro
3. Dreno       → se HP < 15 e você desguarnecido
4. Defesa      → se HP < 12, 45% de chance de defender
5. Melhor dano/custo → jogo ofensivo padrão
```

## 📊 Estrutura de Dados

### Carta (GameCard)
```typescript
interface GameCard {
  id: string        // identificador do tipo
  uid: string       // identificador único desta instância
  name: string      // nome exibido
  type: 'attack' | 'defense' | 'heal' | 'drain'
  attack: number    // dano causado
  defense: number   // armadura adicionada
  heal: number      // vida restaurada
  cost: number      // custo em mana (1–6)
  art: string[]     // 4 linhas de arte ASCII
  color: string     // cor hex para o visual
}
```

### Estado do Jogo (GameState)
```typescript
interface GameState {
  phase: 'start' | 'player_turn' | 'ai_thinking' | 'game_over'
  playerHP: number        // 0–30
  aiHP: number            // 0–30
  playerMana: number      // 0–10
  aiMana: number          // 0–10
  playerDefense: number   // acumula até ser absorvido
  aiDefense: number
  playerHand: GameCard[]  // cartas na mão
  log: LogEntry[]         // histórico de ações
  winner: 'player' | 'ai' | null
}
```

## 🎨 Tecnologias

- **Nuxt 3** — Framework Vue com roteamento e composables automáticos
- **Vue 3** — Reatividade com `reactive()`, `ref()`, `watch()`
- **TypeScript** — Tipagem estática para todas as estruturas de dados
- **CSS puro** — Tema dark inspirado em terminais ASCII (sem Tailwind)

## 💡 Próximos Passos

1. ✅ Entender a arquitetura (leia `00_visao-geral.md`)
2. ✅ Ver o loop de turnos (leia `01_game-loop.md`)
3. ✅ Estudar a IA (leia `SRC_COMENTADO_useGame.ts`)
4. ✅ Fazer exercícios (comece `nivel-1-basico.md`)
5. 🚀 Crie suas próprias cartas e mecânicas (veja Nível 3)

## 🐛 Troubleshooting

**"O jogo não carrega"**
- Rode `npm install` antes de `npm run dev`
- Verifique se é Nuxt 3.15.x: `cat package.json | grep nuxt`

**"Cliquei na carta e não aconteceu nada"**
- Cartas cinzas = mana insuficiente (custo maior que seu mana atual)
- Verifique se é seu turno (badge `SEU TURNO` no centro)

**"A IA nunca joga"**
- O delay de 1.4s é intencional para simular "pensamento"
- Se travar, abra DevTools (F12) e veja o console

---

**Criado com 💜 por Taino Educador**
**Mindpunk Game Development Education**
**Leia os arquivos em ordem. Comece com `00_visao-geral.md`. Divirta-se! 🃏**
