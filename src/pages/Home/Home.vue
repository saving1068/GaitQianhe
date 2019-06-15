<template>
<div style="min-height: 100%;background:#FFFFFF;">



  <div class="contentTop">
    <form class="inputBox" action="" onsubmit="return false;">
      <i></i>
      <input type="search" v-model="searchText" placeholder="去哪旅游? 点击搜索试试" @blur="blur" @keyup.enter="goSearch('HomeSearch')" />
    </form>
    <swiperBox :swiperList="items" :canJump="true"></swiperBox>

  </div>
  <div class="goBox">
    <li>
      <div class="top" @click="go('Navigation')">
        <img src="../../assets/home/home_img_map@3x.png" />
      </div>
      <p>旅行地图</p>
    </li>
    <li>
      <div class="top" @click="go('Made')">
        <img src="../../assets/home/home_img_book@3x.png" />
      </div>
      <p>定制旅行</p>
    </li>
    <li>
      <div class="top" @click="go('Game')">
        <img src="../../assets/home/home_img_turntable@3x.png" />
      </div>
      <p>幸运大转盘</p>
    </li>
    <li>
      <div class="top" @click="go('ShoppingMall')">
        <img src="../../assets/home/home_img_luggage@3x.png" />
      </div>
      <p>旅行商城</p>
    </li>
  </div>
  <div class="title">
    <i class="left"></i>
    <div class="mid">热门目的地


    </div>
    <i class="right"></i>
  </div>
  <div class="address">
    <li v-for="item in address" @click="goMore('HomeSearch',item.actionContent,item.title)">{{item.title}}</li>

    <li @click="goMore('HomeSearch')"><i></i></li>

  </div>
  <div v-for="(item,index) in imgsArr" :id="'waterBox'+index" :key="imgsArr.id">
    <div class="title" style="margin-bottom: 0.27rem;">
      <i class="left"></i>
      <div :class="['mid',item.title.length*0.32>5.44?'':'.solid']">
        {{item.title}}

      </div>
      <i class="right"></i>
    </div>
    <div style="text-align: center;padding: 0 0.35rem;box-sizing: border-box;width: 100%;font-size: 0.22rem;margin-bottom: 0.45rem;">
      {{item.actionName}}
    </div>

    <vue-waterfall-easy :imgsArr="item.wbArticles" :index="index" :height="item.height" @getHeight="getHeight">





      <div class="img-info" slot-scope="props">
        <!--<p class="some-info">好滴好滴黑和发挥发挥安抚客户发哈咖啡和东方红卡发哈咖啡</p >-->
        <p :class="['some-info',getByteLen(props.value.title)>48?'clear':'']">{{props.value.title}}</p>
        <p class="some-info">{{props.value.authorName}}</p>
      </div>
      <!--<div slot="waterfall-over" >已无更多数据</div>-->
    </vue-waterfall-easy>

  </div>
  <div style="height: 1rem;"></div>
</div>
</template>

<script>
import {
  Toast
} from 'vant'

