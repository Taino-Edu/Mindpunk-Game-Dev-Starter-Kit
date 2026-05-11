# 📚 Exercícios Nível 1 — Arcane Duel

> Explore, entenda, modifique! Leia o código e faça pequenas mudanças.

---

## 🎯 Objetivo Deste Nível

Você vai:
- [ ] Rodar o jogo e entender como ele funciona
- [ ] Localizar onde ficam os dados das cartas
- [ ] Fazer pequenas modificações de valores
- [ ] Ver as mudanças funcionando no jogo

**Tempo estimado:** 30–40 minutos

---

## 📝 Exercício 1.1: Rodar e Explorar

### Tarefa
1. Entre na pasta do jogo e rode:
   ```bash
   npm install
   npm run dev
   ```
2. Abra `http://localhost:3000`
3. Clique `[ INICIAR DUELO ]` e jogue algumas partidas

**Responda (sem olhar o código ainda):**
- [ ] Quantas cartas você começa com na mão?
- [ ] O que acontece quando você clica em uma carta acinzentada?
- [ ] O que o número `◆3` no canto de uma carta representa?
- [ ] Qual o HP inicial de cada jogador?

---

## 🔍 Exercício 1.2: Explorar o Código

### Tarefa A: Encontrar o HP inicial

1. Abra `composables/useGame.ts`
2. Procure por `MAX_HP` (use Ctrl+F)
3. **Pergunta:** Qual o valor atual? Em qual linha está?

### Tarefa B: Contar as cartas

1. Abra `data/cards.ts`
2. Conte quantas cartas existem no array `CARD_DEFS`
3. **Pergunta:** Quantas cartas de cada `type` existem?
   - attack: ____
   - defense: ____
   - heal: ____
   - drain: ____

### Tarefa C: Entender o custo de uma carta

1. Em `data/cards.ts`, encontre a carta `berserker`
2. **Pergunta:** Qual o `attack` e o `cost`? Isso é eficiente?
   - Dica: compare com `ice_shard` (attack: 5, cost: 2)

---

## 🎨 Exercício 1.3: Modificar Valores

### Tarefa A: Aumentar o HP inicial em 50%

**Instruções:**
1. Abra `composables/useGame.ts`
2. Procure por `MAX_HP`
3. Mude o valor de `30` para `45`

**Como saber se funcionou:**
- Rode o jogo (`npm run dev`)
- A barra de HP agora mostra `45/45` em vez de `30/30`

```typescript
// ANTES:
const MAX_HP = 30

// DEPOIS:
const MAX_HP = 45
```

**Lembre de desfazer** depois: volte para `30`.

---

### Tarefa B: Fazer a Bola de Fogo mais fraca

**Instruções:**
1. Abra `data/cards.ts`
2. Encontre a carta com `id: 'fireball'`
3. Mude `attack: 8` para `attack: 3`

**Como saber se funcionou:**
- Jogue o jogo e use a Bola de Fogo
- O log deve mostrar apenas 3 de dano (antes da armadura)

---

### Tarefa C: Deixar o mana inicial maior

**Instruções:**
1. Em `composables/useGame.ts`, encontre `STARTING_MANA`
2. Mude de `3` para `6`

**Como saber se funcionou:**
- No início do jogo, você começa com `◆◆◆◆◆◆` em vez de `◆◆◆`
- Cartas mais caras ficam disponíveis logo de cara

**Reflexão:** Isso torna o jogo mais ou menos estratégico? Por quê?

---

## 🃏 Exercício 1.4: Ler e Entender a IA

### Tarefa: Entender como a IA escolhe uma carta

1. Abra `composables/useGame.ts`
2. Encontre a função `aiPickCard()`
3. Leia os comentários e responda:

**Perguntas:**
- [ ] O que a IA faz PRIMEIRO quando pode matar você? (Prioridade 1)
- [ ] Com quanto HP a IA começa a priorizar cura? (Prioridade 2)
- [ ] A IA sempre defende quando HP está baixo? Por quê não?
- [ ] O que significa a linha `if (plays === 1 && Math.random() > 0.6) break`?

**Dica:** Procure pelos comentários `// ── PRIORIDADE`

---

## ✅ Checklist: Exercício Completo

- [ ] Rodei o jogo com sucesso
- [ ] Entendi o que cada tipo de carta faz (attack/defense/heal/drain)
- [ ] Localizei MAX_HP em useGame.ts e entendi o valor
- [ ] Localizei as cartas em data/cards.ts e contei os tipos
- [ ] Modifiquei o HP inicial e vi a mudança no jogo
- [ ] Modifiquei o dano de uma carta e vi a mudança
- [ ] Li aiPickCard() e entendi as prioridades da IA

---

## 🚀 Próximo Nível

Parabéns! Você:
- ✅ Explorou a estrutura de dados das cartas
- ✅ Entendeu o papel de cada arquivo
- ✅ Modificou valores e viu o efeito

Quando estiver pronto, vá para **`nivel-2-intermediario.md`** para criar novas cartas!

---

## 💡 Dicas

**Se o jogo não carregou:**
- Rode `npm install` antes de `npm run dev`
- Verifique se a versão do Nuxt é 3.15.x: `cat package.json`

**Se uma mudança "quebrou" o jogo:**
- Verifique a sintaxe TypeScript (vírgulas, dois pontos)
- Use `Ctrl+Z` para desfazer
- O servidor Nuxt mostra erros no terminal — leia a mensagem

**Para buscar no código:**
- `Ctrl+F` dentro do arquivo
- `Ctrl+Shift+F` para buscar em todos os arquivos (VS Code)
