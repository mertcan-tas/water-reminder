<template>
  <BaseLayout v-if="userStore.initialized">
    <v-container class="mt-10">
      <v-card rounded="xl" class="border-sm" elevation="0">
        <v-card-title class="text-center">
          <div class="text-h6 font-weight-bold text-grey">
            {{ $t("pages.home.complated_target") }}
          </div>
          <div class="text-h4 font-weight-bold text-center mt-1 text-primary">
            {{ formattedProgress }}%
          </div>
        </v-card-title>

        <v-divider class="my-1"></v-divider>
        <v-card-text class="position-relative">
          <v-progress-linear
            color="primary"
            class="bg-grey-lighten-2"
            height="22"
            :model-value="progressValue"
            rounded="xl"
            striped
          >
          </v-progress-linear>

          <div class="d-flex justify-space-between py-3 mt-2">
            <span class="text-light-blue-darken-3 font-weight-medium">
              {{ drunkLiters.toFixed(2) }} {{ $t("pages.home.liter") }}
              {{ $t("pages.home.drinking_water_msg") }}
            </span>
            <span class="text-medium-emphasis">
              {{ $t("pages.home.target") }}: {{ dailyGoalLiters.toFixed(2) }}
              {{ $t("pages.home.liter") }}
            </span>
          </div>

          <div
            v-if="remainingLiters > 0 && dailyGoalLiters > 0"
            class="d-flex justify-start text-caption"
          >
            {{ $t("pages.home.remaining") }}: {{ remainingLiters.toFixed(2) }}
            {{ $t("pages.home.liter") }}
          </div>
          <div
            v-else-if="isGoalReached"
            class="d-flex justify-start text-caption text-green-darken-2 font-weight-medium"
          >
            {{ $t("pages.home.target_complated_msg") }} 🎉
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-list-item
          append-icon="mdi-water-plus"
          lines="two"
          :subtitle="$t('pages.home.add_liter_button_subtitle')"
          link
          @click="openAddWaterDialog"
        >
          <v-list-item-title class="font-weight-bold mt-1">
            {{ $t("pages.home.add_liter_button_title") }}
          </v-list-item-title>
        </v-list-item>
      </v-card>

      <v-dialog v-model="showAddWaterDialog" max-width="580px">
        <v-card>
          <v-card-title class="mt-3 text-center">
            {{ $t("pages.home.add_dialog.dialog_title") }}
          </v-card-title>
          <v-card-text class="pb-3">
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-1">
                  <v-text-field
                    v-model.number="waterToAdd"
                    :label="$t('pages.home.add_dialog.water_amount')"
                    type="number"
                    :suffix="$t('pages.home.add_dialog.liter')"
                    variant="outlined"
                    autofocus
                    :rules="[rules.required, rules.positive]"
                    ref="waterToAddInput"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" class="pt-0">
                  <div class="text-caption mb-2">
                    {{ $t("pages.home.add_dialog.add_quick") }}:
                  </div>
                  <v-btn-toggle
                    v-model="selectedQuickAddIndex"
                    color="light-blue"
                    variant="outlined"
                    density="compact"
                    mandatory
                    class="d-flex"
                  >
                    <v-btn
                      @click="setWaterToAdd(0.25)"
                      class="flex-grow-1 text-capitalize"
                    >
                      {{ $t("pages.home.add_dialog.add_quick_glass") }} (0.25L)
                    </v-btn>

                    <v-btn
                      @click="setWaterToAdd(0.5)"
                      class="flex-grow-1 text-capitalize"
                    >
                      {{ $t("pages.home.add_dialog.add_quick_bottle") }} (0.50L)
                    </v-btn>

                    <v-btn
                      @click="setWaterToAdd(0.75)"
                      class="flex-grow-1 text-capitalize"
                    >
                      {{ $t("pages.home.add_dialog.add_quick_big_bottle") }}
                      (0.75L)
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              variant="tonal"
              size="small"
              @click="closeDialog"
            >
              {{ $t("pages.home.add_dialog.dialog_cancel_button") }}
            </v-btn>
            <v-btn
              color="primary"
              size="small"
              variant="tonal"
              @click="addWaterAndValidate"
              :disabled="!isValidWaterToAdd"
            >
              {{ $t("pages.home.add_dialog.dialog_add_button") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </BaseLayout>

  <BaseLayout v-else>
    <v-container class="text-center mt-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-container>
  </BaseLayout>
</template>

<script>
import { launchRealisticConfetti } from "@/utils/confetti-util";
import sendTauriNotification from "@/services/notification-service";
import soundEffect from "@/assets/sounds/confetti.mp3";
import { useUserStore } from "@/plugins/stores/user-store.js";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      audio: null,
      showAddWaterDialog: false,
      waterToAdd: 0.25,
      selectedQuickAddIndex: 0,
      rules: {
        required: (value) =>
          !!value || this.$t("pages.home.add_dialog.validation_required_msg"),
        positive: (value) =>
          (!isNaN(parseFloat(value)) && value > 0) ||
          this.$t("pages.home.add_dialog.validation_positive_value_msg"),
      },
    };
  },
  async mounted() {
    this.audio = new Audio(soundEffect);
    await this.userStore.initUserProfile();
  },
  computed: {
    progressValue() {
      if (!this.userStore?.profile || this.dailyGoalLiters <= 0) return 0;
      const percentage = (this.drunkLiters / this.dailyGoalLiters) * 100;
      return Math.min(percentage, 100);
    },

    formattedProgress() {
      return this.progressValue.toFixed(0);
    },

    drunkLiters() {
      return (this.userStore?.profile?.waterIntake ?? 0) / 1000;
    },

    dailyGoalLiters() {
      return (this.userStore?.profile?.waterGoal ?? 2000) / 1000;
    },

    remainingLiters() {
      const remaining =
        (this.userStore?.profile?.waterGoal ?? 2000) -
        (this.userStore?.profile?.waterIntake ?? 0);
      return Math.max(remaining / 1000, 0);
    },

    isValidWaterToAdd() {
      return !isNaN(parseFloat(this.waterToAdd)) && this.waterToAdd > 0;
    },

    isGoalReached() {
      const waterGoal = this.userStore?.profile?.waterGoal ?? 2000;
      const waterIntake = this.userStore?.profile?.waterIntake ?? 0;
      return waterGoal > 0 && waterIntake >= waterGoal;
    },
  },
  watch: {
    isGoalReached(newVal) {
      if (
        this.userStore.initialized &&
        newVal &&
        !this.userStore.profile.goalCompletedToday
      ) {
        this.celebrateGoalCompletion();

        this.userStore.updateUserProfile({ goalCompletedToday: true });
      }
    },
  },
  methods: {
    playSound() {
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
    },

    openAddWaterDialog() {
      this.initializeDefaultWaterAmount();
      this.showAddWaterDialog = true;
      this.$nextTick(() => {
        if (this.$refs.waterToAddInput) {
          this.$refs.waterToAddInput.focus();
        }
      });
    },

    async addWaterAndValidate() {
      if (this.isValidWaterToAdd) {
        const mlToAdd = parseFloat(this.waterToAdd) * 1000;
        await this.userStore.addWaterIntake(mlToAdd);
        this.closeDialog();
      } else {
        if (this.$refs.waterToAddInput) {
          this.$refs.waterToAddInput.validate();
        }
      }
    },

    closeDialog() {
      this.showAddWaterDialog = false;
      this.waterToAdd = 0.25;
      this.selectedQuickAddIndex = 0;
    },

    setWaterToAdd(amount) {
      this.waterToAdd = amount;
      this.selectedQuickAddIndex = [0.25, 0.5, 0.75].indexOf(amount);
    },

    initializeDefaultWaterAmount() {
      const amounts = [0.25, 0.5, 0.75];
      this.waterToAdd = amounts[this.selectedQuickAddIndex] || 0.25;
    },

    celebrateGoalCompletion() {
      this.playSound();
      launchRealisticConfetti();

      sendTauriNotification(
        "Su Hedefi Tamamlandı 🎉",
        "Tebrikler! Tüm suyunu içtin helal olsun!"
      );
    },
  },
  created() {
    this.initializeDefaultWaterAmount();
  },
};
</script>
