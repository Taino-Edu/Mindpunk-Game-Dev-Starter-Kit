# 🎮 Fragmento 01: Roguelike em Tempo Real

Um jogo educacional de dungeon roguelike que ensina os fundamentos de **game loops**, **state management** e **IA simples**.

## 🎯 O Que É?

Fragmento 01 é um jogo roguelike tático em tempo real onde você navega um mapa proceduralmente gerado (8x8), evita inimigos e encontra a saída. A cada turno, inimigos se aproximam e atacam usando lógica de IA simples baseada em Manhattan distance.

**Objetivo:** Sobreviver, coletar itens e encontrar a saída (🚪) antes de morrer.

## 🏗️ Arquitetura

```
src/
├── game/
│   ├── useGameStore.ts      ← State Management (Zustand)
│   ├── Game.tsx             ← Componente React principal
│   └── logic/
│       ├── ai.ts            ← Processamento turno inimigos
│       ├── mapGenerator.ts   ← Geração procedural do mapa
│       └── pathfinding.ts    ← Cálculos de distância
└── types.ts                 ← Definições TypeScript
```

## 📚 Documentação Educacional

Leia em ordem:

1. **[00_visao-geral.md](./docs/00_visao-geral.md)** - Visão geral do jogo
2. **[01_game-loop.md](./docs/01_game-loop.md)** - Como funciona qualquer game loop
3. **[SRC_COMENTADO_ai.ts](./docs/SRC_COMENTADO_ai.ts)** - Código comentado da IA
4. **[SRC_COMENTADO_useGameStore.ts](./docs/SRC_COMENTADO_useGameStore.ts)** - State management explicado

## 🎓 Exercícios Práticos

Teste seu entendimento:

- **[nivel-1-basico.md](./exercicios/nivel-1-basico.md)** - Explore e observe
- **[nivel-2-criativo.md](./exercicios/nivel-2-criativo.md)** - Modifique o jogo
- **[nivel-3-avancado.md](./exercicios/nivel-3-avancado.md)** - Implemente novas features

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build
```

Abra `http://localhost:5173` no navegador.

## 🎮 Controles

| Ação | Tecla |
|------|-------|
| Mover UP | ↑ ou W |
| Mover DOWN | ↓ ou S |
| Mover LEFT | ← ou A |
| Mover RIGHT | → ou D |
| Atacar | Automático ao lado de inimigo |
| Passo | Automático (turno-based) |

## 🧠 Conceitos-Chave

### Game Loop
```
CADA FRAME (60 FPS):
1. INPUT   → Você aperta uma tecla
2. UPDATE  → Seu personagem se move
3. RENDER  → Desenha na tela
```

### State Management (Zustand)
Todo o estado do jogo fica em **um único lugar** (`useGameStore`):
- Posição do player
- HP do player
- Lista de inimigos
- Mapa
- Items

### IA dos Inimigos
Cada turno, cada inimigo:
1. Calcula distância até você (Manhattan: `|dx| + |dy|`)
2. Se distância === 1 → **ATACA** 💥
3. Se distância > 1 → **se move** em sua direção
4. Se caminho bloqueado → **flanqueia** (tenta outro eixo)

### Pathfinding Simples
```typescript
// Distância Manhattan
const distance = Math.abs(playerX - enemyX) + Math.abs(playerY - enemyY);

// Se está ao lado, ataca
if (distance === 1) {
  damageDealt += enemy.damage;
}

// Se longe, se move
else if (distance > 1) {
  enemy.move(towards: player);
}
```

## 📊 Estrutura de Dados

### Player
```typescript
interface Player {
  pos: { x: number; y: number };
  hp: number;
  maxHp: number;
  damage: number;
  items: Item[];
}
```

### Enemy
```typescript
interface Enemy {
  id: string;
  pos: { x: number; y: number };
  hp: number;
  damage: number;
}
```

### Map Grid
```typescript
// Cada número representa um tipo de célula
// 0 = vazio (pode passar)
// 1 = parede (bloqueado)
// 2 = item (pode pegar)
// 3 = player
// 4 = inimigo
// 9 = saída (objetivo)

const grid: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 4, 0, 1],
  [1, 4, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 9, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
```

## 🎨 Tecnologias

- **React** - UI e componentes
- **TypeScript** - Type safety
- **Zustand** - State management
- **Vite** - Build tool
- **CSS** - Styling (pixel art vibes)

## 💡 Próximos Passos

1. ✅ Entender o game loop (leia `01_game-loop.md`)
2. ✅ Estudar state management (leia `SRC_COMENTADO_useGameStore.ts`)
3. ✅ Entender IA (leia `SRC_COMENTADO_ai.ts`)
4. ✅ Fazer exercícios (comece Nível 1)
5. 🚀 Implemente suas próprias features (veja Nível 3)

## 🐛 Troubleshooting

**"O jogo não carrega"**
- Certifique-se que rodou `npm install`
- Abra DevTools (F12) e veja console

**"Inimigos não aparecem"**
- Veja se `processEnemiesTurn()` está sendo chamada no `updateGameState()`
- Cheque `SRC_COMENTADO_ai.ts` pra entender fluxo

**"Não consigo mover"**
- Veja controles acima
- Cheque se há parede bloqueando

## 📖 Referências

- [Phaser Docs](https://photonstorm.github.io/phaser3-docs/) (inspiração)
- [Game Loop Pattern](https://gameprogrammingpatterns.com/game-loop.html)
- [Manhattan Distance](https://en.wikipedia.org/wiki/Taxicab_geometry)

## 🎓 Para Educadores

Este projeto é perfeito para:
- Ensinar game loops em Python, JavaScript ou TypeScript
- Introduzir state management
- Demonstrar IA simples
- Praticar lógica algorítmica

**Tempo estimado:** 2-3 horas pra entender tudo

Veja `roteiro-professor.md` para guia completo de aula.

---

**Criado com 💜 por Taino Educador**  
**Mindpunk Game Development Education**  
**Leia os arquivos em ordem. Comece com `00_visao-geral.md`. Divirta-se! 🎮**
