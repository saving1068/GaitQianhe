<!-- 商城首页加入购物车页面 -->
<template>
	<div class="joinShoppingCar">
		
		<!-- 套餐类型 -->
		<section>
			
			<header class="cf">
				套餐类型
				<span class="fr">返现活动正在进行中~</span>
			</header>
			
			<footer>

				<div class="cf">
					<span :class="{active_span:isAct == 0}">{{ spec }}<img src="../../assets/gou.png" v-show="true"/></span>
					<!--<span>广州出发-日本两日游</span>-->
				</div>
				
			</footer>
			
		</section>
		
		<!-- 出发日期 -->
		<section>
			
			<h1>
				出发日期：{{ nian }}年{{ yue }}月{{ ri }}日
			</h1>
			
			<header class="cf">
				<h2 :class="{active_mon: n == 0}" @click="pickNext(currentYear,month,0)">{{ month }}月</h2>
				<h2 :class="{active_mon: n == 1}" @click="pickNext(currentYear,month+1,1)">{{ month+1>12?month+1-12:month+1}}月</h2>
				<h2 :class="{active_mon: n == 2}" @click="pickNext(currentYear,month+2,2)">{{ month+2>12?month+2-12:month+2}}月</h2>
				<h2 :class="{active_mon: n == 3}" @click="pickNext(currentYear,month+3,3)">{{ month+3>12?month+3-12:month+3}}月</h2>
			</header>
			
			<footer>
				<!-- 星期 -->
				<div class="cf">
					<h3 class="fl" v-for="(item,index) in weekdays">{{item}}</h3>
				</div>
				
				<!-- 日期 -->
				<div class="cf">
					<ul class="days">
						<li @click.stop="pick($event,day,days)" v-for="(day,index) in days">						
							<!--<div style="color: #DEDEDE;" v-if="day.date.getMonth()+1 != currentMonth">{{ day.date.getDate() }}</div>-->
							<!--<i v-show="day.dateFlog == true">出发</i>-->
							<i v-if="day.date.getMonth()+1 == currentMonth">{{ day.date.getDate() }}</i>
							<!--<i v-show="day.priceFlog == true && day.priceFlag == false">¥{{ ((btnTxt == 3 || 1) && (tripManType == 1) ? day.groupPrice : day.childrenGroupPrice) || ((btnTxt == 2) && (tripManType == 1) ? day.price : day.childrenPrice) }}</i>-->
						</li>
					</ul>
				</div>
			</footer>
			
		</section>
		
		<!-- 出发人群 -->
		<section>
			
			<header>
				出发人群
			</header>
			
			<footer class="cf">
				<span :class="{active_span: isBg == index}" @click="click_span(index)" v-for="(item,index) in spans">{{ item }}<img src="../../assets/gou.png" v-show="isBg == index"/></span>
				<!--<span>儿童<img src="../../assets/gou.png"/></span>-->
			</footer>
			
		</section>
		
		<!-- 底部顶置位 -->
		<footer class="footer_equal"></footer>
		<!-- 底部按钮 -->
		<footer class="footer">
			<p class="fl">¥<b>{{ priceing }}</b></p>
			<button class="fr" @click="goAffirmIndent">确认</button>
		</footer>
		
	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
			grspuId:this.$route.query.grspuId,
			spuId:this.$route.query.spuId,
			eq:this.$route.query.eq,
			id:this.$route.query.id,
			ID:this.$route.query.ID,
			spec:this.$route.query.spec,
			placeDate:this.$route.query.placeDate,
			price:this.$route.query.price,
			childrenGroupPrice:this.$route.query.childrenGroupPrice,
			
			year:new Date().getFullYear(),
			month:new Date().getMonth() + 1,
			currentDay: new Date().getDate(), //日（现在）；
			currentMonth: new Date().getMonth() + 1, //月（现在）；
			currentYear: new Date().getFullYear(),  //年（现在）；
			currentWeek: new Date().getDay(),  //星期（现在）；
			nowDay:new Date().getDate(),
			nowMonth:new Date().getMonth()+1,
			nowYear:new Date().getFullYear(),
			days: [],
			weekdays:["日","一","二","三","四","五","六"],
			
			n: 0,
			buttonTxt:'',
			SkuId:this.$route.query.skuId,
			dateId:null,
			spans:['成人','儿童'],
			isBg:0,
			goodSetMeals:[],
			isAct:0,
			d:null, //日期；
			m:null, //月份；
			dPricesY:null, //年（出发的）；
			dPricesM:null, //月（出发的）；
			dPricesDay:null, //日（出发的）；	
			footerPrice:0,
			mon:new Date().getMonth()+1,
			nian:"--",
			yue:"--",
			ri:"--",
			packageType:'',
			date:'',
			skuId:this.$route.query.skuId,
			tripManType:1, //默认是选择成人；
			tagIndex: 0,
			//shangciTime:false,
			priceing:null,
			
		}
	},
	created() {
		console.log(this.$route.query,'$route.query')
		//console.log(this.childrenGroupPrice,'childrenGroupPrice')
		let arr = this.placeDate.split('-');
		this.nian = arr[0];
		this.yue = arr[1];
		this.ri = arr[2];
		this.priceing = this.price; //一进来页面默认是选择成人价；
		
		this.getData(); //一进来就获取当前的时间；
		//console.log(this.currentMonth)
		this.currentYear = (new Date().getMonth()+1)>12?this.currentYear+1:this.currentYear;
		this.mon = (new Date().getMonth()+1)>12?this.mon-12:this.mon;
		
	},
	mounted() {

	},
	methods: {
		setDate(index) {
			//console.log('huhiuhihih',this.goodSetMeals[index])
			this.goodSetMeals[index]['datePrices'].forEach((item,index1)=> {
				//console.log('item item',item)
				
				item.priceFlog = true;
						
				let dPrices = new Date(item.date), //获取到数据活动价格的时间；
					dPricesY = dPrices.getFullYear(), //年；
					dPricesM = dPrices.getMonth()+1, //月；
					dPricesDay = dPrices.getDate(); //日；
				
				this.dPricesY = dPricesY;
				this.dPricesM = dPricesM;
				this.dPricesDay = dPricesDay;
				this.days.forEach( (item,i) => {
					//console.log(this.days)
					//console.log(item)
					//console.log('this.dayssss',this.goodSetMeals[index],i)
					if (item.date.getDate() == dPricesDay) { //判断日期=当日；
						item.priceFlog = true; //控制当月日期活动价格的状态；
						/*
						 * (vue.js 2.0)正确写法：this.$set(this.data,”key”,value’)
						 * 原因是：受 ES5 的限制，Vue.js 不能检测到对象属性的添加或删除。
						 * 因为 Vue.js 在初始化实例时将属性转为 getter/setter，
						 * 所以属性必须在 data 对象上才能让 Vue.js 转换它，才能让它是响应的。;
						*/
						this.$set(item,'dateFlog',false); 
						this.$set(item,'childrenGroupPrice',this.goodSetMeals[index].datePrices[index1].childrenGroupPrice);//发起拼团价格(儿童)；
						this.$set(item,'childrenPrice',this.goodSetMeals[index].datePrices[index1].childrenPrice);  //加入价格(儿童)；
						this.$set(item,'groupPrice',this.goodSetMeals[index].datePrices[index1].groupPrice);//发起拼团价格(成人)；
						this.$set(item,'price',this.goodSetMeals[index].datePrices[index1].price);  //加入价格(成人)；
						this.$set(item,'id',this.goodSetMeals[index].datePrices[index1].id); //给对象加时间Id；
//								item.dateFlog = false; //控制出发和黄色边框样式的选中状态；
						//console.log(item)
						//this.d = dPricesDay;
						//console.log('=10日了')
					}
					//console.log(item.date)
				})
			})
		},
		seekClass(index){
			this.isAct = index;
//			this.tagIndex = index
			this.days = [];
			var d = new Date(this.formatDate(this.currentYear, this.currentMonth + 1, 1));
			//console.log(d)
			d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
//         this.days.forEach((item)=> {
//         		console.log('fjgfjs')
//         })
			this.setDate(index);
//			console.log('hajdgfjsgfjsdf',this.goodSetMeals[this.isAct])
			this.packageType = this.goodSetMeals[index].setMeal;
			console.log(this.packageType)

		},
		getData() {  //获取时间(进入页面就默认的当年当月值)；
//			let mealObj = {
//				spuId:this.spuId,
//				year: this.mon>12? this.currentYear+1:this.currentYear,
//				month: this.mon>12? this.mon-12 : this.mon
//			};
//			
//			//商品套餐和出行日期价格；
//			this.$Api.Shop.GoodSetMeal(mealObj).then( res => {
//				console.log(res)
//				
//				this.goodSetMeals = [...res.q.goodSetMeals];
//				
//				this.packageType = this.goodSetMeals[0].setMeal;  //首次载入页面默认选择第一个；
//				console.log(this.packageType)
//				this.skuId = this.goodSetMeals[0].skuId;
//				//console.log(this.goodSetMeals)
//				this.setDate(this.isAct)
//				
//			});
			
			var d = new Date(this.formatDate(this.currentYear, this.currentMonth + 1, 1));
			//console.log(d)
			d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			
			//console.log('刚载入页面的this.days',this.days)
		},
		
		selData(data) {
			return data.getFullYear() == new Date().getFullYear() && data.getMonth()== new Date().getMonth()&& data.getDate() == new Date().getDate()

		},

		initData: function(cur) {
			//				var mon;
			var date;
			date = new Date(cur);
		    console.log(date)
			this.currentDay = new Date(cur).getDate();
			this.currentYear = date.getFullYear();
			this.currentMonth = date.getMonth() + 1;
			this.currentWeek = date.getDay(); // 1...6,0
			if(this.currentWeek == 0) {
				this.currentWeek = 7;
			}
			
			var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
			console.log("today:" + str + "," + this.currentWeek);
			this.days.length = 0;
		
			// 今天是周日，放在第一行第7个位置，前面6个；
			//console.log('for循环外面的this.currentWeek',this.currentWeek)
			for(var i = this.currentWeek; i >= 0; i--) {
				var d = new Date(str);
				d.setDate(d.getDate() - i);
				console.log("y:" + d.getDate());
				var obj = {
					date: d,
					flag: false,
					priceFlag:true, //加一个标志(这个标志是用来判断渲染价格数据时消失的元素来占位置的),真是消失，让他同时判断两个条件;
				}
				this.days.push(obj);
				
				//console.log(this.days)
			}
			for(var i = 1; i <= 34 - this.currentWeek; i++) {
				var d = new Date(str);
				d.setDate(d.getDate() + i);
				var obj = {
					date: d,
					flag: false,
					priceFlag:false, //加一个标志(这个标志是用来判断渲染价格数据时消失的元素来占位置的),假是不消失;
				}
				this.days.push(obj);
				
				//console.log(this.days)
			}
//			for(var i = 0; i < this.days.length; i++) {
//				for(var j = 0; j < this.list.length; j++) {
//					if(this.days[i].date.getFullYear() == this.list[j].getFullYear() && this.days[i].date.getMonth() == this.list[j].getMonth()&&this.days[i].date.getMonth()==this.currentMonth-1 && this.days[i].date.getDate() == this.list[j].getDate()) {
//						this.days[i].flag = true;
//					}
//
//				}
//
//			}

			//console.log(this.days)
		},
		pick: function(ev,dat,dats) {
			ev = ev || window.event;
			let el1 = ev.currentTarget,
		    	el2 = ev.target;
		    
			console.log('hsgfdhsgfhj',dat);
			//console.log(dats)
			
			//判断是否是发起拼团跳进来的；
			if (this.btnTxt == 3) { //是，就显示活动价；
				this.footerPrice = dat.groupPrice;
				
				//判断点击的是黑色日期还是灰色；
			    if(el2.className == 'dateColor'){ //点击的是黑色日期；
			    	this.footerPrice = dat.groupPrice;
			    	
			    	//每次点击都先全部设置为false;
					for (let i=0;i<dats.length;i++) {
						dats[i].dateFlog = false;
					}
					
					//再给点击的那个加；
					this.$nextTick(()=>{
						this.$set(dat,'dateFlog',true)
					})
					
					this.dateId = dat.id; //这是用来判断是否选择了可以选中日期的；
					//用显示出发日期的；
					this.nian = dat.date.getFullYear();
					this.yue = this.mon>12?this.mon-12:this.mon;
					this.ri = dat.date.getDate();
					
			        console.log('是黑色，可以点击（加黄色边框）')
			   	} else { //是灰色；
			   		this.footerPrice = 0; //点击灰色给不选中状态，初始值为0；
			   		
			    	//每次点击都先全部设置为false;
					for (let i=0;i<dats.length;i++) {
						dats[i].dateFlog = false;
					}
					
					//再给点击的那个加，如果刚开始点击过的那个日期就是不要取消黄色边框；
					this.$nextTick(()=>{
						this.$set(dat,'dateFlog',false)
					})
					
					this.dateId = null; //null说明没有日期id，点击灰色就不给选；
					//用显示出发日期的；
					this.nian = `--`;
					this.yue = `--`;
					this.ri = `--`;
			    	console.log('不是黑色，不给点击（加黄色边框）')
			   	}
			} else { //不是（加入购物车和立即购买跳进来的）,就显示正常价；
				this.footerPrice = dat.price;
					
				//判断点击的是黑色日期还是灰色；
			    if(el2.className == 'dateColor'){ //点击的是黑色日期；
			    	this.footerPrice = dat.price;
			    	
			    	//每次点击都先全部设置为false;
					for (let i=0;i<dats.length;i++) {
						dats[i].dateFlog = false;
					}
					
					//再给点击的那个加；
					this.$nextTick(()=>{
						this.$set(dat,'dateFlog',true)
					})
					
					this.dateId = dat.id; //这是用来判断是否选择了可以选中日期的；
					//用显示出发日期的；
					this.nian = dat.date.getFullYear();
					this.yue = this.mon>12?this.mon-12:this.mon;
					this.ri = dat.date.getDate();
					
			        console.log('是黑色，可以点击（加黄色边框）')
			   	} else { //是灰色；
			   		this.footerPrice = 0; //点击灰色给不选中状态，初始值为0；
			   		
			    	//每次点击都先全部设置为false;
					for (let i=0;i<dats.length;i++) {
						dats[i].dateFlog = false;
					}

					//再给点击的那个加，如果刚开始点击过的那个日期就是不要取消黄色边框；
					this.$nextTick(()=>{
						this.$set(dat,'dateFlog',false)
					})
					
					this.dateId = null; //null说明没有日期id，点击灰色就不给选；
					//用显示出发日期的；
					this.nian = `--`;
					this.yue = `--`;
					this.ri = `--`;
			    	console.log('不是黑色，不给点击（加黄色边框）')
			   	}
			}
			//console.log(dat)
			//console.log(this.days)
			//			  	if(this){
			//			  		this.ifGet = true;
			//			  	}
			//console.log(date.getDate())
			//				console.log(this.formatDate)
			//				console.log(date.getDate())
			
		},
		pickNext: function(year, month,num) {
			console.log('点击传进来的year',year)
			console.log('点击传进来的month',month)
			this.mon = month;
			//console.log('点击的this.mon',this.mon)
			let atYear = new Date().getFullYear(); //获取一个当前年数；
			let nowYear,nowMonth;
			//先判断传进来的年份是大于1年，还是等于当年的；
			if (year == atYear) { //等于当年;
				//再判断传入的月份，如果大于12个月就+1年；
				if (month > 12) {
					nowYear = year+1;
					nowMonth = month>12?month-12:month;
					console.log('等于2019年的')
				}else{
					nowYear = year;
					nowMonth = month>12?month-12:month;
					console.log('等于2018的')
				}
				console.log('等于当年')
			} else if(year == (atYear+1)){ //大于1年的；
				//再判断传入的月份，如果大于4个月就-1年（因为月份最多是4个按钮选择，第一个按钮是12月份，最多是第二年的1~3月份）；
				if (month > 3) {
					nowYear = year-1;
					nowMonth = month>12?month-12:month;
				}
				console.log('大于1年的')
			}
			console.log('点击月份的nowYear','点击月份的nowMonth',nowYear,nowMonth)
			
			this.n = num;
			this.getData();
			var d = new Date(this.formatDate(nowYear, nowMonth, 1));
			//console.log(d)
//			d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth()+1, 1));
		},
		pickYear: function(year, month) {
//				alert(year + "," + month);
		},

		// 返回 类似 2016-01-02 格式的字符串
		formatDate: function(year, month, day) {
			var y = year;
			var m = month;
			if(m < 10) m = "0" + m;
			var d = day;
			if(d < 10) d = "0" + d;
			return y + "-" + m + "-" + d
		},
		
		//点击选择成人还是儿童；
		click_span(index){
			this.isBg = index;
			this.tripManType = index+1;
			console.log(this.tripManType,'选择成人还是儿童')
			
			//判断点击的是成人还是儿童；
			if (this.tripManType == 1) {
				this.priceing = this.price;
			} else if (this.tripManType == 2){
				//判断如果这个参与拼团没有儿童价，就让它等于成人价进行参团购买；
				if (this.childrenGroupPrice == undefined) {
					this.priceing = this.price;
				}else{
					this.priceing = this.childrenGroupPrice;
				}
			}
		},
		
		//跳转确认订单页面（参与拼团部分）；
		goAffirmIndent(){
			this.$router.push({
				name: "AffirmIndent",
				query: {
					couponId:0,
					skuId:this.skuId,
					spuId:this.spuId,  //产品id；
					grspuId:this.grspuId,
					eq:this.eq+"", //点击拼团信息的那条下标；
					id:this.gID,
					tripManType:this.tripManType
				}
			})
		},
	},
}

