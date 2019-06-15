<template>
	<div class="warp">
		<div class="appen_warp">
			<div class="appen_img">
				<img v-if="imagePath" :src="imagePath" />
				<img v-else :src="this.$store.state.Travels.coverImg" />
				<div style="line-height: 3.8rem;" v-else>添加封面照片</div>
				<input type="file" accept="image/*"   @change="coverImage">
				<div class="appen_miuse" @click="appendMiuse">
					<p></p>
					<div class="miuseName" v-if="this.$store.state.Travels.miuseName">
						<span>{{this.$store.state.Travels.miuseName}}</span>
					</div>
					<font v-else>添加音乐</font>
					<audio v-if="this.$store.state.Travels.miuseName" id="a1" :src="this.$store.state.Travels.miusePath"></audio>
				</div>
				<div class="stop_miuse" @click="playOrStop"  v-if="this.$store.state.Travels.miuseName" >
					<img v-if="!miusePlaying" src="../../assets/game/common_btn_suspend@2x.png"/>
					<img  v-else  src="../../assets/game/common_btn_play@2x.png"/>
				</div>
			</div>
			<div class="title">
				<div>
					<van-cell-group>
						<van-field v-model="message" type="textarea" placeholder="请输入游记标题" @focus="onFocus" @blur="onBlur" :autosize="minHeight" maxlength="50" />
					</van-cell-group>
				</div>
				<div class="title_val">
					<font>可输入{{50-message.length}}字</font>
				</div>
			</div>
			<div class="location" @click="appendPlace">
				<span>
					<p></p>
					<font v-if="this.$store.state.Travels.cityName">{{this.$store.state.Travels.cityName}}</font><!--//???-->
					<font v-else>添加游记地点</font>
				</span>
			</div>
			<div class="appen_actial" v-if="this.$store.state.TravelsArticle.length == 0" @click="openBtn" v-show="!btn_show">
				<p></p>
			</div>
			<div class="item_btn" v-show="btn_show" v-if="this.$store.state.TravelsArticle.length == 0">
				<div class="btn_item" v-for="(v,i) in btn_item" @click="btn_choise(v,i,0,'appen')">
					<p><img :src="v.img" /></p>
					<font>{{v.name}}</font>
					<input type="file" v-if="i==1" @change="video" />
				</div>
			</div>
		</div>
		<div class="item" v-for="(v,index) in this.$store.state.TravelsArticle">
			<div class="appen_actial" v-if="articlesNum != index||lastBtn" @click="openAppend(index)">
				<p></p>
			</div>
			<div class="item_btn" v-if="articlesNum == index&&!lastBtn">
				<div class="btn_item" v-for="(v,i) in btn_item" @click="btn_choise(v,i,index,'appen')">
					<p><img :src="v.img" /></p>
					<font>{{v.name}}</font>
					<input type="file" v-if="i==1" @change="video" />
				</div>

			</div>
			<div  v-if="v.protection == 2">
				<a target="_blank" :href="v.content">
					<div class="item_img">
						<img v-if="v.path" :src="v.path"/>
						<img v-else :src="v.content"/>
					</div>
				</a>
				<div class="item_location">
				<div class="item_location_font" v-if="v.protection == 2">
					<div class="Spot" @click="goToSpot(index)" v-if="v.location">
						<p></p>
						<font>{{v.location}}</font>
					</div>
					<div class="notSpot" @click="goToSpot(index)" v-else>
						<p></p>
						<font>设置拍摄地点</font>
					</div>
				</div>
				<div class="delete" @click="openDelete(index)">
					删除
				</div>
			</div>
			</div>
			<div v-if="v.protection == 3" style="overflow: hidden;padding: 0 .24rem;">
				<h2  style=" float: left;width: 90%;word-break: break-all;">{{v.content}}</h2>
				<div style="float: right;color: #4BA8FF; font-size: 0.26rem;" @click="openDelete(index)">
						删除
				</div>
			</div>
			<div v-if="v.protection == 1"  style="overflow: hidden;padding: 0 .24rem;">
				<p v-html="v.content" style="float: left;width: 90%;word-break: break-all;"></p>
				<div style="float: right;color: #4BA8FF; font-size: 0.26rem;" @click="openDelete(index)">
						删除
				</div>
			</div>
			<div class="item_shop" v-if="v.protection == 4">
				<div v-if="v.obj">
					<div class="item_shop_img">
						<div class="item_shop_img_delet" @click="openDelete(index)">
							<p class="item_shop_delet_iocn"></p>
						</div>
						<img :src="v.obj.imagePath"/>
					</div>
					<div class="item_shop_font">
						<p>{{v.obj.name}}</p>
						<p>{{v.obj.dateNum}}天游玩</p>
						<div class="item_shop_font_bottom">
							<div class="item_shop_font_left">
								¥
								<font style="font-size: .24rem;">{{v.obj.price}}</font>起
							</div>
							<div style="margin-top: .15rem;" class="item_shop_font_right">
								月售{{v.obj.saleStat}}笔
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<div class="item_shop_img">
						<div class="item_shop_img_delet">
							<p class="item_shop_delet_iocn"></p>
						</div>
						<img :src="v.prod.imagePath"/>
					</div>
					<div class="item_shop_font">
						<p>{{v.prod.name}}</p>
						<p>{{v.prod.dateNum}}天游玩</p>
						<div class="item_shop_font_bottom">
							<div class="item_shop_font_left">
								¥
								<font style="font-size: .24rem;">{{v.prod.price}}</font>起
							</div>
							<div style="margin-top: .15rem;" class="item_shop_font_right">
								月售{{v.prod.saleStat}}笔
							</div>
						</div>
					</div>
				</div>

			</div>
			<div class="item_img" v-show="v.protection == 5">
				<!--<div id="id_test_video" style="width:100%; height:auto;"></div>-->
				<video x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="allow" webkit-playsinline playsinline  preload="auto" v-if="v.path" style="width: 100%;height: 100%;object-fit: fill" :src="v.path"  controls="controls"></video>
				<video x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="allow" webkit-playsinline playsinline  preload="auto" v-else style="width: 100%;height: 100%;object-fit: fill" :src="v.content"  controls="controls"></video>
				<!--<img v-if="v.path" :src="v.path"/>-->
				<div class="item_location">
					<div class="item_location_font" v-if="v.protection == 5">
						<div class="Spot" @click="goToSpot(index)" v-if="v.location">
							<p></p>
							<font>{{v.location}}</font>
						</div>
						<div class="notSpot" @click="goToSpot(index)" v-else>
							<p></p>
							<font>设置拍摄地点</font>
						</div>
					</div>
					<div class="delete" @click="openDelete(index)">
						删除
					</div>
				</div>
			</div>
		</div>
		<div class="appen_actial" v-if="this.$store.state.TravelsArticle.length > 0&&!lastBtn" @click="openLastBtn">
				<p></p>
		</div>
		<div class="item_btn"  v-show="lastBtn">
			<div class="btn_item" v-for="(v,i) in btn_item" @click="btn_choise(v,i,index,'last')">
				<p><img :src="v.img" /></p>
				<font>{{v.name}}</font>
				<input type="file" v-if="i==1" @change="video" />
			</div>
		</div>
		<div :style="[{'height':show?'0':'2rem'}]">

		</div>
		<div class="bottom_btn" :style="[{'position':show?'fixed':'static'}]">
			<div class="btn_item" @click="keep(1)">
				<p class="left_p"></p>
				<font>保存</font>
			</div>
			<div class="btn_item" @click="publish(2)">
				<p class="right_p"></p>
				<font>发表</font>
			</div>
		</div>

		<Delete v-show="ifDelete" @delete='sureDelete' @cancel="cancelDelete"></Delete>
	</div>
