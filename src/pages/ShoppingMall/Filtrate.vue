<!-- 商城筛选页面 -->
<template>
	<div class="filtrate">
		
		<!-- 价格区 -->
		<section>
			<h1 class="alike_h1">价格区</h1>
			
			<div class="cf">
				<input type="text" placeholder="最低价" v-model.trim="minPrice"/>
				<span>——</span>
				<input type="text" placeholder="最高价" v-model.trim="maxPrice"/>
			</div>
		</section>
		
		<!-- 出发日期 -->
		<section>
			<h1 class="alike_h1">出发日期</h1>
			
			<div @click="click_time">
				<input type="text" placeholder="请选择出发日期" class="date" v-model="tripDate"/>
			</div>
		</section>
		
		<!-- 行程天数 -->
		<section>
			<h1 class="alike_h1">行程天数</h1>
			
			<section class="week cf">
				<button v-for="(item,index) in dateNums" 
						v-text="item" 
						@click="click_journey(index)"
						ref="dayId">
					1天
				</button>
			</section>
		</section>
		
		<!-- 游玩性质 -->
		<section>
			<h1 class="alike_h1">游玩性质</h1>
			
			<section class="week cf">
				<button v-for="(item,index) in natures" 
						v-text="item.name" 
						@click="click_playNature(index)" 
						ref="btnId">
					自由行纯玩团
				</button>
				<!--<button>自由行</button>
				<button>自由行</button>
				<button>自由行</button>-->
			</section>
		</section>
		
		<div class="btn"></div> <!-- 用于顶置底部确认位置 -->
		<button class="yes" @click="goSeekShoppingMall">确认</button>
		
		<!-- 选择日期（年月日） -->
		<div class="time" v-show="isTime">
			
			<van-datetime-picker
			  v-model="currentDate"
			  type="date"
			  :min-date="minDate"
			  @confirm="done"
			  @cancel="cancel"
			/>
			
		</div>
		
	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			minDate: new Date(), //现在不能选择过去的时间；
			currentDate: new Date(),//选择日期（年月日）;
			isTime:false,
			minPrice:null, //最低价；
			maxPrice:null, //最高价；
			tripDate:null,  //出行日期；
			dateNums:['1天','2天','3天','4天','5天','6天','7天','一周以上'], //静态渲染出行天数；
			dateNumsArr:[], //保存的行程天数；
			natures:[], //静态游玩性质;
			natureId:[], //游玩性质Id;
			min:null, //筛选后的参数1；
			max:null, //筛选后的参数；
			tri:null, //筛选后的参数3；
			dat:null, //筛选后的参数4；
			nat:null, //筛选后的参数5；
			orgId:this.$route.query.orgId,  //商店的ID，用来判断是从店铺筛选跳转过来还是搜索筛选；
			seek:this.$route.query.seek, //用来判断是从搜索筛选跳转的；
			show:false,
			
		}
	},
	created() {
		this.getNatureList();//静态渲染游玩性质；
		//console.log(this.maxPrice)
		//console.log(this.$route.query)
	},
	mounted() {
		if (this.$store.state.Shop.minPrice != null || this.$store.state.Shop.maxPrice || this.$store.state.Shop.tripDate) {
			this.minPrice = this.$store.state.Shop.minPrice;
			this.maxPrice = this.$store.state.Shop.maxPrice;
			this.tripDate = this.$store.state.Shop.tripDate;
			console.log('执行了minPrice',this.minPrice)
		}
	},
	computed:{        
		
	},
	methods: {
//		validateJyh(MinAndMax,type){ //校验关联交易号               
//			let reg = /[^\d]/g;
//			
//			if (type == "min") {
//				
//				if(reg.test( MinAndMax ) ){                    
//					//console.log('不是纯数字')
//					
//					//Toast('请输入纯数字'); //Vant插件请提示；
//					this.minPrice = '';			
//				}
//				
//				//console.log('min')
//			}else if (type == "max") {
//				
//				if(reg.test( MinAndMax ) ){
//					//Toast('请输入纯数字');
//					this.maxPrice = '';			
//				}
//				
//				//console.log('max')
//			}			
//			
//		},
		//点击选择行程天数；
		click_journey(index){
			//console.log(this.$refs)	
			if(this.$refs.dayId[index].className.length <= 0){
			    //首先先判断当前li有没有被选中，因为我这里li除了选中状态的有类名，其他没有类名，所以我就这么判断了。
			    //这么看有时候舍弃一小丢丢规范的东西反而省力。			 
			    this.$refs.dayId[index].className = 'active_bg';// 添加类
			    
				this.dateNumsArr.push(index+1);				
				//console.log(this.dateNumsArr)				
			}else{
			    //当前li已经被选中，那么在多选的逻辑里，是允许人们选中后再取消选中的，所以前端展示层面上把样式去掉。
			    this.$refs.dayId[index].className = '';// 选中再取消的情况
			    
			 	let arrOf = this.dateNumsArr.indexOf(index+1);
			 	//判断在数组里寻找到的那个值，并且移除它；
			 	if (arrOf > -1) {
			 		this.dateNumsArr.splice(arrOf,1);			 		
			 	}
			 	//console.log(this.dateNumsArr);
			}	
		},
		
		//点击选择游玩性质；
		click_playNature(index){			
			//console.log(this.$refs)
			if(this.$refs.btnId[index].className.length <= 0){
			    //首先先判断当前li有没有被选中，因为我这里li除了选中状态的有类名，其他没有类名，所以我就这么判断了。
			    //这么看有时候舍弃一小丢丢规范的东西反而省力。			 
			    this.$refs.btnId[index].className = 'active_bg';// 添加类
				this.natureId.push(this.natures[index].id);				
				//console.log(this.natureId)				
			}else{
			    //当前li已经被选中，那么在多选的逻辑里，是允许人们选中后再取消选中的，所以前端展示层面上把样式去掉。
			    this.$refs.btnId[index].className = '';// 选中再取消的情况 
			 	let arrOf = this.natureId.indexOf(this.natures[index].id);
			 	//判断在数组里寻找到的那个值，并且移除它；
			 	if (arrOf > -1) {
			 		this.natureId.splice(arrOf,1);			 		
			 	}
			 	//console.log(this.natureId);
			}

		},
		
		//选择日期（年月日）显示;
		click_time(){
			this.isTime = !this.isTime;
		},
		
		//点击时间选择器确定按钮时触发的事件;
		done(){
			this.isTime = !this.isTime;
			
			//console.log(this.currentDate)
			let DateFY = this.currentDate.getFullYear(),
				DateM = this.currentDate.getMonth()+1,
				DateD = this.currentDate.getDate(),
				Date = DateFY + '-' + DateM + '-' + DateD;
			
			this.tripDate = Date;
			//console.log(this.tripDate)	
			
		},
		
		//点击时间选择器取消按钮时触发的事件;
		cancel(){
			this.isTime = !this.isTime;
		},
		
		//跳转商城搜索页面；
		goSeekShoppingMall(){
			//用来判断是从店铺筛选跳转过来还是搜索筛选;
			if (this.seek == 'seek') { //是搜索筛选;
				let GsListObj = {
					a:0,
					ob:9,
					minPrice:this.minPrice,
					maxPrice:this.maxPrice,
					tripDate:this.tripDate,
					dateNum:this.dateNumsArr.join(","),
					natureId:this.natureId.join(",")
				};
				
				this.min = GsListObj.minPrice;
				this.max = GsListObj.maxPrice;
				this.tri = GsListObj.tripDate;
				this.dat = GsListObj.dateNum;
				this.nat = GsListObj.natureId;
				//点击筛选确认成功后，清空input，并且跳转回搜索页面；
				//this.minPrice = null;
				//this.tripDate = null;
				//this.m = 0;
				//this.n = null;
				//console.log(this.tri)	
				
				this.$router.go(-1)  //返回上一个页面；
				
				console.log('是搜索筛选')
			} else if(this.orgId != null){ //是店铺筛选;
				
				let GsListObj = {
					a:3,
					ob:9,
					'orgId':this.orgId,
					minPrice:this.minPrice,
					maxPrice:this.maxPrice,
					tripDate:this.tripDate,
					dateNum:this.dateNumsArr.join(","),
					natureId:this.natureId.join(",")
				};
				
				this.min = GsListObj.minPrice;
				this.max = GsListObj.maxPrice;
				this.tri = GsListObj.tripDate;
				this.dat = GsListObj.dateNum;
				this.nat = GsListObj.natureId;
				//点击筛选确认成功后，清空input，并且跳转回搜索页面；
				//this.minPrice = null;
				//this.tripDate = null;
				//this.m = 0;
				//this.n = null;
				//console.log(this.tri)		
				//this.$router.go(-1)
				this.goSeekShoppingMalling();
				
				console.log('是店铺筛选')
			}	
			
		},
		
		//跳转商城搜索页面（有参数的）；
		goSeekShoppingMalling(){

			this.$router.push({  
				name: "MerchantIndex",
				query: {
					ob:9,
					orderId:this.orgId,
					'min':this.min,
					'max':this.max,
					'tri':this.tri,
					'dat':this.dat,
					'nat':this.nat
				}
			})
			
		},
		
		getNatureList(){
			//游玩性质接口；
			this.$Api.Shop.NatureList({a:1}).then( res => {
				//console.log(res)
				this.natures = res.q.natures;
			})
		},
		
	},
	beforeRouteLeave(to,from,next){
		this.$store.commit('changeMinPrice',this.minPrice)
		this.$store.commit('changeMaxPrice',this.maxPrice)
		this.$store.commit('changeTripDate',this.tripDate)
		to.query.min = this.min;
		to.query.max = this.max;
		to.query.tri = this.tri;
		to.query.dat = this.dat;
		to.query.nat = this.nat;
		
		next()
	},
	
}

