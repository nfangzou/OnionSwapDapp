<template>
	<view class="mask">
		<view class="title">
			<view class="left">
			</view>
			<view class="center">
				选择币种
			</view>
			<view class="right" @tap="clickClose">
				<image src="../../static/OKEX.png" mode=""></image>
			</view>
		</view>
		<view class="inputBox">
			<image src="../../static/tel.png" mode=""></image>
			<input placeholder="请输入代币" type="text" />
			<image src="../../static/OKEX.png" mode=""></image>
		</view>
		<view class="tokenList">
			<view class="titleList">
				Token
			</view>
			<view class="list">
				<view class="listOne" v-for="(item, index) in tokenList" :key="index" @tap="clickNowCoin(item)">
					<image src="../../static/tel.png" mode=""></image>
					<view class="coinName">
						<view class="topCoin">
							{{item.name}}
						</view>
						<view class="bottomCoin">
							{{item.symbol}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script scoped="true">
	export default {
		props: {
			text: String
		},
		data() {
			return {
				tokenList: [
					{
						name: 'TBC',
						symbol: 'test_coin',
						address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
						chainId: 1,
						decimals: 18,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
					{
						name: 'QYZ',
						symbol: 'test_coin',
						address: '57d4a323dc923c680a3b38b78c217d592f75962b888a0c5b301e586fd0479d94',
						chainId: 1,
						decimals: 18,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
					{
						name: 'YM',
						symbol: 'test_coin',
						address: '1333e38f8c4bb05a96f823f14feefe30d3b34b82d0f66a5e4fcb31761dadf14d',
						chainId: 1,
						decimals: 18,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
				]
			};
		},
		methods: {
			clickClose() {
				this.$emit('clickClose', 0);
			},
			clickNowCoin(val) {
				this.$emit('clickBackInfo',val)
			}
		}
	};
</script>

<style lang="less" scoped>
	.mask {
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
		.inputBox{
			border-radius: 20rpx;
			background-color: rgb(242, 229, 214);
			padding: 20rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
			image{
				width: 50rpx;
				height: 50rpx;
			}
		}
		.tokenList{
			margin-top: 40rpx;
			.titleList{
				display: flex;
				color: #fff;
			}
			.list{
				margin-top: 20rpx;
				.listOne{
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					image{
						width: 60rpx;
						height: 60rpx;
					}
					.coinName{
						margin-left: 20rpx;
						.topCoin{
							font-size: 30rpx;
						}
						.bottomCoin{
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
</style>