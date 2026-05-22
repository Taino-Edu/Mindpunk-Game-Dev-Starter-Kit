<div align="center">
<img src="../../../assets/logos/mindpunk-logo.png" alt="MINDPUNK" width="200" style="margin-bottom: 20px;">

# FRAGMENTO 01 - Roguelike Real-Time
</div>

![License MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)

Um explorador de dungeon procedural focado em demonstrar o gerenciamento de estados globais e game loops em aplicações modernas de frontend.

---

## 🎮 O Que É

O **Fragmento 01** é o ponto de entrada para quem quer entender como jogos funcionam dentro do ecossistema Web (React). Ele resolve o desafio de sincronizar a lógica do jogo com a renderização de componentes, usando o **Zustand** para um estado fluido e de alta performance.

---

## 🛠️ Conceitos Cobertos

| Conceito | Aplicação no Jogo |
|---|---|
| **State Management** | Uso de Zustand para gerenciar vida, inventário e mapa. |
| **Procedural Gen** | Algoritmo de criação de dungeons aleatórias. |
| **AI de Inimigos** | Máquinas de estado simples para perseguição e ataque. |
| **Custom Hooks** | Lógica de input e colisão abstraída em hooks React. |

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
mindpunk-fragment-01/
├── src/                    ← Código fonte do jogo
├── docs/
│   ├── GDD.md              ← Design completo do jogo
│   ├── 00_visao-geral.md   ← Conceitos de loops
│   ├── SRC_COMENTADO_ai.ts ← Lógica de IA explicada
│   └── SRC_COMENTADO_useGameStore.ts ← Gerenciamento de estado
└── exercicios/
    └── nivel-1-basico.md   ← Desafios iniciais
```

---

## 🎓 Documentação Educacional

- [Visão Geral e Game Loops](./docs/00_visao-geral.md)
- [Game Design Document (GDD)](./docs/GDD.md)
- [IA Comentada](./docs/SRC_COMENTADO_ai.ts)
- [Estado Comentado](./docs/SRC_COMENTADO_useGameStore.ts)

---

**Desenvolvido com 💜 para o MINDPUNK Game Dev Starter Kit.**  
*Toda decisão cria. Toda criação custa.*
