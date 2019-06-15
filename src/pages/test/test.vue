<template>
  <div class="myInformation " v-if='userInfo'>
    <commonheader v-if="$is_weixin"></commonheader>
     <div :class="{weixinStyle:topStyle}">
      <ul class="container_bottom_ul">
        <li class="container_bottom_li">
          <label>头像</label> 
          <span class="head_small">
            <img :src="userInfo.avatarPath.indexOf('http')==0? userInfo.avatarPath : $imgUrl+userInfo.avatarPath" />
          </span>
          <span class="my_icon_right">
            <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
          <input type="file" accept="image/*" pictype='30010003' data-role="none" name="files[]" id="publish-img" @change="uploadImg" class="publish-img" ref="imgInput" style="opacity: 0;" />
        </li>
        <li class="container_bottom_li" @click="PopupFn(1)">
          <label>姓名</label> 
          <span class="myName">{{userInfo.name}}</span>
          <span class="my_icon_right"> 
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(2)">
          <label>真实姓名</label> 
          <span class="myName">{{userInfo.realName}}</span>
          <span class="my_icon_right"> 
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(3)">
          <label>性别</label>
          <span class="myName">{{userInfo.sex==2?'男':userInfo.sex==3?'女': '未知'}}</span>
          <span class="my_icon_right">
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(4)">
          <label>地区</label>
          <span class="myName">{{userInfo.region.name || '请选择地区'}}</span>
          <span class="my_icon_right">
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(5)"> 
          <label>E-mail</label>
          <span class="myName">{{userInfo.email}}</span>
          <span class="my_icon_right">
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(6)"> 
          <label>身份</label>
          <span class="myName">{{userInfo.identity==1?'大一':userInfo.identity==2?'大二':userInfo.identity==3?'大三':userInfo.identity==4?'大四':userInfo.identity==5?'在职白领':''}}</span>
          <span class="my_icon_right">
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li" @click="PopupFn(8)"> 
          <label>学校</label>
          <span class="myName">{{userInfo.industry}}</span>
          <span class="my_icon_right">
          <img src="../../assets/my/my_icon_right@2x.png" />
          </span>
        </li>
        <li class="container_bottom_li"> 
          <label>顾问老师：</label>
          <span class="myName">{{userInfo.teacher.name || '暂无'}}</span>
        </li>
        <li class="container_bottom_li"> 
          <label>参与课程：</label>
          <span class="myName">{{userInfo.courses || '暂无'}}</span>
        </li>
      </ul>
    </div>
    <!-- 名字popup -->
    <van-dialog v-model="Popup[1]" show-cancel-button @confirm='confirm(1)' closeOnClickOverlay>
      <p style="text-align: center;line-height:.8rem;">姓名</p>
      <input ref='name' maxlength='20' class='info-dialog-input' type="text" :value="userInfo.name">
    </van-dialog>
    <!-- 真实名字popup -->
    <van-dialog v-model="Popup[2]" show-cancel-button @confirm='confirm(2)' closeOnClickOverlay>
      <p style="text-align: center;line-height:.8rem;">真实姓名</p>
      <input ref='realName' maxlength='20' class='info-dialog-input' type="text" :value="userInfo.realName">
    </van-dialog>
    <!-- 性别popup -->
    <van-popup v-model="Popup[3]" position="bottom">
			<div class="sexListBox">
        <p @click="confirm(3,2)">男</p>
			 	<p @click="confirm(3,3)">女</p>
			 	<div class="sexCancel" @click="PopupFn(3)">取消</div>
			</div>
    </van-popup>
		<!-- 地区popup -->
    <van-popup v-model="Popup[4]" position="bottom">
			<van-area :area-list="areaList" value="440100" @confirm="confirm_2" @cancel="PopupFn(4)" title='选择地区' show-toolbar />
    </van-popup>
    <!-- E-mail popup -->
    <van-dialog v-model="Popup[5]" show-cancel-button :beforeClose='beforeClose' @confirm='confirm(5)' >
      <p style="text-align: center;line-height:.8rem;">E-mail</p>
      <input ref='email' maxlength='30' class='info-dialog-input' type="text" :value="userInfo.email">
    </van-dialog>
    <!-- 身份 popup -->
    <van-popup v-model="Popup[6]" position="bottom">
			<div class="sexListBox">
        <p @click="confirm(6,1)">大一</p>
			 	<p @click="confirm(6,2)">大二</p>
			 	<p @click="confirm(6,3)">大三</p>
			 	<p @click="confirm(6,4)">大四</p>
			 	<p @click="confirm(6,5)">在职白领</p>
			 	<div class="sexCancel" @click="PopupFn(6)">取消</div>
			</div>
    </van-popup>
    <!-- 学校7popup -->
    <van-dialog v-model="Popup[7]" show-cancel-button @confirm='confirm(7)' closeOnClickOverlay>
      <p style="text-align: center;line-height:.8rem;">学校</p>
      <input ref='industry' maxlength='20' class='info-dialog-input' type="text" :value="userInfo.industry">
    </van-dialog>
    <!-- 学校7_7popup -->
    <van-popup style='width: 100%;height: 100%;background:#f9f9f9;padding-bottom:1rem;' v-model="Popup[8]" position="center">
			<van-radio-group v-model="userInfo.industry" id='school-box'>
        <van-cell-group>
          <van-cell :title="item.name" clickable @click="confirm(8,item.name)" v-for='(item) in schoolList' :key='item.id'>
            <van-radio :name="item.name" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>
