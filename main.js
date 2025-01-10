import App from './App'

import lang from "./lang/index.js"
import VueI18n from 'vue-i18n'

import store from './store'
Vue.use(VueI18n)
const urlApi = "https://tbcdev.org/v1/tbc/main/";
const localApi = "https://www.neww.site:450/";
const network = "testnet";

Vue.prototype.localApi = localApi;
Vue.prototype.urlApi = urlApi;
Vue.prototype.network = network;
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

const i18n = new VueI18n({
	locale: uni.getStorageSync('language') || 'en-US', // 初始化中文
	messages: lang,
	silentFallbackWarn: true
});

const app = new Vue({
	store,
	i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif