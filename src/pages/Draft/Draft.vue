<template>
	<div>
		<div class="travel_list">
			<van-list v-model="loading" @load="onLoad" :finished="finished" :loading-text="loading_text">
				<li v-for="(v,i) in list" @click="goToTravelDetails(v)">
					<img :src="v.imagePath" />
					<div class="item_bg">
						<p>{{v.title}}</p>
						<div class="city">
							<div class='city_heng'></div>
							<div class="city_font">{{v.sites}}</div>
							<div class='city_heng' style="right: 0;"></div>
						</div>
						<div class="delete_icon" @click.stop="openDelete(v)"></div>
						<div class="writing_icon" @click.stop="goToTravels(v.id)"></div>
					</div>
				</li>
			</van-list>
		</div>
		<div class="not_list" v-if="list.length <= 0" @click="goToUserPage">
				点击我返回主页
		</div>
		<Delete v-show="ifDelete" @delete='sureDelete' @cancel="cancelDelete"></Delete>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				list: [],
				ifDelete: false, //删除组件
				wbId: null, //=游记ID
				loading: false,
				finished: false,
				loading_text: "努力加载中",
				page: 1,
				total: 0
			}
		},
		created() {
			//			this.getWbList({a:5,Sk:0,pa:this.page})//草稿
		},
		methods: {
			goToTravelDetails(item) {
				this.$router.push({
					name: 'TravelDetails',
					query: {
						id: item.id
					}
				})
			},
			onLoad() {
				setTimeout(() => {
					console.log(this.list.length, this.total, this.page)
					var obj = {
						a: 5,
						Sk: 0,
						pa: this.page
					}
					this.$Api.UserPage.getWbList(obj).then((res) => {
						if(res.q.s == 0) {
							
							this.page++
								this.total = res.q.total
							if(this.list.length >= this.total) {

								this.finished = true;
								this.loading_text = ''
							}
							
							for(let i = 0; i < res.q.wbs.length; i++) {
								this.list.push(res.q.wbs[i]);
							}
							this.loading = false;
						}

					})

				}, 500);
			},
			goToTravels(id) {
				console.log(id)
				this.$router.push({
					name: "Travels",
					query: {
						id
					}
				})
			},
			goToUserPage() {
				this.$router.replace({
					name: "UserPage"
				})
			},
			openDelete(item) {
				this.ifDelete = true
				this.wbId = item.id
				
			},
			sureDelete() {
				console.log("确认删除")
				this.DelWb(this.wbId)
				
			},
			cancelDelete() {
				console.log("取消删除")
				this.ifDelete = false
			},
			DelWb(id) {
				this.$Api.UserPage.DelWb({
					a: 0,
					id
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.getWbList({
							a: 5,
							Sk: 0
						}) //草稿
						this.ifDelete = false;
					}
				})
			},
			getWbList({
				a,
				ta,
				pa,
				li,
				Sk
			}) { //游记
				this.$Api.UserPage.getWbList({
					a,
					ta,
					pa,
					li,
					Sk
				}).then((res) => {
					//					console.log(res)
					if(Sk == 0) {
						this.list = res.q.wbs;
						this.total = res.q.total;
						if(res.q.wbs.length == 0 ){
							this.$router.go(-1)
						}
					}
				})
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
	img {
		width: 100%;
		height: 100%;
	}
	.not_list{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background:rgba(250,220,86,1);
		border-radius: 0.06rem;
		padding: .2rem;
	}
	.travel_list {
		li {
			width: 100%;
			height: 4.4rem;
			margin-top: .34rem;
			position: relative;
			.item_bg {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, .3);
				p {
					font-size: 0.4rem;
					font-family: PingFang-SC-Bold;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					padding: 1.36rem .9rem 0;
					word-break: break-all;
					overflow: hidden;
					text-align: center;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.city {
					position: absolute;
					overflow: hidden;
					margin-top: .3rem;
					left: 50%;
					transform: translateX(-50%);
					.city_heng {
						width: 0.3rem;
						height: 0.02rem;
						background: rgba(255, 255, 255, 1);
						float: left;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
					}
					.city_font {
						font-size: 0.3rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(204, 204, 204, 1);
						float: left;
						padding: 0 0.5rem;
						text-align: center;
						margin: 0 auto;
					}
				}
				.delete_icon {
					width: 0.66rem;
					height: 0.66rem;
					border-radius: 50%;
					background-image: url(../../assets/user_btn_del@2x.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					position: absolute;
					bottom: .12rem;
					left: .24rem;
				}
				.writing_icon {
					width: 0.66rem;
					height: 0.66rem;
					border-radius: 50%;
					background-image: url(../../assets/user_btn_pen@2x.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					position: absolute;
					bottom: .12rem;
					right: .24rem;
				}
			}
		}
	}
</style>