</template>

<script>
	import {Toast} from "vant"
	export default {

		created() {
			if(this.$route.query.id) {
				console.log(this.$store.state.Travels,"请求游记详情")
				console.log(this.$store.state.Travels,"Travels")
				console.log(this.$store.state.Travels.miuseName,"miuseName")
				if(this.$store.state.Travels.miuseName){
					this.musicName = this.$store.state.Travels.miuseName;
					this.musicPath = this.$store.state.Travels.miusePath
				}
				var obj = {
					a: 0,
					id: this.$route.query.id
				}
				if(this.$store.state.TravelsArticle.length == 0) { //是否有修改
					this.getWbDetail(obj)
				}else {
//					if(this.articles.length == 0){
//						this.getWbDetail(obj)
//					}else{
						this.articles =this.$store.state.TravelsArticle
//					}
				}

			}
//			this.getConfig()

//			else {
//				console.log("写新的游记")
//				console.log(!this.imagePath,this.imagePath)
//				if(!this.imagePath){
//					this.$store.state.Travels = {}
//				}
////
//			}
		},
		mounted() {
			if(!this.sites){//没有地点
				console.log(this.$store.state.Travels)
				if(this.$store.state.Travels.cityName){
					this.sites = this.$store.state.Travels.cityName
				}
			}

		},
		data() {
			return {
				ifKeep: 1, //是否草稿 1 是，2发表
				showkeep:false,
				message: " ",
				minHeight: {
					minHeight: 50
				},
				btn_item: [{
						name: "文字",
						img: require('../../assets/travels_btn_title@2x.png')
					},
					{
						name: "图片/视频",
						img: require('../../assets/travels_btn_pic@2x.png')
					},
					{
						name: "标题",
						img: require('../../assets/travels_btn_text@2x.png')
					},
					{
						name: "关联",
						img: require('../../assets/travels_btn_relation@2x.png')
					}
				],
				btn_show: false,
				ifDelete: false, //删除组件
				publish_show: false,
				alert_style: {
					background: "rgba(0,0,0,.3)"
				},
				articles: [], //游记模块
				sites: "", //游记地点
				imagePath: "", //封面图片
				coverImgId:null,//封面图片Id
				musicPath: "", //音乐路径
				musicName:"",
				articlesNum: null, //游记模块下标
				itemImage:"",//模块图片路径
				itmeImgId:null,//模块图片Id
				itemNum:null,//重那个位置插入
				sendItemImg:"",//模块图片上传路径
				sendTravels:[],//发表新的游记
				cityId:null,//
				siteIds:null,//游记地点
				deleteNum:null,//删除模块下标
				show:true,
				sendVideoPath:'',//视频地址
				player:null,
				lastBtn:false,
				audio_btn:null,
				miusePlaying:true,
			}
		},
		watch: {

			coverImg(a){
//				console.log(11111,a)
//				console.log(this.imagePath)
			}
		},
		updated(){
			console.log(this.appenList)
//			this.btn_show = false
			this.articles = this.appenList
		},
		methods: {
			getConfig() {
				let that=this
				let url = window.location.href.split('#')[0]
				this.$Api.Common.WxConfig({
					url: url
				}).then((res) => {
					this.config = { ...JSON.parse(res.q.config)
					}
					console.log(this.config)
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: this.config.appId, // 必填，公众号的唯一标识
						timestamp: this.config.timestamp, // 必填，生成签名的时间戳
						nonceStr: this.config.nonceStr, // 必填，生成签名的随机串
						signature: this.config.signature, // 必填，签名
						jsApiList: ["chooseImage"] // 必填，需要使用的JS接口列表
					});
                    wx.ready(()=>{

//                  	that.play()
                    })
					console.log(res)
				})

			},
			play(){
				this.audio_btn = document.getElementById('a1')
        		this.audio_btn.play();
        		this.miusePlaying =false//播放中
			},
			stop(){
				this.miusePlaying =true//播放中
				this.audio_btn.pause()
			},
			playOrStop(){
				if(this.miusePlaying){//播放中
					this.play()
				}else{
					this.stop()
				}
			},

			goToSpot(i){
				this.$router.push({
					name:"Spot",
					query:{
						index:i,
						type:"Travels"
					}
				})
			},
			onFocus(){
//				console.log(1)
				this.show=false
			},
			onBlur(){
//				console.log(2)
				setTimeout(()=>{
					this.show=true

				},20)

			},
			coverImage(e){
				var that = this
				let oFReader = new FileReader();
//				console.log(e.target.files[0])
				let imgData;
				var obj = {
					a: 1,
					type: 1,
					filename: e.target.files[0].name
				}
				if(e.target.files[0].type.indexOf("image") != -1) {
					obj.type = 1
				}
				if(e.target.files[0].type.indexOf("video") != -1) {
					obj.type = 2
				}

				this.$Api.Common.GetExternalUploadObject(obj).then((res) => {

					if(res.q.s == 0) {
						console.log(res.q.cos,1321)
						this.cos = res.q.cos
						let urlObj = {
							accessUrl: res.q.cos.accessUrl,
							sourceUrl: res.q.cos.sourceUrl
						}

						//上传图片到腾讯云
						this.$upLoadToCos(res.q.cos.url, e.target.files[0])
						this.getExternalFilesSubmit(urlObj, obj.type,"cover")

					}

				})
				oFReader.readAsDataURL(e.target.files[0]);
				oFReader.onload = function(oFREvent) {
					imgData = oFREvent.currentTarget.result;
					that.imagePath = imgData//本地图片路径，
					console.log(that.imagePath,"封面图片本地路径")
				}
			},
			video(e) {
				console.log(e)
				var that = this
				let oFReader = new FileReader();
				var fileSize = e.target.files[0].size/1048576;
//				console.log(e.target.files[0])
				if(fileSize <=4&&fileSize>0){
				let imgData;
				var obj = {
					a: 1,
					type: 1,
					filename: e.target.files[0].name
				}
				if(e.target.files[0].type.indexOf("image") != -1) {
					obj.type = 1
				}
				if(e.target.files[0].type.indexOf("video") != -1) {
					obj.type = 2
				}

				this.$Api.Common.GetExternalUploadObject(obj).then((res) => {

					if(res.q.s == 0) {
						console.log(res.q.cos,1321)
						this.cos = res.q.cos
						let urlObj = {
							accessUrl: res.q.cos.accessUrl,
							sourceUrl: res.q.cos.sourceUrl
						}

						//上传图片到腾讯云
						this.$upLoadToCos(res.q.cos.url, e.target.files[0])
						this.getExternalFilesSubmit(urlObj, obj.type,"item")//获取封面图片Id

					}

				})
				oFReader.readAsDataURL(e.target.files[0]);
				oFReader.onload = function(oFREvent) {
					imgData = oFREvent.currentTarget.result;
						that.itemImage = imgData
//					console.log(imgData,"模块图片本地路径")
				}
//				console.log(that.$store.state.TravelsArticle)
				}else{
					Toast('文件大小为0或者大于4M');
				}
			},
			getExternalFilesSubmit(urlObj, type,font) {
//				console.log(urlObj)
				let fileInfos = []
				fileInfos.push(urlObj)
				var obj = {
					a: 1,
					type: type,
					fileInfos: fileInfos
				}
				this.$Api.Common.ExternalFilesSubmit(obj).then((res) => {
					console.log(res)
					if(font == "cover"){
						this.$store.state.Travels.imgId	= res.q.ids[0] //封面图Id
//						this.$store.state.Travels.coverImg = res.q.files[0].path //封面图本地路径
					}else{
						if(type == 1) {
								this.itmeImgId = res.q.ids[0]
								this.sendItemImg = res.q.files[0].path
								var obj_a = {
									protection:2,
									path:this.itemImage,//回显的模块图片
									content:this.sendItemImg,//发生到后台的模块图片
									fileId:res.q.ids[0]
								}
							}else{
								this.sendVideoPath = res.q.files[0].path
								var obj_a = {
									protection:5,
									fileId:res.q.ids[0],
									path:this.itemImage,//回显的模块图片
									content:this.sendVideoPath,//发生到后台的模块视频
								}
							}
						console.log(obj_a)
						console.log(this.itemNum,"下标")

						if(this.itemNum != undefined){
							this.$store.state.TravelsArticle.splice(this.itemNum,0,obj_a)
						}else{
							this.$store.state.TravelsArticle.push(obj_a)
						}


					}

				})

			},
			openAppend(index) {
				this.articlesNum = index
				this.lastBtn = false;
			},
			getWbDetail({
				a,
				id
			}) {
				this.$Api.UserPage.WbDetail({
					a,
					id
				}).then((res) => {
					this.articles = [...res.q.article.articles];//模块
					this.$store.state.TravelsArticle = [...res.q.article.articles];
					this.message = res.q.article.title;
					this.$store.state.Travels.title = this.message;//存放到store
//					this.sites = res.q.article.sites;//游记地点
					this.$store.state.Travels.cityName = res.q.article.sites;//游记地点
					this.imagePath = res.q.article.imagePath//封面图片路径
					this.$store.state.Travels.coverImg = res.q.article.imagePath//封面图片路径
//					this.musicPath = res.q.article.musicPath//音乐路径
//					this.musicName = res.q.article.musicName//音乐名字
					this.$store.state.Travels.miuseName = res.q.article.musicName;
					this.$store.state.Travels.miusePath = res.q.article.musicPath;
					this.$store.state.Travels.miuseId = res.q.article.musicId//音乐Id
//					this.coverImgId = res.q.article.imageId//封面图片ID
					this.$store.state.Travels.imgId = res.q.article.imageId//存放封面图片
//					this.siteIds = res.q.article.siteIds//游记地点ID
					this.$store.state.Travels.siteIds = res.q.article.siteIds//游记地点ID
				})
			},
			WbSubmit() {
				var list = this.$store.state.TravelsArticle;
					let spotIds =[];
					for(var i=0;i<list.length;i++){
						delete(list[i]['path'])
						if(list[i].protection == 2||list[i].protection == 5){
							if(list[i].scenicSpot){
								spotIds.push(list[i].scenicSpot)
							}
						}
					}
						var obj ={
							a:this.ifKeep,
							id:this.$route.query.id,
							imageId:this.$store.state.Travels.imgId,
							musicId:this.$store.state.Travels.miuseId,
							destinationIds:this.$store.state.Travels.siteIds,
							title:this.message,
							spotIds:spotIds.length>0?spotIds.join(","):0,
							contents:list,
						}
//						if(this.message){
//							console.log(this.message,"gdsgfdsf")
//							obj.title = this.message
//						}
						console.log(obj,"dgdfgdfghdfg")
				if(!obj.title){
					Toast("请输入标题")
				}else if(!obj.destinationIds){
					Toast("请选择地点")
				}else if(obj.contents.length == 0){
					Toast("请输入游记内容")
				}else if(!obj.imageId){
					Toast("请选择封面图片")
				}else{
					console.log(11111)
					this.$Api.UserPage.WbSubmit(obj).then((res) => {
						console.log(res)
						if(this.ifKeep == 1){
							if(this.showkeep){
								if(res.q.s == 0){
									this.$toast("保存成功", "success")
									this.$router.go(-1)
								}else{
			//						this.$toast("保存成功", "success")
								}
							}

						}else{
							if(this.showkeep){
								if(res.q.s == 0){
									this.$toast("发表成功", "success")
									this.$router.go(-1)
								}else{
			//						this.$toast("保存成功", "success")
								}
							}

						}
					})
				}

			},
			keep() {
				this.ifKeep = 1;
				this.showkeep = true
				this.WbSubmit()
			},
			publish() {
				this.ifKeep = 2
				this.showkeep = true
				this.WbSubmit()
//				this.$toast("发表成功", "success")

			},
			btn_choise(item, index, i,type) {
				console.log(i,213214214)
				this.itemNum = i
				if(type == "appen"){
					if(index == 0) {
						console.log("文字")
						this.$router.push({
							name: "TravelsArticle",
							query: {
								id: this.$route.query.id,
								index: i,
								type:"send"
							}
						})
					} else if(index == 1) {
						console.log("图片/视频")
					} else if(index == 2) {
						this.$router.push({
							name: "TravelsTitle",
							query: {
								id: this.$route.query.id,
								index: i,
								type:"send"
							}
						})
						console.log("标题")
					} else if(index == 3) {
						console.log("关联")
						this.$router.push({
							name: "SeachShop",
							query: {
								id: this.$route.query.id,
								index: i,
								type:"send"
							}
						})

					}
				}else{
					if(index == 0) {
						console.log("文字")
						this.$router.push({
							name: "TravelsArticle",
							query: {
								id: this.$route.query.id,
								index: i,
								type,
							}
						})
					} else if(index == 1) {
						console.log("图片/视频")
					} else if(index == 2) {
						this.$router.push({
							name: "TravelsTitle",
							query: {
								id: this.$route.query.id,
								index: i,
								type,
							}
						})
						console.log("标题")
					} else if(index == 3) {
						console.log("关联")
						this.$router.push({
							name: "SeachShop",
							query: {
								id: this.$route.query.id,
								index: i,
								type,
							}
						})

					}
				}
			},
			openBtn() {
				this.btn_show = true
				this.lastBtn = false;
			},
			openLastBtn(){
				this.lastBtn = true;
				this.btn_show = false;
				console.log(231321)
			},
			appendMiuse() {
				this.$router.push({
					name: "SeachMiuse",
					query:{
						id:this.$route.query.id,
						type:"Travels"
					}
				})
			},
			appendPlace() {
				this.$router.push({
					name: "Place",
					query:{
						id:this.$route.query.id
					}
				})
			},
			openDelete(index) {
				this.deleteNum = index
				this.ifDelete = true
			},
			sureDelete() {
				console.log("确认删除")
				this.$store.state.TravelsArticle.splice(this.deleteNum,1)
				console.log(this.$store.state.TravelsArticle)
				this.ifDelete = false
			},
			cancelDelete() {
				console.log("取消删除")
				this.ifDelete = false
			}
		},
		computed: {

			coverImg(){
//				console.log(this.imagePath)
				if(this.imagePath){
					console.log("封面图片",this.imagePath)
					return this.imagePath
				}else{
					console.log("没有封面图片")
					return
				}
			},
			appenList(){
//				console.log(this.$store.state.TravelsArticle)
				if(this.$store.state.TravelsArticle.length == 0){
					console.log("没有变化")
					return this.$store.state.TravelsArticle
				}else{
//					console.log(this.$store.state.TravelsArticle,'增加变化')
					return this.$store.state.TravelsArticle
				}
			},
		},
		beforeRouteEnter(to,from,next){
			console.log(from)
			next((vm)=>{ //参数vm就是当前组件的实例。
				if(from.name != "UserPage"){
					vm.imagePath = vm.$store.state.Travels.coverImg;
					vm.message = vm.$store.state.Travels.title;
				}

            })
		},
		beforeRouteLeave(to,from,next){
			next()
			this.$store.state.Travels.title = this.message
			if(to.name == "UserPage"){
				console.log("是否取消操作")
				this.$store.state.Travels = {}
			}else{
//				console.log(this.$store.state.Travels.title)
//				this.WbSubmit()
			}


		},
	}
