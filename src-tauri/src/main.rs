// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[derive(serde::Serialize, serde::Deserialize)]
struct GitAccount {
    name: String,
    email: String,
}

#[tauri::command]
fn get_git_config() -> GitAccount {
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

    GitAccount { name, email }
}

#[tauri::command]
fn switch_git_account(account_type: String, git_info: GitAccount) {
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

#[tauri::command]
fn reset_git_config() -> Result<(), String> {
    // Command to unset global Git user name
    let output_name = Command::new("git")
        .args(&["config", "--global", "--unset", "user.name"])
        .output();

    if output_name.is_err() {
        return Err("Failed to reset Git user.name".into());
    }

    // Command to unset global Git user email
    let output_email = Command::new("git")
        .args(&["config", "--global", "--unset", "user.email"])
        .output();

    if output_email.is_err() {
        return Err("Failed to reset Git user.email".into());
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_git_config,
            switch_git_account,
            reset_git_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
