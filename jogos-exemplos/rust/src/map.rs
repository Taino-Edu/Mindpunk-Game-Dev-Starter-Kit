// ─────────────────────────────────────────────────────────────────────────────
// map.rs — Geração e representação do mapa do dungeon
//
// O mapa é uma grade 2D de Tiles. A geração usa o algoritmo BSP
// (Binary Space Partitioning): divide o espaço recursivamente em dois,
// coloca uma sala em cada partição e conecta com corredores.
//
// Por que BSP? Gera salas bem distribuídas e garante que todas ficam
// conectadas, sem muito custo computacional.
// ─────────────────────────────────────────────────────────────────────────────

use rand::Rng;

// ── Constantes do mapa ───────────────────────────────────────────────────────

pub const MAP_WIDTH: usize = 80;
pub const MAP_HEIGHT: usize = 40;

// Tamanho mínimo e máximo de uma sala
const MIN_ROOM_SIZE: usize = 4;
const MAX_ROOM_SIZE: usize = 12;

// Profundidade máxima da árvore BSP (quanto maior, mais salas pequenas)
const BSP_DEPTH: u32 = 5;

// ── Tipos de tile ────────────────────────────────────────────────────────────

/// Cada célula do mapa é um `Tile`.
#[derive(Clone, Copy, PartialEq, Debug)]
pub enum TileType {
    /// Parede sólida — bloqueia movimento e visão.
    Wall,
    /// Chão — pode ser caminhado.
    Floor,
    /// Escada para o próximo andar.
    Stairs,
}

/// Um tile guarda seu tipo e se já foi revelado pelo jogador.
#[derive(Clone, Copy, Debug)]
pub struct Tile {
    pub tile_type: TileType,
    /// `true` se o jogador já passou por aqui (fica visível mesmo fora do FOV,
    /// mas escurecido).
    pub revealed: bool,
    /// `true` se está dentro do campo de visão atual do jogador.
    pub visible: bool,
}

impl Tile {
    fn wall() -> Self {
        Tile { tile_type: TileType::Wall, revealed: false, visible: false }
    }
    fn floor() -> Self {
        Tile { tile_type: TileType::Floor, revealed: false, visible: false }
    }
}

// ── Retângulo (sala) ─────────────────────────────────────────────────────────

/// Uma sala retangular no mapa.
#[derive(Clone, Copy, Debug)]
pub struct Rect {
    pub x: usize,
    pub y: usize,
    pub w: usize,
    pub h: usize,
}

impl Rect {
    pub fn new(x: usize, y: usize, w: usize, h: usize) -> Self {
        Rect { x, y, w, h }
    }

    /// Centro da sala — onde spawnam jogador, inimigos e itens.
    pub fn center(&self) -> (usize, usize) {
        (self.x + self.w / 2, self.y + self.h / 2)
    }

    /// Verifica se dois retângulos se sobrepõem (com 1 tile de margem).
    pub fn intersects(&self, other: &Rect) -> bool {
        self.x <= other.x + other.w + 1
            && self.x + self.w + 1 >= other.x
            && self.y <= other.y + other.h + 1
            && self.y + self.h + 1 >= other.y
    }
}

// ── Mapa principal ───────────────────────────────────────────────────────────

pub struct Map {
    /// Grade principal: tiles[y][x]
    pub tiles: Vec<Vec<Tile>>,
    /// Lista de salas geradas — usada para spawnar entidades.
    pub rooms: Vec<Rect>,
    /// Posição da escada para o próximo andar.
    pub stairs_pos: (usize, usize),
}

impl Map {
    /// Cria um novo mapa para o andar indicado.
    pub fn generate(_floor_number: u32) -> Self {
        let mut rng = rand::thread_rng();

        // Começa com tudo parede
        let tiles = vec![vec![Tile::wall(); MAP_WIDTH]; MAP_HEIGHT];
        let mut map = Map {
            tiles,
            rooms: Vec::new(),
            stairs_pos: (0, 0),
        };

        // Gera o mapa via BSP
        map.bsp_split(
            &mut rng,
            1,                  // x inicial (1 tile de borda)
            1,                  // y inicial
            MAP_WIDTH - 2,      // largura disponível
            MAP_HEIGHT - 2,     // altura disponível
            BSP_DEPTH,
        );

        // Fallback: BSP em teoria sempre gera salas, mas se por algum motivo
        // o mapa ficar vazio (área muito pequena após splits), cria uma sala central.
        if map.rooms.is_empty() {
            let fallback = Rect::new(MAP_WIDTH / 2 - 3, MAP_HEIGHT / 2 - 3, 6, 6);
            map.carve_room(&fallback);
            map.rooms.push(fallback);
        }

        // Conecta todas as salas com corredores em ordem de geração
        map.connect_rooms(&mut rng);

        // Coloca a escada no centro da última sala
        let last_room = *map.rooms.last().unwrap();
        let (sx, sy) = last_room.center();
        map.tiles[sy][sx].tile_type = TileType::Stairs;
        map.stairs_pos = (sx, sy);

        map
    }

