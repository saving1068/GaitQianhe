<!-- 免单待完善资料页面的确认订单页面 -->
<template>
	<div class="affirmIndent">
		
		<!-- 确认订单 -->
		<h1 class="cf">
			<span class="fl">确认订单</span>
			<span class="fr" v-show=" goods.returnCash == 1">返现活动正在进行中~</span>
		</h1>
		<section>
			<h2 v-text="order.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h2>
			<p>套餐类型：{{ order.setMeal }}</p>
			<p class="cf">
				出行日期：{{ tripDate }}
				<span class="fr" @click="goGaitQianheAgreement($event)">购买须知</span>
			</p>
			
			<!-- 领取成功隐藏价格之类信息 -->
			<!--<div class="hid_cost" v-show="false">
				<p>商品总价：¥4999</p>
				<p>优惠券：-¥100</p>
				<p>金额抵扣：-¥1000</p>
				<p>实付金额：¥3899</p>
			</div>-->
			
		</section>
		<div class="indent_number cf">
			
			购买数量
			<div class="counter fr">
				<i class="fa fa-minus"></i>
				<span>{{ num }}</span>
				<i class="fa fa-plus"></i>
			</div>
	
		</div>
		<div class="numberBox cf">
			成人
			<span class="number">¥<b>0</b></span>
			<span class="fr">剩余数量0件</span>

		</div>
		
		<!-- 出行人信息（1） -->
		<section class="trip_text" v-for="(item,index) in tripMan">
			
			<h3>
				<span>出行人信息（{{ index+1 }}）</span>
			</h3>
			
			<form class="cf">
				<p class="fl"><span>*</span>姓名</p>				
				<input type="text" placeholder="输入姓名" class="input_mag" v-model.trim="item.name" maxlength="10"/>
			</form>
			<form class="cf">
				<p class="fl"><span>*</span>手机</p>				
				<input type="text" placeholder="输入手机" class="input_mag" v-model.trim="item.mobile" maxlength="11" @blur="handleFilterLetters(item.mobile)"/>
			</form>
			<form class="cf">
				<p class="fl"><span>*</span>身份证号</p>				
				<input type="text" placeholder="输入身份证号码" v-model.trim="item.IDnumber" maxlength="18" @blur="verifyIdNumber(item.IDnumber)"/>
			</form>
			<form class="cf">
				<p class="fl"><span style="opacity: 0;">*</span>其他信息</p>				
				<input type="text" placeholder="若订单需要护照等信息请填写于此" v-model.trim="item.otherinfo" maxlength="100"/>
			</form>
			
		</section>	
		
		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer">
			<div class="fl footerText">此订单为幸运转盘奖项~<br />请确认清楚填写信息</div>
			<button class="fr" @click="Sub">确认</button>
		</footer>

	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			orderId:this.$route.query.orderId,  //公告拼团点击的那条信息spuId；
			num:1,
			tripMans:[],  
			groupLists:[],
			goods:[],
			resq:{},
			isAcc:false,  
			order:{},
			tripDate:'',
			tripMan:[],//出行人信息；
			
		}
	},
	created() {

		this.OrderDetails(); //订单详情接口；
		
		let obj={
				name:'',
				mobile:'',
				IDnumber:'',
				otherinfo:''
			};
		
		this.tripMan.push(obj);
		
	},
	mounted() {

		
	},
	
	//计算属性；
	computed:{
  	
	  	
	},
  	
	methods: {
		//跳转我的订单页面；
		goMyIndent(){
			
			this.$router.push({  
				name: "MyIndent",
				query: {
					
				}
			})
			
		},
		//确认；
		Sub(){
			//判断出行人信息不能为空；
			for(let i=0;i<this.tripMan.length;i++){
				//console.log(this.tripMan[i])
				if(this.tripMan[i].name == '' && this.tripMan[i].mobile == '' && this.tripMan[i].IDnumber == ''){
					Toast('亲，出行人信息必填项都需要填！');
					//console.log('必填项不能为空')
				}else if(this.tripMan[i].name == ''){
					Toast('亲，出行人姓名没填！');
					//console.log('出行人姓名不能为空')
				}else if(this.tripMan[i].mobile == ''){
					Toast('亲，出行人手机没填！');
					//console.log('出行人手机不能为空')
				}else if(this.tripMan[i].IDnumber == ''){
					Toast('亲，出行人身份证没填！');
					//console.log('出行人身份证不能为空')
				}else{
					let OrdObj = {
						a:8,
						subOrderId:this.order.id,
						orgId:this.order.orgId,  //机构ID；
						couponId:0,
						skuId:this.order.skuId,  //商品id；
						spuId:this.order.spuId,  //产品id；
						dateId:this.order.dateId, //出行日期id；
						num:0,  //商品数量；
						tripManType:1, //出行人类型: 1 成人 2.儿童；
						tripMans:this.tripMan
					};
					//console.log(OrdObj.tripMans)
					this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
						console.log(res)
						
						if(res.q.s == 0){
							this.goMyIndent();
						}
					});
				}
			}
		},
		//订单详情；
		OrderDetails(){
			let detObj = {
				orderId:this.orderId   //子订单id；
			};
			
			this.$Api.Shop.OrderDetails(detObj).then( res => {
				console.log(res)
				
				this.order = res.q.order;
				this.tripMans = res.q.order.tripMans;
				this.spuId = res.q.order.spuId;  //点击商品信息中的旅行商品标题，跳转到商品详情页面的spuId;
				let date = new Date(res.q.order.tripDate),
				    dateY = date.getFullYear(),
					dateM = date.getMonth()+1,
					dateD = date.getDate();
				this.tripDate = `${dateY}-${dateM}-${dateD}`;	
				//console.log(this.tripDate)
				
			});
			
		},
		
		//跳转《步履千寻服务使用协议》页面；
		goGaitQianheAgreement(event){			
			event = event || window.event;		
			let keys = event.target.innerHTML.replace(/《|》/g,"");			
			//console.log(event.target.innerHTML.replace(/《|》/g,""));
			
			this.$router.push({  
				name: "WithDraw",
				query: {
					key:keys
				}
			})
			
		},
		
		handleFilterLetters(mobile){
			//console.log('手机号验证',this.tripMans)
			let reg = /[^\d]/g;
			
			if ( reg.test( mobile ) ) {
				Toast('请输入正确手机号格式！');
				this.tripMan.forEach( (item) => {
            		//console.log('手机Value值',item.mobile)
	            	item.mobile = '';
	            });
			} else{
				
			} 
        },
        
        verifyIdNumber(IDnumber){
        	let reg = /[^\dX|x]/ig;

        	if( reg.test( IDnumber ) ){
        		Toast('请输入正确身份证格式！');
        		this.tripMan.forEach( it => {
            		it.IDnumber = "";
	            })
				//console.log('验证成立')
			}else{

				//console.log('验证不成立')
			}
        }
	},
	
}

