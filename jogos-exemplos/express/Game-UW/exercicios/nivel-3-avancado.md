# 🏆 Exercícios Nível 3 - Game-UW
## Avançado: Metagame e Teórica de Jogo

> Você domina as peças. Agora vamos DOMINAR o jogo inteiro!

---

## 🎯 Objetivo Deste Nível

- [ ] Entender METAGAME (meta strategy do jogo)
- [ ] Análise teórica de balanço
- [ ] Criar estratégias "ótimas"
- [ ] Entender porque certos builds ganham

---

## 📊 Exercício 3.1: Análise de Custo-Benefício

### Tarefa: Qual Unidade Oferece Melhor Valor?

**Conceito: Cost Efficiency (CE)**
```
CE = Poder Total / Custo
    = (HP + ATK + DEF + MOV + RANGE) / Ouro

Exemplo:
Infantaria (20 + 8 + 2 + 3 + 1) / 30 = 34/30 = 1.13
```

### Tarefas:

1. **Calcule a Eficiência de Cada Unidade**
   ```
   Infantaria:
   ├─ Stats: HP 20 + ATK 8 + DEF 2 + MOV 3 + RANGE 1 = 34
   ├─ Custo: 30
   └─ CE = 34/30 = 1.13
   
   Tanque:
   ├─ Stats: HP 80 + ATK 5 + DEF 8 + MOV 2 + RANGE 1 = ___
   ├─ Custo: 80
   └─ CE = ___
   
   Arqueiro:
   ├─ Stats: HP 15 + ATK 12 + DEF 1 + MOV 3 + RANGE 4 = ___
   ├─ Custo: 50
   └─ CE = ___
   ```

2. **Qual é a Unidade Mais "Barata"?**
   ```
   Resposta (unidade com maior CE): ___
   
   O que isso significa:
   ├─ Essa unidade é a melhor pra começar?
   ├─ Ela destrói todas as outras?
   └─ Qual é a pegadinha?
   
   Resposta: ___
   ```

3. **Nível de Eficiência**
   ```
   Meta-análise:
   
   Se Infantaria (CE 1.13) é mais eficiente que Tanque (CE 0.9),
   por que NÃO usar só Infantarias?
   
   Resposta (pense em matchups):
   _______________________________
   ```

4. **Crie uma Métrica Melhor**
   
   A fórmula simples não é perfeita. Por quê?
   ```
   ├─ Não considera QUALIDADE dos stats
   ├─ Um Tanque vale mais que números sugerem
   └─ Arqueiro idem
   
   Sua métrica (pense em o que importa):
   
   Eficiência Corrigida = ___
   
   (Dica: talvez peso diferente para cada stat?)
   ```

---

## 🎯 Exercício 3.2: Teória de Matchups

### Tarefa: Crie uma Matriz de Contadores

**Conceito: Rock-Paper-Scissors**

No Game-UW há contadores:
- Infantaria bate Arqueiro (alcança rápido)
- Arqueiro bate Tanque (ignora defesa)
- Tanque bate... ninguém? (nem sempre)

### Tarefas:

1. **Preencha a Matriz de Matchups**
   ```
   Rows = Atacante, Cols = Defensor
   
                Infantaria  Tanque  Arqueiro
   Infantaria      ?         ?         ?
   Tanque          ?         ?         ?
   Arqueiro        ?         ?         ?
   
   Legenda:
   Vence = +1
   Empata = 0  
   Perde = -1
   
   Sua resposta:
   ```

2. **Analise o Resultado**
   ```
   Existe um padrão Rock-Paper-Scissors perfeito?
   Resposta: SIM / NÃO
   
   Se não, qual unidade é "overpowered"?
   Resposta: ___
   
   Como balancear?
   ├─ Aumentar HP de ___?
   ├─ Diminuir custo de ___?
   └─ Mudar RANGE de ___?
   ```

