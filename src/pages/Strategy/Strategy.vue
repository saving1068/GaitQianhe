<template>
	<div class="warp">
		<div class="seach">
			<van-search placeholder="请输入关键字进行查询" v-model="seachValue" @search="onSearch" @cancel="onCancel"/>
		</div>
		<div class="tap">
			<li class="tap_item" :class="[index == 0? 'active':'']" @click="tabChange(0)">综合</li>
			<li class="tap_item" :class="[index == 1? 'active':'']" @click="tabChange(1)">最新</li>
			<li class="tap_item" :class="[index == 2? 'active':'']" @click="goToSeachPlace">{{cityName}}<i style="font-size: .1rem;"><van-icon name="arrow" /></i></li>
			<div class="bottom_line" :style="bottomStyle"></div>
		</div>
		<div class="content_1" v-show="index == 0">
			<div class="content_title">
				共{{total}}条结果
			</div>
			<van-list v-model="loading" :finished="finished" @load="onLoad">
				<div style="overflow: hidden;">
					<li class="content_list" v-for="(v,i) in list" @click="goTostrategyDetail(v)">
						<div class="item_left">
							<div class="item_left_title">
								{{v.title}}
							</div>
							<div class="item_left_strategy">攻略</div>
							<div class="strategy_num">
								<div class="strategy_num_box">
									<i class="watch_num_icon strategy_icon"></i>
									<p v-if="v.browseNum<10000">{{v.browseNum}}</p>
									<p v-else>1W+</p>
								</div>
								<div class="strategy_num_box">
									<i class="commit_num_icon strategy_icon"></i>
									<p v-if="v.commentNum<10000">{{v.commentNum}}</p>
									<p v-else>1W+</p>
								</div>
								<div class="strategy_num_box">
									<i class="like_num_icon strategy_icon"></i>
									<p v-if="v.favoriteNum<10000">{{v.favoriteNum}}</p>
									<p v-else>1W+</p>
								</div>
							</div>
						</div>
						<div class="item_right">
							<img :src="v.imagePath"/>
						</div>
					</li>
				</div>
			</van-list>
			<div  class="strategy_more" v-if="list.length==0">
				<div style="text-align: center;">
					<font>该景点暂无攻略</font>
				</div>
			</div>
		</div>
		<div class="content_2" v-show="index == 1">
			<div class="content_title">
				共{{total}}条结果
			</div>
			<div style="overflow: hidden;">
				<li class="content_list" v-for="(v,i) in list" @click="goTostrategyDetail(v)">
						<div class="item_left">
							<div class="item_left_title">
								{{v.title}}
							</div>
							<div class="item_left_strategy">攻略</div>
							<div class="strategy_num">
								<div class="strategy_num_box">
									<i class="watch_num_icon strategy_icon"></i>
									<p v-if="v.browseNum<10000">{{v.browseNum}}</p>
									<p v-else>1W+</p>
								</div>
								<div class="strategy_num_box">
									<i class="commit_num_icon strategy_icon"></i>
									<p v-if="v.commentNum<10000">{{v.commentNum}}</p>
									<p v-else>1W+</p>
								</div>
								<div class="strategy_num_box">
									<i class="like_num_icon strategy_icon"></i>
									<p v-if="v.favoriteNum<10000">{{v.favoriteNum}}</p>
									<p v-else>1W+</p>
								</div>
							</div>
						</div>
						<div class="item_right">
							<img :src="v.imagePath"/>
						</div>
				</li>
			</div>
			<div  class="strategy_more" v-if="list.length==0">
				<div style="text-align: center;">
					<font>该景点暂无攻略</font>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		created(){
			this.getArticleList()
			if(this.$route.query.cityName){
				this.cityName = this.$route.query.cityName
				this.getArticleList()
			}
		},
		data(){
			return{
				seachValue:"",
				index:0,
				list:[],
				type:3,
				listPa:1,
				loading: false,
     			finished: false,
     			total:0,
     			cityName:this.$route.query.city
			}
		},
		methods:{
			 onLoad() {
      			// 异步更新数据	
		      setTimeout(() => {
		       
		        // 加载状态结束
		        this.loading = false;
		
		        // 数据全部加载完成
		        if (this.list.length >= this.total) {
		          this.finished = true;
		        }else{
		        	this.listPa++
		        	this.getArticleList()
		        }
		      }, 500);
		    },
			onSearch(){
				console.log(this.seachValue)
				let obj = {
					a:this.type,
					pa:1,
					Sk:this.seachValue
				}
				this.$Api.Address.ArticleList(obj).then((res)=>{
					console.log(res)
					this.total  = res.q.total
					if(obj.pa>1){
						for(var i=0;i<res.q.articles.length;i++){
							this.list.push(res.q.articles[i])
						}
					}else{
						this.list = res.q.articles
					}
					
				})
				
			},
			onCancel(){
				console.log('取消搜索音乐')
			},
			tabChange(index){
				this.index = index;
				this.listPa  = 1;
				if(index == 0){
					this.type = 3;
					this.getArticleList()
				}else{
					this.type = 4;
					this.getArticleList()
				}
			},
			goToSeachPlace(){
				this.$router.push({
					name:"SeachPlace",
					query:{
						regionId:this.$route.query.regionId
					}
				})
			},
			getArticleList(){
				console.log(this.$route.query.regionId,"regionId")
				let obj = {
					a:this.type,
					pa:this.listPa,
					regionId:this.$route.query.regionId
				}
				this.$Api.Address.ArticleList(obj).then((res)=>{
					console.log(res)
					this.total  = res.q.total
					if(obj.pa>1){
						for(var i=0;i<res.q.articles.length;i++){
							this.list.push(res.q.articles[i])
						}
					}else{
						this.list = res.q.articles
					}
					
				})
			},
			goTostrategyDetail(item){
				this.$router.push({
					name:"StrategyDetail",
					query:{
						id:item.id
					}
				})
			},
		},
		computed:{
			bottomStyle(){
				if(this.index == 0){
					return "left:12.5%"
				}else if(this.index == 1){
					return "left:45.66%"
				}else{
					return "left:78.66%"
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
img{
	width: 100%;
	height: 100%;
}
	.warp{
		padding: .24rem 0;
		background:#FFFFFF;
		.seach{
			width: 100%;
		}
		.tap{
			position: relative;
			overflow: hidden;
		}
		.tap_item{
			width: 33.33%;
			float: left;
			text-align: center;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(153,153,153,1);
			padding-top: .1rem;
			padding-bottom: 0.1rem;
		}
		.bottom_line{
			width:0.6rem;
			height:0.02rem;
			background:rgba(250,220,86,1);
			position: absolute;
			bottom: 0;
			transition: 1s all;
		}
		.active{
			color:rgba(250,220,86,1);
		}
		.content_title{
			height: 0.6rem;
			line-height: .6rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			padding-left: .25rem;
		}
		.content_list{
			overflow:hidden;
			padding: .3rem .24rem;
			border-bottom: .02rem  solid #EDEDED;
			.item_left{
				float: left;
				padding-right:.28rem;
				.item_left_title{
					width: 3.94rem;
					font-size:0.3rem;
					height: .9rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					word-break: break-all;
				}
				.item_left_strategy{
					margin-top: .17rem;
					display: inline-block;
					text-align: center;
					font-size: 20px;
					padding: 0 25px;
					background: rgba(250,220,86,1);
					color:rgba(102,102,102,1);
					border-radius:25px;
					transform: scale(.5) translate(-50%,-50%);
					
				}
				.strategy_num{
					padding-top: .53rem;
					overflow: hidden;
					display: flex;
					align-items: center;
					.strategy_num_box{
						float: left;
						padding-right: .56rem;
						line-height:.25rem;
						.strategy_icon{
							width:0.22rem;
							height:0.22rem;
							float: left;
						}
						.watch_num_icon{
							background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
							background-size: 100% 100%;
						}
						.commit_num_icon{
							background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
							background-size: 100% 100%;
						}
						.like_num_icon{
							background: url(../../assets/location_btn_star_nor@2x.png) no-repeat;
							background-size: 100% 100%;
						}
						p{
							float: left;
							font-size:0.22rem;
							font-family:PingFang-SC-Medium;
							font-weight:500;
							color:rgba(102,102,102,1);
							padding-left: .1rem;
						}
					}
				}
			}
			.item_right{
				float: left;
				width:2.8rem;
				height:2rem;
				background: salmon;
			}
		}
			
			
		
		.strategy_more{
			line-height: 1.02rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(116,116,116,1);
			text-align: center;
			p{
				float: right;
				width:0.09rem;
				height:0.16rem;
				background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
				background-size: 100%;
				margin-top: .44rem;
			}
		}
	}	
</style>
<style lang="scss">
	.warp{
		.van-search{
			.van-icon-search{
				
				color: #FADC56 ;
			}
		}
	}
</style>