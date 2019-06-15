<!-- 我的购物车页面 -->
<template>
	<div class="MyShoppingCar">

		<!-- 单个购物车内容 -->
		<section class="shoppingCar_item" v-for="(item,index) in shops" v-if="shops.length != 0">

			<header class="cf">
				<h2 class="fl" v-text="item.orgName" @click="goMerchantIndex(index)">商家名...</h2>
				<van-icon name="arrow" class="fl icon_arrow" @click="goMerchantIndex(index)"/>

				<h3 v-show="isInvalid[index] != 1" @click="editing(index)" ref="editingID">编辑</h3>
				<button v-show="isInvalid[index] == 1" @click="emptyBaby(index)">清空失效宝贝</button>
			</header>

			<footer v-for="(it,i) in item.cartInfos">
				<div class="fooLeft" :class="[ it.editing?'left1':'' , !it.editing?'left2':'' ]">
					<b v-show="it.isInvalid == 1">失效</b>

					<van-icon :name="it.icon" :color="it.color" class="icon_checked" v-show="it.isInvalid != 1"  @click="choose(index,i,item.orgId)"/>
					<img :src="it.imagePath" @click="goShoppingMallDetails(index,i)"/>
					<p v-text="it.name">成都七天六夜豪华之旅，全景游赏印花泡温...</p>
					<p>套餐类型：{{ it.setMeal }}</p>
					<p>出行日期：{{ it.placeDate }}</p>
					<p>出行人：{{ it.tripMan == 1 ? '成人' : '儿童' }}</p>
					<p>¥<span v-text="it.price">1999</span></p>

					<button @click="handleReduce(index,i)" :disabled="it.goodsCount === 1">-</button>
					<button>{{ it.goodsCount }}</button>
					<button @click="handleAdd(index,i)">+</button>

					<div class="editing" @click="editingOne(index,i)" v-show="it.isInvalid == 0"></div>
				</div>

				<div class="fooRight" :class="[ it.editing?'right1':'' , !it.editing?'right2':'' ]" @click="delOne(index,i)">删除</div>
			</footer>

		</section>

		<!-- 弹窗 -->
		<div class="popup" v-show="isPopup">
			<div>
				{{ popTxt[p] }}
				<button @click="affirm">确认</button>
			</div>
		</div>

		<!--空的-->
		<div class="empty" v-if="shops.length == 0">
			<img src="../../assets/my_icon_cart@2x.png"/>
			<p>购物车空空如也</p>
		</div>


		<!-- 用于顶置底部 -->
		<footer class="overhead_bottom"></footer>
		<!-- 底部 -->
		<footer class="footer">
			<van-icon :name="check" :color="col" class="icon_checked" @click="allChoose"/>
			<h1 class="fl">全选</h1>
			<h2>合计：<span>¥{{ totalPrice }}</span></h2>
			<h3 class="fr" @click="goShopping">去下单({{ n }})</h3>
		</footer>

	</div>
</template>

<script>

