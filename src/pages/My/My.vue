<template>
<div style="background:#FFFFFF;">
  <div class="topBox">
    <div class="background"></div>
    <div class="information" @click="go('Mymessage')">
      <div class="avatar" @click.stop="showImg(user.imagePath)">
        <img :src="user.imagePath" />
      </div>
      <div class="textBox">
        <div class="first">
          <span>{{user.name}}</span>
          <div>
            <i></i>
            <span>{{gradeName}}</span>
          </div>
        </div>
        <p class="second" v-if="user.regionInfo">所在地：<span v-if="user.regionInfo.length>0&&user.regionInfo.length>2">{{user.regionInfo[1].name}}</span>
          <span v-if="user.regionInfo.length>0&&user.regionInfo.length<3">{{user.regionInfo[0].name}}</span>
        </p>
      </div>
      <i class="More"></i>
    </div>
    <div class="points">
      <li @click="go('Money')">
        <div class="textBox">
          <p>{{cash}}</p>
          <p>金币</p>
        </div>
        <div class="rightShu"></div>
      </li>
      <li @click="go('Points')">
        <div class="textBox">
          <p>{{points}}</p>
          <p>积分</p>
        </div>
        <div class="rightShu"></div>
      </li>
      <li>
        <div class="btn" @click="showToast" v-if="isSign==false">打卡领积分</div>
        <div class="btn" v-if="isSign">打卡{{total}}天</div>
      </li>

    </div>

  </div>
  <div class="line" @click="share">邀请好友加入步履千寻，一起拿红包奖励！</div>
  <div class="bottomBox">
    <li @click="go('Money')">
      <div class="top">
        <i class="icon icon_1"></i>
      </div>
      <p>我的金币</p>
    </li>
    <li @click="go('Points')">
      <div class="top">
        <i class="icon icon_2"></i>
      </div>
      <p>我的积分</p>
    </li>
    <li @click="go('MyIndent')">
      <div class="top">
        <i class="icon icon_3"></i>
      </div>
      <p>我的订单</p>
    </li>
    <li @click="go('MyShoppingCar')">
      <div class="top">
        <i class="icon icon_4"></i>
      </div>
      <p>购物车</p>
    </li>
    <li @click="go('Collect')">
      <div class="top">
        <i class="icon icon_5"></i>
      </div>
      <p>收藏夹</p>
    </li>
    <li @click="go('Coupon')">
      <div class="top">
        <i class="icon icon_6"></i>
      </div>
      <p>优惠券</p>
    </li>
    <li style="border-bottom: none;" @click="go('Enter')">
      <div class="top">
        <i class="icon icon_7"></i>
      </div>
      <p>我要进驻</p>
    </li>
    <li style="border-bottom: none;" @click="go('Suggest')">
      <div class="top">
        <i class="icon icon_8"></i>
      </div>
      <p>意见反馈</p>
    </li>

  </div>
  <div style="height: 1rem;"></div>


  <div id="iCenter" style="display: none;"></div>

</div>
</template>

