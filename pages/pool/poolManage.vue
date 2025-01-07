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
					Add liquidity
				</view>
			</view>
			<view class="poolInfo">
				<view class="infoLeft">
					<view class="coinD">
						<image src="/static/tel.png" mode=""></image>
						<image src="/static/tel.png" mode=""></image>
					</view>
					<view class="coinNmaeD">
						TBC/test
					</view>
				</view>
				<view class="infoRight">
					<view class="oneRight">
						<view class="top">
							池子ID：
						</view>
						<view class="bottom">
							wefwefgwegsdgrgergerger
						</view>
					</view>
					<view class="oneRight">
						<view class="top">
							池子ID：
						</view>
						<view class="bottom">
							wefwefgwegsdgrgergerger
						</view>
					</view>
				</view>
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
				<view class="btnOne" @tap="clickGo('add')">
					增加
				</view>
				<view class="btnTwo" @tap="clickGo('remove')">
					移除
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
					this.getCoinBalance(this.fromCur,'from')
				}
			},
			clickGo() {
				
			},
			backGo() {
				uni.navigateBack();
			},
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
		background-color: rgba(242, 229, 213);
		padding-bottom: 30upx;
		.centerBox {
			max-width: 750rpx;
			border-radius: 20rpx;
			padding: 30rpx;
			.poolTitle{
				display: flex;
				align-items: center;
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
				display: flex;
				justify-content: space-between;
				.infoLeft{
					display: flex;
					align-items: center;
					.coinD{
						display: flex;
						align-items: center;
						image{
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
							margin-right: 2rpx;
						}
					}
					.coinNmaeD{
						color: #000;
						font-size: 40rpx;
						margin-left: 20rpx;
					}
				}
				.infoRight{
					.oneRight{
						margin-bottom: 10rpx;
						color: #000;
						font-size: 20rpx;
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
					background-color: rgb(242, 229, 213);
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
							color: rgb(213, 133, 41);
						}
					}
				}
				.btnOne{
					width: 100%;
					height: 90rpx;
					line-height: 90rpx;
					text-align: center;
					background: linear-gradient(90deg,#e38453,#d9925a,#db9e56);
					margin: 30rpx 0;
					border-radius: 40rpx;
					color: #fff;
				}
				.btnTwo{
					width: 100%;
					height: 90rpx;
					line-height: 90rpx;
					text-align: center;
					background: linear-gradient(90deg,#e38453,#d9925a,#db9e56);
					color: #fff;
					border-radius: 40rpx;
					opacity: 0.75;
				}
			}
		}
	}
</style>