import { defineStore } from "pinia";
import sendTauriNotification from "@/services/notification-service.js";
import { useSettingsStore } from "@/plugins/stores/settings-store.js";
import { watch, ref } from "vue";
import { getValue } from "@/services/store-service.js";

export const useNotificationServiceStore = defineStore("notificationService", {
  state: () => ({
    intervalId: null,
    isRunning: false,
  }),

  actions: {
    async startNotificationService() {
      if (this.isRunning) return;
      this.isRunning = true;

      const settingsStore = useSettingsStore();
      await settingsStore.initAppSettings();

      const checkAndSendNotifications = async () => {
        const notificationsEnabled = settingsStore.config.notificationsEnabled;
        if (!notificationsEnabled) return;

        const wakeTime = settingsStore.config.wakeTime;
        const sleepTime = settingsStore.config.sleepTime;

        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, "0");
        const currentMinute = now.getMinutes().toString().padStart(2, "0");
        const currentTime = `${currentHour}:${currentMinute}`;

        const isWithinTimeRange =
          currentTime >= wakeTime && currentTime < sleepTime;

        if (!isWithinTimeRange) return;

        try {
          const userWaterIntake = (await getValue("user_waterIntake")) || 0;
          const message = `Su içmeyi unutma! Bugün ${userWaterIntake} ml içtin.`;

          await sendTauriNotification("Su Hatırlatıcısı", message);
        } catch (err) {
          console.error("Bildirim gönderilirken hata oluştu:", err);
        }
      };

      await checkAndSendNotifications();

      const reminderFrequencyRef = ref(settingsStore.config.reminderFrequency);

      this.intervalId = setInterval(
        checkAndSendNotifications,
        reminderFrequencyRef.value * 60 * 1000
      );

      watch(
        () => settingsStore.config.notificationsEnabled,
        (newVal) => {
          if (!newVal && this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log("Bildirim servisi kapatıldı.");
          }
        }
      );

      watch(
        () => settingsStore.config.reminderFrequency,
        (newVal) => {
          if (this.intervalId) clearInterval(this.intervalId);
          this.intervalId = setInterval(
            checkAndSendNotifications,
            newVal * 60 * 1000
          );
          console.log(`Yeni hatırlatıcı frekansına geçildi: ${newVal} dakika`);
        }
      );

      watch(
        () => [settingsStore.config.wakeTime, settingsStore.config.sleepTime],
        () => {
          console.log(
            "Uyanma/uyku saati değişti. Bildirim zamanlaması güncellenecek."
          );
        }
      );
    },

    stopNotificationService() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isRunning = false;
    },
  },
});
