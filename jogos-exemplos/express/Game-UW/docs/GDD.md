# GDD - Game-UW (Tactical Warfare)

## 1. Visão Geral
Um simulador de combate tático por turnos em ambiente hexagonal, focado em demonstrar o equilíbrio entre unidades, teoria dos jogos e arquitetura de cenas em Phaser 3.

## 2. Pilares de Design
- **Estratégia Pura:** O posicionamento e a ordem das ações são mais importantes que a velocidade de reação.
- **Equilíbrio (Rock-Paper-Scissors):** Cada unidade possui um counter direto, forçando o jogador a diversificar seu exército.
- **Feedback Visual Dinâmico:** O número de soldados em um hexágono representa visualmente a vida (HP) da unidade.

## 3. Mecânicas Principais
- **Sistema de Grids Hexagonais:** Uso de coordenadas axiais para cálculo de distância e pathfinding.
- **Unidades:**
    - **Infantaria:** Barata, rápida, mas frágil.
    - **Tanque:** Lento, caro, mas extremamente resistente.
    - **Arqueiro:** Frágil, alcance longo e alto dano.
- **Entrincheiramento:** Capacidade de gastar um turno para aumentar a defesa passiva.

## 4. Loop de Gameplay
1. **Fase Macro:** Seleção de missão e gerenciamento de recursos no mapa global.
2. **Fase Tática:** Posicionamento de tropas e combate por turnos no mapa hexagonal.
3. **Resolução:** Recompensa em ouro para financiar as próximas missões.

## 5. Inteligência Artificial (Threat Map)
A IA avalia o mapa de ameaças em tempo real, priorizando alvos vulneráveis e buscando posições de vantagem tática baseadas no alcance de suas armas.

## 6. Arquitetura Técnica
- **Engine:** Phaser 3 (Scene Management, Input handling).
- **Frontend:** TypeScript para lógica de combate estrita.
- **Container:** Electron para distribuição Desktop.
