// ─────────────────────────────────────────────────────────────────────────────
// fov.rs — Campo de visão (Field of View / Fog of War)
//
// Algoritmo: Shadowcasting simples (8 octantes).
// O jogador só vê tiles dentro do raio que não estejam "atrás" de uma parede.
// Tiles já vistos ficam "revelados" (exibidos escuros) mesmo fora do FOV atual.
//
// Por que Shadowcasting?
// - Mais realista que FOV circular simples (paredes bloqueiam visão)
// - Eficiente: O(r²) no pior caso
// - Implementação relativamente curta
// ─────────────────────────────────────────────────────────────────────────────

use crate::map::{Map, TileType, MAP_WIDTH, MAP_HEIGHT};

/// Raio de visão padrão do jogador (em tiles).
pub const DEFAULT_SIGHT: i32 = 8;

/// Recalcula quais tiles estão visíveis a partir de (origin_x, origin_y).
/// Limpa a visibilidade anterior e marca os novos tiles visíveis.
pub fn compute_fov(map: &mut Map, origin_x: usize, origin_y: usize, radius: i32) {
    // Limpa visibilidade de todos os tiles antes de recalcular
    for row in map.tiles.iter_mut() {
        for tile in row.iter_mut() {
            tile.visible = false;
        }
    }

    // O tile onde o jogador está é sempre visível
    map.tiles[origin_y][origin_x].visible = true;
    map.tiles[origin_y][origin_x].revealed = true;

    // Processa os 8 octantes do plano
    // Cada octante cobre 1/8 do círculo de visão
    for octant in 0..8 {
        cast_light(map, origin_x as i32, origin_y as i32, radius, octant);
    }
}

/// Projeta luz num octante específico usando o algoritmo de recursive shadowcasting.
/// `octant` é um número de 0 a 7 que rotaciona o espaço de cálculo.
fn cast_light(map: &mut Map, ox: i32, oy: i32, radius: i32, octant: u8) {
    scan_row(map, ox, oy, radius, octant, 1, 1.0, 0.0);
}

/// Varre uma "linha" do octante recursivamente.
/// `row`       — distância atual da origem
/// `start_slope` — limite superior do cone de visão
/// `end_slope`   — limite inferior do cone de visão
fn scan_row(
    map: &mut Map,
    ox: i32,
    oy: i32,
    radius: i32,
    octant: u8,
    row: i32,
    start_slope: f32,
    end_slope: f32,
) {
    if row > radius || start_slope < end_slope {
        return;
    }

    // Calcula o intervalo de colunas a analisar nesta linha
    let min_col = (row as f32 * end_slope - 0.5).floor() as i32;
    let max_col = (row as f32 * start_slope + 0.5).ceil() as i32;

    let mut new_start = start_slope;
    let mut was_blocking = false;

    for col in min_col..=max_col {
        // Transforma (row, col) do espaço do octante para coordenadas reais do mapa
        let (wx, wy) = octant_to_world(ox, oy, row, col, octant);

        // Verifica se está dentro dos limites do mapa
        if wx < 0 || wy < 0 || wx >= MAP_WIDTH as i32 || wy >= MAP_HEIGHT as i32 {
            continue;
        }

        let ux = wx as usize;
        let uy = wy as usize;

        // Verifica se está dentro do raio (círculo, não quadrado)
        let dist_sq = (wx - ox) * (wx - ox) + (wy - oy) * (wy - oy);
        if dist_sq <= radius * radius {
            map.tiles[uy][ux].visible = true;
            map.tiles[uy][ux].revealed = true;
        }

        let is_wall = map.tiles[uy][ux].tile_type == TileType::Wall;

        if was_blocking {
            if is_wall {
                // Continuação de um bloco de paredes: atualiza slope de início
                new_start = col_slope(col, row, true);
            } else {
                // Saiu de um bloco de paredes: retoma varredura
                was_blocking = false;
            }
        } else {
            if is_wall && row < radius {
                // Início de um bloco de paredes: processa a sub-coluna antes da parede
                scan_row(map, ox, oy, radius, octant, row + 1, new_start, col_slope(col, row, false));
                was_blocking = true;
                new_start = col_slope(col, row, true);
            }
        }
    }

    // Se a última coluna não era parede, continua na próxima linha
    if !was_blocking {
        scan_row(map, ox, oy, radius, octant, row + 1, new_start, end_slope);
    }
}

/// Calcula o slope (inclinação) de uma coluna.
/// `right_edge` = true para a borda direita, false para a esquerda.
fn col_slope(col: i32, row: i32, right_edge: bool) -> f32 {
    if right_edge {
        (col as f32 + 0.5) / (row as f32 - 0.5)
    } else {
        (col as f32 - 0.5) / (row as f32 + 0.5)
    }
}

/// Converte coordenadas (row, col) do octante N para (x, y) no mapa.
/// Cada octante é uma rotação/reflexão do espaço.
fn octant_to_world(ox: i32, oy: i32, row: i32, col: i32, octant: u8) -> (i32, i32) {
    match octant {
        0 => (ox + col, oy - row),
        1 => (ox + row, oy - col),
        2 => (ox + row, oy + col),
        3 => (ox + col, oy + row),
        4 => (ox - col, oy + row),
        5 => (ox - row, oy + col),
        6 => (ox - row, oy - col),
        7 => (ox - col, oy - row),
        _ => (ox, oy),
    }
}
