<template>
	<view class="goBacke" :class="classType?'goBackeBg':'goBackeBg2'">
		<view class="headLeft">
			<view class="logoHead">
				<image src="../../static/logo.png" mode=""></image>
			</view>
			<view class="listTab">
				<view class="tabOne" :style="{color: type == index?'#fff':''}" v-for="(item, index) in tabData" :key="index" @tap="clickTap(item.path)">
					{{item.text}}
				</view>
			</view>
		</view>
		<view class="subheading" v-if="subheading">
			<view class="backe" style="border: 2rpx solid gray;">
				<text v-if="text">{{text | plusXing}}</text>
				<text v-else @tap="clickConnect">连接钱包</text>
			</view>
			<view class="backe" style="margin-left: 30rpx;" @tap="sendMsg">
				<text>{{_i18n.locale == 'zh-CN'?'中文':'English'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vip:1,
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
		created() {
			console.log(this.type)
		},
		props:['text','type','classType','subheading'],
		methods: {
			clickTap(pathVal) {
				uni.navigateTo({
				   url: pathVal
				})
			},
			clickConnect() {
				this.$emit('connectWallet');
			},
			sendMsg() {
				this.$emit('getMsg');
			}
		}
	}
</script>

<style lang="less" scoped>
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
			image{
				width: 100upx;
				height: 100upx;
				margin-right: 23rpx;
			}
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
</style>