3. **Crie Cenários Específicos**
   ```
   Cenário A: 1 Infantaria vs 1 Tanque
   ├─ Quem ganha: ___
   ├─ Quantos turnos: ___
   └─ Por quê:
   
   Cenário B: 1 Arqueiro vs 1 Infantaria
   ├─ Quem ganha: ___
   └─ Análise: (Arqueiro tem range 4, Infantaria range 1,
      mas Infantaria é mais rápido...)
   
   Cenário C: 2 Arqueiros vs 1 Tanque
   ├─ Quem ganha: ___
   └─ Análise:
   ```

---

## 🎮 Exercício 3.3: Build Ótimo (Optimal)

### Tarefa: Qual é o Build Que Não Pode Perder?

Com 200 ouro, qual composição é "metagame"?

Teóricos costumam concordar:
```
META BUILD A: 2 Tanques + 1 Arqueiro
├─ Custo: 2×80 + 50 = 210 (passa do orçamento!)
└─ Problema: Muito caro

META BUILD B: 1 Tanque + 2 Infantarias + 1 Arqueiro  
├─ Custo: 80 + 2×30 + 50 = 190
└─ Força: Balanceada

META BUILD C: 1 Tanque + 3 Infantarias
├─ Custo: 80 + 3×30 = 170
├─ Força: Números, mas sem range
└─ Problema: Arqueiro inimigo domina
```

### Tarefas:

1. **Analise Cada Build Contra Cada Matchup**
   ```
   vs Swarm (6 Infantarias):
   ├─ Build A: ___
   ├─ Build B: ___
   └─ Build C: ___
   
   vs 4 Arqueiros:
   ├─ Build A: ___
   ├─ Build B: ___
   └─ Build C: ___
   
   vs Build B (espelho):
   ├─ Build A: ___
   ├─ Build B: ___
   └─ Build C: ___
   ```

2. **Qual Build Vence Mais Matchups?**
   ```
   Build B parece ser o mais equilibrado...
   
   Pergunta: Por quê?
   Resposta: ___
   
   Se todo mundo usa Build B, como você vence?
   Resposta: (escolher build diferente... qual?)
   ```

3. **Crie seu Build Teórico**
   ```
   Eu escolho:
   ├─ Composição: ___
   ├─ Custo: ___
   ├─ Força: ___
   └─ Razão: ___
   
   Ele bate Build B?
   Resposta: SIM / NÃO / Talvez (50%)
   ```

---

## 🧠 Exercício 3.4: Teoria de Jogos

### Tarefa: Entender Incentivos

Na teoria de jogos, todo jogador quer ganhar. O que eles fazem?

**Conceito: Nash Equilibrium**
```
Um estado onde NINGUÉM consegue ganhar mudando de estratégia
```

### Tarefas:

1. **Encontre o Equilíbrio**
   ```
   Se TODOS usam Meta Build B:
   ├─ Você usa Build B: Empate 50%
   ├─ Você usa Build Counter: Ganha 70%
   ├─ Inimigo vê que perde
   └─ Inimigo muda pra Counter-Counter
   
   Pergunta: Existe um Build que SEMPRE ganha?
   Resposta: ___
   
   Por quê:
   _________________________
   ```

2. **Pedra-Papel-Tesoura do Meta**
   ```
   Se existe:
   
   Build A bate Build B
   Build B bate Build C
   Build C bate Build A
   
   Qual você jogaria?
   Resposta: ___ (ou explique por quê é impossível)
   ```

3. **Exploração vs Adaptação**
   ```
   Estratégia A: Descobrir qual Build o inimigo usa
                 Escolher Counter
   
   Estratégia B: Jogar sempre Meta Build
   
   Qual ganha?
   Resposta: ___
   
   Cenário: Você joga 5 partidas contra o mesmo inimigo
            Qual estratégia você usa?
   ```

---

## 📈 Exercício 3.5: Balanceamento e Design

### Tarefa: Se Fosse Game Designer...

