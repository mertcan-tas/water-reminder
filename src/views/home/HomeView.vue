<template>
  <BaseLayout>
    <v-container class="mt-10">
      <v-card rounded="xl" class="border-sm" elevation="0">
        <v-card-title class="text-overline">
          <div class="text-h6 font-weight-bold">
            {{ $t("app.name") }}
          </div>
          <div class="text-blue-darken-3 text-h4 font-weight-bold">
            {{ formattedProgress }}%
          </div>
        </v-card-title>
        <br/>
        <v-card-text class="position-relative">
          <div
            :style="`right: calc(${goalMarkerRightOffset} + 8px); top: -12px;`"
            class="position-absolute text-caption text-medium-emphasis"
            v-if="dailyGoalLiters > 0"
          >
            Günlük Hedef
          </div>
          
          <v-progress-linear
            color="primary"
            class="bg-grey-lighten-2"
            height="22"
            :model-value="progressValue"
            rounded="xl"
            stream
          >
          </v-progress-linear>

          <div class="d-flex justify-space-between py-3 mt-2">
            <span class="text-light-blue-darken-3 font-weight-medium">
              {{ drunkLiters.toFixed(2) }} Litre içildi
            </span>
            <span class="text-medium-emphasis">
              Hedef: {{ dailyGoalLiters.toFixed(2) }} Litre
            </span>
          </div>
          <div
            class="d-flex justify-start text-caption"
            v-if="remainingLiters > 0 && dailyGoalLiters > 0"
          >
            Kalan: {{ remainingLiters.toFixed(2) }} Litre
          </div>
          <div
            class="d-flex justify-start text-caption text-green-darken-2 font-weight-medium"
            v-else-if="dailyGoalLiters > 0 && drunkLiters >= dailyGoalLiters"
          >
            Hedef tamamlandı! 🎉
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-list-item
          append-icon="mdi-water-plus"
          lines="two"
          subtitle="İçtiğin suyu kaydet"
          link
          @click="openAddWaterDialog"
        >
          <v-list-item-title class="font-weight-bold"
            >Su Ekle</v-list-item-title
          >
        </v-list-item>
      </v-card>

      <v-dialog v-model="showAddWaterDialog" persistent max-width="580px">
        <v-card>
          <v-card-title class="mt-3 text-center">
            Ne Kadar Su İçtin?
          </v-card-title>
          <v-card-text class="pb-3">
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-1">
                  <v-text-field
                    v-model.number="waterToAdd"
                    label="Miktar"
                    type="number"
                    suffix="Litre"
                    variant="outlined"
                    autofocus
                    :rules="[rules.required, rules.positive]"
                    ref="waterToAddInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <div class="text-caption mb-2">Hızlı Ekle:</div>
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
                      >Bardak (0.25L)</v-btn
                    >

                    <v-btn
                      @click="setWaterToAdd(0.5)"
                      class="flex-grow-1 text-capitalize"
                      >Şişe (0.50L)</v-btn
                    >
                    <v-btn
                      @click="setWaterToAdd(0.75)"
                      class="flex-grow-1 text-capitalize"
                      >Büyük Şişe (0.75L)</v-btn
                    >
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
              İptal
            </v-btn>
            <v-btn
              color="primary"
              size="small"
              variant="text"
              @click="addWaterAndValidate"
              :disabled="!isValidWaterToAdd"
            >
              Ekle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </BaseLayout>
</template>

<script>
import { launchRealisticConfetti } from "@/utils/confetti-util";
import sendTauriNotification from "@/services/notification-service";
import soundEffect from "@/assets/sounds/confetti.mp3";
import { useI18n } from "vue-i18n";

export default {
  data() {
    return {
      audio: null,
      drunkLiters: 0.75,
      dailyGoalLiters: 2.5,
      goalMarkerRightOffset: "0%",

      showAddWaterDialog: false,
      waterToAdd: 0.25,
      selectedQuickAddIndex: 0,

      goalCompleted: false,
      
      rules: {
        required: (value) => !!value || "Miktar boş olamaz.",
        positive: (value) =>
          (!isNaN(parseFloat(value)) && value > 0) ||
          "Geçerli bir miktar girin (0'dan büyük).",
      },
    };
  },
  mounted() {
    this.audio = new Audio(soundEffect);
  },
  computed: {
    progressValue() {
      if (this.dailyGoalLiters <= 0) {
        return 0;
      }
      const percentage = (this.drunkLiters / this.dailyGoalLiters) * 100;
      return Math.min(percentage, 100);
    },
    formattedProgress() {
      return this.progressValue.toFixed(0);
    },
    remainingLiters() {
      const remaining = this.dailyGoalLiters - this.drunkLiters;
      return Math.max(0, remaining);
    },
    isValidWaterToAdd() {
      return !isNaN(parseFloat(this.waterToAdd)) && this.waterToAdd > 0;
    },
    isGoalReached() {
      return (
        this.dailyGoalLiters > 0 && this.drunkLiters >= this.dailyGoalLiters
      );
    },
  },

  watch: {
    drunkLiters(newValue, oldValue) {
      if (this.isGoalReached && !this.goalCompleted) {
        this.goalCompleted = true;
        this.celebrateGoalCompletion();
      } else if (!this.isGoalReached && this.goalCompleted) {
        this.goalCompleted = false;
      }
    },
  },
  methods: {
    playSound() {
      if (this.audio) {
        this.audio.currentTime = 0; // ses başa sarılsın
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
    addWaterAndValidate() {
      if (this.isValidWaterToAdd) {
        this.drunkLiters += parseFloat(this.waterToAdd);
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

      if (amount === 0.25) this.selectedQuickAddIndex = 0;
      else if (amount === 0.5) this.selectedQuickAddIndex = 1;
      else if (amount === 0.75) this.selectedQuickAddIndex = 2;
      else this.selectedQuickAddIndex = undefined;
    },
    initializeDefaultWaterAmount() {
      const amounts = [0.25, 0.5, 0.75];
      this.waterToAdd = amounts[this.selectedQuickAddIndex] || 0.25;
    },

    celebrateGoalCompletion() {
      launchRealisticConfetti();

      sendTauriNotification(
        "Water Reminder",
        "Vallahi tüm suyu içtin helal olffffsun"
      );

      this.playSound();
    },
  },
  created() {
    this.initializeDefaultWaterAmount();
    this.goalCompleted = this.isGoalReached;
  },
};
</script>