export default {
	data() {
		return {
			popTxt:['合并支付不能超过5张订单','没商品不能下单'],
			p:0,
			isPopup:false,
			shops:[],
			cartInfos:[],
			//placeDate:[],
			n:0,
			check:'check', //默认不打钩；
			col:'rgba(102,102,102,1)', //默认不打钩样式；
			orgId:[],
			isInvalid:[],
			ids:[],
			spuId:[],
			bigList:[],
			totalShop:0,
			
		}
	},
	created() {
	  	window.sessionStorage.setItem('checkedGroup',JSON.stringify({}))
		window.sessionStorage.setItem('ids',JSON.stringify([]))
		this.CartDetails(); //购物车详情；

	},
	mounted() {

	},
	methods: {
		goShoppingMallDetails(index,i){
			//判断是否是下架的商品；
			if (this.shops[index].cartInfos[i].isUp == 0) { //是下架的跳去商品不存在页面；
				this.$router.push({
					name: "NoCommodity",
					query: {
						orgId:this.shops[index].orgId
					}
				})
			} else{ //是上架的跳去商品详情页面；
				this.$router.push({
					name: "ShoppingMallDetails",
					query: {
						spuId:this.shops[index].cartInfos[i].spuId
					}
				})
			}
		},
		//清空失效商品(点击清空按钮，是一次性清空该店铺的全部失效商品)；
		emptyBaby(index){
			let good = {};  //商品对象数组;
			//console.log(this.shops[index].cartInfos.length)
			//先清空；
			this.ids = [];
			for(let i=0;i<this.shops[index].cartInfos.length;i++){
				this.ids.push(this.shops[index].cartInfos[i].id);
				let str = this.ids.join(",");
				good.ids = str;//当a=4是传入,String;
				//console.log(str)
			}
			//console.log(good.ids)
			let carUpObj = {
				'a':4,
				'good':good
			};

			this.$Api.Shop.CartUpdate(carUpObj).then( res => {
				console.log(res)

				if(res.q.s == 0){
					console.log('清空成功')

					this.CartDetails(); //每删除一次就再调多次购物车详情；
				}
			})
		},
		//删除点击的那个商品；
		delOne(index,i){
			console.log(i)
			this.CartUpdate(3,index,i);
		},
		//点击每一个商品的编辑(跳转到加入购物车（确认类型）页面)；
		editingOne(index,i){
			console.log(index,i)
			//this.shops[index].cartInfos[i].flag = true;

			this.$router.push({
				name: "JoinShoppingCar",
				query: {
					btnTxt:4,
					spuId:this.shops[index].cartInfos[i].spuId,
					skuId:this.shops[index].cartInfos[i].skuId,
					shopId:this.shops[index].cartInfos[i].id
				}
			})
		},
		//点击编辑；
		editing(index){
			//判断状态是否是编辑还是完成；
			if(this.$refs.editingID[index].innerHTML == '完成'){
				console.log('是完成')

				for(let j=0;j<this.shops[index].cartInfos.length;j++){
					//用于控制编辑删除的(向右移动)；
					this.shops[index].cartInfos[j].editing = false;
				}
				this.$refs.editingID[index].innerHTML = '编辑';
			}else if(this.$refs.editingID[index].innerHTML == '编辑'){
				console.log('是编辑')

				for(let j=0;j<this.shops[index].cartInfos.length;j++){
					//用于控制编辑删除的(向左移动)；
					this.shops[index].cartInfos[j].editing = true;
					//console.log(this.shops[index].cartInfos[j])
				}
				this.$refs.editingID[index].innerHTML = '完成';
			}
		},
		//购物车详情；
		CartDetails(){
			//a=1是默认值；
			let carObj = {
				a:1
			};

			//要先清空；
			this.orgId = [];
			this.cartInfos = [];
			//this.placeDate = [];
			this.isInvalid = [];

			//购物车详情；
			this.$Api.Shop.CartDetails(carObj).then( res => {
				console.log(res)

				//判断购物车是否有物品；
				//if(res.q.shops.length == 0){ //没有物品,就显示空的购物车；
					//console.log('没物品')

				//}else{ //有；
					//console.log('有物品')

					for(let i=0;i<res.q.shops.length;i++){
						for(let j=0;j<res.q.shops[i].cartInfos.length;j++){
							//这个是控制打钩图标的；
							res.q.shops[i].cartInfos[j].flag=false;
							res.q.shops[i].cartInfos[j].icon="check"; //先没打钩；
							res.q.shops[i].cartInfos[j].color='rgba(102,102,102,1)'; //灰色的；

							//用于控制编辑删除的；
							res.q.shops[i].cartInfos[j].editing = false;
						}
					}

					this.shops = [...res.q.shops];

					this.shops.forEach( item => {
						this.orgId.push(item.orgId);
						this.cartInfos.push(item.cartInfos);

						for (let i=0;i<item.cartInfos.length;i++) {
							let now_date = new Date(); //当天的时间对象(date2)；
							let sta_date = new Date(item.cartInfos[i].placeDate),  //要对比的时间(date1,如果是过去的)；
								n = sta_date.getFullYear(),
								y = sta_date.getMonth()+1,
								r = sta_date.getDate(),
								date = n + '-' + y + '-' + r;
							//console.log(date)
							
							item.cartInfos[i].placeDate = date;
							//this.placeDate.push(date);
//							let num=24*60*60*1000 ; //一天的毫秒数;
//							let cha=now_date.getTime()-sta_date.getTime(); //两个时间的毫秒差;
//							console.log('cha',cha,'num',num)
							//判断是今天的过去时间还是未来时间；
							if ( sta_date.getTime() < now_date.getTime() ) {
								item.cartInfos[i].isInvalid = 1;
								console.log('是今天里的过去时间')
							} else{
								console.log('是未来时间')
							}
//							if(cha>0){
//								if(cha>num){
//									//item.cartInfos[i].isInvalid = 1;
//									//console.log("不是今天的过去时间")
//									//alert("不是今天的过去时间")
//								}else if(sta_date.getDate() != now_date.getDate()){
//									console.log("不是今天的过去时间")
//									//alert("不是今天的过去时间")
//								}else {
//									item.cartInfos[i].isInvalid = 1;
//									console.log('是今天里的过去时间')
//									//alert("是今天里的过去时间")
//								}	
//							}else if(cha<0){
//								//alert("是未来时间")
//							}else{
//								//alert("是现在")
//							}	
							
							this.isInvalid.push(item.cartInfos[i].isInvalid);
						}

						//console.log(this.placeDate)
					})
				//}

				//console.log(this.cartInfos)
			})
		},
		//跳转确认订单页面；
		goAffirmIndent3(){
			this.$store.commit("changeShops",this.bigList)
			console.log(this.bigList)
			let arr=[]
			this.bigList.forEach(item=>{

				arr.push({id:item.id,num:item.num})
			})

			window.sessionStorage.setItem("ids",JSON.stringify(arr))

			this.$router.push({
				name: "AffirmIndents",
				query: {

					//spuId:this.spuId,
//					bigList:JSON.stringify(this.bigList),  //商品对象（当个或者多个）；
					//btnTxt:5
				}
			})

		},
		//去下单；
		goShopping(){

			//判断下单的时候不能打钩选择超过5个；
			if (this.n >= 5) {
				this.isPopup = !this.isPopup;
				this.p = 0;
				console.log('超过了5个')
			}else if (this.n == 0) { //至少要有选择一个商品;
				this.isPopup = !this.isPopup;
				this.p = 1;
				console.log('没有商品')
			}else{  //没超过也至少有选择一个商品，就可以跳转到确认订单页面；
				this.goAffirmIndent3();

				console.log('没超过')
			}

		},
		//购物车提交；
		//a是1添加/编辑商品 3删除商品 ,4.清空失效商品；
		CartUpdate(a,index,i){
			let good = {};  //商品对象数组;
			//删除，只传购物车id；
			//注意：this.cartInfos[index][i] 是 二维数组；
			good.id = this.cartInfos[index][i].id;  //购物车id,Number;
			//good.skuId = this.cartInfos[i].skuId;  //商品id,Number;
			//good.dateId =  //日期价格id,Number;
			//good.num = this.cartInfos[i].goodsCount; //商品数量,Number;

			//console.log(this.cartInfos[index][i].id)
			let carUpObj = {
				'a':a,
				'good':good
			};

			this.$Api.Shop.CartUpdate(carUpObj).then( res => {
				console.log(res)

				if(res.q.s == 0){
					console.log('删除成功')

					this.$refs.editingID[index].innerHTML = '编辑';
					this.CartDetails(); //每删除一次就再调多次购物车详情；
				}

			})
		},
		//跳转商家页面；
		goMerchantIndex(index){

			this.$router.push({
				name: "MerchantIndex",
				query: {
					'orderId':this.orgId[index]  //店铺id；
				}
			})

		},
		removeAaary(_arr, _obj){
		    let length = _arr.length;
		    for (let i = 0; i < length; i++) {
		    	//判断怎么选择需要删除的商品的对象（指定单个商品）；
		        if (_arr[i] == _obj) {
		            if (i == 0) {
		                _arr.shift(); //删除并返回数组的第一个元素
		                return _arr;
		            }
		            else if (i == length - 1) {
		                _arr.pop();  //删除并返回数组的最后一个元素
		                return _arr;
		            }
		            else {
		            	console.log('arri',i)
		                _arr.splice(i, 1); //删除下标为i的元素
		                return _arr;
		            }
		        }
		    }
		    console.log( '商品对象',_arr ,'删除的arr');
		},
		choose(index,i,orgId){ //选择购物车；
			//console.log(index,i,'index,i')

			//商品总数量;
			this.totalShop = 0; //每次循环前要先还原初始值；
			for (let i=0;i<this.shops.length;i++) {
				this.totalShop += this.shops[i].cartInfos.length;
				//console.log(this.totalShop,' 商品总数量')
			}

			//判断是先选择店铺，再来选择商品；
			this.shops[index].cartInfos[i].flag = !this.shops[index].cartInfos[i].flag;
			if (!this.shops[index].cartInfos[i].flag) { //取消打钩；
				this.shops[index].cartInfos[i].icon = 'check';
				this.shops[index].cartInfos[i].color = 'rgba(102,102,102,1)';
				this.n--; //取消打钩下单值；
				console.log(this.n,'取消打钩的this.n')

				//判断n值小于 商品总数量(总n值)时，全选要取消；
				if (this.n < this.totalShop) {
					this.check = 'check';
					this.col = 'rgba(102,102,102,1)';
					//console.log('小于要取消全选')
				}

//	            console.log(this.bigList[i],'单个')
				//console.log(this.shops[index].cartInfos[i],'shops')
				let cartobj = {...this.shops[index].cartInfos[i]}
				let obj = {
					orgId:orgId,
					spuId:cartobj.spuId,
					skuId:cartobj.skuId,
					tripManType:cartobj.tripMan,
					dateId:cartobj.dateId,
					num:cartobj.goodsCount,
					id:cartobj.id,
//					catusecoupons:[],
//					nocatusecoupons:[]
				}
				//console.log(obj,'obj')

	            this.removeAaary(this.spuId,this.shops[index].cartInfos[i].spuId); //删除选择商品的spuId;
//	            this.removeAaary(this.bigList,this.bigList[index]); //删除选择商品；

				for(let k=0;k<this.bigList.length;k++){
					//判断通过点击的那个id来查找重复的就取消它；
					if(this.bigList[k].id == cartobj.id){
						this.bigList.splice(k,1)
						//console.log('相同的',this.bigList)
					}
				}
				//console.log('代码能执行到这来',this.bigList)

			} else{
				this.shops[index].cartInfos[i].icon = 'checked'; //打钩；
				this.shops[index].cartInfos[i].color = 'rgba(246,50,62,1)'; //红色；
				this.n++; //打钩下单值；
				console.log(this.n,'打钩的this.n')

				//判断n值等于 商品总数量(总n值)时，全选要钩上；
				if (this.n == this.totalShop) {
					this.check = 'checked';
					this.col = 'rgba(246,50,62,1)';
					//console.log('=全选，要钩上')
				}

				this.spuId.push(this.shops[index].cartInfos[i].spuId);  //选择商品的spuId;
				//this.spuId = this.shops[index].cartInfos[i].spuId;
				//console.log(this.spuId,'spuId')

				let obj = {
						orgId:this.shops[index].orgId,
						spuId:this.shops[index].cartInfos[i].spuId,
						skuId:this.shops[index].cartInfos[i].skuId,
						tripManType:this.shops[index].cartInfos[i].tripMan,
						dateId:this.shops[index].cartInfos[i].dateId,
						num:this.shops[index].cartInfos[i].goodsCount,
						id:this.shops[index].cartInfos[i].id,
//						catusecoupons:[],
//						nocatusecoupons:[]
					};
				this.bigList.push(obj);
//				this.bigList.push(this.shops[index]) //选择商品的对象（单个商品或者多个商品）；
				console.log('商品对象',this.bigList)
			}
		},
		//点击全选；
		allChoose(){
			//先判断是否打钩；
			if (this.check == 'check') { //全部打钩；
				this.check = 'checked';
				this.col = 'rgba(246,50,62,1)';

				this.n = 0;//打钩前也要先清空下单值为0；
				console.log(this.n,'打钩下单n值')
				this.bigList = []; //先清空；
				for(let i=0;i<this.shops.length;i++){
					for(let j=0;j<this.shops[i].cartInfos.length;j++){
						//判断是否是失效或者下架的商品；
						if (this.shops[i].cartInfos[j].isInvalid == 1 || this.shops[i].cartInfos[j].isUp == 0) { //是；
							return
						} else{ //不是，就可以打钩计算金额；
							//这个是控制打钩图标的；
							this.shops[i].cartInfos[j].flag=true;
							this.shops[i].cartInfos[j].icon="checked";
							this.shops[i].cartInfos[j].color='rgba(246,50,62,1)';
	
							this.n++;
							console.log(this.n,'下单n值')
	
							this.spuId.push(this.shops[i].cartInfos[j].spuId);
	
							let obj = {
								orgId:this.shops[i].orgId,
								spuId:this.shops[i].cartInfos[j].spuId,
								skuId:this.shops[i].cartInfos[j].skuId,
								tripManType:this.shops[i].cartInfos[j].tripMan,
								dateId:this.shops[i].cartInfos[j].dateId,
								num:this.shops[i].cartInfos[j].goodsCount,
								id:this.shops[i].cartInfos[j].id,
	//							catusecoupons:[],
	//							nocatusecoupons:[]
							};
							this.bigList.push(obj);
						}
					}
//					this.bigList.push(this.shops[i])//选择商品的对象（多个商品）；
				}

//				let set = new Set(this.bigList);
//				let arr = Array.from(set);
				//要数组去重；
				let arr = [...new Set(this.bigList)];
				//console.log('arr',arr)
				this.bigList = arr;
				console.log('商品对象',this.bigList)
			} else{ //全部不打钩；
				this.check = 'check';
				this.col = 'rgba(102,102,102,1)';

				this.n = 0;//全部不打钩也要还原下单值为0；
				console.log(this.n,'取消下单n值')
				for(let i=0;i<this.shops.length;i++){
					for(let j=0;j<this.shops[i].cartInfos.length;j++){
						//判断是否是失效或者下架的商品；
						if (this.shops[i].cartInfos[j].isInvalid == 1 || this.shops[i].cartInfos[j].isUp == 0) { //是；
							return
						} else{ //不是，就可以打钩计算金额；
							//这个是控制打钩图标的；
							this.shops[i].cartInfos[j].flag=false;
							this.shops[i].cartInfos[j].icon="check";
							this.shops[i].cartInfos[j].color='rgba(102,102,102,1)';
						}
					}
					this.spuId = [];
					this.bigList = [];  //清空全部商品；
				}
				//console.log('商品对象',this.bigList)
			}
		},
		affirm(){  //确认取消弹窗；
			this.isPopup = !this.isPopup;
		},

		handleReduce(index,i){ //减少；
  			//console.log(index,i)

  			//先判断是否禁用按钮；
	  		if(this.shops[index].cartInfos[i].goodsCount === 1) return;
	  		this.shops[index].cartInfos[i].goodsCount--;

	  		let id = this.shops[index].cartInfos[i].id;
	  		this.bigList.forEach( (item,it) => {
	  			//先判断是否打钩；
		  		if (id == item.id) {
		  			this.bigList[it].num--;
		  		}
	  		})
	  	},
	  	handleAdd(index,i){ //增加；
	  		this.shops[index].cartInfos[i].goodsCount++;

	  		let id = this.shops[index].cartInfos[i].id;
	  		this.bigList.forEach( (item,it) => {
	  			//先判断是否打钩；
		  		if (id == item.id) {
		  			this.bigList[it].num++;
		  		}
	  		})
	  	},

	},
	//计算属性；
	computed:{
	  	totalPrice(){
	  		let total = 0,totalRound = null;
	  		for (let i=0;i<this.shops.length;i++) {
	  			let item = this.shops[i].cartInfos;

	  			for (let i=0;i<item.length;i++) {
	  				//console.log(item)

	  				//要先判断是否打钩选中该商品；
					if(item[i].flag == true){ //是；
						//console.log(item[i])
						total += item[i].price * item[i].goodsCount;
						//内存在做乘法时候会出错?price的类型是float(2byte),而amount的类型是double(4byte),程序里的转换顺序为float-long-double;
					}
	  				//console.log(item[i].price,item[i].goodsCount)
	  			}

	  		}
	  		totalRound = Math.round(total*100)/100;
	  		//console.log(totalRound)
	  		return totalRound.toString().replace(/\B(?=(\d{3})+$)/g,',');
	  	},
	},
}

