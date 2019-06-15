<template>
  <div id="main">
  	<tab-bar></tab-bar>
    <keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>

  </div>
</template>

<script>
import tabBar from "../components/TabBar/TabBar.vue"

export default {
		components:{
			tabBar
		},
	data() {

    return {
  		openId:''
    }
  },

  created(){

  },
  methods:{







  }
}
</script>

<style>
  #main{
    height: 100%;
    	background: rgba(255, 255, 255, 1);
  }
</style>
