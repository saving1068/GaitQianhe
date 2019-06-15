<!-- 商城首页商品详情页面 -->
<template>
	<div class="shoppingMallDetails">

		<!-- 轮播图 -->
		<div class="ban">
			<swiperBox :swiperList="items" class="swiperBox"></swiperBox>
			<p>商品编号：{{goods.spuId}}</p>
			<p>{{swiperCurrent.num}}/{{items.length}}</p>
		</div>

		<header class="header">
			<p v-text="goods.name">芝樱季热售全国出发日本6-7天至尊有/拒签全退/享受五星级住宿</p>
			<p>¥<b>{{goods.price}}</b></p>
			<p>
				<span>月售{{goods.sellNum}}笔</span>
				<strong v-show="goods.returnCash == 1"><img src="../../assets/shop_icon_fire@2x.png"/>返现活动正在进行中</strong>
			</p>
		</header>

		<h1 v-if="groupArr.length != 0">
			<p class="cf">
				{{ groupArr.length }}人在结伴拼团，一起参与吧~
				<span class="fr" @click="isLookAll_par">查看全部</span>
			</p>
		</h1>
		<!-- 单个拼团去 -->
		<section class="groupBookingBox" :class="{groupBookingBoxHeight:groupArr.length == 1}" v-if="groupArr.length != 0">
			<div class="notice">
				<ul class="con1" ref="con1" :class="{anim:animate==true}">
				    <li v-for='(item,index) in groupArr'>

				    	<div class="a_groupBooking">
							<h2 class="cf">
								<img :src="ite" v-for="(ite,inde) in item.images.slice(0,5)"/>
								<!--<img src="../../assets/touxiang1.png"/>-->
								<p class="fr">还差<span v-text="item.surplusNum">1</span>人拼成，剩余<span>{{groupLists[index].isExpired ? groupLists[index].expiredDay : groupLists[index].expiredHour}}</span></p>
							</h2>

							<div class="a_txt">
								<p>套餐类型：{{ item.spec }}</p>
								<p>出发日期：{{ item.placeDate }}</p>
								<button @click="isPar(index)">拼团去</button>
							</div>
						</div>

						<!--<div class="a_groupBooking">
							<h2 class="cf">
								<img src="../../assets/touxiang1.png"/>
								<img src="../../assets/touxiang1.png"/>
								<p class="fr">还差<span>1</span>人拼成，剩余<span>23:40:00</span></p>
							</h2>

							<div class="a_txt">
								<p>套餐类型：成都+稻城9天8晚</p>
								<p>出发日期：2018-06-04</p>
								<button>拼团去</button>
							</div>
						</div>-->

				    </li>
				</ul>
			</div>
		</section>

		<!-- 选择：出发地/套餐/人群 -->
		<h1>
			<p class="cf">
				选择：出发地/套餐/人群
			</p>
		</h1>
		<section class="three_choose cf" v-if="goods.datePriceLists != 0">
			<ul class="cf fl">
				<li :class="{'three_choose_active': isLi == index}" v-for="(item,index) in goods.datePriceLists" @click="click_li(index)">
					<p>{{item.datestr}} {{item.week}}</p>
					<p>￥{{item.price}}</p>
					<img src="../../assets/gou.png" v-show="isLi == index"/>
				</li>
				<!--<li>
					<p>06-06 周三</p>
					<p>￥3999</p>
					<img src="../../assets/gou.png" v-show="false"/>
				</li>-->

			</ul>
			<div @click="goJoinShoppingCar(0)"></div>
		</section>

		<!-- 用户评价 -->
		<h1 v-if="comments.length !== 0">
			<p class="cf">
				用户评价（{{ComTotal}}）
				<span class="fr" @click="goAppraise(goods.praiseInitial)">查看全部</span>
			</p>
		</h1>

		<div class="appraiseBox" v-if="comments.length !== 0">
			<!-- 有图的评价 -->
			<section class="yesImg isImg" v-for="(item,index) in comments">
				<header>
					<img :src="item.imagePath"/>
					<p v-text="item.name">又是剪刀手</p>
					<p v-text="item.comTime">刚刚</p>
				</header>

				<div class="txt" v-text="item.content">服务很用心，真的是有任何问题，随时提问都会给你解答。司导也很负责，会根据实际情况或者会根据我们提出的要求合理安排行程。非常棒的一次旅行。</div>

				<div class="imgs" v-if="item.iamgeUrls.length != 0">
					<img :src="item" v-for="(item,index) in item.iamgeUrls.slice(0,4)"/>
					<span>共{{item.iamgeUrls.length}}张</span>
				</div>
			</section>

			<!-- 没图的 评价-->
			<!--<section class="noImg isImg">

				<header>
					<img src="../../assets/touxiang40.png"/>
					<p>又是剪刀手</p>
					<p>2018.05.06 23:59</p>
				</header>

				<div class="txt">服务很用心，真的是有任何问题，随时提问都会给你解答。司导也很负责，会根据实际情况或者会根据我们提出的要求合理安排行程。非常棒的一次旅行。</div>
			</section>-->

		</div>


		<!-- 问大家 -->
		<h1 v-if="questions.length !== 0">
			<p class="cf">
				问大家（{{total}}）
				<span class="fr" @click="goAskAndAnswerALL(2)">查看全部</span>
			</p>
		</h1>
		<section class="ask_return_list" v-if="questions.length !== 0">
			<ul>
				<li class="cf" v-for="(item,index) in questions" @click="goAskAndAnswer(index)">
					<span class="fl">问</span>
					<span class="fl" v-text="item.content">那里有什么好吃的！</span>
					<span class="fr">{{item.answerNum}}个回答</span>
				</li>
			</ul>
		</section>
		<div class="askNostate" v-if="questions.length == 0">
			<div>暂无问答</div>
			<div>旅程好不好，问问去过的人吧！<span @click="goAskAndAnswerALL(2)">去提问</span></div>
		</div>

		<!-- 步履千寻自营店 -->
		<header class="own_stores" @click="goMerchantIndex(goods.orgSummery.haveCoupon)" id="shop">
			<img :src="orgSummery.iconPath"/>
			<p v-text="orgSummery.orgName">步履千寻自营店</p>
			<p v-text="orgSummery.type == 0 ? '自营':'加盟' ">自营</p>
			<p v-show="orgSummery.haveCoupon == 1">领劵</p>
		</header>

		<!-- nav导航 -->
		<ul id="searchBar" class="own_stores_nav cf" :class="[ searchBarFixed == true && n == k ? 'isPosition':'' ]">
			<li v-for="(item,index) in own_stores_navList" v-text="item" :class="[index == n?'own_stores_nav_active':'']" @click="click_Tab(index)"></li>
		</ul>

		<div class="own_stores_navBox" v-show="isBox1" id="Tab1"></div>
		<div id="div1" class="navBox navBox_active" :class="[isLook ? 'hiddenLook' : '']">
			<div v-html="article1.content"></div>
			<div class="video-wart" @click="isVideoPaused">
				<img src="../../assets/common/common_btn_play@3x.png" class="play" v-show="isImg1"/>
			</div>
		</div>
		<!--<div class="navBox">2</div>
		<div class="navBox">3</div>-->
		<h6 v-show="isLook" @click="clickLook">查看更多</h6>
		<h6 v-show="isPackUp" @click="clickPackUp" class="h6">收起</h6>

		<div class="own_stores_navBox" v-show="isBox2" id="Tab2"></div>
		<div id="div2" :class="[isLook2 ? 'hiddenLook2' : '']">
			<!-- 单个天数信息 -->
			<section class="day_txt" v-for="(ite,inde) in article2">

				<header class="cf">
					<p v-text="ite.info.title">第一天</p>
					<p v-text="ite.info.content">全国大阪神户全国大阪神户全国大阪神户啊啊</p>
				</header>
				<div class="day_box">
					<div class="day_itemB" v-for="(it,ind) in ite.list">
						<img src="../../assets/shop_icon_food@2x.png"/>
						<p class="cf">
							<span>{{it.name}}</span>
							<span>：</span>
							<span>{{it.value}}</span>
						</p>
					</div>
				</div>

			</section>

			<!--<section class="day_txt">

				<header class="cf">
					<p>第一天</p>
					<p>全国-大阪-神户</p>
				</header>
				<div class="day_box day_box_active">

					<div class="day_itemA">
						<img src="../../assets/shop_icon_scenic@2x.png"/>
						<h5>神户</h5>
						<p>神户（Kobe），是一个位于日本西部近畿地方兵库县的都市，是兵库县的县厅所在地，位于日本四大岛中最大的一个岛—本州岛的西南部，西枕六甲山，面向大阪湾。位于京阪神大都市...</p>
						<p></p>
					</div>
					<div class="day_itemB">
						<img src="../../assets/shop_icon_food@2x.png"/>
						<p>早餐：敬请自理</p>
						<p>午餐：敬请自理</p>
						<p>晚餐：已含</p>
					</div>
					<div class="day_itemC">
						<img src="../../assets/shop_icon_hotel@2x.png"/>
						<p>入住五星大酒店</p>
					</div>

				</div>

			</section>-->
		</div>
		<h6 v-show="isLook2" @click="clickLook2">查看更多</h6>
		<h6 v-show="isPackUp2" @click="clickPackUp2" class="h6">收起</h6>

		<!-- 旅游景点商品区 -->
		<section class="travel_region" id="Tab3">
			<div class="swiper-container1">
		        <div class="swiper-wrapper divBox">
	              	<div class="swiper-slide travel_one" v-for="(item,index) in goodses" @click="goShoppingMallDetails(index)">
						<img :src="item.imagePath"/>
						<p v-text="item.name">香港纯玩团带你玩转海洋公园+迪士尼乐园 5天4夜...</p>
						<p class="cf">
							<span>¥<b v-text="item.price">1799</b></span>
							<span class="fr">{{item.saleStat}}人购买</span>
						</p>
	              	</div>
		        </div>
		        <!-- 如果需要分页器 -->
		        <!--<div class="swiper-pagination"></div>-->
		  </div>
		</section>

		<!-- 已下架 -->
		<section class="yet_soldOut" v-show="goods.isUp == 0">已下架</section>

		<!-- 底部占位 -->
		<footer class="footer_place"></footer>

		<!-- 固定底部 -->
		<footer class="footer cf">
			<span @click="goSVC"></span>
			<span @click="isCollect"><img :src="[onoff_star==false? require('../../assets/location_btn_star_nor@2x.png') : require('../../assets/location_btn_star_pre@2x.png')]"/><!--<i :class="[onoff_star==false?'':'star_color',onoff_star==false?'fa fa-star-o':'fa fa-star']" @click="isCollect"></i>--></span>
			<span @click="goJoinShoppingCar(1)"></span>
			<button @click="goJoinShoppingCar(2)">
				<p>¥<b v-text="goods.spuLowPrice">3999</b></p>
				<p>立即购买</p>
			</button>
			<button @click="goJoinShoppingCar(3)">
				<p>¥<b v-text="goods.groupLowPrice">3999</b></p>
				<p>发起拼团</p>
			</button>
		</footer>


		<!-- 参与拼团（显示隐藏） -->
		<div class="participation" v-if="onoff_par">
			<div class="parBox">
				<header>
					<p>参与Ta们的拼团<img src="../../assets/my/common_btn_close2@3x.png" @click="isPar"/></p>
					<p v-text="goods.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</p>
					<p>套餐类型：{{ groupListsItem.spec }}</p>
					<p class="cf">
						<span>拼团类型：{{ groupListsItem.groupNum }}人团</span>
						<span class="fr">出行日期：{{ groupListsItem.placeDate }}</span>
					</p>
					<p class="cf">
						<img :src="ite" v-for="(ite,inde) in groupListsItem.images.slice(0,5)"/>
						<!--<img src="../../assets/touxiang1.png"/>-->
						<span class="fr">仅剩<i v-text="groupListsItem.surplusNum">1</i>个名额，<i>{{groupListsItem.isExpired ? groupListsItem.expiredDay : groupListsItem.expiredHour}}</i>后结束</span>
					</p>
				</header>
				<footer @click="goPar">参与拼团</footer>
			</div>
		</div>

		<!-- 更多拼团（显示隐藏） -->
		<div class="more_par" v-show="onoff_lookAll">

			<div class="more_par_item">
				<header>
					<p>正在拼团<img src="../../assets/my/common_btn_close2@3x.png" @click="isLookAll_par"/></p>
				</header>
				<ul>
					<li v-for="(item,index) in groupArrAll">
						<h3 class="cf">
							<img :src="ite" v-for="(ite,inde) in item.images.slice(0,5)"/>
							<!--<img src="../../assets/touxiang1.png"/>-->
							<span class="fr">仅剩<i v-text="item.surplusNum">1</i>个名额，<i>{{groupListsAll[index].isExpired ? groupListsAll[index].expiredDay : groupListsAll[index].expiredHour}}</i>后结束</span>
						</h3>
						<p>套餐类型：{{ item.spec }}</p>
						<p>出发日期：{{ item.placeDate }}</p>
						<button @click="goPTQ(index)">拼团去</button>
					</li>
				</ul>
			</div>

		</div>
		<van-actionsheet v-model="isshow" :actions="imList"  @select="onSelect"   cancel-text="取消"  @cancel="isshow=false"/>
	</div>