</script>

<style scoped lang="less">
h1{margin: 0 0 !important;}
/*我的购物车（空的）样式*/
.empty{
	width: 100%;
	height: 100%;
	background: #fff;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 200;
	img{
		width:2.8rem;
		height:2.8rem;
		position: absolute;
		top: 3.7rem;
		left: 2.35rem;
	}
	p{
		font-size:0.3rem;
		font-family:PingFang-SC-Medium;
		color:rgba(153,153,153,1);
		line-height:0.24rem;
		position: absolute;
		top: 6.8rem;
		left: 2.7rem;
	}

}
</style>
<style scoped lang="less">
/*向左移*/
.left1{left: -1.2rem !important;}
.right1{right: 0rem !important;display: block !important;}

/*向右移*/
.left2{left: 0rem !important;}
.right2{right: -1.2rem !important;display: none !important;}

.fooLeft{
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: 0.3s;
}

.fooRight{
	width: 1.2rem;
	height: 2.35rem;
	position: absolute;
	top: 0.4rem;
	right: -1.2rem;
	background: #f6323e;
	color: #fff;
	text-align: center;
	line-height: 2.35rem;
	transition: 0.3s;
	display: none;
}

/*该整个页面样式*/
.MyShoppingCar{
	background:rgba(237,237,237,1);
}

