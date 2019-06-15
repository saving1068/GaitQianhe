
const Global={ //全局函数
     methods:{
       commonConfig(){
         //邀请好友页面地址
         let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?#/EmptyPage?name=Invit&shareId=" +this.$store.state.Home.user.id;

         let that = this;
         wx.config({
           debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
           appId: this.$store.state.config.appId, // 必填，公众号的唯一标识
           timestamp: this.$store.state.config.timestamp, // 必填，生成签名的时间戳
           nonceStr: this.$store.state.config.nonceStr, // 必填，生成签名的随机串
           signature: this.$store.state.config.signature, // 必填，签名
           jsApiList: ["chooseImage", "previewImage", "uploadImage", "updateAppMessageShareData", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
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

          });
       },
       setCommonInfo(){
         //获取用户详情 保存到vuex
       this.$Api.UserPage.UserDetails({a:0}).then((res)=>{
           if(res.q.s==0){
             let user={...res.q.user}
             if(user.imagePath == undefined) {
               user.imagePath = require("../assets/common/placeholder_200x200.png") //无头像
             }
            this.getConfigMessage()  //获取wxconfig信息
             this.$store.state.bindNumber = res.q.user.isBindMobile == 1? true:false;
             this.$store.dispatch("changeUserObj",user)

           }


         })
       },
      getConfigMessage(){ //获取wxconfig信息
        let url = window.location.href.split('#')[0]
         this.$Api.Common.WxConfig({
           url: url
         }).then((res) => {
           let config = { ...JSON.parse(res.q.config)
           }
           this.commonConfig()       //注入config  分享
           this.$store.dispatch("changeConfigData",config)  //config 信息保存在vuex里

         })




      }





     }


}
export default Global;