</template>

<script>
import swiperBox from '../../components/swiperBox/swiperBox.vue'
import {Toast} from 'vant'
export default {
	data() {
		return {
			//轮播图src;
			isshow:false,
			items: [],
		    onoff_star:false, //没收藏；
		    onoff_lookAll:false, //查看全部评价；
		    onoff_par:false, //是否参与拼团；
		    imgs:[1,2,3,4], //用户评价多张图片；
		    own_stores_navList:['商品介绍','行程信息','店铺推荐'],
		    n:0, //控制步履千寻自营店的Tab切换；
		    k:0, //一开始给this.n和this.k相等，才能做成相互影响的开关；
		    questions:[], //商品详情前三条问答；
		    total:null, //问大家的总条数；
		    AskId:[], //问答列表问题中的id；
		    animate:false,
		    notices:[1,2],
		    listS:[1,2,3,4,5],
		    spuId:"", //从商品首页列表中进入详情的sku;
		    comments:[], //用户评论；
		    ComTotal:null, //用户评论总条数；
		    ComId:[], //用户评论ID；
		    goods:{},  //商品详情；
		    isLi:0,
		    Lis:[],
		    LiId:[], //选择触发地/套餐/人群的ID；
		    groId:[], //公告拼团ID；
		    groupId:null, //公告拼团具体的那个商品ID；
		    goodses:[], //商品列表，推荐商品；
		    orgId:null, //机构店铺id；
			groupLists:[], //公告拼团内容，动态的；
			groupListsAll:[], //静态的；
		    groupListsItem:{}, //公告拼团对应的那条内容；
		    skuId:null,
		    article1:{},  //商品介绍；
		    article2:[],  //行程信息(最新)；
		    grspuId:[],
		    eq:null, //点击拼团信息的那条下标；
		    groupArr:[],
		    groupArrAll:[],
		    orgSummery:{},
		    isLook:true,
		    isLook2:true,
		    isPackUp:false,
		    isPackUp2:false,
		    startScroll:null,
		    touchStart:null,
		    touchCurrent:null,
		    spuID:[],
		    swiperCurrent:{//swiper默认当前图片数；
		    	num:1
		    },
		    indexNum:1,
		    isBox1:false,
		    isBox2:false,
		    searchBarFixed:false,
		    imList:[],
			gID:0,
			isFullscreen:false,
			tel:"",
			isImg1:true,

		}
	},
	components:{
		swiperBox

	},
	created() {
    	this.spuId=this.$route.query.spuId;
		this.GoodsDetails(); //商品详情；
		this.CommentList(2,this.spuId,2); //评论列表；
		this.before_three(); //商品详情前三条问答；

		setInterval(this.scroll,6000) //公告滚动；
	},
	mounted() {
		this.initSwiper();

		window.addEventListener('scroll', this.handleScroll);
	},
	//数据更新完成状态;
	updated(){

	},
	//实例销毁后调用，也就是页面离开后执行；
	destroyed () {
		window.removeEventListener('scroll', this.handleScroll)
	},
	methods: {
		getConfig() {
			let that=this;
			let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=ShoppingMallDetails&shareId=" + this.$store.state.Home.user.id +"&spuId="+this.spuId;

			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
				timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
				nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
				signature: this.$store.state.config.signature, // 必填，签名
				jsApiList: ["chooseImage", "updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
			});

			wx.ready(function() { //需在用户可能点击分享按钮前就先调用
				if(wx.onMenuShareAppMessage){
					wx.onMenuShareAppMessage({
			        title:  that.goods.name, // 分享标题
			        desc: '步履千行', // 分享描述
			        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
			        type: 'link', // 分享类型,music、video或link，不填默认为link
			        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			        success: function() {
							that.shareSuccess()
			          	// 用户点击了分享后执行的回调函数
			        	}
		      		})
				}else{
					wx.updateAppMessageShareData({
			        	title: that.goods.name, // 分享标题
						desc: '步履千行', // 分享描述
			        	link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			        	imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
						success: function (res) {
							console.log(res)
		          			// 设置成功
		        		}
					});
				}
			});
		},
		shareSuccess(){
//       		 this.$Api.Common.ShareTask({a:7,id:this.goods.spuId}).then((res)=>{
//						console.log(res)
//						if(res.q.s==0){
							this.$toast("分享成功","success")
//						}
//					})
		},

		isVideoPaused(e){
			let video = document.querySelector('video');
			console.log('video222',video.paused)
			let that = this;
			//判断video是否播放；
			// if (video.paused) {
			// 	if (window.WeixinJSBridge) {
		 	// 		WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
		 	// 		video.pause();
		 	// 		that.isImg1 = false;
		 	// 	}, false);
		 	//  } else {
		 	// 	document.addEventListener("WeixinJSBridgeReady", function() {
		 	// 		WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
		 	// 			video.pause();
		 	// 			that.isImg1 = false;
		 	// 		});
		 	// 	}, false);
		 	//  }
			// }else{
			if (window.WeixinJSBridge) {
		 		WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
					video.play();
						that.isImg1 = true;
		 		}, false);
		 	 } else {
		 		document.addEventListener("WeixinJSBridgeReady", function() {
		 			WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
						video.play();
		 				that.isImg1 = true;
		 			});
		 		}, false);
		 	 }
			 if (window.WeixinJSBridge) {
				 WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
					 video.webkitEnterFullscreen()
				 }, false);
			 } else {
				 document.addEventListener("WeixinJSBridgeReady", function() {
					 WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
						 video.webkitEnterFullscreen()
					 });
				 }, false);
			 }
			// }
    		e.preventDefault()
		},

		handleScroll(){
			//获取滚动的位置；
			//var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			//监听元素到顶部的距离  并判断滚动的距离如果大于了元素到顶部的距离时，设置searchBar为true,否则就是false;
			var offsetTop = document.querySelector('#searchBar').offsetTop; //获取nav元素到父级元素的距离；
//			var ShopH = document.querySelector('#shop').offsetTop; //获取店铺元素到父级元素的距离；
			var navH = document.querySelector('#searchBar').getBoundingClientRect().height; //获取nav元素height；
//			var ShopT = document.querySelector('#shop').getBoundingClientRect().top; //获取店铺元素的top；
			var shopB = document.querySelector('#shop').getBoundingClientRect().bottom; //店铺底部；
			//var diff = offsetTop - ShopH;
			//console.log('nav高',navH,ShopT)
			//console.log('两个元素的差值',diff)
			//console.log('nav的',offsetTop)scrollTop < offsetTop
			//console.log('店铺元素位置',ShopH)scrollTop >= offsetTop

			//判断店铺元素和nav元素位置来显示与否；
		  	if (shopB <= navH) { //判断店铺底部 <= nav元素的height；
		    	this.searchBarFixed = true;
		    	//console.log('nav大于了，给个固定样式在页面顶部',this.searchBarFixed)
		  	} else if (shopB > navH) { //判断店铺底部 > nav元素的height；
			   	this.searchBarFixed = false;
			   	this.isBox1 = false;
			   	this.isBox2 = false;
			   	//console.log('往上移店铺元素到达顶部了，可以取消固定样式了',this.searchBarFixed)
		  	}
 			//console.log('滚动的位置',scrollTop)

 			var div1 = document.querySelector('#div1').getBoundingClientRect().top,
 				div2 = document.querySelector('#div2').getBoundingClientRect().top;
 			//判断nav的选中变化位置；
   			if (div1 <= navH && div2 >= navH) {
   				//n和k是同时控制的；
   				this.n = 0;
   				this.k = 0;
   				//console.log('进来div1的范围了')
   			}else if(div2 <= navH){
   				this.n = 1;
   				this.k = 1;
   				//console.log('进来div2')
   			}

   			//判断滚动条到底部的条件即为scrollTop + clientHeight == scrollHeight；
   			if (this.getScrollTop() + this.getWindowHeight() == this.getScrollHeight()) {
   				this.n = 2;
   				this.k = 2;
   				//console.log('已经到达底部了')
   			}
			//console.log('div1',div1,'div2',div2)

		},
		getScrollTop(){ //获取滚动条的高度；
		　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
		　　if(document.body){
		　　　　bodyScrollTop = document.body.scrollTop;
		　　}
		　　if(document.documentElement){
		　　　　documentScrollTop = document.documentElement.scrollTop;
		　　}
		　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
		　　return scrollTop;
		},
		//获取文档的总高度；
		getScrollHeight(){
		　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
		　　if(document.body){
		　　　　bodyScrollHeight = document.body.scrollHeight;
		　　}
		　　if(document.documentElement){
		　　　　documentScrollHeight = document.documentElement.scrollHeight;
		　　}
		　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
		　　return scrollHeight;
		},
		getWindowHeight(){  //获取window高度；
		　　var windowHeight = 0;
		　　if(document.compatMode == "CSS1Compat"){
		　　　　windowHeight = document.documentElement.clientHeight;
		　　}else{
		　　　　windowHeight = document.body.clientHeight;
		　　}
		　　return windowHeight;
		},

		getImId(){ //获取客服信息;
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
		//点击商品介绍查看更多；
		clickLook(){
			this.isLook = false;
			this.isPackUp = true;
		},
		//点击商品介绍收起；
		clickPackUp(){
			this.isLook = true;
			this.isPackUp = false;
		},
		//点击商品介绍查看更多；
		clickLook2(){
			this.isLook2 = false;
			this.isPackUp2 = true;
		},
		//点击商品介绍收起；
		clickPackUp2(){
			this.isLook2 = true;
			this.isPackUp2 = false;
		},

		//文章详情；
		article(id){

			let ArtObj1 = {
					'id':this.goods.prodInttroductionId
				},ArtObj2 = {
					'id':this.goods.journeyId
				};

			//判断是商品介绍还是行程信息；
			if (id == 1) { //商品介绍；
				this.$Api.Shop.article(ArtObj1).then( res => {
					console.log(res)

					this.article1 = res.q.article;
//					console.log(this.rticle1)
				}).then( ()=>{
					let video = document.querySelector('video');
					//console.log(video,'vvvvvvvvvvvvvv')
					//先判断是否存在video标签；
					if (video == null) { //不存在；
						this.isImg1 = false;
						return
						//console.log('后台没渲染不存在')
					} else{ //存在；
						//兼容：在andriod手机上，添加video的一些属性，解决：在andriod手机上video视频播放时自动置顶和层级高的问题;
//						video.style.width = document.documentElement.clientWidth || document.body.clientWidth;
//						video.style.height = document.documentElement.clientHeight || document.body.clientHeight;
            			video.setAttribute('x5-video-player-type', 'h5');
						video.setAttribute('webkit-playsinline', 'true'); //内联播放;设置playsinline不全屏播放
						video.setAttribute('x-webkit-airplay', 'allow');
						video.setAttribute('x5-video-player-fullscreen', true);
						video.setAttribute('preload',"auto");
							video.setAttribute('playsinline', 'true');
							if (window.WeixinJSBridge) {
							 WeixinJSBridge.invoke('getNetworkType', {}, function(e) {

									 video.load();

							 }, false);
							} else {
							 document.addEventListener("WeixinJSBridgeReady", function() {
								 WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
										 video.load();

								 });
							 }, false);
							}
						video.removeAttribute('controls')
//						video.setAttribute('autoplay', 'autoplay');
//						video.setAttribute('x5-video-ignore-metadata', true);
//						video.setAttribute('object-fit', 'fill');
//						video.setAttribute('object-position', 'center center');
						video.setAttribute('x5-video-orientation', 'landscape'); //跟随手机自动旋转;声明播放器支持的方向，可选值landscape 横屏,portraint竖屏。默认值portraint。无论是直播还是全屏H5一般都是竖屏播放，但是这个属性需要x5-video-player-type开启H5模式;
						//console.log('存在',video.style.width,video.style.height)

						//判断video是否播放；
						// if (video.paused) {
						// 	video.setAttribute('x5-video-player-type', 'h5');
						// 	console.log('暂停')
						// }else{
						// 	video.removeAttribute('x5-video-player-type')
						// 	console.log('播放')
						// }

						this.$nextTick(()=>{

							video.addEventListener('click', this.isVideoPaused);
						})
//						video.addEventListener('click',()=>{
//							console.log('进入了全屏事件')
//							this.isFullscreen = !this.isFullscreen;
//							//在外部设置一个全局变量初始值赋值为false
//							if(this.isFullscreen){//切换到全屏;
//								console.log('全屏')
//							}else{//退出全屏;
//								console.log("退出全屏")
//							}
//						},true)
					}
				})

				//console.log('商品介绍')
			} else if(id == 2){ //行程信息；
				this.$Api.Shop.GetJourneyInfo(ArtObj2).then( res => {
					console.log(res)

					this.article2 = res.q.detials;
//					console.log(this.article2)
				});

				//console.log('行程信息')
			}
		},

		//商品列表协议接口；
		GoodsList(orgId){

			let GodObj = {
				a:3, //店铺推荐;
				'orgId':orgId, //机构id,自营的店铺orgId=1;
			};

			this.$Api.Shop.GoodsList(GodObj).then( res => {
				console.log(res)
				this.goodses = res.q.goodses;
				//console.log(this.goodses)
				this.goodses.forEach( item => {
					this.spuID.push(item.spuId)
				})
				this.$nextTick(()=> {
					this.LRSwiper(".swiper-container1"); //左右滑动Swiper；
				})
				//console.log(this.spuID)
			}).then(()=> {

			})
		},

		//点击选择触发地/套餐/人群；
		click_li(index){
			this.isLi = index;
			//console.log(this.LiId[index])
		},

		//评论列表；
		CommentList(a,id,li){
			let comObj = {
				'a':a,
			  	'id':id,   //被评论的ID；
			  	'li':li
			};

			this.$Api.Shop.CommentList(comObj).then( res => {
				console.log(res)

				this.comments = [...res.q.comments];
				this.ComTotal = res.q.total;

				this.comments.forEach( (item) => {
					this.ComId.push(item.id)
					
					//判断用户评论的用户没有头像时，添加个步履千寻（猴子）的默认头像；
					if (item.imagePath == '') {
						item.imagePath = require('../../assets/my_icon_default_avatar@2x.png');
					}
				});
				//console.log(this.ComId)
			})
		},

		//商品详情接口；
		async GoodsDetails(){

			let GDetObj = {
				'spuId':this.spuId
			};

			this.groupLists =[];
			this.$Api.Shop.GoodsDetails(GDetObj).then( res => {
				console.log(res)

				this.Lis = res.q.goods.datePriceLists;
				this.orgId = res.q.goods.orgSummery.orgId;
				this.groupArr = [...res.q.goods.groupLists]; //用于公告轮播的（动态的）；
				this.groupArrAll = [...res.q.goods.groupLists]; //用于显示全部公告拼团的数据（静态的）；
				this.orgSummery = res.q.goods.orgSummery;

				this.goods = {...res.q.goods};
				console.log(this.goods,'ggggggggggggggg')

				this.goods.groupLists.forEach( item => {
					let arr = [...item.images.slice(0,5)];
					item.images=[];
                    for(let i=0;i<arr.length;i++){
     					//判断参与拼团的用户是否有头像，没有就默认一张步履千寻（猴子）的头像；
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
//							arr.find( (val) => {
//								if (val === require('../../assets/shop_img_wait_big@2x.png')) { 
//									arr.pop()
//									console.log('arr',arr)
//									console.log('已有该图片了')
//								}else{
//									let img = require('../../assets/shop_img_wait_big@2x.png');
//									arr.push(img)
//								}
//							} )
							//return
							//break;
							//continue;
						}
						console.log('图片的长度',arr.length)
						item.images.push(arr[i])
                    }
//					arr.forEach( ite => {
//						//再判断this.groupLists里面的头像数组；
//						if (ite == '') {
//							ite = require('../../assets/my_icon_default_avatar@2x.png');
//							console.log('数组头像有空',ite)
//						}else{
//							ite = this.$imgUrl+ite;
//						}
//					})
//					item.images=[...arr]
				})
				console.log(this.goods,'sssssssssssss')

				//循环该商品的轮播图；
				for (let i=0;i<res.q.goods.images.length;i++) {
					this.items.push({});
					this.items[i].imagePath = res.q.goods.images[i];
				}
				//console.log(this.items)

				//循环选择触发地/套餐/人群的ID；
				for (let i=0;i<this.Lis.length;i++) {
					this.LiId.push(this.Lis[i].id);
				}

				//循环公告拼团ID；
				for (let i=0;i<res.q.goods.groupLists.length;i++) {
					this.groId.push(res.q.goods.groupLists[i].id);
					this.grspuId.push(res.q.goods.groupLists[i].spuId);

					let obj = {...res.q.goods.groupLists[i]};
					//console.log(obj)
					let arr = obj.expiredHour.split(':');
					obj.timer=null;  //先定义个关闭定时器；
					obj.totalSecond = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2]); //先把活动目标时间转化为总秒数；
					obj.isExpired = false; //先给个状态默认值；
					this.groupLists.push(obj); //动态的；
					this.groupListsAll.push(obj); //静态的；
				}

				//倒计时；
				this.$nextTick(()=>{
					this.changeDate();
				})

				if (res.q.s == 0) {
					this.GoodsList(this.orgId);
					this.article(1); //商品介绍；
					this.article(2); //行程信息；
					this.getImId();
				}
