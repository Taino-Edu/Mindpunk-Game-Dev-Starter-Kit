/**
 * ============================================================================
 * ARQUIVO: src/map.rs - GERAÇÃO BSP (Educacional)
 * ============================================================================
 *
 * RESPONSABILIDADE: Gerar mapas de dungeon proceduralmente
 *
 * Este arquivo explica o algoritmo BSP (Binary Space Partitioning):
 * - Como dividir um mapa em salas
 * - Como conectar as salas com corredores
 * - Como garantir que tudo fica conectado
 * - Por que BSP é eficiente
 *
 * CONCEITO PRINCIPAL: Divisão Recursiva
 * ├─ Comça com um retângulo grande (todo o mapa)
 * ├─ Divide recursivamente em dois (horizontal ou vertical)
 * ├─ Quando fica pequeno demais, cria uma sala
 * └─ Depois conecta as salas com corredores
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * PARTE 1: TIPOS DE DADOS
 * ============================================================================
 */

/**
 * ENUM: TileType
 *
 * Cada célula do mapa é um tipo de tile:
 *
 * enum TileType {
 *   Wall,      ← Parede sólida (bloqueia movimento E visão)
 *   Floor,     ← Chão (pode caminhar e ver através)
 *   Stairs,    ← Escada (vai para próximo andar)
 * }
 *
 * Representação Visual:
 * ```
 * ████████████
 * █          █
 * █  ██  ██  █
 * █  ██  ██  █
 * █          █
 * ████████████
 *
 * █ = Wall (bloqueia)
 * espaço = Floor (caminha)
 * ```
 */

/**
 * STRUCT: Tile
 *
 * Cada célula contém:
 *
 * struct Tile {
 *   tile_type: TileType,      ← Wall, Floor ou Stairs
 *   revealed: bool,           ← Você já viu esse tile?
 *   visible: bool,            ← Está no seu campo de visão AGORA?
 * }
 *
 * CAMPOS EXPLICADOS:
 *
 * tile_type:
 *   └─ Define se é parede, chão ou escada
 *
 * revealed:
 *   └─ true = você já passou aqui
 *   └─ false = você nunca viu (totalmente escuro)
 *   └─ Uso: Mostrar mapas "explorados" mas não visíveis agora
 *
 * visible:
 *   └─ true = está no seu campo de visão NESTE MOMENTO
 *   └─ false = está fora do FOV (shadowcasting desliga)
 *   └─ Uso: Efeito de "você vê através das paredes" vs "você vê luz"
 *
 * EXEMPLO DE ESTADO:
 *
 *   Célula A (que você viu antes):
 *   ├─ tile_type: Floor
 *   ├─ revealed: true  (você já passou aqui)
 *   └─ visible: false  (não está no seu FOV agora)
 *   → Desenha escuro/cinza (memória)
 *
 *   Célula B (que você vê AGORA):
 *   ├─ tile_type: Floor
 *   ├─ revealed: true
 *   └─ visible: true   (está no seu FOV)
 *   → Desenha brilhante/branco
 *
 *   Célula C (nunca viu):
 *   ├─ tile_type: Wall (não importa, não vê)
 *   ├─ revealed: false
 *   └─ visible: false
 *   → Desenha preto (incógnito)
 */

/**
 * STRUCT: Rect (Retângulo / Sala)
 *
 * Representa uma sala retangular no mapa:
 *
 * struct Rect {
 *   x: usize,     ← Coordenada X do canto superior esquerdo
 *   y: usize,     ← Coordenada Y do canto superior esquerdo
 *   w: usize,     ← Largura da sala
 *   h: usize,     ← Altura da sala
 * }
 *
 * VISUALIZAÇÃO:
 *
 * ```
 * (0,0) ─────── (79, 0)
 *  │
 *  │    Sala: Rect { x: 10, y: 5, w: 15, h: 8 }
 *  │    ┌──────────────────┐
 *  │    │                  │
 *  │    │                  │
 *  │    │                  │
 *  │    │                  │
 *  │    │                  │
 *  │    │                  │
 *  │    └──────────────────┘
 *  │
 * (0,39) ─── (79,39)
 * ```
 *
 * MÉTODOS ÚTEIS:
 *
 * center() → (usize, usize)
 *   └─ Retorna o centro da sala
 *   └─ Exemplo: Rect { x:10, y:5, w:15, h:8 }
 *      → center() = (10 + 15/2, 5 + 8/2) = (17, 9)
 *   └─ Uso: Spawnar player, inimigos, itens no centro
 *
 * intersects(other: &Rect) → bool
 *   └─ Verifica se duas salas se sobrepõem
 *   └─ Importante: Duas salas NÃO podem ocupar o mesmo espaço
 *   └─ Uso: Validação ao gerar novas salas
 */

