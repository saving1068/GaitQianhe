<template>
	<div class="warp">
		<div class="input">
			<van-cell-group>
			  <van-field
			    v-model="message"
			    type="textarea"
			    placeholder="请输入段落小标题"
			    :autosize="minHeight"
			    maxlength="20"
			    :label="excess"
			  />
			</van-cell-group>
		</div>
		<div @click="over" class="btn">完成</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				message:"",
				minHeight:{minHeight: 50},
				excess:"可输入20字",//剩余数字
			}
		},
		methods:{
			over(){
				console.log(this.$route.query)
				if(this.$route.query.id){
					if(this.$route.query.type == 'send'){
						var obj ={
						content:this.message,
						protection:3
					}
					this.$store.state.TravelsArticle.splice(this.$route.query.index,0,obj)
					this.$router.go(-1)
					}else{
						var obj ={
						content:this.message,
						protection:3
					}
					this.$store.state.TravelsArticle.push(obj)
					this.$router.go(-1)
					}
					
				}else if(this.$route.query.type == 'send'){
					var obj ={
						content:this.message,
						protection:3
					}
					this.$store.state.sendTravels.send.splice(this.$route.query.index,0,obj)
					this.$router.go(-1)
				}else if(this.$route.query.type == 'last'){
					var obj ={
						content:this.message,
						protection:3
					}
					this.$store.state.sendTravels.send.push(obj)
					this.$router.go(-1)
				}
				
			}
		},
		watch:{
			num(a){
				console.log(a)
				
				this.excess = "可输入"+a+"字"//`可输入a字`
			}
		},
		mounted(){
			console.log(this.num)
		},
		computed:{
			num(){
				return 20 - this.message.length
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.warp{
		position: relative;
		padding-bottom: .98rem;
		.input{
			padding: .3rem .24rem .98rem;
			width:100%;
			textarea{
				resize: none;
				width:100%;
				
			}
		}
	}
	.btn{
			width: 100%;
			height: .98rem;
			position: fixed;
			bottom: 0;
			background: #FADC56;
			text-align: center;
			line-height: .98rem;
			font-size:0.3rem;
		}
</style>
<style type="text/css" lang="scss">
	.warp{
		.van-field{
			 .van-cell__title{
			 	position: absolute;
			 	bottom: -0.5rem;
			 	right: .24rem;
			 	color:#999999 ;
			 }
		}
		.input{
			.van-cell{
				overflow: inherit;
				padding: 0;
			}
		}
		.van-field__body{
			textarea::-webkit-input-placeholder{
				font-size:0.3rem;
				color:rgba(102,102,102,1);
				line-height:0.7rem;
				font-weight: 600;
			}
		}
	}
</style>