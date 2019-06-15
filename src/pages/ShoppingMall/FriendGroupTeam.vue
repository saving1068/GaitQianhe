<!-- 商城支付成功邀请好友拼团页面 -->
<template>
	<div class="friendGroupTeam">

		<header class="header">
			<section @click="goShoppingMall">
				<img :src="imagePath"/>
				<p v-text="name">成都七天六夜豪华之旅，全景游赏印花泡温泉纯玩-暑期含往返税...</p>
				<p>套餐类型：{{ spec }}</p>
				<p>出行日期：{{ surplusTime }}</p>
				<p>拼团可省{{ save }}元</p>
				<p>¥<b v-text="price">1788</b>起</p>
			</section>

			<h1 class="cf">
				<!--<div>10天9晚</div>-->
				<div>认证商家</div>
				<div>出游保障</div>
			</h1>
		</header>

		<!-- 去分享 -->
		<section class="go_share">
			<header :class="list[0].images.length < 5 ? 'center' : ''">
				<div style="display: inline-block;position: relative;" v-for="(item,index) in list[0].images.slice(0,5)">
					<div class="spell_host">拼主</div>
					<img :src="item"/>
					<!--<img src="../../assets/touxiang1.png"/>
					<img src="../../assets/touxiang1.png"/>
					<img src="../../assets/touxiang1.png"/>
					<img src="../../assets/placeholder_80x80.png"/>-->
				</div>
				<span>···</span>
				<img src="../../assets/shop_img_wait_big@2x.png"/>
			</header>

			<p>仅剩<span v-text="list[0].surplusNum">1</span>个名额，剩余时间 <span>{{groupLists[0].isExpired ? groupLists[0].expiredDay : groupLists[0].expiredHour}}</span></p>

			<div>
				<button @click="goShare">去分享</button>
			</div>
		</section>

		<header class="h_same_css">
			猜你喜欢
			<img src="../../assets/line-left.png"/>
			<img src="../../assets/line-right.png"/>
		</header>

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

		<!-- 你看到我的底线了 -->
		<div class="line_bottom">
			你看到我的底线了
			<img src="../../assets/lineB-left.png"/>
			<img src="../../assets/lineB-right.png"/>
		</div>

		<!-- 底部占位 -->
		<footer class="footer_place"></footer>
		<!-- 固定底部 -->
		<ul class="footer cf">
			<li>
				<div class="share_bg" @click="goShare" v-text="shareNum">121</div>
			</li>
			<li>
				<div class="index_bg" @click="goShoppingMall">首页</div>
			</li>
		</ul>


		<!-- 点击底部分享图标 -->
		<div class="share_icon" v-show="isShare">
			<div><p>分享给更多伙伴</p>点击右上角<b>···</b>分享</div>
			<img src="../../assets/common_btn_close@2x.png" @click="goShare"/>
		</div>

	</div>
</template>

<script>

