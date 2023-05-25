<template>
  <div class="header-bar">
    <!-- <HeaderCollapsedMenu :menuList="menuList" @on-click="handleSelect" /> -->
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <label>治超治限管理系统</label>
    <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion"
      :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <header-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></header-menu-item>
          <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><common-icon
              :type="item.children[0].icon || ''" /><span>{{ showTitle(item.children[0]) }}</span></menu-item>
        </template>
        <template v-else>
          <header-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></header-menu-item>
          <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon
              :type="item.icon || ''" /><span>{{ showTitle(item) }}</span></menu-item>
        </template>
      </template>
    </Menu>
  
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import HeaderMenuItem from '../header-menu/header-menu-item.vue'
import HeaderCollapsedMenu from './header-collapsed-menu.vue'
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
import mixin from '../side-menu/mixin'
export default {
  name: 'HeaderBar',
  mixins: [mixin],
  components: {
    siderTrigger,
    customBreadCrumb,
    HeaderCollapsedMenu,
    HeaderMenuItem
  },
  props: {
    collapsed: Boolean,
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    }
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {

    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state)
    },
    handleSelect (name) {
      this.$emit('on-select', name)
    },
   
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  },
  // mounted () { //这个属性就可以，在里面声明初始化时要调用的方法即可
  //     // we can implement any method here like
     
  //   }
}
</script>
