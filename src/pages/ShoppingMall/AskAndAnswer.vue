<!-- 商城首页问答页面 -->
<template>
	<div class="ask_and_answer">
		
		<!-- 每一个搜索的商品 -->
		<section class="seek_commodity" @click="goShoppingMallDetails">
			
			<img :src="goodses.imagePath"/>
			<p v-text="goodses.name">成都七天六夜豪华之旅，全景游赏印花泡温泉纯玩-暑期含往返税...</p>
			<p>{{ goodses.dateNum }}天行程</p>
			<p class="cf">
				<span>¥<b v-text="goodses.price">1799</b>起</span>
				<span class="fr">月销{{ goodses.saleStat }}笔</span>
				<span class="fr">{{ goodses.praiseNum }}分</span>
			</p>
			
		</section>
		
		<!-- 问答区 -->
		<div class="ask_answer_region">
			
			<!-- 一问一答框 -->
			<section class="ask1_answer1" @click="goAskAndAnswerS(index)" v-for="(item,index) in questions">
				
				<header class="cf">
					<span class="fl">问</span>
					<b class="fl" v-text="item.content">这个景点是新建的吗我怎么上次没见过？？？？</b>
				</header>
				
				<div class="content cf" v-if="item.answer">
					<span class="fl">答</span>
					<p class="fl" v-text="item.answer">我景点不好早先我也是找当地人带路的，然后我再说多一行让你知道</p>
				</div>
				<div class="noContent" v-if="!item.answer">
					还没有人回答这个问题...
					<span>去回答</span>
				</div>
				
				<footer class="cf" v-if="item.answerNum != 0">
					<span class="fl">全部 {{item.answerNum}}个回答</span>
					<span class="fr">更新于 {{item.date}}</span>
				</footer>
				
			</section>
			
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
			<input type="text" placeholder="向大家提问，4 ~ 40个字" maxlength="40" v-model.trim="content"/>
			<button @click="btn" :class=" content.length == 0 ? 'grayBg' : '' ">提问</button>
		</footer>
		
	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			content:'', //提问输入框；
			questions:[], //问答列表；
			id:this.$route.query.id, //问答列表id是具体那条问题；
			queDetId:[], //提问id；
			type:this.$route.query.type, //全部评论；
			spuId:this.$route.query.spuId,
			goodses:[],
			
			
		}
	},
	created() {
		
		this.GoodsList(); //商品详情；
		this.QuestionsList(4); //问答列表接口；
		
	},
	mounted() {
		
		
		
	},
	methods: {
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
		
		//提问功能；
		btn(){
			//判断提问框不能为空；
			if (this.content == '') {
				Toast('请输入内容')
				//console.log('空')
			} else{
				//判断字数不能少于4；
				if (this.content.length < 4) { //少于4；
					Toast('您的问题过短')
					//console.log('少于4')
				} else{ //不少于4；				
					this.QuestionSubmit(4);
					//console.log('不少于4')
				}
				//console.log('不空')
			}		
		},
		
		//问答列表接口(a=4是商品提问)；
		QuestionsList(a){
			console.log(this.id,'this.id',this.spuId,'this.spuId')
			if (this.id === undefined) {
				let queObj = {
					'a':a,
		  			type:this.type,
					id:this.spuId
				};
				
				this.$Api.Shop.QuestionsList(queObj).then( res => {
					console.log(res)
					
					this.questions = [...res.q.questions];
					
					this.queDetId = []; //每次请求循环前先清空数组里的数据；
					
					this.questions.forEach( item => {
						this.queDetId.push(item.id); //提问id；
					})
					
					//console.log(this.queDetId)
				})
			}else{
				let queObj = {
					'a':a,
		  			type:this.type,
					id:this.spuId  //此问题id；
				};
				
				this.$Api.Shop.QuestionsList(queObj).then( res => {
					console.log(res)
					
					this.questions = [...res.q.questions];
					
					this.queDetId = []; //每次请求循环前先清空数组里的数据；
					
					this.questions.forEach( item => {
						this.queDetId.push(item.id); //提问id；
					})
					
					//console.log(this.queDetId)
				})
			}
		},
		
		//提问接口(a=4是商品提问)；
		QuestionSubmit(a){
			
			let queSubmitObj = {
				'a':a,
				id:this.spuId,
				content:this.content
			};
			
			this.$Api.Shop.QuestionSubmit(queSubmitObj).then( res => {
				console.log(res)
				
				if (res.q.s == 0) { //提交成功；
					this.$toast('提问成功','success')
					
					this.QuestionsList(4);
					this.content = ''; //提交成功后要清空提问框；
				}
				
			})
			
		},
		
		//跳转商城详情页面；
		goShoppingMallDetails(){
			
			this.$router.push({  
				name: "ShoppingMallDetails",
				query: {
					'spuId':this.spuId
					
				}
			})
			
		},
		
		//跳转商城问答详情页面；
		goAskAndAnswerS(index){
			
			this.$router.push({  
				name: "AskAndAnswerS",
				query: {
					id:this.queDetId[index], //提问id；
					'spuId':this.spuId,
					'content':this.questions[index].content  //点击的那个问题的问；
				}
			})
			
		},
		
	},
}

