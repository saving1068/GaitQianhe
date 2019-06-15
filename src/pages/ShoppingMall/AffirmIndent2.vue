<!-- 商城首页确认订单页面（发起拼团和直接加入购物车和直接购买部分的） -->
<template>
	<div class="affirmIndent">

		<!-- 确认订单 -->
		<h1 class="cf">
			<span class="fl">确认订单</span>
			<span class="fr" v-show=" goods.returnCash == 1">返现活动正在进行中~</span>
		</h1>
		<section>
			<h2 v-text="goods.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h2>
			<p>套餐类型：{{ packageType }}</p>
			<p class="cf">
				出行日期：{{ date }}
				<span class="fr" @click="goGaitQianheAgreement($event)">购买须知</span>
			</p>

			<!-- 领取成功隐藏价格之类信息 -->
			<div class="hid_cost" v-show="false">
				<p>商品总价：¥4999</p>
				<p>优惠券：-¥100</p>
				<p>金额抵扣：-¥1000</p>
				<p>实付金额：¥3899</p>
			</div>

		</section>
		<div class="indent_number cf">

			购买数量
			<div class="counter fr">
				<i class="fa fa-minus" @click="handleReduce"></i>
				<span>{{ num }}</span>
				<i class="fa fa-plus" @click="handleAdd"></i>
			</div>

		</div>
		<div class="numberBox cf">
			{{ tripManType == 1 ? '成人' : '儿童' }}
			<span class="number">¥<b v-text="price">1999</b></span>
			<span class="fr">剩余数量{{ residueNum }}件</span>

		</div>

		<!-- 出行人信息（1） -->
		<section class="trip_text" v-for="(item,index) in tripMans">

			<h3>
				<span>出行人信息（{{ index+1 }}）</span>
			</h3>

			<form class="cf">
				<p class="fl"><span>*</span>姓名</p>
				<input type="text" placeholder="输入姓名" class="input_mag" v-model.trim="item.name" maxlength="10"/>
			</form>
			<form class="cf">
				<p class="fl"><span>*</span>手机</p>
				<input type="text" placeholder="输入手机" class="input_mag" v-model.trim="item.mobile" maxlength="11" @blur="handleFilterLetters(item.mobile)"/>
			</form>
			<form class="cf">
				<p class="fl"><span>*</span>身份证号</p>
				<input type="text" placeholder="输入身份证号码" v-model.trim="item.IDnumber" maxlength="18" @blur="verifyIdNumber(item.IDnumber)"/>
			</form>
			<form class="cf">
				<p class="fl"><span style="opacity: 0;">*</span>其他信息</p>
				<input type="text" placeholder="若订单需要护照等信息请填写于此" v-model.trim="item.otherinfo" maxlength="100"/>
			</form>

		</section>

		<!-- 优惠信息 -->
		<section class="discounts_text">

			<h3>
				<span>优惠信息</span>
			</h3>

			<div class="cf" @click="goChooseDiscount2(a,dateId,go.orgId,num,tripManType)">
				优惠券
				<span v-if="catusecoupons.length != 0&&couponMoney==0">{{catusecoupons.length}}张可用</span>
				<span v-show="catusecoupons.length==0" style="color: #ccc;border: 0.01rem solid #ccc;">无可用</span>
				<span v-if="catusecoupons.length != 0" class="fr" style="margin-right: 0.5rem;color: #666;">{{couponMoney==0?'请选择':`-${couponMoney}`}}</span>
			</div>

			<div class="cf" :style="{background: 'url(' + (imgOnoff ? img : imgNull) + ') no-repeat 6.6rem 0.27rem',backgroundSize: (imgOnoff ? '0.36rem 0.36rem' : imgNull)}" @click="tabImg">
				我的金币
				<span>({{ resq.myGold }})</span>
				<span class="fr" v-show="Gold != 0">-{{ Gold }}</span>
			</div>

			<h4>
				点击“提交订单”表示已阅读并同意<span @click="goGaitQianheAgreement($event)">《步履千寻服务使用协议》</span>
			</h4>

		</section>

		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer">
			<p class="fl" v-if="catusecoupons.length > 0">¥{{ resq.totalAmount }}</p>
			<p class="fl red">¥<b v-text="reductionAmounting">4999</b></p>
			<button class="fr" @click="OrderSubmit">提交订单</button>
		</footer>

		<!-- 领奖提示 -->
		<div class="accept_tips" v-show="isAcc">
			<div class="accept_ok">
				<img src="../../assets/common_btn_close2@2x.png" @click="click_no"/>
				<p>恭喜你获得返现金额¥{{cash}}，返还详情查看我的订单～</p>
				<button @click="click_yes">确认</button>
			</div>
		</div>

	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			couponId:this.$route.query.couponId, //优惠券Id必传；
			skuId:this.$route.query.skuId,
			spuId:this.$route.query.spuId,  //产品id；
			packageType:this.$route.query.packageType,
			date:this.$route.query.date,
			price:this.$route.query.price,
			tripManType:this.$route.query.tripManType,
			dateId:this.$route.query.dateId,
			btnTxt:this.$route.query.btnTxt,
			id:this.$route.query.id,
			//onoff:this.$route.query.onoff,
			num:1,
			tripMans:[],  //出行人信息；
			groupLists:[],
			goods:[],
			resq:{},
			totalAmount:this.$route.query.totalAmount,  //优惠券的价格；
			isAcc:false,
			go:{},
			residueNum:null, //剩余数量；
			numOnoff:true,  //载入试算开关，用于赋值剩余数量的开关（只用首次载入页面一次）；
			orderId:null,
			img:require('../../assets/shop_img_check@2x.png'),
			imgOnoff:false,
			imgNull:'',
			isUseAcc:0,
			catusecoupons:[],
			useGold:0,
			couponMoney: 0,
			hasCoupon: false,
			reductionAmounting:0,
			Gold:0,
			//groupId:0,
			cash:null,
			isReturn:null,
			shangciTime:false,
			a:null, //传给优惠券试算的类型，a=1是普通购买，a=2是发起拼团和参与拼团；
			
		}
	},
	created() {
    	console.log(this.$route.query,'this.$route.query')
		
		this.GoodsDetails();
		
		if(window.sessionStorage.getItem('num')) {
			this.num = window.sessionStorage.getItem('num')
		};
		
		//判断从上一张页面跳转时，先清空保存vuex的state值时；
//		if (this.onoff == true) {
//			let a = this.$store.state.Shop.tripMans = [];
//			console.log(a,'空空空空空空空空空空空空空')
//		}else{ //这里不用清空，是用来防止页面刷新的；
			this.tripMans = [...this.$store.state.Shop.tripMans]; //获取vuex里的全局变量；
			//console.log(this.tripMans,'this.tripMansthis.tripMansthis.tripMans')
			//判断vuex里的全局变量this.tripMans没有值的时候才遍历，用于防止页面刷新；
			if (this.tripMans.length == 0) {
				for (let i = 0;i<this.num;i++) {
					let obj={
						name:'',
						mobile:'',
						IDnumber:'',
						otherinfo:''
					};
					this.tripMans.push(obj);
				}
			}
		//}
	},
	mounted() {

	},

	//计算属性；
	computed:{

	},

	methods: {
		//点击切换选中打钩图片，默认不打钩；
		tabImg(){ 			
			this.imgOnoff = !this.imgOnoff;
			
			//判断是否用金币抵扣，默认是=0不用金币抵扣，=1是用金币；
			if(this.imgOnoff){ //true用；		
				this.isUseAcc = 1;
				//判断我的金币是否大于等于买的钱；
				if(this.resq.myGold >= this.resq.reductionAmount){ //是；
					this.reductionAmounting = 0.01;
					this.Gold = this.resq.reductionAmount;
					this.useGold = this.resq.reductionAmount; //使用的多少金币 = 要付的的总价钱，但是也要跳转微信扣0.01元；
					//console.log(this.useGold,'aaaaaaaaaaa1')
				}else{ //不是；
					this.reductionAmounting = Math.abs(this.resq.myGold - this.resq.reductionAmount);
					this.Gold = this.resq.myGold;
					this.useGold = this.resq.myGold; //使用的全部金币还不够要付的的总价钱，剩下的余额再到微信扣；
					//console.log(this.useGold,'aaaaaaaaaaa2')
				}
				console.log(this.reductionAmounting,'this.reductionAmountingthis.reductionAmountingthis.reductionAmounting')
			}else{ //false不用；
				this.isUseAcc = 0;
				this.reductionAmounting = Math.abs(this.resq.reductionAmount);
				this.Gold = 0;
			}
		},
		
    	getQueryData(){
    		let theRequest = new Object();
		},

		//支付提交接口；
		PaySubmit(){
			let obj = {
				payment:1,
  				orderId:this.orderId
			};
           
			this.$Api.Shop.PaySubmit(obj).then( res => {
				console.log(res)

				let wxPay = JSON.parse(res.q.wxPay);
				let that = this;
				if(res.q.s == 0){
					//微信支付的JSSDK的方法;
					wx.config({
		              	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	              		appId: that.$store.state.config.appId, // 必填，公众号的唯一标识
						timestamp: that.$store.state.config.timestamp, // 必填，生成签名的时间戳
						nonceStr: that.$store.state.config.nonceStr, // 必填，生成签名的随机串
						signature: that.$store.state.config.signature, // 必填，签名
		              	jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
		            });
		            wx.ready(function() {
		              // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		              wx.chooseWXPay({
		                timestamp: wxPay.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		                nonceStr: wxPay.nonceStr, // 支付签名随机串，不长于 32 位
		                package: wxPay.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
		                signType: wxPay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		                paySign: wxPay.paySign, // 支付签名
		                success: function(res) {
		                  	// 支付成功后的回调函数;
		                 	that.$toast("支付成功","success")
		                 
		                 	setTimeout( () => {
		                 		console.log('that',that.isReturn)
								if(that.isReturn == 1){ //有返现；
		                 			that.isAcc = !that.isAcc; //打开领取弹窗；
		                 		}else if(that.isReturn == 0){ //没有返现；
		                 			//判断是拼团的还是单独购买的；
									if(that.btnTxt == 2 || that.btnTxt == 4){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面；
										that.$router.push({
											name: "MyIndent",
											query: {
												
											}
										})
									}else if(that.btnTxt == 3){ //只有发起拼团的支付后，才跳转邀请好友拼团页面；
										console.log('跳转支付成功邀请好友拼团页面')
										that.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
									}
		                 		}
							},3000)
		                },
		                cancel: function(res) {
		                  	that.$toast("支付失败","error")
		                  	//取消了支付，就让它跳去我的订单；
//		                  	that.$router.push({ 
//								name: "MyIndent",
//								query: {
//									
//								}
//							})
		                }
		              });
		            });
				}
			})
		},
		//商品详情接口；
		GoodsDetails(){
			let GDetObj = {
				'spuId':this.spuId
			};

			this.$Api.Shop.GoodsDetails(GDetObj).then( res => {
				console.log(res,'商品详情接口')

				this.goods = res.q.goods;
				//this.groupLists = [...res.q.goods.groupLists];

				if(res.q.s == 0){
					this.trialOrderSubmit(); //参与拼团试算订单；
				}

			})
			//console.log(this.groupLists)
		},

		handleReduce(){ //减少；

  			//判断减少按钮不能=0；
  			if (this.num == 1) { //数量不能小于1；
  				return
  			}else{
  				this.num--;
  				this.tripMans.pop();
				window.sessionStorage.setItem('num',this.num);
				
  				this.trialOrderSubmit(); //继续试算；
  			}

	  	},
	  	handleAdd(){ //增加；

	  		//判断增加按钮,剩余数量为0就不能加了；
	  		if (this.residueNum == 0) {
	  			return
	  		}else if(this.num >= this.residueNum){
	  			Toast('亲，已到达最大数量');
	  			console.log(this.num,'大于了创库剩余量！！')
	  			return
	  		}else{
	  			this.num++;
				window.sessionStorage.setItem('num',this.num);
				
	  			let obj={
						name:'',
						mobile:'',
						IDnumber:'',
						otherinfo:''
					};
	  			this.tripMans.push(obj);
				
	  			this.trialOrderSubmit(); //继续试算；
	  		}

	  	},

		//参与拼团试算订单；
		trialOrderSubmit(){
			//判断是从立即购买还是发起拼团,还是我的订单里的待支付；
			if(this.btnTxt == 2 || this.btnTxt == 4){  //立即购买,我的订单里的待支付；
				this.a = 1;
				//console.log('进来了')
				if(this.numOnoff){ //开一次的；
//					if(window.sessionStorage.getItem('num')) {
//						this.num = window.sessionStorage.getItem('num')
//					}
					if(window.sessionStorage.getItem('checkedGroup')){
						let obj={...JSON.parse(window.sessionStorage.getItem('checkedGroup'))}
						Object.keys(obj).forEach(val=> {
							if(val == this.dateId) {
								this.couponId = obj[val].cid
								this.couponMoney = obj[val].price
							}
						})
					}
					
					let OrdObj = {
						a:1,  //试算类型；
						orgId:this.goods.orgSummery.orgId,  //机构ID；
						couponId:this.couponId,
						skuId:this.skuId,  //商品id；
						spuId:this.spuId,  //产品id；
						dateId:this.dateId, //出行日期id；
						num:this.num,  //商品数量；
						tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
					};

					console.log(OrdObj.num);

					this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
						console.log(res)
						
						this.resq = res.q;
						this.go = res.q.goods[0];
						this.residueNum = res.q.goods[0].surplusNum;
						this.catusecoupons = res.q.goods[0].catusecoupons;  //用来判断它的长度来看是否有优惠的；
						this.orderId = res.q.orderId; //子订单id；
						this.reductionAmounting = res.q.reductionAmount;
						
						if(res.q.s == 0){
							this.numOnoff = !this.numOnoff;  //用完就关了；
						}
					});
				}else{
					let OrdObj = {
						a:1,  //试算类型；
						orgId:this.goods.orgSummery.orgId,  //机构ID；
						couponId:this.couponId,
						skuId:this.skuId,  //商品id；
						spuId:this.spuId,  //产品id；
						dateId:this.dateId, //出行日期id；
						num:this.num,  //商品数量；
						tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
					};

					console.log(OrdObj.num);

					this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
						console.log(res)

						this.resq = res.q;
						this.go = res.q.goods[0];
						this.residueNum = res.q.goods[0].surplusNum;
						this.catusecoupons = res.q.goods[0].catusecoupons; 
						this.reductionAmounting = res.q.reductionAmount;
					});
				}

			}else if(this.btnTxt == 3){  //发起拼团；
				this.a = 2;
				if(this.numOnoff){
//					if(window.sessionStorage.getItem('num')) {
//						this.num = window.sessionStorage.getItem('num')
//					}
					if(window.sessionStorage.getItem('checkedGroup')){
						let obj={...JSON.parse(window.sessionStorage.getItem('checkedGroup'))}
						Object.keys(obj).forEach(val=> {
							if(val == this.dateId) {
								this.couponId = obj[val].cid
								this.couponMoney = obj[val].price
							}
						})
					};
					
					let OrdObj = {
						a:2,  //试算类型；
						orgId:this.goods.orgSummery.orgId,  //机构ID；
						couponId:this.couponId,
						skuId:this.skuId,  //商品id；
						spuId:this.spuId,  //产品id；
						dateId:this.dateId, //出行日期id；
						num:this.num,  //商品数量；
						tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
					};

					console.log(OrdObj);

					this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
						console.log(res)

						this.resq = res.q;
						this.go = res.q.goods[0];
						this.residueNum = res.q.goods[0].surplusNum;
						this.catusecoupons = res.q.goods[0].catusecoupons; 
						this.reductionAmounting = res.q.reductionAmount;
						
						if(res.q.s == 0){
							this.numOnoff = !this.numOnoff;
						}
					});
				}else{
					let OrdObj = {
						a:2,  //试算类型；
						orgId:this.goods.orgSummery.orgId,  //机构ID；
						couponId:this.couponId,
						skuId:this.skuId,  //商品id；
						spuId:this.spuId,  //产品id；
						dateId:this.dateId, //出行日期id；
						num:this.num,  //商品数量；
						tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
					};

					console.log(OrdObj);

					this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
						console.log(res)

						this.resq = res.q;
						this.go = res.q.goods[0];
						this.residueNum = res.q.goods[0].surplusNum;
						this.catusecoupons = res.q.goods[0].catusecoupons; 
						this.reductionAmounting = res.q.reductionAmount;
					});
				}

			}
		},

		//确认订单；
		OrderSubmit(){
			let startTime = new Date().getTime(); //当前的；
			if(!this.shangciTime || (startTime-this.shangciTime)>1500) {
				this.shangciTime=startTime;
				
				//判断出行人信息不能为空；
				for(let i=0;i<this.tripMans.length;i++){
					console.log(this.tripMans[i])
					
					if(this.tripMans[i].name == '' && this.tripMans[i].mobile == '' && this.tripMans[i].IDnumber == ''){
						Toast('亲，出行人信息必填项都需要填！');
						//console.log('必填项不能为空')
					}else if(this.tripMans[i].name == ''){
						Toast('亲，出行人姓名没填！');
						//console.log('出行人姓名不能为空')
					}else if(this.tripMans[i].mobile == ''){
						Toast('亲，出行人手机没填！');
						//console.log('出行人手机不能为空')
					}else if(this.tripMans[i].IDnumber == ''){
						Toast('亲，出行人身份证没填！');
						//console.log('出行人身份证不能为空')
					}else{
						let mobileVerify = /^1[0-9]{10}$/, //手机正则；
							IDnumberVerify = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //证件号码正则；
						//判断验证格式；
						if(mobileVerify.test(this.tripMans[i].mobile) && IDnumberVerify.test(this.tripMans[i].IDnumber)){
							if(this.btnTxt == 2){
				  				let OrdObj = {
									a:4,  //4是经过购物车提交订单；
								  	//groupId:this.groupId,  //参与拼团时需要传；
									orgId:this.goods.orgSummery.orgId,  //机构ID；
									couponId:this.couponId,
									skuId:this.skuId,  //商品id；
									spuId:this.spuId,  //产品id；
									dateId:this.dateId, //出行日期id；
									num:this.num,  //商品数量；
									tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
									tripMans:[...this.tripMans],
					//							{
					//								tripMan:{
														//id:1,  //出行人1Id;
					//									name:,
					//									mobile:this.obj.mobile,
					//									IDnumber:this.obj.IDnumber,
					//									otherinfo:this.obj.otherinfo
					//								},
					//							}
					//						],
									useGold:this.useGold,  //使用的金币；
									isUseAcc:this.isUseAcc  //默认是=0不用金币抵扣，=1是用金币；
								};
			
								console.log(OrdObj.couponId,'couponId222222')
			
								this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
									console.log(res)
			
									this.orderId = res.q.orderId; //订单ID，支付订单时必须要；
									this.cash = res.q.cash; //返利总数；
									this.isReturn = res.q.isReturn; //有没有返现；1是有返现，2是没有返现；
									
									if(res.q.s == 0){
										this.PaySubmit();
									}else if (res.q.s == 1604) { //团购已达上限，请选择另外团进行购买；
										Toast('团购已达上限，请选择另外团进行购买！');
									} 
								});
				  			}else if(this.btnTxt == 3){
				  				let OrdObj = {
									a:5,  //5是发起拼团提交订单；
								  	//groupId:this.groupId,  //参与拼团时需要传；
									orgId:this.goods.orgSummery.orgId,  //机构ID；
									couponId:this.couponId,
									skuId:this.skuId,  //商品id；
									spuId:this.spuId,  //产品id；
									dateId:this.dateId, //出行日期id；
									num:this.num,  //商品数量；
									tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
									tripMans:[...this.tripMans],
									useGold:this.useGold,  //使用的金币；
									isUseAcc:this.isUseAcc  //默认是=0不用金币抵扣，=1是用金币；
								};
			
								console.log(OrdObj.couponId,'couponId333333')
			
								this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
									console.log(res)
			
									this.orderId = res.q.orderId;
									this.cash = res.q.cash; //返利总数；
									this.isReturn = res.q.isReturn; //有没有返现；1是有返现，2是没有返现；
									
									//判断提交订单成功后就支付；
									if(res.q.s == 0){
										this.PaySubmit();
									}else if (res.q.s == 1604) { //团购已达上限，请选择另外团进行购买；
										Toast('团购已达上限，请选择另外团进行购买！');
									} 
								});
				  			}else if(this.btnTxt == 4){
				  				let OrdObj = {
									a:7,  //7是待支付提交订单；
									subOrderId:this.id,  //a=7时需要传;
								  	//groupId:this.groupId,  //参与拼团时需要传；
									orgId:this.goods.orgSummery.orgId,  //机构ID；
									couponId:this.couponId,
									skuId:this.skuId,  //商品id；
									spuId:this.spuId,  //产品id；
									dateId:this.dateId, //出行日期id；
									num:this.num,  //商品数量；
									tripManType:this.tripManType, //出行人类型: 1 成人 2.儿童；
									tripMans:[...this.tripMans],
									useGold:this.useGold,  //使用的金币；
									isUseAcc:this.isUseAcc  //默认是=0不用金币抵扣，=1是用金币；
								};
			
								console.log(OrdObj.couponId,'couponId44444444444444')
			
								this.$Api.Shop.OrderSubmit(OrdObj).then( res => {
									console.log(res)
			
									this.orderId = res.q.orderId;
									this.cash = res.q.cash; //返利总数；
									
									//判断提交订单成功后就支付；
									if(res.q.s == 0){
										this.PaySubmit();
									}else if (res.q.s == 1604) { //团购已达上限，请选择另外团进行购买；
										Toast('团购已达上限，请选择另外团进行购买！');
									} 
								});
				  			}
						}else{
							Toast('亲，手机号或身份证格式不对！');
						}				
						console.log('必填填了，可以提交订单')
					}
				}
			}
		},

		click_yes(){
			this.isAcc = !this.isAcc; //关闭领取弹窗；
			this.$toast('领取成功','success')

			setTimeout( () => {
				//判断是拼团的还是单独购买的；
				if(this.btnTxt == 2 || this.btnTxt == 4){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面；
					this.$router.push({
						name: "MyIndent",
						query: {
							
						}
					})
				}else if(this.btnTxt == 3){ //只有发起拼团的支付后，才跳转邀请好友拼团页面；
					console.log(location.href,'location.hreflocation.hreflocation.href222222')
					this.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
				}
				
			},3000)
		},

		click_no(){
			this.isAcc = !this.isAcc; //关闭领取弹窗；
			//判断是拼团的还是单独购买的；
			if(this.btnTxt == 2 || this.btnTxt == 4){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面；
				this.$router.push({
					name: "MyIndent",
					query: {
						
					}
				})
			}else if(this.btnTxt == 3){ //只有发起拼团的支付后，才跳转邀请好友拼团页面；
				this.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
			}
		},

		//跳转支付成功邀请好友拼团页面；
		goFriendGroupTeam(){
			this.$router.push({
				name: "FriendGroupTeam",
				query: {
					//groupId:this.groupId, //参与拼团;
					id:this.orderId,    //订单id；
					orgId:this.go.orgId //店铺ID；
				}
			})
		},

		//跳转选择优惠券页面；
		goChooseDiscount2(a,dateId,orgId,num,tripManType){
			//判断是否有优惠券才给他跳转页面；
			if (this.catusecoupons.length==0) { //无；
				return
			} else{
				this.$router.push({
					name: "ChooseDiscount2",
					query: {
						a,
						dateId,
						orgId,
						num,
						tripManType
					}
				})
			}
		},

		//跳转《步履千寻服务使用协议》页面；
		goGaitQianheAgreement(event){

			event = event || window.event;

			let keys = event.target.innerHTML.replace(/《|》/g,"");

			//console.log(event.target.innerHTML.replace(/《|》/g,""));

			this.$router.push({
				name: "WithDraw",
				query: {
					key:keys
				}
			})

		},
		
		handleFilterLetters(mobile){
			//console.log('手机号验证',this.tripMans)
			let reg = /[^\d]/g;
			
			if ( reg.test( mobile ) ) {
				Toast('请输入正确手机号格式！');
				this.tripMans.forEach( (item) => {
            	//console.log('手机Value值',item.mobile)
	            	item.mobile = '';
	            });
			} else{
				
			} 
        },
        
        verifyIdNumber(IDnumber){
        	let reg = /[^\dX|x]/ig;

        	if( reg.test( IDnumber ) ){
        		Toast('请输入正确身份证格式！');
        		this.tripMans.forEach( it => {
            		it.IDnumber = "";
	            })
				//console.log('验证成立')
			}else{

				//console.log('验证不成立')
			}
        }
	},
	beforeRouteLeave(to,from,next){ //离开页面时把this.tripMans保存到vuex里的state全局变量；
		this.$store.commit('changeTripMans',[...this.tripMans])
		
		next();
	},
}

