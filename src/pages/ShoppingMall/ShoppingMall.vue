<!-- 商城首页页面 -->
<template>
	<div class="shoppingMall" v-cloak>

		<!-- 头部搜索 -->
		<form class="seek" @click="goSeekShoppingMallNav">
			<input type="text" placeholder="去哪旅游？点击搜索试试"/>
		</form>

		<header class="h_same_css" v-show="goodses.length !== 0">
			热门拼团
			<img src="../../assets/line-left.png"/>
			<img src="../../assets/line-right.png"/>
		</header>

		<!-- 商城地点资料 -->
		<section v-show="goodses.length !== 0">
			<!--<ul class="cf swiper-container">
				<li v-for="(item,index) in goodses" class="swiper-slide">
					<p v-text="item.destination">深圳</p>
					<p>{{item.price}}元起</p>
				</li>
			</ul>-->

			<!-- 目的地 -->
			<div class="swiper-container1">
		        <div class="swiper-wrapper siteBox">
	              	<div class="swiper-slide" v-for="(item,index) in goodses" :key="index" >
	              		<div class="site" :class="{'active_bg': isClicked==index}" @click="addClass(index)">
	              			<p v-text="item.destination">深圳</p>
							<p>{{item.price}}元起</p>
	              		</div>
	              	</div>
		        </div>
		        <!-- 如果需要分页器 -->
		        <div class="swiper-pagination"></div>
		    </div>

			<!-- 商品信息 -->
			<div class="swiper-container2" v-show=" Object.keys(groupLists).length != 0">
		        <div class="swiper-wrapper olBox">
	              	<div class="swiper-slide liItem" v-for="(item,index) in groupLists" :key="index" @click="goSMD(index)">
						<img :src="item.imagePath"/>
						<span>{{item.isExpired ? item.expiredDay : item.expiredHour}}</span>
						<p  v-text="item.name + '+' + item.spec">香港纯玩团带你玩转海洋公园+迪士尼乐园...</p>
						<p>¥<b>{{item.price}}</b></p>
						<p class="cf">
							<img :src="ite" v-if="item.images.length != 0" v-for="(ite,inde) in item.images.slice(0,5)"/>
							<button>拼团去</button>
						</p>
	              	</div>
		        </div>
		        <!-- 如果需要分页器 -->
		        <div class="swiper-pagination"></div>
		   </div>
		   
		</section>

		<div class="bigBox" v-for="(it,i) in bigAds">
			<header class="h_same_css">
				{{ it.title }}
				<img src="../../assets/line-left.png"/>
				<img src="../../assets/line-right.png"/>
			</header>

			<!-- 图片懒加载 -->
			<div class="img_load">
				<!--<lazy-component>-->
					<div class="img_item" v-for="(item,index) in it.ads" @click="goShoppingMallDetails(i,index)">
						<img :src="item.imagePath" :v-lazy="item.imagePath" :alt=" '图片' + (index+1) "/>
					</div>
				<!--</lazy-component>-->
			</div>
		</div>
		
		<!--<img src="../../assets/my_icon_default_avatar@2x.png"/>-->
		<!--<div class="being_load">
			<img src="../../assets/common_icon_Load@2x.png"/>
			正在加载
		</div>-->

	</div>
</template>

<script>
import { Lazyload } from 'vant';

