<template>
	<div style="height:100vh;">
		<div class="tab_change">
			<div @click="chang(0)" class="tab_item">国内</div>
			<div @click="chang(1)" class="tab_item">国外</div>
			<div class="bottom_line" :style="LinkStyle">

			</div>
		</div>
		<div class="domestic" v-if="index == 0">
			<div class="hot" :style="{height:windowHeight}" style="-webkit-overflow-scrolling: touch;">
				<li @click="getAddress()">热门</li>
				<li v-for="(v,i) in shuList" @click="shuChang(v,i)">{{v.name}}</li>
				<div v-if="shuIndex == 0" class="silde" :style="{'top':`1.1rem`}"></div>
				<div v-else class="silde" :style="{'top':`${Number(shuIndex)*.88+1.1}rem`}"></div>
			</div>
			<div class="city_list" style="height:100%;">
				<li v-for="(v,i) in cittList" :class="[v.active?'list_item':'','item']" @click="place(v,i)">
					<span>{{v.name}}</span>
				</li>

			</div>
		</div>
		<div class="abroad" v-if="index == 1" style="height:80%;">
			<div class="hot">
				<li v-for="(v,i) in continentList" @click="foreignChang(v,i)">{{v.name}}</li>
				<!-- <div v-if="shuIndex == 0" class="silde" :style="{'top':`1.1rem`}"></div> -->
				<div  class="silde" :style="{'top':`${Number(shuIndex)*.88+0.22}rem`}"></div>
			</div>
			<div class="city_list" style="overflow-y: scroll;height:100%;overflow-x: hidden;">
				<li class="country_list" v-for="(v,i) in countryList">
					<div class="country">{{v.name}}</div>
					<div class="country_city">
		<li  :class="[val.active?'list_item':'','country_list_city']" v-for="(val,index) in v.list"   @click="foreignPlace(val,index,i)">
							{{val.name}}
   </li>
					</div>
				</li>

			</div>
		</div>
		<div class="btn" @click="goBack">
			确认
		</div>
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
			this.getAddress()
			if(this.$route.query.activeIndex == 0) {
				if(this.$route.query.type == "from") {
					if(this.$store.state.Home.made.deparPlace) {
						this.placeList.push(this.$store.state.Home.made.deparPlace)
						this.siteIds.push(this.$store.state.Home.made.fromId)
					}

				} else {
					if(this.$store.state.Home.made.destination) {
						this.placeList = [...this.$store.state.Home.made.destination.split(",")]
						this.siteIds = [...this.$store.state.Home.made.toId.split(",")]
					}

				}
			} else {

				if(this.$route.query.type == "from") {
					if(this.$store.state.Home.teamMade.deparPlace) {
						this.placeList.push(this.$store.state.Home.teamMade.deparPlace)
						this.siteIds.push(this.$store.state.Home.teamMade.fromId)
					}

				} else {
					if(this.$store.state.Home.teamMade.destination) {
						this.placeList = [...this.$store.state.Home.teamMade.destination.split(",")]
						this.siteIds = [...this.$store.state.Home.teamMade.toId.split(",")]
					}

				}

			}

			this.getRegionList(obj)
		},
		data() {
			return {
				windowHeight:window.screen.height-44-49+"px",
				seach_value: "",
				index: 0,
				shuIndex: -1,
				shuList: [],
				cittList: [],
				province: "", //选择完的省
				cityName: "", //选择完的城市
				siteIds: [], //地点Id
				placeList: [],
				countryList:[],
				continentList:[
					{name:"亚洲",id:11},
					{name:"欧洲",id:12},
					{name:"北美洲",id:13},
					{name:"南美洲",id:14},
					{name:"非洲",id:15},
					{name:"大洋洲",id:16},
					{name:"南极洲",id:17}
				]

			}
		},
		methods: {
			getAddress(){ //热门
			this.$Api.Home.AdList({a:4}).then((res)=>{
				console.log(res)
				if(res.q.s==0){
						this.cittList=[]
					this.shuIndex = -1
					// this.ifHot=true
					for(let i=0;i<res.q.ads.length;i++){
						let obj={}
						obj.name=res.q.ads[i].title
						obj.id=res.q.ads[i].actionContent
							obj.active=false
							this.cittList.push(obj)
					}
					if(this.placeList.length > 0) {
 					 for(let i = 0; i < this.cittList.length; i++) {
 						 for(let j = 0; j < this.placeList.length; j++) {
 							 if(this.cittList[i].name == this.placeList[j]) {
 								 this.cittList[i].active = true

 							 }

 						 }
 					 }

 				 }
					// this.hotCityList=res.q.ads
				}


			})

		},
			chang(index) {

				if(index == 0) {
					this.index = 0
					this.shuIndex=-1
				} else {
					this.index = 1
					this.shuIndex=0
					this.getForeignList({
							a: 9,
							id: this.continentList[0].id
						})
				}
			},
			getForeignList(obj){
				this.$Api.UserPage.RegionList(obj).then((data) => {

						console.log(data, "国家列表")
						// this.countryList = [...data.q.items]
            for(let i=0;i<data.q.items.length;i++){
							let obj={...data.q.items[i]}
							var arr=[]
							if(data.q.items[i].list){
								for(let j=0;j<data.q.items[i].list.length;j++){
									let newObj={...data.q.items[i].list[j]}
							      	newObj.active=false
									  arr.push(newObj)
								}
								obj.list=[...arr]
							}
               this.countryList.push(obj)
						}


						if(this.placeList.length > 0) {
						 for(let i = 0; i < this.countryList.length; i++) {
							 if(this.countryList[i].list){
								 for(let k=0;k<this.countryList[i].list.length;k++){
									 for(let j = 0; j < this.placeList.length; j++) {
										if(this.countryList[i].list[k].name == this.placeList[j]) {
											this.countryList[i].list[k].active = true

										}

									}
								 }
							 }

						 }

					 }







				})
			},
			getRegionList(obj) {
				this.$Api.UserPage.RegionList(obj).then((res) => {
					if(res.q.s == 0) {
						this.shuList = [...res.q.items];

						// this.getCityList({
						// 	a: 2,
						// 	id: this.shuList[0].id
						// })
					}

				})
			},
			getCityList(obj) {
				this.cittList = []
				this.$Api.UserPage.RegionList(obj).then((data) => {
					console.log(data, "城市列表")

					for(let i = 0; i < data.q.items.length; i++) {

						let obj = { ...data.q.items[i]
						}
						obj.active = false
						this.cittList.push(obj)
					}
					if(this.placeList.length > 0) {
						for(let i = 0; i < this.cittList.length; i++) {
							for(let j = 0; j < this.placeList.length; j++) {
								if(this.cittList[i].name == this.placeList[j]) {
									this.cittList[i].active = true

								}

							}
						}

					}

				})
			},
			shuChang(item, index) {
				this.shuIndex = index;

				var obj = {
					a: 2,
					id: item.id
				}
				this.getCityList(obj)
			},
			foreignChang(item,index){

								var obj = {
									a: 9,
									id: item.id
								}
				this.shuIndex = index;//洲市
				var obj = {
					a: 9,
					id: item.id
				}
				this.getForeignList(obj)//国家

			},
			foreignPlace(item,index,fromIndex){
				console.log(item)
				if(item.active){
					this.$set(item, 'active', false)
					for(let i=0;i<this.siteIds.length;i++){
						if(this.siteIds[i]==item.id){
							this.siteIds.splice(i,1)
							this.placeList.splice(i,1)
						}

					}

					return
				}

				if(this.$route.query.type == "from") {
					if(this.siteIds.length >= 1) {
						for(let i = 0; i < this.countryList.length; i++) {
							if(this.countryList[i].list){
								for(let j=0;j<this.countryList[i].list.length;j++){
									let a = this.countryList[i].list[j]
									if(a.id == this.siteIds[0]) {
	                          console.log(1)
										this.$set(this.countryList[i].list[j], 'active', false)

									}
								}
							}


						}
						this.siteIds.shift()
						this.placeList.shift()
					}
				} else {
					if(this.siteIds.length >= 3) {

						for(let i = 0; i < this.countryList.length; i++) {
							if(this.countryList[i].list){
								for(let j=0;j<this.countryList[i].list.length;j++){
									let a = this.countryList[i].list[j]
									if(a.id == this.siteIds[0]) {
	                          console.log(1)
										this.$set(this.countryList[i].list[j], 'active', false)

									}
								}
							}


						}


						this.siteIds.shift()
						this.placeList.shift()
					}
				}

				this.siteIds.push(item.id)
				this.placeList.push(item.name)

				this.$set(item, 'active', true)
			},
			place(item, index) {
				if(item.active){
					this.$set(item, 'active', false)
					for(let i=0;i<this.siteIds.length;i++){
						if(this.siteIds[i]==item.id){
							this.siteIds.splice(i,1)
							this.placeList.splice(i,1)
						}

					}

					return
				}


				if(this.$route.query.type == "from") {
					if(this.siteIds.length >= 1) {
						for(let i = 0; i < this.cittList.length; i++) {
							let a = this.cittList[i]
							if(a.id == this.siteIds[0]) {

								this.$set(this.cittList[i], 'active', false)

							}

						}
						this.siteIds.shift()
						this.placeList.shift()
					}
				} else {
					if(this.siteIds.length >= 3) {
						for(let i = 0; i < this.cittList.length; i++) {
							let a = this.cittList[i]
							if(a.id == this.siteIds[0]) {

								this.$set(this.cittList[i], 'active', false)

							}

						}
						this.siteIds.shift()
						this.placeList.shift()
					}
				}

				this.siteIds.push(item.id)
				this.placeList.push(item.name)

				this.$set(item, 'active', true)

			},
			goBack(){
				console.log(this.siteIds)
				console.log(this.placeList)
				if(this.$route.query.id){
					this.$store.state.Travels.siteIds = this.siteIds.join(',')
							this.$store.state.Travels.cityName = this.placeList.join(",")
							this.$router.go(-1)
				}else{
					this.$store.state.sendTravels.siteIds = this.siteIds.join(',')
							this.$store.state.sendTravels.cityName = this.placeList.join(",")
							this.$router.go(-1)
				}

//
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
			next()

		},
	}
