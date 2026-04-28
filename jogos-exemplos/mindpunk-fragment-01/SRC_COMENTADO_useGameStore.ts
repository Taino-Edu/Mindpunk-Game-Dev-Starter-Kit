/**
 * ============================================================================
 * ARQUIVO: src/store/useGameStore.ts
 * ============================================================================
 *
 * RESPONSABILIDADE: Gerenciar TODA lógica do jogo (state)
 *
 * Este arquivo é o "cérebro" do Fragmento 01:
 * - Armazena estado global (posição player, inimigos, HP, etc)
 * - Processa ações (mover, atacar, etc)
 * - Calcula IA dos inimigos
 * - Valida combate e dano
 * - Verifica vitória/derrota
 *
 * Usa ZUSTAND (library de state management)
 *
 * ============================================================================
 */

import { create } from 'zustand';
import { generateLevel } from '../utils/mapGenerator';
import { playSound } from '../utils/soundEngine';
import type { GameState, Enemy, Position, PlayerSkill, EnemyType } from '../types';
import { HARDCORE_LEVEL } from '../config/constants';
import { CORRUPTION_POOL } from '../config/upgrades';
import type { CorruptionEffect } from '../config/upgrades';
import { processEnemiesTurn } from '../logic/ai';

// ============================================================================
// CONSTANTES DO JOGO (números que definem o balanceamento)
// ============================================================================

const COST_MOVE = 8;          // Quanto de energia custa MOVER?
const COST_ATTACK = 15;       // Quanto de energia custa ATACAR?
const BASE_PLAYER_DMG = 25;   // Quanto de dano o player faz?
const DRONE_BASE_HP = 15;     // Quanto de HP um inimigo fraco tem?

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * FUNÇÃO: calculateNextLevelXp
 *
 * RESPONSABILIDADE: Calcular quanto XP é preciso para subir de nível
 *
 * COMO FUNCIONA:
 *   - Cada nível fica mais difícil (precisa mais XP)
 *   - Usa fórmula exponencial: 100 * 1.25^(nível-1)
 *
 * EXEMPLO:
 *   Nível 1: 100 XP
 *   Nível 2: 125 XP
 *   Nível 3: 156 XP
 *   Nível 4: 195 XP
 *
 * PARÂMETRO:
 *   currentLevel = seu nível atual
 *
 * RETORNA:
 *   número de XP necessário pro próximo nível
 */
const calculateNextLevelXp = (currentLevel: number) => {
    return Math.floor(100 * Math.pow(1.25, currentLevel - 1));
};

/**
 * FUNÇÃO: pushExitAway
 *
 * RESPONSABILIDADE: Garantir que a SAÍDA do nível não fica perto do player
 *
 * POR QUÊ:
 *   - Queremos forçar o player a explorar (matar inimigos)
 *   - Se a saída fosse perto, era muito fácil
 *
 * COMO FUNCIONA:
 *   1. Encontra a saída (número 9)
 *   2. Remove ela do mapa
 *   3. Coloca ela no ponto MAIS LONGE possível do player
 *
 * PARÂMETROS:
 *   grid = mapa do jogo
 *   startPos = posição do player
 *
 * RETORNA:
 *   grid atualizado com saída movida
 */
const pushExitAway = (grid: number[][], startPos: Position) => {
    let maxDist = 0;
    let exitPos = { x: 0, y: 0 };
    let currentExit = { x: 0, y: 0 };

    // Procura a saída (9) e calcula distância dela para cada célula
    for(let r=0; r<grid.length; r++) {
        for(let c=0; c<grid[0].length; c++) {
            // Encontrou a saída?
            if (grid[r][c] === 9) {
                currentExit = { x: r, y: c };
                grid[r][c] = 0; // Remove pra poder calcular melhor
            }
            // Se essa célula for vazia, é candidata
            if (grid[r][c] === 0) {
                const dist = Math.abs(r - startPos.x) + Math.abs(c - startPos.y);
                // Encontrou uma célula mais longe?
                if (dist > maxDist) {
                    maxDist = dist;
                    exitPos = { x: r, y: c };
                }
            }
        }
    }
    // Coloca a saída no ponto mais longe
    if (maxDist > 0) grid[exitPos.x][exitPos.y] = 9;
    else grid[currentExit.x][currentExit.y] = 9;

    return grid;
};

