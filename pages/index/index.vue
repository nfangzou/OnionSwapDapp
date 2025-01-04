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
						余额：{{fromCur.balance}}
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
						余额：{{toCur.balance}}
					</view>
					<view class="inputBody">
						<input v-model="toCoinNum" @input="showTwoChange" type="text" />
					</view>
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
							<input v-model="selfSlip" @input="inputNum" placeholder="自定义" type="text" /><text
								style="margin-right: 20rpx;">%</text>
						</view>
					</view>
				</view>
				<view class="btnGo">
					<view class="btn" @tap="inClick">
						兑换
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="popup" type="center" :mask-background-color="activeCole" :mask-click="true">
			<select-coin @clickClose="closePup" @clickBackInfo="backInfo"></select-coin>
		</uni-popup>
		<w-loading text="" mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import selectCoin from "@/component/selectCoin/index.vue";
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
					decimals: 18,
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
				goType: 'from'
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
				} else {
					this.toCur = e;
					this.getCoinBalance(e,'to')
				}
				this.$refs.popup.close();
			},
			showPupCoin(type) {
				this.goType = type;
				this.$refs.popup.open();
			},
			getCoinBalance(coinInfo, type) {
				if (coinInfo.name == 'TBC') {
					var nowTbc = 0;
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
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			async inClick() {
				if(this.myAddress == '') {
					uni.showToast({
						title: '请连接钱包',
						icon: "none"
					})
					return ;
				}
				if(this.toCur.address == '') {
					uni.showToast({
						title: '请选择代币',
						icon: "none"
					})
					return ;
				}
				
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
				console.log(e)
			},
			showTwoChange(e) {
				if (e.detail.value == 0) {
					return;
				}
				let nowValue = new bignumberJS(parseFloat(e.detail.value)).shiftedBy(18);
				let newNum = this.DawkoinLpNum * nowValue / this.wbnbLpNum;
				this.toCoinNum = new bignumberJS(newNum).shiftedBy(-18).toNumber();
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
	.content {
		width: 100%;
		height: 1700rpx;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
		background-color: #000;

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
			border: 2rpx solid #e5e5e5;
			border-radius: 20rpx;
			padding: 30rpx;

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
					margin-top: 23rpx;
					display: flex;
					align-items: center;

					.coinNameBox {
						width: 212rpx;
						height: 65rpx;
						border: 2rpx solid rgba(0, 222, 161, 1);
						background-color: #000;
						border-radius: 40rpx;
						line-height: 65rpx;
						display: flex;
						justify-content: center;
						margin-right: 25rpx;

						.coinSmall {
							display: flex;
							align-items: center;

							text {
								color: #fff;
								font-size: 30rpx;
								margin-right: 23rpx;
							}

							.slectIcon {
								width: 16rpx;
								height: 21rpx;
							}
						}
					}

					.coinMax {
						width: 80rpx;
						height: 45rpx;
						line-height: 45rpx;
						text-align: center;
						border: 2rpx solid rgba(0, 222, 161, 1);
						color: rgba(0, 222, 161, 1);
						font-size: 24rpx;
						font-weight: bold;
						border-radius: 40rpx;
					}
				}

				.inputToBox {
					.blanceTitle {
						display: flex;
						justify-content: right;
						color: rgba(255, 255, 255, .6);
						font-size: 24rpx;
						margin-bottom: 11rpx;
						margin-right: 40rpx;
					}

					.inputBody {
						height: 169rpx;
						background-color: rgba(0, 222, 161, .4);
						border-radius: 30rpx;
						padding-right: 45rpx;

						input {
							width: 100%;
							height: 100%;
							text-align: right;
							font-size: 42rpx;
							color: #fff;
						}
					}
				}

				.SlippageBox {
					margin-top: 40rpx;

					.boxTitle {
						font-size: 38rpx;
						color: #fff;
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
							background-color: rgba(0, 222, 161, 1);
							color: #000;
						}

						.listNoActive {
							background-color: rgba(0, 222, 161, .4);
							color: rgba(255, 255, 255, .4);
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
							}
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

				.btnGoAppove {
					display: flex;
					justify-content: center;
					margin-top: 80rpx;

					.btn {
						width: 300rpx;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #000;
						font-size: 34rpx;
						font-weight: bold;
						background-color: #00DEA1;
						border-radius: 60rpx;
					}
				}

				.btnGo {
					display: flex;
					justify-content: center;
					margin-top: 80rpx;

					.btn {
						width: 300rpx;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #000;
						font-weight: bold;
						font-size: 34rpx;
						background-color: #00DEA1;
						border-radius: 60rpx;
					}
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
</style>