</script>

<style scoped="scoped" lang="less">
	.btn {
		text-align: center;
		line-height: .9rem;
		width: 100%;
		background: #FADC56;
		font-size: .32rem;
		position: fixed;
		bottom: 0;
	}

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
		height: 9rem;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
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
		height: 9rem;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		width: 6rem;
		.country{
		font-size:0.28rem;
		font-family:PingFang-SC-Regular;
		font-weight:700;
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
				margin-top: 0.2rem;
				/*font-size: 0.28rem;*/
				text-align: center;
				background: #F9F9F9;
				border-radius: 0.06rem;
				line-height: .5rem;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space:nowrap

			}
			.list_item {
				background: #FADC56;
			}
			.country_list_city:nth-child(3n+1) {
				margin-left: 0.5rem;
			}
		}
		.cite_more{
			padding: .2rem 0;
		}
	}

		.item {
			float: left;
			width: 1.5rem;
			height: .5rem;
			margin-right: 0.35rem;
			margin-top: 0.4rem;
			font-size: 0.28rem;
			text-align: center;
			background: #F9F9F9;
			border-radius: 0.06rem;
			line-height: .5rem;
			/*对宽度的定义,根据情况修改*/
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			span {
				float: left;
				font-size: 14px;
				width: 100%;
				height: 100%;
				/*对宽度的定义,根据情况修改*/
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.item:nth-child(3n+1) {
			margin-left: 0.35rem;
		}
		/*li {
			clear: both;
		}*/
		.item span {
			float: left;
			max-width: 100%;
		}
		.item:after {
			content: "...";
		}
		.list_item {
			background: #FADC56;
		}
	}
</style>
<style type="text/css">

</style>
