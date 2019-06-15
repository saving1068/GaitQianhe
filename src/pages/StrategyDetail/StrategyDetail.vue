<template>
	<div class="warp">
		<div class="top">
			<div class="top_title">
				{{data.title}}
			</div>
			<div class="top_bottom">
				<div class="top_time">
					{{data.time}}
				</div>
				<div class="strategy_num">
					<div class="watch_num">
						<div class="watch_num_icon"></div>
						<font v-if="data.browseNum<10000">{{data.browseNum}}</font>
						<font v-else>1W+</font>
					</div>
					<div class="commit">
						<div class="commit_num_icon"></div>
						<font v-if="data.commentNum<10000">{{data.commentNum}}</font>
						<font v-else>1W+</font>
					</div>
					<div class="like">
						<div class="like_num_icon"></div>
						<font v-if="data.favoriteNum<10000">{{data.favoriteNum}}</font>
						<font v-else>1W+</font>
					</div>
				</div>
			</div>
		</div>
		<div class="bg"></div>
		<div v-html="data.content" class="content" id="strategyDetail"></div>
		<!--<div class="list" v-for="(v,i) in list">
			<div class="list_title">
				广州长隆旅游度假区先后被评为国家级5A景区、国家级文化产业示范基地等，是中国极受欢迎的旅游地方。
			</div>
			<div class="list_images">
				<div class="list_video" v-if="v.video">
					<div class="list_video_icon"></div>
				</div>
			</div>
		</div>-->
		<div class="bg"></div>
		<div class="evaluateBox">
			<div class="top">
				<span>用户评价</span><span v-if="commentsTotal>0">（{{commentsTotal}}）</span>
				<span class="right" @click="goToComment">查看全部</span>
				<i></i>
			</div>
			<div class="bottom" v-if="list.length>0">
				<div class="item" v-for="item in list" :key="item.id">
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
       <div class="noData" v-if="list.length==0">
          暂无评价信息
       </div>

		</div>
		<div class="bottom_btn">
			<div class="btn_item" @click="goToComment">
				<p><img src="../../assets/location_btn_comment@2x.png" /></p>
				<font>{{data.commentNum}}</font>
			</div>
			<div class="btn_item" v-if="!ifFavorite" @click="Favorite(1)">
				<p><img src="../../assets/location_btn_star_nor@2x.png" /></p>
				<font>{{data.favoriteNum}}</font>
			</div>
			<div class="btn_item" v-else @click="Favorite(2)">
				<p><img src="../../assets/location_btn_star_pre@2x.png" /></p>
				<font>{{data.favoriteNum}}</font>
			</div>
			<div class="btn_item" @click="PraiseSwitch(1)" v-if="!ifSwitch">
				<p><img src="../../assets/location_btn_heart_nor@3x.png" /></p>
				<font>{{data.praiseNum}}</font>
			</div>
			<div class="btn_item" @click="PraiseSwitch(2)" v-else>
				<p><img src="../../assets/location_btn_heart_pre@2x.png" /></p>
				<font>{{data.praiseNum}}</font>
			</div>
		</div>
		<div class="goHome" v-if="isShare" @click="goHome">
			<div></div>
			<p>首页</p>
		</div>
	</div>
</template>