Você agora precisa balancear o jogo. Os problemas:

```
Problema 1: Arqueiro é muito fraco (Infantaria chega rápido)
Problema 2: Tanque não oferece vantagem clara (caro!)
Problema 3: Swarm meta (6 Infantarias bate tudo)
```

### Tarefas:

1. **Identifique as Causas**
   ```
   Problema 1 - Arqueiro fraco:
   ├─ Causa: Infantaria MOV 3, Arqueiro tbm MOV 3, mas range 1 vs 4
   ├─ Análise: Se os 2 correm pra se encontrar, Infantaria chega
   └─ Culpado: ___
   
   Problema 2 - Tanque caro:
   └─ Culpado: ___
   
   Problema 3 - Swarm dominante:
   └─ Culpado: ___
   ```

2. **Proponha 3 Soluções Para Cada**
   
   **Problema 1 (Arqueiro):**
   ```
   Solução A: Aumentar RANGE de 4 pra 5
   ├─ Impacto: Arqueiro consegue atirar antes Inf chegar
   └─ Risco: Fica overpowered?
   
   Solução B: ___
   Solução C: ___
   ```

3. **Escolha as Melhores Soluções**
   ```
   Eu escolho:
   ├─ Pra Arqueiro: ___
   ├─ Pra Tanque: ___
   └─ Pra Swarm: ___
   
   Por quê (explique impacto total do jogo):
   _____________________________
   ```

4. **Teste Balanceamento**
   
   Depois de suas mudanças, novo meta emerge:
   ```
   Meta Build Novo Proposto:
   ├─ Composição: ___
   ├─ Razão: ___
   └─ Bate Build B original? (SIM/NÃO)
   ```

---

## 🏅 Exercício 3.6: Dissertação Final

### Tarefa: Escreva sua Análise

Escolha UMA das seguintes:

**Opção 1: "O Problema do Metagame"**
```
Escreva 1-2 páginas analisando:
1. Qual é o Build "Ótimo" atual?
2. Por quê é ótimo?
3. Como se contrapõe?
4. Existe solução perfeita de balanceamento?

Sua análise:
```

**Opção 2: "Design de Matching System"**
```
Se você fosse designer Game-UW:
1. Que mudanças faria?
2. Por quê?
3. Como balancearia?
4. Qual seria novo metagame?

Seu design:
```

**Opção 3: "Análise Comparativa"**
```
Compare os 3 tipos de unidades:
1. Qual é mais bem-desenhada?
2. Qual oferece mais decisões estratégicas?
3. Qual é mais "injusta"?
4. Como tornaria todos iguais em interesse?

Sua análise:
```

---

## ✅ Checklist: Nível 3 Completo

- [ ] Calculei eficiência de todas unidades
- [ ] Criei matriz de matchups
- [ ] Identifiquei meta builds
- [ ] Entendi teoria de Nash Equilibrium
- [ ] Analisei problemas de balanceamento
- [ ] Propus soluções de design
- [ ] Escrevi dissertação final
- [ ] Conseguiria debater game design inteligentemente

---

## 🎓 Reflexão Final

1. **O mais difícil foi entender:** 
   _______________________________

2. **Nunca tinha pensado em:**
   _______________________________

3. **Agora vejo o Game-UW diferente porque:**
   _______________________________

4. **Teoria de Jogos e Game Design são relevantes porque:**
   _______________________________

---

## 🚀 Você Agora É...

- ✅ Jogador Competitivo (entende meta)
- ✅ Game Designer Amador (pensa em balanceamento)
- ✅ Teórico de Jogos (análise formal)
- ✅ Pensador Crítico (questiona design)

**Próximos passos:**
1. Jogue competitivamente contra amigos
2. Estude GDDs (Game Design Documents) profissionais
3. Analise outros jogos estratégicos (Dota, LoL, Chess)
4. Considere balanceamento quando programa novos jogos

---

**Parabéns por dominar Game-UW! 🏆💜**
