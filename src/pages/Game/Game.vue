<template>
	<div class="roudabout">
		<div class="roudaBg">
			<div class="top">
				<div class="game_icon"></div>
				<div class="game_pron">
					<p>{{points}}</p>
					<font>积分</font>
				</div>
				<div class="game_glod" @click="goToPoints">
					兑换金币
				</div>
			</div>
			<div class="rule" @click="goToGameRules">
				<font>游戏规则</font>
				<p><i class="fa fa-angle-right fa-lg fa-fw"></i></p>
			</div>
			<div class="container" v-if="awardsList.length == 5">
				<div class="round_box">
					<div class="round" :style="{'transform': `rotate(${rotateReg}deg)`}">
						<img class="bg" src="@/assets/home_turntable_middle@3x.png" />
						<div class="reward" :class="'reward'+Number(i+1)" v-for="(v,i) in awardsList">
							<p>{{v.awardName}}</p>
							<img v-if="v.imgurl" :src="v.imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward reward6">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
					</div>
					<img class="start" src="@/assets/my_btn_top@2x.png" @click="start(5)" />
				</div>
			</div>
			<div class="container" v-if="awardsList.length == 4">
				<div class="round_box">
					<div class="round" :style="{'transform': `rotate(${rotateReg}deg)`}">
						<img class="bg" src="@/assets/home_turntable_middle@3x.png" />
						<div class="reward" :class="'reward1'">
							<p>{{awards[0].awardName}}</p>
							<img v-if="awards[0].imgurl" :src="awards[0].imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward" :class="'reward2'">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward3">
							<p>{{awards[1].awardName}}</p>
							<img v-if="awards[1].imgurl" :src="awards[1].imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward reward5">
							<p>{{awards[2].awardName}}</p>
							<img v-if="awards[2].imgurl" :src="awards[2].imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<!--<div class="reward reward2">
							<p>谢谢参与</p>
							<img src="../../assets/common/placeholder_200x200.png" />
						</div>-->
						<div class="reward reward4">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward6">
							<p>{{awards[3].awardName}}</p>
							<img v-if="awards[3].imgurl" :src="awards[3].imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
					</div>
					<img class="start" src="@/assets/my_btn_top@2x.png" @click="start(4)" />
				</div>
			</div>
			<div class="container" v-if="awardsList.length == 3">
				<div class="round_box">
					<div class="round" :style="{'transform': `rotate(${rotateReg}deg)`}">
						<img class="bg" src="@/assets/home_turntable_middle@3x.png" />
						<div class="reward" :class="'reward'+Number(2*i+1)" v-for="(v,i) in awardsList">
							<p>{{v.awardName}}</p>
							<img v-if="v.imgurl" :src="v.imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward" :class="'reward'+Number(2*i+2)" v-for="(v,i) in 3">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
					</div>
					<img class="start" src="@/assets/my_btn_top@2x.png" @click="start(3)" />
				</div>
			</div>
			<div class="container" v-if="awardsList.length == 2">
				<div class="round_box">
					<div class="round" :style="{'transform': `rotate(${rotateReg}deg)`}">
						<img class="bg" src="@/assets/home_turntable_middle@3x.png" />
						<div class="reward" :class="'reward'+Number(2*i+1)" v-for="(v,i) in awardsList">
							<p>{{v.awardName}}</p>
							<img v-if="v.imgurl" :src="v.imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward" :class="'reward5'">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward" :class="'reward'+Number(2*i+2)" v-for="(v,i) in 3">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
					</div>
					<img class="start" src="@/assets/my_btn_top@2x.png" @click="start(2)" />
				</div>
			</div>
			<div class="container" v-if="awardsList.length == 1">
				<div class="round_box">
					<div class="round" :style="{'transform': `rotate(${rotateReg}deg)`}">
						<img class="bg" src="@/assets/home_turntable_middle@3x.png" />
						<div class="reward" :class="'reward'+Number(i+1)" v-for="(v,i) in awards">
							<p>{{v.awardName}}</p>
							<img v-if="v.imgurl" :src="v.imgurl" />
							<img v-else src="@/assets/common/placeholder_200x200.png" />
						</div>
						<div class="reward reward3">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward5">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward2">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward4">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
						<div class="reward reward6">
							<p>谢谢参与</p>
							<img class="thank" src="../../assets/game/home_img_Smiling@2x.png" />
						</div>
					</div>
					<img class="start" src="@/assets/my_btn_top@2x.png" @click="start" />
				</div>
			</div>
			<div class="surplus">
				今日免费抽<span style="color: #FFDA44;">{{num1}}</span>次
			</div>
			<div class="notice">
				<!--<div class="horn">-->
				<!--<img src="../../assets/home/@3x/home_icon_broadcast@3x.png"/>-->
				<!--</div>-->
				<ul class="con1" ref="con1" :class="{anim:animate==true}">
					<li v-for='(v,i) in notices'>{{v.actionContent}}</li>
				</ul>
			</div>
		</div>

		<div class="tips_bg" v-show="tipShow">
			<div class="tipe_val">
				<div class="tipe_title">
					{{tipTitle}}
					<div class="tipe_x" @click="tipClose">

					</div>
				</div>
				<div class="tipe_content">
					<div v-show="tipsNum == 0">
						<p style="line-height: .5rem; padding:0 .27rem;">1.每人每天均有1次机会免费参与大转盘活动游戏</p>
						<p style="line-height: .5rem; padding:0 .27rem;">2.免费机会用完，还可以用积分继续参与抽奖，每增加一次抽奖机会需使用10积分</p>
						<p style="line-height: .5rem; padding:0 .27rem;">3.每天可以通过做任务获得积分</p>
						<p style="line-height: .5rem; padding:0 .27rem;">4.每人每天最多10次抽奖机会</p>
					</div>
					<p style="line-height: 1rem;text-align: center; padding:0 .27rem;" v-show="tipsNum == 5">抽中{{awardDetail.value}}次机会，可以去使用啦~</p>
					<p style="line-height: 1rem;text-align: center; padding:0 .27rem;" v-show="tipsNum == 4">抽中{{awardDetail.value}}金币，已放入您的账户~</p>
					<p style="line-height: 1rem;text-align: center; padding:0 .27rem;" v-show="tipsNum == 6">什么都没有抽到~</p>
					<p style="line-height: 1rem;text-align: center; padding:0 .27rem;" v-show="tipsNum == 3">抽中{{awardDetail.value}}积分，已放入您的账户~</p>
					<div v-show="tipsNum == 2" v-if="tipsNum == 2" style="border-bottom: 0.01rem solid #EDEDED;padding:0 .27rem;">
						<p>抽中一份旅行免单：{{awardDetail.info.name}},已经放入你的订单~</p>
						<div class="shop_good">
							<div class="shop_good_img">
								<img v-if="spuImg" :src="spuImg" />
							</div>
							<div class="shop_good_details">
								<h3 style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{awardDetail.info.name}}</h3>
								<p>套餐类型：{{awardDetail.info.setMeal}}</p>
								<p>出行时间：{{awardDetail.info.placeDate1}}</p>
								<p>购买数量：1</p>
								<p>商品总价：￥{{awardDetail.info.price}}</p>
							</div>
						</div>
					</div>
					<p style="line-height: 1rem;text-align: center;" v-show="tipsNum == 7">今日免费机会已用完啦~</p>
					<div v-show="tipsNum == 1" v-if="tipsNum == 1">
						<p style="line-height: .5rem; padding:0 .27rem;">抽中一张优惠券：{{awardDetail.entity.name}}，已经放入你的优惠券~</p>
						<div class="shop_coupon">
							<div class="shop_coupon_price">
								<div class="coupon_price">
									<i class="fa fa-yen fa-lg"></i><span>{{awardDetail.entity.denomination}}</span>
								</div>
								<div class="coupon_summery">
									{{awardDetail.entity.remark}}
								</div>
							</div>
							<div class="shop_coupon_name">
								<p>{{awardDetail.entity.name}}</p>
								<div class="coupon_name">
									步履千寻优惠券
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tipe_btn" @click="tipShow=false" v-if="tipsNum==1||tipsNum==4||tipsNum==3||tipsNum==0">
					知道了
				</div>
				<div class="tipe_btn" @click="start(awardsList.length)" v-if="tipsNum==5">
					再试一次
				</div>
				<div class="tipe_btn_two" v-if="tipsNum ==6">
					<div class="tipe_btn_left" @click="goToPoints">
						去做任务
					</div>
					<div class="shu"></div>
					<div class="tipe_btn_right" v-if="num1>0"  @click="start(awardsList.length)">
						再试一次
					</div>
					<div class="tipe_btn_right" v-else  @click="draw(2,awardsList.length)">
						用{{cost}}积分继续抽奖
					</div>
				</div>
				<div class="tipe_btn_two" v-if="tipsNum ==7">
					<div class="tipe_btn_left" @click="goToPoints">
						去做任务
					</div>
					<div class="shu"></div>
					<div class="tipe_btn_right" @click="draw(2,awardsList.length)">
						用{{cost}}积分继续抽奖
					</div>
				</div>
				<div class="tipe_btn_two" v-if="tipsNum ==2">
					<div class="tipe_btn_left" @click="goToProcess">
						联系客服
					</div>
					<div class="shu"></div>
					<div class="tipe_btn_right" @click="goAffirmIndenting">
						填写出行人
					</div>
				</div>
			</div>

		</div>
		<van-actionsheet v-model="isshow" :actions="imList"  @select="onSelect"   cancel-text="取消"  @cancel="isshow=false"/>
	</div>
