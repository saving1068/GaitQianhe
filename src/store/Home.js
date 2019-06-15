const Home={
	state:{
		made:{},  //个人定制对象
		teamMade:{},  //团建/公司 定制对象
		user:{},     //个人信息
		madeIndex:0    //定制下标
	},
	mutations:{
		changeMade(state,made){     //改变个人定制对象
			state.made={...made}
			console.log(state.made)
		},
		changeTeamMade(state,teamMade){ //改变团建/公司 定制对象
			state.teamMade={...teamMade}
			console.log(state.teamMade)
		},
		changeMadeIndex(state,Index){  //改变定制下标

			state.madeIndex=Index
		},
		changeUser(state,user){       //改变个人信息

			state.user={...user}
		}
	},

	actions:{
		changeMadeObj({           
			commit
		},made){
			commit('changeMade',made)
		},
		changeTeamMadeObj({
			commit
		},teamMade){
			commit('changeTeamMade',teamMade)
		},
		changeUserObj({
			commit
		},user){
			commit('changeUser',user)
		}




	}


}

export default Home;
