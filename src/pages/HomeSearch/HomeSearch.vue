<template>
	<div class="container">
		<div class="top">
			<form class="searchBox" action="" onsubmit="return false;">
				<i></i>
				<input type="search" id="input" v-model="text"   @keyup.enter="search" />
			</form>

		</div>
		<div class="nav_tab">
			<li :class="[activeIndex==0?'active':'']" @click="change(0)">热门</li>
			<li :class="[activeIndex==1?'active':'']" @click="change(1)">最新</li>
			<li :class="[activeIndex==2?'active':'']" @click="change(2)">
				<div >
						{{place!=""?place:'目的地'}}
				</div>

				<i></i>
			</li>
			<div class="underline" :style="underLineStyle"></div>
		</div>
		<div class="total">共{{total}}条结果</div>
		<div>
			<mu-load-more :loading="false" @load="load" :loaded-all="all">
			<div class="item" v-for="item in list" @click="go(item.id)">
				<div class="top">
					<div class="left">{{item.title}}</div>
					<div class="right">
						<img :src="item.imagePath" />
					</div>
				</div>
				<div class="bottom">
					<div class="avatar">
						<img :src="item.authorPath" />
					</div>
					<span style="font-size: 0.3rem;margin-left: 0.1rem;">{{item.authorName}}</span>
					<div class="opBox">
						<li>
							<i class="see"></i>
							<span v-if="parseInt(item.browseNum)<10000">{{item.browseNum}}</span>
							<span v-else>1W+</span>
						</li>
						<li>
							<i class="talk"></i>
							<span v-if="parseInt(item.commentNum)<10000">{{item.commentNum}}</span>
							<span v-else>1W+</span>

						</li>
						<li>
							<i class="like"></i>
							<span v-if="parseInt(item.collectNum)<10000">{{item.collectNum}}</span>
							<span v-else>1W+</span>

						</li>

					</div>
				</div>
			</div>
			<div v-show="loading" class="loading">
				<div class="mid">
					<i></i>
					<span>正在加载更多...</span>
				</div>
			</div>

				</mu-load-more>
				<div class="end" v-if="all">
					<div class="line" style="margin-right: 0.2rem;"></div>
					<span>你看到我的底线了</span>
					<div class="line" style="margin-left: 0.2rem;"></div>
				</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				list:[],
				place:"",
				text:"",
				total:0,
				pa:1,
				loading: false,
				all: true,
				cityId:0,
				flag:false

			}

		},
		computed: {
			underLineStyle() {
				if(this.activeIndex == 0) {
					return {
						"left": '12.5%'
					}

				} else if(this.activeIndex == 1) {
					return {
						"left": '46%'
					}

				}else if(this.activeIndex == 2) {
					return {
						"left": '78%',
						"width":"0.8rem"
					}

				}

			}

		},
		created(){

			if(this.$route.query.cityId){

				this.activeIndex=0
				this.cityId=this.$route.query.cityId
				this.place=this.$route.query.place


			}
		  if(this.$route.query.text){
         	this.text=this.$route.query.text

			}
			console.log(this.$router)
      // if()





		},
		mounted(){

        // this.all=false
				this.getData()

		},
		methods: {
			search(){
				this.pa=1
				this.list=[]
				this.loading = true
				this.all = false
				this.getData()

			},
			load() {
        let flag=false
				if(!this.flag){
	        flag=true
	      }else{
	        return
	      }
	      this.flag=true

				this.loading = true;
				if(flag&&this.flag){

					this.getData()
				}


			},
			go(id){
				this.$router.push({
					name:"TravelDetails",
					query:{
						id:id
					}

				})

			},
			change(num) {
				this.pa=1;
				this.list=[]
				this.loading=false
				this.all=false
				if(num != 2) {
					this.activeIndex = num
					this.getData(num+1)

				}else{
					let obj={}
          if(this.place!=""){
             obj.place=this.place
						 obj.cityId=this.cityId
					}
					if(this.text!=""){
						 obj.text=this.text

					}
          obj.name="HomeSearch"


						this.$router.replace({
							name:"SearchPlaceSecond",
							query:{...obj}

						})


				}

			},
			getPlace(){
				let obj={
					a:3,
					pa:this.pa,
					li:10,
          Sk:this.text
				}
        if(this.cityId){
					obj.id=	this.cityId
				}


				this.$Api.Home.getWbList(obj).then((res)=>{
					console.log(res)
					if(res.q.s==0){
						this.list=this.list.concat(res.q.wbs)
						this.total=res.q.total
						this.pa++
						setTimeout(() => {

						 if(res.q.wbs.length < 10) {
							 this.loading = false
							 this.all = true

						 }else{
							 this.loading = true
							 this.all = false
						 }

					 }, 500)
					}

				})

			},

			getData(){
				let obj;

					obj={
						a:this.activeIndex+1,
						pa:this.pa,
						li:10,
						Sk:this.text
					}
					if(this.cityId){
						obj.id=	this.cityId
					}



				this.$Api.Home.getWbList(obj).then((res)=>{
					console.log(res)
					this.flag=false
					if(res.q.s==0){
						this.list=this.list.concat(res.q.wbs)
						this.total=res.q.total
						this.pa++
						setTimeout(() => {

						 if(res.q.wbs.length < 10) {
							 this.loading = false
							 this.all = true

						 }else{
							 this.loading = true
							 this.all = false
						 }

					 }, 500)
					}

				}).then(()=> {
          document.getElementById('input').blur()
          // this.showLoading = false
        })

			}

		}


	}
