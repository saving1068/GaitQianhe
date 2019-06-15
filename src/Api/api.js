import { Toast } from 'vant';
import 'vant/lib/vant-css/index.css';

import Common from './Common/Common.js';
import My from './My/My.js';
import Address from './Address/Address.js';
import Home from './Home/Home.js';
import Shop from './Shop/Shop.js';
import UserPage from './UserPage/UserPage.js';


let Api = {
	Common,
	My,
	Address,
	Home,
	Shop,
	UserPage,
  untilSessionId: () => {
    return new Promise((resolve, reject) => {
      var timer = setInterval(getSessionId, 50);

      function getSessionId() {
        if (localStorage.getItem('sessionId')) {
          clearInterval(timer);
          resolve()
        }
      }
    })
  },
  
}


function checkErr(status) {
  let err;
  switch (status) {
    case '1000':
      err = '未知错误'
      break;
    case '1001':
      err = '协议版本过低，服务器已经不支持（APP 版本过低）'
      break;
    case '1002':
      err = 'session id 为空或不存在'
      break;
    case '1003':
      err = '验证码错误'
      break;
    case '1004':
      err = '请求参数不完整'
      break;
    case '1010':
      err = '请求超时'
      break;
    case '1011':
      err = '请求超时'
      break;
    case '1012':
      err = 'session id 会话过期'
      break;
    case '1012':
      err = 'session id 会话过期'
      break;
    case '1013':
      err = '未更新任何数据'
      break;
    case '1014':
      err = '已经提交，不需要重复提交'
      break;
    case '1015':
      err = '短信发送失败'
      break;
    case '1016':
      err = '参数不符合条件'
      break;
    case '1020':
      err = '缓存数据可用'
      break;
    case '1100':
      err = '（用户）未登录'
      break;
    case '1101':
      err = '用户名和密码错误'
      break;
    case '1102':
      err = '（用户）标识非法'
      break;
    case '1103':
      err = '（用户）不存在'
      break;
    case '1104':
      err = '（用户）已存在'
      break;
    case '1105':
      err = '（用户）已注销'
      break;
    case '1106':
      err = '（用户）被锁定'
      break;
    case '1107':
      err = '（用户）在别处登录'
      break;
    case '1109':
      err = '用户类型错误'
      break;
    case '1110':
      err = '（用户）推荐码不存在'
      break;
    case '1113':
      err = '手机号码已经存在'
      break;
    case '1114':
      err = '（用户）电话号码已被使用'
      break;
    case '1115':
      err = '（用户）未绑定手机号码'
      break;
    case '1200':
      err = '文件大小超过限制'
      break;
    case '1201':
      err = '文件类型非法'
      break;
    case '1401':
      err = '库存不足'
      break;
    case '1406':
      err = '非法操作'
      break;
    case '9000':
      err = '没有返回状态码'
      break;
    case '9001':
      err = '请求参数格式不正确（json 格式不正确）'
      break;
    case '9002':
      err = '协议不存在'
      break;
    default:
      err = '未知错误'
      break;
  }
  return err;
}

function errorMsg(message = '请求超时，请稍后重试', isDefault = true, callback) {
  if (isDefault) {
    Toast({
      message: message,
       forbidClick: true,
      position: 'bottom',
      duration: 5000
    });
  } else {
    callback()
  }
}

export default Api;
