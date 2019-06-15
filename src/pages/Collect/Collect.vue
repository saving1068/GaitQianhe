<template>
	<div style="background:#FFF;min-height:100vh;position:relative;">
		<div class="mid">
			<!-- 顶部tab -->
			<li :class="[active==0?'active':'']" @click="change(0)">游记</li>
			<li :class="[active==1?'active':'']" @click="change(1)">商品</li>
			<li :class="[active==2?'active':'']" @click="change(2)">攻略</li>
			<!-- 滑动横条 -->
			<div class="line" :style="lineStyle"></div>
		</div>
			<mu-load-more :loading="false" @load="load" :loaded-all="all">
				<!-- 加载内容 -->
		<div class="first" v-if="active==0">
      <!-- 游记列表 -->
			<div class="item" v-for="(item,index) in list" :key="item.id" @click="goToTravelDetails(item.id)">
				<div class="top">
					<div class="left">{{item.title}}</div>
					<div class="right">
						<img :src="item.imagePath" />
						<i class="icon" @click.stop="showDelect(item.id,index)"></i>
					</div>
				</div>
				<div class="bottom">
					<div class="avatar">
						<img :src="item.authorPath" v-if="item.authorPath!=''" />
						<img src="../../assets/common/placeholder_40x40.png" v-if="item.authorPath==''" />
					</div>
					<span style="font-size: 0.3rem;margin-left: 0.1rem;">{{item.authorName}}</span>
					<div class="opBox">
						<li>
							<i class="see"></i>
							<span>{{item.browseNum}}</span>
						</li>
						<li>
							<i class="talk"></i>
							<span>{{item.commentNum}}</span>
						</li>
						<li>
							<i class="like"></i>
							<span>{{item.collectNum}}</span>
						</li>

					</div>
				</div>
			</div>

		</div>
		<div class="second" v-if="active==1">
			<!-- 商品列表 -->
			<div class="item" v-for="(item,index) in list" :key="item.spuId" @click="goShop(item.spuId,item.isUp,item.orgId)">
				<div class="left">
				<img :src="item.imagePath" />
					<i class="icon" @click.stop="showDelect(item.spuId,index)"></i>
				</div>
				<div class="right">
					<div class="top">{{item.name}}</div>
					<p class="midText">{{item.destination}}</p>
					<div class="bottom">
						<span style="font-size: 0.2rem;color: #FF7A56;">¥</span>
						<span style="font-size: 0.32rem;color: #FF7A56;">{{item.price}}</span>
						<span style="font-size: 0.22rem;color: #FF7A56">起</span>
						<div class="rightBox">
							<span style="color: #FF7A56;font-size: 0.22rem;">{{item.praiseNum}}分</span>
						<span style="font-size: 0.22rem;color: #999999;">月售{{item.saleStat}}笔</span>

						</div>


					</div>
				</div>

			</div>

		</div>
		<div class="third" v-if="active==2"  >
			<!-- 攻略列表 -->
			<div class="item" v-for="(item,index) in list" :key="item.id" @click="goStrDetails(item.id)">
				<div class="left">
					<div class="top">{{item.title}}</div>
					<div class="btn">攻略</div>
					<div class="opBox">
						<li>
							<i class="see"></i>
							<span>{{item.browseNum}}</span>
						</li>
						<li>
							<i class="talk"></i>
							<span>{{item.commentNum}}</span>
						</li>
						<li>
							<i class="like"></i>
							<span>{{item.favoriteNum}}</span>
						</li>

					</div>

				</div>
				<div class="right">
					<img :src="item.imagePath" />
					<i class="icon" @click.stop="showDelect(item.id,index)"></i>
				</div>

			</div>

		</div>
		<div v-show="loading" class="loading">
			<!-- 加载动画 -->
			<div class="mid">
				<i></i>
				<span>正在加载更多...</span>
			</div>
		</div>
     </mu-load-more>
		 <div class="end" v-if="all&&!loading&&list.length>0" style="text-align:center;padding:0.2rem 0;font-size:0.28rem;">
       <!-- 无更多数据 -->
			 <span>无更多数据</span>

		 </div>
		 <div class="noData" v-if="list.length==0&&all&&!loading">
			 <!-- 列表无数据 -->
     	<div class="icon">

     	</div>
			<p>暂无收藏信息</p>
		</div>

		  <!-- 删除组件-->
		<Delete v-if="show" @cancel="cancel()"  @delete="deleteFun()"></Delete>

		<!-- tab切换防止重复点击的遮罩层 -->
		<div class="maskCollect" v-show="showCollect"></div>

	</div>
