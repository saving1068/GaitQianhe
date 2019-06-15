import res from '../res.js'

let Home = {
  AdList({ //广告列表
    a

  }) {
    return res.axiosApi(res.devUrl + 'ads/AdList', {
      params: {
        a
      }
    }, 'get')
  },
  WbDetail({ //游记详情
    id
  }) {
    return res.axiosApi(res.devUrl + "wb/WbDetail", {
      params: {
        n: "WbDetail",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a: 0,
          id
        }
      }
    })

  },
  //评论列表；
  CommentList({
    a,
    id,
    pa,
    li,

  }) {
    return res.axiosApi(res.devUrl + 'comment/CommentList', {
      params: {
        a,
        id,

          pa,
          li


      }
    }, 'get')
  },
  CommentSubmit({ //评论提交
    a,
    id,
    imageIds,
    content,
    starNum
  }) {
    return res.axiosApi(res.devUrl + 'comment/CommentSubmit', {
      params: {
        n: "CommentSubmit",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          id,
          imageIds,
          content,
          starNum
        }

      }
    })

  },
  //问答列表；
  QuestionsList({
    a,
    type,
    id,
    pa,
    li
  }) {
    return res.axiosApi(res.devUrl + 'comment/QuestionsList', {
      params: {
        a,
        type,
        id,

        pa,
        li

      }
    }, 'get')
  },

  //问答列表；
  QuestionDetails({
    a,
    id,
    pa,
    li
  }) {
    return res.axiosApi(res.devUrl + 'comment/QuestionDetails', {
      params: {
        n: 'QuestionDetails',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          id,
          ta: {
            pa,
            li
          }
        }
      }
    })
  },
  //点赞已读；
  PraiseSwitch({
    a,
    open,
    id
  }) {
    return res.axiosApi(res.devUrl + 'comment/PraiseSwitch', {
      params: {
        n: 'ParseSwitch',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          open,
          id
        }
      }
    })
  },
  Favorite({
    a,
    open,
    id
  }) {
    return res.axiosApi(res.devUrl + 'cis/Favorite', {
      params: {
        n: 'Favorite',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          open,
          id
        }
      }
    })
  },

  //问答提问；
  QuestionSubmit({
    a,
    id,
    content
  }) {
    return res.axiosApi(res.devUrl + 'comment/QuestionSubmit', {
      params: {
        n: 'QuestionSubmit',
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          id,
          content
        }
      }
    })
  },
  getWbList: ({
    a,
    ta,
    pa,
    id,
    li,
    Sk
  }) => { //游记列表
    return res.axiosApi(res.devUrl + "wb/WbList", {
      params: {
        n: "WbList",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          id,
          ta: {
            pa,
            li,
            Sk
          }
        }
      }
    })
  },
  GetCustomInfo: ({
    id
  }) => { //定制海报背景
    return res.axiosApi(res.devUrl + "custom/GetCustomInfo", {
      params: {
        n: "GetCustomInfo",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          id
        }
      }
    })
  },
  SubmitCustomInfo: ({
    a, //1 个人定制 2 团队定制
    orgId, //机构id
    deparPlace, //出发地
    destination, //目的地
    peopleNum, //人数
    budget, //预算
    startAt, //开始时间
    endAt //结束时间
  }) => { //定制信息
    return res.axiosApi(res.devUrl + "custom/SubmitCustomInfo", {
      params: {
        n: "SubmitCustomInfo",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          a,
          orgId,
          deparPlace,
          destination,
          peopleNum,
          budget,
          startAt,
          endAt
        }
      }
    })

  },

  CityGallery: ({
    a,
    type,
    regionId,
    pa,
    li

  }) => { //定制信息
    return res.axiosApi(res.devUrl + "wb/CityGallery", {
      params: {
        n: "CityGallery",
        a,
        type,
        regionId,
        pa,
        li


      }
    }, 'get')

  },
  saveCityGallery: (files) => {
    return res.axiosApi(res.devUrl + "wb/saveCityGallery", {
      params: {
        n: "saveCityGallery",
        s: res.SESSION ? res.SESSION : res.getSession(),
        q: {
          files: files


        }
      }
    })








  }


}

export default Home;
