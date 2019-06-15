<template>
	<div class="warp">
		<div class="seach">
			<van-search type="number" placeholder="搜索感兴趣的目的地" v-model="seachValue" @search="onSearch" @cancel="onCancel"  @input="onSearch"/>
		</div>
		<ul>
			<!--<van-list v-model="loading" :finished="finished" @load="onLoad">-->
  				<li class="item" v-for="(v,i) in place_List" @click="over(i)">
					<div class="item_icon">
						
					</div>
					<div class="item_place">
						<p>{{v.destination}}</p>
						<div class="item_place_name" v-if="v.type ==1">
							{{v.parent}} 目的地
						</div>
						<div class="item_place_name" v-if="v.type ==2">
							{{v.parent}} 景点
						</div>
					</div>
				</li>
			<!--</van-list>-->
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				seachValue:"",
				place_List:[],
				loading: false,
      			finished: false,
      			listPage:1,
			}
		},
		methods:{
			 onLoad() {
		      // 异步更新数据
		      if(this.seachValue.length>0){
//		      	 this.finished = false;
		      	setTimeout(() => {
			      	console.log(this.seachValue,231241541234)
			      	this.listPage++
			      	var obj ={
						searchKey:this.seachValue,
						pa:this.listPage,
						li:10
					}
					this.$Api.UserPage.WbDestinationList(obj).then((res)=>{
						console.log(res)
						this.place_List =res.q.list
						for (let i = 0; i < res.q.list.length; i++) {
				          this.place_List.push(res.q.list[i]);
				        }
				        // 加载状态结束
				        this.loading = false;
				
				        // 数据全部加载完成
				        if (res.q.list.length < 10) {
				          this.finished = true;
				        }
					})
			      }, 500);
		      }
		    },
			over(i){
				
				console.log(this.$store.state.sendTravels)
				if(this.$route.query.type=="Travels"){
				this.$store.state.TravelsArticle[this.$route.query.index].location = this.place_List[i].parent +this.place_List[i].destination;
				this.$store.state.TravelsArticle[this.$route.query.index].scenicSpot = this.place_List[i].id;
//				this.$store.state.Travels.spotIds.push(this.place_List[i].id);
				this.$router.go(-1)
				}else{
					this.$store.state.sendTravels.send[this.$route.query.index].location = this.place_List[i].parent +this.place_List[i].destination;
					this.$store.state.sendTravels.send[this.$route.query.index].scenicSpot = this.place_List[i].id;
//					this.$store.state.sendTravels.spotIds.push(this.place_List[i].id);
					this.$router.go(-1)
				}
			},
			onSearch(){
				console.log('搜索感兴趣的目的地')
				var obj ={
					searchKey:this.seachValue,
					pa:1,
					li:10
				}
				this.$Api.UserPage.WbDestinationList(obj).then((res)=>{
					console.log(res)
					this.place_List =res.q.list
				})
			},
			onCancel(){
				console.log('取消搜索目的地')
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.warp{
		padding: .24rem 0;
		.seach{
			width: 100%;
		}
		ul{
			padding: 0 .24rem;
		}
		.item{
			border-bottom: 0.01rem solid #EDEDED;
			overflow: hidden;
			margin-top: .3rem;
			padding-bottom: .3rem;
			.item_icon{
				width: .46rem;
				height: .46rem;
				background-image: url(../../assets/travels_img_location@2x.png);
				background-repeat: no-repeat;
				background-size:100% 100%;
				float: left;
				margin-top: .1rem;
			}
			.item_place{
				float: left;
				padding-left: .2rem;
				p{
					font-size:0.28rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				.item_place_name{
					font-size:0.22rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
			}
		}
	}
</style>