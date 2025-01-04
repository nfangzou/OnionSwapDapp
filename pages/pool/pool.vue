<template>
	<view class="content">
		<back ref="child" :text="myAddress" :type="1" :classType="true" subheading="true" @getMsg="getMsg"></back>
		<view class="positions">
			<view class="left">
				<view class="item">
					ALL Pools
				</view>
				<view class="item" @click="positions">
					My Positions
				</view>
			</view>
			<view class="right">
				<view class="item" @click="url('/pages/pool/poolAdd')">
					Import/Create pool
				</view>
				<view class="item">
					Add Liquidity
				</view>
			</view>
		</view>
		
		<view class="centerBox">
			<view class="loadIcon">
				<image @tap="loadClick" src="../../static/load.png" mode=""></image>
			</view>
			<view class="outLP">
				<view class="titleBox">
					<view class="one" style="margin-bottom: 10rpx;">
						流动性
					</view>
					<view class="two">
						{{Math.floor(lpNum*10000)/10000}} $
					</view>
				</view>
				<view class="infoBox">
					<view class="top1" style="display: flex;justify-content: left;">
						<text style="margin-right: 40rpx;">撤出份额</text>
						<text style="font-weight: bold;">{{sliderValue}} %</text>
					</view>
					<uv-slider v-model="sliderValue" @input="slideChange" step="5" backgroundColor="rgba(255, 255, 255, 0.4)" min="0" max="100"></uv-slider>
				</view>
				<view class="infoBox">
					<view class="top1">
						<text>WBNB</text>
						<text>{{(wbnbLpNum*lpNum*(sliderValue/100) / getTotalSupplyNum).toFixed(6)}}</text>
					</view>
					<view class="top1">
						<text>CPX</text>
						<text>{{(DawkoinLpNum*lpNum*(sliderValue/100) / getTotalSupplyNum).toFixed(6)}}</text>
					</view>
				</view>
				<view class="endingBox">
					流动池中的份额：{{Math.floor(lpNum/getTotalSupplyNum*1000000)/10000}}%
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
							<input v-model="selfSlip" @input="inputNum" placeholder="自定义" type="text" /><text style="margin-right: 20rpx;">%</text>
						</view>
					</view>
				</view>
				<view class="btnGo2">
					<view class="btn" v-if="!ApproveLP" @tap="clickApoveLP">
						授权LP代币
					</view>
					<view class="btn" @tap="closeLP" v-else>
						移除
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" background-color="#fff">
			打开弹窗
		</uni-popup>

		<w-loading text="" mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import {mapState,mapMutations,mapGetters} from 'vuex'
	import bignumberJS from "bignumber.js"
	import wLoading from "@/component/w-loading/w-loading.vue";
	export default {
		components:{
			back,wLoading
		},
		data() {
			return {
				myAddress: '',
				tabIndex: 0,
				wbnbBalanceNum: 0,
				DawkoinBalanceNum: 0,
				slipData: ['0.1', '0.5', '1.0'],
				slipCrrent: 0,
				selfSlip: '',
				toCoinNum: '',
				fromCoinNum: '',
				lpNum: 0,
				ApproveWbnb: false,
				ApproveDawkoin: false,
				lamount:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				sliderValue: 0,
				getTotalSupplyNum: 0,
				DawkoinLpNum: 0,
				wbnbLpNum: 0,
				ApproveLP: false,
				userLpCount: 0
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
				}
			},
			url(pathVal){
				uni.navigateTo({
				   url: pathVal
				})
			},
			positions(){
				this.$refs.popup.open('center')
			},
			clickTab(val) {
				this.tabIndex = val;
			},
			clickSlip(val) {
				this.slipCrrent = val;
			},
			slideChange(e) {
				// console.log(e)
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
			inputNum(e) {
				this.slipData.forEach((item, index) =>{
					if(parseFloat(item) == parseFloat(e.detail.value)) {
						this.slipCrrent = index;
					} else{
						this.slipCrrent = 3;
					}
				})
				if(parseInt(e.detail.value) >= 50) {
					this.selfSlip = 0;
					uni.showToast({
						title: '请输入有效的滑点比',
						icon: "none"
					})
				}
			},
			showChange(e) {
				if(e.detail.value == 0) {
					return ;
				}
				let nowValue = new bignumberJS(parseFloat(e.detail.value)).shiftedBy(18);
				let newNum = this.wbnbLpNum*nowValue/this.DawkoinLpNum;
				this.fromCoinNum = new bignumberJS(newNum).shiftedBy(-18).toNumber();
			},
			showTwoChange(e) {
				if(e.detail.value == 0) {
					return ;
				}
				let nowValue = new bignumberJS(parseFloat(e.detail.value)).shiftedBy(18);
				let newNum = this.DawkoinLpNum*nowValue/this.wbnbLpNum;
				this.toCoinNum = new bignumberJS(newNum).shiftedBy(-18).toNumber();
			},
			mobileFilter1(val){
				let inNumber = val.toString();
				let num=this.ethers.utils.formatUnits(inNumber);
				if(parseInt(num) === parseFloat(num)){
					return parseInt(num)
				}else{
					return Number(num)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		box-sizing: border-box;
		height: 1700rpx;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
		background-color: #000;
		.backTitle{
			margin: 38rpx 44rpx;
			image{
				width: 60rpx;
				height: 54rpx;
			}
		}
		.centerBox{
			margin: 40rpx 30rpx 0 30rpx;
			border: 2rpx solid #e5e5e5;
			border-radius: 20rpx;
			padding: 30rpx;
			.loadIcon{
				display: flex;
				justify-content: right;
				image{
					width: 32rpx;
					height: 32rpx;
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
						color: #000;
						font-size: 34rpx;
						font-weight: bold;
						background-color: #00DEA1;
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
						color: #000;
						font-weight: bold;
						font-size: 34rpx;
						background-color: #00DEA1;
						border-radius: 60rpx;
					}
				}
			}
			.outLP{
				margin-top: 27rpx;
				.titleBox{
					color: #fff;
					font-weight: bold;
					font-size: 36rpx;
				}
				.infoBox{
					margin-top: 30rpx;
					padding: 25rpx 16rpx;
					background-color: rgba(0, 222, 161, .4);
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
					color: #fff;
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
						color: #000;
						font-size: 36rpx;
						font-weight: bold;
						background-color: rgba(0, 222, 161, 1);
						border-radius: 50rpx;
					}
				}
			}
		}
	}
	.slideStyle{
		background-image: url('../../static/logo.png');
		background-size: 100% 100%;
		width: 60rpx;
		height: 60rpx;
	}
	.positions{
		box-sizing: border-box;
		margin: 0 30upx;
		border-radius: 30upx;
		// border: 2upx solid #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
		.left{
			width: 50%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			.item{
				display: flex;
				align-items: center;
				font-size: 24upx;
				color: #000;
				padding: 15upx;
				background-color: #fff;
				border-radius: 30upx;
				margin-right: 30upx;
			}
			.item:nth-child{
				margin-right: 0upx;
			}
		}
		.right{
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: end;
			.item{
				display: flex;
				align-items: center;
				font-size: 24upx;
				color: #000;
				padding: 15upx;
				background-color: #fff;
				border-radius: 30upx;
				margin-left: 30upx;
			}
			.item:nth-child{
				margin-left: 0upx;
			}
		}
	}
</style>