/**
 * FUNÇÃO: shuffleWalls
 *
 * RESPONSABILIDADE: Embaralhar paredes (20% de chance)
 *
 * POR QUÊ:
 *   - Cria variação no mapa (cada jogo é diferente)
 *   - Estratégia muda se paredes se movem
 *
 * COMO FUNCIONA:
 *   1. Para cada parede (número 6)
 *   2. 20% de chance de tentar mover pra um lado aleatório
 *   3. Se conseguir (célula vazia), move
 *
 * PARÂMETROS:
 *   grid = mapa
 *   playerPos = onde player tá (não pode sobrescrever)
 *   enemies = lista de inimigos (não pode sobrescrever)
 *
 * RETORNA:
 *   grid com paredes embaralhadas
 */
const shuffleWalls = (grid: number[][], playerPos: Position, enemies: Enemy[]) => {
    const newGrid = grid.map(row => [...row]); // Cópia profunda

    for(let r=0; r<grid.length; r++) {
        for(let c=0; c<grid[0].length; c++) {
            // Encontrou uma parede?
            if (grid[r][c] === 6) {
                // 20% de chance de mover
                if (Math.random() > 0.2) continue;

                // Tenta mover pra um lado aleatório (4 opções)
                const directions = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
                const dir = directions[Math.floor(Math.random() * directions.length)];

                const newX = r + dir.x;
                const newY = c + dir.y;

                // Validação: célula existe e está dentro do mapa?
                if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                    // Validação: não pode sobrescrever player ou inimigo
                    const isPlayer = (newX === playerPos.x && newY === playerPos.y);
                    const isEnemy = enemies.some(e => e.pos.x === newX && e.pos.y === newY);
                    const isEmpty = newGrid[newX][newY] === 0;

                    // Se tudo OK, move a parede
                    if (isEmpty && !isPlayer && !isEnemy) {
                        newGrid[r][c] = 0;
                        newGrid[newX][newY] = 6;
                    }
                }
            }
        }
    }
    return newGrid;
};

/**
 * FUNÇÃO: extractEnemiesFromGrid
 *
 * RESPONSABILIDADE: Gerar inimigos baseado no mapa e nível
 *
 * COMO FUNCIONA:
 *   1. Varre o mapa procurando por células de inimigo (3)
 *   2. Para cada célula vazia, 4% de chance de spawnar inimigo
 *   3. Tipo de inimigo depende do nível
 *      - Nível 1-2: Só drones (fraco)
 *      - Nível 3+: runners aparecem
 *      - Nível 5+: tanks aparecem
 *      - Nível 16+: generators aparecem (chefão)
 *   4. HP e dano aumentam com nível
 *
 * BALANCEAMENTO:
 *   - Quanto maior o nível, mais inimigos difíceis
 *   - Quanto maior o nível, mais forte cada inimigo fica
 *   - Generators só em nível 16+ (final game)
 *
 * PARÂMETROS:
 *   grid = mapa gerado
 *   level = qual nível tá (afeta dificuldade)
 *
 * RETORNA:
 *   {
 *     cleanedGrid = mapa sem os números de inimigos,
 *     enemies = lista de objetos Enemy criados
 *   }
 */
