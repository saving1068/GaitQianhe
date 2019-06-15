import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'vant';
import 'vant/lib/vant-css/index.css';

Vue.use(Router)

const router = new Router({

	base: "/GaitQianhe-h5/",
//	mode:"history",
	linkActiveClass: 'active',
	routes: [{
			path: '/',
			name: 'FirstIn',
			component: resolve => require(['@/pages/FirstIn'], resolve),
			redirect: {
				name: 'Main'
			},
			children: [{
					path: '/',
					name: 'Main',
					meta: {
						keepAlive: false
					},
					redirect: {
						name: 'Home'
					},
					component: resolve => require(['@/pages/Main'], resolve),
					children: [

						{
							path: '/Home',
							name: 'Home',
							component: resolve => require(['@/pages/Home/Home'], resolve),
							meta: {
								keepAlive: false
							}
						},
						{
							path: '/My',
							name: 'My',
							component: resolve => require(['@/pages/My/My'], resolve),
							meta: {
								keepAlive: false
							}
						},
						{
							path: '/Location',
							name: 'Location',
							component: resolve => require(['@/pages/Location/Location'], resolve),
							meta: {
								keepAlive: false
							}
						},

						{
							path: '/UserPage',
							name: 'UserPage',
							component: resolve => require(['@/pages/UserPage/UserPage'], resolve),
							meta: {
								keepAlive: false
							}
						},

					]
				},
				{ //游记详情
					path: '/TravelDetails',
					name: 'TravelDetails',
					component: resolve => require(['@/pages/TravelDetails/TravelDetails'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //游记问题列表
					path: '/Question',
					name: 'Question',
					component: resolve => require(['@/pages/Question/Question'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //游记答案列表
					path: '/Answer',
					name: 'Answer',
					component: resolve => require(['@/pages/Answer/Answer'], resolve),
					meta: {
						keepAlive: false
					}

				},
                {
					path: '/MadePlace', //查找地点
					name: 'MadePlace',
					component: resolve => require(['@/pages/Made/MadePlace/MadePlace'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //定制
					path: '/Made',
					name: 'Made',
					component: resolve => require(['@/pages/Made/Made'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //评论
					path: '/Comment',
					name: 'Comment',
					component: resolve => require(['@/pages/Comment/Comment'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //进驻
					path: '/Enter',
					name: 'Enter',
					component: resolve => require(['@/pages/Enter/Enter'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //我的收藏
					path: '/Collect',
					name: 'Collect',
					component: resolve => require(['@/pages/Collect/Collect'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //我的优惠券
					path: '/Coupon',
					name: 'Coupon',
					component: resolve => require(['@/pages/Coupon/Coupon'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //意见反馈
					path: '/Suggest',
					name: 'Suggest',
					component: resolve => require(['@/pages/Suggest/Suggest'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //我的积分
					path: '/Points',
					name: 'Points',
					component: resolve => require(['@/pages/Points/Points'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //个人信息
					path: '/Mymessage',
					name: 'Mymessage',
					component: resolve => require(['@/pages/Mymessage/Mymessage'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //待入账收益
					path: '/MoneyDetails',
					name: 'MoneyDetails',
					component: resolve => require(['@/pages/Money/MoneyDetails'], resolve),
					meta: {
						keepAlive: false
					}

				},

				{ //提现
					path: '/Money',
					name: 'Money',
					component: resolve => require(['@/pages/Money/Money'], resolve),
					meta: {
						keepAlive: false
					}

				},
				{ //提现细则
					path: '/WithDraw',
					name: 'WithDraw',
					component: resolve => require(['@/pages/Money/WithDraw'], resolve),
					meta: {
						keepAlive: false
					}

				},

				{ //游记
					path: '/Travels',
					name: 'Travels',
					component: resolve => require(['@/pages/Travels/Travels'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //绑定手机
					path: '/BindNumber',
					name: 'BindNumber',
					component: resolve => require(['@/pages/BindNumber/BindNumber'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //首页搜索；
					path: '/HomeSearch',
					name: 'HomeSearch',
					component: resolve => require(['@/pages/HomeSearch/HomeSearch'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{
					path: '/SearchPlaceSecond', //查找地点
					name: 'SearchPlaceSecond',
					component: resolve => require(['@/pages/SearchPlaceSecond/SearchPlaceSecond'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //我的购物车页面；
					path: '/MyShoppingCar',
					name: 'MyShoppingCar',
					component: resolve => require(['@/pages/MyShoppingCar/MyShoppingCar'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //我的购物车（空的）页面；
					path: '/Empty',
					name: 'Empty',
					component: resolve => require(['@/pages/MyShoppingCar/Empty'], resolve),
					meta: {
						keepAlive: false
					}
				},

				{ //我的订单页面；

					path: '/MyIndent',
					name: 'MyIndent',
					component: resolve => require(['@/pages/MyIndent/MyIndent'], resolve),
					meta: {
						keepAlive: false
					}
				},

				{ //我的订单状态页面；
					path: '/IndentState',
					name: 'IndentState',
					component: resolve => require(['@/pages/MyIndent/IndentState'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //立即评论页面；
					path: '/OffHandComment',
					name: 'OffHandComment',
					component: resolve => require(['@/pages/MyIndent/OffHandComment'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //售后申请页面；
					path: '/AfterApplication',
					name: 'AfterApplication',
					component: resolve => require(['@/pages/MyIndent/AfterApplication'], resolve),
					meta: {
						keepAlive: false
					}
				},

				{ //商城首页页面；
					path: '/ShoppingMall',
					name: 'ShoppingMall',
					component: resolve => require(['@/pages/ShoppingMall/ShoppingMall'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城全部评价页面；
					path: '/AllComment',
					name: 'AllComment',
					component: resolve => require(['@/pages/ShoppingMall/AllComment'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{
					//景点；
					path: '/Spot',
					name: 'Spot',
					component: resolve => require(['@/pages/Spot/Spot'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //日期使用页面；
					path: '/date',
					name: 'date',
					component: resolve => require(['@/pages/ShoppingMall/date'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页商品详情页面；
					path: '/ShoppingMallDetails',
					name: 'ShoppingMallDetails',
					component: resolve => require(['@/pages/ShoppingMall/ShoppingMallDetails'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城搜索页面；
					path: '/SeekShoppingMall',
					name: 'SeekShoppingMall',
					component: resolve => require(['@/pages/ShoppingMall/SeekShoppingMall'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城搜索导航页面；
					path: '/SeekShoppingMallNav',
					name: 'SeekShoppingMallNav',
					component: resolve => require(['@/pages/ShoppingMall/SeekShoppingMallNav'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城筛选页面；
					path: '/Filtrate',
					name: 'Filtrate',
					component: resolve => require(['@/pages/ShoppingMall/Filtrate'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页问答页面；
					path: '/AskAndAnswer',
					name: 'AskAndAnswer',
					component: resolve => require(['@/pages/ShoppingMall/AskAndAnswer'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页问答详情页面；
					path: '/AskAndAnswerS',
					name: 'AskAndAnswerS',
					component: resolve => require(['@/pages/ShoppingMall/AskAndAnswerS'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页加入购物车页面；
					path: '/JoinShoppingCar',
					name: 'JoinShoppingCar',
					component: resolve => require(['@/pages/ShoppingMall/JoinShoppingCar'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页加入购物车页面(参与拼团的)；
					path: '/JoinShoppingCaring',
					name: 'JoinShoppingCaring',
					component: resolve => require(['@/pages/ShoppingMall/JoinShoppingCaring'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页选择优惠券页面；
					path: '/ChooseDiscount',
					name: 'ChooseDiscount',
					component: resolve => require(['@/pages/ShoppingMall/ChooseDiscount'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页选择优惠券2页面(发起拼团和直接加入购物车和直接购买部分的)；
					path: '/ChooseDiscount2',
					name: 'ChooseDiscount2',
					component: resolve => require(['@/pages/ShoppingMall/ChooseDiscount2'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //免单待完善资料页面的确认订单页面
					path: '/AffirmIndenting',
					name: 'AffirmIndenting',
					component: resolve => require(['@/pages/ShoppingMall/AffirmIndenting'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //确认多个订单页面(多个商品对象);
					path: '/AffirmIndents',
					name: 'AffirmIndents',
					component: resolve => require(['@/pages/ShoppingMall/AffirmIndents'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页确认订单页面；
					path: '/AffirmIndent',
					name: 'AffirmIndent',
					component: resolve => require(['@/pages/ShoppingMall/AffirmIndent'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页确认订单页面(发起拼团)；
					path: '/AffirmIndent2',
					name: 'AffirmIndent2',
					component: resolve => require(['@/pages/ShoppingMall/AffirmIndent2'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城首页确认多个订单页面；
					path: '/MoreAffirmIndent',
					name: 'MoreAffirmIndent',
					component: resolve => require(['@/pages/ShoppingMall/MoreAffirmIndent'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城支付成功要求好友拼团页面；
					path: '/FriendGroupTeam',
					name: 'FriendGroupTeam',
					component: resolve => require(['@/pages/ShoppingMall/FriendGroupTeam'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城商品不存在页面；
					path: '/NoCommodity',
					name: 'NoCommodity',
					component: resolve => require(['@/pages/ShoppingMall/NoCommodity'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //商城商品不存在页面；
					path: '/MerchantIndex',
					name: 'MerchantIndex',
					component: resolve => require(['@/pages/ShoppingMall/MerchantIndex'], resolve),
					meta: {
						keepAlive: false
					}
				},

				{ //查找音乐
					path: '/SeachMiuse',
					name: 'SeachMiuse',
					component: resolve => require(['@/pages/SeachMiuse/SeachMiuse'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{
					path: '/SeachPlace', //查找地点
					name: 'SeachPlace',
					component: resolve => require(['@/pages/SeachPlace/SeachPlace'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //游记小标题
					path: '/TravelsTitle',
					name: 'TravelsTitle',
					component: resolve => require(['@/pages/Travels/Title/Title'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //游记文章
					path: '/TravelsArticle',
					name: 'TravelsArticle',
					component: resolve => require(['@/pages/Travels/Article/Article'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{
					path: '/Place', //查找地点
					name: 'Place',
					component: resolve => require(['@/pages/Travels/Place/Place'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //搜索目的地SeachShop.vue
					path: '/AppenPlace',
					name: 'AppenPlace',
					component: resolve => require(['@/pages/AppenPlace/AppenPlace'], resolve),
					meta: {
						keepAlive: false
					}
				},

				{ //搜索商品Draft

					path: '/SeachShop',
					name: 'SeachShop',
					component: resolve => require(['@/pages/SeachShop/SeachShop'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //草稿
					path: '/Draft',
					name: 'Draft',
					component: resolve => require(['@/pages/Draft/Draft'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //行程
					path: '/Trip',
					name: 'Trip',
					component: resolve => require(['@/pages/Trip/Trip'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //精选图库Strategy
					path: '/Gallery',
					name: 'Gallery',
					component: resolve => require(['@/pages/Gallery/Gallery'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //攻略列表
					path: '/Strategy',
					name: 'Strategy',
					component: resolve => require(['@/pages/Strategy/Strategy'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //攻略详情
					path: '/StrategyDetail',
					name: 'StrategyDetail',
					component: resolve => require(['@/pages/StrategyDetail/StrategyDetail'], resolve),
					meta: {
						keepAlive: false
					}
				},
				//		{//游记列表
				//			path: '/TravelsList',
				//			name: 'TravelsList',
				//			component: resolve => require(['@/pages/TravelsList/TravelsList'], resolve),
				//			meta: {
				//				keepAlive: true
				//			}
				//		},
				{ //景点导航
					path: '/Navigation',
					name: 'Navigation',
					component: resolve => require(['@/pages/Navigation/Navigation'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //其他主页的活动
					path: '/Activity',
					name: 'Activity',
					component: resolve => require(['@/pages/Activity/Activity'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //其他主页的活动
					path: '/OtherPage',
					name: 'OtherPage',
					component: resolve => require(['@/pages/OtherPage/OtherPage'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //小活动
					path: '/Game',
					name: 'Game',
					component: resolve => require(['@/pages/Game/Game'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //小活动规则
					path: '/GameRules',
					name: 'GameRules',
					component: resolve => require(['@/pages/GameRules/GameRules'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{ //小活动
					path: '/Talk',
					name: 'Talk',
					component: resolve => require(['@/pages/Talk/Talk'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{//发表游记
					path: '/SendTravels',
					name: 'SendTravels',
					component: resolve => require(['@/pages/SendTravels/SendTravels'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{//邀请好友注册
					path: '/Invit',
					name: 'Invit',
					component: resolve => require(['@/pages/Invit/Invit'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{//空白页面
					path: '/EmptyPage',
					name: 'EmptyPage',
					component: resolve => require(['@/pages/EmptyPage/EmptyPage'], resolve),
					meta: {
						keepAlive: false
					}
				},
				{
					path: '*',
					name: '404',
					meta: {
						title: '404 功能建设中',
					},
					component: resolve => require(['@/pages/building'], resolve),
				},
		]
	}]

})

router.beforeEach((to, from, next) => {
  window.scrollTo(0,0)

  // 	if(from.query.shareId){
	// 	to.query.shareId=from.query.shareId
	// }

	var url = location.search; //获取url中"?"符后的字串

	var theRequest = new Object();
	//要微信支付的页面都要在这里加上判断条件；
	if(to.name=="AffirmIndent2"||to.name=="AffirmIndents"||to.name=="AffirmIndent"||to.name=="IndentState"){

		let paths = window.location.href.split('#')
		if(paths[0].indexOf("?")==-1){
			let query= ""
				// console.log(to.query)
			 for(let i in to.query){
				 // console.log(to.query[i])
				 query+=i+"="+to.query[i]+"&"
			 }

			let newUrl= window.location.protocol + "//" + window.location.host+window.location.pathname + "?#"+to.name+"?"+query

		if(to.name=="IndentState"){
			window.location.href=newUrl
		}else{

			window.location.replace(newUrl)
		}


		}else{
				next()
		}
	}else{
		if(url){

				let hash=""

					if(url.indexOf("from=timeline")!=-1||url.indexOf("from=groupmessage")!=-1||url.indexOf("from=singlemessage")!=-1){
		       hash=location.hash.split("?")[1];

					}

		  		if(url.indexOf("?") != -1) {
		  		var str = url.substr(1);
		  		var strs = str.split("&");
		  		for(var i = 0; i < strs.length; i++) {
		  			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		  		}
		  	}
		  	let openId = theRequest.code; //授权后的code

		  	if(!openId) {

		  		next()
		  	} else {

		  		var newUrl = window.location.protocol + "//" + window.location.host+window.location.pathname + "#/" + to.name + url+"&"+hash

		  		window.location.replace(newUrl)
		  	}
	  	}else{
	  		next()
	  	}
	}
})

router.onError(error=>{ //路由跳转失败
	console.log(error)
	 const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  console.log(router.history.pending.fullPath,".history,fullPath")
//const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
//  router.replace(targetPath);
    Toast({
					message: "请检查您的网络是否畅通",
					forbidClick: true,
					position: 'bottom',
					duration: 5000
				});

  }


})

export default router;