<script>
export default {

  data() {
    return {
      arr: [],
      nowDate: "",
      isSign: null,
      total: 0,
      points: "",
      cash: "",
      user: {},
      city: "",
      gradeName: ""

    }

  },
  computed: {
    getConfig() {
      return this.$store.state.config
    }
  },
  watch: {
    getConfig(a) {
      if (Object.keys(a).length != 0) {
        this.config()
      }
    }
  },
  created() {
    this.getData()
    this.getIntegral()
    if (JSON.stringify(this.$store.state.Home.user) == "{}") {
      this.getUser()
    } else {
      this.user = { ...this.$store.state.Home.user
      }
      this.config()
    }
  },
  mounted() {

  },
  methods: {
    share() {
      this.$share("邀请好友")
    },
   async getIntegral() {
      this.$Api.My.MyIntegral().then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          this.gradeName = res.q.gradeName
          this.getDate()
        }
      })


    },
    showImg(url) {
      let arr = []
      arr.push(url);
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      });

    },
    config(){
      let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=Invit&shareId=" +this.$store.state.Home.user.id;
      let that = this;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
        timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
        signature: this.$store.state.config.signature, // 必填，签名
        jsApiList: ["previewImage", "updateAppMessageShareData", "onMenuShareAppMessage", "getLocation"] // 必填，需要使用的JS接口列表
      });
      wx.ready(function() { //需在用户可能点击分享按钮前就先调用
        if(wx.onMenuShareAppMessage){
          wx.onMenuShareAppMessage({
            title: "你的小伙伴邀请您一起步履千寻赶紧点击加入吧", // 分享标题
            desc: '步履千行', // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function(res) {
              console.log(res)
              // 用户点击了分享后执行的回调函数
            }
          })
        }else{
          wx.updateAppMessageShareData({
            title: "你的小伙伴邀请您一起步履千寻赶紧点击加入吧", // 分享标题
            desc: '步履千行', // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
            success: function () {
            // 设置成功
          } });
        }







      if (that.user.regionInfo.length == 0) {
        that.$loading("定位中...")
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            console.log(res)
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
    				AMap.plugin('AMap.Geocoder', function() {
    		 		 var geocoder = new AMap.Geocoder({
    		 			 // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
    		 			 radius: '1000',
    		 			 batch: false,
    		 			 extensions: "base"
    		 		 })

    		 		 var lnglat = [longitude, latitude]

    		 		 geocoder.getAddress(lnglat, function(status, result) {
    		 				 if(status==="no_data"){
    		 						 that.user.regionId=3653
    		 						 that.$Api.My.UserUpdate({
    		 							 user: that.user
    		 						 }).then((saveData) => {
    		 							 console.log(saveData)
    		 							 if (saveData.q.s == 0) {
    		 								 setTimeout(() => {
    		 									 that.$loading.clear()
    		 								 }, 300)
    		 								 that.getUser()
    		 							 }
    		 						 })
    		 				 }

    		 			 if (status === 'complete' && result.info === 'OK') {
    		 				 console.log(result)
    		 				 let obj = { ...result.regeocode
    		 				 }
    		 				 that.$loading("定位中")
    		 				 that.$Api.UserPage.RegionList({
    		 					 a: 1,
    		 					 id: 0
    		 				 }).then(response => {
    		 					 let provinceArr = []
    		 					 provinceArr = [...response.q.items]
    		 					 for (let i = 0; i < provinceArr.length; i++) {
    		 						 if (obj.addressComponent.province.indexOf(provinceArr[i].name) != -1) {

    		 							 that.$Api.UserPage.RegionList({
    		 								 a: 1,
    		 								 id: provinceArr[i].id
    		 							 }).then(data => {
    		 								 let cityArr = []
    		 								 cityArr = [...data.q.items]
    										 console.log(cityArr)
    										 if(cityArr[0].name=="香港"||cityArr[0].name=="台湾"){

    											 that.user.regionId = cityArr[0].id
    											 that.$Api.My.UserUpdate({
    												 user: that.user
    											 }).then((saveData) => {
    												 console.log(saveData)
    												 if (saveData.q.s == 0) {
    													 setTimeout(() => {
    														 that.$loading.clear()
    													 }, 300)
    													 that.getUser()
    												 }
    											 })

    											 return;
    										 }
    										 if(cityArr[0].name=="北京"||cityArr[0].name=="上海"||cityArr[0].name=="天津"||cityArr[0].name=="重庆"){
    											 that.$Api.UserPage.RegionList({
    												 a: 1,
    												 id: cityArr[0].id
    											 }).then(disData => {
    												 let districtArr = []
    												 districtArr = [...disData.q.items]
    												 for (let i = 0; i < districtArr.length; i++) {
    													 if (obj.addressComponent.district.indexOf(districtArr[i].name) != -1) {
    														 that.user.regionId = districtArr[i].id
    														 that.$Api.My.UserUpdate({
    															 user: that.user
    														 }).then((saveData) => {
    															 console.log(saveData)
    															 if (saveData.q.s == 0) {
    																 setTimeout(() => {
    																	 that.$loading.clear()
    																 }, 300)
    																 that.getUser()
    															 }
    														 })

    														 return;
    													 }


    												 }
    											 })

    												return

     										 }

    		 								 for (let i = 0; i < cityArr.length; i++) {

    		 									 if (obj.addressComponent.city.indexOf(cityArr[i].name) != -1) {
    		 										 that.$Api.UserPage.RegionList({
    		 											 a: 1,
    		 											 id: cityArr[i].id
    		 										 }).then(disData => {
    		 											 let districtArr = []
    		 											 districtArr = [...disData.q.items]
    		 											 for (let i = 0; i < districtArr.length; i++) {
    		 												 if (obj.addressComponent.district.indexOf(districtArr[i].name) != -1) {
    		 													 that.user.regionId = districtArr[i].id
    															 that.$Api.My.UserUpdate({
    									 							 user: that.user
    									 						 }).then((saveData) => {
    									 							 console.log(saveData)
    									 							 if (saveData.q.s == 0) {
    									 								 setTimeout(() => {
    									 									 that.$loading.clear()
    									 								 }, 300)
    									 								 that.getUser()
    									 							 }
    									 						 })

    		 													 return;
    		 												 }


    		 											 }
    		 										 })


    		 										 return;
    		 									 }


    		 								 }
    		 							 })


    		 							 return;
    		 						 }


    		 					 }
    		 				 })
    		 				 // result为对应的地理位置详细信息
    		 			 }
    		 		 })
    		 	 })


          }
        });
      }
        });
    },

    go(name) {
      this.$router.push({
        name: name

      })

    },
    getUser() {
      this.$Api.UserPage.UserDetails({
        a: 0
      }).then((res) => {
        if (res.q.s == 0) {
          this.user = { ...res.q.user
          }
          this.config()
          if (this.user.imagePath == undefined) {
            this.user.imagePath = require("../../assets/common/placeholder_200x200.png")
          }
          this.$store.dispatch("changeUserObj", this.user)
        }

      })
    },
    getData() {
      this.$Api.My.MyAccountList({
        a: 0
      }).then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          this.points = res.q.Accounts[0].balanceTotal
          this.cash = res.q.Accounts[1].balanceTotal

        }

      })

    },
    getDate() {
      let obj = {
        a: 2,
        date: this.format(new Date(), 'yyyy-MM-dd')
      }
      this.nowDate = this.format(new Date(), 'yyyy-MM-dd')
      this.$Api.My.SignAndGetIntegral(obj).then((res) => {
        this.total = res.q.total
        if (res.q.s == 0) {
          for (let i = 0; i < res.q.logs.length; i++) {
            let obj = this.format(new Date(res.q.logs[i]), 'yyyy-MM-dd')
            if (obj == this.nowDate) {
              this.isSign = true
            }
            this.arr.push(obj)

          }
          if (this.isSign == null) {
            this.isSign = false
          }
        }

      })
    },
    showToast() {
      let obj = {
        a: 1

      }

      this.$Api.My.SignAndGetIntegral(obj).then((res) => {

        if (res.q.s == 0) {
          this.isSign = true
          this.total = res.q.total
          this.getData()
          this.$toast("打卡成功", 'success')
        }

      })


    },
    format(time, format) {
      var t = new Date(time);
      var tf = function(i) {
        return (i < 10 ? '0' : '') + i
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear());
            break;
          case 'MM':
            return tf(t.getMonth() + 1);
            break;
          case 'mm':
            return tf(t.getMinutes());
            break;
          case 'dd':
            return tf(t.getDate());
            break;
          case 'HH':
            return tf(t.getHours());
            break;
          case 'ss':
            return tf(t.getSeconds());
            break;
        }

      })

    }

  }
}
</script>

