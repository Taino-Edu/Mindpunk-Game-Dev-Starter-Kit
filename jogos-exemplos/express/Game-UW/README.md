# ⚔️ Game-UW: Tactical Warfare (Hexagonal Grid Strategy)

Um jogo educacional de estratégia tática com grids hexagonais que ensina **game design**, **balanceamento**, **teoria de jogos** e **arquitetura em Phaser 3**.

## 🎯 O Que É?

Game-UW (Unnamed Warfare) é um jogo tático por turnos onde você controla 3 tipos diferentes de unidades (Infantaria, Tanque, Arqueiro) em um mapa hexagonal para derrotar inimigos. Cada unidade tem stats únicos criando um sistema **Rock-Paper-Scissors balanceado**.

**Objetivo:** Destruir todas as unidades inimigas mantendo as suas vivas.

## 🏗️ Arquitetura

```
src/
├── renderer/
│   ├── src/
│   │   ├── game/
│   │   │   ├── Game.ts              ← Inicialização Phaser
│   │   │   ├── scenes/
│   │   │   │   ├── BootScene.ts     ← Carrega assets
│   │   │   │   ├── MacroScene.ts    ← Seleção de missão
│   │   │   │   └── TacticalScene.ts ← Batalha principal
│   │   │   └── defs/
│   │   │       ├── units/
│   │   │       │   └── index.ts     ← Definição de unidades
│   │   │       └── maps/
│   │   │           └── index.ts     ← Definição de mapas
│   │   └── index.html
│   └── electron.ts
└── types.ts
```

## 📚 Documentação Educacional

Leia em ordem:

1. **[00_visao-geral.md](./docs/00_visao-geral.md)** - O que é Game-UW
2. **[01_unidades.md](./docs/01_unidades.md)** - Unidades e balanceamento
3. **[02_mapas.md](./docs/02_mapas.md)** - Hexagonal grids e pathfinding
4. **[03_micros-macros.md](./docs/03_micros-macros.md)** - Estratégia micro vs macro
5. **[SRC_COMENTADO_Game.ts](./docs/SRC_COMENTADO_Game.ts)** - Inicialização Phaser
6. **[SRC_COMENTADO_unitDefinitions.ts](./docs/SRC_COMENTADO_unitDefinitions.ts)** - Design de unidades

## 🎓 Exercícios Práticos

Teste seu entendimento:

- **[nivel-1-basico.md](./exercicios/nivel-1-basico.md)** - Calcule matchups e stats
- **[nivel-2-intermediario.md](./exercicios/nivel-2-intermediario.md)** - Estratégia avançada
- **[nivel-3-avancado.md](./exercicios/nivel-3-avancado.md)** - Metagame e balanceamento

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build Electron
npm run build
```

A aplicação abrirá em modo Electron.

## 🎮 Controles

| Ação | Input |
|------|-------|
| Selecionar unidade | Clique esquerdo |
| Mover unidade | Clique em célula hexagonal |
| Atacar | Automático ao alcance |
| Terminar turno | Botão "End Turn" ou ESPAÇO |
| Zoom | Scroll do mouse |
| Pan | Clique direito + arrastar |

## ⚔️ As 3 Unidades

### 🗡️ Infantaria (Cheap & Fast)
```
HP:     20      ← Fraca
ATK:    8       ← Moderada
DEF:    2       ← Nenhuma
MOV:    3       ← RÁPIDA ⚡
RANGE:  1       ← Corpo-a-corpo
CUSTO:  30 ouro ← BARATA 💰

Bate: Arqueiro (alcança rápido)
Perde: Tanque (defesa alta)
Melhor uso: Swarm tactics, flank, early game
```

### 🛡️ Tanque (Expensive & Tanky)
```
HP:     80      ← FORTE 💪
ATK:    5       ← Fraco
DEF:    8       ← MUITA 🛡️
MOV:    2       ← Lento
RANGE:  1       ← Corpo-a-corpo
CUSTO:  80 ouro ← CARO 💸

Bate: Infantaria (defesa reduz)
Perde: Arqueiro (não alcança)
Melhor uso: Hold position, protetor, late game
```

### 🏹 Arqueiro (Ranged Sniper)
```
HP:     15      ← MUITO FRACO
ATK:    12      ← ALTO DANO 💥
DEF:    1       ← Nenhuma
MOV:    3       ← Rápido
RANGE:  4       ← LONGO ALCANCE 🎯 (maior!)
CUSTO:  50 ouro ← Preço médio

Bate: Tanque (ignora defesa)
Perde: Infantaria (ela alcança)
Melhor uso: Apoio à distância, anti-tank, formação [TANK][ARCHER]
```

## 🎯 O Triângulo de Combate (Rock-Paper-Scissors)

```
        INFANTARIA
        /        \
       /          \
      /            \
  TANQUE --------- ARQUEIRO

