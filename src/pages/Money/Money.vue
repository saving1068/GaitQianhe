<template>
	<div style="background:#FFFFFF;">
		<div class="top">
			<div class="price">
				<div class="price_box">
					<i></i>
					<span style="font-size: 0.82rem;">{{cash.balanceTotal}}</span>
				</div>
			</div>
			<div class="bottom">
				<span @click="go('MoneyDetails')" style="float: left;">待入账收益：￥{{balance}}</span><i></i>
				<span style="color: #54A0EC;float: right;" @click="go('WithDraw')">提现规则</span>
			</div>
		</div>
		<div class="btn" @click="showDia">
			去提现
		</div>
		<div class="title">
			<span>金币明细</span>
			<div class="right" @click="change">
				<span>全部</span>
				<i :class="[active?'active':'']"></i>
			</div>
		</div>
		<div class="itemBox" v-if="active">
			<div class="item" v-for="item in list">
				<div class="left">
					<p>{{item.note}}</p>
					<p>{{item.transTime}}</p>
				</div>
				<div class="right">
					<span>{{item.amount}}</span>
				</div>
			</div>


		</div>

		<div class="dialog" v-if="isShow">
			<div class="mask"></div>
			<div class="box">
				<div class="topBox">
					提现申请
					<i @click="close"></i>
				</div>
				<div class="content">
					<div class="midBox"  @click="focus">
					<span>金币提现:</span>
					<form action="" style="margin-left:0.3rem">
						<input type="number" placeholder="请输入提现金额"  v-model="text" ref="inputDom" @focus="inputFocus" @blur="blur"/>
					</form>
					</div>
					<p>提现金额不能低于{{value}}元</p>
				</div>
				<div class="bottom" @click="submit">
					提交
				</div>
			</div>

		</div>

		<div class="dialog" v-if="isComfirm">
			<div class="mask"></div>
			<div class="box">
				<div class="topBox">
					提现申请
					<i @click="close"></i>
				</div>
				<div class="content" style="padding-top: 0.46rem;font-size: 0.26rem;text-align: center;padding-left:0.34rem ;padding-right:0.34rem ;">
					您的申请已发送，请在金币明细申请留言查看申请信息
				</div>
				<div class="bottom" @click="comfirm">
					确认
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
				isComfirm: false,
				cash: {},
				list:[],
				text:"",
				balance:0,
				value:0,
				sendFlag:false,
				scrollTop:0
			}

		},
		created() {
			this.getData()
      this.getDetails()
     this.getText()
		 this.getIc()
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
					this.getDetails()
				}
			}
		},
		methods: {
			inputFocus(){
              this.scrollTop=document.body.scrollTop  //记录当前位置
				
			},
			blur(){
				setTimeout(()=>{
				document.body.scrollTop = document.body.scrollHeight;
				},300)
			},
			focus(){
            this.$refs.inputDom.focus()
			},
			async getIc(){
				this.$Api.My.MyIncome().then((res)=>{

					this.balance=res.q.balanceFronzen
					console.log(res)
				})
			},
			async getText(){
				this.$Api.Common.QuerySetting({key:'user.withdraw.cashes'}).then((res)=>{
						 console.log(res)
						 if(res.q.s==0){
							 this.value=res.q.settings.value



						 }

				})
			},
			getData() {

				this.$Api.My.MyAccountList({
					a: 1
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.cash = res.q.Accounts[0]

					}

				})
			},
			getDetails(){

				this.$Api.My.AccountDetailList({a:1}).then((res)=>{
					if(res.q.s==0){
						this.list=[...res.q.accountLogs]
						for(let i=0;i<this.list.length;i++){
							this.list[i].transTime=this.list[i].transTime.substr(0,this.list[i].transTime.length-3)
							if(this.list[i].amount>0){
								this.list[i].amount="+"+this.list[i].amount
							}
						}
					}


				})
			},
			change() {
				this.active = !this.active

			},
			close() {
				this.isShow = false
				this.isComfirm = false
			},
			showDia() {

				this.isShow = true
			},
			submit() {
				if(this.text>this.cash.balanceTotal){
					Toast({
						message: "您拥有的金币不足",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});

                	return

				}

				if(this.text<parseFloat(this.value)){
					let that=this
					Toast({
						message: "提现金额不能低于"+that.value,
						forbidClick: true,
						position: 'center',
						duration: 2000
					});

                	return ;

				}
				if(this.sendFlag){
					return
				}
				this.sendFlag=true
				this.$Api.My.CashApplySubmit({amount:this.text}).then((res)=>{
					if(res.q.s==0){

						this.isShow = false
				this.isComfirm = true
					}else{
						Toast({
						message: res.q.d,
						forbidClick: true,
						position: 'center',
						duration: 2000
					});
					}
             this.sendFlag=false
				})



			},
			comfirm() {
				this.isComfirm = false
				this.text=""
				this.getData()
				this.getDetails()
				this.getIc()
			},

			go(name) {
				if(name=="WithDraw"){
					this.$router.push({
						name: name,
						query:{
							key:"提现规则"
						}

					})

				}else{
					this.$router.push({
						name: name

					})
				}


			}

		}

	}
</script>

<style scoped="scoped" lang="scss">
	.dialog {
		position: relative;
		.mask {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 200;
			background: rgba(0, 0, 0, .5);
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
			z-index: 201;
			border-radius: 0.1rem;
			.topBox {
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
				padding-top: 0.5rem;
				.midBox{
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
					span {


					height: 0.45rem;
					line-height: 0.45rem;
					box-sizing: border-box;
					font-size: 0.34rem;
				}
				form {
				    width:45%;
					height: 0.45rem;

					box-sizing: border-box;
					input {
						width: 100%;
						height: 0.45rem;
						position: relative;
						line-height: 0.45rem;
						border: none;
						font-size: 0.34rem;
					}
				}




				}




				p {
					width: 100%;
					font-size: 0.22rem;
					color: #999999;
					text-align: center;
					margin-top: 0.3rem;
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
			}
		}
	}

	.top {
		padding-top: 0.8rem;
		height: 3rem;
		box-sizing: border-box;
		.price {
			height: 0.96rem;
			line-height: 0.96rem;
			position: relative;
			color: #F6323E;
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
					background: url(../../assets/my/my_icon_gold@3x.png) no-repeat;
					background-size: 100%;
					float: left;
					margin-right: 0.14rem;
					position: relative;

				}
			}
		}
		.bottom {
			padding: 0 0.25rem;
			box-sizing: border-box;
			font-size: 0.26rem;
			margin-top: 0.85rem;
			i {
				width: 0.12rem;
				float: left;
				height: 0.22rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
				position: relative;
				top: 0.08rem;
				margin-left: 0.1rem;
			}
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

	.itemBox {
		.item {
			border-bottom: 1px solid #EDEDED;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			display: flex;
			padding: 0.37rem 0.25rem 0.39rem;
			.left {
				width: 80%;
				p:first-child {
					font-size: 0.26rem;
				}
				p:last-child {
					color: #999999;
					font-size: 0.22rem;
					margin-top: 0.2rem;
				}
			}
			.right {
				width: 20%;
				position: relative;
				box-sizing: border-box;
				color: #51AA38;
				text-align: right;
				span {
					position: absolute;
					top: 30%;
					right: 0;
				}
			}
		}
		.item:first-child {
			border-top: 1px solid #EDEDED;
		}
	}
</style>
