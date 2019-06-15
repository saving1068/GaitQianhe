<template>
	<div style="background:#ffffff">
		<div class="topBox">
            <div class="price_box">
			<i></i>
			<span style="color: #F6323E;font-size: 0.84rem;">{{points.balanceCash}}</span>
			</div>
		</div>

		<p class="midBox1">
			<i></i>
			<span>{{gradeName}}</span>
		</p>

		<div class="midBox2">
			<span>历史积分：{{points.statHistoryIncome}}</span>
			<span @click="goText">会员权益</span>

		</div>
		<div class="btn" @click="showDia">
			兑换金币
		</div>

		<div class="title">
			<span>任务({{list.length}})</span>
			<div class="right" @click="change">
				<span>全部</span>
				<i :class="[active?'active':'']"></i>
			</div>
		</div>

		<div class="contentBox" v-if="active">
			<div class="item" v-for="item in list">
				<p>{{item.taskName}}</p>
				<div style="display:inline-block;">
					<div class="pointBox">
						<i></i>
						<span>{{item.integral}}</span>
						<span>积分</span>
					</div>
				</div>

				<div class="lineBox">
					<div class="line" :style="[{'width':item.flag==1?'100%':item.num/item.taskNum*100+'%'}]">
						<div class="box" :style="[{'left':item.flag==1?'90%':item.num/item.taskNum*100-10>0?item.num/item.taskNum*100-10+'%':'0%'}]">{{item.flag==1?'100%':`${item.num/item.taskNum*100}%`}}</div>

					</div>

				</div>
				<div class="success" v-if="item.flag!=0">

				</div>
				<div class="goBtn" v-if="item.flag==0" @click="goType(item.type)">
                     去完成
				</div>

			</div>

		</div>







		<div style="height: 1rem;"></div>
		<div class="goCircle" @click="go('Game')">
			<i></i>
			<div class="text" >
				大转盘
			</div>
		</div>

		<div class="dialog" v-if="isShow">
			<div class="mask"></div>
			<div class="box">
				<div class="top">
					兑换金币
					<i @click="isShow=false"></i>
				</div>
				<div class="content">
					<span style="margin-left: 1rem;">兑换数:</span>
					<input type="tel" id="input" placeholder="100积分：1金币" v-model="text"  @focus="focus" @blur="blur"/>
				</div>
				<div class="bottom" @click="submit">
					提交
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	import {Toast} from 'vant'
	export default {
		data() {
			return {
				active: false,
				isShow: false,
				list:[],
				points:{},
				text:"",
				gradeName:"",
				scrollTop:""

			}

		},
		components:{
			Toast

		},
		computed:{
			getLogin(){
				return this.$store.state.bindNumber
			}
		},
		watch:{
			getLogin(a){
				if(a){
					this.getData()
					this.getPoints()
					this.getIntegral()
				}
			}
		},
		created(){
			this.getData()
			this.getPoints()
			this.getIntegral()

		},
		mounted(){
			// this.getText()
		},
		methods: {
			focus(){
              this.scrollTop=document.body.scrollTop  //记录当前位置
			},
			blur(){
              setTimeout(()=>{
				document.body.scrollTop = document.body.scrollHeight;
				},300)
			},
			goType(type){
        if(type==1||type==5){
					this.$router.push({
						name:"UserPage"
					})
					return;
				}
				if(type==2){
					this.$router.push({
						name:"SendTravels"
					})
					return;
				}
				if(type==3||type==4||type==6||type==7){
					this.$router.push({
						name:"Home"
					})
					return;
				}
				if(type==8){
					this.$router.push({
						name:"My"
					})
					return;
				}
			},
			go(text){
				this.$router.push({
					 name:text

				 })

			},
			goText(){
				this.$router.push({
					 name:"WithDraw",
					 query:{
						 key:"会员权益"
					 }

				 })
			},

			getIntegral(){
				this.$Api.My.MyIntegral().then((res)=>{
					console.log(res)
					if(res.q.s==0){
						this.gradeName=res.q.gradeName
					}
				})


			},
			async getData(){
				await this.$Api.My.TaskList().then((res)=>{
					console.log(res)
					this.list=[...res.q.list]
				})

			},
			async getPoints(){
				await this.$Api.My.MyAccountList({a:11}).then((res)=>{
					console.log(res)
					if(res.q.s==0){
						this.points={...res.q.Accounts[0]}
					}


				})


			},

			showDia() {
				this.isShow = true
			},
			change() {
				this.active = !this.active

			},

			submit() {
				document.getElementById("input").blur()
				console.log(this.text)
				if(this.text==""){
						console.log(1)

					Toast({
					message: "请输入积分",
					forbidClick: true,
					position: 'center',
					duration: 2000
				});
					return
				}

				var regDn = /^[0-9]*$/

				if ( !regDn.test(this.text)) {
				console.log(2)
					Toast({
					message: "请输入正确积分",
					forbidClick: true,
					position: 'center',
					duration: 2000
				});
					return

				}

                if(parseInt(this.text)>this.points.balanceCash){
									  console.log(3)
										Toast({
										message: "您拥有的积分不足",
										forbidClick: true,
										position: 'center',
										duration: 2000
									});

                	return
                }

                if(this.text%100!=0){
									Toast({
									message: "请输入积分为100的倍数",
									forbidClick: true,
									position: 'center',
									duration: 2000
								});
                	return

                }

                // console.log(parseInt(this.text))
								if(parseInt(this.text)<100){
								 Toast({
								 message: "请输入积分为100的倍数",
								 forbidClick: true,
								 position: 'center',
								 duration: 2000
							 });
								 return

								}
               // return;

                this.$Api.My.ExchangeMoney({integral:this.text}).then((res)=>{
                	if(res.q.s==0){
                		this.isShow = false
                		this.$toast("兑换成功",'success')
                		this.getData()
			this.getPoints()
                	}


                })


			}

		}
	}
