<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { TrayIcon } from "@tauri-apps/api/tray";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { Menu } from "@tauri-apps/api/menu";
import { exit, relaunch } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from "@tauri-apps/api/window";

onMounted(async () => {
  const currentWindow = getCurrentWindow();
  currentWindow.onCloseRequested(async (event) => {
    event.preventDefault();
    await currentWindow.hide(); 
    await currentWindow.setSkipTaskbar(true);
  });

  const menu = await Menu.new({
    items: [
      {
        id: "restart",
        text: "Restart",
        action: async () => await relaunch(),
      },
      {
        id: "quit",
        text: "Quit",
        action: async () => await exit(0), // Tamamen çıkış
      },
    ],
  });

  const options = {
    menu,
    menuOnLeftClick: true,
    icon: await defaultWindowIcon(),
  };

  await TrayIcon.new(options);
});
</script>
