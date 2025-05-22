import { registerPlugins } from "@/plugins";
import { useNotificationServiceStore } from "@/services/schedule-service.js";
import { useSettingsStore } from "@/plugins/stores/settings-store.js";
import { useUserStore } from "@/plugins/stores/user-store.js";
import { useThemeStore } from "@/plugins/stores/theme-store.js";
import App from "@/App.vue";
import { createApp } from "vue";
import "@/assets/css/main.scss";

const app = createApp(App);
registerPlugins(app);

const settingsStore = useSettingsStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
const notificationService = useNotificationServiceStore();

async function initializeApp() {
  try {
    await settingsStore.initAppSettings();
    await userStore.initUserProfile();
    await themeStore.initSettings();
    await notificationService.startNotificationService();
    console.log("All stores initialized and notification service started");
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

initializeApp();
app.mount("#app");
