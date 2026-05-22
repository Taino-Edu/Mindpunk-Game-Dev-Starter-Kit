import os
import time
import random

# --- CONFIGURAÇÕES E ESTILO ---
# Podemos ensinar sobre constantes aqui
OCEANO_PROFUNDIDADE = 10
COMANDOS_DISPONIVEIS = ['F', 'T', 'M', 'V']

# --- ESTADO INICIAL DO JOGO ---
# Ótima oportunidade para explicar Dicionários (Chave: Valor)
drone = {
    "posicao": 0,      # 0 é a base (superfície)
    "energia": 100,    # Consome ao se mover
    "carga": 0,        # Minérios coletados
    "capacidade": 5,   # Limite de carga
    "moedas": 0,       # Dinheiro para upgrades
    "vivo": True
}

def limpar_tela():
    # Comando que funciona em Windows (cls) e Linux/Mac (clear)
    os.system('cls' if os.name == 'nt' else 'clear')

def desenhar_mundo(status_msg=""):
    limpar_tela()
    print("-" * 40)
    print(f" DEEP SEA CODER - STATUS: ENERGIA {drone['energia']}% | CARGA {drone['carga']}/{drone['capacidade']} | MOEDAS ${drone['moedas']}")
    print("-" * 40)
    
    # Desenha o mar
    for i in range(OCEANO_PROFUNDIDADE + 1):
        if i == 0:
            linha = "  [ BASE ]  "
        elif i == drone['posicao']:
            linha = "    [O]     <-- SEU DRONE"
        else:
            linha = "     |      "
        
        # Adiciona minérios aleatórios visualmente (apenas para o clima)
        if i > 0 and i != drone['posicao'] and random.random() > 0.8:
            linha += "  (.) Minério"
            
        print(linha)
    
    print("-" * 40)
    if status_msg:
        print(f"LOG: {status_msg}")
    print("-" * 40)

def executar_comandos(sequencia):
    """
    Processa a string de comandos como 'FFMFV'
    """
    for cmd in sequencia.upper():
        if not drone['vivo']: break
        
        msg = ""
        # Gasto de energia por ação
        drone['energia'] -= 5
        
        if cmd == 'F': # Frente (Descer)
            if drone['posicao'] < OCEANO_PROFUNDIDADE:
                drone['posicao'] += 1
                msg = "Descendo..."
            else:
                msg = "Bateu no fundo do mar!"
        
        elif cmd == 'T': # Trás (Subir)
            if drone['posicao'] > 0:
                drone['posicao'] -= 1
                msg = "Subindo..."
            else:
                msg = "Já está na superfície!"
        
        elif cmd == 'M': # Minerar
            if drone['posicao'] > 0:
                if drone['carga'] < drone['capacidade']:
                    drone['carga'] += 1
                    msg = "Minério coletado!"
                else:
                    msg = "Carga cheia!"
            else:
                msg = "Não há nada para minerar na base."
        
        elif cmd == 'V': # Voltar/Vender
            if drone['posicao'] == 0:
                ganho = drone['carga'] * 10
                drone['moedas'] += ganho
                drone['energia'] = 100 # Recarrega na base
                drone['carga'] = 0
                msg = f"Carga vendida! Ganhou ${ganho} e recarregou."
            else:
                msg = "Você precisa estar na base para vender/recarregar!"

        # Checa morte por energia
        if drone['energia'] <= 0:
            drone['vivo'] = False
            msg = "CRÍTICO: Energia esgotada! O drone se perdeu no abismo..."

        desenhar_mundo(msg)
        time.sleep(0.8) # Pausa para o aluno ver o drone se movendo

# --- LOOP PRINCIPAL ---
def jogar():
    desenhar_mundo("Aguardando sequência de pulso...")
    
    while drone['vivo']:
        print("\nCOMANDOS: [F]rente (Descer), [T]rás (Subir), [M]inerar, [V]ender (na Base)")
        entrada = input("Digite a sequência de comandos (ex: FFMFV): ")
        
        if entrada.lower() == 'sair':
            break
            
        executar_comandos(entrada)
        
        if not drone['vivo']:
            print("\nGAME OVER")
            input("Pressione Enter para sair...")

if __name__ == "__main__":
    jogar()
