<template>
  <BaseLayout>
    <v-container class="mt-10">
      <v-card rounded="xl" elevation="0" class="pa-2 border-sm">
        <v-card-title>{{ $t("pages.settings.title") }}</v-card-title>
        <v-divider class="my-3"></v-divider>
        <v-container
          v-if="settingsStore.initialized && settingsStore.autostartInitialized"
        >
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="localSettings.notificationsEnabled"
                :label="$t('pages.settings.notification_switch')"
                color="primary"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model.number="localSettings.reminderFrequency"
                :items="reminderFrequencies"
                item-title="text"
                item-value="value"
                :label="$t('pages.settings.reminder_frequency')"
                variant="outlined"
                hide-details
                density="comfortable"
                prepend-inner-icon="mdi-bell"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localSettings.wakeTime"
                :label="$t('pages.settings.waking_hour')"
                type="time"
                variant="outlined"
                hide-details
                density="comfortable"
                prepend-inner-icon="mdi-weather-sunny"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localSettings.sleepTime"
                :label="$t('pages.settings.sleep_hour')"
                type="time"
                variant="outlined"
                hide-details
                density="comfortable"
                prepend-inner-icon="mdi-weather-night"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="localSettings.autoStartEnabled"
                :label="$t('pages.settings.auto_start')"
                color="primary"
                hide-details
                :loading="autoStartLoading"
                :disabled="autoStartLoading"
                @change="handleToggleAutoStart"
              ></v-switch>
              <v-list-item-subtitle
                v-if="autoStartError"
                class="text-error mt-1"
              >
                {{ autoStartError }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>

          <v-row class="mt-4">
            <DangerAreaButton></DangerAreaButton>
            <v-col cols="6" class="d-flex">
              <v-btn
                block
                @click="saveAllSettings"
                color="primary"
                variant="elevated"
                class="text-capitalize"
              >
                <v-icon start>mdi-content-save</v-icon>
                {{ $t("pages.settings.save_settings_button") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </v-container>
      </v-card>
    </v-container>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useSettingsStore } from "@/plugins/stores/settings-store.js";
import { useI18n } from "vue-i18n";
import { showNotifi } from "@/utils/alert-util";

const { t } = useI18n();
const settingsStore = useSettingsStore();

const localSettings = ref({
  notificationsEnabled: true,
  reminderFrequency: 60,
  wakeTime: "07:00",
  sleepTime: "23:00",
  autoStartEnabled: true,
});

const autoStartLoading = ref(false);
const autoStartError = ref(null);

watch(
  () => settingsStore.config,
  (newConfig) => {
    if (newConfig) {
      localSettings.value.notificationsEnabled = newConfig.notificationsEnabled;
      localSettings.value.reminderFrequency = newConfig.reminderFrequency;
      localSettings.value.wakeTime = newConfig.wakeTime;
      localSettings.value.sleepTime = newConfig.sleepTime;
      localSettings.value.autoStartEnabled = newConfig.autoStartEnabled;
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  if (!settingsStore.initialized || !settingsStore.autostartInitialized) {
    await settingsStore.initAppSettings();
  }
});

const reminderFrequencies = computed(() => [
  { value: 30, text: t("pages.settings.reminderFrequencies.every_30_mins") },
  { value: 60, text: t("pages.settings.reminderFrequencies.hourly") },
  { value: 90, text: t("pages.settings.reminderFrequencies.every_90_mins") },
  { value: 120, text: t("pages.settings.reminderFrequencies.every_2_hours") },
  { value: 180, text: t("pages.settings.reminderFrequencies.every_3_hours") },
]);

const handleToggleAutoStart = async () => {
  autoStartLoading.value = true;
  autoStartError.value = null;
  try {
    await settingsStore.toggleAutoStart();
  } catch (error) {
    console.error("Autostart error:", error);
    autoStartError.value = error.message || t("pages.settings.error_message");
    localSettings.value.autoStartEnabled =
      settingsStore.config.autoStartEnabled;
  } finally {
    autoStartLoading.value = false;
  }
};

const saveAllSettings = async () => {
  autoStartLoading.value = true;
  autoStartError.value = null;
  try {
    await settingsStore.updateAppSettings({
      notificationsEnabled: localSettings.value.notificationsEnabled,
      reminderFrequency: localSettings.value.reminderFrequency,
      wakeTime: localSettings.value.wakeTime,
      sleepTime: localSettings.value.sleepTime,
    });

    showNotifi(t("pages.settings.success_message"));
  } catch (error) {
    showNotifi(t("pages.settings.error_message"));
  } finally {
    autoStartLoading.value = false;
  }
};
</script>
