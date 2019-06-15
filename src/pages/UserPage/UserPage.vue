<template>
	<div :class="['warp',imgMask?'hidden':'']" style="height: 100%;">
		<div class="top_image">
			<div class="share">
				<div class="share_font">
					<p>今天访问:{{user.dailyVisit}}</p>
					<p>累计访问:{{user.visitCount}}</p>
				</div>
				<div class="shu"></div>
				<div class="share_icon" @click="share"></div>
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
						<div @click="goToTrip" class="footprint_icon" v-if="!downLoadFlag"></div>
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
			<div style="padding-bottom:1.2rem ;">
				<div v-if="draftTotal>0" class="draft" @click="goToDraft">
					<p></p>
					<font>游记草稿({{draftTotal}})</font>
				</div>
				<div v-else class="draft">
					<p></p>
					<font>游记草稿({{draftTotal}})</font>
				</div>
			</div>
			<div class="travel_list">
				<van-list v-model="loading" @load="onLoad" :finished="finished" :loading-text="loading_text">
					<li v-for="(v,i) in list" @click="goToTravelDetails(v)">
						<img :src="v.imagePath" />
						<div class="item_bg">
							<p>{{v.title}}</p>
							<!--<div style="width: 100%;display: flex;align-items: center;justify-content: center;">-->
							<div class="city">
								<div class='city_heng' style="    position: absolute;
    top: 50%;
    transform: translateY(-50%);"></div>
								<div class="city_font">{{v.sites}}</div>
								<div class='city_heng' style="position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;"></div>
							</div>
							<!--</div>-->
							<div class="delete_icon" @click.stop="openDelete(v)"></div>
							<div class="writing_icon" @click.stop="goToTravels(v.id)"></div>
						</div>
					</li>
				</van-list>
			</div>
			<div class="bottom_null" v-if="list.length==0">
				<div class="bottom_null_Rectangle">
					开始你的故事
				</div>
				<div class="bottom_null_Triangle">
					<!--<div class="bottom_line"></div>-->
				</div>

			</div>

		</div>
		<Delete v-show="ifDelete" @delete='sureDelete' @cancel="cancelDelete"></Delete>
		<div class="mask" id="Img" v-show="imgMask" @click="hide">
			<!--合成图片-->
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
			console.log(this.$Api.UserPage.imgUrl)
			this.$store.state.TravelsArticle = []
			if(Object.keys(this.$store.state.Home.user).length != 0) {
				this.user = { ...this.$store.state.Home.user
				}
				this.shareInfo()
			} else {
				this.getUserDetails(0)
			}
			this.getUserFootprint()
			this.getUserFootprintFlag()

			// this.getUserDetails(0) //个人信息
			//  this.getWbList({
			//    a: 5,
			//    Sk: 1
			//  }) //游记
			this.getWbList({
				a: 5,
				Sk: 0
			}) //草稿

		},
		mounted() {
			this.Lbsmap()

		},
		data() {
			return {
				flagImgUrl:this.$Api.UserPage.imgUrl,//旗图片前序
				flagImg:".png",
				natFlags:[],
				list: [], //我的游记列表
				draft: [], //游记草稿
				foot: 0, //足迹
				footFlag: [], //足迹旗
				user: "", //个人信息
				ifDelete: false, //删除组件
				wbId: null, //=游记ID
				page: 1,
				loading: false,
				finished: false,
				loading_text: "努力加载中",
				draftTotal: 0,
				footList: [],
				mapList: [],
				config: {},
				dataURL: "",
				imgMask: false,
				imgObj: {},
				downLoadFlag: false,
				message: "",
				num: 0,
				timer: null,
				maskFlag: false,
				flagArr: [],
			}
		},
		methods: {
			goToTravelDetails(item) {
				this.$router.push({
					name: 'TravelDetails',
					query: {
						id: item.id
					}
				})
			},
			hide() {
				this.imgMask = false
				this.maskFlag = false
			},
			downLoad() { //下载图片
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

							// alert(dataURL)
							that.$loading.clear()
							that.maskFlag = true

							window.scrollTo(0, 0)
							that.imgMask = true

							that.downLoadFlag = false
that.dataURL = dataURL;
							that.timer = setTimeout(() => {
								that.maskFlag = false
							}, 2000)　　　　　
　　　　　　　　}
					})



			},

			 shareInfo() {
				let that = this;
				let url = window.location.protocol + "//" +
					window.location.host + window.location.pathname +
					"?#/EmptyPage?name=OtherPage&shareId=" +
					this.$store.state.Home.user.id + "&id=" + this.user.id;
				console.log(url)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
					timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
					nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
					signature: this.$store.state.config.signature, // 必填，签名
					jsApiList: ["updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
				});
				wx.ready(function() { //需在用户可能点击分享按钮前就先调用

					if(wx.onMenuShareAppMessage) {
						wx.onMenuShareAppMessage({
							title: that.user.name + " 的个人主页", // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							type: 'link', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function(res) {

								that.shareSuccess()
								//     	that.shareSuccess()
								// 设置成功
							}
						});
					} else {
						wx.updateAppMessageShareData({
							title: that.user.name + " 的个人主页", // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							success: function(res) {
								// 用户点击了分享后执行的回调函数
								// console.log(res+"onMenuShareAppMessage")

							}
						})
					}
				});
			},
			shareSuccess() {
				this.$Api.Common.ShareTask({
					a: 5,
					id: this.user.id
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.$toast("分享成功", "success")
					}
				})

			},
			onLoad() {
				setTimeout(() => {
					//    	console.log(this.page,"page")
					let num = null
					var obj = { //a=1？发表：草稿；0草稿
						a: 5,
						Sk: 1,
						pa: this.page
					}
	
					this.$Api.UserPage.getWbList(obj).then((res) => {
						if(res.q.s == 0){
							this.page++
							this.num = res.q.total;
							if(this.list.length >= num) {
		//							console.log(this.finished)
									this.finished = true;
									this.loading_text = ''
								}
								for(let i = 0; i < res.q.wbs.length; i++) {
									this.list.push(res.q.wbs[i]);
		//							console.log(res.q.wbs,"发表游记列表次数"+(i+1))
								}
								this.loading = false;
								//					console.log(this.list.length, this.num,"null")
								
						}
					})
					console.log(this.list)
					
				}, 500);
				
			},
			goToTravels(id) {
				this.$router.push({
					name: "Travels",
					query: {
						id
					}
				})
			},
			openDelete(item) {
				this.ifDelete = true

				this.wbId = item.id
			},
			sureDelete() {
				//				console.log("确认删除")
				this.DelWb(this.wbId)

			},
			share() {
//				console.log(this.$share())
				this.$share("分享我的主页拿每日积分")

			},
			cancelDelete() {
				//				console.log("取消删除")
				this.ifDelete = false
			},
			Lbsmap() {
				let that = this;
				var map = new AMap.Map('container', {
					resizeEnable: true,
					zoom: 2,
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
					//      AMap.event.addListener(geolocation, 'error', onError)

					function onComplete(data) {
						for(let i = 0; i < that.footList.length; i++) {
							var icon = new AMap.Icon({
								image: that.footFlag[i],
								size: new AMap.Size(18, 18),
							});
							that.flagArr.push(icon)
						}
						//					console.log(that.flagArr)
						// data是具体的定位信息
						//        that.footList.push(data.formattedAddress)
						//        that.footFlag.push("https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png")
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

				})
			},
			goToTrip() { //足迹
				this.$router.push({
					name: "Trip"
				})
			},
			goToDraft() { //草稿
				this.$router.push({
					name: "Draft"
				})
			},
			getWbList({
				a,
				ta,
				pa,
				li,
				Sk
			}) { //游记
				this.$Api.UserPage.getWbList({
					a,
					ta,
					pa,
					li,
					Sk
				}).then((res) => {
					//					console.log(res)
					//      this.scrollTop = true
					if(Sk == 1) { //发表
						this.list = res.q.wbs
					} else { //草稿
						this.draft = res.q.wbs
						this.draftTotal = res.q.total
					}

				})
			},
			DelWb(id) { //删除游记
				this.$Api.UserPage.DelWb({
					a: 0,
					id
				}).then((res) => {
//					console.log(res)
					if(res.q.s == 0) {
						this.getWbList({ //发表，0系草稿
							a: 5,
							Sk: 1
						}) //游记
						this.ifDelete = false;
					}
				})
			},
			getUserFootprintFlag() {
				let obj = {
					a: 0,
					//						id:this.$route.query.id
				}
				this.$Api.UserPage.UserFootprintFlag(obj).then((res) => {
					this.foot = res.q.total;
					this.natFlags = res.q.natFlags;
					for(var i = 0; i < res.q.list.length; i++) {
						this.footFlag.push(res.q.list[i].iamgeUrl)
						this.footList.push(res.q.list[i]);
					}

				})
			},
			getUserFootprint() {
				let obj = {
					a: 0,
					//						id:this.$route.query.id
				}
				this.$Api.UserPage.UserFootprint(obj).then((res) => {
					this.message = res.q.content
				})
			},
			async getUserDetails(a) { //个人信息
				this.$Api.UserPage.UserDetails(a).then((res) => {
//					console.log(res)
					this.user = { ...res.q.user
					}
//					this.shareInfo()
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
		.topMask {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 30002;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.3);
			.box {
				width: 2.75rem;
				height: 2.75rem;
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				.maskIcon {
					width: 1.04rem;
					height: 1.78rem;
					background: url('../../assets/common_icon_click@3x.png') no-repeat;
					background-size: 100%;
					margin: auto;
				}
				p {
					color: #ffffff;
					font-size: 0.26rem;
					text-align: center;
					margin-top: 0.2rem;
				}
			}
		}
		.delete {
			position: absolute;
			right: 0.3rem;
			top: 0.3rem;
			width: 0.33rem;
			height: 0.33rem;
			background: #ffffff;
			z-index: 30001;
			border-radius: 50%;
			padding: 0.3rem;
			i {
				width: 0.33rem;
				height: 0.33rem;
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
				bottom: 0;
				margin: auto;
			}
		}
	}

	img {
		width: 100%;
		height: 100%;
	}

	.bottom_null {
		position: fixed;
		bottom: .8rem;
		left: 50%;
		transform: translate(-50%);
		z-index: 555;
	}

	.bottom_null_Rectangle {
		width: 2.34rem;
		height: 1rem;
		background: rgba(0, 0, 0, 1);
		opacity: 0.3;
		border-radius: 0.06rem;
		font-size: 0.28rem;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 1rem;
		margin: 0 auto;
	}

	.bottom_line {
		width: .5rem;
		height: .02rem;
		background: #FFFFFF;
		position: absolute;
		top: -.25rem;
		left: -.25rem;
	}

	.bottom_null_Triangle {
		width: 0;
		border: .25rem solid;
		border-color: rgba(0, 0, 0, .3) transparent transparent transparent;
		margin: 0 auto;
		position: relative;
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

	.top_image {
		width: 100%;
		position: relative;
		padding-bottom: 1rem;
		background: #FFFFFF;
		.share {
			background: rgba(0, 0, 0, .5);
			position: absolute;
			right: 0;
			top: 0.25rem;
			border-radius: 0.35rem 0 0 0.35rem;
			display: flex;
			font-size: 0.2rem;
			z-index: 99;
			color: #FFFFFF;
			padding-right: 0.1rem;
			.share_font {
				padding: 0.1rem 0 0.1rem 0.3rem;
			}
			.shu {
				width: 0.02rem;
				height: 0.55rem;
				background: #FFFFFF;
				margin-top: 0.12rem;
				margin-left: 0.16rem;
				opacity: 0.2;
			}
			.share_icon {
				width: 0.36rem;
				height: 0.36rem;
				background-image: url("../../assets/user_btn_share@2x.png");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				margin-top: 0.18rem;
				margin-left: 0.06rem;
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
		/*margin-top: 1.2rem;*/
		margin-bottom: 0.3rem;
		min-height: 1.08rem;
		li {
			width: 100%;
			height: 4.4rem;
			margin-top: 0.34rem;
			position: relative;
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
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.city {
					position: absolute;
					overflow: hidden;
					margin-top: .3rem;
					left: 50%;
					transform: translateX(-50%);
					.city_heng {
						width: 0.3rem;
						height: 0.02rem;
						background: rgba(255, 255, 255, 1);
						float: left;
						/*margin-top: .2rem;*/
					}
					.city_font {
						font-size: 0.3rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(204, 204, 204, 1);
						text-align: center;
						float: left;
						margin: 0 auto;
						padding: 0 0.5rem;
						/*overflow: hidden;*/
						/*text-overflow: ellipsis;*/
						/*display: -webkit-box;*/
						/*-webkit-line-clamp: 2;*/
						/*-webkit-box-orient: vertical;*/
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
					z-index: 1;
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
					z-index: 1;
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
