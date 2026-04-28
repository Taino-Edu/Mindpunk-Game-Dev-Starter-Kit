// ─────────────────────────────────────────────────────────────────────────────
// python_bridge.rs — Integração Rust ↔ Python via PyO3 (API 0.22+)
//
// PyO3 0.22+ usa o tipo `Bound<'py, T>` no lugar dos antigos `&PyAny`, `&PyList`
// etc. A principal diferença prática: métodos que antes retornavam `&T` agora
// retornam `Bound<'py, T>`, mas a lógica permanece a mesma.
//
// Como funciona:
//   1. Rust abre o GIL (Global Interpreter Lock) com `Python::with_gil`
//   2. Adiciona `scripts/` ao sys.path do Python
//   3. Importa o módulo Python desejado
//   4. Chama a função Python e itera a lista retornada
//   5. Extrai campos dos dicts e converte para structs Rust
// ─────────────────────────────────────────────────────────────────────────────

use pyo3::prelude::*;
use pyo3::types::{PyList, PyDict};

// ── Structs intermediários ───────────────────────────────────────────────────

/// Dados de um inimigo vindos do Python.
#[derive(Debug)]
pub struct EnemyTemplate {
    pub name: String,
    pub symbol: char,
    pub hp: i32,
    pub attack: i32,
    pub defense: i32,
    pub behavior: String,
    pub poisons: bool,
    pub sight_range: i32,
    pub min_floor: u32,
}

/// Dados de um item vindos do Python.
/// `weight` é usado pelo loot.py no lado Python; o Rust só armazena o valor.
#[derive(Debug, Clone)]
pub struct ItemTemplate {
    pub name: String,
    pub item_type: String,
    pub value: i32,
    pub symbol: char,
    #[allow(dead_code)]
    pub weight: u32,
}

// ── Carregamento de inimigos ─────────────────────────────────────────────────

pub fn load_enemy_templates() -> Vec<EnemyTemplate> {
    Python::with_gil(|py| {
        add_scripts_to_path(py);

        // Importa o módulo enemies.py
        let module = match py.import("enemies") {
            Ok(m) => m,
            Err(e) => {
                eprintln!("[PyO3] Erro ao importar enemies.py: {}", e);
                return Vec::new();
            }
        };

        // Chama get_enemies() → retorna lista de dicts
        let func = match module.getattr("get_enemies") {
            Ok(f) => f,
            Err(e) => { eprintln!("[PyO3] get_enemies não encontrado: {}", e); return Vec::new(); }
        };

        let result = match func.call0() {
            Ok(r) => r,
            Err(e) => { eprintln!("[PyO3] Erro ao chamar get_enemies(): {}", e); return Vec::new(); }
        };

        // Converte PyObject → Bound<PyList>
        let list: &Bound<PyList> = match result.downcast::<PyList>() {
            Ok(l) => l,
            Err(_) => { eprintln!("[PyO3] get_enemies() deve retornar uma lista"); return Vec::new(); }
        };

        // Itera a lista e converte cada dict em EnemyTemplate
        list.iter()
            .filter_map(|item| {
                let dict = item.downcast::<PyDict>().ok()?;
                Some(EnemyTemplate {
                    name:        get_str(dict, "name").unwrap_or("?".into()),
                    symbol:      get_str(dict, "symbol").unwrap_or("?".into()).chars().next().unwrap_or('?'),
                    hp:          get_i32(dict, "hp").unwrap_or(10),
                    attack:      get_i32(dict, "attack").unwrap_or(3),
                    defense:     get_i32(dict, "defense").unwrap_or(0),
                    behavior:    get_str(dict, "behavior").unwrap_or("chase".into()),
                    poisons:     get_bool(dict, "poisons").unwrap_or(false),
                    sight_range: get_i32(dict, "sight_range").unwrap_or(6),
                    min_floor:   get_i32(dict, "min_floor").unwrap_or(1) as u32,
                })
            })
            .collect()
    })
}

// ── Carregamento de itens ────────────────────────────────────────────────────

pub fn load_item_templates() -> Vec<ItemTemplate> {
    Python::with_gil(|py| {
        add_scripts_to_path(py);

        let module = match py.import("items") {
            Ok(m) => m,
            Err(e) => { eprintln!("[PyO3] Erro ao importar items.py: {}", e); return Vec::new(); }
        };

        let func = match module.getattr("get_items") {
            Ok(f) => f,
            Err(_) => return Vec::new(),
        };

        let result = match func.call0() {
            Ok(r) => r,
            Err(_) => return Vec::new(),
        };

        let list = match result.downcast::<PyList>() {
            Ok(l) => l,
            Err(_) => return Vec::new(),
        };

        list.iter()
            .filter_map(|item| {
                let dict = item.downcast::<PyDict>().ok()?;
                Some(ItemTemplate {
                    name:      get_str(dict, "name").unwrap_or("?".into()),
                    item_type: get_str(dict, "type").unwrap_or("potion".into()),
                    value:     get_i32(dict, "value").unwrap_or(5),
                    symbol:    get_str(dict, "symbol").unwrap_or("!".into()).chars().next().unwrap_or('!'),
                    weight:    get_i32(dict, "weight").unwrap_or(1) as u32,
                })
            })
            .collect()
    })
}

// ── Tabela de loot ───────────────────────────────────────────────────────────

pub fn get_loot_for_floor(floor: u32) -> Vec<String> {
    Python::with_gil(|py| {
        add_scripts_to_path(py);

        let module = match py.import("loot") {
            Ok(m) => m,
            Err(_) => return Vec::new(),
        };

        let func = match module.getattr("get_loot_for_floor") {
            Ok(f) => f,
            Err(_) => return Vec::new(),
        };

        // Passa o número do andar como argumento Python
        let result = match func.call1((floor as i32,)) {
            Ok(r) => r,
            Err(_) => return Vec::new(),
        };

        let list = match result.downcast::<PyList>() {
            Ok(l) => l,
            Err(_) => return Vec::new(),
        };

        list.iter()
            .filter_map(|item| item.extract::<String>().ok())
            .collect()
    })
}

// ── Helpers internos ─────────────────────────────────────────────────────────

/// Adiciona a pasta `scripts/` ao sys.path do Python.
/// Sem isso os `import` acima não encontram os arquivos .py.
fn add_scripts_to_path(py: Python) {
    let scripts_path = std::env::current_dir()
        .unwrap_or_default()
        .join("scripts")
        .to_string_lossy()
        .to_string();

    if let Ok(sys) = py.import("sys") {
        if let Ok(path_obj) = sys.getattr("path") {
            if let Ok(path_list) = path_obj.downcast::<PyList>() {
                // Só insere se ainda não estiver na lista
                let already = path_list.iter()
                    .any(|p| p.extract::<String>().unwrap_or_default() == scripts_path);
                if !already {
                    // insert(0, value) — coloca no início para ter prioridade
                    let _ = path_list.insert(0, &scripts_path);
                }
            }
        }
    }
}

// Extratores tipados — retornam Option para lidar com campos ausentes
fn get_str(dict: &Bound<PyDict>, key: &str) -> Option<String> {
    dict.get_item(key).ok()??.extract::<String>().ok()
}

fn get_i32(dict: &Bound<PyDict>, key: &str) -> Option<i32> {
    dict.get_item(key).ok()??.extract::<i32>().ok()
}

fn get_bool(dict: &Bound<PyDict>, key: &str) -> Option<bool> {
    dict.get_item(key).ok()??.extract::<bool>().ok()
}
