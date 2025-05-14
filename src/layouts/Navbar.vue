<template>
  <v-layout class="overflow-visible">
    <v-bottom-navigation bg-color="surface" color="primary" grow elevation="5" height="70">
      <v-btn
        v-for="item in menuItems"
        :key="item.name"
        link
        exact
        :to="{ name: item.name }"
        value="{{item.name}}"
      >
        <v-icon size="x-large" :icon="item.icon" />

        <span class="mt-1">{{ $t("navbar." + item.name) }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script>
export default {
  component: "Navbar",
  data() {
    return {
      menuItems: [
        { name: "home", icon: "mdi-home" },
        { name: "profile", icon: "mdi-account-heart" },
        { name: "settings", icon: "mdi-cog" },
      ],
    };
  },
};
</script>