</template>

<script>
	export default {

		data() {
			return {
				active: 0, //tab 激活的下标
				list: [],   //列表数组
				show:false,  //控制删除组件的状态
				id:0,        //删除ID
				pa:1,         //页数
				loading:false,   //控制加载动画
				all:true,        //是否加载完成
				delIndex:0,       //删除数据的 下标
				showCollect:false  //遮罩层
			}

		},
		computed: {
			lineStyle() {
				if(this.active == 0) {  //tabbar 下方的横线样式切换
					return {
						'left': '12.5%'
					}
				} else if(this.active == 1) {
					return {
						'left': '45.8%'
					}

				} else if(this.active == 2) {
					return {
						'left': '79%'
					}

				}

			}

		},
		created() {
			this.load() //加载数据

		},
		methods: {
			goShop(id,isUp,orgId){
				if(isUp==0){  //0为商品下架 1为上架
					this.$router.push({
						name:"NoCommodity",  //商品下架
						query:{
							orgId:orgId
						}
					})
				}else{
					this.$router.push({  //跳转商品详情
						name:"ShoppingMallDetails",
						query:{
							spuId:id
						}
					})
				}

			},
			goStrDetails(id){
				this.$router.push({
					name:"StrategyDetail", //跳转攻略详情
					query:{
						id:id
					}
				})
			},
			goToTravelDetails(id){
				this.$router.push({
					name:"TravelDetails",  //跳转游记详情
					query:{
						id:id
					}
				})
			},
			showDelect(id,index){  //显示删除组件
				this.id=id          //删除id
				this.delIndex=index  //删除的下标
				this.show=true
			},
			cancel(){
				this.show=false   //取消删除

			},
			deleteFun(){           //删除函数
				var obj={
					a:this.active+1,    //tabbar下标+1
					open:2,
					id:this.id          //删除下标
 				}
				console.log(obj)
				this.$Api.My.Favorite(obj).then((res)=>{
					if(res.q.s==0){
						this.show=false                      //删除组件消失

							this.list.splice(this.delIndex,1)  //列表删除那项
						this.$toast("取消收藏成功","success")   //提示用户成功
					}else{
						this.show=false                        //删除组件消失
						this.$toast("取消收藏失败","error")     //提示用户失败
					}
				})

			},
			change(num) {   //切换tabbar
				this.pa=1     //页数重置
				this.all=true      //加载状态重置
				this.loading=false  //加载状态重置
				this.list=[]         //列表数据重置
				this.active = num    //切换tabbar 下标
				this.showCollect=true //遮罩层出现 防止多次点击
				this.load()           //加载数据
			},
			load() {
        this.loading=true            //加载动画出现
				this.$Api.My.MyFavorite({        //列表接口
					a: this.active + 1,
					pa:this.pa
				}).then((res) => {
					if(res.q.s == 0) {
            if(res.q.list.length>0){
							this.list = this.list.concat(res.q.list)
						}

						this.pa++
						this.showCollect=false   //遮罩层消失
						setTimeout(()=>{

							if(res.q.list.length<10){
								this.all=true          //加载完毕
								this.loading=false     //动画消失

							}else{
								this.all=false
                this.loading=true
							}

						},500)
					}
					console.log(res)
				})

			}
		}

	}
</script>

