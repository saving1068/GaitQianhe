<template>
<div style="background: #EDEDED;height: 100%;">
  <div class="background" :style="backgroundStyle">
    <img :src="background" />
  </div>
  <div class="content">
    <div class="top">
      <li :class="[activeIndex==0?'active':'']" @click="change(0)">个人定制</li>
      <li :class="[activeIndex==1?'active':'']" @click="change(1)">团建/公司定制</li>
      <div class="line" :style="lineStyle"></div>

    </div>
    <div class="left" v-if="activeIndex==0">
      <div class="item">
        <!--<li>广州</li>-->
        <li v-if="list.deparPlace" @click="go('MadePlace','from')"><span>{{list.deparPlace}}</span></li>
        <li style="color:#CCCCCC ;font-weight: bold;" @click="go('MadePlace','from')" v-if="!list.deparPlace"><span>选择出发地</span></li>
        <li v-if="list.destination" @click="go('MadePlace','to')"><span>{{list.destination}}</span></li>
        <li style="color:#CCCCCC ;font-weight: bold;" @click="go('MadePlace','to')" v-if="!list.destination"><span>选择目的地</span></li>

        <div class="mid"></div>

      </div>
      <div class="item" @click="showMadeDate">
        <span style="color:#CCCCCC ;font-weight: bold;" v-if="!list.comfirmDate">出发日期/返程日期</span>
        <span v-if="list.comfirmDate">{{list.dateText}}</span>
        <i class="icon"></i>
      </div>
      <div class="item" @click="peopleNum=true;">
        <span v-if="!list.peopleNum" style="color:#CCCCCC ;font-weight: bold;">选择出行人数</span>
        <span v-if="list.peopleNum">{{list.peopleNum}}</span>
        <i class="icon"></i>
      </div>
      <div class="item" style="padding: 0.2rem 0;box-sizing: border-box;">
        <input type="tel" placeholder="人均预算（选填）" v-model="list.budget" @blur="listBlur" ref="listBudget">

      </div>
      <div class="comfirm" @click="submit">
        免费获得方案
      </div>
      <div class="bottom">
        <div class="topBox">
          <div class="line" style="margin-right: 0.25rem;"></div>
          <span>不成行·不收费</span>
          <div class="line" style="margin-left: 0.25rem;"></div>
        </div>
        <div class="btn" @click="goText">了解定制旅行</div>
      </div>
    </div>
    <div class="right" v-if="activeIndex==1">
      <div class="item">
        <li v-if="teamList.deparPlace" @click="go('MadePlace','from')"><span>{{teamList.deparPlace}}</span></li>
        <li style="color:#CCCCCC ;font-weight: bold;" @click="go('MadePlace','from')" v-if="!teamList.deparPlace"><span>选择出发地</span></li>
        <li v-if="teamList.destination" @click="go('MadePlace','to')"><span>{{teamList.destination}}</span></li>
        <li style="color:#CCCCCC ;font-weight: bold;" @click="go('MadePlace','to')" v-if="!teamList.destination"><span>选择目的地</span></li>

        <div class="mid"></div>

      </div>
      <div class="item" @click="showTeamDate">
        <span style="font-weight: bold;color: #CCCCCC;" v-if="!teamList.comfirmDate">出发日期/返程日期</span>
        <span v-if="teamList.comfirmDate">{{teamList.dateText}}</span>
        <i class="icon"></i>
      </div>
      <div class="item" @click="show">
        <span v-if="!teamList.peopleNum" style="color:#CCCCCC ;font-weight: bold;">选择出行人数</span>
        <span v-if="teamList.peopleNum">{{teamList.peopleNum}}</span>
        <i class="icon"></i>
      </div>
      <div class="item" style="padding: 0.2rem 0;box-sizing: border-box;">
        <input type="tel" placeholder="人均预算（选填）" v-model="teamList.budget"  @blur="teamListBlur" ref="teamListBudget" >

      </div>

      <div class="comfirm" @click="submit">
        免费获得方案
      </div>
      <div class="bottom">
        <div class="topBox">
          <div class="line" style="margin-right: 0.25rem;"></div>
          <span>不成行·不收费</span>
          <div class="line" style="margin-left: 0.25rem;"></div>
        </div>
        <div class="btn" @click="goText">了解定制旅行</div>
      </div>

    </div>
  </div>
  <van-popup v-model="isShow" position="bottom" :overlay="true" :close-on-click-overlay="true">
    <van-picker :columns="columns" show-toolbar @cancel="isShow=false" @confirm="onConfirm" />
  </van-popup>
  <van-popup v-model="isDate" position="bottom" :overlay="true" :close-on-click-overlay="true">
    <div class="MadePicktitle">
      <div class="item" @click="changeDate(0)">{{fromDate}}</div>
      <span>至</span>
      <div class="item" @click="changeDate(1)">{{toDate}}</div>
      <div class="MadePickLine" :style="[{'left':dateIndex==0?'0.22rem':'3.2rem'}]"></div>
      <span class="MadePickComfirm" @click="comfirmDate">完成</span>
    </div>
    <van-datetime-picker :show-toolbar='false' v-if="fromDatePicker" v-model="commonFromDate" type="date" :formatter="formatter" :min-date="new Date()" :max-date="maxDate" @change="fromDateChange" />
    <van-datetime-picker :show-toolbar='false' v-if="toDatePick" v-model="commonToDate" type="date" :formatter="formatter" :min-date="toObj.minDate" :max-date="toObj.maxDate" />

  </van-popup>

  <div class="dialog_mask" v-if="peopleNum">
    <div class="content">
      <div class="top">
        出游人数
      </div>
      <div class="item">
        <span>成人</span>
        <div class="subBox" @click="sub(0)">
          <div class="sub"></div>

        </div>
        <div class="inputBox">
          <input type="tel" v-model="list.adult" maxlength="2" @blur="adultBlur" ref="adult" />
        </div>
        <div class="addBox" @click="add(0)">
          <div class="add"></div>

        </div>

      </div>
      <div class="item">
        <span>儿童</span>
        <div class="subBox" @click="sub(1)">
          <div class="sub"></div>

        </div>
        <div class="inputBox">
          <input type="tel" v-model="list.children" maxlength="2" @blur="childrenBlur" ref="children" />
        </div>
        <div class="addBox" @click="add(1)">
          <div class="add"></div>

        </div>
      </div>
      <div class="comfirm" @click="comfirmPeo">
        确定
      </div>
    </div>

  </div>

