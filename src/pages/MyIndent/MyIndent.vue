<!-- 我的订单 -->
<template>
	<div class="MyIndent" id="MyIndent">
		
		<!-- tab切换导航栏 -->
		<nav>
			<ul class="cf">
				<li @click="click_nav(index)" v-for="(item,index) in navList">
					<a href="javascript:;" v-text="item" :class="{active_fontC:index == num}"></a>
				</li>
			</ul>
		</nav>
		
		<!-- 全部 -->
		<div v-show="isShowA">
			
			<!-- 每一个旅行单据 -->
			<section class="travel" v-for="(item,index) in orders">
				<div>
					<section @click="goIndentStateAll(index)">
						<header>
							<h1 class="fl" v-text="item.orgName">步履千寻旗舰店</h1>
							<van-icon name="arrow" class="fl icon_arrow"/>
							<h2 class="fr" v-text="type[index]" :class="{colorGray:item.status == 5 || item.status == 0}">代付款</h2>
						</header>
						
						<article>
							<h3 v-text="item.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h3>
							<p>套餐类型：{{ item.setMeal }}</p>
							<p class="cf">
								出行日期：{{ tripDate[index] }}
								<span class="fr">¥{{ item.realAmount }}</span>
							</p>
						</article>
					</section>
					
					<footer v-show="isFooter[index]">
						<img :src="it" v-if="isImg[index]" v-for="(it,ind) in item.imagePaths.slice(0,5)"/>
						<button class="gray" v-show="callOff[index]" @click="clickL_type(index)">取消订单</button>
						<button class="fr" v-text="sta[index]" v-show="isCX[index]" @click="clickR_type(index)">去付款</button>
					</footer>
				</div>
				
			</section>
		</div>
		
		<!-- 代付款 -->
		<div v-show="isShowB" class="stay_payment">
			
			<!-- 每一个旅行单据 -->
			<section class="travel" v-for="(item,index) in orders">
				<div>
					<section @click="goIndentStateAll(index)">
						<header>
							<h1 class="fl" v-text="item.orgName">步履千寻旗舰店</h1>
							<van-icon name="arrow" class="fl icon_arrow"/>
							<h2 class="fr" v-text="type[index]" :class="{colorGray:item.status == 5 || item.status == 0}">待付款</h2>
						</header>
						
						<article>
							<h3 v-text="item.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h3>
							<p>套餐类型：{{ item.setMeal }}</p>
							<p class="cf">
								出行日期：{{ tripDate[index] }}
								<span class="fr">¥{{ item.realAmount }}</span>
							</p>
						</article>
					</section>
					
					<footer v-show="isFooter[index]">
						<img src="../../assets/touxiang.png" v-if="isImg[index]"/>
						<button class="gray" v-show="callOff[index]" @click="OrderUpdate(index,1,false)">取消订单</button>
						<button class="fr" v-text="sta[index]" v-show="isCX[index]" @click="goPayment(index)">去付款</button>
					</footer>
					
				</div>
			</section>
			
		</div>
		
		<!-- 待成团（无订单） -->
		<div v-show="isShowC">
			
			<!-- 每一个旅行单据 -->
			<section class="travel" v-for="(item,index) in orders">
				<div>
					<section @click="goIndentStateAll(index)">
						<header>
							<h1 class="fl" v-text="item.orgName">步履千寻旗舰店</h1>
							<van-icon name="arrow" class="fl icon_arrow"/>
							<h2 class="fr" v-text="type[index]" :class="{colorGray:item.status == 5 || item.status == 0}">待付款</h2>
						</header>
						
						<article>
							<h3 v-text="item.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h3>
							<p>套餐类型：{{ item.setMeal }}</p>
							<p class="cf">
								出行日期：{{ tripDate[index] }}
								<span class="fr">¥{{ item.realAmount }}</span>
							</p>
						</article>
					</section>
						
					<footer v-show="isFooter[index]">
						<img :src="it" v-if="isImg[index]" v-for="(it,ind) in item.imagePaths.slice(0,5)"/>
						<button class="gray" v-show="callOff[index]">取消订单</button>
						<button class="fr" v-text="sta[index]" v-show="isCX[index]" @click="goFriendGroupTeam(index)">去付款</button>
					</footer>
					
				</div>
			</section>
			
			<div class="not_indent" v-show="orders.length == 0">
				<img src="../../assets/order_btn_null@2x.png"/>
				<p>暂无订单记录！</p>
			</div>
			
		</div>
		
		<!-- 待出行 -->
		<div v-show="isShowD">
			
			<!-- 每一个旅行单据 -->
			<section class="travel" v-for="(item,index) in orders">
				<div>
					<section @click="goIndentStateAll(index)">
						<header>
							<h1 class="fl" v-text="item.orgName">步履千寻旗舰店</h1>
							<van-icon name="arrow" class="fl icon_arrow"/>
							<h2 class="fr" v-text="type[index]" :class="{colorGray:item.status == 5 || item.status == 0}">待付款</h2>
						</header>
						
						<article>
							<h3 v-text="item.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h3>
							<p>套餐类型：{{ item.setMeal }}</p>
							<p class="cf">
								出行日期：{{ tripDate[index] }}
								<span class="fr">¥{{ item.realAmount }}</span>
							</p>
						</article>
					</section>
					
					<footer v-show="isFooter[index]">
						<img src="../../assets/touxiang.png" v-if="isImg[index]"/>
						<button class="gray" v-show="callOff[index]">取消订单</button>
						<button class="fr" v-text="sta[index]" v-show="isCX[index]">去付款</button>
					</footer>
					
				</div>
			</section>
			
		</div>
		
		<!-- 待评价 -->
		<div v-show="isShowE">
			
			<!-- 每一个旅行单据 -->
			<section class="travel" v-for="(item,index) in orders">
				<div>
					<section @click="goIndentStateAll(index)">
						<header>
							<h1 class="fl" v-text="item.orgName">步履千寻旗舰店</h1>
							<van-icon name="arrow" class="fl icon_arrow"/>
							<h2 class="fr" v-text="type[index]" :class="{colorGray:item.status == 5 || item.status == 0}">待付款</h2>
						</header>
						
						<article>
							<h3 v-text="item.name">芝樱季热售 全国出发日本6-7天至尊有/拒签劝退/享受五星级住宿</h3>
							<p>套餐类型：{{ item.setMeal }}</p>
							<p class="cf">
								出行日期：{{ tripDate[index] }}
								<span class="fr">¥{{ item.realAmount }}</span>
							</p>
						</article>
					</section>
					
					<footer v-show="isFooter[index]">
						<img src="../../assets/touxiang.png" v-if="isImg[index]"/>
						<button class="gray" v-show="callOff[index]">取消订单</button>
						<button class="fr" v-text="sta[index]" v-show="isCX[index]" @click="goComment(index)">去付款</button>
					</footer>
					
				</div>
			</section>

		</div>
		
	</div>
