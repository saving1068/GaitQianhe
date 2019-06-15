<!-- 商城首页加入购物车页面 -->
<template>
	<div class="joinShoppingCar">

		<!-- 套餐类型 -->
		<section>
			<header class="cf">
				套餐类型
				<span class="fr" v-show="returnCash">返现活动正在进行中~</span>
			</header>

			<footer>
				<div class="cf">
					<span :class="{active_span:isAct == index}" v-for="(item,index) in goodSetMeals" @click="seekClass(index)">{{ item.setMeal }}<img src="../../assets/gou.png" v-show="isAct == index"/></span>
					<!--<span>广州出发-日本两日游</span>-->
				</div>

				<div>
					<button v-text="btnA" v-show="isBtnA" @click="tabChange()">改成购买</button>
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
						<li @click.stop="pick($event,day,days)" v-for="(day,index) in days" :class="{active_span: day.dateFlog == true}">
							<!--<div style="color: #DEDEDE;" v-if="day.date.getMonth()+1 != currentMonth">{{ day.date.getDate() }}</div>-->
							<i v-show="day.dateFlog == true">出发</i>
							<i v-if="day.date.getMonth()+1 == currentMonth" :class="{dateColor:day.priceFlog == true}">{{ day.date.getDate() }}</i>
							<i v-if="day.date.getMonth()+1 == currentMonth && day.priceFlog == true && day.priceFlag == false">¥{{ (btnTxt == 3) ? ((tripManType == 1) ? day.groupPrice : day.childrenGroupPrice): ((tripManType == 1) ? day.price : day.childrenPrice) }}</i>
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
			<p class="fl">¥<b v-text="footerPrice">4999</b></p>
			<button class="fr" v-text="buttonTxt" @click="goAffirmIndent3(btnTxt)">立即开团</button>
		</footer>

	</div>
</template>

<script>
import { Toast } from 'vant';

