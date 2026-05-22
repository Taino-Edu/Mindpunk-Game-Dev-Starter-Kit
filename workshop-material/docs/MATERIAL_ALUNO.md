# 📘 Material do Aluno - Workshop Mindpunk
## Para Levar e Estudar em Casa

---

# 🎮 Mindpunk Game Dev Workshop
## Material do Aluno - UNIP

**Workshop:** [DATA/HORA]  
**Professor:** Taino Educador  
**Contato:** [EMAIL]

---

# 📚 CONCEITOS PRINCIPAIS

## 1️⃣ O Loop do Jogo

### O que é?
Todo jogo, do mais simples ao mais complexo, segue este padrão:

```
1. INPUT (Ouve o que você faz)
   ↓
2. UPDATE (Processa e calcula)
   ↓
3. RENDER (Desenha na tela)
   ↓
[volta ao passo 1]

Velocidade: 60 vezes por segundo (60 FPS)
```

### Exemplos Reais

**Mario Bros:**
```
INPUT:  Você aperta botão RIGHT
UPDATE: Mario acelera, verifica colisão
RENDER: Desenha Mario 5 pixels pra direita
```

**Chess.com:**
```
INPUT:  Você clica numa peça
UPDATE: Valida movimento, IA calcula resposta
RENDER: Desenha novo tabuleiro
```

**Seu Videoclipe Favorito:**
```
INPUT:  Você aperta PLAY
UPDATE: Toca música (44.1kHz por segundo)
RENDER: Visualização anima com ritmo
```

### Por que Importa?
Entender o loop é entender QUALQUER jogo.

---

## 2️⃣ State Management

### O que é?
É o "cérebro" do jogo. Um container gigante que guarda TODOS os dados:

```
STATE (O Coração do Jogo)
├─ Player
│  ├─ Posição: (5,5)
│  ├─ HP: 85/100
│  ├─ Energia: 30/50
│  └─ Inventário: [Poção, Espada]
│
├─ Enemies
│  ├─ Inimigo 1: (7,3) HP: 15/25
│  └─ Inimigo 2: (2,8) HP: 20/20
│
├─ Map
│  └─ Grid com 64 células (8x8)
│
└─ Game Status
   └─ PLAYING / WON / LOST
```

### Como Muda?
```
Você se move:
├─ Cria novo STATE com posição atualizada
├─ Game "reage" (IA se move, calcula dano)
├─ Cria novo STATE com mudanças
└─ Desenha tudo novamente
```

### Por que é Importante?
- ✅ Tudo organizado em um lugar
- ✅ Fácil de debugar (sabe exatamente qual é o estado)
- ✅ Seguro (não modificas direto, sempre crias novo)
- ✅ Previsível (mesma entrada = mesmo resultado)

### Bibliotecas Populares
- **Redux** - Complexo, mas poderoso
- **Context** - Simples, mas fraco
- **Zustand** - Perfeito equilíbrio ← Mindpunk usa

---

## 3️⃣ Inteligência Artificial (IA)

### Nível 1: Comportamento Simples

```python
if inimigo_vê_player:
  if inimigo_consegue_atacar:
    inimigo.ataca()
  else:
    inimigo.move_para_player()
```

**Fragmento 01 usa isto:**
- Inimigo examina grid
- Se vê você:
  - Se consegue atacar (distance <= 1) → ataca
  - Se não consegue → se move pra perto
- Se não vê → patrulha aleatório

**Resultado:** Inimigos "burros mas funcionais"

---

### Nível 2: Pathfinding (A*)

**O Problema:**
```
Você está aqui:    Inimigo quer chegar aqui:
    S                      E
                           
    #####                  ← Parede no caminho!
```

**A Solução (Algoritmo A*):**
```
1. Inimigo testa vários caminhos
2. Escolhe o mais curto que evita paredes
3. Segue esse caminho

Resultado:
    S  .  .  .  E
    # #  .  . 
       #  .
          #  .
             E
```

**Game-UW usa isto:** Unidades encontram caminho ótimo.

---

### Nível 3: Estratégia

Jogos de topo (Dota, Chess) têm IA que:
- Calcula vários turnos adiante
- Considera contra-ataque
- Protege aliados
- Adapta formação
- Gerencia recursos

**Resultado:** IA "inteligente de verdade"

---

## 4️⃣ Estratégia: Micro vs Macro

### Micro: Decisões Pequenas

**Pergunta MICRO:**
"O que eu faço AGORA?"

**Fragmento 01 Micro:**
```
├─ Devo atacar ou mover?
├─ Qual direção vou?
└─ Tenho energia?
```

**Game-UW Micro:**
```
├─ Meu Tanque vai esquerda ou direita?
├─ Meu Arqueiro atira agora ou recua?
└─ Pesso mover 2 casas ou 3?
```

