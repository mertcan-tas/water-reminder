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
import { register } from "@tauri-apps/plugin-global-shortcut";
import { invoke } from "@tauri-apps/api/core";

onMounted(async () => {
  const currentWindow = getCurrentWindow();

  try {
    await invoke("set_policy", { policy: "regular" });
    console.log("Activation policy set to regular on startup.");
  } catch (error) {
    console.error("Failed to set activation policy to regular:", error);
  }

  await currentWindow.show();
  await currentWindow.setSkipTaskbar(false);

  const hideWindow = async () => {
    await currentWindow.hide();
    await currentWindow.setSkipTaskbar(true);
  };

  currentWindow.onCloseRequested(async (event) => {
    event.preventDefault();
    await hideWindow();
    try {
      await invoke("set_policy", { policy: "accessory" });
      console.log("Activation policy set to accessory on close.");
    } catch (error) {
      console.error(
        "Failed to set activation policy to accessory on close:",
        error
      );
    }
  });

  await register("Command+Q", async () => {
    await hideWindow();
    try {
      await invoke("set_policy", { policy: "accessory" });
      console.log("Activation policy set to accessory via Command+Q.");
    } catch (error) {
      console.error(
        "Failed to set activation policy to accessory via Command+Q:",
        error
      );
    }
  });

  const menu = await Menu.new({
    items: [
      {
        id: "open",
        text: "Open",
        action: async () => {
          await currentWindow.show();
          await currentWindow.setSkipTaskbar(false);
          await currentWindow.setFocus();
          try {
            await invoke("set_policy", { policy: "regular" });
            console.log("Activation policy set to regular via tray menu.");
          } catch (error) {
            console.error(
              "Failed to set activation policy to regular via tray menu:",
              error
            );
          }
        },
      },
      {
        id: "restart",
        text: "Restart",
        action: async () => await relaunch(),
      },
      {
        id: "quit",
        text: "Quit",
        action: async () => await exit(0),
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