</script>

<style type="text/css" scoped>
.days {
	padding: 0;
	background: #FFFFFF;
	margin: 0;
}

.days li {
	display: inline-block;	
	width: 0.92rem;
	height: 0.96rem;
	margin-left: 0.14rem;
	font-size:0.28rem;
	font-family:PingFang-SC-Bold;
	color:rgba(51,51,51,1);
	text-align: center;
	position: relative;
}
.days li i{
	font-style: normal;
	display: block;
	width: 100%;
	position: absolute;
	left: 0rem;
}

/*.days li i:nth-of-type(1){
	font-size:0.18rem;
	color:rgba(153,153,153,1);
	top: 0rem;
}*/
.days li i:nth-of-type(1){
	font-size:0.28rem;
	color:rgba(153,153,153,1);
	top: 0.23rem;
}
/*.days li i:nth-of-type(3){
	font-size:0.2rem;
	color:rgba(246,50,62,1);
	top: 0.6rem;
}*/

</style>
<style scoped lang="less">
.dateColor{color: #000000 !important;}
/*该商城页面加入购物车样式*/
.joinShoppingCar{
	background: #fff;
	
	/*套餐类型*/
	section:nth-of-type(1){
		padding-bottom: 0.4rem;
		border-bottom:1px solid #ccc;
		
		header{
			height: 1rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
			line-height:1rem;
			padding-left: 0.25rem;
			box-sizing: border-box;
			span{
				font-size:0.22rem;
				color:rgba(246,50,62,1);
			}
		}
		
		footer{
			padding: 0 0.24rem;
			box-sizing: border-box;
			span{
				width:3.38rem;
				height:0.88rem;
				background:rgba(249,249,249,1);
				border-radius:0.03rem;
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				color:rgba(102,102,102,1);
				line-height:0.88rem;
				float: left;
				text-align: center;
				margin-left: 0.25rem;
				margin-bottom: 0.25rem;
				position: relative;
				z-index: 10;
				white-space:nowrap;text-overflow:ellipsis;overflow:hidden; /*强制不换行，超出省略号*/
			}
			span:nth-of-type(odd){
				margin-left: 0;
			}
			img{
				position: absolute;
				right: 0;
				bottom: 0;
				width:0.22rem;
				height:0.22rem;
				
			}
			button{
				width:1.88rem;
				height:0.66rem;
				background:rgba(250,220,86,1);
				border-radius:0.05rem;
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				color:rgba(255,255,255,1);
				line-height:0.66rem;
				text-align: center;
			}
		}
		
	}
	
	/*出发日期*/
	section:nth-of-type(2){
		h1{
			height: 1.08rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
			line-height:1.08rem;
			text-indent: 0.25rem;
		}
		header{
			height: 0.7rem;
			box-sizing: border-box;
			line-height:0.7rem;
			border-bottom: 1px solid #ccc;
			h2{
				float: left;
				width:1.11rem;
				height:100%;
				font-size:0.3rem;
				font-family:PingFang-SC-Medium;
				color:rgba(51,51,51,1);
				text-align: center;
				margin-left: 0.25rem;
				box-sizing: border-box;
			}
		}
		
		footer{
			border-bottom: 1px solid #ccc;
			div:nth-of-type(1){
				height: 0.7rem;
				line-height: 0.7rem;
				h3{
					width: 14.28%;
					height: 100%;
					font-size:0.22rem;
					font-family:PingFang-SC-Medium;
					color:rgba(51,51,51,1);
					text-align: center;
				}
			}
			
			div:nth-of-type(2){
				/*height: 0.9rem;*/
				
				span{
					width: 0.92rem;
					height: 0.96rem;
					margin-left: 0.13rem;
					font-size:0.28rem;
					font-family:PingFang-SC-Bold;
					color:rgba(51,51,51,1);
					text-align: center;
					
					/*line-height: 0.96rem;*/
					/*padding-top: 0.1rem;
					box-sizing: border-box;*/
					
					i{
						font-style: normal;
						display: block;
					}
					
					i:nth-of-type(1){
						font-size:0.18rem;
						color:rgba(153,153,153,1);
					}
					i:nth-of-type(2){
						font-size:0.28rem;
						color:rgba(153,153,153,1);
					}
					i:nth-of-type(3){
						font-size:0.2rem;
						color:rgba(246,50,62,1);
					}
					
				}
				
			}
		}
		
	}
	
	/*出发人群*/
	section:nth-of-type(3){
		header{
			height: 0.85rem;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(51,51,51,1);
			line-height:0.85rem;
			text-indent: 0.25rem;
		}
		
		footer{
			padding-bottom: 0.65rem;
			span{
				float: left;
				width:1.4rem;
				height:0.88rem;
				background:rgba(249,249,249,1);
				border-radius:0.03rem;
				font-size:0.26rem;
				font-family:PingFang-SC-Medium;
				color:rgba(102,102,102,1);
				line-height:0.88rem;
				text-align: center;
				margin-left: 0.25rem;
				box-sizing: border-box;
				position: relative;
				img{
					position: absolute;
					right: 0;
					bottom: 0;
					width: 0.22rem;
					height: 0.22rem;
				}
			}
		}
	}
	
	/*底部提问输入框样式*/
	.footer_equal{
		width: 100%;
		height: 0.98rem;
		/*background: pink;*/
	}
	.footer{
		width: 100%;
		height: 0.98rem;
		border-top: 1px solid #efefef;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		p{
			font-size:0.24rem;
			font-family:PingFang-SC-Bold;
			color:rgba(246,50,62,1);
			padding: 0.3rem 0 0 0.25rem;
			b{
				font-size:0.3rem;
			}
		}
		button{
			width:3.75rem;
			height:0.98rem;
			background:rgba(250,220,86,1);
			outline: none;
			border: none;
			font-size:0.3rem;
			font-family:PingFang-SC-Medium;
			color:rgba(26,26,26,1);
			line-height:0.5rem;
			text-align: center;
		}
	}
	
}

/*选中套餐类型样式*/
.active_span{
	background: #fffae1 !important;
	border: 2px solid #fadc56;
	box-sizing: border-box;
	color: #000 !important;
	border-radius: 0.03rem !important;
}

/*选中几月样式*/
.active_mon{
	border-bottom: 3px solid #fadc56;
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
button{
	outline: none;
	border: none;
}
</style>
