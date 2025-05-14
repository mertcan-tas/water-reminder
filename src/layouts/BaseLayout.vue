<template>
  <v-app :theme="themeStore.isDark ? 'dark' : 'light'">
    <Appbar></Appbar>
    <v-main>
      <slot></slot>
    </v-main>
    <Navbar></Navbar>
  </v-app>
</template>

<script>
import { useThemeStore } from "@/plugins/stores/theme-store.js";
import { watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const themeStore = useThemeStore();
    const i18n = useI18n();

    themeStore.initSettings();

    watch(
      () => themeStore.currentLanguage,
      (newLang) => {
        i18n.locale.value = newLang;
      },
      { immediate: true }
    );

    return {
      themeStore,
    };
  },
};
</script>
