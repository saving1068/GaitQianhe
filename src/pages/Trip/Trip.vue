<template>
	<div class="warp">
		<div class="top_image">
			<img src="../../assets/user_bg_top@2x.png"/>
			<div class="content_bg">
				<div class="user_name">
					{{user.name}}
				</div>
				<div class="content_val" v-if="list.length>0">
					<li v-for="(v,i) in list">
						<div class="item_left">
							<p>{{v.date.split("-")[0]}}年</p>
							<h1>{{v.date.split("-")[1]}}月</h1>
						</div>
						<div class="rt">
							<div class="item_right" v-for="(val,index) in v.list">
									<div class="item_right_title">我去了{{val.region}}</div>
									<div class="item_right_location">
										<div class="location_icon">
											
										</div>
										<div class="location_name"><!--@click="goToSeachPlace('change',val)"-->
											{{val.region}}
										</div>
										<div v-if="val.type == 1" class="change_icon" @click="chang(val)"></div>
									</div>
							</div>
						</div>
					</li>
				</div>
				<div class="content_not" v-if="list.length<=0">
					<p>您还没有旅行足迹哦，快去添加吧~</p>
					<div class="content_not_btn" @click="goToSeachPlace('append')">
						添加城市
					</div>
				</div>
			</div>
			<div class="user_imgae">
				<img :src="user.imagePath"/>
			</div>
		</div>
		<div class="btn" v-if="list.length>0" @click="goToSeachPlace('append')">添加</div>
		<van-popup v-model="show" position="bottom" >
		 <div class="alert_bg">
		 	<div class="alert_top_btn " @click="date">
		 		调整年月
		 	</div>
		 	<div class="alert_middle_btn" @click="DelfootprintInfo">
		 		删除
		 	</div>
		 	<div class="alert_bottom_btn" @click="show = false">
		 		取消
		 	</div>
		 </div>
		</van-popup>
		<van-popup v-model="data_show" position="bottom">
		  	<van-datetime-picker
				  v-model="currentDate"
				  type="year-month"
				  :formatter="formatter"
				  @confirm="ok"
				  @cancel="not"
				  confirm-button-text="确定"
				  cancel-button-text="取消"
				  :max-date="maxDate" 
				/>
			</van-popup>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default{
		created(){
			this.getUserDetails(0)//个人信息
//			console.log(this.$route.query.province,this.$route.query.cityName)
			this.getWbfootprintInfo()//个人足迹
		},
		data(){
			return{
				list:[],
				show:false,
				data_show:false,
				currentDate:new Date(),
				user:{},
				delWbId:null,
				cityId:null,
				time:null,
				maxDate:new Date()
			}
		},
		methods:{
			getUserDetails(a){//个人信息
				this.$Api.UserPage.UserDetails(a).then((res)=>{
					console.log(res)
					this.user = res.q.user
				})
			},
			getWbfootprintInfo(){
				this.$Api.UserPage.getWbfootprintInfo({a:0}).then((res)=>{
					console.log(res)
					if(res.q.s == 0){
						this.list = res.q.list
					}else{
						Toast(res.q.d);
					}
					
				})
			},
			ok(value){
				this.data_show = false
				var y = value.getFullYear()
				var m = value.getMonth()+1
//				m = m < 10 ? '0' + m : m;
				console.log(y+'-'+ m)
				this.time = y+'-'+ m
				var obj = {
						a:1,
						date:this.time,
						id:this.cityId
					}
				this.$Api.UserPage.AddfootprintInfo(obj).then((res)=>{
					console.log(res)
					if(res.q.s == 0){
						this.show = false
						this.getWbfootprintInfo()
					}else{
						Toast(res.q.d);
					}
				})
			},
			not(){
				this.data_show = false
			},
			a(value,index){
				console.log(value,index)
				value.getColumnValue(index)
			},
			formatter(type, value) {
				
		      if (type === 'year') {
		        return `${value}年`;
		      } else if (type === 'month') {
		        return `${value}月`
		      }
		      return value;
		    },
			chang(item){
				this.show = true
				this.cityId = item.id
			},
			DelfootprintInfo(){
				this.$Api.UserPage.DelfootprintInfo({a:0,id:this.cityId}).then((res)=>{
					if(res.q.s== 0){
						this.show = false
						this.getWbfootprintInfo({a:0})
					}else{
						Toast(res.q.d);
					}
				})
			},
			date(){
				this.data_show = true
			},
			goToDraft(){
				this.$router.push({
					name:"Draft"
				})
			},
			goToSeachPlace(font,item){
				if(font == "append"){
					this.$router.push({
						name:"SeachPlace",
						query:{
							a:0,
							type:"Trip"
						}
					})
				}else{
					this.$router.push({
						name:"SeachPlace",
						query:{
							a:1,
							id:item.id,
							type:"Trip"
						}
					})
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
		.content{
			overflow: hidden;
		}
		.content_not{
			position: absolute;
			top: 2.96rem;
			left: 1.85rem;
			p{
				height:0.24rem;
				font-size:0.24rem;
				font-family:PingFang-SC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				margin: 0 auto;
				padding-bottom: .8rem;
			}
			.content_not_btn{
				width:2.2rem;
				height:0.68rem;
				background:rgba(250,220,86,1);
				border-radius: 0.06rem;
				text-align: center;font-size:0.28rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(43,43,43,1);
				margin: 0 auto;
				padding-top: .15rem;
			}
		}
		.btn{
			width: 100%;
			height: .98rem;
			bottom: 0;
			position: fixed;
			text-align: center;
			line-height: .98rem;
			font-size:0.34rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(26,26,26,1);
			background: #FADC56;
		}
	.alert_bg{
			background: #D2D2D3;
			width: 100%;
			height: 3.06rem;
			.alert_top_btn{
				color: #221E1F;
				height: .98rem;
				font-size:0.36rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				line-height: .98rem;
				text-align: center;
				background: #FFFFFF;
				border-bottom: 0.01rem solid #CCCCCC;
			}
			.alert_middle_btn{
				color: #FF303F;
				height: .98rem;
				font-size:0.36rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				line-height: .98rem;
				text-align: center;
				background: #FFFFFF;
			}
			.alert_bottom_btn{
				color: #221E1F;
				height: .98rem;
				font-size:0.36rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				line-height: .98rem;
				text-align: center;
				background: #FFFFFF;
				margin-top: .1rem;
			}
		}
	.top_image{
		width: 100%;
		height: 3rem;
		position: relative;
		.content_bg{
			position: absolute;
			border-radius:.36rem .36rem 0 0;
			background: #FFFFFF;
			width: 100%;
			top: 2.5rem;
			padding:0 .24rem .98rem ;
			.user_name{
				font-size:0.34rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				text-align: center;
				border-bottom:0.01rem solid #EDEDED;
				padding: .74rem 0 .3rem;
			}
			.content_val{
				padding-top:.3rem ;
				.rt {
					float: left;
					width: 80%;
				}
				/*.rt::after {
					content: '';
					clear: both;
					display: block;
				}*/
				li{
					padding-bottom: 1rem;
					overflow:hidden;
					.item_left{
						float: left;
						width: 20%;
						text-align: right;
						p{
							font-size:0.38rem;
							font-family:PingFang-SC-Medium;
							font-weight:500;
							color:rgba(51,51,51,1);
						}
						h1{
							font-size: .5rem;
							font-weight: 600;
						}
					}
					.item_right{
						float: left;
						padding-left:.58rem;
						width: 5.7rem;
						padding-bottom: .5rem;
						.item_right_title{
							background:rgba(255,250,225,1);
							border-radius:0.08rem;
							text-align: center;
							line-height: .42rem;
							font-size:0.22rem;
							font-family:PingFang-SC-Bold;
							font-weight:bold;
							color:rgba(102,102,102,1);
							padding: 0 .24rem;
							float: left;
						}
						.item_right_location{
							padding-top: .3rem;
							overflow: hidden;
							float: left;
							width: 5rem;
							.location_icon{
								float: left;
								width:0.52rem;
								height:0.52rem;
								background-image: url(../../assets/tab_btn_location_pre@2x.png);
								background-repeat: no-repeat;
								background-size: 100% 100%;
							}
							.location_name{
								float: left;
								font-size:0.34rem;
								font-family:PingFang-SC-Bold;
								font-weight:bold;
								color:rgba(51,51,51,1);
								padding-left: .22rem;
							}
							.change_icon{
								float: right;
								width:0.4rem;
								height:0.42rem;
								background-image: url(../../assets/change.png);
								background-repeat: no-repeat;
								background-size: 100% 100%;
								margin-top: 0.04rem;
							}
						}
					}
				}
			}
		}
		.user_imgae{
			width:1.2rem;
			height:1.2rem;
			border-radius:50%;position: absolute;
			top: 1.75rem;
			left: 50%;
			transform: translateX(-50%);
			overflow: hidden;
		}
	}
</style>