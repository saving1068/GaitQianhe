<!-- 商城搜索导航页面 -->
<template>
	<div class="SeekShoppingMallNav">
		
		<!-- 搜索栏 -->
		<nav>
			<van-icon name="search" class="icon_search"/>
			<input type="text" placeholder="搜索" v-model.trim="Sk" @keyup.enter="click_go($event,Sk)"/>
			<button @click="SearchVal(Sk)">确认</button>
		</nav>
		
		<header v-if=" historyList.length != 0">
			<h2 class="cf">历史搜索<span class="fr" @click="allClear">清除</span></h2>
			
			<section class="cf">
				<span v-for="(item,index) in historyList" v-text="item" @click="click_hot(item,0)">成都</span>
				<!--<span>日本</span>-->
			</section>
		</header>
		
		<footer>
			<h3>热门搜索</h3>
			
			<section class="cf">
				<span v-for="(item,index) in HotSearch" v-text="item" @click="click_hot(item,1)">成都</span>
				<!--<span>日本</span>
				<span>广州</span>-->
			</section>
		</footer>
		
	</div>
</template>

<script>

export default {
	data() {
		return {
			Sk:'',//搜索关键字参数；
			historyList:[], //历史搜索；
			i:0,
			HotSearch:[], //热门搜索；
			//MyClass:new MyClass('子玥',23)
		}
	},
	created() {
		//console.log('sessionStorage.length',sessionStorage.length)
		//console.log(localStorage)
		let getLocalStorage = localStorage.getItem("historyList");
		let getLS = JSON.parse(getLocalStorage);
		//console.log('getLocalStorage',JSON.parse(getLocalStorage))
		//刷新载入页面都还存在历史搜索记录；
		//判断有没有清空过；
		if (getLS == null) {
			this.HotS();
			console.log('localStorage没historyList值')
			return
		} else{
			for (let i=0;i<getLS.length;i++) {
				this.historyList.push(getLS[i])
			}
			this.HotS();
			console.log('localStorage有值')
		}
	},
	mounted() {
		//this.MyClass.showName()
	},
	methods: {
		HotS(){
			//刷新载入页面的热门搜索；
			this.$Api.Shop.HotSearch({a:0}).then( res => {
				//console.log(res)
				this.HotSearch = res.q.list;
			})
		},
		//点击手机键盘的前往键或者enter确认键,确认前往搜索功能；
		click_go(ev,Sk){
			ev = ev || window.event;
			//console.log(ev.keyCode)
			
			this.SearchVal(Sk);
		},
		
		//点击每一个的热门搜索和历史搜索，并且带Sk参数跳转商城搜索页面；；
		click_hot(item,a){
			this.goSeekShoppingMalling(item,a);  //跳转商城搜索页面（有参数的）；
			
		},
		
		//清除历史搜索记录;
		allClear(){
			this.historyList = [];
			localStorage.removeItem('historyList');
		},
		
		//搜索功能；
		SearchVal (val) {
			//搜索栏不为空才能添加；
			if (this.Sk != '') {
		    	val = val.trim() // 清除空格
		      	if (this.historyList.length > 0) { // 有数据的话 判断
		        	if (this.historyList.indexOf(val) !== -1) { // 有相同的，先删除 再添加 
		          		this.historyList.splice(this.historyList.indexOf(val), 1)
		          		this.historyList.unshift(val)
		          		
		          		this.goSeekShoppingMall(); //跳转商城搜索页面；
		        	} else { // 没有相同的 添加
		         	 	this.historyList.unshift(val)
		         	 	
		         	 	this.goSeekShoppingMall(); //跳转商城搜索页面；
		        	}
		      	} else { // 没有数据 添加
		        	this.historyList.unshift(val)
		        	
		        	this.goSeekShoppingMall(); //跳转商城搜索页面；
		      	}
		      	if (this.historyList.length > 10) { // 保留10个值
		        	this.historyList.pop()
		        	
		        	this.goSeekShoppingMall(); //跳转商城搜索页面；
		      	}
		      	localStorage.setItem('historyList', JSON.stringify(this.historyList))
		      	console.log('this.historyList',this.historyList)
		    }else{ //为空也要跳转商城搜索页面；；
				this.goSeekShoppingMall();//跳转商城搜索页面；
			}  	
	    },
		
		//跳转商城搜索页面（无参数的）；
		goSeekShoppingMall(){
			this.$router.push({  
				name: "SeekShoppingMall",
				query: {
					Sk:this.Sk
				}
			})
		},
		
		//跳转商城搜索页面（有参数的）；
		goSeekShoppingMalling(item,a){
			this.$router.push({  
				name: "SeekShoppingMall",
				query: {
					'a':a, //a=0(关键字搜索),a=1(热门搜索)；
					Sk:item //关键字；
				}
			})
		},
		
	},
}

