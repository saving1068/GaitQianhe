<template>
	<div style="background:#FFFFFF;position:relative;">
		<div class="topBox">
			<img :src="list.imagePath" class="background" />
			<div class="content">
				<div class="title" style="text-align: center;">
					{{list.title}}
				</div>
				<div class="mid">
					<div class="line" style="margin-right: 0.35rem;">

					</div>
					<span>{{list.sites}}</span>
					<div class="line" style="margin-left: 0.35rem;">

					</div>
				</div>
				<div class="avatar" @click="go('OtherPage')">
					<img :src="list.authorImage" />

				</div>
				<p style="text-align: center;font-size: 0.22rem;color: #CCCCCC;margin-top: 0.2rem;margin-bottom:0.3rem;">{{list.authorName}}</p>

				<div :class="['music',musicPath&&playFlag?'isAnimation':'']" @click="music">
					<img src="../../assets/home/home_icon_music@3x.png">
					<audio :src="musicPath" v-show="musicPath" loop id="audio" preload="auto">

					</audio>
				</div>
				<div class="bottom">
					<i class="date"></i>
					<span style="margin-left: 0.11rem;">{{list.date}}</span>
					<i class="see"></i>
					<span>{{list.browseNum}}</span>
				</div>

			</div>
		</div>
		<div class="midBox">
			<div v-for="(item,index) in list.articles" :key="item.id">
				<div class="title" v-if="item.protection==3">
					{{item.content}}
				</div>
				<div class="imgBox" v-if="item.protection==2">
					<img :src="item.content" />
					<div class="bottom_add">
						<div class="left" v-if="item.location">
							<i></i>
							<span>{{item.location}}</span>
						</div>
						<div class="right">

							<span>{{item.sectionLikeNum}}</span> <i @click="favorite(item.id,item.isSection,index)" :class="[item.isSection==1?'active':'']"></i>
						</div>
					</div>
				</div>
				<div class="textBox" v-if="item.protection==1">
					<div class="content" v-html="item.content"></div>
					<div class="bottom_add">
						<div class="left" v-if="item.location">
							<i></i>
							<span>{{item.location}}</span>
						</div>
						<div class="right">

							<span>{{item.sectionLikeNum}}</span> <i @click="favorite(item.id,item.isSection,index)" :class="[item.isSection==1?'active':'']"></i>
						</div>
					</div>
				</div>
				<div class="itemBox" v-if="item.protection==4" @click="go('ShoppingMallDetails',item.prod.spuId)">
					<div class="mid">
						<div class="left">
							<img :src="item.prod.imagePath" />
						</div>
						<div class="right">
							<div class="top_text">{{item.prod.name}}

							</div>
							<div class="bottom_text">
								<div class="leftBox">
									<i></i><span>{{item.prod.groupUserNum}}人在拼团~！</span>
								</div>
								<div class="rightBox">
									<span style="font-size: 0.2rem;">¥</span>
									<span style="font-size: 0.32rem;">{{item.prod.price}}</span>
									<span style="font-size: 0.22rem;">起</span>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="video" v-if="item.protection==5">


          <div class="videoBox"  v-if="item.protection==5">
						<video :class="'video_content'+index" x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="allow" webkit-playsinline playsinline :src="item.content"  preload="auto"  @ended="videoEnd(index)"  @canplaythrough="canplay(index)">

						</video>
						<div class="stop" v-if="item.videoFlag" @click="stop(index)">
	                         <i></i>
						</div>
						<div class="full" v-if="item.videoFlag" @click="fullScreen(index)">
							<i></i>

						</div>
						<div class="mask" v-if="item.videoFlag==false" @click="playVideo(index)">
							<i></i>
							<span>{{item.videoDuration}}</span>
						</div>
          </div>
					<div class="bottom_add" >
						<div class="left" v-if="item.location">
							<i></i>
							<span>{{item.location}}</span>
						</div>
						<div class="right">

							<span>{{item.sectionLikeNum}}</span> <i @click="favorite(item.id,item.isSection,index)" :class="[item.isSection==1?'active':'']"></i>
						</div>
					</div>
					</div>
			</div>

		</div>
		<div class="line"></div>
		<div class="questionBox">
			<div class="top">
				<span>问大家</span><span v-if="questionTotal>0">（{{questionTotal}}）</span>
				<span class="right" @click="go('Question')">查看全部</span>
				<i></i>
			</div>
			<div class="bottom" v-if="querstList.length>0">
				<div class="item" v-for="item in querstList " :key="item.id">
					<i class="icon"></i>
					<span class="first">{{item.content}}</span>
					<span class="second">{{item.answerNum}}个回答</span>
				</div>
			</div>
			<div class="noData" v-if="querstList.length==0">
				暂无问答信息
			</div>
		</div>
		<div class="line"></div>
		<div class="evaluateBox">
			<div class="top">
				<span>用户评价</span><span v-if="commentsTotal>0">（{{commentsTotal}}）</span>
				<span class="right" @click="go('Comment')">查看全部</span>
				<i></i>
			</div>
			<div class="bottom" v-if="commentsList.length>0">
				<div class="item" v-for="item in commentsList" :key="item.id" @click="go('Comment')">
					<div class="topBox">
						<div class="avatar">
							<img :src="item.imagePath" />
						</div>
						<span style="margin-left: 0.11rem;float: left;">{{item.name}}</span>
						<span style="float: right;float: right;">{{item.comTime}}</span>
					</div>
					<div class="content">
						{{item.content}}

					</div>

				</div>
			</div>
       <div class="noData" v-if="commentsList.length==0">
          暂无评价信息
       </div>

			<div style="height: 1rem;"></div>
		</div>

		<div class="bottomBox">
			<li @click="share">
				<i class="share">

              	</i>
				<p>{{list.shareNum}}</p>
			</li>
			<li @click="go('Comment')">
				<i class="talk"></i>
				<p>{{list.commentNum}}</p>
			</li>
			<li @click="go('Question')">
				<i class="question"></i>
				<p>{{list.questionNum}}</p>
			</li>
			<li @click="tofavorite(list.id,list.isFavorite)">
				<i :class="[list.isFavorite==1?'active':'star']"></i>
				<p>{{list.collectNum}}</p>
			</li>

		</div>
      <div class="goHome" v-if="isShare" @click="goHome">
          <div></div>
					<p>首页</p>
      </div>
	</div>
