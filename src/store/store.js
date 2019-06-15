import Vue from 'vue'
import Vuex from 'vuex'
import Home from './Home.js'
import Shop from './Shop.js'
Vue.use(Vuex)


const store = new Vuex.Store({
	modules:{
		Home:Home,
		Shop:Shop
	},
	state: {
		sessionId: "",
		config:{}, //wx config 对象
		isVip:false,
		pointsTotal:0,
		orderText:"",
		cashTotal:0,
		informationA:'',//消息页面a参数
		informationa:'',//消息页面title
		TravelsArticle:[],//游记文章
		Travels:{
		},//游记回显得内容
		sendTravels:{
			send:[],
		},//发表新的游记
		all:{},//导航请求游记攻略信息
		bindNumber:null,//是否绑定手机
    disabledUser:true
	},
	getters: {



	},
	mutations: {


		changeConfig(state,config){    //设置wx config
			state.config={...config}
		},
		changeBindNumber(state,flag){
			state.bindNumber=flag
		},
		changeDisaber(state,flag){
			state.disabledUser=flag
		}

	},
	actions: {
		changeConfigData({
			commit
		},config){
			commit('changeConfig',config)
		}


	},


})
export default store
