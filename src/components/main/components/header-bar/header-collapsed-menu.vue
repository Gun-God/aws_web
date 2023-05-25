<template>
    <Dropdown ref="dropdown" @on-click="handleClick">
      <a href="javascript:void(0)">
        <Icon type="md-menu" size="26"></Icon>
      </a>
      <DropdownMenu slot="list">
        <template v-for="item in menuList">
          <DropdownItem v-if="!showChildren(item) && (!item.meta || (item.meta && !item.meta.hideInMenu))"
          :name="getNameOrHref(item,true)"
          >
          {{showTitle(item)}}</DropdownItem>
          <Dropdown v-if="showChildren(item) && (!item.meta || (item.meta && !item.meta.hideInMenu))" :placement="placement">
            <DropdownItem>{{showTitle(item)}}
              <Icon type="ios-arrow-forward"></Icon>
            </DropdownItem>
            <DropdownMenu slot="list">
                     <DropdownItem v-for ="subItem in item.children"
                     v-if=" !subItem.meta || (subItem.meta && !subItem.meta.hideInMenu)" 
                     :name="getNameOrHref(subItem)"
                      >{{showTitle(subItem)}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </DropdownMenu>
    </Dropdown>
  </template>
  <script>
  import mixin from '../side-menu/mixin'
  import itemMixin from '../side-menu/item-mixin'
  import { findNodeUpperByClasses } from '@/libs/util'
  
  export default {
    name: 'HeaderCollapsedMenu',
     mixins: [ mixin, itemMixin ],
    props: {
      hideTitle: {
        type: Boolean,
        default: false
      },
      rootIconSize: {
        type: Number,
        default: 16
      },
      menuList: {
      type: Array,
      default() {
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
        placement: 'right-end'
      }
    },
    methods: {
      handleClick (name) {
        this.$emit('on-click', name)
      },
      handleMousemove (event, children) {
        const { pageY } = event
        const height = children.length * 38
        const isOverflow = pageY + height < window.innerHeight
        this.placement = isOverflow ? 'right-start' : 'right-end'
      },
      getNameOrHref (item,children0) {
     return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    },
    },
    mounted () {
      let dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer'])
      if (dropdown) dropdown.style.overflow = 'visible'
    }
  }
  </script>
  