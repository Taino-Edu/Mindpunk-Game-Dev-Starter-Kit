# 📚 Exercícios Nível 1 - Fragmento 01

> Copie, entenda, modifique! Leia o código base e faça pequenas mudanças.

---

## 🎯 Objetivo Deste Nível

Você vai:
- [ ] Explorar o código do Fragmento 01
- [ ] Entender o fluxo (INPUT → UPDATE → RENDER)
- [ ] Fazer pequenas modificações (cores, velocidade, valores)
- [ ] Ver as mudanças funcionando no jogo

---

## 📝 Exercício 1.1: Explorar e Entender o Código

### Tarefa
Abra os arquivos principais e responda as perguntas:

1. **Abra `src/App.tsx`**
   - Encontre: Qual tecla faz o player esperar? (RESPOSTA: `Space`)
   - Encontre: Quais teclaspode mover para cima? (RESPOSTA: `w` ou `ArrowUp`)
   - **Pergunta:** Qual função é chamada quando você pressiona uma tecla? (Resposta: `movePlayer()`)

2. **Abra `src/store/useGameStore.ts`**
   - Encontre: Qual é a vida inicial do player? (procure por `HP` ou `health`)
   - Encontre: Qual é o dano base do player? (procure por `BASE_PLAYER_DMG`)
   - **Pergunta:** Que tipo de função é `movePlayer`? (É um método que atualiza o estado)

3. **Abra `src/components/Game/Grid.tsx`**
   - Encontre: O que a letra `@` representa? (O player)
   - Encontre: O que a letra `E` representa? (Um enemy/inimigo)

### Dica de Busca
Use `Ctrl+F` (ou `Cmd+F` no Mac) para buscar nos arquivos:
- Procure por `BASE_PLAYER_DMG` para encontrar dano
- Procure por `health` ou `hp` para encontrar vida
- Procure por `movePlayer` para ver todas as chamadas

---

## 🎨 Exercício 1.2: Mudar Cores e Valores

### Tarefa A: Aumentar Vida do Player em 50%

**Instruções:**
1. Abra `src/store/useGameStore.ts`
2. Procure por uma linha que diz `hp:` ou `health:` (vida inicial)
3. Aumente o valor em 50%
   - Se era 100, mude para 150
   - Se era 80, mude para 120

**Como saber se funcionou:**
- Rode o jogo (`npm run dev`)
- No HUD (canto superior), você deve ver uma vida maior na barra

**Exemplo:**
```typescript
// ANTES:
hp: 100,

// DEPOIS (50% a mais):
hp: 150,
```

---

### Tarefa B: Aumentar Dano do Player em 20%

**Instruções:**
1. Procure por `BASE_PLAYER_DMG` em `useGameStore.ts`
2. Aumente o valor em 20%
   - Se era 25, mude para 30
   - Se era 20, mude para 24

**Como saber se funcionou:**
- Quando atacar um inimigo, o dano deve ser maior
- Veja na mensagem de combate: "Você atacou por X de dano"

---

### Tarefa C: Mudar Custo de Movimento

**Instruções:**
1. Procure por `COST_MOVE` em `useGameStore.ts`
2. DIMINUA o valor (menos custo = pode se mover mais)
   - Se era 8, mude para 5

**Como saber se funcionou:**
- A barra de "ENERGY" (energia no HUD) deve gastar menos por movimento
- Você consegue se mover mais vezes antes de ficar cansado

---

## 🎮 Exercício 1.3: Mudar Comportamento do Jogo

### Tarefa: Aumentar Quantidade de Inimigos

**Instruções:**
1. Abra `src/store/useGameStore.ts`
2. Procure por `spawnChance` (chance de spawn)
3. AUMENTE o valor (mais chance = mais inimigos)
   - Se era `0.04`, mude para `0.08`

**Como saber se funcionou:**
- Quando gerar novo mapa, terá MAIS inimigos
- O jogo fica mais difícil!

**Aviso:** Não aumente demais ou o jogo fica impossível! 😅

---

## 🧪 Exercício 1.4: Ler e Entender a IA

### Tarefa: Entender Como a IA Se Move

**Instruções:**
1. Abra `src/logic/ai.ts`
2. Procure pela função `processEnemiesTurn`
3. Leia os comentários (linhas começando com `//`)
4. Responda:

**Perguntas:**
- [ ] A IA persegue o player? (Sim/Não)
- [ ] A IA ataca à distância ou precisa estar perto? (Distância/Perto)
- [ ] Como a IA decide onde se mover? (Aleatório/Inteligente/Outra)

**Dica:** Procure por palavras como `chase`, `follow`, `attack`, `random`

---

## ✅ Checklist: Exercício Completo

- [ ] Entendi onde fica INPUT (App.tsx)
- [ ] Entendi onde fica UPDATE (useGameStore.ts)
- [ ] Entendi onde fica RENDER (Grid.tsx)
- [ ] Consegui aumentar vida do player
- [ ] Consegui aumentar dano do player
- [ ] Consegui mudar dificuldade (inimigos)
- [ ] Li e entendi a IA em ai.ts
- [ ] Testei mudanças rodando o jogo

---

## 🚀 Próximo Nível

Parabéns! Você:
- ✅ Explorou o código
- ✅ Entendeu o game loop
- ✅ Modificou valores

Quando estiver pronto, vá para **`nivel-2-criativo.md`** para adicionar NOVAS features!

---

## 💡 Dicas Extras

**Se o jogo quebrou:**
- Verificou se salvou o arquivo?
- Verificou se o servidor está rodando (`npm run dev`)?
- Tente `Ctrl+Shift+R` para limpar o cache do navegador

**Se quer mais informação:**
- Leia `docs/01_game-loop.md`
- Leia `docs/03_state-management.md`
- Procure por comentários no código (linhas começando com `//` ou `/**`)
