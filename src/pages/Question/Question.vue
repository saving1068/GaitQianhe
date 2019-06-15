<template>
	<div class="Comment" style="min-height: 100%;background:#FFFFFF;">
		<div ref="scroll" style="position: relative;top: 0;width: 100%;-webkit-overflow-scrolling: touch;z-index: 10;padding-bottom: 1rem;box-sizing: border-box;background: #FFFFFF;">

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
					<p style="text-align: center;font-size: 0.22rem;color: #CCCCCC;margin-top: 0.2rem;">{{list.authorName}}</p>

				</div>
			</div>
			<mu-load-more :loading="false" @load="load" :loaded-all="all" v-if="querstList.length>0">
				<div v-for="item in querstList" class="item" @click="go('Answer',item.id,item.content,item.userId)">

					<div class="ask">
						<div class="icon">

						</div>
						<p>{{item.content}}
						</p>
					</div>
					<div class="answer" v-if="item.answerNum>0">
						<div class="icon">

						</div>
						<p>{{item.answer}}</p>

					</div>
					<div class="bottomBox" v-if="item.answerNum>0">
						<span style="float: left;">全部  {{item.answerNum}}个回答</span>
						<span style="float: right;">更新于 {{item.date}}</span>
					</div>

				<div class="noAnswer" v-if="item.answerNum==0" >
					<span>还没有人回答这问题...</span>
					<div class="right">
          去回答
					</div>
				</div>



				</div>
				<div v-show="loading" class="loading">
					<div class="mid">
						<i></i>
						<span>正在加载更多...</span>
					</div>
				</div>
			</mu-load-more>
			<div class="end" v-if="all&&querstList.length>0">
				<div class="line" style="margin-right: 0.2rem;"></div>
				<span>你看到我的底线了</span>
				<div class="line" style="margin-left: 0.2rem;"></div>
			</div>
			<div class="bottom_box" v-if="all&&querstList.length==0">
				<div class="noData" >
				 <div></div>
				 <p>暂无问答内容</p>
				</div>
			</div>

		</div>
		<div class="seachBox" >
			<div class="box">
				<input type="text" v-model="sendInput" placeholder="向大家提问，4 ~ 40个字" @focus="onFocus" @blur="onBlur" @input="changeInput" />

			</div>
			<div :class="[sendInput.length>0?'active':'','btn']" @click="sendData">
				提问
			</div>

		</div>
	</div>
</template>

