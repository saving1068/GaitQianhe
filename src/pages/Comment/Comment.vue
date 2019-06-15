<template>
	<div class="Comment" style="min-height: 100%;background:#FFFFFF;">
		<div class="contentBox" style="position: relative;top: 0;width: 100%;-webkit-overflow-scrolling: touch;z-index: 10;">
    <!-- 评论列表 -->
			 	<mu-load-more :loading="false" @load="load" :loaded-all="all" v-if="commentsList.length>0">
			<div class="item" v-for="item in commentsList">
				<div class="top">
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



				</mu-load-more>
				<!-- 无更多数据 -->
				<div class="end" v-if="all&&commentsList.length>0" >
					<div class="line" style="margin-right: 0.2rem;"></div>
					<span>你看到我的底线了</span>
					<div class="line" style="margin-left: 0.2rem;"></div>

				</div>
				<div style="height: 1rem;"></div>

				<!-- 无任何数据 -->
				<div class="noData" v-if="all&&commentsList.length==0">
              <div></div>
							<p>暂无评论内容</p>
				</div>
		</div>

    <!-- 底部输入框 -->
		<div class="seachBox" >
			<div class="box">
				<input type="text" placeholder="评论内容~(200字内)" v-model="sendInput" @focus="onFocus" @blur="onBlur"  @input="changeInput" />

			</div>
			<div :class="[sendInput.length>0?'active':'','btn']" @click="sendData">
				发送
			</div>

		</div>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default {
		components: {
			Toast
		},
		data() {
			return {
				id: this.$route.query.id, //评论id
				commentsList: [],   //评论列表
				commentsTotal: 0,  //评论总数
				sendInput: "",     //发送内容
				loading:true,      //加载动画
				all:true,         // 是否加载完成
				pa:1,              //页数
				a:this.$route.query.a,    //状态 1为游记  3为攻略
				scrollTop:0,  //记录高度
				loadFlag:false //加载状态
			}

		},
		created() {

		},
		mounted() {
        this.getData()  //加载列表
		},
		methods: {
			changeInput(){
	      this.sendInput=this.sendInput.substring(0, 200)//控制在200字以内

	    },

			load() {
				if(this.loadFlag){
					return ;
				}
				this.loadFlag=true
				this.loading = true  //加载动画
				if(!this.all){
	        this.getData() //加载列表
	      }


			},
			getData() {
				let obj = {
					id: this.id,
					a: this.a,
          pa:this.pa,
					li:10
				}
				this.$Api.Home.CommentList(obj).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						if(res.q.comments.length > 0) {

							for (let i = 0; i < res.q.comments.length; i++) {
 	             let obj={...res.q.comments[i] }

 	 						if(obj.comTime.indexOf("分")!=-1){  //0分钟 转成 刚刚
 	 						var index=	obj.comTime.indexOf("分")
 	 						var num=obj.comTime.substr(0,index)
 	 						console.log(num)
 	 						if(Number(num)<1){
 	 							obj.comTime="刚刚"
 	 						}

 	 						}


 	             this.commentsList.push(obj)

 	           }


						}
						this.commentsTotal = res.q.total  //评论总数
							this.pa++
							setTimeout(() => {

								if(res.q.comments.length < 10) {   //小于10条 加载完毕
									this.loading = false
									this.all = true

								}else{
									this.loading = true
									this.all = false
								}

							}, 500)
					}
				})

			},

			sendData() {
				let obj = {
					id: this.id,
					a: this.a,
					content: this.sendInput
				}
				if(this.sendInput.length == 0) {
					Toast({
						message: "请输入内容",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});
					return
				}
				if(this.sendInput.length >200) {
					Toast({
						message: "请控制在200字以内",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});
					return
				}


				this.$Api.Home.CommentSubmit(obj).then((res) => {
					if(res.q.s == 0) {
						this.sendInput = ""
						this.commentsList=[]
						this.pa=1;
						this.$toast("评论成功", 'success');
						this.getData()
					}
				})
			},

			onFocus() {
				this.scrollTop=document.body.scrollTop  //记录当前位置
			 setTimeout(()=>{
			 	document.body.scrollTop = document.body.scrollHeight;
			 },300)
			},
			onBlur() {
				setTimeout(()=>{
	        document.body.scrollTop = this.scrollTop;  //滚到记录的位置
	      },300)

			}

		}
	}
</script>

<style scoped="scoped" lang="scss">
.contentBox{
.noData{
	position: absolute;
	width:2rem;
	height: 2rem;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	div{
		width:1.5rem;
		height:1.5rem;
		background: url('../../assets/nocom.png') no-repeat;
		background-size: 100%;
    margin: auto;

	}
	p{

		width: 100%;

		font-size: 0.3rem;
		color: #CCCCCC;
		margin-top: 0.28rem;
		text-align: center;

	}

}

}



	.item {
		border-bottom: 0.01rem solid #EDEDED;
		padding: 0.4rem 0.25rem;
		.top {
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

	.item:last-child {
		border: none;
	}

	.end {
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
		text-align: center;
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		padding: 0 0.4rem;
		box-sizing: border-box;
		.line {
			width:30%;
			height: 0.02rem;
			background: #CCCCCC;
			position: relative;
			top: 0.16rem;
		}
		span {
			// width: 2rem;
			color: #CCCCCC;
			font-size: 0.22rem;
		}
	}

	.seachBox {
		width: 100%;
		height: 0.98rem;
		background: #EDEDED;
		position: fixed;
		z-index: 9999;
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
		padding: 0.15rem 0.09rem;
		.box {
			width: 5.95rem;
			height: 0.67rem;
			background: #FFFFFF;
			border-radius: 34rem;
			border: 0.01rem solid #CCCCCC;
			padding: 0.1rem 0.22rem;
			box-sizing: border-box;
			input {
				width: 100%;
				height: 100%;
				border: none;
				font-size: 0.2rem;
			}
		}
		.btn {
			width: 1.16rem;
			height: 0.67rem;
			background: #CCCCCC;
			color: #FFFFFF;
			border-radius: 0.34rem;
			font-size: 0.22rem;
			margin-left: 0.15rem;
			text-align: center;
			line-height: 0.67rem;
		}
		.active {
			background: rgba(250, 220, 86, 1);
			color: #333333;
		}
	}
</style>
