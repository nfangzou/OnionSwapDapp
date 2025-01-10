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
						<text>TBC</text>
						<text>{{tbcMoveNum}}</text>
					</view>
					<view class="top1">
						<text>{{poolInfo.contractName}}</text>
						<text>{{ftMoveNum}}</text>
					</view>
				</view>
				<view class="endingBox">
					流动池中的份额：{{poolInfo.ft_lp_balance/Math.pow(10,poolInfo.ftDecimal)}}
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
						您将收到
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="listOne">
						<text class="oneLeft">TBC </text>
						<text class="oneRight">{{tbcMoveNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{poolInfo.contractName}} </text>
						<text class="oneRight">{{ftMoveNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">TBC/{{poolInfo.contractName}}</text>
						<view class="oneRight">
							<view>1 {{poolInfo.ft_lp_balance/Math.pow(10,poolInfo.ftDecimal)}}</view>
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
				selfSlip: '',
				sliderValue: 0,
				activeCole: 'rgba(0,0,0,0.5)',
				poolInfo: [],
				tbcMoveNum: 0,
				ftMoveNum: 0
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
			this.poolInfo = JSON.parse(decodeURIComponent(option.poolInfo));
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
				}
			},
			closeLP() {
				if(this.ftMoveNum == 0) {
					swal({
						title: 'error',
						text: '请选择撤出份额',
						icon: "error"
					})
					return;
				}
				this.$refs.popup2.open();
			},
			slideChange(e) {
				this.tbcMoveNum = (this.poolInfo.tbc_balance*this.poolInfo.ft_lp_balance*(e/100) / this.poolInfo.ft_lp_balance)/Math.pow(10,6);
				this.ftMoveNum = (this.poolInfo.ft_a_balance*this.poolInfo.ft_lp_balance*(e/100) / this.poolInfo.ft_lp_balance)/Math.pow(10,this.poolInfo.ftDecimal);
				console.log(e)
				if( 10 < e && e < 100 ) {
					this.ftMoveNum = Math.floor(this.ftMoveNum/2);
				}
				if(e == 100) {
					this.ftMoveNum = this.poolInfo.ft_a_balance/Math.pow(10,this.poolInfo.ftDecimal);
				}
				console.log(this.ftMoveNum)
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			async clickSupply() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_LP_CONSUME",
						nft_contract_address: this.poolInfo.poolContract,
						address: this.myAddress,
						ft_amount: this.ftMoveNum,
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					if(txid) {
						this.$refs.loading.close();
						this.$refs.popup2.close();
						swal({
							title: '移除成功',
							icon: "success",
						})
					}
					console.log(txid)
				} catch (error) {
					console.log(error)
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