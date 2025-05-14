import { defineStore } from "pinia";
import {
  getValue,
  setValue,
  saveStore,
  checkAndResetDailyWaterIntake 
} from "@/services/store-service.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {
      name: "",
      age: null,
      height: null,
      weight: null,
      activityLevel: "low",
      waterGoal: 2000,     // ml
      waterIntake: 0,      // ml
      currentDay: null,    // "YYYY-MM-DD"
      goalCompletedToday: false
    },
    initialized: false
  }),

  actions: {
    async initUserProfile() {
      if (this.initialized) return;

      try {
        this.profile.name = (await getValue("user_name")) || "";
        this.profile.age = (await getValue("user_age")) ? Number(await getValue("user_age")) : null;
        this.profile.height = (await getValue("user_height")) ? Number(await getValue("user_height")) : null;
        this.profile.weight = (await getValue("user_weight")) ? Number(await getValue("user_weight")) : null;
        this.profile.activityLevel = (await getValue("user_activityLevel")) || "low";
        this.profile.waterGoal = (await getValue("user_waterGoal")) ? parseInt(await getValue("user_waterGoal"), 10) : 2000;
        this.profile.waterIntake = (await getValue("user_waterIntake")) ? parseInt(await getValue("user_waterIntake"), 10) : 0;
        this.profile.currentDay = (await getValue("user_currentDay")) || null;
        this.profile.goalCompletedToday = (await getValue("user_goalCompletedToday")) || false;

        await checkAndResetDailyWaterIntake();

        await setValue("user_goalCompletedToday", this.profile.goalCompletedToday);
        await saveStore();

        this.initialized = true;
      } catch (err) {
        console.error("User profile yüklenirken hata oluştu:", err);
      }
    },

    async checkAndResetDailyIntake() {
      const today = new Date().toISOString().split("T")[0];

      if (this.profile.currentDay !== today) {
        this.profile.waterIntake = 0;
        this.profile.currentDay = today;
        this.profile.goalCompletedToday = false;

        await setValue("user_waterIntake", this.profile.waterIntake);
        await setValue("user_currentDay", this.profile.currentDay);
        await setValue("user_goalCompletedToday", this.profile.goalCompletedToday);
        await saveStore();
      }
    },

    async updateUserProfile(newProfileData) {
      Object.keys(newProfileData).forEach(key => {
        if (key in this.profile) {
          if (['age', 'height', 'weight', 'waterGoal', 'waterIntake'].includes(key) && newProfileData[key] !== null && newProfileData[key] !== undefined) {
            this.profile[key] = Number(newProfileData[key]);
          } else {
            this.profile[key] = newProfileData[key];
          }
        }
      });

      try {
        if (newProfileData.name !== undefined) await setValue("user_name", this.profile.name);
        if (newProfileData.age !== undefined) await setValue("user_age", this.profile.age);
        if (newProfileData.height !== undefined) await setValue("user_height", this.profile.height);
        if (newProfileData.weight !== undefined) await setValue("user_weight", this.profile.weight);
        if (newProfileData.activityLevel !== undefined) await setValue("user_activityLevel", this.profile.activityLevel);
        if (newProfileData.waterGoal !== undefined) await setValue("user_waterGoal", this.profile.waterGoal);
        if (newProfileData.waterIntake !== undefined) await setValue("user_waterIntake", this.profile.waterIntake);
        if (newProfileData.currentDay !== undefined) await setValue("user_currentDay", this.profile.currentDay);
        if (newProfileData.goalCompletedToday !== undefined) await setValue("user_goalCompletedToday", this.profile.goalCompletedToday);

        await saveStore();
      } catch (err) {
        console.error("Error while saving user profile to Tauri:", err);
      }
    },

    async addWaterIntake(amount) {
      const mlToAdd = parseInt(amount, 10);
      if (isNaN(mlToAdd) || mlToAdd <= 0) return;

      this.profile.waterIntake += mlToAdd;
      await this.updateUserProfile({
        waterIntake: this.profile.waterIntake
      });
    },

    async calculateRecommendedWaterIntake() {
      if (!this.profile.weight || !this.profile.activityLevel) {
        return;
      }

      let recommendedIntake = 0;

      recommendedIntake = this.profile.weight * 33; 

      switch (this.profile.activityLevel) {
        case "low":
          recommendedIntake += 250;
          break;
        case "moderate":
          recommendedIntake += 500; 
          break;
        case "high":
          recommendedIntake += 750; 
          break;
        case "very_high":
          recommendedIntake += 1000; 
          break;
        case "extreme":
          recommendedIntake += 1250;
          break;
      }

      if (this.profile.age && this.profile.age > 50) {
        recommendedIntake -= 200;
      } else if (this.profile.age && this.profile.age < 18) {

      }

      recommendedIntake = Math.round(recommendedIntake / 50) * 50;


      recommendedIntake = Math.max(1000, recommendedIntake); 
      recommendedIntake = Math.min(8000, recommendedIntake);


      this.profile.waterGoal = recommendedIntake;

      try {
        await setValue("user_waterGoal", this.profile.waterGoal);
        await saveStore();
        console.log("Recommended water target updated:", this.profile.waterGoal);
      } catch (err) {
        console.error("Error saving suggested water target:", err);
      }
    }
  }
});