---

### Macro: Estratégia Geral

**Pergunta MACRO:**
"Qual é meu PLANO para vencer?"

**Fragmento 01 Macro:**
```
├─ Vou enfrentar inimigos ou evitar?
├─ Qual é meu caminho pra saída?
└─ Quanto de HP posso perder?
```

**Game-UW Macro:**
```
├─ Ataque frontal, flanquear, ou defender?
├─ Qual é meu inimigo número 1?
└─ Como divido minha força?
```

---

### O Equilíbrio

```
❌ Bons MICROS sem MACRO
   └─ "Eu sempre atacava o inimigo mais perto"
      Resultado: Desorganizado → DERROTA

❌ Boa MACRO sem MICROS bons
   └─ "Meu plano era bom mas errei a execução"
      Resultado: Plano não funcionou → DERROTA

✅ MICROS ÓTIMOS + MACRO EXCELENTE
   └─ "Planejei bem E executei bem"
      Resultado: Coordenação perfeita → VITÓRIA!
```

---

## 5️⃣ Balanceamento & Teoria de Jogos

### Rock-Paper-Scissors (Game-UW)

```
Infantaria ──→ Arqueiro
(rápida)      (longo alcance)
 ↗ ↙
  Tanque
(defesa)

QUEM GANHA QUEM:
├─ Infantaria vence Arqueiro
│  (alcança antes Arqueiro atirar)
├─ Arqueiro vence Tanque
│  (ignora defesa com range)
└─ Tanque vence Infantaria
   (muita defesa, pouco dano)

= Balanceado!
```

### Nash Equilibrium

**Conceito Simples:**
```
Um estado onde NINGUÉM quer mudar de estratégia.
```

**Exemplo Game-UW:**
```
Passo 1: Todos usam Build A
Passo 2: Você vira pra Build B (bate Build A)
Passo 3: Inimigo vira pra Build C (bate Build B)
Passo 4: Volta pro Passo 1...

CONCLUSÃO: Não existe "Build Perfeito"
MORAL: Adaptação é tudo!
```

### Por que Jogos Requerem Balanceamento?

```
❌ Infantaria SUPER barata → Todos usam
   Resultado: Jogo monótono, não divertido

✅ Preço justo + HP/Dano ajustado
   Resultado: Múltiplas estratégias possíveis
   Conclusão: Jogo divertido!
```

---

# 🎮 GUIA PRÁTICO

## Fragmento 01: Roguelike Grid

### Controles
```
SETAS/WASD: Mover
ESPAÇO:     Aguardar
ENTER:      Confirmar
Q:          Sair
```

### Objetivo
Chegar até a SAÍDA (⬛️) sem morrer.

### Mecânicas Principais
```
VOCÊ:
├─ Começa com 100 HP
├─ Começa com 50 energia
├─ Custa 8 energia pra mover
├─ Custa 15 energia pra atacar
└─ Faz 25 de dano por ataque

INIMIGOS:
├─ Diferentes tipos (Drone, Runner, Tank, Generator)
├─ Cada um tem HP/dano diferente
├─ Se veem você, atacam ou perseguem
└─ Morrem se HP chegar 0

ITEMS:
├─ Poções (curam HP)
├─ Energia (regeneram energia)
└─ Raros em níveis altos
```

### Estratégia Básica
```
Nível 1:
├─ Evite inimigos se puder
├─ Conserve energia
└─ Procure saída

Nível 5+:
├─ Inimigos são forte, não dá pra evitar
├─ Posicione bem (paredes ajudam)
├─ Use terrain advantage
└─ Planejar rota é importante
```

---

## Game-UW: Tactical Warfare

### Controles
```
CLIQUE: Seleciona unidade
CLIQUE+DRAG: Move unidade
CLIQUE INIMIGO: Ataca
END TURN:   Termina turno
```

### Objetivo
Eliminar todos os inimigos.

### Mecânicas Principais
```
UNIDADES:

Infantaria
├─ HP: 20 | ATK: 8 | DEF: 2
├─ MOV: 3 | RANGE: 1
├─ Custo: 30 ouro
└─ Fraco/Rápido/Barato

Tanque
├─ HP: 80 | ATK: 5 | DEF: 8
├─ MOV: 2 | RANGE: 1
├─ Custo: 80 ouro
└─ Forte/Lento/Caro

Arqueiro
├─ HP: 15 | ATK: 12 | DEF: 1
├─ MOV: 3 | RANGE: 4
├─ Custo: 50 ouro
└─ Frágil/Rápido/Range

MAPA:
├─ Hexagonal (6 vizinhos)
├─ Distância calculada em hexágonos
├─ Paredes bloqueiam caminho
├─ Terreno afeta moviment
```

### Estratégia Básica

