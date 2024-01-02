<style lang="less">
  .vertical-center-modal2{

        display: flex;
        align-items: center;
        justify-content: center;

    .ivu-radio{
      font-size: 2vh !important;
    }

     .ivu-modal{
        top: -20vh;
        right: -20vw;
        width: 25vw !important;
        // height: 90vh !important;
      
    }

    .ivu-modal-header-inner{
      height: 40px;
      height: 40px;
      font-size: 21px;
      line-height: 40px;
    }

    .ivu-form .ivu-form-item-label
    {
        font-size: 2vh !important;
    }

    .ivu-input{
      height: 4vh;
      font-size: 2vh;
    }

     .ivu-radio-warpper{
      font-size: 2vh !important;
  
     }

    .xuanxiang{
      font-size: 2vh !important;
    }

    .anniu{
      font-size: 2vh !important;
      letter-spacing: 1px;
      font-weight: bold;
    }

    .ivu-button span{
      font-size: 2vh !important;
    }

    .ivu-select-single .ivu-select-input{
            font-size: 2vh !important;

    }

    .ivu-select-item{
      font-size: 2vh !important;
    }

  }

</style>

<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar"/>
      </Badge> -->
      <Badge>
        <Avatar :src="userAvatar" >
          <!-- <Icon type="md-contact" size="30"/> -->
        </Avatar>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem class="dropItem" name="message">
          <p>修改密码</p>
        </DropdownItem>
        <DropdownItem class="dropItem" name="logout">
          <p>退出登录</p>
          </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Modal 
          class-name="vertical-center-modal2"
    v-model="handleModal" title="修改密码" :footer-hide="true" :mask-closable="true"
      @on-visible-change="handleReset('formValidate')" 
         width="480">
      <Form  ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">

        <FormItem label="原始密码" prop="oldPassword">
          <Input v-model="formValidate.oldPassword" placeholder="请输入原始密码" type="password"></Input>
        </FormItem>
        <FormItem label="新密码" prop="password">
          <Input v-model="formValidate.password" placeholder="请输入新密码" type="password"></Input>
        </FormItem>
        <FormItem label="再次确认" prop="password1">
          <Input v-model="formValidate.password1" placeholder="请输入再次输入新密码" type="password"></Input>
        </FormItem>
        <!-- <FormItem label="密码" prop="password">
            <Input v-model="formValidate.password" placeholder="密码默认为123456"></Input>
          </FormItem> -->

        <FormItem>
          <!-- 提交的单击事件  在下面的方法里面写好 -->
          <Row :gutter="24" >
            <Col span="2"></Col>
            <Col span="8">
              <Button type="primary" @click="handleSubmit('formValidate')"
                ><span class="anniu">提交</span></Button
              >&nbsp;&nbsp; &nbsp;
            </Col>
            <Col span="8">
              <Button
                @click="handleReset('formValidate')"
                style="margin-left: 8px"
                ><span class="anniu">重置</span></Button
              >
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { modifyPwd } from '@/api/user'

export default {
  name: 'User',
  data() {
    return {
      handleModal: false,
      formValidate: {
        username: localStorage.getItem("username"),
        oldPassword: "",
        password: "",
        password1: "",
      },
      ruleValidate: {
        oldPassword: [{ required: true, message: "密码不能为空！", trigger: ['blur', 'change'] }],
        password: [{ required: true, min: 6, max: 12, message: "密码6-12个字符！", trigger: ['blur', 'change'] }],
        password1: [
          { required: true, min: 6, max: 12, message: "密码6-12个字符！", trigger: ['blur', 'change'] },
        ],
        // orgName: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      },
    }
  },
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        }, () => {}, () => {})
      })
    },
    message() {
      this.handleModal = true;
      // this.$router.push({
      //   name: 'message_page'
      // })
    },
    // 新增数据
    handleSubmit(name) {
      var self = this;
      self.$refs[name].validate(valid => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(self.formValidate));
          if (params.password != params.password1) {
            self.$Message.error("两次密码不一致");
            return;
          }
          /// /console.info(params)
          modifyPwd(params).then(res => {
            const data = res.data;
            if (data.code != 200) {
              self.$Message.error(data.msg);
            } else {
              self.$Message.success("修改成功!");
              self.handleModal = false;
              setTimeout(() => {
                self.logout();
              }, 1000)
            }
          }).catch(err => {
            self.$Message.error(err.data.msg);
          })
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleClick(name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
