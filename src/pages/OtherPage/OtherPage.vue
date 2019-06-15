<template>
	<div :class="['warp',imgMask?'hidden':'']" style="height: 100%;">
		<div class="top_image">
			<div class="share" @click="goToActivity">
				<div class="share_icon">

				</div>
				<div class="share_font">
					活动
				</div>
				<div class="share_num">
					({{user.groupTotal}})
				</div>
			</div>

			<div class="content_bg" ref="content">
				<img class="background" src="../../assets/user_bg_top@2x.png" />

				<div class="content" style="background: #FFFFFF;">

					<div v-if="user.imagePath" class="user_imgae" :style="[{'background':'url('+user.imagePath+')'},{'background-size':'100% 100%'}]">
						<!-- <img v-if="user.imagePath" :src="user.imagePath" id="avatar" />
						<img v-else src="../../assets/notpage.png" /> -->
					</div>
					<div class="user_name">
						{{user.name}}
					</div>
					<div class="introduce">
						{{user.sign}}
					</div>

					<div class="footprint">
						<div id="container" ref="container">

						</div>
						<!--<div @click="goToTrip" class="footprint_icon"></div>-->
						<div class="footprint_bg">
							<div class="footprint_num">
								{{foot}}
							</div>
							<div class="footprint_shu"></div>
							<div class="footprint_font">
								我的足迹
							</div>
						</div>
					</div>
					<div class="font">
						{{message}}
					</div>
					<div class="down">
						<div class="flag_icon">
							<div class="country_icon" v-for="(v,i) in natFlags" :style="[{'left':`${i%10*-.3}rem`},{'z-index':i}]">
								<img  :src="flagImgUrl+v+flagImg"/>
							</div>
						</div>
						<div class="down_btn"  v-if="!downLoadFlag">
							<div class="down_icon" @click="downLoad">

							</div>
							<font style="color: #999999;font-size:.24rem;padding-left: 0.06rem;line-height: .34rem;">保存图片</font>
						</div>
					</div>

				</div>

			</div>

		<div class="travel_list">
	      <van-list v-model="loading" @load="onLoad" :finished="finished" :loading-text="loading_text">
	        <li v-for="(v,i) in list" @click="goToTravelDetails(v)">
	        	<div class="right_box">
	        		<div class="right_box_icon"></div>
	        		<p class="right_box_num">{{v.likeNum}}</p>
	        	</div>
	          <img :src="v.imagePath" />
	          <div class="item_bg">
	            <p>{{v.title}}</p>
	            <div class="city">
	              <div class='city_heng'></div>
	              <div class="city_font">{{v.sites}}</div>
	              <div class='city_heng'></div>
	            </div>
	          </div>
	        </li>
	      </van-list>
	    </div>
	    <div class="bottom_btn">
	    	<div class="bottom_btn_item" @click="share">
	    		<div class="bottom_btn_icon"></div>
	    		<p v-if="user.shareNum">{{user.shareNum}}</p>
	    		<p v-else>0</p>
	    	</div>
	    	<div class="bottom_btn_item" @click="goToHome">
	    		<div class="home"></div>
	    		<p>首页</p>
	    	</div>
	    </div>
		</div>

		<div class="mask" id="Img" v-show="imgMask" @click="hide"><!--合成图片-->
	    <div class="midBox">
	      <img :src="dataURL" @click.stop="" />

	    </div>
	    <div class="delete" @click.stop="hide" v-if="!maskFlag">
	      <i></i>
	    </div>
	    <div class="topMask" @click.stop="maskFlag=false" v-if="maskFlag">
	      <div class="box">
	        <div class="maskIcon">

	        </div>
	        <p>长按可以保存图片哦</p>
	      </div>

	    </div>
	  </div>

	</div>
</template>

