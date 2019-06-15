<template>
<div style="min-height:100%;position:relative;-webkit-overflow-scrolling: touch;" class="talk">

    <van-pull-refresh id="scroll" ref="wrapper" style="min-height:6rem;"  @refresh="load" v-model="isLoading" >
      <div class="item" v-for="(item,index) in list" >
        <p>{{item.time}}</p>
        <div class="left" v-if="item.sendType==id">
          <div class="avatar" @click="show(item.fromAccountImage)">
            <img :src="item.fromAccountImage">
          </div>
          <div class="leftBox">

            <div class="content" v-html="item.text" v-if="item.type!=imgType">

            </div>
            <div class="imgBox"  v-else @click="showImg(item.showSrc,item.isLoad)">
              <img :src="item.src" >
            </div>
            <!-- <div class="reSend">

            </div> -->
          </div>

          <span class="name">{{item.fromAccountNick}}</span>
        </div>
        <div class="right" v-if="item.sendType!=id">
          <div class="avatar" @click="show(item.fromAccountImage)">
            <img :src="item.fromAccountImage">
          </div>
          <div style="float:right;position:relative;" class="rightBox">
            <div class="reSend" v-if="item.canResend" @click="reSend(index,item.oFile,item.type,item.text)">

            </div>
            <div class="textLoad" v-if="item.textLoad">

            </div>
            <div class="content" v-html="item.text" v-if="item.type!=imgType">

            </div>
            <div class="imgBox" v-else @click="showImg(item.showSrc,item.isLoad)">
            <img :src="item.src" alt="">
            <div class="imgMask" v-if="!item.isLoad">
             <i></i>
            </div>
            </div>

          </div>

          <span class="name">{{item.fromAccountNick}}</span>
        </div>

      </div>

   <div style="float:left;width:100%;height:1.2rem;">

   </div>

    </van-pull-refresh>

  <div class="inputBox" :style="[{'position':isFocus?'absolute':'fixed'}]">
    <!-- @click="selectImg" -->
    <i class="icon">
      <input type="file" accept="image/*" @change="getImg" ref="file">
    </i>
    <div class="box">
      <input type="text" v-model="sendInput" @focus="onFocus" @blur="onBlur" />

    </div>
    <div :class="[sendInput.length>0?'active':'','btn']" @click="sendData">
      发送
    </div>
  </div>
</div>
</template>

