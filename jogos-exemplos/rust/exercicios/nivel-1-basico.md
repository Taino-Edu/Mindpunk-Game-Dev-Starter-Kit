# 🦀 Exercícios Nível 1 - Básico (Rust Dungeon Crawler)

**Dificuldade:** ⭐☆☆☆☆ (Iniciante)  
**Tempo estimado:** 30-45 minutos  
**Objetivo:** Explorar o código e entender como o jogo funciona

---

## 📝 Exercício 1: Explorando o Mapa

### 1.1 Conceito Básico
Abra `src/map.rs` e localize os valores das constantes:

```rust
pub const MAP_WIDTH: usize = 80;
pub const MAP_HEIGHT: usize = 40;
const MIN_ROOM_SIZE: usize = 4;
const MAX_ROOM_SIZE: usize = 12;
const BSP_DEPTH: u32 = 5;
```

### 1.2 Perguntas
1. **Qual é o tamanho do mapa?**
   - Resposta esperada: 80 pixels de largura x 40 de altura

2. **Qual é a sala mínima?**
   - Dica: MIN_ROOM_SIZE
   - Resposta esperada: 4x4

3. **Qual é a sala máxima?**
   - Dica: MAX_ROOM_SIZE
   - Resposta esperada: 12x12

4. **O que significa BSP_DEPTH = 5?**
   - Dica: Leia `docs/SRC_COMENTADO_bsp.rs`
   - Resposta esperada: O mapa é dividido recursivamente 5 vezes (2^5 = 32 divisões)

### 1.3 Desafio
Mude `MAP_WIDTH` de 80 para 120 e `MAP_HEIGHT` de 40 para 50. Compile e jogue!

**Pergunta:** O mapa ficou maior ou a mesma coisa?
- **Resposta esperada:** Maior! Agora tem mais espaço para salas e corredores

---

## 📝 Exercício 2: Entendendo Tiles

### 2.1 Conceito
Cada célula do mapa é um `Tile`. Abra `src/map.rs` e localize:

```rust
#[derive(Clone, Copy, PartialEq, Debug)]
pub enum TileType {
    Wall,
    Floor,
    Stairs,
}
```

### 2.2 Perguntas
1. **Quantos tipos de Tile existem?**
   - Resposta esperada: 3 (Wall, Floor, Stairs)

2. **O que cada um faz?**
   - Wall: Bloqueia movimento E visão
   - Floor: Pode caminhar (chão)
   - Stairs: Objetivo (próximo andar)

3. **Qual tile você QUER encontrar?**
   - Resposta esperada: Stairs (para vencer!)

### 2.3 Experimento
Navegue para encontrar a escada (Stairs) e desça para o próximo andar.

**Pergunta:** Quantos andares existem ao todo?
- **Dica:** Leia `src/game.rs` e procure por "floor"
- **Resposta esperada:** 5 andares

---

## 📝 Exercício 3: Estudando BSP

### 3.1 Conceito
BSP (Binary Space Partitioning) divide o mapa recursivamente. Leia `docs/SRC_COMENTADO_bsp.rs` completamente.

### 3.2 Perguntas
1. **Como começa a geração?**
   - Resposta esperada: Tudo é parede
   - Código: `vec![vec![Tile::wall(); MAP_WIDTH]; MAP_HEIGHT]`

2. **Qual é o primeiro passo?**
   - Resposta esperada: Chamar `bsp_split()` recursivamente

3. **Qual é o último passo?**
   - Resposta esperada: Conectar as salas com `connect_rooms()`

4. **Por que BSP é rápido?**
   - Resposta esperada: É O(2^depth) que é exponencial mas com depth pequeno fica rápido

### 3.3 Desafio
Aumentar `BSP_DEPTH` de 5 para 6 e compile.

**Pergunta:** O que muda?
- **Resposta esperada:** Mais divisões (64 em vez de 32) = mais salas pequenas
- **Efeito:** Mapa com mais complicado, mais salas

---

## 📝 Exercício 4: Combinando Dados Python + Rust

### 4.1 Conceito
FFI (Foreign Function Interface) permite Python definir dados que Rust usa!

### 4.2 Tarefas
1. Abra `scripts/enemies.py`
2. Localize um inimigo (ex: "Goblin")
3. Veja os stats: `hp`, `damage`, `ai_type`

```python
{
    "id": "goblin",
    "name": "Goblin",
    "hp": 10,
    "damage": 2,
    "ai_type": "seeker",  # perseguidor
    "symbol": "g",
    "color": "green"
}
```

### 4.3 Perguntas
1. **Quantos goblins existem?**
   - **Dica:** Procure por "goblin" em `enemies.py`
   - **Resposta esperada:** Varia, mas provavelmente 1-3 tipos

2. **Qual inimigo tem mais HP?**
   - Leia todos os inimigos
   - **Resposta esperada:** Provavelmente o chefão (boss)

3. **Qual tem menos dano?**
   - Leia todos
   - **Resposta esperada:** Provavelmente um rato ou goblin

### 4.4 Desafio
Abra `scripts/enemies.py` e mude um Goblin:
- Mude `"hp": 10` para `"hp": 20`
- Mude `"damage": 2` para `"damage": 5`
- Salve o arquivo
- Recompile e jogue: `cargo run --release`

**Pergunta:** O jogo fica mais difícil ou mais fácil?
- **Resposta esperada:** Mais difícil! (Goblins mais fortes)

**Insight:** Você EDITOU um arquivo Python, SEM TOCAR em Rust. Isso é FFI em ação! 🚀

---

## 📝 Exercício 5: Estudando Inimigos

