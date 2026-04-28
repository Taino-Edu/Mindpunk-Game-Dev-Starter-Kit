/**
 * ============================================================================
 * ARQUIVO: src/renderer/src/game/defs/units/index.ts (RESUMIDO EDUCACIONAL)
 * ============================================================================
 *
 * RESPONSABILIDADE: Definir todas as unidades do jogo
 *
 * Este arquivo é como uma "enciclopédia de unidades":
 * - Cada unidade tem stats (HP, ATK, DEF, MOV, RANGE, CUSTO)
 * - Definem como a unidade se comporta no jogo
 * - São usadas para criar unidades no mapa
 * - Balanceamento do jogo está AQUI
 *
 * CONCEITO: ABSTRAÇÃO
 * ├─ Dados (números) = Unit stats
 * ├─ Visualização = Sprite/ícone na tela
 * └─ Comportamento = Como a IA controla a unidade
 *
 * ============================================================================
 */

/**
 * ESTRUTURA DE UMA UNIDADE:
 *
 * ```typescript
 * interface UnitDefinition {
 *   id: string;           // ID único (ex: 'infantry_t1')
 *   name: string;         // Nome legível (ex: 'Infantaria')
 *   description: string;  // Descrição para tutorial
 *
 *   // STATS DE COMBATE
 *   hp: number;           // Vida total
 *   attack: number;       // Dano que causa
 *   defense: number;      // Reduz dano recebido
 *   range: number;        // Alcance de ataque (em hexágonos)
 *
 *   // MOVIMENTO
 *   movement: number;     // Quantos hexágonos pode se mover por turno
 *
 *   // ECONÔMICO
 *   cost: number;         // Custo em ouro para recrutar
 *
 *   // VISUAL
 *   sprite: string;       // Caminho da imagem
 *   color: string;        // Cor do jogador
 * }
 * ```
 */

// ============================================================================
// UNIDADE 1: INFANTARIA (Tropa Básica)
// ============================================================================

/**
 * INFANTARIA - A Unidade Versátil
 *
 * FUNÇÃO: Soldado de infantaria leve. Rápida, barata, fraca.
 *
 * STATS:
 *   HP:     20         ← Fraca (morre rápido)
 *   ATK:    8          ← Moderado
 *   DEF:    2          ← Pouca defesa
 *   MOV:    3          ← RÁPIDA (consegue alcançar Arqueiro)
 *   RANGE:  1          ← Combate corpo-a-corpo
 *   CUSTO:  30 ouro    ← BARATA (3x mais que Tanque)
 *
 * VANTAGENS:
 * ├─ Barata (custa pouco ouro)
 * ├─ Rápida (movimento 3)
 * ├─ Versátil (ok em tudo)
 * └─ Pode criar "exército de números"
 *
 * DESVANTAGENS:
 * ├─ Fraca (HP 20)
 * ├─ Pouca defesa (DEF 2)
 * ├─ Range curto (1 hexágono)
 * └─ Vence quem? ARQUEIRO (alcança antes dele atirar)
 *
 * MATCHUP:
 *   ✅ Bate: Arqueiro (alcança rápido)
 *   ❌ Perde: Tanque (defesa muito alta)
 *   ⚖️  Empata: Outra Infantaria
 *
 * MELHOR USO:
 * ├─ Early game (quando tem pouco ouro)
 * ├─ Swarm meta (muitas infantarias juntas)
 * ├─ Flank unidades inimigas
 * └─ Explorador (mapeador do terreno)
 */

const INFANTRY: UnitDefinition = {
  id: 'infantry',
  name: 'Infantaria',
  description: 'Soldado rápido e barato. Ideal para eco rushes.',

  // STATS
  hp: 20,
  attack: 8,
  defense: 2,
  range: 1,
  movement: 3,

  // ECONÔMICO
  cost: 30,

  // VISUAL
  sprite: 'infantry.png',
  color: '#00AA00', // Verde
};

// ============================================================================
// UNIDADE 2: TANQUE (Unidade Defensiva)
// ============================================================================

