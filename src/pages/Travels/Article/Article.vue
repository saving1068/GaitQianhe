<template>
	<div class="warp">
		<div class="input">
			<van-cell-group>
			  <van-field
			    v-model="message"
			    type="textarea"
			    placeholder="写点什么吧~（备注：点击边框变成#333333）"
			    :autosize="minHeight"
			    maxlength="1000"
			    :label="excess"
			  />
			</van-cell-group>
		</div>
		<div class="btn" @click="over">完成</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				message:"",
				minHeight:{minHeight: 300},
				excess:"可输入1000字",//剩余数字
			}
		},
		methods:{
			over(){
				let message;
				if(this.message.indexOf("\n")!=-1){
					var reg = new RegExp( '\n' , "g" )
					message = this.message.replace(reg,"<br />")
				}else{
					message = this.message
				}
				
				if(this.$route.query.id){//修改
					if(this.$route.query.type == 'send'){
						var obj={
							content:message,
							protection:1
						}
						this.$store.state.TravelsArticle.splice(this.$route.query.index,0,obj)
						this.$router.go(-1)
					}else{
						var obj={
							content:message,
							protection:1
						}
						this.$store.state.TravelsArticle.push(obj)
						this.$router.go(-1)
					}
				}else if(this.$route.query.type == 'send'){//发生新的游记
					var obj ={
						content:message,
						protection:1
					}
					this.$store.state.sendTravels.send.splice(this.$route.query.index,0,obj)
					this.$router.go(-1)
				}else if(this.$route.query.type == 'last'){
					var obj ={
						content:message,
						protection:1
					}
					this.$store.state.sendTravels.send.push(obj)
					this.$router.go(-1)
				}
			},
		},
		watch:{
			num(a){
				
				this.excess = "可输入"+a+"字"//`可输入a字`
			}
		},
		mounted(){
		},
		computed:{
			num(){
				return 1000 - this.message.length
			}
		},
//		beforeRouteLeave(to,from,next){
//			to.query.id=this.$route.query.id
//			to.query.index=this.$route.query.index
//			
//			
//		}
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
	}
</style>