# 👨‍🏫 Roteiro do Professor - Workshop Mindpunk
## Guia para Conduzir a Workshop (3 horas)

---

## 📋 Estrutura Geral

```
TOTAL: 3 horas (180 minutos)

├─ Abertura (15 min)
├─ Conceitos (60 min)
├─ Prática 1: Fragmento 01 (30 min)
├─ Intervalo (15 min)
├─ Prática 2: Game-UW (40 min)
├─ Desafios ao Vivo (15 min)
└─ Encerramento (5 min)
```

---

## ⏱️ TEMPO 0-15 MIN: Abertura

### Objetivo
Engajar alunos, estabelecer expectativas, criar entusiasmo.

### O Que Fazer

1. **Boas-vindas (2 min)**
   ```
   "Bem-vindo ao Mindpunk Game Dev Workshop!
    
    Hoje vamos explorar como jogos funcionam,
    sem ser a aula chata de teoria.
    
    Vamos JOGAR e ENTENDER ao mesmo tempo!"
   ```

2. **Enquete Rápida (3 min)**
   ```
   Levante a mão:
   ├─ Quem joga videogame? 
   ├─ Quem já programou antes?
   ├─ Quem quer fazer seu próprio jogo?
   └─ Quem veio só por curiosidade?
   
   (Use isso pra entender nível da turma)
   ```

3. **Mostre o Resultado Final (5 min)**
   ```
   Demonstre AMBOS os jogos rodando:
   
   1. Fragmento 01:
      - Mostre movimento, ataque, AI inimiga
      - Diga: "Isso é state management em ação"
   
   2. Game-UW:
      - Mostre batalha tática
      - Diga: "Isso é teoria de jogos real"
   ```

4. **Explique a Estrutura (5 min)**
   ```
   "Durante 3 horas vamos:
    1. Aprender como QUALQUER jogo funciona
    2. Jogar Fragmento 01 e entender IA
    3. Jogar Game-UW e entender estratégia
    4. Alguns de vocês vão nos desafiar ao vivo
   
    Vocês vão sair daqui entendendo game loops.
    Prometo que vai ser divertido!"
   ```

### Dicas Didáticas
- ✅ Comece positivo, entusiasmado
- ✅ Faça contato visual
- ✅ Use humor quando apropriado
- ✅ Deixe claro: sem experiência prévia necessária

---

## ⏱️ TEMPO 15-75 MIN: Conceitos Teóricos

### Parte A: O Que é um Jogo? (15 min)

**SLIDE 1-2**

1. **Mostre o Loop (5 min)**
   ```
   Desenhe no quadro:
   
   ┌─────────────────────┐
   │  1. INPUT (ouve)    │
   │  2. UPDATE (processa)│
   │  3. RENDER (desenha)│
   │  [volta ao 1]       │
   └─────────────────────┘
   
   Explique:
   "Cada jogo, do Mario até League of Legends,
    é este loop rodando 60 vezes por segundo."
   ```

2. **Exemplos Concretos (10 min)**
   ```
   Fragmento 01 Loop:
   ├─ INPUT: Você aperta UP
   ├─ UPDATE: Player se move, IA inimiga pensa
   ├─ RENDER: Desenha grid com novas posições
   └─ volta ao INPUT
   
   Pergunta turma: "Em Chess.com, qual é o loop?"
   Resposta esperada: "INPUT (clica peça), 
                       UPDATE (valida, IA joga),
                       RENDER (desenha novo tabuleiro)"
   ```

### Parte B: State Management (15 min)

**SLIDE 4**

1. **Conceito (5 min)**
   ```
   Desenhe no quadro:
   
   STATE = Um container gigante com TODOS os dados
   
   ├─ Player pos: (5,5)
   ├─ Player HP: 85/100
   ├─ Enemies: [...]
   ├─ Map grid: [...]
   └─ Game status: PLAYING
   
   "Tudo que muda no jogo mora aqui."
   ```

2. **Como Muda (5 min)**
   ```
   Processo:
   1. Algo acontece (você se move)
   2. Novo estado é criado (Position muda)
   3. Game re-renderiza
   
   Você NUNCA modifica o estado diretamente.
   Sempre cria um novo estado.
   
   Por quê? Segurança + previsibilidade
   ```

3. **Biblioteca: Zustand (5 min)**
   ```
   "JavaScript tem várias opções:
    - Redux (complexo)
    - Context (fraco)
    - Zustand (Perfeito!) ← Usamos isto
   
   Zustand é como um container inteligente.
   Quando muda, tudo que usa ele atualiza."
   ```

### Parte C: Inteligência Artificial (15 min)

**SLIDE 5**

1. **Nível 1: Comportamento Simples (5 min)**
   ```
   Pseudocódigo bem simples:
   
   if (inimigo_vê_player) {
     if (inimigo_consegue_atacar) {
       inimigo.ataca();
     } else {
       inimigo.move_para_player();
     }
   }
   
   "Fragmento 01 usa isso.
    É tipo um soldado burrinho."
   ```