/**
 * TANQUE - A Muralha Viva
 *
 * FUNÇÃO: Unidade pesada. Lenta, cara, forte.
 *
 * STATS:
 *   HP:     80         ← FORTE (aguenta 4x mais que Infantaria)
 *   ATK:    5          ← FRACO (mata lento)
 *   DEF:    8          ← MUITA DEFESA (reduz dano 50%)
 *   MOV:    2          ← LENTA (metade da velocidade)
 *   RANGE:  1          ← Combate corpo-a-corpo
 *   CUSTO:  80 ouro    ← CARA (custa 2,7x Infantaria)
 *
 * VANTAGENS:
 * ├─ HP alto (80)
 * ├─ Defesa alta (DEF 8)
 * ├─ Bloqueia caminhos
 * └─ Protege aliados atrás
 *
 * DESVANTAGENS:
 * ├─ Lento (MOV 2)
 * ├─ Dano fraco (ATK 5)
 * ├─ Caro (80 ouro)
 * └─ Vence quem? ARQUEIRO (não consegue alcançar à distância)
 *
 * MATCHUP:
 *   ✅ Bate: Infantaria (defesa reduz ataque dela)
 *   ❌ Perde: Arqueiro (não alcança, leva damage à distância)
 *   ⚖️  Empata: Outro Tanque
 *
 * MELHOR USO:
 * ├─ Segurar formação (bloqueia caminhos)
 * ├─ Late game (quando tem ouro)
 * ├─ Protetor de Arqueiros (Tanque na frente, Arqueiro atrás)
 * └─ 1v1 contra Infantaria (vai ganhar)
 */

const TANK: UnitDefinition = {
  id: 'tank',
  name: 'Tanque',
  description: 'Unidade defensiva. Ideal para hold positions.',

  // STATS
  hp: 80,
  attack: 5,
  defense: 8,
  range: 1,
  movement: 2,

  // ECONÔMICO
  cost: 80,

  // VISUAL
  sprite: 'tank.png',
  color: '#0000FF', // Azul
};

// ============================================================================
// UNIDADE 3: ARQUEIRO (Unidade de Ranged)
// ============================================================================

/**
 * ARQUEIRO - A Sniper
 *
 * FUNÇÃO: Unidade de longo alcance. Rápida, média, frágil.
 *
 * STATS:
 *   HP:     15         ← MUITO FRACA (morre em 2 golpes)
 *   ATK:    12         ← Dano ALTO
 *   DEF:    1          ← NENHUMA defesa
 *   RANGE:  4          ← LONGO ALCANCE (maior do jogo!)
 *   MOV:    3          ← RÁPIDA (igual Infantaria)
 *   CUSTO:  50 ouro    ← Preço médio
 *
 * VANTAGENS:
 * ├─ Alcance ALTO (4 hexágonos, pode atacar de longe)
 * ├─ Dano ALTO (12)
 * ├─ Rápido (MOV 3)
 * └─ Pode atacar sem ser atingido
 *
 * DESVANTAGENS:
 * ├─ HP muito baixo (15)
 * ├─ Defesa nenhuma (DEF 1)
 * ├─ Precisa de escolta
 * └─ Vence quem? TANQUE (ignora defesa com range)
 *
 * MATCHUP:
 *   ✅ Bate: Tanque (range ignora defesa)
 *   ❌ Perde: Infantaria (ela alcança rápido)
 *   ⚖️  Empata: Outro Arqueiro
 *
 * MELHOR USO:
 * ├─ Apoio à distância (atrás de Tanques)
 * ├─ Anti-tank (mata Tanques porque ignora DEF)
 * ├─ Manter distância (nunca deixar alcançarem)
 * └─ Formação tipo: [TANK] [ARCHER] (Tanque protege Arqueiro)
 */

const ARCHER: UnitDefinition = {
  id: 'archer',
  name: 'Arqueiro',
  description: 'Unidade ranged. Ideal para damage from afar.',

  // STATS
  hp: 15,
  attack: 12,
  defense: 1,
  range: 4,           // ← ÚNICO COM RANGE > 1
  movement: 3,

  // ECONÔMICO
  cost: 50,

  // VISUAL
  sprite: 'archer.png',
  color: '#FFAA00', // Laranja
};

// ============================================================================
// TABELA COMPARATIVA
// ============================================================================