    // ── BSP recursivo ────────────────────────────────────────────────────────

    /// Divide a região recursivamente. Quando a profundidade chega a 0,
    /// tenta colocar uma sala na área.
    fn bsp_split(
        &mut self,
        rng: &mut impl Rng,
        x: usize,
        y: usize,
        w: usize,
        h: usize,
        depth: u32,
    ) {
        // Caso base: profundidade zero → tenta criar uma sala aqui
        if depth == 0 || w < MIN_ROOM_SIZE * 2 + 3 || h < MIN_ROOM_SIZE * 2 + 3 {
            self.try_add_room(rng, x, y, w, h);
            return;
        }

        // Decide se corta horizontal ou verticalmente
        // Se a área for muito larga, prefere corte vertical; se alta, horizontal
        let split_horizontal = if w > h { false } else if h > w { true } else { rng.gen_bool(0.5) };

        if split_horizontal {
            // Corte horizontal: divide em cima/baixo
            let split = rng.gen_range(MIN_ROOM_SIZE + 1..h - MIN_ROOM_SIZE - 1);
            self.bsp_split(rng, x, y, w, split, depth - 1);
            self.bsp_split(rng, x, y + split, w, h - split, depth - 1);
        } else {
            // Corte vertical: divide esquerda/direita
            let split = rng.gen_range(MIN_ROOM_SIZE + 1..w - MIN_ROOM_SIZE - 1);
            self.bsp_split(rng, x, y, split, h, depth - 1);
            self.bsp_split(rng, x + split, y, w - split, h, depth - 1);
        }
    }

    /// Tenta criar uma sala dentro da área dada.
    /// Se colidir com sala existente, descarta.
    fn try_add_room(&mut self, rng: &mut impl Rng, area_x: usize, area_y: usize, area_w: usize, area_h: usize) {
        // Tamanho da sala é aleatório dentro dos limites da área
        let room_w = rng.gen_range(MIN_ROOM_SIZE..=area_w.min(MAX_ROOM_SIZE));
        let room_h = rng.gen_range(MIN_ROOM_SIZE..=area_h.min(MAX_ROOM_SIZE));

        // Posição aleatória dentro da área (com margem de 1 para as paredes)
        if area_w <= room_w || area_h <= room_h {
            return;
        }
        let room_x = area_x + rng.gen_range(0..area_w - room_w);
        let room_y = area_y + rng.gen_range(0..area_h - room_h);

        let new_room = Rect::new(room_x, room_y, room_w, room_h);

        // Rejeita se sobrepõe outra sala
        if self.rooms.iter().any(|r| r.intersects(&new_room)) {
            return;
        }

        // Escava a sala no mapa (transforma parede em chão)
        self.carve_room(&new_room);
        self.rooms.push(new_room);
    }

    /// Transforma todos os tiles dentro do retângulo em Floor.
    fn carve_room(&mut self, room: &Rect) {
        for y in room.y..room.y + room.h {
            for x in room.x..room.x + room.w {
                self.tiles[y][x] = Tile::floor();
            }
        }
    }

    // ── Conexão de salas ─────────────────────────────────────────────────────

    /// Conecta cada sala à próxima com um corredor em L.
    fn connect_rooms(&mut self, rng: &mut impl Rng) {
        let rooms = self.rooms.clone();
        for i in 1..rooms.len() {
            let (x1, y1) = rooms[i - 1].center();
            let (x2, y2) = rooms[i].center();

            // 50% de chance: primeiro vai horizontal depois vertical,
            // ou primeiro vertical depois horizontal.
            if rng.gen_bool(0.5) {
                self.carve_h_corridor(x1, x2, y1);
                self.carve_v_corridor(y1, y2, x2);
            } else {
                self.carve_v_corridor(y1, y2, x1);
                self.carve_h_corridor(x1, x2, y2);
            }
        }
    }

    fn carve_h_corridor(&mut self, x1: usize, x2: usize, y: usize) {
        let (min_x, max_x) = if x1 < x2 { (x1, x2) } else { (x2, x1) };
        for x in min_x..=max_x {
            self.tiles[y][x] = Tile::floor();
        }
    }

    fn carve_v_corridor(&mut self, y1: usize, y2: usize, x: usize) {
        let (min_y, max_y) = if y1 < y2 { (y1, y2) } else { (y2, y1) };
        for y in min_y..=max_y {
            self.tiles[y][x] = Tile::floor();
        }
    }

    // ── Utilitários ──────────────────────────────────────────────────────────

    /// Retorna true se a posição é caminhável (não é parede).
    pub fn is_walkable(&self, x: usize, y: usize) -> bool {
        if x >= MAP_WIDTH || y >= MAP_HEIGHT {
            return false;
        }
        self.tiles[y][x].tile_type != TileType::Wall
    }

    /// Posição inicial do jogador = centro da primeira sala gerada.
    pub fn player_start(&self) -> (usize, usize) {
        self.rooms[0].center()
    }
}
