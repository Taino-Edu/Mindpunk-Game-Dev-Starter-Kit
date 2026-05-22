<div align="center">
<img src="../../assets/logos/mindpunk-logo.png" alt="MINDPUNK" width="200" style="margin-bottom: 20px;">

# DEEP SEA CODER - Terminal Mining Drone
</div>

![License MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![Genre](https://img.shields.io/badge/Genre-Logic%20/%20Management-orange?style=flat-square)

Um jogo de terminal educacional que ensina lógica de programação e gestão de recursos através do controle de um drone submarino via "sequências de pulso".

---

## 🌊 O Que É

O **Deep Sea Coder** foi desenvolvido para o workshop da UNIP como um exemplo prático de como transformar lógica pura em gameplay. O jogador não controla o drone em tempo real, mas sim programa uma sequência de comandos que o drone deve executar perfeitamente para minerar e sobreviver.

---

## 🛠️ Conceitos Cobertos

| Conceito | Aplicação no Jogo |
|---|---|
| **Dicionários** | Armazenamento do estado do drone (energia, posição, carga). |
| **Listas/Strings** | Processamento da sequência de comandos. |
| **Game Loops** | Loop `while` mantendo o jogo ativo até a bateria acabar. |
| **Manipulação de Terminal** | Efeito de animação e limpeza de tela (`os.system`). |
| **Gestão de Recursos** | Balanceamento entre risco (descer fundo) e recompensa (mais minério). |

---

## 🚀 Começar Rapidamente

### Pré-requisitos
- Python 3.10 ou superior.

### Execução
```bash
python main.py
```

### Comandos do Drone
- `F` (Frente/Descer): Move o drone 1 nível para baixo.
- `T` (Trás/Subir): Move o drone 1 nível para cima.
- `M` (Minerar): Coleta minério na posição atual.
- `V` (Vender/Base): Na superfície (Pos 0), converte carga em moedas e recarrega.

---

## 📁 Estrutura do Projeto

```
workshop-deep-sea-coder/
├── main.py                 ← Código principal executável
├── docs/
│   ├── GDD.md              ← Design completo do jogo
│   ├── 00_visao-geral.md   ← Brainstorm e conceitos
│   ├── ROTEIRO_PROFESSOR.md ← Guia para o workshop
│   └── SRC_COMENTADO_main.py ← Documentação linha a linha
└── exercicios/
    └── nivel-1-basico.md   ← Desafios para os alunos
```

---

## 🎓 Documentação Educacional

- [Visão Geral do Projeto](./docs/00_visao-geral.md)
- [Game Design Document (GDD)](./docs/GDD.md)
- [Código Comentado (Deep Dive)](./docs/SRC_COMENTADO_main.py)
- [Roteiro do Workshop](./docs/ROTEIRO_PROFESSOR.md)

---

**Desenvolvido com 💜 para o MINDPUNK Game Dev Starter Kit.**  
*Toda decisão cria. Toda criação custa.*
