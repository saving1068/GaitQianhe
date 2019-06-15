<template>
	<div class="warp">
		<div class="attractions" :style="moveStyle">
			<div class="attractions_top">
				<div class="attractions_top_left">
					{{destination}}
				</div>
				<div class="attractions_top_right" @click="goDestination">
					<div class="attractions_top_right_icon">

					</div>
					<font>去这里</font>
				</div>
			</div>
			<div class="attractions_two" >
				<div class="attractions_place">
					<div class="attractions_place_left">
						{{strategyTotal}}篇攻略提及
					</div>
					<div class="attractions_place_right">
						<div class="place_right_name">

							{{goCity}}·{{goAdname}}
						</div>
					</div>
				</div>
				<div class="attractions_images">
					<div :class="[i==0? 'attractions_image_big':'attractions_image_small']" v-for="(v,i) in goPicture">
						<img :src="v.accessUrl" />
					</div>
				</div>
				<div class="strategy_title">
					<div class="mid" style="width: 1.8rem;text-align: center;">自由行攻略<i class="left"></i><i class="right"></i>
					</div>
				</div>
				<div class="li_warp" v-if="strategyList.length>0">
					<li v-for="(v,i) in strategyList" @click="goArticleDetails(v)">
						<div class="strategy_summey">
							<p class="strategy_summey_title">{{v.title}}</p>
							<p class="strategy_summey_icon">攻略</p>
							<div class="strategy_bottom">
								<div class="strategy_num">
									<div class="watch_num">
										<div class="watch_num_icon"></div>
										<font v-if="v.browseNum<=10000">{{v.browseNum}}</font>
										<font v-else>1W+</font>
									</div>
									<div class="commit">
										<div class="commit_num_icon"></div>
										<font v-if="v.commentNum<=10000">{{v.commentNum}}</font>
										<font v-else>1W+</font>
									</div>
									<div class="like">
										<div class="like_num_icon">
										</div>
										<font v-if="v.favoriteNum<=10000">{{v.favoriteNum}}</font>
										<font v-else>1W+</font>
									</div>
								</div>
							</div>
						</div>
						<div class="strategy_images">
							<img :src="v.imagePath" />
						</div>
					</li>
				</div>
				<div class="notstrategy" v-if="strategyList.length==0">
					暂时没有该景点的自由行攻略！！！
				</div>
				<div class="hot">
					<div class="hot_title">
						<div class="mid">
							<p class="left"></p>
							<p class="font">游记推荐</p>
							<p class="right"></p>
						</div>
					</div>
					<li v-for="(v,i) in WbList" @click="goToTravelDetails(v)">
						<div class="hot_item_img">
							<img :src="v.imagePath" />
						</div>
						<div class="hot_item_summery">
							{{v.title}}
						</div>
						<div class="strategy_bottom">
							<div class="userImage">
								<img v-if="v.authorPath" :src="v.authorPath" />
								<img v-else src="../../assets/touxiang1.png" />
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
						<div style="text-align: center;">
							<font>该景点暂无游记</font>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="container" style="z-index: 0;">

		</div>
		<div class="seach">
			<van-search placeholder="搜索附近的景点" @focus="goFocus" v-model="seachValue" @search="onSearch" @cancel="onCancel" @input="searching()" @blur="goBlur" />
			<ul class="seach_list" :class="{ifShow:ifList}">
				<li class="item" v-for="(v,i) in place_List" @click="over(v)">
					<div class="item_icon">

					</div>
					<div class="item_place">
						<p>{{v.destination}}</p>
						<div class="item_place_name" v-if="v.type ==1">
							{{v.parent}} 目的地
						</div>
						<div class="item_place_name" v-if="v.type ==2">
							{{v.parent}} 景点
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="mssage" @click="goToSuggest">

		</div>
		<div class="btn" v-if="btnChange==0" @click="btnChange=1" :style="[{'position':show?'fixed':'static'}]">
			<font>景点导航</font>
		</div>
		<div class="btn" style="background: #538ffd;color: #FFFFFF;" v-if="btnChange==1" @click="goMap" :style="[{'position':show?'fixed':'static'}]">
			<font>开始导航</font>
		</div>
		<div class="btn" style="background: #fd5363;color: #FFFFFF;" v-if="btnChange==2" @click="backMap" :style="[{'position':show?'fixed':'static'}]">
			<font>结束导航</font>
		</div>

	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default {
		created() {
			console.log(this.$store.state.all,"all")
			
			
		},
		mounted() {
			this.Lbsmap()
		},
		data() {
			return {
				windowHeight: window.screen.height,
				seachValue: "",
				list: [1, 2, 3, 4],
				content: false,
				destination: "", //目的站
				destinationId: 0, //景点Id
				destinationCtiy: "",
				place_List: [],
				nowPlace: "", //当前地点
				nowCity: "",
				ifList: false,
				show: true,
				distance: 0,
				goCity: "目的城市", //目的城市
				goAdname: "目的区", //目的区
				goPicture: [], //目的图片
				strategyList: [], //攻略列表
				strategyTotal: 0,
				strategyPage: 1,
				loading: false,
				finished: false,
				channel: [], //途径点
				nowLat: 0, //当前定位
				nowLng: 0, //当前定位
				goPlace: [], //目的地
				bigMap: null, //地图
				makeIcon: [], //地图景点覆盖物
				isClicked: 0,
				mapNew: [], //百度转高德
				btnChange: 0, //底部按钮的文案
				nearSpot: {}, //景点
				ifPosition: false, //是否已经定位
				showZomm: false, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				zoom: 13,
				driving_one: null,
				WbList: [], //热门游记
				startY: 0,
				moveKm: false,
				Gallery:[],//景点图片
				overLngLat:[],
				iconUrl:"",
				dot:[],
			}
		},
		computed: {
//			bgStyle() {
//				if(this.moveKm) {
//					return {
//						"height": 6 + "rem"
//					}
//				} else {
//					return {
//						"height": 3 + "rem"
//					}
//				}
//			},
			moveStyle() {
				if(this.content) {
					return {
						"bottom": 0,
						"height":this.windowHeight/100-.8+"rem"
					}
				} else {
					return {
						"bottom": -10 + 'rem',
						"height":this.windowHeight/100-.8+"rem"
					}
				}
			},
		},
		methods: {
			start(event) {
				console.log(event)
				event.preventDefault();
				this.startY = event.targetTouches[0].clientY
			},
			move(e) {
				console.log(e)
				var y = e.targetTouches[0].clientY - this.startY

				if(y < 0) { //当前y少于一开始触碰的点
					console.log(y)
					this.moveKm = true
				} else {
					this.moveKm = false
					console.log(y + "大于一开始触碰的点")
				}
			},
			goToTravelDetails(item) {
				this.$router.push({
					name: 'TravelDetails',
					query: {
						id: item.id
					}
				})
			},
			getWbList(a, id) {
				let obj = {
					a,
					li: 3,
					pa: 1,
					id
				}
				this.$Api.UserPage.getWbList(obj).then((res) => {
					//					console.log(res.q.wbs)
					if(obj.pa > 1) {
						for(var i = 0; i < res.q.wbs.length; i++) {
							this.WbList.push(res.q.wbs[i])
						}
					} else {
						this.WbList = res.q.wbs
					}
				})
			},
			ifContent() {
				console.log(111)
				this.content = false;
				this.show = true;
				console.log(this.content, this.show)
			},
			goToSuggest() {
				this.$router.push({
					name: "Suggest"
				})
			},
//			onLoad() {
//				// 异步更新数据
//				setTimeout(() => {
//					this.strategyPage++
//						var obj = {
//							a: 6,
//							pa: this.strategyPage,
//							regionId: this.destinationId
//						}
//					this.$Api.Address.ArticleList(obj).then((res) => {
//						for(let i = 0; i < 3; i++) {
//							this.strategyList.push(res.q.articles[i]);
//						}
//					})
//
//					// 加载状态结束
//					this.loading = false;
//					console.log(this.strategyList.length, this.strategyTotal)
//					// 数据全部加载完成
//					if(this.strategyList.length >= this.strategyTotal) {
//						this.finished = true;
//					}
//				}, 500);
//			},
			Lbsmap() {
				var that = this;
				//				console.log(this.showZomm,"showZomm")
				this.$loading("加载中...")
				var map = new AMap.Map('container', {
					resizeEnable: true,
					zoom: that.zoom,
					//			        center:['113.240303','23.131037']
				});
				var logMapinfo = function(res) {
					var zoom = map.getZoom(); //获取当前地图级别
					//				        var center = map.getCenter(); //获取当前地图级别
					console.log(zoom)
				};
				map.on('zoomend', logMapinfo);
				var traffic = new AMap.TileLayer.Traffic({
					'autoRefresh': true, //是否自动刷新，默认为false
					'interval': 180, //刷新间隔，默认180s
				});
				map.on('click', this.ifContent);
				//				map.add(traffic); //通过add方法添加图层
				//map.remove(traffic) //需要时可以移除
				map.plugin(['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Geocoder','AMap.Driving'], function() {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						//						timeout: 3000,
						// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
						buttonOffset: new AMap.Pixel(10, 20),
						//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						zoomToAccuracy: that.showZomm,
						//						 maximumAge:10000000,           //定位结果缓存0毫秒，默认：0
						//  定位按钮的排放位置,  RB表示右下
						buttonPosition: 'LB',
						showButton: true,
					})
					map.addControl(geolocation);
					geolocation.getCurrentPosition()
					AMap.event.addListener(geolocation, 'complete', onComplete)
					AMap.event.addListener(geolocation, 'error', onError)

					function onComplete(data) {
						console.log(data)
						that.nowPlace = data.formattedAddress; //当前定位地址
						that.nowCity = data.addressComponent.city; //当前定位城市
						that.nowLat = data.position.lat; //当前定位经纬度
						that.nowLng = data.position.lng; //当前定位经纬度
						if(!that.ifPosition) {
							that.channel.unshift({
								keyword: data.formattedAddress,
								city: data.addressComponent.city
							})
							var obj = {
								longitude: data.position.lng,
								latitude: data.position.lat
							}
							that.getNearSpot(obj) //获取附近景点
						}
						that.ifPosition = true;
					}

					function onError(data) {
						if(data.info=="FAILED"){
							Toast(data.message)
							that.$loading.clear()
						}
						// 定位出错
//
//												console.log(data)
						//						alert("定位失败")
					}
				})
				this.bigMap = map
			},
			onSearch() {
				console.log('搜索感兴趣的目的地')
				var obj = {
					searchKey: this.seachValue,
					pa: 1,
					li: 10,
					a: 1
				}
				this.$Api.UserPage.WbDestinationList(obj).then((res) => {
					this.place_List = res.q.list
				})
			},
			getAdList(obj) {
				this.$Api.Address.ArticleList(obj).then((res) => {
					//					console.log(res)
					this.strategyList = res.q.articles
					this.strategyTotal = res.q.total
				})
			},
			getCityGallery(obj){
				this.$Api.Address.CityGallery(obj).then((res)=>{
					this.goPicture = res.q.list
					console.log(this.Gallery)
				})
			},
			getNearSpot(obj) {
				var that = this;
				//				 var markers = []; //province见Demo引用的JS文件
				
				this.$Api.Address.NearSpot(obj).then((res) => {
					this.iconUrl = res.q.icon
					this.nearSpot = res
					for(var i = 0; i < res.q.list.length; i++) { //百度转高德
						//						var gps = [res.q.list[i].longitude,res.q.list[i].latitude];
						//						AMap.convertFrom(gps, 'baidu', (status, result)=> {
						//						  if (result.info === 'ok') {
						//							this.mapNew.push([result.locations[0].lng,result.locations[0].lat])
						this.mapNew.push([res.q.list[i].longitude, res.q.list[i].latitude])
						//						  }
						//
						//						});
					}
					//					console.log(this.mapNew,"百度转高德")
					setTimeout(() => {
						this.makeIconArr(this.mapNew, res)
					}, 1000)
					//					console.log(res.q.list)
				})
			},
			makeIconArr(arr, res) { //arr=this.mapNew
				var that = this;
				//				console.log(arr)
				var icon = new AMap.Icon({
					image: that.iconUrl,
					size: new AMap.Size(28, 28),
				});
				var geocoder = new AMap.Geocoder({
					// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
					//					    city: '010'
				})
				var that = this
				//				setTimeout(()=>{
				for(var i = 0; i < arr.length; i++) {
					res.q.list[i].index = i
					var marker;
					marker = new AMap.Marker({
						icon: icon,
						position: [arr[i][0], arr[i][1]],
						//							position: a,
						//							offset: new AMap.Pixel(-12, -12),
						zIndex: 101,
						//	    					title: res.q.list[i].name,
						extData: res.q.list[i],
						map: that.bigMap
					});
					//marker.on('click',function(e){
					//
					if(this.makeIcon.length <= arr.length) {
						this.makeIcon.push(marker) //景点iocn
					}

					AMap.event.addListener(marker, 'click', function(e) {
						let gallery = {
							a:1,
							type:1,
							regionId:e.target.Ig.extData.cityId,
							pa:1,
							li:3
						}
						that.getCityGallery(gallery)
						that.goPlace = [e.lnglat.lng, e.lnglat.lat]
						that.$store.state.all = e.target.Ig.extData;
						let index1 = e.target.Ig.extData['index'] //index = 景点下标
						//							console.log('index111', index1)

						//搜索
						let placeSearch = new AMap.PlaceSearch({
							pageSize: 1,
							map: that.bigMap,
							//								pageIndex:100
						});
						that.destination = e.target.Ig.extData.name; //地址
						that.destinationId = e.target.Ig.extData.id; //
						//							console.log(e.target.Ig.extData.name)

						//						console.log(e.target,"e.target")

						if(that.btnChange == 1) { //开始导航
							//hasOwnProperty
							//								console.log(that.makeIcon[index1],"hat.makeIcon[index1]")
							if(!e.target.Ig.hasOwnProperty('label')) {
								//								console.log(887910)
								that.isClicked++
									//									console.log(index1,"index1")
									//									console.log(that.makeIcon,"hat.makeIcon")

									that.makeIcon[index1].setLabel({
										//修改label相对于maker的位置
										offset: new AMap.Pixel(-8, -5),
										content: "<div class='info'>" + that.isClicked + "</div>"
									});
								//										console.log('mark mark', e)
								geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
									if(status === 'complete' && result.info === 'OK') {
										// result为对应的地理位置详细信息
										//											console.log('ssss', result)
										if(that.channel.length <= 14) {
											//											console.log('sgadgsfe44444')
											that.channel.push({
												keyword: result.regeocode.formattedAddress,
												city: result.regeocode.addressComponent.city
											})
											//											that.isClicked = 16
										} else {
//											console.log('超了15个')
											that.channel.splice(1, 1)

											that.channel.push({
												keyword: result.regeocode.formattedAddress,
												city: result.regeocode.addressComponent.city
											})

										}
									}
								})

							} else {
								console.log("还有lable")
							}

						} else {
								let p_one = [that.nowLng, that.nowLat]
							//								that.distance = Math.round(AMap.GeometryUtil.distance(p_one, p_two) / 1000);
							that.goCity = e.target.Ig.extData.cityName;
							that.goAdname = e.target.Ig.extData.areaName;
//							that.goPicture = that.Gallery;
							if(that.btnChange == 1) { //开始导航
								that.content = false;
								that.show = true;
								that.moveKm = false
							} else {
								that.content = true;
//								that.moveKm = true;
								that.show = false;
							}
							that.ifList = true;
							//								console.log(that.distance,that.goCity,that.goAdname,that.goPicture)
							setTimeout(() => {
								////										//										console.log("vdfdasfdfdasfas")
								that.$loading.clear()
							}, 500)
							var obj = {
								a: 6,
								pa: this.strategyPage,
								regionId: that.destinationId
							}
							
							that.getAdList(obj)
							that.getWbList(6, that.destinationId)
							
						}

					}); //点击事件

					
				}
				if(this.makeIcon.length==arr.length){
					setTimeout(() => {
						////										//										console.log("vdfdasfdfdasfas")
						that.loading = true;//加载完
						that.$loading.clear()
						console.log(Object.keys(that.$store.state.all),"Object.keys(that.$store.state.all)")
						if(Object.keys(that.$store.state.all).length !=0){
							console.log(that.loading,"that.loading")
							that.destination = that.$store.state.all.name||that.$store.state.all.destination;
							that.goCity = that.$store.state.all.goCity||that.$store.state.all.cityName;
							that.goAdname = that.$store.state.all.goAdname||that.$store.state.all.areaName;
								var obj = {
									a: 6,
									pa: that.strategyPage,
									regionId:that.$store.state.all.id
								}
							let gallery = {
									a:1,
									type:1,
									regionId:that.$store.state.all.cityId,
									pa:1,
									li:3
								}
							that.getCityGallery(gallery)
							that.getAdList(obj)
							that.getWbList(6, that.$store.state.all.id)
							if(that.loading){
								that.content=true;
							}
						}
					}, 200)
					
				}
				//					},5000)
				//				console.log(this.makeIcon,"this.makeIcon")
			},
			backMap() {
				//					console.log(this.channel,"清除前路线")
				this.driving_one.clear()
				this.bigMap.remove(this.overLngLat);
				this.btnChange = 0;
				this.makeIcon = [];
				this.makeIconArr(this.mapNew, this.nearSpot)
				this.channel = []; //行程
				this.channel.unshift({ //行程添加当前位置
					keyword: this.nowPlace,
					city: this.nowCity
				})
				this.isClicked = 0
			},
			goMap() {
				var that = this;
				let arr = [...this.channel];
				let dot = [];
				this.$loading("加载中...")
				if(this.channel.length > 1) {
					arr.shift()
					arr.pop()
//					console.log(arr,"arr")
//					console.log(this.channel,"this.channel")

					//					console.log(that.bigMap)
					//					AMap.plugin('AMap.Driving', () => {
					//					console.log(that)
					this.driving_one = new AMap.Driving({
						// 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
						policy: AMap.DrivingPolicy.LEAST_TIME,
						// map 指定将路线规划方案绘制到对应的AMap.Map对象上
						map: that.bigMap,
						// panel 指定将结构化的路线详情数据显示的对应的DOM上，传入值需是DOM的ID
						//						panel: 'panel'
					})
					var geocoder = new AMap.Geocoder({})
					
					var icon = new AMap.Icon({
						image: 'http://webapi.amap.com/theme/v1.3/markers/b/mid.png',
						size: new AMap.Size(36, 36),
					});

					this.driving_one.search(that.channel, function(status, result) {
						that.bigMap.remove(that.makeIcon);
							for(let i=0;i<arr.length;i++){
								geocoder.getLocation(arr[i].keyword,function(status,result){
									 if (status === 'complete' && result.info === 'OK') {
									      // result中对应详细地理坐标信息
		//							     lnglat.push([result.geocodes[0].location.lng,result.geocodes[0].location.lat])
									     var marker;
										marker = new AMap.Marker({
											icon: icon,
											position: [result.geocodes[0].location.lng,result.geocodes[0].location.lat],
		//									offset: new AMap.Pixel(-12, -12),
											zIndex: 102,
											//	    					title: res.q.list[i].name,
											map: that.bigMap
										});
										marker.setLabel({
			//										//修改label相对于maker的位置
											offset: new AMap.Pixel(-8, -5),
											content: "<div class='info'>" + (i+1) + "</div>"
										});
										that.overLngLat.push(marker)
										that.dot.push([result.geocodes[0].location.lng,result.geocodes[0].location.lat])
									}
								})			
							}
						
						that.btnChange = 2
						if(result.info == "OK") {


							setTimeout(() => {
								that.$loading.clear()
							}, 500)

						}
						dot = [...that.dot]
						console.log(dot)
//							let p1 = dot[0];
//							let p2 = dot[1]
	//						// 返回 p1 到 p2 间的地面距离，单位：米
//							var dis = AMap.GeometryUtil.distance(dot[i],dot[i+1]);
//							console.log(dis)
						
//						console.log(dis)[113.250168, 23.138953][113.248037, 23.129886]
//						console.log(that.overLngLat[0].distance(that.overLngLat[1]))
						//							console.log(result.info)
					})
					//					})
				} else {
					this.$loading.clear()
					Toast('请选择想去的景点');

				}
			},
			over(item) {
				console.log(item)
				var that = this;
				this.destination = item.destination; //地址
				this.destinationId = item.id; //
				this.$store.state.all = item;
				this.destinationCtiy = item.parent.split('- ')[1]; //城市
				this.goPlace = [item.longitude, item.latitude]
				this.$loading("加载中...")
				var obj = {
					a: 6,
					pa: this.strategyPage,
					regionId: item.id
				}
				let gallery = {
						a:1,
						type:1,
						regionId:item.cityId,
						pa:1,
						li:3
					}
				this.getCityGallery(gallery)
				this.getAdList(obj)
				this.getWbList(6, that.destinationId)
				that.$store.state.allId = that.destinationId
				//
				var placeSearch = new AMap.PlaceSearch({
					pageSize: 1,
					map: this.bigMap,
				});
				var p_one = [that.nowLng, that.nowLat]
				placeSearch.search(item.destination)
				AMap.event.addListener(placeSearch, "complete", function(e) {
					console.log(e.info)
					if(e.info === "OK") {
						that.content = true;
						that.show = false;
						that.ifList = true;
						var p_two = [e.poiList.pois[0].location.lng, e.poiList.pois[0].location.lat]; //"目的地地址"
						//						that.distance = Math.round(AMap.GeometryUtil.distance(p_one, p_two) / 1000);
						that.goCity = e.poiList.pois[0].cityname;
						that.goAdname = e.poiList.pois[0].adname;
						that.$store.state.all.goCity = e.poiList.pois[0].cityname;
						that.$store.state.all.goAdname = e.poiList.pois[0].adname;
						console.log(that.goPicture,"that.goPicture")
//						that.goPicture = that.Gallery;
						setTimeout(() => {
							////										//										console.log("vdfdasfdfdasfas")
							that.$loading.clear()
						}, 500)
					} else {
						that.content = false;
						that.moveKm = false;
						setTimeout(() => {
							that.$loading.clear()
						}, 500)
						Toast("没有找到该景点")
					}

				});

			},

			goDestination() {
				this.$loading("加载中...")
				this.content = false;
				this.show = false;
				this.ifList = true;
				this.showZomm = true;
				var that = this;
				var url = "http://m.amap.com/navi/?start=" + that.nowLng + "," + that.nowLat + "&dest=" + that.goPlace.join(',') + '&destName=' + that.nowPlace + '&naviBy=car&key=83dcf9c5905e9c4faf912a743cbca57f'
//				console.log(url)
//				window.location.href = url
				var LngLat = [this.nowLng,this.nowLat]
				let go = {
					origin:LngLat,
					originName:this.nowPlace,
					destination:this.goPlace,
					destinationName:this.destination
					
				}
				let goplace = new AMap.Driving({
						// 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
						policy: AMap.DrivingPolicy.LEAST_TIME,
						// map 指定将路线规划方案绘制到对应的AMap.Map对象上
						map: that.bigMap,
						// panel 指定将结构化的路线详情数据显示的对应的DOM上，传入值需是DOM的ID
						//						panel: 'panel'
				})
				goplace.searchOnAMAP(go)
//				console.log(url)
			},
			goArticleDetails(item) {
				this.$router.push({
					name: "StrategyDetail",
					query: {
						id: item.id
					}
				})
			},
			goFocus() {
				this.ifList = false; //列表 ture =0
				this.show = false; //定位导航
				this.content = false; //内容
			},
			goBlur() {
				this.ifList = true;
				this.show = true;
			},
			searching() {
				if(this.seachValue.length >= 2) {
					this.onSearch()
				}
			},
			onCancel() {
				console.log('取消搜索音乐')
			},
			test() {
				console.log('fjdgfjsgfis', this.makeIcon)
			}
		},
		beforeRouteLeave(to,from,next){
				this.$loading.clear()
				if(to.name=="Home"||to.name=="Location"){
					this.$store.state.all = {}
				}
				next()


		},
	}
