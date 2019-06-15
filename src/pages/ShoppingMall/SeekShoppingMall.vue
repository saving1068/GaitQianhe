<!-- 商城搜索页面 -->
<template>
	<div class="SeekShoppingMall">

		<!-- 搜索栏 -->
		<nav @click="goSeekShoppingMallNav">
			<van-icon name="search" class="icon_search" />
			<input type="text" placeholder="去哪旅行？点搜索试试！" v-model="Sk" />
		</nav>

		<!-- 综合排序与筛选 -->
		<section class="filtrate cf">
			<div @click="sort" v-text="sortListing[n]">综合排序</div>
			<div @click="goFiltrate">筛选</div>
		</section>

		<van-list v-model="loading":finished="finished" @load="onLoad">
			<!-- 每一个搜索的商品 -->
			<section class="seek_commodity" @click="goShoppingMallDetails(index)" v-for="(item,index) in goodses" :title="item">
				<img :src="item.imagePath" />
				<p v-text="item.name">成都七天六夜豪华之旅，全景游赏印花泡温泉纯玩-暑期含往返税...</p>
				<p>{{item.dateNum}}天行程</p>
				<p class="cf">
					<span>¥<b v-text="item.price">1799</b>起</span>
					<span class="fr">月销{{item.saleStat}}笔</span>
					<span class="fr">{{ Math.floor(item.praiseNum*10)/10 }}分</span>
				</p>
			</section>
		<!--<van-cell
		    v-for="item in list"
		    :key="item"
		    :title="item"
		  />-->
		</van-list>

		<!--<section class="seek_commodity">
			
			<img src="../../assets/li.png"/>
			<p>成都七天六夜豪华之旅，全景游赏印花泡温泉纯玩-暑期含往返税...</p>
			<p>10天行程</p>
			<p class="cf">
				<span>¥<b>1799</b>起</span>
				<span class="fr">月销998笔</span>
				<span class="fr">5.9分</span>
			</p>
			
		</section>-->

		<!-- 综合排序 -->
		<section class="sort" v-show="isSort">
			<ul>
				<li v-for="(item,index) in sortList" @click="click_sort(index)">
					{{item}}
					<img src="../../assets/shop_img_check@2x.png" v-show="index == n" />
				</li>
			</ul>
		</section>

	</div>
</template>

