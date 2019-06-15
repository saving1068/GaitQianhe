import res from '../res.js'

let Shop={
	 UserDetails:({a})=>{
  	return res.axiosApi(res.devUrl + "cis/UserDetails",{
  		params:{
  			n:"UserDetails",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a
  			}
  		}
  	})
  },

  	//商品套餐和出行日期价格；
	GoodSetMeal({
  		spuId,
  		year,
		month
  	}) {
		return res.axiosApi(res.devUrl + 'mall/GoodSetMeal', {
			params: {
				spuId,
				year,
				month
			}
		},'get')
	},

  	//退货原因列表；
	ReferenceItemList({
  		key

  	}) {
		return res.axiosApi(res.devUrl + 'base/ReferenceItemList', {
			params: {
				key
			}
		},'get')
	},

  	//退货原因；
	RefundApplySubmit({
  		a,
  		typeId,
  		content,
  		subOrderId,
  		orderId,
  		images

  	}) {
		return res.axiosApi(res.devUrl + 'cs/RefundApplySubmit', {
			params: {
				n: 'RefundApplySubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
			  		typeId,
			  		content,
			  		subOrderId,
			  		orderId,
			  		images
				}
			}
		})
	},

  	//评论提交；
	CommentSubmit({
  		a,
  		id,
  		imageIds,
  		content,
  		starNum,
		orderId
  	}) {
		return res.axiosApi(res.devUrl + 'comment/CommentSubmit', {
			params: {
				n: 'CommentSubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
			  		id,
			  		imageIds,
			  		content,
			  		starNum,
			  		orderId
				}
			}
		})
	},

  	//邀请好友；
	PayOkSubmit({
		groupId,
  		id

  	}) {
		return res.axiosApi(res.devUrl + 'fina/PayOkSubmit', {
			params: {
				n: 'PayOkSubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					groupId,
					id
				}
			}
		})
	},

  	//购物车提交；
	CartUpdate({
  		a,
  		good
//		id,
//		skuId,
//		dateId,
//		num,
//		ids
  	}) {
		return res.axiosApi(res.devUrl + 'order/CartUpdate', {
			params: {
				n: 'CartUpdate',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					good
//					id,
//			  		skuId,
//			  		dateId,
//			  		num,
//			  		ids
				}
			}
		})
	},

  	//购物车详情；
	CartDetails({
  		a

  	}) {
		return res.axiosApi(res.devUrl + 'order/CartDetails', {
			params: {
				n: 'CartDetails',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a
				}
			}
		})
	},

  	//订单详情；
	OrderDetails({
  		orderId

  	}) {
		return res.axiosApi(res.devUrl + 'order/OrderDetails', {
			params: {
				n: 'OrderDetails',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					orderId
				}
			}
		})
	},

  	//订单更新；
	OrderUpdate({
		a,
  		orderId

  	}) {
		return res.axiosApi(res.devUrl + 'order/OrderUpdate', {
			params: {
				n: 'OrderUpdate',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					orderId
				}
			}
		})
	},

  	//支付提交；
	PaySubmit({
		payment,
  		orderId

  	}) {
		return res.axiosApi(res.devUrl + 'fina/PaySubmit', {
			params: {
				n: 'PaySubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					payment,
					orderId
				}
			}
		})
	},

  	//订单列表；
	OrderList({
  		a

  	}) {
		return res.axiosApi(res.devUrl + 'order/OrderList', {
			params: {
				n: 'OrderList',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a
				}
			}
		})
	},

  	//提交订单；
	  OrderSubmit({
	  	a,
	  	groupId,
	  	subOrderId,
		orgId,
		note,
		couponId,
		skuId,
		spuId,
		dateId,
		cartId,
		num,
		tripManType,
		tripMans,
		useGold,
		isUseAcc
	  }) {
			return res.axiosApi(res.devUrl + 'order/OrderSubmit', {
				params: {
					n: 'OrderSubmit',
					s: res.SESSION ? res.SESSION : res.getSession(),
					q:{
						a,
						groupId,
						subOrderId,
						'goodsList':[
							{
								orgId,
								note,
								couponId,
								skuId,
								spuId,
								dateId,
								cartId,
								num,
								tripManType,
								tripMans,
								useGold,
								isUseAcc
							}
						]
					}
				}
			})
		},

  	//提交订单（单个或多个商品对象）；
	  OrderSub({
	  	a,
//	  	groupId,
//	  	subOrderId,
//		orgId,
//		note,
//		couponId,
//		skuId,
//		spuId,
//		dateId,
//		cartId,
//		num,
//		tripManType,
//		tripMans,
		goodsList,
//		useGold,
//		isUseAcc

	  }) {
			return res.axiosApi(res.devUrl + 'order/OrderSubmit', {
				params: {
					n: 'OrderSubmit',
					s: res.SESSION ? res.SESSION : res.getSession(),
					q:{
						a,
						goodsList, //注意传数组下面还有多个形参的写法；
				/*不能是   goodsList:[
						* {
							orgId,
							note,
							couponId,
							skuId,
							spuId,
							dateId,
							cartId,
							num,
							tripManType,
							tripMans
						}
						],*/
//						useGold,
//						isUseAcc
					}
				}
			})
		},

  	//文章详情；
	  article({
	  	id

	  }) {
			return res.axiosApi(res.devUrl + 'cms/article', {
				params: {
					id
				}
			},'get')
		},

  	//优惠券列表；
	  CouponList({
	  	a,
	  	status,
		couponId,
		orderId
	  }) {
			return res.axiosApi(res.devUrl + 'Order/CouponList', {
				params: {
					a,
					status,
					couponId,
					orderId
				}
			},'get')
		},

  		//商店主页；
	  OrgDetails({
	  	id

	  }) {
			return res.axiosApi(res.devUrl + 'cis/OrgDetails', {
				params: {
					id

				}
			},'get')
		},

	  //商品详情；
	  GoodsDetails({
	  	spuId

	  }) {
			return res.axiosApi(res.devUrl + 'mall/GoodsDetails', {
				params: {
						spuId

				}
			},'get')
		},

	//收藏；
  Favorite({
  	a,
  	open,
  	id
  }) {
		return res.axiosApi(res.devUrl + 'cis/Favorite', {
			params: {
				n: 'Favorite',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
				  	open,
				  	id
				}
			}
		})
	},

	//优惠券列表；
  CouponList({
  	a,
  	orgId,
	status,
	couponId,
	pa,
	li
  }) {
		return res.axiosApi(res.devUrl + 'coupon/CouponList', {
			params: {
				n: 'CouponList',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					orgId,
					ta:{
						status,
						couponId,
						pa,
						li
					}
				}
			}
		})
	},

	//添加优惠券；
  CouponSubmit({
  	couponCardNum,

  }) {
		return res.axiosApi(res.devUrl + 'coupon/CouponSubmit', {
			params: {
				n: 'CouponSubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					couponCardNum

				}
			}
		})
	},

	//点赞已读；
  PraiseSwitch({
  	a,
  	open,
  	id
  }) {
		return res.axiosApi(res.devUrl + 'comment/PraiseSwitch', {
			params: {
				n: 'ParseSwitch',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
				  	open,
				  	id
				}
			}
		})
	},

	//问答列表；
  QuestionsList({
  	a,
  	type,
	id,
	pa,
	li
  }) {
		return res.axiosApi(res.devUrl + 'comment/QuestionsList', {
			params: {
				a,
				type,
				id,
				pa,
				li
			}
		},'get')
	},

  //问答列表；
  QuestionDetails({
  	a,
		id
  }) {
		return res.axiosApi(res.devUrl + 'comment/QuestionDetails', {
			params: {
				n: 'QuestionSubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					id
				}
			}
		})
	},

  //问答提问；
  QuestionSubmit({
  	a,
		id,
		content
  }) {
		return res.axiosApi(res.devUrl + 'comment/QuestionSubmit', {
			params: {
				n: 'QuestionSubmit',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					id,
					content
				}
			}
		})
	},


  //公共，广告列表；
  AdList({
  	a

  }) {
		return res.axiosApi(res.devUrl + 'ads/AdList', {
			params: {
//				n: 'AdList',
//				s: SESSION ? SESSION : getSession(),
				a
			}
		},'get')
	},

  //热门搜索；
  HotSearch({
  	a
  }) {
		return res.axiosApi(res.devUrl + 'mall/HotSearch', {
			params: {
				a
			}
		},'get')
	},

  //热门拼团目的地列表；
  DestinationList() {
		return res.axiosApi(res.devUrl + 'mall/DestinationList', {
			params: {
//				n: 'DestinationList',
//				s: SESSION ? SESSION : getSession(),
//      q:{}
			}
		},'get')
	},

	//目的地拼团商品；
