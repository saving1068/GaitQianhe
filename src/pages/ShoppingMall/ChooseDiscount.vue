<!-- 商城选择优惠券页面 -->
<template>
	<div class="chooseDiscount">

		<!-- 单个优惠券(黄色) -->
		<section class="yellow_discount" @click="click_cou(item)" v-for="(item,index) in coupons['catusecoupons']">
			<div class="fl">
				<p class="active_fontC">¥<b v-text="item.denomination"></b></p>
				<p>满<span class="active_fontC" v-text="item.minOrderAmount"></span>元可使用</p>
			</div>

			<div class="fr">
				<p v-text="item.couponName"></p>
				<p>{{item.orgId!=0?item.orgName:"步履千寻优惠券"}}</p>
				<p>{{item.residueDate!=0? `${item.residueDate}天`:'即将过期'}}</p>
				<img src="../../assets/shop_icon_select@2x.png" v-if="Obj && Obj[dateId] && Obj[dateId]['cid'] == item.id && Obj[dateId]['onoff']"/>
			</div>
		</section>

		<!-- 单个优惠券(不可用的灰色) -->
		<section v-for="(item,index) in coupons['nocatusecoupons']">
			<div class="fl">
				<p class="active_fontC">¥<b v-text="item.denomination">100</b></p>
				<p>满<span class="active_fontC" v-text="item.minOrderAmount">300</span>元可使用</p>
			</div>

			<div class="fr">
				<p v-text="item.couponName"></p>
				<p v-text="item.orgName">步履千寻优惠券</p>
				<p>{{item.residueDate!=0? `${item.residueDate}天`:'即将过期'}}</p>
				<!--<img src="../../assets/shop_icon_select@2x.png" v-show="isYes == index ? true:false"/>-->
			</div>
		</section>

		<!-- 单个优惠券(没选中默认灰色) -->
		<!--<section class="cf">

			<div class="fl">
				<p>¥<b>50</b></p>
				<p>满<span>200</span>元可使用</p>
			</div>

			<div class="fr">
				<p>优惠券名称，最多显示2行优惠券名称，最多显示2行</p>
				<p>步履千寻优惠券</p>
				<p>已过期</p>
				<img src="../../assets/shop_icon_select@2x.png" v-show="false"/>
			</div>

		</section>-->

	</div>
</template>

<script>

