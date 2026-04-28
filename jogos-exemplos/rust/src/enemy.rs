// ─────────────────────────────────────────────────────────────────────────────
// enemy.rs — Definição e comportamento dos inimigos
//
// Os stats dos inimigos vêm do Python (carregados por python_bridge.rs).
// A IA (como o inimigo se move) é implementada aqui em Rust.
//
// Tipos de comportamento:
//   Random   — anda em direção aleatória
//   Chase    — persegue o jogador se vê ele (usa distância de Chebyshev)
//   Ranged   — tenta manter distância e "atira" (aplica dano sem se mover)
//   Boss     — persegue sempre, ignora paredes ao atacar, mais HP
// ─────────────────────────────────────────────────────────────────────────────

use rand::Rng;

/// Comportamentos possíveis de IA.
#[derive(Clone, Debug, PartialEq)]
pub enum Behavior {
    Random,
    Chase,
    Ranged,
    Boss,
}

impl Behavior {
    /// Converte string vinda do Python para enum.
    pub fn from_str(s: &str) -> Self {
        match s {
            "random"  => Behavior::Random,
            "chase"   => Behavior::Chase,
            "ranged"  => Behavior::Ranged,
            "boss"    => Behavior::Boss,
            _         => Behavior::Chase, // padrão seguro
        }
    }
}

/// Um inimigo no mapa.
#[derive(Clone, Debug)]
pub struct Enemy {
    // ── Identidade ───────────────────────────────────────────────────────────
    pub name: String,
    pub symbol: char,

    // ── Posição ──────────────────────────────────────────────────────────────
    pub x: usize,
    pub y: usize,

    // ── Stats (vindos do Python) ──────────────────────────────────────────────
    pub hp: i32,
    pub max_hp: i32,
    pub attack: i32,
    pub defense: i32,

    // ── IA ───────────────────────────────────────────────────────────────────
    pub behavior: Behavior,

    // ── Efeitos especiais ────────────────────────────────────────────────────
    /// Se true, o ataque deste inimigo aplica veneno ao jogador.
    pub poisons: bool,
    /// Alcance de visão do inimigo (quantos tiles ele "enxerga").
    pub sight_range: i32,

    // ── Estado interno ───────────────────────────────────────────────────────
    /// Inimigo já foi avistado pelo jogador pelo menos uma vez?
    pub seen_by_player: bool,
}

impl Enemy {
    /// Cria um inimigo a partir de dados carregados do Python.
    pub fn new(
        name: String,
        symbol: char,
        x: usize,
        y: usize,
        hp: i32,
        attack: i32,
        defense: i32,
        behavior: &str,
        poisons: bool,
        sight_range: i32,
    ) -> Self {
        Enemy {
            name,
            symbol,
            x,
            y,
            hp,
            max_hp: hp,
            attack,
            defense,
            behavior: Behavior::from_str(behavior),
            poisons,
            sight_range,
            seen_by_player: false,
        }
    }

    pub fn is_dead(&self) -> bool {
        self.hp <= 0
    }

    /// Aplica dano ao inimigo (defesa reduz, mínimo 1).
    pub fn take_damage(&mut self, raw_damage: i32) {
        let damage = (raw_damage - self.defense).max(1);
        self.hp = (self.hp - damage).max(0);
    }

    // ── IA: calcular próxima posição ─────────────────────────────────────────

    /// Retorna a próxima posição desejada pelo inimigo.
    /// Não move diretamente — quem move é `game.rs` após checar colisões.
    ///
    /// `player_x/y`: posição atual do jogador
    /// `walkable`: closure que verifica se uma posição é caminhável
    pub fn next_move(
        &self,
        player_x: usize,
        player_y: usize,
        walkable: &dyn Fn(usize, usize) -> bool,
        rng: &mut impl Rng,
    ) -> (usize, usize) {
        match self.behavior {
            Behavior::Random => self.move_random(walkable, rng),
            Behavior::Chase | Behavior::Boss => self.move_chase(player_x, player_y, walkable),
            Behavior::Ranged => self.move_ranged(player_x, player_y, walkable, rng),
        }
    }

