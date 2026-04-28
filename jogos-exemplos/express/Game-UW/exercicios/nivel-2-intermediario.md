# 🎯 Exercícios Nível 2 - Game-UW  
## Intermediário: Estratégia Avançada

> Você entende as regras. Agora vamos pensar como CAMPEÕES!

---

## 🎯 Objetivo Deste Nível

- [ ] Combinar múltiplos conceitos (unidades + mapa + estratégia)
- [ ] Analisar cenários complexos
- [ ] Tomar decisões estratégicas reais
- [ ] Entender trade-offs de cada escolha

---

## ⚔️ Exercício 2.1: Análise de Composição de Força

### Tarefa: Escolha a Melhor Composição

Você tem **200 de ouro** para montar sua força. Cada unidade custa:

```
Infantaria: 30 ouro  (HP: 20, ATK: 8, DEF: 2, MOV: 3, RANGE: 1)
Tanque:     80 ouro  (HP: 80, ATK: 5, DEF: 8, MOV: 2, RANGE: 1)
Arqueiro:   50 ouro  (HP: 15, ATK: 12, DEF: 1, MOV: 3, RANGE: 4)
```

**Opção A: Força Equilibrada**
```
├─ 2 Infantarias (60)
├─ 1 Tanque (80)
├─ 1 Arqueiro (50)
└─ Total: 190 ouro
```

**Opção B: Infantaria Pura** (Swarm)
```
├─ 6 Infantarias (180)
└─ Total: 180 ouro
```

**Opção C: Tanque + Apoio**
```
├─ 2 Tanques (160)
├─ 1 Arqueiro (50)
└─ Total: 210 ouro (excedeu!)
```

**Opção D: Arqueiros Dominantes**
```
├─ 4 Arqueiros (200)
└─ Total: 200 ouro
```

### Tarefas:

1. **Calcule o Dano Total por Composição**
   ```
   Opção A:
   ├─ 2 Infantarias: 2 × 8 = 16 ATK
   ├─ 1 Tanque: 1 × 5 = 5 ATK
   ├─ 1 Arqueiro: 1 × 12 = 12 ATK
   └─ TOTAL: 33 ATK
   
   Opção B (6 Infantarias):
   └─ TOTAL: ___
   
   Opção D (4 Arqueiros):
   └─ TOTAL: ___
   ```

2. **Calcule HP Total**
   ```
   Opção A: (2×20) + (1×80) + (1×15) = 135 HP
   Opção B: ___
   Opção D: ___
   ```

3. **Análise DPS (Dano por Turno)**
   
   Se todas as unidades atacassem:
   ```
   Opção A:  33 dano/turno
   Opção B:  ___ dano/turno
   Opção D:  ___ dano/turno
   
   Qual é mais forte?  Resposta: ___
   Qual sobrevive mais? Resposta: ___
   Qual é mais flexível? Resposta: ___
   ```

4. **Resumo Comparativo**
   ```
   | Métrica    | A | B | D |
   |------------|---|---|---|
   | Dano Total | 33| ___| ___|
   | HP Total   | 135| ___| ___|
   | Custo      | 190| 180| 200|
   | Mobilidade | M | M | A |
   | Alcance    | B | B | A |
   ```

5. **Qual escolheria?** E por quê?
   ```
   Resposta: ___
   
   Justificativa (4-5 linhas):
   _________________________________
   _________________________________
   ```

---

## 🗺️ Exercício 2.2: Mapa e Posicionamento

### Tarefa: Use o Terreno a seu Favor

Imagine este mapa 8x8 com você (Azul) vs Inimigo (Vermelho):

```
  0 1 2 3 4 5 6 7
0 . . # # # . . .
1 . S . . . . . .    S = Sua Infantaria
2 # # # . . . . .    T = Seu Tanque
3 . . . . . . # .    A = Seu Arqueiro
4 . . . . . . # .    
5 . . . . . . # .
6 . . . . . . # .
7 . . . . . E E .    E = Inimigos
```

