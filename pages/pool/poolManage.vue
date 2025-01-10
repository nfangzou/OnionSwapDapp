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
					{{pageType == 'my'?'Manage liquidity':'View liquidity'}} 
				</view>
			</view>
			<view class="poolInfo">
				<view class="infoLeft">
					<view class="coinD">
						<image src="/static/tel.png" mode=""></image>
						<image src="/static/tel.png" mode=""></image>
					</view>
					<view class="coinNmaeD">
						{{'TBC/'+pooInfoArr.contractName}}
					</view>
				</view>
				<view class="infoRight">
					<view class="oneRight">
						<view class="top">
							池子ID：
						</view>
						<view class="bottom">
							{{pooInfoArr.poolContract}}
						</view>
					</view>
				</view>
			</view>
			<view class="coinSetBody">
				<view class="bigTilte">
					概述
				</view>
				<view class="smallTitle">
					我的流动价值：{{pooInfoArr.ft_lp_balance/Math.pow(10, pooInfoArr.ftDecimal)}}
				</view>
				<view class="boxInfo">
					<view class="infoCoinNum" style="margin-bottom: 20rpx;">
						<view class="numLeft">
							<image src="/static/tel.png" mode=""></image>
							<text>TBC</text>
						</view>
						<view class="numRight">
							{{pooInfoArr.tbc_balance/Math.pow(10, 6)}}
						</view>
					</view>
					<view class="infoCoinNum">
						<view class="numLeft">
							<image src="/static/tel.png" mode=""></image>
							<text>{{pooInfoArr.contractName}}</text>
						</view>
						<view class="numRight">
							{{pooInfoArr.ft_a_balance/Math.pow(10, pooInfoArr.ftDecimal)}}
						</view>
					</view>
				</view>
				<view class="btnBox" v-if="pageType == 'my'">
					<view class="btnOne" @tap="clickGo('add')">
						增加
					</view>
					<view class="btnTwo" @tap="clickGo('remove')">
						移除
					</view>
				</view>
				
			</view>
			<view class="titleEnd">
				配对讯息
			</view>
			<view class="coinSetBody">
				<view class="bigTilte">
					概述
				</view>
				<view class="smallTitle">
					我的流动价值：  0
				</view>
				<view class="boxInfo">
					<view class="infoCoinNum" style="margin-bottom: 20rpx;">
						<view class="numLeft">
							<image src="/static/tel.png" mode=""></image>
							<text>TBC</text>
						</view>
						<view class="numRight">
							0
						</view>
					</view>
					<view class="infoCoinNum">
						<view class="numLeft">
							<image src="/static/tel.png" mode=""></image>
							<text>TBC</text>
						</view>
						<view class="numRight">
							0
						</view>
					</view>
				</view>
			</view>
		</view>
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
				pageType: '',
				contractID: '',
				pooInfoArr: []
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
			this.Init();
			this.pageType = option.pageType;
			this.pooInfoArr = JSON.parse(decodeURIComponent(option.poolInfo));
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
				}
			},
			clickGo(Type) {
				if(Type == 'add') {
					uni.navigateTo({
					   url: './poolAdd'+'?poolContract='+this.pooInfoArr.poolContract+'&coinDecimal='+this.pooInfoArr.ftDecimal
					})
				} else{
					let newRemoveInfo = encodeURIComponent(JSON.stringify(this.pooInfoArr))
					uni.navigateTo({
					   url: './poolRemove'+'?poolInfo='+newRemoveInfo
					})
				}
				
			},
			backGo() {
				uni.navigateBack();
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
		.centerBox {
			max-width: 750rpx;
			border-radius: 20rpx;
			padding: 30rpx;
			.poolTitle{
				display: flex;
				align-items: center;
				margin: 26rpx 0 56rpx 0;
				.back{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.title{
					margin-left: 20rpx;
					color: 35rpx;
				}
			}
			.poolInfo{
				margin-top: 30rpx;
				.infoLeft{
					display: flex;
					align-items: center;
					.coinD{
						display: flex;
						align-items: center;
						image{
							width: 70rpx;
							height: 70rpx;
							border-radius: 50%;
							margin-right: 2rpx;
						}
					}
					.coinNmaeD{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 600;
						font-size: 42rpx;
						color: #161616;
						margin-left: 20rpx;
					}
				}
				.infoRight{
					margin-top: 20rpx;
					padding-left: 20rpx;
					.oneRight{
						margin-top: 20rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 400;
						font-size: 21rpx;
						color: #525252;
						.bottom{
							word-wrap: break-word;
						}
					}
				}
			}
			.titleEnd{
				font-size: 30rpx;
				color: #000;
				font-weight: bold;
				margin-top: 50rpx;
			}
			.coinSetBody{
				background-color: #fff;
				border-radius: 20rpx;
				padding: 40rpx 30rpx;
				margin-top: 20rpx;
				.bigTilte{
					color: #000;
					font-size: 30rpx;
					margin-bottom: 30rpx;
					font-weight: bold;
				}
				.smallTitle{
					color: gray;
					font-size: 30rpx;
					margin-bottom: 30rpx;
				}
				.boxInfo{
					background-color: #F5F9FF;
					border-radius: 20rpx;
					padding: 30rpx 40rpx;
					.infoCoinNum{
						display: flex;
						justify-content: space-between;
						.numLeft{
							display: flex;
							align-items: center;
							color: #000;
							font-weight: bold;
							image{
								width: 40rpx;
								height: 40rpx;
								margin-right: 10rpx;
							}
						}
						.numRight{
							font-weight: bold;
							color: #3367D6;
						}
					}
				}
				.btnBox{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.btnOne{
						width: 48%;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						margin: 30rpx 0;
						border-radius: 40rpx;
						color: #fff;
					}
					.btnTwo{
						width: 48%;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);
						color: #fff;
						border-radius: 40rpx;
						opacity: 0.75;
					}
				}
			}
		}
	}
</style>