/**
 * STRUCT: Map
 *
 * Representa o mapa completo:
 *
 * struct Map {
 *   tiles: Vec<Vec<Tile>>,    ← Grade 2D de tiles
 *   rooms: Vec<Rect>,         ← Todas as salas geradas
 *   stairs_pos: (usize, usize) ← Posição da escada (objetivo)
 * }
 *
 * CAMPOS EXPLICADOS:
 *
 * tiles:
 *   └─ Matriz 2D: tiles[y][x]
 *   └─ Tamanho: 80 wide x 40 tall (MAP_WIDTH x MAP_HEIGHT)
 *   └─ Contém o tipo de cada célula
 *   └─ Atualizado pelo shadowcasting (FOV)
 *
 * rooms:
 *   └─ Lista de todas as Rect geradas
 *   └─ Usado para: spawnar entidades, conectar com corredores
 *   └─ Na verdade armazena a "memória" de onde estão as salas
 *
 * stairs_pos:
 *   └─ (x, y) da escada para o próximo andar
 *   └─ Colocada no centro da última sala gerada
 *   └─ Objetivo do player: encontrar e descer
 */

/**
 * ============================================================================
 * PARTE 2: ALGORITMO BSP - ENTENDIMENTO PASSO A PASSO
 * ============================================================================
 */

/**
 * O QUE É BSP (Binary Space Partitioning)?
 *
 * Um algoritmo que divide recursivamente um espaço em dois até ficar pequeno:
 *
 * PASSO 0: Comço
 * ┌────────────────────┐
 * │                    │  ← Mapa inteiro (80x40)
 * │                    │
 * │                    │
 * └────────────────────┘
 *
 * PASSO 1: Divide na horizontal (ou vertical, aleatório)
 * ┌────────────────────┐
 * │                    │
 * ├────────────────────┤  ← Divisão horizontal em y=20
 * │                    │
 * └────────────────────┘
 *
 * PASSO 2: Divide cada lado novamente
 * ┌──────────┬─────────┐
 * │          │         │
 * ├──────────┼─────────┤
 * │          │         │
 * └──────────┴─────────┘
 *      ↓
 * ┌──────────┬─────────┐
 * │    │     │    │    │
 * ├────┼─────┼────┼────┤
 * │    │     │    │    │
 * └────┴─────┴────┴────┘
 *
 * PASSO 3: Continua até BSP_DEPTH (ex: 5 vezes)
 * ┌─┬─┬─┬─┬─┬─┬─┬─┐
 * │ │ │ │ │ │ │ │ │
 * ├─┼─┼─┼─┼─┼─┼─┼─┤
 * │ │ │ │ │ │ │ │ │
 * └─┴─┴─┴─┴─┴─┴─┴─┘
 *
 * RESULTADO: Muitos retângulos pequenos
 *
 * PASSO 4: Para cada retângulo, coloca uma sala
 * ┌─────┬─────────────┐
 * │█████ █  ██  █ █ █ │
 * │█   █ ▓▓▓▓▓▓▓ ▓▓▓▓▓│
 * │█▓▓▓█────────────────│
 * │█▓▓▓█ ███ █ █ █   █│
 * │█████ ▓▓▓ █ █ █ ███│
 * ├─────┼─────────────┤
 * │ ██  │  █▓▓▓█  █  █│
 * │█▓▓█ │  █▓▓▓█  █▓▓█│
 * │█▓▓█ │  ▓▓▓▓▓  █▓▓█│
 * │ ██  │  █▓▓▓█  ▓▓▓ │
 * └─────┴─────────────┘
 *
 * █ = Parede (Wall)
 * espaço = Chão (Floor)
 * ▓ = Sala gerada
 *
 * PASSO 5: Conecta as salas com corredores
 * ┌─────┬──────────────┐
 * │█████│█┌─────┐█┌──┐ │
 * │█   █─┤ S  S ├─┤  │ │
 * │█ S █─┤ S  S ├─┤ S│ │
 * │█   █─┤ S  S ├─┤  │ │
 * │█████│└─────┘█└──┘ │
 * ├─────┼──────────────┤
 * │ ██  │  ┌───┐  ┌──┐│
 * │█S█──┤──┤ S ├──┤ S││
 * │█S█  │  │ S │  │ S││
 * │ ██  │  └───┘  └──┘│
 * └─────┴──────────────┘
 *
 * RESULTADO: Mapa completamente conectado!
 */