<script>
	import { Toast, List } from 'vant';

	export default {
		data() {
			return {
				isSort: false, //综合排序控制显示与隐藏；
				sortList: ['综合排序', '销量排序', '价格由高到低', '价格由低到高'],
				sortListing: ['综合排序', '销量排序', '由高到低', '由低到高'],
				n: 0,
				Sk: this.$route.query.Sk, //跳转过来的搜索关键字参数；
				goodses: [], //商城产品信息；
				i: 0, //传参数选择哪个综合排序；
				min: this.$route.query.min, //筛选后的参数1；
				max: this.$route.query.max, //筛选后的参数；
				tri: this.$route.query.tri, //筛选后的参数3；
				dat: this.$route.query.dat, //筛选后的参数4；
				nat: this.$route.query.nat, //筛选后的参数5；
				a: this.$route.query.a, //热门搜索 a=1；
				orgId: this.$route.query.orgId,
				pa: 1,
				//list: [],
				loading: false,
				finished: false,
				num:0,
			}
		},
		created() {

			//console.log(this.sk)
			//console.log(this.$route.query)

		},
		mounted() {

		},
		methods: {
			onLoad() {
				let GsListObj = {};
				
				//用筛选的5个参数来做判断；
				if(this.$route.query.min != null ||
					this.$route.query.max != null ||
					this.$route.query.tri != null ||
					this.$route.query.dat != null ||
					this.$route.query.nat != null) {
					console.log('符合其中一个条件都可以进来')
//					this.pa=1
					let GsListObj = {
						a: 0,
						ob: 9,
						pa: this.pa,
						minPrice: this.min,
						maxPrice: this.max,
						tripDate: this.tri,
						dateNum: this.dat,
						natureId: this.nat
					};

				} else if(this.a == 1) { //热门搜索的；
//					this.pa=1
					GsListObj = {
						a: 1,
						Sk: this.Sk,
						pa: this.pa
					};

					//载入该页面渲染静态的商品列表数据；

					console.log('a=1')
				} else if(this.a == 3) { //店铺推荐；
//					this.pa=1
					GsListObj = {
						a: 3,
						ob: 9,
						pa: this.pa,
						'orgId': this.orgId,
						minPrice: this.min,
						maxPrice: this.max,
						tripDate: this.tri,
						dateNum: this.dat,
						natureId: this.nat
					};

					console.log('a=3')
				} else { //历史搜索和关键字搜索；
//					this.pa=1
					GsListObj = {
						a: 0,
						pa: this.pa,
						Sk: this.Sk
					};

					//载入该页面渲染静态的商品列表数据；
				}

				// 异步更新数据
				setTimeout(() => {
					console.log(this.pa)
					this.pa++
					this.$Api.Shop.GoodsList(GsListObj).then(res => {
						if(res.q.s==0){
							
							this.num = res.q.total;
							if(res.q.goodses.length != 0 ){
								res.q.goodses.forEach(item => {
									this.goodses.push(item)
								})
							}
							
							// 数据全部加载完成
							if(res.q.goodses.length==0) {
								this.finished = true;
								Toast('已全部加载完！')
							}
							
							//判断商城商品是否存在；
							if(this.goodses.length===0){
								Toast('亲，您搜索的商品不存在！')
							}
						}
					})
						// 加载状态结束
						this.loading = false;
				}, 500);
			},

			goSeekShoppingMallNav() {
				this.$router.push({
					name: "SeekShoppingMallNav",
					query: {

					}
				})
			},

			//商品列表协议接口；
			GoodsList(GsListObj) {
				this.$Api.Shop.GoodsList(GsListObj).then(res => {
					console.log(res)
					this.goodses = res.q.goodses;

					//判断商城商品是否存在；
					if(res.q.goodses.length == 0) { //不存在提示用户；
						Toast('亲，您搜索的商品不存在！')
						console.log('该商城商品不存在')
					}
					console.log(this.goodsesthis.goodsesthis.goodsesthis.goodses,this.goodses)
				})
			},

			//店铺推荐；
			shopRec() {
				let GsListObj = {
					a: 3,
					ob: 9,
					'orgId': this.orgId,
					minPrice: this.min,
					maxPrice: this.max,
					tripDate: this.tri,
					dateNum: this.dat,
					natureId: this.nat
				};

				this.$Api.Shop.GoodsList(GsListObj).then(res => {
					console.log(res)
					this.goodses = res.q.goodses;

					console.log(this.goodses)
				})
			},

			//传五个参数；
			arguments_5() {
				let GsListObj = {
					a: 0,
					ob: 9,
					minPrice: this.min,
					maxPrice: this.max,
					tripDate: this.tri,
					dateNum: this.dat,
					natureId: this.nat
				};

				this.$Api.Shop.GoodsList(GsListObj).then(res => {
					console.log(res)
					this.goodses = res.q.goodses;

					console.log(this.goodses)
				})
			},

			//传参数选择哪个综合排序；
			arguments_sort(i) {
				let GsListObj = {
					a: 0,
					ob: i
				};

				//综合排序的筛选数据；
				this.GoodsList(GsListObj);
			},

			//点击选择综合排序；
			click_sort(index) {
				this.isSort = !this.isSort;
				this.n = index;

				if(index == 0) { //选择综合排序；
					this.i = 1;
					this.arguments_sort(this.i);

					console.log(this.i)
				} else if(index == 1) { //选择销量排序；
					this.i = 2;
					this.arguments_sort(this.i);

					console.log(this.i)
				} else if(index == 2) { //选择价格倒序；
					this.i = 7;
					this.arguments_sort(this.i);

					console.log(this.i)
				} else if(index == 3) { //选择价格顺序；
					this.i = 8;
					this.arguments_sort(this.i);

					console.log(this.i)
				}
			},

			//综合排序控制显示；
			sort() {
				this.isSort = !this.isSort;
			},

			//跳转商城筛选页面；
			goFiltrate() {
				this.$router.push({
					name: "Filtrate",
					query: {
						seek: 'seek', //用来判断是从搜索的筛选跳转到筛选页面的，而不是店铺的筛选；

					}
				})
			},

			//跳转商城首页商品详情页面；
			goShoppingMallDetails(index) {
				this.$router.push({
					name: "ShoppingMallDetails",
					query: {
						spuId: this.goodses[index].spuId
					}
				})
			},

		},
	}
</script>

