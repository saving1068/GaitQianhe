<template>
	<div class="warp">
		<div class="seach">
			<van-search placeholder="搜索感兴趣的目的地" v-model="seachValue" @search="onSearch" @cancel="onCancel"/>
		</div>
		<div class="place_List">
			<div class="place_item" v-for="(v,i) in place_List">
				<div class="place_img"></div>
				<div class="place_val">
					<div class="place_val_top">马尔代夫（国外国家）</div>
					<div class="place_val_bottom">亚洲 目的地</div>
				</div>
			</div>
		</div>
	</div> 
</template>

<script>
	export default{
		data(){
			return{
				seachValue:"",
				place_List:[1,2,3,4]
			}
		},
		methods:{
			onSearch(){
				console.log('搜索感兴趣的目的地')
			},
			onCancel(){
				console.log('取消搜索目的地')
			},
		}
	}
</script>

<<style scoped="scoped" lang="scss">
	.warp{
		padding: .24rem 0;
		.seach{
			width: 100%;
		}
		.place_List{
			padding: 0 .24rem;
			.place_item{
				overflow: hidden;
				padding: .29rem 0;
				border-bottom: 0.01rem solid #EDEDED;
				.place_img{
					width:0.5rem;
					height:0.5rem;
					background-image:url(../../assets/travels_img_location@2x.png) ;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					float: left;
					margin-top: .15rem;
				}
				.place_val{
					float: left;
					padding-left: .3rem;
					.place_val_top{
						font-size:0.28rem;
						color:rgba(51,51,51,1);
					}
				}
				.place_val_bottom{
					font-size:0.22rem;
					color:rgba(153,153,153,1);
				}
			}
		}
	}
</style>
<style lang="scss">
	.seach{
		.van-search{
			.van-icon-search{
				color: #FADC56 ;
			}
		}
	}
</style>