Sua força (Opção A do anterior):
```
Infantaria 1: (1,1)
Infantaria 2: (2,1)
Tanque:       (1,3)
Arqueiro:     (0,4)
```

Inimigos (4 Infantarias):
```
E1: (6,7)
E2: (7,7)
E3: (6,6) 
E4: (5,6)
```

### Tarefas:

1. **Calcule Distâncias Até Inimigos**
   ```
   Seu Tanque (1,3) até Inimigo (6,7):
   - Distância ≈ |1-6| + |3-7| = 5 + 4 = 9 movimento
   
   Seu Arqueiro (0,4) até Inimigo (6,7):
   - Distância ≈ ___
   
   Seu Infantaria1 (1,1) até Inimigo (6,7):
   - Distância ≈ ___
   ```

2. **Qual unidade chega primeiro?**
   ```
   Respostas (que unidade chega em menos turnos):
   ├─ Infantaria (MOV 3): ___
   ├─ Tanque (MOV 2): ___
   └─ Arqueiro (MOV 3): ___
   
   Qual ameaça o inimigo primeiro? Resposta: ___
   ```

3. **Use o Terreno**
   
   Vê as paredes (#)? Seu Arqueiro está protegido atrás!
   
   ```
   Estratégia sugerida:
   ├─ Arqueiro: Atira de longe (RANGE 4)
   ├─ Infantarias: Vão pelo lado esquerdo (sem paredes)
   └─ Tanque: Segura o centro
   
   Pergunta: Qual é a ROTA mais segura para suas tropas?
   Desenhe com . (seu caminho):
   
     0 1 2 3 4 5 6 7
   0 . . # # # . . .
   1 . . . . . . . .
   2 # # # . . . . .
   3 . . . . . . # .
   4 . . . . . . # .
   5 . . . . . . # .
   6 . . . . . . # .
   7 . . . . . . . .
   ```

4. **Posicionamento Defensivo**
   
   Se VOCÊ começar na posição acima, o inimigo chega em quantos turnos?
   ```
   Resposta: ___
   
   Se você tivesse que recontar ANTES do inimigo chegar, 
   para qual posição você moveria:
   ├─ Infantarias: ___
   ├─ Tanque: ___
   └─ Arqueiro: ___
   ```

---

## 🤝 Exercício 2.3: Sinergia de Unidades

### Tarefa: Crie Combinações Poderosas

Certas unidades funcionam bem juntas:

```
DUPLA 1: Infantaria + Arqueiro
├─ Infantaria: Atrai atenção (target)
├─ Arqueiro: Atira de trás (safe)
└─ Resultado: Infantaria toma dano, Arqueiro mata

DUPLA 2: Tanque + Infantaria
├─ Tanque: Bloqueia caminho
├─ Infantaria: Ataca lado
└─ Resultado: Inimigo não consegue passar

DUPLA 3: 2 Tanques
├─ Tanque 1: Frente
├─ Tanque 2: Retaguarda
└─ Resultado: Parede viva impossível de quebrar
```

### Tarefas:

1. **Crie sua Dupla Ideal**
   ```
   Minha dupla é: ___ + ___
   
   Como funciona:
   ├─ Unidade 1 faz: ___
   ├─ Unidade 2 faz: ___
   └─ Juntas: ___
   ```

2. **Contra o quê é fraca sua dupla?**
   ```
   Unidade que derrota sua dupla: ___
   
   Por quê:
   _________________________
   ```

3. **Como vencer a unidade que derrota você?**
   ```
   Resposta: ___
   
   (Dica: talvez outra dupla?)
   ```

4. **Crie um "Counter" (Resposta)**
   
   Uma combinação que bate sua dupla:
   ```
   Dupla Counter:  ___ + ___
   
   Como funciona:
   ├─ Ponto 1: ___
   ├─ Ponto 2: ___
   └─ Resultado: Dupla Original perde
   ```

---

## 🏆 Exercício 2.4: Estratégia 3v3

### Tarefa: Batalha Real

Imagine uma batalha 3v3 completa:

**Sua Força (Você controla):**
```
├─ Tanque (HP 80, ATK 5, DEF 8)
├─ Infantaria (HP 20, ATK 8, DEF 2)
└─ Arqueiro (HP 15, ATK 12, DEF 1)
```

**Força Inimiga:**
```
├─ Tanque (HP 80, ATK 5, DEF 8)
├─ 2 Infantarias (HP 20 cada, ATK 8, DEF 2)
```

### Tarefas:

1. **Predição: Quem Ganha?**
   ```
   Seu DPS total: 5 + 8 + 12 = 25
   Inimigo DPS: 5 + 8 + 8 = 21
   
   Seu DPS é maior... mas o inimigo tem MAIS unidades!
   
   Pergunta: Quem você acha que ganha?
   Resposta: ___
   
   Por quê (analise distribuição de dano):
   ________________________________
   ```

2. **Sua Estratégia Turno-a-Turno**
   ```
   Turno 1:
   ├─ Tanque: Se posiciona em ___
   ├─ Infantaria: Ataca ___
   └─ Arqueiro: Atira em ___
   
   Turno 2:
   └─ [baseado em resposta inimiga] ___
   
   Turno 3+:
   └─ [seu plano] ___
   ```

3. **Pior Cenário (Inimigo Ideal)**
   
   E se o inimigo jogasse perfeitamente?
   ```
   Ele atacaria seu ___
   (qual unidade é mais fraca?)
   
   Como você defende?
   ___________________
   ```

4. **Melhoria: Troque uma Unidade**
   
   Se pudesse trocar uma unidade por outra:
   ```
   Trocaria: ___ por ___
   
   Razão: ___
   
   Novo resultado da batalha: ___
   ```

---

## 💡 Exercício 2.5: Análise de Erro

### Tarefa: Aprenda com Erros

Leia este cenário:

```
Jogador Iniciante fez isto:

MAPA:     [Seu Mapa]
            Sua unidade: Arqueiro em (0,0)
            Inimigo: Tanque em (5,5)
            Distância: 10 movimentos

TURNO 1: Arqueiro se move 3 casas (máximo MOV)
         Inimigo Tanque se move 2 casas (máximo MOV)
         Distância agora: 5 movimentos

TURNO 2: Arqueiro se move 3 casas
         Está a 1 movimento de distância... 
         ESPERA! Inimigo ataca de range 1!

RESULTADO: Arqueiro leva 30 dano, morre (15 HP total)
```

### Tarefas:

1. **Qual foi o erro?**
   ```
   Resposta: ___
   
   (Dica: O Arqueiro deveria...)
   ```

2. **Como Corrigir?**
   ```
   Estilo 1: Não se aproximar
   └─ Atacar de range 4
   
   Estilo 2: Ter escolta
   └─ Colocar ___ na frente
   
   Estilo 3: Outra estratégia?
   └─ ___
   ```

3. **Lição Aprendida:**
   ```
   Arqueiros são fracos contra ___
   
   Se tiver um Arqueiro, sempre precisa de ___
   ```

---

## ✅ Checklist: Nível 2 Completo

- [ ] Análise composição de força (cálculos corretos)
- [ ] Entendi posicionamento em mapa
- [ ] Descobri sinergias entre unidades
- [ ] Consegui planejar batalha 3v3
- [ ] Aprendi com erro e evitei repetir
- [ ] Consigo justificar cada decisão estratégica
- [ ] Entendo trade-offs (força vs flexibilidade)
- [ ] Joguei algumas partidas aplicando conceitos

---

## 🚀 Próximo Nível

Parabéns! Você agora entende:
- ✅ Como compor força efetivamente
- ✅ Como usar mapa a favor
- ✅ Como unidades sinergizam
- ✅ Como pensar muitos turnos adiante

Vá para **`nivel-3-avancado.md`** para dominar o metagame!
