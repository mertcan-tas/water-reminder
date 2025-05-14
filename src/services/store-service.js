import { load } from "@tauri-apps/plugin-store";

let store = null;

export async function initStore() {
  if (!store) {
    store = await load("store.json", { autoSave: false });
    await initializeDefaultValues();
  }
}

async function initializeDefaultValues() {
  const defaults = {
    darkMode: true,
    language: "tr",
    firstLaunch: true,
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