</script>

<style scoped lang="less">
/*该商城页面样式*/
.filtrate{
	background: #fff;
	section{
		div{
			background: #f9f9f9;
			width: 7rem;
			height: 0.98rem;
			margin: 0 auto;
			padding: 0.1rem;
			box-sizing: border-box;
			input{
				width:2.9rem;
				height:0.78rem;
				background:rgba(255,255,255,1);
				font-family:PingFang-SC-Regular;
				text-align: center;color:rgba(204,204,204,1);font-size:0.24rem;
				float: left;
			}
			span{color: rgba(35,35,35,1);float: left;height: 100%;line-height: 0.78rem;padding: 0 0.1rem;}
			
			.date{
				width:6.77rem;
				height:0.78rem;
				background:rgba(255,255,255,1);
				text-align: left;
				text-indent: 0.2rem;
			}
		}
		.week{
			padding: 0 0.25rem;
			box-sizing: border-box;
			button{
				outline: none;
				border: none;
				width:1.64rem;
				height:0.98rem;
				background:rgba(249,249,249,1);
				font-size:0.24rem;
				font-family:PingFang-SC-Regular;
				color:rgba(51,51,51,1);
				margin-right: 0.14rem;
				margin-bottom: 0.15rem;
				padding: 0;
				float: left;
			}
			button:nth-of-type(4n){
				margin-right: 0;
			}
		}
	}
	
	section:nth-of-type(3){
		button{margin-bottom: 0.15rem;}
	}
	
	.btn{
		width: 100%;
		height:0.98rem;
	}
	.yes{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height:0.98rem;
		background:rgba(250,220,86,1);
		font-size:0.34rem;
		font-family:PingFang-SC-Medium;
		color:rgba(26,26,26,1);
		border: none;
		outline: none;
	}
	
}


/*选择日期（年月日）样式*/
.time{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.7);
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

.alike_h1{
	height: 1.2rem;
	line-height: 1.2rem;
	text-indent: 0.25rem;
	font-size:0.3rem;
	font-family:PingFang-SC-Medium;
	color:rgba(26,26,26,1);
}

.active_bg{background: #fadc56 !important;}
</style>
<style type="text/css">
/*选择日期（年月日）样式*/	
.filtrate .van-picker{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}	

.filtrate .van-picker__toolbar{
	background: #eee;
}

.filtrate .van-picker__cancel{
	font-size:0.28rem;
	font-family:FZLTHJW--GB1-0;
	color:rgba(102,102,102,1);
}

.filtrate .van-picker__confirm{
	font-size:0.28rem;
	font-family:FZLTHJW--GB1-0;
	color:rgba(75,168,255,1);
}

.filtrate .van-picker-column__item--selected{
	font-size:0.36rem;
	font-family:FZLTHJW--GB1-0;
	color:rgba(51,51,51,1);
}

h1{margin: 0 0 !important;}
</style>