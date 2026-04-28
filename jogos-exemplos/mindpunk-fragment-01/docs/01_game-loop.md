# 🔄 Game Loop - Como Fragmento 01 Funciona

---

## O Que é um Game Loop?

Um **game loop** é o "coração" de QUALQUER jogo. É um ciclo infinito que:

```
┌─────────────────────┐
│  1. INPUT           │  ← Lê o que o jogador faz
│     (teclado, mouse)│
├─────────────────────┤
│  2. UPDATE          │  ← Processa ações
│     (lógica do jogo)│
├─────────────────────┤
│  3. RENDER          │  ← Desenha na tela
│     (UI, grid, HUD) │
└─────────────────────┘
       ↑               ↓
       └───── REPETE ──┘
```

**Fragmento 01** segue este padrão!

---

## Em Fragmento 01: Onde Está O Game Loop?

### 1️⃣ **INPUT** → `App.tsx`

```typescript
/**
 * ARQUIVO: App.tsx
 * RESPONSABILIDADE: Capturar input do teclado
 * 
 * O que faz:
 *   - Escuta teclas (W, A, S, D, ESPAÇO, etc)
 *   - Envia comando para o store (exemplo: movePlayer('UP'))
 *   - Previne comportamento padrão do navegador (evitar scroll)
 */

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Escuta a tecla pressionada
    if (e.code === 'Space') movePlayer('WAIT');
    
    switch (e.key) {
      case 'w': movePlayer('UP'); break;
      case 's': movePlayer('DOWN'); break;
      case 'a': movePlayer('LEFT'); break;
      case 'd': movePlayer('RIGHT'); break;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
}, [movePlayer]);
```

**Resumo:** Teclado → `App.tsx` → envia comando ao `useGameStore`

---

### 2️⃣ **UPDATE** → `useGameStore.ts`

Aqui acontece TODA lógica do jogo:

#### A. Validar Movimento
```typescript
/**
 * FUNÇÃO: movePlayer
 * 
 * O que faz:
 *   1. Calcula próxima posição (x+1, y+1, etc)
 *   2. Verifica se é válido (não é parede, etc)
 *   3. Se atacar inimigo, calcula dano
 *   4. Se mover OK, atualiza posição do player
 */

const movePlayer = (direction: Direction) => {
  // ... cálculos ...
  
  // Se chegou aqui, movimento é válido
  setGame(state => ({
    ...state,
    player: { ...state.player, pos: newPos }
  }));
};
```

#### B. Processar IA dos Inimigos
```typescript
/**
 * Depois que o player agir, é a vez dos inimigos!
 * ARQUIVO: logic/ai.ts
 * 
 * Cada inimigo:
 *   1. Vê onde o player está (se consegue)
 *   2. Decide ação (atacar, perseguir, aleatório)
 *   3. Move ou ataca
 */

processEnemiesTurn(enemies, playerPos);
```

#### C. Checar Vitória/Derrota
```typescript
// Alguém ganhou?
if (playerReachedExit) → setStatus('WON');
if (playerHp <= 0) → setStatus('LOST');
```

**Resumo:** `useGameStore.ts` é o "comando central" que:
- Valida ações
- Processa IA
- Atualiza estado
- Checa fim de jogo

---

### 3️⃣ **RENDER** → `components/Game/Grid.tsx` + `components/Ui/`

Depois que tudo foi processado, **desenha na tela**:

```typescript
/**
 * ARQUIVO: components/Game/Grid.tsx
 * 
 * O que faz:
 *   1. Lê o estado do jogo (position, inimigos, HP)
 *   2. Renderiza cada célula do grid:
 *      @ = player
 *      E = enemy
 *      # = parede
 *      . = piso
 *      ▶ = saída
 *   3. Mostra cores, animações
 */

function Grid() {
  const { grid, player, enemies } = useGameStore();
  
  return (
    <div className="grid">
      {grid.map((cell, index) => (
        <div key={index} className="cell">
          {cell.type === 'PLAYER' && '@ '}
          {cell.type === 'ENEMY' && 'E '}
          {cell.type === 'WALL' && '# '}
        </div>
      ))}
    </div>
  );
}
```

**Resumo:** Componentes React desenham o estado na tela

---

## 🔄 Ciclo Completo: Um Exemplo

```
TURNO 1:

[INPUT]
Usuario pressiona W (seta pra cima)
  ↓
[UPDATE] - App.tsx chama movePlayer('UP')
  - Calcula nova posição
  - Move player de (5,5) para (4,5)
  - Processa IA dos inimigos (todos se movem)
  - Verifica se ganhou/perdeu
  ↓
[RENDER] - Componentes React desenham
  - Grid atualiza mostrando player na nova posição
  - HUD atualiza HP, XP
  - Overlay mostra status
  ↓
AGUARDANDO PRÓXIMA AÇÃO...

TURNO 2:
Usuario pressiona D (seta pra direita)
  ↓
[UPDATE] 
  - Move para (4,6)
  - IA inimiga: um inimigo chegou perto, ATACA!
  - Dano calculado: 15 hp
  - Player agora tem 85/100 hp
  ↓
[RENDER]
  - Player em (4,6)
  - HUD mostra 85/100 hp (vermelho)
  ↓
...
```

---

## 📊 Diagrama: Onde Cada Coisa Faz O Quê

```
┌─────────────────────────────────────────┐
│          APP.TSX (ENTRADA)              │
│  - Captura teclado                      │
│  - Chama movePlayer()                   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  USEGAMESTORE.TS (LÓGICA)               │
│  - Valida movimento                     │
│  - Processa IA (logic/ai.ts)            │
│  - Calcula combate (logic/combat.ts)    │
│  - Atualiza estado                      │
│  - Checa vitória/derrota                │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  COMPONENTS (RENDERIZAÇÃO)              │
│  - Grid.tsx → desenha tabuleiro         │
│  - HUD.tsx → mostra stats               │
│  - Overlay.tsx → menu/status            │
└──────────────┬──────────────────────────┘
               │
               ↓
         [TELA DO JOGO]
               │
               └──→ (volta ao INPUT)
```

---

## 💡 Por Que Isso Importa?

Entender o **game loop** é entender como QUALQUER jogo funciona:
- ✅ Pong? Tem game loop
- ✅ Minecraft? Tem game loop
- ✅ Fortnite? Tem game loop

A estrutura é sempre:
1. Ler entrada
2. Processar lógica
3. Renderizar
4. Repetir

**Fragmento 01 usa o game loop em React**, o que muda é a implementação, mas a ideia é mesma!

---

## 🚀 Próximo Passo

- Leia **`02_movement.md`** para entender como o movimento funciona
- Leia **`03_state-management.md`** para entender Zustand
