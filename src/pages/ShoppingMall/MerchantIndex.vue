<!-- 商城商家首页页面 -->
<template>
	<div class="merchantIndex">

		<header :style="{background: 'url(' + org.bgImagePath + ') no-repeat'}">
			<nav>
				<van-icon name="search" class="icon_search"/>
				<input type="text" placeholder="在店内搜索" v-model.trim="Sk" @keyup.enter="click_go($event)"/>
				<button @click="seek">确认</button>
			</nav>
			<img :src="org.imagePath"/>

			<div class="cf">
				<p class="fl" v-text="org.name">步履千寻官方旗舰店</p>
				<button class="fr" @click="goMade">找ta定制</button>
			</div>
		</header>

		<!-- 综合排序与筛选 -->
		<section class="filtrate cf">
			<div @click="sort" v-text="sortListing[n]">综合排序</div>
			<div @click="goFiltrate">筛选</div>
		</section>

		<!-- 领取优惠券 -->
		<section class="discounts_frame" v-show=" Object.keys(coupons).length !== 0">

			<div class="swiper-container1">
		        <div class="swiper-wrapper ulBox">
	              	<div class="swiper-slide" v-for="(item,index) in coupons" :key="index">
	              		<div class="liItem">
	              			<p>{{ item.totalAmount }}元</p>
							<p>（满{{ item.startAmount }}可用）</p>
							<p>{{ item.startTime.replace(/-/g,'.') }}-{{ item.endTime.replace(/-/g,'.') }}</p>
							<p @click="click_pay(index)">领取</p>
	              		</div>
	              	</div>
		        </div>
		        <!-- 如果需要分页器 -->
		        <div class="swiper-pagination"></div>
		   </div>

			<!--<ul class="cf">
				<li>
					<p>50元</p>
					<p>（满500可用）</p>
					<p>2018.07.29-2018.08.19</p>
					<p @click="click_pay">领取</p>
				</li>

			</ul>-->

		</section>

		<!-- 旅游景点商品区 -->
		<section class="travel_region cf">

			<div class="travel_one cf" @click="goShoppingMallDetails(index)" v-for="(item,index) in goodses">
				<img :src="item.imagePath"/>
				<p v-text="item.name">香港纯玩团带你玩转海洋公园+迪士尼乐园 5天4夜...</p>
				<p class="cf">
					<span>¥<b v-text="item.price">1799</b></span>
					<span class="fr">{{item.saleStat}}人购买</span>
				</p>
			</div>



		</section>

		<!-- 底部占位 -->
		<footer class="footer_place"></footer>
		<!-- 固定底部 -->
		<footer class="footer" @click="goSVC"></footer>

		<!-- 综合排序 -->
		<section class="sort" v-show="isSort">
			<ul>
				<li v-for="(item,index) in sortList" @click="click_sort(index)">
					{{item}}
					<img src="../../assets/shop_img_check@2x.png" v-show="index == n"/>
				</li>
			</ul>
		</section>
		<van-actionsheet v-model="isshow" :actions="imList"  @select="onSelect"   cancel-text="取消"  @cancel="isshow=false"/>

	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			listS:[1,2,3,4,5,6],
			org:{},
			goodses:[], //商城产品信息；
			ob:this.$route.query.ob, //默认是综合；
			coupons:[],
			isSort:false,//综合排序控制显示与隐藏；
			n:0,
			sortList:['综合排序','销量排序','价格由高到低','价格由低到高'],
			sortListing:['综合排序','销量排序','由高到低','由低到高'],
			cardWord:[], //优惠券的编号；
			spuId:[], //商品的spuId；
			Sk:'',
			orgId:this.$route.query.orderId,  //店铺id；
			min:this.$route.query.min,
			max:this.$route.query.max,
			tri:this.$route.query.tri,
			dat:this.$route.query.dat,
			nat:this.$route.query.nat,
			imList:[],
      isshow:false,
			tel:""
		}
	},
	created() {
		console.log(this.$route.query)

		this.OrgDetails(); //商店主页接口；
		this.CouponList(2,this.orgId); //优惠券
		this.getImId(); //获取客服信息；
	},
	mounted() {

		this.$nextTick(()=> {
			setTimeout(()=> {
				this.LRSwiper(".swiper-container1");//左右滑动Swiper；
				this.GoodsList3(); //商品推荐列表；
			},500)
		});

	},
	methods: {
		//点击手机键盘的前往键或者enter确认键,确认前往搜索功能；
		click_go(ev){
			ev = ev || window.event;
			//console.log(ev.keyCode)

			//搜索栏不为空才能添加；
			if (this.Sk != '') {
				let GsListObj = { //关键字搜索；
					a:0,
					orgId:this.orgId,
					Sk:this.Sk
				};

				//载入该页面渲染静态的商品列表数据；
				this.GoodsList(GsListObj);

			}else{ //为空；

				let GsListObj = {
					a:0,
					orgId:this.orgId
				};

				//载入该页面渲染静态的商品列表数据；
				this.GoodsList(GsListObj);
			}
		},

		//搜索功能；
		seek(){

			//搜索栏不为空才能添加；
			if (this.Sk != '') { //不为空；

				let GsListObj = { //关键字搜索；
					a:0,
					orgId:this.orgId,
					Sk:this.Sk
				};

				//载入该页面渲染静态的商品列表数据；
				this.GoodsList(GsListObj);

			}else{ //为空；

				let GsListObj = {
					a:0,
					orgId:this.orgId
				};

				//载入该页面渲染静态的商品列表数据；
				this.GoodsList(GsListObj);

			}

		},

		//商品列表协议接口；
		GoodsList(GsListObj){

			this.$Api.Shop.GoodsList(GsListObj).then( res => {
				console.log(res)
				this.goodses = [...res.q.goodses];

				//没有，就轻提示没有商品；
				if (this.goodses.length == 0) {
					Toast('亲，该店铺无您搜索的商品！')
				}

				console.log(this.goodses)
			})

		},

		//传参数选择哪个综合排序；
		arguments_sort(i){
			let GsListObj = {
					a:0,
					orgId:this.orgId,
					ob:i,
				};

			//综合排序的筛选数据；
			this.GoodsList(GsListObj);

		},

		//点击选择综合排序；
		click_sort(index){
			this.isSort = !this.isSort;
			this.n = index;

			if (index == 0) { //选择综合排序；
				this.i = 1;
				this.arguments_sort(this.i);

				console.log(this.i)
			} else if(index == 1){ //选择销量排序；
				this.i = 2;
				this.arguments_sort(this.i);

				console.log(this.i)
			} else if(index == 2){ //选择价格倒序；
				this.i = 7;
				this.arguments_sort(this.i);

				console.log(this.i)
			} else if(index == 3){ //选择价格顺序；
				this.i = 8;
				this.arguments_sort(this.i);

				console.log(this.i)
			}

		},

		//综合排序控制显示；
		sort(){
			this.isSort = !this.isSort;
		},

		//控制领取成功显示和隐藏；
		click_pay(index){

			//console.log(index)

			//先判断是否点击的那张优惠券；
			if (this.coupons[index].cardWord == this.cardWord[index]) { //如果优惠券的编号相同就是点击的那张；
				this.CouponSubmit(index);
			}

		},

		//添加优惠券；
		CouponSubmit(index){

			let couSubObj = {
				'couponCardNum':this.cardWord[index]
			};

			this.$Api.Shop.CouponSubmit(couSubObj).then( res => {
				console.log(res)

				if (res.q.s == 0) { //未领取；

					this.$toast('领取成功','success');

				}else{  //已经领取过该张优惠券；
					this.$toast('已领取过了','error');
				}

			});

		},

		//商店主页；
		OrgDetails(){

			let OrgObj = {
				'id':this.orgId
			};

			this.$Api.Shop.OrgDetails(OrgObj).then( res => {
				console.log(res,'aaaaaaaaaaa')

				this.org = res.q.org;

			})

		},

		//优惠券；
		//a=1是我的优惠券，=2是商品优惠券；orgId是a=2才传，默认是0；status是状态：=0是全部，=1是未使用，=2是已使用，等于3是已过期；
		CouponList(a,orgId=0){

			let couObj = {
				'a':a,
				'orgId':orgId

			};

			this.$Api.Shop.CouponList(couObj).then( res => {
				console.log(res)

				this.coupons = [...res.q.coupons];

				this.coupons.forEach( item => {
					this.cardWord.push(item.cardWord);
				})

				console.log(this.cardWord)
			});

		},

		//商品列表协议接口；
		GoodsList3(){
			if (this.ob == 9) { //是筛选；
				let GodObj = {
					a:0,
					'ob':this.ob,
					'orgId':this.org.id, //机构id,自营的店铺orgId=1;
					minPrice:this.min,
					maxPrice:this.max,
					tripDate:this.tri,
					dateNum:this.dat,
					natureId:this.nat
				};

				this.$Api.Shop.GoodsList(GodObj).then( res => {
					console.log(res)
					this.goodses = [...res.q.goodses];

					this.goodses.forEach( item => {
						this.spuId.push(item.spuId)
					})
					console.log(this.goodses,this.spuId)
				})
			} else{ //默认是综合
				let GodObj = {
					a:0,
					'ob':1,
					'orgId':this.org.id, //机构id,自营的店铺orgId=1;
				};

				this.$Api.Shop.GoodsList(GodObj).then( res => {
					console.log(res)
					this.goodses = [...res.q.goodses];

					this.goodses.forEach( item => {
						this.spuId.push(item.spuId)
					})
					console.log(this.goodses,this.spuId)
				})
			}
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

		getImId(){ //获取客服信息
			this.$Api.Common.CsList({id:this.orgId}).then((res)=>{
				if(res.q.csContacts.length>0){
					res.q.csContacts.forEach(item=>{
						let obj={
							name:item.name,
							id:item.imId,
							disabled:false
						}
						this.imList.push(obj)
					})

				}
				this.getTel(this.orgId)

			})
		},
		onSelect(item){
			if(item.name=="拨打客服热线"){
					window.location.href = "tel:"+this.tel;
			}else{
				this.$router.push({
					name:"Talk",
					query:{
						im:item.id
					}
				})
			}
			this.isshow=false
		},
		getTel(id){
			this.$Api.Common.CsTel({id:id}).then((res)=>{
				if(res.q.s==0){
					this.tel=res.q.csTel
					this.imList.push({
						name: '拨打客服热线',
						disabled:false
					})
				}

				console.log(res)
			})
		},
		//跳转客服页面；
		goSVC(){

			if(this.imList.length>0||this.tel!=""){
				this.isshow=true
			}else{
				Toast({
					message: "暂无客服",
					forbidClick: true,
					position: 'center',
					duration: 2000
				});

			}

		},

		//跳转商城找ta定制页面；
		goMade(){

			this.$router.push({
				name: "Made",
				query: {
					'id':this.orgId
				}
			})

		},

		//跳转商城筛选页面；
		goFiltrate(){
			this.$router.push({
				name: "Filtrate",
				query: {
					'orgId':this.org.id,
				}
			})

		},

		//左右滑动Swiper；
		LRSwiper(el){
			let mySwiper = new Swiper(el, {
		        direction: "horizontal",
		        slidesPerView: 2,
          		autoplayDisableOnInteraction: false,
		        spaceBetween : 5,
		      });

//		    console.log(mySwiper)
		},

	},
	computed:{ //计算属性；



	},
}