<script>
	export default {
		created() {
			this.getArticleDetails(this.$route.query.id)
			this.getData()
			if(window.sessionStorage.getItem("shareId")) {
				this.isShare = true
			}
		},
		data() {
			return {
				list: [],
				data: {},
				pa: 1,
				commentsTotal: 0,
				id: this.$route.query.id,
				ifSwitch: false, //点赞
				ifFavorite: false, //收藏
				isShare: false
			}
		},
		mounted(){
		},
		methods: {
			goHome() {
				window.sessionStorage.removeItem("shareId")
				this.$router.push({
					name: "Home"
				})
			},
			getConfig() {
				let that = this;
				let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=StrategyDetail&shareId=" + this.$store.state.Home.user.id + "&id=" + this.$route.query.id;
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
					timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
					nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
					signature: this.$store.state.config.signature, // 必填，签名
					jsApiList: ["chooseImage", "updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
				});
				wx.ready(function() { //需在用户可能点击分享按钮前就先调用
					if(wx.onMenuShareAppMessage) {
						console.log(that.data.title)
						wx.onMenuShareAppMessage({
							title: that.data.title, // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							type: 'link', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function(res) {
								console.log(res)
								that.shareSuccess()
								// 用户点击了分享后执行的回调函数
							}
						})
					} else {
						wx.updateAppMessageShareData({
							title: that.data.title, // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							success: function(res) {
//								console.log(res)
								// 设置成功
							}
						});
					}

				});

			},
			shareSuccess() {
				this.$Api.Common.ShareTask({
					a: 6,
					id: this.id
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.$toast("分享成功", "success")
					}
				})

			},
			touchStart(e) {
				console.log(e)
			},
			async getArticleDetails(id) {
				this.$Api.UserPage.ArticleDetails(id).then((res) => {
					console.log(res)
					this.data = res.q.article
					if(this.data.isSection == 0) {
						this.ifSwitch = false;
					} else {
						this.ifSwitch = true;
					}
					if(this.data.isFavorite == 0) {
						this.ifFavorite = false;
					} else {
						this.ifFavorite = true;
					}
					 this.getConfig()
				})
			},
			PraiseSwitch(open) { //1点赞 2取消
				console.log(open)
				var obj = {
					a: 1,
					id: this.id,
					open,
				}
				this.$Api.Home.PraiseSwitch(obj).then((res) => {
					if(res.q.s == 0) {
						if(open == 1) { //点赞
							this.data.praiseNum++
						} else {
							this.data.praiseNum--
						}
						this.ifSwitch = !this.ifSwitch
						console.log(res)
					}

				})
			},
			goToComment() {
				this.$router.push({
					name: "Comment",
					query: {
						a: 3,
						id: this.id
					}
				})
			},
			Favorite(open) {
				console.log(open)
				var obj = {
					a: 3,
					id: this.id,
					open,
				}
				this.$Api.Home.Favorite(obj).then((res) => {
					if(res.q.s == 0) {
						if(open == 1) { //点赞
							this.data.favoriteNum++
						} else {
							this.data.favoriteNum--
						}
						this.ifFavorite = !this.ifFavorite
						console.log(res)
					}

				})
			},
			 getData() {
				let obj = {
					id: this.id,
					a: 3,
					pa: this.pa,
					li: 10
				}
				this.$Api.Home.CommentList(obj).then((res) => {
					console.log(res)
					//					this.list = res.q.comments;
					if(res.q.s == 0) {
					this.commentsTotal = res.q.total
						if(res.q.comments.length > 0) {
							for(let i = 0; i < res.q.comments.length; i++) {
								let obj = { ...res.q.comments[i]
								}
								console.log(obj.comTime)
								if(obj.comTime.indexOf("分") != -1) {
									var index = obj.comTime.indexOf("分")
									var num = obj.comTime.substr(0, index)
									console.log(num, index)
									if(Number(num) < 1) {
										obj.comTime = "刚刚"
									}

								}
								this.list.push(obj)

							}

							// this.commentsList = this.commentsList.concat([...res.q.comments])
						}
						
						//							this.pa++
						//							setTimeout(() => {
						//
						//								if(res.q.comments.length < 10) {
						//									this.loading = false
						//									this.all = true
						//
						//								}
						//
						//							}, 500)
					}
				})

			},
			goToComment() {
				this.$router.push({
					name: "Comment",
					query: {
						a: 3,
						id: this.$route.query.id
					}
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.goHome {
		width: 1rem;
		height: 1rem;
		position: fixed;
		left: 0.3rem;
		bottom: 2.54rem;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		z-index: 9999;
		div {
			margin: auto;
			margin-top: 0.2rem;
			width: 0.12rem;
			height: 0.22rem;
			background: url('../../assets/location_btn_array@2x.png') no-repeat;
			transform: rotate(90deg);
			background-size: 100% 100%;
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
			padding:0 !important;
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
				}
			}
		}
		.noData{
         font-size:0.24rem;
         padding:0.2rem 0;
		}
	}
	.warp {
		padding-bottom: .98rem;
		.bg {
			width: 100%;
			height: .2rem;
			background: rgba(237, 237, 237, 1);
		}
		.content {
			word-break: break-all;
			overflow: hidden;
			padding:.24rem .24rem 0;
		}
		.top {
			padding:0 .24rem .25rem;
			.top_title {
				padding-top: .25rem;
				font-size: 0.36rem;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}
			.top_bottom {
				overflow: hidden;
				padding-top: .41rem;
				font-family: PingFang-SC-Medium;
				color: rgba(102, 102, 102, 1);
				.top_time {
					width: 3.2rem;
					font-size: 0.24rem;
					float: left;
				}
				.strategy_num {
					display: flex;
					/*justify-content: space-between;*/
					width: 3.8rem;
					overflow: hidden;
					align-items: center;
				}
				.watch_num {
					/*float: left;*/
					/*width: 1rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					padding-right: .25rem;
					.watch_num_icon {
						width: 0.25rem;
						height: 0.2rem;
						background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*margin-top: .12rem;*/
						/*float: left;*/
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
					/*float: left;*/
					/*width: 1rem;*/
					padding-right: .25rem;
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.commit_num_icon {
						/*float: left;*/
						width: 0.25rem;
						height: 0.25rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100% 100%;
						/*margin-top: .12rem;*/
					}
					font {
						padding-left: .1rem;
						font-size: 0.22rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						/*margin-bottom: .1rem;*/
					}
				}
				.like {
					padding-right: .25rem;
					/*float: left;*/
					/*width: 1rem;*/
					display: flex;
					align-items: center;
					/*justify-content:space-between;*/
					.like_num_icon {
						/*float: left;*/
						width: 0.25rem;
						height: 0.25rem;
						background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
						background-size: 100% 100%;
						/*margin-top: .1rem;*/
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
		.list {
			padding-bottom: .5rem;
			.list_title {
				width: 6.97rem;
				margin: 0 auto;
				padding: .37rem 0 .28rem;
				font-size: 0.26rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.list_images {
				width: 100%;
				height: 3.8rem;
				background: salmon;
				position: relative;
				.list_video {
					width: 100%;
					height: 3.8rem;
					position: absolute;
					top: 0;
					background: rgba(0, 0, 0, .55);
					.list_video_icon {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 1rem;
						height: 1.02rem;
						background-image: url(../../assets/location_btn_play@2x.png);
						background-size: 100% 100%;
						background-repeat: no-repeat;
					}
				}
			}
		}
		.commit_list {
			padding: 0 .24rem;
			.commit_list_title {
				line-height: 1rem;
				font-size: 0.28rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.commit_list_item {
				border-bottom: 0.01rem solid #EDEDED;
				margin-bottom: .39rem;
			}
			.item_top {
				overflow: hidden;
				line-height: .4rem;
				.item_icon {
					overflow: hidden;
					float: left;
					width: 0.4rem;
					height: 0.4rem;
					border-radius: 50%;
					background-image: url(../../assets/touxiang40.png);
					background-size: 100% 100%;
					background-repeat: no-repeat;
					img {
						width: 100%;
						height: 100%;
						vertical-align: initial;
					}
				}
				.item_name {
					float: left;
					font-size: 0.22rem;
					font-family: PingFang-SC-Regular;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					padding-left: .11rem;
				}
				.item_time {
					float: right;
					font-size: 0.22rem;
					font-family: PingFang-SC-Regular;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
			}
			.item_val {
				padding: .25rem 0 .4rem;
				font-size: 0.26rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.commit_more {
				height: .5rem;
				font-size: 0.22rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				text-align: center;
			}
		}
		.bottom_btn {
			position: fixed;
			z-index: 55;
			bottom: 0;
			height: .98rem;
			display: flex;
			width: 100%;
			background: #FFFFFF;
			.btn_item {
				width: 33.33%;
				height: 100%;
				position: relative;
				text-align: center;
				p {
					width: 0.45rem;
					height: 0.39rem;
					margin: .17rem 1.02rem 0;
				}
				font {
					font-size: 0.2rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
				}
			}
		}
	}
</style>