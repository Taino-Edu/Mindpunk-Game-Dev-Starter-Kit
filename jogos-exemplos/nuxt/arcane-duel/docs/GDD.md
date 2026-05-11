# [= GDD REVERSO =] Arcane Duel (Jogo de Cartas Turno-a-Turno em Nuxt 3)
**Mindpunk Lab — Game Dev Starter Kit**

Este documento detalha o funcionamento de um jogo de cartas ASCII adversarial, construído com Nuxt 3 e Vue 3. Serve como exemplo de **gerenciamento de estado reativo**, **algoritmo de IA por prioridade** e **separação entre dados e lógica**.

---

## 1. VISÃO GERAL (THE BIG PICTURE)

* **Título:** Arcane Duel
* **Gênero:** Card Game / Estratégia Turno-a-Turno
* **Plataforma:** Web Browser (SPA — Single Page Application)
* **Visual:** ASCII Art + tema dark inspirado em terminais de computador
* **Core Loop:** Comprar carta → Gerenciar mana → Jogar cartas → Passar turno → IA responde → Repetir até alguém chegar a 0 HP.

---

## 2. ARQUITETURA TÉCNICA

Diferente de engines com game loop contínuo, Arcane Duel usa uma **máquina de estados orientada a eventos**. O jogo não processa nada enquanto o jogador não age.

* **Framework:** Nuxt 3 (SSR desligado — puramente client-side)
* **Reatividade:** Vue 3 `reactive()` — um único objeto `_internal` é a fonte de verdade
* **Padrão:** Singleton Composable — `useGame()` retorna sempre o mesmo estado, não importa quantos componentes chamem
* **IA:** Algoritmo de prioridade em JavaScript puro (sem bibliotecas externas)
* **Estilo:** CSS puro com variáveis customizadas, sem frameworks CSS

```
SEPARAÇÃO DE RESPONSABILIDADES:

data/cards.ts        → O QUÊ existe no jogo (dados imutáveis)
composables/useGame.ts → O QUÊ acontece (lógica e estado)
pages/index.vue      → COMO parece (UI e interação)
assets/css/main.css  → COMO é estilizado (visual e animações)
```

---

## 3. MECÂNICAS PRINCIPAIS

### A. Sistema de Mana
O mana é o recurso central do jogo. Cada carta tem um custo. O mana começa em 3, aumenta +1 por turno (máximo 10). Isso cria uma **curva de poder**: nos primeiros turnos, jogadas são limitadas; nos turnos finais, cartas poderosas ficam acessíveis.

* **Tática:** O jogador precisa decidir entre jogar várias cartas baratas ou economizar para uma cara.

### B. Sistema de Defesa (Armadura Acumulativa)
Diferente de jogos onde a defesa reseta a cada turno, aqui a armadura **acumula** e **persiste** até ser absorvida por ataques.

```
Jogador joga Muro de Pedra (+8 DEF) → playerDefense = 8
IA ataca com Bola de Fogo (8 ATK)  → absorbed = 8, dano = 0
playerDefense agora = 0             → armadura consumida
```

* **Tática:** Construir armadura cedo é poderoso, mas a IA também pode "furar" grandes defesas com Raio (11 ATK) ou Berserker (15 ATK).

### C. Sistema de Dreno
Cartas de tipo `drain` combinam efeitos:
- **Clone Sombrio:** 4 ATK + 4 DEF ao mesmo tempo
- **Dreno de Vida:** 5 ATK + cura 4 HP ao mesmo tempo

* **Tática:** Cartas de dreno têm custo-benefício alto, mas custo moderado (◆3).

### D. Deck Duplo
Cada jogador tem 24 cartas (12 tipos × 2 cópias). Ao longo do jogo, o deck esgota. Sem cartas para comprar, o turno passa sem compra — mas o jogo não termina por isso.

---

## 4. ALGORITMO DA IA

A IA não é aleatória. Segue um sistema de **prioridades ordenadas**:

```typescript
function aiPickCard(): GameCard | null {
  const playable = aiHand.filter(c => c.cost <= aiMana)

  // Prioridade 1: Kill Shot
  // Se alguma carta causa dano suficiente para matar, usa imediatamente
  for (const c of atk) {
    if (Math.max(0, c.attack - playerDefense) >= playerHP) return c
  }

  // Prioridade 2: Auto-preservação
  // Com HP crítico, sempre cura primeiro
  if (aiHP <= 8) { return heals.sort((a,b) => b.heal - a.heal)[0] }

  // Prioridade 3: Dreno estratégico
  // Com HP baixo e jogador desguarnecido, drena (ataca + cura)
  if (aiHP <= 15 && playerDefense === 0) { return drainCard }

  // Prioridade 4: Defesa situacional
  // Com HP baixo, 45% de chance de defender
  if (aiHP <= 12 && Math.random() < 0.45) { return bestDefenseCard }

  // Prioridade 5: Melhor dano/custo
  // Padrão ofensivo: maximiza eficiência
  return atk.sort((a,b) => (b.attack/b.cost) - (a.attack/a.cost))[0]
}
```

**Imprevisibilidade controlada:** a IA pode jogar 1 ou 2 cartas por turno. A segunda jogada tem 40% de probabilidade — suficiente para surpreender mas não quebrar o balanceamento.

---

## 5. BALANCEAMENTO DAS CARTAS

| Carta | Tipo | ATK | DEF | CURA | CUSTO | Eficiência |
|-------|------|-----|-----|------|-------|-----------|
| Escudo Mágico | defense | - | 5 | - | 1 | 5.0 DEF/◆ |
| Gelo | attack | 5 | - | - | 2 | 2.5 ATK/◆ |
| Muro de Pedra | defense | - | 8 | - | 2 | 4.0 DEF/◆ |
| Poção de Cura | heal | - | - | 8 | 2 | 4.0 HP/◆ |
| Bola de Fogo | attack | 8 | - | - | 3 | 2.67 ATK/◆ |
| Garra do Dragão | attack | 7 | - | - | 3 | 2.33 ATK/◆ |
| Clone Sombrio | drain | 4 | 4 | - | 3 | híbrido |
| Dreno de Vida | drain | 5 | - | 4 | 3 | híbrido |
| Raio | attack | 11 | - | - | 4 | 2.75 ATK/◆ |
| Fortaleza | defense | - | 12 | - | 4 | 3.0 DEF/◆ |
| Luz Sagrada | heal | - | - | 15 | 5 | 3.0 HP/◆ |
| Berserker | attack | 15 | - | - | 6 | 2.5 ATK/◆ |

---

## 6. ROADMAP DIDÁTICO (PARA ESTUDANTES)

No Starter Kit, este projeto ensina **três pilares do desenvolvimento de jogos com frameworks modernos**:

1. **[X] Dados vs Lógica vs UI:** Alunos podem criar novas cartas apenas editando `data/cards.ts`, sem tocar na lógica do jogo. A IA automaticamente aprende a usar as novas cartas porque filtra por atributos, não por nome.

2. **[X] Reatividade como Motor:** Como Vue 3 `reactive()` substitui um game loop contínuo. O jogo "renderiza" automaticamente quando o estado muda — sem `setState()`, sem `this.forceUpdate()`.

3. **[X] IA como Algoritmo:** A IA não usa machine learning. É uma função `if/else` ordenada por prioridade. Alunos aprendem que "IA de jogo" e "Inteligência Artificial" são coisas diferentes — e que lógica simples pode criar adversários convincentes.
