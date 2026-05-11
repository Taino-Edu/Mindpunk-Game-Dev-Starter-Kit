# 🚀 Exercícios Nível 3 — Arcane Duel

> Implemente novas mecânicas, expanda o sistema e desafie a arquitetura!

---

## 🎯 Objetivo Deste Nível

Você vai:
- [ ] Implementar uma nova mecânica de jogo do zero
- [ ] Expandir o sistema de cartas
- [ ] Melhorar o algoritmo da IA com nova lógica
- [ ] Refletir sobre decisões de design

**Pré-requisito:** Completou os Níveis 1 e 2

**Tempo estimado:** 60–90 minutos

---

## ⚡ Exercício 3.1: Implementar Efeito de Veneno

### O Desafio

Implemente um efeito de status: **veneno**. Quando uma carta "envenena", o oponente perde 2 HP por turno durante 3 turnos.

### O Que Você Precisará Modificar

**1. Em `data/cards.ts` — adicionar campo `poisonTurns`:**
```typescript
export interface CardDef {
  // ... campos existentes ...
  poisonTurns?: number  // opcional: turnos de veneno aplicados (0 por padrão)
}
```

**2. Em `composables/useGame.ts` — adicionar ao GameState:**
```typescript
interface GameState {
  // ... campos existentes ...
  playerPoisonTurns: number  // turnos de veneno restantes no jogador
  aiPoisonTurns: number
}
```

**3. Em `composables/useGame.ts` — aplicar veneno ao jogar a carta:**
```typescript
// Dentro de playCard(), após aplicar dano:
if (card.poisonTurns && card.poisonTurns > 0) {
  state.aiPoisonTurns += card.poisonTurns
  addLog(`> ${card.name}: IA envenenada por ${card.poisonTurns} turnos!`, 'player')
}
```

**4. Em `composables/useGame.ts` — processar veneno a cada turno:**
```typescript
// No início de runAiTurn(), antes de drawCard:
if (state.aiPoisonTurns > 0) {
  state.aiHP -= 2
  state.aiPoisonTurns--
  addLog(`< IA: veneno causou 2 dano! (${state.aiPoisonTurns} turnos restantes)`, 'damage')
  if (checkOver()) return
}
```

**5. Criar uma carta que envenena:**
```typescript
{
  id: 'poison_dart',
  name: 'DARDO VENENO',
  type: 'attack',
  attack: 3,
  defense: 0,
  heal: 0,
  cost: 2,
  poisonTurns: 3,  // envenena por 3 turnos
  description: '3 ATK + Veneno 3t',
  art: [
    ' >---> ',
    '  ~~~  ',
    ' TOXIC ',
    ' DART  ',
  ],
  color: '#86efac',
},
```

**Reflexão:**
- O veneno é mais ou menos forte que 6 de dano direto?
  - Veneno 3 turnos × 2 HP = 6 dano total, mas distribuído
  - Vantagem: o dano acontece mesmo se o oponente se curar no turno seguinte?
- Como você faria a IA saber quando usar o Dardo Veneno?

---

## 🎲 Exercício 3.2: Criar um Sistema de "Combo"

### O Desafio

Implemente um bônus de combo: se o jogador jogar 2 cartas de ataque no mesmo turno, a segunda causa 50% de dano extra.

### Dicas de Implementação

**1. Rastrear cartas jogadas no turno:**
```typescript
// Adicionar ao GameState:
cardsPlayedThisTurn: number  // começa em 0, reseta a cada turno
```

**2. Verificar combo em playCard():**
```typescript
// Após aplicar o dano de card.attack:
if (card.attack > 0 && state.cardsPlayedThisTurn > 0) {
  // É um combo! O dano já foi aplicado, aplica o bônus de 50%
  const bonus = Math.floor(dmg * 0.5)
  state.aiHP -= bonus
  addLog(`> COMBO! +${bonus} dano bônus!`, 'player')
}
state.cardsPlayedThisTurn++
```

**3. Resetar o contador ao passar o turno:**
```typescript
// Em endPlayerTurn():
state.cardsPlayedThisTurn = 0
```

**Desafio extra:** Mostrar na UI quando um combo está disponível (quando já jogou 1 carta de ataque no turno).

---

## 🤖 Exercício 3.3: Ensinar a IA Sobre Veneno

Se você implementou o veneno (Exercício 3.1), a IA ainda não sabe usar o Dardo Veneno de forma estratégica.

### O Desafio

Adicionar lógica à IA para usar Dardo Veneno quando:
1. O jogador tem mais de 15 HP (vale mais envenenar do que causar dano rápido)
2. A IA não tem cartas de alto dano disponíveis

### Onde Modificar

Em `aiPickCard()`, adicionar uma nova prioridade antes da Prioridade 5:

```typescript
// ── PRIORIDADE 4.5: Veneno estratégico ──────────────────────
// Usa veneno quando o jogador tem HP alto (compensa mais a longo prazo)
if (state.playerHP > 15 && state.aiPoisonTurns === 0) {
  // aiPoisonTurns seria para rastrear se JÁ envenenou (não stacka)
  const poisonCards = playable.filter(c => (c as any).poisonTurns > 0)
  if (poisonCards.length) return poisonCards[0]
}
```

---

## 🎨 Exercício 3.4: Desafio de Design — Criar um Novo Tipo de Carta

### O Desafio

Crie um novo `CardType` chamado `'curse'` que:
- Reduz o MANA do oponente no próximo turno
- Tem ataque baixo (2–3)
- Custo moderado (2–3)

### Você Precisará:

1. Adicionar `'curse'` ao tipo `CardType` em `cards.ts`
2. Adicionar um campo `manaDrain?: number` nas interfaces
3. Implementar o efeito em `playCard()` e na jogada da IA (`runAiTurn()`)
4. Aplicar o dreno de mana no início do turno do oponente
5. Exibir no log e na UI (status bar)

**Reflexão de Design:**
- Essa mecânica é frustrante ou estratégica para o jogador?
- Como você balancearia o custo para que seja valioso sem ser quebrado?
- A IA deveria priorizar essa carta? Em que situações?

---

## ✅ Checklist: Exercício Completo

- [ ] Implementei o sistema de veneno com card, estado e processamento por turno
- [ ] Criei um sistema de combo e testei que o bônus está sendo aplicado
- [ ] Adicionei lógica para a IA usar veneno estrategicamente
- [ ] Criei um novo tipo de carta (curse ou outro) com mecânica própria
- [ ] Todas as mudanças estão funcionando sem erros de TypeScript

---

## 🏆 Desafio Final (Opcional)

**Crie uma versão 2.0 do Arcane Duel** com pelo menos 3 das seguintes features:

- [ ] Sistema de status (veneno, armadura temporária, silêncio)
- [ ] Campo de batalha com slots (cards "permanecem" no campo)
- [ ] Cartas com múltiplas cópias de raridade diferente
- [ ] Histórico de partidas salvo no `localStorage`
- [ ] Som/feedback háptico ao jogar uma carta
- [ ] Modo 2 jogadores no mesmo teclado
- [ ] IA com "personalidade" (agressiva, defensiva, equilibrada) selecionável

---

## 💡 Recursos Para Aprofundar

- [Vue 3 Composables](https://vuejs.org/guide/reusability/composables) — o padrão que `useGame.ts` usa
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — interfaces e tipos
- [Game Balance Concepts](https://gamebalanceconcepts.wordpress.com/) — como balancear sistemas de jogo
- [Hearthstone Design](https://us.forums.blizzard.com/en/hearthstone/) — referência de design de cartas

---

**Criado com 💜 por Taino Educador**
**Mindpunk Game Development Education**