### 5.1 Conceito
Abra `src/enemy.rs` e procure por `enum AIType`:

```rust
pub enum AIType {
    Seeker,    // Perseguidor (vê e ataca)
    Random,    // Aleatório
    Ranged,    // À distância
    Boss,      // Chefão
}
```

### 5.2 Perguntas
1. **Quantos tipos de IA existem?**
   - Resposta esperada: 4

2. **Qual IA é mais perigosa?**
   - Resposta esperada: Boss (chefão)

3. **Qual é mais "burra"?**
   - Resposta esperada: Random (aleatória)

### 5.3 Desafio
Jogue 3 vezes diferentes e observe:

**Run 1:**
- Quantos inimigos você viu?
- Qual tipo (Goblin, Orc, etc)?
- Qual IA (Seeker, Random, etc)?

**Run 2:**
- Diferentes? Por quê?
- **Resposta esperada:** Porque o mapa é proceduralmente gerado!

**Run 3:**
- Quantos sobreviventes você encontrou?
- Qual andar chegou?

---

## 📝 Exercício 6: O Campo de Visão (FOV)

### 6.1 Conceito
Você não vê através de paredes! Abra `src/fov.rs`.

Este arquivo implementa **shadowcasting**: desenha raios de luz a partir do player.

### 6.2 Observe Enquanto Joga
1. Ande por um corredor
2. Observe que:
   - Você vê o corredor à sua frente
   - Paredes bloqueiam a visão
   - Você NÃO vê atrás de paredes

### 6.3 Perguntas
1. **Por que shadowcasting é importante em roguelikes?**
   - Resposta esperada: Cria suspense e estratégia (não sabe o que tem atrás)

2. **Qual seria o problema se você visse TUDO?**
   - Resposta esperada: Sem surpresa, sem dificuldade

3. **Você consegue ver no escuro sem luz?**
   - Resposta esperada: Não! (Na real vida também não!)

---

## 📝 Exercício 7: Estrutura do Projeto

### 7.1 Estrutura
```
rust/
├── src/
│   ├── main.rs          ← Ponto de entrada
│   ├── game.rs          ← Loop principal
│   ├── map.rs           ← Geração BSP ✅ Você já estudou
│   ├── player.rs        ← Seu personagem
│   ├── enemy.rs         ← ✅ Você já estudou
│   ├── combat.rs        ← Sistema de combate
│   ├── fov.rs           ← ✅ Campo de visão
│   ├── renderer.rs      ← Desenha na tela
│   └── python_bridge.rs ← ✅ FFI (Python ↔ Rust)
│
└── scripts/
    ├── enemies.py       ← ✅ Você já estudou
    ├── items.py         ← Itens
    └── loot.py          ← Tabela de drops
```

### 7.2 Perguntas
1. **Qual arquivo é responsável por desenhar?**
   - Resposta esperada: `renderer.rs`

2. **Qual arquivo é responsável por combate?**
   - Resposta esperada: `combat.rs`

3. **Qual arquivo traz Python pra Rust?**
   - Resposta esperada: `python_bridge.rs` (PyO3)

---

## 📝 Exercício 8: Desafio Final - Teste Sua Compreensão

### 8.1 Pergunta 1: Qual arquivo mexer?
Você quer adicionar um novo tipo de inimigo. Qual arquivo mexe?
- [ ] `src/map.rs`
- [ ] `src/enemy.rs`
- [ ] `scripts/enemies.py`
- [ ] `src/renderer.rs`

**Resposta esperada:** `scripts/enemies.py` (não precisa recompilar Rust!)

### 8.2 Pergunta 2: Desempenho
BSP com depth=5 leva quanto tempo pra gerar um mapa?
- [ ] 1 segundo
- [ ] 100 milissegundos
- [ ] menos de 1 milissegundo
- [ ] 10 segundos

**Resposta esperada:** Menos de 1 milissegundo (muito rápido!)

### 8.3 Pergunta 3: Estrutura
Qual é o objetivo final do jogo?
- [ ] Matar todos os inimigos
- [ ] Coletar todos os itens
- [ ] Descer 5 andares e derrotar o chefão
- [ ] Explorar todo o mapa

**Resposta esperada:** Descer 5 andares (cada andar tem escada no final)

### 8.4 Pergunta 4: FFI
Por que separar dados (Python) da engine (Rust)?
- [ ] Porque Python é mais fácil
- [ ] Para iterar rapidamente sem recompilar
- [ ] Porque Python é mais rápido
- [ ] Não há razão especial

**Resposta esperada:** Para iterar rapidamente (mude enemies.py, compile em 1 segundo vs recompilar Rust = 10 segundos)

---

## 🎯 Resumo

Você aprendeu:
- ✅ Como funciona a geração procedural (BSP)
- ✅ O que são Tiles e tipos de Tile
- ✅ Como os inimigos funcionam (IA)
- ✅ O que é FFI e por quê é útil
- ✅ Como o campo de visão funciona
- ✅ A arquitetura do projeto

---

## 📖 Próximos Passos

Se você acertou tudo:
- 🎓 Vá pro **Nível 2 (Intermediário)**: Modificar código e comportamentos
- 📚 Aprenda **Rust mais profundo**: Leia `src/game.rs` e `src/combat.rs`
- 🚀 Implemente novas features: Novo tipo de inimigo, novo item, etc

---

**Tempo total esperado:** 30-45 minutos  
**Dificuldade:** Iniciante  
**Pronto pra Nível 2?** Se sim, continue! 🚀

_Criado com 💜 por Taino Educador_