/**
 * ============================================================================
 * PARTE 3: IMPLEMENTAÇÃO PASSO A PASSO
 * ============================================================================
 */

/**
 * FUNÇÃO: Map::generate(floor_number: u32) -> Self
 *
 * Ponto de entrada para gerar um novo mapa.
 *
 * PASSOS:
 * 1. Cria grid inicial (tudo parede)
 * 2. Chama BSP recursivo
 * 3. Conecta as salas com corredores
 * 4. Coloca a escada (objetivo)
 * 5. Retorna mapa pronto
 *
 * CÓDIGO (pseudocódigo):
 *
 * fn generate(floor_number) → Map {
 *
 *   // PASSO 1: Grid inicial vazio (tudo parede)
 *   tiles = cria_grid_parede(80, 40)
 *
 *   map = Map {
 *     tiles: tiles,
 *     rooms: [],        // Sem salas ainda
 *     stairs_pos: (0,0) // Posição temporária
 *   }
 *
 *   // PASSO 2: Chama BSP recursivo
 *   map.bsp_split(
 *     rng,
 *     x: 1,             // Deixa 1 tile de borda (parede)
 *     y: 1,
 *     w: 80 - 2,        // Dentro da borda
 *     h: 40 - 2,
 *     depth: 5          // Profundidade máxima
 *   )
 *   // Agora map.rooms tem as salas geradas
 *   // E map.tiles tem os chãos escavados
 *
 *   // PASSO 3: Conecta as salas
 *   map.connect_rooms()
 *   // Agora tem corredores conectando tudo
 *
 *   // PASSO 4: Coloca escada
 *   ultima_sala = map.rooms.last()
 *   (sx, sy) = ultima_sala.center()
 *   map.tiles[sy][sx].tile_type = Stairs
 *   map.stairs_pos = (sx, sy)
 *
 *   // PASSO 5: Retorna
 *   return map
 * }
 */

/**
 * FUNÇÃO: Map::bsp_split (recursivo!)
 *
 * Divide um retângulo recursivamente até ser pequeno demais.
 *
 * fn bsp_split(
 *   &mut self,
 *   rng: &mut Rng,    // Gerador de números aleatórios
 *   x: usize,         // Coordenada X da região
 *   y: usize,         // Coordenada Y da região
 *   w: usize,         // Largura da região
 *   h: usize,         // Altura da região
 *   depth: u32        // Quantas vezes dividir ainda
 * )
 *
 * LÓGICA (pseudocódigo):
 *
 * fn bsp_split(x, y, w, h, depth) {
 *
 *   // CONDIÇÃO DE PARADA: Profundidade = 0
 *   if (depth == 0) {
 *     // Ficou pequeno demais, tenta criar uma sala
 *     room = cria_sala_aleatoria(x, y, w, h)
 *     if (sala não sobrepõe outras) {
 *       escava_sala(room)  // Muda paredes pra chão
 *       rooms.push(room)   // Guarda essa sala
 *     }
 *     return  // Fim da recursão
 *   }
 *
 *   // RECURSÃO: Divide em dois
 *
 *   // Escolhe se divide horizontalmente ou verticalmente
 *   if (rand() > 0.5) {
 *     // Divide HORIZONTALMENTE (horizontal_split = true)
 *     split_pos = rand(y, y + h)  // Escolhe onde dividir
 *     // Agora temos duas regiões:
 *     // ├─ Top: (x, y, w, split_pos - y)
 *     // └─ Bottom: (x, split_pos, w, h - (split_pos - y))
 *
 *     bsp_split(x, y, w, split_pos - y, depth - 1)          // Top recursiva
 *     bsp_split(x, split_pos, w, h - (split_pos - y), depth - 1)  // Bottom recursiva
 *
 *   } else {
 *     // Divide VERTICALMENTE (vertical_split = true)
 *     split_pos = rand(x, x + w)  // Escolhe onde dividir
 *     // Agora temos duas regiões:
 *     // ├─ Left: (x, y, split_pos - x, h)
 *     // └─ Right: (split_pos, y, w - (split_pos - x), h)
 *
 *     bsp_split(x, y, split_pos - x, h, depth - 1)          // Left recursiva
 *     bsp_split(split_pos, y, w - (split_pos - x), h, depth - 1)  // Right recursiva
 *   }
 * }
 *
 * EXEMPLO VISUAL (depth=2):
 *
 * Início: bsp_split(0, 0, 80, 40, 2)
 * ┌────────────────────────┐
 * │                        │
 * │                        │
 * └────────────────────────┘
 *
 * Divide horizontalmente em y=20:
 * ┌────────────────────────┐
 * │   depth=1              │
 * ├────────────────────────┤
 * │   depth=1              │
 * └────────────────────────┘
 *
 * Cada lado divide novamente (verticalmente):
 * ┌──────────┬────────────┐
 * │depth=0   │ depth=0    │
 * ├──────────┼────────────┤
 * │depth=0   │ depth=0    │
 * └──────────┴────────────┘
 *
 * Cada zona depth=0 tenta criar uma sala:
 * ┌──────┬──────┬──────────┐
 * │ S S  │ S    │  S       │
 * ├──────┼──────┼──────────┤
 * │ S    │  S S │  S   S   │
 * └──────┴──────┴──────────┘
 *
 * S = Sala criada
 */

