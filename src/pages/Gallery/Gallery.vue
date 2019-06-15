<template>
<div style="min-height: 100vh;position:relative;">
  <!-- tabbar -->
  <div class="tab">
    <div :class="['item',activeIndex==0?'active':'']" @click="change(0)">图片</div>
    <div :class="['item',activeIndex==1?'active':'']" @click="change(1)">视频</div>
    <div class="line" :style="linStyle"></div>
  </div>
  <div class="warp" style="padding-top: 0.9rem;" v-if="activeIndex==0">
    <!-- 图片内容 -->
    <vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="getData" ref="waterfall" @click="clickFn" v-show="imgsArr.length>0">
      <div slot="loading" slot-scope="{isFirstLoad}">
        <div slot="loading" v-if="isFirstLoad"></div>
        <div v-else="v-else"></div>
      </div>
      <div slot="waterfall-over">已无更多数据</div>
    </vue-waterfall-easy>
    <!-- 无图片内容时 -->
    <div class="nodata" v-if="imgsArr.length==0">
      <div class="icon"></div>
      <p>暂无图片</p>
    </div>
  </div>
  <div class="videoBox" style="padding-top: 0.9rem;-overflow-scrolling: touch;" v-if="activeIndex==1">
    <!-- 视频内容 -->
    <van-list class="iscrollBox" style="min-height:100%;" @load="load" :finished="all" v-if="videosArr.length>0">

      <van-cell class="item" v-for="(item,index) in videosArr" :key="item.id">

        <video class="video_content" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" x-webkit-airplay="true" webkit-playsinline="true" playsinline="true" :src="item.src" preload="auto" @ended="videoEnd(index)"
          @canplaythrough="canplay(index)">

        </video>
        <div class="stop" v-if="item.videoFlag" @click="stop(index)">
          <i></i>
        </div>
        <div class="full" v-if="item.videoFlag" @click="fullScreen(index)">
          <i></i>

        </div>
        <div class="mask" v-if="item.videoFlag==false" @click="playVideo(index)">
          <i></i>
          <span>{{item.videoDuration}}</span>
        </div>

      </van-cell>



    </van-list>
    <!-- 无更多数据 -->
    <div class="end" v-if="all&&videosArr.length>0" style="text-align:center;">
      已无更多数据

    </div>
    <!-- 无任何视频内容 -->
    <div class="nodata" v-if="videosArr.length==0">
      <div class="icon"></div>
      <p>暂无视频</p>
    </div>

  </div>
  <!-- 上传按钮 -->
  <div class="appen" @click="appenVal"></div>
  <div class="appen_box" :style="appen_box_active">
    <!-- 图片 -->
    <div class="appen_image left" @click="successImage">

    </div>
    <!-- 视频 -->
    <div class="appen_image ">
      <input type="file" accept="video/*" id="files" @change="successVideo">
    </div>
  </div>
  <!-- 用于获取时长的隐藏视频 -->
  <video id="upload" x-webkit-airplay="true" x5-playsinline="true" webkit-playsinline="true" playsinline="true" ref="indentVideo" :src="uploadSrc" controls="controls" preload="auto" @canplaythrough="uploadVideo">

    您的浏览器不支持 video 标签。
  </video>
  <!-- 当为分享页面时 出现悬浮 -->
  <div class="goHome" v-if="isShare" @click="goHome">
    <div></div>
    <p>首页</p>
  </div>
</div>
</template>

