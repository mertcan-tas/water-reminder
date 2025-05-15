import { load } from "@tauri-apps/plugin-store";

let store = null;

export async function initStore() {
  if (!store) {
    store = await load("store.json", { autoSave: false });
    await initializeDefaultValues();
    await checkAndResetDailyWaterIntake();
  }
}

async function initializeDefaultValues() {
  const defaults = {
    darkMode: true,
    language: "tr",
    firstLaunch: true,
    user_waterIntake: 0,
    user_currentDay: null,
    user_goalCompletedToday: false,
  };

  for (const key in defaults) {
    const value = await store.get(key);
    if (value === undefined) {
      await store.set(key, defaults[key]);
    }
  }

  if (await store.get("firstLaunch")) {
    console.log("First launch detected!");
    await store.set("firstLaunch", false);
    await store.save();
  }
}

export async function checkAndResetDailyWaterIntake() {
  const today = new Date().toISOString().split("T")[0];
  const currentDay = await store.get("user_currentDay");

  if (currentDay !== today) {
    await store.set("user_waterIntake", 0);
    await store.set("user_currentDay", today);
    await store.set("user_goalCompletedToday", false);
    await store.save();
  }
}

export async function setValue(key, value) {
  if (!store) await initStore();
  await store.set(key, value);
}

export async function getValue(key) {
  if (!store) await initStore();
  const value = await store.get(key);
  return value ?? null;
}

export async function saveStore() {
  if (!store) await initStore();
  await store.save();
}

export async function restoreDefaultValues() {
  if (!store) await initStore();
  await store.clear();
  await initializeDefaultValues();
  await store.save();
}