/**
 * FUNÇÃO: Map::connect_rooms
 *
 * Conecta todas as salas com corredores.
 *
 * ESTRATÉGIA SIMPLES (tunneling):
 * ├─ Para cada par de salas consecutivas
 * ├─ Desenha um corredor L-shaped (horizontal depois vertical)
 * └─ Resultado: todas as salas ficam conectadas
 *
 * EXEMPLO:
 *
 * Sala A em (10, 10) com centro (15, 15)
 * Sala B em (40, 20) com centro (50, 30)
 *
 * Corredor L-shaped:
 * ┌────────┐
 * │ Sala A │
 * └────┬───┘
 *      │
 *      └────────┐
 *               │
 *         ┌─────┴──────┐
 *         │  Sala B    │
 *         └────────────┘
 *
 * PSEUDOCÓDIGO:
 *
 * fn connect_rooms() {
 *   for i in 0..rooms.len()-1 {
 *     room1 = rooms[i]
 *     room2 = rooms[i+1]
 *
 *     (x1, y1) = room1.center()
 *     (x2, y2) = room2.center()
 *
 *     // Corredor horizontal
 *     for x in min(x1,x2)..max(x1,x2) {
 *       tiles[y1][x] = Floor  // Escava horizontalmente
 *     }
 *
 *     // Corredor vertical
 *     for y in min(y1,y2)..max(y1,y2) {
 *       tiles[y][x2] = Floor  // Escava verticalmente
 *     }
 *   }
 * }
 *
 * RESULTADO: Todas as salas conectadas!
 */

/**
 * ============================================================================
 * PARTE 4: POR QUÊ BSP?
 * ============================================================================
 */

/**
 * VANTAGENS:
 *
 * ✅ Garantia de Conectividade
 *    └─ Todas as salas ficam conectadas (não há ilhas)
 *
 * ✅ Distribuição Boa
 *    └─ Salas espalhadas pelo mapa (não tudo aglomerado)
 *
 * ✅ Performance
 *    └─ O(2^depth) operações, muito rápido
 *    └─ depth=5 = 32 divisões = < 1ms pra gerar
 *
 * ✅ Fácil Implementar
 *    └─ Recursão simples, sem lógica complexa
 *
 * ✅ Customizável
 *    └─ Mude depth → mais/menos salas
 *    └─ Mude tamanho → salas maiores/menores
 *    └─ Mude split chance → mais horizontal ou vertical
 *
 * DESVANTAGENS:
 *
 * ❌ Pode gerar corredores compridos
 *    └─ Salas em extremos = corredores longos
 *    └─ Solução: use A* pra caminhos mais curtos
 *
 * ❌ Todas as salas têm formato retangular
 *    └─ Sem salas circulares ou irregulares
 *    └─ Solução: pós-processe o mapa
 *
 * ❌ Pode deixar espaços "desperdiçados"
 *    └─ Áreas que ficam entre salas
 *    └─ Solução: ignore (roguelikes clássicos têm isso)
 */