<script>
//瀑布流插件
import vueWaterfallEasy from 'vue-waterfall-easy'
import {
  Toast
} from 'vant'
export default {
  created() {
    //当为分享 悬浮就出现
    if (window.sessionStorage.getItem("shareId")) {

      this.isShare = true
    }

    this.getData() //获取数据

  },
  mounted() {
    this.config() //注入wx config

  },
  components: {
    vueWaterfallEasy
  },

  data() {
    return {
      imgsArr: [], //图片数组
      videosArr: [], //视频数组
      pa: 1, //页数
      up: false, //控制 上传按钮是否出现
      imgIdList: [], //上传图片id 数组
      isFirstLoad: true, //第一次出现
      uploadSrc: "", //判断时长的视频链接
      timer: null, //定时器
      activeIndex: 0, //tabbar 下标
      videoObj: {}, //上传视频的 视频对象
      all: true, //视频是否加载完成
      loadFlag: true, //控制加载
      isShare: false //控制悬浮

    }
  },
  methods: {
    goHome() { //悬浮按钮跳转首页

      window.sessionStorage.removeItem("shareId")
      this.$router.push({
        name: "Home"
      })

    },
    stop(i) { //视频停止

      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media
      this.videosArr[i].videoFlag = false;
      video.pause()
    },
    videoEnd(i) { //视频播放完成
      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media
      this.videosArr[i].videoFlag = false;

    },
    playVideo(i) { //视频播放
      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media
      let that = this
      for (let j = 0; j < this.videosArr.length; j++) {
        this.videosArr[j].videoFlag = false;
        if (i != j) {
          this.loadVideo(j)
        }

      }

      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
          video.play();
          that.videosArr[i].videoFlag = true;
        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", function() {
          WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
            video.play();
            that.videosArr[i].videoFlag = true;
          });
        }, false);
      }
      //视频全屏
      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
          video.webkitEnterFullscreen()

        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", function() {
          WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
            video.webkitEnterFullscreen()

          });
        }, false);
      }

      return false;

    },
    fullScreen(i) { //视频全屏
      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media

      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
          video.webkitEnterFullscreen()

        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", function() {
          WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
            video.webkitEnterFullscreen()

          });
        }, false);
      }

    },

    loadVideo(i) { //视频加载

      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media
      let that = this
      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
          if (that.videosArr[i].loadFlag == false) {
            video.load();
            that.videosArr[i].loadFlag = true
          }



        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", function() {
          WeixinJSBridge.invoke('getNetworkType', {}, function(e) {

            if (that.videosArr[i].loadFlag == false) {
              video.load();

              that.videosArr[i].loadFlag = true
            }



          });
        }, false);
      }
      video.load();

      return false;

    },
    canplay(i) { //判断ios 是否可以播放
      let video = document.getElementsByClassName("video_content")[i]; //video标签id=media
      console.log(video.duration)
      let all = Math.floor(video.duration) //获取时长
      let second = "";
      if (all % 60 < 10) {
        second = "0" + all % 60

      } else {
        second = all % 60
      }
      this.videosArr[i].videoDuration = Math.floor(all / 60) + ":" + second;
    },

    load() { //加载数据
      this.getData()



    },
    refresh() {

    },
    change(num) { //改变tabbar
      this.activeIndex = num

      this.pa = 1;
      this.all = true
      this.imgsArr = []
      this.videosArr = []
      this.getData()

    },
    clickFn(event, {  //瀑布流点击
      index,
      value
    }) {
      event.preventDefault()
      var that = this
      var arr = []
      arr.push(value.src);
      wx.previewImage({         //调用微信放大图片
        current: value.src, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      });
    },
    successVideo(e) {   //上传视频
      console.log(e)
      if (e.target.files[0].size > 10860000) {
        Toast({
          message: "视频过大,请重新选择",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        return;
      }
      let that = this;
      let myVideo = document.getElementById("upload")
      this.videoObj = e.target.files[0]
      var url = URL.createObjectURL(e.target.files[0]);
      myVideo.src = url;
      this.autoPlayAudio("upload")

    },
    uploadVideo() {      //上传视频
      let v = document.getElementById("upload")
      console.log(v.duration)
      if (v.duration > 180) {

        Toast({
          message: "请上传小于180秒的视频",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });
        return;
      }

      this.sendData()

    },
    sendData() {
      var that = this

      let imgData;
      var obj = {
        a: 1,
        type: 2,
        filename: this.videoObj.name
      }

      this.$Api.Common.GetExternalUploadObject(obj).then((res) => {

        if (res.q.s == 0) {
          console.log(res.q.cos, 1321)
          //						this.cos = res.q.cos
          let urlObj = {
            accessUrl: res.q.cos.accessUrl,
            sourceUrl: res.q.cos.sourceUrl
          }

          //上传图片到腾讯云
          this.$upLoadToCos(res.q.cos.url, this.videoObj)
          this.getExternalFilesSubmit(urlObj, obj.type, "cover")

        }

      })

    },
    getExternalFilesSubmit(urlObj, type) {
      //				console.log(urlObj)
      let fileInfos = []
      let that = this;
      fileInfos.push(urlObj)
      let obj = {
        a: 1,
        type: type,
        fileInfos: fileInfos
      }
      this.$Api.Common.ExternalFilesSubmit(obj).then((res) => {

        if (res.q.s == 0) {

          let files = [];
          console.log(files)
          for (let i = 0; i < res.q.files.length; i++) {
            let videoObj = {
              fileId: res.q.files[i].id,
              type: 2,
              cityId: this.$route.query.id
            }
            files.push(videoObj)

          }

          console.log(files)
          this.$Api.Home.saveCityGallery(files).then((request) => {

            if (request.q.s == 0) {
              this.$toast("上传成功", 'success')
              that.pa = 1
              // that.imgsArr = []
              that.videosArr = []

              setTimeout(() => {
                document.getElementById("files").value = null
                that.getData()
              }, 500)
              console.log(request)


            }

          })

        }

      })

    },
    autoPlayAudio(id) {
      var video = document.getElementById(id); //video标签id=media

      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
          video.load();
          video.play();
          video.pause();
        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", function() {
          WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
            video.load();
            video.play();
            video.pause();
          });
        }, false);
      }
      video.load();

      return false;
    },

    config() {
      let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=Gallery&shareId=" + this.$store.state.Home.user.id + "&id=" + this.$route.query.id + "&city=" + this.$route.query.city;
      url = encodeURI(encodeURI(url));


      let that = this;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
        timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
        signature: this.$store.state.config.signature, // 必填，签名
        jsApiList: ["chooseImage", "previewImage", "getLocalImgData", "uploadImage", "updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
      });
      wx.ready(function() { //需在用户可能点击分享按钮前就先调用
        if (wx.onMenuShareAppMessage) {
          wx.onMenuShareAppMessage({
            title: that.$route.query.city + "相册图库", // 分享标题
            desc: '步履千行', // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {


              // 用户点击了分享后执行的回调函数
            }
          })
        } else {
          wx.updateAppMessageShareData({
            title: that.$route.query.city + "相册图库", // 分享标题
            desc: '步履千行', // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://d.aiitec.org/GaitQianhe-h5/static/img/logo@3x.png', // 分享图标
            success: function(res) {
              console.log(res)
              // 设置成功
            }
          });
        }





      });
    },

    getData() {
      let obj = {
        a: 1,
        type: this.activeIndex + 1,
        regionId: this.$route.query.id,
        pa: this.pa,
        li: 10
      }
      this.$loading("加载中")
      this.$Api.Home.CityGallery(obj).then((res) => {
        console.log(res)
        if (res.q.s == 0) {
          let arr = []
          for (let i = 0; i < res.q.list.length; i++) {
            let obj = {
              src: res.q.list[i].accessUrl,
              videoFlag: false,
              videoDuration: "",
              loadFlag: false
            }

            arr.push(obj)
          }
          if (this.activeIndex == 0) {
            this.imgsArr = this.imgsArr.concat(arr)
          } else {
            this.videosArr = this.videosArr.concat(arr)
            this.loadFlag = true
            this.$nextTick(() => {
              for (let i = 0; i < this.videosArr.length; i++) {
                this.loadVideo(i)
              }

            })
            if (arr.length < 10) {
              this.loadFlag = false
            }
          }

          this.pa++

          setTimeout(() => {
            this.$loading.clear()
            if (arr.length < 10) {
              if (this.activeIndex == 0) {
                if (this.imgsArr.length > 0) {
                  setTimeout(() => {
                    this.$refs.waterfall.waterfallOver()
                  }, 2000)
                }
              } else {
                this.all = true
              }

            } else {
              if (this.activeIndex == 1) {
                this.all = false
              }

            }

          }, 500)

        }

      })

    },
    appenVal() {
      this.up = !this.up

    },
    successImage() {
      let that = this;
      this.imgIdList = [];
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          that.upload(localIds, localIds.length)

        }

      });

    },
    async upload(arr, length) {
      var localId = arr.shift();
      var that = this
      this.$loading("上传中...")

      wx.uploadImage({
        localId: localId,
        isShowProgressTips: 0,
        success: function(res) {
          console.log(res)
          that.imgIdList.push(res.serverId); // 返回图片的服务器端ID

          if (length == that.imgIdList.length) {
            var imgObj = {
              "ids": that.imgIdList.join(",")
            }
            that.$Api.Common.SaveWxwebImages(imgObj).then((response) => {
              //					alert(res)
              console.log(response)
              if (response.q.s == 0) {
                let files = []
                for (let i = 0; i < response.q.files.length; i++) {
                  let obj = {
                    fileId: response.q.files[i].id,
                    type: 1,
                    cityId: that.$route.query.id
                  }
                  files.push(obj)

                }

                that.$Api.Home.saveCityGallery(files).then((request) => {

                  if (request.q.s == 0) {
                    that.$toast("上传成功", 'success')
                    that.pa = 1
                    that.imgsArr = []

                    if (that.activeIndex == 0) {
                      that.$refs.waterfall.reset()
                      that.getData()
                    }

                    setTimeout(() => {
                      that.$loading.clear()
                    }, 500)

                  }

                })

              }

            })

            //销毁数据

          }
          //其他对serverId做处理的代码
          if (arr.length > 0) {
            that.upload(arr, length);
          }

        },
        error: function() {
          alert("asasasas");
        }
      });

    },

  },
  computed: {
    appen_box_active() {
      if (this.up) {
        return "bottom:1.9rem"
      } else {
        return "bottom:-1.5rem"
      }
    },
    linStyle() {
      if (this.activeIndex == 0) {
        return {
          'left': '1.53rem'
        }
      } else {
        return {
          'left': '5.31rem'
        }

      }
    }
  }

}
</script>

