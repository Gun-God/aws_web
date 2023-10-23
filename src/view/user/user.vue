<template>
  <div>
    <!-- <label prop="name">&nbsp;姓名：&nbsp;</label> -->
    <!-- <Input v-model="companyName" id="pp" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp; -->
    <!-- <Button @click="search" type="primary" icon="ios-search">查询</Button>&nbsp;&nbsp; -->
    <Button type="primary" @click="addBus" icon="ios-add-circle-outline">新增</Button>
    <Table border :columns="columns1" :data="tableData" size="small" ref="table" highlight-row :height="tableHeight"
      :row-class-name="rowClassName" class="lll">
      <template slot-scope="{ row }" slot="name">
        <!-- <strong>{{ row.name }}</strong> -->
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Poptip style="text-align:left;margin-right:.5rem;" confirm title="您确定要删除该信息?" placement="left"
          @on-ok="remove(index, row.id)" @on-cancel="cancel1">
          <Button type="error" size="small">删除</Button>
          <!-- @click="remove(index)" -->
        </Poptip>
        <Button v-show="isShow(row.id)" type="primary" size="small" style="margin-right:.5rem;"
          @click="resettingPwd(row.id)">重置</Button>

        <Button type="warning" size="small" @click="editBus(row, index)">编辑</Button>
        <!-- 前面的小图标会居中挡住文字  设置一下样式就好了 style="text-align:left" -->

        <!-- <Button type="primary" size="small" style="margin-left;: 5px" @click="show(index)">重置密码</Button> -->


      </template>
    </Table>
    <!-- <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="[10, 20, 50, 100, 500]" size="small" prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page> -->
    <Modal v-model="handleModal" :title="modalTitle" :footer-hide="true" :mask-closable="false" width="680"
      @on-visible-change="handleReset('formValidate')">
      <Form inline ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
        <row :gutter="24">
          <Col span="12">
          <FormItem label="账号" prop="username">
            <Input v-model="formValidate.username" placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
            </RadioGroup>

          </FormItem>
          <!-- <FormItem label="密码" prop="password">
            <Input v-model="formValidate.password" placeholder="密码默认为123456"></Input>
          </FormItem> -->
          </Col>
          <Col span="12">
          <FormItem label="电话" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入座机电话"></Input>
          </FormItem>
          <FormItem label="手机" prop="mobilePhone">
            <Input v-model="formValidate.mobilePhone" placeholder="请输入手机号"></Input>
          </FormItem>
          <FormItem label="检测站" prop="orgCode">
            <Input v-model="formValidate.orgCode" placeholder="请输入座机电话"></Input>
          </FormItem>
          </Col>
        </row>
        <FormItem>
          <!-- 提交的单击事件  在下面的方法里面写好 -->
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>&nbsp;&nbsp; &nbsp;
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 分页控件 -->
    <!-- <div>
      <Page :total="page.total" :current="page.index" :page-size="page.size" :page-size-opts="[10, 20, 50, 100, 500]"
        size="small" prev-text="上一页" next-text="下一页" show-total show-elevator show-sizer @on-change="changeIndexPage"
        @on-page-size-change="changePageSize"></Page>
    </div> -->




    <!-- <div class="page-info">
      <div>
        <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="pageList" prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page>
      </div>
    </div> -->
  </div>
</template>
<script>
import './user.less';

import { updateById, getUserDataList, registerNewUser, deleteById, removePwd } from '@/api/user'
import validator from 'validator'