/**
 * COMPARAÇÃO COM OUTROS ALGORITMOS:
 *
 * ┌─────────────────┬───────────┬──────────┬─────────────┐
 * │ Algoritmo       │ Velocidade│ Qualidade│ Facilidade  │
 * ├─────────────────┼───────────┼──────────┼─────────────┤
 * │ BSP             │ Rápido    │ Boa      │ Fácil       │
 * │ Cellular Automata│ Médio    │ Ótima    │ Médio       │
 * │ Voronoi         │ Lento     │ Ótima    │ Difícil     │
 * │ Random Walks    │ Rápido    │ Ruim     │ Fácil       │
 * └─────────────────┴───────────┴──────────┴─────────────┘
 *
 * ESCOLHA: BSP é o melhor custo-benefício pra roguelikes!
 */

/**
 * ============================================================================
 * PARTE 5: RESUMO VISUAL - COMO FUNCIONA DO INÍCIO AO FIM
 * ============================================================================
 */

/**
 * TIMELINE COMPLETA:
 *
 * map.generate()
 *   ├─ Cria grid (tudo parede)
 *   │  ┌────────────────┐
 *   │  │████████████████│
 *   │  │████████████████│
 *   │  │████████████████│
 *   │  └────────────────┘
 *   │
 *   ├─ Chama bsp_split() recursivo
 *   │  Profundidade 5:
 *   │  ┌────────────────┐
 *   │  │███ S ███ S ███ │
 *   │  │███ S ███ S ███ │
 *   │  │███████████████ │
 *   │  │███ S ███ S ███ │
 *   │  └────────────────┘
 *   │
 *   ├─ Conecta com corredores
 *   │  ┌──S──┬───S───┬──────┐
 *   │  │ S │S│ S │ S │  S   │
 *   │  ├──┼─┼───┼───┼──────┤
 *   │  │S │ │S S│   │ S S  │
 *   │  └──┴─┴───┴───┴──────┘
 *   │
 *   ├─ Coloca escada
 *   │  ┌──S──┬───S───┬──────┐
 *   │  │ S │S│ S │ S │  S   │
 *   │  ├──┼─┼───┼───┼──────┤
 *   │  │S │ │S S│   │ S E  │  ← E = Escada
 *   │  └──┴─┴───┴───┴──────┘
 *   │
 *   └─ Retorna Map pronto!
 *
 * RESULTADO FINAL:
 * - ✅ Mapa único e diferente a cada vez
 * - ✅ Todas as salas conectadas
 * - ✅ Escada no final (objetivo)
 * - ✅ Gerado em < 1ms
 * - ✅ Pronto para spawnar player e inimigos
 */

/**
 * ============================================================================
 * RESUMO: O QUE VOCÊ APRENDEU
 * ============================================================================
 *
 * 1. ESTRUTURA DE DADOS
 *    └─ TileType, Tile, Rect, Map
 *    └─ Como guardar informações sobre o mapa
 *
 * 2. ALGORITMO BSP
 *    └─ Divisão recursiva de espaço
 *    └─ Coloca salas após atingir profundidade máxima
 *    └─ Muito mais rápido que outras estratégias
 *
 * 3. CONEXÃO DE SALAS
 *    └─ Corredores L-shaped simples
 *    └─ Garante conectividade total
 *
 * 4. GERAÇÃO PROCEDURAL
 *    └─ Mesmo algoritmo gera mapas infinitos diferentes
 *    └─ Não precisa de dados pré-definidos
 *    └─ Escalável para mapas maiores
 *
 * 5. PERFORMANCE
 *    └─ BSP é O(2^depth) - muito eficiente
 *    └─ depth=5 gera 32 divisões em < 1ms
 *    └─ Pronto pra múltiplos andares
 *
 * PRÓXIMOS PASSOS:
 * ├─ Experimente mudar BSP_DEPTH (mais ou menos salas)
 * ├─ Experimente mudar MIN_ROOM_SIZE e MAX_ROOM_SIZE
 * ├─ Visualize os splits em ASCII puro
 * └─ Implemente Cellular Automata como alternativa!
 */