</template>

<script>
import {Toast} from 'vant'
	export default {
		data() {
			return {
				id: this.$route.query.id,
				list: {},
				commentsList: [],
				commentsTotal: 0,
				querstList: [],
				questionTotal: 0,
				musicPath:"",
				playFlag:true,
				favFlag:false,
				isShare:false,
				tofavFlag:false
			}
		},
		created() {
			this.getData()
    if(window.sessionStorage.getItem("shareId")){

   this.isShare=true
		}


		},
		mounted() {
			this.getComment()
			this.getQuestion()

		},
		methods: {
			goHome(){

				window.sessionStorage.removeItem("shareId")
         this.$router.push({
					 name:"Home"
				 })

			},
			playVideo(index){
        let video = document.getElementsByClassName("video_content"+index)[0]
				for(let i=0;i<this.list.articles.length;i++){
					if(this.list.articles[i].protection==5){
						this.$set(this.list.articles[index],"videoFlag",false)
						if(i!=index){
							this.videoLoad(i)

						}
					}
				}
				 this.$set(this.list.articles[index],"videoFlag",true)

				 if(window.WeixinJSBridge) {
 					WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
						 video.play()
 						video.webkitEnterFullscreen()
 					}, false);
 				} else {
 					document.addEventListener("WeixinJSBridgeReady", function() {
 						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							 video.play()
 							video.webkitEnterFullscreen()
 						});
 					}, false);
 				}

 				return false;
			},
			stop(index){
				let video = document.getElementsByClassName("video_content"+index)[0]
				this.$set(this.list.articles[index],"videoFlag",false)
				 	video.pause()
			},
			fullScreen(index){
					let video = document.getElementsByClassName("video_content"+index)[0]
				if(window.WeixinJSBridge) {
					WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
						video.webkitEnterFullscreen()
					}, false);
				} else {
					document.addEventListener("WeixinJSBridgeReady", function() {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							video.webkitEnterFullscreen()
						});
					}, false);
				}
					return false;
			},
			videoEnd(index){
        let video = document.getElementsByClassName("video_content"+index)[0]

				// this.list.articles[index]["videoFlag"] = false;
             this.$set(this.list.articles[index],"videoFlag",false)

			},

			canplay(index){
			let video = document.getElementsByClassName("video_content"+index)[0]

				let all = Math.floor(video.duration)
				let second = "";
				if(all % 60 < 10) {
					second = "0" + all % 60

				} else {
					second = all % 60
				}
				this.$set(this.list.articles[index],"videoDuration",Math.floor(all / 60) + ":" + second)
					// this.list.articles[index]["videoDuration"] = Math.floor(all / 60) + ":" + second;

			},
			share(){
         	this.$share("分享给更多好友")

			},
			music() {
          if(!this.musicPath){
						Toast({
							message: "此游记无背景音乐",
							forbidClick: true,
							position: 'center',
							duration: 2000
						});
					}
					let audio=document.getElementById("audio")
          let that=this
					if(window.WeixinJSBridge) {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							if(audio.paused){
								audio.play()
								that.playFlag=true
							}else{
								audio.pause()
								that.playFlag=false
							}

						}, false);
					} else {
						document.addEventListener("WeixinJSBridgeReady", function() {
							WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
								if(audio.paused){
									audio.play()
									that.playFlag=true
								}else{
									audio.pause()
									that.playFlag=false
								}

							});
						}, false);
					}


			},
			play(){
        if(this.musicPath!=""){
					let audio=document.getElementById("audio")
					if(window.WeixinJSBridge) {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							audio.play();

						}, false);
					} else {
						document.addEventListener("WeixinJSBridgeReady", function() {
							WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
								audio.play();

							});
						}, false);
					}

				}

			},
			favorite(id, isPraise,index) {
				let flag=false
				let obj = {
					a: 1,
					id:id

				}
        if(!this.favFlag){
					flag=true
				}else{
					return ;
				}
       this.favFlag=true
				if(isPraise == 1) {
					obj.open = 0
				} else {
					obj.open = 1
				}
        if(this.favFlag&&flag){
					this.$Api.Home.PraiseSwitch(obj).then((res) => {
						if(res.q.s == 0) {
							// this.getData()
							this.list.articles[index].isSection=obj.open
							if(obj.open==1){
								this.list.articles[index].sectionLikeNum+=1
							}else{
									this.list.articles[index].sectionLikeNum-=1
							}
							this.favFlag=false
							if(obj.open == 1) {
								this.$toast("点赞成功", "success")

							}
						}

					})
				}


			},
			tofavorite(id, isPraise){
					let flag=false
				let obj = {
					a: 1,
					id:id

				}

				if(isPraise == 1) {
					obj.open = 2
				} else {
					obj.open = 1
				}
				if(!this.tofavFlag){
					flag=true
				}else{
					return ;
				}
			 this.tofavFlag=true
			 if(this.tofavFlag&&flag){
					this.$Api.My.Favorite(obj).then((res) => {
					if(res.q.s == 0) {
          this.tofavFlag=false;
						setTimeout(()=>{

						this.getData()
						if(obj.open == 1) {
							this.$toast("收藏成功", "success")

						}

						},300)

					}

				})

    }
			},

			getQuestion() {
				let obj = {
					a: 3,
					type: 1,
					id: this.id
				}
				this.$Api.Home.QuestionsList(obj).then((res) => {
					if(res.q.questions.length > 0) {
						this.querstList = [...res.q.questions]

					}
					this.questionTotal = res.q.total
					console.log(res)
				})

			},
			getConfig() {

				let that=this;
				let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=TravelDetails&shareId=" + this.$store.state.Home.user.id +"&id="+this.$route.query.id;
				console.log(url)

					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
						timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
						nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
						signature: this.$store.state.config.signature, // 必填，签名
						jsApiList: ['chooseImage', 'updateAppMessageShareData', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
					});


				wx.ready(function() { //需在用户可能点击分享按钮前就先调用
					if(wx.onMenuShareAppMessage){
						wx.onMenuShareAppMessage({
			        title:  that.list.title, // 分享标题
			        desc: '步履千行', // 分享描述
			        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
			        type: 'link', // 分享类型,music、video或link，不填默认为link
			        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			        success: function(res) {
						console.log(res)
								that.shareSuccess()
			          // 用户点击了分享后执行的回调函数
			        },
							cancel:function(){
                  console.log(1)
							}
			      })
					}else{
						wx.updateAppMessageShareData({
			        title: that.list.title, // 分享标题
							  desc: '步履千行', // 分享描述
			        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							success: function (res) {
								console.log(res)
		          // 设置成功
		        }
					});
					}





		    });

			},
			shareSuccess(){
          this.$Api.Common.ShareTask({a:7,id:this.list.id}).then((res)=>{
						console.log(res)
						if(res.q.s==0){
							this.$toast("分享成功","success")
						}
					})

			},
			getComment() {
				let obj = {
					id: this.id,
					a: 1
				}
				this.$Api.Home.CommentList(obj).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						if(res.q.comments.length > 2) {
							this.commentsList = [...res.q.comments.splice(0, 2)]
						} else if(res.q.comments.length > 0) {
							this.commentsList = [...res.q.comments]
						}

						for(let i=0;i<this.commentsList.length;i++){

							if(this.commentsList[i].comTime.indexOf("分")!=-1){
 	 						var index=	this.commentsList[i].comTime.indexOf("分")
 	 						var num=this.commentsList[i].comTime.substr(0,index)

 	 						if(Number(num)<1){
 	 							this.commentsList[i].comTime="刚刚"
 	 						}

 	 						}

						}


						this.commentsTotal = res.q.total
					}
				})

			},
			go(text,id) {
      if(text=="OtherPage"){
				this.$router.push({
				name: text,
				query: {
					id: this.list.userId
				}
			})
		}else if(text=="ShoppingMallDetails"){
			this.$router.push({
			name: text,
			query: {
				spuId:id
			}
		})

	}else if(text=="Comment"){
		this.$router.push({
		name: text,
		query: {
			id: this.id,
			a:1
		}
	})
	}

			else{
				this.$router.push({
				name: text,
				query: {
					id: this.id
				}
			})
			}



			},
			videoLoad(i){
				let video = document.getElementsByClassName("video_content"+i)[0]


				if(window.WeixinJSBridge) {
					WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
						video.load();

					}, false);
				} else {
					document.addEventListener("WeixinJSBridgeReady", function() {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							video.load();
						});
					}, false);
				}

				return false;


			},
		async	getData() {

				this.$Api.Home.WbDetail({
					id: this.id
				}).then((res) => {
					console.log(res)
					this.list = { ...res.q.article
					}
					for(let i=0;i<this.list.articles.length;i++){
						if(this.list.articles[i].protection==5){

								this.$set(this.list.articles[i],"videoFlag",false)
								this.$set(this.list.articles[i],"videoDuration","")

							this.videoLoad(i)
						}
					}
					if(this.musicPath==""){
						this.musicPath=this.list.musicPath
						this.play()
					}
          this.getConfig()
					this.$loading.clear()
				})
			}
		},
		beforeRouteLeave(to,from,next){

			if(to.name=="HomeSearch"){
				console.log(document.body.scrollTop)
			}
			next()
		}

	}
