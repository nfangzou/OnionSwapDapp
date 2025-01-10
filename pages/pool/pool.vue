<template>
	<view class="content">
		<back ref="child" :text="myAddress" :type="1" :classType="true" subheading="true" @getMsg="getMsg"></back>
		
		<view class="poolCenter">
			<view class="bannerBox">
				<view class="leftBox">
					<view class="topText">
						从LP赚取
					</view>
					<view class="bottomText">
						流动资金池
					</view>
				</view>
				<image class="rightImg" src="../../static/bannerBoxPic.png" mode=""></image>
			</view>
			<view class="positionsItem">
				<view class="positions">
					<view class="left">
						<view class="item" v-for="(item, index) in tabList" :key="index" :class="poolType==index+1?'poolHovers':''" @click="clickTab(index+1)">
							{{item}}
						</view>
					</view>
				</view>
				<view class="positions">
					<view class="searchBox" v-if="poolType==1">
						<image src="../../static/Search.png" mode=""></image>
						<input type="text" placeholder="all pools" />
						<image src="../../static/bottomIcon.png" mode=""></image>
					</view>
				</view>
				<view class="positions" v-if="poolType==2">
					<view class="right">
						<view class="item" @click="url('/pages/pool/poolCreate')">
							Import/Create pool
						</view>
						<view class="item" @click="url('/pages/pool/poolAdd')">
							Add Liquidity
						</view>
					</view>
				</view>
			</view>
			<view class="allPoll" v-if="poolType==1">
				<view class="poolBodyList">
					<view class="item" v-for="(item, index) in poolAllNowData" :key="index">
						<view class="navBody">
							<view class="logoPool">
								<view class="img">
									<image src="../../static/TBC.png" mode=""></image>
								</view>
								<view class="img2">
									<image src="/static/tel.png" mode=""></image>
								</view>
							</view>
							<view class="text">
								TBC/{{item.contractName}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								ft_a_balance
							</view>
							<view class="right">
								{{item.ft_a_balance/Math.pow(10, item.ftDecimal) | numStr}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								tbc_balance
							</view>
							<view class="right">
								{{item.tbc_balance/Math.pow(10, 6) | numStr}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								ft_lp_balance
							</view>
							<view class="right">
								{{item.ft_lp_balance/Math.pow(10, item.ftDecimal) | numStr}}
							</view>
						</view>
						<view class="btnList" @click="urlPool('/pages/pool/poolManage','all',item)">
							<view class="btn">
								View
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="allPoll" v-if="poolType==2">
				<view class="poolBodyList">
					<view class="item" v-for="(item, index) in poolUserNowData" :key="index">
						<view class="navBody">
							<view class="logoPool">
								<view class="img">
									<image src="../../static/TBC.png" mode=""></image>
								</view>
								<view class="img2">
									<image src="/static/tel.png" mode=""></image>
								</view>
							</view>
							<view class="text">
								TBC/{{item.contractName}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								ft_a_balance
							</view>  
							<view class="right">
								{{item.ft_a_balance/Math.pow(10,item.ftDecimal) | numStr}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								tbc_balance
							</view>
							<view class="right">
								{{item.tbc_balance/Math.pow(10,6) | numStr}}
							</view>
						</view>
						<view class="poolName">
							<view class="left">
								ft_lp_balance
							</view>
							<view class="right">
								{{item.ft_lp_balance/Math.pow(10,item.ftDecimal) | numStr}}
							</view>
						</view>
						<view class="btnList" @click="urlPool('/pages/pool/poolManage','my',item)">
							<view class="btn">
								管理
							</view>
						</view>
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
	import swal from 'sweetalert';
	import wLoading from "@/component/w-loading/w-loading.vue";
	import test from '../../abi/tbc_gethash.js'
	export default {
		components:{
			back,wLoading
		},
		data() {
			return {
				myAddress: '',
				poolType: 0,
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
				userLpCount: 0,
				poolData: [],
				tabList: ['ALL Pools', 'My Positions'],
				poolType:1,
				myPoolData: [],
				poolUserNowData: [],
				poolAllNowData: []
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
		filters: {
			numStr(num) {
			   // let inNumber = str.toString();
			   // let num=ethers.utils.formatUnits(inNumber);
			   if(parseInt(num) === parseFloat(num)){
					return parseInt(num)
			   }else{
					return Number(num).toFixed(6)
			   }
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
					// let time = setInterval(() => {
					// 	this.getAllPool();
					// 	this.getUserPool();
					// }, 20000)
					this.getAllPool();
					this.getUserPool();
				}
			},
			url(pathVal){
				uni.navigateTo({
				   url: pathVal
				})
			},
			getUserPool() {
				uni.request({
					url: this.localApi+'getMyPool',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						userAddress: this.myAddress,
						page: 1,
						limit: 20
					},
					success: (res) => {
						if(res.data.success) {
							console.log(res.data.msg.length)
							if(res.data.msg.length!=0){
								this.nowGetHash(res.data.msg)
								this.myPoolData = res.data.msg;
							}else{
								this.$refs.loading.close();
							}
							
						}
					}
				});
			},
			async nowGetHash(valData) {
				await valData.forEach(item => {
					let newHash = test(item.poolContract,this.myAddress,item.contractName).then(items => {
						this.getNowPersonPool(items);
					})
				})
			},
			getAllPool() {
				uni.request({
					url: this.localApi+'getPoolList',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						page: 1,
						limit: 20
					},
					success: (res) => {
						if(res.data.success) {
							res.data.msg.forEach(item => {
								this.getNowPool(item);
							})
						}
					}
				});
			},
			urlPool(pathVal, type, poolData) {
				let arrayString = JSON.stringify(poolData);
				uni.navigateTo({
				   url: pathVal+'?pageType='+type+'&poolInfo='+encodeURIComponent(arrayString)
				})
			},
			getNowPool(IDVal) {
				let newAllPool = [];
				uni.request({
					url: this.urlApi + 'ft/pool/nft/info/contract/id/'+IDVal.poolContract,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						this.$refs.loading.close();
						if(res.statusCode == 200) {
							newAllPool.push({
								"ft_lp_balance":res.data.ft_lp_balance,
								"ft_a_balance":res.data.ft_a_balance,
								"tbc_balance":res.data.tbc_balance,
								"contractName":IDVal.coinName1,
								"ftDecimal":IDVal.coinDecimal,
								"poolContract":IDVal.poolContract
							})
							this.poolAllNowData = this.poolAllNowData.concat(newAllPool);
						}
					}
				});
			},
			getNowPersonPool(valData) {
				let personNum = 0;
				let onloadData = [];
				uni.request({
					url: this.urlApi + 'ft/lp/unspent/by/script/hash'+valData[0].ftlpCodeHash,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						if(res.statusCode == 200) {
							res.data.ftUtxoList.forEach(item => {
								personNum += item.ftBalance;
							})
							onloadData.push({
								"ft_lp_balance":personNum,
								"ft_a_balance":(personNum/valData[0].ft_lp_amount)*valData[0].ft_a_amount,
								"tbc_balance":(personNum/valData[0].ft_lp_amount)*valData[0].tbc_amount,
								"contractName":valData[0].contractName,
								"ftDecimal":valData[0].ftDecimal,
								"poolContract":valData[0].poolContract
							})
							this.poolUserNowData =  this.poolUserNowData.concat(onloadData);
							this.$refs.loading.close();
						}
					}
				});
			},
			positions(){
				this.$refs.popup.open('center')
			},
			clickTab(val) {
				this.poolType = val;
				this.$refs.loading.open();
				if(val == 1) {
					this.poolAllNowData = [];
					this.getAllPool();
				} else{
					this.poolUserNowData = [];
					this.getUserPool();
				}
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
	@media all and (min-width: 700px) and (max-width: 2880px){
		.content {
			width: 100%;
			height: auto;
			padding-top: 120upx;
			// min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 50upx;
			.backTitle{
				margin: 38rpx 44rpx;
				image{
					width: 60rpx;
					height: 54rpx;
				}
			}
			.poolBodyList{
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				overflow: hidden;
				.item{
					box-sizing: border-box;
					width: 49%;
					padding: 28rpx;
					// margin:40rpx 0;
					display: inline-block;
					background-color: #fff;
					border-radius: 39rpx;
					color: #fff;
					margin-bottom: 30rpx;
					.navBody{
						padding: 15upx;
						display: flex;
						align-items: center;
						margin-bottom: 10upx;
						.logoPool{
							display: flex;
							align-items: center;
							margin-right: 28rpx;
							.img{
								width: 70upx;
								height: 70upx;
								z-index: 9;
								image{
									width: 100%;
									height: 100%;
								}
							}
							.img2{
								width: 70upx;
								height: 70upx;
								margin-left: 0;
								image{
									width: 100%;
									height: 100%;
								}
							}
						}
						.text{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 32rpx;
							color: #161616;
							font-weight: bold;
						}
					}
					.poolName{
						padding: 0 15upx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 20upx;
						.left{
							color: #666;
						}
						.right{
							color:#00D085;
						}
					}
					.btnList{
						display: flex;
						justify-content: space-around;
						align-items: center;
						margin-top: 50rpx;
						background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);
						border-radius: 39rpx;
						.btn{
							padding: 20rpx;
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
		.poolCenter{
			width: 70%;
			margin: 0 auto;
			padding: 30rpx;
			position: relative;
			.bannerBox{
				padding: 0 28rpx;
				display: flex;
				justify-content: space-between;
				background-image: url('/static/BannerBG.png');
				background-size: 120% 100%;
				background-position-x: -90upx;
				align-items: center;
				border-radius: 30upx;
				.leftBox{
					.topText{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 56rpx;
						color: #FFFFFF;
					}
					.bottomText{
						margin-top: 24rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 35rpx;
						color: #FFFFFF;
					}
				}
				.rightImg{
					width: 315rpx;
					height: 315rpx;
				}
			}
			.positionsItem{
				box-sizing: border-box;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.positions{
					width: 50%;
					box-sizing: border-box;
					border-radius: 30upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #fff;
					margin: 30rpx 0;
					.left{
						display: flex;
						align-items: center;
						box-sizing: border-box;
						.item{
							display: flex;
							align-items: center;
							font-size: 30upx;
							color: #525252;
							padding: 28rpx;
							border-radius: 30upx;
							margin-right: 30upx;
						}
						.item:nth-child{
							margin-right: 0upx;
						}
						.poolHovers{
							background-color: #fff;
							color: #161616;
						}
					}
					.right{
						position: absolute;
						top: 0;
						right: 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						box-sizing: border-box;
						.item{
							box-sizing: border-box;
							margin: 30rpx 20upx;
							display: flex;
							align-items: center;
							font-size: 24upx;
							color: #fff;
							padding: 30upx;
							background: linear-gradient(90deg, #AF6EFF 0%, #8D60FF 100%);
							border-radius: 15upx;
						}
					}
					.searchBox{
						position: absolute;
						top: 0;
						right: 0;
						width: 500upx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 86rpx;
						background-color: #fff;
						margin: 28rpx 0;
						padding: 0 28rpx;
						border-radius: 56rpx;
						image{
							width: 42rpx;
							height: 42rpx;
						}
						input{
							color: #000;
							padding:0 15upx;
							height: 100%;
							width: 100%;
						}
					}
				}
			}
			
		}
	}
	@media all and (min-width: 320px) and (max-width: 700px){
		.content {
			width: 100%;
			box-sizing: border-box;
			height: 1700rpx;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-top: 120upx;
			.backTitle{
				margin: 38rpx 44rpx;
				image{
					width: 60rpx;
					height: 54rpx;
				}
			}
			.poolBodyList{
				box-sizing: border-box;
				.item{
					padding: 28rpx;
					border-radius: 39rpx;
					color: #fff;
					overflow: hidden;
					background-color: #fff;
					margin-bottom: 30rpx;
					.navBody{
						padding: 15upx;
						display: flex;
						align-items: center;
						margin-bottom: 10upx;
						.logoPool{
							display: flex;
							align-items: center;
							margin-right: 28rpx;
							.img{
								width: 70upx;
								height: 70upx;
								z-index: 9;
								image{
									width: 100%;
									height: 100%;
								}
							}
							.img2{
								width: 70upx;
								height: 70upx;
								margin-left: 0;
								image{
									width: 100%;
									height: 100%;
								}
							}
						}
						.text{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 32rpx;
							color: #161616;
							font-weight: bold;
						}
					}
					.poolName{
						padding: 0 15upx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 20upx;
						.left{
							color: #666;
						}
						.right{
							color:#00D085;
						}
					}
					.btnList{
						display: flex;
						justify-content: space-around;
						align-items: center;
						margin-top: 50rpx;
						background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);
						border-radius: 39rpx;
						.btn{
							padding: 20rpx;
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
		.poolCenter{
			padding: 30rpx;
			.bannerBox{
				padding: 0 28rpx;
				display: flex;
				justify-content: space-between;
				background-image: url('/static/BannerBG.png');
				background-size: 100% 100%;
				align-items: center;
				.leftBox{
					.topText{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 56rpx;
						color: #FFFFFF;
					}
					.bottomText{
						margin-top: 24rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 35rpx;
						color: #FFFFFF;
					}
				}
				.rightImg{
					width: 315rpx;
					height: 315rpx;
				}
			}
			.positions{
				width: 100%;
				box-sizing: border-box;
				border-radius: 30upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #fff;
				.left{
					display: flex;
					align-items: center;
					box-sizing: border-box;
					margin: 30rpx 0;
					.item{
						display: flex;
						align-items: center;
						font-size: 30upx;
						color: #525252;
						padding: 28rpx;
						border-radius: 30upx;
						margin-right: 30upx;
					}
					.item:nth-child{
						margin-right: 0upx;
					}
					.poolHovers{
						background-color: #fff;
						color: #161616;
					}
				}
				.right{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					margin-bottom: 20upx;
					.item{
						box-sizing: border-box;
						width: 50%;
						margin: 0 20upx;
						display: flex;
						align-items: center;
						font-size: 24upx;
						color: #fff;
						padding: 30upx;
						background: linear-gradient(90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 15upx;
					}
				}
			}
			.searchBox{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 86rpx;
				background-color: #fff;
				margin: 28rpx 0;
				padding: 0 28rpx;
				border-radius: 56rpx;
				image{
					width: 42rpx;
					height: 42rpx;
				}
				input{
					color: #000;
					height: 100%;
					width: 80%;
				}
			}
		}
	}
	
</style>
