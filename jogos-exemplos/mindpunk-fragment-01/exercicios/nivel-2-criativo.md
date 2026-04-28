# 🎨 Exercícios Nível 2 - Fragmento 01
## Criativo: Modifique e Estenda o Jogo

> Você entende como o jogo funciona. Agora vamos CRIAR novas coisas!

---

## 🎯 Objetivo Deste Nível

- [ ] Implementar novas mecânicas (itens, habilidades especiais)
- [ ] Modificar a inteligência artificial
- [ ] Criar variações do jogo
- [ ] Entender como cada mudança afeta o gameplay

---

## 🎮 Exercício 2.1: Nova Mecânica - Sistema de Armas

### Tarefa: Criar Tipos Diferentes de Armas

Seu jogo atualmente tem um dano fixo: `BASE_PLAYER_DMG = 25`

**Desafio:** Criar 3 tipos de armas com características diferentes:

```
ARMA 1: Espada (SWORD)
├─ Dano Base: 30
├─ Custo de Energia: 15 (igual ao ataque normal)
├─ Bônus: +20% ao acertar
└─ Descrição: "Balanceada, boa para tudo"

ARMA 2: Machado (AXE)
├─ Dano Base: 50
├─ Custo de Energia: 20 (mais caro)
├─ Bônus: Crítico 25% chance
└─ Descrição: "Poderosa, mas custa mais"

ARMA 3: Adaga (DAGGER)
├─ Dano Base: 15
├─ Custo de Energia: 10 (mais barata)
├─ Bônus: -1 de custo de movimento
└─ Descrição: "Rápida, permite mais movimento"
```

### Tarefas:

1. **Visualizar:** Desenhe em um diagrama como você descreveria cada arma no código
   ```
   // Sua resposta aqui (pseudocódigo ou estrutura)
   ```

2. **Implementar:** Escreva a estrutura de dados para guardar armas
   ```typescript
   // Como você guardaria isso?
   // (não precisa ser TypeScript perfeito, só a ideia)
   ```

3. **Integrar:** Onde no código você adicionaria o sistema de armas?
   - [ ] Em `useGameStore.ts` no estado inicial?
   - [ ] Em uma função separada `weaponSystem.ts`?
   - [ ] Outra lugar?

4. **Testar:** Imagine este cenário:
   ```
   Você tem uma ADAGA e 50 de energia
   Um inimigo tem 60 HP e está a 1 célula
   
   Pergunta: Você consegue matar o inimigo neste turno?
   Cálculo: 
   ├─ Ataque 1: Adaga (15 dano) → Inimigo fica com 45 HP
   ├─ Movimento: Custo 7 (em vez de 8 com adaga)
   ├─ Energia restante: 50 - 15 - 7 = 28
   └─ Pode atacar novamente? ___
   ```

---

## ⚡ Exercício 2.2: Nova Mecânica - Sistema de Mana/Habilidades

### Tarefa: Criar Habilidades Especiais

O jogador deveria poder usar habilidades poderosas. Exemplo:

```
HABILIDADE 1: ATAQUE DUPLO (Double Strike)
├─ Custo: 30 de energia + 20 de "Mana"
├─ Dano: 2 ataques de 20 dano cada = 40 dano total
├─ Descrição: "Ataca rápido duas vezes"
└─ Cooldown: 2 turnos antes de usar novamente

HABILIDADE 2: EXPLOSÃO (Blast)
├─ Custo: 50 de energia + 50 de Mana
├─ Dano: 80 dano em área (afeta todos inimigos próximos)
├─ Descrição: "Explode matando tudo perto"
└─ Cooldown: 3 turnos

HABILIDADE 3: DEFESA TOTAL (Shield)
├─ Custo: 25 de energia + 15 de Mana
├─ Efeito: -50% de dano recebido por 2 turnos
├─ Descrição: "Fica invulnerável"
└─ Cooldown: 1 turno
```

### Tarefas:

1. **Modelar:** Escreva a estrutura de uma habilidade
   ```typescript
   // Sua resposta
   ```

2. **Decisão:** Qual habilidade é mais útil e por quê?
   ```
   Resposta: ___
   
   Por quê (2-3 linhas):
   ___________________________________
   ```

3. **Balanceamento:** Se você pudesse criar uma 4ª habilidade, qual seria?
   ```
   Nome: ___
   Custo Energia: ___
   Custo Mana: ___
   Efeito: ___
   Cooldown: ___
   ```

4. **Implementação:** Onde você colocaria o sistema de Mana?
   - [ ] Como propriedade do jogador (`player.mana`)
   - [ ] Em um sistema separado (`manaSystem.ts`)
   - [ ] Como um recurso como energia
   - [ ] Outra ideia?

---

## 🤖 Exercício 2.3: Modificar IA - Inimigos Mais Inteligentes

### Tarefa: Tornar a IA Mais Estratégica

Atualmente a IA provavelmente:
- Vê o player
- Ataca se conseguir

**Desafio:** Fazer a IA tomar decisões melhores:

