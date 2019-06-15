import res from '../res.js'

let Common = {
  UserDetails: ({
    a
  }) => {
    return res.axiosApi(res.devUrl + "cis/UserDetails", {
      params: {
        n: "UserDetails",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a
        }
      }
    })
  },
  GetExternalUploadObject({
    a,
    type,
    filename
  }) {
    return res.axiosApi(res.devUrl + 'base/GetExternalUploadObject', {
      params: {
        n: 'GetExternalUploadObject',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          type,
          filename
        }
      }
    })


  },

  ExternalFilesSubmit({
    a,
    type,
    fileInfos
  }) { //上传图片；
    return res.axiosApi(res.devUrl + 'base/ExternalFilesSubmit', {


      params: {
        n: 'ExternalFilesSubmit',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          type,
          fileInfos
        }
      }
    })
  },
  WxConfig({
    url
  }) {
    return res.axiosApi(res.devUrl + 'cis/WxConfig', {


      params: {
        n: 'WxConfig',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          partner: 17,

          url
        }
      }
    })

  },
  wxLogin({
    openId
  }) {
    return res.axiosApi(res.devUrl + 'cis/UserPartnerLogin', {


      params: {
        n: 'UserPartnerLogin',
        s: "",
        q: {
          partner: 17,
          openId

        }
      }
    })
  },
  SaveWxwebImages({
    ids
  }) {
    return res.axiosApi(res.devUrl + 'base/SaveWxwebImages', {


      params: {
        n: 'SaveWxwebImages',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          ids
        }
      }
    })



  },
  CsList({
    id
  }) {
    return res.axiosApi(res.devUrl + 'cs/CsList', {


      params: {
        n: 'CsList',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a: 1,
          id
        }
      }
    })


  },
  AwardNotice({
    id
  }) { //游戏公告
    return res.axiosApi(res.devUrl + 'cms/AwardNotice', {
      params: {
        n: 'AwardNotice',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a: 0,
          id
        }
      }
    })
  },
  MyImDetails() {
    return res.axiosApi(res.devUrl + 'sns/MyImDetails', {


      params: {
        n: 'MyImDetails',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a: 1
        }
      }
    })



  },

  setSessionId(sessionId) {

    res.SESSION = sessionId;
  },
  QuerySetting({
    key
  }) {
    return res.axiosApi(res.devUrl + 'base/QuerySetting', {
      params: {
        n: 'QuerySetting',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          "a": 1,
          key
        }
      }


    })


  },
  ArticleDetails({
    id
  }) {
    return res.axiosApi(res.devUrl + 'cms/ArticleDetails', {
      params: {
        n: 'ArticleDetails',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          id
        }
      }

    })



  },
  // a 任务类型  5分享主页 6分享攻略 7分享游记 8分享别人的主页
  //id  用户id 游记id 攻略id

  ShareTask({id,a}){
  return res.axiosApi(res.devUrl + 'fina/ShareTask', {
    params: {
      n: 'ShareTask',
      s: res.SESSION ? res.SESSION : res.getSession(),
      q: {
        id,
        a
      }
    }

  })



},
CsTel({id}){
  return res.axiosApi(res.devUrl + 'cs/CsTel', {
    params: {
      n: 'CsTel',
      s: res.SESSION ? res.SESSION : res.getSession(),
      q: {
        id

      }
    }

  })



}



}

export default Common;
