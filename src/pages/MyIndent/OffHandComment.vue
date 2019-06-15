<template>
	<div class="offHandComment">
		<!-- 立即评论页面 -->

		<section>
			<div class="grade cf">
				<span class="fl">描述相符</span>
				<van-rate v-model="value1" class="fl"  :size="20"/>
			</div>
			<div class="grade cf">
				<span class="fl">行程安排</span>
				<van-rate v-model="value2" class="fl"  :size="20"/>
			</div>
			<div class="grade cf">
				<span class="fl">旅行交通</span>
				<van-rate v-model="value3" class="fl"  :size="20"/>
			</div>

			<footer>给这次旅行打个分吧~</footer>
		</section>

		<section>
			<div>
				<textarea placeholder="商品怎么样？说说你的看法吧~" maxlength="500" v-model="content"></textarea>
			</div>
		</section>

		<section>
			<h2>照片 ({{len}}/9)：</h2>
			<div class="imgs cf">
				<div v-for="item in imgList" v-if="len>0">
					<img :src="item.src" @click="showImg(item.src)"/>
					<span @click.stop="del(index)"></span>
				</div>

				<div @click="upload" v-if="len<9"></div>

			</div>
		</section>

		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer" @click="CommentSubmit">
			提交评价
		</footer>

	</div>
</template>

<script>
import { Rate,Toast } from 'vant';

export default {
	data() {
		return {
			//评分的初始值默认5星填满；
			value1: 5,
			value2: 5,
			value3: 5,
			content:'',
			id:this.$route.query.spuId,
			orderId:this.$route.query.orderId,
			//微信上传图片的；
			len:0,
			imgList:[],
			imgIdList:[], //imgID;
			uploadId:[],

		}
	},
	created() {



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
		//评论提交；
		CommentSubmit(){

			let subObj = {
				a:2,   //a是1 游记评论 2 商品评论 ;
		  		id:this.id,  //被评论的ID;
		  		imageIds:this.uploadId.join(","),  //图片id,多张用”,”隔开;
		  		content:this.content,   //评论内容;
		  		//评分（星星数）;
		  		starNum:(this.value1+this.value2+this.value3) / 3,
		  		orderId:this.orderId,
			};

			//判断售后原因是否为空；
			if (this.content == '') {
				Toast('商品怎么样？说说你的看法吧~'); //Vant插件请提示；
			} else{
				this.$Api.Shop.CommentSubmit(subObj).then( res => {
					console.log(res)

					if (res.q.s == 0) {
						Toast('发表评价成功');

						this.goMyIndent();
					}

				})
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
			var that = this
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
				count: 9 - that.len, // 默认9;
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有;
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有;
				success: function(res) {
					let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;

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
										src: response.q.files[i].path
									}
									that.imgList.push(obj)

								}
								that.len = that.imgList.length
								setTimeout(() => {
									that.$loading.clear()
								}, 500)

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

<style scoped lang="less">
/*立即评论页面样式*/
.offHandComment{
	background: #fff;

	section:nth-of-type(1){
		width: 100%;
		padding: 0.5rem 0.28rem 0 0.22rem;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		.grade{
			width: 100%;
			height: 0.54rem;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			padding-top: 0.1rem;
			margin-bottom: 0.55rem;
			span{
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				padding-right: 0.8rem;
			}
		}

		footer{
			width:100%;
			height:0.6rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(153,153,153,1);
			text-align: center;
			border-bottom: 1px solid rgba(221,221,221,1);
		}
	}

	section:nth-of-type(2){
		width: 100%;
		padding: 0 0.22rem;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		div{
			padding: 0.3rem 0;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			height:3.8rem;
			border-bottom: 1px solid rgba(221,221,221,1);
			textarea{
				width: 100%;
				resize: none;
				height:3.2rem;
				border: none;
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(153,153,153,1);
				line-height:0.4rem;
			}
		}
	}

	section:nth-of-type(3){
		width: 100%;
		padding: 0 0.22rem;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;

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
<style type="text/css">
/*Vant评分插件样式*/
.offHandComment .van-rate__item{
	margin-right: 0.55rem;
}
</style>
