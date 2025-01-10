<template>
	<view class="mask">
		<view class="title">
			<view class="left">
			</view>
			<view class="center">
				选择币种
			</view>
			<view class="right" @tap="clickClose">
				<image src="../../static/close.png" mode=""></image>
			</view>
		</view>
		<view class="coinListBox">
			<view class="inputBox">
				<image src="../../static/Search.png" mode=""></image>
				<input v-model="newAddress" @input="getProCoinList" placeholder="请输入代币地址" type="text" />
				<image src="../../static/delIcon.png" mode=""></image>
			</view>
			<view class="tokenList">
				<view class="titleList">
					Tokens
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
	</view>
</template>

<script scoped="true">
	export default {
		props: {
			text: String
		},
		data() {
			return {
				newAddress: '',
				tokenList: [
					{
						name: 'TBC',
						symbol: 'test_coin',
						address: '',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
					{
						name: 'QYZ',
						symbol: 'test_coin',
						address: '57d4a323dc923c680a3b38b78c217d592f75962b888a0c5b301e586fd0479d94',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
					{
						name: 'YM',
						symbol: 'test_coin',
						address: '1333e38f8c4bb05a96f823f14feefe30d3b34b82d0f66a5e4fcb31761dadf14d',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					},
					{
						name: 'ONI',
						symbol: 'Onion',
						address: '53129030dfed4779b914af8962319b549230aa017103bbf660d940c6b7f20b66',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png',
					}
				]
			};
		},
		methods: {
			clickClose() {
				this.$emit('clickClose', 0);
			},
			clickNowCoin(val) {
				this.$emit('clickBackInfo',val)
			},
			getProCoinList(e) {
				this.newAddress = e.detail.value;
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/'+e.detail.value,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						this.tokenList.push({
							name: res.data.ftName,
							symbol: res.data.ftSymbol,
							address: res.data.ftContractId,
							chainId: 0,
							decimals: res.data.ftDecimal,
							balance: 0,
							logoURI: res.data.ftIconUrl,
						})
					}
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.mask {
		width: 610rpx;
		height: 818rpx;
		border-radius: 20rpx;
		background-color: #fff;
		.title{
			display: flex;
			justify-content: space-between;
			background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
			padding: 30rpx 28rpx;
			border-radius: 20rpx 20rpx 0 0;
			align-items: center;
			.left{
				width: 50rpx;
			}
			.center{
				font-family: Noto Sans SC, Noto Sans SC;
				font-weight: 500;
				font-size: 30rpx;
				color: #FFFFFF;
			}
			.right{
				image{
					width: 56rpx;
					height: 56rpx;
				}
			}
		}
		.coinListBox{
			padding: 28rpx;
			.inputBox{
				height: 84rpx;
				border-radius: 56px 56px 56px 56px;
				background: rgba(115,40,228,0.1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 28rpx;
				input{
					width: 80%;
					height: 100%;
				}
				image{
					width: 42rpx;
					height: 42rpx;
				}
			}
			.tokenList{
				margin-top: 40rpx;
				padding-left: 20rpx;
				.titleList{
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 500;
					font-size: 28rpx;
					color: #161616;
				}
				.list{
					margin-top: 28rpx;
					.listOne{
						margin-bottom: 28rpx;
						display: flex;
						align-items: center;
						image{
							width: 70rpx;
							height: 70rpx;
						}
						.coinName{
							margin-left: 20rpx;
							.topCoin{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 30rpx;
								color: #525252;
							}
							.bottomCoin{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 24rpx;
								color: #A8A8A8;
							}
						}
					}
				}
			}
		}
		
	}
</style>