import { defineStore } from "pinia";
import { getValue, setValue } from "@/services/store-service.js";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: true,
    currentLanguage: "tr",
  }),
  
  actions: {
    async initSettings() {
      const savedDarkMode = await getValue("darkMode");
      const savedLanguage = await getValue("language");

      this.isDark = savedDarkMode ?? true;
      this.currentLanguage = savedLanguage ?? "tr";
    },

    async toggleDarkMode() {
      this.isDark = !this.isDark;
      await setValue("darkMode", this.isDark);
    },

    async setLanguage(lang) {
      this.currentLanguage = lang;
      await setValue("language", lang);
    },
  },
});