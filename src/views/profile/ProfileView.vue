<template>
  <BaseLayout>
    <v-container class="mt-10">
      <v-card rounded="lg" elevation="3" class="pa-2">
        <CardTitle></CardTitle>

        <v-divider class="my-4"></v-divider>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.name"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.full_name')"
                clearable
                variant="outlined"
                prepend-inner-icon="mdi-account"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="settings.age"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.age')"
                variant="outlined"
                type="number"
                prepend-inner-icon="mdi-calendar"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="settings.height"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.height')"
                variant="outlined"
                type="number"
                prepend-inner-icon="mdi-human-male-height"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="settings.weight"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.weight')"
                variant="outlined"
                type="number"
                prepend-inner-icon="mdi-weight-kilogram"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="settings.activityLevel"
                :items="activityLevels"
                item-title="text"
                item-value="value"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.activity_level')"
                variant="outlined"
                prepend-inner-icon="mdi-run"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-slider
                v-model="settings.waterGoal"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.daily_target')"
                min="1000"
                max="4000"
                step="100"
                thumb-label="always"
                prepend-icon="mdi-water"
              ></v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="settings.reminderFrequency"
                :items="reminderFrequencies"
                item-title="text"
                item-value="value"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.reminder_frequency')"
                variant="outlined"
                prepend-inner-icon="mdi-bell"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.wakeTime"
                color="primary"
                :label="$t('pages.profile.waking_hour')"
                hide-details="true"
                variant="outlined"
                type="time"
                prepend-inner-icon="mdi-weather-sunny"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.sleepTime"
                color="primary"
                hide-details="true"
                :label="$t('pages.profile.sleep_hour')"
                variant="outlined"
                type="time"
                prepend-inner-icon="mdi-weather-night"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-switch
                hide-details="true"
                v-model="settings.notifications"
                color="primary"
                :label="$t('pages.profile.notification_switch')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row class="mt-4">
            <v-col cols="6" class="d-flex">
              <v-btn
                block
                class="text-capitalize mr-2"
                color="primary"
                hide-details="true"
                size="large"
                variant="outlined"
                rounded="lg"
                height="40"
                @click="calculateRecommendedWaterIntake"
              >
                <v-icon start>mdi-calculator</v-icon>
                {{ $t("pages.profile.calculate_water") }}
              </v-btn>
            </v-col>
            <v-col cols="6" class="d-flex">
              <v-btn
                block
                class="text-capitalize mr-2"
                color="primary"
                hide-details="true"
                size="large"
                variant="elevated"
                rounded="lg"
                height="40"
                @click="saveSettings"
              >
                <v-icon start>mdi-content-save</v-icon>
                {{ $t("pages.profile.save_settings") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </BaseLayout>
</template>

<script>
import { useSettingsStore } from "@/plugins/stores/settingsStore.js";
import { showNotifi } from "@/utils/alert-util";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "WaterReminderSettings",
  setup() {
    const settingsStore = useSettingsStore();
    const { t, locale } = useI18n();

    const settings = ref({
      name: settingsStore.name,
      age: settingsStore.age,
      height: settingsStore.height,
      weight: settingsStore.weight,
      activityLevel: settingsStore.activityLevel,
      waterGoal: settingsStore.waterGoal,
      reminderFrequency: settingsStore.reminderFrequency,
      wakeTime: settingsStore.wakeTime,
      sleepTime: settingsStore.sleepTime,
      notifications: settingsStore.notifications,
    });
    
    const activityLevels = computed(() => [
      { value: "low", text: t("pages.profile.activityLevels.low") },
      { value: "moderate", text: t("pages.profile.activityLevels.moderate") },
      { value: "high", text: t("pages.profile.activityLevels.high") },
      {
        value: "very_high",
        text: t("pages.profile.activityLevels.very_high"),
      },
      { value: "extreme", text: t("pages.profile.activityLevels.extreme") },
    ]);

    const reminderFrequencies = computed(() => [
      { value: 60, text: t("pages.profile.reminderFrequencies.hourly") },
      {
        value: 120,
        text: t("pages.profile.reminderFrequencies.every_2_hours"),
      },
      {
        value: 180,
        text: t("pages.profile.reminderFrequencies.every_3_hours"),
      },
      {
        value: 240,
        text: t("pages.profile.reminderFrequencies.every_4_hours"),
      },
      { value: 300, text: t("pages.profile.reminderFrequencies.with_meals") },
    ]);

    const calculateRecommendedWaterIntake = () => {
      if (
        settings.value.weight &&
        !isNaN(settings.value.weight) &&
        settings.value.weight > 0
      ) {
        const baseIntake = settings.value.weight * 33;

        let activityMultiplier = 1.0;

        switch (settings.value.activityLevel) {
          case "low":
            activityMultiplier = 1.0;
            break;
          case "moderate":
            activityMultiplier = 1.1;
            break;
          case "high":
            activityMultiplier = 1.2;
            break;
          case "very_high":
            activityMultiplier = 1.3;
            break;
          case "extreme":
            activityMultiplier = 1.5;
            break;
          default:
            break;
        }

        settings.value.waterGoal = Math.round(baseIntake * activityMultiplier);
      }
    };

    const saveSettings = () => {
      settingsStore.setName(settings.value.name);
      settingsStore.setAge(settings.value.age);
      settingsStore.setHeight(settings.value.height);
      settingsStore.setWeight(settings.value.weight);
      settingsStore.setActivityLevel(settings.value.activityLevel);
      settingsStore.setWaterGoal(settings.value.waterGoal);
      settingsStore.setReminderFrequency(settings.value.reminderFrequency);
      settingsStore.setWakeTime(settings.value.wakeTime);
      settingsStore.setSleepTime(settings.value.sleepTime);
      settingsStore.setNotifications(settings.value.notifications);

      showNotifi(t("pages.profile.success_message"), "success", "#8A2BE2");
    };

    return {
      settings,
      activityLevels,
      reminderFrequencies,
      calculateRecommendedWaterIntake,
      saveSettings,
    };
  },
};
</script>
