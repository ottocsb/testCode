import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//路由
import router from './router/index'
//状态管理Pinia
import { createPinia } from 'pinia'
//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createWorker } from 'tesseract.js'
// @ts-ignore
createApp(App).use(createPinia()).use(createWorker()).use(router).use(ElementPlus).mount('#app')
