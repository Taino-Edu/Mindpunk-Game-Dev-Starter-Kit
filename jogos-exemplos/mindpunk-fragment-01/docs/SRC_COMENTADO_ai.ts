/**
 * ============================================================================
 * ARQUIVO: src/logic/ai.ts
 * ============================================================================
 *
 * RESPONSABILIDADE: Processar o turno de TODOS os inimigos
 *
 * Este arquivo é a "IA" do jogo:
 * - Cada turno, cada inimigo decide o que fazer
 * - Calcula se consegue atacar o player
 * - Se não consegue, persegue o player
 * - Trata colisões com outros inimigos (flanqueia)
 * - Retorna dano total que player vai levar
 *
 * FLUXO GERAL:
 * 1. Para cada inimigo:
 *    ├─ Calcula distância até player
 *    ├─ Se distância === 1: ATACA (retorna dano)
 *    └─ Se distância > 1: Se MOVE na direção do player
 * 2. Retorna lista de inimigos atualizados + dano total
 *
 * ============================================================================
 */

import type { Position, Enemy } from '../types';

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * FUNÇÃO: isBlocked
 *
 * RESPONSABILIDADE: Verificar se uma célula está bloqueada
 *
 * Uma célula está bloqueada se:
 * ├─ Está fora do mapa (x < 0, x >= grid.length, etc)
 * ├─ É parede (cell === 1)
 * ├─ É muro móvel (cell === 6)
 * ├─ É saída (cell === 9)
 * └─ Tem outro inimigo lá (para não ficarem um em cima do outro)
 *
 * PARÂMETROS:
 *   grid = mapa do jogo (números representam células)
 *   x, y = coordenadas a testar
 *   otherEnemies = lista de OUTROS inimigos (não incluir o inimigo sendo testado)
 *
 * RETORNA:
 *   true se célula está bloqueada, false se está livre
 */
const isBlocked = (grid: number[][], x: number, y: number, otherEnemies: Enemy[]) => {
    // Validação 1: Está dentro do mapa?
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return true;

    // Validação 2: Qual é o número da célula?
    const cell = grid[x][y];

    // Bloqueado se for:
    // 1 = Parede fixa
    // 6 = Muro móvel (pode se mover, mas bloqueia caminho temporariamente)
    // 9 = Saída (não pode passar)
    if (cell === 1 || cell === 6 || cell === 9) return true;

    // Validação 3: Tem outro inimigo lá?
    // .some() retorna TRUE se ALGUM inimigo tiver a mesma posição
    if (otherEnemies.some(e => e.pos.x === x && e.pos.y === y)) return true;

    // Se passou em todas as validações: célula está LIVRE
    return false;
};

// ============================================================================
// FUNÇÃO PRINCIPAL: TURNO DOS INIMIGOS
// ============================================================================

/**
 * FUNÇÃO: processEnemiesTurn
 *
 * RESPONSABILIDADE: Processar o turno de TODOS os inimigos
 *
 * COMO FUNCIONA:
 *   1. Para cada inimigo:
 *      ├─ Calcula distância até o player
 *      ├─ Se está ao lado (distância === 1):
 *      │  └─ ATACA! (soma o dano)
 *      └─ Se está longe (distância > 1):
 *         └─ Se MOVE na direção do player
 *
 *   2. Trata casos especiais:
 *      ├─ Caminho principal bloqueado? FLANQUEIA (tenta outro eixo)
 *      └─ Ambos bloqueados? Fica parado
 *
 * PARÂMETROS:
 *   grid = mapa do jogo (array 2D de números)
 *   enemies = lista de inimigos (será copiada, não alterada diretamente)
 *   playerPos = posição atual do player (não se move nesta função)
 *   _rows, _cols = dimensões do mapa (não usadas nesta versão)
 *
 * RETORNA:
 *   {
 *     enemies: Enemy[]  → Lista atualizada de inimigos com novas posições
 *     damageDealt: number → Total de dano que player vai levar este turno
 *   }
 *
 * EXEMPLO:
 *   Player está em (5,5)
 *   Inimigo está em (5,6) (ao lado!)
 *
 *   Resultado:
 *   ├─ Distância = |5-5| + |6-5| = 1
 *   ├─ Distância === 1? SIM
 *   └─ ATACA! (damageDealt += inimigo.damage)
 */
