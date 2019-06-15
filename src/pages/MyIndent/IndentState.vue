<!-- 我的订单状态页面 -->
<template>
	<div class="indentState">

		<!-- 待支付之类 -->
		<header>
			<h6 v-text="headerList[i]">待支付</h6>
			<p v-if="isP1">剩余  <span v-text="groupLists.expirationTime">48:00:00</span> 逾期未支付订单将会取消！</p>
			<p v-if="isDue" class="redColor">该待支付订单已过期</p>

			<p v-if="isP2">距离您的出行还剩<span v-text="day">3</span>天，祝你旅途愉快</p>
			<p v-if="isP3" v-text="headerP[p]" :class="{Hcolor: h == 0}"></p>
			<p v-if="isP4">距离成团还差<b v-text="surplusNum">3</b>人</p>
			<img :src="item" v-if="isImgs" v-for="(item,index) in images.slice(0,5)"/>
		</header>


		<!-- 商品信息 -->
		<h1 class="cf" style="margin: 0;">
			<span class="fl">商品信息</span>
		</h1>
		<section @click="goShoppingMallDetails()">
			<h2 v-text="order.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h2>
			<p>套餐类型：<em v-text="order.setMeal">东京7日6夜纯玩团</em></p>
			<p class="cf">
				出行日期：<em v-text="tripDate">2018-06-02</em>
				<span class="fr" v-show="false" @click="$router.push({name: name,query:{key:'购买须知'}})">购买须知</span>
			</p>
			<p>购买数量：<em v-text="order.num">16</em></p>
			<p>商品总价：<em>¥{{ order.goodsAmount }}</em></p>
			<p>优惠券：<em style="padding-left: 1.2rem;">-¥{{ order.reductionAmount }}</em></p>
			<p>金币抵扣：<em>-¥{{ order.goldAmount }}</em></p>
			<p>实付金额：<em>¥{{ order.realAmount }}</em></p>
			<p v-show="order.cash != 0">返利奖励：<em v-text="order.cash">¥389x6期</em></p>

		</section>


		<!-- 出行人信息（1）渲染出来后是多个的 -->
		<section class="trip_text" v-for="(item,index) in tripMans">

			<h3>
				<span>出行人信息（{{ index+1 }}）</span>
			</h3>

			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->姓名：</p>
				<div class="div_txtInd" v-text="item.name">的萨芬</div>
			</div>
			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->手机：</p>
				<div class="div_txtInd" v-text="item.phone">18023674442</div>
			</div>
			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->身份证号：</p>
				<div v-text="item.IDnumber">440221199506444555</div>
			</div>
			<div class="cf txt" style="margin-bottom: 0.1rem;height: 100%;">
				<p class="fl"><!--<span>*</span>-->其他信息：</p>
				<div v-text="item.otherinfo">123456789012</div>
			</div>

		</section>

		<!-- 订单信息 -->
		<section class="trip_text txt_borBot">

			<h3>
				<span>订单信息</span>
			</h3>

			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->订单号</p>
				<div class="div_txtInd" v-text="order.orderNo">10000000000000000</div>
			</div>
			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->卖家：</p>
				<div class="div_txtInd" v-text="order.orgName">步履千寻自营旗舰店</div>
			</div>
			<div class="cf txt">
				<p class="fl"><!--<span>*</span>-->创建时间：</p>
				<div v-text="order.createTime">2018-05-22 15:00:00</div>
			</div>
			<div class="cf txt" v-show="type !== 6">
				<p class="fl"><!--<span>*</span>-->支付时间：</p>
				<div v-text="order.payTime">2018-05-22 15:00:00</div>
			</div>
			<div class="cf txt" v-show="type !== 6">
				<p class="fl"><!--<span>*</span>-->拼团时间：</p>
				<div v-text="order.groupTime">2018-05-22 15:00:00</div>
			</div>

		</section>

		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer" v-if="isbtn1">
			<p class="fl">实付金额：</p>
			<p class="fl">¥<b v-text="order.realAmount">4999</b>起</p>
			<button @click="OrderUpdate(1)">取消订单</button>
			<button class="fr" @click="goAffirmIndent2()">去支付</button>
		</footer>

		<!-- 底部按钮二 -->
		<footer class="footer2" v-if="isbtn2">
			<button v-show="isShow1" @click="goAfterApplication">售后申请</button>
			<button v-show="isShow2" @click="goIm">联系客服</button>
			<button v-text="btn3[b]" v-show="isShow3" :class="{footer2Bg:s == 0}" @click="goInvite" ref="btnId">去邀请</button>
		</footer>
		<van-actionsheet v-model="isshowIm" :actions="imList"  @select="onSelect"   cancel-text="取消"  @cancel="isshowIm=false"/>

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
import { Dialog,Toast } from 'vant';

