<template>
  <v-app-bar color="primary" elevation="0" height="55">
    <v-app-bar-title class="font-weight-medium no-select"
      >{{ $t('app.name') }}</v-app-bar-title
    >

    <v-spacer></v-spacer>
    
    <v-select
      v-model="themeStore.currentLanguage"
      :items="languages"
      item-title="text"
      item-value="value"
      density="compact"
      hide-details
      class="language-select mr-2"
      variant="outlined"
      bg-color="transparent"
      @update:model-value="changeLanguage"
    >
      <template #prepend>
        <v-icon>mdi-translate</v-icon>
      </template>
    </v-select>
    

    <v-btn class="mr-3" icon @click="toggleTheme">
      <v-icon>{{
        themeStore.isDark ? "mdi-weather-sunny" : "mdi-weather-night"
      }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { useThemeStore } from "@/plugins/stores/theme-store.js";
import { ref, computed } from "vue";

export default {
  setup() {
    const themeStore = useThemeStore();

    const languages = [
      { text: "Türkçe", value: "tr" },
      { text: "English", value: "en" },
    ];

    const toggleTheme = () => {
      themeStore.toggleDarkMode();
    };

    const changeLanguage = (lang) => {
      themeStore.setLanguage(lang);
    };

    return {
      themeStore,
      languages,
      toggleTheme,
      changeLanguage,
    };
  },
};
</script>

<style scoped>
.language-select {
  max-width: 160px;
}
</style>