export const processEnemiesTurn = (
    grid: number[][],
    enemies: Enemy[],
    playerPos: Position,
    _rows: number,
    _cols: number
) => {
    // Variável para rastrear dano total este turno
    let damageDealt = 0;

    // ========================================================================
    // PASSO 1: Mapear cada inimigo para sua nova posição
    // ========================================================================
    // .map() cria um NOVO array sem alterar o original (imutável!)

    const updatedEnemies = enemies.map(enemy => {
        // Cria uma CÓPIA do inimigo (não altera o original)
        const newEnemy = { ...enemy };

        // ====================================================================
        // PASSO 2: Calcular distância Manhattan até o player
        // ====================================================================
        // Distância Manhattan = |x1-x2| + |y1-y2|
        // (quantos "passos" até chegar ao player em linha reta?)

        const dx = playerPos.x - newEnemy.pos.x;  // Diferença no eixo X
        const dy = playerPos.y - newEnemy.pos.y;  // Diferença no eixo Y

        // ====================================================================
        // PASSO 3: Se está ao lado do player (distância === 1), ATACA!
        // ====================================================================
        // |dx| + |dy| === 1 significa:
        // ├─ Um passo na horizontal (dx = ±1, dy = 0) OU
        // └─ Um passo na vertical (dx = 0, dy = ±1)

        if (Math.abs(dx) + Math.abs(dy) === 1) {
            // ESTÁ AO LADO! ATACA!
            damageDealt += newEnemy.damage;
            return newEnemy;  // Não move, só retorna o inimigo
        }

        // ====================================================================
        // PASSO 4: Se está longe, SE MOVE em direção ao player
        // ====================================================================

        // Tenta mover um passo na direção do player
        // Math.sign(x) retorna: -1 (se x < 0), 0 (se x === 0), 1 (se x > 0)

        let tryX = newEnemy.pos.x + Math.sign(dx);  // Tenta mover no eixo X
        let tryY = newEnemy.pos.y + Math.sign(dy);  // Tenta mover no eixo Y

        // ====================================================================
        // PASSO 5: Estratégia de Movimento - Priorizar Eixo Maior
        // ====================================================================
        // Se a distância no eixo X é maior, prioriza mover em X
        // Se a distância no eixo Y é maior, prioriza mover em Y
        // Exemplo:
        //   Player está em (5,2), Inimigo está em (3,5)
        //   dx = 5-3 = 2, dy = 2-5 = -3
        //   |dx| = 2, |dy| = 3
        //   |dy| > |dx|, então PRIORIZA MOVER EM Y

        if (Math.abs(dx) > Math.abs(dy)) {
            // Distância em X é maior, então mantém Y como estava
            tryY = newEnemy.pos.y;  // Não muda Y
        } else {
            // Distância em Y é maior (ou igual), então mantém X como estava
            tryX = newEnemy.pos.x;  // Não muda X
        }

        // ====================================================================
        // PASSO 6: Validação - Caminho está bloqueado?
        // ====================================================================

        // Filtra outros inimigos (não incluir a si mesmo na validação)
        const others = enemies.filter(e => e.id !== enemy.id);

        // Se o caminho priorizado estiver bloqueado...
        if (isBlocked(grid, tryX, tryY, others)) {
            // ... tenta o caminho ALTERNATIVO (flanquear)

            // Reseta para posição original
            tryX = newEnemy.pos.x;
            tryY = newEnemy.pos.y;

            // Tenta o OUTRO eixo (aquele que não tentou antes)
            if (Math.abs(dx) > Math.abs(dy)) {
                // Antes tentava mover em X, agora tenta em Y
                if (dy !== 0) tryY += Math.sign(dy);
            } else {
                // Antes tentava mover em Y, agora tenta em X
                if (dx !== 0) tryX += Math.sign(dx);
            }
        }

        // ====================================================================
        // PASSO 7: Movimento Final - Se alternativa também está livre, move
        // ====================================================================

        if (!isBlocked(grid, tryX, tryY, others)) {
            // Caminho está livre! Move o inimigo
            newEnemy.pos = { x: tryX, y: tryY };
        }
        // Se ambos os caminhos estão bloqueados, inimigo fica parado
        // (newEnemy.pos não muda)

        return newEnemy;  // Retorna inimigo com nova posição
    });

    // ========================================================================
    // RETORNO
    // ========================================================================

    return {
        enemies: updatedEnemies,      // Inimigos com novas posições
        damageDealt                  // Total de dano que player leva
    };
};

// ============================================================================
// RESUMO VISUAL: COMO A IA FUNCIONA
// ============================================================================

/**
 * EXEMPLO TURNO:
 *
 * Estado Inicial:
 * ```
 * Mapa 8x8:
 * P = Player (5,5)
 * E1 = Inimigo 1 (5,6) - AO LADO!
 * E2 = Inimigo 2 (3,5) - Longe
 * # = Parede
 * ```
 *
 * Processamento:
 *
 * E1: playerPos=(5,5), pos=(5,6)
 *   dx = 5-5 = 0
 *   dy = 5-6 = -1
 *   Distância = |0| + |-1| = 1
 *   → ATACA! (damageDealt += E1.damage)
 *
 * E2: playerPos=(5,5), pos=(3,5)
 *   dx = 5-3 = 2
 *   dy = 5-5 = 0
 *   Distância = |2| + |0| = 2 (não ataca)
 *
 *   tryX = 3 + sign(2) = 3 + 1 = 4
 *   tryY = 5 + sign(0) = 5 + 0 = 5
 *
 *   |dx| > |dy|? (2 > 0? SIM)
 *   → Prioriza X, mantém Y
 *   → Tenta (4,5)
 *
 *   isBlocked(4,5)? NÃO
 *   → SE MOVE para (4,5)
 *
 * Resultado:
 * E1 permanece em (5,6), ATACOU
 * E2 agora em (4,5), SE APROXIMOU
 * damageDealt = E1.damage
 */
