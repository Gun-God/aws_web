<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="less">
.size {
	width: 100%;
	height: 100%;
}

html,
body {
	.size;
	overflow: hidden;
	margin: 0;
	padding: 0;
	//font-size: 1.1rem

}

#app {
	.size;
}

/* select 下拉选择器 */
.ivu-table tr td div {
	font-size: 1rem !important;
}

.ivu-table-body {
	overflow-y: auto;
}

.ivu-table-body::-webkit-scrollbar {
	/*滚动条整体样式*/
	//
	width: .05rem;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

.ivu-table-body::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 1rem;
	box-shadow: inset 0 0 5px #beccf1;
	background: #beccf1;
}

.ivu-table-body::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	box-shadow: inset 0 0 5px #f8f9fe;
	border-radius: 1rem;
	background: #f8f9fe;
}


/* cascader 级联选择器 */

.ivu-cascader-menu {
	overflow-y: auto;
}

.ivu-cascader-menu::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 0rem;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

.ivu-cascader-menu::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: .5rem;
	box-shadow: inset 0 0 5px #beccf1;
	background: #beccf1;
}

.ivu-cascader-menu::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	box-shadow: inset 0 0 5px #f8f9fe;
	border-radius: 10px;
	background: #f8f9fe;
}

.page-info {
	color: white;
	//background-color: #295587;
	// background-image: linear-gradient(to bottom, #0f2539 85%,#295587 );
	margin: 1rem;
	overflow: hidden;
	text-align: center;

	//line-height: normal;
	ul {
		//margin-top: .5rem;
	}
}

.input-search {
	margin-left: .3rem;
	margin-bottom: .3rem;
}

.img-custor {
	cursor: pointer;
}





// .ivu-table .demo-table-info-row td {
//     background-image: linear-gradient(to bottom, #00294c 85%,#133b68 );
// 	border-color: #777777 !important;

// }

//主div
.main-div{
	background-image: linear-gradient(to bottom, #0f2539 85%,#295587 );

}


//单元格
.ivu-table table td {
    background-image: linear-gradient(to bottom, #0f2539 85%,#1d3e63 );
	border-color: rgb(71, 71, 71) !important;

}

//表头
.ivu-table tr th {
	background-color: #114a8a;
	border-color: #1b4fb6;

}

//表格
.ivu-table {
    background-image: linear-gradient(to bottom, #0f2539 85%,#1d3e63 );
    // background-image: linear-gradient(to bottom, #002c52 90%,#133b68 );
	color: white !important;

	span {
		font-size: 1.1rem;

	}
	 .ivu-table-row-hover td{
		background-image: linear-gradient( #083c77);
		//background-color: #c1c82d !important;

	}
	


}


//表格边框
.ivu-table:before{
	background-color: #003767 !important;
}
.ivu-table:after {
	background-color: #003767 !important;

}




.lll {
	border-color: rgb(71, 71, 71) !important;
	//background-color: #003767 !important;
}

label {
	color: white !important;

}


//tabs
.ivu-tabs-nav .ivu-tabs-tab {
	font-size: 1rem;
	// border-color: #0161b5 !important;
	// background-color: #002c52 !important;
	color: white;
	//border:1px solid #0161b5 
//	border: none !important;
}
//修改输入框背景
.ivu-input{
	color: white !important;
	background-color: #002c52 !important;
}
.ivu-input-disabled{
	color: rgb(195, 195, 195) !important;
	background-color: #606264 !important;
}
//修改弹出框背景
.ivu-modal-content{
	background-color: #2e425c !important;

}
.ivu-modal-header .ivu-modal-header-inner{
	color: white !important;

}

.ivu-poptip-content{
	color: black;

}

.ivu-btn>i, .ivu-btn>span{
	line-height: 1.3rem;
}


</style>
