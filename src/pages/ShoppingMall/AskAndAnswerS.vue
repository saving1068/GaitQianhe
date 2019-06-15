<!-- 商城首页问答详情页面 -->
<template>
	<div class="ask_and_answerS">
		
		<!-- 每一个搜索的商品 -->
		<section class="seek_commodity" @click="goShoppingMall">
			
			<img :src="goodses.imagePath"/>
			<p v-text="goodses.name">成都七天六夜豪华之旅，全景游赏印花泡温泉纯玩-暑期含往返税...</p>
			<p>{{ goodses.dateNum }}天行程</p>
			<p class="cf">
				<span>¥<b v-text="goodses.price">1799</b>起</span>
				<span class="fr">月销{{ goodses.saleStat }}笔</span>
				<span class="fr">{{ goodses.praiseNum }}分</span>
			</p>
			
		</section>
		
		<header class="cf">
			<span class="fl">问</span>
			<b class="fl" v-text="queContent">这个景点是新建的吗我怎么上次没见过？？？？</b>
		</header>
		
		<!-- 回答区 -->
		<div class="answerS">
			
			<section v-for="(item,index) in answers">
				
				<h1 class="cf">
					<img :src="item.imagePath == ''?require('../../assets/my_icon_default_avatar@2x.png'):item.imagePath"/>
					<span v-text="item.name">又是剪刀手</span>
					<span v-show="item.isAuthor == 1">商家</span>
					<span v-show="item.isMe == 1">我</span>
					<span class="fr" v-text="item.date == '0分钟'?'刚刚':item.date">刚刚</span>
				</h1>
				
				<p v-text="item.content">推荐入住当地的民宿费用比较便宜环境也不错，但是经济允许还是去4星旅店</p>
				
				<div class="cf">
					<!--<button class="fr btn_bg">有用122</button>-->
					<button class="fr" :class="{'btn_bg': item.isPraise == 1}" @click="click_you(index)">有用<span v-text="item.userfulNum" v-show="item.userfulNum != 0"></span></button>
				</div>
				
			</section>
			
			<!--<section>
				
				<h1 class="cf">
					<img src="../../assets/touxiang40.png"/>
					<span>又是剪刀手</span>
					<span>作者</span>
					<span class="fr">刚刚</span>
				</h1>
				
				<p>推荐入住当地的民宿费用比较便宜环境也不错，但是经济允许还是去4星旅店</p>
				
				<div class="cf">
					<button class="fr">有用122</button>
					<button class="fr">有用</button>
				</div>
				
			</section>-->
			
		</div>
		
		<!-- 你看到我的底线了 -->
		<div class="line_bottom">
			你看到我的底线了
			<img src="../../assets/lineB-left.png"/>
			<img src="../../assets/lineB-right.png"/>
		</div>
		
		
		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部提问输入框 -->
		<footer class="footer">
			<input type="text" placeholder="回答内容，10 ~ 200个字" maxlength="200" v-model.trim="content"/>
			<button @click="btn" :class=" content.length == 0 ? 'grayBg' : '' ">回答</button>
		</footer>
		
	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			queContent:this.$route.query.content, //点击要回答的那个问题；
			id:this.$route.query.id, //在问答页面传过来的问答id；
			spuId:this.$route.query.spuId,
			goodses:[],
			content:'', //回答内容；
			answers:[],
			lastTime:false,
			
		}
	},
	created() {
		
		this.GoodsList(); //商品详情；
		this.QuestionDetails(); //回答详情；		
		
	},
	mounted() {

	},
	methods: {
		//点赞已读；
		//a=2是商品，3是回答有用,open=1是点赞，2是取消点赞；articleld是该问题的id；
		PraiseSwitch(a,open,id){
			
			let PavObj = {
				'a':a,
				'open':open,
				'id':id //收藏id先固定死；
			};
			
			this.$Api.Shop.PraiseSwitch(PavObj).then( res => {
				console.log(res)
				
				if (res.q.s == 0) { //操作成功；
					this.QuestionDetails();
				}
			})
		},
		
		//点击有用；
		click_you(index){
			//防止用户操作重复点击按钮太快，而导致的多次重复请求；
			let startTime = new Date().getTime(); //当前的；
			if(!this.lastTime || (startTime-this.lastTime)>500) {
				this.lastTime=startTime;
				//console.log('点')
				this.answers[index].isPraise = !this.answers[index].isPraise;
				console.log(this.answers[index].isPraise)
				//判断开关是否点击有用；
				if (this.answers[index].isPraise) { //有；
					//console.log(this.answers[index].id)
					this.PraiseSwitch(3,1,this.answers[index].id);
				} else{ //没；
					//console.log(this.answers[index].id)
					this.PraiseSwitch(3,2,this.answers[index].id); 
				}				
			}
		},
		
		//回答提问；
		btn(){
			
			//判断提问框不能为空；
			if (this.content == '') {
				Toast('请输入内容')
				//console.log('空')
			} else{
				//判断字数不能少于4；
				if (this.content.length < 10) { //少于4；
					Toast('您的回答过短')
					//console.log('少于4')
				} else{ //不少于4；
					this.QuestionSubmit(5);//回答问题；
					//console.log('不少于4')
				}
				
				//console.log('不空')
			}	
			
		},
		
		//提问接口(a=5是回答问题)；
		QuestionSubmit(a){
			
			let queSubmitObj = {
				'a':a,
				id:this.id,
				content:this.content
			};
			
			this.$Api.Shop.QuestionSubmit(queSubmitObj).then( res => {
				console.log(res)
				
				if (res.q.s == 0) { //提交成功；
					this.$toast('回答成功','success')
					
					this.QuestionDetails();
					this.content = ''; //提交成功后要清空提问框；
				}else if(res.q.s == 1800){
					Toast('禁止回答自己提出的问题')
				}else if(res.q.s == 1801){
					Toast('你已经回答过了')
				}
				
			})
			
		},
		
		//回答详情；
		QuestionDetails(){
			
			let queDetObj = {
				id:this.id  //问答id；
			};
			
			this.$Api.Shop.QuestionDetails(queDetObj).then( res => {
				console.log(res)
				
				this.answers = [...res.q.answers];
			})	
		},
		
		//商品列表协议接口；
		GoodsList(){
			
			let GodObj = {
				a:4, //搜编号的;
				Sk:this.spuId, //这个商品的spuId
			};
			
			this.$Api.Shop.GoodsList(GodObj).then( res => {
				console.log(res)
				this.goodses = res.q.goodses[0];
				
				//console.log(this.goodses)
			})
			
		},
		
		//跳转商城首页页面；
		goShoppingMall(){
			
			this.$router.push({  
				name: "ShoppingMall",
				query: {
					
				}
			})
			
		},
		
	},
}

