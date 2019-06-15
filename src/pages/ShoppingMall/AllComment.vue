<!-- 商城首页-全部评论页面 -->
<template>
	<div class="allComment">
		
		<div class="allBox">
			<h1 class="cf">
				评价<i>({{ComTotal}})</i>
				<span class="fr">{{praiseInitial}}分</span>
			</h1>
			
			<section class="comment_type">
				<button v-for="(item,index) in comment_type" v-text="item" @click="click_com(index)" :class="{'com_bg': isCom == index}">全部</button>
			</section>
		</div>
		
		<!-- 有图的评价 -->
		<section class="yesImg" v-for="(item,index) in comments">
			
			<header>
				<img :src="item.imagePath"/>
				<p v-text="item.name">又是剪刀手</p>
				<p v-text="item.comTime">刚刚</p>
			</header>
			
			<div class="txt" v-text="item.content">服务很用心，真的是有任何问题，随时提问都会给你解答。司导也很负责，会根据实际情况或者会根据我们提出的要求合理安排行程。非常棒的一次旅行。</div>
			
			<div class="imgs" v-if="item.iamgeUrls.length != 0">
				<img :src="item" v-for="(item,index) in item.iamgeUrls" @click="showImg(item)"/>
				<span>共{{item.iamgeUrls.length}}张</span>
			</div>
		</section>
		
		<!-- 没图的 评价-->
		<!--<section class="noImg">
			
			<header>
				<img src="../../assets/touxiang40.png"/>
				<p>又是剪刀手</p>
				<p>2018.05.06 23:59</p>
			</header>
			
			<div class="txt">服务很用心，真的是有任何问题，随时提问都会给你解答。司导也很负责，会根据实际情况或者会根据我们提出的要求合理安排行程。非常棒的一次旅行。</div>
		</section>-->
		
	</div>
</template>

<script>

export default {
	data() {
		return {
			comment_type:['全部','有图'],
			imgs:[1,2,3,4],
			comments:[], //用户评论；
		    ComTotal:null, //用户评论总条数；
		    ComId:[], //用户评论ID；
		    isCom:0, //默认选择第一个；
		    praiseInitial:this.$route.query.praiseInitial, //获取评价的评分；
		    spuId:this.$route.query.spuId,
		    
		}
	},
	created() {
		this.CommentList(2,this.spuId,0); //评论列表(全部)；
	},
	mounted() {

	},
	methods: {
		//点击放大阅览图片；
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
		//点击评价；
		click_com(index){
			this.isCom = index;
			this.CommentList(2,this.spuId,index); //评论列表；
		},
		
		//评论列表；
		//a=2是商品评论；id=被评论的id；imageType=0是无限制，=1有图，=2无图片；
		CommentList(a,id,imageType){
			let comObj = {
				'a':a,
			  	'id':id,   //被评论的ID；
			  	'imageType':imageType
			};
			
			this.$Api.Shop.CommentList(comObj).then( res => {
				console.log(res)
				
				this.comments = [...res.q.comments];
				this.ComTotal = res.q.total;
				
				this.comments.forEach( (item) => {
					this.ComId.push(item.id)
					
					//判断用户评论的用户没有头像时，添加个步履千寻（猴子）的默认头像；
					if (item.imagePath == '') {
						item.imagePath = require('../../assets/my_icon_default_avatar@2x.png');
					}
				});
				//console.log(this.ComId)
			})
		},
		
	},
}

</script>

<style scoped lang="less">
h1{margin: 0 !important;}
/*该商城-全部评论页面样式*/
.allComment{
	background: #fff;
	
	.allBox{
		padding: 0 0.25rem;
		box-sizing: border-box;
		border-bottom: 0.2rem solid rgba(237,237,237,1);
	}
	
	h1{
		height: 1rem;
		border-bottom: 1px solid #ccc;
		font-size:0.3rem;
		font-family:PingFang-SC-Bold;
		font-weight:bold;
		color:rgba(51,51,51,1);
		line-height:1rem;
		i{font-style: normal;}
		span{
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(255,84,84,1);
		}
	}
	
	.comment_type{
		height: 1.25rem;
		padding-top: 0.3rem;
		box-sizing: border-box;
		button{
			width:1.64rem;
			height:0.8rem;
			background:rgba(249,249,249,1);
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			margin-right: 0.14rem;
			margin-bottom: 0.15rem;
		}
		
		button:nth-of-type(4n){
			margin-right: 0;
		}
		
	}
	
}

.com_bg{background: rgba(250,220,86,1) !important;}
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
	padding: 0;
}

/*有图的评价样式*/
.yesImg{
	padding-left:0.25rem;
	padding-right:0.25rem;
	box-sizing: border-box;
	border-bottom: 1px solid #ccc;
	padding-bottom: 0.4rem;
	header{
		width: 100%;
		height: 0.88rem;
		position: relative;
		img{
			position: absolute;
			left: 0;
			top: 0.25rem;
			width:0.4rem;
			height:0.4rem;
			border-radius:50%;
		}
		p{
			position: absolute;
			top: 0.28rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
		p:nth-of-type(1){
			left: 0.5rem;
		}
		p:nth-of-type(2){
			right: 0;
		}
	}
	
	.txt{
		width:7.02rem;
		font-size:0.28rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:0.4rem;
		padding-bottom: 0.4rem;
	}
	
	.imgs{
		width: 100%;
		/*height:1.26rem;*/
		position: relative;
		span{
			position: absolute;
			bottom: 0;
			right: 0;
			width:0.84rem;
			height:0.37rem;
			background:rgba(0,0,0,0.4);
			font-size:0.22rem;
			font-family:PingFang-SC-Light;
			color:rgba(255,255,255,1);
			text-align: center;
			line-height: 0.37rem;
			border-radius: 0.05rem 0 0 0;
		}
		img{
			width:1.68rem;
			height:1.26rem;
			margin-left: 0.08rem;
		}
		img:nth-of-type(1),img:nth-of-type(5),img:nth-of-type(9){margin-left: 0;}
	}
}

/*没图的评价样式*/
.noImg{
	border-bottom: 1px solid #ccc;
	header{
		width: 100%;
		height: 0.88rem;
		position: relative;
		img{
			position: absolute;
			left: 0;
			top: 0.25rem;
			width:0.4rem;
			height:0.4rem;
			border-radius:50%;
		}
		p{
			position: absolute;
			top: 0.28rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
		p:nth-of-type(1){
			left: 0.5rem;
		}
		p:nth-of-type(2){
			right: 0;
		}
	}
	
	.txt{
		width:7.02rem;
		font-size:0.28rem;
		font-family:PingFang-SC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:0.4rem;
		padding-bottom: 0.4rem;
	}
}
</style>