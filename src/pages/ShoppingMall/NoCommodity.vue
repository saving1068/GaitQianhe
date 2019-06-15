<!-- 商城商品不存在页面； -->
<template>
	<div class="NoCommodity">

		<section class="no_commodity">
			商品已不存在
		</section>

		<header class="h_same_css">
			为您推荐
			<img src="../../assets/line-left.png"/>
			<img src="../../assets/line-right.png"/>
		</header>

		<!-- 旅游景点商品区 -->
		<section class="travel_region cf">
			<div class="swiper-container1">
		        <div class="swiper-wrapper">
					<div class="swiper-slide travel_one cf" @click="goShoppingMallDetails(index)" v-for="(item,index) in goodses">
						<img :src="item.imagePath"/>
						<p v-text="item.name">香港纯玩团带你玩转海洋公园+迪士尼乐园 5天4夜...</p>
						<p class="cf">
							<span>¥<b v-text="item.price">1799</b></span>
							<span class="fr">{{item.saleStat}}人购买</span>
						</p>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>
export default {
	data() {
		return {
			goodses:[],
			orgId:this.$route.query.orgId,  //店铺机构id, 当a=3时必须转,自营的店铺orgId=1;
			spuId:[],

		}
	},
	created() {

		this.GoodsList(this.orgId);

	},
	mounted() {

	},
	methods: {
		//左右滑动Swiper；
		LRSwiper(el){
			this.mySwiper = new Swiper(el, {
		        direction: "horizontal", //滑动的方向；
		        slidesPerView: "auto", //每行的个数；
          		autoplayDisableOnInteraction: false,
		        spaceBetween : 5,
		        observer: true,//修改swiper自己或子元素时，自动初始化swiper
				observeParents: true,//修改swiper的父元素时，自动初始化swiper
		    });

		    //console.log('mySwiperdsfsdfeswf',this.mySwiper)
		},
		//商品列表协议接口；
		GoodsList(orgId){

			let GodObj = {
				a:3, //店铺推荐;
				'orgId':orgId, //机构id,自营的店铺orgId=1;
			};

			this.$Api.Shop.GoodsList(GodObj).then( res => {
				console.log(res)
				this.goodses = [...res.q.goodses];

				this.goodses.forEach( item => {
					this.spuId.push(item.spuId);
				})

				console.log(this.goodses)
			}).then(()=>{
				this.$nextTick(()=> {
					this.LRSwiper(".swiper-container1"); //左右滑动Swiper；
				})
			})
		},

		//跳转商城首页商品详情页面；
		goShoppingMallDetails(index){

			this.$router.push({
				name: "ShoppingMallDetails",
				query: {
					'spuId':this.spuId[index]
				}
			})

		},



	},
}

</script>

<style scoped lang="less">
/*商城商品不存在页面样式*/
.NoCommodity{
	background: #fff;

	.no_commodity{
		height: 7.4rem;
		border-bottom: 0.02rem solid #ededed;
		background: url(../../assets/order_btn_null@2x.png) no-repeat 3rem 3rem;
		background-size: 1.51rem;
		font-size:0.3rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(153,153,153,1);
		line-height:10rem;
		text-align: center;
	}

}

/*旅游景点商品区(图片长点的布局)样式*/
.travel_region{
	padding: 0.15rem 0.25rem 0;
	box-sizing: border-box;
	background: #ededed;
	overflow: hidden;
	.travel_one{
		width:3.16rem;
		height:4.58rem;
		border: 1px solid #ededed;
		float:left;
		margin-bottom: 0.2rem;
		margin-right: 0.1rem;
		background: #fff;
		padding: 0.08rem 0.08rem 0;
		box-sizing: border-box;
		img{
			width:3rem;
			height:3rem;
		}

		p:nth-of-type(1){
			font-size:0.22rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:0.3rem;
			padding: 0.15rem 0 0.25rem;
		}

		p:nth-of-type(2){

			span:nth-of-type(1){
				font-size:0.2rem;
				font-family:PingFang-SC-Bold;
				font-weight:bold;
				color:rgba(246,50,62,1);
				line-height:0.24rem;
				padding-left: 0.05rem;
				b{font-size:0.3rem;}
			}
			span:nth-of-type(2){
				font-size:0.2rem;
				font-family:PingFang-SC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:0.35rem;
				padding-right: 0.05rem;
			}
		}

	}


}
</style>
<style scoped lang="less">
/*该页面相同的样式*/
button{outline: none;border: none;}

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
.h_same_css{
	width: 100%;
	height: 1rem;
	text-align: center;
	line-height: 1rem;
	position: relative;
	font-size:0.3rem;
	font-family:PingFang-SC-Medium;
	font-weight:500;
	color:rgba(51,51,51,1);
	img{
		position: absolute;
		top: 0.5rem;
	}
	img:nth-of-type(1){left: 1.5rem;}
	img:nth-of-type(2){right: 1.5rem;}
}
</style>