2. **Nível 2: Pathfinding (5 min)**
   ```
   Mostre algoritmo A* visualmente:
   
   Ponto A ──┐
            └→ Caminho ótimo → Ponto B
   
   "Game-UW calcula o melhor caminho
    entre inimigo e você.
    
    Leva em conta: paredes, distância, etc."
   ```

3. **Nível 3: Estratégia (5 min)**
   ```
   "Em jogos competitivos, IA muito avançada:
    - Considera contra-ataque
    - Protege aliados
    - Evita armadilhas
    - Adapta formação
   
   Isso é Inteligência Artificial de VERDADE."
   ```

### Parte D: Estratégia - Micro vs Macro (15 min)

**SLIDE 6**

1. **Micro: Decisões Pequenas (5 min)**
   ```
   Fragmento 01:
   "Agora eu ataco ou me movimento?"
   
   Game-UW:
   "Este Tanque vai esquerda ou direita?"
   
   → Decisões IMEDIATAS sobre UMA unidade
   ```

2. **Macro: Plano Geral (5 min)**
   ```
   Fragmento 01:
   "Qual é minha estratégia pra chegar à saída?"
   
   Game-UW:
   "Vou atacar frontal ou flanquear?"
   
   → Decisão ESTRATÉGICA sobre TUDO
   ```

3. **O Equilíbrio (5 min)**
   ```
   Histórias de Erro Comum:
   
   ❌ "Eu joguei só pensando em micro,
       mudava de ideia a cada turno,
       perdi porque não tinha plano"
   
   ❌ "Eu planejei bem mas executei mal,
       uma unidade se perdeu, perdi a formação"
   
   ✅ "Eu tinha plano + executei bem
       = VITÓRIA!"
   ```

### Parte E: Balanceamento & Teoria de Jogos (15 min)

**SLIDE 7**

1. **Matchups (5 min)**
   ```
   Mostre Game-UW:
   - Infantaria é rápida → bate Arqueiro
   - Arqueiro tem range → bate Tanque
   - Tanque é forte → bate Infantaria
   
   "É como Rock-Paper-Scissors.
    Nenhum é melhor. Contexto importa!"
   ```

2. **Balanceamento (5 min)**
   ```
   "Se Infantaria fosse muito barata,
    todo mundo usaria Infantarias.
    Não seria divertido.
    
    Designers ajustam:
    - Custo
    - HP
    - Dano
    - Velocidade
    
    Pra manter equilíbrio."
   ```

3. **Nash Equilibrium (5 min)**
   ```
   Conceito Simples:
   
   "Se todos fazem X, você faz Y pra vencer.
    Se todos fazem Y, você faz X.
    Nunca tem uma resposta PERFEITA.
   
    Por isso é divertido: adaptação ganha!"
   ```

### Dicas Didáticas para Esta Sessão
- ✅ Use quadro pra desenhar loops
- ✅ Mostre exemplos de jogos que todos conhecem
- ✅ Faça perguntas pra turma (engajamento)
- ✅ Não se aprofunde em código (ainda não)
- ✅ Tudo deve fazer sentido INTUITIVAMENTE

---

## ⏱️ TEMPO 75-105 MIN: Prática 1 - Fragmento 01

### Objetivo
Que entendam game loop JOGANDO.

### Setup (5 min)
```
1. Todos abrem o jogo
2. Explique os controles
3. Deixa todo mundo jogar um pouco
```

### Atividade: "Descubra Como Funciona"

**Desafio 1 (5 min):** 
```
"Jogue um pouco. Quando morrrer,
 responda: Quantas Infantarias 
 você pode eliminar em um turno?"

Resposta esperada: "Depende de quantos
                    tenho de energia e dano"
```

**Desafio 2 (5 min):**
```
"Há um inimigo a 3 casas de distância.
 Você consegue matá-lo antes dele atacar?
 
 Cálculo:
 ├─ Seu movimento: 1 turno
 ├─ Seu ataque: 1 turno
 ├─ Você mata em: 2 turnos
 ├─ Inimigo chega em: 1 turno
 └─ Resposta: Não, ele te ataca primeiro"
```

**Desafio 3 (5 min):**
```
"Vire o mapa mental: se VOCÊ fosse IA,
 qual seria sua estratégia?
 
 ├─ Ver player?
 ├─ Ir pra cima?
 ├─ Atacar se conseguir?"
```

### Discussão (5 min)
```
Perguntas:
1. "Como a IA sabia onde vocês estavam?" 
   Resposta: Campo de visão (FOV)

2. "Por que inimigo não vinha direto?"
   Resposta: Grid com paredes, calcula melhor caminho

3. "O jogo é jusто?"
   Resposta: Sim! Vocês tem 100 HP, 
            alguns inimigos têm só 15.
            Estratégia importa.
```

---

## ⏱️ TEMPO 105-120 MIN: Intervalo (15 min)

- Deixa todo mundo descansar
- Algum aluno com dúvida pode perguntar
- Aproveita pra resetar para próxima atividade

---