<script>
import {Toast} from 'vant'
export default {
  data() {
    return {
      sig: "",
      Id: "",
      loginInfo: {},
      isFocus: false,
      sendInput: "",
      timer: null,
      friendHeadUrl: "http://d.aiitec.org/GaitQianhe-h5/static/img/common.png",
      selType: webim.SESSION_TYPE.C2C,
      all: false,
      subType: webim.C2C_MSG_SUB_TYPE.COMMON,
      list: [],
      id: this.$route.query.im,//对方id
      infoMap: {},
      getPrePageC2CHistroyMsgInfoMap:{},
      isLoading:false,
      scroll:null,
      sendFlag:false,
      imgType:webim.MSG_ELEMENT_TYPE.IMAGE


    }
  },
  created() {
    console.log(this.id)
    this.$loading("加载中...")
    this.getIm()

  },
  mounted() {
    // this.$dialog.confirm({
    //   title: '重发该信息？',
    //   showConfirmButton:true,
    //   showCancelButton:true,
    //   confirmButtonText:'重发'
    // }).then(() => {
    //   // on confirm
    // }).catch(() => {
    //   // on cancel
    // });

  },
  methods: {
    reSend(i,oFile,type,text){
      this.list.splice(i,1)
      if(type==this.imgType){
this.uploadImg(oFile)
}else{
  console.log(text)
  this.sendText(text)
}

    },
    sendText(text){
      let that = this;
       let obj={
         fromAccountNick:this.loginInfo.identifierNick?this.loginInfo.identifierNick:this.Id,
         fromAccountImage:this.loginInfo.headurl?this.loginInfo.headurl:this.friendHeadUrl,
         sendType:this.loginInfo.identifier,
         type:webim.MSG_ELEMENT_TYPE.TEXT,
       }
       let now = webim.Tool.formatTimeStamp(new Date().getTime() / 1000, "yyyy-MM-dd")
       obj.times = new Date().getTime()/1000;
         let nowTime = new Date()

         if (nowTime.getHours() > 12) {
           let hour=nowTime.getHours()
           if(hour<10){
             hour="0"+hour
           }
           let min=nowTime.getMinutes()
           if(min<10){
             min="0"+min
           }

           obj.time = "下午 " + hour + ":" + min
         } else {
           let hour=nowTime.getHours()
           if(hour<10){
             hour="0"+hour
           }
           let min=nowTime.getMinutes()
           if(min<10){
             min="0"+min
           }
           obj.time = "上午 " + hour + ":" + min
         }
       if (this.list.length > 0) {
         console.log(obj.times - this.list[this.list.length - 1].times)
         if (obj.times - this.list[this.list.length - 1].times < 180) {
           obj.time = ""
         }
       }
       let html=""
       html+=text;
       obj.text = html
       obj.textLoad=false
       obj.isLoad=true
       obj.canResend=false
       obj.timer=null
       this.list.push(obj);

       var sess = webim.MsgStore.sessByTypeId(this.selType, this.id);
       if (!sess) {
         sess = new webim.Session(this.selType, this.id, this.id, this.friendHeadUrl, Math.round(new Date().getTime() / 1000));
       }
       var isSend = true; //是否为自己发送
       var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
       var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
       var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
       var subType; //消息子类型
       var msg = new webim.Msg(sess, isSend, seq, random, msgTime, this.loginInfo.identifier, this.subType, this.loginInfo.identifierNick);
       var text_obj;
       text_obj = new webim.Msg.Elem.Text(text);
       msg.addText(text_obj);
       this.sendFlag=false
       let len=this.list.length
       setTimeout(()=>{
          window.scrollTo(0,document.getElementsByClassName("van-pull-refresh")[0].scrollHeight)
       },100)
       this.list[len-1].timer=setTimeout(()=>{
         this.list[len-1].textLoad=true
       },2000)
       webim.sendMsg(msg, function(resp) {
         console.log(resp)
       // that.addMsg(msg,"pushData")
       that.list[len-1].textLoad=false
         clearTimeout( that.list[len-1].timer)

         },
         function(err) {
         console.log(err)
         that.list[len-1].textLoad=false
         that.list[len-1].canResend=true
          clearTimeout(that.list[len-1].timer)
         }

       )
    },
    load() {
      this.isLoading=true
      setTimeout(()=>{
        this.getHistory()
      },500)
    },


    sendData() {
      let flag=false
      if(this.sendFlag){
        return;
      }else{
        flag=true
      }

      let that = this;
      let toAccount = this.id
      var msgLen = webim.Tool.getStrBytes(this.sendInput);
      var maxLen;
      if(msgLen==0){
        return ;
      }
      maxLen = webim.MSG_MAX_LENGTH.C2C;
    if(msgLen>Math.round(maxLen / 3)){
      Toast({
        message: "输入内容过长",
        forbidClick: true,
        position: 'center',
        duration: 2000
      });
      return ;
    }
    this.sendFlag=true
    if(this.sendFlag&&flag)
   this.sendText(this.sendInput)
      this.sendInput=""
    },
    onFocus() {
      window.scrollTo(0,document.getElementsByClassName("van-pull-refresh")[0].scrollHeight)
      setTimeout(()=>{
        document.body.scrollTop = document.body.scrollHeight;
      },300)
      // this.timer=setInterval(()=>{
      //   document.getElementsByTagName('input')[0].scrollIntoView(true);
      // })


    },
    onBlur() {
      window.scrollTo(0,document.getElementsByClassName("van-pull-refresh")[0].scrollHeight)
      setTimeout(()=>{
        document.body.scrollTop = document.body.scrollHeight;
      },300)
      // clearInterval(this.timer)

    },
    getIm() {
      this.$Api.Common.MyImDetails().then(res => {
        if (res.q.s == 0) {
          console.log(res)
          this.sig = res.q.imSign
          this.Id = res.q.imId
          this.init()
        }
      })

    },
    //多终端登录被T
    onMultipleDeviceKickedOut() {
      Toast({
        message: "您已被T下线,请稍后重新登录",
        forbidClick: true,
        position: 'center',
        duration: 2000
      });
      this.$router.go(-1)
    },
    onMsgNotify(newMsgList) {
      //监听新消息事件
      var msgList = [];
      var dateStart = null;
      var dateEnd = null;
      let that = this;
      var sess, newMsg;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();

      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];


        if (newMsg.getSession().id() == that.id) { //为当前聊天对象的消息
          //在聊天窗体中新增一条消息
          that.addMsg(newMsg,"pushData")
          webim.setAutoRead(newMsg.sess, true, true);

        }
        // msgList.push(newMsg.elems[0].content.text);
      }
      //消息已读上报，以及设置会话自动已读标记
    },
    addMsg(msg,name) {
      let isSelfSend = msg.getIsSend(); //消息是否为自己发的
      let fromAccount = msg.getFromAccount(); //获取消息来源id

      if (fromAccount == this.id) {
        if (isSelfSend) {
          this.MySend(msg,name) //自己发的
        } else {
          this.OtherSend(msg,name) //对方发的
        }

      } else if (fromAccount == this.loginInfo.identifier) {
        if (isSelfSend) {
          this.MySend(msg,name) //自己发的
        } else {
          this.OtherSend(msg,name) //对方发的
        }

      }


    },
    MySend(msg,name) {
      let obj = {}
      if (this.loginInfo.identifierNick) {
        obj.fromAccountNick = this.loginInfo.identifierNick;
      } else {
        obj.fromAccountNick = this.Id;
      }
      obj.canResend=false
      //获取头像
      if (this.loginInfo.headurl) {
        obj.fromAccountImage = this.loginInfo.headurl;
      } else {
        obj.fromAccountImage = this.friendHeadUrl;
      }
      obj.sendType = this.loginInfo.identifier
      let now = webim.Tool.formatTimeStamp(new Date().getTime() / 1000, "yyyy-MM-dd")
      obj.times = msg.getTime();
      if (now == webim.Tool.formatTimeStamp(msg.getTime(), "yyyy-MM-dd")) {
        let nowTime = new Date(msg.getTime() * 1000)

        if (nowTime.getHours() > 12) {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }

          obj.time = "下午 " + hour + ":" + min
        } else {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }
          obj.time = "上午 " + hour + ":" + min
        }


      } else {
        obj.time = webim.Tool.formatTimeStamp(msg.getTime(), "yyyy-MM-dd")
      }
    if(name=="pushData"){
      if (this.list.length > 0) {
        if (obj.times - this.list[this.list.length - 1].times < 180) {
          obj.time = ""
        }

      }
    }else{
      if (this.list.length > 0) {
        if (this.list[0].times - obj.times  < 180) {
          this.list[0].time = ""
        }
      }
    }


      this[name](msg, obj)


    },
    show(src) {
          let arr = []
          arr.push(src);
          wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
          });




    },
    showImg(src,flag){
      if(src==""){
        return;
      }
      if(flag){
        let arr = []
        arr.push(src);
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: arr // 需要预览的图片http链接列表
        });
      }

    },
    OtherSend(msg,name) {
      let obj = {}
      obj.sendType = this.id
      let key = this.selType + "_" + this.id;

      var info = this.infoMap[key];
      if (info && info.name) {
        obj.fromAccountNick = info.name;
      } else if (msg.getFromAccountNick()) {
        obj.fromAccountNick = msg.getFromAccountNick();
      } else {
        obj.fromAccountNick = this.id;
      }
      //获取头像
      if (info && info.image) {
        obj.fromAccountImage = info.image;
      } else if (msg.fromAccountHeadurl) {
        obj.fromAccountImage = msg.fromAccountHeadurl;
      } else {
        obj.fromAccountImage = this.friendHeadUrl;
      }

      let now = webim.Tool.formatTimeStamp(new Date().getTime() / 1000, "yyyy-MM-dd")
      obj.times = msg.getTime();
      if (now == webim.Tool.formatTimeStamp(msg.getTime(), "yyyy-MM-dd")) {
        let nowTime = new Date(msg.getTime() * 1000)

        if (nowTime.getHours() > 12) {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }

          obj.time = "下午 " + hour + ":" + min
        } else {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }
          obj.time = "上午 " + hour + ":" + min
        }


      } else {
        obj.time = webim.Tool.formatTimeStamp(msg.getTime(), "yyyy-MM-dd")
      }
      if(name=="pushData"){
        if (this.list.length > 0) {
          if (obj.times - this.list[this.list.length - 1].times < 180) {
            obj.time = ""
          }
        }
      }else{
        if (this.list.length > 0) {
          if (this.list[0].times - obj.times  < 180) {
            this.list[0].time = ""
          }
        }
      }
      this[name](msg, obj)
    },
    pushData(msg, obj) {
      let newObj = { ...obj
      }
      let elems = msg.getElems(); //获取消息包含的元素数组
      let count = elems.length;
      let html = "";
      for (let i = 0; i < count; i++) {
        let elem = elems[i];
        let type = elem.getType(); //获取元素类型
        let content = elem.getContent(); //获取元素对象
        switch (type) {
          case webim.MSG_ELEMENT_TYPE.TEXT:
            var eleHtml = content.getText();
            //转义，防XSS
            html += webim.Tool.formatText2Html(eleHtml);
            newObj.type=webim.MSG_ELEMENT_TYPE.TEXT
            break;
          case webim.MSG_ELEMENT_TYPE.FACE:
            let faceUrl = null;
            let index = content.getIndex();
            let data = content.getData();
            if (!index) {
              index = 0
            }
            let emotion = webim.Emotions[index];
            if (emotion && emotion[1]) {
              faceUrl = emotion[1];
            }
            if (faceUrl) {
              html += "<img src='" + faceUrl + "'/>";
            } else {
              html += data;
            }
            newObj.type=webim.MSG_ELEMENT_TYPE.FACE
            break;
          case webim.MSG_ELEMENT_TYPE.IMAGE:
            var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
            var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
            var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
            if (!bigImage) {
              bigImage = smallImage;
            }
            if (!oriImage) {
              oriImage = smallImage;
            }
           newObj.showSrc=oriImage.getUrl();
            html += "<img  src='" + smallImage.getUrl() +"' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "'  />";
            newObj.type=webim.MSG_ELEMENT_TYPE.IMAGE
            newObj.src=smallImage.getUrl()
            newObj.isLoad=true
            break;
          default:
            webim.Log.error('未知消息元素类型: elemType=' + type);
            break;
        }
      }
      newObj.text = html

      this.list.push(newObj)

    },
    unshiftData(msg, obj){
      let newObj = { ...obj
      }
      let elems = msg.getElems(); //获取消息包含的元素数组
      let count = elems.length;
      let html = "";
      for (let i = 0; i < count; i++) {
        let elem = elems[i];
        let type = elem.getType(); //获取元素类型
        let content = elem.getContent(); //获取元素对象
        switch (type) {
          case webim.MSG_ELEMENT_TYPE.TEXT:
            var eleHtml = content.getText();
            //转义，防XSS
            html += webim.Tool.formatText2Html(eleHtml);
              newObj.type=type
            break;
          case webim.MSG_ELEMENT_TYPE.FACE:
            let faceUrl = null;
            let index = content.getIndex();
            let data = content.getData();
            if (!index) {
              index = 0
            }
            let emotion = webim.Emotions[index];
            if (emotion && emotion[1]) {
              faceUrl = emotion[1];
            }
            if (faceUrl) {
              html += "<img src='" + faceUrl + "'/>";
            } else {
              html += data;
            }
            newObj.type=type
            break;
          case webim.MSG_ELEMENT_TYPE.IMAGE:
            var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
            var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
            var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
            if (!bigImage) {
              bigImage = smallImage;
            }
            if (!oriImage) {
              oriImage = smallImage;
            }

            newObj.showSrc=oriImage.getUrl();
            html += "<img  src='" + smallImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "'  />";
            newObj.src=smallImage.getUrl()
            newObj.type=type
            newObj.isLoad=true
            break;
          default:
            webim.Log.error('未知消息元素类型: elemType=' + type);
            break;
        }
      }
      newObj.text = html
       this.isLoading=false
      this.list.unshift(newObj)

    },
    onKickedEventCall() {
      Toast({
        message: "您的账号已在其他地方登陆",
        forbidClick: true,
        position: 'center',
        duration: 3000
      });
      this.$router.go(-1)
      //  document.getElementById("webim_demo").style.display = "none";
    },

    onConnNotify(resp) { //监听连接状态回调变化事件
      var info;
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
          // alert(info);
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = '连接状态恢复正常: ' + resp.ErrorInfo;
          // alert(info);
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
          break;
      }


    },
    init() {
      var accountMode = 0;
      let that = this;
      //官方 demo appid,需要开发者自己修改（托管模式）
      var sdkAppID = 1400140458;
      var accountType = 39104;
      var sig = this.sig
      var identifier = this.Id
      this.loginInfo = {
        'sdkAppID': sdkAppID, //用户所属应用id,必填
        'identifier': identifier, //当前用户ID,必须是否字符串类型，必填
        'accountType': accountType, //用户所属应用帐号类型，必填
        'userSig': sig //当前用户身份凭证，必须是字符串类型，必填
      };

      var onC2cEventNotifys = {
        "96": this.onMultipleDeviceKickedOut
      };




      //监听事件
      var listeners = {
        "onConnNotify": this.onConnNotify //监听连接状态回调变化事件,必填
          ,
        "onMsgNotify": this.onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
          ,
        "onKickedEventCall": this.onKickedEventCall //被其他登录实例踢下线
          ,
        "onC2cEventNotifys": onC2cEventNotifys //监听C2C系统消息通道
      };



      //初始化时，其他对象，选填
      var options = {
      }




      webim.login(
        this.loginInfo, listeners, options,
        function(resp) {
          console.log(resp)
          if (resp.identifierNick) {
            that.loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
          } else {
            that.set()
          }
          if (resp.headurl) {
            that.loginInfo.headurl = resp.headurl; //设置当前用户昵称
          } else {
            that.set()
          }


          that.getFriends()


          //          initDemoApp();
        },
        function(err) {
          Toast({
            message: "登陆失败,请稍后重试",
            forbidClick: true,
            position: 'center',
            duration: 3000
          });
          this.$router.go(-1)

        }
      );

    },
    set() {
      let that = this
      let profile_item = [{
        "Tag": "Tag_Profile_IM_Nick",
        "Value": this.$store.state.Home.user.name
      }];
      profile_item.push({
        "Tag": "Tag_Profile_IM_Image",
        "Value": this.$store.state.Home.user.imagePath
      });
      let options = {
        'ProfileItem': profile_item
      };
      webim.setProfilePortrait(
        options,
        function(resp) {
          that.loginInfo.identifierNick = that.$store.state.Home.user.name; //设置当前用户昵称
          that.loginInfo.headurl = that.$store.state.Home.user.imagePath; //设置当前用户昵称
          console.log(resp)
        },
        function(err) {
          alert(err.ErrorInfo);
        }
      );


    },
    addFriend() {
      let that = this
      var add_friend_item = [{
        'To_Account': this.id,
        "AddSource": "AddSource_Type_Unknow"

      }];
      var options = {
        'From_Account': this.loginInfo.identifier,
        'AddFriendItem': add_friend_item
      };
      console.log(options)
      webim.applyAddFriend(
        options,
        function(resp) {
          console.log(resp)
          if (resp.ActionStatus == "OK") {
            that.getFriends()
          }
        },
        function(err) {
          console.log(err)
        }
      );

    },
    getFriends() {
      let that = this;
      let key = that.selType + "_" + that.id;
      var options = {
        'From_Account': this.loginInfo.identifier,
        'TimeStamp': 0,
        'StartIndex': 0,
        'GetCount': 200,
        'LastStandardSequence': 0,
        "TagList": [
          "Tag_Profile_IM_Nick",
          "Tag_Profile_IM_Image",
          "Tag_SNS_IM_Remark",
          "Tag_Profile_IM_Gender"
        ]
      };

      webim.getAllFriend(
        options,
        function(resp) {
          console.log(resp)
          if (resp.FriendNum > 0) {
            let friendsArr = [...resp.InfoItem]
            for (let i = 0; i < friendsArr.length; i++) {
              if (friendsArr[i].Info_Account == that.id) {
                if (!that.infoMap[key]) {
                  that.infoMap[key] = {}
                }

                if(friendsArr[i].SnsProfileItem){
                  for (let j = 0; j < friendsArr[i].SnsProfileItem.length; j++) {


                    if (friendsArr[i].SnsProfileItem[j].Tag == "Tag_Profile_IM_Nick") {
                      that.infoMap[key].name = friendsArr[i].SnsProfileItem[j].Value
                    }
                    if (friendsArr[i].SnsProfileItem[j].Tag == "Tag_Profile_IM_Image") {
                      that.infoMap[key].image = friendsArr[i].SnsProfileItem[j].Value
                    }


                  }
                }else{
                  that.infoMap[key].name=friendsArr[i].Info_Account
                  that.infoMap[key].image=that.friendHeadUrl
                }
                that.getFirstIn()

                return;
              }

            }
          }

          that.addFriend()

        },
        function(err) {
          alert(err.ErrorInfo);
        }
      );


    },
    getFirstIn(){  //第一次进入
      var msgKey = '';
      let that = this

      let selToID = this.id


      var options = {
        'Peer_Account': this.id, //好友帐号
        'MaxCnt': 5, //拉取消息条数
        'LastMsgTime': 0, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
      };
      var selSess = null;
      this.getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息

      webim.MsgStore.delSessByTypeId(this.selType, selToID);
      webim.getC2CHistoryMsgs(
        options,
        function(resp) {
          console.log(resp)
          var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
          if (resp.MsgList.length > 0) {
            webim.setAutoRead(resp.MsgList[resp.MsgList.length - 1].sess, true, true);
          }

          for(let i=0;i<resp.MsgList.length;i++){
            that.addMsg(resp.MsgList[i],"pushData")
          }
          that.getPrePageC2CHistroyMsgInfoMap[selToID] = { //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
            'LastMsgTime': resp.LastMsgTime,
            'MsgKey': resp.MsgKey
          };
           setTimeout(()=>{
             window.scrollTo(0,document.getElementsByClassName("van-pull-refresh")[0].scrollHeight)
             that.$loading.clear()
           },500)

        },
        function(err) {
          console.log(err)
        }
      );
    },
    getHistory() {

      var msgKey = '';
      let that = this

      let selToID = this.id

      if(!this.getPrePageC2CHistroyMsgInfoMap[selToID]){
        Toast({
          message: "已无历史记录",
          forbidClick: true,
          position: 'top',
          duration: 3000
        });
        this.isLoading=false
        return;
      }

      var options = {
        'Peer_Account': this.id, //好友帐号
        'MaxCnt': 8, //拉取消息条数
        'LastMsgTime': this.getPrePageC2CHistroyMsgInfoMap[selToID].LastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
      };
      var selSess = null;
      webim.MsgStore.delSessByTypeId(this.selType, selToID);
      webim.getC2CHistoryMsgs(
        options,
        function(resp) {
          console.log(resp)
          var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
          if (resp.MsgList.length > 0) {
            webim.setAutoRead(resp.MsgList[resp.MsgList.length - 1].sess, true, true);
          }

          let arr=[...resp.MsgList.reverse().splice(1)]
          for(let i=0;i<arr.length;i++){
            that.addMsg(arr[i],"unshiftData")
          }
          that.getPrePageC2CHistroyMsgInfoMap[selToID] = { //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
            'LastMsgTime': resp.LastMsgTime,
            'MsgKey': resp.MsgKey
          };
          if (complete == 1) {
            Toast({
  						message: "已无历史记录",
  						forbidClick: true,
  						position: 'top',
  						duration: 3000
  					});
            that.isLoading=false
              // that.$loading.clear()
            return;
          }
          // that.$loading.clear()


        },
        function(err) {
          console.log(err)
        }
      );
    },
    onProgressCallBack(loadedSize, totalSize) {
      var progress = document.getElementById('upd_progress'); //上传图片进度条
      progress.value = (loadedSize / totalSize) * 100;

    },
    getImg(e){
      this.uploadImg(e.target.files[0])
    },
    uploadImg(oFile) {

      let reads= new FileReader();
      let that = this
      var businessType;
      businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
      let html=""
      var opt = {
        'file': oFile, //图片对象
        'onProgressCallBack': this.onProgressCallBack, //上传图片进度条回调函数
        //'abortButton': document.getElementById('upd_abort'), //停止上传图片按钮
        'To_Account': this.id, //接收者
        'businessType': businessType //业务类型
      };
      let obj={
        fromAccountNick:this.loginInfo.identifierNick?this.loginInfo.identifierNick:this.Id,
        fromAccountImage:this.loginInfo.headurl?this.loginInfo.headurl:this.friendHeadUrl,
        sendType:this.loginInfo.identifier,
        type:webim.MSG_ELEMENT_TYPE.IMAGE,
      }
      let now = webim.Tool.formatTimeStamp(new Date().getTime() / 1000, "yyyy-MM-dd")
      obj.times = new Date().getTime()/1000;
        let nowTime = new Date()

        if (nowTime.getHours() > 12) {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }

          obj.time = "下午 " + hour + ":" + min
        } else {
          let hour=nowTime.getHours()
          if(hour<10){
            hour="0"+hour
          }
          let min=nowTime.getMinutes()
          if(min<10){
            min="0"+min
          }
          obj.time = "上午 " + hour + ":" + min
        }
      if (this.list.length > 0) {
        console.log(obj.times - this.list[this.list.length - 1].times)
        if (obj.times - this.list[this.list.length - 1].times < 180) {
          obj.time = ""
        }
      }
      reads.readAsDataURL(oFile);
      reads.onload=function(e){
        console.log(this.result)
        html+="<img src='" + this.result; + "'/>";
        obj.text = html
        obj.src=this.result
        obj.isLoad=false
        obj.showSrc=""
        obj.canResend=false
        obj.oFile=oFile
        that.list.push(obj);
        that.$refs.file.value=""
        let len=that.list.length
        setTimeout(()=>{
           window.scrollTo(0,document.getElementsByClassName("van-pull-refresh")[0].scrollHeight)
        },500)
        webim.uploadPic(opt,
          function(resp) {
            console.log(resp)
            //上传成功发送图片
            that.sendPic(resp, oFile.name,len)
          },
          function(err) {
            that.list[len-1].isLoad=true
            that.list[len-1].canResend=true
            console.log(err)
            // alert(err.ErrorInfo);
          }
        );
      }









    },
    onProgressCallBack(loadedSize, totalSize) {
      console.log(loadedSize, totalSize)
      // var progress = document.getElementById('upd_progress');//上传图片进度条
      //     progress.value = (loadedSize / totalSize) * 100;

    },
    sendPic(images, imgName,index) {
      let that = this;
      var selSess = new webim.Session(this.selType, this.id, this.id, this.friendHeadUrl, Math.round(new Date().getTime() / 1000));
      var msg = new webim.Msg(selSess, true, -1, -1, -1, this.loginInfo.identifier, 0, this.loginInfo.identifierNick);
      var images_obj = new webim.Msg.Elem.Images(images.File_UUID, imgName.split(".")[1]);
      for (var i in images.URL_INFO) {
        var img = images.URL_INFO[i];
        var newImg;
        var type;
        switch (img.PIC_TYPE) {
          case 1: //原图
            type = 1; //原图
            break;
          case 2: //小图（缩略图）
            type = 3; //小图
            break;
          case 4: //大图
            type = 2; //大图
            break;
        }
        newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
        images_obj.addImage(newImg);
      }
      msg.addImage(images_obj);
      //调用发送图片消息接口
      webim.sendMsg(msg, function(resp) {
        console.log(resp)
        if (that.selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
          // that.addMsg(msg,"pushData");
          let elems = msg.getElems(); //获取消息包含的元素数组
          let count = elems.length;
          for (let i = 0; i < count; i++) {
            let elem = elems[i];
            let type = elem.getType(); //获取元素类型
            let content = elem.getContent(); //获取元素对象
            switch (type) {
              case webim.MSG_ELEMENT_TYPE.IMAGE:
                var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
                var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
                var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
                if (!bigImage) {
                  bigImage = smallImage;
                }
                if (!oriImage) {
                  oriImage = smallImage;
                }


                that.list[index-1]["showSrc"]=oriImage.getUrl()
                that.list[index-1]["isLoad"]=true
                break;
              default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
            }
          }


        }
      }, function(err) {
        that.list[index-1].isLoad=true
        that.list[index-1].canResend=true
        console.log(err)
        // alert(err.ErrorInfo);
      });

    }

  },
  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.loginInfo).length != 0) {
      webim.logout(function(resp) {
        console.log(resp)
        next()
      }, function(err) {
        console.log(err)
      })

    }


  }

}
</script>

