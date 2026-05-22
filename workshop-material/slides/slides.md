# 🎮 Mindpunk Game Dev Workshop - UNIP
## Slides (Para apresentar em slides/projetor)

---

# SLIDE 1: CAPA
```
╔═══════════════════════════════════════════════════════════╗
║                   MINDPUNK                                ║
║            Game Development Starter Kit                   ║
║                                                           ║
║   Entendendo Game Loops e Estratégia nos Jogos           ║
║                                                           ║
║   Extensão Universitária UNIP                            ║
║   Data: [DATA]                                           ║
║   Instrutor: Taino Educador                              ║
╚═══════════════════════════════════════════════════════════╝
```

**Objetivo da Workshop:**
- Entender como jogos funcionam internamente
- Aprender game loop (INPUT → UPDATE → RENDER)
- Explorar dois estilos: Ação (Fragmento 01) e Tática (Game-UW)
- Praticar com exercícios reais

**Para Quem?**
- Curiosos sobre programação
- Interessados em game development
- Não precisa experiência prévia!

---

# SLIDE 2: O Que é Um Jogo?
```
UM JOGO = Um LOOP que NUNCA PARA

┌─────────────────────────────┐
│                             │
│   1️⃣  Ouve entrada (Keys)   │
│         ↓                   │
│   2️⃣  Processa (Update)    │
│         ↓                   │
│   3️⃣  Desenha (Render)     │
│         ↓                   │
│  [volta ao passo 1]         │
│                             │
└─────────────────────────────┘

Velocidade: ~60 FPS (60 vezes por segundo!)
```

**Exemplos:**
```
Mario:
├─ INPUT: Você aperta botão (RIGHT)
├─ UPDATE: Mario se move 5 pixels pra direita
└─ RENDER: Desenha Mario na nova posição

Chess.com:
├─ INPUT: Você clica numa peça
├─ UPDATE: Valida movimento, inimigo calcula
└─ RENDER: Desenha novo tabuleiro

Seu videoclipe do Spotify:
├─ INPUT: Você aperta Play
├─ UPDATE: Toca música (44.1kHz atualização)
└─ RENDER: Visualização anima
```

**Conclusão:** Tudo é input → update → render. Variações de velocidade e complexidade!

---

# SLIDE 3: Dois Tipos de Jogos

## FRAGMENTO 01: Roguelike em Tempo Real
```
CARACTERÍSTICAS:
├─ Turnos: Rápido (automático)
├─ Mapa: Grid (8x8 células)
├─ Física: Movimento em Grid
├─ IA: Simples (ver player → atacar)
└─ Objetivo: Sobreviver e achar saída

VISUAL:
[████ PLAYER]
[██ ENEMY]  [████ WALL]
[████ ITEM]
```

**O Que Você Aprende:**
- State Management (Zustand)
- Game Loop básico
- IA simples
- Procedural Generation

---

## GAME-UW: Tactical Warfare
```
CARACTERÍSTICAS:
├─ Turnos: Lento (você decide)
├─ Mapa: Hexagonal (maior!)
├─ Física: Distância hex, pathfinding
├─ IA: Estratégica (rotas, alvos)
└─ Objetivo: Vencer batalha tática

VISUAL:
     ◆ ◆ ◆
   ◆ T ◆ I ◆
     ◆ ◆ ◆
   T = Tanque, I = Infantaria
```

**O Que Você Aprende:**
- Coordenadas hexagonais
- Movimento tático
- Teoria de Jogos
- Design de balanceamento

---

# SLIDE 4: State Management - O Coração
```
🧠 STATE = Todos os dados do jogo em um lugar

┌─────────────────────────────────────┐
│         GAME STATE                  │
├─────────────────────────────────────┤
│ Player:                             │
│  ├─ Posição: (5,5)                 │
│  ├─ HP: 85/100                      │
│  ├─ Energia: 30/50                  │
│  └─ Inventário: [Poção, Espada]    │
│                                     │
│ Enemies:                            │
│  ├─ Inimigo 1: (7,3) 15/25 HP      │
│  └─ Inimigo 2: (2,8) 20/20 HP      │
│                                     │
│ Map:                                │
│  └─ Grid: [0,0,1,3,2,...] (64 cells)│
└─────────────────────────────────────┘

QUANDO ALGO MUDA:
├─ Você move → Posição atualiza
├─ Inimigo ataca → Seu HP diminui
└─ Game re-renderiza tudo

Biblioteca: ZUSTAND
├─ React hooks (fácil de usar)
├─ Estado global (qualquer componente acessa)
└─ Imutável (seguro)
```

