# 🎮 Game-UW - Visão Geral

> Um simulador tático de **unidades**, **mapas** e **estratégia**.

---

## O Que É Game-UW?

**Game-UW** (War Simulator) é um jogo de **simulação tática** onde você:
- Comanda **unidades militares** em um **mapa hexagonal**
- Toma decisões de **estratégia** (posicionamento, movimento)
- Realiza **ações micro** (mover uma unidade)
- Executa **estratégia macro** (planejamento geral)
- Vence derrotando o inimigo

**Tecnologia:**
- Backend: **Express** (Node.js)
- Frontend: **Electron** (desktop app)
- Comunicação: **WebSockets / HTTP**

---

## 🎯 3 Conceitos Principais

### 1. **Unidades** (Units)
```
O que são?
└─ Soldados, tanques, aviões, etc
   Cada um tem:
   ├─ HP (vida)
   ├─ Ataque (dano)
   ├─ Defesa (reduz dano)
   ├─ Movimento (quantas casas pode se mover)
   └─ Custo (quanto custa treinar)

Exemplo:
┌────────────────────┐
│ Soldado Infantaria │
│ HP: 20             │
│ ATK: 8             │
│ DEF: 2             │
│ MOV: 3             │
│ Custo: 100 ouro    │
└────────────────────┘
```

### 2. **Mapas** (Maps)
```
O que é?
└─ O "tabuleiro" onde as unidades se movem
   Pode ser:
   ├─ Hexagonal (6 lados)
   ├─ Quadrado (4 lados)
   └─ Isométrico (3D visual)

Exemplo (Hexagonal):
     [A1] [A2] [A3]
   [B1] [B2] [B3] [B4]
     [C1] [C2] [C3]

Cada célula tem:
├─ Tipo (grama, água, montanha)
├─ Defesa (modificador)
└─ Ocupante (qual unidade tá ali)
```

### 3. **Micro vs Macro** (Decisões)
```
MICRO (Ações Pequenas)
└─ Mover UM soldado
   └─ Atacar 1 inimigo
      └─ Usar habilidade especial

MACRO (Estratégia Geral)
└─ Onde posicionar suas tropas
   └─ Qual rota de ataque usar
      └─ Quando recuar/avançar
         └─ Alocação de recursos
```

---

## 📂 Estrutura Essencial

```
Game-UW/
├── src/
│   ├── main/
│   │   └── index.ts          ← Backend Electron
│   │
│   └── renderer/
│       └── src/
│           ├── game/
│           │   ├── Game.ts   ← Lógica principal
│           │   ├── defs/     ← Definições de unidades
│           │   ├── data/     ← Dados do mapa/jogo
│           │   ├── hex/      ← Sistema hexagonal
│           │   └── scenes/   ← Cenas (menu, gameplay)
│           │
│           ├── main.ts       ← Entry point
│           └── renderer.ts   ← Renderização
│
└── docs/
    ├── 00_visao-geral.md       ← Você está aqui
    ├── 01_unidades.md          ← Sistema de unidades
    ├── 02_mapas.md             ← Sistema de mapas
    ├── 03_micros-macros.md     ← Estratégia
    └── exercicios/
        ├── nivel-1.md          ← Entender unidades
        ├── nivel-2.md          ← Posicionar tropas
        └── nivel-3.md          ← Estratégia avançada
```

---

## 🎮 Como Jogar (Básico)

1. **Crie unidades** → Compre infantaria, tanques, etc
2. **Posicione no mapa** → Coloque em posição estratégica
3. **Mova e ataque** → Vá em direção ao inimigo
4. **Destrua o inimigo** → Derrote todas as unidades dele
5. **Vence!** → Você ganhou a batalha

---

## 💡 Por Que Isso Importa?

Game-UW ensina:
- ✅ **Abstração de dados** (unidade = objeto com stats)
- ✅ **Estruturas de grid** (como representar mapas)
- ✅ **Lógica de turnos** (quem age quando)
- ✅ **Balanceamento** (como deixar justo)
- ✅ **Estratégia** (pensar vários passos à frente)

Esses conceitos aparecem em **QUALQUER jogo tático ou estratégico**!

---

## 🚀 Próximo Passo

Leia **`01_unidades.md`** para entender como as unidades são estruturadas no código!
