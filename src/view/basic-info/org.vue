
<template>
  <div class="basic-div">
    <!-- <label prop="name">&nbsp;姓名：&nbsp;</label> -->
    <!-- <Input v-model="companyName" id="pp" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp; -->
    <!-- <Button @click="search" type="primary" icon="ios-search">查询</Button>&nbsp;&nbsp; -->
    <div class="input-search">
      <Button type="primary" @click="addBus" icon="ios-add-circle-outline"
        >新增</Button
      >
      <Button shape="circle" icon="md-refresh" style="float: right"></Button>
    </div>

    <Table
      border
      :columns="columns1"
      :data="tableData"
      size="small"
      ref="table"
      highlight-row
      :height="tableHeight"
      :row-class-name="rowClassName"
      class="lll"
    >
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Poptip
          style="text-align: left; margin-right: 0.5rem"
          confirm
          title="您确定要删除该信息?"
          placement="left"
          @on-ok="remove(index, row.id)"
          @on-cancel="cancel1"
        >
          <Button type="error" size="small">删除</Button>
          <!-- @click="remove(index)" -->
        </Poptip>

        <Button type="warning" size="small" @click="editBus(row, index)"
          >编辑</Button
        >
        <!-- 前面的小图标会居中挡住文字  设置一下样式就好了 style="text-align:left" -->

        <!-- <Button type="primary" size="small" style="margin-left;: 5px" @click="show(index)">重置密码</Button> -->
      </template>
    </Table>
    <!-- <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
          :page-size-opts="[10, 20, 50, 100, 500]" size="small" prev-text="上一页" next-text="下一页" @on-change="changepage"
          @on-page-size-change="changePageSize"></Page> -->
    <!-- <Modal
      class-name="vertical-center-modal"
      v-model="handleModal"
      :title="modalTitle"
      :footer-hide="true"
      :mask-closable="true"
      @on-visible-change="handleReset('formValidate')"
      width="1080"
    > -->
     <Modal
      class-name="vertical-center-modal"
      v-model="handleModal"
      :title="modalTitle"
      :footer-hide="true"
      :mask-closable="true"
      @on-visible-change="handleReset('formValidate')"
      width="1080"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :label-width="120"
        :rules="ruleValidate"
      >
        <row :gutter="24">
          <Col span="12">
            <FormItem label="编号" prop="code">
              <Input
                v-model="formValidate.code"
                placeholder="请输入编号"
                :disabled="isDisable"
              ></Input>
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input
                v-model="formValidate.name"
                placeholder="请输入名称"
              ></Input>
            </FormItem>
            <FormItem label="简称" prop="shortName">
              <Input
                v-model="formValidate.shortName"
                placeholder="请输入简称"
              ></Input>
            </FormItem>
            <FormItem label="桩号" prop="pileNo">
              <Input
                v-model="formValidate.pileNo"
                placeholder="请输入桩号"
              ></Input>
            </FormItem>
            <FormItem label="方向名称" prop="directionName">
              <Input
                v-model="formValidate.directionName"
                placeholder="请输入桩号"
              ></Input>
            </FormItem>
            <FormItem
              v-if="checkListDisplay"
              label="关联精检站"
              prop="checkOrg"
            >
              <Select
                filterable
                clearable
                placeholder="请选择"
                v-model="formValidate.checkOrg"
              >
                <!-- <Option v-if="dependenceCarNoDisplay" :label="dependenceCarNo" :value="dependenceCarNo">
                     {{dependenceCarNo}}
                     </Option> -->
                <Option
                        v-for="(item, indexs) in checkList"
                        :value="item.code"
                        :label="item.name"
                        :key="indexs"
                      ></Option>
              </Select>
            </FormItem>
            <!-- <FormItem label="密码" prop="password">
            <Input v-model="formValidate.password" placeholder="密码默认为123456"></Input>
          </FormItem> -->
          </Col>
          <Col span="12">
            <FormItem label="类型" prop="type">
              <RadioGroup
                v-model="formValidate.type"
                @on-change="changeOrgType"
              >
                <Radio label="0" class="xuanxiang">预检站</Radio>
                <Radio label="1" class="xuanxiang">精检站</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="上下行" prop="direction">
              <RadioGroup v-model="formValidate.direction">
                <Radio label="0" class="xuanxiang">上行</Radio>
                <Radio label="1" class="xuanxiang">下行</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="位置" prop="location">
              <Input
                v-model="formValidate.location"
                placeholder="请输入位置"
              ></Input>
            </FormItem>
            <FormItem label="车道数" prop="lane">
              <Input
                type="number"
                v-model="formValidate.lane"
                placeholder="请输入车道数"
              ></Input>
            </FormItem>
            <FormItem label="所属高速" prop="expressway">
              <Input
                v-model="formValidate.expressway"
                placeholder="请输入所属高速"
              ></Input>
            </FormItem>
          </Col>
        </row>
        <FormItem>
          <!-- 提交的单击事件  在下面的方法里面写好 -->
          <Row :gutter="24" style="display: flex" justify="center">
            <Col span="6">
              <Button type="primary" @click="handleSubmit('formValidate')"
                ><span class="anniu">提交</span></Button
              >&nbsp;&nbsp; &nbsp;
            </Col>
            <Col span="6">
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
import "./basic.less";
import {
  getOrgDataList,
  insertOrg,
  deleteById,
  updateById,
  selectAllCheckOrg
} from "@/api/nspOrg";
import validator from "validator";

