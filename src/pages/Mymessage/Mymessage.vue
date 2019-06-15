<template>
<div>
  <div class="top">

    <div class="avatar" @click="changeAvatar">
      <img :src="user.imagePath" />
    </div>
    <p @click="changeAvatar">点击修改头像</p>

  </div>
  <div class="box">
    <div class="cell">
      <div class="title">名字</div>
      <input type="text" placeholder="请输入您的昵称" v-model="user.name" />
      <!--<i class="rightIcon"></i>-->
    </div>

    <div class="cell">
      <div class="title">性别</div>
      <div class="right">
        <div class="cellItem" @click="change(1)"><i :class="[user.sex==1?'active':'']"></i><span>男</span></div>
        <div class="cellItem" @click="change(2)" style="margin-left: 0.74rem;"><i :class="[user.sex==2?'active':'']"></i><span>女</span></div>
      </div>
      <!--<i class="rightIcon"></i>-->
    </div>
    <div class="cell" @click="showAge">
      <div class="title">年龄</div>
      <input type="tel" v-model="user.birthday" placeholder="请选择您的年龄" disabled="disabled" />
      <i class="rightIcon"></i>
    </div>
    <div class="cell" style="padding: 0;display: block;float: left;min-height: 0.98rem;width: 100%;" @click="focus">
      <div class="title" style="float: left;line-height: 0.98rem;">简介</div>
      <div id="text" class="test-textarea" contenteditable="plaintext-only" placeholder="(200字以内)" @input="getInput" @blur="blur" @click="focusText">{{user.sign}}</div>
      <!--<i class="rightIcon"></i>-->
    </div>
    <div class="cell" @click="showAreaBox">
      <div class="title">地区</div>
      <input type="text" disabled="disabled" placeholder="请选择您所在的地区" v-if="user.regionInfo.length!=3||!user.regionInfo" />
      <div class="right" v-if="user.regionInfo.length==3">
        <span style="margin: 0;">{{user.regionInfo[0].name}}</span><span>{{user.regionInfo[1].name}}</span><span>{{user.regionInfo[2].name}}</span>
      </div>
      <i class="rightIcon"></i>
    </div>

  </div>
  <div id="whiteBox" :style="[{'height':showBtn?height:focuseHeight}]"></div>
  <div class="bottom_btn" :style="[{'position':showBtn?'fixed':'static'}]" @click="save">保存</div>

  <van-popup v-model="show" position="bottom" :overlay="true" :close-on-click-overlay="true">
    <van-picker :columns="columns" show-toolbar @cancel="show=false" @confirm="onConfirm" />
  </van-popup>
  <van-popup v-model="showArea" position="bottom" :overlay="true" :close-on-click-overlay="true">
    <div class="address_box">
      <div class="title_box">
        所在地区
        <i @click="showArea=false"></i>
      </div>
      <div class="address_tab">
        <div :class="[addressActive==0?'active':'', 'item']" @click="changeAddress(0)">{{firstAddress.name?firstAddress.name:'请选择'}}</div>
        <div :class="[addressActive==1?'active':'', 'item']" v-show="firstAddress.name&&secondList.length>0" @click="changeAddress(1)">{{secondAddress.name?secondAddress.name:'请选择'}}</div>
        <div :class="[addressActive==2?'active':'', 'item']" v-show="secondAddress.name&&thirdList.length>0" @click="changeAddress(2)">{{thirdAddress.name?thirdAddress.name:'请选择'}}</div>
      </div>
      <div class="addressBox" v-show="addressActive==0">
        <div class="item" v-for="(item,index) in firstList" @click="selectAddress(index,item,'firstList','firstAddress',0)">
          <span :class="[item.flag?'active':'']">{{item.name}}</span>
          <i v-if="item.flag"></i>
        </div>

      </div>
      <div class="addressBox" v-show="addressActive==1">
        <div class="item" v-for="(item,index) in secondList" @click="selectAddress(index,item,'secondList','secondAddress',1)">
          <span :class="[item.flag?'active':'']">{{item.name}}</span>
          <i v-if="item.flag"></i>
        </div>

      </div>
      <div class="addressBox" v-show="addressActive==2">
        <div class="item" v-for="(item,index) in thirdList" @click="selectAddress(index,item,'thirdList','thirdAddress',2)">
          <span :class="[item.flag?'active':'']">{{item.name}}</span>
          <i v-if="item.flag"></i>
        </div>

      </div>
    </div>
  </van-popup>