</script>

<style scoped lang="less">
h1{margin: 0 0 !important;}
/*该商城首页确认订单页面样式*/
.affirmIndent{
	background: #fff;
	
	/*确认订单样式*/
	h1{
		height: 1.15rem;
		padding: 0.4rem 0.25rem 0;
		box-sizing: border-box;
		
		span{
			font-size:0.3rem;
			font-family:PingFang-SC-Bold;
			color:rgba(51,51,51,1);
			
		}
		span:nth-of-type(1){
			padding-left: 0.1rem;
			border-left: 0.05rem solid #fadc56;
			height: 0.4rem;
			vertical-align: top;
			font-weight: 600;
		}
		span:nth-of-type(2){
			color:rgba(246,50,62,1);
			font-size: 0.25rem;
			height: 0.4rem;
			line-height: 0.4rem;
		}
	}
	
	section:nth-of-type(1){
		padding: 0.4rem 0.25rem 0;
		box-sizing: border-box;
		h2{
			font-size:0.3rem;
			font-family:PingFang-SC-Bold;
			color:rgba(51,51,51,1);
			line-height:0.5rem;
			font-weight: 600;
		}
		p{
			font-family:PingFang-SC-Regular;
			color:rgba(102,102,102,1);
		}
		p:nth-of-type(1){
			font-size:0.24rem;
			padding-top: 0.3rem;
		}
		p:nth-of-type(2){
			font-size:0.24rem;
			padding-top: 0.3rem;
			padding-bottom: 0.3rem;
			border-bottom: 1px solid #ccc;
			span{
				color:rgba(246,50,62,1);
			}
		}

	}
	
	.indent_number{
		height: 1rem;
		padding: 0 0.25rem;
		box-sizing: border-box;
		line-height: 1.2rem;
		font-size:0.3rem;
		
		.counter{
			height: 1rem;
			span{
				width: 0.32rem;
				height: 100%;
				background: #fff;
				font-size:0.38rem;
				font-family:PingFang-SC-Bold;
				color:rgba(40,40,40,1);
				margin-left: 0.6rem;
			}
			i{
				margin-left: 0.6rem;
			}
		}
		
	}
	
	.numberBox{
		padding-left: 0.25rem;
		box-sizing: border-box;
		font-size:0.22rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(40,40,40,1);
		.number{
			color:rgba(246,50,62,1);
			font-size: 0.2rem;
			padding-left: 0.2rem;
			b{
				font-size: 0.3rem;
			}
		}
		span:nth-of-type(2){
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
			line-height:0.4rem;
			padding-right: 0.55rem;
		}
	}
	
	
	/*出行人信息*/
	.trip_text{
		padding: 0 0.25rem;
		box-sizing: border-box;
		border-bottom: 1px solid #ededed;
		h3{
			height: 0.88rem;
			line-height: 0.88rem;
			span{
				padding-left: 0.1rem;
				border-left: 0.05rem solid #fadc56;
				height: 0.4rem;
				vertical-align: top;
				font-weight: 600;
				font-size:0.3rem;
				font-family:PingFang-SC-Bold;
				color:rgba(51,51,51,1);
			}
		}
		
		form{
			height: 0.94rem;
			border-bottom: 1px solid #ededed;
			line-height: 0.92rem;
			color:rgba(204,204,204,1);
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color: #333;
				span{
					color: #f6323e;
				}
			}
			input{
				border: none;
				width: 5rem;
				text-indent: 1.4rem;
				font-size:0.3rem;
				font-family:PingFang-SC-Regular;
				color:rgba(51,51,51,1);
			}
			.input_mag{
				margin-left: 0.45rem;
			}
		}
		form:nth-of-type(4){
			input{margin-left: 1.4rem;text-indent: 0rem;width: 4.55rem;}
		}
		form:last-child{
			border-bottom: none;
		}
	}
	
	
	/*优惠信息*/
	.discounts_text{
		padding: 0 0.25rem;
		box-sizing: border-box;
		h3{
			height: 0.88rem;
			line-height: 0.88rem;
			span{
				padding-left: 0.1rem;
				border-left: 0.05rem solid #fadc56;
				height: 0.4rem;
				vertical-align: top;
				font-weight: 600;
				font-size:0.3rem;
				font-family:PingFang-SC-Bold;
				color:rgba(51,51,51,1);
			}
		}
		
		div{
			height: 0.9rem;
			line-height: 0.9rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Regular;
			color:rgba(51,51,51,1);
			border-bottom: 1px solid #ccc;
			span:nth-of-type(1){
				font-size:0.18rem;
				font-family:PingFang-SC-Regular;
				color:rgba(255,60,60,1);
				padding: 0.04rem;
				border: 1px solid rgba(255,60,60,1);
				font-style: normal;
			}
			span:nth-of-type(2){
				font-size:0.3rem;
				font-family:PingFang-SC-Regular;
				color:rgba(102,102,102,1);
				margin-right: 0.5rem;
			}
		}
		div:nth-of-type(1){
			background: url(../../assets/common/common_btn_right@3x.png) no-repeat 6.7rem 0.33rem;
			background-size: 0.12rem 0.22rem;
		}
		div:nth-of-type(2){
			/*background: url(../../assets/shop_img_check@2x.png) no-repeat 6.6rem 0.27rem;*/
			/*background-size: 0.36rem 0.36rem;*/
			span:nth-of-type(1){
				border: none;
				padding: 0;
				font-size:0.3rem;
			}
			
		}
		
		h4{
			height: 1rem;
			line-height: 1rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(51,51,51,1);
			span{
				color: #4DA9FF;
			}
		}
	}
	
	/*底部提问输入框样式*/
	.footer_equal{
		width: 100%;
		height: 0.98rem;
		/*background: pink;*/
	}
	.footer{
		width: 100%;
		height: 0.98rem;
		border-top: 1px solid #efefef;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		p{
			font-size:0.24rem;
			font-family:PingFang-SC-Bold;
			color:rgba(246,50,62,1);
			padding: 0.3rem 0 0 0.25rem;
			b{
				font-size:0.3rem;
			}
		}
		p:nth-of-type(1){
			font-size:0.2rem;
			color:rgba(153,153,153,1);
			padding: 0.4rem 0 0 0.3rem;
			text-decoration: line-through;
		}
		.footerText{
			width: 50%;
			height: 100%;
			font-size: 0.26rem;
    		font-family: PingFang-SC-Regular;
    		color: #666;
    		padding: 0.1rem 0 0 0.25rem;
		}
		button{
			/*width:3.75rem;*/
			width: 50%;
			height:0.98rem;
			background:rgba(250,220,86,1);
			outline: none;
			border: none;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(26,26,26,1);
			line-height:0.5rem;
			text-align: center;
		}
	}
	
}

