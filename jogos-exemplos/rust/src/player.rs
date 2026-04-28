// ─────────────────────────────────────────────────────────────────────────────
// player.rs — Estado e lógica do jogador
//
// O jogador é a única entidade controlada pelo humano. Guarda posição, stats,
// inventário e o log de mensagens exibido no HUD.
// ─────────────────────────────────────────────────────────────────────────────

/// Um item no inventário do jogador.
#[derive(Clone, Debug)]
pub struct Item {
    pub name: String,
    /// "potion", "weapon", "shield" — define o efeito ao usar.
    pub item_type: String,
    /// Valor do efeito: cura X HP, adiciona X de ataque, etc.
    pub value: i32,
    /// Símbolo ASCII que representa o item no mapa.
    pub symbol: char,
}

/// Estado completo do jogador.
pub struct Player {
    // ── Posição no mapa ──────────────────────────────────────────────────────
    pub x: usize,
    pub y: usize,

    // ── Atributos de combate ─────────────────────────────────────────────────
    pub hp: i32,
    pub max_hp: i32,
    pub attack: i32,   // dano base por turno
    pub defense: i32,  // reduz dano recebido

    // ── Progressão ───────────────────────────────────────────────────────────
    pub floor: u32,    // andar atual (começa em 1)
    pub kills: u32,    // inimigos derrotados (para pontuação)

    // ── Inventário ───────────────────────────────────────────────────────────
    /// Máximo de 5 itens no inventário.
    pub inventory: Vec<Item>,

    // ── Status effects ───────────────────────────────────────────────────────
    /// Turnos restantes de veneno. Perde 1 HP/turno enquanto > 0.
    pub poisoned_turns: u32,

    // ── Log de mensagens ─────────────────────────────────────────────────────
    /// Últimas mensagens do jogo (combate, eventos). Exibidas no HUD.
    /// Guardamos no máximo 5; mensagens antigas somem.
    pub messages: Vec<String>,
}

impl Player {
    /// Cria um novo jogador na posição dada com stats base.
    pub fn new(x: usize, y: usize) -> Self {
        Player {
            x,
            y,
            hp: 30,
            max_hp: 30,
            attack: 5,
            defense: 2,
            floor: 1,
            kills: 0,
            inventory: Vec::new(),
            poisoned_turns: 0,
            messages: Vec::new(),
        }
    }

    // ── Movimento ────────────────────────────────────────────────────────────

    /// Tenta mover o jogador. Retorna `true` se o movimento foi para uma
    /// posição diferente (para que o jogo avance o turno).
    /// A verificação de colisão com mapa e inimigos é feita em `game.rs`.
    pub fn move_by(&mut self, dx: i32, dy: i32) -> (usize, usize) {
        // Calcula nova posição com saturação (não vai abaixo de 0)
        let new_x = (self.x as i32 + dx).max(0) as usize;
        let new_y = (self.y as i32 + dy).max(0) as usize;
        (new_x, new_y)
    }

    // ── HP e dano ────────────────────────────────────────────────────────────

    /// Aplica dano ao jogador. `defense` reduz o dano, mínimo 1.
    pub fn take_damage(&mut self, raw_damage: i32) {
        let damage = (raw_damage - self.defense).max(1);
        self.hp = (self.hp - damage).max(0);
    }

    /// Cura o jogador, sem ultrapassar max_hp.
    pub fn heal(&mut self, amount: i32) {
        self.hp = (self.hp + amount).min(self.max_hp);
    }

    pub fn is_dead(&self) -> bool {
        self.hp <= 0
    }

    // ── Status effects ───────────────────────────────────────────────────────

    /// Processa efeitos de turno (veneno, etc). Chamado a cada turno.
    pub fn tick_effects(&mut self) {
        if self.poisoned_turns > 0 {
            self.hp = (self.hp - 1).max(0);
            self.poisoned_turns -= 1;
            self.add_message("Você sofre 1 de dano do veneno...".to_string());
        }
    }

    // ── Inventário ───────────────────────────────────────────────────────────

    /// Tenta pegar um item. Retorna false se o inventário estiver cheio.
    pub fn pick_up(&mut self, item: Item) -> bool {
        if self.inventory.len() >= 5 {
            self.add_message("Inventário cheio! Não é possível pegar mais itens.".to_string());
            return false;
        }
        self.add_message(format!("Você pegou: {}", item.name));
        self.inventory.push(item);
        true
    }

    /// Usa o item no índice dado. Retorna false se índice inválido.
    pub fn use_item(&mut self, index: usize) -> bool {
        if index >= self.inventory.len() {
            return false;
        }

        let item = self.inventory.remove(index);

        match item.item_type.as_str() {
            "potion" => {
                // Poção de vida: cura `value` HP
                self.heal(item.value);
                self.add_message(format!("Você usou {} e recuperou {} HP!", item.name, item.value));
            }
            "weapon" => {
                // Arma: aumenta ataque permanentemente
                self.attack += item.value;
                self.add_message(format!("Você equipou {}! Ataque +{}.", item.name, item.value));
            }
            "shield" => {
                // Escudo: aumenta defesa permanentemente
                self.defense += item.value;
                self.add_message(format!("Você equipou {}! Defesa +{}.", item.name, item.value));
            }
            "antidote" => {
                // Antídoto: remove veneno
                self.poisoned_turns = 0;
                self.add_message(format!("Você usou {}. Veneno curado!", item.name));
            }
            _ => {
                self.add_message(format!("{} não tem efeito conhecido.", item.name));
            }
        }

        true
    }

    // ── Log ──────────────────────────────────────────────────────────────────

    /// Adiciona mensagem ao log. Mantém no máximo 5 mensagens.
    pub fn add_message(&mut self, msg: String) {
        if self.messages.len() >= 5 {
            self.messages.remove(0); // remove a mais antiga
        }
        self.messages.push(msg);
    }
}
