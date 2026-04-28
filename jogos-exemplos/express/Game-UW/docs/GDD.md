# [= GDD REVERSO =] Gamer-UW / WARR (Protótipo Tático)
**Mindpunk Lab - Game Dev Starter Kit**

Este documento detalha o funcionamento técnico do protótipo de estratégia tática desenvolvido com a stack moderna de Web Technologies para Desktop.

---

## 1. VISÃO GERAL (THE BIG PICTURE)

* **Título Provisório:** WARR / Gamer-UW
* **Gênero:** Estratégia Tática em Turnos (Turn-Based Strategy)
* **Plataforma:** Desktop (Windows/Linux/Mac via Electron)
* **Core Loop:** Navegação no Grafo de Missões (Macro) -> Combate em Grid Hexagonal (Tactical) -> Gerenciamento de Status

---

## 2. ARQUITETURA TÉCNICA (STACK)

O projeto utiliza uma arquitetura de "Web App" encapsulada para desktop, garantindo portabilidade e alta performance gráfica para 2D.

* **Engine:** Phaser 3 (Gestão de Cenas, Renderização e Input)
* **Wrapper:** Electron + Vite (Integração nativa e build otimizado)
* **Linguagem:** TypeScript (Tipagem estrita para lógica de combate)

### Diagrama de Fluxo de Cenas
```text
  [ BootScene ] ───────► [ MacroScene ] ───────► [ TacticalScene ]
  (Carregamento)        (Mapa de Campanha)      (Combate Hexagonal)
                               ▲                        │
                               └────────────────────────┘
                                  (Retorno pós-batalha)
3. MECÂNICAS PRINCIPAIS (O CORAÇÃO)
A. Sistema de Grid Hexagonal (Pointy-Top)
Diferente de grids quadrados, o sistema utiliza coordenadas Axiais (q, r) para cálculos precisos de movimentação e distância:

Conversão de Coordenadas: Transforma cliques de pixels em tela para endereços de hexágonos lógicos.

Cálculo de Distância: Utiliza geometria de cubos para determinar alcance de tiro e movimento.

B. O Conceito de "Pelotão Visual"
Em vez de uma única sprite, o HP da unidade controla o número de soldados visíveis no hexágono:

HP Máximo: Exibe 4 soldados (pelotão cheio).

Dano Recebido: Os soldados "morrem" visualmente conforme a vida cai, dando feedback imediato ao jogador sem necessidade de ler barras de texto.

C. Modos de Ação e Entrincheiramento
Cada turno permite uma decisão tática por unidade:

MOVE: Movimentação baseada no atributo 'move' da unidade.

ATTACK: Ataque baseado em 'range' e 'atk'. Infantaria possui precisão absoluta (ALWAYS_HIT).

ENTRENCH (T): A unidade gasta seu turno para cavar trincheiras, reduzindo o dano recebido em 35% (multiplicador 0.65x).

4. ESTRUTURA DE DADOS E IA
IA de Combate (PickBestMove)
A IA não move aleatoriamente. Ela avalia o cenário baseada em um "Threat Map":

Targeting: Seleciona o jogador mais próximo ou mais fraco.

Scoring: Avalia hexágonos vizinhos. Ela prefere posições que permitam atirar (wantsShoot) mas que evitem ameaças altas (threatAt).

Fallback: Se não houver movimento vantajoso, a IA escolhe se entrincheirar.

5. ROADMAP DE SIMPLIFICAÇÃO (PARA ESTUDANTES)
Para fins didáticos no Starter Kit, algumas complexidades foram isoladas:

[X] Hardcoded Missions: Atualmente, qualquer nó no mapa Macro carrega a missão de Kiev (kyiv) por padrão.

[X] Unit Fallback: Caso uma unidade não seja encontrada nas definições, o motor gera uma infantaria padrão com 20 HP para evitar crashes.

[X] Assets: O sistema utiliza soldier_token e formas geométricas (Graphics) para facilitar a substituição por sprites customizadas pelos alunos.

Documentação gerada pela Mindpunk Lab para fins de Extensão Acadêmica.