**Composição de Força (200 ouro):**
```
Opção A: Equilibrada (Recomendada)
├─ 2 Infantarias (60)
├─ 1 Tanque (80)
├─ 1 Arqueiro (50)
└─ Total: 190

Opção B: Swarm (Números)
├─ 6 Infantarias (180)
└─ Total: 180

Opção C: Arqueiros (Range)
├─ 4 Arqueiros (200)
└─ Total: 200
```

**Posicionamento:**
```
Tanque:   Frente (toma dano)
Infantaria: Lado (apoia)
Arqueiro:  Trás (atira de longe)

Resultado: Formação defensiva forte!
```

---

# 🎯 EXERCÍCIOS PRÁTICOS

## Exercício 1: Conta Dano
```
Cenário:
├─ Sua Infantaria (ATK 8)
├─ Inimigo Infantaria (DEF 2)

Pergunta: Quanto de dano você faz?
Fórmula: Dano = ATK - (DEF * 0.5)
Cálculo: 8 - (2 * 0.5) = 8 - 1 = 7 dano

Resposta: 7 de dano
```

## Exercício 2: Distância Hexagonal
```
Sua unidade: (0,0)
Inimigo:     (2,1)

Fórmula: (|q1-q2| + |r1-r2| + |q1+r1-q2-r2|) / 2

Cálculo: (2 + 1 + |0+0-2-1|) / 2
       = (2 + 1 + 3) / 2
       = 6 / 2
       = 3 hexágonos

Resposta: 3 movimentos de distância
```

## Exercício 3: Quem Ganha?

```
Seu Tanque (HP 80) vs Inimigo Infantaria (HP 20)

Seu dano: 5 - (2*0.5) = 4 por turno
Dano inimigo: 8 - (8*0.5) = 4 por turno

Turnos até matar inimigo: 20 / 4 = 5 turnos
Turnos até você morrer: 80 / 4 = 20 turnos

Resposta: Você ganha (5 < 20)
```

---

# 📖 CONCEITOS A ENTENDER

```
□ Game Loop (INPUT → UPDATE → RENDER)
□ State Management (um container com tudo)
□ IA Simples (Ver → Atacar)
□ IA Complexa (Pathfinding, Estratégia)
□ Micro (ações pequenas) vs Macro (plano geral)
□ Balanceamento (nenhum é melhor que outro)
□ Teoria de Jogos (Nash Equilibrium, Matchups)
```

---

# 📚 RECURSOS PARA CONTINUAR

```
📁 Pasta da Workshop:
├─ /docs       → Conceitos detalhados
├─ /exercicios → Mais exercícios (Nível 1-3)
├─ jogos       → Código fonte dos jogos
└─ /workshop   → Este material

🌐 Online:
├─ GitHub: mindpunk
├─ Discord: [CONVITE]
└─ Instagram: @mindpunklab

💻 Se quer programar:
├─ Leia /docs primeiro
├─ Faça exercícios Nível 1-3
├─ Modifique o código
├─ Pergunte dúvidas!
```

---

# ❓ DÚVIDAS FREQUENTES

**P: Preciso saber programação?**
R: Não! Os exercícios Nível 1 não usam código. Nível 2-3 usa um pouco.

**P: Qual linguagem vocês usam?**
R: TypeScript (JavaScript com tipos). Fragmento 01 em React, Game-UW em Express.

**P: Quanto tempo leva pra fazer um jogo?**
R: Fragmento 01 levou ~3 dias. Game-UW levou ~2 semanas. Depende da complexidade.

**P: Posso fazer alterações nos jogos?**
R: Sim! Temos exercícios exatamente pra isso. Modifique e aprenda.

**P: Qual jogo é mais difícil?**
R: Game-UW requer mais estratégia. Fragmento 01 é mais rápido.

**P: Como começo se quero fazer MEU jogo?**
R: Comece com Nível 1 exercícios. Depois vá pra Nível 2-3. Estude código.

---

# ✅ Checklist Pós-Workshop

- [ ] Entendo o conceito de game loop
- [ ] Consegui jogar ambos os jogos
- [ ] Fiz pelo menos um exercício
- [ ] Entendo micro vs macro
- [ ] Entendo balanceamento básico
- [ ] Tenho pasta com recursos
- [ ] Tenho contato do professor/comunidade

---

# 🎓 Certificado

Você completou:
- ✅ Workshop Mindpunk (3 horas)
- ✅ Entendimento de game loops
- ✅ Prática em 2 estilos de jogo
- ✅ Exercícios práticos

**Parabéns! Você agora entende como jogos funcionam! 🎮💜**

---

**Data da Workshop:** [DATA]  
**Assinado por:** Taino Educador  
**Email:** esusxd0@gmail.com

_Para mais informações, acompanhe Mindpunk online!_
