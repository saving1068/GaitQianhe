<template>
	<div>
		<div class="top">
			<navbarbase :title="title" :left="'back'" @isLeft="onClickLeft"></navbarbase>
		</div>
		<div class="content">
			<!--<img src="../../assets/my/3x/my_bg_integral@3x.png" />-->
			<div class="num">
				<p>{{score}}</p>
				<font>我的积分</font>
			</div>
		</div>
		<div id="calendar">
			<!-- 年份 月份 -->
			<div class="month">
				<ul>
					<li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
					<li class="year-month" @click="pickYear(currentYear,currentMonth)">
						<span class="choose-year">{{ currentYear }}-</span>
						<span class="choose-month">{{ currentMonth }}</span>
						<!--<span class="choose-day">-{{currentDay}}</span>-->
					</li>
					<li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
				</ul>
			</div>
			<!-- 星期 -->
			<ul class="weekdays">
				<li>S</li>
				<li>M</li>
				<li>T</li>
				<li>W</li>
				<li>T</li>
				<li>F</li>
				<li>S</li>
			</ul>
			<!-- 日期 -->
			<ul class="days">
				<li @click="pick(day)" v-for="day in days"  >
				
						<!--<div style="color: #DEDEDE;" v-if="day.date.getMonth()+1 != currentMonth">{{ day.date.getDate() }}
					</div>-->
						
						
						<div :class="[day.flag?'active':'']" v-if="day.date.getMonth()+1 == currentMonth">{{ day.date.getDate() }}
					</div>
				</li>
				</li>
			</ul>
		</div>
		<div class="bottom-btn" @click="go">
			立刻花积分
		</div>
	</div>
</template>

<script>
//	import navbarbase from '../../components/Navbarbase/Navbarbase'
//	import { Dialog } from 'vant';
	export default {
		components: {
//			navbarbase,
//			Dialog
		},
		data() {
			return {
				title: "我的签到",
				currentDay: new Date().getDate(),
				currentMonth: new Date().getMonth() + 1,
				currentYear: new Date().getFullYear(),
				currentWeek: new Date().getDay(),
				nowDay:new Date().getDate(),
				nowMonth:new Date().getMonth()+1,
				nowYear:new Date().getFullYear(),
				
				days: [],
				ifGet: false,
				score: 0,
				list: []
			}
		},
		created: function() {
			this.getData()
			console.log(this.currentMonth)
	
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
			go(){
				this.$router.push({
					name:"Allgoods",
					query:{
						flag:"false"
					}
				})
				
			},
			
			getData() {
				var obj = {
					"a": 2,
					"date": this.currentYear + "-" + this.currentMonth
				}
				this.$Api.SignAndGetIntegral(obj).then((res) => {
					console.log(res)
					this.score = res.q.totalNum
					if(res.q.logs.length > 0) {
						for(var i = 0; i < res.q.logs.length; i++) {
							this.list.push(new Date(res.q.logs[i]))

						}
						var newDate = this.list.filter(this.selData)
						if(newDate.length > 0) {
							var d = new Date(this.formatDate(this.currentYear, this.currentMonth + 1, 1));
							d.setDate(0);
							this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));

						} else {
							this.sign()

						}
						console.log(newDate)

					}else {
						
						if(this.currentMonth==this.nowMonth&&this.currentYear==this.nowYear&&this.currentDay==this.nowDay){
							console.log
							this.sign()
						}
						
					}

				})
			},
			selData(data) {
				return data.getFullYear() == new Date().getFullYear() && data.getMonth()== new Date().getMonth()&& data.getDate() == new Date().getDate()

			},
			sign() {
				var obj = {
					"a": 1,
				}
				this.$Api.SignAndGetIntegral(obj).then((res) => {
					console.log(res)
					
					if(res.q.s == 0) {
						this.getData()
						this.score = res.q.totalNum
					Dialog.alert({
							title: '签到成功',
							message: '获得'+res.q.num+"积分",
							confirmButtonText:"确认"
						}).then(() => {
							var d = new Date(this.formatDate(this.currentYear, this.currentMonth + 1, 1));
							d.setDate(0);
							this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));

						});

					}

				})
			},

			initData: function(cur) {
				//				var mon;
				var date;
				date = new Date(cur);

			
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
			
				// 今天是周日，放在第一行第7个位置，前面6个
				for(var i = this.currentWeek - 1; i >= 0; i--) {
					var d = new Date(str);
					d.setDate(d.getDate() - i);
					console.log("y:" + d.getDate());
					var obj = {
						date: d,
						flag: false
					}
					this.days.push(obj);
				}
				for(var i = 1; i <= 42 - this.currentWeek; i++) {
					var d = new Date(str);
					d.setDate(d.getDate() + i);
					var obj = {
						date: d,
						flag: false
					}
					this.days.push(obj);
				}
				for(var i = 0; i < this.days.length; i++) {
					for(var j = 0; j < this.list.length; j++) {
						if(this.days[i].date.getFullYear() == this.list[j].getFullYear() && this.days[i].date.getMonth() == this.list[j].getMonth()&&this.days[i].date.getMonth()==this.currentMonth-1 && this.days[i].date.getDate() == this.list[j].getDate()) {
							this.days[i].flag = true
						}

					}

				}

				console.log(this.days)
			},
			pick: function(date) {
				//			  	if(this){
				//			  		this.ifGet = true;
				//			  	}
				console.log(date.getDate())
				//				console.log(this.formatDate)
				//				console.log(date.getDate())
				
			},
			pickPre: function(year, month) {
				// setDate(0); 上月最后一天
				// setDate(-1); 上月倒数第二天
				// setDate(dx) 参数dx为 上月最后一天的前后dx天
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(0);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
				
				this.getData()
			},

			pickNext: function(year, month) {
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(42);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
				this.getData()
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
		}
	}
