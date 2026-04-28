// ─────────────────────────────────────────────────────────────────────────────
// renderer.rs — Renderização do jogo no terminal
//
// Usa `crossterm` para:
//   - Posicionar o cursor em qualquer célula da tela
//   - Pintar caracteres com cores (RGB ou paleta de 16 cores)
//   - Limpar a tela de forma eficiente (só redesenha o que muda)
//
// Layout da tela:
//   ┌─────────────────────────────┐
//   │MAPA (MAP_WIDTH x MAP_HEIGHT)│  linhas 0..MAP_HEIGHT
//   ├─────────────────────────────┤
//   │  HUD (stats do jogador)     │  linha MAP_HEIGHT + 1
//   ├─────────────────────────────┤
//   │  LOG (mensagens)            │  linhas MAP_HEIGHT+2 .. +7
//   └─────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

use std::io::{self, Write};
use crossterm::{
    cursor::MoveTo,
    style::{Color, Print, SetForegroundColor, ResetColor},
    terminal::Clear,
    terminal::ClearType,
    QueueableCommand,
};

use crate::map::{Map, TileType, MAP_WIDTH, MAP_HEIGHT};
use crate::player::Player;
use crate::enemy::Enemy;

// ── Cores ──────────────────────────────────────────────────────────────────

// Paleta de cores do jogo
const COLOR_WALL_VISIBLE:    Color = Color::Rgb { r: 120, g: 120, b: 120 };
const COLOR_WALL_REVEALED:   Color = Color::Rgb { r: 50,  g: 50,  b: 50  };
const COLOR_FLOOR_VISIBLE:   Color = Color::Rgb { r: 200, g: 180, b: 120 };
const COLOR_FLOOR_REVEALED:  Color = Color::Rgb { r: 70,  g: 60,  b: 40  };
const COLOR_STAIRS:          Color = Color::Rgb { r: 255, g: 215, b: 0   }; // dourado
const COLOR_PLAYER:          Color = Color::Rgb { r: 255, g: 255, b: 100 }; // amarelo brilhante
const COLOR_ENEMY_NORMAL:    Color = Color::Rgb { r: 220, g: 80,  b: 80  }; // vermelho
const COLOR_ENEMY_BOSS:      Color = Color::Rgb { r: 255, g: 0,   b: 150 }; // magenta
const COLOR_ITEM:            Color = Color::Rgb { r: 100, g: 220, b: 100 }; // verde
const COLOR_HUD_TEXT:        Color = Color::White;
const COLOR_HUD_HP_OK:       Color = Color::Rgb { r: 100, g: 220, b: 100 };
const COLOR_HUD_HP_LOW:      Color = Color::Rgb { r: 220, g: 80,  b: 80  };
const COLOR_MSG:             Color = Color::Rgb { r: 200, g: 200, b: 200 };
const COLOR_POISON_TEXT:     Color = Color::Rgb { r: 150, g: 255, b: 50  };

// ── Ponto de entrada ────────────────────────────────────────────────────────

/// Redesenha tudo: mapa, inimigos, itens, jogador e HUD.
/// Chamado a cada frame (uma vez por turno).
pub fn render_all(
    stdout: &mut impl Write,
    map: &Map,
    player: &Player,
    enemies: &[Enemy],
    items_on_map: &[(usize, usize, String)], // (x, y, nome do item)
) -> io::Result<()> {
    // Limpa a tela inteira antes de redesenhar
    stdout.queue(Clear(ClearType::All))?;

    render_map(stdout, map)?;
    render_items(stdout, map, items_on_map)?;
    render_enemies(stdout, map, enemies)?;
    render_player(stdout, player)?;
    render_hud(stdout, player)?;
    render_messages(stdout, player)?;

    stdout.flush()?;
    Ok(())
}

// ── Mapa ────────────────────────────────────────────────────────────────────

