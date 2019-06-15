
<template>
	<div id="FirstIn">

		 <keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				code: this.$route.query.code
			}
		},
		computed:{
			getNewConfig(){
				return this.$store.state.config
			}
		},
	  watch:{
			'$route'(to,from){
        if(to.name!="My"&&to.name!="FriendGroupTeam"&&to.name!="TravelDetails"&&to.name!="UserPage"&&to.name!="OtherPage"&&to.name!="Gallery"&&to.name!="StrategyDetail"&&to.name!="ShoppingMallDetails"){
					if(Object.keys(this.$store.state.config).length!=0){
			      this.commonConfig()
			    }else{
			      this.setCommonInfo()
			    }
				}

			},
			getNewConfig(a){
				if(Object.keys(a).length!=0){
					if(this.$route.name!="My"&&this.$route.name!="FriendGroupTeam"&&this.$route.name!="TravelDetails"&&this.$route.name!="UserPage"&&this.$route.name!="OtherPage"&&this.$route.name!="Gallery"&&this.$route.name!="StrategyDetail"&&this.$route.name!="ShoppingMallDetails"){
						this.commonConfig()
					}
					// this.commonConfig()
				}
			}
		},
		created() {

			this.init()


		},
		methods: {

			init() {

				if(!this.code) { //没有code
						if(window.localStorage.getItem('sessionId')) { //有session
							this.getUserDetails()
							//调userDetails验证是否过期
						} else { //无session重定向
							let redirect_uri = encodeURIComponent(location.href)
							window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7aa09a791955330d&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect")

						}



				} else {//有code
                   console.log(this.code)//code
									 // return;
					if(window.localStorage.getItem('sessionId')) {//是否有session
						               //调起userDetails  验证是否过期
						               this.getUserDetails()
						               this.login(this.code)//用code换取session
					} else {//
						this.login(this.code)//用code换取session

					}


				}

			},
			getConfig(){
				let url = window.location.href.split('#')[0]
				this.$Api.Common.WxConfig({
					url: url
				}).then((res) => {
					let config = { ...JSON.parse(res.q.config)
					}

					this.$store.dispatch("changeConfigData",config)

				})

			},
			login(code) {
        let obj={
					openId:code

				}
				console.log(obj)
				this.$Api.Common.wxLogin(obj).then((res)=>{
					console.log(res)
					if(res.q.s==0){
						window.localStorage.setItem('sessionId', res.s)
						this.$Api.Common.setSessionId(res.s)
						this.getUserDetails()
					}else{

					}
				})
			},
			getUserDetails(){ //过期就重定向
				this.$Api.UserPage.UserDetails({a:0}).then((res)=>{
					if(res.q.s==0){
						let user={...res.q.user}
						if(user.imagePath == undefined) {
							user.imagePath = require("../assets/common/placeholder_200x200.png")
						}

						this.$store.state.bindNumber = res.q.user.isBindMobile == 1? true:false;
						this.$store.dispatch("changeUserObj",user)

						this.getConfig()
					}else{
						window.localStorage.removeItem('sessionId')
						this.$Api.Common.setSessionId(null)
						let redirect_uri = encodeURIComponent(location.href)
						window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7aa09a791955330d&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect")
					}


				})



			}
		}
	}
</script>

<style lang="scss">
	#FirstIn {
		height: 100%;
			background: rgba(255, 255, 255, 1);
	}
	#container {
		.amap-logo {
			display: none !important;
		}
		.amap-copyright {
			display: none !important;
		}
		.amap-lib-infowindow-title {
			a {
				display: none;
			}
		}
		.amap-markers {
			.amap-marker {
				.amap-icon {
					img {
						height: 100%;
					}
				}
			}
		}
		.amap-marker-label{
			background: red;
			width: .4rem;
			height: .4rem;
			border-radius:50%;
			border: none;
			text-align: center;
			line-height: .25rem;
			color: #FFFFFF;
		}
		.amap_lib_placeSearch_poi{
			display: none;
		}
		/*.amap-geolocation-con{
			top: 12rem !important;
			left: .3rem !important;
		}*/
		.amap-geo{
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
		}
	}
</style>
