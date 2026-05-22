<div align="center">
<img src="../../../assets/logos/mindpunk-logo.png" alt="MINDPUNK" width="200" style="margin-bottom: 20px;">

# DUNGEON CRAWLER - Rust & Python FFI
</div>

![License MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Rust](https://img.shields.io/badge/Rust-CE422B?style=flat-square&logo=rust&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)

Um roguelike de terminal de alta performance que demonstra o poder do Rust em cálculos algorítmicos e a flexibilidade do Python para scripting de game design.

---

## 🦀 O Que É

O **Dungeon Crawler** é o pilar de performance do Mindpunk Lab. Ele ensina como integrar duas linguagens distintas usando **FFI (Foreign Function Interface)**. O motor do jogo, geração procedural de mapas (BSP) e o campo de visão (Shadowcasting) são feitos em **Rust** para máxima velocidade, enquanto o balanceamento de inimigos, itens e loot é feito em **Python**, permitindo alterações rápidas sem necessidade de recompilação.

---

## 🛠️ Conceitos Cobertos

| Conceito | Aplicação no Jogo |
|---|---|
| **FFI (PyO3)** | Ponte de comunicação entre a engine Rust e os dados em Python. |
| **Geração BSP** | Algoritmo de divisão recursiva de espaços para criar dungeons. |
| **Shadowcasting** | Cálculo de campo de visão (FOV) e névoa de guerra em tempo real. |
| **State Machines** | Inteligência Artificial de inimigos com comportamentos distintos. |
| **Memory Safety** | Uso de Ownership e Borrowing do Rust em sistemas críticos. |

---

## 🚀 Começar Rapidamente

### Pré-requisitos
- Rust + Cargo (1.75+)
- Python (3.12+)

### Instalação e Execução
```bash
cd rust
.\rodar.bat
```
*(Nota: O script `rodar.bat` configura automaticamente o ambiente para Windows)*

---

## 📁 Estrutura do Projeto

```
rust/
├── src/                    ← Engine em Rust (Lógica, FOV, Mapas)
├── scripts/                ← Dados em Python (Inimigos, Itens, Loot)
├── docs/
│   ├── GDD.md              ← Design e mecânicas
│   ├── README_EDUCACIONAL.md ← Guia de arquitetura FFI
│   └── SRC_COMENTADO_bsp.rs ← Algoritmo de mapa explicado
└── exercicios/
    └── nivel-1-basico.md   ← Desafios de Rust e Scripting
```

---

## 🎓 Documentação Educacional

- [Guia de Arquitetura Rust + Python](./docs/README_EDUCACIONAL.md)
- [Game Design Document (GDD)](./docs/GDD.md)
- [Algoritmo BSP Comentado](./docs/SRC_COMENTADO_bsp.rs)
- [Exercícios Práticos](./exercicios/nivel-1-basico.md)

---

**Desenvolvido com 💜 para o MINDPUNK Game Dev Starter Kit.**  
*Toda decisão cria. Toda criação custa.*