export default {
	data() {
		return {
			ID:this.$route.query.ID,
			isShare:false,
			goodses:[],
			spuId:[],
			groupId:null,
			ob:this.$route.query.ob,
			id:this.$route.query.id,
			orderId:this.$route.query.orderId,
			orgId:this.$route.query.orgId,
			list:[],
			groupLists:[], //和倒计时要搭配使用的；
			expiredHour:[], //热门拼团商品倒计时；
			goState:this.$route.query.goState, //从我的订单状态页面的 点击 ‘去邀请’ 跳转过来的；
			shareNum:0, //分享数；
			SpuId:0,
			imagePath:null,
			name:'',
			spec:null,
			placeDate:null,
			save:null,
			price:null,
			surplusTime:null,
		}
	},
	created() {
		this.PayOkSubmit(); //邀请好友；
		this.GoodsList3(); //商品推荐列表；

		if (this.goState == 0) { //是从我的订单状态页面的 点击 ‘去邀请’ 跳转过来的，就打开右上角的分享；
			this.isShare = true;
		}

	},
	mounted() {

	},
	methods: {
		 shareInfo() {
				let that = this;
				let url = window.location.protocol + "//" +
					window.location.host + window.location.pathname +
					"?#/EmptyPage?name=FriendGroupTeam&shareId=" +
					this.$store.state.Home.user.id +"&id=" + this.$route.query.id+"&orgId="+this.$route.query.orgId+"&groupId="+this.$route.query.groupId;
				console.log(url)
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
					timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
					nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
					signature: this.$store.state.config.signature, // 必填，签名
					jsApiList: ["updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
				});
				wx.ready(function() { //需在用户可能点击分享按钮前就先调用

					if(wx.onMenuShareAppMessage) {
						wx.onMenuShareAppMessage({
							title: `[仅剩${that.list[0].surplusNum}个名额]${that.list[0].name}` , // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							type: 'link', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function(res) {

								that.shareSuccess()
								//     	that.shareSuccess()
								// 设置成功
							}
						});
					} else {
						wx.updateAppMessageShareData({
							title:`仅剩${that.list[0].surplusNum}个名称${that.list[0].name}`, // 分享标题
							desc: '步履千行', // 分享描述
							link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
							success: function(res) {
								// 用户点击了分享后执行的回调函数
								// console.log(res+"onMenuShareAppMessage")

							}
						})
					}
				});
			},
			shareSuccess() {
				this.$Api.Common.ShareTask({
					a: 10,
					id: this.groupId
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.$toast("分享成功", "success")
					}
				})

			},
		//邀请好友；
		async PayOkSubmit(){
			console.log('this.ID',this.ID)
			if (this.ID == undefined) {
				let obj = {
					groupId:0,  //没有就传0，默认后台定死的；
					id:this.id
				};
				console.log('obj.groupId(ID == undefined)',obj.groupId)
				this.PayOkSubmiting(obj)
			} else{
				let obj = {
					groupId:this.ID,
					id:this.id
				};
				console.log('obj.groupId(ID !== undefined)',obj.groupId)

				this.PayOkSubmiting(obj)
			}
		},

		PayOkSubmiting(obj){
			this.$Api.Shop.PayOkSubmit(obj).then( res => {
				console.log(res,'PayOkSubmit接口')

				this.list = [...res.q.list];
				this.groupId = res.q.groupId;
				this.shareNum = res.q.shareNum;

			if(res.q.list.length>0){
				this.SpuId = res.q.list[0].spuId;
				this.name = res.q.list[0].name;
				this.spec = res.q.list[0].spec;
				this.placeDate = res.q.list[0].placeDate;
				this.surplusTime = res.q.list[0].surplusTime.slice(0,11);
				this.save = res.q.list[0].save;
				this.price = res.q.list[0].price;
				if (res.q.list[0].imagePath != '') {
					this.imagePath = res.q.list[0].imagePath;
				}
				this.list.forEach( item => {
					let arr = [...item.images.slice(0,5)];
					item.images=[];
                    for(let i=0;i<arr.length;i++){
                    	if (arr[i] == '') {
							arr[i] = require('../../assets/my_icon_default_avatar@2x.png');
							//console.log('数组头像有空',arr[i])
						}else{
							arr[i] = arr[i];
						}
						
						//判断图片的长度大于1和小于5(不等于5)时，加多一张默认问号的头像；
//						if (arr.length >= 1 && arr.length < 5) {
//							//判断已经加过一张默认问号的头像就不添加了；
//							if (arr.indexOf( require('../../assets/shop_img_wait_big@2x.png') ) > -1 ) {
//								console.log('已有该图片了')
//							} else{
//								let img = require('../../assets/shop_img_wait_big@2x.png');
//								arr.push(img)
//							}
//						}
                    	item.images.push(arr[i])
                    }
				})
				
				//倒计时；
				let obj= {...res.q.list[0]};
				//console.log(obj)
				let arr = obj.expiredHour.split(':');  //通过数据格式是24:08:28，以“ : ”来分割成数组为[24,08,28]；
				//console.log(arr)
				obj.timer=null;  //先定义个关闭定时器；
				obj.totalSecond = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2]); //先把活动目标时间转化为总秒数；
				obj.isExpired = false; //先给个状态默认值；
				this.groupLists.push(obj)
				//console.log(this.groupLists)

				this.groupLists.forEach( item => {
					this.expiredHour.push(item.expiredHour);  //这里还要再次重数组里添加expiredHour；
				})

				//再次成功挂载DOM元素后，才能再来使用；
				this.$nextTick(()=>{
					this.changeDate();  //拼团倒计时；
				})
			}
				this.shareInfo()
			})
		},

		//拼团倒计时；
		changeDate(){

			this.groupLists.forEach( item => {
				//console.log(item.timer)
				console.log(item)
				
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
					//这个是  <= 24小时，才倒计时的，格式：时:分:秒；
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
						iHour=parseInt(total/3600);  //时；
						total%=3600;
	
						iMin=parseInt(total/60);  //分；
						total%=60;
	
						iSec=total;
						//console.log(iHour,iMin,iSec)
						item.isExpired = false; //格式：时:分:秒；的状态；
						item.expiredHour=iHour+":"+iMin+":"+iSec;
					},1000)
					console.log('24小时之内')
				}				
			})

		},

		//商品列表协议接口；
		GoodsList3(){

			let GodObj = {
				a:3, //店铺推荐;
				'ob':this.ob,
				'orgId':this.orgId, //机构id,自营的店铺orgId=1;
			};

			this.$Api.Shop.GoodsList(GodObj).then( res => {
				console.log(res)
				this.goodses = [...res.q.goodses];

				this.goodses.forEach( item => {
					this.spuId.push(item.spuId)
				})
				console.log(this.goodses,this.spuId)
			})

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

		//跳转商城首页页面；
		goShoppingMall(){

			this.$router.push({
				name: "ShoppingMallDetails",
				query: {
					'spuId':this.SpuId
				}
			})

		},

		//控制去分享（显示）；
		goShare(){
			this.isShare = !this.isShare;
		},

	},
}

