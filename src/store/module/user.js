import {
  login,
  logout,
  // getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

import userLogo from '@/assets/images/user.png'


export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: userLogo,
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim();
      //localStorage.setItem('token',"2122133");
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          debugger
          console.log(res)
          const data = res.data
          if (data.code == 200) {
            debugger
            console.info("登录成功");
             localStorage.setItem('token', data.data.token);
             commit('setToken', data.data.token);
             commit('setAccess', ['admin']);
             commit('setHasGetInfo', true);
            // commit('setAvatar', userLogo);
             //存储检测站id
             localStorage.setItem('orgCode', data.data.orgCode);
              //存储用户账号
             localStorage.setItem('username', data.data.username);
           //  commit('setOrgCode', data.data.orgCode);
            // localStorage.setItem('realName', res.res.realName)
            // localStorage.setItem('userId', res.res.id)
            // localStorage.setItem('userType', res.res.userType)
            // localStorage.setItem('roleList', JSON.stringify(res.res.roleList))
            // localStorage.setItem('resourceList', JSON.stringify(res.res.resourceList))
          }else{
            console.info("登录失败");
          }
      
            // initRouter() //chenlf 初始化路由
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // getToken() {

    //   const jwt = require("jsonwebtoken"); // 引入jwt

    //   // const secret = "this is a private key"; // 指定一个用于生成token的密钥字符串

    //   const secret = "wwf"; // 指定一个用于生成token的密钥字符串

    //   const token = jwt.sign({ foo: "bar" }, secret, {

    //     // 传入元数据和secret密钥，并指定过期时间生成token

    //     expiresIn: 200, // 单独一个数字表示多少秒

    //     // expiresIn: "10h", // 表示10小时后过期

    //     // expiresIn: "2d" // 表示2天后过期

    //   });
    //   console.log(777,`token is ${token}`);

    // },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {

        commit('setToken', '')
          localStorage.setItem('token', '')
          commit('setAccess', [])
          resolve()
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   localStorage.setItem('token', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    //获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //       getUserInfo(state.token).then(res => {
    //         const data = res.data
    //         console.info(data)
    //         //commit('setAvatar', data.avatar)
    //         commit('setUserName', data.username)
    //         //commit('setUserId', data.user_id)
    //         //commit('setAccess', data.access)
    //         commit('setHasGetInfo', true)
    //         resolve(data)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    // getUnreadMessageCount ({ state, commit }) {
    //   getUnreadCount().then(res => {
    //     const { data } = res
    //     commit('setMessageCount', 1)
    //   })
    // },
    // // 获取消息列表，其中包含未读、已读、回收站三个列表
    // getMessageList ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     getMessage().then(res => {
    //       const { unread, readed, trash } = res.data
    //       commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageReadedList', readed.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageTrashList', trash.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 根据当前点击的消息的id获取内容
    // getContentByMsgId ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     let contentItem = state.messageContentStore[msg_id]
    //     if (contentItem) {
    //       resolve(contentItem)
    //     } else {
    //       getContentByMsgId(msg_id).then(res => {
    //         const content = res.data
    //         commit('updateMessageContentStore', { msg_id, content })
    //         resolve(content)
    //       })
    //     }
    //   })
    // },
    // // 把一个未读消息标记为已读
    // hasRead ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     hasRead(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageUnreadList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       commit('setMessageCount', state.unreadCount - 1)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 删除一个已读消息到回收站
    // removeReaded ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     removeReaded(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageReadedList',
    //         to: 'messageTrashList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 还原一个已删除消息到已读消息
    // restoreTrash ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     restoreTrash(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageTrashList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}
