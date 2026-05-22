"""
================================================================================
MINDPUNK - SRC_COMENTADO: Deep Sea Coder
================================================================================
Este arquivo é uma versão ultra-comentada do main.py.
O objetivo é explicar CADA decisão técnica e como ela reflete no Game Design.

CONCEITOS CHAVE:
1. Game State (Dicionários)
2. Command Pattern (Simulado)
3. Feedback Loops (Visual vs Lógica)
================================================================================
"""

import os
import time
import random

# ------------------------------------------------------------------------------
# 1. CONFIGURAÇÕES (Constantes)
# ------------------------------------------------------------------------------
# Usamos letras maiúsculas para valores que não mudam durante o jogo.
# Isso ajuda os alunos a entenderem a diferença entre "estado" e "configuração".
OCEANO_PROFUNDIDADE = 10
CUSTO_ENERGIA_MOVIMENTO = 5
VALOR_MINERIO = 10

# ------------------------------------------------------------------------------
# 2. ESTADO DO JOGO (The "Brain")
# ------------------------------------------------------------------------------
# Em vez de variáveis soltas, usamos um DICIONÁRIO.
# Por que? Porque fica fácil de salvar, resetar ou passar para outras funções.
# É a forma mais simples de "State Management".
drone = {
    "posicao": 0,       # Onde o drone está no grid vertical
    "energia": 100,     # Recurso limitador (Tensão)
    "carga": 0,         # Inventário atual
    "capacidade": 5,    # Limite de inventário (Decisão de Risco)
    "moedas": 0,        # Progresso persistente
    "vivo": True        # Flag de Game Over
}

# ------------------------------------------------------------------------------
# 3. RENDERIZAÇÃO (The "Visuals")
# ------------------------------------------------------------------------------
def desenhar_mundo(status_msg=""):
    """
    Esta função é o 'RENDER' do nosso game loop.
    Ela limpa o terminal e redesenha tudo do zero a cada frame/ação.
    """
    # Limpar o terminal cria a ilusão de movimento
    os.system('cls' if os.name == 'nt' else 'clear')
    
    # UI Superior
    print("=" * 50)
    print(f" 🔋 {drone['energia']}%  |  📦 {drone['carga']}/{drone['capacidade']}  |  💰 ${drone['moedas']}")
    print("=" * 50)
    
    # Gerador Visual do Oceano
    # Usamos um loop 'for' para desenhar cada "camada" do mar.
    for i in range(OCEANO_PROFUNDIDADE + 1):
        if i == 0:
            linha = "  [⚓ BASE] " # Nível 0 é sempre a base
        elif i == drone['posicao']:
            linha = "    [🛸]    <-- DRONE" # Representação do player
        else:
            linha = "     |      "
            
        # Adiciona um elemento visual aleatório para dar "vida" ao mar
        if i > 0 and i != drone['posicao'] and random.random() > 0.85:
            linha += " ✨ (Minério)"
            
        print(linha)
    
    print("=" * 50)
    if status_msg:
        print(f" > {status_msg}")
    print("=" * 50)

# ------------------------------------------------------------------------------
# 4. PROCESSAMENTO DE COMANDOS (The "Logic")
# ------------------------------------------------------------------------------
def executar_comandos(sequencia):
    """
    Aqui simulamos um 'Buffer de Comandos'. 
    O jogador digita uma string (ex: 'FFF') e nós iteramos sobre ela.
    Isso ensina processamento de sequências e loops.
    """
    for cmd in sequencia.upper():
        if not drone['vivo']: break
        
        msg = ""
        # Toda ação custa energia. Isso força o jogador a ser EFICIENTE.
        drone['energia'] -= CUSTO_ENERGIA_MOVIMENTO
        
        # Estrutura IF/ELIF para tratar cada comando possível
        if cmd == 'F': # Frente = Descer
            if drone['posicao'] < OCEANO_PROFUNDIDADE:
                drone['posicao'] += 1
                msg = "Drone descendo para as profundezas..."
            else:
                msg = "BATEU! O fundo do mar impede o avanço."
        
        elif cmd == 'T': # Trás = Subir
            if drone['posicao'] > 0:
                drone['posicao'] -= 1
                msg = "Propulsores acionados! Subindo..."
            else:
                msg = "Superfície alcançada."
        
        elif cmd == 'M': # Minerar
            if drone['posicao'] > 0:
                if drone['carga'] < drone['capacidade']:
                    drone['carga'] += 1
                    msg = "Braço mecânico coletou minério!"
                else:
                    msg = "ERRO: Capacidade de carga esgotada."
            else:
                msg = "Nada para minerar na superfície."
        
        elif cmd == 'V': # Vender/Recarregar
            if drone['posicao'] == 0:
                ganho = drone['carga'] * VALOR_MINERIO
                drone['moedas'] += ganho
                drone['energia'] = 100 
                drone['carga'] = 0
                msg = f"TRANSACAO: +${ganho} | Bateria recarregada."
            else:
                msg = "AVISO: Sistema de ancoragem só funciona na BASE."

        # Checa condição de derrota
        if drone['energia'] <= 0:
            drone['vivo'] = False
            msg = "!!! ALERTA: ENERGIA CRÍTICA - DRONE DESATIVADO !!!"

        # Chamamos o renderizador a cada comando para a 'animação' acontecer
        desenhar_mundo(msg)
        time.sleep(0.7) # Delay vital para o cérebro humano processar a mudança

# ------------------------------------------------------------------------------
# 5. ENTRY POINT
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    # O loop do jogo continua enquanto o drone estiver funcional
    while drone['vivo']:
        desenhar_mundo("Aguardando sequência de pulso...")
        
        print("\n COMANDOS:")
        print(" F: Descer | T: Subir | M: Minerar | V: Vender/Recarregar")
        
        entrada = input("\n Digite a sequência (ex: FFFMMTTTV): ")
        
        if entrada.lower() == 'sair':
            break
            
        executar_comandos(entrada)
        
    if not drone['vivo']:
        print("\n" + "!"*50)
        print(" GAME OVER: O oceano venceu desta vez.")
        print("!"*50)
