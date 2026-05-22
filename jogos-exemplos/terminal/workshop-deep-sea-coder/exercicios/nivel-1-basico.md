# Exercícios: Deep Sea Coder (Nível 1 - Básico)

**Objetivo:** Familiarizar-se com a estrutura do Python e as mecânicas de estado e loop do jogo.

---

### Exercício 1: Explorando as Constantes
Abra o arquivo `main.py` e localize a seção de configurações.
1. O que acontece se você mudar `OCEANO_PROFUNDIDADE` para 20? 
2. Como você tornaria o jogo mais difícil alterando o `CUSTO_ENERGIA_MOVIMENTO`?

### Exercício 2: Entendendo o Dicionário `drone`
O dicionário `drone` é o "corpo" do nosso robô.
1. Adicione uma nova propriedade ao dicionário chamada `"nome": "Drone Alpha"`.
2. Como você faria para exibir esse nome na tela durante o jogo? (Dica: Olhe a função `desenhar_mundo`).

### Exercício 3: Lógica de Comandos
Observe a função `executar_comandos`.
1. Atualmente, o comando `F` desce o drone. Mude o código para que o drone gaste o **dobro** de energia (10 unidades) toda vez que ele descer, mas apenas 5 quando subir.
2. Crie um novo comando `E` (Emergência) que teletransporta o drone instantaneamente para a posição 0, mas consome 50% de toda a energia restante.

### Exercício 4: Visual e Interface
Na função `desenhar_mundo`:
1. Mude o símbolo do drone de `[O]` para algo mais futurista como `🛸` ou `🛰️`.
2. Altere a cor das mensagens de log (Dica: Pesquise como usar sequências de escape ANSI para cores no Python).

---

### Desafio Final
Implemente um sistema onde a profundidade do oceano afeta o valor do minério. 
- Se o drone minerar entre os níveis 1 e 5, o minério vale $10.
- Se minerar entre 6 e 10, o minério vale $25 (devido à raridade da pressão profunda).

*Dica: Você precisará editar a lógica do comando `V` (Vender).*
