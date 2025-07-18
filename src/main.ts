import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
// Optionnel : importer les icônes Material Design
import '@mdi/font/css/materialdesignicons.css'
// Import Tailwind après Vuetify pour avoir la priorité
import './assets/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',

  },
})

app.use(vuetify)

app.mount('#app')
