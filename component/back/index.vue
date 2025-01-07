<template>
	<view class="goBacke" :class="classType?'goBackeBg':'goBackeBg2'">
		<view class="headLeft">
			<view class="appStyleIcon staus1">
				<image @tap="clickLeftShow" src="/static/nav.png" mode=""></image>
			</view>
			<view class="logoHead">
				<image src="../../static/logo.png" mode=""></image>
			</view>
			<view class="listTab staus2">
				<view class="tabOne" :style="{color: type == index?'#fff':''}" v-for="(item, index) in tabData" :key="index" @tap="clickTap(item.path)">
					{{item.text}}
				</view>
			</view>
		</view>
		<view class="subheading" v-if="subheading">
			<view class="backe">
				<text v-if="getWallet">{{getWallet | plusXing}}</text>
				<text v-else @tap="clickConnect">连接钱包</text>
			</view>
			<view class="backe" style="margin-left: 30rpx;" @tap="sendMsg">
				<text>语言</text>
			</view>
		</view>
		
		<uni-popup ref="popup2" type="left" :mask-click="true">
			<view class="insureBoxTwo">
				<view class="closeStyle">
					<view class="leftText">
						OnionSwap
					</view>
				</view>
				<view class="btnList">
					<view class="iconListTwo" v-for="(item, index) in tabData" :key="index" @tap="clickTap(item.path)">
						<image class="iconImg" src="../../static/tel.png" mode=""></image>
						<text>{{item.text}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="right" :mask-click="true">
			<view class="insureBoxOne">
				<view class="closeStyle1">
					<view class="leftText">
						切换语言
					</view>
					<view class="rightIcon" @tap="colse1">
						<image src="../../static/close.png" mode=""></image>
					</view>
				</view>
				<view class="btnList1" style="margin-top: 0;">
					<view class="iconList" @tap="changeLang('zh-CN', 0)">
						<text>中文</text>
					</view>
					<view class="iconList" @tap="changeLang('en-US', 1)">
						<text>English</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
		data() {
			return {
				vip:1,
				index: 0,
				tabData: [{
						text: 'Swap',
						path: "/pages/index/index",
					},
					{
						text: 'Pool',
						path: "/pages/pool/pool",
					},
					{
						text: 'Stake',
						path: "/pages/stake/stake",
					},
					{
						text: 'Earn',
						path: "/pages/earn/earn",
					},
					{
						text: 'Stats',
						path: "/pages/stats/stats",
					}
				],
				tabCurrent: 0
			}
		},
		filters: {
			plusXing(str) {
			 if (str.length == 0){
			  return "";
			 }
			 var len = str.length - 4 - 18;
			 var xing = '';
			 for (var i = 0; i < 4; i++) {
			  xing += '*';
			 }
			 return str.substring(0, 6) + xing + str.substring(str.length - 4);
			}
		},
		computed: {
			...mapGetters(['getWallet','getCoin'])
		},
		created() {
			this.index = uni.getStorageSync("indexVal") === '' || uni.getStorageSync("indexVal") == undefined?1:uni.getStorageSync("indexVal");
		},
		props:['text','type','classType','subheading'],
		methods: {
			clickTap(pathVal) {
				this.$refs.popup2.close();
				uni.navigateTo({
				   url: pathVal
				})
			},
			clickLeftShow() {
				this.$refs.popup2.open();
			},
			async clickConnect() {
				await window.Turing.connect();
				let wert = await window.Turing.getAddress();
				this.myAddress = wert.tbcAddress;
				this.$store.commit('setWallet', wert.tbcAddress);
				uni.setStorageSync('walletAddress',wert.tbcAddress);
			},
			changeLang(lang, indexA) {
				this.index = indexA;
				uni.setStorageSync("language",lang);
				uni.setStorageSync("indexVal",this.index);
				this._i18n.locale = lang;
				this.$refs.popup.close();
			},
			sendMsg() {
				this.$refs.popup.open();
			},
			colse1() {
				this.$refs.popup.close();
			}
		}
	}
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.goBacke{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24upx 34rpx;
			width: 100%;
			box-sizing: border-box;
			z-index: 7;
			position: relative;
			.headLeft{
				display: flex;
				align-items: center;
				width: 80%;
				.logoHead{
					width: 83rpx;
					height: 83rpx;
					margin-right: 100rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.staus1{
					display: none !important;
				}
				.listTab{
					display: flex;
					justify-content: space-between;
					.tabOne{
						color: gray;
						margin-right: 100rpx;
					}
				}
			}
			
			.backe{
				display: flex;
				align-items: center;
				padding: 20rpx;
				border: 2rpx solid #fff;
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
			.text{
				display: flex;
				justify-content: center;
				margin-left: -40upx;
				width: 100%;
				font-size: 42upx;
				font-family: SimHei;
				font-weight: 400;
			}
			.subheading{
				font-size: 28upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #fff;
				display: flex;
				align-items: center;
				image{
					width: 55rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
		}
		.goBackeBg{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
		.goBackeBg2{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #000;
			}
		}
		
		.insureBoxOne{
			width: 659upx;
			border-radius: 20rpx;
			background-color: #161616;
			padding: 40rpx;
			margin-top: 160rpx;
			.closeStyle1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 50rpx;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #ffffff;
				}
				.rightIcon{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.btnList1{
				.marginB{
					margin-bottom: 50rpx;
				}
				.iconList{
					display: flex;
					align-items: center;
					border: 2rpx solid rgba(255, 255, 255, .1);
					padding: 20rpx 40rpx;
					border-radius: 10rpx;
					margin-bottom: 30rpx;
					image{
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei, Microsoft YaHei;
						font-weight: bold;
						color: #ffffff;
					}
				}
			}
		}
	}
	@media all and (min-width: 320px) and (max-width: 700px){
		.goBacke{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24upx 34rpx;
			width: 100%;
			box-sizing: border-box;
			z-index: 7;
			position: relative;
			.headLeft{
				display: flex;
				align-items: center;
				width: 80%;
				.logoHead{
					width: 83rpx;
					height: 83rpx;
					margin-left: 20rpx;
					display: flex;
					align-items: center;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
				.staus2{
					display: none !important;
				}
				.appStyleIcon{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
				.listTab{
					display: flex;
					justify-content: space-between;
					.tabOne{
						color: gray;
						margin-right: 100rpx;
					}
				}
			}
			
			.backe{
				display: flex;
				align-items: center;
				padding: 10rpx;
				border: 2rpx solid #fff;
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
			.text{
				display: flex;
				justify-content: center;
				margin-left: -40upx;
				width: 100%;
				font-size: 42upx;
				font-family: SimHei;
				font-weight: 400;
			}
			.subheading{
				font-size: 28upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #fff;
				display: flex;
				align-items: center;
				image{
					width: 55rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
		}
		.goBackeBg{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
		.goBackeBg2{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #000;
			}
		}
		.insureBoxOne{
			width: 380upx;
			border-radius: 20rpx;
			background-color: #161616;
			padding: 40rpx;
			margin-top: 120rpx;
			.closeStyle1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 50rpx;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #ffffff;
				}
				.rightIcon{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.btnList1{
				.marginB{
					margin-bottom: 30rpx;
				}
				.iconList{
					display: flex;
					align-items: center;
					border: 2rpx solid rgba(255, 255, 255, .1);
					padding: 20rpx 40rpx;
					border-radius: 10rpx;
					margin-bottom: 20rpx;
					image{
						width: 20rpx;
						height: 20rpx;
						margin-right: 20rpx;
					}
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei, Microsoft YaHei;
						font-weight: bold;
						color: #ffffff;
					}
				}
			}
		}
		.insureBoxTwo{
			width: 400upx;
			height: 100%;
			padding: 42rpx 0;
			border-radius: 20rpx;
			background-color: #161616;
			padding: 40rpx 40rpx 80rpx 40rpx;
			.closeStyle{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #ffffff;
				}
				.rightIcon{
					width: 50rpx;
					height: 50rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.btnList{
				margin-top: 80rpx;
				.iconListTwo{
					display: flex;
					align-items: center;
					margin-top: 50rpx;
					border: 2rpx solid rgba(255, 255, 255, .1);
					padding: 40rpx;
					border-radius: 10rpx;
					.iconImg{
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei, Microsoft YaHei;
						font-weight: bold;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>