export default {
	components: {
	    Lazyload
	 },
	data() {
		return {
			//图片懒加载；
			imageList: [],
		    goodses:[], //热门拼团目的地列表；
		    ads:[], //每一个当季推荐；
		    actionContent:[], //当季推荐商品用于跳转的；
		    isClicked:0,
		    destinationS:[], //目的地名称数组；
		    destination:'', //目的地名称,默认第一个目的地；
		    groupLists:[],  //目的地拼团；
		    expiredHour:[], //热门拼团商品倒计时；
			spuId:[], //商品的spuId；
		    bigAds:[],

		}
	},
	created() {
		this.DestinationList();//热门拼团目的地列表；
		this.getAdList({a:5});//当季推荐;

	},
	mounted() {

		this.$nextTick(()=> {
			setTimeout(()=> {
				this.LRSwiper(".swiper-container1",5);//左右滑动Swiper；
				
				//判断参数：this.destination是否存在；
				if(this.destination !== undefined){
					this.GroupList(this.destination); //目的地拼团；
				}
			},500)
		})
		
	},
	methods: {

		//目的地拼团；
		GroupList(destination){

			let GrpObj = {
				'destination': destination  //目的地名称；
			};

			this.groupLists =[];
			this.$Api.Shop.GroupList(GrpObj).then( res => {
				console.log(res)

				//多个数据就循环定时器；
				for(let i=0;i<res.q.groupLists.length;i++){
					let obj={...res.q.groupLists[i]};
					console.log(obj)
					let arr = obj.expiredHour.split(':'); //通过数据格式是24:08:28，以“ : ”来分割成数组为[24,08,28]；
					obj.timer=null;  //先定义个关闭定时器；
					obj.totalSecond = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2]); //先把活动目标时间转化为总秒数；
					obj.isExpired = false;
					this.groupLists.push(obj)
				}

				this.spuId = [];
				this.groupLists.forEach( item => {
					this.expiredHour.push(item.expiredHour);  //这里还要再次重数组里添加expiredHour；
					this.spuId.push(item.spuId);
					
					let arr = [...item.images.slice(0,5)];
					item.images=[];
					for (let i=0;i<arr.length;i++) {
						if (arr[i] == '') {
							arr[i] = require('../../assets/my_icon_default_avatar@2x.png');
							console.log('数组头像有空',arr[i])
						}else{
							arr[i] = arr[i];
						}
						
						//判断图片的长度大于1和小于5(不等于5)时，加多一张默认问号的头像；
						if (arr.length >= 1 && arr.length < 5) {
							//判断已经加过一张默认问号的头像就不添加了；
							if (arr.indexOf( require('../../assets/shop_img_wait_big@2x.png') ) > -1 ) {
								console.log('已有该图片了')
							} else{
								let img = require('../../assets/shop_img_wait_big@2x.png');
								arr.push(img)
							}
						}
                    	item.images.push(arr[i])
					}
//					item.images.forEach( ite => {
//						//再判断this.groupLists里面的头像数组；
//						if (ite == '') {
//							ite = require('../../assets/my_icon_default_avatar@2x.png');
//							console.log('数组头像有空',ite)
//						}else{
//							ite = this.$imgUrl+ite;
//						}
//					})
				})
				console.log('aaaaaa',this.groupLists)
				
				//再次成功挂载DOM元素后；
				this.$nextTick(()=>{
					this.changeDate();  //拼团倒计时；
				})

				//console.log(this.spuId)
			}).then(()=>{
				//再次成功挂载DOM元素后，才能再来使用左右滑动Swiper；
				this.$nextTick(()=>{
					this.LRSwiper(".swiper-container2",2);
				})
			})

		},
		//拼团倒计时；
		changeDate(){

			this.groupLists.forEach( item => {
				//console.log(item.timer)
				let h;
				let total = item.totalSecond;
				
				h=parseInt(total/3600);  //时；
				total%=3600;
				console.log('h',h)
				
				//判断是 >24小时的还是 <=24小时的；
				if (h>24) {
					//setInterval(()=>{
						//这个是 > 24小时以上的，格式：天,小时；
						let iDay,iHour;
						let total = item.totalSecond;
						
						//然后再来转化拼接成你想要的 时间格式 ；
						iDay=parseInt(total/(3600*24));  //天；
						total%=(3600*24);
						
						iHour=parseInt(total/3600);  //时；
						total%=3600;
						console.log(iDay,iHour)
						
						item.isExpired = true; //格式：天,小时；的状态；
						item.expiredDay = `${iDay}天${iHour}小时`;
						console.log(item.expiredDay)
					//},(1000*60*60))
					console.log('>24小时')
				} else{
					item.timer = setInterval(()=>{
						item.totalSecond-=1
						let iHour,iMin,iSec; //先声明时，分，秒变量；
						let total=item.totalSecond;
						//console.log(total)
	
						//判断总秒数=0就是过期了,过期就停止定时器=00:00:00；
						if(total<=0){
							clearInterval(item.timer);
							total=0;
							//alert('已过时间');
						}
	
						//然后再来转化拼接成你想要的 时间格式 ；
						iHour=parseInt(total/3600);
						total%=3600;
	
						iMin=parseInt(total/60);
						total%=60;
	
						iSec=total;
						item.isExpired = false;
						//console.log(iHour,iMin,iSec)
						item.expiredHour=iHour+":"+iMin+":"+iSec;
					},1000)
					console.log('24小时之内')
				}	
				
				console.log(item,'itemmmmmmmmmmmm')
			})

		},

		//热门拼团目的地列表；
		DestinationList(){
			this.$Api.Shop.DestinationList().then( res => {
				console.log(res)
				this.goodses = [...res.q.goodses];

				this.goodses.forEach( item => {
					this.destinationS.push(item.destination);
				})

				this.destination = this.destinationS[0];
				console.log(this.destination,this.destinationS,'ffffffffff')
			});
		},

		//选择目的地；
		addClass(index){
			this.isClicked = index;
			this.destination = this.destinationS[index];

			this.GroupList(this.destination);
		},

		//左右滑动Swiper；
		LRSwiper(el,i){
			let mySwiper = new Swiper(el, {
		        direction: "horizontal", //滑动的方向；
		        slidesPerView: i, //每行的个数；
          		autoplayDisableOnInteraction: false,
		        spaceBetween : 5,
		        observer: true,//修改swiper自己或子元素时，自动初始化swiper
				observeParents: true,//修改swiper的父元素时，自动初始化swiper
		     });
		},

		//当季推荐;
		getAdList(a){
			this.$Api.Shop.AdList(a).then( res => {
				console.log(res)

				this.bigAds = res.q.ads;

				this.bigAds.forEach( (it,i) => {
					console.log(it,'it')
					let arr = [];
					this.actionContent.push(arr);

					it.ads.forEach( item => {
						arr.push(item.actionContent);
					})
				})
				//console.log('this.actionContent',this.actionContent)
			})
		},

		//跳转商城搜索导航页面；
		goSeekShoppingMallNav(){

			this.$router.push({
				name: "SeekShoppingMallNav",
				query: {

				}
			})

		},

		//跳转商城首页商品详情页面(这个参数是当季推荐的spuId)；
		goShoppingMallDetails(i,index){

			this.$router.push({
				name: "ShoppingMallDetails",
				query: {
					spuId:this.actionContent[i][index]
				}
			})

		},

		//跳转商城首页商品详情页面(这个参数是热门拼团的spuId)；
		goSMD(index){

			this.$router.push({
				name: "ShoppingMallDetails",
				query: {
					spuId:this.spuId[index]

				}
			})

		},

	},
}