export default {
  name: "org_page",
  // props:['tableHeight'],
  data() {
    return {
      tableHeight: 0,
      modalTitle: "",
      hideElement: true,
      // modal开始为false
      handleModal: false,
      isDisable: true,
      // 规则
      ruleValidate: {
        name: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        code: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        shortName: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        location: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        lane: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        pileNo: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        expressway: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        directionName: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],
        type: [
          { required: true, message: "必填项！", trigger: ["blur", "change"] },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("必填项！"));
              } else {
                callback();
              }
            },
          },
        ],

        // orgName: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了
      formValidate: {
        name: "",
        code: "",
        shortName: "",
        location: "",
        lane: "",
        type: "3",
        direction: "0",
        pileNo: "",
        expressway: "",
        directionName: "",
        checkOrg: "",

      },
      checkListDisplay: true,
      checkList: [],
      checkOrgMap: [],
      // 初始化信息总条数
      dataCount: 0,
      // 当前页数
      current: 1,
      // 每页显示多少条
      pageSize: 50,

      // 设置table的表头
      columns1: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 80,
          // type: 'selection',
        },
        // {
        //   title: "id",
        //   key: "id",
        //   className:"userId",
        //   sortType: "asc",

        // },

        {
          title: "编号",
          align: "center",
          key: "code",
        },
        {
          title: "名称",
          align: "center",
          key: "name",
        },
        {
          title: "简称",
          align: "center",
          key: "shortName",
        },
        {
          title: "类型",
          align: "center",
          key: "type",
          render: (h, params) => {
            const data = params.row.type;
            // console.info(params)
            if (data == 0) return h("span", "预检站");
            else return h("span", "精检站");
          },
        },
        {
          title: "位置",
          align: "center",
          key: "location",
        },
        {
          title: "车道数",
          align: "center",
          key: "lane",
        },
        {
          title: "桩号",
          align: "center",
          key: "pileNo",
        },
        {
          title: "方向",
          align: "center",
          key: "directionName",
        },
        {
          title: "所属高速",
          align: "center",
          key: "pileNo",
        },

        {
          title: "添加时间",
          align: "center",
          key: "buildTime",
        },
        {
          title: "关联精检站",
          align: "center",
          key: "checkOrg",
           render: (h, params) => {
            let data = params.row.checkOrg;
            // console.info(params)
            if (data == null || data == "" || data == undefined) { return h("span", "-"); } else {
              data = data + "";
              return h("span", this.checkOrgMap[data]);
            }
          },
          // checkOrgMap

        },
        {
          title: "操作",
          slot: "action",
          width: 240,
          align: "center",
        },
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData: [],

      pageList: [30, 50, 100, 500],
    };
  },
  // 方法
  methods: {
    // ok() { },
    // cancel() { },
    // // 查找按钮
    // search() {

    // },
    // 新增按钮的单击事件
    addBus() {
      this.handleModal = true;
      this.isDisable = false;
      this.modalTitle = "新增";
      this.formValidate.code = "";
      this.checkListDisplay = true;
    },
    // 新增数据
    handleSubmit(name) {
      var self = this;
      self.$refs[name].validate((valid) => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(self.formValidate));
          // console.info(params)
          if (self.modalTitle == "修改") {
            updateById(params)
              .then((res) => {
                const data = res.data;
                if (data.code != 200) {
                  self.$Message.error(data.msg);
                } else {
                  this.$set(self.tableData, self.itemIndex, params);
                  self.$Message.success("修改成功!");

                  self.handleModal = false;
                }
              })
              .catch((err) => {
                self.$Message.error(err.data.msg);
              });
          } else {
            params.id = null;
            insertOrg(params)
              .then((res) => {
                const data = res.data;
                if (data.code != 200) {
                  self.$Message.error(data.msg);
                } else {
                  self.$Message.success("新增成功!");
                  self.tableData.push(params);
                  self.handleModal = false;
                }
              })
              .catch((err) => {
                // self.$Message.error("新增失败!");
                self.$Message.error(err.data.msg);
              });
          }
        }
      });
    },
    // 修改方法
    editBus(item, index) {
      this.handleModal = true;
      this.isDisable = true;
      this.modalTitle = "修改";
      this.itemIndex = index;
      this.formValidate = JSON.parse(JSON.stringify(item));
      this.formValidate.type = this.formValidate.type + "";
      if (this.formValidate.type == "1" || this.formValidate.type == 1) {
        this.checkListDisplay = false;
      } else {
        this.checkListDisplay = true;
      }
      // this.formValidate.lane = this.formValidate.lane+ "";
      // console.info(this.formValidate)
    },
    // 删除一条数据
    remove(index, id) {
      /// /console.info(index)
      console.info(id);
      let newId = parseInt(id);
      deleteById(newId)
        .then((res) => {
          const data = res.data;
          // debugger
          if (data.code == 200) {
            this.tableData.splice(index, 1);
            // on-click  方法 冒泡提示确定
            this.$Message.success("删除成功");
          } else {
            this.$Message.error("删除失败 刷新重试");
          }
        })
        .catch((err) => {
          this.$Message.error("删除失败 刷新重试");
        });
    },
    cancel1() {
      this.$Message.info("取消删除");
    },
    // 清除文本框  重置
    handleReset(name) {
      var code = this.formValidate.code;
      // console.info(111)
      this.$refs[name].resetFields();
      this.formValidate.code = code;
    },
    // 详情显示
    show(index) {
      this.$Modal.info({
        title: "查看详情",
        content: `姓名:${this.tableData[index].name}<br>年龄:${this.tableData[index].age}
           <br>爱好:${this.tableData[index].address}<br>性别:${this.tableData[index].sex}
           `,
      });
    },

    handleListApproveHistory() {
      getOrgDataList(this.current, this.pageSize)
        .then((res) => {
          const data = res.data.data;
          this.tableData = data.list;
          this.dataCount = data.total;
        })
        .catch((err) => {
          // console.info(err)
        });
    },

    changepage(index) {
      this.current = index;
      this.handleListApproveHistory();
    },
    changePageSize(size) {
      // console.info(size);
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    rowClassName(row, index) {
      return "demo-table-info-row";
    },
    changeOrgType() {
      if (this.formValidate.type == "1" || this.formValidate.type == 1) {
        this.checkListDisplay = false;
      } else {
        this.checkListDisplay = true;
      }
    },

    getCheckList() {
      selectAllCheckOrg().then((res) => {
        if (res.data.code == 200) {
          // 制作一个映射
          let map = [];
          // console.info(res.data.data);
          for (let i = 0; i<res.data.data.length; i++) {
            map[res.data.data[i].code] = res.data.data[i].name;
          }
          this.checkOrgMap = map;
          // console.info(this.checkOrgMap);
          this.checkList = res.data.data;
        }
      }).catch((err) => {

      })
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
      this.getCheckList();

    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 190;
  },
  computed: {
    // colHidden: function () { //重点
    //   return this.columns.filter(function (e) {
    //     return !e.hidden;
    //   });
    // },
  },
};
</script>