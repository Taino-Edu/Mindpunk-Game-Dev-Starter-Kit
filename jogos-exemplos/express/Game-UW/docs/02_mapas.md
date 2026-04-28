# 🗺️ Mapas - O Tabuleiro

---

## O Que É Um Mapa?

Um **mapa** é o "tabuleiro" onde as unidades se movem. É dividido em **células** (também chamadas de "tiles" ou "hexágonos").

```
Exemplo de Mapa 5x5:

     0     1     2     3     4
   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
0  │ . │ │ . │ │ # │ │ . │ │ . │
   └───┘ └───┘ └───┘ └───┘ └───┘
     ┌───┐ ┌───┐ ┌───┐ ┌───┐
1   │ . │ │ E │ │ # │ │ . │
     └───┘ └───┘ └───┘ └───┘
   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
2  │ P │ │ . │ │ . │ │ . │ │ . │
   └───┘ └───┘ └───┘ └───┘ └───┘
     ┌───┐ ┌───┐ ┌───┐ ┌───┐
3   │ . │ │ . │ │ # │ │ . │
     └───┘ └───┘ └───┘ └───┘
   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
4  │ . │ │ . │ │ . │ │ . │ │ . │
   └───┘ └───┘ └───┘ └───┘ └───┘

Legenda:
  . = terreno vazio (grama)
  # = parede/montanha (bloqueado)
  P = seu jogador
  E = inimigo
```

---

## 🔷 Coordenadas Hexagonais

Game-UW usa **hexágonos** (6 lados). Por quê?

```
Quadrado:        Hexágono:
  ┌─┐              ╱╲
  │□│            ╱  ╲
  └─┘          ╱ ◯  ╲
             ╱╲    ╱╲
             
Problema:      Vantagem:
- 8 vizinhos   - 6 vizinhos (simétrico)
- Diagonal     - Todos iguais
  confunde     - Melhor estratégia

Game-UW usa hexágonos porque:
✅ Distância é mais justa
✅ Movimento fica mais previsível
✅ Estratégia fica melhor
```

### Como Funciona Coordenadas Hex

Existem vários sistemas de coordenadas hex. Game-UW provavelmente usa **"Axial Coordinates"**:

```
Exemplo em Axial (q, r):

       (-1,0)  (0,0)  (1,0)
    (-1,1)  (0,1)  (1,1)  (2,1)
       (-1,2) (0,2)  (1,2)
       
Cada célula tem:
├─ q = coluna horizontal
└─ r = linha diagonal
```

**Para achar vizinhos:**
```
Um hexágono tem 6 vizinhos:

     (q-1,r)  (q,r-1)
        ╱╲    ╱╲
      (q-1,r+1)  (q+1,r-1)
        ╲╱    ╱╲
     (q+1,r)  (q,r+1)
```

---

## 🏘️ Estrutura de Células (Tiles)

Cada célula do mapa tem propriedades:

```typescript
/**
 * ARQUIVO: src/renderer/src/game/hex/hexMap.ts
 * (ou similar)
 */

interface HexTile {
  q: number;              // Coordenada Q (horizontal)
  r: number;              // Coordenada R (diagonal)
  
  // --- TIPO DE TERRENO ---
  terrain: string;        // 'grass', 'water', 'mountain', etc
  
  // --- OCUPAÇÃO ---
  unit?: Unit;            // Qual unidade tá aqui (ou undefined)
  
  // --- MODIFICADORES ---
  defenseBonus: number;   // Modificador de defesa
  movementCost: number;   // Quanto de MOV gasta pra passar
  passable: boolean;      // Dá pra passar por aqui?
}
```

---

## 📏 Cálculo de Distância Hexagonal

Quando uma unidade se move, precisa saber: **quantas casas tenho que andar?**

```typescript
/**
 * FUNÇÃO: calcDistance (distância hexagonal)
 * 
 * Calcula distância entre dois hexágonos
 */

function hexDistance(q1: number, r1: number, q2: number, r2: number): number {
  const dq = Math.abs(q1 - q2);
  const dr = Math.abs(r1 - r2);
  const ds = Math.abs(q1 + r1 - q2 - r2);
  
  return (dq + dr + ds) / 2;
}

/**
 * EXEMPLO:
 * Distância de (0,0) até (2,1):
 */

const dist = hexDistance(0, 0, 2, 1);
// dist = 2 hexágonos de distância
```

**Por quê isso importa?**
- ✅ Saber se uma unidade consegue se mover até lá (deve ser <= MOV)
- ✅ Saber se consegue atacar (deve ser <= RANGE)
- ✅ Calcular rotas (pathfinding)

---

## 🚶 Pathfinding: Como Encontrar o Caminho?

Quando você quer mover uma unidade de A até B:

```
START: (0,0)            END: (4,3)
    │                        │
    └────────────────────────┘

Pergunta: Qual é o CAMINHO mais curto?
Resposta: Sistema calcula o melhor caminho

Algoritmo (A* ou Dijkstra):
1. Começa em (0,0)
2. Verifica todos os vizinhos (6 hexágonos)
3. Marca qual tem menor custo
4. Repete até chegar em (4,3)

RESULTADO:
(0,0) → (1,0) → (1,1) → (2,1) → (3,2) → (4,3)
  │       │       │       │       │       │
  └───────┴───────┴───────┴───────┴───────┘
         Caminho escolhido
```

---

## 🎨 Renderizando o Mapa

```typescript
/**
 * ARQUIVO: src/renderer/src/game/Game.ts
 * 
 * Para desenhar o mapa:
 */

function renderMap(tiles: HexTile[]) {
  tiles.forEach(tile => {
    // Desenha o hexágono visual
    drawHexagon(tile.q, tile.r);
    
    // Colore baseado no terreno
    if (tile.terrain === 'grass') setColor('green');
    if (tile.terrain === 'water') setColor('blue');
    if (tile.terrain === 'mountain') setColor('gray');
    
    // Se tem unidade, desenha ela
    if (tile.unit) {
      drawUnit(tile.unit);
    }
  });
}
```

---

## 💡 Conceito: "Dados Vs Visuais"

Importante entender:

```
NO CÓDIGO:              NA TELA:
(q=2, r=1)       →      🔷 (desenho visual)
terrain='grass'  →      cor verde
unit=Unit{...}   →      ícone de soldado

Dados (números)         Visualização (imagem)
são processados         é o que você vê
```

---

## ✅ Resumo: O Que Você Aprendeu

- [ ] Um mapa é dividido em **hexágonos**
- [ ] Cada hexágono tem **coordenadas (q, r)**
- [ ] Cada hexágono tem **propriedades** (terreno, unidade, defesa)
- [ ] **Distância hexagonal** é calculada de forma especial
- [ ] **Pathfinding** encontra o caminho mais curto

---

## 🚀 Próximo Passo

Leia **`03_micros-macros.md`** para aprender estratégia!