/*弹窗*/
.popup{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0rem;
	left: 0rem;
	z-index: 500;
	background:rgba(0,0,0,0.7);
	div{
		width: 5.7rem;
		height: 3rem;
		background: #fff;
		position: fixed;
		top: 5rem;
		left: 0.9rem;
		border-radius:0.1rem;
		text-align: center;
		padding-top: 1rem;
		box-sizing: border-box;
		button{
			outline: none;
			border: none;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0.85rem;
			border-radius: 0 0 0.1rem 0.1rem;
			background: #fce790;
		}
	}

}

/*单个购物车内容样式*/
.shoppingCar_item{
	/*height: 4.1rem;*/
	border-bottom: 0.15rem solid rgba(237,237,237,1);
	header{
		width: 100%;
		height: 0.9rem;
		border-bottom: 1px solid #ededed;
		box-sizing: border-box;
		background: #fff;
		line-height: 0.9rem;
		text-align: center;
		position: relative;
		h2{
			/*width: 1.6rem;
			height: 100%;*/
			box-sizing: border-box;
			padding: 0rem 0.13rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
		}
		.icon_arrow{
			background:rgba(255,255,255,1);
			margin-top: 0.3rem;
		}
		h3{
			width: 1.22rem;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			color:rgba(153,153,153,1);
		}
		h4{
			width: 1rem;
			height: 100%;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			color:rgba(246,50,62,1);
		}

		/*单个失效购物车内容样式*/
		button{
			height:0.5rem;
			border: 1px solid rgba(102,102,102,1);
			border-radius:0.05rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Medium;
			color:rgba(102,102,102,1);
			line-height:0.4rem;
			background: #fff;
			text-align: center;
			outline: none;
			position: absolute;
			top: 0.24rem;
			right: 0.2rem;
		}
	}
	footer{
		width: 100%;
		height: 3.05rem;
		background: #fff;
		position: relative;
		.icon_checked,b{
			width:0.36rem;
			height:0.36rem;
			color: #f73139;
			font-size: 0.36rem;
			border-radius: 60%;
			text-align: center;
			line-height: 0.36rem;
			position: absolute;
			top: 1.3rem;
			left: 0.24rem;
		}
		b{
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			color:rgba(255,255,255,1);
			line-height:0.3rem;
			width:0.6rem;
			height:0.3rem;
			background:rgba(153,153,153,1);
			border-radius:0.1rem;
			font-weight: normal;
		}
		img{
			width:2rem;
			height:2rem;
			border: 1px solid #cec4c6;
			position: absolute;
			top: 0.47rem;
			left: 1rem;
		}
		p{
			position: absolute;
			font-size:0.22rem;
			font-family:PingFang-SC-Medium;
			color:rgba(153,153,153,1);
			line-height:0.36rem;
		}
		p:nth-of-type(1){
			width:4.09rem;
			height:0.5rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
			line-height:0.36rem;
			top: 0.4rem;
			right: 0.25rem;
			white-space: nowrap;text-overflow:ellipsis;overflow:hidden;
		}
		p:nth-of-type(2){
			top: 0.95rem;
			left: 3.25rem;
			width: 3.6rem;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow:hidden;
		}
		p:nth-of-type(3){
			top: 1.3rem;
			left: 3.25rem;
		}
		p:nth-of-type(4){
			top: 1.65rem;
			left: 3.25rem;
		}
		p:nth-of-type(5){
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color:rgba(246,50,62,1);
			line-height:0.24rem;
			top: 2.3rem;
			left: 3.15rem;
			span{font-weight: 600;font-size:0.3rem;}
		}
		button{
			width:0.6rem;
			height:0.6rem;
			background:rgba(246,246,246,1);
			position: absolute;
			bottom: 0.3rem;
			border: none;
			outline: none;
		}
		button:nth-of-type(1){
			right: 1.45rem;
		}
		button:nth-of-type(2){
			right: 0.85rem;
			background: #fff;
			border-top: 2px solid rgba(246,246,246,1);
			border-bottom: 2px solid rgba(246,246,246,1);
			box-sizing: border-box;
		}
		button:nth-of-type(3){
			right: 0.25rem;

		}
	}

}

