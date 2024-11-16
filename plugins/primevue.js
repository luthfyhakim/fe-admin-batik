import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/saga-blue/theme.css' // You can choose another theme here
// import 'primevue/resources/primevue.min.css' // Core PrimeVue styles
import 'primeicons/primeicons.css' // PrimeIcons styles

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue)
})