</script>

<style scoped lang="less">
/*该商城商家首页页面样式*/
.merchantIndex{
	background: #fff;

	nav{
		width: 100%;
		height: 1.05rem;
		position: relative;
		/*padding-top: 0.15rem;
		box-sizing: border-box;*/
		.icon_search{
			position: absolute;
			top: 0.42rem;
			left: 0.55rem;
			color: #fadc56;
			z-index: 10;
			font-size: 0.24rem;
		}
		input{
			width:6.06rem;
			height:0.6rem;
			background:rgba(255,255,255,1);
			opacity:0.8;
			border-radius: 0.3rem;
			box-shadow:0rem 0rem 0.1rem 0rem rgba(0,0,0,0.37);
			border: none;
			text-indent: 0.6rem;
			margin-left: 0.27rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			color:rgba(153,153,153,1);
		}
		button{
			width: 1.05rem;
			height: 100%;
			font-size:0.3rem;
			font-family:PingFang-SC-Regular;
			color:rgba(51,51,51,1);
			outline: none;
			border: none;
			background: rgba(250,250,250,0);
			padding: 0;
		}
	}

	header{
		width: 100%;
		height: 3rem;
		background-size: 100% !important;
		position: relative;
		img{
			position: absolute;
			left: 0.25rem;
			bottom: 0.1rem;
			z-index: 10;
			width:1.2rem;
			height:1.18rem;
			border-radius:50%;
		}
		div{
			width: 100%;
			height: 0.88rem;
			background:rgba(0,0,0,0.5);
			position: absolute;
			left: 0;
			bottom: 0;
			p{
				height: 100%;
				line-height: 0.88rem;
				font-size:0.28rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(255,254,254,1);
				padding-left: 1.55rem;
			}
			button{
				width:1.78rem;
				height:0.68rem;
				background:rgba(250,220,86,1);
				border-radius:0.15rem;
				font-size:0.28rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(26,26,26,1);
				border: none;
				outline: none;
				margin: 0.1rem 0.25rem 0 0;
			}
		}
	}

	.filtrate{
		height: 0.92rem;
		border-top: 1px solid #cccccc;
		border-bottom: 1px solid #cccccc;
		line-height: 0.92rem;
		div{
			width: 50%;
			height: 100%;
			float: left;
			text-align: center;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(26,26,26,1);
		}
		div:nth-of-type(1){background: url(../../assets/shop_btn_order@2x.png) no-repeat 2.6rem 0.35rem;background-size: 0.24rem 0.27rem;}
		div:nth-of-type(2){background: url(../../assets/shop_btn_screen@2x.png) no-repeat 2.3rem 0.35rem;background-size: 0.3rem 0.27rem;}
	}

	.discounts_frame{
		height: 2.15rem;
		padding: 0.28rem 0 0 0.24rem;
		box-sizing: border-box;

		.ulBox{

			.liItem{
				width:3.11rem;
				height:1.56rem;
				background:rgba(255,255,255,1) url(../../assets/shop_bg_coupon@2x.png) no-repeat;
				background-size: 100% 100%;
				border-radius:0.05rem;
				float: left;
				/*margin-left: 0.2rem;*/
				p{
					text-align: center;
				}
				p:nth-of-type(1){
					font-size:0.36rem;
					font-family:PingFang-SC-Bold;
					font-weight:bold;
					color:rgba(51,51,51,1);
				}
				p:nth-of-type(2){
					font-size:0.2rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				p:nth-of-type(3){
					font-size:0.2rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				p:nth-of-type(4){
					height:0.42rem;
					line-height: 0.42rem;
					background:rgba(255,238,160,1);
					border-radius:0 0 0.05rem 0.05rem;
				}
			}
			li:nth-of-type(1){margin-left: 0;}
		}
	}


	/*旅游景点商品区样式*/
	.travel_region{
		padding: 0 0.25rem;
		box-sizing: border-box;
		.travel_one{
			width:3.42rem;
			height:4.08rem;
			border: 1px solid #ededed;
			float:left;
			margin-bottom: 0.2rem;
			position: relative;
			img{
				width:3.4rem;
				height:2.4rem;
			}
			p{
				padding: 0 0.05rem;
			}
			p:nth-of-type(1){
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:0.34rem;
				padding: 0.15rem 0.05rem 0.25rem;
			}

			p:nth-of-type(2){
				position: absolute;
				bottom: 0.1rem;
				width: 100%;
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
					padding-top: 0.1rem;
				}
			}

		}

		.travel_one:nth-of-type(odd){
			margin-right: 0.15rem;
		}

	}

}


/*固定底部和底部占位样式*/
.footer_place{height: 1rem;}
.footer{
	width: 100%;
	height: 1rem;
	border-top: 1px solid #ccc;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	background: url(../../assets/shop_btn_services@2x.png) no-repeat 3.47rem 0.2rem #fff;
	background-size: 0.56rem;
}


/*综合排序样式*/
.sort{
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 150;
	background: rgba(0,0,0,0.7);
	ul{
		width:7.5rem;
		height:3.53rem;
		background:rgba(255,255,255,1);
		position: fixed;
		bottom: 0;
		left: 0;
		li{
			width: 100%;
			height: 25%;
			line-height: 0.88rem;
			border-bottom: 1px solid #c7c7cb;
			padding-left: 0.25rem;
			box-sizing: border-box;
			font-size:0.26rem;
			font-family:PingFang-SC-Regular;
			color:rgba(102,102,102,1);
			position: relative;
			img{
				width:0.36rem;
				height:0.36rem;
				border-radius: 60%;
				position: absolute;
				right: 0.25rem;
				top: 0.25rem;
			}
		}
		li:last-child{
			border-bottom: none;
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

/*左右滑动轮播*/
.swiper-container1{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<style type="text/css">
.merchantIndex .swiper-slide{margin-left: 0 !important;}
</style>
