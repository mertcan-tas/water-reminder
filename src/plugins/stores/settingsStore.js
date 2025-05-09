import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    isDark: localStorage.getItem("darkMode") === "true" || false,
    currentLanguage: localStorage.getItem("language") || "tr",

    name: localStorage.getItem("name") || "",
    age: localStorage.getItem("age") ? Number(localStorage.getItem("age")) : "",
    height: localStorage.getItem("height")
      ? Number(localStorage.getItem("height"))
      : "",
    weight: localStorage.getItem("weight")
      ? Number(localStorage.getItem("weight"))
      : "",
    activityLevel: localStorage.getItem("activityLevel") || "low",

    waterGoal: localStorage.getItem("waterGoal")
      ? parseInt(localStorage.getItem("waterGoal"))
      : 2000,

    reminderFrequency: localStorage.getItem("reminderFrequency")
      ? parseInt(localStorage.getItem("reminderFrequency"))
      : 60,

    wakeTime: localStorage.getItem("wakeTime") || "07:00",
    sleepTime: localStorage.getItem("sleepTime") || "23:00",

    notifications:
      localStorage.getItem("notifications") === null
        ? true
        : localStorage.getItem("notifications") === "true",
  }),

  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark;
      localStorage.setItem("darkMode", this.isDark);
    },

    setLanguage(lang) {
      this.currentLanguage = lang;
      localStorage.setItem("language", lang);
    },

    setName(name) {
      this.name = name;
      localStorage.setItem("name", name);
    },
    setAge(age) {
      this.age = age;
      localStorage.setItem("age", age);
    },
    setHeight(height) {
      this.height = height;
      localStorage.setItem("height", height);
    },
    setWeight(weight) {
      this.weight = weight;
      localStorage.setItem("weight", weight);
    },
    setActivityLevel(level) {
      this.activityLevel = level;
      localStorage.setItem("activityLevel", level);
    },

    setWaterGoal(goal) {
      this.waterGoal = goal;
      localStorage.setItem("waterGoal", goal);
    },

    setReminderFrequency(minutes) {
      this.reminderFrequency = minutes;
      localStorage.setItem("reminderFrequency", minutes);
    },

    setWakeTime(time) {
      this.wakeTime = time;
      localStorage.setItem("wakeTime", time);
    },
    setSleepTime(time) {
      this.sleepTime = time;
      localStorage.setItem("sleepTime", time);
    },

    setNotifications(enabled) {
      this.notifications = enabled;
      localStorage.setItem("notifications", enabled);
    },

    initSettings() {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        this.isDark = savedTheme === "true";
      }

      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage !== null) {
        this.currentLanguage = savedLanguage;
      }

      this.name = localStorage.getItem("name") || "";
      this.age = localStorage.getItem("age")
        ? Number(localStorage.getItem("age"))
        : "";
      this.height = localStorage.getItem("height")
        ? Number(localStorage.getItem("height"))
        : "";
      this.weight = localStorage.getItem("weight")
        ? Number(localStorage.getItem("weight"))
        : "";
      this.activityLevel = localStorage.getItem("activityLevel") || "";
      this.waterGoal = localStorage.getItem("waterGoal")
        ? parseInt(localStorage.getItem("waterGoal"))
        : 2000;

      this.reminderFrequency = localStorage.getItem("reminderFrequency")
        ? parseInt(localStorage.getItem("reminderFrequency"))
        : 60;

      this.wakeTime = localStorage.getItem("wakeTime") || "07:00";
      this.sleepTime = localStorage.getItem("sleepTime") || "23:00";
      this.notifications =
        localStorage.getItem("notifications") === null
          ? true
          : localStorage.getItem("notifications") === "true";
    },

    saveAllSettings(settings) {
      this.setName(settings.name);
      this.setAge(settings.age);
      this.setHeight(settings.height);
      this.setWeight(settings.weight);
      this.setActivityLevel(settings.activityLevel);
      this.setWaterGoal(settings.waterGoal);
      this.setReminderFrequency(settings.reminderFrequency);
      this.setWakeTime(settings.wakeTime);
      this.setSleepTime(settings.sleepTime);
      this.setNotifications(settings.notifications);
    },

    calculateRecommendedWaterIntake() {
      if (this.weight && !isNaN(this.weight) && this.weight > 0) {
        const baseIntake = this.weight * 33;

        let activityMultiplier = 1.0;

        switch (this.activityLevel) {
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

        return Math.round(baseIntake * activityMultiplier);
      }

      return 2000;
    },
  },
});
