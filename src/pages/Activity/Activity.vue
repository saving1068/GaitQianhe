<template>
	<div class="warp">
		<li v-for="(v,i) in groupLists" @click="goToShopDetail(v)">
			<div class="item_left">
				<div class="item_time">
					{{v.expiredHour}}
				</div>
				<img :src="v.imagePath"/>
			</div>
			<div class="item_right">
				<div class="item_name">{{v.name}}</div>
				<div class="item_type">
					{{v.spec}}-{{v.placeDate}}
				</div>
				<div class="item_pirce">¥{{v.price}}</div>
				<div class="peopleNum">
					<div class="peopleicon">
						<div class="peopleicon_image" v-for="(val,index) in v.images">
							<img v-if="val" :src="val" />
							<img v-else src="../../assets/notpage.png"/>
						</div>
						<font v-if="v.images.length>=4">...</font>
					</div>
					<div class="people">
						还差<span style="color: #FF7A56;">{{v.surplusNum}}</span>人拼成
					</div>
				</div>
			</div>
		</li>
		<div class="notactivity" v-if="groupLists.length==0">暂无任何活动</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				user:{},
				groupLists:[],
			}
		},
		created(){
			
		},
		mounted(){
			this.$nextTick(()=> {
			setTimeout(()=> {
				this.getUserDetail(this.$route.query.userId)
			},500)
		})
		},
		methods:{
			goToShopDetail(item){
				this.$router.push({
					name:"ShoppingMallDetails",
					query:{
						spuId:item.spuId
					}
				})
			},
			getUserDetail(userId){
				var obj = {
					a:2,
					id:userId
				}
				this.groupLists =[];
				this.$Api.UserPage.UserDetails(obj).then((res)=>{
					console.log(res)
					this.user = {...res.q.user};
					console.log(this.user,"user")
//					this.countDown(this.user.groupList[0].expiredHour)	
					console.log(this.user.groupList,"groupList")
					for(var i=0;i<this.user.groupList.length;i++){
						var obj = {...res.q.user.groupList[i]}
//						console.log(obj)
						let arr = obj.expiredHour.split(':'); //通过数据格式是24:08:28，以“ : ”来分割成数组为[24,08,28]；
						obj.timer = null;
						obj.allTime = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2]); //先把活动目标时间转化为总秒数
//						console.log(obj)
						this.groupLists.push(obj)
					}
					this.countDown()
				})
				
			},

			countDown(){
//				console.log(this.groupLists,2142421423)
					this.groupLists.forEach( item => {
//					console.log(1111)
				
				item.timer = setInterval(()=>{
					item.allTime-=1
					let iHour,iMin,iSec; //先声明时，分，秒变量；
					let total=item.allTime;
					//console.log(total)
					
					//判断总秒数=0就是过期了,过期就停止定时器=00:00:00；
					if(total<=0){
						clearInterval(item.timer);
						total=0;
						//alert('已过时间');
					}
					
					//然后再来转化拼接成你想要的 时间格式 ；
					iHour=parseInt(total/3600);
					total%=3600;
	
					iMin=parseInt(total/60);
					total%=60;
					
					iSec=total;
					//console.log(iHour,iMin,iSec)
					item.expiredHour=iHour+":"+iMin+":"+iSec;		
//					console.log(item.expiredHour,)
				},1000)
//				console.log(item.timer,"asdasd")
			})	
				
				
//				console.log(str)
//				let arr = str.split(':'); //通过数据格式是24:08:28，以“ : ”来分割成数组为[24,08,28]；
//				var allTime = parseInt(arr[0]*3600) + parseInt(arr[1]*60) + parseInt(arr[2])+0.1111; //先把活动目标时间转化为总秒数；
////				 console.log(allTime)
//				var time
//				let hour,min,sec;
//					allTime--
//					
//					 hour =parseInt(allTime/3600);//小时
//					
//					 min =parseInt((allTime/3600-parseInt(allTime/3600))*60);//小时
//					 sec =parseInt((((allTime/3600-parseInt(allTime/3600))*60)-min)*60);
////					console.log("小时:"+hour,"分钟"+min,"秒数"+sec)
//					
//					time = hour+":"+min+":"+sec

			},
		},
		watch:{
		
		},
		computed:{

		},
	}
</script>

<style scoped="scoped" lang="scss">
	.warp{
		padding: 0 .24rem;
		img{
			width: 100%;
			height: 100%;
		}
		.notactivity{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			font-size: .36rem;
		}
		li{
			overflow: hidden;
			padding: .4rem 0;
			border-bottom: 0.01rem solid #DEDEDE;
			.item_left{
				float: left;
				width:2rem;
				height:2rem;
				background: url(../../../static/img/1.png);
				background-repeat:no-repeat;	
				background-size:100% 100%;
				position:relative;
				.item_time{
					width:1.23rem;
					height:0.33rem;
					background:rgba(255,122,86,1);
					text-align: center;
					line-height: .33rem;
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(255,255,255,1);
					left: 0;
					top: 0;
					position: absolute;
				}
			}
			.item_right{
				float: left;
				width: 5rem;
				padding-left: .42rem;
				.item_name{
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(51,51,51,1);
					 overflow: hidden;
					  text-overflow: ellipsis;
					  display: -webkit-box;
					  -webkit-line-clamp: 2;
					  -webkit-box-orient: vertical;
				}
				.item_type{
					font-size:0.2rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
				.item_pirce{
					font-size:0.2rem;
					font-family:PingFang-SC-Bold;
					font-weight:bold;
					color:rgba(255,122,86,1);
					padding-top: .18rem;
				}
				.peopleNum{
					padding-top: .2rem;
					font-size:0.24rem;
					font-family:PingFang-SC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
					overflow: hidden;
					.peopleicon{
						position: relative;
						height: .4rem;
						float: left;
						width: 1.12rem;
						.peopleicon_image{
							width:0.4rem;
							height:0.4rem;
							border-radius:50%;
							position: absolute;
							overflow: hidden;
							img{
								width: 100%;
								height: 100%;
							}
						}
						font{
							position: absolute;
							left: 1rem;
							bottom: 0;
						}
						.peopleicon_image:nth-of-type(2){
							left: 0.2rem;
							z-index: 1111;
						}
						.peopleicon_image:nth-of-type(3){
							left: 0.4rem;
							z-index: 1112;
						}
						.peopleicon_image:nth-of-type(4){
							left: 0.6rem;
							z-index: 1113;
						}
					}
					.people{
						float: right;
					}
				}
			}
			
		}
	}
</style>