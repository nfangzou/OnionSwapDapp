<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="0" :classType="true" subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="loadIcon">
				<image @tap="loadClick" src="../../static/load.png" mode=""></image>
			</view>
			<view class="lpBox">
				<view class="coinBox">
					<view class="coinNameBox">
						<view class="coinSmall" @tap="showPupCoin('from')">
							<image class="slectIcon" src="/static/TBC.png" mode=""></image>
							<text>{{fromCur.name?fromCur.name:'选择币种'}}</text>
							<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
						</view>
					</view>
					<view class="coinMax" @tap="fromCoinNum = fromCur.balance">
						MAX
					</view>
				</view>
				<view class="inputToBox">
					<view class="blanceTitle">
						余额：<text style="color: #3367D6;">{{fromCur.balance}}</text>
					</view>
					<view class="inputBody">
						<input v-model="fromCoinNum" @input="showChange" type="text" />
					</view>
				</view>
				<view class="centerIcon">
					<view class="changebox" @tap="changeIcon()">
						<image src="../../static/icon2.png" mode=""></image>
					</view>
				</view>
				<view class="coinBox">
					<view class="coinNameBox">
						<view class="coinSmall" @tap="showPupCoin('to')">
							<image class="slectIcon" src="/static/TBC.png" mode=""></image>
							<text>{{toCur.name?toCur.name:'选择币种'}}</text>
							<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
						</view>
					</view>
					<view class="coinMax" @tap="toCoinNum = toCur.balance">
						MAX
					</view>
				</view>
				<view class="inputToBox">
					<view class="blanceTitle">
						余额：<text style="color: #3367D6;">{{toCur.balance}}</text>
					</view>
					<view class="inputBody">
						<input v-model="toCoinNum" type="text" />
					</view>
				</view>
				<view class="tipsText" v-if="toCur.name != ''">
					1 {{fromCur.name}} = {{fromCur.name == 'TBC'?FTPrice:Math.floor((1/FTPrice)*10000)/10000}} {{toCur.name}}
				</view>
				<view class="SlippageBox">
					<view class="boxTitle">
						设置滑点
					</view>
					<view class="slipBox">
						<view class="list" :class="slipCrrent == index?'listActive':'listNoActive'"
							v-for="(item, index) in slipData" :key="index" @tap="clickSlip(index)">
							{{item}}%
						</view>
						<view class="list2" :class="slipCrrent == 3?'listActive':'listNoActive'">
							<input v-model="selfSlip" @input="inputNum" placeholder="自定义" placeholder-style="color: rgba(51, 103, 214, .3);" type="text" /><text
								style="margin-right: 20rpx;">%</text>
						</view>
					</view>
				</view>
				<view class="routerBox" v-if="toCur.name != ''">
					<view class="lefrRou">
						路由令牌
					</view>
					<view class="rightRou">
						<text>{{fromCur.name}}</text>
						<image src="/static/rightIcon.png" mode=""></image>
						<text>{{toCur.name}}</text>
					</view>
				</view>
				<view class="btnGo">
					<view class="btn" @tap="inClick">
						兑换
					</view>
				</view>
			</view>
		</view>


		<uni-popup ref="popup2" type="center" :mask-background-color="activeCole" :mask-click="true">
			<view class="maskRe">
				<view class="title">
					<view class="left">
					</view>
					<view class="center">
						查看交换
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="listOne">
						<view class="leftOne">
							<view class="oneLeft">卖出</view>
							<view class="oneRight">{{fromCoinNum}} {{fromCur.name}}</view>
						</view>
						<view class="rightImg">
							<image src="/static/TBC.png" mode=""></image>
						</view>
					</view>
					<view class="listOne">
						<view class="leftOne">
							<view class="oneLeft">购买</view>
							<view class="oneRight">{{toCoinNum}} {{toCur.name}}</view>
						</view>
						<view class="rightImg">
							<image src="/static/TBC.png" mode=""></image>
						</view>
					</view>
					<view class="listOne2">
						<text class="oneLeft">滑点</text>
						<view class="oneRight">
							<view>自动 {{slipCrrent == 3?selfSlip:slipData[slipCrrent]}}</view>
						</view>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickChange">
							核准交换
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center" :mask-background-color="activeCole" :mask-click="true">
			<select-coin @clickClose="closePup" @clickBackInfo="backInfo"></select-coin>
		</uni-popup>
		<w-loading text="" mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import selectCoin from "@/component/selectCoin/index.vue";
	import swal from 'sweetalert';
	import bignumberJS from "bignumber.js"
	import {mapState,mapMutations,mapGetters} from 'vuex'
	import wLoading from "@/component/w-loading/w-loading.vue";
	export default {
		components: {
			back,
			wLoading,
			selectCoin
		},
		data() {
			return {
				myAddress: '',
				tabIndex: 0,
				DawkoinBalanceNum: 0,
				slipData: ['0.1', '0.5', '1.0'],
				slipCrrent: 0,
				selfSlip: '',
				toCoinNum: '',
				fromCoinNum: '',

				fromCur: {
					name: 'TBC',
					symbol: 'test_coin',
					address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
					chainId: 56,
					decimals: 6,
					balance: '',
					logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
				},
				toInput: '',
				toCur: {
					balance: '',
					name: '',
					symbol: '',
					address: '',
					chainId: '',
					decimals: '',
					logoURI: '',
				},
				activeCole: 'rgba(0,0,0,0.5)',
				tbcBalance: 0,
				goType: 'from',
				nowPoolAddress: [],
				FTPrice: 0,
				poolFbNum: 0,
				poolTbcNum: 0,
				SelectCoinInfoData: []
			}
		},
		computed: {
			...mapGetters(['getWallet','getCoin'])
		},
		watch: {
			getWallet(val, oldVal){
				this.Init();
			}
		},
		onLoad() {
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.getCoinBalance(this.fromCur,'from')
				}
			},
			clickSlip(val) {
				this.slipCrrent = val;
			},
			slideChange(e) {},
			changeIcon() {
				const tempCurrency = {
					...this.toCur
				};
				this.toCur = {
					...this.fromCur
				};
				this.fromCur = {
					...tempCurrency
				};

				const tempInput = this.toInput;
				this.toInput = this.fromInput;
				this.fromInput = tempInput;

				this.goType = this.goType === 'from' ? 'to' : 'from';
			},
			closePup(e) {
				this.$refs.popup.close();
			},
			backInfo(e) {
				if (this.goType == 'from') {
					this.fromCur = e;
					this.getCoinBalance(e,'from')
					if(e.name != 'TBC') {
						this.getSelectCoinInfo(e.address);
						this.getCoinInfoData(e);
					}
				} else {
					this.toCur = e;
					this.getCoinBalance(e,'to');
					if(e.name != 'TBC') {
						this.getSelectCoinInfo(e.address);
						this.getCoinInfoData(e);
					}
				}
				this.$refs.popup.close();
			},
			getCoinInfoData(val) {
				uni.request({
					url: this.localApi+'getCoinInfo',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract: val.address 
					},
					success: (res) => {
						if(res.data.success) {
							this.nowPoolAddress = res.data;
							this.getNowCoinPool(res.data.poolContract);
						} else{
							swal({
								title: res.data.msg,
								icon: "error",
							})
						}
					}
				});
			},
			getNowCoinPool(ID) {
				uni.request({
					url: this.urlApi + 'ft/pool/nft/info/contract/id/'+ID,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						if(res.statusCode == 200) {
							this.selectCoinPool = res.data;
							this.poolTbcNum = this.selectCoinPool.tbc_balance/Math.pow(10,6);
							this.poolFbNum = this.selectCoinPool.ft_a_balance/Math.pow(10,this.SelectCoinInfoData.ftDecimal);
							this.FTPrice = Math.floor((this.poolFbNum/this.poolTbcNum)*10000)/10000;
						}
					}
				});
			},
			getSelectCoinInfo(address) {
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/'+address,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						this.SelectCoinInfoData = res.data;
					}
				});
			},
			showPupCoin(type) {
				this.goType = type;
				this.$refs.popup.open();
			},
			getCoinBalance(coinInfo, type) {
				if (coinInfo.name == 'TBC') {
					uni.request({
						url: this.urlApi + 'address/'+this.myAddress+'/get/balance',
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								if(type == 'from') {
									this.fromCur.balance = res.data.data.balance/1000000;
								} else{
									this.toCur.balance = res.data.data.balance/1000000;
								}
							}
						}
					});
				} else{
					uni.request({
						url: this.urlApi + 'ft/balance/address/'+this.myAddress+/contract/+coinInfo.address,
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								if(type == 'from') {
									this.fromCur.balance = res.data.ftBalance/1000000;
								} else{
									this.toCur.balance = res.data.ftBalance/1000000;
								}
							}
						}
					});
				}
			},
			loadClick() {
				this.Init();
				this.getCoinBalance(this.fromCur,'from')
				this.getCoinBalance(this.toCur,'to')
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			swapEndClick(txID) {
				uni.request({
					url: this.localApi+'swapOne',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract: this.fromCur.name == 'TBC'?this.toCur.address:this.fromCur.address,
						doType: this.fromCur.name == 'TBC'?0:1,
						hash: txID,
						canRec: this.slipCrrent == 3?this.selfSlip:this.slipData[this.slipCrrent],
						address: this.myAddress
					},
					success: (res) => {
						console.log(res)
						this.$refs.loading.close();
						if(res.data.success) {
							let transferNum = this.toCur.name == 'TBC'?res.data.msg/Math.pow(10,6):res.data.msg/Math.pow(10,this.SelectCoinInfoData.ftDecimal);
							swal({
								title: '转换成功',
								text: this.fromCoinNum+' '+this.fromCur.name+' 兑换 '+transferNum+' '+this.toCur.name,
								icon: "success"
							})
							this.$refs.popup2.close();
							this.getCoinBalance(this.fromCur,'from')
							this.getCoinBalance(this.toCur,'to')
							let loadInfo = this.fromCur.name == 'TBC'?this.toCur:this.fromCur;
							this.getSelectCoinInfo(loadInfo.address);
							this.getCoinInfoData(loadInfo);
							this.fromCoinNum = '';
							this.toCoinNum = '';
						} else{
							swal({
								title: res.data,
								icon: "error"
							})
						}
						
					}
				});
			},
			async clickChange() {
				this.$refs.loading.open();
				if(this.fromCur.name == 'TBC') {
					try {
						const paramsEnd = [{
							flag: "P2PKH",
							satoshis: JSON.parse(this.fromCoinNum)*1000000,
							address: this.nowPoolAddress.recAddress
						}];
						const {txid,rawtx} = await window.Turing.sendTransaction(paramsEnd);
						console.log(txid)
						console.log(rawtx)
						if(txid) {
							this.swapEndClick(txid);
						}
					} catch(err) {
						this.$refs.popup2.close();
						console.log(err)
					}
					
				} else {
					try{
						const params = [{
							flag: "FT_TRANSFER",
							ft_contract_address: this.fromCur.address,
							ft_amount: JSON.parse(this.fromCoinNum),
							address: this.nowPoolAddress.recAddress
						}];
						console.log(params)
						const {txid,rawtx} = await window.Turing.sendTransaction(params);
						console.log(txid)
						console.log(rawtx)
						if(txid) {
							this.swapEndClick(txid);
						}
					} catch(err) {
						this.$refs.popup2.close();
						console.log(err)
					}
					
				}
			},
			async inClick() {
				if(this.myAddress == '') {
					swal({
						title: 'error',
						text: '请连接钱包',
						icon: "error"
					})
					return ;
				}
				if(this.toCur.name != 'TBC' && this.toCur.address == '') {
					swal({
						title: 'error',
						text: '请选择代币',
						icon: "error"
					})
					return ;
				}
				if(this.fromCur.name != 'TBC' && this.toCur.name != 'TBC') {
					swal({
						title: 'error',
						text: '当前不支持代币互换',
						icon: "error"
					})
					return ;
				}
				this.$refs.popup2.open();
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			inputNum(e) {
				this.slipData.forEach((item, index) => {
					if (parseFloat(item) == parseFloat(e.detail.value)) {
						this.slipCrrent = index;
					} else {
						this.slipCrrent = 3;
					}
				})
				if (parseInt(e.detail.value) >= 50) {
					this.selfSlip = 0;
					uni.showToast({
						title: '请输入有效的滑点比',
						icon: "none"
					})
				}
			},
			showChange(e) {
				if(e.detail.value == 0) {
					return ;
				}
				this.toCoinNum = 0;
				if(this.fromCur.name == 'TBC') {
					let nowPrice = JSON.parse(e.detail.value) * Math.pow(10,6);
					let newNum = (nowPrice * this.selectCoinPool.ft_a_balance) / (this.selectCoinPool.tbc_balance + nowPrice);
					this.toCoinNum = Math.floor((newNum/Math.pow(10,this.SelectCoinInfoData.ftDecimal))*10000)/10000;
				} else{
					let nowPrice = JSON.parse(e.detail.value) * Math.pow(10,this.SelectCoinInfoData.ftDecimal);
					let newNum = (nowPrice * this.selectCoinPool.tbc_balance) / (this.selectCoinPool.ft_a_balance + nowPrice)
					this.toCoinNum = Math.floor(newNum/Math.pow(10,6)*10000)/10000;
				}
				
			},
			
			mobileFilter1(val) {
				let inNumber = val.toString();
				let num = this.ethers.utils.formatUnits(inNumber);
				if (parseInt(num) === parseFloat(num)) {
					return parseInt(num)
				} else {
					return Number(num)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.content {
			width: 100%;
			height: auto;
			// min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 50upx;
			.backTitle {
				margin: 38rpx 44rpx;
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
		
			.centerBox {
				width: 60%;
				margin: 40rpx auto 0;
				// max-width: 750rpx;
				// margin: 40rpx 30rpx 0 30rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				background-color: #fff;
		
				.loadIcon {
					display: flex;
					justify-content: right;
		
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
		
				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;
		
					.coinBox {
						display: flex;
						align-items: center;
						.coinNameBox {
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							justify-content: center;
							margin-right: 25rpx;
		
							.coinSmall {
								display: flex;
								align-items: center;
		
								text {
									color: #000;
									font-size: 30rpx;
									margin-right: 23rpx;
									margin-right: 10rpx;
								}
								
								.slectIcon {
									width: 42rpx;
									height: 42rpx;
								}
							}
						}
		
						.coinMax {
							width: 80rpx;
							height: 45rpx;
							line-height: 45rpx;
							text-align: center;
							border: 2rpx solid #3367D6;
							color: #3367D6;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
						}
					}
		
					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #161616;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}
		
						.inputBody {
							height: 169rpx;
							background-color: rgba(80,135,252,0.1);
							border: 2rpx solid #3367D6;
							border-radius: 30rpx;
							padding-right: 45rpx;
		
							input {
								width: 100%;
								height: 100%;
								text-align: right;
								font-size: 42rpx;
								color: #3367D6;
							}
						}
					}
					.tipsText{
						margin: 30rpx 0;
						padding-bottom: 60rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #6929C4;
						border-bottom: 2rpx solid #3367D6;
					}
					.SlippageBox {
						margin-top: 40rpx;
		
						.boxTitle {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}
		
						.slipBox {
							display: flex;
							align-items: center;
							margin-top: 30rpx;
		
							.list {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								margin-right: 40rpx;
							}
		
							.listActive {
								background-color: rgba(51,103,214,0.4);
								color: #3367D6;
							}
		
							.listNoActive {
								background-color: rgba(51,103,214,0.4);
								color: rgba(51, 103, 214, .3);
							}
		
							.list2 {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								display: flex;
								align-items: center;
		
								input {
									width: 100%;
									height: 100%;
									color: #3367D6;
								}
							}
						}
					}
					.routerBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 50rpx;
						.leftRou{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}
						.rightRou{
							display: flex;
							align-items: center;
							text{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #3367D6;
							}
							image{
								width: 35rpx;
								height: 35rpx;
							}
						}
					}
					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 48rpx 0;
		
						.changebox {
							width: 36rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background-image: url('../../static/icon1.png');
							background-size: 100% 100%;
		
							image {
								width: 27rpx;
								height: 28rpx;
							}
						}
					}
		
					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115,40,228,0.1);
							color: #6433D6;
							border-radius: 56rpx;
						}
					}
				}
		
		
			}
		}
		.maskRe {
			width: 550rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #000;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 25rpx 25rpx 25rpx;
				.left{
					width: 50rpx;
				}
				.center{
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}
				.right{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
			.tokenList{
				padding: 18rpx;
				.listOne{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 60rpx;
					.leftOne{
						border-bottom: 2rpx solid #e5e5e5;
						padding-bottom: 40rpx;
						.oneLeft{
							color: #000;
						}
						.oneRight{
							color: #6929C4;
							font-size: 40rpx;
							font-weight: bold;
							margin-top: 20rpx;
						}
					}
					.rightImg{
						width: 70rpx;
						height: 70rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				.listOne2{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.oneLeft{
						color: #000;
					}
					.oneRight{
						color: #00dea1;
						font-size: 30rpx;
						font-weight: bold;
						margin-top: 20rpx;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 42rpx;
						color: #fff;
					}
				}
			}
		}
		.slideStyle {
			background-image: url('../../static/logo.png');
			background-size: 100% 100%;
			width: 60rpx;
			height: 60rpx;
		}
	}
	@media all and (min-width: 320px) and (max-width: 700px){
		.content {
			width: 100%;
			height: 1700rpx;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			.backTitle {
				margin: 38rpx 44rpx;
		
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
		
			.centerBox {
				max-width: 750rpx;
				margin: 40rpx 30rpx 0 30rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				background-color: #fff;
		
				.loadIcon {
					display: flex;
					justify-content: right;
		
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
		
				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;
		
					.coinBox {
						display: flex;
						align-items: center;
		
						.coinNameBox {
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							justify-content: center;
							margin-right: 25rpx;
		
							.coinSmall {
								display: flex;
								align-items: center;
		
								text {
									color: #000;
									font-size: 30rpx;
									margin-right: 23rpx;
									margin-right: 10rpx;
								}
								
								.slectIcon {
									width: 42rpx;
									height: 42rpx;
								}
							}
						}
		
						.coinMax {
							width: 80rpx;
							height: 45rpx;
							line-height: 45rpx;
							text-align: center;
							border: 2rpx solid #3367D6;
							color: #3367D6;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
						}
					}
		
					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #161616;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}
		
						.inputBody {
							height: 169rpx;
							background-color: rgba(80,135,252,0.1);
							border: 2rpx solid #3367D6;
							border-radius: 30rpx;
							padding-right: 45rpx;
		
							input {
								width: 100%;
								height: 100%;
								text-align: right;
								font-size: 42rpx;
								color: #3367D6;
							}
						}
					}
					.tipsText{
						margin: 30rpx 0;
						padding-bottom: 60rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #6929C4;
						border-bottom: 2rpx solid #3367D6;
					}
					.SlippageBox {
						margin-top: 40rpx;
		
						.boxTitle {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}
		
						.slipBox {
							display: flex;
							align-items: center;
							margin-top: 30rpx;
		
							.list {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								margin-right: 40rpx;
							}
		
							.listActive {
								background-color: rgba(51,103,214,0.4);
								color: #3367D6;
							}
		
							.listNoActive {
								background-color: rgba(51,103,214,0.4);
								color: rgba(51, 103, 214, .3);
							}
		
							.list2 {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								display: flex;
								align-items: center;
		
								input {
									width: 100%;
									height: 100%;
									color: #3367D6;
								}
							}
						}
					}
					.routerBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 50rpx;
						.leftRou{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}
						.rightRou{
							display: flex;
							align-items: center;
							text{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #3367D6;
							}
							image{
								width: 35rpx;
								height: 35rpx;
							}
						}
					}
					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 48rpx 0;
		
						.changebox {
							width: 36rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background-image: url('../../static/icon1.png');
							background-size: 100% 100%;
		
							image {
								width: 27rpx;
								height: 28rpx;
							}
						}
					}
		
					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115,40,228,0.1);
							color: #6433D6;
							border-radius: 56rpx;
						}
					}
				}
		
		
			}
		}
		.maskRe {
			width: 550rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #000;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 25rpx 25rpx 25rpx;
				.left{
					width: 50rpx;
				}
				.center{
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}
				.right{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
			.tokenList{
				padding: 18rpx;
				.listOne{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 60rpx;
					.leftOne{
						border-bottom: 2rpx solid #e5e5e5;
						padding-bottom: 40rpx;
						.oneLeft{
							color: #000;
						}
						.oneRight{
							color: #6929C4;
							font-size: 40rpx;
							font-weight: bold;
							margin-top: 20rpx;
						}
					}
					.rightImg{
						width: 70rpx;
						height: 70rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				.listOne2{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.oneLeft{
						color: #000;
					}
					.oneRight{
						color: #00dea1;
						font-size: 30rpx;
						font-weight: bold;
						margin-top: 20rpx;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 42rpx;
						color: #fff;
					}
				}
			}
		}
		.slideStyle {
			background-image: url('../../static/logo.png');
			background-size: 100% 100%;
			width: 60rpx;
			height: 60rpx;
		}
	}
	
</style>