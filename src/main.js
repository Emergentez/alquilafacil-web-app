import { createApp } from 'vue'
import './style.css'
import router from "@/public/router/router.js";
import {createPinia} from "pinia";
import App from './App.vue'
import { firebaseApp } from './auth/services/authentication.firebase';
import i18n from './i18n';


const pinia = createPinia();

firebaseApp;

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app')
