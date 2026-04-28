# 📚 Exercícios Nível 1 - Game-UW

> Entenda unidades, mapas e comece a pensar em estratégia!

---

## 🎯 Objetivo Deste Nível

Você vai:
- [ ] Entender como unidades funcionam
- [ ] Aprender coordenadas hexagonais
- [ ] Começar a pensar em estratégia
- [ ] Jogar sua primeira batalha

---

## 📝 Exercício 1.1: Explorar e Entender Unidades

### Tarefa
Abra `src/renderer/src/game/defs/` e procure pelas definições de unidades:

**Perguntas:**
1. [ ] Quantos tipos de unidades existem? (Listar todos)
2. [ ] Qual unidade tem mais HP? (Nome e número)
3. [ ] Qual unidade tem maior RANGE? (alcance de ataque)
4. [ ] Qual unidade é a mais barata?
5. [ ] Qual unidade é a mais cara?

**Tabela de Resposta:**
```markdown
| Tipo | HP | ATK | DEF | MOV | RANGE | CUSTO |
|------|----|----|-----|-----|-------|-------|
|      |    |    |     |     |       |       |
```

---

## 🗺️ Exercício 1.2: Entender Coordenadas Hexagonais

### Tarefa A: Encontre o Sistema de Coordenadas

1. Abra `src/renderer/src/game/hex/` ou `hexMap.ts`
2. Procure por `q` e `r` (coordenadas hexagonais)
3. Responda:
   - [ ] Como é calculada a distância entre dois hexágonos?
   - [ ] Qual é a fórmula?

### Tarefa B: Calcule Distâncias

Use a fórmula que encontrou:

```
hexDistance(q1, r1, q2, r2)
```

Calcule:
1. Distância de (0, 0) até (2, 0): ___
2. Distância de (0, 0) até (1, 1): ___
3. Distância de (3, 2) até (5, 3): ___

**Dica:** Use a fórmula `(dq + dr + ds) / 2` onde:
- `dq = |q1 - q2|`
- `dr = |r1 - r2|`
- `ds = |q1 + r1 - q2 - r2|`

---

## ⚔️ Exercício 1.3: Entender Combate

### Tarefa: Calcular Resultado de Batalha

Imagine esta situação:

```
Seu Soldado:
  HP: 20
  ATK: 8
  DEF: 2

Inimigo:
  HP: 20
  ATK: 10
  DEF: 3
```

**Pergunta 1:** Seu soldado ataca o inimigo.
- Dano causado = 8 (ATK) - (3 × 0.5) = 8 - 1.5 = **6.5**
- HP do inimigo depois = 20 - 6.5 = **13.5**

**Pergunta 2:** Inimigo contra-ataca.
- Dano causado = 10 - (2 × 0.5) = 10 - 1 = **9**
- HP do seu soldado depois = 20 - 9 = **11**

**Pergunta 3:** Seu soldado ataca novamente.
- Quantos ataques até inimigo morrer?
- Resposta: ___

---

## 🎮 Exercício 1.4: Pensamento Estratégico (MACRO)

### Cenário 1: ATAQUE FRONTAL

```
Sua composição:
  ├─ 3 Infantarias (fraco, barato, rápido)
  └─ 1 Tanque (forte, caro, lento)

Inimigo:
  ├─ 2 Infantarias
  └─ 1 Tanque

Seu Objetivo: VENCER

Pergunta: "Qual é sua estratégia?"
```

**Opções:**
A) Ataque frontal com TUDO (infantarias + tanque na frente)
B) Flankeio (infantarias contornam, tanque segura a frente)
C) Defesa (espera inimigo atacar, depois contra-ataca)

**Sua resposta:** ___

**Por quê?** (explique em 2-3 linhas)
```
________________________________
________________________________
________________________________
```

---

### Cenário 2: DESVANTAGEM

```
Sua composição:
  └─ 1 Infantaria
  └─ 1 Arqueiro

Inimigo:
  ├─ 2 Tanques
  └─ 2 Infantarias

Seu Objetivo: SOBREVIVER o máximo
```

**Pergunta:** "Como você se posiciona?"

**Opções:**
A) Ataque frontal (tentar derrotar rápido)
B) Defesa (proteger, desgastar inimigo)
C) Fuga (tentar manter unidades vivas)

**Sua resposta:** ___

**Por quê?**
```
________________________________
________________________________
```

---

## ✅ Checklist: Exercício Completo

- [ ] Listei todos os tipos de unidades
- [ ] Identifiquei a unidade mais forte/fraca
- [ ] Entendo coordenadas hexagonais
- [ ] Consegui calcular distância entre hexágonos
- [ ] Entendo como combate funciona
- [ ] Entendo a diferença entre MICRO e MACRO
- [ ] Consegui responder os cenários de estratégia
- [ ] Joguei uma partida completa

---

## 🚀 Próximo Nível

Parabéns! Você aprendeu:
- ✅ Como unidades funcionam
- ✅ Como mapas hexagonais funcionam
- ✅ Conceitos básicos de estratégia

Quando estiver pronto, vá para **`nivel-2-intermediario.md`** para aprender estratégia avançada!

---

## 💡 Dicas Extras

**Precisa revisar?**
- Leia `docs/01_unidades.md` pra unidades
- Leia `docs/02_mapas.md` pra hexágonos
- Leia `docs/03_micros-macros.md` pra estratégia

**Quer jogar online?**
- Rode `npm run dev` ou `npm start`
- Teste uma batalha real
- Observe como seus micros afetam o resultado

**Quer entender mais?**
- Procure por comentários no código (linhas começando com `//`)
- Procure por `Unit` pra ver estrutura
- Procure por `HexTile` pra ver estrutura do mapa
