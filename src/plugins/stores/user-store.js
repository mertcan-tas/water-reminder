import { defineStore } from "pinia";
import { getValue, setValue } from "@/services/store-service.js"; 

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {
      name: "",
      age: null, // Sayısal değerler için null veya varsayılan bir sayı (örn: 0) kullanmak daha iyidir.
      height: null,
      weight: null,
      activityLevel: "low", // Varsayılan değer
      waterGoal: 2000,      // Varsayılan değer ml cinsinden
    },
    initialized: false, // Store'un yüklenip yüklenmediğini takip etmek için
  }),

  actions: {
    async initUserProfile() {
      if (this.initialized) return;

      try {
        // Tauri store'dan değerleri oku, anahtar isimlerini benzersiz tutmaya özen göster
        this.profile.name = (await getValue("user_name")) || "";
        this.profile.age = (await getValue("user_age")) ? Number(await getValue("user_age")) : null;
        this.profile.height = (await getValue("user_height")) ? Number(await getValue("user_height")) : null;
        this.profile.weight = (await getValue("user_weight")) ? Number(await getValue("user_weight")) : null;
        this.profile.activityLevel = (await getValue("user_activityLevel")) || "low";
        this.profile.waterGoal = (await getValue("user_waterGoal")) ? parseInt(await getValue("user_waterGoal"), 10) : 2000;

        this.initialized = true;
        console.log("User profile initialized from Tauri store.");
      } catch (err) {
        console.error("User profile yüklenirken hata oluştu:", err);
        // Burada kullanıcıya bir hata mesajı da gösterilebilir.
      }
    },

    async updateUserProfile(newProfileData) {
      // Gelen güncellemeleri mevcut profile ile birleştir
      // Sadece newProfileData içinde olan alanları güncelle
      Object.keys(newProfileData).forEach(key => {
        if (key in this.profile) {
          this.profile[key] = newProfileData[key];
        }
      });

      // Güncellenmiş alanları Tauri Store'a yaz
      try {
        if (newProfileData.name !== undefined) await setValue("user_name", this.profile.name);
        if (newProfileData.age !== undefined) await setValue("user_age", this.profile.age); // Number olarak sakla
        if (newProfileData.height !== undefined) await setValue("user_height", this.profile.height); // Number olarak sakla
        if (newProfileData.weight !== undefined) await setValue("user_weight", this.profile.weight); // Number olarak sakla
        if (newProfileData.activityLevel !== undefined) await setValue("user_activityLevel", this.profile.activityLevel);
        if (newProfileData.waterGoal !== undefined) await setValue("user_waterGoal", this.profile.waterGoal); // Number olarak sakla
        console.log("User profile updated in Pinia and Tauri store.");
      } catch (err) {
        console.error("User profile Tauri'ye kaydedilirken hata:", err);
      }
    },
    
    // Su hedefi hesaplama fonksiyonu, store içinde de olabilir
    calculateRecommendedWaterIntake() {
      if (this.profile.weight && parseFloat(this.profile.weight) > 0) {
        const weight = parseFloat(this.profile.weight);
        let baseIntake = weight * 30; // Genel bir kural (örn: kg başına 30-35 ml)

        // Aktivite seviyesine göre ayarlama
        switch (this.profile.activityLevel) {
          case "moderate": baseIntake += 350; break; // Örnek değerler
          case "high": baseIntake += 600; break;
          case "very_high": baseIntake += 800; break;
          case "extreme": baseIntake += 1000; break;
        }
        // waterGoal'i güncelle ve bu değişikliği de kaydet
        this.updateUserProfile({ waterGoal: Math.round(baseIntake / 50) * 50 }); // 50ml'lik adımlara yuvarla
      }
    }
  },
});