fn render_map(stdout: &mut impl Write, map: &Map) -> io::Result<()> {
    for y in 0..MAP_HEIGHT {
        for x in 0..MAP_WIDTH {
            let tile = &map.tiles[y][x];

            // Só desenha tiles que o jogador já viu
            if !tile.revealed {
                stdout.queue(MoveTo(x as u16, y as u16))?;
                stdout.queue(SetForegroundColor(Color::Black))?;
                stdout.queue(Print(' '))?;
                continue;
            }

            // Escolhe símbolo e cor baseado no tipo e visibilidade
            let (symbol, color) = match tile.tile_type {
                TileType::Wall => {
                    let c = if tile.visible { COLOR_WALL_VISIBLE } else { COLOR_WALL_REVEALED };
                    ('#', c)
                }
                TileType::Floor => {
                    let c = if tile.visible { COLOR_FLOOR_VISIBLE } else { COLOR_FLOOR_REVEALED };
                    ('.', c)
                }
                TileType::Stairs => (
                    '>',
                    if tile.visible { COLOR_STAIRS } else { COLOR_FLOOR_REVEALED },
                ),
            };

            stdout.queue(MoveTo(x as u16, y as u16))?;
            stdout.queue(SetForegroundColor(color))?;
            stdout.queue(Print(symbol))?;
        }
    }
    Ok(())
}

// ── Itens no mapa ────────────────────────────────────────────────────────────

fn render_items(
    stdout: &mut impl Write,
    map: &Map,
    items: &[(usize, usize, String)],
) -> io::Result<()> {
    for (x, y, _name) in items {
        if *x >= MAP_WIDTH || *y >= MAP_HEIGHT { continue; }
        // Só exibe itens em tiles visíveis
        if !map.tiles[*y][*x].visible { continue; }

        stdout.queue(MoveTo(*x as u16, *y as u16))?;
        stdout.queue(SetForegroundColor(COLOR_ITEM))?;
        stdout.queue(Print('!'))?; // '!' representa qualquer item no chão
    }
    Ok(())
}

// ── Inimigos ─────────────────────────────────────────────────────────────────

fn render_enemies(stdout: &mut impl Write, map: &Map, enemies: &[Enemy]) -> io::Result<()> {
    for enemy in enemies {
        if enemy.x >= MAP_WIDTH || enemy.y >= MAP_HEIGHT { continue; }
        // Só exibe inimigos em tiles visíveis
        if !map.tiles[enemy.y][enemy.x].visible { continue; }

        // Chefões (Boss) têm cor diferente para chamar atenção
        let color = if enemy.behavior == crate::enemy::Behavior::Boss {
            COLOR_ENEMY_BOSS
        } else {
            COLOR_ENEMY_NORMAL
        };

        stdout.queue(MoveTo(enemy.x as u16, enemy.y as u16))?;
        stdout.queue(SetForegroundColor(color))?;
        stdout.queue(Print(enemy.symbol))?;
    }
    Ok(())
}

// ── Jogador ──────────────────────────────────────────────────────────────────

fn render_player(stdout: &mut impl Write, player: &Player) -> io::Result<()> {
    stdout.queue(MoveTo(player.x as u16, player.y as u16))?;
    stdout.queue(SetForegroundColor(COLOR_PLAYER))?;
    stdout.queue(Print('@'))?;
    Ok(())
}

// ── HUD (linha de stats) ─────────────────────────────────────────────────────

