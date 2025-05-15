use tauri_plugin_autostart::{init, MacosLauncher};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn set_policy(app: tauri::AppHandle, policy: String) {
    #[cfg(target_os = "macos")]
    {
        use tauri::ActivationPolicy;
        let policy_enum = match policy.as_str() {
            "regular" => ActivationPolicy::Regular,
            "accessory" => ActivationPolicy::Accessory,
            "prohibited" => ActivationPolicy::Prohibited,
            _ => ActivationPolicy::Regular,
        };
        
        let _ = app.set_activation_policy(policy_enum);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(init(MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, set_policy])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
