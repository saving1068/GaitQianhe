import Api from '../Api/api'

const Shop={
	state:{  //定义全局变量；
		shops:[], //购物车多个订单的出行人信息；
		tripMans:[], //出行人信息；
		tripMansing:[], //拼团部分的出行人（有公告功能的那部分）；
		minPrice:null,
		maxPrice:null,
		tripDate:null,
	},
	mutations:{ //改变全局变量；
		changeShops(state,shops){
			state.shops=[...shops]
			console.log(state.shops,'state.shops')
		},
		changeTripMans(state,tripMans){
			state.tripMans = [...tripMans];
			console.log(state.tripMans,'state.tripMans')
		},
		changeTripMansing(state,tripMansing){
			console.log(tripMansing)
			state.tripMansing = [...tripMansing];
			console.log(state.tripMansing,'state.tripMansing')
		},
		changeMinPrice(state,minPrice){
			state.minPrice = minPrice;
			console.log(state.minPrice,'state.minPrice')
		},
		changeMaxPrice(state,maxPrice){
			state.maxPrice = maxPrice;
			console.log(state.maxPrice,'state.maxPrice')
		},
		changeTripDate(state,tripDate){
			state.tripDate = tripDate;
			console.log(state.tripDate,'state.tripDate')
		},
	},
	actions:{ //这是异步的才用actions；
		initShops({
			commit
		},ids) {
    		Api.Shop.CartDetails({a:1}).then(res=>{
				let cids = [...JSON.parse(ids)]
				let carts = []
			  if(res.q.s==0) {
					res.q.shops.forEach(val=> {
						val.cartInfos.forEach(item=>{
							 cids.forEach(it=> {
								 if(item.id == it.id) {
									 carts.push({
//										 catusecoupons: [],
//										 nocatusecoupons:[],
										 couponId: 0,
										 dateId: item.dateId,
										 id: item.id,
										 num: it.num,
										 orgId: val.orgId,
										 skuId:item.skuId,
										 spuId:item.spuId,
										 tripManType:item.tripMan
									 })
								 }
							 })
						})
					})
					commit('changeShops', carts)
				}
			})
		},
	}


}

export default Shop;
