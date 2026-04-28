// ─────────────────────────────────────────────────────────────────────────────
// combat.rs — Sistema de combate
//
// Fórmulas simples mas com variação aleatória para não ficar mecânico.
// Todo o combate é em turnos: jogador age, depois inimigos agem.
// ─────────────────────────────────────────────────────────────────────────────

use rand::Rng;
use crate::player::Player;
use crate::enemy::Enemy;

/// Resultado de uma troca de golpes.
pub struct CombatResult {
    /// O inimigo morreu? Usado em `resolve_combat` para decidir se ele contra-ataca.
    pub enemy_died: bool,
    /// Mensagem descritiva do combate (vai para o log do jogador).
    pub message: String,
}

/// Resolve um ataque do JOGADOR no inimigo.
///
/// Fórmula de dano:
///   base = player.attack
///   variação = ±25% aleatório
///   dano_final = (base * variação - enemy.defense).max(1)
pub fn player_attacks(player: &Player, enemy: &mut Enemy, rng: &mut impl Rng) -> CombatResult {
    // Variação de ±25%: multiplica por fator entre 0.75 e 1.25
    let factor = rng.gen_range(75u32..=125u32) as f32 / 100.0;
    let raw = (player.attack as f32 * factor) as i32;
    let damage = (raw - enemy.defense).max(1);

    enemy.take_damage(damage);
    let died = enemy.is_dead();

    let message = if died {
        format!("Você matou {} causando {} de dano!", enemy.name, damage)
    } else {
        format!("Você atacou {} por {} de dano. HP restante: {}/{}", enemy.name, damage, enemy.hp, enemy.max_hp)
    };

    CombatResult { enemy_died: died, message }
}

/// Resolve um ataque do INIMIGO no jogador.
///
/// Se o inimigo é do tipo Ranged, o dano é um pouco menor (simula projétil fraco).
pub fn enemy_attacks(enemy: &Enemy, player: &mut Player, rng: &mut impl Rng) -> CombatResult {
    // Inimigos Ranged causam 80% do dano normal
    let base = if enemy.behavior == crate::enemy::Behavior::Ranged {
        (enemy.attack as f32 * 0.8) as i32
    } else {
        enemy.attack
    };

    // Mesma variação de ±25%
    let factor = rng.gen_range(75u32..=125u32) as f32 / 100.0;
    let raw = (base as f32 * factor) as i32;
    let damage = (raw - player.defense).max(1);

    player.take_damage(damage);

    // Aplica veneno se o inimigo tiver essa propriedade (ex: Aranha)
    let mut message = format!("{} te atacou por {} de dano!", enemy.name, damage);
    if enemy.poisons && player.poisoned_turns == 0 && rng.gen_bool(0.5) {
        player.poisoned_turns = 4; // dura 4 turnos
        message.push_str(" Você foi envenenado!");
    }

    CombatResult { enemy_died: false, message }
}

/// Combate completo: jogador ataca → se inimigo sobreviveu, inimigo contra-ataca.
/// Retorna vetor de mensagens para o log.
pub fn resolve_combat(
    player: &mut Player,
    enemy: &mut Enemy,
    rng: &mut impl Rng,
) -> Vec<String> {
    let mut messages = Vec::new();

    // 1. Jogador ataca
    let attack_result = player_attacks(player, enemy, rng);
    messages.push(attack_result.message);

    // 2. Se o inimigo ainda vive, ele contra-ataca
    if !attack_result.enemy_died {
        let counter_result = enemy_attacks(enemy, player, rng);
        messages.push(counter_result.message);
    }

    messages
}
