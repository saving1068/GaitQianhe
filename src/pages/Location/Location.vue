
<template>
	<div class="warp">
		<div class="top_image">
			<img v-if="goPicture" :src="goPicture"/>
			<img v-else src="../../assets/user_bg_top@2x.png"/>
			<div class="top_name" @click="goToSeachPlace">
				<font>{{city}}</font>
				<div class="top_name_icon"></div>
			</div>
			<div class="top_images" @click="goToGallery">
				<font>精选图库</font>
				<div class="top_images_icon">

				</div>
			</div>
		</div>
		<div class="maps">
			<div class="maps_title">
				<div class="mid">
					<p class="left"></p><p class="font">旅行地图</p><p class="right"></p>
				</div>
			</div>
			<div class="maps_val" @click="goToNavigation">
				<div class="maps_val_bg">
					<div class="maps_font_left" v-if="spotList.length !=0">
						<van-swipe :autoplay="3000" :show-indicators="false">
						  <van-swipe-item v-for="(v,i) in spotList" :key="v.id">
						  	<div class="maps_name">
								{{v.name}}
							</div>
							<div class="maps_actial">
								{{v.ccount}}篇攻略，{{v.wbcount}}篇游记提及
							</div>
						  </van-swipe-item>
						</van-swipe>
					</div>
					<div class="maps_font_left" style="padding: 0;text-align: center;font-size: .36rem; line-height: 2.45rem;" v-else>
						该地区暂无景点
					</div>
					<div class="maps_shu"></div>
					<div class="maps_font_right">
						<div class="maps_font_right_icon"></div>
						<div class="maps_font_right_val">
							雷达搜周边
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="strategy" v-if="list.length!=0">
			<div class="strategy_title">
				<div class="mid">
					<p class="left"></p><p class="font">自由行攻略</p><p class="right"></p>
				</div>
			</div>
			<li v-for="(v,i) in list" @click="goArticleDetails(v)">
				<div class="strategy_summey">
					<p class="strategy_summey_title">{{v.title}}</p>
					<p class="strategy_summey_icon">攻略</p>
					<div class="strategy_bottom">
					<!--<div class="userImage">
						<img v-if="v.authorImgPath" :src="v.authorImgPath"/>
						<img v-else src="../../assets/touxiang40.png"/>-->
					<!--</div>-->
					<!--<div class="userName">又是剪刀手</div>-->
						<div class="strategy_num">
							<div class="watch_num">
								<div class="watch_num_icon"></div>
								<font v-if="v.browseNum<10000">{{v.browseNum}}</font>
								<font v-else>1W+</font>
							</div>
							<div class="commit">
								<div class="commit_num_icon"></div>
								<font v-if="v.praiseNum<10000">{{v.commentNum}}</font>
								<font v-else>1W+</font>
							</div>
							<div class="like">
								<div class="like_num_icon"></div>
								<font v-if="v.favoriteNum<10000">{{v.favoriteNum}}</font>
								<font v-else>1W+</font>
							</div>
						</div>
					</div>
				</div>
				<div class="strategy_images">
					<img :src="v.imagePath"/>
				</div>
			</li>
			<div  class="strategy_more" v-if="list.length==0">
				<div style="text-align: center;" @click="getMore('list')">
					<font>该景点暂无攻略</font>
				</div>
			</div>
			<div v-else class="strategy_more" @click="goToStrategy">
				<div style="margin: 0 auto; width: 1.5rem;" @click="getMore('list')">
					<font>查看更多</font>
					<p></p>
				</div>
			</div>
		</div>
		<div v-if="WbList.length!=0" style="width: 100%;height: .2rem;background: #EDEDED;"></div>
		<div class="hot" v-if="WbList.length!=0">
			<div class="hot_title">
				<div class="mid">
					<p class="left"></p><p class="font">热门游记</p><p class="right"></p>
				</div>
			</div>
			<li v-for="(v,i) in WbList" @click="goToTravelDetails(v)">
				<div class="hot_item_img">
					<img :src="v.imagePath"/>
				</div>
				<div class="hot_item_summery">
					{{v.title}}
				</div>
				<div class="strategy_bottom">
					<div class="userImage">
						<img v-if="v.authorPath" :src="v.authorPath"/>
						<img v-else src="../../assets/touxiang1.png"/>
					</div>
					<div class="userName">{{v.authorName}}</div>
					<div class="strategy_num">
						<div class="watch_num">
							<div class="watch_num_icon"></div>
							<font v-if="v.browseNum<10000">{{v.browseNum}}</font>
							<font v-else>1W+</font>
						</div>
						<div class="commit">
							<div class="commit_num_icon"></div>
							<font v-if="v.commentNum<10000">{{v.commentNum}}</font>
							<font v-else>1W+</font>
						</div>
						<div class="like">
							<div class="like_num_icon"></div>
							<font v-if="v.likeNum<10000">{{v.likeNum}}</font>
							<font v-else>1W+</font>
						</div>
					</div>
				</div>
			</li>
			<div class="strategy_more" v-if="WbList.length == 0">
				<div style="text-align: center;" >
					<font>该景点暂无游记</font>
				</div>
			</div>
			<div class="strategy_more" v-else>
				<div style="margin: 0 auto; width: 1.5rem;" @click="goHomeSearch">
					<font>查看更多</font>
					<p></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		created(){
			console.log(this.$route.query.cityName)
			if(this.$route.query.cityName){
				this.city = this.$route.query.cityName.replace('市',"")
				this.$Api.Address.CityId(this.$route.query.cityName).then((res)=>{//获取城市ID
					console.log(res)
					this.cityId = res.q.id
					this.getArticleList()
					this.getWbList()
					this.getScenicSpot(this.cityId)//景点
					this.getCityGallery(this.cityId)
				})
			}else{
				this.Lbsmap()
			}

		},
		mounted(){

		},
		data(){
			return{
				list:[],
				WbList:[],
				Wbpa:1,
				listPa:1,
				locationDetail:"",
				city:"定位失败",
				cityId:0,
				wbTotal:0,
				listTotal:0,
				spotList:[],
				ifWbMore:"查看更多",
				goPicture:"",
			}
		},
		methods:{
			getCityGallery(id){
				let obj = {
					a:1,
					type:1,
					regionId:id,
					pa:1,
					li:1
				}
				this.$Api.Address.CityGallery(obj).then((res)=>{
					this.goPicture = res.q.list[0].accessUrl
					console.log(this.goPicture)
				})
			},
			Lbsmap() {
				this.$loading("加载中...")
				let that = this;
				var map = new AMap.Map('container', {
					resizeEnable: true,
					zoom: 1,
					//			        center:['113.240303','23.131037']
				});
				map.plugin(['AMap.Geolocation', 'AMap.PlaceSearch'], function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: 2000,
						// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
						 showButton: true,        //显示定位按钮，默认：true
						buttonOffset: new AMap.Pixel(10, 20),
						//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						zoomToAccuracy: true,
						//  定位按钮的排放位置,  RB表示右下
						buttonPosition: 'RB'
					})

					geolocation.getCurrentPosition()
					AMap.event.addListener(geolocation, 'complete', onComplete)
					AMap.event.addListener(geolocation, 'error', onError)

					function onComplete(data) {
						console.log(data)
//						alert(data.formattedAddress)
						that.locationDetail = data.formattedAddress
//						that.city = data.addressComponent.city
						that.city = that.$route.query.cityName? that.$route.query.cityName.replace('市',""):data.addressComponent.city.replace('市',"")//城市名
						// data是具体的定位信息
						console.log(that.$route.query.cityName,"fdasgdsgdfg")
						if(that.$route.query.cityName){
							console.log(that.$route.query.cityName)
							that.$Api.Address.CityId(that.$route.query.cityName).then((res)=>{//获取城市ID
								console.log(res)
								that.cityId = res.q.id
								that.getArticleList()
								that.getWbList()
								that.getCityGallery(that.cityId)
								that.getScenicSpot(that.cityId)//景点
							})
						}else{
							that.$Api.Address.CityId(data.addressComponent.city).then((res)=>{//获取城市ID
								console.log(res)
								that.cityId = res.q.id
								that.getCityGallery(that.cityId)
								that.getArticleList()
								that.getWbList()
								that.getScenicSpot(that.cityId)//景点
							})
						}
						setTimeout(()=>{

							that.$loading.clear()

						},500)

					}

					function onError(data) {
						// 定位出错
						that.$loading.clear()
						alert("定位失败")
						alert(data)
					}
				})
			},
			goArticleDetails(item){
				this.$router.push({
					name:"StrategyDetail",
					query:{
						id:item.id
					}
				})
			},
			goHomeSearch(){
				this.$router.push({
					name:"HomeSearch",
					query:{
						cityId:this.cityId,
						place:this.city//城市名
					}
				})
			},
			getMore(font){
				if(font == "list"){
					this.getArticleList()
				}else{
					this.Wbpa++
					this.getWbList()
				}
			},
			getArticleList(){
				let obj = {
					a:2,
					li:3,
					pa:this.listPa,
					regionId:this.cityId
				}
				this.$Api.Address.ArticleList(obj).then((res)=>{
					console.log(res)
					this.listTotal = res.q.total
					if(obj.pa>1){
						for(var i=0;i<res.q.articles.length;i++){
							this.list.push(res.q.articles[i])
						}
					}else{
						this.list = res.q.articles
					}

				})
			},
			getWbList(){
				let obj = {
					a:1,
					li:3,
					pa:this.Wbpa,
					id:this.cityId
				}
				this.$Api.UserPage.getWbList(obj).then((res)=>{
					this.wbTotal = res.q.total
					if(obj.pa>1){
						for(var i=0;i<res.q.wbs.length;i++){
							this.WbList.push(res.q.wbs[i])
						}
					}else{
						this.WbList = res.q.wbs
					}
					if(res.q.wbs.length==0){
						this.ifWbMore = "到底了!"
					}
				})
			},
			goToGallery(){
				this.$router.push({
					name:"Gallery",
					query:{
						id:this.cityId,
						city:this.city//城市名
					}
				})
			},
			goToStrategy(){
				this.$router.push({
					name:"Strategy",
					query:{
						regionId:this.cityId,//城市Id
						city:this.city//城市名
					}
				})
			},
			goToSeachPlace(){
				this.$router.push({
					name:"SeachPlace",
					query:{
						name:'Location'
					}
				})
			},
			goToTravelDetails(item){
				this.$router.push({
					name:'TravelDetails',
					query:{
						id:item.id
					}
				})
			},
			getScenicSpot(id){
				this.$Api.Address.ScenicSpot(id).then((res)=>{//景点
					console.log(res)
					this.spotList = res.q.list
				})
			},
			goToTravesList(){
//				this.$router.push({
//					name:"TravelsList"
//				})
			},
			goToNavigation(){
				console.log()
				this.$router.push({
					name:"Navigation"
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
.warp{
	padding-bottom: .98rem;
	background: #FFFFFF;
}
	img{
		width: 100%;
		height: 100%;
	}
	.top_image{
		width: 100%;
		height: 3.4rem;
		position: relative;
		.top_name{
			position: absolute;
			bottom: .33rem;
			left: .23rem;
			font-size:0.4rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(255,255,255,1);
			font{
				padding-right: .17rem;
			}
			.top_name_icon{
				float: right;
				width:0.24rem;
				height:0.24rem;
				border-radius:0rem;
				background-image: url(../../assets/location_btn_drop@2x.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin-top: .2rem;
			}
		}
		.top_images{
			position: absolute;
			bottom: .31rem;
			right: .24rem;
			font-size:0.28rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(255,255,255,1);
			font{
				padding-right: .17rem;
			}
			.top_images_icon{
				width:0.12rem;
				height:0.22rem;
				background-image: url(../../assets/location_btn_array@2x.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin-top: .1rem;
				float: right;
			}
		}
	}
	.maps_title{
		width: 100%;
		/*margin-top: 0.45rem;*/
		position: relative;
		height: 0.9rem;
		/*margin-bottom: 0.45rem;*/
		.mid {
			/*width: 2rem;*/
			/*margin: auto;*/
			overflow: hidden;
			font-size: 0.3rem;
			position: absolute;
			transform: translate(-50%,-50%);
			top:50%;left:50%;
			p{
				float: left;
			}
			.font{
				padding: 0 .24rem;
			}
			.left {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_left@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*left: -1.03rem;*/
				/*top: 0.2rem;*/
			}
			.right {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_end@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*right: -1.03rem;*/
				/*top: 0.2rem;*/
			}
		}
	}
	.maps_val{
		width: 100%;
		height: 4.6rem;
		position: relative;
		background: url(../../assets/location_bg_map@2x.png) no-repeat;
		background-size: 100%;
		.maps_val_bg{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 6.88rem;
			height: 2.45rem;
			background: #FFFFFF;
			box-shadow:0.01rem 0.01rem 0.2rem 0.01rem rgba(0,0,0,0.79);
			border-radius: 0.06rem;
			overflow: hidden;
			.maps_font_left{
				float: left;
				padding: .72rem .68rem;
				width: 65%;
				.maps_name{
					font-size:0.36rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					width: 3.18rem;
					overflow: hidden;
				    text-overflow:ellipsis;
				    white-space:nowrap
				}
				.maps_actial{
					font-size:0.24rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
					padding-top: .28rem;
					width: 3.18rem;
				}
			}
			.maps_shu{
				float: left;
				width:0.02rem;
				height:1.06rem;
				background:rgba(0,0,0,.2);
				margin-top: .72rem;
			}
			.maps_font_right{
				float: left;
				padding: 0 .56rem;
				.maps_font_right_icon{
					width:0.7rem;
					height:0.7rem;
					background: url(../../assets/location_icon_radar@2x.png) no-repeat;
					background-size: 100%;
					margin: .72rem auto 0.15rem;
				}
				.maps_font_right_val{
					font-size:0.22rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(26,26,26,1);
				}
			}
		}
	}
	.strategy_title{
		width: 100%;
		position: relative;
		height: .98rem;
		border-bottom: 0.01rem solid #CCCCCC;
		padding: .28rem 0;
		.mid {
			/*width: 2rem;*/
			/*margin: auto;*/
			overflow: hidden;
			font-size: 0.3rem;
			position: absolute;
			transform: translate(-50%,-50%);
			top:50%;left:50%;
			p{
				float: left;
			}
			.font{
				padding: 0 .24rem;
			}
			.left {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_left@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*left: -1.03rem;*/
				/*top: 0.2rem;*/
			}
			.right {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_end@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*right: -1.03rem;*/
				/*top: 0.2rem;*/
			}
		}
	}
	.strategy{
		li{
			padding: 0 .25rem .22rem;
			overflow: hidden;
			border-bottom: 0.01rem solid #CCCCCC;
			.strategy_summey{
				width:4rem;
				font-size:0.3rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				padding-top: .3rem;
				padding-right: .28rem;
				float: left;
				.strategy_summey_title{
					 overflow: hidden;
					  text-overflow: ellipsis;
					  display: -webkit-box;
					  -webkit-line-clamp: 2;
					  width: 3.94rem;
					  height: .9rem;
					  -webkit-box-orient: vertical;
				}
				.strategy_summey_icon{
					margin-top:.17rem ;
					display: inline-block;
					text-align: center;
					font-size: 20px;
					padding: 0 25px;
					background: rgba(250,220,86,1);
					color:rgba(102,102,102,1);
					border-radius:25px;
					transform: scale(.5) translate(-50%,-50%);
				}
			}
			.strategy_images{
				width:2.8rem;
				height:2rem;
				float: left;
				background: salmon;
				margin-top: .2rem;
			}
			.strategy_bottom{
				.userImage{
					width:0.4rem;
					height:0.4rem;
					border-radius:50%;

				}
				.userName{
					font-size:0.26rem;
					width: 3.16rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					padding-left: .12rem;
				}
				.strategy_num{
					/*display: flex;*/
					/*justify-content: space-between;*/
					width: 3.8rem;
					overflow: hidden;
					padding-top: .3rem;
				}
				.watch_num{
					float: left;
					/*width: 1rem;*/
					/*display: flex;*/
					/*justify-content:space-between;*/
					padding-right:.25rem ;
					.watch_num_icon{
						width:0.25rem;
						height:0.2rem;
						background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
						background-size: 100% 100%;
						margin-top: .15rem;
						float: left;
					}
					font{
						padding-left: .1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
				.commit{
					float: left;
					/*width: 1rem;*/
					padding-right:.25rem ;

					/*display: flex;*/
					/*justify-content:space-between;*/
					.commit_num_icon{
						float: left;
						width:0.25rem;
						height:0.25rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100% 100%;
						margin-top: .15rem;
					}
					font{
						padding-left: .1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
						margin-bottom: .1rem;
					}
				}
				.like{
					padding-right:.25rem ;
					float: left;
					/*width: 1rem;*/
					/*display: flex;*/
					/*justify-content:space-between;*/
					.like_num_icon{
						float: left;
						width:0.25rem;
						height:0.25rem;
						background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						margin-top: .12rem;
					}
					font{
						padding-left: .1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
			}
		}
		.strategy_more{
			line-height: 1.02rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(116,116,116,1);
			text-align: center;
			p{
				float: right;
				width:0.09rem;
				height:0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .44rem;
			}
		}
	}
	.hot{
		.hot_title{
			width: 100%;
			position: relative;
			height: .98rem;
			padding: .28rem 0;
			margin-bottom: .2rem;
			.mid {
			/*width: 2rem;*/
			/*margin: auto;*/
			overflow: hidden;
			font-size: 0.3rem;
			position: absolute;
			transform: translate(-50%,-50%);
			top:50%;left:50%;
			p{
				float: left;
			}
			.font{
				padding: 0 .24rem;
			}
			.left {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_left@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*left: -1.03rem;*/
				/*top: 0.2rem;*/
			}
			.right {
				width: 0.73rem;
				height: 0.03rem;
				background: url(../../assets/common_img_title_end@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .2rem;
				/*position: absolute;*/
				/*right: -1.03rem;*/
				/*top: 0.2rem;*/
			}
		}
		}
		li{
			padding: 0 .24rem .65rem;
			.hot_item_img{
				width: 100%;
				height: 3rem;
			}
			.hot_item_summery{
				padding-top: .27rem;
				font-size:0.28rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
			.strategy_bottom{
				width: 100%;
				display: flex;

				padding-top: .4rem;

				.userImage{
					width:0.4rem;
					height:0.4rem;
					border-radius:50%;
					overflow: hidden;
					img{
						vertical-align: initial;
					}
				}
				.userName{
					font-size:0.26rem;
					width: 3.16rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					padding-left: .12rem;
				}
				.strategy_num{
					display: flex;
					justify-content: space-between;
					width: 3.8rem;
					align-items: center;
					/*line-height: .4rem;*/
				}
				.watch_num{
					/*width: 1rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.watch_num_icon{
						width:0.25rem;
						height:0.2rem;
						background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .12rem;*/
					}
					font{
						padding-left: 0.1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
				.commit{
					/*width: .8rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.commit_num_icon{
						width:0.25rem;
						height:0.25rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .08rem;*/
					}
					font{
						padding-left: 0.1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
				.like{
					/*width: .8rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.like_num_icon{
						width:0.25rem;
						height:0.25rem;
						background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .08rem;*/
					}
					font{
						padding-left: 0.1rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
			}
		}
		.strategy_more{
			line-height: 1.02rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(116,116,116,1);
			text-align: center;
			p{
				float: right;
				width:0.09rem;
				height:0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .44rem;
			}
		}
	}
</style>