</script>

<style scoped="scoped">
	
	img {
		width: 100%;
		height: 100%;
	}
	
	.top {
		height: 0.9rem;
		border-bottom: 0.02rem solid #cdcdcd;
	}
	
	.content {
		height: 2.2rem;
		position: relative;
	}
	
	.num {
		position: absolute;
		width: 1.63rem;
		height: 1.63rem;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		font-size: 0.58rem;
		color: #E6BF6B;
	}
	
	.num p {
		width: 100%;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		border-bottom: 0.02rem solid #E6BF6B;
	}
	
	.num font {
		font-size: 0.32rem;
		text-align: center;
		line-height: 0.8rem;
		display: block;
	}
	
	* {
		box-sizing: border-box;
	}
	
	ul {
		list-style-type: none;
	}
	
	body {
		font-family: Verdana, sans-serif;
		background: #E8F0F3;
	}
	
	#calendar {
		padding: 0 0.3rem;
	}
	
	.month {
		width: 100%;
		background: #FFFFFF;
		color: #000000;
	}
	
	.month ul {
		display: flex;
		justify-content: space-between;
		height: 0.96rem;
	}
	
	.year-month {
		display: flex;
		align-items: center;
		width: 3rem;
		justify-content: center;
	}
	/*.year-month:hover {background: rgba(150, 2, 12, 0.1);}*/
	/*.choose-year {padding-left: 20px;padding-right: 20px;}*/
	
	.choose-month {
		text-align: center;
	}
	
	.arrow {
		padding: 0.18rem 0.7rem;
	}
	/*.arrow:hover {background: rgba(100, 2, 12, 0.1);}*/
	
	.month ul li {
		font-size: 0.4rem;
		text-transform: uppercase;
	}
	
	.weekdays {
		margin: 0;
		padding: 10px 0;
		background-color: #b1b1b1;
		display: flex;
		flex-wrap: wrap;
		color: #FFFFFF;
		justify-content: space-around;
	}
	
	.weekdays li {
		display: inline-block;
		width: 13.6%;
		text-align: center;
	}
	
	.days {
		padding: 0;
		background: #FFFFFF;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		
	}
	
	.days li {
		display: inline-block;
		width: 0.98rem;
		
		height: 0.98rem;
		
		text-align: center;
			border-radius: 50%;
	    position: relative;
		
		font-size: 0.32rem;
		color: #000;
	}
	.days li div{
		width: 0.7rem;
		
		height: 0.7rem;
		line-height: 0.7rem;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	
	
	.days  li div.active {
		
		border-radius: 50%;
	
		background: #e6bf6b;
		color: #fff;
	}
	
	.days li .other-month {
		padding: 5px;
		color: #cccccc;
	}
	
	.bottom-btn {
		width: 7.04rem;
		height: 0.9rem;
		background: #e6bf6b;
		border-radius: 0.1rem;
		text-align: center;
		line-height: 0.9rem;
		color: white;
		position: fixed;
		bottom: 0.3rem;
		left: 0.24rem;
	}
	/*.days li:hover {
  background: #e1e1e1;
  }*/
</style>