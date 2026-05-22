# GDD - Deep Sea Coder

## 1. Visão Geral
Um jogo de estratégia e lógica via terminal onde o jogador gerencia um drone de mineração profunda.

## 2. Mecânicas Principais
- **Sistema de Pilha de Comandos:** O jogador digita uma string de comandos (ex: `FFMFV`) que o drone executa em ordem.
- **Recursos:**
    - **Energia:** Cada comando consome 1 unidade. Se acabar no meio do oceano, o drone é perdido (Game Over ou Resgate caro).
    - **Carga:** Capacidade limitada de minérios.
- **A Base:** Único local onde a energia recarrega e os minérios são convertidos em créditos.

## 3. Interface (UI)
- **Painel Superior:** Status (Energia, Carga, Créditos).
- **Área Central:** Log de eventos ("Drone avançou", "Minério encontrado!").
- **Input:** Prompt para inserir a sequência de comandos.

## 4. Loop de Gameplay
1. Analisar a situação atual.
2. Planejar a sequência de comandos.
3. Observar a execução e os resultados.
4. Realizar upgrades para ir mais fundo.

## 5. Aspectos Técnicos (Python)
- **Tipos de Dados:** Listas para a fila de comandos, Dicionários para o estado do drone.
- **Loops:** `while` para o loop principal do jogo, `for` para processar a sequência de comandos.
- **Funções:** Separar lógica de mineração, movimentação e UI.
