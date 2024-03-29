// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//import iView from 'iview'
import ViewUI from 'view-design';

// import style
import 'view-design/dist/styles/iview.css';
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import 'view-design/dist/styles/iview.css';
import '@/assets/fonts/font.css';
import echarts from "echarts";
import filters from '@/libs/filters'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
    navbar: false, //底部缩略图
    toolbar: true, //底部工具栏
    button: false, //右上角按钮
    title: false, //当前图片标题
    movable: true, //是否可以移动
    zoomable: true, //是否可以缩放
    transition: false //使用 CSS3 过度
})

Vue.prototype.$echarts = echarts;


//全局filter
Object.keys(filters).forEach(k => {
  Vue.filter(k, filters[k])
})

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// Vue.use(iView, {
//   i18n: (key, value) => i18n.t(key, value)
// })
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

console.log = function () { }

/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
