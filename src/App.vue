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
	width: 5px;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

.ivu-table-body::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 20px;
	box-shadow: inset 0 0 5px #beccf1;
	background: #beccf1;
}

.ivu-table-body::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	box-shadow: inset 0 0 5px #f8f9fe;
	border-radius: 20px;
	background: #f8f9fe;
}


/* cascader 级联选择器 */

.ivu-cascader-menu {
	overflow-y: auto;
}

.ivu-cascader-menu::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 10px;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

.ivu-cascader-menu::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 10px;
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
	margin: 10px;
	overflow: hidden;
	text-align: center;
}</style>