/**
 * ```
 *            | Infantaria | Tanque | Arqueiro
 * -----------|------------|--------|----------
 * HP         |     20     |   80   |    15
 * ATK        |      8     |    5   |    12
 * DEF        |      2     |    8   |     1
 * MOV        |      3     |    2   |     3
 * RANGE      |      1     |    1   |     4  ← KEY DIFFERENCE
 * CUSTO      |     30     |   80   |    50
 * -----------|------------|--------|----------
 * Bate       | Arqueiro   | Infant | Tanque
 * Perde      | Tanque     | Arq    | Infant
 * ```
 *
 * ANÁLISE:
 * ├─ INFANTARIA: Barata, versátil, bate Arqueiro (fraco contra Tanque)
 * ├─ TANQUE: Cara, forte, bate Infantaria (fraco contra Arqueiro)
 * └─ ARQUEIRO: Média, dano alto, bate Tanque (fraco contra Infantaria)
 *
 * CONCLUSÃO: Rock-Paper-Scissors perfeitamente balanceado!
 */

// ============================================================================
// CUSTO-BENEFÍCIO (Eficiência)
// ============================================================================

/**
 * CE = (HP + ATK + DEF + MOV + RANGE) / Custo
 *
 * INFANTARIA: (20+8+2+3+1) / 30 = 34/30 = 1.13 ← MELHOR!
 * TANQUE:     (80+5+8+2+1) / 80 = 96/80 = 1.20 ← Muito bom!
 * ARQUEIRO:   (15+12+1+3+4) / 50 = 35/50 = 0.70 ← Caro
 *
 * INTERPRETAÇÃO:
 * Infantaria parece ter melhor custo-benefício,
 * MAS... isso ignora QUALIDADE dos stats!
 *
 * Uma Infantaria nunca bate um Tanque, não importa quantas.
 * Um Arqueiro bate Tanque porque ignore defesa com range.
 *
 * → Métricas simples enganam. Design é arte, não só números!
 */

// ============================================================================
// COMO USAR ESTAS DEFINIÇÕES
// ============================================================================

/**
 * NO CÓDIGO DO JOGO:
 *
 * ```typescript
 * // 1. Recrutar unidade
 * const infantry = new Unit(INFANTRY, playerColor);
 * const tank = new Unit(TANK, playerColor);
 * const archer = new Unit(ARCHER, playerColor);
 *
 * // 2. Batalha
 * infantry.attack(tank);
 * ├─ Dano = 8 (ATK) - (8 * 0.5) = 4
 * └─ tank.hp -= 4 (vai de 80 → 76)
 *
 * // 3. Comparação
 * if (infantry.cost < tank.cost) {
 *   console.log('Infantaria é mais barata');
 * }
 * ```
 */

// ============================================================================
// BALANCEAMENTO: COMO AJUSTAR
// ============================================================================

/**
 * Se Infantaria está muito forte (todos usam):
 * ├─ Aumentar custo (ex: 30 → 35)
 * ├─ Diminuir ATK (ex: 8 → 6)
 * └─ Diminuir MOV (ex: 3 → 2)
 *
 * Se Arqueiro está muito fraco (ninguém usa):
 * ├─ Aumentar ATK (ex: 12 → 15)
 * ├─ Aumentar RANGE (ex: 4 → 5)
 * └─ Diminuir custo (ex: 50 → 40)
 *
 * Se Tanque está no ponto certo:
 * └─ NÃO MEXER! ✅
 */

// ============================================================================
// TIPO DE DADO (TypeScript)
// ============================================================================

/**
 * ```typescript
 * interface UnitDefinition {
 *   id: string;           // ID único para identificar
 *   name: string;         // Nome legível pro jogador
 *   description: string;  // Dica para tutorial
 *   hp: number;           // Vida total
 *   attack: number;       // Dano por golpe
 *   defense: number;      // Redução de dano
 *   range: number;        // Alcance (em hexágonos)
 *   movement: number;     // Hexágonos por turno
 *   cost: number;         // Ouro necessário
 *   sprite: string;       // Caminho da imagem
 *   color: string;        // Cor (HEX ou RGB)
 * }
 * ```
 */

// ============================================================================
// RESUMO FINAL
// ============================================================================

/**
 * As 3 unidades formam um "triângulo de combate":
 *
 *        INFANTARIA
 *        /        \\
 *       /          \\
 *      /            \\
 *  TANQUE --------- ARQUEIRO
 *
 * Cada um bate um e perde para um.
 * Isso torna o jogo EQUILIBRADO e INTERESSANTE!
 *
 * Se só tivesse Infantaria:
 * └─ Jogo é MONÓTONO (todos fazem a mesma coisa)
 *
 * Com as 3 em equilíbrio:
 * └─ Jogo é ESTRATÉGICO (precisa pensar na composição)
 */
