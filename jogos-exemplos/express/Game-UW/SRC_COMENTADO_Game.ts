/**
 * ============================================================================
 * ARQUIVO: src/renderer/src/game/Game.ts (VERSÃO EDUCACIONAL)
 * ============================================================================
 *
 * RESPONSABILIDADE: Inicializar o jogo Game-UW com Phaser
 *
 * Este arquivo é o "bootstrap" do jogo:
 * - Cria a instância do Phaser (motor de jogo)
 * - Configura as cenas (BootScene, MacroScene, TacticalScene)
 * - Define tamanho da tela, cores, etc
 * - É o primeiro arquivo a ser carregado
 *
 * TECNOLOGIA: Phaser 3
 * - Framework de jogo em JavaScript/TypeScript
 * - Renderização 2D (Canvas ou WebGL)
 * - Sistema de Cenas (diferentes "telas" do jogo)
 * - Input, Physics, Animations, etc
 *
 * ============================================================================
 */

import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MacroScene } from './scenes/MacroScene'
import { TacticalScene } from './scenes/TacticalScene'

/**
 * FUNÇÃO: createGame
 *
 * RESPONSABILIDADE: Criar e configurar instância do Phaser
 *
 * PASSOS:
 * 1. Verificar se existe DIV "game-root" no HTML
 *    └─ Se não existir, criar dinamicamente
 * 2. Configurar Phaser com todas as opções
 * 3. Registrar as 3 cenas principais
 * 4. Retornar instância do jogo
 *
 * RETORNA:
 *   Phaser.Game → Instância do motor de jogo (já está rodando!)
 *
 * CICLO DE VIDA DO JOGO:
 * ```
 * Game.ts
 *   ↓
 * createGame() [este arquivo]
 *   ↓
 * BootScene (carrega assets, se prepara)
 *   ↓
 * MacroScene (visão estratégica do mapa/campanha)
 *   ↓
 * TacticalScene (batalha em tempo real com hexágonos)
 *   ↓
 * Game Loop (60 FPS):
 *    ├─ INPUT (recebe cliques/teclado)
 *    ├─ UPDATE (processa lógica)
 *    └─ RENDER (desenha na tela)
 * ```
 */
export function createGame() {
  // ========================================================================
  // PASSO 1: VERIFICAR/CRIAR CONTAINER
  // ========================================================================

  // Procura pela DIV "game-root" no HTML
  if (!document.getElementById('game-root')) {
    // Se não existir, cria dinamicamente
    // (útil se o jogo é carregado sem HTML pré-feito)

    const d = document.createElement('div')
    d.id = 'game-root'
    document.body.appendChild(d)
  }

  // ========================================================================
  // PASSO 2: CONFIGURAÇÃO DO PHASER
  // ========================================================================

  const config: Phaser.Types.Core.GameConfig = {
    // --- Renderização ---
    // AUTO = escolhe automaticamente Canvas ou WebGL (melhor performance)
    type: Phaser.AUTO,

    // --- DOM ---
    // Qual elemento HTML vai conter o canvas?
    parent: 'game-root',

    // --- Cor de Fundo ---
    // Cor escura (estilo cyberpunk)
    backgroundColor: '#0b0f14',

    // --- Escala/Responsive ---
    scale: {
      // RESIZE = adapta ao tamanho da janela
      // (diferente de FIXED que mantém tamanho constante)
      mode: Phaser.Scale.RESIZE,

      // Centraliza o canvas na tela
      autoCenter: Phaser.Scale.CENTER_BOTH,

      // Começa com o tamanho atual da janela
      width: window.innerWidth,
      height: window.innerHeight,
    },

    // ========================================================================
    // PASSO 3: REGISTRAR CENAS
    // ========================================================================
    // Array de cenas = ordem que serão carregadas e acessíveis

    scene: [
      // 1. BootScene - Carrega assets (imagens, sons, etc)
      //    └─ Precisa rodar PRIMEIRO (BootScene.start())
      BootScene,

      // 2. MacroScene - Visão de campanha/mapa estratégico
      //    └─ Escolhe qual batalha jogar
      MacroScene,

      // 3. TacticalScene - Batalha tática com hexágonos
      //    └─ INPUT (clique em unidade)
      //    └─ UPDATE (move, calcula dano)
      //    └─ RENDER (desenha mapa)
      TacticalScene,
    ],
  }

  // ========================================================================
  // PASSO 4: CRIAR INSTÂNCIA DO JOGO
  // ========================================================================

  // new Phaser.Game(config) INICIA IMEDIATAMENTE
  // Game loop começa a rodar automaticamente (60 FPS)
  return new Phaser.Game(config)
}

// ============================================================================
// ARQUITETURA DO JOGO - CENAS
// ============================================================================

/**
 * CENA 1: BootScene
 *
 * RESPONSABILIDADE: Preparar o jogo
 *
 * OPERAÇÕES:
 * ├─ Carregar imagens (sprites de unidades, mapa)
 * ├─ Carregar sons (música, efeitos)
 * ├─ Carregar dados (missões, unidades definidas)
 * └─ Depois, chamar this.scene.start('MacroScene')
 *
 * TEMPO: ~1-2 segundos (enquanto carrega assets)
 */