/*领取成功隐藏价格之类信息*/
.hid_cost{
	
	p{
		padding: 0 !important;
		line-height: 0.5rem !important;
		border-bottom: none !important;
		font-size:0.24rem !important;
		color:rgba(102,102,102,1) !important;
	}
	
	p:nth-of-type(4){
		color: #f6323e !important;
	}
}

/*领奖提示样式*/
.accept_tips{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 200;
	background: rgba(0,0,0,0.7);
	.accept_ok{
		width:5.6rem;
		height:4.2rem;
		background:rgba(255,255,255,1) url(../../assets/shop_img_bag@2x.png) no-repeat 2.3rem 0.45rem;
		background-size: 1.1rem 1.5rem;
		border-radius:0.1rem;
		position: absolute;
		left: 0.95rem;
		top: 3.3rem;
		img{
			width: 0.22rem;
			height: 0.22rem;
			position: absolute;
			top: 0.1rem;
			right: 0.1rem;
		}
		p{
			width:4.4rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
			text-align: center;
			line-height:0.36rem;
			position: absolute;
			top: 2.3rem;
			left: 0.6rem;
		}
		button{
			width:100%;
			height:0.88rem;
			background:rgba(252,231,144,1);
			text-align: center;
			line-height: 0.88rem;
			position: absolute;
			left: 0;
			bottom: 0;
			border-radius: 0 0 0.1rem 0.1rem;
		}
	}
}
</style>
<style scoped lang="less">
/*该页面相同的样式*/
.cf:after{
	content: '';
	display: block;
	clear: both;
}

.fl{
	float: left;
}

.fr{
	float: right;
}

button{
	outline: none;
	border: none;
}

/*支付成功和失败样式*/
.pay{
	width:3.44rem;
	height:3.56rem;
	background:rgba(26,26,26,1) url(../../assets/common_icon_ok@2x.png) no-repeat 1.2rem 0.8rem;
	background-size: 1.05rem 1.05rem;
	opacity:0.8;
	border-radius:0.3rem;
	position: fixed;
	left: 2rem;
	top: 3.7rem;
	font-size:0.34rem;
	font-family:PingFang-SC-Medium;
	color:rgba(255,255,255,1);
	line-height:5rem;
	text-align: center;
}

.pay_no{
	background: rgba(26,26,26,1) url(../../assets/common_btn_close3@2x.png) no-repeat 1.2rem 0.8rem;
	background-size: 1.05rem 1.05rem;
}
</style>