//				console.log(this.items,this.LiId,this.groId)
				this.getConfig()
			})

		},

		//拼团倒计时；
		changeDate(){
			this.groupListsAll.forEach( item => { //静态的；
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
						//console.log(iHour,iMin,iSec)
						item.isExpired = false; //格式：时:分:秒；的状态；
						item.expiredHour=iHour+":"+iMin+":"+iSec;
	
					},1000)
				}	
			})

			this.groupLists.forEach( item => { //动态的；
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
						//console.log(iHour,iMin,iSec)
						item.isExpired = false; //格式：时:分:秒；的状态；
						item.expiredHour=iHour+":"+iMin+":"+iSec;
	
					},1000)
				}	
			})
		},

		scroll(){//公告功能;
			//判断只要有两个或以下公告时，不向上轮播滚动；
			if (this.groupArr.length <= 2) {
				this.animate=false;
			} else{
				this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true;
		       	setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多;
		       		//console.log(this.notices,'this.notices刚开始的')
	               	this.groupArr.push(this.groupArr[0]);  // 将数组的第一个元素添加到数组的;
	               	this.groupArr.push(this.groupArr[1]);  // 将数组的第一个元素添加到数组的;
	               	this.groupLists.push(this.groupLists[0]);  // 将数组的第一个元素添加到数组的;
	               	this.groupLists.push(this.groupLists[1]);  // 将数组的第一个元素添加到数组的;
	               	//console.log(this.notices,'this.notices添加的')
	               	this.groupArr.shift();               //删除数组的第一个元素;
	               	this.groupArr.shift();               //删除数组的第一个元素;
	               	this.groupLists.shift();               //删除数组的第一个元素;
	               	this.groupLists.shift();               //删除数组的第一个元素;
	               	//console.log(this.notices,'this.notices删除的')
//	               	this.arr.push(this.arr[0])
//	               	this.arr.push(this.arr[1])
//	               					    <!--<li v-for="(v,i) in arr">{{v}}</li>-->
	               	this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动;
		       	},5000)
			}
    	},

		//收藏接口；
		//a=2是商品，3是回答有用,open=1是收藏，2是取消收藏；spuId是该商品的id；
		Favorite(a,open,spuId){

			let FavObj = {
				'a':a,
				'open':open,
				id:spuId //收藏id先固定死；
			};

			this.$Api.Shop.Favorite(FavObj).then( res => {
				console.log(res)
			})
		},

		//商品详情前三条问答；
		before_three(){

			let queObj = {
				a:4,
	  			type:1,
				id:this.spuId  //此商品id；
			};

			this.$Api.Shop.QuestionsList(queObj).then( res => {
				console.log(res)

				this.questions = [...res.q.questions];
				this.total = res.q.total; //问大家的总条数；

				this.questions.forEach( (item) => { //获取保存问答每个问题的id；
					this.AskId.push(item.id);
				})
			})
		},

		//点击店铺的Tab切换;
		click_Tab(index){
//			this.n = index;
//			this.k = index;
			//console.log(this.k)

			if (index == 0) {
				this.n = index;
				this.k = index;
				this.isBox1 = true;
				this.isBox2 = false;
				if (this.isBox1) {
					this.$nextTick(()=>{
						document.querySelector('#Tab1').scrollIntoView();
						//console.log('进来滚动#Tab1了',this.n,this.k,index)
					})
				}
			} else if (index == 1){
				this.n = index;
				this.k = index;
				this.isBox1 = false;
				this.isBox2 = true;
				if (this.isBox2) {
					this.$nextTick(()=>{
						document.querySelector('#Tab2').scrollIntoView();
						//console.log('进来滚动#Tab2了',this.n,this.k,index)
					})
				}
			}else if (index == 2){
				this.n = index;
				this.k = index;
				document.querySelector('#Tab3').scrollIntoView();
				//console.log('滚到#Tab3了',this.n,this.k,index)
			}

		},

		//初始化轮播;
		initSwiper() {
			const _this = this;
			this.swiper = new Swiper('.ban .swiper-container', {
				direction: 'horizontal',
//				loop: true, //设置为true 则开启loop模式。loop模式：会在原本slide前后复制若干个slide(默认一个)并在合适的时候切换，让Swiper看起来是循环的。 loop模式在与free模式同用时会产生抖动，因为free模式下没有复制slide的时间点。
//				loopFillGroupWithBlank:false, //在loop模式下，为group填充空白slide;
//				loopAdditionalSlides:0, //loop模式下会在slides前后复制若干个slide,，前后复制的个数不会大于原总个数。默认为0，前后各复制1个。0,1,2 --> 2,0,1,2,0例：取值为1，0,1,2 --> 1,2,0,1,2,0,1例：取值为2或以上，0,1,2 --> 0,1,2,0,1,2,0,1,2
//				slidesPerview:1, //在loop模式下使用slidesPerview:'auto'，还需使用该参数设置所要用到的loop个数(一般设置为本来slide的个数)。
				pagination:'.ban .swiper-container',
//				pagination: { // 如果需要分页器；
//					el: '.swiper-pagination',
//					clickable: true
//				},
				observer:true,  //修改swiper自己或子元素时，自动初始化swiper；
	      		observeParents:true,//修改swiper的父元素时，自动初始化swiper；
				autoplay:false, //禁止自动轮播；
//				autoplay: {
//					delay: 2000, //自动轮播的间隔时间；
//					disableOnInteraction: false, //手动滑动后继续自动播放;
//				},
//				speed: 500, //切换速度，即slider自动滑动开始到结束的时间（单位ms），也是触摸滑动时释放至贴合的时间。
//				autoplayDisableOnInteraction: true,  //是否禁止autoplay；
				initialSlide :0, //初始化索引；
				//indexNum:1, //设置变量判断索引值0是否为第一次输出;
				on:{
					//回调函数，swiper从一个slide过渡到另一个slide结束时执行。
//					slideChangeTransitionEnd: function(){
//				      	alert(this.activeIndex); //切换结束时，告诉我现在是第几个slide
//
//				    },
					//当当前Slide切换时执行(activeIndex发生改变);
//				    slideChange:function(){
//				    	this.swiperCurrentNumber = this.activeIndex+1;
//				    	console.log(this.swiperCurrentNumber,'swiper当前图片数')
//				    },
					//回调函数，slider向前(右、下)切换结束时执行。类似于slideChangeTransitionEnd，但规定了方向。;
					slideNextTransitionEnd:function(){
						//判断大于就重置为第一张图片；
				      	console.log(_this.items.length,'_this.items.length',_this.swiperCurrent.num,'_this.swiperCurrent.num')
				      	if ( _this.swiperCurrent.num >= _this.items.length) {
				      		console.log('大于了')
				      		_this.indexNum = 1;
				      		_this.$set( _this.swiperCurrent,'num', _this.indexNum)
//				      		this.slideTo(0); //切换到指定slide。index:必选，num，指定将要切换到的slide的索引。speed:可选，num(单位ms)，切换速度runCallbacks: 可选，boolean，设置为false时不会触发transition回调函数。
				      	}else{
				      		_this.indexNum++;
				      		console.log(_this.indexNum,'this.swiper.indexNum')
				      		_this.$set( _this.swiperCurrent,'num', _this.indexNum)
				      	}
				      	console.log( _this.swiperCurrent.num,'swiper当前图片数')
					},
					//回调函数，slider向后(左、上)切换结束时执行。类似于slideChangeTransitionEnd，但规定了方向。;
					slidePrevTransitionEnd:function(){
						console.log(_this.items.length,'_this.items.length',_this.swiperCurrent.num,'_this.swiperCurrent.num')
				      	if ( _this.swiperCurrent.num == 1) {
				      		console.log('等于第一张了')
				      		_this.indexNum = 1;
//				      		_this.$set( _this.swiperCurrent,'num', _this.indexNum)
				      		//this.slideTo(0); //切换到指定slide。index:必选，num，指定将要切换到的slide的索引。speed:可选，num(单位ms)，切换速度runCallbacks: 可选，boolean，设置为false时不会触发transition回调函数。
				      	}else{
				      		_this.indexNum--;
				      		console.log(_this.indexNum,'this.swiper.indexNum')
				      		_this.$set( _this.swiperCurrent,'num', _this.indexNum)
				      	}
				      	console.log( _this.swiperCurrent.num,'swiper当前图片数')
					},
				}
			});
			//console.log('swiperffffffffff',this.swiper)
		},

		//控制是否收藏；
		isCollect(){
			this.onoff_star = !this.onoff_star;

			//判断开关是否收藏；
			if (this.onoff_star) { //收藏；
				console.log(this.goods.spuId)
				this.Favorite(2,1,this.goods.spuId);
			} else{ //没收藏；
				console.log(this.goods.spuId)
				this.Favorite(2,2,this.goods.spuId);
			}
		},

		//控制是否查看全部评价；
		isLookAll_par(){
			this.onoff_lookAll = !this.onoff_lookAll;
		},

		//全部拼团；
		goPTQ(index){
			this.eq = index; //点击拼团信息的那条下标；

			this.goPar();
		},

		//控制参与拼团；
		isPar(index){
			this.onoff_par = !this.onoff_par;

			if (this.onoff_par) { //打开才渲染;
				this.groupLists.forEach( item => {
					let arr = [...item.images.slice(0,5)];
					item.images=[];
					for (let i=0;i<arr.length;i++) {
						if (arr[i] == '') {
							arr[i] = require('../../assets/my_icon_default_avatar@2x.png');
							console.log('数组头像有空',arr[i])
						}else{
							arr[i] = arr[i];
						}
                    	item.images.push(arr[i])
					}
				})
				this.groupListsItem = this.groupLists[index];

				this.skuId = this.groupListsItem.skuId;
				this.groupId = this.groId[index];
				this.gID = this.groupListsItem.id;
				console.log(this.groupListsItem,'this.groupListsItem')
			}

			this.eq = index; //点击拼团信息的那条下标；
		},

		//跳转加入购物车（参与拼团），再确认订单页面；
		goPar(){
			this.$router.push({
				name:"JoinShoppingCaring",
				query: {
					skuId:this.skuId,
					'spuId':this.spuId,  //产品id；
					'grspuId':this.grspuId[this.eq],
					'eq':this.eq+"", //点击拼团信息的那条下标；
					'id':this.gID,
					spec:this.groupListsItem.spec, //参与拼团固定的套餐类型；
					placeDate:this.groupListsItem.placeDate,  //参与拼团固定的出发日期；
					price:this.groupListsItem.price, //参与拼团固定的拼团价钱(成人)；
					childrenGroupPrice:this.groupListsItem.childrenGroupPrice //参与拼团固定的拼团价钱(儿童)，这个儿童拼团价有可能是没有的；
				}
			})

		},

		//跳转全部评价页面；
		goAppraise(praiseInitial){

			this.$router.push({
				name: "AllComment",
				query: {
					'praiseInitial':praiseInitial,
					spuId:this.spuId 
				}
			})

		},

		//跳转加入购物车(支付)页面；
		goJoinShoppingCar(i){

			this.$router.push({
				name: "JoinShoppingCar",
				query: {
					btnTxt:i,  //判断是从哪里点击跳转进来的；
					spuId:this.spuId

				}
			})

		},

		//跳转商城问答页面(全部)；
		goAskAndAnswerALL(type){
			this.$router.push({
				name: "AskAndAnswer",
				query: {
					'type':type,
					'spuId':this.spuId
				}
			})
		},

		//跳转商城问答页面；
		goAskAndAnswer(index){
			console.log(this.AskId[index])

			this.$router.push({
				name: "AskAndAnswer",
				query: {
					'id':this.AskId[index],
					'spuId':this.spuId
				}
			})

		},

		goShoppingMallDetails(index){
			this.$router.push({
				name:"ShoppingMallDetails",
				query:{
					spuId:this.spuID[index]
				}
			})
		},

		//跳转商家页面；
		//haveCoupon=0是没，=1是有；
		goMerchantIndex(haveCoupon){

			this.$router.push({
				name: "MerchantIndex",
				query: {
					'haveCoupon':haveCoupon,
					'orderId':this.orgId  //店铺id；
				}
			})
		},

		//跳转客服页面；
		goSVC(){
			if(this.imList.length>0){
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
		//左右滑动Swiper；
		LRSwiper(el){
			this.mySwiper = new Swiper(el, {
		        direction: "horizontal",
		        slidesPerView: "auto",
//		        pagination:'.swiper-container1',
//		        initialSlide :0, //初始化索引；
//		        activeIndex:0,  //返回当前活动块(激活块)的索引。loop模式下注意该值会被加上复制的slide数。
//		        init: true, //当你创建一个Swiper实例时是否立即初始化。如果禁止了，可以稍后使用mySwiper.init()来初始化。
          		autoplayDisableOnInteraction: false,
//		        spaceBetween : 5, //在slide之间设置距离（单位px）。
		        observer: true,//修改swiper自己或子元素时，自动初始化swiper;
//				observeParents: true,//修改swiper的父元素时，自动初始化swiper;
//				longSwipesRatio:0.1,  //进行longSwipes时触发swiper所需要的最小拖动距离比例，即定义longSwipes距离比例。值越大触发Swiper所需距离越大。最大值0.5。
//				touchRatio:1,  //触摸比例。触摸距离与slide滑动距离的比率。默认为1，按照1:1的触摸比例滑动。设置为0时，完全无法滑动;

		    });

		    //console.log('mySwiperdsfsdfeswf',this.mySwiper)
		},

	},
	beforeRouteUpdate(to,from,next){
		this.spuId=to.query.spuId
		this.GoodsDetails(); //商品详情；
		this.CommentList(2,this.spuId,2); //评论列表；
		this.before_three(); //商品详情前三条问答；

		setInterval(this.scroll,6000) //公告滚动；
		this.initSwiper();

		window.addEventListener('scroll', this.handleScroll);
		next()
	}
}