GroupList({
	destination

}) {
		return res.axiosApi(res.devUrl + 'mall/GroupList', {
			params: {
					destination

			}
		},'get')
	},

	//游玩性质；
  NatureList({
  	a
  }) {
		return res.axiosApi(res.devUrl + 'mall/NatureList', {
			params: {
//				n: 'NatureList',
//				s: SESSION ? SESSION : getSession(),
        a
			}
		},'get')
	},

  //商品列表接口；
  GoodsList({
  	a,
  	orgId,
  	destination,
  	pa,
  	li,
	ob,
  	Sk,
	minPrice,
	maxPrice,
	tripDate,
	dateNum,
	natureId
  }){
		return res.axiosApi(res.devUrl + 'mall/GoodsList', {
			params: {
				a,
				orgId,
				destination,
		  		pa,
		  		li,
		  		ob,
				Sk,
				minPrice,
				maxPrice,
				tripDate,
				dateNum,
				natureId
			}
		},'get')
	},

	//评论列表；
  CommentList({
  	a,
  	id,
  	pa,
  	li,
  	imageType
  }) {
		return res.axiosApi(res.devUrl + 'comment/CommentList', {
			params: {
       			a,
       			id,
       			pa,
  				li,
  				imageType
			}
		},'get')
	},
	
	//行程信息（最新的）；
  	GetJourneyInfo({
	  	id
  	}) {
		return res.axiosApi(res.devUrl + 'cms/GetJourneyInfo', {
			params: {
       			id
			}
		},'get')
	},
	
	orderCouponList({a,dateId,orgId,num,tripManType}){
		return res.axiosApi(res.devUrl + 'coupon/orderCouponList', {
			params: {
				n: 'orderCouponList',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					a,
					dateId,
					orgId,
					num,
					tripManType
				}
			}
		})



	}

}

export default Shop;