export default {
  name: 'user_page',
  data() {
    return {
      companyName: "",
      modalTitle: "",
      // modal开始为false
      handleModal: false,
      //规则
      ruleValidate: {
        name: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
            validator: (rule, value, callback) => {
              if (value=='') {
                callback(new Error('必填项！'))
              } else {
                callback()
              }
            }
          }],
        username: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
            validator: (rule, value, callback) => {
              if (value=='') {
                callback(new Error('必填项！'))
              } else {
                callback()
              }
            }
          }],
        mobilePhone: [
          { required: true, trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (validator.isMobilePhone(value, 'zh-CN')) {
                callback()
              } else {
                callback(new Error('手机号码格式不正确'))
              }
            }
          }
        ],
        //orgName: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了
      formValidate: {
        name: "",
        username: "",
        mobilePhone: "",
        orgCode: "",
        sex: "1",
        phone: "",
        password: "",

      },
      // 初始化信息总条数
      dataCount: 0,
      //当前页数
      current: 1,
      // 每页显示多少条
      pageSize: 50,

      // 设置table的表头
      columns1: [
        {
          title: "序号",
          type: "index",
          // type: 'selection',

        },
        // {
        //   title: "id",
        //   key: "id",
        //   className:"userId",
        //   sortType: "asc",

        // },

        {
          title: "账号",

          align: "center",
          key: "username"
        },
        {
          title: "工号",
          align: "center",
          key: "userCode"
        },
        {
          title: "姓名",
          align: "center",
          key: "name"
        },
        {
          title: "性别",
          align: "center",
          key: "sex",
          render: (h, params) => {
            const data = params.row.sex
            //console.info(params)
            if (data == 0)
              return h('span', '男');
            else
              return h('span', '女');

          }
        },
        {
          title: "电话",
          align: "center",
          key: "phone"
        },
        {
          title: "手机",
          align: "center",
          key: "mobilePhone"
        },
        {
          title: "检测站",
          align: "center",
          key: "orgName"
        },
        {
          title: "创建时间",
          align: "center",
          key: "creatTime"
        },
        {
          title: "修改时间",
          align: "center",
          key: "updateTime"
        },
        {
          title: "操作",
          slot: "action",
          width: 240,
          align: "center"
        }
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData: [],
      tableHeight: 0,
      pageList: [30, 50, 100, 500],
    };
  },
  // 方法
  methods: {
    // ok() { },
    // cancel() { },
    // // 查找按钮
    // search() {
    isShow(id) {
      var id1 = localStorage.getItem('userId')-0;
      if (id === id1) {
        return false;
      } else {
        return true;
      }

    },


    // },
    // 新增按钮的单击事件
    addBus() {
      this.handleModal = true;
      this.modalTitle = "新增";
    },
    // 新增数据
    handleSubmit(name) {
      var self = this;
      self.$refs[name].validate(valid => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(self.formValidate));
          //console.info(params)
          if (self.modalTitle == "修改") {


            updateById(params).then(res => {
              const data = res.data;
              if (data.code != 200) {
                self.$Message.error(data.msg);
              } else {
                this.$set(self.tableData, self.itemIndex, params);
                self.$Message.success("修改成功!");

                self.handleModal = false;
              }

            }).catch(err => {

              self.$Message.error(err.data.msg);

            })

          } else {
            params.id = null;
            registerNewUser(params).then(res => {
              const data = res.data;
              if (data.code != 200) {
                self.$Message.error(data.msg);
              } else {
                self.$Message.success("新增成功!");
                self.tableData.push(params);
                self.handleModal = false;
              }

            }).catch(err => {
              // self.$Message.error("新增失败!");
              self.$Message.error(err.data.msg);

            })

          }

        }
      });
    },
    // 修改方法
    editBus(item, index) {
      this.handleModal = true;
      this.modalTitle = "修改";
      this.itemIndex = index;
      this.formValidate = JSON.parse(JSON.stringify(item));
      this.formValidate.sex = this.formValidate.sex + ""
      //console.info(this.formValidate)
    },
    // 删除一条数据
    remove(index, id) {
      ////console.info(index)
      deleteById(id).then(res => {
        const data = res.data;
        //debugger
        if (data.code == 200) {
          this.tableData.splice(index, 1);
          // on-click  方法 冒泡提示确定
          this.$Message.success("删除成功");
        } else {
          this.$Message.error("删除失败");
        }

      }).catch(err => {
        this.$Message.error("删除失败");
      })

    },
    cancel1() {
      this.$Message.info("取消删除");
    },
    // 清除文本框  重置
    handleReset(name) {

      //console.info(111)
      this.$refs[name].resetFields();
    },
    // 详情显示
    show(index) {
      this.$Modal.info({
        title: "查看详情",
        content: `姓名:${this.tableData[index].name}<br>年龄:${this.tableData[index].age}
           <br>爱好:${this.tableData[index].address}<br>性别:${this.tableData[index].sex}
           `
      });
    },

    resettingPwd(id) {
      removePwd(id).then(res => {
        const data = res.data;
        if (res.status == 200) {

          // on-click  方法 冒泡提示确定
          this.$Message.success("密码重置成功");
        } else {
          this.$Message.error("密码重置失败");
        }

      }).catch(err => {
        this.$Message.error("操作失败");
      })
    },

    handleListApproveHistory() {
      getUserDataList(this.current, this.pageSize).then(res => {
        const data = res.data.data;
        this.tableData = data.list;
        this.dataCount = data.total;
      }).catch(err => {
        //console.info(err)
      })

    },

    changepage(index) {
      this.current = index;
      this.handleListApproveHistory();
    },
    changePageSize(size) {
      //console.info(size);
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    rowClassName(row, index) {

      return 'demo-table-info-row';

    },

  },

  // 这个应该是加载事件  加载页面的时候就调用
  // mounted() {
  //   // 页面一加载就将数据给出给表格
  //   this.tableData = testData.histories;
  // },
  created() {
    this.handleListApproveHistory();
  },
  mounted() {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 30
  },
  computed: {
    colHidden: function () { //重点
      return this.columns.filter(function (e) {
        return !e.hidden;
      });
    },
  }
};
</script>