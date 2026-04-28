# [= GDD REVERSO =] Fragmento 01 (Sobrevivência Tática em React)
**Mindpunk Lab - Game Dev Starter Kit**

Este documento detalha o funcionamento de um roguelike de turnos baseado em grid, construído inteiramente com tecnologias web tradicionais de front-end. Ele serve como exemplo de arquitetura de UI Reativa aplicada a jogos.

---

## 1. VISÃO GERAL (THE BIG PICTURE)

* **Título Provisório:** Mindpunk Fragment 01
* **Gênero:** Roguelike Tático / Puzzle de Sobrevivência
* **Plataforma:** Web Browser / Mobile (Responsivo)
* **Core Loop:** Navegar na matriz procedimental -> Sobreviver aos inimigos -> Encontrar a Saída (9) -> Escolher uma "Corrupção" (Upgrade) -> Avançar para o próximo nível cada vez mais letal.

---

## 2. ARQUITETURA TÉCNICA (STACK REATIVA)

Diferente de engines que usam um "Game Loop" contínuo (como `requestAnimationFrame`), este projeto é puramente orientado a eventos e estado.

* **Engine Visual:** React (Renderização da Matriz de Grid via Componentes DOM).
* **Gerenciamento de Estado (O Cérebro):** Zustand. Todo o banco de dados do jogo (posições, vida, inimigos) vive em uma única "Store" mutável, separando completamente as Regras de Negócio da Interface Visual.
* **Animações:** Framer Motion (Transições e feedbacks visuais suaves sem sobrecarregar o React).
* **Estilização:** Tailwind CSS (Grid layout e UI Sci-Fi).

---

## 3. MECÂNICAS PRINCIPAIS (O CORAÇÃO)

### A. Estabilidade (HP = Stamina)
A mecânica central do jogo. A "Estabilidade" é um recurso unificado. Mover custa pontos (`COST_MOVE`), atacar custa pontos (`COST_ATTACK`) e até mesmo existir no nível drena uma porcentagem constante. 
* **Tática:** O jogador não pode explorar infinitamente. Cada passo deve ser calculado. O jogo te pune por enrolar.

### B. O Sistema de Corrupção (Roguelike Progression)
Ao encontrar a saída, o jogador deve escolher uma entre 3 "Corrupções" (Upgrades baseados em traits). Eles alteram drasticamente o jogo, adicionando status como `isVampire` (rouba vida mas sangra), `isGhost` (atravessa paredes mas dobra o custo de movimento) ou mudando atributos.

### C. Escalonamento e "Sombras da Guerra" (Fog of War)
A dificuldade aumenta proceduralmente:
* **Level 1 a 4:** Drones básicos de contato.
* **Level 5+:** Inimigos tipo 'Tank' (muito HP, muito dano).
* **Level 10+:** O jogo ativa o `blindMode`. O mapa fica totalmente escuro, exigindo o uso estratégico da habilidade `SCAN` ou pisos de revelação.
* **Level 16+:** Surgem os 'Generators', estruturas de alto HP que invocam novos inimigos a cada 3 turnos se não forem destruídas.

---

## 4. ESTRUTURA DE DADOS E IA

### A. A Matriz 2D
O mapa não é fisicamente gerado, mas sim um Array 2D (Matriz) de números, onde cada ID representa um tile lógico:
`0 = Chão`, `1/6 = Parede/Obstáculo`, `2 = Jogador`, `4 = Cura`, `5 = Dano/Armadilha`, `9 = Saída`.

### B. Turno Sequencial
A função `movePlayer` coordena o fluxo do tempo:
1. Jogador realiza a ação (Move, Ataca ou Espera).
2. Custos de estabilidade são deduzidos.
3. IA inimiga processa seu turno (`processEnemiesTurn`) logo em seguida, verificando linhas de visão e alcance.
4. O React reage às mudanças da Store e atualiza o DOM instantaneamente.

---

## 5. ROADMAP DIDÁTICO (PARA ESTUDANTES)

No Starter Kit, este projeto ensina **"Separação de Preocupações" (Separation of Concerns)**:

1. **[X] Lógica vs UI:** Os alunos podem alterar todas as fórmulas de dano, custo de movimento ou criar novos inimigos mexendo apenas no arquivo `useGameStore.ts`, sem nunca precisarem tocar nos componentes React de front-end.
2. **[X] UI Modular:** Como a interface foi desenhada (HUD, Grid, Overlay), os alunos podem estudar como criar componentes reutilizáveis e "escutar" variáveis globais.