//class MyClass{
//	constructor(name,age){
//		this.name = name;
//		this.age = age;
//	}
//	showName(){
//		console.log('myClass的name',this.name)
//	}
//}
</script>

<style scoped lang="less">
/*该商城搜索页面样式*/
.SeekShoppingMallNav{
	background: #fff;
	height: 100%;
	nav{
		width: 100%;
		height: 1.05rem;
		box-sizing: border-box;
		position: relative;
		.icon_search{
			position: absolute;
			top: 0.41rem;
			left: 0.50rem;
			color: #fadc56;
			z-index: 10;
			width: 0.28rem;
			height: 0.28rem;
		}
		input{
			width:6.06rem;
			height:0.6rem;
			background:rgba(255,255,255,1);
			opacity:0.8;
			border-radius: 0.3rem;
			-webkit-box-shadow:0rem 0rem 0.1rem 0rem rgba(0,0,0,0.37);
			box-shadow:0rem 0rem 0.1rem 0rem rgba(0,0,0,0.37);
			border: none;
			text-indent: 0.6rem;
			margin-left: 0.27rem;
			font-size:0.24rem;
			font-family:PingFang-SC-Regular;
			color:rgba(153,153,153,1);
		}
		button{
			width: 1rem;
			height: 100%;
			font-size:0.3rem;
			font-family:PingFang-SC-Regular;
			color:rgba(51,51,51,1);
			outline: none;
			border: none;
			background: #fff;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			padding: 0rem;
		}
	}
	
	header{
		background: #fff;
		border-bottom: 0.15rem solid #ededed;
		h2{
			height: 0.72rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Regular;
			color:rgba(153,153,153,1);
			line-height: 0.72rem;
			padding-left: 0.27rem;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			span{
				width:1.08rem;
				height:100%;
				text-align: center;
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color:rgba(73,154,237,1);
			}
		}
		
		section{
			padding-bottom: 0.4rem;
			span{
				padding: 0.1rem 0.25rem;
				background:rgba(249,249,249,1);
				border-radius:0rem;
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color:rgba(51,51,51,1);
				float: left;
				text-align: center;
				line-height: 0.46rem;
				margin-left: 0.25rem;
				margin-bottom: 0.1rem;
			}
		}
	}
	
	footer{
		
		h3{
			height: 0.95rem;
			line-height: 0.95rem;
			font-size:0.26rem;
			font-family:PingFang-SC-Regular;
			color:rgba(153,153,153,1);
			padding-left: 0.27rem;
			box-sizing: border-box;
		}
		section{

			span{
				padding: 0.1rem 0.25rem;
				background:rgba(249,249,249,1);
				border-radius:0rem;
				font-size:0.22rem;
				font-family:PingFang-SC-Regular;
				color:rgba(51,51,51,1);
				float: left;
				text-align: center;
				line-height: 0.46rem;
				margin-left: 0.25rem;
				margin-bottom: 0.1rem;
			}
		}
		
	}
	
}

</style>
<style scoped lang="less">
/*该页面相同的样式*/
.cf:after{
	content: '';
	display: block;
	clear: both;
}

.fl{
	float: left;
}

.fr{
	float: right;
}
</style>