</script>

<style scoped="scoped" lang="less">
.miuseName{
	float: left;
	width: 1.42rem;
	overflow: hidden;
	position: relative;
	height: 100%;
	span{
		padding-left: .1rem;
		position: absolute;
		left: 0%;
		transform: translateX(0);
		font-weight: 400;
		animation:moveLeftToRight 10s linear infinite ;
		animation: moveLeftToRight 10s linear infinit;
		/* Firefox: */
		-moz-animation: moveLeftToRight 10s linear infinit;
		/* Safari 和 Chrome: */
		-webkit-animation:moveLeftToRight 10s linear infinit;
		/* Opera: */
		-o-animation: moveLeftToRight 10s linear infinit;
	}
}
	@keyframes moveLeftToRight{
		/*0%   {transform: translateX(0);}*/
		10%  {transform: translateX(0%);}
		20%  {transform: translateX(-25%);}
		30%  {transform: translateX(-50%);}
		40%  {transform: translateX(-75%);}
		50%  {transform: translateX(-100%);}
		60%  {transform: translateX(-75%);}
		70%  {transform: translateX(-50%);}
		80%  {transform: translateX(-25%);}
		90%  {transform: translateX(0%);}
		100%  {transform: translateX(0);}


	}
img{
			width: 100%;
			height: 100%;
		}
		.item_btn {
		padding: .4rem 0;
		display: flex;
		justify-content: space-around;
		-webkit-justify-content: space-around;
		-moz-justify-content: space-around;
		-ms-justify-content: space-around;
		-o-justify-content: space-around;
		.btn_item {
			/*width: 100%;*/
			position: relative;
			input {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
			}
			p {
				float: left;
				width: .5rem;
				height: .5rem;
			}
			font {
				padding-left: .15rem;
				line-height: .55rem;
			}
		}
	}
	.warp {
		padding-bottom: .98rem;
	}

	.bottom_btn {
		width: 100%;
		height: .98rem;
		background: #FADC56;
		position: fixed;
		bottom: 0;
		display: flex;
		font-size: .3rem;
		.btn_item {
			width: 50%;
			padding: .29rem 1.2rem;
			.left_p {
				background-image: url(../../assets/travels_icon_save@2x.png);
				width: 0.43rem;
				height: 0.39rem;
			}
			.right_p {
				width: 0.43rem;
				height: 0.39rem;
				background-image: url(../../assets/travels_icon_sub@2x.png);
			}
			p {
				float: left;
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
			font {
				padding-left: .15rem;
			}
		}
	}

	.appen_img {
		width: 100%;
		height: 3.8rem;
		background: #EDEDED;
		color: #999999;
		text-align: center;
		position: relative;
		input{
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0;
		}
		.appen_miuse {
			position: absolute;
			width: 2.1rem;
			height: 0.6rem;
			background: rgba(0, 0, 0, .5);
			bottom: 0.4rem;
			right: 0;
			text-align: center;
			line-height: 0.6rem;
			color: #FFF;
			font-size: 0.22rem;
			border-bottom-left-radius: 1rem;
			border-top-left-radius: 1rem;
			text-overflow: ellipsis;
		    overflow: hidden;
		    white-space: nowrap;
			p {
				width: 0.4rem;
				height: 0.4rem;
				background-image: url(../../assets/travels_icon_music@2x.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				float: left;
				margin-top: .1rem;
				margin-left: .25rem;
			}
		}
		.stop_miuse{
			background: rgba(0, 0, 0, .5);
			width: .6rem;
			height: .6rem;
			border-radius: 50%;
			position: absolute;
			bottom: .4rem;
			right: 2.2rem;
			padding-top: .05rem;
			img{
				width: 40%;
				height: 50%;
				/*text-align: center;*/
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}

	.title {
		padding: .3rem .25rem;
		border-bottom: 0.01rem solid #EDEDED;
		h3 {
			font-weight: 600;
			font-size: .36rem;
		}
		.title_val {
			overflow: hidden;
			font {
				font-size: .22rem;
				color: #333333;
				line-height: .8rem;
				float: right;
			}
		}
	}

	.location {
		height: 1rem;
		padding: .3rem .25rem;
		border-bottom: 0.01rem solid #EDEDED;
		color: #999999;
		font-size: .22rem;
		p {
			width: 0.35rem;
			height: 0.4rem;
			background-image: url(../../assets/tab_btn_location_pre@2x.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			float: left;
		}
		font {
			padding-left: 0.11rem;
		}
	}

	.appen_actial {
		height: 1.29rem;
		position: relative;
		p {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: .5rem;
			height: .5rem;
			background-image: url(../../assets/travels_btn_add@2x.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
	}

	.item {
		overflow: hidden;
		.item_shop {
			padding: 0 .25rem;
			overflow: hidden;
			.item_shop_img {
				float: left;
				width: 2rem;
				height: 2rem;
				background-image: url(../../../static/img/1.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				position: relative;
				.item_shop_img_delet {
					position: absolute;
					top: 0;
					left: 0;
					width: .5rem;
					height: .5rem;
					background: rgba(0, 0, 0, .2);
					.item_shop_delet_iocn {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: .25rem;
						height: .25rem;
						background-image: url(../../assets/travels_btn_del@2x.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
					}
				}
			}
			.item_shop_font {
				float: left;
				padding-left: .3rem;
				width: 4.7rem;
				p:nth-of-type(1) {
					font-size: 0.26rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1)
				}
				p:nth-of-type(2) {
					padding-top: .15rem;
					font-size: 0.22rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
				}
				.item_shop_font_bottom {
					padding-top: .55rem;
					overflow: hidden;
					.item_shop_font_left {
						float: left;
						font-size: 0.2rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(246, 50, 62, 1);
					}
					.item_shop_font_right {
						float: right;
						font-size: 0.22rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
					}
				}
			}
		}
	}

	.item_img {
		height: 3.8rem;
		background-image: url(../../assets/placeholder_750x440.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.item_location {
		height: 1rem;
		padding: .3rem .25rem;
		border-bottom: 0.01rem solid #EDEDED;
		color: #999999;
		font-size: .22rem;
		.item_location_font {
			float: left;
			width: 90%;
		}
		p {
			width: 0.35rem;
			height: 0.4rem;
			background-image: url(../../assets/tab_btn_location_pre@2x.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			float: left;
		}
		font {
			padding-left: 0.11rem;
		}
		.delete {
			float: right;
			color: #4BA8FF;
			font-size: .26rem;
			width: 10%;
		}
	}



	.delet_warp {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 2000;
		background: rgba(0, 0, 0, .5);
	}

	.delet_sure {
		position: fixed;
		box-sizing: border-box;
		width: 5.56rem;
		height: 3.7rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		z-index: 2000;
		border-radius: 0.1rem;
		.delet_sure_top {
			height: 2.84rem;
			text-align: center;
			line-height: 2.84rem;
		}
		.delet_sure_btn {
			height: 0.86rem;
			background: #FCE790;
			position: relative;
			.delet_sure_btn_item {
				width: 50%;
				text-align: center;
				line-height: .86rem;
				font-size: .3rem;
				color: #333333;
				float: left;
			}
			.shu {
				position: absolute;
				width: 0.02rem;
				height: 0.44rem;
				background: rgba(255, 255, 255, 1);
				top: 0.2rem;
				left: 2.78rem;
			}
		}
	}
</style>
<style type="text/css">
	.tips {
		.van-popup {
			background: transparent;
		}
	}
</style>
