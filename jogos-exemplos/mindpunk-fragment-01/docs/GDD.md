# GDD - Fragmento 01

## 1. Visão Geral
Um Roguelike minimalista em tempo real focado em gerenciamento de estado e loops de jogo rápidos. O jogador explora uma dungeon gerada procedimentalmente, combatendo inimigos e coletando itens.

## 2. Pilares de Design
- **Rapidez:** Turnos curtos que parecem tempo real.
- **Simplicidade:** Mecânicas fáceis de entender, mas difíceis de dominar.
- **Aprendizado:** Exemplo perfeito de como gerenciar estados globais (Zustand) em aplicações React.

## 3. Mecânicas Principais
- **Movimentação:** Grid-based (Cima, Baixo, Esquerda, Direita).
- **Combate:** Automático ao colidir com inimigos.
- **Geração Procedural:** Uso de algoritmos simples para criar layouts de dungeon únicos a cada rodada.

## 4. Interface (UI)
- **Game Canvas:** Área principal onde o mundo é renderizado.
- **Stats Bar:** Vida, Nível, Inimigos restantes.
- **Log:** Histórico de ações (ex: "Você atacou Goblin").

## 5. Arquitetura Técnica
- **Framework:** React + TypeScript.
- **State:** Zustand (Estado centralizado).
- **Loop:** Input -> Logic -> State Update -> Render.
