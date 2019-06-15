var Loading = {};

var LoadingVM = null,    //存储toast vm
	showLoading = false; // 存储toast显示状态

Loading.install = function(Vue) {

	Vue.prototype.$loading = function(msg,type) {//方法挂载在vue内
         var nowType;
		var tmp = '<div class="loading_box" v-show="visible"><div class="midBox"><div class="topBox"><i></i></div><p>{{message}}...</p></div></div>'
         if(type=='success'){
         	nowType=1

         }
         if(type=='error'){
         	nowType=2

         }

		if(showLoading) {//之前toast还未消失
			return;

		}

		if(!LoadingVM) {//判断如果页面内无toast对象  创建一个新的 挂载在vue内
			var instance = Vue.extend({
				data: function() {
					return {
						visible: showLoading,
						message: msg

					}
				},
				template: tmp
			});

			LoadingVM = new instance()
			var tpl = LoadingVM.$mount().$el;//挂载到vue
			document.body.appendChild(tpl); //添加元素

		}

		LoadingVM.visible = showLoading = true;     //toast 显示
		LoadingVM.message = msg                  //改变toast 文字
        LoadingVM.type = nowType





	}
Vue.prototype.$loading.clear=function(){

	if(showLoading){
		LoadingVM.visible = showLoading = false;          //toast 消失
	}




}
}

module.exports = Loading;
