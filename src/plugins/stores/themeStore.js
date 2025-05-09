import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('darkMode') === 'true' || false,
    currentLanguage: localStorage.getItem('language') || 'tr',
  }),
  
  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark;
      localStorage.setItem('darkMode', this.isDark);
    },
    
    setLanguage(lang) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
    },
    
    initSettings() {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        this.isDark = savedTheme === 'true';
      }
      
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage !== null) {
        this.currentLanguage = savedLanguage;
      }
    }
  }
});