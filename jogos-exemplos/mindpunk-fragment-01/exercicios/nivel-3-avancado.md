# 💻 Exercícios Nível 3 - Fragmento 01
## Avançado: Implemente No Código

> Agora vamos realmente CODIFICAR! Pegue o que aprendeu e coloque em prática.

---

## 🎯 Objetivo Deste Nível

- [ ] Implementar código funcional baseado em conceitos
- [ ] Entender trade-offs de design
- [ ] Debugar e testar seu próprio código
- [ ] Contribuir para o projeto

---

## 📝 Exercício 3.1: Implemente Sistema de Armas

### Tarefa: Adicione Armas ao Jogo

Pegue o conceito do Nível 2 e implemente:

#### Passo 1: Estrutura de Dados

Crie um tipo para arma (em TypeScript):

```typescript
// arquivo: src/types/Weapon.ts
// Sua tarefa: Escreva o tipo

type WeaponType = 'sword' | 'axe' | 'dagger';

interface Weapon {
  // Complete isto:
  // - tipo (sword/axe/dagger)
  // - nome
  // - dano
  // - custo de energia
  // - bônus (crítico %)
  // - descrição
}

// Defina 3 armas
const WEAPONS: Record<WeaponType, Weapon> = {
  sword: {
    // Complete...
  },
  // Complete axe e dagger
}
```

**Esperado:**
- ✅ Tipo `Weapon` bem definido
- ✅ Todas as propriedades necessárias
- ✅ 3 armas diferentes balanceadas

#### Passo 2: Integrar com Store

Adicione arma ao player:

```typescript
// Em useGameStore.ts

player: {
  // ... HP, XP, etc
  currentWeapon: 'sword' as WeaponType, // NOVO
}

// Adicione ação para trocar arma
changeWeapon: (weaponType: WeaponType) => {
  set((state) => {
    // Seu código aqui
  });
}

// Modifique o dano baseado na arma
attackEnemy: (enemyId: string) => {
  set((state) => {
    const weapon = WEAPONS[state.player.currentWeapon];
    const baseDamage = weapon.damage; // Usar arma em vez de constante
    // ... resto do código
  });
}
```

**Esperado:**
- ✅ Estado tem `currentWeapon`
- ✅ Ação `changeWeapon` funciona
- ✅ Dano vem da arma, não da constante

#### Passo 3: Testar

Escreva testes (em português, pseudocódigo ok):

```typescript
// Teste 1: Arma troca dano
const espada = WEAPONS.sword;
const machado = WEAPONS.axe;
assert(machado.damage > espada.damage, "Machado deve fazer mais dano");

// Teste 2: Troca de arma funciona
// (chama changeWeapon, verifica se mudou)
// Sua resposta: ___

// Teste 3: Custo de energia varia
// (adaga custa menos que espada)
// Sua resposta: ___
```

**Esperado:**
- ✅ Testes validam comportamento
- ✅ Todos passam
- ✅ Código está balanceado

---

## ⚡ Exercício 3.2: Implemente Habilidades Especiais

### Tarefa: Adicione Sistema de Mana e Habilidades

#### Passo 1: Extensão do Estado

```typescript
// Adicione ao player
player: {
  // ... existente
  mana: 100,        // NOVO
  maxMana: 100,     // NOVO
  cooldowns: {      // NOVO - controla qual habilidade pode usar
    'double-strike': 0,
    'blast': 0,
    'shield': 0,
  }
}

// Novo estado
activeShield: boolean = false,  // NOVO - player tem escudo?
shieldTurnsLeft: number = 0,    // NOVO - quantos turnos dura?
```

#### Passo 2: Defina Habilidades