<style scoped="scoped" lang="scss">
.item {
    margin-top: 0.4rem;
    width: 100%;
    font-size: 0.28rem;
    float: left;
    p {
        width: 100%;
        float: left;
        margin-bottom: 0.13rem;
        text-align: center;
        color: #BFBFBF;
        font-size: 0.22rem;
    }
    .left {
        width: 100%;
        padding: 0 1.78rem 0 0.24rem;
        float: left;
        position: relative;
        .avatar {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            float: left;
            img {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
            }
        }
        .name {
            position: absolute;
            font-size: 0.22rem;
            color: #999999;
            top: 0;
            left: 1.24rem;
        }
        .leftBox{
            // max-width: 4.32rem;
            float: left;
            .imgBox{
              margin-left: 0.28rem;
              margin-top: 0.35rem;
              max-width: 4.32rem;
              img{
                max-width: 4.32rem;
                height:auto;
              }
            }
        .content {

            margin-left: 0.28rem;
            margin-top: 0.35rem;
            position: relative;
            background: #FFFFFF;
            padding: 0.1rem 0.2rem;
            box-sizing: border-box;

            border: 0.02rem solid #CCCCCC;
            border-radius: 0.1rem;
            word-wrap: break-word;

        }

        .content:after,
        .content:before {
            top: 0.13rem;
            left: -0.18rem;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
        }
        .content:before {
            left: -0.205rem;
            top: 0.12rem;

        }
        .content:after {
            border-color: rgba(136, 183, 213, 0);
            border-right-color: #ffffff;
            border-width: 0.08rem;
            border-right: 0.2rem solid #ffffff;
            margin-left: -0.09rem;
        }
        .content:before {
            border-color: rgba(194, 225, 245, 0);
            border-right-color: #CCCCCC;
            border-width: 0.1rem;
            border-right: 0.22rem solid #CCCCCC;
            margin-left: -0.11rem;
            // margin-top: 0.04rem;
        }
}
    }
    .right {
        width: 100%;
        padding: 0 0.24rem 0 1.78rem;
        float: left;
        position: relative;
        .rightBox{
          // max-width: 4.32rem;
            .reSend{
                width: 0.3rem;
                height: 0.3rem;
                background: url('../../assets/common/common_btn_warning_red@3x.png') no-repeat;
                background-size:100% 100%;
                position: absolute;
                left: -0.5rem;
                top: 50%;
                margin-bottom: -0.15rem;
            }
          .textLoad{
            width: 0.36rem;
            height: 0.39rem;
            background: url('../../assets/home/common_icon_Load@3x.png') no-repeat;
            background-size:100% 100% ;
            position: absolute;
            left: -0.56rem;
            top: 50%;
              margin-bottom: -0.19.5rem;
            margin: auto;
            transition: 1s;
            animation: icon 1s 0s  infinite linear;
          }
          @keyframes  icon{
            0%{
              transform: rotate(0deg);
            }

            100% {

              transform: rotate(360deg);

            }

          }

          .content {
              margin-top: 0.35rem;
              margin-right: 0.28rem;
              position: relative;
              background: #FFFAE1;
              padding: 0.1rem 0.2rem;
              box-sizing: border-box;
              max-width: 4.32rem;
              border: 0.02rem solid #E5E5E5;
              border-radius: 0.1rem;
              word-wrap: break-word;
          }
          .imgBox{
            margin-top: 0.35rem;
            margin-right: 0.28rem;
            max-width: 4.32rem;
            position: relative;
            img{
              max-width: 4.32rem;
              height:auto;
            }
            .imgMask{
              width: 100%;
              height:100%;
              background: rgba(0, 0, 0, 0.3);
              position: absolute;
              top: 0;
              left: 0;
              z-index: 99;
              i{
                width: 0.48rem;
                height: 0.52rem;
                background: url('../../assets/common/icon_load@3x.png') no-repeat;
                background-size:100% 100% ;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom:0;
                margin: auto;
                transition: 1s;
               	animation: icon 1s 0s  infinite linear;
              }
              @keyframes  icon{
              	0%{
              		transform: rotate(0deg);
              	}

              	100% {

              		transform: rotate(360deg);

              	}

              }
            }
          }
        }

        .name {
            position: absolute;
            font-size: 0.22rem;
            color: #999999;
            top: 0;
            right: 1.24rem;
        }
        .content:after,
        .content:before {
            top: 0.13rem;
            right: -0.18rem;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
        }
        .content:before {
            right: -0.205rem;
            top: 0.12rem;

        }
        .content:after {
            border-color: rgba(136, 183, 213, 0);
            border-left-color: #FFFAE1;
            border-width: 0.08rem;
            border-left: 0.2rem solid #FFFAE1;
            margin-right: -0.09rem;
        }
        .content:before {
            border-color: rgba(194, 225, 245, 0);
            border-left-color: #E5E5E5;
            border-width: 0.1rem;
            border-left: 0.22rem solid #E5E5E5;
            margin-right: -0.11rem;
            // margin-top: 0.04rem;
        }
        .avatar {
            float: right;
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            img {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
            }
        }

    }
}