export default {
  data() {
    return {
      imgsArr: [],
      pa: 0,
      items: [],
      address: [],
      swiper: null,
      height: [],
      searchText: "",
      user: {}
    }
  },
  components: {
    vueWaterfallEasy: () => import('../../components/vue-waterfall-easy/vue-waterfall-easy'),
    swiperBox: () => import('../../components/swiperBox/swiperBox')
  },

  created() {
    this.getAddress()
    this.getList()

  },
  mounted() {
    this.getSwiper()
  },

  methods: {

    goMore(text, item, name) {
      if (item) {
        this.$router.push({
          name: text,
          query: {
            cityId: item,
            place: name
          }
        })
      } else {
        this.$router.push({
          name: text

        })
      }


    },
    getHeight(data) {
      console.log(data)
      console.log(document.documentElement.clientWidth)
      if (data.colsHeightArr[0] > data.colsHeightArr[1]) {
        if (document.documentElement.clientWidth * 2 < 750) {
          this.imgsArr[data.index].height = data.colsHeightArr[0] * 2 / 100 / (document.documentElement.clientWidth * 2 / 750) + 'rem'
        } else {
          this.imgsArr[data.index].height = data.colsHeightArr[0] * 2 / 100 + 'rem'
        }


      } else {
        if (document.documentElement.clientWidth * 2 < 750) {
          this.imgsArr[data.index].height = data.colsHeightArr[1] * 2 / 100 / (document.documentElement.clientWidth * 2 / 750) + 'rem'
        } else {
          this.imgsArr[data.index].height = data.colsHeightArr[1] * 2 / 100 + 'rem'
        }
      }
      if (data.colsHeightArr.length < 2) {
        if (document.documentElement.clientWidth * 2 < 750) {
          this.imgsArr[data.index].height = data.colsHeightArr[1] * 2 / 100 / (document.documentElement.clientWidth * 2 / 750) + 'rem'
        } else {
          this.imgsArr[data.index].height = data.colsHeightArr[1] * 2 / 100 + 'rem'
        }
      }


    },
    getList() {
      this.$Api.Home.AdList({
        a: 3
      }).then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          this.$nextTick(() => {

            this.imgsArr = [...res.q.ads]

            this.height.length = this.imgsArr.length
            console.log(this.height)
            for (let i = 0; i < this.height.length; i++) {
              var arr = 0
              this.height[i] = arr
            }





          })


        }


      })

    },
    blur() {
      if (this.searchText != "") {
        this.$router.push({
          name: "HomeSearch",
          query: {
            text: this.searchText
          }
        })

      }

    },
    goSearch(){
      if (this.searchText != "") {
        this.$router.push({
          name: "HomeSearch",
          query: {
            text: this.searchText
          }
        })

      }
    },
    go(text) {

      this.$router.push({
        name: text
      })


    },
    getSwiper() {

      this.$Api.Home.AdList({
        a: 2
      }).then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          if (res.q.ads.length > 0) {
            this.items = [...res.q.ads]
            this.$nextTick(() => {
              this.initSwiper()

            })


          }

        }


      })

    },
    getAddress() {
      this.$Api.Home.AdList({
        a: 4
      }).then((res) => {
        console.log(res)
        if (res.q.s == 0) {

          this.address = [...res.q.ads]
        }


      })

    },

    getByteLen(val) { //判断字符串长度
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }

      return len;
    },

    //初始化轮播
    initSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        observer: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        speed: 500,
        // autoplayDisableOnInteraction: false
      })
    }

  },
  beforeRouteLeave(to, from, next) {
    // console.log(to)
    if (!this.$store.state.bindNumber&& to.name != "BindNumber" && this.$store.state.disabledUser) {
      // if(this.$store.state.bindNumber!=null){
        Toast({
          message: "您还未绑定手机",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        this.$router.push({
          name: "BindNumber"
        })
      // }


    }

    if (this.$store.state.disabledUser) {
      next()
    } else {
      Toast({
        message: "您的账号已被禁用，请联系管理员",
        forbidClick: true,
        position: 'bottom',
        duration: 5000
      });
      next(false)
    }



    //							next()
    //								console.log(to)
    // this.$router.push({
    // 	name:"BindNumber"
    // })





    // }




  }

}
</script>

<style scoped="scoped" lang="scss">
.img-info {
    width: 3.4rem;
    word-break: break-all;
    border: 1px solid #EDEDED;
    border-top: none;
    font-size: 0.26rem;
    color: #333333;
    padding-top: 0.15rem;
    .some-info {
        padding-left: 0.1rem;
        padding-right: 0.07rem;
        box-sizing: border-box;
        word-break: break-all;
    }
    .clear {
        height: 1.15rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;

    }
    .some-info:first-child {
        margin-bottom: 0.4rem;
    }
    .some-info:last-child {
        color: #666666;
        font-size: 0.22rem;
        margin-bottom: 0.3rem;
    }
}

.contentTop {
    width: 100%;
    height: 3rem;
    position: relative;
    padding-top: 0.16rem;
    box-sizing: border-box;
    .inputBox {
        width: 7rem;
        height: 0.6rem;
        margin-left: 0.23rem;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 0.6rem;
        // padding: 0.1rem 0;
        box-sizing: border-box;
        position: absolute;
        z-index: 2;
        i {
            width: 0.2rem;
            height: 0.2rem;
            background: url("../../assets/common/common_icon_search@3x.png") no-repeat;
            background-size: 100%;
            float: left;
            margin-left: 0.3rem;
            margin-top: 0.2rem;
        }
        input {
            width: 6rem;
            background: transparent;
            border: none;
            margin-left: 0.1rem;
            height: 0.6rem;
            font-size: 0.26rem;
            line-height: 0.6rem;
        }
    }
}

.goBox {
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    margin-top: 0.3rem;
    li {
        list-style: none;
        width: 25%;
        .top {
            width: 1.2rem;
            height: 1.2rem;
            margin: auto;
            img {
                width: 100%;
                height: 100%;
            }
        }
        p {
            text-align: center;
            font-size: 0.22rem;
            margin-top: 0.26rem;
        }
    }
}

.title {
    width: 100%;
    margin-top: 0.8rem;
    position: relative;
    height: 0.4rem;
    margin-bottom: 0.45rem;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    -o-justify-content: center;
    justify-content: center;
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */

    .mid {
        // width: 1.5rem;

        font-size: 0.3rem;
        position: relative;
        text-align: center;
        /*对宽度的定义,根据情况修改*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

    }
    .left {
        width: 0.73rem;
        height: 0.03rem;
        background: url("../../assets/common_img_title_left@3x.png") no-repeat;
        background-size: 100%;
        margin-right: 0.3rem;
        position: relative;
        top: 0.2rem;
    }
    .right {
        width: 0.73rem;
        height: 0.03rem;
        background: url("../../assets/common_img_title_end@3x.png") no-repeat;
        background-size: 100%;
        margin-left: 0.3rem;
        position: relative;
        top: 0.2rem;
    }
    .solid {
        width: 5.44rem;

    }
}

.address {
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    list-style: none;
    -webkit-flex-wrap: wrap;
    -webkit-box-lines: multiple;
    -moz-flex-wrap: wrap;
    flex-wrap: wrap;
    li {
        width: 1.65rem;
        height: 0.7rem;
        background: #EDEDED;
        text-align: center;
        line-height: 0.7rem;
        position: relative;
        margin-right: 0.15rem;
        margin-bottom: 0.15rem;
        font-size: 0.28rem;
        i {
            width: 0.22rem;
            height: 0.05rem;
            background: url("../../assets/common/icon_ellipsis_disable.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
    }
    li:nth-child(4n+1) {
        margin-left: 0.2rem;
    }

}
</style>
<style lang="scss">
/*.waterBox {
		.top {
			width: 3.4rem;
			height: 2.4rem;
			position:relative img {
				width: 100%;
				height: 100% !important;
			}
		}
		.bottom {}
	}*/
</style>
