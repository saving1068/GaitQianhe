<template>
	<div class="afterApplication">
		<!-- 售后申请页面 -->

		<!-- 商品信息 -->
		<h1 class="cf">
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
			<p>金额抵扣：<em>-¥{{ order.goldAmount }}</em></p>
			<p>实付金额：<em>¥{{ order.realAmount }}</em></p>
			<p v-show="false">返利奖励：<em>¥389x6期</em></p>
		</section>

		<!-- 售后原因 -->
		<h1 class="cf">
			<span class="fl">售后原因</span>
		</h1>
		<div class="commodityTxt">
			<input type="text" placeholder="请选择售后原因" @click="click_bottomPicker" readonly ref="inputId"/>
			<header class="cf">
				<textarea placeholder="请输入售后原因" maxlength="200" v-model="content"></textarea>
				<footer class="fr">{{content.length}}/200</footer>
			</header>
			<h2>附件 ({{len}}/3)：</h2>
			<div class="imgs cf">
				<div v-for="item in imgList" v-if="len>0">
					<img :src="item.imagePath" @click="showImg(item.imagePath)"/>
					<span @click.stop="del(index)"></span>
				</div>

				<div @click="upload" v-if="len<3"></div>

				<!--<div>
					<span v-show="false"></span>
				</div>-->
			</div>
		</div>

		<!-- 底部选择器（Vant插件) -->
		<div class="bottomPicker" v-show="show">

			<van-picker
			  show-toolbar
			  :columns="columns"
			  @cancel="onCancel"
			  @confirm="onConfirm"
			  ref="pickerId"
			/>

		</div>

		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer" @click="RefundApplySubmit">
			提交申请
		</footer>

	</div>
</template>

<script>
import { Picker,Toast } from 'vant';

export default {
	data() {
		return {
			content:'',
			columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
			columnsId:[],
			show:false,
			typeId:null,
			orderId:this.$route.query.orderId,
			order:{},
			tripDate:'',
			id:null,

			//微信上传图片的；
			len:0,
			imgList:[], //img的src；
			imgIdList:[], //imgID;
			uploadId:[],


		}
	},
	created() {

		this.OrderDetails(); //订单详情；
		this.ReferenceItemList(); //退货原因列表;

	},
	mounted() {
		this.config();
	},
	computed:{
		getConfig(){
			return this.$store.state.config

		}
	},
	watch:{
		getConfig(a){
			if(JSON.stringify(this.$store.state.config)!=""){
				this.config()
			}
		}
	},
	methods: {
		//订单详情；
		OrderDetails(){
			let detObj = {
				orderId:this.orderId   //子订单id；
			};

			this.$Api.Shop.OrderDetails(detObj).then( res => {
				console.log(res)

				this.order = res.q.order;
				this.id = res.q.order.id;

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
			})
		},
		//退货原因列表;
		ReferenceItemList(){
			let refObj = {
				key:'returnreason' //key=returnreason 是后台定死的（不需改）；
			};

			this.$Api.Shop.ReferenceItemList(refObj).then(res => {
				console.log(res)

				let items = [...res.q.items];
				this.columns = [];
				this.columnsId = [];

				items.forEach( item => {
					this.columns.push(item.name);
					this.columnsId.push(item.id);
				});
			})
		},
		//确认；
		onConfirm(value, index) {
			//console.log(value, index)

			this.typeId = this.columnsId[index];
			this.$refs.inputId.placeholder = value;

			//console.log(this.typeId)

			this.show = !this.show;

			//console.log(this.columns,this.columnsId)
	      	//Toast(`当前值：${value}, 当前索引：${index}`);
	    },
	    //取消；
	    onCancel() {
	    	this.show = !this.show;
	      	//Toast('取消');
	    },
	    //点击底部选择器；
		click_bottomPicker(){
			this.show = !this.show;

			//console.log(this.$refs)
		},
		//退货原因;
		RefundApplySubmit(){

//			for (let i=0;i<this.imgList.length;i++) {
//				let imgObj = {};
//				imgObj.id = this.imgList[i].id;  //图片id;
//				imgObj.imagePath = this.imgList[i].src;  //图片路径;
//
//				this.imgArr.push(imgObj);
//			}
			console.log(this.imgList,'参数this.imgList')

			let subObj = {
				a:1,  //1退货;
		  		typeId:this.typeId,  //退货原因ID,请参考参照项列表ReferenceItemList?key=退货原因;
		  		content:this.content, //说明内容;
		  		subOrderId:this.id,  //子订单ID;
		  		orderId:this.orderId,  //订单ID;
		  		images:this.imgList //图片(最多三张) 格式：[{"id":1,"imagePath":src},{}]；
			};

			//同时判断两个（售后原因和选择售后原因）；
			if (this.content == '' && this.$refs.inputId.placeholder == '请选择售后原因') {
				Toast('选择和输入售后原因，不要忘了噢！');
			}else{
				//判断售后原因是否为空；
				if (this.content == '') {
					Toast('请输入售后原因'); //Vant插件请提示；
				}else if (this.$refs.inputId.placeholder == '请选择售后原因'){  //判断是否选择售后原因；
					Toast('请选择售后原因');
				}else{
					this.$Api.Shop.RefundApplySubmit(subObj).then(res => {
						console.log(res)

						if (res.q.s == 0) {
							Toast('提交申请成功');

							this.goMyIndent();
						}
					})
				}
			}
		},
		//跳转我的订单首页；
		goMyIndent(){
			this.$router.push({
				name: "MyIndent",
				query: {

				}
			})
		},

		//微信公众号上传图片和删除；
		showImg(src) {
			var that = this;
			//alert(src)
			var arr = []
			arr.push(src);
			wx.previewImage({
				current: src, // 当前显示图片的http链接
				urls: arr // 需要预览的图片http链接列表
			});
		},
		del(index){
			this.imgList.splice(index,1)
			this.len=this.imgList.length
			this.uploadId.splice(index,1)
		},
		config() {
			let that=this
			if(JSON.stringify(this.$store.state.config)!=""){
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: that.$store.state.config.appId, // 必填，公众号的唯一标识
					timestamp: that.$store.state.config.timestamp, // 必填，生成签名的时间戳
					nonceStr: that.$store.state.config.nonceStr, // 必填，生成签名的随机串
					signature: that.$store.state.config.signature, // 必填，签名
					jsApiList: ["chooseImage", "previewImage", "getLocalImgData","uploadImage"] // 必填，需要使用的JS接口列表
				});
            }
		},
		upload() {
			let that = this;
			this.imgIdList = [];

			wx.chooseImage({
				count: 3 - that.len, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

					that.uploaddata(localIds, localIds.length)
				}
			});

		},
		async uploaddata(arr, length) {
			var localId = arr.shift();
			var that = this
			this.$loading("上传中...")

			wx.uploadImage({
				localId: localId,
				isShowProgressTips: 0,
				success: function(res) {
					console.log(res)		
					that.imgIdList.push(res.serverId); // 返回图片的服务器端ID
					
					if(length == that.imgIdList.length) {
						var imgObj = {
							"ids": that.imgIdList.join(",")
						}
						that.$Api.Common.SaveWxwebImages(imgObj).then((response) => {
							//					alert(res)
							console.log(response)
							if(response.q.s == 0) {
								that.uploadId = that.uploadId.concat(response.q.ids)
								for(var i = 0; i < response.q.files.length; i++) {
									let obj = {
										imagePath: response.q.files[i].path,
										id:response.q.files[i].id
									}
									that.imgList.push(obj)
								}
								that.len = that.imgList.length
								setTimeout(() => {
									that.$loading.clear()
								}, 500)
								console.log(that.imgList,'上传图片后返回的that.imgList')
							}
						})

						//销毁数据

					}
					//其他对serverId做处理的代码
					if(arr.length > 0) {
						that.uploaddata(arr, length);
					}

				},
				error: function() {
					alert("asasasas");
				}
			});

		}

	},
}

