<template>
  <v-col cols="6" class="d-flex">
    <v-btn
      @click="dialog = true"
      block
      variant="outlined"
      color="error"
      class="mr-2 text-capitalize"
    >
      <v-icon start>mdi-delete-forever</v-icon>
      {{ $t("pages.settings.reset_area.reset_data_btn_text") }}
    </v-btn>
  </v-col>

  <v-dialog v-model="dialog" max-width="450">
    <v-card class="mx-auto rounded-lg" width="400" loading>
      <template v-slot:title>
        <span class="font-weight-black">
          {{ $t("pages.settings.reset_area.reset_data_dialog_title") }}</span
        >
      </template>

      <template v-slot:subtitle>
        <span class="font-weight-medium"
          >⚠️
          {{ $t("pages.settings.reset_area.reset_data_dialog_subtitle") }}</span
        >
      </template>

      <v-card-text>{{
        $t("pages.settings.reset_area.reset_data_dialog_body")
      }}</v-card-text>

      <v-card-text>{{
        $t("pages.settings.reset_area.reset_data_dialog_question")
      }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="tonal" @click="handleRestoreClick">
          {{
            $t("pages.settings.reset_area.reset_data_dialog_accept_btn")
          }}</v-btn
        >
        <v-btn variant="tonal" color="primary" @click="dialog = false">
          {{
            $t("pages.settings.reset_area.reset_data_dialog_decline_btn")
          }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { relaunch } from "@tauri-apps/plugin-process";
import { restoreDefaultValues } from "@/services/store-service.js";

export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    async handleRestoreClick() {
      await restoreDefaultValues();
      await relaunch();
    },
  },
};
</script>
