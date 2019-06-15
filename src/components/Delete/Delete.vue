<template>
		<div class="delete">
			<div class="delet_sure">
				<div class="delet_sure_top">
					是否确认删除？
				</div>
				<div class="delet_sure_btn">
					<div @click="cancelDelete" class="delet_sure_btn_item">取消</div>
					<div @click="sureDelete" class="delet_sure_btn_item">确定</div>
					<div class="shu"></div>
				</div>
			</div>
		</div>
</template>

<script>
	export default{
		created(){
			console.log(111)
		},
		data(){
			return{
				
			}
		},
		methods:{
			sureDelete(){//console.log("确认删除")
				this.$emit('delete', false)
			},
			cancelDelete(){//console.log("取消删除")
				this.$emit("cancel",false)
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.delete{
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 2000;
			background: rgba(0, 0, 0, .5);
	}
	.delet_sure{
		position: fixed;
		box-sizing: border-box;
		width: 5.56rem;
		height: 3.7rem;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		z-index: 2000;
		border-radius: 0.1rem;
		.delet_sure_top{
			height: 2.84rem;
			text-align: center;
			line-height: 2.84rem;
		}
		.delet_sure_btn{
			height: 0.86rem;
			background: #FCE790;
			position: relative;
			border-bottom-right-radius:0.1rem ;
			border-bottom-left-radius:0.1rem ;
			.delet_sure_btn_item{
				width: 50%;
				text-align: center;line-height: .86rem;
				font-size: .3rem;
				color: #333333;
				float: left;
			}
			.shu{
				position: absolute;
				width:0.02rem;
				height:0.44rem;
				background:rgba(255,255,255,1);
				top: 0.2rem;
				left: 2.78rem;
			}
		}
	}
</style>