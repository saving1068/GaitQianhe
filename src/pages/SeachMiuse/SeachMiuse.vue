<template>
	<div class="warp">
		<div class="seach">
			<van-search placeholder="搜索音乐" v-model="seachValue" @input="onlineSearch" @search="onSearch" @cancel="onCancel"/>
		</div>
		<div class="miuse_List" v-if="!sort" v-show="seachValue == ''">
			<li v-for="(v,i) in miuse" @click="getMiuseType(v)">
				<p><img :src="v.imagePath"/></p>			
				<div class="font">{{v.name}}</div>
			</li>
		</div>
		<div class="seachMiuse" v-show="seachValue !=''" :style="[{'padding-bottom':miuse_List.length>0?'.98rem':'0'}]">
			<li v-for="(v,i) in miuse_List">
				<div class="miuse_img">
					<div class="miuse_img_play"></div>
					<div class="miuse_img_bg"></div>
					<img v-if="v.imagePath" :src="v.imagePath" />
				</div>
				<div class="miuse_val">
					<h3>{{v.name}}</h3>
					<p v-if="v.singer">{{v.singer}}</p>
					<p v-else>暂无歌手名字</p>
				</div>
				<div class="appen_miuse" @click="choise(v,i,2)" v-if="v.selected == 0">
					+ 添加
				</div>
				<div class="appen_miuse" v-else style="color: #999999;">
					已添加
				</div>
			</li>
		</div>
		<div class="seachMiuse" v-show="sort">
			<li v-for="(v,i) in miuse_a">
				<div class="miuse_img">
					<div class="miuse_img_play"></div>
					<div class="miuse_img_bg"></div>
					<img v-if="v.imagePath" :src="v.imagePath" />
				</div>
				<div class="miuse_val">
					<h3>{{v.name}}</h3>
					<p v-if="v.singer">{{v.singer}}</p>
					<p v-else>暂无歌手名字</p>
				</div>
				<div class="appen_miuse" @click="choise(v,i,1)" v-if="v.selected == 0">
					+ 添加
				</div>
				<div class="appen_miuse" v-else style="color: #999999;">
					已添加
				</div>
			</li>
		</div>
		<div class="btn" @click="goBack"  v-show="sort||seachValue !=''">
			完成
		</div>
	</div> 
</template>

<script>
	export default{
		created(){
			this.getMiuse()
		},
		data(){
			return{
				seachValue:"",
				miuse_List:[],
				appen:true,
				miuse:[],
				miuse_a:[],
				sort:false,
			}
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			choise(item,index,num){
				console.log(item.id,item.name,item.musicPath)
				if(this.$route.query.type=="Travels"){
					this.$store.state.Travels.miuseId = item.id
					this.$store.state.Travels.miuseName = item.name+"-"+item.singer
					this.$store.state.Travels.miusePath = item.musicPath
				}else{
					this.$store.state.sendTravels.miuseId = item.id
					this.$store.state.sendTravels.miuseName = item.name+"-"+item.singer
					this.$store.state.sendTravels.miusePath = item.musicPath
				}
				if(num == 1){
					for(var i=0;i<this.miuse_a.length;i++){
						this.miuse_a[i].selected = 0;
						this.miuse_a[index].selected = 1;
					}
				}else{
					for(var i=0;i<this.miuse_List.length;i++){
						this.miuse_List[i].selected = 0;
						this.miuse_List[index].selected = 1;
					}
				}
				this.$toast("添加成功", "success")
				
			},
			getMiuseType(item){
				let obj ={
					catId:item.id,
					Sk:""
				}
				this.$Api.UserPage.MusicList(obj).then((res)=>{
//					console.log(res)
					if(res.q.s == 0){
						this.miuse_a = res.q.list//音乐
						this.sort = true
					}
					
				})
			},
			getMiuse(){
				this.$Api.UserPage.MusicCat().then((res)=>{
//					console.log(res)
					this.miuse = res.q.list
				})
			},
			onlineSearch(){
				let obj = {
					catId:0,
					Sk:this.seachValue
				}
				this.$Api.UserPage.MusicList(obj).then((res)=>{
//					console.log(res)
					this.miuse_List = res.q.list
				})
				console.log(111)
			},
			onSearch(){
				console.log('搜索音乐')
			},
			onCancel(){
				console.log('取消搜索音乐')
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
img{
	width: 100%;
	height: 100%;
}
.btn{
	text-align: center;
	line-height: .98rem;
	width: 100%;
	background: #FADC56;
	font-size: .3rem;
	position: fixed;
	bottom: 0;
}
	.warp{
		padding: .24rem 0;
		.seach{
			width: 100%;
		}
		.miuse_List{
			overflow: hidden;
			li{
				float: left;
				margin-top: .4rem;
				margin-left: .22rem;
				p{
					width: 3.4rem;
					height: 3.4rem;
					background: #007AFF;
				}
				.font{
					font-size: .3rem;
					padding-top: .24rem;
				}
			}
		}
		.seachMiuse{
			padding-bottom: .98rem;
			li{
				overflow: hidden;
				border-bottom: 0.01rem solid #EDEDED;
				padding:.4rem .24rem .48rem ;
				.miuse_img{
					width:1rem;
					height:1rem;
					border-radius:0.06rem;
					background: url(../../../static/img/1.png) no-repeat ;
					background-size:100% 100% ;
					float: left;
					position:relative;
					.miuse_img_bg{
						width: 100%;
						height: 100%;
						background: rgba(0,0,0,.5);
						position: absolute;
						top: 0;
						left: 0;
						border-radius:0.06rem;
					}
					.miuse_img_play{
						width:0.34rem;
						height:0.34rem;
						background: url(../../assets/location_btn_play@2x.png) no-repeat;
						position: absolute;
						background-size: 100% 100%;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						z-index: 11;
					}
				}
				.miuse_val{
					padding-left: .32rem;
					float: left;
					
					width: 5rem;
					h3{
						font-size:0.3rem;
						font-family:PingFang-SC-Bold;
						font-weight:bold;
						color:rgba(51,51,51,1);
						text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					}
					p{
						font-size:0.22rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(153,153,153,1);
						padding-top: .18rem;
					}
				}
				.appen_miuse{
					float: right;
					line-height: 1rem;
					color: #333333;
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