</script>

<style scoped="scoped" lang="scss">
.goHome{
	width: 1rem;
	height: 1rem;
	position: fixed;
	left: 0.3rem;
	bottom: 2.54rem;
	background: rgba(0,0,0,0.5);
	border-radius: 50%;
	z-index:9999;
	div{
    margin: auto;
		margin-top: 0.2rem;
		width: 0.12rem;
		height: 0.22rem;
		background: url('../../assets/location_btn_array@2x.png') no-repeat;
		transform: rotate(90deg);
		background-size: 100% 100%;


	}
	p{
		text-align:center;
		color: #ffffff;
		font-size: 0.24rem;

		width: 100%;
	}
}
.video{
	.bottom_add {
		height: 16px;
		line-height: 16px;
		margin-top: 0.3rem;
		margin-bottom: 0.25rem;
		padding: 0 0.25rem;
		box-sizing: border-box;
		.left {
			float: left;
			height: 100%;
			position: relative;
			i {
				width: 14px;
				height: 16px;
				// float: left;
				background: url(../../assets/home/home_icon_Location@3x.png) no-repeat;
				background-size: 100% 100%;
				position: absolute;
        top: 50%;
				margin-top: -8px;
			}
			span {
				color: #999999;
				font-size: 12px;
				margin-left: 24px;
			}
		}
		.right {
			float: right;
			margin-right:14px;
			padding-right: 0.2rem;
			position: relative;
      	height: 100%;
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			span {
				font-size: 12px;
				color: #999999;

			}
			i {
				width: 14px;
				height: 12px;
				background: url(../../assets/home/home_icon_heart_nor@3x.png) no-repeat;
				background-size: 100% 100%;
				position: absolute;
				top: 50%;
				margin-top: -6px;
				right:-14px;
			}
			.active {
				background: url(../../assets/home/home_icon_heart_pre@3x.png) no-repeat;
				background-size: 100% 100%;
			}
		}
	}
}
	.midBox {
		padding-top: 0.3rem;
		.title {
			padding: 0 0.25rem;
		}
		.textBox {

			position: relative;
			.bottom_add {
				height: 16px;
				line-height: 16px;
				margin-top: 0.3rem;
				margin-bottom: 0.25rem;
				padding: 0 0.25rem;
				box-sizing: border-box;
				.left {
					float: left;
					height: 100%;
					position: relative;
					i {
						width: 14px;
						height: 16px;
						// float: left;
						background: url(../../assets/home/home_icon_Location@3x.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
		        top: 50%;
						margin-top: -8px;
					}
					span {
						color: #999999;
						font-size: 12px;
						margin-left: 24px;
					}
				}
				.right {
					float: right;
					margin-right:14px;
					padding-right: 0.2rem;
					position: relative;
		      	height: 100%;
					display: flex;
					display: -webkit-box;
					/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
					display: -moz-box;
					/* 老版本语法: Firefox (buggy) */
					display: -ms-flexbox;
					/* 混合版本语法: IE 10 */
					display: -webkit-flex;
					/* 新版本语法: Chrome 21+ */
					span {
						font-size: 12px;
						color: #999999;

					}
					i {
						width: 14px;
						height: 12px;
						background: url(../../assets/home/home_icon_heart_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
						top: 50%;
						margin-top: -6px;
						right:-14px;
					}
					.active {
						background: url(../../assets/home/home_icon_heart_pre@3x.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
			.title {
				font-size: 0.3rem;
				margin-bottom: 0.2rem;
			}
			.content {
				padding: 0.3rem 0.25rem 0.4rem;
				font-size: 0.26rem;
				color: #666666;
				margin-bottom: 0.22rem;
				word-break: break-all;
			}
			.bottom_fav {
				position: absolute;
				right: 0.25rem;
				bottom: 0.37rem;
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				span {
					font-size: 0.26rem;
					color: #999999;
				}
				i {
					width: 0.26rem;
					height: 0.22rem;
					background: url(../../assets/home/home_icon_heart_nor@3x.png) no-repeat;
					background-size: 100%;
					position: relative;
					top: 0.03rem;
					margin-left: 0.12rem;
				}
			}
		}
		.imgBox {
			margin-bottom: 0.3rem;
			.title {
				padding: 0 0.25rem;
				margin-bottom: 0.27rem;
			}
			img {
				width: 100%;
				height: 3.8rem;
			}
			.bottom_add {
				height: 16px;
				line-height: 16px;
				margin-top: 0.3rem;
				margin-bottom: 0.25rem;
				padding: 0 0.25rem;
				box-sizing: border-box;
				.left {
					float: left;
					height: 100%;
					position: relative;
					i {
						width: 14px;
						height: 16px;
						// float: left;
						background: url(../../assets/home/home_icon_Location@3x.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
		        top: 50%;
						margin-top: -8px;
					}
					span {
						color: #999999;
						font-size: 12px;
						margin-left: 24px;
					}
				}
				.right {
					float: right;
					margin-right:14px;
					padding-right: 0.2rem;
					position: relative;
		      	height: 100%;
					display: flex;
					display: -webkit-box;
					/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
					display: -moz-box;
					/* 老版本语法: Firefox (buggy) */
					display: -ms-flexbox;
					/* 混合版本语法: IE 10 */
					display: -webkit-flex;
					/* 新版本语法: Chrome 21+ */
					span {
						font-size: 12px;
						color: #999999;

					}
					i {
						width: 14px;
						height: 12px;
						background: url(../../assets/home/home_icon_heart_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
						top: 50%;
						margin-top: -6px;
						right:-14px;
					}
					.active {
						background: url(../../assets/home/home_icon_heart_pre@3x.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
		}
	}

	.evaluateBox {
		padding: 0 0.24rem;
		box-sizing: border-box;
		.top {
			height: 0.75rem;
			border-bottom: 0.01rem solid #EDEDED;
			position: relative;
			line-height: 0.86rem;
			span {
				font-size: 0.26rem;
			}
			.right {
				float: right;
				color: #747474;
				margin-right: 0.3rem;
				font-size: 0.24rem;
			}
			i {
				top: 0.35rem;
				right: 0;
				position: absolute;
				width: 0.09rem;
				height: 0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
			}
		}
		.bottom {
			margin-bottom: 0.4rem;
			.item {
				border-bottom: 0.02rem solid #EDEDED;
				padding: 0.4rem 0;
				.topBox {
					height: 0.4rem;
					.avatar {
						width: 0.4rem;
						height: 0.4rem;
						border-radius: 50%;
						float: left;
						img {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
					span {
						font-size: 0.22rem;
						color: #999999;
						line-height: 0.4rem;
					}
				}
				.content {
					margin-top: 0.25rem;
					font-size: 0.26rem;
					word-break: break-all;
				}
			}
		}
		.noData{
         font-size:0.24rem;
         padding:0.2rem 0;
		}
	}

	.itemBox {
		padding: 0.24rem;
		.mid {
			border-top: 0.01rem solid #EDEDED;
			border-bottom: 0.01rem solid #EDEDED;
			padding: 0.63rem 0 0.43rem 0;
			margin-bottom: 0.3rem;
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			.left {
				width: 2rem;
				height: 2rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.right {
				margin-left: 0.24rem;
				width: 4.76rem;
				position: relative;
				.top_text {
					height: 0.75rem;
				}
				.bottom_text {
					width: 100%;
					position: absolute;
					bottom: 0;
					.leftBox {
						float: left;
						i {
							width: 0.21rem;
							height: 0.3rem;
							background: url(../../assets/home/home_icon_fire@3x.png) no-repeat;
							background-size: 100%;
							float: left;
						}
						span {
							color: #F6323E;
							font-size: 0.22rem;
							margin-left: 0.08rem;
						}
					}
					.rightBox {
						float: right;
						color: #FADC56;
					}
				}
			}
		}
	}
  .videoBox{
  	height: 3.8rem;
		background: #000000;
		position: relative;
		.stop {
			position: absolute;
			left: 0.1rem;
			bottom: 0.1rem;
			width: 0.45rem;
			height: 0.45rem;
			background: rgba(0, 0, 0, 0.3);
			i {
				width: 0.2rem;
				height: 0.26rem;
				background: url(../../assets/common/common_btn_suspend@3x.png) no-repeat;
				background-size: 100%;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;
			}
		}
		.full {
			position: absolute;
			bottom: 0.1rem;
			right: 0.1rem;
			width: 0.45rem;
			height: 0.45rem;
			background: rgba(0, 0, 0, 0.3);
			i {
				width: 0.3rem;
				height: 0.3rem;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;
				background: url("../../assets/common/common_btn_full@3x.png") no-repeat;
				background-size: 100%;
			}
		}
		.mask {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
			i{
				width: 1rem;
				height: 1rem;
				background: url("../../assets/location_btn_play@2x.png") no-repeat;
				background-size: 100% 100%;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;

			}
			span {
				position: absolute;
				bottom: 0.1rem;
				right: 0.1rem;
				color: #ffffff;
				font-size: 0.26rem;
			}
		}
		video{
			width: 100%;
			height: 3.8rem;
		}
  }
	.questionBox {
		padding: 0 0.24rem;
		box-sizing: border-box;
		.top {
			height: 0.75rem;
			border-bottom: 0.01rem solid #EDEDED;
			position: relative;
			line-height: 0.86rem;
			span {
				font-size: 0.26rem;
			}
			.right {
				float: right;
				color: #747474;
				margin-right: 0.3rem;
				font-size: 0.24rem;
			}
			i {
				top: 0.35rem;
				right: 0;
				position: absolute;
				width: 0.09rem;
				height: 0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
			}
		}
		.bottom {
			.item {
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				justify-content:space-between;

				line-height: 0.3rem;
				margin-top: 0.2rem;
				position: relative;
				.icon {
					width: 0.26rem;
					height: 0.26rem;
					background: url(../../assets/home/common_img_questions@3x.png) no-repeat;
					background-size: 100%;
				}
				span {

					font-size: 0.26rem;
				}
				.first {
					width: 76%;
					color: #999999;
					margin-left: 0.1rem;
					word-break: break-all;
				}
				.second {

					// right: 0;
					color: #CCCCCC;
				}
			}
			margin-bottom:0.4rem
		}
		.noData{
			font-size: 0.24rem;
			padding: 0.2rem 0;
		}
	}

	.line {
		height: 0.16rem;
		background: #EDEDED;
	}

	.bottomBox {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		z-index: 9999;
		display: flex;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		height: 0.98rem;
		border-top: 0.02rem solid #EDEDED;
		li {
			width: 25%;
			list-style: none;
			text-align: center;
			padding-top: 0.15rem;
			box-sizing: border-box;
			i {
				display: inline-block;
			}
			.share {
				width: 0.36rem;
				height: 0.36rem;
				background: url(../../assets/home/home_btn_share@3x.png) no-repeat;
				background-size: 100% 100%;
			}
			.talk {
				width: 0.4rem;
				height: 0.34rem;
				background: url(../../assets/home/home_btn_comment@3x.png) no-repeat;
				background-size: 100% 100%;
			}
			.question {
				width: 0.37rem;
				height: 0.37rem;
				background: url(../../assets/home/home_btn_questions@3x.png) no-repeat;
				background-size: 100% 100%;
			}
			.star {
				width: 0.38rem;
				height: 0.36rem;
				background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
				background-size: 100% 100%;
			}
			.active {
				width: 0.38rem;
				height: 0.36rem;
				background: url(../../assets/home/home_btn_star_pre@3x.png) no-repeat;
				background-size: 100% 100%;
			}
			p {
			/*	margin-top: 0.1rem;*/
				font-size: 0.2rem;
			}
		}
	}

	.topBox {
		// height: 7.5rem;
		// min-height: 7.5rem;
		position: relative;
		.background {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
		}
		.content {
			width: 100%;

			min-height: 7.5rem;
			position: relative;
			top: 0;
			left: 0;
			z-index: 2;
			background: rgba(0, 0, 0, 0.5);
			padding-top: 1.95rem;
			box-sizing: border-box;
			.bottom {
				position: absolute;

        line-height: 14px;
				bottom: 0.2rem;
				right: 0.25rem;
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				color: #CCCCCC;
				font-size: 12px;
				align-items: center;
				-webkit-align-items:center;
box-align:center;
-moz-box-align:center;
-webkit-box-align:center;
				.date {
					width: 0.22rem;
					height: 0.22rem;
					background: url(../../assets/home/home_icon_calendar@3x.png) no-repeat;
					background-size: 100% 100%;

					position: relative;

				}
				.see {
					width: 0.28rem;
					height: 0.2rem;
					background: url(../../assets/home/home_icon_browse@3x.png) no-repeat;
					background-size: 100% 100%;
					position: relative;

					margin-left: 0.4rem;
					margin-right: 0.1rem;
				}
			}
			.music {
				width: 0.68rem;
				height: 0.68rem;
				background: #000000;
				border-radius: 50%;
				position: absolute;
				top: 0.23rem;
				right: 0.24rem;
       audio{
       	opacity: 0;
       }
				img {
					width: 60%;
					height: 60%;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					margin: auto;
				}
			}
			.isAnimation{
				animation:mymove 5s infinite linear;
					-webkit-animation:mymove 5s infinite linear; /* Safari 和 Chrome */
			}
			@keyframes mymove{
				0%{
					transform: rotate(0deg);
				}
				100%{
					transform: rotate(1080deg);
				}
			}
			.title {
				padding: 0 0.96rem;
				box-sizing: border-box;
				font-size: 0.38rem;
				color: #FFFFFF;
				font-weight: bold;
			}
			.mid {
				-webkit-justify-content: center;
				-moz-justify-content: center;
				-ms-justify-content: center;
				-o-justify-content: center;
				justify-content: center;
				margin: auto;
				margin-top: 0.5rem;
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				.line {
					width: 0.3rem;
					height: 0.02rem;
					background: #FFFFFF;
					position: relative;
					top: 0.2rem;
				}
				span {
					color: #CCCCCC;
				}
			}
			.avatar {
				width: 1.2rem;
				height: 1.2rem;
				margin: auto;
				border-radius: 50%;
				margin-top: 0.4rem;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
	}
</style>
