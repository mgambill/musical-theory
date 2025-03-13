import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './vendors/router'
import usePrime from './vendors/primevue'
import { useComponentRegistry } from '~/plugin'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(usePrime)
app.use(useComponentRegistry, { pinia })
app.mount('#app')
