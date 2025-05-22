import { defineStore } from "pinia";
import { getValue, setValue } from "@/services/store-service.js";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";

export const useSettingsStore = defineStore("appSettings", {
  state: () => ({
    config: {
      notificationsEnabled: true,
      reminderFrequency: 1,
      wakeTime: "07:00",
      sleepTime: "22:00",
      autoStartEnabled: false,
    },
    initialized: false,
    autostartInitialized: false,
  }),

  actions: {
    async initAppSettings() {
      if (!this.initialized) {
        try {
          const storedNotifications = await getValue(
            "settings_notificationsEnabled"
          );
          this.config.notificationsEnabled =
            storedNotifications === null
              ? true
              : storedNotifications === "true";

          this.config.reminderFrequency = (await getValue(
            "settings_reminderFrequency"
          ))
            ? parseInt(await getValue("settings_reminderFrequency"), 10)
            : 60;
          this.config.wakeTime =
            (await getValue("settings_wakeTime")) || "07:00";
          this.config.sleepTime =
            (await getValue("settings_sleepTime")) || "23:00";

          this.initialized = true;
          console.log("Disk-based app settings initialized.");
        } catch (err) {
          console.error(
            "An error occurred while loading disk-based app settings:",
            err
          );
        }
      }

      if (!this.autostartInitialized) {
        try {
          this.config.autoStartEnabled = await isEnabled();
          this.autostartInitialized = true;
          console.log(
            "Autostart status initialized from plugin:",
            this.config.autoStartEnabled
          );
        } catch (err) {
          console.error(
            "Error checking autostart status (initAppSettings):",
            err
          );

          this.config.autoStartEnabled = false;
          this.autostartInitialized = true;
        }
      }
    },

    async updateAppSettings(newSettingsData) {
      const diskSettings = {};
      if (newSettingsData.notificationsEnabled !== undefined) {
        this.config.notificationsEnabled = newSettingsData.notificationsEnabled;
        diskSettings.notificationsEnabled = String(
          this.config.notificationsEnabled
        );
      }
      if (newSettingsData.reminderFrequency !== undefined) {
        this.config.reminderFrequency = newSettingsData.reminderFrequency;
        diskSettings.reminderFrequency = this.config.reminderFrequency;
      }
      if (newSettingsData.wakeTime !== undefined) {
        this.config.wakeTime = newSettingsData.wakeTime;
        diskSettings.wakeTime = this.config.wakeTime;
      }
      if (newSettingsData.sleepTime !== undefined) {
        this.config.sleepTime = newSettingsData.sleepTime;
        diskSettings.sleepTime = this.config.sleepTime;
      }

      try {
        if (Object.keys(diskSettings).length > 0) {
          if (diskSettings.notificationsEnabled !== undefined)
            await setValue(
              "settings_notificationsEnabled",
              diskSettings.notificationsEnabled
            );
          if (diskSettings.reminderFrequency !== undefined)
            await setValue(
              "settings_reminderFrequency",
              diskSettings.reminderFrequency
            );
          if (diskSettings.wakeTime !== undefined)
            await setValue("settings_wakeTime", diskSettings.wakeTime);
          if (diskSettings.sleepTime !== undefined)
            await setValue("settings_sleepTime", diskSettings.sleepTime);
          console.log(
            "Disk-based app settings updated in Pinia and Tauri store."
          );
        }
      } catch (err) {
        console.error(
          "Error while displaying disk-based application settings to Tauri:",
          err
        );
      }
    },

    async toggleAutoStart() {
      try {
        const currentStatus = await isEnabled();
        if (currentStatus) {
          await disable();
          this.config.autoStartEnabled = false;
          console.log("Autostart is disabled.");
        } else {
          await enable();
          this.config.autoStartEnabled = true;
          console.log("Autostart activated.");
        }
      } catch (err) {
        console.error(
          "Error during autostart process (toggleAutoStart):",
          err
        );

        try {
          this.config.autoStartEnabled = await isEnabled();
        } catch (readError) {
          console.error("Error rereading autostart status:", readError);
        }
        throw err;
      }
    },
  },
});
