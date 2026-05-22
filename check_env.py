import sys
import subprocess
import os

def check_version(cmd, name):
    try:
        result = subprocess.run([cmd, '--version'], capture_output=True, text=True, shell=True)
        print(f"✅ {name} detectado: {result.stdout.strip()}")
        return True
    except:
        print(f"❌ {name} NÃO ENCONTRADO.")
        return False

def main():
    print("="*60)
    print("      MINDPUNK LAB - AMBIENTE DE DESENVOLVIMENTO")
    print("="*60)
    print("Verificando pré-requisitos para o workshop...\n")

    python_ok = check_version('python', 'Python')
    node_ok = check_version('node', 'Node.js')
    rust_ok = check_version('cargo', 'Rust/Cargo')

    print("\n" + "="*60)
    if python_ok and node_ok and rust_ok:
        print("🚀 TUDO PRONTO! Seu ambiente está configurado para todos os jogos.")
    else:
        print("⚠️  AVISO: Alguns componentes estão faltando.")
        if not python_ok: print("- Instale Python 3.10+ para 'Deep Sea Coder' e 'Dungeon Crawler'")
        if not node_ok: print("- Instale Node.js 16+ para 'Fragmento 01' e 'Game-UW'")
        if not rust_ok: print("- Instale Rust para o 'Dungeon Crawler'")
    
    print("="*60)
    input("\nPressione Enter para sair...")

if __name__ == "__main__":
    main()
