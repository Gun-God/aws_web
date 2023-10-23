<template>
  <div>
    <Button type="primary" @click="addBus" icon="ios-add-circle-outline">新增</Button>
    <Table border :columns="columns1" :data="tableData" size="small" ref="table" highlight-row :height="tableHeight"
      :row-class-name="rowClassName" class="lll">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Poptip style="text-align:left;margin-right:.5rem;" confirm title="您确定要删除该信息?" placement="left"
          @on-ok="remove(index, row.id)" @on-cancel="cancel1">
          <Button type="error" size="small">删除</Button>
          <!-- @click="remove(index)" -->
        </Poptip>

        <Button type="warning" size="small" @click="editBus(row, index)">编辑</Button>
        <!-- 前面的小图标会居中挡住文字  设置一下样式就好了 style="text-align:left" -->
        <!-- <Button type="primary" size="small" style="margin-left;: 5px" @click="show(index)">重置密码</Button> -->
      </template>
    </Table>
    <Modal v-model="handleModal" :title="modalTitle" :footer-hide="true" :mask-closable="false" width="680"
      @on-visible-change="handleReset('formValidate')">
      <Form inline ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
        <row :gutter="24">
          <Col span="10">
          <FormItem label="编号：" prop="code">
            <Input v-model="formValidate.code" placeholder="请输入编号" :disabled="isDisable"></Input>
          </FormItem>
          <FormItem label="设备标识：" prop="deviceId">
            <Input v-model="formValidate.deviceId" placeholder="请输入设备唯一标识"></Input>
          </FormItem>
          <FormItem label="名称/串口：" prop="portName">
            <Input v-model="formValidate.portName" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="车道：" prop="lane">
            <Input type="number" v-model="formValidate.lane" placeholder="请输入车道"></Input>
          </FormItem>
          <FormItem label="设备IP：" prop="videoIp">
            <Input v-model="formValidate.videoIp" placeholder="请输入设备IP"></Input>
          </FormItem>
          <FormItem label="端口：" prop="port">
            <Input v-model="formValidate.port" placeholder="请输入端口"></Input>
          </FormItem>
          </Col>
          <Col span="14">
          <FormItem label="账号：" prop="userName">
            <Input v-model="formValidate.userName" placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="分类：" prop="type">
            <RadioGroup v-model="formValidate.type">
              <Radio label="1">精检称台</Radio>
              <Radio label="2">预检称台</Radio>
              <Radio label="3">摄像头</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="厂家：" prop="factory">
            <RadioGroup v-model="formValidate.factory">
              <Radio label="0">其他</Radio>
              <Radio label="1">宇视</Radio>
              <Radio label="2">海康</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联设备：" prop="reCode">
            <Select v-model="formValidate.reCode" style="width:200px">
              <Option v-for="item in scanList" :value="item.code">{{ item.portName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="检测站：" prop="orgCode">
            <Select v-model="formValidate.orgCode" style="width:200px">
              <Option v-for="item in orgList" :value="item.code">{{ item.name }}</Option>
            </Select>
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
  </div>
</template>
<script>
import { getScanDataList, insertScan, updateById, deleteById, selectAllCamera } from '@/api/scan'
import { selectAllOrg } from '@/api/nspOrg'

export default {
  name: 'scan_page',
  // props:['tableHeight'],
  data() {
    return {
      tableHeight: 0,
      modalTitle: "",
      hideElement: true,
      // modal开始为false
      handleModal: false,
      isDisable: true,
      scanList: [],
      orgList: [],

      formValidate: {
        name: '',
        code: '',
        portName: '',
        deviceId: '',
        lane: '',
        port: '',
        udpIp: '',
        videoIp: '',
        type: '1',
        factory: '0',
        reCode: '',
        orgCode: '',
      },
      //规则
      ruleValidate: {
        name: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        code: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        portName: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        deviceId: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        lane: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        type: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],

        videoIp: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        port: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        orgCode: [{ required: true, message: "必填项！", trigger: ['blur', 'change'] }, {
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('必填项！'))
            } else {
              callback()
            }
          }
        }],
        //orgName: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了

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
          width: 80
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
          key: "code"
        },
        {
          title: "设备唯一标识",
          align: "center",
          key: "deviceId"
        },
        {
          title: "名称/串口",
          align: "center",
          key: "portName"
        },
        {
          title: "车道",
          align: "center",
          key: "lane"
        },
        {
          title: "设备IP",
          align: "center",
          key: "videoIp"
        },
        {
          title: "端口号",
          align: "center",
          key: "port"
        },
        // {
        //   title: "UDP地址",
        //   align: "center",
        //   key: "udpIp",
        //   width: 220,
        // },

        {
          title: "分类",
          align: "center",
          key: "type",
          render: (h, params) => {
            const data = params.row.type
            //console.info(params)
            if (data == 1)
              return h('span', "精检称台");
            else if (data == 2)
              return h('span', "预检称台");
            else if (data == 3)
              return h('span', "摄像头");
          }
        },
        {
          title: "厂家",
          align: "center",
          key: "factory",
          render: (h, params) => {
            const data = params.row.factory
            //console.info(params)
            if (data == 0)
              return h('span', "其他");
            else if (data == 1)
              return h('span', "宇视");
            else if (data == 2)
              return h('span', "海康");
          }
        },
        {
          title: "状态",
          align: "center",
          key: "state",
          render: (h, params) => {
            const data = params.row.state
            //console.info(params)
            if (data == 1)
              return h('Button', {
                props: {
                  type: 'success'
                }
              }, "正常");
            else if (data == 2)
              return h('Button', {
                props: {
                  type: 'error'
                }
              }, '维修');
          }
        },
        {
          title: "检测站",
          align: "center",
          key: "orgName"
        },

        // {
        //   title: "安装日期",
        //   align: "center",
        //   key: "createTime",
        //   width: 200,
        // },
        {
          title: "录入员",
          align: "center",
          key: "operName"
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
    },
    // 新增数据
    handleSubmit(name) {
      var self = this;
      self.$refs[name].validate(valid => {
        debugger
        if (valid) {
          var params = JSON.parse(JSON.stringify(self.formValidate));
        //  console.info(params)
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
            insertScan(params).then(res => {
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
      this.isDisable = true;
      this.modalTitle = "修改";
      this.itemIndex = index;
      this.formValidate = JSON.parse(JSON.stringify(item));
      this.formValidate.type = this.formValidate.type + "";
      this.formValidate.factory = this.formValidate.factory + "";

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
      var code=this.formValidate.code
      //console.info(111)
      this.$refs[name].resetFields();
      this.formValidate.code=code;
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



    handleListApproveHistory() {
      getScanDataList(this.current, this.pageSize).then(res => {
        const data = res.data.data;
     //   console.info(data)

        this.tableData = data.list;
        this.dataCount = data.total;
      }).catch(err => {
        //console.info(err)
      })

    },
    selectAllCamera() {
      selectAllCamera().then(res => {
        this.scanList = res.data.data;
      }).catch(err => {
        //console.info(err)
      })
    },
    selectAllOrg() {
      selectAllOrg().then(res => {
        this.orgList = res.data.data;
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
    this.selectAllCamera();
    this.selectAllOrg();
  },
  mounted() {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 190
  },
  computed: {
    // colHidden: function () { //重点
    //   return this.columns.filter(function (e) {
    //     return !e.hidden;
    //   });
    // },
  }
};
</script>