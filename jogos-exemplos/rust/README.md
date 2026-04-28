
**##[!] Nota: Este jogo faz parte do Mindpunk Game Dev Starter Kit.##**
>para mais informações, acesse https://github.com/Taino-Edu/dungeon-crawler-rust-python

# Dungeon Crawler Roguelike

> Jogo de exploração de dungeon em turnos para o terminal, construído em **Rust** + **Python**.

---

## Sumário

- [O que é o projeto](#o-que-é-o-projeto)
- [Arquitetura Rust + Python](#arquitetura-rust--python)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Como instalar e rodar](#como-instalar-e-rodar)
- [Como jogar](#como-jogar)
- [O que existe hoje](#o-que-existe-hoje)
- [O que vamos mudar](#o-que-vamos-mudar)
- [Roadmap visual futuro](#roadmap-visual-futuro)

---

## O que é o projeto

Um **roguelike clássico de terminal** ambientado em ruínas de uma civilização antiga.  
Você joga como um arqueólogo que desce 5 andares de dungeon, enfrenta inimigos, coleta itens e tenta sobreviver ao Guardião Ancestral no andar final.

Características principais:
- **Geração procedural de mapas** via BSP (Binary Space Partitioning)
- **Campo de visão** real com shadowcasting (fog of war)
- **Sistema de turnos** — o mundo só avança quando você age
- **Inimigos com IA** diferente: perseguição, randômico, alcance, chefão
- **Inventário** com até 5 itens (poções, armas, escudos, antídotos)
- **Status effects** (veneno)
- **Scripts Python** para definir inimigos e itens sem recompilar

---

## Arquitetura Rust + Python

```
┌────────────────────────────────────────────────────┐
│                    RUST (engine)                   │
│                                                    │
│  main.rs ──► game.rs ──► map.rs                    │
│                │          player.rs                │
│                │          enemy.rs                 │
│                │          combat.rs                │
│                │          fov.rs                   │
│                └──► renderer.rs                    │
│                └──► python_bridge.rs ──┐           │
└────────────────────────────────────────│───────────┘
                                         │ PyO3 (FFI)
┌────────────────────────────────────────│───────────┐
│                  PYTHON (dados)        │           │
│                                        ▼           │
│  enemies.py   ◄── get_enemies()                    │
│  items.py     ◄── get_items()                      │
│  loot.py      ◄── get_loot_for_floor(n)            │
└────────────────────────────────────────────────────┘
```

**Por que essa divisão?**

| Responsabilidade | Linguagem | Motivo |
|-----------------|-----------|--------|
| Loop do jogo, física, rendering | Rust | Performance, segurança de memória |
| Geração de mapa (BSP) | Rust | Algorítmico, beneficia de velocidade |
| Campo de visão (shadowcasting) | Rust | Executado todo turno, precisa ser rápido |
| IA dos inimigos | Rust | Lógica de estado e movimento |
| Stats de inimigos e itens | Python | Fácil de editar sem recompilar |
| Tabela de loot por andar | Python | Game design iterativo |

---

## Estrutura de arquivos

```
dungeon_crawler/
│
├── Cargo.toml              # Dependências Rust (pyo3, crossterm, rand, serde)
├── rodar.bat               # Script Windows para compilar e executar
│
├── src/
│   ├── main.rs             # Entry point: inicializa terminal e chama game::run()
│   ├── game.rs             # Loop principal, input, lógica de andar, IA
│   ├── map.rs              # Geração BSP, tiles, salas, corredores
│   ├── player.rs           # Stats, inventário, log de mensagens
│   ├── enemy.rs            # Struct Enemy + comportamentos de IA
│   ├── combat.rs           # Fórmulas de dano, combate por turno
│   ├── fov.rs              # Shadowcasting (campo de visão / fog of war)
│   ├── renderer.rs         # Desenha mapa, HUD, mensagens com cores ANSI
│   └── python_bridge.rs    # PyO3: importa scripts/ e converte para Rust
│
└── scripts/
    ├── enemies.py          # Define os 9 tipos de inimigos
    ├── items.py            # Define os 9 tipos de itens
    └── loot.py             # Tabela de loot por andar com pesos aleatórios
```

---

## Como instalar e rodar

### Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|---------------|---------|
| Rust + Cargo | 1.75+ | https://rustup.rs |
| Python | 3.12+ | https://python.org |

> **Nota sobre Python 3.14:** O PyO3 0.23 suporta oficialmente até Python 3.13.  
> Para Python 3.14, usamos a flag `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1` + feature `abi3`.  
> Isso compila contra a API estável do Python, compatível com qualquer 3.12+.

### Rodando

```bat
cd dungeon_crawler
.\rodar.bat
```

O `rodar.bat` já configura automaticamente:
- `PYO3_PYTHON` — caminho do interpretador Python
- `PATH` — inclui a pasta do Python para o `.dll` ser encontrado em runtime
- `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1` — compatibilidade com Python 3.14+

Se o seu Python estiver em um caminho diferente, edite `PYTHON_DIR` no `rodar.bat`.

---

## Como jogar

```
┌──────────────────────────────────────────────────────────────────────┐
│  # # # # # # # # #                                                   │
│  # . . . . . . . #   # = parede                                      │
│  # . @ . . . . . #   . = chão revelado                               │
│  # . . . . s . . #   @ = você                                        │
│  # # # # . # # # #   s = esqueleto (inimigo)                         │
│            .         > = escada (próximo andar)                      │
│  # # # # . # # # #   ! = item no chão                                │
│  # . . > . . . . #                                                   │
│  # # # # # # # # #                                                   │
├──────────────────────────────────────────────────────────────────────┤
│  Andar:1 | Mortes:0 | ATK:5 DEF:2 | HP:30/30 | Inv: vazio            │
├──────────────────────────────────────────────────────────────────────┤
│  Você atacou Esqueleto por 4 de dano. HP restante: 8/12              │
│  Esqueleto te atacou por 3 de dano!                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Controles

| Tecla | Ação |
|-------|------|
| `W` / `↑` | Mover para cima |
| `S` / `↓` | Mover para baixo |
| `A` / `←` | Mover para esquerda |
| `D` / `→` | Mover para direita |
| `Q` | Diagonal: cima-esquerda |
| `E` | Diagonal: cima-direita |
| `Z` | Diagonal: baixo-esquerda |
| `C` | Diagonal: baixo-direita |
| `.` ou `Espaço` | Esperar um turno |
| `1` – `5` | Usar item do inventário |
| `Shift+Q` / `Esc` | Sair do jogo |

### Dicas de gameplay

- **Mover em direção a um inimigo** inicia o combate automaticamente
- **Andar sobre um item** o coloca no inventário (máx. 5 itens)
- **`>`** é a escada — pisa nela para descer ao próximo andar
- O **fog of war** é real: áreas escuras já foram vistas, mas podem ter mudado
- Inimigos **fora do seu campo de visão** podem te ver antes de você vê-los
- O veneno dura **4 turnos** — guarde antídotos para andares com aranhas

---

## O que existe hoje

### Inimigos (definidos em `scripts/enemies.py`)

| Símbolo | Nome | Andar | IA | Especial |
|---------|------|-------|-----|---------|
| `r` | Rato Gigante | 1+ | Randômica | — |
| `s` | Esqueleto | 1+ | Perseguição | — |
| `a` | Aranha Venenosa | 2+ | Perseguição | Veneno |
| `g` | Goblin Arqueiro | 2+ | Alcance | — |
| `G` | Golem de Pedra | 3+ | Perseguição | Alta defesa |
| `M` | Mago Sombrio | 3+ | Alcance | Veneno mágico |
| `K` | Cavaleiro Morto-Vivo | 4+ | Perseguição | — |
| `B` | Guardião Ancestral | 5 | Chefão | Veneno + visão total |

### Itens (definidos em `scripts/items.py`)

| Símbolo | Nome | Efeito |
|---------|------|--------|
| `!` | Poção de Vida Pequena | +10 HP |
| `!` | Poção de Vida Grande | +25 HP |
| `&` | Antídoto | Remove veneno |
| `/` | Faca Enferrujada | +2 ataque permanente |
| `/` | Espada Curta | +5 ataque permanente |
| `/` | Espada Longa Rúnica | +10 ataque permanente |
| `]` | Escudo de Madeira | +2 defesa permanente |
| `]` | Escudo de Ferro | +4 defesa permanente |
| `]` | Armadura de Placas | +7 defesa permanente |

### Mecânicas implementadas

- [x] Geração procedural de mapa (BSP)
- [x] Campo de visão com shadowcasting
- [x] Fog of war (revelação permanente)
- [x] Sistema de combate com variação aleatória (±25%)
- [x] 4 tipos de IA (Random, Chase, Ranged, Boss)
- [x] Status effect: veneno
- [x] Inventário com limite de 5 slots
- [x] Progressão de 5 andares
- [x] Stats persistem entre andares
- [x] Tela de Game Over e Vitória
- [x] HUD com HP colorido (verde/vermelho)
- [x] Log de mensagens de combate

---

## O que vamos mudar

### 1. Sistema de câmera (PRIORIDADE ALTA)

**Problema atual:** o mapa inteiro (80×40) é exibido de uma vez, mas o terminal pode ser menor que isso, cortando a borda. Além disso, o jogador pode estar em qualquer canto da tela — não há acompanhamento visual.

**O que será implementado:**

```
ANTES (câmera fixa):          DEPOIS (câmera centrada):
┌────────────────────┐        ┌────────────────────┐
│                    │        │     (visível)      │
│   @                │        │        @           │
│                    │   ──►  │   (centrado)       │
│                    │        │                    │
└────────────────────┘        └────────────────────┘
  mapa inteiro exibido          só a área ao redor
```

**Moldes de câmera planejados** (configurável em Python ou Rust):

| Modo | Descrição | Uso |
|------|-----------|-----|
| `centered` | Câmera segue o jogador, sempre centralizada | Padrão |
| `smooth` | Câmera desliza suavemente (interpolação) | Exploração |
| `room-lock` | Câmera "trava" na sala atual e só muda ao sair | Estilo clássico |
| `fixed` | Modo atual — mapa inteiro visível | Mapas pequenos |

Arquivos afetados: `renderer.rs`, novo `camera.rs`

---

### 2. Mais inimigos (`scripts/enemies.py`)

Novos tipos planejados:

| Símbolo | Nome | Andar | IA | Especial |
|---------|------|-------|-----|---------|
| `z` | Zumbi | 1+ | Lenta perseguição | — |
| `b` | Morcego | 2+ | Randômico rápido | Move 2x por turno |
| `t` | Troll | 3+ | Perseguição | Regenera HP |
| `W` | Bruxa | 4+ | Alcance | Causa cegueira (reduz FOV) |
| `D` | Dragão de Pedra | 5 | Boss secundário | Perseguição + knockback |

---

### 3. Mais itens (`scripts/items.py`)

Novos itens planejados:

| Símbolo | Nome | Efeito |
|---------|------|--------|
| `*` | Pedra de Luz | Aumenta FOV para 12 tiles por 10 turnos |
| `?` | Pergaminho de Teleporte | Teletransporta para sala aleatória |
| `^` | Botas de Rapidez | Move 2 tiles por turno por 5 turnos |
| `~` | Frasco de Ácido | Atira projétil: dano em linha reta |
| `+` | Amuleto de Cura | Regenera 1 HP por turno por 8 turnos |

---

### 4. Melhorias gerais planejadas

- [ ] **Níveis de dificuldade** (easy/normal/hard) configuráveis em Python
- [ ] **Sistema de experiência e level up** do jogador
- [ ] **Armadilhas** no chão (espinhos, teleporte, fogo)
- [ ] **Lojas** em salas especiais — troca itens por outros
- [ ] **Miniboss** no andar 3
- [ ] **Corredores secretos** conectando salas não adjacentes

---

## Roadmap visual futuro

O jogo atualmente usa caracteres ASCII puro. As opções de visual planejadas são:

### Opção A — ASCII melhorado (curto prazo)
Usar box-drawing characters e mais variação de símbolos:
```
╔═══╗  ░░░░░  Paredes com cantos
║...║  ▒▒▒▒▒  Chão com textura
╚═══╝  ▓▓▓▓▓  Escuridão revelada
```

### Opção B — Tiles coloridos por bioma (médio prazo)
Cada andar tem um "tema" que muda as cores:
- Andar 1-2: Pedra cinza (`#808080`)
- Andar 3: Caverna de lava (`#FF4500`)
- Andar 4: Gelo (`#ADD8E6`)
- Andar 5: Templo dourado (`#FFD700`)

### Opção C — Interface gráfica com `ratatui` (longo prazo)
Substituir `crossterm` direto por [`ratatui`](https://ratatui.rs) — uma TUI framework que permite:
- Widgets (barras de HP, painéis, listas)
- Layout em colunas (mapa | painel lateral | log)
- Mouse support
- Animações simples

```
┌─ MAPA ──────────────────┬─ STATS ──────────┐
│  # # # # # # #          │  Andar: 3         │
│  # . . @ . . #          │  HP: ████░░ 18/30 │
│  # . . . . . #          │  ATK: 12  DEF: 5  │
│  # . . s . . #          ├─ INVENTÁRIO ──────┤
│  # # # # # # #          │  [1] Poção P.     │
├─ LOG ───────────────────┤  [2] Espada Curta │
│  > Você matou Esqueleto │  [3] Antídoto     │
│  > Você pegou: Poção    └──────────────────-┘
└─────────────────────────┘
```

---

## Tecnologias usadas

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| [Rust](https://rust-lang.org) | 1.75+ | Engine do jogo |
| [PyO3](https://pyo3.rs) | 0.23 | Bridge Rust ↔ Python |
| [crossterm](https://github.com/crossterm-rs/crossterm) | 0.27 | Terminal cross-platform |
| [rand](https://docs.rs/rand) | 0.8 | Geração aleatória |
| [Python](https://python.org) | 3.12+ | Scripting de dados |

---

## Contribuindo

1. Edite `scripts/enemies.py` para adicionar inimigos
2. Edite `scripts/items.py` para adicionar itens
3. Edite `scripts/loot.py` para ajustar o balanceamento por andar
4. Para mudanças no engine: edite os arquivos em `src/` e rode `.\rodar.bat`