export default {
	data() {
		return {
			isYes:0, //默认选中第一个优惠券；
			coupons:{
				"catusecoupons": [],
				"nocatusecoupons": [],
			},
			days:[],  //剩余天数数组；
			couId:[], //优惠券id数组；
			coupon:null, //单个值；
			oId:this.$route.query.oId,
			cId:null,  //选择优惠券的那个id；
			Obj:{}
		}
	},
	computed: {
		dateId() {
			return this.$route.query.dateId || 0
		}
	},
	created() {
		this.CouponList();//优惠券；
	},
	mounted() {

	},
	methods: {
		//优惠券；
		//a=1是我的优惠券，=2是商品优惠券；orgId是a=2才传，默认是0；status是状态：=0是全部，=1是未使用，=2是已使用，等于3是已过期；
		CouponList(){
			let couObj = {...this.$route.query};
			console.log(couObj,'couObj')
			this.$Api.Shop.orderCouponList(couObj).then( res => {
				console.log(res)
				this.coupons.catusecoupons = [...res.q.use]
				this.coupons.nocatusecoupons = [...res.q.noUse]
				
				if(window.sessionStorage.getItem('checkedGroup')){  //获取到了；
					let obj={...JSON.parse(window.sessionStorage.getItem('checkedGroup'))}
					this.Obj = obj;
					Object.keys(obj).forEach(val=> {
						// obj[val].cid
						console.log('val val val',obj[val].cid)
						if(val != this.dateId) {
							this.coupons.catusecoupons.forEach((item,index)=> {
								if(obj[val]['cid'] == item.id) { //进来页面判断有没有已经选中过的优惠券；
									this.coupons.catusecoupons.splice(index,1)
								}
							})
						}
					})
					//console.log('有',this.Obj)
				}else{ //没有；
					//console.log('没有')
				}
//				this.coupons = [...res.q.coupons];
				// let arr = [...res.q.use];
				// let arr1 = [...res.q.noUse]
				// arr.forEach( item => {
				//
				// 	let end_str = item.endTime.replace(/-/g,"/"), //结束时间；
				// 		sta_str = item.startTime.replace(/-/g,"/"), //开始时间；
				// 		end_date = new Date(end_str),
				// 		sta_date = new Date(sta_str),
				// 		//求出两个时间的时间差，这个是天数；
				// 		num = ( end_date - sta_date)/(1000*3600*24),
				// 		days = parseInt(Math.ceil(num)); //转化为整天（向上取整，小于零的话剧不用转了）；
				//
				// 	//console.log(end_str,end_date,sta_date,num,days)
				//
				// 	this.days.push(days); //剩余天数数组；
				// 	this.couId.push(item.id); //优惠券id数组；
				//
				//
				// })
				console.log(this.dateId,'dateId')
				console.log(this.coupons,'this.couponsthis.couponsthis.coupons')

			});

		},

		//点击选择优惠券；
		click_cou(item){
			let obj={}
			let id = this.dateId;
			if(window.sessionStorage.getItem('checkedGroup')){
				obj={...JSON.parse(window.sessionStorage.getItem('checkedGroup'))}
				if(obj.hasOwnProperty(id)) { //存在这个属性;
					//还要判断点击的是不是那个优惠券；
					if (obj[id]['cid'] == item.id) { //是点击的那个优惠劵；
						//再判断这个优惠券是不是选中过的；
						if (obj[id]['onoff']) { //是选中过的，就取消打钩；
							obj[id]['cid'] = item.id;
							obj[id]['price'] = 0;
							obj[id]['onoff'] = false;
							console.log('1')
						}else{ //不是选中过的，就加打钩；
							obj[id]['cid'] = item.id;
							obj[id]['price'] = item.denomination;
							obj[id]['onoff'] = true; 
							console.log('0')
						}
					} else{ //不是点击的那个优惠劵就取消之前打钩的那个优惠券，再给点击的优惠券打钩；
						obj[id]['cid'] = item.id;
						obj[id]['price'] = item.denomination;
						obj[id]['onoff'] = true; 
						console.log('2')
					}
				}else{ //不存在；
					obj[id]={};
					obj[id]['cid'] = item.id;
					obj[id]['price'] = item.denomination;
					obj[id]['onoff'] = false;
				}
			}else { //不存在这个属性；
				obj[id]={};
				obj[id]['cid']=item.id;
				obj[id]['price']=item.denomination;
				obj[id]['onoff'] = true;
			}
			window.sessionStorage.setItem('checkedGroup',JSON.stringify(obj))
			this.$router.go(-1)
//			this.$router.push({
//				name: 'AffirmIndents',
//				query: {
//					oid: this.oId,
//					cid: item.id,
//					price: item.totalAmount
//				}
//			})
//			window.sessionStorage.setItem('checkedGroup')
//			arrayghh[item.id]['price']
//			{
//				'67': {
//					cid: 562,
//					price: 4466
//				},
//				'9': {
//					cid: 533462,
//					price: 334466
//				},
//			}
		},

	},
//	beforeRouteLeave(to,from,next){
////		to.query.tAmount = this.coupon;
////		to.query.oId = this.oId;
////		to.query.price = this.coupon;
//		to.query.cId = this.cId;
//
//		next();
//
//	},
}

</script>

<style scoped lang="less">
/*该商城选择优惠券页面样式*/
.chooseDiscount{
	height: 100%;
	background: #f9f9f9;
	padding: 0.4rem 0.3rem 0;
	box-sizing: border-box;

	section{
		width:6.9rem;
		height:2rem;
		margin-bottom: 0.3rem;
		background: url(../../assets/common_bg_coupon_nor@2x.png) no-repeat;background-size: 100% 100%;

		div:nth-of-type(1){
			width: 2.4rem;
			height: 100%;
			padding-top: 0.5rem;
			box-sizing: border-box;
			p{
				font-family:PingFangSC-Regular;
				color:rgba(153,153,153,1);
				text-align: center;
			}

			p:nth-of-type(1){
				font-size:0.4rem;
				b{
					font-size:0.55rem;
				}
			}
			p:nth-of-type(2){
				font-size:0.22rem;
			}

		}

		div:nth-of-type(2){
			width: 4.5rem;
			height: 100%;
			position: relative;
			p{
				position: absolute;
				font-family:PingFangSC-Regular;
				color:rgba(153,153,153,1);
			}

			p:nth-of-type(1){
				width:3.25rem;
				font-size:0.26rem;
				line-height:0.36rem;
				top: 0.3rem;
				left: 0.2rem;
			}
			p:nth-of-type(2){
				font-size:0.22rem;
				line-height:0.36rem;
				bottom: 0.27rem;
				left: 0.2rem;
			}
			p:nth-of-type(3){
				font-size:0.22rem;
				color:rgba(255,53,53,1);
				right: 0.25rem;
				bottom: 0.27rem;
			}
			img{
				position: absolute;
				top: 0.9rem;
				right: 0.3rem;
				width:0.26rem;
				height:0.18rem;
			}
		}

	}

}


/*选中优惠券样式*/
.yellow_discount{background: url(../../assets/common_bg_coupon_pre@2x.png) no-repeat !important;background-size: 100% 100% !important;}
.active_fontC{color: #ff3535 !important;}
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


</style>