.editing{
	width: 4.05rem;
	height: 1.1rem;
	border: 1px dashed #cbcbcb;
	position: absolute;
	top: 0.9rem;
	left: 3.15rem;
	background: url(../../assets/bianji.png) no-repeat 3.7rem 0.1rem;
	background-size: 0.18rem 0.2rem;
}

/*底部样式*/
.overhead_bottom{width: 100%;height: 0.99rem;background: #fff;}
.footer{
	width: 100%;
	height: 0.99rem;
	border-top: 1px solid #ededed;
	background: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	.icon_checked{
		width:0.36rem;
		height:0.36rem;
		font-size: 0.36rem;
		color: rgba(246,50,62,1);
		position: absolute;
		left: 0.24rem;
		top: 0.32rem;
	}
	h1{
		width: 1.5rem;
		height: 100%;
		font-size:0.26rem;
		font-family:PingFangSC-Regular;
		color:rgba(51,51,51,1);
		line-height:0.99rem;
		text-indent: 0.8rem;
	}
	h2{
		position: absolute;
		top: 0.3rem;
		right: 2.5rem;
		font-size:0.26rem;
		font-family:PingFangSC-Regular;
		color:rgba(51,51,51,1);
		line-height:0.36rem;
		span{
			color: #F6323E;
			padding-left: 9px;
		}
	}
	h3{
		width:2.2rem;
		height:0.98rem;
		background:rgba(255,218,68,1);
		font-size:0.3rem;
		font-family:PingFang-SC-Medium;
		color:rgba(26,26,26,1);
		line-height:0.98rem;
		text-align: center;
	}
}



</style>
<style scoped type="text/css">
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