</script>

<style scoped lang="less">
.noContent{
	width: 100%;
	height: 0.8rem;
	color: #333;
	font-size: 0.26rem;
	padding-top: 0.15rem;
	box-sizing: border-box;
	position: relative;
	span{
		font-size: 0.26rem;
		padding: 0.03rem 0.1rem;
		border: 1px solid #333;
		border-radius: 0.08rem;
		position: absolute;
		right: 0rem;
		top: 0.12rem;
	}
}
.grayBg{background: #ccc !important;color: #fff !important;}
/*该商城首页问答页面样式*/
.ask_and_answer{
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
			span:nth-of-type(3){
				font-size:0.22rem;
				color:rgba(250,220,86,1);	
				height: 0.42rem;
				line-height: 0.42rem;
				padding-right: 0.2rem;
			}
			span:nth-of-type(2){
				height: 0.42rem;
				line-height: 0.42rem;
				font-size:0.22rem;
				color:rgba(153,153,153,1);
			}
		}
	
	}
	
	/*问答区样式*/
	.ask_answer_region{
		padding: 0 0.25rem;
		box-sizing: border-box;
		
		/*这个最后一个同级元素的底部样式没去掉*/
		.ask1_answer1:last-child{border-bottom: none !important;}
	}
	
	/*底部提问输入框样式*/
	.footer_equal{
		width: 100%;
		height: 0.95rem;
		/*background: pink;*/
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


</style>
<style scoped lang="less">
/*该页面相同的样式*/

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

/*一问一答框样式*/
.ask1_answer1{
	/*height: 2.45rem;*/
	border-bottom: 1px solid #efefef;	
	header{
		/*height: 0.95rem;*/
		padding-top: 0.3rem;
		padding-bottom: 0.2rem;
		box-sizing: border-box;
		span{
			/*width: 0.3rem;
			height: 0.3rem;*/
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color:rgba(255,255,255,1);
			/*text-align: center;*/
			padding: 0.02rem 0.06rem;
			/*line-height: 0.6rem;*/
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
	
	.content{
		/*height: 0.9rem;*/
		padding-bottom: 0.2rem;
		box-sizing: border-box;
		span{
			/*width: 0.3rem;
			height: 0.3rem;*/
			font-size:0.2rem;
			font-family:PingFang-SC-Medium;
			color:rgba(255,255,255,1);
			/*text-align: center;*/
			padding: 0.02rem 0.06rem;
			/*line-height: 0.6rem;*/
			background: #ff7b52;
			border-radius: 0.05rem;
		}
		p{
			width:6.65rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			color:rgba(51,51,51,1);
			padding-left: 0.1rem;
		}
	}
	
	footer{
		height: 0.6rem;
		span{
			font-size:0.2rem;
			font-family:PingFang-SC-Regular;
			color:rgba(153,153,153,1);
		}
	}
	
}

</style>

	
