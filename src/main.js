// style third part
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"

// components third part
import router from './router'
import axios from 'axios'
import VueAwesomePaginate from "vue-awesome-paginate"
import moment from 'moment';
import VueCookies from 'vue-cookies'

// components local
import { createApp } from 'vue'
import App from './App.vue'
import Loading from './components/Layouts/LoadAnimation.vue'

// fuctions
import globalFunction from './services/globalFuction'
import globalAction from './services/globalAction'

import './assets/main.css'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.params = {}
axios.defaults.params["api_key"] = import.meta.env.VITE_API_KEY

const app = createApp(App)

app.config.globalProperties.$moment = moment
app.mixin(globalFunction)
app.mixin(globalAction)
app.use(router)
app.use(VueAwesomePaginate)
app.use(VueCookies)
app.component('Loading',Loading)

app.mount('#app')