```typescript
// arquivo: src/config/abilities.ts
// Sua tarefa: Implemente

interface Ability {
  id: string;
  name: string;
  energyCost: number;
  manaCost: number;
  effect: (state: GameState) => GameState; // Função que aplica o efeito
  cooldown: number;
  description: string;
}

const ABILITIES: Record<string, Ability> = {
  'double-strike': {
    id: 'double-strike',
    name: 'Ataque Duplo',
    energyCost: 30,
    manaCost: 20,
    cooldown: 2,
    description: 'Ataca rápido duas vezes',
    effect: (state) => {
      // Sua lógica: calcula 2 ataques, aplica dano
      // Dificuldade: qual inimigo? o mais perto?
      return newState;
    }
  },
  // Complete 'blast' e 'shield'
}
```

**Esperado:**
- ✅ Interface `Ability` bem definida
- ✅ 3 habilidades implementadas
- ✅ Cada uma tem `effect` que altera o estado

#### Passo 3: Integre com Store

```typescript
// Em useGameStore.ts

useAbility: (abilityId: string) => {
  set((state) => {
    const ability = ABILITIES[abilityId];
    
    // Validações:
    // 1. Tem energia suficiente?
    // 2. Tem mana suficiente?
    // 3. Cooldown já passou?
    // 4. Se tudo ok: aplicar efeito
    
    // Sua resposta: (pseudocódigo)
    // if (player.energy >= ability.energyCost &&
    //     player.mana >= ability.manaCost &&
    //     cooldowns[abilityId] === 0) {
    //   // Aplicar
    // }
    
    return newState;
  });
}
```

**Esperado:**
- ✅ Validações funcionam
- ✅ Cooldown é decrementado
- ✅ Energia/Mana gastam
- ✅ Efeito é aplicado corretamente

---

## 🤖 Exercício 3.3: Melhore a IA

### Tarefa: Implemente Comportamento de Fuga

No arquivo `logic/ai.ts`, adicione lógica de fuga:

#### Passo 1: Detect Status

```typescript
// Função nova: shouldFlee
function shouldFlee(enemy: Enemy): boolean {
  // Se inimigo tem menos de 30% HP, foge
  const healthPercent = enemy.hp / enemy.maxHp;
  return healthPercent < 0.3;
}
```

#### Passo 2: Calcular Direção Oposta

```typescript
// Função nova: calculateFleeDirection
function calculateFleeDirection(
  enemyPos: Position,
  playerPos: Position
): Direction {
  // Calcule direção OPOSTA ao player
  // Se player está em (5,5) e inimigo em (3,3)
  // Inimigo deve ir pra (1,1)
  
  // Sua resposta:
  const dx = enemyPos.x - playerPos.x;
  const dy = enemyPos.y - playerPos.y;
  
  // Retorna direção
  return // ???
}
```

#### Passo 3: Integre no processAI

```typescript
// Em processEnemiesTurn
enemies.forEach(enemy => {
  if (shouldFlee(enemy)) {
    // Fugir em vez de atacar
    const fleeDir = calculateFleeDirection(enemy.pos, player.pos);
    // Mover inimigo
  } else {
    // Lógica normal: atacar se conseguir
  }
});
```

**Esperado:**
- ✅ Inimigos com baixo HP fogem
- ✅ Fogem na direção oposta
- ✅ Ainda validam movimento (paredes)

#### Passo 4: Teste

```
Cenário:
  Você: (5,5) com 50 HP
  Inimigo: (6,5) com 8 HP (máx 25)
  
Teste:
  ├─ shouldFlee(inimigo) → true (8/25 = 32% < 30%? não...)
  └─ Ajuste: 8/25 = 0.32 = 32% > 30% → false!
  
Pergunta: Qual é o threshold correto para 30%?
Resposta: maxHp * 0.3 = 25 * 0.3 = 7.5
```

---

## 🎮 Exercício 3.4: Implemente Modo Novo

### Tarefa: Adicione "Modo Desafio" ao Jogo

#### Passo 1: Crie Tipo de Modo

