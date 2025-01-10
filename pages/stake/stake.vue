<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="2" :classType="true" subheading="true" @getMsg="getMsg"></back>
		<view style="display: flex;justify-content: center;color: #000;margin-top: 100rpx;">
			开发中....
		</view>
		
		
		
		
		<w-loading text="" mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import wLoading from "@/component/w-loading/w-loading.vue";
	export default{
		components:{
			back,wLoading
		},
		data() {
			return {
				myAddress: 'ewgverdsgversdg',
			}
		},
	}
</script>

<style lang="less" scoped>
	.content{
		width: 100%;
		height: 1700rpx;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
		padding-top: 120upx;
	}
</style>