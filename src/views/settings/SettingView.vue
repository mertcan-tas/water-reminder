<template>
  <BaseLayout>
    <v-btn @click="toggleAutostart">Autostart'ı Aç/Kapat</v-btn>
    <p v-if="autostartStatus !== null">
      Autostart durumu: {{ autostartStatus ? 'Aktif' : 'Devre dışı' }}
    </p>
  </BaseLayout>
</template>

<script>
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';

export default {
  data() {
    return {
      autostartStatus: null
    };
  },
  async mounted() {
    try {
      this.autostartStatus = await isEnabled();
    } catch (err) {
      console.error("Autostart durumu kontrol edilirken hata:", err);
    }
  },
  methods: {
    async toggleAutostart() {
      try {
        const enabled = await isEnabled();
        
        if (enabled) {
          await disable();
          this.autostartStatus = false;
          alert("Autostart devre dışı bırakıldı.");
        } else {
          await enable();
          this.autostartStatus = true;
          alert("Autostart aktif edildi.");
        }
      } catch (err) {
        console.error("Autostart işlemi sırasında hata:", err);
        alert("Bir hata oluştu: " + err.message);
      }
    }
  }
};
</script>