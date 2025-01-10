<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="tip">
			<view class="text">
				提示：刪除池代幣會按照當前匯率將您的頭寸轉換回底層代幣，與您在池中的份額成比例。應計費用包含在您收到的金額中。
			</view>
		</view>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/Arrowleft.png" mode=""></image>
				</view>
				<view class="title">
					Remove liquidity
				</view>
				<view class="rightN">
					<image @tap="loadClick" src="../../static/load.png" mode=""></image>
				</view>
			</view>
			<view class="outLP">
				<view class="titleBox">
					<view class="one" style="margin-bottom: 10rpx;">
						移除金额
					</view>
				</view>
				<view class="infoBox">
					<view class="top1" style="display: flex;justify-content: left;">
						<text style="margin-right: 40rpx;">撤出份额</text>
						<text style="font-weight: bold;">{{sliderValue}} %</text>
					</view>
					<uv-slider v-model="sliderValue" @input="slideChange" step="5" backgroundColor="rgba(255, 255, 255, 0.4)" min="0" max="100"></uv-slider>
				</view>
				<view class="infoBox" style="background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);">
					<view class="top1">
						<text>WBNB</text>
						<text>0</text>
					</view>
					<view class="top1">
						<text>CPX</text>
						<text>0</text>
					</view>
				</view>
				<view class="endingBox">
					流动池中的份额：
				</view>
				<view class="SlippageBox2">
					<view class="boxTitle">
						设置滑点
					</view>
					<view class="slipBox">
						<view class="list" :class="slipCrrent == index?'listActive':'listNoActive'" v-for="(item, index) in slipData" :key="index" @tap="clickSlip(index)">
							{{item}}%
						</view>
						<view class="list2" :class="slipCrrent == 3?'listActive':'listNoActive'">
							<input v-model="selfSlip" @input="inputNum" placeholder-style="color:rgba(138, 63, 252, .5)" placeholder="自定义" type="text" /><text style="margin-right: 20rpx;">%</text>
						</view>
					</view>
				</view>
				<view class="btnGo2">
					<view class="btn" @tap="closeLP">
						移除
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
						您正在添加一个池
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="coinListTitle">
						<view class="left">
							{{fromCur.name}} / {{toCur.name}}
						</view>
						<view class="right">
							<image src="/static/TBC.png" mode=""></image>
							<image src="/static/OKEX.png" mode=""></image>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{fromCur.name}} 已存入</text>
						<text class="oneRight">{{fromCoinNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{toCur.name}} 已存入</text>
						<text class="oneRight">{{toCoinNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">费率</text>
						<view class="oneRight">
							<view>1 {{fromCur.name}} = 1 {{toCur.name}}</view>
							<view>1 {{toCur.name}} = 1 {{fromCur.name}}</view>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">池份</text>
						<text class="oneRight">100%</text>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickSupply">
							添加池与供应
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
	import swal from 'sweetalert';
	import selectCoin from "@/component/selectCoin/index.vue";
	import bignumberJS from "bignumber.js"
	import { API, FT, poolNFT } from "tbc-contract";
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
				ApproveWbnb: false,
				ApproveDawkoin: false,
				lamount: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				sliderValue: 0,
				getTotalSupplyNum: 0,
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
				poolType: 1,
				nowPoolAddress: []
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
		onLoad(option) {
			if(option.poolContract != undefined) {
				this.getPoolInCoin(option.poolContract);
			}
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
			async getPoolInCoin(id) {
				const poolUse = new poolNFT({txidOrParams: id, network:this.network});
				 await poolUse.initfromContractId();
				this.getUrlCoinList(poolUse.ft_a_contractTxid);
			},
			getUrlCoinList(coinAddress) {
				let tokenUrlList = [];
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/'+coinAddress,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						tokenUrlList.push({
							name: res.data.ftName,
							symbol: res.data.ftSymbol,
							address: res.data.ftContractId,
							chainId: 0,
							decimals: res.data.ftDecimal,
							balance: 0,
							logoURI: res.data.ftIconUrl,
						})
						this.toCur = tokenUrlList[0];
						this.poolType = 3;
						this.getCoinInfoData(this.toCur);
					}
				});
			},
			async closeLP() {
				const params = [{
					flag: "POOLNFT_LP_CONSUME",
					nft_contract_address: "07546166e456bd4a04ab11962c0ba0362277694a7cc7a12d5800276df2f1f31b",
					address: this.myAddress,
					ft_amount: 5.5,
				}];
				const { txid, rawtx } = await window.Turing.sendTransaction(params);
				if(txid) {
					uni.showToast({
						title: '添加成功',
						icon: "none"
					})
				}
				console.log(txid)
				console.log(rawtx)
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
				if(this.nowPoolAddress.length == 0) {
					swal({
						title: 'error',
						text: '请先选择币种',
						icon: "error"
					})
					return ;
				}
				this.$refs.popup2.open();
			},
			async clickSupply() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_LP_INCREASE",
						nft_contract_address: this.nowPoolAddress.poolContract,
						address: this.myAddress,
						tbc_amount: JSON.parse(this.fromCoinNum),
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					console.log(txid)
					console.log(rawtx)
					if(txid) {
						this.unloadCoinID();
					}
				} catch (error) {
					console.log(error)
				}
			},
			unloadCoinID() {
				uni.request({
					url: this.localApi+'newPool',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract1: this.toCur.address,
						poolContract: this.nowPoolAddress.poolContract,
						coinName1: this.toCur.name,
						userAddress: this.myAddress,
						coinDecimal: this.toCur.decimals
					},
					success: (res) => {
						if(res.data.success) {
							this.$refs.popup2.close();
							this.$refs.loading.close();
							swal({
								title: '添加成功',
								icon: "success",
							})
						}
					}
				});
			},
			backInfo(e) {
				if (this.goType == 'from') {
					this.fromCur = e;
					this.getCoinBalance(e,'from')
				} else {
					this.toCur = e;
					this.getCoinBalance(e,'to')
					this.getCoinInfoData(e);
				}
				this.$refs.popup.close();
				if (this.fromCur.name && this.toCur.name) {
					this.poolType = 3;
				}
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
						} else{
							swal({
								title: res.data.msg,
								icon: "error",
							})
						}
					}
				});
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
		padding-bottom: 30upx;

		.backTitle {
			margin: 38rpx 44rpx;

			image {
				width: 60rpx;
				height: 54rpx;
			}
		}

		.centerBox{
			margin: 40rpx 30rpx 0 30rpx;
			border: 2rpx solid #e5e5e5;
			border-radius: 20rpx;
			.poolTitle {
				position: relative;
				text-align: center;
				margin-bottom: 30upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30upx;
				padding: 0 28rpx;
				height: 112rpx;
				background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
				border-radius: 30rpx 30rpx 0 0;
				.back {
					image {
						width: 56upx;
						height: 56upx;
					}
				}
				.title {
					color: #fff;
				}
				.rightN{
					width: 56rpx;
					display: flex;
					justify-content: right;
					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
			.lpBox{
				margin-top: 20rpx;
				padding-bottom: 40rpx;
				.coinBox{
					margin-top: 23rpx;
					display: flex;
					align-items: center;
					.coinNameBox{
						width: 212rpx;
						height: 65rpx;
						border: 2rpx solid rgba(0, 222, 161, 1);
						background-color: #000;
						border-radius: 40rpx;
						line-height: 65rpx;
						display: flex;
						justify-content: center;
						margin-right: 25rpx;
						.coinSmall{
							display: flex;
							align-items: center;
							text{
								color: #fff;
								font-size: 36rpx;
								margin-right: 23rpx;
							}
							.slectIcon{
								width: 16rpx;
								height: 21rpx;
							}
						}
					}
					.coinMax{
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
				.inputToBox{
					.blanceTitle{
						display: flex;
						justify-content: right;
						color: rgba(255, 255, 255, .6);
						font-size: 24rpx;
						margin-bottom: 11rpx;
						margin-right: 40rpx;
					}
					.inputBody{
						height: 169rpx;
						background-color: rgba(0, 222, 161, .4);
						border-radius: 30rpx;
						padding-right: 45rpx;
						input{
							width: 100%;
							height: 100%;
							text-align: right;
							font-size: 42rpx;
							color: #fff;
						}
					}
				}
				.SlippageBox{
					margin-top: 40rpx;
					.boxTitle{
						font-size: 38rpx;
						color: #fff;
					}
					.slipBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 30rpx;
						.list{
							width: 140rpx;
							height: 65rpx;
							line-height: 65rpx;
							text-align: center;
							border-radius: 40rpx;
							font-size: 36rpx;
							font-weight: bold;
						}
						.listActive{
							background-color: rgba(0, 222, 161, 1);
							color: #000;
						}
						.listNoActive{
							background-color: rgba(0, 222, 161, .4);
							color: rgba(255, 255, 255, .4);
						}
						.list2{
							width: 140rpx;
							height: 65rpx;
							line-height: 65rpx;
							text-align: center;
							border-radius: 40rpx;
							font-size: 36rpx;
							font-weight: bold;
							display: flex;
							align-items: center;
							input{
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				.centerIcon{
					display: flex;
					justify-content: center;
					margin: 48rpx 0;
					.changebox{
						width: 36rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						background-image: url('../../static/icon1.png');
						background-size: 100% 100%;
						image{
							width: 27rpx;
							height: 28rpx;
						}
					}
				}
				.btnGoAppove{
					display: flex;
					justify-content: center;
					margin-top: 80rpx;
					.btn{
						width: 300rpx;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
						font-size: 34rpx;
						font-weight: bold;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 60rpx;
					}
				}
				.btnGo{
					display: flex;
					justify-content: center;
					margin-top: 80rpx;
					.btn{
						width: 300rpx;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
						font-weight: bold;
						font-size: 34rpx;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 60rpx;
					}
				}
			}
			.outLP{
				margin-top: 27rpx;
				padding: 28rpx;
				.titleBox{
					color: #161616;
					font-weight: bold;
					font-size: 36rpx;
				}
				.infoBox{
					margin-top: 30rpx;
					padding: 25rpx 16rpx;
					background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
					border-radius: 10rpx;
					.top1{
						display: flex;
						justify-content: space-between;
						margin-bottom: 31rpx;
						color: #fff;
						font-size: 28rpx;
						font-weight: bold;
					}
				}
				.endingBox{
					margin: 34rpx 0;
					color: #161616;
					font-size: 30rpx;
				}
				.SlippageBox2{
					margin-top: 40rpx;
					.boxTitle{
						font-size: 38rpx;
						color: #fff;
					}
					.slipBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 30rpx;
						.list{
							width: 140rpx;
							height: 65rpx;
							line-height: 65rpx;
							text-align: center;
							border-radius: 40rpx;
							font-size: 36rpx;
							font-weight: bold;
						}
						.listActive{
							background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
							color: #fff;
						}
						.listNoActive{
							background: rgba(130,51,214,0.1);
							color: rgba(138, 63, 252, .5);
						}
						.list2{
							width: 140rpx;
							height: 65rpx;
							line-height: 65rpx;
							text-align: center;
							border-radius: 40rpx;
							font-size: 36rpx;
							font-weight: bold;
							display: flex;
							align-items: center;
							input{
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				.btnGo2{
					display: flex;
					justify-content: center;
					margin-top: 80rpx;
					margin-bottom: 40rpx;
					.btn{
						width: 357rpx;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
						font-size: 36rpx;
						font-weight: bold;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 50rpx;
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
			padding: 25rpx;
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
			.coinListTitle{
				display: flex;
				justify-content: space-between;
				border-bottom: 2px solid #e5e5e5;
				padding: 20rpx 0;
				.left{
					font-size: 30rpx;
					color: #000;
				}
				.right{
					image{
						width: 60rpx;
						height: 60rpx;
						margin-right: 5rpx;
						border-radius: 50%;
					}
				}
			}
			.listOne{
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				.oneLeft{
					color: gray;
				}
				.oneRight{
					color: #6929C4;
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
		background: rgba(255,24,28,0.1);
		padding: 28upx;
		border-radius: 28upx;
		margin-bottom: 40upx;
		
		.text {
			font-family: Noto Sans SC, Noto Sans SC;
			font-weight: 400;
			font-size: 24rpx;
			color: #DA1E28;
		}
	}

	.sharePool {
		margin-top: 30upx;
		
		.title {
			font-size: 26upx;
			color: #000;
			font-weight: bold;
		}
		
		.shareList {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2upx solid #E0E0E0;
			padding: 30upx 0;
			border-radius: 15upx;
			margin-top: 20upx;
		
			.item {
				width: 33.3%;
				color: #000;
				text-align: center;
				font-size: 24upx;
			}
			.num{
				font-weight: bold;
			}
		}
	}

	.shareBtn {
		background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
		padding: 30upx;
		margin-top: 56upx;
		border-radius: 42upx;
		
		.text {
			font-size: 30upx;
			color: #fff;
			text-align: center;
		}
	}
	.tip{
		background-color: rgb(247 220 222);
		margin: 30upx;
		padding: 15upx;
		border-radius: 15upx;
		.text{
			font-size: 28upx;
			color:rgb(234 53 53);
		}
	}
</style>