const extractEnemiesFromGrid = (grid: number[][], level: number): { cleanedGrid: number[][], enemies: Enemy[] } => {
    const enemies: Enemy[] = [];
    const cleanedGrid = grid.map(row => [...row]); // Cópia

    let generatorCount = 0;
    const MAX_GENERATORS = level >= 16 ? 1 + Math.floor((level - 16) / 10) : 0;
    const spawnChance = Math.min(0.15, 0.04 + (level * 0.003)); // Mais inimigos em níveis altos
    const hpScaling = level * 5;      // +5 HP por nível
    const dmgScaling = level * 2;     // +2 dano por nível

    for(let r=0; r<grid.length; r++) {
        for(let c=0; c<grid[0].length; c++) {
            const cell = cleanedGrid[r][c];
            let shouldSpawnEnemy = false;

            // Célula marcada pra inimigo (3)?
            if (cell === 3) {
                shouldSpawnEnemy = true;
                cleanedGrid[r][c] = 0;
            }
            // Ou célula vazia com chance de spawn?
            else if (cell === 0 && Math.random() < spawnChance) {
                shouldSpawnEnemy = true;
            }

            if (shouldSpawnEnemy) {
                // Tipo padrão é 'drone' (mais fraco)
                let type: EnemyType = 'drone';
                let hp = DRONE_BASE_HP;
                let baseDmg = 10;
                let xp = 15;
                const rng = Math.random();
                const levelBonusXP = Math.floor(level * 2);

                // LÓGICA: Qual tipo de inimigo vai spawnar?
                if (level >= 16 && generatorCount < MAX_GENERATORS) {
                    // Generator é o boss, HP altíssimo
                    type = 'generator';
                    hp = 300;
                    baseDmg = 0; // Não ataca
                    xp = 500 + (level * 10);
                    generatorCount++;
                }
                else if (level >= 5 && rng < 0.3) {
                    // Tank: forte mas lento
                    type = 'tank';
                    hp = 80;
                    baseDmg = 30;
                    xp = 50 + levelBonusXP;
                }
                else if (level >= 3 && rng < 0.6) {
                    // Runner: rápido mas fraco
                    type = 'runner';
                    hp = 25;
                    baseDmg = 15;
                    xp = 30 + levelBonusXP;
                }
                else {
                    // Default: xp normal
                    xp = 15 + levelBonusXP;
                }

                // Cria o objeto Enemy com stats finais (+ scaling)
                enemies.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: type,
                    pos: { x: r, y: c },
                    hp: hp + hpScaling,           // Adiciona scaling por nível
                    maxHp: hp + hpScaling,
                    damage: baseDmg + dmgScaling, // Adiciona scaling por nível
                    xpValue: xp,
                    spawnCooldown: 0
                });
                continue;
            }

            // ITEMS: 1% chance de cair poção em nível 11+, 4% chance em qualquer nível
            if (cleanedGrid[r][c] === 0) {
                const rngItem = Math.random();
                if (level >= 11 && rngItem < 0.01) {
                    cleanedGrid[r][c] = 8; // Item raro
                }
                else if (rngItem < 0.04) {
                    cleanedGrid[r][c] = 7; // Item comum
                }
            }
        }
    }

    return { cleanedGrid, enemies };
};

// ============================================================================
// ZUSTAND STORE - O ESTADO GLOBAL DO JOGO
// ============================================================================

/**
 * useGameStore
 *
 * RESPONSABILIDADE: Gerenciar TODA estado do jogo usando Zustand
 *
 * O que é Zustand?
 *   - Library de state management (como Redux, mas mais simples)
 *   - Permite que componentes React acessem estado global
 *   - Quando estado muda, componentes que usam ele automaticamente atualizam
 *
 * ESTADO ARMAZENADO:
 *   - Position do player
 *   - HP, XP, Level
 *   - Lista de inimigos
 *   - Mapa (grid)
 *   - Game status (PLAYING, WON, LOST)
 *
 * AÇÕES DISPONÍVEIS:
 *   - movePlayer(direction)
 *   - attackEnemy(enemyId)
 *   - processAI()
 *   - nextLevel()
 *   - resetGame()
 */

