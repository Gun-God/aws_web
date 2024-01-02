<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" :bordered="false">
        <template #title>
        <div class="logo-con">
          <Row  :gutter="24" style="display: flex" justify="center">
          <Col span="3">
          <img  :src="minLogo" key="min-logo" />
           </Col>
           <Col span="17" style="display:flex; align-items:center;">
           <span>治超治限管理系统</span>
            </Col>
          </Row>
        </div>
          
        </template>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import minLogo from '@/assets/images/logo.png'
export default {
  components: {
    LoginForm
  },
  data() {
    return {
    now_iShow: false,
    minLogo: minLogo,
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      // 'getUserInfo'
    ]), // 这一步也绑定了后端控制器中的login，不过是通过先映射到store文件夹（用于存储登录），然后再映射到login
    handleSubmit ({ userName, password }) {
      const that = this;
      this.handleLogin({ userName, password }).then(res => {
          res = res.data;
          
          // that.now_iShow=res.data.ishow;
       //   //debugger
        //  this.$router.go(0);
          // console.info(res)
          if (res.code == 200) {
            this.$router.push({
              name: this.$config.homeName
            })
          } else {
            this.$Message.error(res.msg);
          }
        // this.getUserInfo().then(res => {

        // })
      })
    }
  },
  mounted () {
    // console.info("mmmmounted!");
    // this.$router.go(0);
  },
  destroyed() {
    // let roleId=
    // if()
    // debugger
    // let storeShow= localStorage.getItem('iShow')==='true'?true:false;
    // if(this.now_iShow!=storeShow)
      this.$router.go(0);
  }
}
</script>

<style>

</style>
