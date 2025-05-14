<template>
  <BaseLayout>
    <v-container class="mt-10">
      <v-card rounded="xl" elevation="0" class="pa-2 border-sm">
        <v-card-title>{{ $t("pages.profile.title") }}</v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-container v-if="userStore.initialized">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localProfile.name"
                :label="$t('pages.profile.full_name')"
                variant="outlined"
                hide-details
                density="comfortable"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="localProfile.age"
                :label="$t('pages.profile.age')"
                type="number"
                variant="outlined"
                hide-details
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="localProfile.height"
                :label="$t('pages.profile.height')"
                suffix="cm"
                type="number"
                variant="outlined"
                hide-details
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="localProfile.weight"
                :label="$t('pages.profile.weight')"
                suffix="kg"
                type="number"
                variant="outlined"
                hide-details
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="localProfile.activityLevel"
                :items="activityLevels"
                item-title="text"
                item-value="value"
                :label="$t('pages.profile.activity_level')"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-slider
                v-model.number="localProfile.waterGoal"
                :label="$t('pages.profile.daily_target')"
                suffix="ml"
                min="500"
                max="6000"
                step="50"
                thumb-label="always"
                color="primary"
              ></v-slider>
            </v-col>
          </v-row>
          <v-row class="mt-4">
            <v-col cols="6" class="d-flex">
              <v-btn
                block
                variant="outlined"
                @click="calculateWater"
                color="primary"
                class="mr-2 text-capitalize"
              >
                <v-icon start>mdi-calculator</v-icon>
                {{ $t("pages.profile.calculate_water") }}
              </v-btn>
            </v-col>
            <v-col cols="6" class="d-flex">
              <v-btn
                block
                @click="saveProfile"
                color="primary"
                variant="elevated"
                class="text-capitalize"
              >
                <v-icon start>mdi-content-save</v-icon>
                {{ $t("pages.profile.save_settings") }}
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
          <p class="mt-4">{{ $t("pages.profile.error_message") }}</p>
        </v-container>
      </v-card>
    </v-container>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useUserStore } from "@/plugins/stores/user-store.js";
import { useI18n } from "vue-i18n";
import { showNotifi } from "@/utils/alert-util";

const { t } = useI18n();
const userStore = useUserStore();

const localProfile = ref({
  name: "",
  age: null,
  height: null,
  weight: null,
  activityLevel: "low",
  waterGoal: 2000,
});

watch(
  () => userStore.profile,
  (newProfile) => {
    if (newProfile) {
      localProfile.value = { ...newProfile };
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  if (!userStore.initialized) {
    await userStore.initUserProfile();
  }
});

const activityLevels = computed(() => [
  { value: "low", text: t("pages.profile.activityLevels.low") },
  { value: "moderate", text: t("pages.profile.activityLevels.moderate") },
  { value: "high", text: t("pages.profile.activityLevels.high") },
  { value: "very_high", text: t("pages.profile.activityLevels.very_high") },
  { value: "extreme", text: t("pages.profile.activityLevels.extreme") },
]);

const calculateWater = () => {
  userStore
    .updateUserProfile({
      weight: localProfile.value.weight,
      activityLevel: localProfile.value.activityLevel,
    })
    .then(() => {
      userStore.calculateRecommendedWaterIntake();
    });
};

const saveProfile = async () => {
  try {
    await userStore.updateUserProfile({ ...localProfile.value });
    showNotifi(t("pages.profile.success_message"));
  } catch (error) {
    console.error("Profil kaydedilirken hata:", error);
    showNotifi(t("pages.profile.error_saving"));
  }
};
</script>