/**
 * CENA 2: MacroScene
 *
 * RESPONSABILIDADE: Estratégia de campanha
 *
 * MOSTRA:
 * ├─ Mapa grande com várias missões
 * ├─ Quais missões completou/podem jogar
 * ├─ Seu ouro/recursos globais
 * └─ Escolher uma missão → ir pra TacticalScene
 *
 * TEMPO: Quanto o player quiser
 */

/**
 * CENA 3: TacticalScene
 *
 * RESPONSABILIDADE: Batalha tática
 *
 * GAME LOOP (60 FPS):
 * ┌─────────────────────────────────┐
 * │  INPUT (preload)                │
 * │  ├─ Clique em célula?           │
 * │  ├─ Clique em unidade?          │
 * │  └─ Espaço pra terminar turno?  │
 * │                                 │
 * │  UPDATE                         │
 * │  ├─ Processa movimento          │
 * │  ├─ Calcula combate             │
 * │  ├─ IA inimiga se move          │
 * │  └─ Verifica vitória/derrota    │
 * │                                 │
 * │  RENDER                         │
 * │  ├─ Desenha hexágonos           │
 * │  ├─ Desenha unidades            │
 * │  ├─ Anima movimentos            │
 * │  └─ Mostra HUD (HP, recursos)   │
 * └─────────────────────────────────┘
 *
 * TEMPO: ~5-15 minutos por batalha
 */

// ============================================================================
// FLUXO VISUAL COMPLETO
// ============================================================================

/**
 * INICIALIZAÇÃO DO JOGO:
 *
 * 1. Aplicação chama createGame()
 *    └─ Cria DIV "game-root"
 *    └─ Configura Phaser
 *    └─ Registra 3 cenas
 *    └─ Retorna instância (game loop já rodando!)
 *
 * 2. Phaser automaticamente:
 *    ├─ Cria canvas e context 2D/WebGL
 *    ├─ Começa rodando primeira cena (BootScene)
 *    ├─ Inicia game loop (60 FPS)
 *    └─ EVENT LISTENER ativado
 *
 * 3. BootScene:
 *    ├─ scene.preload() - Carrega assets
 *    ├─ scene.create() - Cria objetos iniciais
 *    └─ scene.start('MacroScene') - Muda de cena
 *
 * 4. MacroScene:
 *    ├─ Mostra mapa de campanha
 *    └─ Player clica numa missão
 *       └─ this.scene.start('TacticalScene')
 *
 * 5. TacticalScene:
 *    ├─ Mostra mapa hexagonal
 *    ├─ Renderiza unidades
 *    └─ Game loop roda continuamente:
 *       ├─ INPUT (clique) → UPDATE (movimento) → RENDER (desenha)
 *       └─ Repetir 60x por segundo
 */

// ============================================================================
// CONFIGURAÇÃO DO PHASER - EXPLICAÇÃO DETALHADA
// ============================================================================

/**
 * OPÇÕES IMPORTANTES:
 *
 * type: Phaser.AUTO
 *   └─ Escolhe Canvas ou WebGL automaticamente
 *   └─ WebGL é mais rápido (GPU), Canvas é mais compatível (CPU)
 *
 * backgroundColor: '#0b0f14'
 *   └─ Cor de fundo muito escura (quase preto)
 *   └─ Estilo cyberpunk/dark mode
 *   └─ Código hexadecimal: #RRGGBB (vermelho, verde, azul)
 *
 * scale.mode: Phaser.Scale.RESIZE
 *   └─ Adapta o canvas quando janela é redimensionada
 *   └─ Alternativas:
 *      ├─ FIT = mantém proporção, com letterbox
 *      ├─ FIXED = tamanho não muda
 *      └─ HEIGHT_CONTROLS_WIDTH = altura controla largura
 *
 * scale.autoCenter
 *   └─ Centraliza o canvas na tela
 *   └─ Fica bonitão visualmente
 *
 * width/height: window.innerWidth/innerHeight
 *   └─ Começa com o tamanho atual da janela
 *   └─ Depois muda quando janela redimensiona (mode: RESIZE)
 */

// ============================================================================
// LIFECYCLE HOOKS DO PHASER (em cada cena)
// ============================================================================

/**
 * Cada cena tem estes hooks (funções chamadas automaticamente):
 *
 * 1. init(data)
 *    └─ Chamado PRIMEIRO, passa dados entre cenas
 *
 * 2. preload()
 *    └─ Carrega assets (imagens, sons)
 *    └─ Mostra loading bar enquanto carrega
 *
 * 3. create()
 *    └─ Todos assets carregados, cria objetos
 *    └─ Setup inicial da cena
 *
 * 4. update(time, delta)
 *    └─ Chamado 60x por segundo
 *    └─ Lógica do jogo (movimento, colisão, IA)
 *    └─ time = tempo total decorrido (ms)
 *    └─ delta = tempo desde último frame (ms)
 *
 * 5. render()
 *    └─ Chamado automaticamente pelo Phaser
 *    └─ Desenha na tela (você não chama direto)
 */

// ============================================================================
// EXEMPLO DE USO
// ============================================================================

/**
 * NO HTML:
 * ```html
 * <body>
 *   <!-- Canvas será criado aqui -->
 *   <script>
 *     import { createGame } from './Game'
 *     const game = createGame()
 *     // Jogo está rodando agora!
 *   </script>
 * </body>
 * ```
 */
