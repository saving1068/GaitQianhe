<template>
	<div class="warp">
		<div class="seach">
			<van-search placeholder="去哪旅游？点击搜索试试" v-model="seachValue" @search="onSearch" @cancel="onCancel"/>
		</div>
		<div class="tap">
			<li class="tap_item" :class="[index == 0? 'active':'']" @click="tabChange(0)">综合</li>
			<li class="tap_item" :class="[index == 1? 'active':'']" @click="tabChange(1)">最新</li>
			<li class="tap_item" :class="[index == 2? 'active':'']" @click="goToSeachPlace">目的地<i><van-icon name="arrow" /></i></li>
			<div class="bottom_line" :style="bottomStyle"></div>
		</div>
		<div class="content_1" v-show="index == 0">
			<div class="content_title">
				共188条结果
			</div>
			<li class="content_list" v-for="(v,i) in list" @click="goTostrategyDetail">
				<div class="item_left">
					<div class="item_left_title">
						广州长隆怎么玩？五大主题乐园实用干货在这里！
					</div>
					<!--<div class="item_left_strategy">攻略</div>-->
					<div class="strategy_num">
						<div class="watch_num">
							<div class="watch_num_icon"></div>
							<font>1W++</font>
						</div>
						<div class="commit">
							<div class="commit_num_icon"></div>
							<font>1182</font>
						</div>
						<div class="like">
							<div class="like_num_icon"></div>
							<font>1182</font>
						</div>
					</div>
				</div>
				<div class="item_right">
					
				</div>
			</li>
		</div>
		<div class="content_2" v-show="index == 1">
			<div class="content_title">
				共187条结果
			</div>
			<li class="content_list" v-for="(v,i) in list">
				<div class="item_left">
					<div class="item_left_title">
						广州长隆怎么玩？五大主题乐园实用干货在这里！
					</div>
					<!--<div class="item_left_strategy">攻略</div>-->
					<div class="strategy_num">
						<div class="watch_num">
							<div class="watch_num_icon"></div>
							<font>1W++</font>
						</div>
						<div class="commit">
							<div class="commit_num_icon"></div>
							<font>1182</font>
						</div>
						<div class="like">
							<div class="like_num_icon"></div>
							<font>1182</font>
						</div>
					</div>
				</div>
				<div class="item_right">
					
				</div>
			</li>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				seachValue:"",
				index:0,
				list:[1,2,3,4]
			}
		},
		methods:{
			onSearch(){
				console.log('搜索音乐')
			},
			onCancel(){
				console.log('取消搜索音乐')
			},
			tabChange(index){
				this.index = index
			},
			goToSeachPlace(){
				this.$router.push({
					name:"SeachPlace"
				})
			},
			goTostrategyDetail(){
				this.$router.push({
					name:"StrategyDetail"
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
	.warp{
		padding: .24rem 0;
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
			width: 100%;
			line-height: .6rem;
			font-size:0.22rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(102,102,102,1);
			padding-left: .25rem;
			
		}
		.content_list{
			padding: .3rem .25rem;
			border-bottom: 0.01rem solid #EDEDED;
			overflow: hidden;
			.item_left{
				float: left;
				padding-right:0.28rem;
				.item_left_title{
					font-size:0.3rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					padding-top: .1rem;
					width: 3.9rem;
					padding-bottom: .13rem;
					height: 1.6rem;
				}
				.item_left_strategy{
					font-size:0.2rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(102,102,102,1);
					width:0.9rem;
					height:0.3rem;
					background:rgba(250,220,86,1);
					border-radius: 0.15rem;
					text-align: center;
					line-height: .3rem;
				}
				.strategy_num{
					display: flex;
					justify-content: space-between;
					width: 3.8rem;
				}
				.watch_num{
					width: 1rem;
					display: flex;
					justify-content:space-between;
					.watch_num_icon{
						width:0.22rem;
						height:0.14rem;
						background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
						background-size: 100%;
						margin-top: .09rem;
					}
					font{
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
				.commit{
					width: .8rem;
					display: flex;
					justify-content:space-between;
					.commit_num_icon{
						width:0.2rem;
						height:0.18rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100%;
						margin-top: .09rem;
					}
					font{
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
					}
				}
				.like{
					width: .8rem;
					display: flex;
					justify-content:space-between;
					.like_num_icon{
						width:0.2rem;
						height:0.18rem;
						background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
						background-size: 100%;
						margin-top: .09rem;
					}
					font{
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(102,102,102,1);
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