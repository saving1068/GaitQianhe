<template>
<div class="Comment" style="min-height: 100%;background:#FFF;">
  <div  style="position: relative;top: 0;width: 100%;-webkit-overflow-scrolling: touch;z-index: 10;padding-bottom: 1rem;box-sizing: border-box;">
    <div class="topBox">
      <!--头部-->
      <img :src="list.imagePath" class="background" />
      <div class="content">
        <!--头部内容-->
        <div class="title" style="text-align: center;">
          {{list.title}}
        </div>
        <div class="mid">
          <div class="line" style="margin-right: 0.35rem;">

          </div>
          <span>{{list.sites}}</span>
          <div class="line" style="margin-left: 0.35rem;">

          </div>
        </div>
        <div class="avatar" @click="go('OtherPage')">
          <img :src="list.authorImage" />

        </div>
        <p style="text-align: center;font-size: 0.22rem;color: #CCCCCC;margin-top: 0.2rem;">{{list.authorName}}</p>

      </div>
    </div>

    <div class="titleBox">
      <!--问答标题-->
      <div class="icon"></div>
      <p>{{name}}</p>
    </div>
    <mu-load-more  :loading="false" @load="load" :loaded-all="all" v-if="answerList.length>0">
      <!--回答列表-->
      <div class="item" v-for="(item,index) in answerList" :key="item.id">
        <div class="topBox">
          <div class="avatar">
            <img :src="item.imagePath" />
          </div>
          <span style="margin-left: 0.11rem;">{{item.name}}</span>
          <span style="float: right;">{{item.date}}</span>
        </div>
        <div class="text_content">{{item.content}}</div>
        <div :class="['useBtn',item.isPraise==1?'active':'']" v-if="item.userfulNum>0" @click="userful(item.id,item.isPraise,index)">有用 {{item.userfulNum}}</div>
        <div :class="['useBtn',item.isPraise==1?'active':'']" v-if="item.userfulNum==0" @click="userful(item.id,item.isPraise,index)">有用</div>
      </div>


      <div v-show="loading" class="loading">
        <!--加载动画-->
        <div class="mid">
          <i></i>
          <span>正在加载更多...</span>
        </div>
      </div>
    </mu-load-more>
    <div class="end" v-if="all&&answerList.length>0">
      <!--加载结束-->
      <div class="line" style="margin-right: 0.2rem;"></div>
      <span>你看到我的底线了</span>
      <div class="line" style="margin-left: 0.2rem;"></div>
    </div>
    <div class="bottom_box" v-if="all&&answerList.length==0">
      <div class="noData" >
        <!--无任何回答-->
        <div></div>
        <p>暂无回答内容</p>
      </div>
    </div>

  </div>


  <div class="seachBox" >
    <!--搜索框-->
    <div class="box">
      <input type="text" ref="input" v-model="sendInput" placeholder="回答内容~(10~200字)" @focus="onFocus" @blur="onBlur"  @input="changeInput"/>

    </div>
    <div :class="[sendInput.length>0?'active':'','btn']" @click="sendData">
      回答
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
  data() {
    return {
      name:this.$route.query.name, //回答标题
      id: this.$route.query.id,//游记id
      list: {},//游记列表
      answerList: [],//回答列表
      sendInput: "",//回答内容
      pa: 1,//分页 页数
      li: 10,//每页显示的数量
      loading: true,//显示加载动画
      all: true, //是否加载完成
      flag: false, //控制点赞状态
      scrollTop:0,  //记录高度
      loadFlag:false //加载状态
    }
  },
  created() {
    this.getData() //获取游记标题 背景

  },
  mounted() {
  this.getAnswer() //获取回答列表
  },
  methods: {
    load() {
        if(this.loadFlag){
          return ;
        }
        this.loadFlag=true
      this.loading = true //显示加载动画
      if(!this.all){
        this.getAnswer() //获取回答列表
      }

    },
    changeInput(){
      this.sendInput=this.sendInput.substring(0, 200)//控制回答内容在200字以内

    },
    go(text) {
      if (text == "OtherPage") {  //跳转 其他个人主页页面
        this.$router.push({
          name: text,
          query: {
            id: this.list.userId  // 传userId
          }
        })
      }



    },

    sendData() {  //发送 回答内容
      let obj = {  //创建传送对象
        id: this.$route.query.answerId, //问题id
        a: 5,
        content: this.sendInput         //回答内容
      }

      if(this.$route.query.userId==this.$store.state.Home.user.id){ //用户id 跟 发游记的用户id一致时
        Toast({
          message: "提问者不能回答问题",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
         return;
      }

      if (this.sendInput.length == 0) {  //发送内容不能为空
        Toast({
          message: "请输入内容",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        return
      }

      if (this.sendInput.length > 0&&this.sendInput.length<10) {  //发送内容10个字以上
        Toast({
          message: "您的答案过于简短~",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        return
      }

      if (this.sendInput.length > 200) { //发送内容 10~200字
        Toast({
          message: "您的答案过长~",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        return
      }


      this.$Api.Home.QuestionSubmit(obj).then((res) => {   //请求接口
        if (res.q.s == 0) {
          this.sendInput = ""  //重置输入框
          this.$toast("回答成功", 'success'); //提示用户
          this.pa = 1 //重置页数
          this.answerList = [] //清空回答数组
          this.loading = true  //重新加载
          this.all = false     //重新加载
          this.getAnswer()    //重新加载
        }else{

          //提示错误
          Toast({
            message: res.q.d,
            forbidClick: true,
            position: 'center',
            duration: 2000
          });
        }
      })

    },

    userful(id, isPraise,index) {  //点赞
      let flag=false             //控制状态

      let obj = {          //点赞对象
        a: 3,
        id: id              //回答id

      }
      if (isPraise == 1) {   //改变状态
        obj.open = 0         //1为打开 0为关闭
      } else {
        obj.open = 1
      }
      if(!this.flag){
        flag=true
      }else{
        return               //点赞函数还没返回值时 控制不能再次点击
      }
      this.flag=true

        this.$Api.Home.PraiseSwitch(obj).then((res) => {
          if (res.q.s == 0) {

           this.flag=false      //点赞状态回到原来
           this.answerList[index].isPraise=obj.open  //改变回答数组里 点赞状态
           if(obj.open==1){
              this.answerList[index].userfulNum+=1    //改变回答数组里 点赞数量
           }else{
              this.answerList[index].userfulNum-=1    //改变回答数组里 点赞数量
           }

          }

        })




    },

    onFocus() {   //使输入框聚焦
       this.scrollTop=document.body.scrollTop  //记录当前位置
      setTimeout(()=>{
        document.body.scrollTop = document.body.scrollHeight;
      },300)
    },
    onBlur() {   //失去焦点 清空定时器

      setTimeout(()=>{
        document.body.scrollTop = this.scrollTop;  //滚到记录的位置
      },300)
    },
    getData() {   //获取游记信息

      this.$Api.Home.WbDetail({
        id: this.id
      }).then((res) => {
        console.log(res)
        this.list = { ...res.q.article
        }


      })
    },
    getAnswer() {  //获取游记列表
      let obj = {
        a: 0,
        id: this.$route.query.answerId,  //问题id
        pa: this.pa,
        li: 10
      }
      this.$Api.Home.QuestionDetails(obj).then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          if(res.q.answers.length>0){
            for (let i = 0; i < res.q.answers.length; i++) {
              let obj={...res.q.answers[i] }

  						if(obj.date.indexOf("分")!=-1){         //0分钟 转化成 刚刚
  						var index=	obj.date.indexOf("分")
  						var num=obj.date.substr(0,index)
  						console.log(num)
  						if(Number(num)<1){
  							obj.date="刚刚"
  						}

  						}


              this.answerList.push(obj)           //push进数组

            }

          }

         this.loadFlag=false
          this.pa++             //页数增加
          setTimeout(() => {

            if (res.q.answers.length < 10) {  //当小于10条
              this.loading = false       //加载消失
              this.all = true            //加载完毕

            }else{
                this.loading = true
                this.all = false
            }

          }, 500)

        }
      })
    }
  }

}
</script>

<style scoped="scoped" lang="scss">
.bottom_box {
    position: relative;
    height: 2rem;
    margin-top: 1.5rem;
    .noData {
        position: absolute;
        width: 2rem;
        height: 2rem;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        div {
            width: 1.5rem;
            height: 1.5rem;
            background: url("../../assets/nocom.png") no-repeat;
            background-size: 100%;
            margin: auto;

        }
        p {

            width: 100%;

            font-size: 0.3rem;
            color: #CCCCCC;
            margin-top: 0.28rem;
            text-align: center;

        }

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
            background: url("../../assets/home/common_icon_Load@3x.png") no-repeat;
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

.item {
    border-bottom: 0.01rem solid #EDEDED;
    width: 7.02rem;
    margin: auto;
    padding: 0.4rem 0 0.32rem;
    position: relative;
    .topBox {
        height: 0.4rem;
        .avatar {
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 50%;
            float: left;
            img {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
            }
        }
        span {
            float: left;
            color: #999999;
            font-size: 0.22rem;
            line-height: 0.4rem;
        }
    }
    .text_content {
        margin-top: 0.25rem;
        font-size: 0.26rem;
        margin-bottom: 0.68rem;
        word-break:break-all;
    }
    .useBtn {
        position: absolute;
        right: 0;
        bottom: 0.32rem;
        width: 1.17rem;
        height: 0.46rem;
        border: 1px solid #999999;
        box-sizing: border-box;
        border-radius: 0.06rem;
        line-height: 0.46rem;
        font-size: 0.22rem;
        color: #999999;
        text-align: center;
    }
    .active {
        background: #FADC56;
        color: #1A1A1A;
        border: none;
    }
}

.titleBox {
    width: 100%;
    padding: 0.4rem 0.24rem;
    border-bottom: 0.01rem solid #CCCCCC;
    font-weight: bold;
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
    .icon {
        width: 0.26rem;
        height: 0.26rem;
        background: url("../../assets/home/common_img_questions@3x.png") no-repeat;
        background-size: 100%;
        position: relative;
        top: 0.03rem;
    }
    p {
        font-size: 0.26rem;
        width: 6.6rem;
        margin-left: 0.1rem;
        font-weight: bold;
    }
}

.topBox {

    position: relative;
    .background {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
    }
    .content {
        width: 100%;

        position: relative;
        min-height: 5rem;

        z-index: 2;
        background: rgba(0, 0, 0, 0.5);
        padding-top: 0.6rem;
        padding-bottom: 0.4rem;
        .bottom {
            position: absolute;
            bottom: 0.2rem;
            left: 3rem;
            display: flex;
            display: -webkit-box;
            /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box;
            /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox;
            /* 混合版本语法: IE 10 */
            display: -webkit-flex;
            /* 新版本语法: Chrome 21+ */
            color: #CCCCCC;
            font-size: 0.22rem;
            .date {
                width: 0.22rem;
                height: 0.22rem;
                background: url("../../assets/home/home_icon_calendar@3x.png") no-repeat;
                background-size: 100%;
            }
            .see {
                width: 0.28rem;
                height: 0.2rem;
                background: url("../../assets/home/home_icon_browse@3x.png") no-repeat;
                background-size: 100%;
                margin-left: 0.4rem;
                margin-right: 0.1rem;
            }
        }
        .music {
            width: 0.68rem;
            height: 0.68rem;
            background: #000000;
            border-radius: 50%;
            position: absolute;
            top: 0.23rem;
            right: 0.24rem;
            img {
                width: 60%;
                height: 60%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
        }
        .title {
            padding: 0 0.96rem;
            box-sizing: border-box;
            font-size: 0.38rem;
            color: #FFFFFF;
            font-weight: bold;
        }
        .mid {
            /*width: 2.7rem;*/
            margin: 0.45rem auto auto;
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

            .line {
                width: 0.3rem;
                height: 0.02rem;
                background: #FFFFFF;
                position: relative;
                top: 0.2rem;
            }
            span {
                color: #CCCCCC;
            }
        }
        .avatar {
            width: 1.2rem;
            height: 1.2rem;
            margin: auto;
            border-radius: 50%;
            margin-top: 0.4rem;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
}

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
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    -o-justify-content: center;
    justify-content: center;
    text-align: center;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    padding: 0 0.4rem;
    box-sizing: border-box;
    .line {
        width: 30%;
        height: 0.02rem;
        background: #CCCCCC;
        position: relative;
        top: 0.16rem;
    }
    span {
        // width: 2rem;
        color: #CCCCCC;
        font-size: 0.22rem;
    }
}

.seachBox {
    width: 100%;
    height: 0.98rem;
    background: #FFFFFF;
    border-top: 0.01rem solid #EDEDED;
    position: fixed;
    z-index: 9999;
    bottom: 0;
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    padding: 0.15rem 0.09rem;
    .box {
        width: 5.95rem;
        height: 0.67rem;
        background: #FFFFFF;
        border-radius: 34rem;
        border: 0.01rem solid #CCCCCC;
        padding: 0.1rem 0.22rem;
        box-sizing: border-box;
        input {
            width: 100%;
            height: 100%;
            border: none;
            font-size: 0.2rem;
        }
    }
    .btn {
        width: 1.16rem;
        height: 0.67rem;
        background: #CCCCCC;
        color: #FFFFFF;
        border-radius: 0.34rem;
        font-size: 0.22rem;
        margin-left: 0.15rem;
        text-align: center;
        line-height: 0.67rem;
    }
    .active {
        background: rgba(250, 220, 86, 1);
        color: #333333;
    }
}
</style>
