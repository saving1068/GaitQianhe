<template>
	<div style="height: 100%;">
		<img src="../../assets/my/椭圆8拷贝4@3x.png" />
		<!-- 右下角客服按钮 -->
		<div class="serve" @click="show">

		</div>

	  <!-- 选择栏 -->
		<van-actionsheet v-model="isshow" :actions="list"  @select="onSelect"   cancel-text="取消"  @cancel="isshow=false"/>

	</div>
</template>

<script>

	export default {

		data() {
			return {
				isshow: false, //控制选择栏
				list:[],        //选择栏的列表
				tel:""          //电话号码
			}

		},
        created(){
        	this.getData()
        },
		methods: {
			getData(){         //获取客服列表
				this.$Api.Common.CsList({id:0}).then((res)=>{
						if(res.q.csContacts.length>0){
					res.q.csContacts.forEach(item=>{
						let obj={
							name:item.name,
							id:item.imId,
							disabled:false
						}
						this.list.push(obj)
					})
				}
				this.getTel()

				})


			},
			getTel(){  //获取电话号码
				this.$Api.Common.CsTel({id:0}).then((res)=>{
					if(res.q.s==0){
						this.tel=res.q.csTel
						this.list.push({
							name: '拨打客服热线',
							disabled:false
						})

					}

					console.log(res)
				})
			},
			show() {
				this.isshow = true
			},
			onSelect(item){
				console.log(item)
				if(item.name=="拨打客服热线"){
					  window.location.href = "tel:"+this.tel;  //拨打电话
				}else{
					this.$router.push({
						name:"Talk",
						query:{
							im:item.id  //传imId
						}
					})
				}

				this.isshow=false

			}
		}
	}
</script>

<style scoped="scoped" lang="scss">

	img {
		position: absolute;
		width: 100%;
		height: auto;
		z-index: 1;
	}

	.serve {
		position: fixed;
		right: 0.3rem;
		bottom: 2.5rem;
		width: 1rem;
		height: 1rem;
		z-index: 30;
		background: url(../../assets/my/组3@3x.png) no-repeat;
		background-size: 100%;
		opacity: 0.7;
		border-radius: 50%;
		/*box-shadow:0.01rem 0rem 0.16rem rgba(0,0,0,0.2);*/
	}
</style>
