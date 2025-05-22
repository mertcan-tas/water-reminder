import { defineStore } from "pinia";
import sendTauriNotification from "@/services/notification-service.js";
import { useSettingsStore } from "@/plugins/stores/settings-store.js";
import { watch } from "vue";
import { getValue } from "@/services/store-service.js";

export const useNotificationServiceStore = defineStore("notificationService", {
  state: () => ({
    intervalId: null,
    isRunning: false,
  }),

  actions: {
    async startNotificationService() {
      if (this.isRunning) {
        console.log("Notification service is already running");
        return;
      }

      console.log("Starting notification service...");
      this.isRunning = true;

      const settingsStore = useSettingsStore();

      await settingsStore.initAppSettings();

      const checkAndSendNotifications = async () => {
        console.log("Checking notifications...");
        const notificationsEnabled = settingsStore.config.notificationsEnabled;
        if (!notificationsEnabled) {
          console.log("Notifications are disabled");
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
          console.log(
            "Outside of notification time range. Current time:",
            `${currentHour.toString().padStart(2, "0")}:${currentMinute
              .toString()
              .padStart(2, "0")}`,
            "Wake:",
            wakeTime,
            "Sleep:",
            sleepTime
          );
          return;
        }
        
        try {
          const userWaterIntake = (await getValue("user_waterIntake")) || 0;
          const message = `Su içmeyi unutma! Bugün ${userWaterIntake} ml içtin.`;
          console.log("Sending reminder notification:", message);
          sendTauriNotification("Water Reminder", message);
        } catch (err) {
          console.error("Notification Error:", err);
        }
      };

      await checkAndSendNotifications();

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      const frequency = settingsStore.config.reminderFrequency;
      console.log(`Setting up notification interval for ${frequency} minutes`);
      this.intervalId = setInterval(
        checkAndSendNotifications,
        frequency * 60 * 1000
      );

      watch(
        () => settingsStore.config.notificationsEnabled,
        (newVal) => {
          console.log("Notification enabled status changed:", newVal);
          if (!newVal && this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log("Bildirim servisi kapatıldı.");
          } else if (newVal && !this.isRunning) {
            this.startNotificationService();
          }
        }
      );

      watch(
        () => settingsStore.config.reminderFrequency,
        async (newVal) => {
          console.log("Reminder frequency changed to:", newVal);
          this.stopNotificationService();
          if (settingsStore.config.notificationsEnabled) {
            await this.startNotificationService();
          }
        }
      );

      watch(
        () => [settingsStore.config.wakeTime, settingsStore.config.sleepTime],
        () => {
          console.log(
            "Wake/sleep time changed, restarting notification service"
          );
          this.stopNotificationService();
          if (settingsStore.config.notificationsEnabled) {
            this.startNotificationService();
          }
        }
      );
    },

    stopNotificationService() {
      console.log("Stopping notification service...");
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isRunning = false;
    },
  },
});
