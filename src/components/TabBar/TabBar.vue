<template>
	<div id="tabbar">
		<div class="item" v-for="(v,i) in tabItem">
			<div v-if="i!=2" @click="go(v)">
				<img v-if="v.num == 1" :src="v.normal" />
				<img v-else :src="v.active" />
			</div>
			<div v-if="i==2" @click="go(v)">

				<img v-if="v.num == 1" :src="v.normal" />
				<img v-else :src="v.active" />

			</div>

		</div>
	</div>
</template>

<script>
	export default {
		created() {
			for(let i = 0; i < this.tabItem.length; i++) {
				if(this.$route.name == this.tabItem[i].name) {

					this.tabItem[i].num = 2
				} else {
					this.tabItem[i].num = 1
				}

			}
		},
		data() {
			return {
				tabItem: [{
						name: "Home",
						normal: require("../../assets/bottom.png"),
						active: require("../../assets/tab_btn_home_pre@2x.png"),
						num: 2
					},
					{
						name: "Location",
						normal: require("../../assets/tab_btn_location_nor@2x.png"),
						active: require("../../assets/tab_btn_location_pre@2x.png"),
						num: 1
					},
					{
						name: "SendTravels",
						normal: require("../../assets/tab_btn_pen@2x.png"),
						active: require("../../assets/tab_btn_pen@2x.png"),
						num: 1
					},
					{
						name: "UserPage",
						normal: require("../../assets/tab_btn_book_nor@2x.png"),
						active: require("../../assets/tab_btn_book_pre@2x.png"),
						num: 1
					},
					{
						name: "My",
						normal: require("../../assets/tab_btn_my_nor@2x.png"),
						active: require("../../assets/tab_btn_my_pre@2x.png"),
						num: 1
					}
				],
			}
		},
		methods: {
			go(item) {
				console.log(item)

         if(this.$store.state.bindNumber){
					 for(let i = 0; i < this.tabItem.length; i++) {

 						this.tabItem[i].num = 1
 					}
 					item.num = 2
 					if(item.name=="SendTravels"){
 						this.$router.push({
 						name: item.name
 					})
 					}else{
 						this.$router.replace({
 						name: item.name
 					})

 					}
				}else{
					 if(this.$store.state.bindNumber!=null){
						this.$router.push({
						name: "BindNumber"
					})
					 }
				}



			},
		},
		watch: {
			'$route'(to,from){
				if(this.$store.state.bindNumber){
					for(let i = 0; i < this.tabItem.length; i++) {
						if(to.name == this.tabItem[i].name) {

							this.tabItem[i].num = 2
						} else {
							this.tabItem[i].num = 1
						}

					}
				}

			},
			tabChange(a) {
				console.log(1111)
			}
		},
		computed: {
			tabChange() {

			},
		},
	}
</script>

<style scoped="scoped" lang="less">
	#tabbar {
		background: #FFFFFF;
		width: 100%;
		height: 0.98rem;
		position: fixed;
		bottom: 0;
		display: flex;
		z-index: 20000;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		.item {
			width: 25%;
			height: 100%;
			text-align: center;
			position: relative;
			/*padding-top: 0.16rem;*/
			img {
				width: 0.5rem;
				height: 0.5rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		.item:nth-of-type(3) {
			width: 25%;
			padding: 0;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.middle {
			width: 30%;
			background: #FADC56;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