Cada um bate um e perde para outro.
Isso = BALANCEADO e INTERESSANTE!
```

| Matchup | Resultado | Por quê |
|---------|-----------|--------|
| Infantaria vs Arqueiro | Infantaria vence | Alcança rápido antes arqueiro atirar |
| Arqueiro vs Tanque | Arqueiro vence | Range ignora defesa alta |
| Tanque vs Infantaria | Tanque vence | Defesa 8 reduz dano dela em 50% |

## 🧠 Conceitos-Chave

### Game Loop em Phaser
```
CADA FRAME (60 FPS):
├── INPUT  → Detecta clique/teclado
├── UPDATE → Processa lógica (movimento, combate)
└── RENDER → Desenha hexágonos e unidades
```

### Cenas (Scene Stack)
```
BootScene
  ↓ (carrega assets)
MacroScene (visão de campanha)
  ↓ (player escolhe missão)
TacticalScene (batalha)
  ↓ (game loop roda aqui)
```

### Coordenadas Hexagonais (Axial q,r)
```
Cada célula é identificada por (q, r):
     
    (0,0) (1,0) (2,0)
   (0,1) (1,1) (2,1)
    (0,2) (1,2) (2,2)

Distância hexagonal = (|q1-q2| + |r1-r2| + |s1-s2|) / 2
onde s = -q - r
```

### Balanceamento por Design
```
COST-EFFICIENCY (Stats Totais / Custo):

Infantaria: (20+8+2+3+1)/30 = 1.13 ← Melhor valor
Tanque:     (80+5+8+2+1)/80 = 1.20 ← Muito bom
Arqueiro:   (15+12+1+3+4)/50 = 0.70 ← Caro

MAS... métricas simples enganam!
→ Uma Infantaria nunca bate 1v1 um Tanque
→ Um Arqueiro bate Tanque por ignorar defesa
→ Design é arte, não só números!
```

## 🎨 Tecnologias

- **Phaser 3** - Framework 2D de jogos
- **TypeScript** - Type safety
- **Electron** - Desktop app
- **Canvas/WebGL** - Renderização
- **Hexagonal Grid** - Sistema de movimento

## 📊 Estrutura de Dados

### UnitDefinition
```typescript
interface UnitDefinition {
  id: string;           // 'infantry', 'tank', 'archer'
  name: string;         // Nome legível
  hp: number;           // Vida total
  attack: number;       // Dano por golpe
  defense: number;      // Redução percentual
  range: number;        // Alcance em hexágonos
  movement: number;     // Hexágonos por turno
  cost: number;         // Ouro para recrutar
  sprite: string;       // Caminho da imagem
  color: string;        // Cor do jogador
}
```

### BattleUnit (instância em combate)
```typescript
interface BattleUnit {
  id: string;
  definition: UnitDefinition;
  hp: number;              // HP atual (pode mudar)
  position: HexCoord;      // (q, r) no mapa
  owner: 'player' | 'ai';  // Quem controla
  hasMovedThisTurn: boolean;
}
```

### HexCoord
```typescript
interface HexCoord {
  q: number;  // Coordenada axial Q
  r: number;  // Coordenada axial R
}
```

## 💡 Próximos Passos

1. ✅ Entender unidades (leia `01_unidades.md`)
2. ✅ Aprender hexagonal grids (leia `02_mapas.md`)
3. ✅ Estudar Phaser (leia `SRC_COMENTADO_Game.ts`)
4. ✅ Entender design (leia `SRC_COMENTADO_unitDefinitions.ts`)
5. ✅ Fazer exercícios (comece Nível 1)
6. 🚀 Implemente novos mapas ou unidades (veja Nível 3)

## 🐛 Troubleshooting

**"Tela preta quando abre"**
- Cheque console (F12)
- Certifique-se `npm install` rodou
- Recompile com `npm run build`

**"Unidades não se movem"**
- Certifique-se de clicar numa célula hexagonal válida (dentro de movimento)
- Veja se tem parede bloqueando

**"Não entendo hexágonos"**
- Leia `02_mapas.md` inteiro
- Veja exemplos de cálculo de distância

**"Como mudo os stats?"**
- Vá em `src/renderer/src/game/defs/units/index.ts`
- Modifique INFANTRY, TANK, ARCHER
- Releia `SRC_COMENTADO_unitDefinitions.ts` pra entender balanceamento

## 🎓 Para Educadores

Este projeto é perfeito para:
- Ensinar teoria de jogos (Rock-Paper-Scissors)
- Demonstrar balanceamento por design
- Explicar Phaser 3 e game loops
- Praticar arquitetura em TypeScript
- Discutir Nash equilibrium e meta

**Tempo estimado:** 4-5 horas pra entender tudo (é mais complexo que Fragmento 01)

Veja `roteiro-professor.md` para guia completo de aula.

## 📖 Referências

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/)
- [Game Balance](https://youtu.be/tR0Sn8jT5OA) (GDC Talk)
- [Rock-Paper-Scissors Design](https://en.wikipedia.org/wiki/Intransitive_game)
- [Nash Equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium)

---

**Criado com 💜 por Taino Educador**  
**Mindpunk Game Development Education**  
**Leia os arquivos em ordem. Comece com `00_visao-geral.md`. Aprenda estratégia! ⚔️**