<style scoped="scoped" lang="scss">
.end {
    float: left;

    width: 100%;
}
.goHome {
    width: 1rem;
    height: 1rem;
    position: fixed;
    left: 0.3rem;
    bottom: 2.54rem;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    z-index: 9999;
    div {
        margin: 0.2rem auto auto;
        width: 0.12rem;
        height: 0.22rem;
        background: url("../../assets/location_btn_array@2x.png") no-repeat;
        transform: rotate(90deg);
        background-size: 100% 100%;

    }
    p {
        text-align: center;
        color: #ffffff;
        font-size: 0.24rem;

        width: 100%;
    }
}
.tab {
    height: 0.9rem;
    background: #FFF;
    position: relative;
    z-index: 33;
    display: flex;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    .item {
        width: 50%;
        line-height: 0.9rem;
        font-size: 0.3rem;
        color: #CCCCCC;
        text-align: center;
    }
    .active {
        color: #FADC56;
    }
    .line {
        width: 0.6rem;
        height: 0.02rem;
        background: #FADC56;
        position: absolute;
        top: 0.76rem;
        transition: 0.5s;
    }
}

.warp {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    left: 0;
    z-index: 1;
    .nodata {
        position: fixed;
        width: 2.8rem;
        height: 3.6rem;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        .icon {
            width: 2.8rem;
            height: 2.8rem;
            background: url("../../assets/common/location_icon_pic@3x.png");
            margin: auto;
            background-size: 100%;
        }
        p {
            margin-top: 0.4rem;
            text-align: center;
            font-size: 0.3rem;
            color: #999999;
        }
    }
}

