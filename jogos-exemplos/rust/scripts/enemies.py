# ─────────────────────────────────────────────────────────────────────────────
# enemies.py — Definição dos inimigos do jogo
#
# Este arquivo é lido pelo Rust via PyO3 em tempo de execução.
# Você pode adicionar, remover ou modificar inimigos aqui sem recompilar.
#
# Campos de cada inimigo:
#   name        — nome exibido no log de combate
#   symbol      — caractere ASCII exibido no mapa (1 char)
#   hp          — pontos de vida
#   attack      — dano base por ataque
#   defense     — redução de dano recebido
#   behavior    — "random" | "chase" | "ranged" | "boss"
#   poisons     — True se o ataque aplica veneno
#   sight_range — quantos tiles o inimigo enxerga
#   min_floor   — andar mínimo para aparecer (1 = desde o início)
# ─────────────────────────────────────────────────────────────────────────────

def get_enemies():
    return [
        # ── Andar 1: Inimigos fáceis ──────────────────────────────────────────
        {
            "name":        "Rato Gigante",
            "symbol":      "r",
            "hp":          8,
            "attack":      3,
            "defense":     0,
            "behavior":    "random",   # anda aleatoriamente, não persegue
            "poisons":     False,
            "sight_range": 4,
            "min_floor":   1,
        },
        {
            "name":        "Esqueleto",
            "symbol":      "s",
            "hp":          12,
            "attack":      5,
            "defense":     1,
            "behavior":    "chase",    # persegue o jogador diretamente
            "poisons":     False,
            "sight_range": 6,
            "min_floor":   1,
        },

        # ── Andar 2: Inimigos médios ──────────────────────────────────────────
        {
            "name":        "Aranha Venenosa",
            "symbol":      "a",
            "hp":          10,
            "attack":      4,
            "defense":     0,
            "behavior":    "chase",
            "poisons":     True,       # aplica veneno (50% de chance)
            "sight_range": 7,
            "min_floor":   2,
        },
        {
            "name":        "Goblin Arqueiro",
            "symbol":      "g",
            "hp":          14,
            "attack":      6,
            "defense":     1,
            "behavior":    "ranged",   # mantém distância e atira
            "poisons":     False,
            "sight_range": 8,
            "min_floor":   2,
        },

        # ── Andar 3: Inimigos difíceis ────────────────────────────────────────
        {
            "name":        "Golem de Pedra",
            "symbol":      "G",
            "hp":          30,
            "attack":      8,
            "defense":     4,          # muito resistente
            "behavior":    "chase",
            "poisons":     False,
            "sight_range": 5,
            "min_floor":   3,
        },
        {
            "name":        "Mago Sombrio",
            "symbol":      "M",
            "hp":          18,
            "attack":      10,
            "defense":     1,
            "behavior":    "ranged",
            "poisons":     True,       # magia envenenada
            "sight_range": 10,
            "min_floor":   3,
        },

        # ── Andar 4: Elite ─────────────────────────────────────────────────────
        {
            "name":        "Cavaleiro Morto-Vivo",
            "symbol":      "K",
            "hp":          35,
            "attack":      12,
            "defense":     5,
            "behavior":    "chase",
            "poisons":     False,
            "sight_range": 7,
            "min_floor":   4,
        },

        # ── Andar 5: Chefão ────────────────────────────────────────────────────
        {
            "name":        "Guardião Ancestral",
            "symbol":      "B",
            "hp":          60,
            "attack":      15,
            "defense":     6,
            "behavior":    "boss",     # persegue sempre, ignora bônus de distância
            "poisons":     True,
            "sight_range": 15,         # enxerga o mapa inteiro
            "min_floor":   5,
        },
    ]
