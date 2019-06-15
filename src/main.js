// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import FastClick from 'fastclick'
import axios from 'axios'
import Api from '@/Api/api.js'
import Vant from 'vant'
Vue.use(Vant)



import 'vant/lib/vant-css/index.css'
import './assets/css/resert.css'

import store from './store/store' //vuex

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import { Lazyload } from 'vant';
Vue.use(Lazyload);
import Delete from './components/Delete/Delete.vue'
Vue.component('Delete',Delete) // 删除组件
import Cancel from './components/Cancel/Cancel.vue'
Vue.component('Cancel',Cancel)


import './plugin/Toast/toast.css';
 import Toast from './plugin/Toast/toast';
Vue.use(Toast)  //提示组件

import './plugin/Loading/Loading.css';
import Loading from './plugin/Loading/Loading';
Vue.use(Loading)  //加载组件

import './plugin/Share/Share.css';
import Share from './plugin/Share/Share';
Vue.use(Share)  //分享组件



import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';

import Global from '@/mixin/Global'
Vue.mixin(Global) //全局函数

import {LoadMore} from 'muse-ui';
Vue.use(LoadMore);

Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
  }, false);
}
Vue.prototype.$Api = Api
Vue.prototype.$upLoadToCos = (url,fileObj) =>{ //腾讯云上传
  	var xhr = new XMLHttpRequest();
				xhr.open('PUT', url, true);
				xhr.onload = function() {
					if(xhr.status === 200 || xhr.status === 206) {
						var ETag = xhr.getResponseHeader('etag');
					}
				};
				xhr.onerror = function() {

				};
				xhr.send(fileObj);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
  'App':() => import('./App')


  },
  store,
  template: '<App/>'
})
