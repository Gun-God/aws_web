<template>
  <div>
    <!-- <label prop="name">&nbsp;姓名：&nbsp;</label>
    <Input v-model="companyName" id="pp" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
    <Button @click="search" type="primary" icon="ios-search">查询</Button>&nbsp;&nbsp; -->
    <!-- <Button type="primary" @click="addBus" icon="ios-add-circle-outline">新增</Button> -->
    <Table border :columns="columns1" :data="tableData" size="small" ref="table" highlight-row :height="tableHeight">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="warning" style="margin-right: 5px" size="small" @click="editBus(row, index)">编辑</Button>
        <!-- 前面的小图标会居中挡住文字  设置一下样式就好了 style="text-align:left" -->
        <!-- <Poptip style="text-align:left" confirm title="您确定要删除该信息?" placement="left-end" @on-ok="remove(index)"
          @on-cancel="cancel1">
          <Button type="error" size="small">删除</Button>
          @click="remove(index)" 
        </Poptip>-->
      </template>
    </Table>
    <!-- <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="[10, 20, 50, 100, 500]" size="small" prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page> -->
    <Modal v-model="handleModal" title="编辑" :footer-hide="true" :mask-closable="false" width="680"
      @on-visible-change="handleReset('formValidate')">
      <Form inline ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
        <row :gutter="24">
          <Col span="12">
          <FormItem label="参数描述" prop="attributeName">
            <Input v-model="formValidate.attributeName" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="设定值" prop="msg">
            <Input v-model="formValidate.msg"  placeholder="请输入"></Input>
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
    <!-- <div style="margin: 10px;overflow: hidden">
      <div style="float:left">
        <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="pageList"  prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page>
      </div>
    </div> -->
  </div>
</template>
<script>

import Cookies from 'js-cookie';

import { getSettingsList, updateById } from '@/api/systemSetting'


export default {
  name: 'static_table_page',
  data() {
    return {
      companyName: "",
      // modal开始为false
      handleModal: false,
      //规则
      ruleValidate: {
        attributeName: [{ required: true, type: 'string', message: "描述不能为空！", trigger: ['blur','change'] }],
        msg: [{ required: true, message: "参数不能为空！", trigger: ['blur','change'] }],
      },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了
      formValidate: {
        attributeName: "",
        msg: "",
      },


      // 设置table的表头
      columns1: [
        // {
        //   title: "序号",
        //   type: "index",
        //   width: 70
        // },
        {
          title: "参数描述",
          key: "attributeName"
        },
        {
          title: "设定值",
          key: "msg"
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        }
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData: [],
      tableHeight: 0,

    };
  },
  // 方法
  methods: {

    // 新增按钮的单击事件
    addBus() {
      this.handleModal = true;
      this.modalTitle = "新增";
    },

    // 提交数据
    handleSubmit(name) {
      debugger
      var self = this
      self.$refs[name].validate(valid => {
        debugger
        if (valid) {
          var params = JSON.parse(JSON.stringify(self.formValidate));
          // let formData = new FormData();
          // formData.append("id",1);
          // formData.append("msg",50000);
           //console.info(params)
          // //console.info(formData)
          updateById(params).then(res => {
            if (self.modalTitle == "新增") {
            // 获取需要渲染到页面中的数据
            self.$Message.success("新增成功!");
            self.tableData.push(params);
          } else {
            this.$set(self.tableData, self.itemIndex, params);
            self.$Message.success("修改成功!");
          }
          self.handleModal = false;
          }).catch(err => {
          
            self.$Message.error(err.data.msg);
          
          })



         
        } else {
          if (self.modalTitle == "新增") {
            self.$Message.error("新增失败!");
          } else {
            self.$Message.error("修改失败!");
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
    },
    // 删除一条数据
    remove(index) {
      this.tableData.splice(index, 1);
      // on-click  方法 冒泡提示确定
      this.$Message.success("删除成功");
    },
    cancel1() {
      this.$Message.info("取消删除");
    },
    // 清除文本框  重置
    handleReset(name) {
      //console.info(name);
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
    getSettingsList() {
      getSettingsList().then(res => {
        this.tableData = res.data.data;
      }).catch(err => {
        //console.info(err)
      })

    },


  },

  // 这个应该是加载事件  加载页面的时候就调用
  // mounted() {
  //   // 页面一加载就将数据给出给表格
  //   this.tableData = testData.histories;
  // },
  created() {
    this.getSettingsList();
  },
  mounted() {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80
  }
};
</script>