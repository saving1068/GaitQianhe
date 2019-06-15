<template>
<div>
  <p class="title">
    <em class="require">*</em> <span>反馈情况（多选）</span>
  </p>
  <div class="checkBox">
    <van-checkbox-group v-model="result">
      <van-checkbox v-for="(item, index) in list" :key="item.id" :name="item.id">
        {{ item.name }}
      </van-checkbox>
    </van-checkbox-group>
  </div>
  <div class="line">

  </div>
  <p class="title">
    <em class="require">*</em> <span>反馈内容</span>
  </p>
  <div class="textBox">
    <textarea placeholder="内容描述..." v-model="text" @focus="onFocus" @blur="onBlur" maxlength="400" >



		</textarea>

  </div>
  <div class="line">

  </div>
  <p class="title">
    <span>上传截图</span><span style="color:rgba(102,102,102,1);font-size:0.22rem;">（最多3张图，每张不超过2M）</span>
  </p>
  <div class="imgBox">
    <li class="item" v-for="(item,index) in imgList" v-if="len>0">
      <img :src="item.src" @click="showImg(item.src)" />
      <div class="icon" @click.stop="del(index)"></div>
    </li>

    <li class="add" @click="upload" v-if="len<3"></li>

  </div>
  <div id="whiteBox" :style="[{'height':show?height:focuseHeight}]"></div>
  <div class="bottom" :style="[{'position':show?'fixed':'static'}]" @click="submit">
    提交
  </div>

</div>
</template>

<script>
import {
  Toast
} from 'vant'
export default {
  data() {
    return {

      list: ['功能建议', '支付相关', '服务投诉'],
      result: [],
      show: true,
      height: "",
      text: "",
      focuseHeight: "",
      len: 0,
      imgList: [],
      imgIdList: [],
      uploadId: []
    }

  },
  created() {
    this.getData()

  },
  computed: {
    getConfig() {
      return this.$store.state.config

    }
  },
  watch: {
    getConfig(a) {
      if (JSON.stringify(this.$store.state.config) != "") {
        this.config()
      }
    }
  },
  mounted() {
    this.config()
    this.height = (document.body.clientHeight - document.getElementById("whiteBox").offsetTop) * 2 / 100 + 1.5 + 'rem'
    this.focuseHeight = (document.body.clientHeight - document.getElementById("whiteBox").offsetTop) * 2 / 100 - 1 + 1.5 + 'rem'

  },
  methods: {
    getData() {
      this.$Api.My.ReferenceItemList({
        key: "feebacktype"
      }).then((res) => {
        if (res.q.s == 0) {
          this.list = [...res.q.items]
        }

      })

    },
    isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    },
    submit() {

      if (this.result.length == 0) {
        Toast('请选择反馈情况');
        return;
      }
      if (this.isNull(this.text)) {
        Toast('请填写内容描述');
        return;
      }




      let obj = {
        content: this.text,
        typeIds: this.result.join(",")
      }
      if (this.uploadId.length > 0) {
        let arr = []
        for (let i = 0; i < this.uploadId.length; i++) {
          let newobj = {
            id: this.uploadId[i]
          }
          arr.push(newobj)
        }
        obj.images = [...arr]
      }

      this.$Api.My.FeedbackSubmit(obj).then((res) => {
        console.log(res)
        if (res.q.s == 0) {

          this.$toast("提交成功", "success")
          setTimeout(() => {
            this.$router.go(-1)

          }, 500)
        }

      })


    },
    showImg(src) {
      var that = this
      // alert(src)
      var arr = []
      arr.push(src);
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      });

    },
    del(index) {
      this.imgList.splice(index, 1)
      this.len = this.imgList.length
      this.uploadId.splice(index, 1)
    },
    onFocus() {
      this.show = false
    },
    onBlur() {
      setTimeout(() => {
        this.show = true

      }, 20)

    },
    config() {
      let that = this
      if (JSON.stringify(this.$store.state.config) != "") {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: that.$store.state.config.appId, // 必填，公众号的唯一标识
          timestamp: that.$store.state.config.timestamp, // 必填，生成签名的时间戳
          nonceStr: that.$store.state.config.nonceStr, // 必填，生成签名的随机串
          signature: that.$store.state.config.signature, // 必填，签名
          jsApiList: ["chooseImage", "previewImage", "getLocalImgData", "uploadImage"] // 必填，需要使用的JS接口列表
        });
      }
    },
    upload() {
      let that = this;
      this.imgIdList = [];

      wx.chooseImage({
        count: 3 - that.len, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

          that.uploaddata(localIds, localIds.length)

        }

      });

    },
    async uploaddata(arr, length) {
      var localId = arr.shift();
      var that = this
      this.$loading('上传中...')

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
                that.uploadId = that.uploadId.concat(response.q.ids)
                for (var i = 0; i < response.q.files.length; i++) {
                  let obj = {
                    src: response.q.files[i].path
                  }
                  that.imgList.push(obj)

                }
                that.len = that.imgList.length
                setTimeout(() => {
                  that.$loading.clear()
                }, 500)

              }

            })

            //销毁数据

          }
          //其他对serverId做处理的代码
          if (arr.length > 0) {
            that.uploaddata(arr, length);
          }

        },
        error: function() {
          alert("asasasas");
        }
      });

    }
  }

}
</script>

<style scoped="scoped" lang="scss">
.title {
    position: static;
    padding-left: 0.24rem;
    padding-top: 0.4rem;
    margin-bottom: 0.35rem;
    .require {
        font-size: 0.36rem;
        position: relative;
        top: 0.06rem;
        color: #FA372D;
    }
    span {
        font-size: 0.28rem;
    }
}

.line {
    height: 0.16rem;
    background: rgba(237, 237, 237, 1);
}

.textBox {
    width: 7.00rem;
    height: 2.1rem;
    border: 0.01rem solid #999999;
    margin: 0.2rem auto 0.4rem;
    padding: 0.2rem;
    box-sizing: border-box;
    textarea {
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
        font-size: 0.24rem;
    }
}

.imgBox {
    padding: 0 0.24rem;
    box-sizing: border-box;
    display: -webkit-box;
    /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;
    /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;
    /* 混合版本语法: IE 10 */
    display: -webkit-flex;
    /* 新版本语法: Chrome 21+ */
    display: flex;
    list-style: none;
    -webkit-flex-wrap: wrap;
    -webkit-box-lines: multiple;
    -moz-flex-wrap: wrap;
    flex-wrap: wrap;
    li {
        width: 2rem;
        height: 2rem;
        margin-right: 0.2rem;
        position: relative;
        .icon {
            width: 0.4rem;
            height: 0.4rem;
            right: 0;
            top: 0;
            position: absolute;
            background: url("../../assets/common_btn_close4@3x.png") no-repeat;
            background-size: 100%;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .add {
        background: url("../../assets/common_btn_add@3x.png") no-repeat;
        background-size: 100%;
    }
}

.bottom {
    width: 100%;
    left: 0;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    position: fixed;
    bottom: 0;
    background: rgba(250, 220, 86, 1);
}
</style>
<style lang="scss">
.checkBox {
    padding-left: 0.24rem;
    .van-checkbox {
        margin-bottom: 0.3rem;
        line-height: 0.44rem;
    }
    span {
        font-size: 0.28rem;
    }
    .van-checkbox__icon {
        position: relative;
    }
    .van-checkbox__icon--checked {
        .van-icon {
            border-color: #F6323E;
            background-color: #F6323E;
        }
    }
}
</style>
