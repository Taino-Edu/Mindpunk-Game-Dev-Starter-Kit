# 🔧 Exercícios Nível 2 — Arcane Duel

> Crie novas cartas, altere o balanceamento e modifique a IA!

---

## 🎯 Objetivo Deste Nível

Você vai:
- [ ] Criar uma nova carta do zero
- [ ] Rebalancear o deck existente
- [ ] Modificar a estratégia da IA
- [ ] Adicionar uma nova mecânica simples

**Pré-requisito:** Completou o Nível 1

**Tempo estimado:** 45–60 minutos

---

## 🃏 Exercício 2.1: Criar uma Nova Carta

### Tarefa: Criar a carta "Veneno"

A carta Veneno deve ser:
- **Tipo:** attack
- **Dano:** 6
- **Custo:** 2
- **Visual:** arte ASCII de veneno

**Passo a passo:**

1. Abra `data/cards.ts`
2. Encontre o final do array `CARD_DEFS` (antes do `]`)
3. Adicione esta carta (ou crie a sua própria versão):

```typescript
{
  id: 'poison',
  name: 'VENENO',
  type: 'attack',
  attack: 6,
  defense: 0,
  heal: 0,
  cost: 2,
  description: 'Toxina devastadora',
  art: [
    ' ~*~*~ ',
    '*(   )*',
    ' ~*~*~ ',
    ' TOXIC ',
  ],
  color: '#86efac',  // verde venenoso
},
```

4. Salve o arquivo
5. A nova carta automaticamente aparece no deck de ambos os jogadores!

**Como saber se funcionou:**
- Jogue o jogo — você deve ver `VENENO` na mão em algum momento
- Ela deve custar 2 mana e fazer 6 de dano

---

## ⚖️ Exercício 2.2: Rebalancear o Deck

O balanceamento atual favorece quem compra muitas cartas de ataque. Vamos criar um meta mais variado.

### Tarefa A: Nerf no Berserker

O Berserker (15 ATK / custo 6) é muito forte considerando que o HP máximo é 30. Uma carta de 15 dano mata metade do HP de uma vez.

**Suas opções (escolha uma):**
1. Reduzir o ataque: `attack: 15` → `attack: 12`
2. Aumentar o custo: `cost: 6` → `cost: 8`
3. Deixar como está e justifique por que você acha que está balanceado

**Documente sua escolha:**
- O que você mudou?
- O jogo ficou mais ou menos difícil para o jogador?
- A IA ficou mais ou menos eficiente?

### Tarefa B: Buff na Luz Sagrada

A Luz Sagrada (cura 15 / custo 5) raramente é jogada pela IA porque ela só cura quando HP ≤ 8.

**Sua missão:** encontre em `useGame.ts` a condição que controla quando a IA usa cura e mude o threshold de `8` para `12`.

```typescript
// ANTES:
if (state.aiHP <= 8) {

// DEPOIS:
if (state.aiHP <= 12) {
```

**Reflexão:** A IA ficou mais defensiva ou mais agressiva? Em que situações isso é melhor?

---

## 🤖 Exercício 2.3: Modificar a Estratégia da IA

### Tarefa: Fazer a IA defender mais

Atualmente a IA defende com 45% de chance quando HP ≤ 12:

```typescript
if (state.aiHP <= 12 && Math.random() < 0.45) {
```

**Sua missão:** Modificar a IA para ser mais defensiva:
1. Mude o threshold de `12` para `18` (IA defende com mais HP)
2. Mude a probabilidade de `0.45` para `0.65` (mais chance de defender)

```typescript
// Novo código:
if (state.aiHP <= 18 && Math.random() < 0.65) {
```

**Teste:** A IA agora está mais difícil de matar? O jogo ficou mais lento?

---

## 🎨 Exercício 2.4: Criar uma Nova Arte ASCII

A arte das cartas é um array de 4 strings de 7 caracteres cada.

### Tarefa: Criar arte para uma carta existente

Escolha qualquer carta e crie uma arte ASCII diferente. Regras:
- Exatamente 4 linhas
- Cada linha com ~7 caracteres (pode variar um pouco)
- Use apenas caracteres do teclado: `/ \ | - = * ( ) [ ] { } # @ ^ ~`

**Exemplo para Raio:**
```typescript
// Arte atual:
art: [
  '  \\|/  ',
  '  -o-  ',
  '  /|\\  ',
  ' ~~~~~ ',
],

// Sua versão (exemplo):
art: [
  '   //  ',
  '  //// ',
  ' //\\\\  ',
  '   ~~  ',
],
```

**Dica:** Você pode visualizar a arte antes de colocar no jogo desenhando num papel ou num editor de texto com fonte monospace.

---

## ✅ Checklist: Exercício Completo

- [ ] Criei uma carta nova em data/cards.ts
- [ ] Vi a nova carta aparecer no jogo
- [ ] Rebalanceei pelo menos uma carta
- [ ] Modifiquei a estratégia da IA
- [ ] Testei o jogo depois de cada mudança
- [ ] Criei uma nova arte ASCII para alguma carta

---

## 🚀 Próximo Nível

Quando estiver pronto, vá para **`nivel-3-avancado.md`** para implementar novas mecânicas!

---

## 💡 Dicas

**Ao criar cartas:**
- Pense no custo-benefício. `attack: 10, cost: 1` é muito quebrado.
- Uma boa referência: Bola de Fogo tem 2.67 ATK/mana — cartas novas devem ficar próximas disso.

**Ao modificar a IA:**
- Após cada mudança, jogue 5 partidas e veja se ainda é desafiador.
- Uma IA muito defensiva pode ficar com muito HP mas nunca vencer.

**Se algo quebrar:**
- Verifique a sintaxe: TypeScript vai mostrar erros em vermelho no VS Code
- O terminal do `npm run dev` também mostra erros de compilação
