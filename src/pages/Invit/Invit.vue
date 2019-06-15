<template>
  <div style="min-height:100%;padding-top:4.38rem">
    <div class="background"></div>
    <div class="SharePeople">
      <div class="avatar">
        <img :src="user.imagePath" @click="showImg(user.imagePath)">
      </div>
      <div class="name">
        <p v-if="user.name" :style="[{'line-height':user.name.length>6?'0.36rem':'0.72rem'}]">
          <span>{{user.name}}</span>
          <span>给你发来邀请</span>
          <br v-if="user.name.length>6">
          <span>立刻注册加入步履千寻</span>
        </p>
      </div>
    </div>
    <div class="inputBox">
      <div class="box">
        <input type="tel" v-model="tel" placeholder="请输入手机号" maxlength="11">
      </div>
    </div>
    <div class="inputBox">
      <div class="box">
        <input type="tel" v-model="codeText" placeholder="请输入验证码" maxlength="6">
        <div class="codeBox" @click="getCode">{{code<1?'发送验证码':code}}</div>
      </div>
    </div>

    <div class="btn" @click="submit">注册</div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      id: this.$route.query.shareId,
      user: {},
      tel: "",
      code: "",
      codeText: "",
      sendFlag: false
    };
  },
  created() {
    this.getUser();
  },
  computed: {
    getConfig() {
      return this.$store.state.config;
    },
    getLogin() {
      return this.$store.state.bindNumber;
    }
  },
  watch: {
    getConfig(a) {
      if (Object.keys(a).length != 0) {
        if (Object.keys(this.user).length == 0) {
          this.getUser();
        }
      }
    },
    getLogin(a) {
      if (a) {
        this.$router.replace({
          name: "Home"
        });
      }
    }
  },
  methods: {
    getCode() {
      var regAn = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!regAn.test(this.tel)) {
        Toast({
          message: "请输入正确手机号码",
          forbidClick: true,
          position: "center",
          duration: 2000
        });

        return;
      }
      if (this.code >= 1) {
        return;
      }
      var obj = {
        a: 1,
        type: 9,
        mobile: this.tel
        //					code:this.smsCode
      };
      this.$Api.UserPage.SMSCode(obj).then(res => {
        console.log(res);
        if (res.q.s == 0) {
          this.code = 60;
          this.countDown();
        } else {
          Toast({
            message: res.q.d,
            forbidClick: true,
            position: "center",
            duration: 2000
          });
        }
      });
    },
    countDown() {
      let c = this.code;
      var that = this;
      var cd = setInterval(() => {
        if (that.code < 1) {
          that.code = 0;

          clearInterval(cd);
        } else {
          c--;

          that.code = c;
        }
      }, 1000);
    },

    showImg(url) {
      let arr = [];
      arr.push(url);
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      });
    },
    submit() {
      let flag = false;
      if (this.sendFlag) {
        return;
      } else {
        flag = true;
      }
      
      

      var regAn = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!regAn.test(this.tel)) {
        Toast({
          message: "请输入正确手机号码",
          forbidClick: true,
          position: "center",
          duration: 2000
        });

        return;
      }
      var regDn = /^[0-9]*$/;

      if (
        this.codeText == "" ||
        this.codeText.length < 6 ||
        !regDn.test(this.codeText)
      ) {
        Toast({
          message: "请输入正确验证码",
          forbidClick: true,
          position: "center",
          duration: 2000
        });

        return;
      }
          
      let obj = {
        a: 2,
        type: 9,
        mobile: this.tel,
        code: this.codeText
      };
      this.sendFlag = true;
      this.$Api.UserPage.SMSCode(obj).then(res => {
        console.log(res);
        if (res.q.s == 0) {
          let newObj = {
            mobile: this.tel,
            checkKey: res.q.checkKey,
            shareBy: this.$route.query.shareId
          };
          this.$Api.UserPage.UserBindingSubmit(newObj).then(data => {
            if (data.q.s == 0) {
              this.$toast("注册成功", "success");

              this.$store.commit("changeBindNumber", true);
              this.getMyuser();
              setTimeout(() => {
                this.sendFlag = false;
                this.$router.replace({
                  name: "Home"
                });
              }, 500);
            } else {
              this.sendFlag = false;
              Toast({
                message: data.q.d,
                forbidClick: true,
                position: "center",
                duration: 2000
              });
            }
            console.log(data);
          });
        } else {
          this.sendFlag = false;
          Toast({
            message: res.q.d,
            forbidClick: true,
            position: "center",
            duration: 2000
          });
        }
      });
    },
    getMyuser() {
      this.$Api.UserPage.UserDetails({ a: 0 }).then(res => {
        if (res.q.s == 0) {
          let user = { ...res.q.user };
          if (user.imagePath == undefined) {
            user.imagePath = require("../../assets/common/placeholder_200x200.png");
          }

          this.$store.state.bindNumber =
            res.q.user.isBindMobile == 1 ? true : false;
          this.$store.dispatch("changeUserObj", user);
        }
      });
    },
    getUser() {
      var obj = {
        a: 2,
        id: this.id
      };
      this.$Api.UserPage.UserDetails(obj).then(res => {
        console.log(res);
        if (res.q.s == 0) {
          this.user = { ...res.q.user };
        }
      });
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
input::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #333333;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #333333;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #333333;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #333333;
}

.background {
  width: 100%;
  height: 100%;
  background: url("../../assets/bg_shar@3x.png") no-repeat;
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.inputBox {
  height: 1.48rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
  position: relative;
  z-index: 9;
  .box {
    height: 100%;
    border-bottom: 0.02rem solid #1a1a1a;
    position: relative;

    input {
      height: 1rem;
      position: absolute;
      width: 4.5rem;
      bottom: 0;
      left: 0;
      outline: none;
      border: none;
      background: transparent;
      font-size: 0.3rem;
    }
    .codeBox {
      width: 1.6rem;
      height: 0.68rem;
      border: 0.02rem solid rgba(255, 42, 0, 1);
      border-radius: 0.15rem;
      text-align: center;
      line-height: 0.68rem;
      font-size: 0.26rem;
      color: rgba(249, 33, 0, 1);
      position: absolute;
      right: 0;
      bottom: 0.2rem;
    }
  }
}

.SharePeople {
  width: 6.75rem;
  height: 1.2rem;
  margin: auto;
  position: relative;
  .avatar {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    position: relative;
    z-index: 9;
    float: left;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .name {
    position: absolute;

    width: 5.74rem;
    height: 0.72rem;
    background: rgba(12, 12, 12, 1);
    border-radius: 0.06rem;
    top: 0.25rem;
    right: 0;

    text-align: center;
    p {
      font-size: 0.22rem;
      color: #ffffff;
      line-height: 0.36rem;
    }
  }
}
.btn {
  width: 6rem;
  height: 0.94rem;
  background: linear-gradient(
    180deg,
    rgba(244, 64, 0, 1) 0%,
    rgba(251, 22, 0, 1) 100%
  );
  box-shadow: 0 0.05rem 0.12rem 0.01rem rgba(38, 31, 0, 0.68);
  border-radius: 0.46rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.36rem;
  margin: 0.88rem auto auto;
  position: relative;
  z-index: 9;
  line-height: 0.94rem;
}
</style>