.talk {
    position: relative;
    background: #F9F9F9;
    .inputBox {
        width: 100%;
        height: 0.88rem;
        background: #FFFFFF;
        border-top: 0.01rem solid #C1C4CA;
        position: fixed;
        z-index: 1000;
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
        .icon {
            width: 0.6rem;
            height: 0.46rem;
            background: url("../../assets/common/shop_icon_pic@3x.png") no-repeat;
            background-size: 100%;
            margin-left: 0.24rem;
            position: relative;
            top: 0.04rem;
            input {
                opacity: 0;
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
            }
        }
        .box {
            width: 4.94rem;
            height: 0.56rem;
            background: #FFFFFF;
            margin-left: 0.24rem;
            border: 0.02rem solid #E5E5E5;

            box-sizing: border-box;
            input {
                width: 100%;
                height: 100%;
                border: none;
                text-indent: 0.1rem;
                font-size: 0.2rem;
            }
        }
        .btn {
            width: 1rem;
            height: 0.56rem;
            background: rgba(250,220,86,1);
            border-radius: 0.06rem;
            color: #333333;

            font-size: 0.22rem;
            margin-left: 0.24rem;
            text-align: center;
            line-height: 0.56rem;
        }
        

    }
}
</style>
<style lang="scss">
.mu-refresh-control-hide {
    opacity: 0 !important;

}
.talk_box .van-pull-refresh{
  overflow:auto !important;
  overflow-y:scroll !important;
  float: left;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}
</style>
