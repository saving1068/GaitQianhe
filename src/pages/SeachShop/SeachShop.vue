<template>
	<div class="warp">
		<div class="seach">
			<van-search type="number" placeholder="输入商品编号" v-model="seachValue" @search="onSearch" @cancel="onCancel"/>
		</div>
		<div class="place_List" @click="over">
			<div class="result">搜索结果</div>
			<div class="place_item" v-for="(v,i) in place_List">
				<div class="place_img">
					<img v-if="v.imagePath" :src="v.imagePath">
					<img v-else src="../../assets/common/placeholder_200x200.png"/>
				</div>
				<div class="place_val">
					<div class="place_val_title">{{v.name}}</div>
					<div class="place_val_time">{{v.dateNum}}天游玩</div>
					<div class="place_val_bottom">
						<span>¥{{v.price}}起</span>
						<span>{{v.praiseNum}}分</span>
						<span style="padding-left: .15rem;">月售{{v.saleStat}}笔</span>
					</div>
				</div>
			</div>
		</div>
	</div> 
</template>

<script>
	export default{
		data(){
			return{
				seachValue:"",
				place_List:[]
			}
		},
		methods:{
			over(){
				console.log(this.place_List[0])
				if(this.$route.query.type == 'send'){
					var obj = {
						content:this.place_List[0].spuId,
						protection:4,
						obj:this.place_List[0]
					}
					console.log(obj)
					this.$store.state.TravelsArticle.splice(this.$route.query.index,0,obj)
					this.$router.go(-1)
					}else if(this.$route.query.type == 'last'){
						if(this.$route.query.type == 'send'){
							var obj = {
								content:this.place_List[0].spuId,
								protection:4,
								obj:this.place_List[0]
							}
							console.log(obj)
							this.$store.state.TravelsArticle.push(obj)
							this.$router.go(-1)
						}else{
							var obj = {
								content:this.place_List[0].spuId,
								protection:4,
								obj:this.place_List[0]
							}
							console.log(obj)
							this.$store.state.sendTravels.send.push(obj)
							this.$router.go(-1)
						}
					}else{
						var obj = {
							content:this.place_List[0].spuId,
							protection:4,
							obj:this.place_List[0]
						}
						console.log(obj)
						this.$store.state.sendTravels.send.splice(this.$route.query.index,0,obj)
						this.$router.go(-1)
						
					}
				
			},
			onSearch(){
				console.log('搜索感兴趣的目的地')
				var obj ={
					a:4,
					Sk:this.seachValue
				}
				this.$Api.Shop.GoodsList(obj).then((res)=>{
					console.log(res)
					this.place_List =res.q.goodses
				})
			},
			onCancel(){
				console.log('取消搜索目的地')
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
img{
	width: 100%;
	height: 100%;
}
	.warp{
		padding: .24rem 0;
		.seach{
			width: 100%;
		}
		.place_List{
			.result{
				height: 1rem;
				line-height: 1rem;
				padding: 0 .24rem;
				border-bottom: 0.01rem solid #EDEDED;
				color:rgba(153,153,153,1);
				font-size:0.22rem;
			}
			.place_item{
				padding: .45rem .24rem;
				border-bottom: 0.01rem solid #EDEDED;
				overflow: hidden;
				.place_img{
					width: 2rem;
					height: 2rem;
					float:left;
					img{
						width: 100%;
					}
				}
				.place_val{
					float: left;
					padding-left: .3rem;
					width: 5rem;
					.place_val_title{
						font-size:0.26rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(51,51,51,1);
						overflow: hidden;
						  text-overflow: ellipsis;
						  display: -webkit-box;
						  -webkit-line-clamp: 2;
						  -webkit-box-orient: vertical;
					}
					.place_val_time{
						padding-top: .15rem;
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(153,153,153,1);
					}
					.place_val_bottom{
						padding-top: .6rem;
						span:nth-of-type(1){
							font-size:0.2rem;
							font-family:PingFang-SC-Medium;
							font-weight:500;
							color:rgba(246,50,62,1);
						}
						span:nth-of-type(2){
							font-size:0.22rem;
							font-family:PingFang-SC-Medium;
							font-weight:500;
							color:rgba(250,220,86,1);
							padding-left: 1rem;
						}
						span:nth-of-type(3){
							font-size:0.22rem;
							font-family:PingFang-SC-Medium;
							font-weight:500;
							color:rgba(153,153,153,1)
						}
					}
				}
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