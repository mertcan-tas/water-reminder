// src/services/tauriStore.js
import { load } from '@tauri-apps/plugin-store';

let store = null;

export async function initStore() {
  if (!store) {
    store = await load('store.json', { autoSave: false });
  }
}

export function getStoreInstance() {
  if (!store) {
    throw new Error('Store not initialized. Call initStore() first.');
  }
  return store;
}