</div>
</template>

<script>
import {
  Toast
} from 'vant'
export default {
  data() {
    return {
      columns: [{
        values: [],
        defaultIndex: 18 - 1

      }],
      show: false,
      showArea: false,
      user: {
        regionInfo: []
      },
      //				areaList:this.$cityData,
      active: 0,
      imgList: [],
      imgIdList: [],
      height: "",
      focuseHeight: "",
      avatar: "",
      showBtn: true,
      addressActive: 0,
      firstList: [],
      secondList: [],
      thirdList: [],
      firstAddress: {},
      secondAddress: {},
      thirdAddress: {},
      placeText: ""
    }

  },
  computed:{
    getUserInfo(){
      return this.$store.state.Home.user
    }
  },
  watch:{
      getUserInfo(a){
        if(Object.keys(a).length!=0){
          this.user = { ...this.$store.state.Home.user
          }
          if (this.user.regionInfo.length < 3) {
            console.log(this.user.regionInfo)
            let len = this.user.regionInfo.length;
            for (let i = 0; i < 3 - len; i++) {
              let obj = {
                name: ""
              }
              this.user.regionInfo.push(obj)
            }

          }

          this.getAddress({
            a: 1,
            id: 0
          })

        }
      }
  },
  created() {

    if (Object.keys(this.$store.state.Home.user).length === 0) {
      this.getData()
    } else {
      this.user = { ...this.$store.state.Home.user
      }
      if (this.user.regionInfo.length < 3) {
        console.log(this.user.regionInfo)
        let len = this.user.regionInfo.length;
        for (let i = 0; i < 3 - len; i++) {
          let obj = {
            name: ""
          }
          this.user.regionInfo.push(obj)
        }

      }

      this.getAddress({
        a: 1,
        id: 0
      })


    }





    //			this.sendData()
  },

  mounted() {

    for (var k = 1900; k < 2018; k++) {
      var obj = {
        text: 2018 - k

      }

      this.columns[0].values.push(2018 - k)

    }
    this.columns[0].values = [...this.columns[0].values.reverse()]
    setTimeout(() => {
      this.height = (document.body.clientHeight - document.getElementById("whiteBox").offsetTop) * 2 / 100 + 'rem'
      this.focuseHeight = (document.body.clientHeight - document.getElementById("whiteBox").offsetTop) * 2 / 100 - 1 + 'rem'

    })
  },
  methods: {
   getInput(){

     document.getElementById("text").innerText=document.getElementById("text").innerText.substr(0,200)
      this.keepLastIndex()
   },

    save() {
      let obj = { ...this.user
      }
      if(this.isNull(obj.name)){
        Toast({
          message: "名字不能为空",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });

				return ;
			}
      if(obj.name.length>10){
        Toast({
          message: "名字长度过长",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });

				return ;

			}
      obj.sign = document.getElementById("text").innerText
      if(obj.sign.length>200){
        Toast({
          message: "简介超出字数",
          forbidClick: true,
          position: 'center',
          duration: 2000
        });

				return ;
			}

      this.$Api.My.UserUpdate({
        user: obj
      }).then((res) => {
        console.log(res)
        if (res.q.s == 0) {

          this.$toast("保存成功", "success")
          this.getData()
          setTimeout(() => {
            this.$router.go(-1)

          }, 800)
        }

      })

    },
    isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    },

    keepLastIndex() {
      console.log(obj)
      let obj = document.getElementsByClassName("test-textarea")[0]
      console.log(window.getSelection)
      console.log(document.selection)
      if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后            range.select();
      }
    },
    focusText() {
      this.showBtn = false
      this.keepLastIndex()


      let scroll = document.getElementsByClassName("cell")[3].offsetTop / 2
      window.scrollTo(0, scroll)

    },
    getAddress(obj) {
      this.$Api.UserPage.RegionList(obj).then((res) => {
        if (res.q.s == 0) {
          let arr = []
          for (let i = 0; i < res.q.items.length; i++) {

            let addressObj = { ...res.q.items[i]
            }
            addressObj.flag = false
            arr.push(addressObj)
          }

          this.firstList = [...arr];
          if (this.user.regionInfo[0].name != "") {

            for (let i = 0; i < this.firstList.length; i++) {
              if (this.user.regionInfo[0].name == this.firstList[i].name) {
                this.firstList[i].flag = true
                this.firstAddress.name = this.firstList[i].name
                this.firstAddress.id = this.firstList[i].id
              }

            }
          }
          if (this.user.regionInfo[0].id) {
            this.getSecond()
          }

        }

      })

    },
    getSecond() {
      let obj = {
        a: 2,
        id: this.user.regionInfo[0].id
      }
      this.$Api.UserPage.RegionList(obj).then((res) => {
        if (res.q.s == 0) {
          let arr = []
          for (let i = 0; i < res.q.items.length; i++) {

            let addressObj = { ...res.q.items[i]
            }
            addressObj.flag = false
            if (addressObj.name == this.user.regionInfo[1].name) {
              addressObj.flag = true
              this.secondAddress.name = addressObj.name
              this.secondAddress.id = addressObj.id
            }

            arr.push(addressObj)
          }

          this.secondList = [...arr];
          this.addressActive = this.addressActive + 1

          if (this.user.regionInfo[1].id) {
            this.getThird()

          }

        }

      })

    },
    getThird() {
      let obj = {
        a: 4,
        id: this.user.regionInfo[1].id
      }
      console.log(obj)

      this.$Api.UserPage.RegionList(obj).then((res) => {
        if (res.q.s == 0) {
          let arr = []
          for (let i = 0; i < res.q.items.length; i++) {
            if (res.q.items[i].name.indexOf("市区") == -1) {
              let addressObj = { ...res.q.items[i]
              }
              addressObj.flag = false
              if (addressObj.name == this.user.regionInfo[2].name) {
                addressObj.flag = true
                this.thirdAddress.name = addressObj.name
                this.thirdAddress.id = addressObj.id
              }
              arr.push(addressObj)
            }

          }

          this.thirdList = [...arr];
          this.addressActive = this.addressActive + 1
        }

      })

    },

    getData() {

      this.$Api.Common.UserDetails({
        id: 0
      }).then((res) => {
        if (res.q.s == 0) {
          this.user = { ...res.q.user
          }
          if (this.user.imagePath == undefined) {
            this.user.imagePath = require("../../assets/common/placeholder_200x200.png")
          }
          this.$store.dispatch("changeUserObj", this.user)
          if (this.user.regionInfo.length < 3) {
            console.log(this.user.regionInfo)
            let len = this.user.regionInfo.length;
            for (let i = 0; i < 3 - len; i++) {
              let obj = {
                name: ""
              }
              this.user.regionInfo.push(obj)
            }

          }

          this.getAddress({
            a: 1,
            id: 0
          })
        }

      })

    },
    focus() {

    },
    changeAvatar() {
      this.imgIdList = []
      let that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          let localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

          that.upload(localIds)

        }

      });

    },
    async upload(arr) {

      var that = this
      this.$loading("上传中")

      wx.uploadImage({
        localId: arr,
        isShowProgressTips: 0,
        success: function(res) {
          console.log(res)
          that.imgIdList.push(res.serverId); // 返回图片的服务器端ID

          let imgObj = {
            "ids": that.imgIdList.join(",")
          }
          that.$Api.Common.SaveWxwebImages(imgObj).then((response) => {

            console.log(response)
            if (response.q.s == 0) {
              let sendObj = {
                'id': response.q.ids[0]
              }
              alert(sendObj.id)
              that.$Api.My.SetImage(sendObj).then((data) => {
                if (data.q.s == 0) {
                  that.getData()
                  setTimeout(() => {
                    that.$loading.clear()
                  }, 500)

                }

              })

            }

          })

          //销毁数据

        },
        error: function() {
          alert("asasasas");
        }
      });

    },

    blur() {

      this.showBtn = true
    },
    showAreaBox() {
      this.showArea = true

    },

    showAge() {
      this.show = true

    },
    change(num) {
      this.user.sex = num
    },

    onConfirm(values) {
      console.log(values)
      this.user.birthday = values[0]
      this.show = false

    },
    selectAddress(i, item, name, data, activeIndex) {
      for (let k = 0; k < this[name].length; k++) {
        if (i != k) {
          this[name][k].flag = false
        }

      }
      if(activeIndex==0){
          this.user.regionInfo=[]
      }
      this[name][i].flag = true
      this.user.regionId = item.id
      if (this[name][i].flag) {
        this[data].name = item.name
        this[data].id = item.id
        if (this.addressActive != 2) {

          if (this.addressActive == 0) {

              this.getCity(item)

          } else if (this.addressActive == 1) {
            this.getArea(item)

          }

        } else {
          let arr = []
          arr.push(this.firstAddress)
          arr.push(this.secondAddress)
          arr.push(this.thirdAddress)
          this.user.regionInfo = [...arr]
          this.showArea = false

        }

      }
    },
    getCity(item) {
      let obj = {
        a: 2,
        id: this.firstAddress.id
      }
      console.log(obj)
      this.secondList = []
      this.thirdList = []
      this.secondAddress = {}
      this.thirdAddress = {}
      this.$Api.UserPage.RegionList(obj).then((res) => {
        if (res.q.s == 0) {
          let arr = []
          for (let i = 0; i < res.q.items.length; i++) {

            let addressObj = { ...res.q.items[i]
            }
            addressObj.flag = false
            arr.push(addressObj)
          }

          this.secondList = [...arr];
          this.addressActive = this.addressActive + 1
        } else {
          let arr = []
          arr.push(item)
          let elseName = {
            name: ""
          }
          arr.push(elseName)
          arr.push(elseName)
          this.user.regionInfo = [...arr]

          this.showArea = false

        }

      })

    },
    getArea(item) {
      let obj = {
        a: 4,
        id: this.secondAddress.id
      }
      console.log(obj)

      this.thirdList = []
      this.thirdAddress = {}
      this.$Api.UserPage.RegionList(obj).then((res) => {
        if (res.q.s == 0) {
          if(res.q.items){


          let arr = []
          for (let i = 0; i < res.q.items.length; i++) {
            if (res.q.items[i].name.indexOf("市区") == -1) {
              let addressObj = { ...res.q.items[i]
              }
              addressObj.flag = false
              arr.push(addressObj)
            }

          }

          this.thirdList = [...arr];
          this.addressActive = this.addressActive + 1
          }else {
            let arr = []
            arr.push(this.firstAddress)
            arr.push(item)
            let elseName = {
              name: ""
            }

            arr.push(elseName)
            this.user.regionInfo = [...arr]

            this.showArea = false
          }
        }


      })

    },

    changeAddress(i) {
      this.addressActive = i

    }

  }

}
</script>