</script>

<style scoped lang="less">
h1{margin: 0 !important;}
.grayBg{background: #ccc !important;color: #fff !important;}
/*该商城首页问答页面样式*/
.ask_and_answerS{
	background: #fff;
	
	/*每一个搜索的商品样式*/
	.seek_commodity{
		width: 100%;
		height: 2.47rem;
		border-bottom: 0.15rem solid #efefef;
		position: relative;
		img{
			width:2rem;
			height:2rem;
			border: 1px solid #ccc;
			position: absolute;
			top: 0.24rem;
			left: 0.24rem;
		}
		p{
			position: absolute;
			font-family:PingFang-SC-Medium;
		}
		p:nth-of-type(1){
			top: 0.39rem;
			left: 2.5rem;
			width:4.66rem;
			font-size:0.26rem;
			color:rgba(51,51,51,1);
			line-height:0.36rem;
		}
		p:nth-of-type(2){
			top: 1.15rem;
			left: 2.5rem;
			font-size:0.22rem;
			color:rgba(153,153,153,1);
			line-height:0.7rem;
		}
		p:nth-of-type(3){
			width:4.7rem;
			bottom: 0.1rem;
			left: 2.5rem;
			span:nth-of-type(1){
				font-size:0.2rem;
				color:rgba(246,50,62,1);
				b{
					font-size:0.3rem;
				}
			}
			span:nth-of-type(2){
				height: 0.42rem;
				line-height: 0.42rem;
				font-size:0.22rem;
				color:rgba(153,153,153,1);
			}
			span:nth-of-type(3){
				font-size:0.22rem;
				color:rgba(250,220,86,1);	
				height: 0.42rem;
				line-height: 0.42rem;
				padding-right: 0.2rem;
			}
		}
	
	}
	
	header{
		height: 1.06rem;
		padding-top: 0.3rem;
		padding-left: 0.25rem;
		box-sizing: border-box;
		border-bottom: 1px solid #cecece;
		span{
			width: 0.3rem;
			height: 0.3rem;
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color:rgba(255,255,255,1);
			text-align: center;
			line-height: 0.3rem;
			background: #ffde5f;
			border-radius: 0.05rem;
			display: inline-block;
		}
		b{
			width: 6.65rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Bold;
			color:rgba(51,51,51,1);
			padding-left: 0.1rem;
		}
	}
	
	
	/*回答区样式*/
	.answerS{
		padding: 0 0.25rem;
		box-sizing: border-box;
		
		section:last-child{
			border-bottom: none !important;
		}
		
		section{
			/*height: 2.65rem;*/
			border-bottom: 1px solid #efefef;
			
			h1{
				height: 1.04rem;
				padding-top: 0.4rem;
				box-sizing: border-box;
				
				img{
					width: 0.4rem;
					height: 0.4rem;
					vertical-align: top;
				}
				span{
					font-size:0.22rem;
					font-family:PingFang-SC-Regular;
					vertical-align: top;
				}
				span:nth-of-type(1){
					color:rgba(153,153,153,1);
					display: inline-block;
					padding-top: 0.1rem;
				}
				span:nth-of-type(2),span:nth-of-type(3){
					border: 1px solid rgba(255,69,69,1);
					font-size:0.16rem;
					font-family:PingFang-SC-Regular;
					color:rgba(255,69,69,1);
					padding: 0.02rem 0.06rem;
					display: inline-block;
					margin-top: 0.12rem;
				}
				span:nth-of-type(4){
					color:rgba(153,153,153,1);
					margin-top: 0.12rem;
				}
			}
			
			p{
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				color:rgba(51,51,51,1);
				line-height:0.36rem;
			}
			
			div{
				height: 0.8rem;
				button{
					width: 1.15rem;
					height: 0.45rem;
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					color:rgba(153,153,153,1);
					background: #fff;
					outline: none;
					border: none;
					border-radius: 0.05rem;
					border: 1px solid rgba(153,153,153,1);
					text-overflow:ellipsis;overflow:hidden;white-space:nowrap;
				}
			}
			
		}
		
		
	}
	
	/*底部提问输入框样式*/
	.footer_equal{
		width: 100%;
		height: 0.95rem;
	}
	.footer{
		width: 100%;
		height: 0.95rem;
		border-top: 1px solid #efefef;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 0.15rem 0.25rem 0;
		box-sizing: border-box;
		background: #fff;
		z-index: 10;
		input{
			width:5.68rem;
			height:0.67rem;
			border-radius:0rem;
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
			line-height:0.5rem;
			border-radius: 0.3rem;
			border: 1px solid #cecece;
			text-indent: 0.2rem;
		}
		button{
			width:1.16rem;
			height:0.67rem;
			background:rgba(250,220,86,1);
			border-radius:0rem;
			outline: none;
			border: none;
			border-radius: 0.3rem;
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color: #000;
		}
	}
	
}

.btn_bg{
	background:rgba(250,220,86,1) !important;
	border: none !important;
	color:rgba(26,26,26,1) !important;
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