</script>

<style scoped lang="less">
.center{text-align: center !important;}
/*该商城支付成功要求好友拼团页面样式*/
.friendGroupTeam{
	background: #fff;

	.header{
		padding: 0.25rem 0.25rem 0;
		box-sizing: border-box;
		border-bottom: 0.15rem solid #ededed;
		section{
			width: 100%;
			height: 2.25rem;
			border-bottom: 1px solid #ccc;
			position: relative;

			img{
				width:2rem;
				height:1.99rem;
				position: absolute;
				top: 0;
				left: 0;
				border: 1px solid #ccc;
			}

			p{
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				font-weight:400;
				color:rgba(102,102,102,1);
				position: absolute;
			}
			p:nth-of-type(1){
				top: 0.1rem;
				left: 2.3rem;
				width:4.76rem;
				font-size:0.26rem;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:0.36rem;
				display: -webkit-box;
				overflow: hidden;
			    -webkit-box-orient: vertical;
			    -webkit-line-clamp: 2;
			}
			p:nth-of-type(2){
				top: 0.95rem;
				left: 2.3rem;
				width:4.5rem;
				white-space:nowrap;text-overflow:ellipsis;overflow:hidden;
			}
			p:nth-of-type(3){
				top: 1.35rem;
				left: 2.3rem;
			}
			p:nth-of-type(4){
				bottom: 0.2rem;
				left: 2.3rem;
			}
			p:nth-of-type(5){
				bottom: 0.2rem;
				right: 0.05rem;
				color:rgba(246,50,62,1);
				b{
					font-size:0.36rem;
				}
			}

		}

		h1{
			height: 0.9rem;
			div{
				height: 100%;
				line-height: 0.9rem;
				float: left;
				font-size:0.22rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);

			}
			div:nth-of-type(1),div:nth-of-type(3){
				width: 2.05rem;
				text-indent: 0.68rem;
				background: url(../../assets/shop_img_check@2x.png) no-repeat 0.25rem 0.32rem;
				background-size: 0.28rem;
			}
			div:nth-of-type(2){
				width: 3.15rem;
				text-align: center;
				background: url(../../assets/shop_img_check@2x.png) no-repeat 0.7rem 0.32rem;
				background-size: 0.28rem;
			}
			div:nth-of-type(3){
				width: 1.8rem;
			}

		}

	}


	/*去分享样式*/
	.go_share{
		border-bottom: 0.15rem solid #ededed;
		padding: 0 0.25rem;
		box-sizing: border-box;
		header{
			width: 100%;
			height: 1.4rem;
			padding-top: 0.3rem;
			box-sizing: border-box;
			position: relative;
			span{font-size: 0.6rem;display: inline-block;color: #999;vertical-align: middle;}
			img{
				width:0.8rem;
				height:0.8rem;
				border-radius:50%;
				margin-left: 0.2rem;
			}
			img:nth-of-type(1){margin-left: 0;}
			.spell_host{
				width:0.45rem;
				height:0.25rem;
				background:rgba(255,243,187,1);
				font-size:0.16rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				text-align: center;
				border: 1px solid #fff;
				border-radius: 0.05rem;
				position: absolute;
				top: 0.75rem;
				left: 0.2rem;
			}
		}

		p{
			height: 0.8rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
			text-align: center;
			span{color: #F6323E;}
		}

		div{
			height: 1rem;
			text-align: center;
			button{
				width:3.87rem;
				height:0.68rem;
				background:rgba(250,220,86,1);
				border-radius:0.05rem;
				outline: none;
				border: none;
			}
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

			p:nth-of-type(1){
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:0.34rem;
				padding: 0.15rem 0.05rem 0.25rem;
			}

			p:nth-of-type(2){
				width: 100%;
				position: absolute;
				bottom: 0.1rem;
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

		.travel_one:nth-of-type(odd){
			margin-right: 0.15rem;
		}

	}

}

/*固定底部和占位样式*/
.footer_place{
	height: 0.9rem;
}
.footer{
	width: 100%;
	height: 0.9rem;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	background: #fff;
	border-bottom: 0.02rem solid #eee;
	box-sizing: border-box;
	li{
		width: 50%;
		height: 100%;
		float: left;
		div{
			width: 1rem;
			height: 1rem;
			margin: auto;
			font-size:0.2rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			line-height:1.3rem;
			text-align: center;
		}

		.share_bg{background: url(../../assets/shop_btn_share@2x.png) no-repeat 0.3rem 0.05rem;background-size: 0.4rem;}
		.index_bg{background: url(../../assets/shop_btn_home@2x.png) no-repeat  0.3rem 0.05rem;background-size: 0.4rem;}
	}


}

/*点击底部分享按钮样式*/
.share_icon{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 200;
	background: rgba(0,0,0,0.8) url(../../assets/shaer1.png) no-repeat 5.9rem 0.1rem;
	background-size: 1.27rem 1.6rem;
	div{
		width:3.9rem;
		font-size:0.46rem;
		font-family:PingFang-SC-Medium;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:0.6rem;
		position: absolute;
		left: 2rem;
		top: 1.6rem;
		p{text-align: center;}
	}
	img{
		position: absolute;
		bottom: 1.5rem;
		left: 3.25rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #fff;
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

/*你看到我的底线了样式*/
.line_bottom{
	width: 100%;
	height: 0.9rem;
	position: relative;
	text-align: center;
	line-height: 0.9rem;
	font-size:0.18rem;
	font-family:PingFang-SC-Medium;
	font-weight:500;
	color:rgba(204,204,204,1);
	img{
		width:2.38rem;
		height: 0.02rem;
		position: absolute;
		top: 0.4rem;
	}
	img:nth-of-type(1){
		left: 0.5rem;
	}
	img:nth-of-type(2){
		right: 0.5rem;
	}
}
</style>