export default {
	data() {
		return {
			h:1,
			p:0,
			isP1:false,
			isP2:false,
			isP3:false,
			isP4:false,
			headerP:['请对我们的商品进行评价','退款已完成，已通过微信转账方式进行退款','抱歉，拼团人数不足！'],
			i:0,
			headerList:['待支付','待成团','待出行','待评价','拼团失败','交易关闭','申请售后中','售后退款完成','免单待完善资料'],
			btn3:['去邀请','去评价','交易已关闭','申请售后中','售后已退款','填写出行人','拼团失败'],
			b:0,
			orderId:this.$route.query.orderId,  //子订单id；
			order:{},
			type:this.$route.query.type,  //用来判断从哪跳进我的订单状态页面的；
			isbtn1:false,
			isbtn2:false,
			isShow1:true,
			isShow2:true,
			isShow3:true,
			s:1,
			tripMans:[], //出行人信息；
			groupList:[],
			isImgs:false,
			groupLists:{}, //和倒计时要搭配使用的；
			expiredHour:[], //热门拼团商品倒计时；
			tripDate:'',
			day:'',
			spuId:null,
			eq:0, //也是 groupList 数组里的下标(但是在订单详情是子订单只有一个的，下标是固定死的)。用于跳转到确认订单页面的必须其中之一参数；
			isDue:false,
      		imList:[],
      		surplusNum:0,
      		images:[],
			isshowIm:false,
			cash:null,
			isAcc:false,
			orderType:null,
			isReturn:null,
			groupId:null,
			tel:""
		}
	},
	created() {

		this.OrderDetails(); //订单详情；

		//type:0取消;1待支付；2待成团;3待出行；4.待评价；5 拼团失败 ；6 免单待完善资料；  8交易完成；13.售后申请中；14.初审通过;15.售后退款成功 ；16售后被驳回;
		//订单状态 : 0取消;1待支付；2待成团;3待出行；4.待评价5 拼团失败 6 免单待完善资料  8完成，13.售后申请中，14.初审通过 15 售后退款成功 16售后被驳回;
		if (this.type == 1) {
			this.i = 0;
			this.isbtn1 = true;
			this.isP1 = true;

			console.log('待支付')
		} else if (this.type == 2) {
			this.i = 1;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 0;
			this.isP4 = true;
			this.isImgs = true;

		} else if (this.type == 3) {
			this.i = 2;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.isShow3 = false;
			this.isP2 = true;

		} else if (this.type == 4) {
			this.i = 3;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 1;
			this.isP3 = true;
			this.p = 0;

		} else if (this.type == 5) {
			this.i = 4;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 6;
			this.isShow1 = false;
			this.isShow2 = false;
			this.s = 0;
			this.isP3 = true;
			this.p = 2;

		} else if (this.type == 6) {
			this.i = 8;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 5;
			this.isShow1 = false;
			this.isShow2 = true;


		} else if (this.type == 8) {
			this.i = 5;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 2;
			this.isShow1 = false;
			this.isShow2 = false;
			this.s = 0;

		} else if (this.type == 13) {
			this.i = 6;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 3;
			this.isShow1 = false;
			this.isShow2 = true;
			this.s = 0;

		} else if (this.type == 15) {
			this.i = 7;
			this.isbtn1 = false;
			this.isbtn2 = true;
			this.b = 4;
			this.isShow1 = false;
			this.isShow2 = true;
			this.s = 0;
			this.isP3 = true;
			this.p = 1;
			this.h = 0;

		}
	},
	mounted() {

	},
	methods: {
		//订单详情；
		OrderDetails(){
			let detObj = {
				orderId:this.orderId   //子订单id；
			};

			this.$Api.Shop.OrderDetails(detObj).then( res => {
				console.log(res)

				this.order = {...res.q.order};
				this.getImId(this.order.orgId)
				this.tripMans = res.q.order.tripMans;
				this.groupList = res.q.order.groupList; //剩余拼团时间，人数，图片等内容（待成团之类的状态需要用到的数据）；
				this.spuId = res.q.order.spuId;  //点击商品信息中的旅行商品标题，跳转到商品详情页面的spuId;
				this.cash = res.q.order.cash; //返利总数；
				this.orderType = res.q.order.orderType; //订单类型:1正常购买,2拼团(包括发起=0 和 参与 ！=0),3活动免单;
				this.isReturn = res.q.order.isReturn; //有无返现；
				this.groupId = res.q.order.groupId; //判断拼团的条件拼团(包括发起=0 和 参与 ！=0)；

				if(res.q.order.groupList.length != 0){
					this.surplusNum = res.q.order.groupList[0].surplusNum;
				}

				if (res.q.order.groupList.length !== 0) {
					res.q.order.groupList.forEach( item => {
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
					})
					this.images = res.q.order.groupList[0].images;
					console.log(this.images,'this.images')
				}

				//计算剩余天数；
				let date = new Date(res.q.order.tripDate),
				    dateY = date.getFullYear(),
					dateM = date.getMonth()+1,
					dateD = date.getDate(),
					sta_date = new Date(),
					//求出两个时间的时间差，这个是天数；
					num = ( date - sta_date)/(1000*3600*24);

				this.day = parseInt(Math.ceil(num)); //转化为整天（向上取整，小于零的话剧不用转了）；

				this.tripDate = dateY + '-' + dateM + '-' + dateD;

				//console.log(this.tripDate,this.day)

				if (this.isP1) {
					console.log('待支付状态才需要倒计时')
					//判断后台返回的值是否是负数；
					if(res.q.order.expirationTime.indexOf('-') !== -1){ //是，就该订单过期；
						this.isP1 = false;
						this.isDue = true;

						console.log('该订单过期');
					}else{ //不是，就倒计时；
						let obj=res.q.order;  //单个对象数据倒计时；
						//console.log(obj,'objobjobj')
						let arr = obj.expirationTime.split(':'); //通过数据格式是24:08:28，以“ : ”来分割成数组为[24,08,28]；
						obj.timer=null;  //先定义个关闭定时器；
						obj.totalSecond = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2]); //先把活动目标时间转化为总秒数；
						this.groupLists = obj;
						//console.log(this.groupLists,'aaaaaaa')

						//再次成功挂载DOM元素后，才能再来使用；
						this.$nextTick(()=>{
							this.changeDate();  //拼团倒计时；
						})

						console.log('该订单没过期');
					}
				}
				
				console.log('orderType',res.q.order.orderType)
				//判断待出行和待评价里的orderType:3时，不能售后申请；
				if (res.q.order.orderType === 3) {
					this.isShow1 = false;
					console.log('不可以申请售后')
				}else{
					console.log('可以申请售后')
				}
			});
		},
		getImId(id){ //获取客服信息
			this.$Api.Common.CsList({id:id}).then((res)=>{
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
				this.getTel(id)

				console.log(res)
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
		goIm(){ //跳转im
			if(this.imList.length>0){
				this.isshowIm=true
			}else{
				Toast({
			        message: "暂无客服",
			        forbidClick: true,
			        position: 'center',
			    	duration: 2000
			   });
			}
		},
		//拼团倒计时；
		changeDate(){

			//this.groupLists.forEach( item => {
				//console.log(item.timer)
				this.groupLists.timer = setInterval(()=>{
					this.groupLists.totalSecond-=1;
					let iHour,iMin,iSec; //先声明时，分，秒变量；
					let total=this.groupLists.totalSecond;
					//console.log(total)

					//判断总秒数=0就是过期了,过期就停止定时器=00:00:00；
					if(total<=0){
						clearInterval(this.groupLists.timer);
						total=0;
						//alert('已过时间');
						this.isP1 = false;
						this.isDue = true;
					}

					//然后再来转化拼接成你想要的 时间格式 ；
					iHour=parseInt(total/3600);
					total%=3600;

					iMin=parseInt(total/60);
					total%=60;

					iSec=total;
					//console.log(iHour,iMin,iSec)

					this.groupLists.expirationTime= iHour+":"+iMin+":"+iSec;

					//判断倒计时15分钟是否结束；
//					if (item.expiredHour === '00:00') {
//						this.isDue = true;
//						console.log('倒计时已到')
//					}

				},1000)
			//})

		},

		//订单更新；
		//a=1是取消订单（未支付）,2是删除订单（已完成和已取消）;
		OrderUpdate(a){
			this.$dialog.confirm({
			  	message: '确定取消订单？'
			}).then(() => {
			  	// on confirm
			  	let ordObj = {
					'a':a,
					orderId:this.orderId
				};

				this.$Api.Shop.OrderUpdate(ordObj).then( res => {
					console.log(res)

					if (res.q.s == 0) {
						this.$router.push({
							name: "MyIndent",
							query: {

							}
						})
					}
				});
			}).catch(() => {
			  	// on cancel
			});
		},

		//跳转去邀请和填写出行人页面；
		goInvite(){
			if (this.$refs.btnId.innerHTML == '填写出行人') {
				this.$router.push({
					name: "AffirmIndenting",
					query: {
						orderId:this.orderId,
//						spuId:this.spuId, //评价的id；
//						eq:this.eq
					}
				})

				console.log('填写出行人')
			} else if (this.$refs.btnId.innerHTML == '去邀请') {
				this.$router.push({
					name: "FriendGroupTeam",
					query: {
						orgId:this.order.orgId,
						orderId:this.order.orderId,
						id:this.order.orderId,
						goState:0  //从我的订单状态页面的 点击 ‘去邀请’ 跳转过来的；
					}
				})

				console.log('去邀请')
			}else if (this.$refs.btnId.innerHTML == '去评价') {
				this.$router.push({
					name: "OffHandComment",
					query: {
						spuId:this.spuId,
						orderId:this.order.id,
					}
				})

				console.log('去评价')
			}
		},

		//支付提交接口；
		PaySubmit(){
			console.log(this.order.orderId,'支付是要大订单id，这个就是大订单id')
			let obj = {
				payment:1,
  				orderId:this.order.orderId
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
		                 		if(that.isReturn == 1){ //有返现；
		                 			that.isAcc = !that.isAcc; //打开领取弹窗；
		                 		}else if(that.isReturn == 0){ //没有返现；
		                 			//判断是拼团的还是单独购买的；
									if(that.orderType == 1){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面,属于正常购买；
										that.$router.push({
											name: "MyIndent",
											query: {

											}
										})
									}else if(that.orderType == 2){ //拼团的支付后，才跳转邀请好友拼团页面，属于拼团；
										//再来判断是发起拼团还是参与拼团；
										if (that.groupId == 0) { //发起拼团;
											that.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
										}else{ //参与拼团；
											that.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
										}
									}
		                 	}
							},3000)
		                },
		                cancel: function(res) {
		                  	that.$toast("支付失败","error")
		                }
		              });
		            });

				}
			})
		},

		click_yes(){
			this.isAcc = !this.isAcc; //关闭领取弹窗；
			this.$toast('领取成功','success')

			setTimeout( () => {
				//判断是拼团的还是单独购买的；
				if(this.orderType == 1){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面,属于正常购买；
					this.$router.push({
						name: "MyIndent",
						query: {

						}
					})
				}else if(this.orderType == 2){ //只有发起拼团的支付后，才跳转邀请好友拼团页面，属于拼团；
					//console.log(location.href,'location.hreflocation.hreflocation.href222222')
					this.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
				}
			},3000)
		},

		click_no(){
			this.isAcc = !this.isAcc; //关闭领取弹窗；
			//判断是拼团的还是单独购买的；
			if(this.orderType == 1){ //其他的（立即购买或者待支付支付后），跳转到我的订单页面；
				this.$router.push({
					name: "MyIndent",
					query: {

					}
				})
			}else if(this.orderType == 2){ //只有发起拼团的支付后，才跳转邀请好友拼团页面；
				this.goFriendGroupTeam(); //跳转支付成功邀请好友拼团页面；
			}
		},

		//直接支付；
		goAffirmIndent2(){
			//判断待支付是否已过期；
			if (this.isDue) {
				Toast('该待支付订单已过期'); //Vant插件请提示；
				console.log('过期')
			} else{
				this.PaySubmit();
//				this.$router.push({
//					name: "AffirmIndent2",
//					query: {
//						skuId:this.order.skuId,
//						spuId:this.order.spuId,
//						packageType:this.order.setMeal, //套餐的类型；
//						date:this.tripDate,  //出行日期；
//						price:this.order.realAmount, //价格；
//						tripManType:this.order.tripManType, //出发人群；
//						dateId:this.order.dateId,  //出行人日期Id；
//						btnTxt:4,
//						id:this.order.id   //a=7时需要传subOrderId就是id;
//					}
//				})

				console.log('没过期')
			}
		},

		//跳转商城首页商品详情页面(这个参数是当季推荐的spuId)；
		goShoppingMallDetails(index){

			this.$router.push({
				name: "ShoppingMallDetails",
				query: {
					spuId:this.spuId

				}
			})

		},

		//跳转到售后申请页面；
		goAfterApplication(){

			this.$router.push({
				name: "AfterApplication",
				query: {
					orderId:this.orderId   //子订单id；

				}
			})

		},

	},
}