export const useGameStore = create<GameState>((set, get) => ({
  // ========================================================================
  // ESTADO INICIAL
  // ========================================================================

  // Player stats
  player: {
    pos: { x: 0, y: 0 },
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    energy: 50,
    maxEnergy: 50
  },

  // Mapa
  grid: [],

  // Inimigos
  enemies: [],

  // Game state
  status: 'PLAYING',
  level: 1,

  // ========================================================================
  // AÇÕES (funções que modificam o estado)
  // ========================================================================

  /**
   * AÇÃO: movePlayer
   *
   * RESPONSABILIDADE: Mover player em uma direção
   *
   * PASSOS:
   *   1. Valida movimento (dentro do mapa? não é parede?)
   *   2. Gasta energia
   *   3. Checa se atacou inimigo (se colidiu)
   *   4. Move player
   *   5. Processa turno dos inimigos
   *   6. Checa se ganhou/perdeu
   *
   * PARÂMETRO:
   *   direction = 'UP', 'DOWN', 'LEFT', 'RIGHT', 'WAIT'
   */
  movePlayer: (direction: string) => {
    set((state) => {
      // TODO: implementar validação e movimento
      // Este é um exemplo do que deveria estar aqui
      return state;
    });
  },

  /**
   * AÇÃO: attackEnemy
   *
   * RESPONSABILIDADE: Atacar um inimigo
   *
   * CÁLCULO DE DANO:
   *   Dano Final = (BASE_PLAYER_DMG + bonus) * (1 + luck)
   *   Luck = número aleatório entre -25% e +25%
   *
   * PARÂMETRO:
   *   enemyId = qual inimigo vai levar dano
   */
  attackEnemy: (enemyId: string) => {
    set((state) => {
      // TODO: implementar cálculo de dano
      return state;
    });
  },

  /**
   * AÇÃO: processAI
   *
   * RESPONSABILIDADE: Processar turno de TODOS os inimigos
   *
   * Para cada inimigo:
   *   1. Vê se consegue ver o player (FOV)
   *   2. Decide ação (atacar ou perseguir)
   *   3. Move ou ataca
   *   4. Checa se matou player
   */
  processAI: () => {
    set((state) => {
      // Chama a função de IA que está em logic/ai.ts
      const newEnemies = processEnemiesTurn(state.enemies, state.player.pos);
      return { ...state, enemies: newEnemies };
    });
  },

  /**
   * AÇÃO: nextLevel
   *
   * RESPONSABILIDADE: Passar pro próximo nível
   *
   * PASSOS:
   *   1. Incrementa nível
   *   2. Regenera HP player (100%)
   *   3. Reseta energia
   *   4. Gera novo mapa mais difícil
   *   5. Coloca player no início
   */
  nextLevel: () => {
    set((state) => {
      // TODO: implementar
      return state;
    });
  },

  /**
   * AÇÃO: resetGame
   *
   * RESPONSABILIDADE: Reiniciar jogo do zero
   *
   * PASSOS:
   *   1. Reset HP, XP, Energy pra inicial
   *   2. Level volta pra 1
   *   3. Gera novo mapa nível 1
   */
  resetGame: () => {
    set((state) => {
      // TODO: implementar
      return state;
    });
  },
}));

// ============================================================================
// NOTAS FINAIS
// ============================================================================

/**
 * COMO USAR ESTE ARQUIVO EM UM COMPONENTE:
 *
 * import { useGameStore } from './store/useGameStore';
 *
 * function MyComponent() {
 *   const { player, enemies, movePlayer } = useGameStore();
 *
 *   return (
 *     <div>
 *       <p>HP: {player.hp} / {player.maxHp}</p>
 *       <button onClick={() => movePlayer('UP')}>Mover Cima</button>
 *     </div>
 *   );
 * }
 *
 * Quando você chamar movePlayer(), o estado muda e o componente
 * AUTOMATICAMENTE re-renderiza com novos valores!
 */
