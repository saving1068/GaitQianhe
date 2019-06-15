import res from '../res.js'

let Address={
	 UserDetails:({a})=>{
  	return res.axiosApi(res.devUrl + "cis/UserDetails",{
  		params:{
  			n:"UserDetails",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				a
  			}
  		}
  	})
  },
  ArticleList:({a,pa,li,orderBy,orderType,regionId,Sk})=>{
  	return res.axiosApi(res.devUrl + "cms/ArticleList",{
  		params:{
//			n:"ArticleList",
//			s: res.SESSION ? res.SESSION : res.getSession(),
//			q:{
  				a,
//				ta:{
  					pa,
  					li,
  					orderBy,
  					orderType,
  					regionId,
  					Sk
//				}
//			}
  		}
  	},"get")
  },
  ArticleDetails:(id)=>{//2.	文章详情
  	return res.axiosApi(res.devUrl + "cms/article",{
  		params:{
  			id
  		}
  	},"get")
  },
  CityId(key){
  	return res.axiosApi(res.devUrl + "base/CityId",{
  		params:{
  			n:"CityId",
  			s: res.SESSION ? res.SESSION : res.getSession(),
  			q:{
  				key
  			}
  		}
  	})
  },
  
CityGallery:({a,type,pa,li,regionId})=>{
  	return res.axiosApi(res.devUrl + "wb/CityGallery",{
  		params:{
  			a,
  			type,
			pa,
			li,
			regionId
  		}
  	},"get")
 },
 ScenicSpot(id){
 	return res.axiosApi(res.devUrl + 'base/ScenicSpot',{
 		params:{
 			n:"ScenicSpot",
			s: res.SESSION ? res.SESSION : res.getSession(),
			q:{
				id
			}
 		}
 	})
 },
 NearSpot({latitude,longitude}){
 	return res.axiosApi(res.devUrl + 'base/getNearSpot',{
 		params:{
 			n:"getNearSpot",
			s: res.SESSION ? res.SESSION : res.getSession(),
			q:{
				latitude,
				longitude
			}
 		}
 	})
 }	
	
	
}

export default Address;