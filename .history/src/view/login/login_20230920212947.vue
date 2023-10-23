<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
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
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      // 'getUserInfo'
    ]),//这一步也绑定了后端控制器中的login，不过是通过先映射到store文件夹（用于存储登录），然后再映射到login
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
          res=res.data;
       //   //debugger
          //console.info(res)
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
  }
}
</script>

<style>

</style>
