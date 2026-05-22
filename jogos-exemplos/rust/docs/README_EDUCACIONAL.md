# 🦀 Dungeon Crawler Roguelike - Educacional

Um jogo roguelike clássico de terminal em **Rust + Python** que ensina **arquitetura de sistemas**, **FFI (Foreign Function Interface)**, **algoritmos de mapas** e **inteligência artificial**.

## 🎯 O Que É?

Um **explorador de dungeon em turnos** onde você desce 5 andares, enfrenta inimigos com IA diferente, coleta itens e enfrenta um chefão final. O destaque é a **arquitetura híbrida Rust + Python**:

- **Rust:** Engine, física, renderização (RÁPIDO)
- **Python:** Definição de inimigos e itens (FLEXÍVEL)

**Objetivo:** Entender como integrar linguagens diferentes e construir sistemas escaláveis.

## 🏗️ Arquitetura Rust + Python

```
┌─────────────────────────────────────┐
│         RUST (Engine)               │
│                                     │
│  main.rs → game.rs → map.rs         │
│              ├→ player.rs           │
│              ├→ enemy.rs            │
│              ├→ combat.rs           │
│              ├→ fov.rs              │
│              └→ renderer.rs         │
│                 ↓ (PyO3 Bridge)     │
├─────────────────────────────────────┤
│      PYTHON (Game Data)             │
│                                     │
│  enemies.py  → Define 9 tipos       │
│  items.py    → Define 9 tipos       │
│  loot.py     → Tabela por andar     │
└─────────────────────────────────────┘
```

### Por Que Essa Divisão?

| Responsabilidade | Linguagem | Motivo |
|---|---|---|
| Loop do jogo, renderização | Rust | Performance, segurança de memória |
| Geração de mapa (BSP) | Rust | Algorítmico, velocidade |
| Campo de visão (shadowcasting) | Rust | 60+ FPS, precisa ser rápido |
| IA de inimigos | Rust | Lógica de estado e movimento |
| **Stats de inimigos/itens** | **Python** | **Fácil editar sem recompilar!** |
| **Tabela de loot** | **Python** | **Game design iterativo** |

**Insight:** Rust para performance + Python para flexibilidade = melhor dos dois mundos! 🚀

## 📁 Estrutura do Projeto

```
rust/
├── README.md                   ← Guia original
├── Cargo.toml                  ← Dependências Rust
├── rodar.bat                   ← Script para compilar
│
├── src/
│   ├── main.rs                 ← Entry point
│   ├── game.rs                 ← Loop principal
│   ├── map.rs                  ← Geração BSP
│   ├── player.rs               ← Stats, inventário
│   ├── enemy.rs                ← Inimigos + IA
│   ├── combat.rs               ← Sistema de combate
│   ├── fov.rs                  ← Shadowcasting
│   ├── renderer.rs             ← Desenha na tela
│   └── python_bridge.rs        ← PyO3 (Rust ↔ Python)
│
├── scripts/
│   ├── enemies.py              ← Define tipos de inimigos
│   ├── items.py                ← Define tipos de itens
│   └── loot.py                 ← Tabela de loot
│
└── docs/
    └── GDD.md                  ← Game Design Document
```

## 🎮 Como Jogar

```bash
# Windows
./rodar.bat

# Linux/Mac
cargo run --release
```

### Controles

| Ação | Tecla |
|------|-------|
| Mover | ↑↓←→ ou WASD |
| Pegar item | G |
| Usar item | U |
| Descer andar | < |
| Subir andar | > |
| Sair | Q |

## 🧠 Conceitos-Chave Educacionais

### 1️⃣ Geração Procedural (BSP - Binary Space Partitioning)

```
Como criar mapas diferentes a cada jogo:

┌─────────────────┐
│ Mapa inteiro    │
├──────┬──────────┤
│ Sala │  Sala    │
├─┬────┼────┬─────┤
│S│ S  │ S  │ S   │
└─┴────┴────┴─────┘

Algoritmo:
1. Começa com retângulo todo
2. Divide na horizontal/vertical aleatória
3. Recursivamente divide os retângulos
4. Cria salas, depois conecta com corredores
```

