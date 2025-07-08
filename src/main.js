import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from '@/router'
import './style.css'
import App from './App.vue'
// Pinia

const initializeApp = async () => {
    // Fetch and parse the config file

    const pinia = createPinia()
    createApp(App).use(pinia).use(router).mount('#app')

    // Set config vars after app is initialized.
}

initializeApp()