<style scoped="scoped" lang="scss">
.bottom_btn {
    width: 100%;
    height: 0.98rem;
    background: #FADC56;
    color: #1A1A1A;
    text-align: center;
    line-height: 0.98rem;
    font-size: 0.3rem;
    position: fixed;
    bottom: 0;
}

.top {
    height: 2.05rem;
    padding-top: 0.4rem;
    box-sizing: border-box;
    .avatar {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        margin: auto;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    p {
        color: #999999;
        font-size: 0.26rem;
        margin-top: 0.2rem;
        text-align: center;
    }
}

.box {
    margin-top: 0.8rem;
    padding: 0 0.24rem;
    .cell {
        width: 100%;
        border-bottom: 1px solid #DDDDDD;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        box-sizing: border-box;
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
        .title {
            width: 1.5rem;
            font-size: 0.26rem;
        }
        .right {
            width: 5.4rem;
            font-size: 0.26rem;
            display: flex;
            display: -webkit-box;
            /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            display: -moz-box;
            /* 老版本语法: Firefox (buggy) */
            display: -ms-flexbox;
            /* 混合版本语法: IE 10 */
            display: -webkit-flex;
            /* 新版本语法: Chrome 21+ */
            .cellItem {
                display: flex;
                display: -webkit-box;
                /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
                display: -moz-box;
                /* 老版本语法: Firefox (buggy) */
                display: -ms-flexbox;
                /* 混合版本语法: IE 10 */
                display: -webkit-flex;
                /* 新版本语法: Chrome 21+ */
                i {
                    width: 0.36rem;
                    height: 0.36rem;
                    box-sizing: border-box;
                    border: 0.02rem solid #666666;
                    position: relative;
                    top: 0.03rem;
                    border-radius: 50%;
                }
                .active {
                    background: url("../../assets/common_btn_choose_pre@3x.png") no-repeat;
                    background-size: 100%;
                    border: none;
                }
            }
            span {
                margin-left: 0.24rem;
            }
        }
        input {
            width: 5.4rem;
            border: none;
            color: #333333;
            font-size: 0.26rem;
            background: #FFFFFF;
        }
        .test-textarea {
            width: 5.4rem;
            min-height: 0.98rem;
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;
            box-sizing: border-box;
            border: none;
            outline: none;
            float: left;
            resize: none;
            color: #333333;
            font-size: 0.26rem;
            background: #FFFFFF;
            -webkit-user-modify: read-write-plaintext-only;
            word-wrap: break-word;
            -webkit-line-break: after-white-space;
            position: relative;
        }
        .test-textarea:empty::before {
            position: absolute;
            left: 0;
            /*line-height: 0.98rem;*/
            color: #999999;
            content: attr(placeholder);
        }
        input::-webkit-input-placeholder {
            color: #333333;
        }
        input:disabled,
        input[disabled] {
            color: #333333;
            -webkit-text-fill-color: #333333;
            -webkit-opacity: 1;
            opacity: 1;
        }
        .rightIcon {
            width: 0.12rem;
            height: 0.22rem;
            background: url("../../assets/my/common_btn_right@3x.png") no-repeat;
            background-size: 100%;
            position: absolute;
            right: 0.24rem;
            top: 0.35rem;
        }
    }
}
</style>
<style lang="scss">
.van-popup {
    .address_box {
        height: 8rem;
        background: #FFFFFF;
        .title_box {
            height: 0.95rem;
            line-height: 0.95rem;
            position: relative;
            text-align: center;
            color: #999999;
            font-size: 0.3rem;
            i {
                width: 0.21rem;
                height: 0.21rem;
                background: url("../../assets/common_btn_close2@2x.png") no-repeat;
                background-size: 100%;
                position: absolute;
                right: 0.3rem;
                top: 0.3rem;
            }
        }
        .address_tab {
            height: 0.55rem;
            border-bottom: 0.02rem solid #D9D9D9;
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
                margin-left: 0.3rem;
                margin-right: 0.3rem;
                font-size: 0.26rem;
                line-height: 0.55rem;
            }
            .active {
                color: #FF6876;
                border-bottom: 0.03rem solid #FF6876;
            }
        }
        .addressBox {
            height: 6.48rem;
            width: 100%;
            padding: 0.34rem 0;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            .item {
                height: 0.34rem;
                line-height: 0.34rem;
                font-size: 0.26rem;
                margin-bottom: 0.53rem;
                padding-left: 0.3rem;
                box-sizing: border-box;
                span {
                    float: left;
                }
                .active {
                    color: #FF6876;
                }
                i {
                    width: 0.25rem;
                    height: 0.17rem;
                    background: url("../../assets/my/my_icon_check1@3x.png") no-repeat;
                    background-size: 100%;
                    float: left;
                    position: relative;
                    top: 0.06rem;
                    margin-left: 0.24rem;
                }
            }
            .item:last-child {
                margin: 0;
            }
        }
    }
}
</style>
