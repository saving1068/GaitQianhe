<template>
	<div style="background:#FFF;">
		<div class="top">
			<p>待入账收益</p>
			<div>
				<span style="font-size: 0.51rem;">¥</span>
				<span style="font-size: 0.82rem;">{{balance}}</span>
			</div>
		</div>
		<div class="item" v-for="item in list">
			<p>{{item.note}}
			</p>
			<div>
				<span>+{{item.income}}</span>
				<span>{{item.time}}天内到账</span>
			</div>
		</div>


	</div>

</template>

<script>
	export default{
		data(){
			return{
            list:[],
						balance:0
			}
		},
		 created(){
			      this.getData()
		 },
		 methods:{
			 getData(){
				 this.$Api.My.MyIncome().then((res)=>{
					 this.list=[...res.q.list]
					 this.balance=res.q.balanceFronzen
					 console.log(res)
				 })
			 }
		 }

	}
</script>

<style scoped="scoped" lang="scss">
.top{

	border-bottom: 1px solid #EDEDED;
	padding-top: 0.4rem;
	box-sizing: border-box;
	p{
		text-align: center;
		font-size: 0.36rem;
	}
	div{
		color: #F6323E;
		margin-top: 0.4rem;
		margin-bottom: 0.4rem;
		text-align: center;
	}
}
.item{
	padding: 0.37rem 0.25rem 0.2rem;
	border-bottom: 1px solid #EDEDED;
	font-size: 0.26rem;
	div{
		margin-top: 0.37rem;
		span:first-child{
			color: #F74952;
			font-size: 0.3rem;
		}
		span:last-child{
			color: #999999;
			font-size: 0.26rem;
			float: right;
		}
	}

}


</style>
