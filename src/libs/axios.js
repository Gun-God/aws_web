import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'
// import { Spin } from 'iview'
import { setToken,getToken} from '@/libs/util'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        'Content-Type': 'application/json',
        'Authorization': getToken()
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
     //  debugger
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      console.info("断网")
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if (res.data.code == 5000 && res.data.msg != "账号或密码错误") {
        Message.error('登录状态已过期');

        setTimeout(function () {
          localStorage.setItem('token', '');
          setToken('');
          window.location.href = '/login'
          // 需要执行的代码		
        }, 1000); // 定时时间


        return;
      }
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {


      // const { response } = error;
      // console.log(94,response)
      // if (response) {
      //   // 请求已发出，但是不在2xx的范围 errorHandle为解析错误码
      //   errorHandle(response.status, response.data.message);
      //   return Promise.reject(response);
      // } else {
      //   // 处理断网的情况
      //   // eg:请求超时或断网时，更新state的network状态
      //   // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      //   // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      //   store.commit('changeNetworkSuccess', false);
      //   tip('网络异常!');
      //   router.push({path:'refresh'})
      // }


      debugger
      this.destroy(url)
      let errorInfo = error.response
      let msg=error.message
      if(msg.includes("Network")){
        Message.error('网络异常!');
      }
     
    
      if (!errorInfo) {
        let code=errorInfo.status;
        if(code==400){
          Message.error('接口请求异常!');
        }

        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

}
export default HttpRequest