<script>
	export default {
		created() {
			console.log(this.flagImgUrl)
			this.UserDetails(this.$route.query.id)
//			this.getWbList(this.$route.query.id)
//			this.getWbfootprintInfo({a: 2,id: this.$route.query.id})
			this.getUserFootprint()
			this.getUserFootprintFlag()
		},
		mounted() {
			this.Lbsmap()

		},
		data() {
			return {
				flagImgUrl:this.$Api.UserPage.imgUrl,//旗图片前序
				flagImg:".png",
				natFlags:[],
				list: [],
				user: {},
				listTotal: 0,
				loading: false,
				finished: false,
				page: 1,
				loading_text: "努力加载中",
				dataURL: "",
				imgMask: false,
				imgObj: {},
				downLoadFlag: false,
				foot: [],
				footList: [],
				message:"",
				footFlag:[],
				timer:null,
				maskFlag:false,
				flagArr:[],
			}
		},
		methods: {
			getConfig() {

				let that=this;
				let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=OtherPage&shareId=" + this.$store.state.Home.user.id +"&id="+this.$route.query.id;


					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
						timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
						nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
						signature: this.$store.state.config.signature, // 必填，签名
						jsApiList: ["chooseImage", "updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
					});


				wx.ready(function() { //需在用户可能点击分享按钮前就先调用
					if(wx.onMenuShareAppMessage){
						wx.onMenuShareAppMessage({
			        title:  that.user.name+" 的个人主页", // 分享标题
			        desc: '步履千行', // 分享描述
			        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
			        type: 'link', // 分享类型,music、video或link，不填默认为link
			        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			        success: function() {

								that.shareSuccess()
			          // 用户点击了分享后执行的回调函数
			        }
			      })
					}else{
						wx.updateAppMessageShareData({
			        title: that.user.name+" 的个人主页", // 分享标题
							  desc: '步履千行', // 分享描述
			        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							success: function (res) {
								console.log(res)
		          // 设置成功
		        } });
					}





		    });

			},
			shareSuccess(){
          this.$Api.Common.ShareTask({a:9,id:that.user.id}).then((res)=>{
						console.log(res)
						if(res.q.s==0){
							this.$toast("分享成功","success")
						}
					})

			},
			hide() {
				this.imgMask = false
        this.maskFlag=false
			},
			goToTravelDetails(item){
				this.$router.push({
					name:'TravelDetails',
					query:{
						id:item.id
					}
				})
			},
			share(){
         		this.$share("分享给更多好友")
			},
			goToHome(){
				this.$router.replace({name:"Home"})

			},
			Lbsmap() {
				let that = this;
				var map = new AMap.Map('container', {
					resizeEnable: true,
					zoom: 5,
					//			        center:['113.240303','23.131037']
				});
				map.plugin(['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Geocoder'], function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: 3000,
						// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
						buttonOffset: new AMap.Pixel(10, 20),
						//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						zoomToAccuracy: false,
						//  定位按钮的排放位置,  RB表示右下
						buttonPosition: 'RB'
					})
					var geocoder = new AMap.Geocoder({
						// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
						city: '全国',
					})
					geolocation.getCurrentPosition()
					AMap.event.addListener(geolocation, 'complete', onComplete)
					AMap.event.addListener(geolocation, 'error', onError)

					function onComplete(data) {
						for(let i=0;i<that.footList.length;i++){
							var icon = new AMap.Icon({
								image:that.footFlag[i],
								size: new AMap.Size(18,18),
							});
							that.flagArr.push(icon)
						}
						// data是具体的定位信息
//						that.footList.push(data.formattedAddress)
						//						console.log(that.footList,"地图加载数组")
						//						alert(that.footList)
						for(let i = 0; i < that.footList.length; i++) {
							console.log(that.footList[i])
							if(that.footList[i].status==1){
								var address = that.footList[i].region;
								geocoder.getLocation(address, function(status, result) {
									if(status === 'complete' && result.geocodes.length) {
										var marker;
										marker = new AMap.Marker({
											icon: that.flagArr[i],
											position: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
											offset: new AMap.Pixel(-12, -12),
											zIndex: 101,
											map: map
										});
									} else {
										console.log(JSON.stringify(result))
									}
								});
							}else{
										var marker;
										marker = new AMap.Marker({
											icon: that.flagArr[i],
											position: [that.footList[i].lon, that.footList[i].lat],
											offset: new AMap.Pixel(-12, -12),
											zIndex: 101,
											map: map
										});
							}

						}
					}

					function onError(data) {
						// 定位出错
						//						alert("定位失败")
					}
				})
			},
			downLoad() {
				this.$loading("加载中")
				this.downLoadFlag = true
				let that = this



					html2canvas(this.$refs.content, {
						backgroundColor: null,
						allowTaint: false,
						useCORS: true,
						onrendered: function(canvas){
							console.log(canvas)
							console.log(canvas.toDataURL())
							let dataURL = canvas.toDataURL("image/png");
							console.log(dataURL,"url")
							that.dataURL = dataURL;
							// alert(dataURL)
							that.$loading.clear()
							that.maskFlag = true
							window.scrollTo(0, 0)
							that.imgMask = true

							that.downLoadFlag = false

							that.timer = setTimeout(() => {
								that.maskFlag = false
							}, 2000)　　　　　
　　　　　　　　}
					})


			},
			getWbfootprintInfo({
				a,
				ta,
				pa,
				li
			}) { //足迹
				this.$Api.UserPage.getWbfootprintInfo({
					a,
					ta,
					pa,
					li
				}).then((res) => {
					//					console.log(res)
					this.foot = res.q.list
					for(var i = 0; i < res.q.list.length; i++) {
						this.footList.push(res.q.list[i].list[0].region)
					}
					//										console.log(this.footList,"足迹数组")
				})
			},
			getUserFootprintFlag(){
				let obj = {
					a:2,
					id:this.$route.query.id
				}
				this.$Api.UserPage.UserFootprintFlag(obj).then((res)=>{
					this.foot = res.q.total;
					this.natFlags = res.q.natFlags;
					for(var i = 0; i < res.q.list.length; i++) {
						this.footFlag.push(res.q.list[i].iamgeUrl)
						this.footList.push(res.q.list[i]);
					}
				})
			},
			getUserFootprint(){
				let obj = {
					a:2,
					id:this.$route.query.id
				}
				this.$Api.UserPage.UserFootprint(obj).then((res)=>{
					this.message = res.q.content
				})
			},
			onLoad() {
				setTimeout(() => {
					var num = null
						var obj = {
							a: 4,
							Sk: this.$route.query.id,
							pa: this.page
						}
					this.$Api.UserPage.getWbList(obj).then((res) => {
						console.log(res)
						if(res.q.s==0){
							this.page++
							num = res.q.total
							if(this.list.length >= num) {
								this.finished = true;
								this.loading_text = '到达底线'
							}
							for(let i = 0; i < res.q.wbs.length; i++) {
								this.list.push(res.q.wbs[i]);
							}
							this.loading = false;
						}
					})
					
					
				}, 500);
			},
			async UserDetails(userId) {
				var obj = {
					a: 2,
					id: userId
				}
				this.$Api.UserPage.UserDetails(obj).then((res) => {
					console.log(res)
					this.user = { ...res.q.user
					};
					this.getConfig()
				})
			},

			goToActivity() {
				this.$router.push({
					name: "Activity",
					query: {
						userId: this.$route.query.id
					}
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.hidden {
		overflow: hidden;
	}

	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 30000;
		.topMask{
      width: 100%;
      height: 100%;
      position: absolute;
      z-index:30002;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
      .box{
      width: 2.75rem;
      height: 2.75rem;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;

        .maskIcon{
          width: 1.04rem;
          height: 1.78rem;
          background: url('../../assets/common_icon_click@3x.png') no-repeat;
          background-size: 100%;
           margin: auto;

        }
        p{
          color: #ffffff;
          font-size: 0.26rem;
          text-align: center;
          margin-top: 0.2rem;

        }
      }

    }
    .delete{
      position: absolute;
      right: 0.3rem;
      top: 0.3rem;
      width: 0.33rem;
      height:0.33rem;
      background: #ffffff;
      z-index: 30001;
      border-radius: 50%;
      padding: 0.3rem;
      i{
       width: 0.33rem;
       height:0.33rem;
       background: url('../../assets/my/common_btn_close2@3x.png') no-repeat;
       background-size: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;


      }
    }
		.midBox {
        height: 100%;

        box-sizing: border-box;
        background: black;
        position: relative;

        img {
            width: 100%;
            height: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom:0;
            margin: auto;


        }

    }
	}

	img {
		width: 100%;
		height: 100%;
	}

	.content {
		border-radius: 0.36rem 0.36rem 0 0;
		padding-bottom: 0.3rem;
		box-sizing: border-box;
		position: relative;
		// bottom: 0.84rem;
		z-index: 30;
		.user_imgae {
			width: 1.2rem;
			height: 1.2rem;
			border-radius: .6rem;
			// background-size: contain;
			position: absolute;
			z-index: 99;
			top: -0.6rem;
			left: 50%;
			transform: translateX(-50%);
			// overflow: hidden;
		}
	}
	.bottom_btn{
				width: 100%;
				height: .98rem;
				position: fixed;
				bottom: 0;
				background: #FFFFFF;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.bottom_btn_item{
					.home{
					width: .5rem;
					height: .5rem;
					background: url(../../assets/shop_btn_home@2x.png) no-repeat;
					background-size: 100% 100%;
					}
					.bottom_btn_icon{
						width: .5rem;
						height: .5rem;
						background: url(../../assets/home/home_btn_share@3x.png) no-repeat ;
						background-size: 100% 100%;
					}
					p{
						text-align: center;
						font-size:.2rem;
						font-family:PingFang-SC-Regular;
						font-weight:400;
						color:rgba(102,102,102,1);
					}
				}
			}
	.top_image {
		width: 100%;
		// height: 3rem;
		position: relative;
		// padding-top:1.75rem;
		padding-bottom: .98rem;
		.share {
			width: 2rem;
			height: 0.7rem;
			background: rgba(0, 0, 0, .5);
			position: absolute;
			z-index: 999;
			right: 0;
			top: 0.25rem;
			border-radius: .35rem 0 0 .35rem;
			display: flex;
			font-size: 0.26rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			justify-content: space-around;
			align-items: center;
			color: rgba(255, 255, 255, 1);
			padding: 0 .1rem;
			.share_icon {
				width: 0.21rem;
				height: 0.3rem;
				background-image: url(../../assets/location_icon_fire@2x.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
		}
		.content_bg {
			position: relative;
			border-radius: 0.36rem 0.36rem 0 0;
			background: #FFFFFF;
			width: 100%;
			padding-top: 1.75rem;
			// top: -0.5rem;
			// padding-bottom: 0.98rem;
			box-sizing: border-box;
			.background {
				width: 100%;
				height: 3rem;
				position: absolute;
				top: 0;
			}
			.user_name {
				font-size: 0.34rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				text-align: center;
				padding-top: 0.74rem;
			}
			.introduce {
				/*个人简介*/
				font-size: 0.24rem;
				color: #333333;
				text-align: center;
				padding: 0.4rem 0.55rem;
				line-height: 0.4rem;
			}
			.footprint {
				/*足迹*/
				height: 4.4rem;
				position: relative;
				.footprint_icon {
					position: absolute;
					width: 0.6rem;
					height: 0.6rem;
					background-image: url("../../assets/user_btn_foot@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					bottom: 0.37rem;
					right: 0.24rem;
				}
				.footprint_bg {
					padding: 0.1rem 0;
					background: #F8D447;
					/*min-width:2.28rem;*/
					overflow: hidden;
					box-sizing: border-box;
					position: absolute;
					top: 0;
					left: 0.24rem;
					line-height: 0.5rem;
					.footprint_num {
						float: left;
						font-size: 0.36rem;
						font-family: PingFang-SC-Regular;
						padding: 0 0.2rem;
					}
					.footprint_shu {
						width: 0.02rem;
						height: 0.5rem;
						background: rgba(155, 117, 50, 1);
						float: left;
					}
					.footprint_font {
						font-size: 0.28rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						padding: 0 0.2rem;
						float: left;
					}
				}
			}
			.font {
				font-size: 0.22rem;
				font-family: PingFang-SC-Regular;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				padding: 0.42rem 0.24rem 0.46rem;
			}
			.down {

				display: flex;
				padding: 0 0.25rem 0.2rem 0.32rem;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.flag_icon{
					display: flex;
					position: relative;
					width:7.68rem;
					 flex-wrap: wrap;
					.country_icon {
						width: 0.64rem;
						height: 0.64rem;
						border-radius: 0.32rem;
						background: url(../../assets/placeholder_64x64.png) no-repeat;
						background-size: 100% 100%;
						position: relative;
						img{
							width: 100%;
							height: 100%;
							border-radius: 0.32rem;
						}
					}
				}
				.down_btn{
					position: absolute;
					right: 0.25rem;
					top: 50%;
					margin-bottom: -50%;
				}
				.down_icon {
					width: 0.34rem;
					height: 0.34rem;
					background-image: url("../../assets/location_btn_download@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					float: left;
					/*position: absolute;
					right: 0.25rem;*/
				}
			}
		}
	}

	.travel_list {
		margin-top: 1.2rem;
		/*margin-bottom: 0.3rem;*/
		li {
			width: 100%;
			height: 4.4rem;
			margin-top: 0.34rem;
			position: relative;
			.right_box{
				z-index: 1;
				position: absolute;
				top: .24rem;
				right: .24rem;
				display: flex;
				align-items: center;
				.right_box_icon{
					width: .25rem;
					height: .20rem;
					background: url(../../assets/common_icon_heart_white@3x.png) no-repeat;
					background-size:100% 100%;
				}
				.right_box_num{
					font-size: .22rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(255,255,255,1);
					padding-left: .1rem;
				}
			}
			.item_bg {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, .3);
				p {
					font-size: 0.4rem;
					font-family: PingFang-SC-Bold;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					padding: 1.36rem 0.9rem 0;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.city {
					position: absolute;
					overflow: hidden;
					padding-top: 0.5rem;
					left: 50%;
					transform: translateX(-50%);
					.city_heng {
						width: 0.3rem;
						height: 0.02rem;
						background: rgba(255, 255, 255, 1);
						float: left;
						margin-top: 0.2rem;
					}
					.city_font {
						font-size: 0.3rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(204, 204, 204, 1);
						float: left;
						padding: 0 0.3rem;
						max-width: 3rem;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
				.delete_icon {
					width: 0.66rem;
					height: 0.66rem;
					border-radius: 50%;
					background-image: url("../../assets/user_btn_del@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					position: absolute;
					bottom: 0.12rem;
					left: 0.24rem;
				}
				.writing_icon {
					width: 0.66rem;
					height: 0.66rem;
					border-radius: 50%;
					background-image: url("../../assets/user_btn_pen@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					position: absolute;
					bottom: 0.12rem;
					right: 0.24rem;
				}
			}
		}
	}

	.draft {
		width: 2.16rem;
		height: 0.7rem;
		background: rgba(248, 212, 71, 1);
		border-radius: 0.08rem;
		float: right;
		text-align: center;
		P {
			width: 0.3rem;
			height: 0.3rem;
			background-image: url("../../assets/user_icon_box@2x.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
			float: left;
			margin: 0.2rem 0.02rem 0.2rem 0.22rem;
		}
		font {
			font-size: 0.24rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(26, 26, 26, 1);
			line-height: 0.7rem;
		}
	}
</style>
<style type="text/css" lang="scss">
	.footprint {
		.amap-touch-toolbar .amap-zoomcontrol {
			display: none;
		}
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
	}

	.amap-layers {
		.downimg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100% !important;
			height: 100% !important;
			z-index: 99 !important;
		}
	}
</style>
