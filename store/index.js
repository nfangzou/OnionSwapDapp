import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {　　　　　　　　
		walletAddress:"",
		sendData:false,
		coinName:"",
		starDate:"2023-02-15 13:09:00",
		endDate:"2023-02-20 13:09:00"
　　},
	getters:{
		getWallet(state){
			return state.walletAddress
		},
		getSendData(state){
			return state.sendData
		},
		getCoin(state){
			return state.coinName
		},
		getStarDate(state){
			return state.starDate
		},
		getEndDate(state){
			return state.endDate
		}
	},
	mutations: {
		setWallet(state,item){
			state.walletAddress = item;
		},
		setCoin(state,item){
			state.coinName=item;
		},
		setSendData(state,item){
			state.sendData=item;
		}
	}
})

export default store