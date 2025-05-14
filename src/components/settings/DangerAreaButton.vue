<template>
  <v-col cols="6" class="d-flex">
    <v-btn @click="relaunchApp" block variant="outlined" color="error" class="mr-2 text-capitalize">
      <v-icon start>mdi-calculator</v-icon>
      {{ $t("pages.profile.calculate_water") }}
    </v-btn>
  </v-col>
</template>

<script>
import { relaunch } from '@tauri-apps/plugin-process';

export default {
  methods: {
    async relaunchApp(){
      await relaunch();
    }
  }
}
</script>
