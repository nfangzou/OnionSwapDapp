<template>
	<uv-tabbar :value="JSON.parse(current)" :customStyle="{'height':'120rpx'}" :activeColor="'#000'">
		<uv-tabbar-item v-for="(item, index) in list" :key="index" :text="$t(item.text)" @click="change($event, item.path)" :name="index" :customStyle="{'margin-top':'20rpx'}">
			<template v-slot:active-icon>
				<image class="icon" :src="item.selectedIconPath"></image>
			</template>
			<template v-slot:inactive-icon>
				<image class="icon" :src="item.iconPath"></image>
			</template>
		</uv-tabbar-item>
	</uv-tabbar>
</template>

<script>
	export default {
		props: {
			current: String
		},
		data() {
			return {
				list: [{
						text: 'home1',
						iconPath: "../../static/tabbar/1.png",
						selectedIconPath: "../../static/tabbar/1-1.png",
						path: "/pages/index/index",
					},
					{
						text: 'home2',
						iconPath: "../../static/tabbar/2.png",
						selectedIconPath: "../../static/tabbar/2-1.png",
						path: "/pages/chainPage/chainPage",
					},
					{
						text: 'home3',
						iconPath: "../../static/tabbar/3.png",
						selectedIconPath: "../../static/tabbar/3-1.png",
						path: "/pages/musicPage/musicPage",
					},
					{
						text: 'home4',
						iconPath: "../../static/tabbar/4.png",
						selectedIconPath: "../../static/tabbar/4-1.png",
						path: "/pages/NFT/NFT",
					},
					{
						text: 'home5',
						iconPath: "../../static/tabbar/5.png",
						selectedIconPath: "../../static/tabbar/5-1.png",
						path: "/pages/myPage/myPage",
					}
				]
			};
		},
		onLoad() {
			
		},
		methods: {
			change(e,path) {
				uni.navigateTo({
				   url: path
				})
			}
		}
	};
</script>

<style scoped>
	.icon {
		width: 58rpx;
		height: 58rpx;
	}
</style>