<template>
	<div style="min-height: 100vh;background:#F9F9F9;position:relative;">
		<div class="top">
			<!-- 顶部输入 -->
			<div class="inputBox">
				<form action="" onsubmit="return false">
					<input type="search" placeholder="请输入兑换码" @keyup.enter="searchGoods" v-model="couponCardNum" />
				</form>
			</div><span @click="sendData">兑换</span>
		</div>
		<!-- tabbar -->
		<div class="mid">
			<li :class="[active==0?'active':'']" @click="change(0)">未使用</li>
			<li :class="[active==1?'active':'']" @click="change(1)">已使用</li>
			<li :class="[active==2?'active':'']" @click="change(2)">已过期</li>
			<div class="line" :style="lineStyle"></div>
		</div>

	 <!-- 内容 -->
		<div class="box">
			<div class="item canUse" v-if="active==0" v-for="item in list" :key="item.id" @click="go(item.orgId)">
				<div class="left">
					<p>
						<span>￥</span><span>{{parseInt(item.totalAmount)}}</span>
					</p>
					<p>满{{parseInt(item.startAmount)}}元可使用</p>
				</div>
				<div class="right">
					<div class="topBox">
						{{item.name}}
					</div>
					<p>{{item.orgId!=0?item.orgName:"步履千寻优惠券"}}</p>
					<span class="sign">{{item.residueDate!=0? `${item.residueDate}天`:'即将过期'}}</span>
				</div>
			</div>
			<div class="item canTUse" v-if="active!=0" v-for="item in list" :key="item.id">
				<div class="left">
					<p>
						<span>￥</span><span>{{parseInt(item.totalAmount)}}</span>
					</p>
					<p>满{{parseInt(item.startAmount)}}元可使用</p>
				</div>
				<div class="right">
					<div class="topBox">
						{{item.name}}
					</div>
					<p>{{item.orgId!=0?item.orgName:"步履千寻优惠券"}}</p>
					<span class="sign" v-if="active==1">已使用</span>
                    <span class="sign" v-if="active==2">已过期</span>
				</div>

			</div>

		</div>

		<!-- 无数据 -->
     <div class="noData" v-if="list.length==0">
     	<div class="icon">

     	</div>
			<p>没有可使用的优惠券</p>
     </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,  //激活下标
				list:[],    //数据
				couponCardNum:""  //输入框
			}

		},
		computed: {
			lineStyle() {         //tabbar 下方横杆
				if(this.active == 0) {
					return {
						'left': '13%'
					}
				} else if(this.active == 1) {
					return {
						'left': '46%'
					}

				} else if(this.active == 2) {
					return {
						'left': '79%'
					}

				}

			}

		},
		created(){
		this.getData()   //获取数据
		},
		methods: {
			go(id){
        if(id!=0){        //跳转店铺
					this.$router.push({
						name:'MerchantIndex',
						query:{
							orderId:id
						}
					})

				}else{          //跳转商品首页
					this.$router.push({
						name:'ShoppingMall'
					})
				}

			},
			  searchGoods(event) {         //调用发送函数

			     this.sendData()

			  },


			change(num) {              //改变tabbar
				this.active = num
				this.getData()           //获取数据
			},
			sendData(){
				let obj={
					couponCardNum:this.couponCardNum        //输入框内容
				}
				this.$Api.My.CouponSubmit(obj).then(res=>{
					if(res.q.s==0){  //成功
						this.$toast("兑换成功",'success')

						this.getData()   //重新获取数据
					}else{
						this.$toast(res.q.d,'error')     //失败

					}
					console.log(res)
				})
			},
			getData(){           //获取数据
				let obj={
					status:this.active+1       //根据下标
				}
				this.list=[]    //先清空数组
				this.$Api.My.CouponList(obj).then((res)=>{
					this.list=[...res.q.coupons]   //赋值
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
			background: url("../../assets/coupon@3x.png") no-repeat;
			background-size:100% 100%;
		}
		p{
			font-size: 0.3rem;
			color: #999999;
			margin-top: 0.4rem;
			text-align: center;
		}

}

	.top {
		padding: 0.24rem 0.3rem 0.3rem 0.3rem;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		display: flex;
		.inputBox {
			width: 6rem;
			height: 0.60rem;
			background: rgba(255, 255, 255, 0.8);
			border-radius: 0.30rem;
			box-shadow: 0rem 0rem 0.1rem 0rem rgba(0, 0, 0, 0.37);
			padding: 0 0.3rem;
			form{
				height: 100%;
			}
			input {
				width: 100%;
				border: none;
				height: 100%;
				font-size: 0.24rem;
			}
		}
		span {
			margin-left: 0.26rem;
			font-size: 0.3rem;
			line-height: 0.6rem;
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
		margin-bottom: 0.15rem;
		position: relative;
		.line {
			position: absolute;
			width: 0.6rem;
			height: 0.02rem;
			background: rgba(250, 220, 86, 1);
			border-radius: 0.01rem;
			top: 0.7rem;
			transition: 0.5s;
		}
		li {
			width: 33.33%;
			height: 0.9rem;
			line-height: 0.9rem;
			text-align: center;
			color: #999999;
			font-size: 0.3rem;
		}
		.active {
			color: #FADC56;
		}
	}

	.box {
		.item {
			width: 6.9rem;
			height: 2rem;
			margin: auto;
			margin-bottom: 0.3rem;
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
			.left {
				width: 2.4rem;
				padding: 0.4rem 0.25rem 0.53rem 0.25rem;
				box-sizing: border-box;
				p:first-child {
					text-align: left;
					font-weight: bold;
					span:first-child {
						font-size: 0.42rem;
					}
					span:last-child {
						font-size: 0.68rem;
					}
				}
				p:last-child {
					text-align: left;
					font-size: 0.22rem;
					padding-left: 0.09rem;
					box-sizing: border-box;
				}
			}
			.right {
				width: 4.5rem;
				position: relative;
				padding-top: 0.3rem;
				padding-left: 0.2rem;
				box-sizing: border-box;
				.sign {
					color: #F6323E;
					font-size: 0.22rem;
					position: absolute;
					bottom: 0.25rem;
					right: 0.25rem;
				}
				.topBox {
					width: 3.25rem;
					font-size: 0.26rem;
					height: 0.7rem;
					margin-bottom: 0.5rem;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				p {
					color: #999999;
					font-size: 0.22rem;
				}
			}
		}
		.canUse {
			background: url(../../assets/common_bg_coupon_pre@2x.png) no-repeat;
			background-size: 100%;
		}
		.canTUse {
			background: url(../../assets/common_bg_coupon_nor@2x.png) no-repeat;
			background-size: 100%;
		}
	}
</style>