</script>

<style>
video{
	background: #000 !important;
}
/*.hd{display: none !important;}*/
/*后台返回数据渲染标签的样式*/
.route_item_table{
	width: 100% !important;
}
#schedule_map,#J_scheduleMap{width: 100% !important;}
.mult_sce{
	padding: 0 !important;
}
.pil-figure-placeholder,.pil-figure-media{
	width: 100% !important;
	img{width: 100% !important;}
}
.flt_con{
	overflow: hidden;
}
</style>
<style scoped lang="less">
#div1{
	position: relative;
}
.video-wart{
	width: 94%;
	height: 8.5rem;
	position: absolute;
	top: 0.5rem;
	left: 0.2rem;
	/*background: pink;*/
}
.play{
	position: absolute;
	top: 4rem;
	left: 45%;
	width: 1rem !important;
	height: 1rem !important;
}
.askNostate{
	width: 100%;
	border-bottom: 0.15rem solid #ededed;
	padding: 0 0.25rem;
	box-sizing: border-box;
	div{
		font-size: 0.2rem;

	}
	div:nth-of-type(1){
		height: 0.6rem;
		line-height: 0.6rem;
		border-bottom: 1px solid #f1f1f1;
		color: #333;
	}
	div:nth-of-type(2){
		width: 100%;
		height: 0.78rem;
		padding-top: 0.3rem;
		box-sizing: border-box;
		color: #828282;
		position: relative;
		span{
			padding: 0.07rem 0.2rem;
			border: 1px solid #3e3d3d;
			border-radius: 0.08rem;
			position: absolute;
			top: 0.2rem;
			right: 0rem;
		}
	}
}