</script>

<style scoped lang="less">
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
.redColor{color: #FF4141 !important;}

/*该我的订单状态页面样式*/
.indentState{
	background: #fff;
	height: 100%;
	/*待支付之类样式*/
	header{
		height:2rem;
		background:rgba(255,250,225,1);
		padding: 0.4rem 0 0.15rem 0.25rem;
		box-sizing: border-box;
		position: relative;
		h6{
			font-size:0.36rem;
			font-family:PingFang-SC-Bold;
			font-weight:bold;
			color:rgba(51,51,51,1);
			line-height:0.5rem;
		}
		p{
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(168,168,168,1);
			line-height:0.5rem;
			span{color: #FF4141;}
			b{font-weight: normal;}
		}
		img{
			width: 0.4rem;
			height: 0.4rem;
			border-radius: 50%;
			position: absolute;
		}
		img:nth-of-type(1){left: 0.25rem;}
		img:nth-of-type(2){left: 0.55rem;}
		img:nth-of-type(3){left: 0.85rem;}
		img:nth-of-type(4){left: 1.15rem;}
		img:nth-of-type(5){left: 1.45rem;}
	}


	/*商品信息样式*/
	h1{
		height: 1rem;
		padding: 0.4rem 0.25rem 0;
		box-sizing: border-box;

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
		padding: 0.2rem 0.25rem 0.1rem;
		box-sizing: border-box;
		border-bottom: 1px solid #ccc;
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
			span{
				color:rgba(246,50,62,1);
			}
		}
		p:nth-of-type(3){
			font-size:0.3rem;
			color:rgba(51,51,51,1);
			padding: 0.3rem 0 0.2rem;
			span{
				font-size:0.22rem;color:rgba(102,102,102,1);padding-left: 0.1rem;
			}
		}

		p{
			width: 100%;
			padding: 0 !important;
			line-height: 0.5rem !important;
			border-bottom: none !important;
			font-size:0.24rem !important;
			color:rgba(102,102,102,1) !important;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
			em{
				padding-left: 1rem;
			}

		}

		p:nth-of-type(7),p:nth-of-type(8){
			color: #f6323e !important;
		}


	}

	.indent_number{
		height: 1.15rem;
		border-bottom: 1px solid #ccc;
		padding: 0 0.25rem;
		box-sizing: border-box;
		line-height: 1.14rem;
		font-size:0.3rem;
		.number{
			color:rgba(246,50,62,1);
			font-size: 0.2rem;
			padding-left: 0.2rem;
			b{
				font-size: 0.3rem;
			}
		}
		.counter{
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


	/*出行人信息*/
	.trip_text{
		padding: 0 0.25rem;
		box-sizing: border-box;
		border-bottom: 1px solid #ededed;
		background: #fff;
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

		.txt{
			height: 0.5rem;
			line-height: 0.5rem;
			color:#666;
			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color: #666;
				span{
					color: #f6323e;
				}
			}
			div{
				float: left;
				border: none;
				width: 5.5rem;
				text-indent: 0.8rem;
				font-size:0.24rem;
				font-family:PingFang-SC-Regular;
				color:#666;
			}

			.input_mag{
				margin-left: 0.45rem;
			}
		}
		.txt:last-child{
			border-bottom: none;
			div{
				text-indent: 0;
				padding-left: 0.8rem;
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
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		padding-right: 0.25rem;
		box-sizing: border-box;
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
			font-size:0.25rem;
			color:#333;
			padding: 0.35rem 0 0 0.3rem;
		}
		button:nth-of-type(1){
			border:1px solid rgba(153,153,153,1);
			color:rgba(102,102,102,1);
			background: #fff;
			position: absolute;
			right: 2rem;
			top: 0rem;
			padding: 0 0.15rem;
		}
		button{
			/*width:1.4rem;*/
			height:0.68rem;
			background:rgba(250,220,86,1);
			outline: none;
			border: none;
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			color:rgba(26,26,26,1);
			line-height:0.68rem;
			text-align: center;
			margin-top: 0.15rem;
			border-radius: 0.05rem;
		}
		button:nth-of-type(2){
			padding: 0 0.3rem;
		}
	}

}

.footer2{
	width: 100%;
	height: 0.98rem;
	background: #fff;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	padding-right: 0.25rem;
	box-sizing: border-box;
	text-align: right;
	button{
		height:0.68rem;
		background:rgba(250,220,86,1);
		outline: none;
		border: none;
		font-size:0.24rem;
		font-family:PingFang-SC-Medium;
		color:rgba(26,26,26,1);
		line-height:0.68rem;
		text-align: center;
		margin-top: 0.15rem;
		padding: 0 0.2rem;
		margin-left: 0.2rem;
		border-radius: 0.05rem;
	}
	button:nth-of-type(1){
		border:1px solid rgba(153,153,153,1);
		color:rgba(102,102,102,1);
		background: #fff;
	}
	button:nth-of-type(2){
		background:rgba(255,243,192,1);
		color:rgba(102,102,102,1);
	}
	button:nth-of-type(3){padding: 0 0.3rem;}
}

.footer2Bg{background:rgba(237,237,237,1) !important;color:rgba(153,153,153,1) !important;}

.Hcolor{color:rgba(246,50,62,1) !important;}

.div_txtInd{text-indent: 1.25rem !important;}

.txt_borBot{border-bottom: 15px solid #f9f9f9 !important;}
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

em,i{font-style: normal;}
</style>