<style scoped lang="less">
	/*该商城搜索页面样式*/
	
	.SeekShoppingMall {
		background: #fff;
		height: 100%;
		nav {
			width: 100%;
			height: 1.05rem;
			padding-top: 0.2rem;
			box-sizing: border-box;
			position: relative;
			.icon_search {
				position: absolute;
				top: 0.38rem;
				left: 0.50rem;
				color: #fadc56;
				z-index: 10;
				width: 0.28rem;
				height: 0.28rem;
			}
			input {
				width: 7.02rem;
				height: 0.6rem;
				background: rgba(255, 255, 255, 1);
				opacity: 0.8;
				border-radius: 0.3rem;
				-webkit-box-shadow: 0rem 0rem 0.1rem 0rem rgba(0, 0, 0, 0.37);
				box-shadow: 0rem 0rem 0.1rem 0rem rgba(0, 0, 0, 0.37);
				border: none;
				text-indent: 0.6rem;
				margin-left: 0.27rem;
				font-size: 0.24rem;
				font-family: PingFang-SC-Regular;
				color: rgba(153, 153, 153, 1);
			}
		}
		.filtrate {
			height: 0.92rem;
			border-top: 1px solid #cccccc;
			border-bottom: 1px solid #cccccc;
			line-height: 0.92rem;
			div {
				width: 50%;
				height: 100%;
				float: left;
				text-align: center;
				font-size: 0.3rem;
				font-family: PingFang-SC-Medium;
				color: rgba(26, 26, 26, 1);
			}
			div:nth-of-type(1) {
				background: url(../../assets/shop_btn_order@2x.png) no-repeat 2.6rem 0.35rem;
				background-size: 0.24rem 0.27rem;
			}
			div:nth-of-type(2) {
				background: url(../../assets/shop_btn_screen@2x.png) no-repeat 2.3rem 0.35rem;
				background-size: 0.3rem 0.27rem;
			}
		}
		/*综合排序样式*/
		.sort {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 50;
			background: rgba(0, 0, 0, 0.7);
			ul {
				width: 7.5rem;
				height: 3.53rem;
				background: rgba(255, 255, 255, 1);
				position: fixed;
				bottom: 0;
				left: 0;
				li {
					width: 100%;
					height: 25%;
					line-height: 0.88rem;
					border-bottom: 1px solid #c7c7cb;
					padding-left: 0.25rem;
					box-sizing: border-box;
					font-size: 0.26rem;
					font-family: PingFang-SC-Regular;
					color: rgba(102, 102, 102, 1);
					position: relative;
					img {
						width: 0.36rem;
						height: 0.36rem;
						border-radius: 60%;
						position: absolute;
						right: 0.25rem;
						top: 0.25rem;
					}
				}
				li:last-child {
					border-bottom: none;
				}
			}
		}
	}
</style>
<style scoped lang="less">
	/*该页面相同的样式*/
	
	.cf:after {
		content: '';
		display: block;
		clear: both;
	}
	
	.fl {
		float: left;
	}
	
	.fr {
		float: right;
	}
	/*每一个搜索的商品样式*/
	
	.seek_commodity {
		width: 100%;
		height: 2.4rem;
		border-bottom: 0.5px solid #efefef;
		background: #fff;
		position: relative;
		img {
			width: 2rem;
			height: 2rem;
			border: 1px solid #ccc;
			position: absolute;
			top: 0.24rem;
			left: 0.24rem;
		}
		p {
			position: absolute;
			font-family: PingFang-SC-Medium;
		}
		p:nth-of-type(1) {
			top: 0.39rem;
			left: 2.5rem;
			width: 4.66rem;
			font-size: 0.26rem;
			color: rgba(51, 51, 51, 1);
			line-height: 0.36rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		p:nth-of-type(2) {
			top: 1.15rem;
			left: 2.5rem;
			font-size: 0.22rem;
			color: rgba(153, 153, 153, 1);
			line-height: 0.7rem;
		}
		p:nth-of-type(3) {
			width: 4.7rem;
			bottom: 0.1rem;
			left: 2.5rem;
			span:nth-of-type(1) {
				font-size: 0.2rem;
				color: rgba(246, 50, 62, 1);
				b {
					font-size: 0.3rem;
				}
			}
			span:nth-of-type(3) {
				font-size: 0.22rem;
				color: rgba(250, 220, 86, 1);
				height: 0.42rem;
				line-height: 0.42rem;
				padding-right: 0.2rem;
			}
			span:nth-of-type(2) {
				height: 0.42rem;
				line-height: 0.42rem;
				font-size: 0.22rem;
				color: rgba(153, 153, 153, 1);
			}
		}
	}
</style>