<script>
import commonheader from "../../components/commonheader/commonheader";
import { Toast } from 'vant'
export default {
  components: {
    commonheader
  },
  created() {
    this.getArea();
    this.getUserDetails();
  },
  data() {
    return {
      areaList: {},
      topStyle: false,
      avatarPath: "",
      
      Popup: ['',false,false,false,false,false,false,false,false,],

      userInfo: null,
      schoolList: [],
      
      region: [],
      changePosition: ""
    };
  },
  methods: {
    weixin(){
      if(!this.$is_weixin){
        this.topStyle = true;
      }
    },
    PopupFn(status) {
      if(status!=8) {
        this.$set(this.Popup,status,!this.Popup[status])
        return
      }
      else {
        // 加载学校列表
        if(!this.schoolList.length) {
          this.getSchoolList(()=>{ this.$set(this.Popup,status,!this.Popup[status]) })
        } else {
          this.$set(this.Popup,status,!this.Popup[status])
        }
      }
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        done();
      } else {
        done();
      }
    },
    confirm(status,value) {
      if(status==1) {
        console.log(this.$refs.name.value)
        this.UpdateUserDetails({ name:this.$refs.name.value },()=>{ this.$set(this.Popup,status,false) })
      } else if(status==2) {
        console.log(this.$refs.realName.value)
        this.UpdateUserDetails({ realName:this.$refs.realName.value },()=>{ this.$set(this.Popup,status,false) })
      } else if(status==3) {
        console.log(value)
        this.UpdateUserDetails({ sex:value },()=>{ this.$set(this.Popup,status,false)} )
      } else if(status==4) {
        // debugger
      } else if(status==5) {
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if(!reg.test(this.$refs.email.value)){
          Toast({message:"请输入有效的邮箱",duration:1500})
          setTimeout(()=>{ this.PopupFn(5) },1500)
          return false
        }
        console.log(this.$refs.email.value)
        this.UpdateUserDetails({ email:this.$refs.email.value },()=>{ this.$set(this.Popup,status,false)} )
      } else if(status==6) {
        console.log(value)
        this.UpdateUserDetails({ identity:value },()=>{ this.$set(this.Popup,status,false)} )
      } else if(status==7) {
        console.log(this.$refs.industry.value)
        this.UpdateUserDetails({ industry:this.$refs.industry.value },()=>{ this.$set(this.Popup,8,false);this.$set(this.Popup,status,false) })
      } else if(status==8) {
        if(value=='其他') {
          this.$set(this.Popup,7,true)
          return
        }
        this.UpdateUserDetails({ industry: value},()=>{ this.$set(this.Popup,status,false) })
      }
    },
    confirm_2(a){
      let region = { id: 0, name: '' }
      a.forEach(item=>{
        region.name+=item.name
      })
      region.id=a[a.length-1].code
      this.$set(this.Popup,4,false)
      this.UpdateUserDetails({ region: region })
    },
    // 更改用户信息
    UpdateUserDetails(params,cb) {
      let p = Object.assign({},this.userInfo,params)
      this.$Api.UserUpdateSubmit(p).then(res => {
        if (res.q.s == 0) {
          this.userInfo = p
          localStorage.setItem("userInfo", JSON.stringify(p))
          setTimeout(()=>{ cb && cb() },100)
        }
      })
    },
    // 初始化
    getUserDetails() {
      this.$Api.UserDetails(1).then(res => {
        if (res.q.s == 0) {
          this.userInfo = res.q.userInfo
        }
      })
    },
    // 加载学校列表
    getSchoolList(cb) {
      this.$Api.getSchoolList().then(res=> {
        if(res.q.s==0) {
          res.q.schools.push({id:0,name:'其他'})
          this.schoolList=res.q.schools
          cb && cb()
        }
      })
    },
    // 获取省市区数据
    getArea() {
      this.$Api.RegionList(1).then(res => {
        if (res.q.s == 0) {
          let obj = {
            province_list: res.q.province_list,
            city_list: res.q.city_list,
            county_list: res.q.county_list
          }
          this.areaList = obj
        }
      })
    },
    // 修改头像
    uploadImg() {
      var oFile = document.getElementById("publish-img").files[0];
      var form = new FormData();
      var obj = {
        n: "UploadImage",
        s: localStorage.getItem("session"),
        q: {}
      };
      form.append("s", localStorage.getItem("session"));
      form.append("n", "UploadImage");
      form.append("files[]", oFile, oFile.name);
      var config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      };
      this.$Api.UploadFiles(config).then(res => {
        if (res.q.s == 0) {
          this.UpdateUserDetails({ avatarPath: res.q[0].path })
        }
      })
    },
  },
  mounted() {
    this.weixin();
  }
};
</script>
<style lang="less" scoped>
.myInformation {
  .weixinStyle{
    padding-top:0;
  }
    .van-dialog{
      width: 70%;
    }
    .container_bottom_ul {
      .container_bottom_li {
        position:relative;
        text-align:right;
        padding: 0.24rem 0.29rem;
        background-color: #fff;
        font-size: 0.3rem;
        border-bottom: 1px solid #ededed;
        >label {
          position:absolute;
          top:50%;
          left:.3rem;
          transform:translateY(-50%);
        }
        .my_icon_right {
          img {
            height: 0.25rem;
            width: 0.15rem;
            margin-top:.08rem;
            float: right;
          }
        }
        #publish-img{
          position: absolute;
          height: 1.21rem;
          width: 70%;
          top: 0.2rem;
          right: .7rem;
          z-index: 10;
          border-radius: 50%;
        }
        .head_small {
          img {
            height: 1.21rem;
            width: 1.21rem;
            position: absolute;
            top: 0.2rem;
            right: .7rem;
            border-radius: 50%;
          }
        }
      }
      .container_bottom_li:nth-child(1) {
        position: relative;
        height: 1.62rem;
        line-height: 1.62rem;
        padding: 0 0.29rem 0 0.29rem;
        .my_icon_right {
          img {
            position: absolute;
            top: 0.7rem;
            right: 0.3rem;
          }
        }
      }
      .container_bottom_li:last-child {
        border-bottom:0;
      }
      .container_bottom_li {
        position: relative;
        .myName {
          width:70%;
          display:inline-block;
          vertical-align:top;
          margin-right:.2rem;
          text-align: right;
          word-wrap: break-word;
          word-break: break-word;
          text-align: right;
          font-size: 0.28rem;
          color: #999;
        }
      }
    }
  .sexListBox {
    p,
    div {
      background: #fff;
      line-height: 1rem;
      text-align: center;
    }
    .sexCancel {
      border-top: 0.1rem solid #ccc;
    }
    p{
      border-bottom: 1px solid #ccc;
    }
  }
}

.info-dialog-input {
  display:block; width:80%;margin:0 auto; line-height:.8rem;border: 1px solid #CCCCCC; margin-bottom: .4rem; margin-top: .2rem; text-indent:.2rem;
}

.school-box{
  
}
</style>

<style>
  
</style>
