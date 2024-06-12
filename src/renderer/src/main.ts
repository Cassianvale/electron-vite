import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'

const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, { ripple: true })
app.use(pinia)
app.mount('#app')