<style scoped="scoped" lang="scss">
.noData{
	width: 3rem;
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom:0;
 margin: auto;
 height: 5rem;
 div{
	 width: 2.8rem;
	 height: 2.8rem;
	 background: url("../../assets/my_btn_heart@3x.png") no-repeat;
	 background-size:100% 100%;
 }
 p{
	 font-size: 0.3rem;
	 color: #999999;
	 margin-top: 0.4rem;
	 text-align: center;
 }

}
.loading {
  padding: 0.2rem 0;

	.mid {
		display: flex;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
		justify-content: center;
		align-items: center;
		 -webkit-align-items:center;
box-align:center;
-moz-box-align:center;
-webkit-box-align:center;
border: none;
		i {
			width: 0.28rem;
			height: 0.3rem;
			float: left;
			background: url(../../assets/home/common_icon_Load@3x.png) no-repeat;
			background-size: 100%;
			position: relative;
			// top: 0.05rem;
			transition: 0.75s;
			animation: icon 1s 0s infinite linear;
		}
		@keyframes icon {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
		span {
			font-size: 0.28rem;
			margin-left: 0.08rem;
			color: #999999;
		}
	}
}
	.mid {
		list-style: none;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		display: flex;
		position: relative;
		border-bottom: 0.01rem solid #EDEDED;
		.line {
			position: absolute;
			width: 0.6rem;
			height: 0.02rem;
			background: rgba(250, 220, 86, 1);
			border-radius: 0.01rem;
			top: 0.8rem;
			transition: 0.5s;
		}
		li {
			width: 33.33%;
			height: 1.2rem;
			line-height: 1.2rem;
			text-align: center;
			color: #999999;
			font-size: 0.3rem;
		}
		.active {
			color: #FADC56;
		}
	}

	.first {
		.item {
			height: 2.9rem;
			padding: 0.2rem;
			box-sizing: border-box;
			border-bottom: 1px solid #EDEDED;
			.top {
				height: 2rem;
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
					width: 56%;
					padding-right: 0.4rem;
					box-sizing: border-box;
					padding-top: 0.1rem;
					font-size: 0.3rem;
					color: rgba(51, 51, 51, 1);
				}
				.right {
					width: 2.8rem;
					height: 2rem;
					position: relative;
					img {
						width: 100%;
						height: 100%;
					}
					.icon {
						width: 0.6rem;
						height: 0.6rem;
						background: url(../../assets/my/delet@3x.png) no-repeat;
						background-size: 100%;
						position: absolute;
						right: 0;
						top: 0;
					}
				}
			}
			.bottom {
				height: 0.5rem;
				margin-top: 0.2rem;
				.avatar {
					width: 0.4rem;
					height: 0.4rem;
					border-radius: 50%;
					position: relative;
					bottom: 0.07rem;
					float: left;
					img {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.opBox {
					width: 45%;
					float: right;
					display: flex;
					display: -webkit-box;
					/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
					display: -moz-box;
					/* 老版本语法: Firefox (buggy) */
					display: -ms-flexbox;
					/* 混合版本语法: IE 10 */
					display: -webkit-flex;
					/* 新版本语法: Chrome 21+ */
					li {
						width: 33.33%;
						list-style: none;
						display: flex;
						display: -webkit-box;
						/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
						display: -moz-box;
						/* 老版本语法: Firefox (buggy) */
						display: -ms-flexbox;
						/* 混合版本语法: IE 10 */
						display: -webkit-flex;
						/* 新版本语法: Chrome 21+ */
						align-items: center;
						-webkit-align-items:center;
		box-align:center;
		-moz-box-align:center;
		-webkit-box-align:center;
		-webkit-justify-content: center;
	 -moz-justify-content: center;
	 -ms-justify-content: center;
	 -o-justify-content: center;
	 justify-content: center;
						.see {
							background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
							background-size: 100% 100%;
							width: 16.5px;
							height: 10.5px;

						}
						.talk {
							background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
							background-size: 100% 100%;
							width:15px;
							height: 13.5px;

						}
						.like {
							background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
							background-size: 100% 100%;
							width: 15px;
							height: 15px;

						}
						span {
							line-height: 18px;
							font-size: 12px;
							margin-left: 0.1rem;
						}
					}
				}
			}
		}
	}

	.second {
		.item {
			height: 2.9rem;
			padding: 0.4rem 0.25rem 0.3rem;
			box-sizing: border-box;
			border-bottom: 1px solid #EDEDED;
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
				position: relative;
				img {
					width: 100%;
					height: 100%;
				}
				.icon {
					width: 0.6rem;
					height: 0.6rem;
					background: url(../../assets/my/delet@3x.png) no-repeat;
					background-size: 100%;
					position: absolute;
					left: 0;
					top: 0;
				}
			}
			.right {
				width: 4.7rem;
				height: 2rem;
				margin-left: 0.3rem;
				position: relative;
				.top {
					font-size: 0.26rem;
					height: 0.7rem;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.midText {
					color: #999999;
					margin-top: 0.1rem;
					font-size: 0.22rem;
				}
				.bottom {
					width: 100%;
					position: absolute;
					bottom: 0;
					left: 0;

			.rightBox{
				float:right;

			}


				}
			}
		}
	}

	.third {
		.item {
			height: 2.9rem;
			padding: 0.4rem 0.25rem 0.3rem;
			box-sizing: border-box;
			border-bottom: 1px solid #EDEDED;
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			.right {
				width: 2.8rem;
				height: 2rem;
				position: relative;
				img {
					width: 100%;
					height: 100%;
				}
				.icon {
					width: 0.6rem;
					height: 0.6rem;
					background: url(../../assets/my/delet@3x.png) no-repeat;
					background-size: 100%;
					position: absolute;
					right: 0;
					top: 0;
				}
			}
			.left {
				width: 3.9rem;
				height: 2rem;
				margin-right: 0.3rem;
				position: relative;
				.top {
					font-size: 0.26rem;
					height: 0.7rem;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.midText {
					color: #999999;
					margin-top: 0.1rem;
					font-size: 0.22rem;
				}
				.btn {
					// width: 0.90rem;
					// height: 0.30rem;
					background: rgba(250, 220, 86, 1);
					padding: 0 25px;
					display: inline-block;

					border-radius: 25px;
					text-align: center;
					// line-height: 0.3rem;
					font-size: 20px;
					margin-top: 0.17rem;
          transform: scale(0.5) translate(-50%, -50%);

				}
				.opBox {
					width: 100%;
					position: absolute;
					bottom: 0;
					display: flex;
					display: -webkit-box;
					/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
					display: -moz-box;
					/* 老版本语法: Firefox (buggy) */
					display: -ms-flexbox;
					/* 混合版本语法: IE 10 */
					display: -webkit-flex;
					/* 新版本语法: Chrome 21+ */
					li {
						width: 33.33%;
						list-style: none;
						display: flex;
						display: -webkit-box;
						/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
						display: -moz-box;
						/* 老版本语法: Firefox (buggy) */
						display: -ms-flexbox;
						/* 混合版本语法: IE 10 */
						display: -webkit-flex;
						/* 新版本语法: Chrome 21+ */
						align-items: center;
						-webkit-align-items:center;
		box-align:center;
		-moz-box-align:center;
		-webkit-box-align:center;
		-webkit-justify-content: center;
	 -moz-justify-content: center;
	 -ms-justify-content: center;
	 -o-justify-content: center;
	 justify-content: center;
	 .see {
		 background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
		 background-size: 100% 100%;
		 width: 16.5px;
		 height: 10.5px;

	 }
	 .talk {
		 background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
		 background-size: 100% 100%;
		 width:15px;
		 height: 13.5px;

	 }
	 .like {
		 background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
		 background-size: 100% 100%;
		 width: 15px;
		 height: 15px;

	 }
	 span {
		 line-height: 18px;
		 font-size: 12px;
		 margin-left: 0.1rem;
	 }
					}
				}
			}
		}
	}
	.maskCollect{
		width: 100vh;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
