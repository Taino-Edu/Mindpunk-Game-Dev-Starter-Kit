# ─────────────────────────────────────────────────────────────────────────────
# loot.py — Tabela de loot por andar
#
# O Rust chama get_loot_for_floor(floor) passando o número do andar atual.
# A função retorna uma lista de nomes de itens que devem aparecer naquele andar.
#
# Os nomes devem corresponder exatamente aos campos "name" em items.py.
# ─────────────────────────────────────────────────────────────────────────────

import random

# Tabela de loot: andar → lista de (nome_do_item, peso)
# Peso maior = item aparece com mais chance na seleção aleatória.
LOOT_TABLE = {
    1: [
        ("Poção de Vida Pequena",  8),
        ("Antídoto",               3),
        ("Faca Enferrujada",       4),
        ("Escudo de Madeira",      4),
    ],
    2: [
        ("Poção de Vida Pequena",  6),
        ("Poção de Vida Grande",   2),
        ("Antídoto",               4),   # mais antídoto porque aranha venena
        ("Faca Enferrujada",       3),
        ("Espada Curta",           2),
        ("Escudo de Madeira",      3),
        ("Escudo de Ferro",        1),
    ],
    3: [
        ("Poção de Vida Grande",   4),
        ("Antídoto",               3),
        ("Espada Curta",           3),
        ("Escudo de Ferro",        3),
        ("Espada Longa Rúnica",    1),
    ],
    4: [
        ("Poção de Vida Grande",   5),
        ("Antídoto",               2),
        ("Espada Longa Rúnica",    2),
        ("Armadura de Placas",     2),
    ],
    5: [
        ("Poção de Vida Grande",   6),   # andar do chefão: bastante cura
        ("Antídoto",               4),   # e antídoto (chefão venena)
        ("Espada Longa Rúnica",    3),
        ("Armadura de Placas",     3),
    ],
}

# Quantos itens aparecem por andar
ITEMS_PER_FLOOR = {
    1: 3,
    2: 4,
    3: 4,
    4: 3,
    5: 5,   # andar do chefão tem mais itens para compensar a dificuldade
}


def get_loot_for_floor(floor: int) -> list[str]:
    """
    Retorna uma lista de nomes de itens para spawnar no andar `floor`.
    Usa seleção aleatória ponderada (weighted random) com base nos pesos da tabela.
    """
    # Usa o andar 5 como fallback se floor for além do definido
    table = LOOT_TABLE.get(floor, LOOT_TABLE[5])
    count = ITEMS_PER_FLOOR.get(floor, 3)

    # Separa nomes e pesos
    names   = [entry[0] for entry in table]
    weights = [entry[1] for entry in table]

    # random.choices faz seleção com reposição e pesos
    # k=count define quantos itens sortear
    chosen = random.choices(names, weights=weights, k=count)

    return chosen
