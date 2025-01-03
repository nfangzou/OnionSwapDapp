import App from './App'

const ethers = require('ethers');

import lang from "./lang/index.js"
import VueI18n from 'vue-i18n'
// 主合约
const contractAddress = "0x7c2bE3f591CdAe904C45Df0EE0f1C70fd456d8e5";
// 副合约
const twoContractAddress = "0xbFBAF568384635C6584BAEa634EE1530EF942a2B";

// 计算合约
const contractAddressTwo = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
// WBNB
const wbnbContractAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
// Dawkoin
const DawkoinContractAddress = "0x0427fbc8c75A59898F3e0D62263B9186E5Ff8c91";
// LP
const lpContractAddress = "0x284E8Ac57fA8a071742e2253198d5E37a3f96E6D";

Vue.prototype.ethers = ethers;
Vue.prototype.contractAddress = contractAddress;
Vue.prototype.twoContractAddress = twoContractAddress;
Vue.prototype.contractAddressTwo = contractAddressTwo;
Vue.prototype.wbnbContractAddress = wbnbContractAddress;
Vue.prototype.lpContractAddress = lpContractAddress;
Vue.prototype.DawkoinContractAddress = DawkoinContractAddress;
Vue.use(VueI18n)

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