<script>
import {Toast} from 'vant'
	export default {

		data() {
			return {
				id: this.$route.query.id,
				querstList: [],
				list: {},
				sendInput: "",
				pa: 1,
				loading: false,
				all: true,
				scrollTop:0,  //记录高度
				loadFlag:false //加载状态
			}
		},
		created() {
			this.getData()


		},
		mounted() {
			this.getQuestion()
		},
		methods: {
			changeInput(){
				this.sendInput=this.sendInput.substring(0, 40)
			},
			load() {
				if(this.loadFlag){
					return ;
				}
				this.loadFlag=true
				this.loading = true  //加载动画
				if(!this.all){
					this.getQuestion() //加载列表
				}

			},
			sendData() {

				let obj = {
					id: this.id,
					a: 3,
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

				if(this.sendInput.length > 0&&this.sendInput.length<4) {
					Toast({
						message: "您的问题过短",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});
					return
				}

				if(this.sendInput.length > 40) {
					Toast({
						message: "您的问题过长",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});
					return
				}

				this.$Api.Home.QuestionSubmit(obj).then((res) => {
					if(res.q.s == 0) {
						this.sendInput = ""
						this.$toast("提问成功", 'success');
						this.pa = 1
						this.querstList=[]
						this.getQuestion()
					}
				})
			},
			getQuestion() {
				let obj = {
					a: 3,
					type: 2,
					id: this.id,
					pa: this.pa
				}
				this.$Api.Home.QuestionsList(obj).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
        if(res.q.questions.length>0){
						for(let i = 0; i < res.q.questions.length; i++) {

							this.querstList.push(res.q.questions[i])

						}

}
						this.pa++
							setTimeout(() => {

								if(res.q.questions.length < 10) {
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
			getData() {

				this.$Api.Home.WbDetail({
					id: this.id
				}).then((res) => {
					console.log(res)
					this.list = { ...res.q.article
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

			},
			go(text,id, name,userId) {
      if(text=="OtherPage"){
				this.$router.push({
				name: text,
				query: {
					id: this.list.userId
				}
			})
			}else{
				this.$router.push({
				name: text,
				query: {
					answerId: id,
					id: this.id,
					name: name,
					userId:userId
				}
			})
			}



			}

		}

	}
</script>

<style scoped="scoped" lang="scss">
.bottom_box{
	position: relative;
  height: 2rem;
	margin-top: 1.8rem;
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




	.loading {
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
			i {
				width: 0.28rem;
				height: 0.3rem;
				float: left;
				background: url(../../assets/home/common_icon_Load@3x.png) no-repeat;
				background-size: 100%;
				position: relative;
				top: 0.05rem;
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

	.seachBox {
		width: 100%;
		height: 0.98rem;
		background: #FFFFFF;
		border-top: 0.01rem solid #EDEDED;
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

	.topBox {

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

			position:relative;
			min-height:  5rem;
			z-index: 2;
			background: rgba(0, 0, 0, 0.5);
			padding-top: 0.6rem;
			padding-bottom: 0.4rem;
			.bottom {
				position: absolute;
				bottom: 0.2rem;
				left: 3rem;
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
				font-size: 0.22rem;
				.date {
					width: 0.22rem;
					height: 0.22rem;
					background: url(../../assets/home/home_icon_calendar@3x.png) no-repeat;
					background-size: 100%;
				}
				.see {
					width: 0.28rem;
					height: 0.2rem;
					background: url(../../assets/home/home_icon_browse@3x.png) no-repeat;
					background-size: 100%;
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
				margin-top: 0.45rem;
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

	.item {
		width: 7.02rem;
		margin: auto;
		border-bottom: 0.01rem solid #EDEDED;
		padding: 0.4rem 0;
		background: #fff;
		.ask {
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			/* 12版 */
			-webkit-flex-wrap: wrap;
			-moz-flex-wrap: wrap;
			-ms-flex-wrap: wrap;
			-o-flex-wrap: wrap;
			flex-wrap: wrap;
			.icon {
				width: 0.26rem;
				height: 0.26rem;
				background: url(../../assets/home/common_img_questions@3x.png) no-repeat;
				background-size: 100%;
				position: relative;
				top: 0.03rem;
			}
			p {
				font-size: 0.26rem;
				width: 6.6rem;
				margin-left: 0.1rem;
				font-weight: bold;
				word-break:break-all;
			}
		}
		.answer {
			margin-top: 0.3rem;
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			/* 12版 */
			-webkit-flex-wrap: wrap;
			-moz-flex-wrap: wrap;
			-ms-flex-wrap: wrap;
			-o-flex-wrap: wrap;
			flex-wrap: wrap;
			.icon {
				width: 0.26rem;
				height: 0.26rem;
				background: url(../../assets/home/common_img_answer@3x.png) no-repeat;
				background-size: 100%;
				position: relative;
				top: 0.03rem;
			}
			p {
				font-size: 0.24rem;
				width: 6.6rem;
				margin-left: 0.1rem;
				word-break:break-all;
			}
		}
		.noAnswer{
			height: 0.44rem;
			font-size: 0.24rem;
			line-height: 0.42rem;
			margin-top: 0.2rem;
			span{
				float: left;
			}
			.right{
				width:1.14rem;
height:.40rem;
border:0.02rem solid rgba(0,0,0,1);
border-radius:.10rem;
float: right;
line-height: 0.4rem;
text-align: center;

			}
		}
		.bottomBox {
			margin-top: 0.3rem;
			color: #999999;
			font-size: 0.2rem;
			margin-bottom: 0.58rem;
		}
	}
</style>