    // ── Implementações de IA ──────────────────────────────────────────────────

    /// Move em direção aleatória válida.
    fn move_random(&self, walkable: &dyn Fn(usize, usize) -> bool, rng: &mut impl Rng) -> (usize, usize) {
        // 4 direções possíveis
        let dirs: [(i32, i32); 4] = [(0, -1), (0, 1), (-1, 0), (1, 0)];
        let dir = dirs[rng.gen_range(0..4)];
        let nx = (self.x as i32 + dir.0).max(0) as usize;
        let ny = (self.y as i32 + dir.1).max(0) as usize;

        if walkable(nx, ny) { (nx, ny) } else { (self.x, self.y) }
    }

    /// Move em direção ao jogador passo a passo.
    /// Usa distância de Chebyshev para decidir o melhor passo.
    fn move_chase(&self, px: usize, py: usize, walkable: &dyn Fn(usize, usize) -> bool) -> (usize, usize) {
        // Calcula direção geral (dx, dy cada um -1, 0 ou +1)
        let dx = (px as i32 - self.x as i32).signum();
        let dy = (py as i32 - self.y as i32).signum();

        let nx = (self.x as i32 + dx).max(0) as usize;
        let ny = (self.y as i32 + dy).max(0) as usize;

        // Tenta mover diagonal primeiro; se bloqueado, tenta os eixos separados
        if walkable(nx, ny) {
            (nx, ny)
        } else {
            let nx2 = (self.x as i32 + dx).max(0) as usize;
            if walkable(nx2, self.y) {
                return (nx2, self.y);
            }
            let ny2 = (self.y as i32 + dy).max(0) as usize;
            if walkable(self.x, ny2) {
                return (self.x, ny2);
            }
            (self.x, self.y) // ficou parado
        }
    }

    /// Inimigo de alcance: tenta ficar a ~3 tiles do jogador.
    /// Se estiver muito perto, foge; se estiver longe, se aproxima.
    fn move_ranged(
        &self,
        px: usize,
        py: usize,
        walkable: &dyn Fn(usize, usize) -> bool,
        rng: &mut impl Rng,
    ) -> (usize, usize) {
        let dist = chebyshev_dist(self.x, self.y, px, py);

        if dist <= 2 {
            // Muito perto: foge na direção oposta ao jogador
            let dx = -(px as i32 - self.x as i32).signum();
            let dy = -(py as i32 - self.y as i32).signum();
            let nx = (self.x as i32 + dx).max(0) as usize;
            let ny = (self.y as i32 + dy).max(0) as usize;
            if walkable(nx, ny) { (nx, ny) } else { (self.x, self.y) }
        } else if dist > 4 {
            // Longe demais: se aproxima
            self.move_chase(px, py, walkable)
        } else {
            // Distância ideal: fica parado ou anda aleatório
            self.move_random(walkable, rng)
        }
    }

    // ── Alcance de ataque ────────────────────────────────────────────────────

    /// Retorna true se o inimigo está adjacente ao jogador (pode atacar).
    pub fn can_attack(&self, px: usize, py: usize) -> bool {
        chebyshev_dist(self.x, self.y, px, py) <= 1
    }

    /// Inimigo Ranged ataca se estiver a até 4 tiles (sem precisar estar adjacente).
    pub fn can_ranged_attack(&self, px: usize, py: usize) -> bool {
        chebyshev_dist(self.x, self.y, px, py) <= 4
    }
}

// ── Funções auxiliares ───────────────────────────────────────────────────────

/// Distância de Chebyshev: máx(|dx|, |dy|).
/// Num grid com movimento de 8 direções, é a distância "real" em turnos.
pub fn chebyshev_dist(x1: usize, y1: usize, x2: usize, y2: usize) -> i32 {
    let dx = (x1 as i32 - x2 as i32).abs();
    let dy = (y1 as i32 - y2 as i32).abs();
    dx.max(dy)
}