</script>

<style scoped lang="less">
.red{color:rgba(246,50,62,1) !important;text-decoration: none !important;}
/*该商城首页确认订单页面样式*/
.affirmIndent{
	background: #fff;

	/*确认订单样式*/
	h1{
		height: 1.15rem;
		padding: 0.4rem 0.25rem 0;
		box-sizing: border-box;
		margin: 0 0 !important;
		span{
			font-size:0.3rem;
			font-family:PingFang-SC-Bold;
			color:rgba(51,51,51,1);

		}
		span:nth-of-type(1){
			padding-left: 0.1rem;
			border-left: 0.05rem solid #fadc56;
			height: 0.4rem;
			vertical-align: top;
			font-weight: 600;
		}
		span:nth-of-type(2){
			color:rgba(246,50,62,1);
			font-size: 0.25rem;
			height: 0.4rem;
			line-height: 0.4rem;
		}
	}

	section:nth-of-type(1){
		padding: 0.4rem 0.25rem 0;
		box-sizing: border-box;
		h2{
			font-size:0.3rem;
			font-family:PingFang-SC-Bold;
			color:rgba(51,51,51,1);
			line-height:0.5rem;
			font-weight: 600;
		}
		p{
			font-family:PingFang-SC-Regular;
			color:rgba(102,102,102,1);
		}
		p:nth-of-type(1){
			font-size:0.24rem;
			padding-top: 0.3rem;
		}
		p:nth-of-type(2){
			font-size:0.24rem;
			padding-top: 0.3rem;
			padding-bottom: 0.3rem;
			border-bottom: 1px solid #ccc;
			span{
				color:rgba(246,50,62,1);
			}
		}

	}

	.indent_number{
		height: 1rem;
		padding: 0 0.25rem;
		box-sizing: border-box;
		line-height: 1.2rem;
		font-size:0.3rem;

		.counter{
			height: 1rem;
			span{
				width: 0.32rem;
				height: 100%;
				background: #fff;
				font-size:0.38rem;
				font-family:PingFang-SC-Bold;
				color:rgba(40,40,40,1);
				margin-left: 0.6rem;
			}
			i{
				margin-left: 0.6rem;
			}
		}

	}

	.numberBox{
		padding-left: 0.25rem;
		box-sizing: border-box;
		font-size:0.22rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(40,40,40,1);
		.number{
			color:rgba(246,50,62,1);
			font-size: 0.2rem;
			padding-left: 0.2rem;
			b{
				font-size: 0.3rem;
			}
		}
		span:nth-of-type(2){
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
			line-height:0.4rem;
			padding-right: 0.55rem;
		}
	}


	/*出行人信息*/
	.trip_text{
		padding: 0 0.25rem;
		box-sizing: border-box;
		border-bottom: 1px solid #ededed;
		h3{
			height: 0.88rem;
			line-height: 0.88rem;
			span{
				padding-left: 0.1rem;
				border-left: 0.05rem solid #fadc56;
				height: 0.4rem;
				vertical-align: top;
				font-weight: 600;
				font-size:0.3rem;
				font-family:PingFang-SC-Bold;
				color:rgba(51,51,51,1);
			}
		}

		form{
			height: 0.94rem;
			border-bottom: 1px solid #ededed;
			line-height: 0.92rem;
			color:rgba(204,204,204,1);
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color: #333;
				span{
					color: #f6323e;
				}
			}
			input{
				border: none;
				width: 5rem;
				text-indent: 1.4rem;
				font-size:0.3rem;
				font-family:PingFang-SC-Regular;
				color:rgba(51,51,51,1);
			}
			.input_mag{
				margin-left: 0.45rem;
			}
		}
		form:nth-of-type(4){
			input{margin-left: 1.4rem;text-indent: 0rem;width: 4.55rem;}
		}
		form:last-child{
			border-bottom: none;
		}
	}


	/*优惠信息*/
	.discounts_text{
		padding: 0 0.25rem;
		box-sizing: border-box;
		h3{
			height: 0.88rem;
			line-height: 0.88rem;
			span{
				padding-left: 0.1rem;
				border-left: 0.05rem solid #fadc56;
				height: 0.4rem;
				vertical-align: top;
				font-weight: 600;
				font-size:0.3rem;
				font-family:PingFang-SC-Bold;
				color:rgba(51,51,51,1);
			}
		}

		div{
			height: 0.9rem;
			line-height: 0.9rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Regular;
			color:rgba(51,51,51,1);
			border-bottom: 1px solid #ccc;
			span:nth-of-type(1){
				font-size:0.18rem;
				font-family:PingFang-SC-Regular;
				color:rgba(255,60,60,1);
				padding: 0.04rem;
				border: 1px solid rgba(255,60,60,1);
				font-style: normal;
			}
			span:nth-of-type(2){
				font-size:0.3rem;
				font-family:PingFang-SC-Regular;
				color:rgba(102,102,102,1);
				margin-right: 0.5rem;
			}
		}
		div:nth-of-type(1){
			background: url(../../assets/common/common_btn_right@3x.png) no-repeat 6.7rem 0.33rem;
			background-size: 0.12rem 0.22rem;
		}
		
		div:nth-of-type(2){
			/*background: url(../../assets/shop_img_check@2x.png) no-repeat 6.6rem 0.27rem;*/
			/*background-size: 0.36rem 0.36rem*/;
			span:nth-of-type(1){
				border: none;
				padding: 0;
				font-size:0.3rem;
			}

		}

		h4{
			height: 1rem;
			line-height: 1rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(51,51,51,1);
			span{
				color: #4DA9FF;
			}
		}
	}

	/*底部提问输入框样式*/
	.footer_equal{
		width: 100%;
		height: 0.98rem;
		/*background: pink;*/
	}
	.footer{
		width: 100%;
		height: 0.98rem;
		border-top: 1px solid #efefef;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		p{
			font-size:0.24rem;
			font-family:PingFang-SC-Bold;
			color:rgba(246,50,62,1);
			padding: 0.3rem 0 0 0.25rem;
			b{
				font-size:0.3rem;
			}
		}
		p:nth-of-type(1){
			font-size:0.2rem;
			color:rgba(153,153,153,1);
			padding: 0.4rem 0 0 0.3rem;
			text-decoration: line-through;
		}
		button{
			width:3.75rem;
			height:0.98rem;
			background:rgba(250,220,86,1);
			outline: none;
			border: none;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(26,26,26,1);
			line-height:0.5rem;
			text-align: center;
		}
	}

}