</script>

<style type="text/css">
/*Vant插件样式*/
.afterApplication .bottomPicker{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 100;
	background: rgba(0,0,0,0.6);
}

.afterApplication .van-picker{
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0 !important;
}
</style>
<style scoped lang="less">
h1{margin: 0 !important;}
/*售后申请页面样式*/
.afterApplication{
	background: #fff;

	/*商品信息样式*/
	h1{
		height: 0.8rem;
		padding: 0.2rem 0.25rem 0;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
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
		padding: 0rem 0.25rem 0.1rem;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		border-bottom: 0.15rem solid #ccc;
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
			padding: 0 !important;
			line-height: 0.5rem !important;
			border-bottom: none !important;
			font-size:0.24rem !important;
			color:rgba(102,102,102,1) !important;
			em{
				padding-left: 1rem;
			}

		}

		p:nth-of-type(7),p:nth-of-type(8){
			color: #f6323e !important;
		}


	}

	/*商品信息*/
	.commodityTxt{
		padding: 0.15rem 0.6rem 0.4rem;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		width: 100%;
		input:nth-of-type(1){
			width:100%;
			height:0.88rem;
			border:1px solid rgba(153,153,153,1);
			border-radius:0.05rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(153,153,153,1);
			padding-left: 0.3rem;
			padding-right: 0.5rem;
			background: url(../../assets/common/common_btn_right@3x.png) no-repeat 5.9rem;
			background-size: 0.15rem;
			margin-bottom: 0.3rem;
		}
		header{
			width: 100%;
			height:2.04rem;
			border:1px solid rgba(153,153,153,1);
			border-radius:0.05rem;
			padding: 0.3rem 0.3rem 0;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			textarea{
				width: 100%;
				height: 1.14rem;
				border: none;
				resize: none;
				font-size:0.24rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(153,153,153,1);
			}
			footer{
				font-size:0.24rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(102,102,102,1);
			}
		}

		h2{
			width:100%;
			height:0.88rem;
			line-height: 0.88rem;
			font-size:0.26rem;
			font-family:FZLTHJW--GB1-0;
			font-weight:400;
			color:rgba(26,26,26,1);
		}
		.imgs{
			div{
				width:2rem;
				height:2rem;
				border:2px solid rgba(255,255,255,1);
				float: left;
				margin-right: 0.22rem;
				background: url(../../assets/common_btn_add@3x.png) no-repeat;
				background-size: 100%;
				position: relative;
				img{
					width:100%;
					height:100%;
				}
				span{
					position: absolute;
					right: 0;
					top: 0;
					width:0.4rem;
					height:0.4rem;
					background:rgba(0,0,0,1) url(../../assets/common_btn_close4@2x.png) no-repeat;
					background-size: 100%;
					opacity:0.4;
				}
			}
		}

	}

}


/*底部样式*/
.footer_equal{
	width: 100%;
	height: 0.98rem;
	/*background: pink;*/
}
.footer{
	width: 100%;
	height:0.98rem;
	background:rgba(250,220,86,1);
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 50;
	font-size:0.3rem;
	font-family:PingFang-SC-Medium;
	font-weight:500;
	color:rgba(26,26,26,1);
	text-align: center;
	line-height: 0.98rem;
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

em,i{font-style: normal;}
</style>
