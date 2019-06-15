<template>
<div  >



</div>
</template>

<script>
export default {
  data() {
    return {


    }
  },
  computed:{
    getLogin(){
      return this.$store.state.bindNumber
    }
  },
  watch:{
    getLogin(a){  //监听 是否绑定手机
      let obj={};
     Object.keys(this.$route.query).forEach(item=>{  //获取分享后传过来的参数
       if(item!="name"){   //name 为要跳转的地址
         obj[item]=this.$route.query[item]
       }
     })

      if(a){    //当已经绑定手机
        console.log(a,"true")
        if(this.$route.query.name!="Invit"){  //要跳转的地址不是分享注册页面
          this.$router.replace({
            name:this.$route.query.name,
            query:{...obj}
          })
        }else{
          this.$router.replace({        //要跳转的地址是分享注册页面
            name:"Home",
            query:{...obj}
          })
        }
      }
      else{                   //未绑定手机 统一跳去 分享注册页面

            this.$router.replace({
              name:"Invit",
              query:{...obj}
            })


      }

    }
  },
  created() {
   console.log(this.$route.query)
   if(this.$route.query.shareId){       //设置session 让别的页面判断 可以跳转首页
     window.sessionStorage.setItem("shareId",this.$route.query.shareId)
   }
   this.$loading("加载中") //因为首页空白时间较长 加个加载样式 让用户体验更好

  },
  mounted() {


  },
  methods: {





  },
  beforeRouteLeave(to, from, next) {
    this.$loading.clear()  //离开 清除加载
  next()


  }

}
</script>

<style scoped="scoped" lang="scss">

</style>
