import res from '../res.js'

let UserPage={
	imgUrl:"http://java1.d.aiitec.org:8080/GaitQianhe/footprint/nationalFlag/",
	UserBindingSubmit({mobile,checkKey,shareBy}){
		return res.axiosApi(res.devUrl + "cis/UserBindingSubmit",{
			params:{
				n:"UserBindingSubmit",
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
					mobile,
					checkKey,
					partner:17,
					shareBy
				}
			}
		})
	},
	SMSCode({a,type,mobile,checkKey,code}){
		return res.axiosApi(res.devUrl + 'cis/SMSCode',{
			params:{
				n:'SMSCode',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q:{
  					a,
  					type,
  					mobile,
  					checkKey,
  					w:{
  						code
  					}
  				}
			}
		})
	},
	 ArticleDetails:(id)=>{//2.	文章详情
	  	return res.axiosApi(res.devUrl + "cms/article",{
	  		params:{
	  			id,
	  			sessionId:res.SESSION ? res.SESSION : res.getSession()
	  		}
	  	},"get")
	  },
	 UserDetails:({a,id})=>{
  	return res.axiosApi(res.devUrl + "cis/UserDetails",{
  		params:{
  			n:"UserDetails",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id
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
  getWbfootprintInfo:({a,ta,pa,li,id})=>{//足迹
  	return res.axiosApi(res.devUrl + "wb/WbfootprintInfo",{
  		params:{
  			n:"WbfootprintInfo",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
					id,
  				ta:{
  					pa,
  					li,
  				}
  			}
  		}
  	})
  },
  UserFootprintFlag:({a,id})=>{//足迹
  	return res.axiosApi(res.devUrl + "cis/UserFootprintFlag",{
  		params:{
  			n:"UserFootprintFlag",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
				id
  			}
  		}
  	})
  },
  UserFootprint:({a,ta,pa,li,id})=>{//足迹
  	return res.axiosApi(res.devUrl + "cis/UserFootprint",{
  		params:{
  			n:"UserFootprint",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
				id,
  				ta:{
  					pa,
  					li,
  				}
  			}
  		}
  	})
  },

   AddfootprintInfo:({a,id,date,regionId,longitude,latitude})=>{//添加足迹
  	return res.axiosApi(res.devUrl + "wb/AddfootprintInfo",{
  		params:{
  			n:"AddfootprintInfo",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id,
  				date,
  				regionId,
  				longitude,
  				latitude
  			}
  		}
  	})
  },
  DelfootprintInfo:({a,id})=>{//删除足迹
  	return res.axiosApi(res.devUrl + "wb/DelfootprintInfo",{
  		params:{
  			n:"DelfootprintInfo",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id,
  			}
  		}
  	})
  },
   DelWb:({a,id})=>{//删除游记
  	return res.axiosApi(res.devUrl + "wb/DelWb",{
  		params:{
  			n:"DelWb",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id,
  			}
  		}
  	})
  },
	 WbSubmit:({//发表和草稿 游记
  	a,
  	id,
  	imageId,
  	musicId,
  	destinationIds,
  	regionId,title,
  	contents,
  	spotIds
  })=>{
  	return res.axiosApi(res.devUrl + "wb/WbSubmit",{
  		params:{
  			n:"WbSubmit",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id,
  				imageId,
  				spotIds,
  				musicId,
  				destinationIds,
  				regionId,
  				title,
  				contents
  			}
  		}
  	})
  },
  WbDetail:({a,id})=>{//游记详情
  	return res.axiosApi(res.devUrl + "wb/WbDetail",{
  		params:{
  			n:"WbDetail",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id
  			}
  		}
  	})
  },
	RegionList:({a,id})=>{
  	return res.axiosApi(res.devUrl+ "base/RegionList",{
  		params:{
  			n:"RegionList",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a,
  				id
  			}
  		}
  	})
 },
 MusicCat(){
 	return res.axiosApi(res.devUrl + 'wb/MusicCat',{

 	},"get")
 },
 MusicList({catId,Sk}){
 	return res.axiosApi(res.devUrl + 'wb/MusicList',{
 		params:{
 			catId,
 			Sk
 		}
 	},"get")
 },
 WbDestinationList({a,searchKey,pa,li}){//景点
 	return res.axiosApi(res.devUrl+'wb/WbDestinationList',{
 		params:{
 			a,searchKey,pa,li
 		}
 	},'get')
 },
   ActivityInfo: () => {//1.	活动信息
    return res.axiosApi(res.devUrl + 'activity/ActivityInfo', {
      params: {
        'n': 'ActivityInfo',
        's': res.SESSION ? res.SESSION : res.getSession(),
        'q': {
          a:0,
        }
      }
    })
  },
	BeganToDraw: (a,id) => {//2.	开始抽奖
    return res.axiosApi(res.devUrl + 'activity/BeganToDraw', {
      params: {
        'n': 'BeganToDraw',
        's': res.SESSION ? res.SESSION : res.getSession(),
        'q': {
          a,
          id,
        }
      }
    })
  },

}

export default UserPage;
