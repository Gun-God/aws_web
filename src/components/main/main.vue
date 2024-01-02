<template>
  <Layout style="height: 100%" class="main">

    <!-- <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
      
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu> 
    </Sider> -->

    <!-- <Heade hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <header-menu accordion ref="HeaderMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
      
      </header-menu> 
    </Heade> -->

    <Layout>
      <Header class="header-con">
        <div class="logo-con">
          <img v-show="!collapsed" :src="minLogo" key="min-logo" />
        </div>
        <header-bar accordion ref="sideMenu" :collapsed="collapsed" @on-coll-change="handleCollapsedChange"
          @on-select="turnToPage" :menu-list="menuList" :active-name="$route.name">
         <user :message-unread-count="unreadCount" :user-avatar="userAvatar" /> 
          <!-- <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/> -->
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
            :has-read="hasReadErrorPage" :count="errorCount"></error-store>

          <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;line-height: 4.5rem;" /> -->
           <div class="uName-Div">
           <p class="uName">欢迎！{{userName}}</p>
          </div>

          <div>
           <div class="time-div">
            <p class="now-time">
              {{ nowTime }}

            </p>
            </div>
            <!-- <p class="now-date">
              {{ nowDate }}
            </p> -->
          </div>
         
        <div v-if="displaySelect" class="header-select">
      <Dropdown @on-click="checkClick">
      
      <a>检测站</a>
      
      <Icon :size="18" type="md-arrow-dropdown"></Icon>

      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="ALL">
          <a> 所有检测站 </a>
        </DropdownItem>
        <DropdownItem  v-for="(item,index) in checkList" :key="index+1" :name="index">
          <a> {{checkList[index].name}} </a>
          </DropdownItem>
        <!-- <DropdownItem name="">
          修改密码
        </DropdownItem>
        <DropdownItem name="">退出登录</DropdownItem> -->
      </DropdownMenu>
      </Dropdown>
        </div>

        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div v-if="navBarDisplay" class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
      <footer>
      <CopyRight></CopyRight>
    </footer>
    </Layout>
   
  </Layout>
 
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderMenu from './components/header-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo.png'
// import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
import { selectAllOrg, selectAllPerCheckOrg } from '@/api/nspOrg'
import { getLunar } from 'chinese-lunar-calendar'
import CopyRight from './components/copy-right/copy-right.vue'

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    CopyRight
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      isFullscreen: false,
      nowTime: "2023年05月12日 13:10:00",
      nowDate: "戊戌年四月初三 星期五",
      getLunar: [],
      weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      day: new Date().getDay(),
      checkList: [],
      userName: "",
      navBarDisplay: false,
      displaySelect: false,
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    tagRouter() {
      return this.$store.state.app.tagRouter
    },
    userAvatar() {
      return this.$store.state.user.avatarImgPath
    },
    cacheList() {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList() {
      return this.$store.getters.menuList
    },
    local() {
      return this.$store.state.app.local
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount() {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      // 'getUnreadMessageCount'
    ]),
    turnToPage(route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      }, () => {}, () => {})
    },
    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick(item) {
      this.turnToPage(item)
    },

    setNowTimes() {
      // 获取当前时间
      let myDate = new Date()
      let yy = String(myDate.getFullYear())
      let mm = myDate.getMonth() + 1
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
      let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())

      this.nowDate = yy + '-' + mm + '-' + dd
      this.nowTime = yy + '年' + mm + '月' + dd + "日 " + hou + ':' + min + ':' + sec
      this.getLunar = getLunar(yy, mm, dd);
      // this.getLunar.zodiac+"年 "+
      this.nowDate = this.getLunar.lunarYear + this.getLunar.dateStr + " " + this.weeks[this.day];
    },
    checkClick(name) {
      // alert(name);
      if (name == "ALL") {
        // debugger
        localStorage.setItem("orgCode", "9999");
         this.$router.go(0);
      } else {
      let org_code = this.checkList[name].code;
      localStorage.setItem("orgCode", org_code);
       this.$router.go(0);
      }
    },    
    getAllCheckStation() {
      // 查询检测站
      
      // debugger
      const that = this;
      let rid = localStorage.getItem("roleId");
      if (rid == 1 || rid == "1") {
        // 拉取所有的检测站
        selectAllPerCheckOrg().then(res => {
        // debugger
          console.info(res.data.data);
        that.checkList = res.data.data;
      }).catch(err => {
        console.info(err)
      })
      }
    },
    displaySelectCheck() {
      const that = this;
      let rid = localStorage.getItem("roleId");
       if (rid == 1 || rid == "1") {
          that.displaySelect = true;
       }
    },
    setLoginName() {
      this.userName = localStorage.getItem("name");
    }

  },
  watch: {
    '$route'(newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      }, () => {}, () => {})
    }
    this.setLoginName();
    // this.displaySelectCheck();
    // 获取未读消息条数
    // this.getUnreadMessageCount();
    this.setNowTimes();
    clearInterval(myTimeDisplay);// 销毁之前定时器
    var myTimeDisplay = setInterval(() => {
      this.setNowTimes(); // 每秒更新一次时间
    }, 1000);
    this.getAllCheckStation();
  }
}
</script>