</script>
<style lang="css" scoped>
/*左右滑动轮播*/
.swiper-container1,.swiper-container2{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>

<style scoped lang="less">
/*该商城页面样式*/
.shoppingMall{
	background: #fff;

	/*头部搜索样式*/
	.seek{
		padding: 0.22rem;
		box-sizing: border-box;
		input{
			width:7.02rem;
			height:0.6rem;
			background:rgba(255,255,255,1) url(../../assets/common/common_icon_search@3x.png) no-repeat 0.3rem 0.2rem;
			background-size: 0.2rem;
			opacity:0.8;
			border-radius:0.25rem;
			border: none;
			box-shadow:0rem 0rem 0.1rem 0rem rgba(0,0,0,0.37);
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
			padding-left: 0.6rem;
			outline: none;
		}
	}

	/*商城地点资料*/
	section:nth-of-type(1){
		background: #f6f6f6;
		padding: 0.2rem 0 0.12rem 0.25rem;
		box-sizing: border-box;

		.olBox{
			width:100% !important;
			height:3.99rem !important;
			.liItem{
				width:2.99rem !important;
				height:3.99rem;
				background:rgba(255,255,255,1);
				border-radius:0.05rem;
				padding: 0.1rem 0.1rem 0;
				box-sizing: border-box;
				float: left;
				position: relative;
				margin-left: 0.1rem;
				span{position: absolute;left: 0.1rem;top: 0.1rem;width:1.23rem;text-align: center;font-size:0.22rem;border-radius: 0.05rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(255,255,255,1);
					line-height:0.33rem;
					height:0.33rem;
					background:rgba(255,122,86,1);
				}
				img{
					width:2.8rem;
					height:2.75rem;
				}
				

				p{
					width: 100%;
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					padding-top: 0.15rem;
				}
				p:nth-of-type(1){
					width: 100%;
					height: 0.62rem;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:0.24rem;
					/*white-space:nowrap;*/
					/*text-overflow:ellipsis;*/
					/*overflow:hidden;*/
					overflow: auto;
					background: #fff;
					padding: 0.15rem 0.1rem 0;
					position: absolute;
					left: 0;
					top: 2.35rem;
				}
				p:nth-of-type(2){
					font-size:0.2rem;
					color:rgba(255,122,86,1);
					line-height:0.24rem;
					b{font-size: 0.3rem;}
				}
				p:nth-of-type(3){
					position: relative;
					img{
						width: 0.4rem;
						height: 0.4rem;
						border-radius: 50%;
						position: absolute;
						top: 0.15rem;
					}
					img:nth-of-type(1){
						left: 0rem;
					}
					img:nth-of-type(2){
						left: 0.2rem;
					}
					img:nth-of-type(3){
						left: 0.4rem;
					}
					img:nth-of-type(4){
						left: 0.6rem;
					}
					img:nth-of-type(5){
						left: 0.8rem;
					}

					button{
						width:1.11rem;
						height:0.45rem;
						background:rgba(250,220,86,1);
						border-radius:0.05rem;
						float: right;
					}
				}

			}

			.liItem:nth-of-type(1){margin-left: 0;}
		}

	}

	.being_load{
		height: 1.1rem;
		text-align: center;
		line-height: 1.1rem;
		font-size:0.28rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(153,153,153,1);
		img{
			width:0.28rem;
			height:0.3rem;
		}
	}

}

/*目的地*/
.siteBox{
	height: 1rem;
}

.site{
	width:1.32rem !important;
	height:0.8rem;
	background:rgba(255,255,255,1);
	border-radius:0.05rem;
	padding: 0.1rem 0 0 0.15rem;
	box-sizing: border-box;
	margin-right: 0rem !important;
	p:nth-of-type(1){
		/*width:1.32rem !important;*/
		height: 0.33rem;
		font-size:0.24rem;
		font-family:PingFang-SC-Bold;
		font-weight:bold;
		color:rgba(51,51,51,1);
		padding-bottom: 0.05rem;
		box-sizing: border-box;
		white-space: nowrap;
      	overflow: hidden;
      	text-overflow: ellipsis;
	}
	p:nth-of-type(2){
		font-size:0.22rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:0.24rem;
	}
}

.site:nth-of-type(1){margin-left: 0;}
/*选中哪个城市的样式*/
.active_bg{background: #f6f6f6 url(../../assets/shop_bg_frame@2x.png) no-repeat !important;background-size: 1.32rem 0.8rem !important;}


/*图片懒加载样式*/
.img_load{
	.img_item{
		width: 100%;
		height: 3.8rem;
		margin-bottom: 0.3rem;
		position: relative;
		img{
			width: 100%;height: 100%;
		}
		p{
			font-size:0.55rem;
			font-family:ARTianniuGB-Heavy;
			font-weight:800;
			color:rgba(255,255,255,1);
			text-shadow:0rem 0rem 0.1rem rgba(0,0,0,0.81);
			position: absolute;
			left: 0.3rem;
		}
		p:nth-of-type(1){
			top: 2.2rem;
		}
		p:nth-of-type(2){
			top: 3rem;
			font-size:0.4rem;
			font-weight:normal;
		}
	}
	.img_item:last-child{
		margin-bottom: 0rem;
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
