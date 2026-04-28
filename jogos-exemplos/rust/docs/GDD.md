# [= GDD REVERSO =] Dungeon Crawler (Motor Híbrido)
**Mindpunk Lab - Game Dev Starter Kit**

Este documento detalha o funcionamento do roguelike clássico de terminal. Ele serve como o exemplo de nível avançado do Starter Kit, demonstrando a integração de uma linguagem de alta performance com uma linguagem de script dinâmico.

---

## 1. VISÃO GERAL (THE BIG PICTURE)

* **Título Provisório:** Dungeon Crawler Roguelike
* **Gênero:** Roguelike de Terminal / Exploração de Masmorras
* **Plataforma:** Terminal CLI (Windows/Linux)
* **Core Loop:** Descer andares gerados proceduralmente -> Explorar e lutar no escuro (Fog of War) -> Coletar Loot -> Derrotar o Guardião Ancestral no 5º andar.

---

## 2. ARQUITETURA TÉCNICA (STACK HÍBRIDA)

A arquitetura foi dividida para extrair o melhor de dois mundos, usando `PyO3` para a ponte entre as linguagens.

* **O Músculo (Rust):** Lida com o loop principal, segurança de memória, renderização via `crossterm` e cálculos pesados (como a geração do mapa e campo de visão).
* **O Cérebro (Python):** Lida com o Game Design Iterativo. Através de scripts simples, define os status dos inimigos, propriedades dos itens e tabelas de loot. Essa separação permite balancear o jogo sem precisar recompilar a engine em Rust.

### Diagrama de Responsabilidades
```text
  [ RUST: Engine ]                 [ PYTHON: Dados ]
  - map.rs (Geração BSP)           - enemies.py (IA/Stats)
  - fov.rs (Shadowcasting)  <====> - items.py (Efeitos)
  - combat.rs (Fórmulas)           - loot.py (Drop rate)
3. MECÂNICAS PRINCIPAIS (O CORAÇÃO)
A. Campo de Visão (Shadowcasting) e Fog of War
O mundo do jogo só é visível ao redor do jogador. Áreas escuras já exploradas continuam visíveis no mapa, mas não revelam a movimentação de inimigos, exigindo exploração cautelosa.

B. Sistema de Turnos Estrito
O mundo (inimigos e status) só avança quando o jogador executa uma ação (andar, atacar, usar item ou esperar).

C. Gerenciamento de Recursos
Combate Automático: Mover-se na direção de um inimigo adjacente resolve o ataque com variação de dano (+/- 25%).

Inventário Limitado: O jogador possui um máximo rígido de 5 slots. Isso força decisões difíceis (ex: levar uma poção de cura extra ou guardar um antídoto para andares venenosos).

Status Effect: Veneno dura 4 turnos, drenando HP e exigindo planejamento tático prévio.

4. ESTRUTURA DE DADOS E IA
Comportamento Inimigo
A engine em Rust processa as regras de IA lidas do Python, existindo 4 padrões:

Randômica: Move-se sem padrão (ex: Ratos).

Perseguição: Caça o jogador incessantemente (ex: Esqueletos).

Alcance: Mantém distância para usar ataques mágicos/físicos à distância.

Boss: O "Guardião Ancestral" no 5º andar possui visão total do mapa e ataques combinados com veneno.

Geração Procedural (BSP)
O mapa é construído usando Binary Space Partitioning (BSP), garantindo que as masmorras sejam criadas dividindo o espaço em setores retangulares e conectando-os com corredores não lineares.

5. ROADMAP DE SIMPLIFICAÇÃO (PARA ESTUDANTES)
Para o Starter Kit, o foco do aluno não deve ser reescrever o código em Rust, mas sim interagir com o "Game Design":

[X] Modding via Python: O aluno pode abrir os arquivos scripts/*.py para adicionar um novo inimigo ou alterar as regras de HP e dano, aprendendo sobre balanceamento na prática sem tocar na linguagem pesada.

[X] Sistema de Câmera (Isolado): Atualmente a câmera exibe o mapa inteiro fixo. Como desafio avançado, o aluno pode tentar implementar um sistema que segue o jogador.