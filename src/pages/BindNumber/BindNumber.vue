<template>
	<div>
		<div class="content" :style="[{'position':oninput?'static':'fixed','height':windowHeight}]">
			<div class="content_val">
				<div class="content_title">账号绑定</div>
				<div class="number">
					<input v-model="mobile" type="number" @input="numberCheak" placeholder="请输入手机号" @blur="out"/>
				</div>
				<div class="code">
					<input type="number" v-model="smsCode"  placeholder="请输入验证码" @input="onlineCheak" @blur="out"/>
					<p v-if="ifSend" @click="getSmsCode(1)">获取验证码</p>
					<p v-else>{{sendTime}}S</p>
				</div>
				<div class="error" v-show="ifError">
					<p></p>
					<font>验证码有误</font>
				</div>
				<div :class="[ifOk? 'suer_btn_active':'suer_btn']" @click="bindNumber()">
					立即绑定
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default{
		created(){
		},
		data(){
			return{
				ifError:false,
				mobile:"",
				smsCode:"",
				sendTime:60,
				ifSend:true,
				ifOk:false,
				checkKey:"",
				oninput:false,
				windowHeight:document.documentElement.clientHeight+"px",
				sendFlag:false
			}
		},
		computed:{
			getLogin(){
	      return this.$store.state.bindNumber
	    }
		},
		watch:{
			getLogin(a){
	      if(a){
	        this.$router.replace({
	          name:"Home"
	        })
	      }
	    }
		},
		methods:{
			out(){
				this.oninput = false;
				console.log('out')
			},
			numberCheak(){
				this.oninput = true;
				console.log(this.oninput,"in")
				this.mobile = this.mobile.length>11? this.mobile.slice(0,11):this.mobile;
			},
			bindNumber(){
				let flag=false
      if(this.sendFlag){
				return ;
			}else{
				flag=true
			}

				var obj ={
						a:2,
						type:9,
						mobile:this.mobile,
						code:this.smsCode
					}
					this.$Api.UserPage.SMSCode(obj).then((res)=>{
						console.log(res)
						if(res.q.s == 0){
							var obj ={
								mobile:this.mobile,
								checkKey:res.q.checkKey,
								shareBy:0
							}
							this.$Api.UserPage.UserBindingSubmit(obj).then((res)=>{
								console.log(res)
								if(res.q.s == 0){
										this.ifOk = true
										this.ifError = false
										this.$store.state.bindNumber = true
                    this.sendFlag=false
										this.getMyuser()
                      this.$router.go(-1)
									}else{
										this.sendFlag=false
										this.ifError = true
										this.ifOk = false
										Toast(res.q.d);
									}
							})
						}else{
							this.ifError = true
							this.ifOk = false
							Toast(res.q.d);
						}
					})
			},
			getMyuser(){
	      this.$Api.UserPage.UserDetails({a:0}).then((res)=>{
	        if(res.q.s==0){
	          let user={...res.q.user}
	          if(user.imagePath == undefined) {
	            user.imagePath = require("../../assets/common/placeholder_200x200.png")
	          }

	          this.$store.state.bindNumber = res.q.user.isBindMobile == 1? true:false;
	          this.$store.dispatch("changeUserObj",user)



	        }


	      })
	    },
			onlineCheak(){
				this.oninput = true
				if(this.smsCode.length==6){
					var obj ={
						a:2,
						type:9,
						mobile:this.mobile,
						code:this.smsCode
					}
					this.$Api.UserPage.SMSCode(obj).then((res)=>{
						console.log(res)
						if(res.q.s == 0){
//							var obj ={
//								mobile:this.mobile,
//								checkKey:res.q.checkKey
//							}
//							this.$Api.UserPage.UserBindingSubmit(obj).then((res)=>{
//								console.log(res)
//								if(res.q.s == 0){
										this.ifOk = true
										this.ifError = false
//										this.ifError = true

//									}
//							})
						}else{
							this.ifError = true
							this.ifOk = false
							Toast(res.q.d);
						}
					})
				}
			},
			getSmsCode(a){
				if(this.mobile.length<11){
					Toast({
						message: "手机号码不正确，请重新输入",
						forbidClick: true,
						position: 'center',
						duration: 2000
					});

				}else{
					var obj ={
						a,
						type:9,
						mobile:this.mobile,
	//					code:this.smsCode
					}
					if(a==2){
						obj.code = this.smsCode
					}
					this.$Api.UserPage.SMSCode(obj).then((res)=>{
						console.log(res)
						this.checkKey = res.q.checkKey
						if(res.q.s == 0){
							if(a==1){
								this.ifSend = false;
						var timer = setInterval(()=>{
									this.sendTime--
									if(this.sendTime<=0){
										this.sendTime=60;
										clearInterval(timer)
										this.ifSend = true;
									}
								},1000)

						Toast({
							message: "发送成功",
							forbidClick: true,
							position: 'center',
							duration: 2000
						});
//								Toast(res.q.d);
							}
						}else{
//							this.ifError = true
							Toast(res.q.d);
						}
					})
				}

			},
		}
	}
</script>

<style scoped="scoped" lang="less">
	.content{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-image:url(../../assets/bg_login@2x.png);
		/*background: black;*/
		background-repeat: no-repeat;
		background-size: 100% 100%;
		padding-top: 1.82rem;
		.content_val{
			width:7.02rem;
			height:6.28rem;
			background:rgba(249,249,249,.5);
			border-radius:0.36rem;
			position: relative;
			margin: 0 auto;

			.content_title{
				font-size:0.36rem;
				font-family:PingFang-SC-Bold;
				color:#333333;
				text-align: center;
				line-height: 1rem;
				font-weight: 600;
			}
			.number{
				height: 1.5rem;
				width: 6rem;
				margin: 0 auto;
				padding-top: .85rem;
				border-bottom: 0.01rem solid #EDEDED;
				input{
					width: 100%;
					border: none;
					background: none;
				}
			}
			.code{
				height: 1.5rem;
				width: 6rem;
				margin: 0 auto;
				padding-top: .85rem;
				padding-bottom: 0.1rem;
				border-bottom: 0.01rem solid #EDEDED;
				input{
					width: 4.4rem;
					border: none;
					background: none;
				}
				p{
					float: right;
					background: #FFDA44;
					width:1.6rem;
					height: 100%;
					font-size: 0.26rem;
					text-align: center;
					line-height: 0.6rem;
					border-radius: 0.15rem;
				}
			}
			.error{
				padding: 0.22rem 0 0 .47rem;
				p{
					width:0.3rem;
					height:0.3rem;
					float: left;
					background-image: url(../../assets/icon_error@2x.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					margin-top: 0.01rem;
				}
				font{
					color:#666666 ;
					font-size: 0.22rem;
					padding-left: 0.1rem;
					line-height: 0.1rem;
				}
			}
			.suer_btn{
				width:6rem;
				height:0.94rem;
				background: #CCCCCC;
				text-align: center;
				font-size: 0.36rem;
				border-radius: 0.46rem;
				line-height: 0.94rem;
				color: #FFFFFF;
				position: absolute;
				top: 4.8rem;
				left: 0.51rem;
			}
			.suer_btn_active{
				width:6rem;
				height:0.94rem;
				background: #FFDA44;
				text-align: center;
				font-size: 0.36rem;
				border-radius: 0.46rem;
				line-height: 0.94rem;
				position: absolute;
				top: 4.8rem;
				left: 0.51rem;
			}
		}

	}
</style>
