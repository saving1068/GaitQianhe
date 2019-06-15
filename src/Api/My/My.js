import res from '../res.js'

let My = {
	TaskList: () => {
		return res.axiosApi(res.devUrl + "fina/TaskList", {
			params: {
				n: "TaskList",
				s: res.SESSION ? res.SESSION : res.getSession(),
				q: {

				}
			}
		})
	},
	//我的收藏；
	MyFavorite({
		a,pa
	}) {
		return res.axiosApi(res.devUrl + 'cis/MyFavorite', {
			params: {
				n: 'MyFavorite',
				s: res.SESSION ? res.SESSION : res.getSession(),
				q: {
					a,
					ta:{
						pa,
						li:10
					}
				}
			}
		})
	},
	//收藏；
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
     SignAndGetIntegral:({a,date})=>{//签到
 	return res.axiosApi(res.devUrl + 'fina/SignAndGetIntegral', {
			 params: {
           'n': 'SignAndGetIntegral',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
            a,
            date
           }
         }
    })


 },
 MyAccountList:({a})=>{
 	return res.axiosApi(res.devUrl + 'fina/MyAccountList', {
			 params: {
           'n': 'MyAccountList',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
            a

           }
         }
   })
 },
 AccountDetailList:({a,pa,li})=>{
 	return res.axiosApi(res.devUrl + 'fina/AccountDetailList', {
			 params: {
           'n': 'AccountDetailList',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
            a,
            ta:{
            	pa,
            	li
            }

           }
         }
   })



 },

 SetImage:({id})=>{
 	return res.axiosApi(res.devUrl + 'base/SetImage', {
			 params: {
           'n': 'SetImage',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
            a:1,
            id,


           }
         }
  })
 },
  CouponList:({status})=>{
 	return res.axiosApi(res.devUrl + 'coupon/CouponList', {
			 params: {
           'n': 'CouponList',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
            a:1,
            ta:{
            	status
            }


           }
         }
  })
 },
 CouponSubmit:({couponCardNum})=>{
 	return res.axiosApi(res.devUrl + 'coupon/CouponSubmit', {
			 params: {
           'n': 'CouponSubmit',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           couponCardNum


           }
         }
  })

 },

  UserUpdate:({user})=>{
  	return res.axiosApi(res.devUrl + 'cis/UserUpdate', {
			 params: {
           'n': 'UserUpdate',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           	'a':1,
           user


           }
         }
  })

  },

  FeedbackSubmit:({ typeIds,
           content,
           images})=>{
  	return res.axiosApi(res.devUrl + 'cms/FeedbackSubmit', {
			 params: {
           'n': 'FeedbackSubmit',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           	'a':1,
           typeIds,
           content,
           images


           }
         }
  })

  },
  ReferenceItemList:({key})=>{
  	return res.axiosApi(res.devUrl + 'base/ReferenceItemList', {
			 params: {
            key

         }
  },'get')
  },

  CashApplySubmit:({amount})=>{
  	return  res.axiosApi(res.devUrl + 'fina/CashApplySubmit', {
			 params: {
           'n': 'CashApplySubmit',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           	'a':2,
           amount

           }
         }
  })
  },
  ExchangeMoney:({integral})=>{
  	return  res.axiosApi(res.devUrl + 'fina/ExchangeMoney', {
			 params: {
           'n': 'ExchangeMoney',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           	integral



           }
         }
  })
  },
  MyIntegral:()=>{
  	return  res.axiosApi(res.devUrl + 'fina/MyIntegral', {
			 params: {
           'n': 'MyIntegral',
            's': res.SESSION ? res.SESSION : res.getSession(),
           'q': {
           	a:0



           }
         }
  })
},
MyIncome:()=>{
	return  res.axiosApi(res.devUrl + 'fina/MyIncome', {
		 params: {
				 'n': 'MyIncome',
					's': res.SESSION ? res.SESSION : res.getSession(),
				 'q': {
				"ta":{
					
				}



				 }
			 }
	})
}











}

export default My;
