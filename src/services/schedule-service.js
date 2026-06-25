import { defineStore } from "pinia";
import sendTauriNotification from "@/services/notification-service.js";
import { useSettingsStore } from "@/plugins/stores/settings-store.js";
import { watch } from "vue";
import { getValue } from "@/services/store-service.js";
import i18n from "@/plugins/i18n/index.js";

export const useNotificationServiceStore = defineStore("notificationService", {
  state: () => ({
    intervalId: null,
    isRunning: false,
  }),

  actions: {
    async startNotificationService() {
      if (this.isRunning) {
        return;
      }

      this.isRunning = true;

      const settingsStore = useSettingsStore();

      await settingsStore.initAppSettings();

      const checkAndSendNotifications = async () => {
        const notificationsEnabled = settingsStore.config.notificationsEnabled;
        if (!notificationsEnabled) {
          return;
        }

        const wakeTime = settingsStore.config.wakeTime;
        const sleepTime = settingsStore.config.sleepTime;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
        const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);

        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const wakeTimeInMinutes = wakeHour * 60 + wakeMinute;
        const sleepTimeInMinutes = sleepHour * 60 + sleepMinute;

        let isWithinTimeRange = false;

        if (wakeTimeInMinutes < sleepTimeInMinutes) {
          isWithinTimeRange =
            currentTimeInMinutes >= wakeTimeInMinutes &&
            currentTimeInMinutes < sleepTimeInMinutes;
        } else {
          isWithinTimeRange =
            currentTimeInMinutes >= wakeTimeInMinutes ||
            currentTimeInMinutes < sleepTimeInMinutes;
        }

        if (!isWithinTimeRange) {
          return;
        }

        try {
          const userWaterIntake = (await getValue("user_waterIntake")) || 0;
          const { t } = i18n.global;
          const title = t("notification.reminder_title");
          const message = t("notification.reminder_body", {
            amount: userWaterIntake,
          });
          sendTauriNotification(title, message);
        } catch (err) {
          console.error("Notification Error:", err);
        }
      };

      await checkAndSendNotifications();

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      const frequency = settingsStore.config.reminderFrequency;
      this.intervalId = setInterval(
        checkAndSendNotifications,
        frequency * 60 * 1000
      );

      watch(
        () => settingsStore.config.notificationsEnabled,
        (newVal) => {
          if (!newVal && this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
          } else if (newVal && !this.isRunning) {
            this.startNotificationService();
          }
        }
      );

      watch(
        () => settingsStore.config.reminderFrequency,
        async () => {
          this.stopNotificationService();
          if (settingsStore.config.notificationsEnabled) {
            await this.startNotificationService();
          }
        }
      );

      watch(
        () => [settingsStore.config.wakeTime, settingsStore.config.sleepTime],
        () => {
          this.stopNotificationService();
          if (settingsStore.config.notificationsEnabled) {
            this.startNotificationService();
          }
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
