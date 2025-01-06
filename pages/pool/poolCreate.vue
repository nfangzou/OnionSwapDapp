<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/back1.png" mode=""></image>
				</view>
				<view class="title">
					import V2 Pool
				</view>
			</view>
			<view class="tipMsg" v-if="poolType==3">
				<view class="text">
					Tip: When you add liquidity,you will receive pool tokens representing your position.These tokens
					automatically earn fees proportional to you share of the pool,and can be redeemed at any time.
				</view>
			</view>
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
						<input v-model="fromCoinNum" type="text" />
					</view>
				</view>
				<view class="centerIcon">
					<view class="changebox">
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
				</view>
				<view class="inputToBox">
					<view class="blanceTitle">
						余额：{{toCur.balance}}
					</view>
					<view class="inputBody">
						<input v-model="toCoinNum" type="text" />
					</view>
				</view>
				<view class="clientText" v-if="poolType==1">
					Select a token to find your v2 liquidity
				</view>
				<view class="client" v-if="poolType==2">
					<view class="samll">
						No pool found
					</view>
					<view class="text" @click="poolType=3">
						Create pool
					</view>
				</view>
				<view class="sharePool" v-if="poolType==3">
					<view class="title">
						Initial prices and pool share
					</view>
					<view class="shareList">
						<view class="item">
							<view class="num">
								1
							</view>
							<view class="text">
								{{fromCur.name}} per {{toCur.name}}
							</view>
						</view>
						<view class="item">
							<view class="num">
								1
							</view>
							<view class="text">
								{{toCur.name}} per {{fromCur.name}}
							</view>
						</view>
						<view class="item">
							<view class="num">
								100%
							</view>
							<view class="text">
								池份
							</view>
						</view>
					</view>
				</view>
				<view class="shareBtn" @tap="clickShowSupply" v-if="poolType==3">
					<view class="text">
						Supply
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
						您正在建立一个池
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/OKEX.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					
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
	import swal from 'sweetalert';
	import selectCoin from "@/component/selectCoin/index.vue";
	import bignumberJS from "bignumber.js"
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
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
				lpNum: 0,
				ApproveWbnb: false,
				ApproveDawkoin: false,
				lamount: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				sliderValue: 0,
				getTotalSupplyNum: 0,
				DawkoinLpNum: 0,
				wbnbLpNum: 0,
				ApproveLP: false,
				userLpCount: 0,


				fromCur: {
					name: 'TBC',
					symbol: 'test_coin',
					address: '',
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
				goType: 'from',
				poolType: 1
			}
		},
		computed: {
			...mapGetters(['getWallet', 'getCoin'])
		},
		watch: {
			getWallet(val, oldVal) {
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
					this.getPoolInfo();
					this.getCoinBalance(this.fromCur,'from')
				}
			},
			clickSlip(val) {
				this.slipCrrent = val;
			},
			getPoolInfo() {
				uni.request({
					url: this.urlApi + 'ft/pool/nft/info/contract/id/07546166e456bd4a04ab11962c0ba0362277694a7cc7a12d5800276df2f1f31b',
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						console.log(res)
						if(res.statusCode == 200) {
							
						}
					}
				});
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
			closePup2() {
				this.$refs.popup2.close();
			},
			clickShowSupply() {
				this.$refs.popup2.open();
			},
			async clickSupply() {
				const params = [{
					flag: "POOLNFT_MINT",
					ft_contract_address: this.toCur.address,
				}];
				const {txid,rawtx} = await window.Turing.sendTransaction(params);
				console.log(txid)
				uni.setStorageSync('poolID',txid);
				uni.setStorageSync('poolTokenName',this.toCur.name);
				const paramsEnd = [{
					flag: "POOLNFT_INIT",
					nft_contract_address: txid,
					address: this.myAddress,
					tbc_amount: JSON.parse(this.fromCoinNum),
					ft_amount: JSON.parse(this.toCoinNum)
				}];
				const {txidEnd,rawtxEnd} = await window.Turing.sendTransaction(paramsEnd);
				swal({
					title: '添加成功',
					icon: "success",
				})
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
				if (this.fromCur.name && this.toCur.name) {
					this.poolType = 2;
				}
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
				this.getLPComputer();
				this.getTotalSupply();
				this.getLPContent();
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			backGo() {
				uni.navigateBack();
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
		height: auto;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
		background-color: #000;
		padding-bottom: 30upx;

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
	
	.maskRe {
		width: 550rpx;
		height: 600rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		border: 2rpx solid #fff;
		background-color: gray;
		.title{
			display: flex;
			justify-content: space-between;
			.left{
				width: 50rpx;
			}
			.center{
				color: #fff;
			}
			.right{
				image{
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
		.tokenList{
			margin-top: 40rpx;
			
		}
	}
	.slideStyle {
		background-image: url('../../static/logo.png');
		background-size: 100% 100%;
		width: 60rpx;
		height: 60rpx;
	}

	.poolTitle {
		position: relative;
		text-align: center;
		margin-bottom: 30upx;

		.back {
			position: absolute;
			left: 0;
			top: 0;

			image {
				width: 40upx;
				height: 40upx;
			}
		}

		.title {
			color: #fff;
		}
	}

	.clientText {
		color: #fff;
		text-align: center;
		font-size: 24upx;
		margin-top: 20upx;
	}

	.client {
		.samll {
			color: #fff;
			text-align: center;
			font-size: 24upx;
			margin-top: 20upx;
		}

		.text {
			color: #00DEA1;
			text-align: center;
			font-size: 24upx;
			margin-top: 20upx;
		}
	}

	.tipMsg {
		background-color: #00dea1;
		padding: 15upx;
		border-radius: 15upx;
		margin-bottom: 20upx;

		.text {
			font-size: 24upx;
		}
	}

	.sharePool {
		margin-top: 30upx;

		.title {
			font-size: 26upx;
			color: #fff;
		}

		.shareList {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2upx solid #fff;
			padding: 30upx 0;
			border-radius: 15upx;
			margin-top: 20upx;

			.item {
				width: 33.3%;
				color: #fff;
				text-align: center;
				font-size: 24upx;
			}
		}
	}

	.shareBtn {
		background-color: #00dea1;
		padding: 30upx;
		margin-top: 40upx;
		border-radius: 50upx;

		.text {
			font-size: 30upx;
			color: #fff;
			text-align: center;
		}
	}
</style>