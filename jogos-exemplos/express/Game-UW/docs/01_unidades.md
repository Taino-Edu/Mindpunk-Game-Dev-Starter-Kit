# 🪖 Unidades - Sistema de Tropas

---

## O Que É Uma Unidade?

Uma **unidade** é um "objeto" que representa uma tropa. Cada unidade tem **propriedades** (stats) que definem como ela funciona.

---

## 📊 Estrutura de Uma Unidade

```typescript
/**
 * ESTRUTURA DE UMA UNIDADE
 * 
 * Cada unidade é um objeto com essas propriedades:
 */

interface Unit {
  id: string;              // Identificador único (ex: "unit-1")
  type: string;            // Tipo (ex: "infantaria", "tanque")
  owner: string;           // Quem é o dono (ex: "player", "enemy")
  
  // --- STATS (Números do Jogo) ---
  hp: number;              // Vida atual
  maxHp: number;           // Vida máxima
  
  attack: number;          // Dano que causa
  defense: number;         // Reduz dano recebido
  
  movement: number;        // Quantas casas pode se mover por turno
  range: number;           // Distância máxima de ataque
  
  // --- POSIÇÃO ---
  x: number;               // Coordenada X no mapa
  y: number;               // Coordenada Y no mapa
  
  // --- ESTADO ---
  hasMovedThisTurn: boolean;  // Já se moveu neste turno?
  hasAttackedThisTurn: boolean; // Já atacou neste turno?
}
```

---

## 📋 Tipos de Unidades

Game-UW pode ter diferentes tipos. Exemplo:

### Infantaria
```
┌─────────────────┐
│ INFANTARIA      │
├─────────────────┤
│ HP: 20          │ (vida baixa)
│ ATK: 8          │ (ataque fraco)
│ DEF: 2          │ (defesa fraca)
│ MOV: 3          │ (movimento normal)
│ RANGE: 1        │ (ataca só perto)
│ CUSTO: 100 ouro │ (barato)
└─────────────────┘

✅ Bom para: Números, ocupar espaço
❌ Ruim para: Combate corpo-a-corpo pesado
```

### Tanque
```
┌─────────────────┐
│ TANQUE          │
├─────────────────┤
│ HP: 60          │ (vida ALTA)
│ ATK: 15         │ (ataque forte)
│ DEF: 8          │ (defesa FORTE)
│ MOV: 2          │ (movimento lento)
│ RANGE: 2        │ (ataca média distância)
│ CUSTO: 300 ouro │ (caro)
└─────────────────┘

✅ Bom para: Defesa, tankar dano
❌ Ruim para: Movimento rápido
```

### Arqueiro
```
┌─────────────────┐
│ ARQUEIRO        │
├─────────────────┤
│ HP: 15          │ (vida muito baixa)
│ ATK: 12         │ (ataque bom)
│ DEF: 1          │ (defesa fraca)
│ MOV: 3          │ (movimento rápido)
│ RANGE: 4        │ (ataca LONGE)
│ CUSTO: 150 ouro │ (médio)
└─────────────────┘

✅ Bom para: Ataque à distância, dano
❌ Ruim para: Tankar dano
```

---

## 🎯 Como Uma Unidade Age

### 1. **MOVER**
```
Jogador clica em unidade → clica em célula alvo
  ↓
Sistema verifica:
  ├─ A célula está dentro do alcance? (MOV)
  ├─ A célula está ocupada? (pode passar?)
  ├─ Qual é o terreno? (modifica defesa)
  ↓
Unidade se move para nova posição
```

### 2. **ATACAR**
```
Jogador clica em unidade → clica em inimigo
  ↓
Sistema verifica:
  ├─ Inimigo está no alcance? (RANGE)
  ├─ Já atacou este turno?
  ↓
Calcula dano:
  Dano Base = ATK da unidade
  Dano Final = Dano Base - (DEF do inimigo * 0.5)
  ↓
Inimigo toma dano
  HP do inimigo = HP - Dano Final
  
Se HP <= 0:
  Unidade morre e é removida
```

---

## 🔧 Como Unidades são Definidas no Código

No `src/renderer/src/game/defs/`:

```typescript
/**
 * ARQUIVO: unitDefinitions.ts
 * 
 * Aqui estão TODOS os tipos de unidades
 * e seus stats base.
 */

const UNIT_DEFS = {
  'infantaria': {
    name: 'Infantaria',
    hp: 20,
    attack: 8,
    defense: 2,
    movement: 3,
    range: 1,
    cost: 100
  },
  
  'tanque': {
    name: 'Tanque',
    hp: 60,
    attack: 15,
    defense: 8,
    movement: 2,
    range: 2,
    cost: 300
  },
  
  'arqueiro': {
    name: 'Arqueiro',
    hp: 15,
    attack: 12,
    defense: 1,
    movement: 3,
    range: 4,
    cost: 150
  }
};

/**
 * Quando você quer criar uma infantaria:
 */
function createUnit(type: string, owner: string, x: number, y: number) {
  const def = UNIT_DEFS[type];
  
  return {
    id: generateId(),
    type: type,
    owner: owner,
    hp: def.hp,          // Pega HP da definição
    maxHp: def.hp,
    attack: def.attack,  // Pega ATK da definição
    defense: def.defense,
    movement: def.movement,
    range: def.range,
    x: x,
    y: y,
    hasMovedThisTurn: false,
    hasAttackedThisTurn: false
  };
}
```

---

## 💡 Conceito: "Abstração"

Aqui temos um exemplo de **abstração**:

```
Realidade → Representação no Código

Um soldado real      → Objeto Unit
  ├─ tem vida        ├─ hp: number
  ├─ causa dano      ├─ attack: number
  ├─ se protege      ├─ defense: number
  └─ se move         └─ movement: number
```

Simplificamos um soldado real em **números**! Isso permite:
- ✅ Comparar unidades (qual é mais forte?)
- ✅ Calcular resultado de combate (quantos dano toma?)
- ✅ Balancear o jogo (é justo?)

---

## ✅ Resumo: O Que Você Aprendeu

- [ ] Uma unidade é um **objeto com stats**
- [ ] Diferentes tipos têm **diferentes strengths/weaknesses**
- [ ] Unidades podem **se mover** e **atacar**
- [ ] Cada tipo é definido em `UNIT_DEFS`
- [ ] Quando cria uma unidade, usa a definição como "template"

---

## 🚀 Próximo Passo

Leia **`02_mapas.md`** para entender onde as unidades se movem!
