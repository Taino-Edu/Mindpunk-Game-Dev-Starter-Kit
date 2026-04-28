# ─────────────────────────────────────────────────────────────────────────────
# items.py — Definição dos itens do jogo
#
# Lido pelo Rust via PyO3. Edite aqui para criar novos itens.
#
# Campos:
#   name    — nome exibido no log e inventário
#   type    — "potion" | "weapon" | "shield" | "antidote"
#             potion   → cura `value` HP ao usar
#             weapon   → aumenta ataque permanentemente em `value`
#             shield   → aumenta defesa permanentemente em `value`
#             antidote → remove veneno
#   value   — magnitude do efeito
#   symbol  — caractere no inventário (exibido no HUD)
#   weight  — peso na tabela de loot (maior = aparece com mais frequência)
# ─────────────────────────────────────────────────────────────────────────────

def get_items():
    return [
        # ── Poções ────────────────────────────────────────────────────────────
        {
            "name":   "Poção de Vida Pequena",
            "type":   "potion",
            "value":  10,           # cura 10 HP
            "symbol": "!",
            "weight": 10,           # item mais comum
        },
        {
            "name":   "Poção de Vida Grande",
            "type":   "potion",
            "value":  25,
            "symbol": "!",
            "weight": 4,
        },
        {
            "name":   "Antídoto",
            "type":   "antidote",
            "value":  0,            # valor não importa para antídoto
            "symbol": "&",
            "weight": 5,
        },

        # ── Armas ─────────────────────────────────────────────────────────────
        {
            "name":   "Faca Enferrujada",
            "type":   "weapon",
            "value":  2,            # +2 de ataque
            "symbol": "/",
            "weight": 6,
        },
        {
            "name":   "Espada Curta",
            "type":   "weapon",
            "value":  5,
            "symbol": "/",
            "weight": 3,
        },
        {
            "name":   "Espada Longa Rúnica",
            "type":   "weapon",
            "value":  10,
            "symbol": "/",
            "weight": 1,            # item raro
        },

        # ── Escudos / Armaduras ────────────────────────────────────────────────
        {
            "name":   "Escudo de Madeira",
            "type":   "shield",
            "value":  2,            # +2 de defesa
            "symbol": "]",
            "weight": 6,
        },
        {
            "name":   "Escudo de Ferro",
            "type":   "shield",
            "value":  4,
            "symbol": "]",
            "weight": 3,
        },
        {
            "name":   "Armadura de Placas",
            "type":   "shield",
            "value":  7,
            "symbol": "]",
            "weight": 1,
        },
    ]