.videoBox {
    position: absolute;
    top: 0;
    width: 100%;
    overflow-y: scroll;
    height: 100vh;
    -webkit-overflow-scrolling: touch;
    z-index: 90;
    box-sizing: border-box;
    left: 0;
    z-index: 1;
    padding: 0 0.24rem;
    .nodata {
        position: fixed;
        width: 2.8rem;
        height: 3.6rem;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        .icon {
            width: 2.8rem;
            height: 2.8rem;
            background: url("../../assets/common/location_icon_video@3x.png");
            margin: auto;
            background-size: 100%;
        }
        p {
            margin-top: 0.4rem;
            text-align: center;
            font-size: 0.3rem;
            color: #999999;
        }
    }
    .item {
        width: 3.46rem;
        height: 2.22rem;
        position: relative;
        z-index: 20;
        float: left;
        background: black;
        margin-bottom: 0.1rem;
        position: relative;
        .stop {
            position: absolute;
            left: 0.1rem;
            bottom: 0.1rem;
            width: 0.45rem;
            height: 0.45rem;
            background: rgba(0, 0, 0, 0.3);
            i {
                width: 0.2rem;
                height: 0.26rem;
                background: url("../../assets/common/common_btn_suspend@3x.png") no-repeat;
                background-size: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
        }
        .full {
            position: absolute;
            bottom: 0.1rem;
            right: 0.1rem;
            width: 0.45rem;
            height: 0.45rem;
            background: rgba(0, 0, 0, 0.3);
            i {
                width: 0.3rem;
                height: 0.3rem;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                background: url("../../assets/common/common_btn_full@3x.png") no-repeat;
                background-size: 100%;
            }
        }
        .mask {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
            i {
                width: 0.22rem;
                height: 0.26rem;
                background: url("../../assets/common/common_btn_play@3x.png") no-repeat;
                background-size: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;

            }
            span {
                position: absolute;
                bottom: 0.1rem;
                right: 0.1rem;
                color: #ffffff;
                font-size: 0.26rem;
            }
        }
        video {
            width: 100%;
            height: 100%;
        }
    }
    .item:nth-child(2n) {
        margin-left: 0.1rem;
    }
}

#upload {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -200;
    opacity: 0;
}

.appen_image {
    width: 1.32rem;
    height: 1.32rem;
    position: absolute;
    /*position: fixed;*/
    right: 1.35rem;
    /*bottom: 1.89rem;*/

    background: url("../../assets/location_btn_video@2x.png") no-repeat;
    background-size: 100% 100%;
    input {
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}

.left {
    position: absolute;
    left: 1.35rem;
    background: url("../../assets/location_btn_pic@2x.png") no-repeat;
    background-size: 100% 100%;
}

.appen_box_active {
    bottom: 1.9rem !important;
}

.appen_box {
    width: 100%;
    height: 1.32rem;
    position: fixed;
    left: 0;
    bottom: -1.5rem;
    background: transparent;
    transition: 1s all;
    z-index: 999;
}

.appen {
    width: 1rem;
    height: 1rem;
    position: fixed;
    right: 3.25rem;
    bottom: 0.4rem;
    z-index: 999;
    background: url("../../assets/location_btn_add@2x.png") no-repeat;
    background-size: 100% 100%;
}
</style>