</template>

<script>
	import { Toast } from 'vant';
	export default {
		name: 'roundabout',
		components: {

		},
		data() {
			return {
				windowHeight: document.documentElement.clientHeight + "px",
				isshow:false,
				imList:[],
				tipsNum: 7,//1优惠卷 2免单 3积分 4金币 5机会 6谢谢参与7机会没了
				tipTitle: "",
				tipBtn: "",
				tipShow: false,
				animate: false, //公告1
				notices: [1, 2, 34, 5, 56, 7],
				title: '参与活动赢大奖',
				cover: false,
				n: 100,
				timer: null,
				timer1: null,
				rotateReg: 0,
				canClick: true,
				miuseReg: 0,
				regGroup: {
					reward1: { //一等奖
						regs: 60,
						message: 1
					},
					thank1: { //第一个谢谢参与
						regs: 120,
						message: 1

					},
					reward3: { //三等奖
						regs: 180,
						message: 2
					},
					thank2: { //第二个谢谢参与
						regs: 240,
						message: 2

					},
					reward2: { //二等奖
						regs: 300,
						message: 0
					},
					thank3: { //第三个谢谢参与
						regs: 360,
						message: 3
					},
					//=0 未中 >0 中 1:珍贵奖 2:爸气奖
				},
				popupShow: false,
				isPlaying: true,
				RollingData: {},
				musicPath: "",
				award: {},
				num1: null,
				joinNum: null,
				isWin: false,
				winShow: false,
				timer3: null,
				miuseIcon: false,
				miuseStop: false,
				awards: [],
				startDate: null,
				endDate: null,
				myAwards: [],
				perReg: 0, //上一次转的度数
				totalNum: 0,
				times: 0,
				points: 0,
				awardsList: [], //奖品列表
				awardDetail: {
					entity: {},
					info: {}
				}, //中奖奖品详细
				ImId: 0,
				orderId: 0, //订单Id
				cost: 0,
				spuImg:"",//免单商品图片
				tel:""
			}
		},
		created() {
			this.getImId()
			this.getData()
			this.getMyAccountList()
			//			this.timer3 = setInterval(() => {
			//				this.miuseReg += 360
			//			}, 1000)
			setInterval(this.scroll, 2000) //公告1
		},
		mounted() {

		},
		computed: {
			nums() {
				return this.RollingData.surplusNum || 0
			},
			bottomStyle() {
				if(this.tabNum == 0) {
					return {
						"left": "11%"
					}
				} else {
					return {
						"left": "62%"
					}
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
			clearTimeout(this.timer1)
		},
		methods: {
			goToGameRules(){
				this.$router.push({
					name:"GameRules"
				})
			},
			goToPoints(){
				this.$router.push(
					{
						name:"Points"
					}
				)
			},
			getMyAccountList() { //积分
				this.$Api.My.MyAccountList({
					a: 0
				}).then((res) => {
					console.log(res)
					if(res.q.s == 0) {
						this.points = res.q.Accounts[0].balanceTotal
					}

				})

			},
			getImId() {
				this.$Api.Common.CsList({
					id: 0
				}).then((res) => {
						if(res.q.csContacts.length>0){
					res.q.csContacts.forEach(item=>{
						let obj={
							name:item.name,
							id:item.imId,
							disabled:false
						}
						this.imList.push(obj)
					})
				}
				this.getTel()

					// this.ImId = res.q.csContacts[0].imId
				})
			},
			getTel(){
				this.$Api.Common.CsTel({id:0}).then((res)=>{
					if(res.q.s==0){
						this.tel=res.q.csTel
						this.imList.push({
							name: '拨打客服热线',
							disabled:false
						})
					}

					console.log(res)
				})

			},
			goToProcess() {
				if(this.imList.length>0){
					this.isshow=true
				}else{
					Toast({
		        message: "暂无客服",
		        forbidClick: true,
		        position: 'center',
		        duration: 2000
		      });

				}
			},
			onSelect(item){ //联系客服
				if(item.name=="拨打客服热线"){
						window.location.href = "tel:"+this.tel;
				}else{
					this.$router.push({
						name:"Talk",
						query:{
							im:item.id
						}
					})
				}
       this.isshow=false
			},
			getAwardNotice(id) {
				this.$Api.Common.AwardNotice({
					id
				}).then((res) => {
					console.log(res)
					this.notices = res.q.ads
				})
			},
			goAffirmIndenting() { //出行人
				this.$router.push({
					name: "AffirmIndenting",
					query: {
						orderId: this.orderId
					}
				})
			},
			goToPoints() { //兑换积分
				this.$router.push({
					name: "Points"
				})
			},
			gameRules() {
				//				console.log(11)
				this.tipShow = true;
				this.tipsNum = 0;
				this.tipTitle = "游戏规则";
			},
			getScroll() {

			},
			tipClose() {
				this.tipShow = false;
			},
			popup() {
				this.popupShow = false;
			},
			win() {
				this.winShow = false;
			},
			getData() { //活动信息
				//				console.log('获取活动信息')
				this.$Api.UserPage.ActivityInfo().then(res => {
					if(res.q.s == 0) {
						this.getAwardNotice(res.q.info.id)
						this.RollingData = { ...res.q.info
						}
						this.num1 = this.RollingData.surplusNum || 0 //剩余次数
						this.joinNum = this.RollingData.joinNum || 0 //参加人数
						this.musicPath = this.RollingData.musicPath //音乐地址
						this.awards = this.RollingData.awards //活动奖品
						this.startDate = this.RollingData.startDate //活动开始时间
						this.endDate = this.RollingData.endDate //活动结束时间
						this.myAwards = this.RollingData.myAwards //该活动中自己的奖品
						this.times = res.q.times //每日抽奖次数
						this.awardsList = res.q.info.awards //奖品数组
						this.cost = res.q.info.cost; //积分抽奖
						console.log('获取活动信息', this.RollingData)
					} else {
						Toast(res.q.d);
					}
				})
			},
			scroll() { //公告1
				this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
				setTimeout(() => { //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
					this.notices.push(this.notices[0]); // 将数组的第一个元素添加到数组的
					this.notices.shift(); //删除数组的第一个元素
					this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
				}, 1500)
			},
			draw(a, type) {
				if(a == 2){
					this.points = this.points-this.cost
				}
				this.tipShow = false;
				this.$Api.UserPage.BeganToDraw(a, this.RollingData.id).then(res => {
					if(res.q.s == 0) {
						console.log(a,type)
						if(res.q.isWin == 1) {
							this.isWin = true
							this.award = { ...res.q.award //中奖奖品
							}
						} else if(res.q.isWin == 0) {
							this.isWin = false
						}

						var mubiao
						if(type == 5) {
							console.log(this.isWin)
							if(this.isWin) {
								for(let i = 0; i < this.awardsList.length; i++) {
									//												console.log(this.award.gradeGrade,this.awardsList[i])
									if(this.award.gradeGrade == this.awardsList[i].awardGrade) { //中奖奖品等于奖品列表中的那个奖品
										//													console.log(i,213321321)

										let index = i; //中奖下标
										console.log(this.awardsList[index], "index", index)

										//													console.log(this.rotateReg + (360 - this.perReg + 360 * 5),"???/")
										if(index == 0) { //360优惠卷     第一
											mubiao = this.regGroup['thank3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank3']['regs'];
											//														this.tipsNum = 6;
										} else if(index == 1) { //300免单 第二
											mubiao = this.regGroup['reward2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['reward2']['regs']
											//														this.tipsNum = 4;
										} else if(index == 2) { //240积分    第三
											mubiao = this.regGroup['thank2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank2']['regs']
											//														this.tipsNum = 3;
										} else if(index == 3) { //180金币  第四
											mubiao = this.regGroup['reward3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['reward3']['regs']
											//														this.tipsNum = 7;
										} else if(index == 4) { //120增加次数  第五
											mubiao = this.regGroup['thank1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank1']['regs']

											//														this.tipsNum = 1;
										}
										if(this.awardsList[index].type) {
											//														console.log(this.awardsList,"awardsList")
											//														console.log(this.awardsList[index].type,"type")
											this.tipsNum = this.awardsList[index].type;
											this.awardDetail = { ...this.awardsList[index]
											}
											this.orderId = this.awardDetail.type == 2 ? this.award.orderId : 0
											//														console.log(this.awardDetail,"奖品详情",this.orderId)
										}
									}
								}
							} else {
								mubiao = this.regGroup['reward1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与60
								this.perReg = this.regGroup['reward1']['regs']

							}
						} else if(type == 4) {
							if(this.isWin) {
								for(let i = 0; i < this.awardsList.length; i++) {
									//												console.log(this.award.gradeGrade==this.awardsList[i].awardGrade)
									if(this.award.gradeGrade == this.awardsList[i].awardGrade) { //中奖奖品等于奖品列表中的那个奖品
										console.log(i, 213321321)
										let index = i; //中奖下标
										if(index == 0) { //360优惠卷
											mubiao = this.regGroup['thank3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank3']['regs'];
											//														this.tipsNum = 6;

										} else if(index == 1) { //180免单
											mubiao = this.regGroup['thank2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank2']['regs']
											//														this.tipsNum = 4;
										} else if(index == 2) { //240金币
											mubiao = this.regGroup['thank1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank1']['regs']
											//														this.tipsNum = 7;
										} else if(index == 3) { //240增加次数
											mubiao = this.regGroup['reward1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['reward1']['regs']
											//														this.tipsNum = 1;
										}
										if(this.awardsList[index].type) {
											this.tipsNum = this.awardsList[index].type;
											this.awardDetail = { ...this.awardsList[index]
											}
											this.orderId = this.awardDetail.type == 2 ? this.award.orderId : 0
											console.log(this.awardDetail, "奖品详情", this.orderId)
										}
									}
								}
							} else {
								let random = Math.floor(Math.random() * 2) //0~2随机数
								if(random == 0) { //120
									mubiao = this.regGroup['reward2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与60
									this.perReg = this.regGroup['reward2']['regs']
								} else if(random == 1) { //240
									mubiao = this.regGroup['reward3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward3']['regs']
								}

							}
						} else if(type == 3) {
							if(this.isWin) {
								for(let i = 0; i < this.awardsList.length; i++) {
									//											console.log(this.award.gradeGrade,this.awardsList[i].awardGrade)
									if(this.award.gradeGrade == this.awardsList[i].awardGrade) { //中奖奖品等于奖品列表中的那个奖品
										let index = i; //中奖下标
										console.log(index, "index")
										if(index == 0) { //60优惠卷
											mubiao = this.regGroup['thank3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank3']['regs']
											//													this.tipsNum = 6;
										} else if(index == 1) { //180免单
											mubiao = this.regGroup['thank2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank2']['regs']
											//													this.tipsNum = 4;
										} else if(index == 2) { //300增加次数
											mubiao = this.regGroup['thank1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank1']['regs']
											//													this.tipsNum = 1;
										}
										if(this.awardsList[index].type) {
											this.tipsNum = this.awardsList[index].type;
											this.awardDetail = { ...this.awardsList[index]
											}
											this.orderId = this.awardDetail.type == 2 ? this.award.orderId : 0
											console.log(this.awardDetail, "奖品详情", this.orderId)
										}
									}
								}
							} else {
								let random = Math.floor(Math.random() * 3) //0~2随机数
								if(random == 0) { //120
									mubiao = this.regGroup['reward1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward1']['regs']
								} else if(random == 1) { //240
									mubiao = this.regGroup['reward2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward2']['regs']
								} else if(random == 2) { //360
									mubiao = this.regGroup['reward3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward3']['regs']
								}
							}
						} else if(type == 2) {
							if(this.isWin) {
								for(let i = 0; i < this.awardsList.length; i++) {
									//											console.log(this.award.gradeGrade,this.awardsList[i].awardGrade)
									if(this.award.gradeGrade == this.awardsList[i].awardGrade) { //中奖奖品等于奖品列表中的那个奖品
										let index = i; //中奖下标
										console.log(index, "index")
										if(index == 0) { //60优惠卷
											mubiao = this.regGroup['thank3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank3']['regs']

										} else if(index == 1) { //180免单
											mubiao = this.regGroup['thank2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank2']['regs']
										}
										if(this.awardsList[index].type) {
											this.tipsNum = this.awardsList[index].type;
											this.awardDetail = { ...this.awardsList[index]
											}
											this.orderId = this.awardDetail.type == 2 ? this.award.orderId : 0
										}
									}
								}
							} else {
								console.log("谢谢参与")
								let random = Math.floor(Math.random() * 4) //0~2随机数
								if(random == 0) { //120
									mubiao = this.regGroup['reward1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward1']['regs']
								} else if(random == 1) { //240
									mubiao = this.regGroup['reward2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward2']['regs']
								} else if(random == 2) { //360
									mubiao = this.regGroup['reward3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward3']['regs']
								} else if(random == 3) {
									mubiao = this.regGroup['thank1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
									this.perReg = this.regGroup['thank1']['regs']
								}
							}
						} else if(type == 1) {
							if(this.isWin) {
								for(let i = 0; i < this.awardsList.length; i++) {
									//											console.log(this.award.gradeGrade,this.awardsList[i].awardGrade)
									if(this.award.gradeGrade == this.awardsList[i].awardGrade) { //中奖奖品等于奖品列表中的那个奖品
										let index = i; //中奖下标
										console.log(index, "index")
										if(index == 0) { //60优惠卷
											mubiao = this.regGroup['thank3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
											this.perReg = this.regGroup['thank3']['regs']
											this.tipsNum = 6;
										}
										if(this.awardsList[index].type) {
											this.tipsNum = this.awardsList[index].type;
											this.awardDetail = { ...this.awardsList[index]
											}
											this.orderId = this.awardDetail.type == 2 ? this.award.orderId : 0
											console.log(this.awardDetail, "奖品详情", this.orderId)
										}
									}
								}
							} else {
								console.log("谢谢参与")
								let random = Math.floor(Math.random() * 5) //0~2随机数
								if(random == 0) { //120
									mubiao = this.regGroup['reward1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward1']['regs']
								} else if(random == 1) { //240
									mubiao = this.regGroup['reward2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward2']['regs']
								} else if(random == 2) { //360
									mubiao = this.regGroup['reward3']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5) //谢谢参与
									this.perReg = this.regGroup['reward3']['regs']
								} else if(random == 3) {
									mubiao = this.regGroup['thank1']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
									this.perReg = this.regGroup['thank1']['regs']
								} else if(random == 4) {
									mubiao = this.regGroup['thank2']['regs'] + this.rotateReg + (360 - this.perReg + 360 * 5)
									this.perReg = this.regGroup['thank2']['regs']
								}
							}
						}

						//AffirmIndenting

						this.timer = setInterval(() => {
							//									console.log(mubiao,"mubiao")
							if(mubiao) {
								this.rotateReg += 60
								//										console.log(this.rotateReg)
								if(this.rotateReg >= mubiao) {

									//											console.log(this.rotateReg)
									clearInterval(this.timer)

									this.timer = null
									let id
									if(this.isWin) {
										this.timer1 = setTimeout(() => {
											console.log('中奖')
											this.tipShow = true;
											this.tipTitle = "恭喜您~";
											this.canClick = true;
											if(this.tipsNum == 3) {
												this.getMyAccountList()
											}
											if(this.tipsNum == 5) {
												this.getData()
											}
											if(this.tipsNum == 2){
												this.spuImg = this.award.spuImg
											}
										}, 2500);
									} else {
										this.timer1 = setTimeout(() => {
											console.log('谢谢参与')
											this.tipsNum = 6;
											this.tipShow = true;
											this.tipTitle = "很遗憾!";
											//													this.popupShow = true
											this.canClick = true;
										}, 2500);
									}
								}
							}
						}, 50)
					} else {
						Toast(res.q.d);
					}
				})
			},
			start(type) { //抽奖
				//						console.log(this.num1,"剩余次数")
				if(this.num1 <= 0) {
					this.num1 = 0;
					if(this.points > this.cost) {
						console.log(this.points)
						this.tipShow = true;
						this.tipsNum = 7;
					} else {
						Toast('抽奖机会不够,积分不够请充值');
					}

				} else {
					//					console.log(this.canClick)

					if(this.canClick) {
						this.num1--
							this.canClick = false
						//						console.log('开始旋转', this.num1)
						this.draw(0, type)

					} else {
						Toast('正在抽奖');
					}

				}

			},

		}
	};
</script>
<style lang="scss" scoped>
	.tips_bg {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 2000;
		background: rgba(0, 0, 0, .5);
		.tipe_val {
			position: fixed;
			box-sizing: border-box;
			width: 5.6rem;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			background: #fff;
			z-index: 2000;
			border-radius: .1rem;
			.tipe_title {
				height: 1.12rem;
				text-align: center;
				line-height: 1.12rem;
				font-size: 0.34rem;
				font-family: PingFang-SC-Medium;
				font-weight: bold;
				color: rgba(26, 26, 26, 1);
				border-bottom: 0.01rem solid #CCCCCC;
				position: relative;
				.tipe_x {
					position: absolute;
					width: 0.24rem;
					height: 0.24rem;
					background-image: url("../../assets/common_btn_close2@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					top: .44rem;
					right: .39rem;
				}
			}
			.tipe_content {
				padding: .29rem 0;
				font-size: 0.26rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				.shop_good {
					overflow: hidden;
					padding-top: .2rem;
					.shop_good_img {
						width: 1.75rem;
						height: 1.9rem;
						float: left;
						background: url(../../../static/img/1.png) no-repeat;
						background-size:100% 100%;
						img{
							width: 100%;
							height: 100%;
						}
					}
					.shop_good_details {
						float: left;
						padding-left: 0.1rem;
						width: 3.2rem;
						h3 {
							font-size: 0.24rem;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
						}
						P {
							font-size: 0.2rem;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(153, 153, 153, 1)
						}
					}
				}
				.shop_coupon {
					width: 5.39rem;
					margin: 0 auto;
					height: 1.56rem;
					margin-top: .3rem;
					background-image: url("../../assets/common_bg_coupon_pre@2x.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					.shop_coupon_price {
						width: 1.87rem;
						height: 100%;
						text-align: center;
						float: left;
						.coupon_price {
							padding-top: .3rem;
							span {
								font-size: 0.5rem;
								font-family: PingFangSC-Regular;
								font-weight: bold;
							}
						}
						.coupon_summery {
							font-size: 0.16rem;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(51, 51, 51, 1);
						}
					}
					.shop_coupon_name {
						float: left;
						width: 3rem;
						padding-left: .15rem;
						padding-top: .24rem;
						p {
							font-size: 0.2rem;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(51, 51, 51, 1);
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.coupon_name {
							padding-top: .2rem;
							font-size: 0.17rem;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(153, 153, 153, 1)
						}
					}
				}
			}
			.tipe_btn {
				width: 100%;
				height: .88rem;
				text-align: center;
				line-height: .88rem;
				font-size: 0.3rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				background: #FCE790;
			}
			.tipe_btn_two {
				width: 100%;
				height: .88rem;
				font-size: 0.3rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				background: #FCE790;
				display: flex;
				justify-content: space-around;
				text-align: center;
				align-items: center;
				.tipe_btn_left{
					width: 50%;
				}
				.tipe_btn_right{
					width: 50%;
				}
			}
		}
	}

	.top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 1.4rem;
		background: #FFFFFF;
		align-items: center;
		padding: 0 .24rem;
		.game_icon {
			width: 0.59rem;
			height: 0.44rem;
			background-image: url('../../assets/my_icon_play@2x.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			/*float: left;*/
			/*margin-top: .48rem;*/
		}
		.game_pron {
			/*height: 1.4rem;*/
			/*padding: 0.12rem .2rem;*/
			/*float: left;*/
			/*overflow: hidden;*/
			width: 4rem;
			display: flex;
			align-items: center;
			p {
				font-size: 0.6rem;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				color: rgba(246, 50, 62, 1);
				/*float: left;*/
			}
			font {
				font-size: 0.25rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				padding: 0 .13rem;
				line-height: 1.5rem;
			}
		}
		.game_glod {
			/*float: right;*/
			width: 1.8rem;
			height: 0.64rem;
			background: rgba(255, 218, 68, 1);
			border-radius: 0.06rem;
			font-size: 0.3rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(26, 26, 26, 1);
			text-align: center;
			line-height: .64rem;
			/*margin-top: .37rem;*/
		}
	}

	.surplus {
		padding-top: .5rem;
		text-align: center;
		font-size: 0.3rem;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		letter-spacing: .05rem;
		/*position: absolute;*/
		/*bottom: 2rem;*/
		/*left: 2.6rem;*/
	}

	.rule {
		position: absolute;
		font-size: 0.24rem;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(255, 218, 68, 1);
		right: 0;
		top: 1.8rem;
		z-index: 16;
		font {
			font-size: .26rem;
		}
		p {
			float: right;
		}
	}
	/*公告栏1*/

	.notice {
		width: 6.8rem;
		height: .78rem;
		overflow: hidden;
		margin-left: .1rem;
		border-radius: 0.06rem;
		z-index: 1110;
		/*position: relative;*/
		/*margin-top:1.4rem*/
		position: absolute;
		bottom: 0;
	}

	.notice ul {
		position: absolute;
		top: -0.6rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/*.horn{width: 0.28rem;height: 0.29rem;margin: 0.1rem 0 0 0.19rem;position: absolute;}*/
	/*.horn>img{width: 0.28rem;height: 0.29rem;}*/

	.anim {
		transition: all 1.5s;
		margin-top: -0.7rem;
	}

	.con1>li {
		padding-left: 0.69rem;
		list-style: none;
		line-height: 0.7rem;
		height: 0.7rem;
		font-size: 0.25rem;
		color: #fff;
	}

	.a_info {
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 0.36rem;
	}

	.a_info p:nth-of-type(1) {
		padding: 1.2rem 0 0.28rem 0;
	}

	.shu {
		width: 0.02rem;
		height: 0.45rem;
		background: #FFFEFE;
	}

	.roudabout {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .8);
		overflow-x: hidden;
		position: relative;
	}

	.roudaBg {
		/*position: absolute;*/
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		background-image: url('../../assets/my_bg_turn@2x.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		overflow: hidden;
		padding-bottom: 1rem;
	}

	.container {
		padding-top: 1rem;
		width: 100%;
		transform-origin: 50% 50%;
		transform: rotate(0deg);
		position: relative;
	}

	.round {
		position: absolute;
		width: 100%;
		height: 6.4rem;
		z-index: -1;
		transform-origin: 50% 50%;
		transition: all 1.5s ease-out;
	}

	.round_box {
		position: relative;
		width: 100%;
		height: 6.4rem;
	}

	.bg {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 6.4rem;
		height: 6.4rem;
		border-radius: 50%;
	}

	.start {
		position: absolute;
		left: 0;
		top: -0.82rem;
		right: 0;
		bottom: 0;
		margin: auto;
		/* transform: translate(-50%,-50%);*/
		width: 2.76rem;
		height: 3.66rem;
	}

	.reward {
		display: inline-block;
		height: 2.5rem;
		text-align: center;
		position: absolute;
		top: .7rem;
		left: 50%;
		transform-origin: 50% 100%;
		font-size: 0.13rem;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(195, 11, 41, 1);
	}

	.reward>img {
		width: 1.2rem;
		padding-bottom: .1rem;
		height: .8rem;
	}

	.reward>p {
		padding-bottom: .1rem;
	}

	.reward0 {
		display: none;
	}

	.reward1 {
		top: .7rem;
		transform: translateX(-50%) rotate(0);
	}

	.reward2 {
		transform: translateX(-50%) rotate(60deg)
	}

	.reward3 {
		transform: translateX(-50%) rotate(120deg)
	}

	.reward4 {
		transform: translateX(-50%) rotate(180deg)
	}

	.reward5 {
		transform: translateX(-50%) rotate(240deg)
	}

	.reward6 {
		transform: translateX(-50%) rotate(300deg)
	}

	.thank {
		width: .8rem !important;
		height: .8rem !important;
		border-radius: 50%;
		overflow: hidden;
	}
</style>
