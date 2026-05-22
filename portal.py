import os
import sys
import subprocess

# Configuração dos jogos disponíveis
# Caminhos relativos à raiz do repositório
GAMES = [
    {
        "id": "1",
        "name": "Deep Sea Coder (Python / Terminal)",
        "path": "jogos-exemplos/terminal/workshop-deep-sea-coder",
        "command": [sys.executable, "main.py"],
        "description": "Aprenda lógica de programação controlando um drone submarino."
    },
    {
        "id": "2",
        "name": "Fragmento 01 (React / Web)",
        "path": "jogos-exemplos/mindpunk-fragment-01",
        "command": ["npm", "run", "dev"],
        "description": "Roguelike em tempo real focado em Gerenciamento de Estado."
    },
    {
        "id": "3",
        "name": "Game-UW (Phaser 3 / Desktop)",
        "path": "jogos-exemplos/express/Game-UW",
        "command": ["npm", "run", "dev"],
        "description": "Simulador tático hexagonal com Inteligência Artificial."
    },
    {
        "id": "4",
        "name": "Dungeon Crawler (Rust / Performance)",
        "path": "jogos-exemplos/rust",
        "command": ["cargo", "run", "--release"],
        "description": "Roguelike de alta performance integrando Rust e Python via FFI."
    }
]

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    while True:
        clear()
        print("============================================================")
        print("                  MINDPUNK GAME PORTAL")
        print("       'Toda decisao cria. Toda criacao custa.'")
        print("============================================================")
        print("\nEscolha um jogo para iniciar:\n")

        for game in GAMES:
            print(f"[{game['id']}] {game['name']}")
            print(f"    {game['description']}\n")

        print("[Q] Sair")
        print("\n============================================================")
        
        choice = input("\nSua escolha: ").strip().lower()

        if choice == 'q':
            break

        selected_game = next((g for g in GAMES if g['id'] == choice), None)

        if selected_game:
            clear()
            print(f"Iniciando {selected_game['name']}...")
            print(f"Local: {selected_game['path']}")
            print("-" * 40)
            
            # Muda para o diretório do jogo
            original_dir = os.getcwd()
            game_dir = os.path.join(original_dir, selected_game['path'])
            
            try:
                os.chdir(game_dir)
                # Executa o comando
                # Shell=True é necessário no Windows para comandos como npm e cargo
                subprocess.run(selected_game['command'], shell=True)
            except Exception as e:
                print(f"ERRO ao iniciar o jogo: {e}")
                input("\nPressione Enter para voltar ao menu...")
            finally:
                os.chdir(original_dir)
        else:
            print("\nOpcao invalida!")
            import time
            time.sleep(1)

if __name__ == "__main__":
    main()