**Resultado:** Cada jogo tem um mapa diferente! 🎲

### 2️⃣ Campo de Visão (Shadowcasting / FOV)

```
Você só vê o que está ao seu alcance visual:

    ██████
   █      █
  █  ███  █
 █   █@█   █      ← @ = player
  █  ███  █       ← █ = visto
   █      █       ← espaço = escuro (fog of war)
    ██████

Algoritmo: Shadowcasting
├─ Desenha raios de luz a partir do player
├─ Bloqueia em paredes
└─ Cria efeito de "vejo apenas oq tem luz"

Aplicação Real:
├─ Jogos roguelike (Dwarf Fortress, Cogmind)
├─ Simulação tática
└─ Reconhecimento em IA (robôs, NPCs)
```

### 3️⃣ Inteligência Artificial com Estados

Cada inimigo tem um comportamento diferente:

```
PERSEGUIDOR:
├─ Vê o player? ATACA direto
└─ Melhor contra: Arco-íris

ALEATÓRIO:
├─ Se próximo: ataca
└─ Se longe: anda aleatório
└─ Melhor contra: Previsibilidade

MAGO (alcance):
├─ Fica de longe
├─ Lança magia a distância
└─ Melhor contra: Não deixar chegar perto

CHEFÃO (boss):
├─ Muita vida
├─ Ataque forte
├─ Padrão de comportamento
└─ Melhor contra: Estratégia!
```

### 4️⃣ FFI (Foreign Function Interface) - Rust ↔ Python

```rust
// Em Rust, chamamos Python:
let enemies = get_enemies_from_python();

// Python define os dados:
enemies = [
  { "name": "Goblin", "hp": 10, "damage": 2 },
  { "name": "Orc", "hp": 25, "damage": 5 },
  ...
]

// Resultado:
├─ Edita Python → não recompila Rust
├─ Testa novo inimigo em 1 segundo
└─ Iteração RÁPIDA em game design!
```

**Ferramenta:** PyO3 - permite chamar Python de Rust

### 5️⃣ Sistema de Turnos

```
Diferente de tempo real:

TEMPO REAL (Fragmento 01):
├─ Tudo acontece 60x por segundo
├─ Você pressiona botão agora
└─ Resultado aparece agora

TURNOS (Dungeon Crawler):
├─ Você age → mundo atualiza
├─ Inimigos agem → você vê resultado
├─ Voltar pro seu turno
└─ Melhor para: estratégia, tática, puzzle

```

## 📊 Estrutura de Dados

### Enemy (inimigo)
```rust
struct Enemy {
  id: String,              // "goblin_1"
  x: usize, y: usize,      // Posição no mapa
  hp: i32, max_hp: i32,    // Vida
  damage: i32,             // Dano por ataque
  ai_type: String,         // "perseguidor", "aleatório", etc
  is_alive: bool,          // Vivo ou morto?
}
```

### Player
```rust
struct Player {
  x: usize, y: usize,      // Posição
  hp: i32, max_hp: i32,    // Vida
  damage: i32,             // Dano
  inventory: Vec<Item>,    // Até 5 itens
  floor: i32,              // Andar (1-5)
  experience: i32,         // XP acumulada
}
```

### Map (mapa)
```rust
struct Map {
  width: usize, height: usize,
  tiles: Vec<Tile>,        // 0=vazio, 1=parede, 2=porta
  rooms: Vec<Rect>,        // Salas geradas
}
```

## 🚀 Como Rodar

### Pré-requisitos
- Rust 1.70+ (`rustup install stable`)
- Python 3.8+ (pro bridge PyO3)

### Setup
```bash
# Clone ou navigate para a pasta
cd rust/

# Compile (primeira vez leva ~1 min)
cargo build --release

# Ou use o script Windows
./rodar.bat
```

## 🎓 Tópicos de Aprendizado

✅ **Rust Básico**
- Ownership e borrowing
- Structs e enums
- Pattern matching
- Error handling (`Result<T, E>`)