</script>

<style scoped="scoped" lang="scss">
.contentBox {
		border-top: 0.01rem solid #EDEDED;
		.item {
			width: 100%;
			height: 2.15rem;
			border-bottom: 0.01rem solid #EDEDED;
			padding-left: 0.23rem;
			padding-top: 0.3rem;
			box-sizing: border-box;
			position: relative;
			.success {
				width: 0.53rem;
				height: 0.45rem;
				background: url(../../assets/my/my_icon_check@3x.png) no-repeat;
				background-size: 100%;
				position: absolute;
				bottom: 0.33rem;
				right: 0.53rem;
			}
			.goBtn {
				width: 1.11rem;
				height: 0.45rem;
				background: rgba(250, 220, 86, 1);
				border-radius: 0.10rem;
				text-align: center;
				line-height: 0.45rem;
				position: absolute;
				bottom: 0.27rem;
				right: 0.24rem;
				font-size: 0.22rem;
			}
			p {
				font-weight: bold;
				font-size: 0.26rem;
			}
			.pointBox {
				// width: 1.50rem;
				padding-right: 0.24rem;
				height: 0.32rem;
				background: rgba(255, 218, 68, 1);
				border-radius: 0.14rem;
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
				i {
					width: 0.2rem;
					height: 0.15rem;
					background: url(../../assets/my/my_icon_play_little@3x.png) no-repeat;
					background-size: 100%;
					position: relative;
					top: 0.08rem;
					margin-left: 0.24rem;
					margin-right: 0.08rem;
				}
				span {
					font-size: 0.22rem;
					line-height: 0.32rem;
				}
			}
			.lineBox {
				width: 5rem;
				margin-top: 0.45rem;
				height: 0.12rem;
				background: rgba(237, 237, 237, 1);
				border-radius: 0.06rem;
					position: relative;
				.line {
					height: 0.12rem;
					background: #FFDA44;
					border-radius: 0.06rem;

					.box {
						width: 1.00rem;
						height: 0.36rem;
						position: absolute;
						left: 0;
						bottom: -0.12rem;
						background: rgba(255, 255, 255, 1);
						border: 0.01rem solid rgba(255, 218, 68, 1);
						border-radius: 0.18rem;
						text-align: center;
						line-height: 0.36rem;
						font-size: 0.22rem;
					}
				}
			}
		}
	}

	.dialog {

		position: relative;
		.mask {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			z-index: 1000;
			background: rgba(0, 0, 0, .5);
		}
		.inviolableBox{
			position: fixed;
			width: 5.6rem;
			height: 5.34rem;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			background: #FBFBFD;
			z-index: 1001;
			border-radius: 0.1rem;
			.top {
				height: 1.1rem;
				line-height: 1.1rem;
				font-weight: bold;
				color: #1A1A1A;
				border-bottom: 1px solid #CCCCCC;
				text-align: center;
				font-size: 0.34rem;
				position: relative;
				i {
					position: absolute;
					right: 0.24rem;
					width: 0.24rem;
					height: 0.24rem;
					background: url(../../assets/my/common_btn_close2@3x.png) no-repeat;
					background-size: 100%;
					top: 0.37rem;
				}
			}
			.content{

				padding: 0 0.47rem;
				box-sizing: border-box;
				.title{
					font-size: 0.3rem;
					padding: 0.3rem 0 0 0;
				}
				p{
					font-size: 0.26rem;
					line-height: 0.4rem;
				}
			}
			.bottom{
				position: absolute;
				bottom: 0;
				width: 100%;
				left: 0;
				border-radius:0 0 0.1rem 0.1rem ;
				height: 0.88rem;
				line-height: 0.88rem;
				font-size: 0.3rem;
				background: #FCE790;
				text-align: center;
			}
		}

		.box {
			position: fixed;
			width: 5.6rem;
			height: 3.7rem;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			background: #FFFFFF;
			z-index: 1001;
			border-radius: 0.1rem;
			.top {
				height: 1.1rem;
				line-height: 1.1rem;
				font-weight: bold;
				color: #1A1A1A;
				border-bottom: 1px solid #CCCCCC;
				text-align: center;
				font-size: 0.34rem;
				position: relative;
				i {
					position: absolute;
					right: 0.24rem;
					width: 0.24rem;
					height: 0.24rem;
					background: url(../../assets/my/common_btn_close2@3x.png) no-repeat;
					background-size: 100%;
					top: 0.37rem;
				}
			}
			.content {
				height: 1.68rem;
				/*line-height: 1.68rem;*/
				padding-top: 0.71rem;
				input {
					width: 50%;
					height: 0.34rem;
					line-height: 0.34rem;
					border: none;
					font-size: 0.3rem;
				}
			}
			.bottom {
				width: 100%;
				position: absolute;
				bottom: 0;
				left: 0;
				height: 0.88rem;
				background: rgba(252, 231, 144, 1);
				border-radius: 0 0 0.1rem 0.1rem;
				text-align: center;
				line-height: 0.88rem;
				font-size: 0.3rem;
				z-index: 1000;
			}
		}
	}

	.midBox1 {
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
		i {
			width: 0.28rem;
			height: 0.27rem;
			background: url(../../assets/my/my_icon_vip@3x.png) no-repeat;
			background-size: 100%;
			position: relative;
			// top: 0.1rem;
			margin-right: 0.1rem;
			margin-left: 5.78rem;
		}
		span {
			font-size: 0.28rem;
		}
	}

	.midBox2 {
		width: 100%;
		height: 0.3rem;
		padding: 0 0.25rem;
		box-sizing: border-box;
		margin-bottom: 0.4rem;
		margin-top: 0.17rem;
		span:first-child {
			font-size: 0.26rem;
			float: left;
		}
		span:last-child {
			font-size: 0.26rem;
			color: #54A0EC;
			float: right;
		}
	}

	.btn {
		width: 7.02rem;
		height: 0.98rem;
		margin: 0.45rem auto;
		background: rgba(255, 218, 68, 1);
		border-radius: 0.06rem;
		text-align: center;
		line-height: 0.98rem;
	}

	.topBox {
		padding-top: 0.75rem;
		box-sizing: border-box;

		.price_box {
				height: 0.96rem;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				display: flex;
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
				i {
					width: 0.58rem;
					height: 0.58rem;
					background: url(../../assets/my/my_icon_integral@3x.png) no-repeat;
					background-size: 100%;
					float: left;
					margin-right: 0.14rem;
					position: relative;

				}
			}


	}

	.title {
		padding: 0 0.25rem;
		padding-top: 0.22rem;
		margin-bottom: 0.4rem;
		box-sizing: border-box;
		font-size: 0.26rem;
		.right {
			float: right;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			display: flex;
			i {
				background: url(../../assets/my/common_btn_down@3x.png) no-repeat;
				width: 0.16rem;
				height: 0.1rem;
				background-size: 100%;
				position: relative;
				top: 0.15rem;
				margin-left: 0.15rem;
				transition: 0.5s;
			}
			.active {
				transform: rotate(180deg);
			}
		}
	}

	.goCircle {
		width: 1.74rem;
		height: 1.20rem;
		background: rgba(255, 255, 255, 1);
		border-radius: 1.2rem 0 0 1.2rem;
		box-shadow: 0.01rem 0rem 0.06rem rgba(0, 0, 0, 0.2);
		padding-left: 0.04rem;
		padding-top: 0.06rem;
		box-sizing: border-box;
		position: fixed;
		right: 0;
		bottom: 3.9rem;
		display: flex;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		i {
			width: 1.1rem;
			height: 1.1rem;
			background: url(../../assets/home/home_img_turntable@3x.png) no-repeat;
			background-size: 100%;
			border-radius: 50%;
		}
		.text {
			width: 0.24rem;
			font-size: 0.22rem;
			color: #FF7900;
			line-height: 0.24rem;
			padding-top: 0.16rem;
			box-sizing: border-box;
			margin-left: 0.05rem;
		}
	}

</style>