---

# SLIDE 5: Inteligência Artificial (IA)

## Nível 1: Comportamento Simples
```
if (canSeePlayer) {
  if (canReachPlayer) {
    attack();
  } else {
    moveTowardsPlayer();
  }
}
```

**Exemplo Fragmento 01:**
```
1. Inimigo examina grid
2. Se vê player:
   - Calcula distância
   - Se <= 1: ataca
   - Se > 1: se move pra perto
3. Se não vê: patrulha aleatório
```

---

## Nível 2: Comportamento Estratégico
```
Game-UW IA:
├─ Calcular melhor movimento
├─ Considerar contra-ataque
├─ Proteger aliados
├─ Formação tática
└─ Considerar recursos
```

**Algoritmo A* (Pathfinding):**
```
OBJETIVO: Ir de A para B
MÉTODO: Testa caminhos, escolhe melhor

  S . . . .
  . # # # .
  . . . . E

Resultado: S → caminho ótimo → E
```

---

# SLIDE 6: Estratégia vs Ação

## Micro (Ações Pequenas)
```
"O que faço AGORA?"

Fragmento 01 Micro:
├─ Devo atacar ou mover?
├─ Qual direção?
└─ Tenho energia?

Game-UW Micro:
├─ Movo Tanque pra esquerda ou direita?
├─ Arqueiro atira agora ou espera?
└─ Tenho range?
```

---

## Macro (Estratégia Geral)
```
"Qual é meu PLANO?"

Fragmento 01 Macro:
├─ Devo evitar inimigos ou enfrentar?
├─ Qual é minha rota pra saída?
└─ Quanto de HP posso perder?

Game-UW Macro:
├─ Ataque frontal ou flanquear?
├─ Defendo ou ataco?
└─ Qual unidade é meu foco?
```

---

## O Equilíbrio
```
❌ Bons MICROS sem MACRO
   → Todos atacam aleatório → Derrota certa

❌ Boa MACRO sem MICROS bons
   → Plano bom, execução ruim → Derrota

✅ Ótimos MICROS + Ótima MACRO
   → Coordenação perfeita → Vitória!
```

---

# SLIDE 7: Teoria de Jogos & Balanceamento

## Rock-Paper-Scissors do Game-UW
```
        Infantaria ──→ Arqueiro
        ↙             ↗
    Tanque

MATCHUPS (quem ganha):
├─ Infantaria vence Arqueiro (alcança rápido)
├─ Arqueiro vence Tanque (ignora defesa)
├─ Tanque vence Infantaria (muita defesa)
└─ = Balanceado!

PROBLEMA: Swarm (muitas Infantarias) é forte
SOLUÇÃO: Aumentar defesa ou custo
```

---

## Nash Equilibrium
```
CONCEITO: Um estado onde ninguém quer mudar

Exemplo Game-UW:
├─ Se todos usam "Meta Build"
├─ Você muda pro Counter
├─ Você ganha 70%!
├─ Inimigo vira pro Counter do seu
└─ Ciclo continua...

CONCLUSÃO: Não existe "Build Perfeito"
JOGAR BEM: Adaptação é tudo!
```

---

# SLIDE FINAL: Próximos Passos
```
╔════════════════════════════════════════╗
║     O QUE VOCÊ APRENDEU HOJE           ║
├════════════════════════════════════════┤
║ ✅ Game Loop: INPUT → UPDATE → RENDER ║
║ ✅ State Management (Zustand)         ║
║ ✅ IA e Pathfinding                   ║
║ ✅ Micro vs Macro                     ║
║ ✅ Balanceamento e Teoria de Jogos    ║
║                                        ║
║      🎮 AGORA VAMOS PRATICAR 🎮       ║
╚════════════════════════════════════════╝
```

**Próximas Atividades:**
1. Jogue Fragmento 01 (entenda o loop)
2. Jogue Game-UW (entenda estratégia)
3. Faça os exercícios de cada
4. Modifique o código você mesmo!

**Recursos Online:**
- 📚 Documentação completa: `/docs`
- 🎮 Jogos: rodar com `npm run dev`
- 📝 Exercícios: `/exercicios`
- 💬 Comunidade: Discord Mindpunk

---

**Perguntas?** 🤔

Vamos começar!