fn render_hud(stdout: &mut impl Write, player: &Player) -> io::Result<()> {
    let hud_y = (MAP_HEIGHT + 1) as u16;

    // Cor do HP: verde se > 50%, vermelho se ≤ 50%
    let hp_color = if player.hp > player.max_hp / 2 { COLOR_HUD_HP_OK } else { COLOR_HUD_HP_LOW };

    stdout.queue(MoveTo(0, hud_y))?;
    stdout.queue(SetForegroundColor(COLOR_HUD_TEXT))?;
    stdout.queue(Print(format!(
        "Andar:{} | Mortes:{} | ATK:{} DEF:{} | ",
        player.floor, player.kills, player.attack, player.defense
    )))?;

    // HP em cor separada
    stdout.queue(SetForegroundColor(hp_color))?;
    stdout.queue(Print(format!("HP:{}/{}", player.hp, player.max_hp)))?;

    // Indicador de veneno
    if player.poisoned_turns > 0 {
        stdout.queue(SetForegroundColor(COLOR_POISON_TEXT))?;
        stdout.queue(Print(format!(" [ENVENENADO:{}t]", player.poisoned_turns)))?;
    }

    // Inventário resumido
    stdout.queue(SetForegroundColor(COLOR_HUD_TEXT))?;
    let inv_str: String = player.inventory.iter()
        .enumerate()
        .map(|(i, item)| format!(" [{}]{}", i + 1, item.symbol))
        .collect();
    stdout.queue(Print(format!(" | Inv:{}", if inv_str.is_empty() { " vazio".to_string() } else { inv_str })))?;

    // Controles na mesma linha
    stdout.queue(Print("  | WASD/Setas=mover  .=esperar  1-5=usar item  Q=sair"))?;

    stdout.queue(ResetColor)?;
    Ok(())
}

// ── Log de mensagens ─────────────────────────────────────────────────────────

fn render_messages(stdout: &mut impl Write, player: &Player) -> io::Result<()> {
    let msg_start_y = (MAP_HEIGHT + 2) as u16;

    for (i, msg) in player.messages.iter().enumerate() {
        stdout.queue(MoveTo(0, msg_start_y + i as u16))?;
        stdout.queue(SetForegroundColor(COLOR_MSG))?;
        stdout.queue(Print(msg))?;
    }

    stdout.queue(ResetColor)?;
    Ok(())
}

// ── Telas especiais ──────────────────────────────────────────────────────────

/// Tela de Game Over.
pub fn render_game_over(stdout: &mut impl Write, player: &Player) -> io::Result<()> {
    stdout.queue(Clear(ClearType::All))?;
    stdout.queue(MoveTo(30, 15))?;
    stdout.queue(SetForegroundColor(Color::Red))?;
    stdout.queue(Print("╔══════════════════════╗"))?;
    stdout.queue(MoveTo(30, 16))?;
    stdout.queue(Print("║     GAME  OVER       ║"))?;
    stdout.queue(MoveTo(30, 17))?;
    stdout.queue(Print("╚══════════════════════╝"))?;
    stdout.queue(MoveTo(30, 19))?;
    stdout.queue(SetForegroundColor(Color::White))?;
    stdout.queue(Print(format!("Você chegou ao andar {}  |  {} inimigos mortos", player.floor, player.kills)))?;
    stdout.queue(MoveTo(30, 21))?;
    stdout.queue(Print("Pressione qualquer tecla para sair..."))?;
    stdout.queue(ResetColor)?;
    stdout.flush()?;
    Ok(())
}

/// Tela de vitória (chegou ao fim do andar 5).
pub fn render_victory(stdout: &mut impl Write, player: &Player) -> io::Result<()> {
    stdout.queue(Clear(ClearType::All))?;
    stdout.queue(MoveTo(28, 14))?;
    stdout.queue(SetForegroundColor(Color::Rgb { r: 255, g: 215, b: 0 }))?;
    stdout.queue(Print("╔══════════════════════════╗"))?;
    stdout.queue(MoveTo(28, 15))?;
    stdout.queue(Print("║     VOCE VENCEU!!!       ║"))?;
    stdout.queue(MoveTo(28, 16))?;
    stdout.queue(Print("╚══════════════════════════╝"))?;
    stdout.queue(MoveTo(28, 18))?;
    stdout.queue(SetForegroundColor(Color::White))?;
    stdout.queue(Print(format!("{} inimigos eliminados", player.kills)))?;
    stdout.queue(MoveTo(28, 20))?;
    stdout.queue(Print("Pressione qualquer tecla para sair..."))?;
    stdout.queue(ResetColor)?;
    stdout.flush()?;
    Ok(())
}
