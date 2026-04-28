// ─────────────────────────────────────────────────────────────────────────────
// main.rs — Ponto de entrada do jogo
//
// Aqui acontece apenas o mínimo: inicializar os sistemas e passar o controle
// para o módulo `game`, que contém o loop principal.
// ─────────────────────────────────────────────────────────────────────────────

// Declara todos os módulos do projeto para que o compilador os inclua.
mod combat;
mod enemy;
mod fov;
mod game;
mod map;
mod player;
mod python_bridge;
mod renderer;

use crossterm::{
    terminal::{disable_raw_mode, enable_raw_mode},
    ExecutableCommand,
    terminal::{EnterAlternateScreen, LeaveAlternateScreen},
};
use std::io::stdout;

fn main() {
    // "Raw mode" faz o terminal enviar cada tecla imediatamente, sem esperar
    // Enter. Essencial para jogos onde cada tecla é uma ação.
    enable_raw_mode().expect("Não foi possível ativar o raw mode do terminal");

    // "Alternate screen" é uma segunda tela do terminal — o jogo roda aqui e,
    // ao sair, o terminal volta ao estado original sem sujar o histórico.
    stdout()
        .execute(EnterAlternateScreen)
        .expect("Não foi possível entrar na tela alternativa");

    // Roda o jogo. Qualquer erro fatal é exibido depois que o terminal é
    // restaurado (veja o bloco abaixo).
    let result = game::run();

    // ── Limpeza obrigatória ──────────────────────────────────────────────────
    // Mesmo que o jogo tenha dado erro, precisamos restaurar o terminal.
    // Se não fizermos isso, o usuário fica "preso" no modo raw sem conseguir
    // digitar normalmente.
    stdout()
        .execute(LeaveAlternateScreen)
        .expect("Não foi possível sair da tela alternativa");

    disable_raw_mode().expect("Não foi possível desativar o raw mode");

    // Agora que o terminal está normal, podemos exibir erros se houver.
    if let Err(e) = result {
        eprintln!("Erro fatal no jogo: {}", e);
        std::process::exit(1);
    }
}
