import { registerPlugins } from '@/plugins'

import { useNotificationServiceStore } from '@/services/schedule-service.js';

import App from '@/App.vue'

import { createApp } from 'vue'

import "@/assets/css/main.scss";

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

const notificationService = useNotificationServiceStore();
notificationService.startNotificationService();

