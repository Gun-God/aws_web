<template>
  <div>
    <label prop="name">&nbsp;姓名：&nbsp;</label>
    <Input v-model="companyName" id="pp" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
    <Button @click="search" type="primary" icon="ios-search">查询</Button>&nbsp;&nbsp;
    <Button type="primary" @click="addBus" icon="ios-add-circle-outline">新增</Button>
    <Table border :columns="columns1" :data="tableData" size="small" ref="table"  highlight-row :height="tableHeight" >
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">详情</Button>
        <Button type="warning" style="margin-right: 5px" size="small" @click="editBus(row, index)">编辑</Button>
        <!-- 前面的小图标会居中挡住文字  设置一下样式就好了 style="text-align:left" -->
        <Poptip style="text-align:left" confirm title="您确定要删除该信息?" placement="left-end" @on-ok="remove(index)"
          @on-cancel="cancel1">
          <Button type="error" size="small">删除</Button>
          <!-- @click="remove(index)" -->
        </Poptip>
    
      </template>
    </Table>
    <!-- <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="[10, 20, 50, 100, 500]" size="small" prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page> -->
    <Modal v-model="handleModal" title="新增/编辑" @on-ok="ok" @on-cancel="cancel" :footer-hide="true" :mask-closable="false"
      width="680" @on-visible-change="handleReset('formValidate')">
      <Form inline ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
        <row :gutter="24">
          <Col span="12">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="年龄" prop="age">
            <Input v-model="formValidate.age" placeholder="请输入年龄"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="地址" prop="address">
            <Input v-model="formValidate.address" placeholder="请输入你的爱好"></Input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Input v-model="formValidate.sex" placeholder="别不男不女"></Input>
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




    <div class="page-info">
      <div >
        <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="pageList"  prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>

import Cookies from 'js-cookie';
const testData = {
  histories: [
    {
      name: "老王",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    },
    {
      name: "张三",
      age: 18,
      sex: "男",
      address: "北京市西城区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "张五",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "国基",
      age: 18,
      sex: "男",
      address: "北京市朝阳区"
    },
    {
      name: "老王",
      age: 18,
      sex: "女",
      address: "北京市海淀区"
    },
    {
      name: "张三",
      age: 18,
      sex: "女",
      address: "北京市昌平区"
    },
    {
      name: "张欧",
      age: 18,
      sex: "女",
      address: "北京市通州区"
    },
    {
      name: "张五",
      age: 18,
      sex: "女",
      address: "北京市顺义区"
    },
    {
      name: "国基",
      age: 18,
      sex: "女",
      address: "北京市东城区"
    }
  ]
};

export default {
  name: 'static_table_page',
  data() {
    return {
      companyName: "",
      // modal开始为false
      handleModal: false,
      //规则
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空！", trigger: ['blur','change'] }],
        age: [{ required: true, message: "年龄不能为空！", trigger: ['blur','change'] }],
        address: [
          { required: true, message: "地址不能为空！", trigger: ['blur','change'] }
        ],
        sex: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了
      formValidate: {
        name: "",
        flight: "",
        begin: "",
        destination: ""
      },
      // 分页
      ajaxHistoryData: [1, 20],
      // 初始化信息总条数
      dataCount: 0,
      //当前页数
      current: 1,
      // 每页显示多少条
      pageSize: 30,

      // 设置table的表头
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 70
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "年龄",
          key: "age"
        },
        {
          title: "爱好",
          key: "address"
        },
        {
          title: "性别",
          key: "sex"
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
        }
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData: [],
      tableHeight:0,
      pageList:[ 30, 50, 100, 500],
    };
  },
  // 方法
  methods: {
    ok() { },
    cancel() { },
    // 查找按钮
    search() {
      // 获取表格数据
      var len = testData.histories;
      // 设置一个空的数组
      var arr = [];
      // 循环遍历
      for (var i in len) {
        // if判断  如果文本框中的值等于表格中name的值 输出
        if (len[i].name == this.companyName) {
          arr.push(len[i]);
          // 如果等于空就给他全部数据
        } else if (this.companyName == "") {
          this.tableData = testData.histories;
          return;
        }
      }
      // 将查找出来的数据给表格
      this.tableData = arr;
    },
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

          if (self.modalTitle == "新增") {
            // 获取需要渲染到页面中的数据
            self.$Message.success("新增成功!");
            self.tableData.push(params);
          } else {
            this.$set(self.tableData, self.itemIndex, params);
            self.$Message.success("修改成功!");
          }
          self.handleModal = false;
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
    // 分页
    handleListApproveHistory() {
      // 保存取到的所有数据

      this.ajaxHistoryData = testData.histories;
      this.dataCount = testData.histories.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (testData.histories.length < this.pageSize) {
        this.tableData = this.ajaxHistoryData;
      } else {
        this.tableData = this.ajaxHistoryData.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      this.current = index;
      console.log(index)
      console.log(this.pageSize)
      var _start = (index * this.pageSize) - this.pageSize;
      var _end = index * this.pageSize;
      this.tableData = this.ajaxHistoryData.slice(_start, _end);
    },
    changePageSize(size) {
      console.log(size)
      this.pageSize = size;
      this.changepage(this.current);
    }
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
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
   }
};
</script>