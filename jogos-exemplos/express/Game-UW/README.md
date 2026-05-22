<div align="center">
<img src="../../../assets/logos/mindpunk-logo.png" alt="MINDPUNK" width="200" style="margin-bottom: 20px;">

# GAME-UW - Tactical Warfare
</div>

![License MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Phaser 3](https://img.shields.io/badge/Phaser%203-5FBB82?style=flat-square&logo=phaser&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)

Um simulador tático hexagonal avançado que explora Teoria dos Jogos, equilíbrio de unidades (Rock-Paper-Scissors) e arquitetura de motores gráficos 2D.

---

## ⚔️ O Que É

O **Game-UW** é um projeto de nível intermediário que ensina como gerenciar sistemas complexos em jogos. Através de um grid hexagonal, o aluno aprende sobre geometria de cliques, inteligência artificial baseada em "Threat Maps" e como balancear unidades com custos e atributos distintos para criar uma experiência estratégica justa.

---

## 🛠️ Conceitos Cobertos

| Conceito | Aplicação no Jogo |
|---|---|
| **Hexagonal Grids** | Cálculo de distância e pathfinding usando coordenadas axiais. |
| **Game Theory** | Equilíbrio de unidades baseado no sistema Pedra-Papel-Tesoura. |
| **AI (Threat Maps)** | Algoritmo de decisão da IA baseado em pontuação de ameaça e vantagem. |
| **Scene Management** | Transição entre estados Macro (Campanha) e Tático (Batalha). |
| **Visual Feedback** | Representação de HP através da contagem de soldados no pelotão. |

---

## 🚀 Começar Rapidamente

### Pré-requisitos
- Node.js 16+

### Instalação e Execução
```bash
npm install
npm run dev
```

---

## 📁 Estrutura do Projeto

```
Game-UW/
├── src/                    ← Lógica e Componentes do jogo
├── docs/
│   ├── GDD.md              ← Design completo e regras
│   ├── 01_unidades.md      ← Detalhamento de stats e balanceamento
│   ├── 02_mapas.md         ← Teoria de grids hexagonais
│   ├── SRC_COMENTADO_Game.ts ← Inicialização do Phaser
│   └── SRC_COMENTADO_unitDefinitions.ts ← Design de dados
└── exercicios/
    ├── nivel-1-basico.md   ← Matchups e cálculos de dano
    └── nivel-2-intermediario.md ← Modificações de IA
```

---

## 🎓 Documentação Educacional

- [Visão Geral do Projeto](./docs/00_visao-geral.md)
- [Game Design Document (GDD)](./docs/GDD.md)
- [Hexágonos e Mapas](./docs/02_mapas.md)
- [Teoria Micro vs Macro](./docs/03_micros-macros.md)

---

**Desenvolvido com 💜 para o MINDPUNK Game Dev Starter Kit.**  
*Toda decisão cria. Toda criação custa.*
