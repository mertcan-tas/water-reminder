import { load } from '@tauri-apps/plugin-store';

let store = null;

// Mağazayı başlat
export async function initStore() {
  if (!store) {
    store = await load('store.json', { autoSave: false });
  }
}

// Değer ayarla
export async function setValue(key, value) {
  if (!store) await initStore();
  await store.set(key, value);
}

// Değer al
export async function getValue(key) {
  if (!store) await initStore();
  const value = await store.get(key);
  return value ?? null;
}

// Store'u kaydet
export async function saveStore() {
  if (!store) await initStore();
  await store.save();
}
