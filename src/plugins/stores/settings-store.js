// src/stores/settings-store.js
import { defineStore } from "pinia";
import { getValue, setValue } from "@/services/store-service.js"; // Tauri store servisi
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart'; // Autostart eklentisi

export const useSettingsStore = defineStore("appSettings", {
  state: () => ({
    config: {
      notificationsEnabled: true,
      reminderFrequency: 60,
      wakeTime: "07:00",
      sleepTime: "23:00",
      autoStartEnabled: false, // Başlangıçta false, init ile güncellenecek
    },
    initialized: false, // Store'un genel yüklenme durumu
    autostartInitialized: false, // Autostart özelinde yüklenme durumu
  }),

  actions: {
    async initAppSettings() {
      // Diğer ayarları diskten yükle (Tauri store)
      if (!this.initialized) {
        try {
          const storedNotifications = await getValue("settings_notificationsEnabled");
          this.config.notificationsEnabled = storedNotifications === null ? true : storedNotifications === "true";

          this.config.reminderFrequency = (await getValue("settings_reminderFrequency"))
            ? parseInt(await getValue("settings_reminderFrequency"), 10)
            : 60;
          this.config.wakeTime = (await getValue("settings_wakeTime")) || "07:00";
          this.config.sleepTime = (await getValue("settings_sleepTime")) || "23:00";

          this.initialized = true;
          console.log("Disk-based app settings initialized.");
        } catch (err) {
          console.error("Disk-based app settings yüklenirken hata oluştu:", err);
        }
      }

      // Autostart durumunu eklentiden yükle
      if (!this.autostartInitialized) {
        try {
          this.config.autoStartEnabled = await isEnabled();
          this.autostartInitialized = true;
          console.log("Autostart status initialized from plugin:", this.config.autoStartEnabled);
        } catch (err) {
          console.error("Autostart durumu kontrol edilirken hata (initAppSettings):", err);
          // Hata durumunda varsayılan olarak false kalabilir veya kullanıcıya bilgi verilebilir.
          this.config.autoStartEnabled = false; // Güvenli bir varsayılan
          this.autostartInitialized = true; // Tekrar denememek için
        }
      }
    },

    async updateAppSettings(newSettingsData) {
      // Disk tabanlı ayarları güncelle
      const diskSettings = {};
      if (newSettingsData.notificationsEnabled !== undefined) {
        this.config.notificationsEnabled = newSettingsData.notificationsEnabled;
        diskSettings.notificationsEnabled = String(this.config.notificationsEnabled);
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
          if (diskSettings.notificationsEnabled !== undefined) await setValue("settings_notificationsEnabled", diskSettings.notificationsEnabled);
          if (diskSettings.reminderFrequency !== undefined) await setValue("settings_reminderFrequency", diskSettings.reminderFrequency);
          if (diskSettings.wakeTime !== undefined) await setValue("settings_wakeTime", diskSettings.wakeTime);
          if (diskSettings.sleepTime !== undefined) await setValue("settings_sleepTime", diskSettings.sleepTime);
          console.log("Disk-based app settings updated in Pinia and Tauri store.");
        }
      } catch (err) {
        console.error("Disk-based app settings Tauri'ye kaydedilirken hata:", err);
      }

      // Autostart ayarı için ayrı bir action kullanmak daha temiz olabilir,
      // ama eğer updateAppSettings üzerinden geliyorsa burada da yönetilebilir.
      // Şimdilik toggleAutoStart adında ayrı bir action oluşturalım.
    },

    async toggleAutoStart() {
      try {
        const currentStatus = await isEnabled(); // En güncel durumu al
        if (currentStatus) {
          await disable();
          this.config.autoStartEnabled = false;
          console.log("Autostart devre dışı bırakıldı.");
        } else {
          await enable();
          this.config.autoStartEnabled = true;
          console.log("Autostart aktif edildi.");
        }
      } catch (err) {
        console.error("Autostart işlemi sırasında hata (toggleAutoStart):", err);
        // Hata durumunda, UI'ın state ile senkronize kalması için mevcut durumu tekrar okuyabiliriz
        try {
            this.config.autoStartEnabled = await isEnabled();
        } catch (readError) {
            console.error("Autostart durumunu tekrar okuma hatası:", readError);
            // Belki de kullanıcıya bir hata mesajı göstermek daha iyi olur.
        }
        throw err; // Hatayı yukarıya fırlat ki view haberdar olsun.
      }
    }
  },
});