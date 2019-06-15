<template>
	<div>
		<!--<div class="topSeach">-->
			<!--<div class="seach">
				<van-search placeholder="目的地/城市/景点" v-model="seach_value" @search="onSearch" @cancel="onCancel" @input="searching()"/>
			</div>-->
		<!--</div>-->
		<div class="tab_change">
			<div @click="chang(0)" class="tab_item">国内</div>
			<div @click="chang(1)" class="tab_item">国外</div>
			<div class="bottom_line" :style="LinkStyle">

			</div>
		</div>
		<div class="domestic" v-if="index == 0">
			<div class="hot" style="-webkit-overflow-scrolling: touch;">
				<li @click="getAddress()">热门</li>
				<li v-for="(v,i) in shuList" @click="shuChang(v,i,'province')">{{v.name}}</li>
				<div v-if="shuIndex == 0" class="silde" :style="{'top':`1.1rem`}"></div>
				<div v-else class="silde" :style="{'top':`${Number(shuIndex)*.88+1.1}rem`}"></div>
			</div>
			<div class="city_list">
				<li class="city_item" @click="place(v,i)" v-for="(v,i) in cittList">{{ !ifHot ? v.name : v.title }}</li>

			</div>
		</div>
		<div class="abroad" v-if="index == 1" style="overflow: hidden;">
			<div class="hot" style="-webkit-overflow-scrolling: touch;">
				<!--<li>热门</li>-->
				<li v-for="(v,i) in continentList" @click="shuChang(v,i,'country')">{{v.name}}</li>
				<div v-if="shuIndexTwo == 0" class="silde" :style="{'top':`.25rem`}"></div>
				<div v-else class="silde" :style="{'top':`${Number(shuIndexTwo-1)*.88+1.1}rem`}"></div>
			</div>
			<div class="city_list" style="overflow-y: scroll;height: 8rem;">
				<li class="country_list" v-for="(v,i) in countryList">
					<div class="country">{{v.name}}</div>
					<div class="country_city">
						<li class="country_list_city" v-for="(val,item) in v.list" @click="place(val,item)">
							{{val.name}}
						</li>
					</div>
				</li>

			</div>
		</div>
		<van-popup v-model="data_show" position="bottom">
			<van-datetime-picker :max-date="maxDate"  v-model="currentDate" type="year-month" :formatter="formatter" @confirm="ok" @cancel="not" confirm-button-text="确定" cancel-button-text="取消" />
		</van-popup>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default {
		created() {
			var obj = {
				a: 1,
				id: 0
			}
			this.getRegionList(obj)//省份
			this.getAddress()
		},
		data() {
			return {
				seach_value: "",
				index: 0,
				shuIndex: -1,
				shuIndexTwo:0,
				shuList: [],
				cittList: [],
				province: "", //选择完的省
				cityName: "", //选择完的城市
				time: "", //修改的时间
				currentDate: new Date(), //选择时间
				data_show: false,
				continentList:[
					{name:"亚洲",id:11},
					{name:"欧洲",id:12},
					{name:"北美洲",id:13},
					{name:"南美洲",id:14},
					{name:"非洲",id:15},
					{name:"大洋洲",id:16},
					{name:"南极洲",id:17}
				],
				countryList:[],//国家列表
				searchFlag:false,
				maxDate:new Date(),
				ifHot:false
			}
		},
		mounted(){
			console.log(this.maxDate)
		},
		methods: {
			getAddress(){//热门
				this.$Api.Home.AdList({a:4}).then((res)=>{
					if(res.q.s==0){
						this.ifHot=true
						this.shuIndex = -1
						this.cittList=res.q.ads
					}


				})

			},
			chang(index) {
				if(index == 0) {
					this.index = 0
				} else {
					this.index = 1

					this.getCityList({
							a: 9,
							id: this.continentList[0].id
						},"continent")
				}
			},
			ok(value) {
				this.data_show = false
				var y = value.getFullYear()
				var m = value.getMonth() + 1
				//				m = m < 10 ? '0' + m : m;
//				console.log(y + '-' + m)
				this.time = y + '-' + m
				if(this.$route.query.id) {
					var obj = {
						a: this.$route.query.a,
						id: this.$route.query.id,
						date: this.time,
						regionId: this.cityId,
					}
				} else {
					var obj = {
						a: this.$route.query.a,
						date: this.time,
						regionId: this.cityId,
					}
				}
				this.$Api.UserPage.AddfootprintInfo(obj).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.$router.go(-1);
					} else {
						Toast(res.q.d);
					}
				})

			},
			not() {
				this.data_show = false
			},
			formatter(type, value) {

				if(type === 'year') {
					return `${value}年`;
				} else if(type === 'month') {
					return `${value}月`
				}
				return value;
			},
			getRegionList(obj) {
				this.$Api.UserPage.RegionList(obj).then((res) => {
					if(res.q.s == 0) {
						this.shuList = res.q.items;
						this.province = this.shuList[0].name;
//						this.getCityList({
//							a: 2,
//							id: this.shuList[0].id
//						},"province")
					}

				})
			},
			getCityList(obj,type) {//城市
				this.$Api.UserPage.RegionList(obj).then((data) => {
					if(type == "province"){
						console.log(data, "城市列表")
						this.cittList = data.q.items
					}else{
						console.log(data, "国家列表")
						this.countryList = data.q.items
					}

				})
			},
			shuChang(item, index,type) {
				this.ifHot = false;
				if(type == "province"){
					this.shuIndex = index;//省份
					this.province = item.name;//省份名字
					var obj = {
						a: 2,
						id: item.id
					}

					this.getCityList(obj,type)//城市
				}else{
					this.shuIndexTwo = index;//洲市
					var obj = {
						a: 9,
						id: item.id
					}
					this.getCityList(obj)//国家
				}
			},
			place(item, index) {
								console.log(item)
				if(item.actionContent){
					this.cityName = item.title;
					this.cityId = item.actionContent;
				}else{
					this.cityName = item.name;
					this.cityId = item.id;
				}

				if(this.$route.query.type == "Trip") { //从足迹页面进来
					this.data_show = true;
				} else if(this.$route.query.name == 'Location'){
					this.$router.go(-1)
				}else if(this.$route.query.name == 'HomeSearch') {
					this.searchFlag=true
					this.$router.replace({
						name:"HomeSearch",
						query:{
							cityId:this.cityId,
							place:this.cityName
						}
					})
				}else{
					this.$router.go(-1)
				}

			},
			onSearch() {

			},
			onCancel() {

			},
		},
		computed: {
			LinkStyle() {
				if(this.index == 0) {
					return "left:0"
				} else {
					return "left:50%"
				}
			},
		},
		beforeRouteLeave(to, from, next) {

			if(to.name=="HomeSearch"){
				// to.query.cityId=this.cityId;
				// to.query.place = this.cityName;


			}else if(to.name=="Home"||to.name=="Location"&&!this.searchFlag){
         console.log(to)
        let query={...this.$route.query}

				if(Object.keys(query).length===0){
					this.$router.push({
						name:"HomeSearch"


					})
				}else{
					this.$router.push({
						name:"HomeSearch",
						query:{...query}


					})

				}


			}



			next()
		}

	}
