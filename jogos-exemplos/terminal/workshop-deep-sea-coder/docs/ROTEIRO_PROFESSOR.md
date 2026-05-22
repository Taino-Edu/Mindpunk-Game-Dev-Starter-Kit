# Guia do Instrutor - Workshop Deep Sea Coder

## Roteiro Sugerido (3 Horas)

### Parte 1: O Conceito (30 min)
- Apresentar o **GDD** e a **Visão Geral**.
- Explicar o que é um "Drone Programável" e a filosofia Mindpunk ("Toda decisão cria...").
- Rodar o `main.py` pronto para eles verem o objetivo final.
- Mostrar o `SRC_COMENTADO_main.py` como material de apoio para consulta.

### Parte 2: O Esqueleto (45 min)
1. Criar o arquivo `main.py`.
2. Definir o dicionário `drone`. Explicar que ele é a "memória" do nosso robô.
3. Criar a função `limpar_tela()`.

### Parte 3: Movimentação (45 min)
1. Criar a função `desenhar_mundo()`.
2. Implementar o comando `F` (Frente).
3. Desafio: Pedir para os alunos implementarem o comando `T` (Trás).

### Parte 4: Lógica de Jogo (45 min)
1. Adicionar o sistema de `energia`.
2. Criar a função de `mineração`.
3. Adicionar a "Base" para vender e recarregar.

### Parte 5: Polimento e Exercícios (Livre)
- Entregar o arquivo `exercicios/nivel-1-basico.md`.
- Sugerir que mudem as cores (usando Colorama ou sequências ANSI).
- Desafio Final: Implementar o sistema de raridade por profundidade (conforme o arquivo de exercícios).

## Dicas de Ouro
- Erros de indentação serão o problema #1 em Python.
- Sempre que o código rodar, peça para eles tentarem "quebrar" o jogo (ex: descer mais que o fundo).
- Use o `time.sleep()` para criar tensão durante a execução da sequência.
- Reforce o conceito de que o Dicionário é o "Estado" do jogo.