</script>

<style scoped="scoped" lang="scss">
.end {
	display: flex;
	display: -webkit-box;
	/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
	display: -moz-box;
	/* 老版本语法: Firefox (buggy) */
	display: -ms-flexbox;
	/* 混合版本语法: IE 10 */
	display: -webkit-flex;
	/* 新版本语法: Chrome 21+ */
	text-align: center;
	margin-top: 0.3rem;
	margin-bottom: 0.3rem;
	padding: 0 0.4rem;
	box-sizing: border-box;
	.line {
		width: 2.25rem;
		height: 0.02rem;
		background: #CCCCCC;
		position: relative;
		top: 0.16rem;
	}
	span {
		width: 2rem;
		color: #CCCCCC;
		font-size: 0.22rem;
	}
}

.loading {
	.mid {
		display: flex;
		display: -webkit-box;
		/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
		display: -moz-box;
		/* 老版本语法: Firefox (buggy) */
		display: -ms-flexbox;
		/* 混合版本语法: IE 10 */
		display: -webkit-flex;
		/* 新版本语法: Chrome 21+ */
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
		justify-content: center;
		i {
			width: 0.28rem;
			height: 0.3rem;
			float: left;
			background: url(../../assets/home/common_icon_Load@3x.png) no-repeat;
			background-size: 100%;
			position: relative;
			top: 0.05rem;
			transition: 0.75s;
			animation: icon 1s 0s infinite linear;
		}
		@keyframes icon {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
		span {
			font-size: 0.28rem;
			margin-left: 0.08rem;
			color: #999999;
		}
	}
}
	.container {
		background: rgba(255, 255, 255, 1);
		padding-top: 0.24rem;
		box-sizing: border-box;
		.top {
			.searchBox {
				width: 93.5%;
				margin: auto;
				height: 0.6rem;
				background: rgba(255, 255, 255, 1);
				opacity: 0.8;
				border-radius: 0.6rem;
				box-shadow: 0rem 0rem 0.08rem 0rem rgba(0, 0, 0, 0.37);
				i {
					width: 0.2rem;
					height: 0.2rem;
					background: url(../../assets/common/common_icon_search@3x.png) no-repeat;
					background-size: 100%;
					float: left;
					margin-left: 0.3rem;
					margin-top: 0.2rem;
				}
				input {
					width: 6rem;
					border: none;
					margin-left: 0.1rem;
					height: 0.6rem;
					font-size: 0.26rem;
					line-height: 0.6rem;
				}
			}
		}
		.nav_tab {
			display: flex;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			position: relative;
			li {
				width: 33.33%;
				text-align: center;
				list-style: none;
				font-size: 0.3rem;
				height: 0.7rem;
				// line-height: 0.7rem;
				position: relative;
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				justify-content: center;
				-webkit-justify-content: center;
				-moz-justify-content: center;
				-ms-justify-content: center;
				-o-justify-content: center;
				align-items: center;
				 -webkit-align-items:center;
 box-align:center;
 -moz-box-align:center;
 -webkit-box-align:center;
				div{
					height: 100%;
          max-width: 80%;
					overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 1;
-webkit-box-orient: vertical;
line-height: 0.7rem;
				}
				i {
					width: 0.1rem;
					height: 0.2rem;
					background: url(../../assets/common/common_btn_right@3x.png) no-repeat;
					background-size: 100% 100%;
					margin-left: 0.1rem
				}
			}
			.active {
				color: #FADC56;
			}
			.underline {
				width: 0.6rem;
				height: 0.02rem;
				background: #FADC56;
				position: absolute;
				bottom: 0rem;
				left: 0.95rem;
				transition: 0.5s;
			}
		}
		.total {
			width: 100%;
			height: 0.6rem;
			background: rgba(245, 245, 245, 1);
			line-height: 0.6rem;
			font-size: 0.2rem;
			text-indent: 0.3rem;
		}
		.item {
			height: 2.9rem;
			padding: 0.2rem;
			box-sizing: border-box;
			border-bottom: 1px solid #CCCCCC;
			.top {
				height: 2rem;
				display: flex;
				display: -webkit-box;
				/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
				display: -moz-box;
				/* 老版本语法: Firefox (buggy) */
				display: -ms-flexbox;
				/* 混合版本语法: IE 10 */
				display: -webkit-flex;
				/* 新版本语法: Chrome 21+ */
				.left {
					width: 56%;
					height: 1.8rem;
					padding-right: 0.4rem;
					text-overflow: ellipsis;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp:4;
					-webkit-box-orient: vertical;
					box-sizing: border-box;
					// padding-top: 0.1rem;
					font-size: 0.3rem;
					color: rgba(51, 51, 51, 1);
				}
				.right {
					width: 2.8rem;
					height: 2rem;
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
			.bottom {
				height: 0.5rem;
				margin-top: 0.2rem;



				.avatar {
					width: 0.4rem;
					height: 0.4rem;
					border-radius: 50%;
					position: relative;
					bottom: 0.07rem;
					float:left;
					img {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.opBox {
					width: 45%;
					float: right;
					margin-right: 0;
					display: flex;
					display: -webkit-box;
					/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
					display: -moz-box;
					/* 老版本语法: Firefox (buggy) */
					display: -ms-flexbox;
					/* 混合版本语法: IE 10 */
					display: -webkit-flex;
					/* 新版本语法: Chrome 21+ */

					li {
						width: 33.33%;
						list-style: none;
						display: flex;
						display: -webkit-box;
						/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
						display: -moz-box;
						/* 老版本语法: Firefox (buggy) */
						display: -ms-flexbox;
						/* 混合版本语法: IE 10 */
						display: -webkit-flex;
						/* 新版本语法: Chrome 21+ */
						align-items: center;
						-webkit-align-items:center;
		box-align:center;
		-moz-box-align:center;
		-webkit-box-align:center;
		-webkit-justify-content: center;
	 -moz-justify-content: center;
	 -ms-justify-content: center;
	 -o-justify-content: center;
	 justify-content: center;
						.see {
							background: url(../../assets/common/common_icon_eye_little@3x.png) no-repeat;
							background-size: 100% 100%;
							width: 16.5px;
							height: 10.5px;
							float: left;
							position: relative;
							// top: 0.1rem;
						}
						.talk {
							background: url(../../assets/common/common_icon_comment_little@3x.png) no-repeat;
							background-size: 100% 100%;
							width:15px;
							height: 13.5px;
							float: left;
							position: relative;
							// top: 0.1rem;
						}
						.like {
							background: url(../../assets/home/home_btn_star_nor@3x.png) no-repeat;
							background-size: 100% 100%;
							width: 15px;
							height: 15px;
							float: left;
							position: relative;
							// top: 0.1rem;
						}
						span {
							line-height: 0.3rem;
							font-size: 12px;
							line-height: 18px;
							margin-left: 0.1rem;
						}
					}
				}
			}
		}
	}
</style>