</script>

<style scoped="scoped" lang="less">
	.topSeach {
		padding: .24rem 0;
		.seach {
			margin: 0 auto;
			width: 7.02rem;
			height: .6rem;
			border-radius: .3rem;
		}
	}

	.tab_change {
		width: 100%;
		height: .88rem;
		position: relative;
		.tab_item {
			width: 50%;
			text-align: center;
			float: left;
			line-height: .88rem;
		}
		.bottom_line {
			position: absolute;
			bottom: 0;
			height: 0.04rem;
			width: 50%;
			background: #FADC56;
			transition: 1s all;
		}
	}

	.domestic {
		overflow: hidden;
	}

	.hot {
		float: left;
		position: relative;
		height: 8rem;
		overflow-y: scroll;
		li {
			width: 1.4rem;
			height: .88rem;
			line-height: .88rem;
			text-align: center;
			font-size: .3rem;
			border: 0.01rem solid #EDEDED;
			border-top: none;
			border-left: none;
		}
		.silde {
			position: absolute;
			width: 0.07rem;
			height: 0.44rem;
			background: rgba(250, 220, 86, 1);
			left: 0;
			top: 0;
			transition: .5s all;
		}
	}

	.city_list {
		float: left;
		width: 6.08rem;
		overflow: hidden;
		/*display: flex;*/
		/*justify-content:space-between;*/
		/*flex-wrap:wrap;*/
		.city_item {
			/*width: 33.33%;*/
			/*padding:.2rem .4rem;*/
			float: left;
			width: 1.5rem;
			height: .5rem;
			margin-right: 0.35rem;
			margin-top: 0.4rem;
			/*font-size: 0.28rem;*/
			text-align: center;
			background: #F9F9F9;
			border-radius: 0.06rem;
			line-height: .5rem;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space:nowrap
			/*padding:.2rem  .2rem .2rem;*/
		}
		.city_item:nth-child(3n+1) {
			margin-left: 0.35rem;
		}
	}
	.country{
			font-size:0.28rem;
			font-family:PingFang-SC-Regular;
			font-weight:400;
			color:rgba(42,42,53,1);
			text-align: center;
			line-height: .9rem;
			text-align: center;
			height: .9rem;
			width: 100%;

		}
		.country_list{
			width: 6.08rem;

			float: left;
			text-align: center;
			padding: 0;
			.country_city{
				max-height: 3.05rem;
				/*display: flex;*/
				/*justify-content:center;*/
				/*flex-wrap:wrap;*/
				overflow: hidden;
				.country_list_city{
					float: left;
					width: 1.5rem;
					height: .5rem;
					margin-right: 0.35rem;
					/*margin-top: 0.4rem;*/
					/*font-size: 0.28rem;*/
					text-align: center;
					background: #F9F9F9;
					border-radius: 0.06rem;
					line-height: .5rem;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space:nowrap

				}
				.country_list_city:nth-child(3n+1) {
					margin-left: 0.5rem;
				}
			}
			.cite_more{
				padding: .2rem 0;
			}
		}
</style>