export default {
	data() {
		return {
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
			buttonTxts:['确认','提交订单','立即开团'],
			btnTxt:this.$route.query.btnTxt,  //判断是从哪里点击跳转进来的；
			buttonTxt:'',
			btnA:'',
			btnB:['改成拼团','改成购买'],
			isBtnA:true,
			spuId:this.$route.query.spuId,
			SkuId:this.$route.query.skuId,
			shopId:this.$route.query.shopId, //要编辑那个购物车的id；
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
			skuId:null,
			tripManType:1, //默认是选择成人；
			tagIndex: 0,
			shangciTime:false,
			returnCash:false, //默认没返现；
		}
	},
	created() {
		//console.log(this.btnTxt,'btnTxtbtnTxtbtnTxt')
		//判断是从哪里点击跳转进来的；
		if (this.btnTxt == 0) { //从点击选择：出发地/套餐/人群；
			this.buttonTxt = this.buttonTxts[1];
			this.btnA = this.btnB[0];

			console.log('选择')
		} else if (this.btnTxt == 1) { //从点击加入购物车；
			this.buttonTxt = this.buttonTxts[0];
			this.isBtnA = false;

			console.log('购物车')
		} else if (this.btnTxt == 2){  //从点击立即购买；
			this.buttonTxt = this.buttonTxts[1];
			this.btnA = this.btnB[0];
			this.tabOnoff = false; //正常价；

			console.log('立即购买')
		}else if (this.btnTxt == 3){  //从点击发起拼团；
			this.buttonTxt = this.buttonTxts[2];
			this.btnA = this.btnB[1];
			this.tabOnoff = true;  //拼团价；

			console.log('发起拼团')
		}else if (this.btnTxt == 4){  //从购物车页面点击编辑；
			this.buttonTxt = this.buttonTxts[0];
			this.isBtnA = false;

			console.log('购物车编辑进来的')
		}

		this.getData(); //一进来就获取当前的时间；
		console.log('页面刚在入还没赋值前的this.currentYear',this.currentMonth)
		//this.currentYear = (new Date().getMonth()+1)>12?this.currentYear+1:this.currentYear;
		this.mon = (new Date().getMonth()+1)>12?this.mon-12:this.mon;
		console.log('页面刚在入的this.currentYear',this.currentYear)
	},
	mounted() {

	},
	methods: {
		//切换改为购买还是改为拼团；
		tabChange(){
//			let startTime = new Date().getTime(); //当前的；
//			if(!this.shangciTime || (startTime-this.shangciTime)>500) {
//				this.shangciTime=startTime;

				//首先，判断是从哪里点击跳转进来的；
				if (this.btnTxt == 2) { //立即购买;
					this.btnA = this.btnB[1];
					this.buttonTxt = this.buttonTxts[2];
					this.btnTxt = 3;

					//判断是否有选择日期；
					this.days.forEach( item => {
						if (item.dateFlog == true) {  //选了给活动价；
							//this.footerPrice = item.groupPrice;
							item.dateFlog = false;
						}
						
						if (item.groupPrice == undefined) {
							item.priceFlog = false;
							console.log('item.groupPrice=undefined',item.priceFlag)
						}else{
							item.priceFlog = true;
						}
						console.log(item,'aaaaa')
					})
					
					//也是全部清空，让用户重新选择；
					this.footerPrice = 0;
					this.nian = `--`;
					this.yue = `--`;
					this.ri = `--`;
					this.tripManType = 1;
					this.isBg = 0;
					this.isAct = 0;
					this.dateId = null;
					this.packageType = this.goodSetMeals[0].setMeal;
					console.log('立即购买状态页面')
				} else if(this.btnTxt == 3){ //发起拼团;
					this.btnA = this.btnB[0];
					this.buttonTxt = this.buttonTxts[1];
					this.btnTxt = 2;

					//判断是否有选择日期；
					this.days.forEach( item => {
						if (item.dateFlog == true) {  //这个选了给正常价；
							//this.footerPrice = item.price;
							item.dateFlog = false;
						}
						
						if (item.price == undefined) {
							item.priceFlog = false;
							console.log('item.price=undefined',item.priceFlag)
						}else{
							item.priceFlog = true;
						}
						console.log(item,'bbbb')
					})
					
					//也是全部清空，让用户重新选择；
					this.footerPrice = 0;
					this.nian = `--`;
					this.yue = `--`;
					this.ri = `--`;
					this.tripManType = 1;
					this.isBg = 0;
					this.isAct = 0;
					this.dateId = null;
					this.packageType = this.goodSetMeals[0].setMeal;
					console.log('发起拼团状态页面',this.btnA,this.buttonTxt)
				}
//			}
		},

		setDate(index) {
			//console.log('huhiuhihih',this.goodSetMeals[index])
			this.goodSetMeals[index]['datePrices'].forEach((item,index1)=> {
				//console.log('item item',item)
				//this.chosen = this.tripManType
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
					}
					
					//这里是判断如果点击选择月份时，刚载入日期和价格的显示控制，商家用户是否有没有设置各种类型价格的地方；
					if (this.btnTxt == 3) { //发起拼团；
						if (this.tripManType == 1 && item.groupPrice != undefined) { //当有设置成人活动价，就显示；
							item.priceFlog = true;
							//console.log('bbbbbbbb',item)
						}
					} else{ //立即购买；
						if (this.tripManType == 1 && item.price == undefined) { //当没有设置成人正常价，就不显示；
							item.priceFlog = false;
							//console.log('ccccc',item)
						}
					}
					
					//console.log(item.date)
				})
			})
		},
		seekClass(index){
			//先清空时间id和价格；
			this.dateId = null;
			this.footerPrice = 0;
			this.isAct = index;
			this.days = [];
			var d = new Date(this.formatDate(this.currentYear, this.currentMonth + 1, 1));
			//console.log(d)
			d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			this.setDate(index);
//			console.log('hajdgfjsgfjsdf',this.goodSetMeals[this.isAct])
			this.packageType = this.goodSetMeals[index].setMeal;
			console.log(this.packageType,'this.packageType')
		},
		getData() {  //获取时间(进入页面就默认的当年当月值)；
			let mealObj = {
				spuId:this.spuId,
				year: this.currentYear,
				month: this.mon
			};
			console.log('传给后台的年月',mealObj.year,mealObj.month)
			//商品套餐和出行日期价格；
			this.$Api.Shop.GoodSetMeal(mealObj).then( res => {
				console.log(res)

				this.goodSetMeals = [...res.q.goodSetMeals];

				this.packageType = this.goodSetMeals[0].setMeal;  //首次载入页面默认选择第一个；
				//console.log(this.packageType)
				this.skuId = this.goodSetMeals[0].skuId;
				//console.log(this.goodSetMeals)
				this.setDate(this.isAct)

				if (res.q.returnCash == 1) { //该商品有返现（不考虑规格类型）；
					this.returnCash = true;
				}
			});
			
			var d = new Date(this.formatDate(this.currentYear, this.mon, 1));
			console.log('getData里的d',d)
			//d.setDate(0);
			this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			//console.log('刚载入页面的this.days',this.days)
		},
		//用来设置日期的；
		initData: function(cur) {
			var date;
			date = new Date(cur);
		    console.log('initData里的date',date)
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
			for(var i = 1; i <= 41 - this.currentWeek; i++) {
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
		},
		pick: function(ev,dat,dats) {
			ev = ev || window.event;
			let el1 = ev.currentTarget,
		    	el2 = ev.target;

			console.log('选择日期的dat',dat);
			//console.log(dats)

			//判断是否是发起拼团跳进来的；
			if (this.btnTxt == 3) { //是，就显示活动价；
				//先是默认成人活动价；
				this.footerPrice = dat.groupPrice;

				//判断点击的是黑色日期还是灰色；
			    if(el2.className == 'dateColor'){ //点击的是黑色日期；
			    	//再判断点击的成人还是儿童价；
					if (this.tripManType == 1) { //成人活动价；
						this.footerPrice = dat.groupPrice;
					} else if (this.tripManType == 2) { //儿童活动价；
						this.footerPrice = dat.childrenGroupPrice;
					}

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
				//先默认的是成人正常价；
				this.footerPrice = dat.price;

				//判断点击的是黑色日期还是灰色；
			    if(el2.className == 'dateColor'){ //点击的是黑色日期；
			    	//再判断点击的成人还是儿童价；
					if (this.tripManType == 1) { //成人正常价；
						this.footerPrice = dat.price;
					} else if (this.tripManType == 2) { //儿童正常价；
						this.footerPrice = dat.childrenPrice;
					}

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
		},
		pickNext: function(year, month,num) {
			let startTime = new Date().getTime(); //当前的；
			if(!this.shangciTime || (startTime-this.shangciTime)>800) {
				this.shangciTime=startTime;
				
				//无论你是否选择了日期的价格，每重新选择一次都要清空全部的日期的价钱（左下角）和时间；
				this.footerPrice = 0; 
				this.nian = `--`;
				this.yue = `--`;
				this.ri = `--`;
				this.tripManType = 1;
				this.isBg = 0;
	
				console.log('点击传进来的year',year)
				console.log('点击传进来的month',month)
				//判断传进来的年份；
				let nowFear = new Date().getFullYear();
				if (year == nowFear) { //等于当年;
					year = nowFear;
					console.log('等于当年',year)
					//判断传进来的月份；
					if (month > 12) { //大于12月份就+1年；
						year++;
						this.currentYear = year;
						month = month-12;
						this.mon = month;
						console.log('大于12月份',this.currentYear,this.mon)
					}
				} else{ //不等于当年；
					//判断是等于当年是大于了当年的1年还是2年以上；
					if (year == nowFear+1) {
						if (month > 12) { //大于12月份就+1年；
							this.currentYear = year;
							month = month-12;
							this.mon = month;
							console.log('大于12月份',this.currentYear,this.mon)
						}
						
						//当等于12月份时，就是当你回点击上一年的（12月和下一年1月），再来判断减一年；
						if(month == 12){
							year--;
							this.currentYear = year;
							this.mon = month;
							console.log('等于12月份',this.currentYear,this.mon)
						}
						//console.log('等于当年的1年',year)
					}else if (year == nowFear+2) {
						year--;
						if (month > 12) { //大于12月份就+1年；
							this.currentYear = year;
							month = month-12;
							this.mon = month;
							console.log('大于12月份',this.currentYear,this.mon)
						}
						console.log('等于当年的2年',year)
					}else if (year == nowFear+3) {
						year = year-2;
						if (month > 12) { //大于12月份就+1年；
							this.currentYear = year;
							month = month-12;
							this.mon = month;
							console.log('大于12月份',this.currentYear,this.mon)
						}
						console.log('等于当年的3年',year)
					}
				}
	
				this.n = num;
				this.getData();
				var d = new Date(this.formatDate(year,month, 1));
				console.log('点击月份的d',d)
				//d.setDate(0);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth()+1, 1));
			}
		},

		// 返回 类似 2016-01-02 格式的字符串
		formatDate: function(year, month, day) {
			var y = year;
			var m = month;
			console.log('formatDate的y',y,month)
			if(m < 10){ //小于10月补零；
				m = "0" + m
			}else if(m > 12){ //大于12月返还第二年的1月；
				m = "0" + (m - 12);
				//y++;
			};
			var d = day;
			if(d < 10) d = "0" + d;
			console.log('y + "-" + m + "-" + d',y + "-" + m + "-" + d)
			return y + "-" + m + "-" + d;
		},

		//点击选择成人还是儿童；
		click_span(index){
			this.isBg = index;
			this.tripManType = index+1;
			//console.log(this.tripManType,'选择成人还是儿童')

			this.days.forEach( item => {
				if (item.dateFlog == true) {
					//先判断从哪个页面跳转进来的；
					if (this.btnTxt == 3) { //发起拼团；
						//再判断点击的成人还是儿童价；
						if (this.tripManType == 1 && item.groupPrice != undefined){ //是点击成人时，且有成人活动价；
							item.priceFlog = true;
							this.footerPrice = item.groupPrice;
							//console.log('有成人活动价')
						}else if(this.tripManType == 2 && item.childrenGroupPrice != undefined) { //点击儿童时，且有儿童活动价；
							item.priceFlog = true;
							this.footerPrice = item.childrenGroupPrice;
							//console.log('有儿童活动价')
						}
					} else{ //商城详情的加入购物车和立即购买进来的；
						if (this.tripManType == 1 && item.price != undefined) { //点击成人时，且有成人正常价；
							item.priceFlog = true;
							this.footerPrice = item.price;
							//console.log('有成人正常价')
						}else if (this.tripManType == 2 && item.childrenPrice != undefined) { //点击儿童时，且有儿童正常价；
							item.priceFlog = true;
							this.footerPrice = item.childrenPrice;
							//console.log('有儿童正常价')
						}
					}
					console.log('有active_span')
				} else{
					//先判断从哪个页面跳转进来的；
					if (this.btnTxt == 3) { //发起拼团,才有活动价；
						//判断如果没有儿童价(包括正常价和活动价)的话，就不渲染显示，为灰色字体；
						if (this.tripManType == 1 && item.groupPrice != undefined){ //是点击成人时，且有成人活动价；
							item.priceFlog = true;
							//console.log('有成人活动价')
						}else if(this.tripManType == 2 && item.childrenGroupPrice == undefined) { //点击儿童时，且没有儿童活动价；
							item.priceFlog = false;
							//console.log('没有儿童活动价')
						}else if (this.tripManType == 2 && item.childrenPrice != undefined) { //点击儿童时，且有儿童正常价；
							item.priceFlog = true;
						}else if (this.tripManType == 1 && item.price == undefined) { //点击成人时，没有成人正常价；
							item.priceFlog = false;
						}
					}else{ //加入购物车和立即购买，只有正常价；
						if (this.tripManType == 1 && item.price != undefined) { //点击成人时，且有成人正常价；
							item.priceFlog = true;
							//console.log('有成人正常价')
						}else if (this.tripManType == 2 && item.childrenPrice == undefined) { //点击儿童时，且没有儿童正常价；
							item.priceFlog = false;
							//console.log('没有儿童正常价')
						}else if (this.tripManType == 2 && item.childrenPrice != undefined) { //点击儿童时，且有儿童正常价；
							item.priceFlog = true;
						}else if (this.tripManType == 1 && item.price == undefined) { //点击成人时，没有成人正常价；
							item.priceFlog = false;
						}
					}
					console.log('没active_span')
				}
			})
		},

		//跳转确认订单页面；
		goAffirmIndent3(btnTxt){
			if(btnTxt == 1){ //从点击商城详情页面的加入购物车跳转进来的；
				let good = {
					skuId:this.goodSetMeals[0].skuId,
					dateId:this.dateId,
					tripMan:this.tripManType,
					num:1,
				};

				//判断是否选择日历的时间；
				if (good.dateId !== null) { //选了；
					let obj = {
						'a':1,  //1是添加商品；
						good
					};

					this.$Api.Shop.CartUpdate(obj).then( res => {
						console.log(res)

						if(res.q.s == 0){
							this.$router.push({
								name: "MyShoppingCar",
								query: {

								}
							})
						}
					});
				}else{ //没选；
					//Toast('我是提示文案，建议不超过十五字~');
					Toast('亲，请选择日期！');
					//console.log('没选');
				}

				console.log('加入购物车')
			}else if(btnTxt == 2){ //从点击商城详情页面的立即购买跳转进来的；
				if (this.dateId !== null) {
					this.$router.push({
						name: "AffirmIndent2",
						query: {
							skuId:this.skuId,
							spuId:this.spuId,
							packageType:this.packageType, //套餐的类型；
							date:`${this.nian}-${this.yue}-${this.ri}`,  //出行日期；
							price:this.footerPrice, //价格；
							tripManType:this.tripManType, //出发人群；
							dateId:this.dateId,  //出行人日期Id；
							btnTxt:this.btnTxt,
							couponId:0, //优惠券Id必传；
						},
					})
				} else{
					Toast('亲，请选择日期！');
					//console.log(btnTxt)
				}

				console.log('立即购买')
			}else if(btnTxt == 3){ //从点击商城详情页面的发起拼团跳转进来的；
				if (this.dateId !== null) {
					this.$router.push({
						name: "AffirmIndent2",
						query: {
							skuId:this.skuId,
							spuId:this.spuId,
							packageType:this.packageType, //套餐的类型；
							date:`${this.nian}-${this.yue}-${this.ri}`,  //出行日期；
							price:this.footerPrice, //价格；
							tripManType:this.tripManType, //出发人群；
							dateId:this.dateId,  //出行人日期Id；
							btnTxt:this.btnTxt,
							couponId:0, //优惠券Id必传；
						},
					})
				} else{
					Toast('亲，请选择日期！');
					//console.log(btnTxt)
				}

				console.log('发起拼团')
			}else if (btnTxt == 4) { //从点击购物车编辑跳转进来的；
				if (this.dateId !== null) {
					//修改购物车编辑的资料；
					let good = {
						id:this.shopId, //购物车id；
						skuId:this.SkuId,
						dateId:this.dateId,
						tripMan:this.tripManType,
						num:1, //编辑数量从初始值1开始；
					};

					let obj = {
						a:1, //编辑和添加商品都是a=1；
						good
					};
					this.$Api.Shop.CartUpdate(obj).then( res => {
						console.log(res)

						if(res.q.s == 0){
							//修改好后资料，跳转回购物车页面；
							this.$router.push({
								name: "MyShoppingCar",
								query: {

								}
							})
						}
					});
				} else {
					Toast('亲，请选择日期！');
				}

				console.log('购物车编辑进来的')
			}
		}
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

.days li i:nth-of-type(1){
	font-size:0.18rem;
	color:rgba(153,153,153,1);
	top: 0rem;
}
.days li i:nth-of-type(2){
	font-size:0.28rem;
	color:rgba(153,153,153,1);
	top: 0.23rem;
}
.days li i:nth-of-type(3){
	font-size:0.2rem;
	color:rgba(246,50,62,1);
	top: 0.6rem;
}

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