.hiddenLook{overflow: hidden !important;height:6.92rem !important;}
.hiddenLook2{overflow: hidden !important;height:6.92rem !important;}

.groupBookingBoxHeight{height: 1.85rem !important;}
/*该商城首页商品详情页面样式*/
.shoppingMallDetails{
	background: #fff;

	.header{
		border-bottom: 0.15rem solid #ededed;
		height: 2.4rem;
		width: 100%;
		position: relative;
		p{
			position: absolute;
			left: 0.25rem;
		}
		p:nth-of-type(1){
			top: 0.3rem;
			width:6.99rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(26,26,26,1);
			line-height:0.42rem;
		}
		p:nth-of-type(2){
			top: 1.4rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(246,50,62,1);
			line-height:0.24rem;
			b{
				color: #F6323E;
				font-size: 0.32rem;
			}
		}
		p:nth-of-type(3){
			width:6.99rem;
			top: 1.7rem;
			span{
				font-size:0.22rem;
				font-family:PingFang-SC-Light;
				font-weight:300;
				color:rgba(153,153,153,1);
				line-height:0.24rem;
			}
			strong{
				font-size:0.3rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(255,52,81,1);
				float: right;
				img{
					width:0.25rem;
					height:0.36rem;
					vertical-align: top;
				}
			}
		}

	}

	.groupBookingBox{
		padding: 0 0.25rem;
		box-sizing: border-box;
		border-bottom: 0.15rem solid #ededed;
		width: 100%;
		height: 3.55rem;
		position: relative;
	}

	/*选择：出发地/套餐/人群样式*/
	.three_choose{
		height: 1.5rem;
		border-bottom: 0.15rem solid #ededed;
		padding: 0.3rem 0 0 0.25rem;
		box-sizing: border-box;
		ul{width: 6.5rem;}
		li{
			width:2rem;
			height:0.88rem;
			border:1px solid rgba(153,153,153,1);
			border-radius:0.05rem;
			float: left;
			padding-top: 0.05rem;
			box-sizing: border-box;
			position: relative;
			margin-left: 0.2rem;
			p{
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				text-align: center;
			}
			p:nth-of-type(1){
				color:rgba(51,51,51,1);
			}
			p:nth-of-type(2){
				color:rgba(246,50,62,1);
			}
			img{
				width:0.25rem;
				height:0.23rem;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
		li:nth-of-type(1){margin-left: 0;}
		div{width: 0.5rem;float: left;height: 100%;background: url(../../assets/common/common_btn_right@3x.png) no-repeat 0.3rem 0.35rem;background-size: 0.12rem 0.17rem;}
	}

	.appraiseBox{border-bottom: 0.15rem solid #ededed;padding: 0 0.25rem;box-sizing: border-box;}
	.isImg:last-child{border-bottom: none;}

	/*问大家区域样式*/
	.ask_return_list{
		padding: 0.2rem 0.25rem 0;
		box-sizing: border-box;
		border-bottom: 0.15rem solid #ededed;
		li{
			height: 0.5rem;
			span{
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
			}
			span:nth-of-type(1){
				width:0.26rem;
				height:0.26rem;
				text-align: center;
				line-height: 0.26rem;
				background:rgba(250,220,86,1);
				border-radius:0.05rem;
				font-size:0.2rem;
				color:rgba(255,255,255,1);
				margin: 0.03rem 0.2rem 0 0;
			}
			span:nth-of-type(2){
				color:rgba(153,153,153,1);
				width: 5rem;
				white-space:nowrap;text-overflow:ellipsis;overflow:hidden;
			}
			span:nth-of-type(3){
				color:rgba(204,204,204,1);
			}

		}

	}


	/*步履千寻自营店样式*/
	.own_stores{
		width: 100%;
		height: 1.4rem;
		border-bottom: 0.15rem solid #ededed;
		position: relative;
		img{
			width:1rem;
			height:1rem;
			position: absolute;
			left: 0.25rem;
			top: 0.15rem;
		}
		p{
			position: absolute;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
		}
		p:nth-of-type(1){
			top: 0.35rem;
			left: 1.45rem;
			color:rgba(51,51,51,1);
		}
		p:nth-of-type(2){
			top: 0.75rem;
			left: 1.45rem;
			color: #666;
			padding-left: 0.4rem;
			background: url(../../assets/shop_img_authentication@2x.png) no-repeat;
			background-size: 0.3rem;
		}
		p:nth-of-type(3){
			top: 0;
			right: 0;
			font-size:0.24rem;
			font-weight:400;
			color:rgba(102,102,102,1);
			height: 100%;
			line-height: 1.4rem;
			padding: 0 0.5rem 0 0.2rem;
			background: url(../../assets/common/common_btn_right@3x.png) no-repeat 0.9rem 0.63rem;
			background-size: 0.1rem 0.17rem;
		}

	}

	.own_stores_nav{
		width: 100%;
		height: 0.86rem;
		background: #fff;
		padding: 0.1rem 0 0 0.5rem;
		box-sizing: border-box;
		border-bottom: 1px solid #ededed;
		li{
			padding: 0.15rem 0.3rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			float: left;
			margin-left: 0.8rem;
		}
		li:nth-of-type(1){margin-left: 0;}
	}

	.own_stores_navBox{
		width: 100%;
		height: 0.86rem;
	}

	.navBox{
		display: none;
		width:7.5rem;
		/*height:6.92rem;*/
		padding: 0.15rem 0.25rem 0;
		box-sizing: border-box;

		img{
			width: 100%;
			height: 100%;

		}
	}

	h6{
		height: 1rem;
		text-align: center;
		line-height: 1rem;
		font-size:0.24rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(102,102,102,1);
		background: url(../../assets/common_btn_down@2x.png) no-repeat 4.5rem 0.45rem;
		background-size: 0.16rem 0.1rem;
		border-bottom: 0.15rem solid #ededed;
	}
	.h6{
		background: url(../../assets/common_btn_up@2x.png) no-repeat 4.5rem 0.45rem;background-size: 0.16rem 0.1rem;
	}

}

.ban{
	width: 100%;
	height: 4rem;
	position: relative;
	p{
		z-index: 10;
		position: absolute;
		top: 0.3rem;
		height:0.38rem;
		background:rgba(0,0,0,0.3);
		border-radius:0.05rem;
		font-size:0.22rem;
		font-family:PingFang-SC-Regular;
		color:rgba(255,255,255,1);
		line-height: 0.38rem;
	}
	p:nth-of-type(1){
		width:2.38rem;
		left: 0.25rem;
		text-align: center;
	}
	p:nth-of-type(2){
		width:1.01rem;
		right: 0.25rem;
		padding-left: 0.5rem;
		background: url(../../assets/shop_icon_pic@2x.png) no-repeat 0.15rem 0.1rem rgba(0,0,0,0.3);
		background-size: 0.24rem 0.2rem;
	}
}




/*固定底部和占位样式*/
.footer_place{height: 1rem;}
.footer{
	width: 100%;
	height: 1rem;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	padding-left: 0.25rem;
	box-sizing: border-box;
	background: #fff;
	span{
		height: 100%;
		float: left;
	}
	span:nth-of-type(1){
		width: 1.05rem;
		background: url(../../assets/shop_btn_services_little@2x.png) no-repeat 0.4rem 0.25rem;
		background-size: 0.44rem;
	}
	span:nth-of-type(2){
		width: 1.1rem;
		padding: 0.25rem 0 0 0.4rem;
		box-sizing: border-box;
		/*background: url(../../assets/location_btn_star_pre@2x.png) no-repeat 0.4rem 0.25rem;*/
		/*background-size: 0.44rem;*/
		img{width:0.44rem;height:0.44rem;vertical-align: top;}
		/*i{font-size: 0.44rem;color: #666;}*/
	}
	span:nth-of-type(3){
		width: 1.1rem;
		background: url(../../assets/shop_btn_cart@2x.png) no-repeat 0.4rem 0.25rem;
		background-size: 0.44rem;
	}
	button{
		width:2rem;
		height:0.98rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		float: left;
		p{
			b{
				font-weight: normal;
				font-size: 0.3rem;
			}
		}
		p:nth-of-type(1){
			font-size:0.2rem;
			color:rgba(51,51,51,1);
		}
		p:nth-of-type(2){
			font-size:0.26rem;
			color:rgba(26,26,26,1);
		}
	}
	button:nth-of-type(1){background:rgba(255,251,232,1);}
	button:nth-of-type(2){background:rgba(249,220,83,1);}

}


/*选中收藏（星星）样式*/
.star_color{color: #ffdd55 !important;}

/*选中出发地/套餐/人群样式*/
.three_choose_active{border-color: #ffdd55 !important;background: #ffffdd !important;}

/*选中步履千寻自营店的Tab切换样式*/
.own_stores_nav_active{background:rgba(255,239,169,1);}
.navBox_active{display: block !important;}
.isPosition{position: fixed;top: 0;left: 0;z-index: 10;}

</style>
<style scoped lang="less">
/*该页面相同的样式*/

/*公告栏1*/
.notice{background-color: rgba(250,250,250,0.2);width: 90%;height: 100%;position: absolute;top: 0rem;overflow: hidden;border-radius: 0.06rem;z-index: 10;}
.notice ul{position: absolute;top: 0rem;width: 100%;}
.horn{width: 0.28rem;height: 0.29rem;margin: 0.1rem 0 0 0;}
/*.horn>img{width: 0.28rem;height: 0.29rem;}*/
.anim{transition: all 3s;margin-top: -3.5rem;}
.con1>li{list-style: none;height: 90%;color: #fff;width: 100%;}

/*左右滑动轮播*/
.swiper-container1{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/*已下架样式*/
.yet_soldOut{
	width:7.5rem;
	height:0.68rem;
	background:rgba(60,60,60,1);
	font-size:0.26rem;
	font-family:PingFang-SC-Bold;
	font-weight:bold;
	color:rgba(254,254,254,1);
	text-align: center;
	line-height: 0.68rem;
}

/*更多拼团（显示隐藏）样式*/
.more_par{
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 200;
	left: 0;
	top: 0;
	background: rgba(0,0,0,0.7);
	.more_par_item{
		width: 100%;
		padding: 0 0.25rem;
		box-sizing: border-box;
		background: #fff;
		border-radius: 0.1rem 0.1rem 0 0;
		position: absolute;
		left: 0;
		bottom: 0;
		header{
			border-radius:0.1rem 0.1rem 0 0;
			p{
				width: 100%;
				font-size:0.3rem;
				font-weight:500;
				color:rgba(51,51,51,1);
				height: 0.9rem;
				border-bottom: 1px solid #c7c7c7;
				text-align: center;
				line-height: 0.9rem;
				position: relative;
				img{
					position: absolute;
					right: 0;
					top: 0.35rem;
					width: 0.22rem;
					height: 0.22rem;

				}
			}

		}

		ul{
			li{
				width: 100%;
				height: 1.8rem;
				border-bottom: 1px solid #ededed;
				position: relative;
				h3{
					width: 100%;
					height: 0.9rem;
					position: relative;
					font-size:0.28rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(102,102,102,1);
					img{
						width: 0.4rem;
						height: 0.4rem;
						position: absolute;
						top: 0.2rem;
						border-radius: 50%;
					}
					span{
						padding-top: 0.2rem;
						i{font-style: normal;color: #F6323E;}
					}
					img:nth-of-type(1){
						left: 0;
					}
					img:nth-of-type(2){
						left: 0.25rem;
					}
					img:nth-of-type(3){
						left: 0.5rem;
					}
					img:nth-of-type(4){
						left: 0.75rem;
					}
					img:nth-of-type(5){
						left: 1rem;
					}
				}

				p{
					font-size:0.22rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(102,102,102,1);
					line-height:0.3rem;
					position: absolute;
					left: 0.25rem;
				}
				p:nth-of-type(1){
					top: 0.9rem;
					width: 5.5rem;
					white-space:nowrap;text-overflow:ellipsis;overflow:hidden;
				}
				p:nth-of-type(2){
					top: 1.3rem;
				}
				button{
					width:1.11rem;
					height:0.62rem;
					background:rgba(250,220,86,1);
					border-radius:0.1rem;
					position: absolute;
					right: 0;
					top: 0.9rem;
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
				}

			}
		}

	}

}

/*参与拼团（显示隐藏）样式*/
.participation{
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 200;
	left: 0;
	top: 0;
	background: rgba(0,0,0,0.7);
	.parBox{
		width:5.6rem;
		height:4.2rem;
		background:rgba(255,255,255,1);
		border-radius:0.1rem;
		position: absolute;
		left: 0.9rem;
		top: 3.2rem;
		header{
			padding: 0 0.25rem;
			box-sizing: border-box;
			border-radius:0.1rem 0.1rem 0 0;
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				font-weight:400;
				color:rgba(102,102,102,1);
				line-height:0.36rem;
			}
			p:nth-of-type(1){
				width: 100%;
				font-size:0.26rem;
				font-weight:bold;
				color:rgba(51,51,51,1);
				height: 0.72rem;
				border-bottom: 1px solid #c7c7c7;
				text-align: center;
				line-height: 0.72rem;
				position: relative;
				img{
					position: absolute;
					right: 0;
					top: 0.25rem;
					width: 0.22rem;
					height: 0.22rem;
				}
			}
			p:nth-of-type(2){
				font-size:0.26rem;
				font-weight:500;
				color:#000;
				height: 1.05rem;
				padding-top: 0.2rem;
			}
			p:nth-of-type(3){
				height: 0.42rem;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			p:nth-of-type(4){
				height: 0.42rem;
			}
			p:nth-of-type(5){
				width: 100%;
				height: 0.6rem;
				position: relative;
				img{
					width: 0.4rem;
					height: 0.4rem;
					position: absolute;
					top: 0;
					border-radius: 50%;
				}
				span{
					padding-top: 0.1rem;
					i{font-style: normal;color: #F6323E;}
				}
				img:nth-of-type(1){
					left: 0;
				}
				img:nth-of-type(2){
					left: 0.24rem;
				}
			}

		}
		footer{
			width:100%;
			height:0.88rem;
			background:rgba(252,231,144,1);
			border-radius:0 0 0.1rem 0.1rem;
			text-align: center;
			line-height: 0.88rem;
			position: absolute;
			left: 0;
			bottom: 0;
			font-size: 0.34rem;
		}
	}
}

/*旅游景点商品区(图片长点的布局)样式*/
.travel_region{
	padding: 0 0 0 0.25rem;
	box-sizing: border-box;
	background: #ededed;
	.divBox{
		width:100% !important;
		.travel_one{
			width:3.16rem !important;
			height:4.58rem;
			border: 1px solid #ededed;
			float:left;
			margin-bottom: 0.2rem;
			margin-right: 0.1rem;
			background: #fff;
			padding: 0.08rem 0.08rem 0;
			box-sizing: border-box;
			position: relative;
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
				padding: 0.15rem 0.05rem 0.25rem;
			}

			p:nth-of-type(2){
				position: absolute;
				left: 0;
				bottom: 0.1rem;
				width: 100%;
				padding: 0 0.05rem;
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
	}
}

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

h1{
	padding: 0 0.25rem;
	box-sizing: border-box;
	height: 0.9rem;
	p{
		border-bottom: 1px solid #ccc;
		height: 100%;
		font-size:0.26rem;
		font-family:PingFang-SC-Bold;
		font-weight:bold;
		color:rgba(51,51,51,1);
		line-height:0.9rem;
		span{
			width: 1.25rem;
			height: 100%;
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			background: url(../../assets/common/common_btn_right@3x.png) no-repeat 1.15rem 0.35rem;
			background-size: 0.1rem 0.2rem;
		}

	}
}

/*单个拼团去的样式*/
.a_groupBooking{
	width: 100%;
	/*height: 1.79rem;*/
	border-bottom: 1px solid #ccc;
	h2{
		width: 100%;
		height: 0.8rem;
		position: relative;
		img{
			width:0.4rem;
			height:0.4rem;
			border-radius:50%;
			position: absolute;
			top: 0.22rem;
		}
		img:nth-of-type(1){
			left: 0;
		}
		img:nth-of-type(2){
			left: 0.25rem;
		}
		img:nth-of-type(3){
			left: 0.5rem;
		}
		img:nth-of-type(4){
			left: 0.75rem;
		}
		img:nth-of-type(5){
			left: 1rem;
		}
		p{
			height: 100%;
			font-size:0.28rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(102,102,102,1);
			line-height: 0.8rem;
			span{
				color: #FF596E;
			}
			span:nth-of-type(2){padding-left: 0.1rem;}
		}
	}

	.a_txt{
		width: 100%;
		height: 0.9rem;
		position: relative;
		p{
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			position: absolute;
			left: 0;
		}
		p:nth-of-type(1){
			top: 0.08rem;
			width: 5.5rem;
			white-space:nowrap;text-overflow:ellipsis;overflow:hidden;
		}
		p:nth-of-type(2){
			top: 0.45rem;
		}
		button{
			width:1.11rem;
			height:0.62rem;
			background:rgba(250,220,86,1);
			border-radius:0.1rem;
			position: absolute;
			top: 0.07rem;
			right: 0;
			font-size:0.22rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
		}
	}

}

.a_groupBooking:last-child{border-bottom: none;}

/*有图的评价样式*/
.yesImg{
	border-bottom: 1px solid #ccc;
	padding-bottom: 0.4rem;
	header{
		width: 100%;
		height: 0.88rem;
		position: relative;
		img{
			position: absolute;
			left: 0;
			top: 0.25rem;
			width:0.4rem;
			height:0.4rem;
			border-radius:50%;
		}
		p{
			position: absolute;
			top: 0.28rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
		p:nth-of-type(1){
			left: 0.5rem;
		}
		p:nth-of-type(2){
			right: 0;
		}
	}

	.txt{
		width:7.02rem;
		/*height: 1.2rem;*/
		font-size:0.28rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:0.4rem;
		margin-bottom: 0.4rem;

		/*多行文本溢出显示省略号点点点...*/
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;  /*这里是在第二行有省略号*/
		overflow: hidden;
	}

	.imgs{
		width: 100%;
		/*height:1.26rem;*/
		position: relative;
		span{
			position: absolute;
			bottom: 0;
			right: 0;
			width:0.84rem;
			height:0.37rem;
			background:rgba(0,0,0,0.4);
			font-size:0.22rem;
			font-family:PingFang-SC-Light;
			color:rgba(255,255,255,1);
			text-align: center;
			line-height: 0.37rem;
			border-radius: 0.05rem 0 0 0;
		}
		img{
			width:1.68rem;
			height:1.26rem;
			margin-left: 0.08rem;
		}
		img:nth-of-type(1){margin-left: 0;}
	}
}

/*没图的评价样式*/
.noImg{
	border-bottom: 1px solid #ccc;
	header{
		width: 100%;
		height: 0.88rem;
		position: relative;
		img{
			position: absolute;
			left: 0;
			top: 0.25rem;
			width:0.4rem;
			height:0.4rem;
			border-radius:50%;
		}
		p{
			position: absolute;
			top: 0.28rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
		p:nth-of-type(1){
			left: 0.5rem;
		}
		p:nth-of-type(2){
			right: 0;
		}
	}

	.txt{
		width:7.02rem;
		font-size:0.28rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:0.4rem;
		padding-bottom: 0.4rem;
	}
}

/*单个天数信息样式*/
.day_txt{
	padding: 0 0.25rem;
	box-sizing: border-box;

	header{
		height: 0.95rem;
		p{
			font-size:0.26rem;
			font-family:PingFang-SC-Regular;
			color:rgba(26,26,26,1);
			float: left;
		}
		p:nth-of-type(1){
			width:1.41rem;
			height:0.63rem;
			background:rgba(250,220,86,1);
			font-weight:500;
			text-align: center;
			line-height: 0.63rem;
			/*padding: 0 0.3rem;*/
		}
		p:nth-of-type(2){
			font-weight:400;
			line-height: 0.63rem;
			padding-left: 0.2rem;
		}
	}

	.day_box{
		width: 100%;
		padding-bottom: 0.5rem;
		padding-left: 0.1rem;
		border-bottom: 1px solid #ededed;
		.day_itemA{
			border-left: 1px dashed #ffdd55;
			position: relative;
			h5{
				font-size:0.22rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(26,26,26,1);
				line-height:0.24rem;
				padding-left: 0.4rem;
			}

			p:nth-of-type(1){
				font-size:0.22rem;
				font-family:PingFang-SC-Light;
				font-weight:300;
				color:rgba(26,26,26,1);
				line-height:0.3rem;
				padding-left: 0.4rem;
				padding-top: 0.15rem;
			}
			p:nth-of-type(2){
				height: 0.65rem;
				background: url(../../assets/common_btn_down@2x.png) no-repeat 3.3rem 0.25rem;
				background-size: 0.17rem 0.1rem;
			}
			img{
				width: 0.25rem;
				height: 0.25rem;
				position: absolute;
				left: -0.12rem;
				top: 0;
			}
		}

		.day_itemB{
			border-left: 1px dashed #ffdd55;
			padding-bottom: 0.45rem;
			position: relative;
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(26,26,26,1);
				line-height:0.24rem;
				padding-left: 0.4rem;
				padding-bottom: 0.15rem;
				span{
					float: left;
				}
				span:nth-of-type(1){
					width: 0.66rem;
					text-align: center;
				}
				span:nth-of-type(3){
					width: 5.5rem !important;
					padding-left: 0.05rem;
					box-sizing: border-box;
					word-wrap:break-word; /*强行换行*/
				}
			}

			img{
				width: 0.25rem;
				height: 0.25rem;
				position: absolute;
				left: -0.12rem;
				top: 0;
			}

		}
		.day_itemC{
			border-left: 1px dashed #ffdd55;
			position: relative;
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(26,26,26,1);
				line-height:0.24rem;
				padding-left: 0.4rem;
			}

			img{
				width: 0.25rem;
				height: 0.25rem;
				position: absolute;
				left: -0.12rem;
				top: 0;
			}
		}
	}

}


.day_box_active{border-bottom: none !important;}
</style>
<style>
video{
	cursor: pointer;
}
</style>
