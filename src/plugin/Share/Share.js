var Share = {};

var ShareVM = null,    //存储toast vm
	showShare = false; // 存储toast显示状态

Share.install = function(Vue) {

	Vue.prototype.$share = function(msg) {//方法挂载在vue内
		var tmp = '	<div class="share_Box" v-show="visible"><div class="arrow"></div><div class="box"><p>{{message}}</p><p class="second"><span>点击右上角</span><i></i><span>分享</span></p></div><div class="closeBox" @click="close"></div></div>'



		if(showShare) {//之前toast还未消失
      if(ShareVM){
				ShareVM.message = msg                  //改变toast 文字
        ShareVM.visible=showShare;
      }
			return;

		}

		if(!ShareVM) {//判断如果页面内无toast对象  创建一个新的 挂载在vue内
			var instance = Vue.extend({
				data: function() {
					return {
						visible: showShare,
						message: msg

					}
				},
        methods:{
          close(){
            this.visible=false
          }
        },
				template: tmp
			});

			ShareVM = new instance()
			var tpl = ShareVM.$mount().$el;//挂载到vue
			document.body.appendChild(tpl); //添加元素

		}

		ShareVM.visible = showShare = true;     //toast 显示
		ShareVM.message = msg                  //改变toast 文字






	}

}

module.exports = Share;