✅ **Algoritmos**
- BSP (Binary Space Partitioning)
- Shadowcasting (FOV)
- Manhattan distance
- A* pathfinding (na IA)

✅ **Game Design**
- Balanceamento de inimigos
- Curva de dificuldade (andares 1-5)
- Loot progression
- Status effects (veneno)

✅ **Arquitetura de Software**
- FFI (Foreign Function Interface)
- Separação de responsabilidades
- Padrão Bridge (Rust ↔ Python)
- Game loop

✅ **Performance**
- Por quê Rust (memory safety sem garbage collector)
- Compilação vs interpretação
- Trade-offs de design

## 📚 Próximos Passos

1. **Entender o mapa (BSP)**
   - Leia `src/map.rs`
   - Veja como as salas são geradas
   - Experimente mudar os parâmetros

2. **Explorar IA**
   - Leia `src/enemy.rs`
   - Entenda os 4 tipos de IA
   - Adicione um novo tipo!

3. **Modificar dados via Python**
   - Abra `scripts/enemies.py`
   - Mude um stat (ex: Goblin HP 10 → 5)
   - Compile e teste (1 segundo!)
   - Isso é game design iterativo!

4. **Estudar Shadowcasting**
   - Leia `src/fov.rs`
   - Entenda como funciona o FOV
   - Visualize os raios de luz

## 🧠 Por Que Rust?

```
Pergunta: "Por quê Rust pra um jogo simples?"

Resposta: Performance!

Tempo de compilação: ~10 seg
Tempo de execução: <1ms per frame
Uso de memória: ~5MB

Se fosse Python puro:
Tempo de execução: ~10ms per frame (10x mais lento!)

Para um jogo pequeno não importa,
MAS... quando escala (multiplayer, IA complexa):
Rust = 10x mais responsivo!
```

## 🐛 Troubleshooting

**"Erro ao compilar"**
- Certifique-se Rust 1.70+ instalado: `rustc --version`
- Certifique-se Python 3.8+ instalado: `python --version`
- Delete `target/` e tente de novo: `cargo clean && cargo build`

**"PyO3 error"**
- PyO3 requer Python dev headers
- Windows: Instale Python via `python.org` (não Microsoft Store)
- Linux: `apt install python3-dev`
- Mac: Geralmente já vem

**"Mapa muito fácil/difícil"**
- Edite `scripts/enemies.py` ou `scripts/loot.py`
- Recompile: `cargo build --release`
- Teste novamente (~3 segundos!)

## 📖 Referências

- [Rust Book](https://doc.rust-lang.org/book/) - Aprenda Rust
- [PyO3 Docs](https://pyo3.rs/) - Rust ↔ Python
- [Bracket-Lib](https://bracket-lib.rs/) - Game engine em Rust
- [Red Blob Games - BSP](https://www.redblobgames.com/articles/dungeon-generation/) - Geração de dungeon
- [Shadowcasting](https://www.roguelikedeveloper.com/FOV-shadowcasting/) - Campo de visão

## 🎮 Inspirações

- **Dwarf Fortress** - Shadowcasting perfeito
- **Cogmind** - Roguelike tático
- **Caves of Qud** - Procedural generation

## 🎓 Para Educadores

Este projeto é perfeito para:
- Ensinar Rust em contexto prático
- Demonstrar FFI e integração de linguagens
- Explorar algoritmos de geração procedural
- Discutir trade-offs de performance
- Praticar game design iterativo

**Tempo estimado:** 5-6 horas pra entender tudo (mais complexo!)

---

## 🔗 Links

| Recurso | Link |
|---------|------|
| GitHub | https://github.com/Taino-Edu/dungeon-crawler-rust-python |
| Documentação Original | [README.md](./README.md) |
| Game Design Doc | [docs/GDD.md](./docs/GDD.md) |
| Código Fonte | [src/](./src/) |
| Scripts Python | [scripts/](./scripts/) |

---

**Criado com 💜 por Taino Educador**  
**Mindpunk Game Development Education**  
**Aprenda Rust fazendo jogos! 🦀🎮**

_Comece por: entender o mapa com BSP. Depois, explore a IA. Por último, modifique Python!_