/*领取成功隐藏价格之类信息*/
.hid_cost{

	p{
		padding: 0 !important;
		line-height: 0.5rem !important;
		border-bottom: none !important;
		font-size:0.24rem !important;
		color:rgba(102,102,102,1) !important;
	}

	p:nth-of-type(4){
		color: #f6323e !important;
	}
}

/*领奖提示样式*/
.accept_tips{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 200;
	background: rgba(0,0,0,0.7);
	.accept_ok{
		width:5.6rem;
		height:4.2rem;
		background:rgba(255,255,255,1) url(../../assets/shop_img_bag@2x.png) no-repeat 2.3rem 0.45rem;
		background-size: 1.1rem 1.5rem;
		border-radius:0.1rem;
		position: absolute;
		left: 0.95rem;
		top: 3.3rem;
		img{
			width: 0.22rem;
			height: 0.22rem;
			position: absolute;
			top: 0.1rem;
			right: 0.1rem;
		}
		p{
			width:4.4rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
			text-align: center;
			line-height:0.36rem;
			position: absolute;
			top: 2.3rem;
			left: 0.6rem;
		}
		button{
			width:100%;
			height:0.88rem;
			background:rgba(252,231,144,1);
			text-align: center;
			line-height: 0.88rem;
			position: absolute;
			left: 0;
			bottom: 0;
			border-radius: 0 0 0.1rem 0.1rem;
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

button{
	outline: none;
	border: none;
}

/*支付成功和失败样式*/
.pay{
	width:3.44rem;
	height:3.56rem;
	background:rgba(26,26,26,1) url(../../assets/common_icon_ok@2x.png) no-repeat 1.2rem 0.8rem;
	background-size: 1.05rem 1.05rem;
	opacity:0.8;
	border-radius:0.3rem;
	position: fixed;
	left: 2rem;
	top: 3.7rem;
	font-size:0.34rem;
	font-family:PingFang-SC-Medium;
	color:rgba(255,255,255,1);
	line-height:5rem;
	text-align: center;
}

.pay_no{
	background: rgba(26,26,26,1) url(../../assets/common_btn_close3@2x.png) no-repeat 1.2rem 0.8rem;
	background-size: 1.05rem 1.05rem;
}
</style>