<style scoped="scoped" lang="scss">
.toast {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transition: 0.5s;
    width: 3.44rem;
    height: 3.56rem;
    background: rgba(26, 26, 26, 0.8);
    border-radius: 0.3rem;
    padding-top: 0.8rem;
    box-sizing: border-box;
    .top {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        margin: auto auto 0.48rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    p {
        text-align: center;
        font-size: 0.34rem;
        color: #FFFFFF;
        font-weight: bold;
    }
}

.topBox {
    height: 4.2rem;
    width: 100%;
    position: relative;
    background: rgba(237, 237, 237, 1);
    .background {
        height: 1.6rem;
        width: 100%;
        background: url("../../assets/my/my_bg_top@3x.png") no-repeat;
        background-size: 100%;
    }
    .information {
        position: absolute;
        width: 7.02rem;
        height: 1.74rem;
        left: 3.3%;
        background: #FFFFFF;
        top: 0.7rem;
        display: flex;
        display: -webkit-box;
        /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;
        /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;
        /* 混合版本语法: IE 10 */
        display: -webkit-flex;
        /* 新版本语法: Chrome 21+ */
        padding: 0.25rem 0 0.29rem 0.25rem;
        box-sizing: border-box;
        .avatar {
            width: 1.2rem;
            height: 1.2rem;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .textBox {
            margin-left: 0.25rem;
            .first {
                display: flex;
                display: -webkit-box;
                /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                display: -moz-box;
                /* 老版本语法: Firefox (buggy) */
                display: -ms-flexbox;
                /* 混合版本语法: IE 10 */
                display: -webkit-flex;
                /* 新版本语法: Chrome 21+ */
                div {
                    display: flex;
                    display: -webkit-box;
                    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                    display: -moz-box;
                    /* 老版本语法: Firefox (buggy) */
                    display: -ms-flexbox;
                    /* 混合版本语法: IE 10 */
                    display: -webkit-flex;
                    /* 新版本语法: Chrome 21+ */
                    margin-left: 0.43rem;
                    position: relative;
                    top: 0.05rem;
                    i {
                        width: 0.21rem;
                        height: 0.20rem;
                        background: url("../../assets/my/my_icon_vip@3x.png") no-repeat;
                        background-size: 100%;
                        position: relative;
                        top: 0.06rem;
                    }
                    span {
                        color: #E6BF6B;
                        font-size: 0.22rem;
                        line-height: 0.35rem;
                        margin-left: 0.06rem;
                    }
                }
                span {
                    font-size: 0.3rem;
                }
            }
            .second {
                font-size: 0.24rem;
                color: #333333;
                margin-top: 0.27rem;
            }
        }
        .More {
            width: 0.1rem;
            height: 0.2rem;
            background: url("../../assets/common/common_btn_right@3x.png") no-repeat;
            background-size: 100%;
            position: absolute;
            right: 0.4rem;
            top: 0.8rem;
        }
    }
    .points {
        width: 7.02rem;
        height: 1.2rem;
        background: #FFFFFF;
        position: absolute;
        left: 3.3%;
        bottom: 0.27rem;
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
            position: relative;
            text-align: center;
            padding: 0.25rem 0;
            box-sizing: border-box;
            font-size: 0.3rem;
            .rightShu {
                position: absolute;
                right: -0.01rem;
                width: 0.01rem;
                top: 0.4rem;
                height: 0.4rem;
                background: rgba(210, 210, 210, 1);
            }
            .btn {
                width: 1.78rem;
                height: 0.68rem;
                background: rgba(250, 220, 86, 1);
                border-radius: 0.15rem;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                text-align: center;
                line-height: 0.68rem;
                font-size: 0.28rem;
            }
        }
    }
}

.line {
    height: 0.88rem;
    background: rgba(255, 255, 230, 1);
    text-align: center;
    line-height: 0.88rem;
    font-size: 0.24rem;
}

.bottomBox {
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    -webkit-flex-wrap: wrap;
    -webkit-box-lines: multiple;
    -moz-flex-wrap: wrap;
    flex-wrap: wrap;
    li {
        list-style: none;
        width: 33.33%;
        height: 2.3rem;
        border-bottom: #E5E5E5 solid 1px;
        .top {
            width: 100%;
            height: 0.6rem;
            float: left;
            position: relative;
            margin-top: 0.6rem;
            .icon {
                width: 0.6rem;
                height: 0.6rem;
                float: left;
                text-align: center;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
            .icon_1 {
                background: url("../../assets/my/my_btn_wallet@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_2 {
                background: url("../../assets/my/common_btn_Diamonds@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_3 {
                background: url("../../assets/my/my_btn_order@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_4 {
                background: url("../../assets/my/my_btn_cart@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_5 {
                background: url("../../assets/my/my_btn_star@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_6 {
                background: url("../../assets/my/my_btn_coupon@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_7 {
                background: url("../../assets/my/my_btn_enter@3x.png") no-repeat;
                background-size: 100% 100%;
            }
            .icon_8 {
                background: url("../../assets/my/my_btn_problem@3x.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        p {
            text-align: center;
            font-size: 0.24rem;
            width: 100%;
            float: left;
            margin-top: 0.23rem;
        }
    }
    li:nth-child(3n+1) {
        border-right: #E5E5E5 solid 1px;
    }
    li:nth-child(3n+2) {
        border-right: #E5E5E5 solid 1px;
    }
}
</style>
