// ─────────────────────────────────────────────────────────────────────────────
// game.rs — Loop principal do jogo
//
// Orquestra tudo: carrega dados do Python, gera o mapa, processa input,
// atualiza estado e chama o renderer.
//
// Fluxo por turno:
//   1. Render (exibe o estado atual)
//   2. Input (lê tecla do jogador)
//   3. Ação do jogador (mover, atacar, usar item, esperar)
//   4. Efeitos de turno (veneno, etc)
//   5. IA dos inimigos
//   6. Checa condições de vitória/derrota
//   7. Volta ao passo 1
// ─────────────────────────────────────────────────────────────────────────────

use std::io::{self, stdout};
use crossterm::event::{self, Event, KeyCode, KeyEventKind};

use crate::map::{Map, TileType};
use crate::player::{Player, Item};
use crate::enemy::Enemy;
use crate::fov::{compute_fov, DEFAULT_SIGHT};
use crate::combat::resolve_combat;
use crate::renderer;
use crate::python_bridge::{self, EnemyTemplate, ItemTemplate};

use rand::Rng;

// ─────────────────────────────────────────────────────────────────────────────
// Estado global do jogo
// ─────────────────────────────────────────────────────────────────────────────

struct GameState {
    map: Map,
    player: Player,
    enemies: Vec<Enemy>,
    /// Itens no chão: (x, y, template do item)
    items_on_floor: Vec<(usize, usize, ItemTemplate)>,
    /// Templates carregados do Python — mantidos para spawnar em novos andares
    enemy_templates: Vec<EnemyTemplate>,
    item_templates: Vec<ItemTemplate>,
    /// Andar final (o jogador ganha ao descer deste)
    max_floors: u32,
}

// ─────────────────────────────────────────────────────────────────────────────
// Ponto de entrada público (chamado por main.rs)
// ─────────────────────────────────────────────────────────────────────────────

pub fn run() -> io::Result<()> {
    let mut stdout = stdout();

    // ── 1. Carrega dados do Python ────────────────────────────────────────────
    // Esta é a chamada cruzada Rust→Python via PyO3.
    // Se os scripts não existirem ou tiverem erro, o jogo usa dados mínimos de fallback.
    let enemy_templates = python_bridge::load_enemy_templates();
    let item_templates  = python_bridge::load_item_templates();

    // ── 2. Cria o primeiro andar ──────────────────────────────────────────────
    let mut state = new_floor(1, enemy_templates, item_templates);

    // ── 3. Loop principal ─────────────────────────────────────────────────────
    loop {
        // Recalcula campo de visão antes de renderizar
        compute_fov(&mut state.map, state.player.x, state.player.y, DEFAULT_SIGHT);

        // Renderiza tudo
        renderer::render_all(
            &mut stdout,
            &state.map,
            &state.player,
            &state.enemies,
            &state.items_on_floor.iter()
                .map(|(x, y, t)| (*x, *y, t.name.clone()))
                .collect::<Vec<_>>(),
        )?;

        // Lê input (bloqueante — espera o jogador agir)
        let action = read_input()?;

        match action {
            Action::Quit => break,
            Action::None => continue, // tecla ignorada, não avança turno
            Action::UseItem(idx) => {
                // Usa item do inventário (não avança turno se índice inválido)
                if !state.player.use_item(idx) {
                    continue;
                }
            }
            Action::Move(dx, dy) => {
                let (nx, ny) = state.player.move_by(dx, dy);
                handle_player_move(&mut state, nx, ny);
            }
            Action::Wait => {
                // Esperar ainda avança o turno (inimigos agem)
                state.player.add_message("Você espera...".to_string());
            }
        }

        // ── Efeitos de turno ────────────────────────────────────────────────
        state.player.tick_effects();

        // ── IA dos inimigos ─────────────────────────────────────────────────
        run_enemy_ai(&mut state);

        // ── Checa derrota ────────────────────────────────────────────────────
        if state.player.is_dead() {
            compute_fov(&mut state.map, state.player.x, state.player.y, DEFAULT_SIGHT);
            renderer::render_game_over(&mut stdout, &state.player)?;
            wait_any_key()?;
            break;
        }

        // ── Checa vitória ────────────────────────────────────────────────────
        if state.player.floor > state.max_floors {
            renderer::render_victory(&mut stdout, &state.player)?;
            wait_any_key()?;
            break;
        }
    }

    Ok(())
}

// ─────────────────────────────────────────────────────────────────────────────
// Ação do jogador
// ─────────────────────────────────────────────────────────────────────────────

enum Action {
    Move(i32, i32),
    Wait,
    UseItem(usize),
    Quit,
    None, // tecla sem efeito
}