```
COMPORTAMENTO 1: FUGA (Flee)
├─ Quando: Inimigo com < 30% HP
├─ O quê: Se afasta do player
└─ Por quê: Inimigos fracos não atacam - fogem!

COMPORTAMENTO 2: GRUPO (Pack)
├─ Quando: Tem outro inimigo perto
├─ O quê: Ataca junto com outro inimigo
└─ Por quê: Dois é melhor que um

COMPORTAMENTO 3: EMBOSCADA (Ambush)
├─ Quando: Player não pode ver ele (FOV)
├─ O quê: Se posiciona atrás do player
└─ Por quê: Pega player desprevenido

COMPORTAMENTO 4: PROTEÇÃO (Protect)
├─ Quando: Outro inimigo vai morrer
├─ O quê: Se coloca na frente para bloquear
└─ Por quê: Salva o aliado
```

### Tarefas:

1. **Escolher:** Qual comportamento é mais fácil de implementar?
   ```
   Resposta: ___
   
   Razão: _________________________
   ```

2. **Pseudocódigo:** Escreva em português como implementar FUGA:
   ```
   Se inimigo.hp < inimigo.maxHp * 0.3:
     ├─ Calcular distância até player
     ├─ Se distância < 5:
     │  └─ Mover pra longe
     └─ Senão:
        └─ Ignorar
   ```

3. **Impacto:** Como isso mudaria o jogo?
   ```
   Positivo (mais realista):
   ├─ ___
   └─ ___
   
   Negativo (mais fácil/difícil):
   ├─ ___
   └─ ___
   ```

4. **Teste:** Imagina este cenário:
   ```
   Você: 100 HP, posição (5,5)
   Inimigo 1: 10 HP, posição (6,5) - COM FUGA ATIVADA
   Inimigo 2: 50 HP, posição (7,6)
   
   Você ataca Inimigo 1 (vai morrer no próximo turno)
   
   Pergunta: O que Inimigo 1 faz?
   A) Contra-ataca (sem medo)
   B) Foge pra longe
   C) Chama Inimigo 2 pra ajudar
   
   Resposta: ___
   ```

---

## 🎯 Exercício 2.4: Criar uma Variação do Jogo

### Tarefa: Modo "Hardcore" Diferente

O jogo tem `HARDCORE_LEVEL` que aumenta dificuldade.

**Desafio:** Criar um MODE diferente completamente:

```
MODO NORMAL (original)
├─ Objetivo: Chegar à saída
├─ Inimigos: Aparecem aleatoriamente
├─ Items: Ajudam você
└─ Vitória: Chegar ao fim vivo

NOVO MODO: PROTEÇÃO (Protect Mode)
├─ Objetivo: PROTEGER um NPC (non-player character)
├─ Mecânica: Um NPC amigável precisa chegar à saída
├─ Inimigos: Tentam atacar o NPC
├─ Items: Mesmo do modo normal
├─ Desafio: Você tem que defendê-lo
└─ Vitória: NPC chega vivo à saída
```

### Tarefas:

1. **Desenhar:** Como mudaria a tela?
   ```
   MODO NORMAL          MODO PROTEÇÃO
   
   [     MAPA        ]  [     MAPA        ]
   [      P E        ]  [     NPC P E     ]
   [     E   E       ]  [      E E        ]
   [                 ]  [     E E E       ]
   [       EXIT      ]  [       EXIT      ]
   ```

2. **Mecânicas:** Que mudanças preciso no código?
   ```
   - Novo objeto NPC no estado?
   - Novo tipo de inimigo (vai atacar NPC)?
   - Nova condição de vitória?
   - Outro?
   ```

3. **Desafio:** Escreva uma estratégia para ganhar:
   ```
   Turno 1-2: ___
   Turno 3-5: ___
   Fim do jogo: ___
   ```

4. **Dificuldade:** Como você aumentaria a dificuldade?
   ```
   ├─ Mais inimigos?
   ├─ NPC mais lento?
   ├─ Mapa maior?
   └─ Sua ideia: ___
   ```

---

## ✅ Checklist: Nível 2 Completo

- [ ] Entendi sistemas de armas e como estruturar
- [ ] Compreendi como adicionar habilidades especiais
- [ ] Consegui pensar em IA mais complexa
- [ ] Criei uma variação completamente nova
- [ ] Consegui justificar minhas decisões de design
- [ ] Entendo como cada mudança afeta o gameplay
- [ ] Testei meus conceitos em cenários

---

## 💡 Bônus: Desafio Extra

Se completou tudo e quer mais:

**"Combine Tudo"**
- Crie um novo modo com: Armas diferentes + Habilidades + IA Inteligente + Novo Objetivo
- Escreva como seria jogar

Exemplo:
```
MODO FINAL BOSS

Objetivo: Derrotar um BOSS (inimigo muito forte)

Sistema de Armas:
  ├─ Espada: dano médio, rápido
  ├─ Machado: dano alto, lento
  └─ Adaga: dano baixo, muito rápido

Habilidades:
  ├─ Ataque Duplo
  ├─ Explosão
  └─ Defesa

IA do Boss:
  ├─ Comportamento 1: Ataque frontal quando cheio de HP
  ├─ Comportamento 2: Fuga quando danificado
  └─ Comportamento 3: Usa "super-ataque" quando < 25% HP

Como você venceria? ___
```

---

## 🚀 Próximo Nível

Parabéns! Você agora entende:
- ✅ Como estruturar novos sistemas
- ✅ Como estender a IA
- ✅ Como criar variações criativas
- ✅ Como considerar impacto de mudanças

Vá para **`nivel-3-avancado.md`** para implementar o que aprendeu!
