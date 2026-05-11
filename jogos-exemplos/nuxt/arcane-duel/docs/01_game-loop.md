# 🔄 Arcane Duel — Loop de Turnos

> Como o tempo avança num jogo de cartas sem um `requestAnimationFrame`?

---

## O Problema: Jogos Sem Frame Loop

A maioria dos jogos usa um loop contínuo:

```
while (true) {
  handleInput()
  updateGameState()
  render()
}
```

**Arcane Duel não faz isso.** Como é um jogo de cartas turno-a-turno, o mundo só avança quando o jogador (ou a IA) toma uma ação. Isso se chama **Event-Driven Game Loop** — o jogo "dorme" até que algo aconteça.

---

## A Solução: Máquina de Estados por Fases

O jogo é controlado por um campo `phase` no estado reativo:

```typescript
type Phase = 'start' | 'player_turn' | 'ai_thinking' | 'game_over'
```

Cada fase define **quem pode agir** e **o que a UI mostra**:

| Phase | Quem Controla | O Que Acontece |
|-------|--------------|----------------|
| `'start'` | Ninguém | Tela de título |
| `'player_turn'` | Jogador | Pode clicar nas cartas |
| `'ai_thinking'` | Sistema | IA está "pensando" (delay 1.4s) |
| `'game_over'` | Ninguém | Overlay de vitória/derrota |

---

## Fluxo Detalhado: Turno do Jogador

```
phase = 'player_turn'
       ↓
Jogador vê sua mão renderizada em index.vue
       ↓
Clica em uma carta  →  onCardClick(uid)  →  playCard(uid)
       ↓
playCard() verifica:
  - card.cost <= playerMana?  (se não: log de erro, nada acontece)
  - card existe na mão?       (busca por uid)
       ↓
Aplica efeitos:
  attack > 0  →  aiDefense absorve primeiro, resto vira dano no aiHP
  defense > 0 →  playerDefense += card.defense
  heal > 0    →  playerHP = min(30, playerHP + card.heal)
       ↓
Remove carta da mão, desconta mana
       ↓
checkOver() → alguém chegou a 0 HP?
  SIM → phase = 'game_over', sai
  NÃO → continua (jogador pode jogar mais cartas)
       ↓
Jogador clica "Passar turno"  →  endPlayerTurn()
  phase = 'ai_thinking'
  playerMana += 1 (máx 10)
  turn += 1
       ↓
setTimeout(1400ms) → runAiTurn()
```

---

## Fluxo Detalhado: Turno da IA

```
runAiTurn()   [executado após 1400ms de delay]
       ↓
drawCard('ai')  →  IA compra uma carta
aiMana = min(10, aiMana + 1)
       ↓
Loop (máx. 2 jogadas):
  aiPickCard()  →  escolhe a melhor carta disponível
       ↓
  Aplica efeitos (mesmo sistema do jogador)
       ↓
  checkOver() → alguém chegou a 0 HP?
    SIM → phase = 'game_over', sai do loop
    NÃO → continua
       ↓
  plays++ 
  Se plays == 1:  60% de chance de PARAR aqui
                  40% de chance de jogar segunda carta
       ↓
phase = 'player_turn'
drawCard('player')  →  jogador compra carta
Log: "--- SEU TURNO X ---"
```

---

## Por Que o Delay de 1.4 Segundos?

```typescript
// endPlayerTurn():
setTimeout(() => {
  if (state.phase === 'game_over') return
  runAiTurn()
}, 1400)
```

**Sem o delay:** a IA responderia instantaneamente, dando a sensação de que o jogo não tem "adversário de verdade".

**Com o delay:** cria a ilusão de "pensamento". O badge `IA PENSANDO...` pisca na tela, aumentando a tensão.

---

## Como Vue 3 Renderiza Mudanças

O `_internal` em `useGame.ts` é um objeto **reativo** do Vue:

```typescript
const _internal = reactive<any>(createInitialState())
```

Quando qualquer propriedade muda (ex: `_internal.playerHP -= 5`), Vue automaticamente re-renderiza apenas os componentes que usam aquela propriedade. Não precisamos chamar `render()` manualmente.

```
playCard() muda _internal.aiHP
       ↓
Vue detecta a mudança (Proxy)
       ↓
Componente que usa state.aiHP re-renderiza
       ↓
HP bar atualiza na tela
```

Isso é o **poder do estado reativo** — separação total entre lógica e interface.

---

## Resumo Visual

```
[TELA]  →  Jogador clica carta
              ↓
[LÓGICA] playCard(uid)   →  muda estado
              ↓
[VUE]   detecta mudança   →  re-renderiza
              ↓
[TELA]  HP da IA atualiza  →  Jogador vê feedback
              ↓
[JOGADOR] "Passar turno"
              ↓
[LÓGICA] endPlayerTurn()  →  phase = 'ai_thinking'
              ↓
[DELAY]  1400ms...
              ↓
[LÓGICA] runAiTurn()      →  IA age, muda estado
              ↓
[VUE]   detecta mudanças  →  re-renderiza tudo
              ↓
[TELA]  Estado novo aparece na UI
```

---

## 💡 Próximo Passo

Leia **`SRC_COMENTADO_cards.ts`** para entender como as cartas são definidas como dados puros!