fn read_input() -> io::Result<Action> {
    loop {
        // Espera por um evento de teclado
        if let Event::Key(key_event) = event::read()? {
            // No Windows, eventos de tecla disparam Press E Release.
            // Só processa Press para evitar ações duplicadas.
            if key_event.kind != KeyEventKind::Press {
                continue;
            }

            return Ok(match key_event.code {
                // Movimento: WASD e setas
                KeyCode::Char('w') | KeyCode::Up    => Action::Move(0, -1),
                KeyCode::Char('s') | KeyCode::Down  => Action::Move(0, 1),
                KeyCode::Char('a') | KeyCode::Left  => Action::Move(-1, 0),
                KeyCode::Char('d') | KeyCode::Right => Action::Move(1, 0),
                // Diagonais
                KeyCode::Char('q') => Action::Move(-1, -1),
                KeyCode::Char('e') => Action::Move(1, -1),
                KeyCode::Char('z') => Action::Move(-1, 1),
                KeyCode::Char('c') => Action::Move(1, 1),
                // Esperar
                KeyCode::Char('.') | KeyCode::Char(' ') => Action::Wait,
                // Usar item (1-5)
                KeyCode::Char('1') => Action::UseItem(0),
                KeyCode::Char('2') => Action::UseItem(1),
                KeyCode::Char('3') => Action::UseItem(2),
                KeyCode::Char('4') => Action::UseItem(3),
                KeyCode::Char('5') => Action::UseItem(4),
                // Sair
                KeyCode::Char('Q') | KeyCode::Esc => Action::Quit,
                _ => Action::None,
            });
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Movimento e interação do jogador
// ─────────────────────────────────────────────────────────────────────────────

fn handle_player_move(state: &mut GameState, nx: usize, ny: usize) {
    // ── Tenta atacar inimigo na posição destino ─────────────────────────────
    if let Some(enemy_idx) = enemy_at(&state.enemies, nx, ny) {
        let mut rng = rand::thread_rng();
        let messages = resolve_combat(&mut state.player, &mut state.enemies[enemy_idx], &mut rng);

        for msg in messages {
            state.player.add_message(msg);
        }

        // Remove inimigo se morreu
        if state.enemies[enemy_idx].is_dead() {
            state.player.kills += 1;
            state.enemies.remove(enemy_idx);
        }
        return; // atacar não move o jogador
    }

    // ── Verifica se pode mover para a posição ───────────────────────────────
    if !state.map.is_walkable(nx, ny) {
        return; // bate na parede, turno não avança
    }

    // Movimento válido
    state.player.x = nx;
    state.player.y = ny;

    // ── Pega item no chão ───────────────────────────────────────────────────
    if let Some(item_idx) = item_at(&state.items_on_floor, nx, ny) {
        let (_, _, template) = state.items_on_floor.remove(item_idx);
        let item = Item {
            name: template.name,
            item_type: template.item_type,
            value: template.value,
            symbol: template.symbol,
        };
        state.player.pick_up(item);
    }

    // ── Escada para o próximo andar ─────────────────────────────────────────
    if state.map.tiles[ny][nx].tile_type == TileType::Stairs {
        let next_floor = state.player.floor + 1;

        if next_floor > state.max_floors {
            // Passou do último andar → vitória (detectada no loop principal)
            state.player.floor = next_floor;
            state.player.add_message("Você saiu das ruínas. Parabéns!".to_string());
        } else {
            // Salva tudo do jogador antes de destruir o estado do andar atual
            let saved_hp        = state.player.hp;
            let saved_max_hp    = state.player.max_hp;
            let saved_attack    = state.player.attack;
            let saved_defense   = state.player.defense;
            let saved_kills     = state.player.kills;
            let saved_inventory = std::mem::take(&mut state.player.inventory);
            let saved_poison    = state.player.poisoned_turns;
            let saved_messages  = std::mem::take(&mut state.player.messages);

            let templates_e = std::mem::take(&mut state.enemy_templates);
            let templates_i = std::mem::take(&mut state.item_templates);
            *state = new_floor(next_floor, templates_e, templates_i);

            // Restaura os stats (posição e número do andar vêm do novo mapa)
            state.player.hp             = saved_hp;
            state.player.max_hp         = saved_max_hp;
            state.player.attack         = saved_attack;
            state.player.defense        = saved_defense;
            state.player.kills          = saved_kills;
            state.player.inventory      = saved_inventory;
            state.player.poisoned_turns = saved_poison;
            state.player.messages       = saved_messages;
            state.player.add_message(format!("Bem-vindo ao andar {}!", next_floor));
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// IA dos inimigos
// ─────────────────────────────────────────────────────────────────────────────

fn run_enemy_ai(state: &mut GameState) {
    let mut rng = rand::thread_rng();
    let px = state.player.x;
    let py = state.player.y;

    // Percorre todos os inimigos
    // Nota: clonar índices evita problemas de borrow ao mutar inimigos
    let enemy_count = state.enemies.len();

    for i in 0..enemy_count {
        if i >= state.enemies.len() { break; } // pode ter removido inimigos
        if state.enemies[i].is_dead() { continue; }

        let ex = state.enemies[i].x;
        let ey = state.enemies[i].y;

        // Ativa o inimigo se ele está no campo de visão do jogador OU se o
        // jogador está dentro do alcance de visão do próprio inimigo.
        // Isso faz o sight_range do Python ter efeito real: inimigos com visão
        // maior tomam iniciativa antes de serem vistos pelo jogador.
        let in_player_fov  = state.map.tiles[ey][ex].visible;
        let dist_to_player = crate::enemy::chebyshev_dist(ex, ey, px, py);
        let enemy_sees_player = dist_to_player <= state.enemies[i].sight_range;

        if in_player_fov || enemy_sees_player {
            state.enemies[i].seen_by_player = true;
        }

        if !state.enemies[i].seen_by_player {
            continue;
        }

        // Verifica distância para decidir entre atacar ou mover
        let can_melee = state.enemies[i].can_attack(px, py);
        let is_ranged = state.enemies[i].behavior == crate::enemy::Behavior::Ranged;
        let can_shoot = is_ranged && state.enemies[i].can_ranged_attack(px, py);

        if can_melee || can_shoot {
            // Ataca o jogador
            let result = crate::combat::enemy_attacks(&state.enemies[i], &mut state.player, &mut rng);
            state.player.add_message(result.message);
        } else {
            // Move em direção ao jogador
            // Precisamos de closure que acessa o mapa e a posição dos outros inimigos
            let map_ref = &state.map;
            let enemies_snapshot: Vec<(usize, usize)> = state.enemies.iter()
                .enumerate()
                .filter(|(j, _)| *j != i)
                .map(|(_, e)| (e.x, e.y))
                .collect();

            let (nx, ny) = state.enemies[i].next_move(
                px,
                py,
                &|x, y| {
                    map_ref.is_walkable(x, y)
                    && !enemies_snapshot.contains(&(x, y))
                    && !(x == px && y == py) // não anda em cima do jogador (ataca em vez disso)
                },
                &mut rng,
            );

            state.enemies[i].x = nx;
            state.enemies[i].y = ny;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Geração de andar
// ─────────────────────────────────────────────────────────────────────────────

fn new_floor(
    floor: u32,
    enemy_templates: Vec<EnemyTemplate>,
    item_templates: Vec<ItemTemplate>,
) -> GameState {
    let mut rng = rand::thread_rng();

    let map = Map::generate(floor);
    let (px, py) = map.player_start();
    let mut player = Player::new(px, py);
    player.floor = floor;

    // ── Spawn de inimigos ────────────────────────────────────────────────────
    // Filtra templates disponíveis para este andar
    let available_enemies: Vec<&EnemyTemplate> = enemy_templates.iter()
        .filter(|t| t.min_floor <= floor)
        .collect();

    let mut enemies = Vec::new();
    // Número de inimigos cresce com o andar
    let enemy_count = (floor * 2 + 3) as usize;

    // Pula a primeira sala (onde o jogador começa)
    let rooms_for_enemies = &map.rooms[1..];

    for room in rooms_for_enemies.iter().take(enemy_count) {
        if available_enemies.is_empty() { break; }

        // Escolhe template aleatório
        let template = available_enemies[rng.gen_range(0..available_enemies.len())];
        let (ex, ey) = room.center();

        enemies.push(Enemy::new(
            template.name.clone(),
            template.symbol,
            ex,
            ey,
            template.hp,
            template.attack,
            template.defense,
            &template.behavior,
            template.poisons,
            template.sight_range,
        ));
    }

    // ── Spawn de itens ────────────────────────────────────────────────────────
    let loot_names = python_bridge::get_loot_for_floor(floor);
    let mut items_on_floor = Vec::new();

    for (room_idx, item_name) in loot_names.iter().enumerate() {
        // Coloca item no centro de salas alternadas (não na sala do jogador)
        let room_idx_offset = (room_idx + 2) % map.rooms.len();
        let (ix, iy) = map.rooms[room_idx_offset].center();

        // Acha o template pelo nome
        if let Some(template) = item_templates.iter().find(|t| &t.name == item_name) {
            items_on_floor.push((ix, iy, template.clone()));
        }
    }

    GameState {
        map,
        player,
        enemies,
        items_on_floor,
        enemy_templates,
        item_templates,
        max_floors: 5,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────────

/// Retorna o índice do inimigo na posição (x, y), se houver.
fn enemy_at(enemies: &[Enemy], x: usize, y: usize) -> Option<usize> {
    enemies.iter().position(|e| e.x == x && e.y == y && !e.is_dead())
}

/// Retorna o índice do item no chão na posição (x, y), se houver.
fn item_at(items: &[(usize, usize, ItemTemplate)], x: usize, y: usize) -> Option<usize> {
    items.iter().position(|(ix, iy, _)| *ix == x && *iy == y)
}

/// Aguarda qualquer tecla ser pressionada.
fn wait_any_key() -> io::Result<()> {
    loop {
        if let Event::Key(k) = event::read()? {
            if k.kind == KeyEventKind::Press {
                break;
            }
        }
    }
    Ok(())
}