## ⏱️ TEMPO 120-160 MIN: Prática 2 - Game-UW

### Objetivo
Entender estratégia tática e teoria de jogos.

### Setup (5 min)
```
1. Explique que é "mais lento, mais pensado"
2. Mostre mapa hexagonal
3. Deixa explorar unidades
```

### Atividade: Construir Força

**Desafio 1 (5 min): Composição**
```
"Vocês têm 200 de ouro.
 Montem uma força que achem que ganha.
 
 (Deixa 5-10 minutos experimentando)
 
 Alguém quer compartilhar?"
```

**Desafio 2 (10 min): Batalha Real**
```
Vocês: Sua composição
Inimigo: 1 Tanque + 2 Infantarias

Estratégia:
├─ Ataque frontal?
├─ Flanquear?
└─ Defesa?

Jogue 2-3 turnos.
Gaghe ou perca, discuta por quê.
```

**Desafio 3 (10 min): Analise Tática**
```
"Qual foi seu erro (se perdeu)?
 
 Opções:
 ├─ Não tinha força bastante?
 ├─ Posicionamento errado?
 ├─ IA inimiga foi muito boa?
 └─ Falta de plano?"
```

### Discussão (10 min)
```
Perguntas:
1. "Qual unidade é mais importante?"
   Resposta: Depende contexto!

2. "Existe uma composição que sempre ganha?"
   Resposta: Não, há contador pra tudo

3. "Como vocês decidiram sua composição?"
   Resposta: [deixa explique] ← 
             Esta é discussão de design!
```

---

## ⏱️ TEMPO 160-175 MIN: Desafios ao Vivo

### Objetivo
Teste os aprendizados, crie competição.

### Desafio 1: "Micro Master" (5 min)

```
Fragmento 01:
"Quem consegue matar 3 inimigos em 1 minuto?

A melhor estratégia é:
├─ Ter mira
├─ Não desperdiçar energia
└─ Saber quando fugir"

(Deixa 3-4 alunos tentarem)
```

### Desafio 2: "Tactical Champion" (5 min)

```
Game-UW:
"Quem consegue vencer essa batalha 
 com MENOS de 5 turnos?

Requer:
├─ Composição boa
├─ Posicionamento ótimo
└─ Decisões rápidas"

(Deixa 2-3 tentar)
```

### Desafio 3: "Design Challenge" (5 min)

```
Pergunta criativa:

"Se vocês fossem designer de Game-UW,
 qual mudança fariam?
 
 - Aumentar custo de Tanque?
 - Diminuir HP de Infantaria?
 - Novo tipo de unidade?"

(Deixa ideias fluírem, divertido!)
```

---

## ⏱️ TEMPO 175-180 MIN: Encerramento

### Resumo (3 min)

```
"Hoje aprendemos:

✅ Qualquer jogo é INPUT → UPDATE → RENDER
✅ State Management organiza os dados
✅ IA pode ser simples ou complexa
✅ Estratégia = Micro + Macro
✅ Balanceamento é arte e ciência

Vocês agora ENTENDEM como jogos funcionam!"
```

### Próximos Passos (2 min)

```
"Se interessou, próximos passos:

1. Jogar mais (Fragmento 01 + Game-UW)
2. Fazer exercícios (Nível 1-3)
3. Tentar modificar o código
4. Seguir Mindpunk online

📚 Todo material está em:
   /docs e /exercicios"
```

### Certificado (0 min, opcional)

```
Se sua UNIP oferece certificado:
"Quem quiser certificado,
 por favor assine a lista."
```

---

## 💡 Tips Didáticos Gerais

### Manter Atenção
- ✅ Alterne entre teoria (slides) e prática (jogar)
- ✅ Faça perguntas pra turma
- ✅ Use humor
- ✅ Mostre jogos que eles conhecem

### Se Alguém se Perde
- ✅ Volte uma sessão
- ✅ Use analogias do dia-a-dia
- ✅ "Imagina como jogador, não como programador"

### Aproveitar Tempo
- ✅ Se está cansado: desafios ao vivo
- ✅ Se está adiantado: questionário design
- ✅ Se está atrasado: pule slides e vá pra prática

### Deixar Claro
- ✅ "Não precisa de experiência prévia"
- ✅ "Programação vem depois, hoje é diversão"
- ✅ "Errado é parte de aprender"

---

## 📝 Checklist do Professor

Antes da Workshop:
- [ ] Ambos os jogos testados e rodando
- [ ] Projetor funcionando
- [ ] Slides visíveis
- [ ] Lista de presença pronta
- [ ] Computadores dos alunos com ambiente setup

Durante:
- [ ] Tempo monitorado (use relógio)
- [ ] Todas atividades feitas
- [ ] Fotos/vídeos se permitido (marketing!)
- [ ] Dúvidas anotadas

Depois:
- [ ] Feedback dos alunos (formulário rápido)
- [ ] Fotos compartilhadas
- [ ] Relatório enviado pra UNIP

---

**Boa sorte! Divirta-se! 🎮💜**
