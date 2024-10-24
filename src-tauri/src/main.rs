// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[derive(serde::Serialize)]
struct GitConfig {
    name: String,
    email: String,
}

#[tauri::command]
fn get_git_config() -> GitConfig {
    let name_output = Command::new("git")
        .args(&["config", "--global", "user.name"])
        .output()
        .expect("failed to get git user name");

    let email_output = Command::new("git")
        .args(&["config", "--global", "user.email"])
        .output()
        .expect("failed to get git user email");

    let name = String::from_utf8_lossy(&name_output.stdout)
        .trim()
        .to_string();
    let email = String::from_utf8_lossy(&email_output.stdout)
        .trim()
        .to_string();

    GitConfig { name, email }
}

#[derive(serde::Deserialize)]
struct GitInfo {
    name: String,
    email: String,
}

#[tauri::command]
fn switch_git_account(account_type: String, git_info: GitInfo) {
    // Switch Git configuration based on user input
    Command::new("git")
        .args(&["config", "--global", "user.name", &git_info.name])
        .output()
        .expect(&format!("failed to switch to {} account", account_type));

    Command::new("git")
        .args(&["config", "--global", "user.email", &git_info.email])
        .output()
        .expect(&format!("failed to switch to {} account", account_type));

    println!("Switched to {} account", account_type);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_git_config, switch_git_account])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
