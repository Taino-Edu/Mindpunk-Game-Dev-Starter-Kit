# 🏆 Desafios Sênior - Dungeon Crawler (Rust)

**Objetivo:** Modificações de baixo nível e integração de sistemas.

---

### Desafio 1: Novo Tile "Água"
Adicione um novo tipo de Tile no Rust: `Water`.
- O jogador se move 50% mais devagar (gasta 2 turnos) ao atravessar água.
- Como você alteraria o `map.rs` para gerar poças de água dentro das salas?

### Desafio 2: Sistema de Magia (FFI)
Crie um novo arquivo em Python `spells.py` e integre-o ao Rust.
- O jogador pode gastar "Mana" para revelar todo o mapa por 1 turno.
- A lógica do cálculo de FOV no Rust deve ser ignorada temporariamente.

### Desafio 3: Otimização de BSP
O algoritmo de BSP atual gera salas retangulares. 
- Desafio: Modifique o gerador para criar salas com cantos arredondados ou formatos irregulares.
- Qual o impacto disso no cálculo de colisão?

---
*Mantra: Toda decisão cria. Toda criação custa.*