</script>

<style scoped="scoped" lang="scss">
	img {
		width: 100%;
		height: 100%;
		/*background: url(../../assets/location_bg_num@2x.png);*/
	}

	.notstrategy {
		width: 100%;
		text-align: center;
		font-size: .36rem;
		line-height: 2rem;
		background: #FFFFFF;
	}

	#panel {
		position: fixed;
		background-color: white;
		max-height: 90%;
		overflow-y: auto;
		top: 10px;
		right: 10px;
		width: 5rem;
	}

	.ifShow {
		height: 0;
	}

	.warp {
		height: 100%;
		position: relative;
		.seach_list {
			border-radius: .3rem;
			background: rgba(255, 255, 255, 1);
			width: 90%;
			max-height: 6.5rem;
			margin: .15rem auto;
			overflow-y: scroll;
			padding: 0 .21rem;
			.item {
				border-bottom: 0.01rem solid #EDEDED;
				overflow: hidden;
				margin-top: .3rem;
				padding-bottom: .3rem;
				.item_icon {
					width: .46rem;
					height: .46rem;
					background-image: url(../../assets/travels_img_location@2x.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					float: left;
					margin-top: .1rem;
				}
				.item_place {
					float: left;
					padding-left: .2rem;
					p {
						font-size: 0.28rem;
						font-family: PingFang-SC-Regular;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}
					.item_place_name {
						font-size: 0.22rem;
						font-family: PingFang-SC-Regular;
						font-weight: 400;
						color: rgba(153, 153, 153, 1);
					}
				}
			}
		}
		.attractions {
			position: fixed;
			bottom: -10rem;
			width: 100%;
			background: #FFFFFF;
			z-index: 1;
			transition: all 1s;
			height: 6rem;
			.attractions_top {
				position: absolute;
				top: 0;
				width: 100%;
				background: #FFFFFF;
				padding: .24rem .24rem;
				overflow: hidden;
				height: .98rem;
				border-bottom: 0.01rem solid #EDEDED;
				z-index: 11;
				.attractions_top_left {
					float: left;
					font-size: 0.3rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
				}
				.attractions_top_right {
					float: right;
					color: #36c77a;
					font-size: 0.22rem;
					font {
						padding-left: .1rem;
					}
					.attractions_top_right_icon {
						width: 0.2rem;
						height: 0.2rem;
						float: left;
						margin-top: .1rem;
						background-size: 100% 100%;
						background-repeat: no-repeat;
						background-image: url(../../assets/common/greed.png);
					}
				}
			}
			.attractions_two {
				padding-top: 1rem;
				overflow: scroll;
				height: 6rem;
			}
			.attractions_place {
				background: #FFFFFF;
				height: 1.04rem;
				padding: 0 .24rem;
				line-height: 1.04rem;
				font-size: 0.3rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				.attractions_place_left {
					color: rgba(51, 51, 51, 1);
					float: left;
				}
				.attractions_place_right {
					float: right;
					color: rgba(102, 102, 102, 1);
				}
			}
			.attractions_images {
				overflow: hidden;
				padding: 0 .24rem;
				background: #FFFFFF;
				.attractions_image_big {
					width: 4.96rem;
					height: 4.06rem;
					float: left;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-image: url(../../assets/placeholder_750x440.png);
				}
				.attractions_image_small {
					width: 2rem;
					height: 2rem;
					float: left;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-image: url(../../assets/common/placeholder_200x200.png);
					margin-left: .06rem;
					margin-bottom: .06rem;
				}
			}
			.strategy_title {
				background: #FFFFFF;
				width: 100%;
				position: relative;
				height: .98rem;
				border-bottom: 0.01rem solid #CCCCCC;
				padding: .28rem 0;
				.mid {
					width: 1.5rem;
					margin: auto;
					font-size: 0.3rem;
					position: relative;
					.left {
						width: 0.73rem;
						height: 0.03rem;
						background: url(../../assets/common_img_title_left@3x.png) no-repeat;
						background-size: 100%;
						position: absolute;
						left: -1.03rem;
						top: 0.2rem;
					}
					.right {
						width: 0.73rem;
						height: 0.03rem;
						background: url(../../assets/common_img_title_end@3x.png) no-repeat;
						background-size: 100%;
						position: absolute;
						right: -1.03rem;
						top: 0.2rem;
					}
				}
			}
			/*.li_warp {
				height: 2.8rem;
				overflow-y: scroll;
			}*/
			li {
				background: #FFFFFF;
				padding: 0 .25rem .22rem;
				overflow: hidden;
				border-bottom: 0.01rem solid #CCCCCC;
				.strategy_summey {
					width: 4rem;
					font-size: 0.3rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					padding-top: .3rem;
					padding-right: .4rem;
					float: left;
					.strategy_summey_title {
						padding-bottom: .17rem;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.strategy_summey_icon {
						display: inline-block;
						text-align: center;
						font-size: 20px;
						padding: 0 25px;
						background: rgba(250, 220, 86, 1);
						color: rgba(102, 102, 102, 1);
						border-radius: 25px;
						transform: scale(.5) translate(-50%, -50%);
					}
				}
				.strategy_images {
					width: 2.8rem;
					height: 2rem;
					float: left;
					background: salmon;
					margin-top: .2rem;
				}
				.strategy_bottom {
					float: left;
					width: 100%;
					display: flex;
					padding-top: .1rem;
					.userImage {
						width: 0.4rem;
						height: 0.4rem;
						border-radius: 50%;
					}
					.userName {
						font-size: 0.26rem;
						width: 3.16rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						padding-left: .12rem;
					}
					.strategy_num {
						display: flex;
						justify-content: space-between;
						width: 3.8rem;
						align-items: center;
					}
					.watch_num {
						width: 1rem;
						display: flex;
						align-items: center;
						/*justify-content:space-between;*/
						/*padding-right:.1rem ;*/
						.watch_num_icon {
							width: 0.22rem;
							height: 0.14rem;
							background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
							background-size: 100%;
						}
						font {
							padding-left: .1rem;
							font-size: 0.22rem;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(102, 102, 102, 1);
						}
					}
					.commit {
						width: 1rem;
						display: flex;
						align-items: center;
						/*justify-content:space-between;*/
						.commit_num_icon {
							width: 0.2rem;
							height: 0.18rem;
							background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
							background-size: 100%;
						}
						font {
							padding-left: .1rem;
							font-size: 0.22rem;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(102, 102, 102, 1);
						}
					}
					.like {
						width: 1rem;
						display: flex;
						align-items: center;
						/*justify-content:space-between;*/
						.like_num_icon {
							width: 0.2rem;
							height: 0.18rem;
							background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
							background-size: 100%;
						}
						font {
							padding-left: .1rem;
							font-size: 0.22rem;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(102, 102, 102, 1);
						}
					}
				}
			}
		}
	}

	#container {
		width: 100%;
		position: fixed;
		top: 0;
		background: salmon;
	}

	.seach {
		position: fixed;
		top: .33rem;
		left: .24rem;
		width: 95%;
	}

	.hot {
		.hot_title {
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
				transform: translate(-50%, -50%);
				top: 50%;
				left: 50%;
				p {
					float: left;
				}
				.font {
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
		li {
			padding: 0 .24rem .65rem;
			.hot_item_img {
				width: 100%;
				height: 3rem;
			}
			.hot_item_summery {
				padding-top: .27rem;
				font-size: 0.28rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.strategy_bottom {
				width: 100%;
				display: flex;
				padding-top: .4rem;
				.userImage {
					width: 0.4rem;
					height: 0.4rem;
					border-radius: 50%;
					overflow: hidden;
					img {
						vertical-align: initial;
					}
				}
				.userName {
					font-size: 0.26rem;
					width: 3.16rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					padding-left: .12rem;
				}
				.strategy_num {
					display: flex;
					justify-content: space-between;
					width: 3.8rem;
					align-items: center;
					/*line-height: .4rem;*/
				}
				.watch_num {
					/*width: 1rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.watch_num_icon {
						width: 0.25rem;
						height: 0.2rem;
						background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .12rem;*/
					}
					font {
						padding-left: 0.1rem;
						font-size: 0.22rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
				.commit {
					/*width: .8rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.commit_num_icon {
						width: 0.25rem;
						height: 0.25rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .08rem;*/
					}
					font {
						padding-left: 0.1rem;
						font-size: 0.22rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
				.like {
					/*width: .8rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.like_num_icon {
						width: 0.25rem;
						height: 0.25rem;
						background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						/*float: left;*/
						/*margin-top: .08rem;*/
					}
					font {
						padding-left: 0.1rem;
						font-size: 0.22rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
			}
		}
		.strategy_more {
			line-height: .5rem;
			font-size: 0.24rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(116, 116, 116, 1);
			text-align: center;
			p {
				float: right;
				width: 0.09rem;
				height: 0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .44rem;
			}
		}
	}

	.mssage {
		position: fixed;
		right: .3rem;
		bottom: 2.18rem;
		width: 1rem;
		height: 1rem;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-image: url(../../assets/location_btn_smessage@2x.png);
		border-radius: 50%;
	}

	.btn {
		width: 2rem;
		height: 0.94rem;
		background: rgba(250, 220, 86, 1);
		border-radius: .15rem;
		position: fixed;
		left: 2.8rem;
		bottom: .53rem;
		text-align: center;
		line-height: .94rem;
		font-size: 0.34rem;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(51, 51, 51, 1)
	}
</style>
<style lang="scss">
	.warp {
		.van-search {
			width: 95%;
			margin: 0 auto;
			box-shadow: 0.05rem 0.05rem .1rem #D6D6D6;
			border-radius: .5rem;
			.van-icon-search {
				color: #FADC56;
			}
		}
		#container{
			.amap-marker{
				.amap-lib-marker-mid{
					display: none;	
				}
			}
		}
	}

	#panel {
		.amap-call {
			/*display: none !important;*/
		}
	}
</style>