</div>
</template>

<script>
import {
  Toast
} from 'vant'
export default {
  components: {
    Toast
  },
  computed: {
    lineStyle() {
      if (this.activeIndex == 0) {
        return {
          "left": '1.15rem',
          "width": '1rem'

        }

      } else if (this.activeIndex == 1) {
        return {
          "left": '4.05rem',
          "width": '1.74rem'

        }

      }

    },
    backgroundStyle() {
      return {
        "width": '100%',
        'height': '3rem',

      }

    }


  },
  data() {
    return {
      peopleNum: false,
      commonFromDate: "",
      commonToDate: "",
      isDate: false,
      activeIndex: 0,
      background: "",
      id: 0,
      list: {},
      teamList: {},
      fromDatePicker: true,
      toDatePick: false,
      maxDate: new Date((new Date() / 1000 + 86400 * 365 * 1) * 1000),
      toObj: {
        minDate: "",
        maxDate: ""
      },
      children: 0,
      adult: 0,
      isShow: false,
      columns: [{
        values: [
          "预计1-10人出行",
          "预计11-20人出行",
          "预计21-30人出行",
          "预计31-40人出行",
          "预计41-50人出行",
          "预计50人以上出行"
        ],
        defaultIndex: 0

      }],
      dateIndex: 0,

      fromDate: "",
      toDate: ""

    }
  },

  created() {

    console.log(35 * 3600 + 52 * 60 + 31)
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.list = { ...this.$store.state.Home.made
    }

    this.activeIndex = this.$store.state.Home.madeIndex
    this.teamList = { ...this.$store.state.Home.teamMade
    }
    this.list.id = this.id;
    if (!this.list.children) {
      this.list.children = 0
    }
    if (!this.list.adult) {
      this.list.adult = 0
    }
    this.teamList.id = this.id;

    this.getBackground(this.id)

  },
  mounted() {

  },
  methods: {
    goText(){
      this.$router.push({
        name:"WithDraw",
        query:{
          key:"了解定制旅行"
        }
      })

    },
		listBlur(){
			this.list.budget=this.list.budget.replace(/[^0-9]/ig,"");
			this.list.budget=parseInt(this.list.budget)||"";
			this.$refs.listBudget.value=this.list.budget


		},
		teamListBlur(){
			this.teamList.budget=this.teamList.budget.replace(/[^0-9]/ig,"");
			this.teamList.budget=parseInt(this.teamList.budget)||"";
			this.$refs.teamListBudget.value=this.teamList.budget


		},


    adultBlur() {

      this.list.adult=this.list.adult.replace(/[^0-9]/ig,"");
			  this.list.adult=parseInt(this.list.adult)||0;
      this.$refs.adult.value=  this.list.adult;


    },
      childrenBlur(){
				this.list.children=this.list.children.replace(/[^0-9]/ig,"");
					this.list.children=parseInt(this.list.children)||0;
				this.$refs.children.value=  this.list.children;


			},

    comfirmPeo() {


      this.list.peopleNum = this.list.adult + "成人," + this.list.children + "儿童"


      this.peopleNum = false

    },
    sub(num) {
      if (num == 0) {
        if (this.list.adult > 0) {
          this.list.adult -= 1
        } else {
          this.list.adult = 0
        }
this.$refs.adult.value=this.list.adult
      } else {
        if (this.list.children > 0) {
          this.list.children -= 1
        } else {
          this.list.children = 0
        }
this.$refs.children.value=this.list.children

      }


    },
    add(num) {

      if (num == 0) {
        if (this.list.adult >= 99) {
          this.list.adult = 99

        } else {
          this.list.adult += 1
        }
      this.$refs.adult.value=this.list.adult
      } else {
        if (this.list.children >= 99) {
          this.list.children = 99

        } else {
          this.list.children += 1
        }
       this.$refs.children.value=this.list.children
      }

    },
    comfirmDate() {
      if (this.activeIndex == 0) {
        this.list.startAt = this.format(this.commonFromDate, 'yyyy-MM-dd')
        this.list.endAt = this.format(this.commonToDate, 'yyyy-MM-dd')

        this.list.comfirmDate = true
        let fromArr = this.list.startAt.split("-")
        let toArr = this.list.endAt.split("-")
        let time = new Date(toArr[0], toArr[1] - 1, toArr[2]) - new Date(fromArr[0], fromArr[1] - 1, fromArr[2])
        this.list.dateText = fromArr[0] + "." + fromArr[1] + "." + fromArr[2] + "~" + toArr[0] + "." + toArr[1] + "." + toArr[2] + "      " + time / 10000 / 8640 + "天"


      } else {
        this.teamList.startAt = this.format(this.commonFromDate, 'yyyy-MM-dd')
        this.teamList.endAt = this.format(this.commonToDate, 'yyyy-MM-dd')
        this.teamList.comfirmDate = true
        let fromArr = this.teamList.startAt.split("-")
        let toArr = this.teamList.endAt.split("-")
        let time = new Date(toArr[0], toArr[1] - 1, toArr[2]) - new Date(fromArr[0], fromArr[1] - 1, fromArr[2])
        this.teamList.dateText = fromArr[0] + "." + fromArr[1] + "." + fromArr[2] + "~" + toArr[0] + "." + toArr[1] + "." + toArr[2] + "      " + time / 10000 / 8640 + "天"

      }
      console.log(this.list)
      this.dateIndex = 0
      this.isDate = false

    },
    showMadeDate() {
      if (!this.list.startAt) {
        this.list.startAt = this.format(new Date(), 'yyyy-MM-dd')
      }
      if (!this.list.endAt) {
        this.list.endAt = this.format(new Date((new Date / 1000 + 86400 * 1) * 1000), 'yyyy-MM-dd')
      }
      let arr = this.list.startAt.split("-")
      this.fromDate = arr[0] + "年" + arr[1] + "月" + arr[2] + "日"
      this.commonFromDate = new Date(arr[0], arr[1] - 1, arr[2])
      this.toObj.minDate = new Date((this.commonFromDate / 1000 + 86400 * 1) * 1000)
      this.toObj.maxDate = new Date((this.commonFromDate / 1000 + 86400 * 365 * 1) * 1000)
      let nextArr = this.list.endAt.split("-")
      this.toDate = nextArr[0] + "年" + nextArr[1] + "月" + nextArr[2] + "日"
      this.commonToDate = new Date(nextArr[0], nextArr[1] - 1, nextArr[2])

      this.isDate = true;

    },
    showTeamDate() {
      if (!this.teamList.startAt) {
        this.teamList.startAt = this.format(new Date(), 'yyyy-MM-dd')
      }
      if (!this.teamList.endAt) {
        this.teamList.endAt = this.format(new Date((new Date / 1000 + 86400 * 1) * 1000), 'yyyy-MM-dd')
      }
      let arr = this.teamList.startAt.split("-")
      this.fromDate = arr[0] + "年" + arr[1] + "月" + arr[2] + "日"
      this.commonFromDate = new Date(arr[0], arr[1] - 1, arr[2])
      this.toObj.minDate = new Date((this.commonFromDate / 1000 + 86400 * 1) * 1000)
      this.toObj.maxDate = new Date((this.commonFromDate / 1000 + 86400 * 365 * 1) * 1000)
      let nextArr = this.teamList.endAt.split("-")
      this.toDate = nextArr[0] + "年" + nextArr[1] + "月" + nextArr[2] + "日"
      this.commonToDate = new Date(nextArr[0], nextArr[1] - 1, nextArr[2])

      this.isDate = true;

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

    },
    fromDateChange(value) {

      let arr = this.format(this.commonFromDate, 'yyyy-MM-dd').split("-")
      this.fromDate = arr[0] + "年" + arr[1] + "月" + arr[2] + "日"
      this.toObj.minDate = new Date((this.commonFromDate / 1000 + 86400) * 1000)
      this.toObj.maxDate = new Date((this.commonFromDate / 1000 + 86400 * 365 * 1) * 1000)
      if (this.commonFromDate > this.commonToDate) {

        this.commonToDate = new Date((this.commonFromDate / 1000 + 86400) * 1000)
        let nextArr = this.format(this.commonToDate, 'yyyy-MM-dd').split("-")

        this.toDate = nextArr[0] + "年" + nextArr[1] + "月" + nextArr[2] + "日"
      }

    },
    changeDate(num) {
      if (num == 0) {
        this.fromDatePicker = true
        this.toDatePick = false
      } else {
        this.fromDatePicker = false
        this.toDatePick = true

      }

      this.dateIndex = num

    },

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value;

    },
    show() {
      this.isShow = true

    },
    onConfirm(value) {
      console.log(value)
      this.teamList.peopleNum = value[0]
      this.$store.dispatch("changeTeamMadeObj", this.teamList)

      this.isShow = false
    },
    submit() {
      let obj = {}
      if (this.activeIndex == 0) {
        console.log(this.list)
        obj.a = 1
        obj.orgId = this.list.id
        if (this.list.deparPlace) {
          obj.deparPlace = this.list.deparPlace
        } else {
          Toast({
            message: "请选择出发地",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.list.destination) {
          obj.destination = this.list.destination
        } else {
          Toast({
            message: "请选择目的地",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.list.peopleNum) {
        	if(this.list.adult==0&&this.list.children==0){
      	Toast({
            message: "请选择人数",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
      	return
      }

          obj.peopleNum = this.list.peopleNum
        } else {
          Toast({
            message: "请选择人数",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.list.budget) {
          obj.budget = this.list.budget
        } else {
          Toast({
            message: "请输入预算",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.list.comfirmDate) {
          obj.startAt = this.list.startAt
          obj.endAt = this.list.endAt
        } else {
          Toast({
            message: "请选择开始结束时间",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }



      } else {
        obj.a = 2
        obj.orgId = this.teamList.id
        if (this.teamList.deparPlace) {
          obj.deparPlace = this.teamList.deparPlace
        } else {
          Toast({
            message: "请选择出发地",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.teamList.destination) {
          obj.destination = this.teamList.destination
        } else {
          Toast({
            message: "请选择目的地",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.teamList.peopleNum) {
          obj.peopleNum = this.teamList.peopleNum
        } else {
          Toast({
            message: "请选择人数",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.teamList.budget) {
          obj.budget = this.teamList.budget
        } else {
          Toast({
            message: "请输入预算",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }
        if (this.teamList.comfirmDate) {
          obj.startAt = this.teamList.startAt
          obj.endAt = this.teamList.endAt
        } else {
          Toast({
            message: "请选择开始结束时间",
            forbidClick: true,
            position: 'center',
            duration: 1000

          })
          return;
        }

      }

      this.$Api.Home.SubmitCustomInfo(obj).then((res) => {
        console.log(res)
        if (res.q.s == 0) {

          this.$toast("提交定制成功", "success")
          this.$router.go(-1)
        }

      })



    },
    change(num) {
      this.activeIndex = num
      this.$store.commit("changeMadeIndex", num)
    },
    go(text, type) {
      this.$router.push({
        name: text,
        query: {
          type: type,
          activeIndex: this.activeIndex
        }
      })
    },
    getBackground(id) {

      this.$Api.Home.GetCustomInfo({
        'id': id
      }).then((res) => {

        this.background = res.q.iamgeUrl
        if (this.background == "") {
          this.background = require('../../assets/home/home_bg_1@3x.png');
        }

        console.log(res)
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "MadePlace") {

      this.$store.dispatch("changeMadeObj", {})
      this.$store.dispatch("changeTeamMadeObj", {})
      this.$store.commit("changeMadeIndex", 0)
    } else {
      this.$store.dispatch("changeMadeObj", this.list)
      this.$store.dispatch("changeTeamMadeObj", this.teamList)
      this.$store.commit("changeMadeIndex", this.activeIndex)

    }
    next()
  }

}
</script>

<style scoped="scoped" lang="scss">
.dialog_mask {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 9999;
    top: 0;
    .content {
        width: 5.9rem;
        height: 4.15rem;
        padding: 0 0.6rem;
        box-sizing: border-box;
        background: #FFFFFF;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        .top {
            width: 100%;
            height: 1.04rem;
            border-bottom: 0.01rem solid #CCCCCC;
            line-height: 1.04rem;
            font-size: 0.26rem;
            color: #666666;
        }
        .item {
            height: 1.1rem;
            border-bottom: 0.01rem solid #CCCCCC;
            line-height: 1.1rem;
            display: flex;
            display: -webkit-box;
            /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box;
            /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox;
            /* 混合版本语法: IE 10 */
            display: -webkit-flex;
            /* 新版本语法: Chrome 21+ */
            span {
                font-size: 0.36rem;
            }
            .subBox {
                width: 0.32rem;
                height: 100%;
                margin-left: 1.2rem;
                position: relative;
                .sub {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    width: 0.32rem;
                    height: 0.05rem;
                    background: url("../../assets/home/home_btn_minus@3x.png") no-repeat;
                    background-size: 100%;
                }
            }
            .inputBox {
                margin-left: 0.7rem;
                padding: 0.3rem 0;
                height: 100%;
                width: 0.6rem;
                box-sizing: border-box;
                input {
                    width: 0.6rem;
                    height: 100%;
                    border: none;
                    float: left;
                    font-size: 0.38rem;
                    font-weight: bold;
                    line-height: 0.5rem;
                    text-align: center;
                }
            }
            .addBox {
                width: 0.32rem;
                height: 100%;
                margin-left: 0.7rem;
                position: relative;
                .add {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    width: 0.32rem;
                    height: 0.32rem;
                    background: url("../../assets/home/home_btn_add@3x.png") no-repeat;
                    background-size: 100%;
                }

            }

        }
        .comfirm {
            line-height: 0.88rem;
            text-align: center;
            font-size: 0.32rem;
            color: #4BA8FF;
        }

    }
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #CCCCCC;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
    color: #CCCCCC;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
    color: #CCCCCC;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
    color: #CCCCCC;
}

.background {
    position: relative;
    z-index: 0;
    img {
        width: 100%;
        height: 100%;
    }
}

.content {
    position: relative;
    padding: 0 0.24rem;
    box-sizing: border-box;
    width: 7.02rem;
    height: 8.73rem;
    background: #FFFFFF;
    margin: auto;
    bottom: 1.2rem;
    .top {
        width: 100%;
        height: 1rem;
        border-bottom: 0.01rem solid #EDEDED;
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
        .line {
            position: absolute;
            bottom: 0;
            height: 0.03rem;
            transition: 0.5s;
            background: #FADC56;
        }
        li {
            list-style: none;
            width: 50%;
            font-size: 0.3rem;
            text-align: center;
            line-height: 1rem;
        }
        .active {
            color: #FADC56;
        }
    }
    .left {
        .bottom {
            .btn {
                width: 2.00rem;
                height: 0.48rem;
                border: 0.01rem solid rgba(102, 102, 102, 1);
                border-radius: 0.24rem;
                text-align: center;
                line-height: 0.48rem;
                margin: auto;
                font-size: 0.24rem;
                margin-top: 0.4rem;
            }
            .topBox {
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
                padding: 0 0.26rem;
                box-sizing: border-box;
                .line {
                    width: 2rem;
                    height: 0.02rem;
                    background: #CCCCCC;
                    position: relative;
                    top: 0.16rem;
                }
                span {
                    color: #999999;
                    font-size: 0.22rem;
                }
            }
        }
        .comfirm {
            width: 6.54rem;
            height: 0.98rem;
            background: rgba(250, 220, 86, 1);
            border-radius: 0.06rem;
            text-align: center;
            line-height: 0.98rem;
            font-size: 0.3rem;
            margin-top: 0.6rem;
        }
        .item {
            height: 1.08rem;
            border-bottom: 0.01rem solid #EDEDED;
            position: relative;
            line-height: 1.08rem;
            font-size: 0.3rem;
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
            -moz-flex-wrap: wrap;
            -ms-flex-wrap: wrap;
            -o-flex-wrap: wrap;
            flex-wrap: wrap;
            font-weight: bold;
            .icon {
                width: 0.12rem;
                height: 0.22rem;
                background: url("../../assets/common_btn_right@2x.png") no-repeat;
                background-size: 100%;
                position: absolute;
                right: 0;
                top: 0.42rem;
            }
            li {
                display: block;
                width: 45%;
                box-sizing: border-box;
                height: 1.08rem;
                text-align: center;
                line-height: 1.08rem;
                /*对宽度的定义,根据情况修改*/
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span {
                    display: block;
                    font-size: 14px;
                    width: 100%;
                    /*对宽度的定义,根据情况修改*/
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            input {
                border: none;
                height: 100%;
                width: 100%;
                line-height: 0.68rem;
            }
            li {
                clear: both;
            }
            li span {
                float: left;
                max-width: 100%;
            }
            li:after {
                content: "...";
            }
            li:nth-child(2) {
                margin-left: 0.6rem;
            }
            .mid {
                width: 0.5rem;
                height: 0.26rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: url("../../assets/home/home_icon_arrow@3x.png") no-repeat;
                background-size: 100%;
            }
        }
    }
    .right {
        .bottom {
            .btn {
                width: 2.00rem;
                height: 0.48rem;
                border: 0.01rem solid rgba(102, 102, 102, 1);
                border-radius: 0.24rem;
                text-align: center;
                line-height: 0.48rem;
                margin: auto;
                font-size: 0.24rem;
                margin-top: 0.4rem;
            }
            .topBox {
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
                padding: 0 0.26rem;
                box-sizing: border-box;
                .line {
                    width: 2rem;
                    height: 0.02rem;
                    background: #CCCCCC;
                    position: relative;
                    top: 0.16rem;
                }
                span {
                    color: #999999;
                    font-size: 0.22rem;
                }
            }
        }
        .comfirm {
            width: 6.54rem;
            height: 0.98rem;
            background: rgba(250, 220, 86, 1);
            border-radius: 0.06rem;
            text-align: center;
            line-height: 0.98rem;
            font-size: 0.3rem;
            margin-top: 0.6rem;
        }
        .item {
            height: 1.08rem;
            border-bottom: 0.01rem solid #EDEDED;
            position: relative;
            line-height: 1.08rem;
            font-size: 0.3rem;
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
            -moz-flex-wrap: wrap;
            -ms-flex-wrap: wrap;
            -o-flex-wrap: wrap;
            flex-wrap: wrap;
            font-weight: bold;
            .icon {
                width: 0.12rem;
                height: 0.22rem;
                background: url("../../assets/common_btn_right@2x.png") no-repeat;
                background-size: 100%;
                position: absolute;
                right: 0;
                top: 0.42rem;
            }
            li {
                display: block;
                width: 45%;
                box-sizing: border-box;
                height: 1.08rem;
                text-align: center;
                line-height: 1.08rem;
                /*对宽度的定义,根据情况修改*/
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span {
                    display: block;
                    font-size: 14px;
                    width: 100%;
                    /*对宽度的定义,根据情况修改*/
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            li {
                clear: both;
            }
            li span {
                float: left;
                max-width: 100%;
            }
            li:after {
                content: "...";
            }
            li:nth-child(2) {
                margin-left: 0.6rem;
            }
            .mid {
                width: 0.5rem;
                height: 0.26rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: url("../../assets/home/home_icon_arrow@3x.png") no-repeat;
                background-size: 100%;
            }
            input {
                border: none;
                height: 100%;
                width: 100%;
                line-height: 0.68rem;
            }
        }
    }
}
</style>
<style type="text/css" lang="scss">
.van-popup {
    .MadePicktitle {
        height: 0.88rem;
        background: #EEEEEE;
        display: flex;
        display: -webkit-box;
        /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;
        /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;
        /* 混合版本语法: IE 10 */
        display: -webkit-flex;
        position: relative;
        line-height: 0.88rem;
        font-size: 0.28rem;
        .item {
            width: 2.2rem;
            margin-right: 0.3rem;
            margin-left: 0.24rem;
        }
        .MadePickComfirm {
            font-size: 0.28rem;
            color: #4BA8FF;
            position: absolute;
            right: 0.24rem;
            line-height: 0.88rem;
        }
        .MadePickLine {
            position: absolute;
            bottom: 0;
            height: 0.02rem;
            width: 2.2rem;
            background: #666666;
            left: 0.22rem;
            transition: 0.5s;
        }
    }
}
</style>