</template>

<script>
import { Dialog } from 'vant';

export default {
	components:{
		
	},
	data() {
		return {
			//顶部Tab切换部分的；
			navList:["全部","待付款","待成团","待出行","待评价"],
			num:0,
			isShowA:true,
			isShowB:false,
			isShowC:false,
			isShowD:false,
			isShowE:false,
			
			//每一个旅行单据部分的；
			isImg:[],
			orders:[],
			tripDate:[],
			sta:[],
			isCX:[],
			type:[],
			callOff:[],
			Id:[],  //子订单ID，支付订单时必须;
			orderId:[], //取消订单的orderId；
			orgId:[], //机构店铺id；
			spuId:[],  //评价用的id；
			groupId:[],
			isFooter:[],
			
		}
	},
	created() {
		
		//首次载入数据接口；
		this.OrderList(99); //全部；
		
	},
	mounted() {
		
	},
	methods: {
		//点击全部那栏的btn(左边的)；
		clickL_type(index){
			//判断是点击哪个类型，是去付款还是填写出行人等等；
			if (this.orders[index].status == 1) { //去付款；
				console.log(this.Id[index])
				this.OrderUpdate(index,1,true);			
				console.log('点击取消订单')
			} 
		},
		
		//点击全部那栏的btn(右边的)；
		clickR_type(index){						
			//判断是点击哪个类型，是去付款还是填写出行人等等；
			if (this.orders[index].status == 1) { //去付款；
				this.goPayment(index);
				
				console.log('点击去付款')
			} else if (this.orders[index].status == 2) { //邀请好友拼团;
				this.goFriendGroupTeam(index);
				
				console.log('点击邀请好友拼团')
			} else if (this.orders[index].status == 4) { //立即点评;
				this.goComment(index);
				
				console.log('点击立即点评')
			} else if (this.orders[index].status == 6) { //填写出行人;
				this.goIndentState(index,6);
				
				console.log('点击填写出行人')
			}
		},
		
		//订单更新；
		//a=1是取消订单（未支付）,2是删除订单（已完成和已取消）;
		OrderUpdate(index,a,onoff){
			//再次提醒用户是否取消订单；

			this.$dialog.confirm({
		      message: '确定取消订单？'
		    }).then(() => {
			  	// on confirm
			  	let ordObj = {
					'a':a,
					orderId:this.Id[index]
				};			
				console.log(this.Id[index])
				
				this.$Api.Shop.OrderUpdate(ordObj).then( res => {
					console.log(res)
					
					if(res.q.s == 0){
						//判断点击取消订单进来的是全部还是待付款区域；
						if (onoff) { //是等于全部；
							this.OrderList(99);
						}else{ //是等于待付款；
							this.OrderList(1);
						}
					}
				});
			  	console.log('确认')
			}).catch(() => {
			  	// on cancel
			 	 console.log('取消')
			});
		},
		
		//点击去付款，跳转待支付页面；
		goPayment(index){
			console.log(this.Id[index],'子订单id')
			this.$router.push({  
				name: "IndentState",
				query: {
					orderId:this.Id[index],
					type:1
				}
			})
		},
		
		//订单列表;
		//a=1待支付；2待成团;3待出行；4.待评价   99全部;
		OrderList(a){
			let ordObj = {
				'a':a
			};
			
			//每次重新调用接口时，先清空已有的数据,让他重新排序顺序；
			this.type = []; 
			this.sta = [];
			this.isCX = [];
			this.callOff = [];
			this.isImg = [];
			this.orderId = [];
			this.Id = [];
			this.orgId = [];
			this.spuId = [];
			this.groupId = [];
			this.isFooter = [];
			this.orders = [];
			this.tripDate = [];
			
			this.$Api.Shop.OrderList(ordObj).then( res => {
				console.log(res)
				
				this.orders = [...res.q.orders];
				
				this.orders.forEach( item => {
					
					let arr = [...item.imagePaths.slice(0,5)];
					item.imagePaths=[];
					for (let i=0;i<arr.length;i++) {
						if (arr[i] == '') {
							arr[i] = require('../../assets/my_icon_default_avatar@2x.png');
							//console.log('数组头像有空',arr[i])
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
                    	item.imagePaths.push(arr[i])
					}
					
					this.Id.push(item.id); //子订单id；
					this.orderId.push(item.orderId); //取消订单的orderId；
					this.orgId.push(item.orgId); //机构店铺id；	
					this.spuId.push(item.spuId);  //评价用的id；
					this.groupId.push(item.groupId);
					
					let year = new Date(item.tripDate).getFullYear(),  //年；
						mon = new Date(item.tripDate).getMonth()+1,  //月；
						da = new Date(item.tripDate).getDate(),  //日；
						tDate = year+ '-' +mon+ '-' +da;
						
					//console.log(tDate)
					this.tripDate.push(tDate);
					
					//判断订单类型是哪个状态,status=0是已取消状态（交易关闭）；
					//订单状态 : 0取消;1待支付；2待成团;3待出行；4.待评价5 拼团失败 6 免单待完善资料  8完成，13.售后申请中，14.初审通过 15 售后退款成功 16售后被驳回;
					if (item.status == 1) { //待支付；
						this.sta.push('去付款');
						this.isCX.push(true);
						this.type.push('待支付'); 
						this.callOff.push(true);
						this.isImg.push(false);
						this.isFooter.push(true);
					} else if (item.status == 2) { //待成团;
						this.sta.push('邀请好友拼团');
						this.isCX.push(true);
						this.type.push('待成团');
						this.callOff.push(false);
						this.isImg.push(true);
						this.isFooter.push(true);	
					}else if (item.status == 3) { //待出行;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('待出行');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if (item.status == 4) { //待评价;
						this.sta.push('立即点评');
						this.isCX.push(true);
						this.type.push('待评价');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(true);
					}else if (item.status == 5) { //拼团失败;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('拼团失败');
						this.callOff.push(false);
						this.isImg.push(true);
						this.isFooter.push(false);
					}else if (item.status == 6) { //免单待完善资料;
						this.sta.push('填写出行人');
						this.isCX.push(true);
						this.type.push('免单待完善资料');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(true);
					}else if (item.status == 8) { //交易完成;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('交易成功');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if (item.status == 13) { //售后申请中;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('售后申请中');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if (item.status == 14) { //初审通过 ;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('售后申请中');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if (item.status == 0) { //已取消状态（交易关闭） ;
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('交易关闭');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if(item.status == 15){ //售后退款成功；
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('售后退款成功');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}else if(item.status == 16){ //售后被驳回；
						this.sta.push('');
						this.isCX.push(false);
						this.type.push('售后被驳回');
						this.callOff.push(false);
						this.isImg.push(false);
						this.isFooter.push(false);
					}
				})
				
				console.log(this.type)
//				console.log(this.sta)
//				console.log(this.callOff)
//				console.log(this.isCX)
			})
			
		},
		
		click_nav(index){
			//判断控制显示哪个布局；
			this.num = index;
			
			if (index == 0) { //显示全部；
				this.isShowA = true;
				
				this.isShowB = false;
				this.isShowC = false;
				this.isShowD = false;
				this.isShowE = false;
				
				this.OrderList(99); //全部；
			} else if(index == 1){ //显示代付款；
				
				this.isShowB = true;
				
				this.isShowA = false;
				this.isShowC = false;
				this.isShowD = false;
				this.isShowE = false;
				
				this.OrderList(1); //待付款；
			} else if(index == 2){ //显示待成团；
				
				this.isShowC = true;
				
				this.isShowB = false;
				this.isShowA = false;
				this.isShowD = false;
				this.isShowE = false;
				
				this.OrderList(2); //待成团；
			} else if(index == 3){ //显示待出行；
				
				this.isShowD = true;
				
				this.isShowB = false;
				this.isShowC = false;
				this.isShowA = false;
				this.isShowE = false;
				
				this.OrderList(3); //待出行；
			} else if(index == 4){ //显示待评价；
				
				this.isShowE = true;
				
				this.isShowB = false;
				this.isShowC = false;
				this.isShowD = false;
				this.isShowA = false;
				
				this.OrderList(4); //待评价；
			}
		},
		
		//跳转立即评价页面；
		goComment(index){
			this.$router.push({  
				name: "OffHandComment",
				query: {
					spuId:this.spuId[index],
					orderId:this.Id[index]
				}
			})
		},
		
		//跳转邀请好友拼团页面；
		goFriendGroupTeam(index){
			console.log(this.groupId[index],this.orderId[index],this.orgId[index])
//			console.log(index,this.orderId,this.orgId)
			
			this.$router.push({  
				name: "FriendGroupTeam",
				query: {
					ID:this.groupId[index], //拼团id；
					id:this.orderId[index], 
					orgId:this.orgId[index]  	
				}
			})
		},
		
		//跳转订单详情页面；
		//typeding:1待支付；2待成团;3待出行；4.待评价；5 拼团失败 ；6 免单待完善资料；  8交易完成；10.售后申请中；11.售后退款成功 ；
		goIndentState(index,typeding){
			
			this.$router.push({  
				name: "IndentState",
				query: {
					orderId:this.Id[index],
					type:typeding    //用来判断从哪跳进我的订单状态页面的；
					
				}
			})
			
		},
		
		goIndentStateAll(index){
			let typeding;
			
			if (this.type[index] == '待支付') {
				typeding = 1;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '待成团') {
				typeding = 2;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '待出行') {
				typeding = 3;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '待评价') {
				typeding = 4;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '拼团失败') {
				typeding = 5;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '免单待完善资料') {
				typeding = 6;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '交易完成') {
				typeding = 8;
				this.goIndentState(index,typeding);
				
			} else if (this.type[index] == '售后申请中') { //售后申请中包括：13和14（初审通过）；
				typeding = 13;
				this.goIndentState(index,typeding);
			}
			else if (this.type[index] == '售后退款成功') {
				typeding = 15;
				this.goIndentState(index,typeding);
			}
			
		},
		
	},
}	
	
</script>

<style>
/*Vant-UI组件弹出框*/
.van-dialog__content .van-dialog__message{
	line-height: 2rem;
	text-align: center;
}

.van-dialog__confirm,.van-dialog__cancel{
	background:rgba(250,220,89,0.6) !important;
}	
.van-dialog__cancel{
	border-right: 0.02rem solid #eee !important;
}
.van-button__text{
	color: #333;
}
</style>
<style scoped lang="less">
h1{margin: 0 0 !important;}

/*我的订单样式*/	
.MyIndent{
	
	/*tab切换导航栏样式*/
	nav{
		height: 0.95rem;
		border-bottom: 1px solid #ccc;
		box-sizing: border-box;
		ul{
			width: 100%;
			height: 100%;
			li{
				float: left;
				width:20%;
				height:100%;
				line-height: 0.95rem;
				text-align: center;
				a{
					font-size:0.3rem;
					font-family:PingFang-SC-Medium;
					color: #999;
				}
			}
		}
	} 
	
	/*tab切换导航栏内容样式*/
	
	/*代付款样式*/
	.stay_payment{
		background: #fff;
		
		
		
	}
	
	/*待成团（无订单）样式*/
	.not_indent{
		
		width: 100%;
		height: 100%;
		background: #f9f9f9;
		position: relative;
		img{
			width:2.8rem;
			height:2.8rem;
			position: absolute;
			top: 3.7rem;
			left: 2.35rem;
		}
		p{
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			color:rgba(153,153,153,1);
			line-height:0.24rem;
			position: absolute;
			top: 6.8rem;
			left: 3rem;
		}
		
	}
	
}	
	
</style>
<style scoped lang="less">
/*该页面相同的样式*/
.travel4{height: 3.3rem !important;}
.travel4_bor{border-bottom: none !important;}

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

/*显示tab切换导航栏内容样式*/
.active_fontC{
	color: rgba(250,220,86,1) !important;
	border-bottom: 3px solid rgba(250,220,86,1);
	height: 0.95rem;
	display: inline-block;
}

/*每一个旅行的单据样式*/
.travel{
	width: 100%;
	/*height: 4.25rem;*/
	background: #ededed;
	border-bottom: 0.15rem solid #ededed;
	div{
		/*height: 4.1rem;*/
		padding: 0 0.24rem;
		box-sizing: border-box;
		background: #fff;
		header{
			height: 0.9rem;
			border-bottom: 1px solid #ededed;
			line-height:0.9rem;
			h1{
				height: 100%;
				font-size:0.24rem;
				font-family:PingFang-SC-Regular;
				color:rgba(102,102,102,1);
				
				padding-right: 0.17rem;
			}
			.icon_arrow{
				height: 100%;
				line-height:0.9rem;
				font-size: 0.22rem;
			}
			h2{
				height: 100%;
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				color:rgba(246,50,62,1);
				/*line-height:0.9rem;*/
			}
			
		}
		
		article{
			height: 2.35rem;
			padding-top: 0.1rem;
			box-sizing: border-box;
			position: relative;
			h3{
				font-size:0.3rem;
				font-family:PingFang-SC-Bold;
				font-weight: 600;
				color:rgba(51,51,51,1);
				line-height:0.5rem;
			}
			p{
				font-size:0.24rem;
				font-family:PingFang-SC-Regular;
				color:rgba(102,102,102,1);
				line-height:0.5rem;
				position: absolute;
				left: 0;
			}
			p:nth-of-type(1){
				bottom: 0.8rem;
			}
			p:nth-of-type(2){
				bottom: 0.28rem;
				width: 100%;
				span{
					font-size:0.3rem;
					font-family:PingFang-SC-Medium;
					color:rgba(246,50,62,1);
					line-height:0.5rem;
				}
			}
		}
		
		footer{
			width: 100%;
			height: 0.85rem;
			border-top: 1px solid #ededed;
			padding-top: 0.12rem;
			box-sizing: border-box;
			text-align: right;
			position: relative;
			img{
				width: 0.4rem;
				height: 0.4rem;
				border-radius: 50%;
				top: 0.24rem;
				position: absolute;
			}
			img:nth-of-type(1){left: 0;}
			img:nth-of-type(2){left: 0.3rem;}
			img:nth-of-type(3){left: 0.6rem;}
			img:nth-of-type(4){left: 0.9rem;}
			img:nth-of-type(5){left: 1.2rem;}
			img:nth-of-type(6){left: 1.5rem;}
			img:nth-of-type(7){left: 1.8rem;}
			img:nth-of-type(8){left: 2.1rem;}
			button{
				/*width:1.4rem;*/
				height:0.6rem;
				padding: 0 0.2rem;
				background:rgba(250,220,89,1);
				outline: none;
				border: none;
				font-size:0.24rem;
				font-family:PingFang-SC-Medium;
				color:rgba(26,26,26,1);
				line-height:0.5rem;
				
			}
		}
		
	}
}

.gray{margin-right: 0.25rem;border: 0.01rem solid rgba(102,102,102,1) !important;background: #fff !important;color:rgba(102,102,102,1) !important;box-sizing: border-box !important;}
.colorGray{color:rgba(102,102,102,1) !important;}
</style>