```typescript
// Em types/GameMode.ts

type GameMode = 'normal' | 'hardcore' | 'challenge';

interface ChallengeMode {
  name: string;
  description: string;
  rules: string[];
  rewards: {
    xpMultiplier: number;
    scoreBonusMultiplier: number;
  }
}

const CHALLENGE_MODES: Record<string, ChallengeMode> = {
  'one-hit': {
    name: 'One Hit',
    description: 'Você morre com um ataque',
    rules: [
      'Player começa com 1 HP',
      'Inimigos têm dano 5x maior',
    ],
    rewards: {
      xpMultiplier: 10, // 10x XP se ganhar!
      scoreBonusMultiplier: 5,
    }
  },
  // Crie 'speed-run': 10 turnos máximo para vencer
  // Sua resposta...
}
```

#### Passo 2: Integre no Store

```typescript
// Em useGameStore

mode: 'normal' as GameMode,

setGameMode: (newMode: GameMode) => {
  set((state) => {
    // Se mudando pra challenge, aplicar regras
    if (newMode === 'challenge') {
      // Ajustar player.hp
      // Ajustar inimigo.damage
      // etc
    }
    return { ...state, mode: newMode };
  });
}
```

#### Passo 3: Teste Balanceamento

```
Modo Normal:
├─ Player 100 HP
├─ Inimigo 25 HP, 10 dano
├─ Você pode perder (~2 hits)

Modo "One Hit":
├─ Player 1 HP
├─ Inimigo 25 HP, 50 dano
├─ Você precisa ganhar de primeira!

Perguntas:
1. Qual taxa de vitória esperada no "One Hit"? (%)
2. Vale a pena jogar pelo 10x XP?
3. Como equilibrar melhor?
```

---

## 🔧 Exercício 3.5: Integração Completa

### Tarefa: Tudo Junto

Implemente uma feature COMPLETA do zero ao fim:

#### Escolha 1: Novo Sistema Simples

```
OPÇÃO A: Sistema de FOME
├─ Player perde 1 energia a cada turno (comeu pouco)
├─ Encontra comida no mapa (item novo)
├─ Se energia chegar 0, perde
└─ Difícil? Nível aumenta taxa de fome

OPÇÃO B: Sistema de TOXINA
├─ Inimigos especiais deixam toxina
├─ Você envenenado perde 5 HP/turno
├─ Tem antídoto no mapa
└─ Se alcançar -100 HP total, morre
```

#### Passos:

1. **Especificação:** Descreva exatamente o que você vai fazer
2. **Estrutura:** Escreva tipos/interfaces
3. **Lógica:** Implemente funções principais
4. **Testes:** Valide que funciona
5. **Integração:** Coloque no store e game loop

**Esperado:**
- ✅ Feature completa e funcional
- ✅ Balanceada e não quebra o jogo
- ✅ Código bem estruturado
- ✅ Testes passando

---

## ✅ Checklist: Nível 3 Completo

- [ ] Implementei sistema de armas com testes
- [ ] Implemente sistema de habilidades e mana
- [ ] Melhorei IA com lógica de fuga
- [ ] Criei novo modo de jogo
- [ ] Integrei uma feature completa nova
- [ ] Testei tudo e funciona
- [ ] Código está limpo e comentado
- [ ] Entendo cada parte que implementei

---

## 🎓 Reflexão Final

Responda:

1. **O maior desafio foi:** _______________
   
   **Porque:** _______________

2. **O que aprendeu sobre game design:** 
   _______________

3. **Se pudesse adicionar uma feature mais, seria:** 
   _______________

4. **Em uma escala 1-10, você consegue:**
   - [ ] Ler e entender código de jogo? __/10
   - [ ] Modificar comportamentos? __/10
   - [ ] Criar features novas? __/10
   - [ ] Debugar problemas? __/10

---

## 🚀 O Que Vem Depois?

Parabéns! Você agora é capable de:
- ✅ Entender game loops e state management
- ✅ Implementar novos sistemas
- ✅ Melhorar IA
- ✅ Testar seu código
- ✅ Balancear mecânicas

**Próximos passos:**
1. Contribua para o projeto (push seu código!)
2. Crie seu próprio pequeno jogo
3. Combine conceitos de ambos (Fragmento1 + Game-UW)
4. Estude o código Rust do `rust-game-one`

---

**Obrigado por aprender com Mindpunk! 🎮💜**
