
<template>
  <div>
    <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->
    <div class="table-query">
      <div class="table-query-up">
        <label prop="name">&nbsp;检测站：&nbsp;</label>
        <Select
          filterable
          clearable
          placeholder="请选择"
          style="width: 120px"
          v-model="orgCode"
        >
          <!-- <Option value="027" key="1">1</Option>
               <Option  value="028" key="2">2</Option> -->

          <Option
            v-for="(item, index) in this.checkList"
            :value="item.code"
            :label="item.name"
            :key="index"
          ></Option>

          <!-- <Option
                v-for="(item,index) in this.checkList"
                :value="item.code"
                :label="item.name"
                :key="index"
              ></Option> --> </Select
        >&nbsp;&nbsp;
        <label prop="name">&nbsp;车牌：&nbsp;</label>
        <Input
          v-model="carNo"
          class="input-search"
          style="width: 120px"
          placeholder="请输入"
        />&nbsp;&nbsp;
        <label v-if="false" prop="name">;车道：;</label>
        <Input
          v-if="false"
          v-model="lane"
          class="input-search"
          style="width: 120px"
          placeholder="请输入"
        />
        <label v-if="false" prop="name">&nbsp;限重：&nbsp;</label>
        <Input
          v-if="false"
          v-model="limitAmt"
          class="input-search"
          style="width: 120px"
          placeholder="请输入"
        />
        <label  v-if="false" prop="name">&nbsp;轴数：&nbsp;</label>
        <!-- <Input v-model="axisNum" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp; -->
        <Select
         v-if="false"
          filterable
          clearable
          style="width: 150px"
          :max-tag-count="1"
          v-model="axisNum"
          placeholder="轴数选择"
          multiple
        >
          <Option
            v-for="(item, index) in 8"
            :value="item"
            :label="item"
            :key="item"
          ></Option>
          <!-- 设置value -->
          <!-- <Option value="1" key="1">1</Option>
               <Option  value="2" key="2">2</Option>
                 <Option  value="3" key="3">3</Option>
                <Option  value="4" key="4">4</Option>
                  <option>1</option> --> </Select
        >

        <!-- <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker type="daterange" v-model="datePicker" :options="options2" placeholder="选择日期范围" style="width: 200px">
        </DatePicker> -->

        <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker
          type="datetime"
          v-model="startT"
          placeholder="开始日期"
          style="width: 120px"
          size="large"
        ></DatePicker>
        <label prop="name">&nbsp;至&nbsp;</label>
        <DatePicker
          type="datetime"
          v-model="endT"
          placeholder="结束日期"
          style="width: 120px"
          size="large"
        ></DatePicker
        >&nbsp;

        <label prop="name">&nbsp;超重：&nbsp;</label>
        <i-Switch v-model="isOverAmt" size="large"></i-Switch>&nbsp;&nbsp;

        <Button @click="search" type="primary" class="input-search">查询</Button
        >&nbsp;&nbsp;
        <Button @click="cancel" type="error" class="input-search">重置</Button
        >&nbsp;&nbsp;
      </div>
      <div class="table-query-down">
        <!-- <label prop="name">&nbsp;超重：&nbsp;</label>
                <i-Switch 
                v-model="isOverAmt"
              
                ></i-Switch> -->
      </div>
    </div>

    <Table
      :columns="columns1"
      :data="tableData1"
      size="small"
      ref="table"
      highlight-row
      :height="tablecolHeight"
      :width="tableWidth"
      :row-class-name="rowClassName"
      class="lll"
    >
      <!-- <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template> -->
      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="font-size: 20px"
          @click="show(index, 1)"
          >查看</Button
        >
      </template>
    </Table>

    <div class="page-info">
      <div>
        <Page
          :total="dataCount1"
          :page-size="pageSize1"
          show-total
          show-elevator
          show-sizer
          :current="current1"
          :page-size-opts="pageList"
          prev-text="上一页"
          next-text="下一页"
          @on-change="changepage1"
          @on-page-size-change="changePageSize1"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getCheckDataList } from "@/api/checkData";
import { dateFormat } from "@/libs/filters";
import {
  selectAllOrg,
  getOrgInfoByCode,
  selectAllPerCheckOrg,
  selectPerOrgByCheck,
} from "@/api/nspOrg";

export default {
  name: "check_history_page",
  props: ["tablecolHeight", "tableWidth"],

  data() {
    return {
      options2: {
        shortcuts: [
          {
            text: "近一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
          },
          {
            text: "近一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
          },
          {
            text: "近三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            },
          },
        ],
      },
      formValidate: {
        name: "",
        flight: "",
        begin: "",
        destination: "",
      },

      // 初始化信息总条数
      dataCount1: 1,
      // 当前页数
      current1: 1,
      // 每页显示多少条
      pageSize1: 30,
      // 设置table的表头

      columns1: [
        // {
        //     title: "序号",
        //     type: "index",
        //     width: 70
        // },
        {
          title: "流水号",
          width: 180,
          align: "center",
          key: "code",
        },
        {
          title: "车牌",
          align: "center",
          width: 130,
          key: "carNo",
        },

        {
          title: "货物",
          align: "center",
          key: "goods",
        },
        // {
        //     title: "初检",
        //     align: "center",

        //     key: "amt"
        // },
        // {
        //     title: "初检超载",
        //     align: "center",
        //     width: 80,
        //     key: "overAmt"
        // },
        {
          title: "复检",
          align: "center",
          width: 80,
          key: "checkAmt",
        },
        {
          title: "复检超载",
          align: "center",
          width: 80,
          key: "overAmt",
        },
        // {
        //     title: "初检时间",
        //     align: "center",
        //     width: 240,
        //     key: "createTime"
        // },

        {
          title: "复检时间",
          align: "center",
          width: 240,
          key: "checkTime",
        },
        {
          title: "检测站",
          align: "center",
          key: "orgCode",
        },
        {
          title: "操作",
          width: 120,
          slot: "action",
          align: "center",
        },
      ],

      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData1: [],

      pageList: [30, 50, 100, 500],

      carNo: "",
      lane: "",
      limitAmt: "",
      axisNum: [],
      datePicker: [],
      startT: "",
      endT: "",
      checkList: [],
      orgSelectName: "",
      isOverAmt: false,
    };
  },
  // 方法
  methods: {
    ok() {},
    cancel() {
      this.carNo = "";
      this.lane = "";
      this.limitAmt = "";
      this.axisNum = "";
      this.datePicker = [];
      this.search();
    },
    // 查找按钮
    search() {
      const start = this.startT;
      const end = this.endT;

      if (start && start !== "" && end && end !== "") {
        // console.info(start.getTime());
        //  let beginTime = new Date(start.getTime());
        //   let endTime=new Date(end.getTime());
        this.startT = dateFormat(start, "YYYY-MM-DD HH:mm:ss");
        this.endT = dateFormat(end, "YYYY-MM-DD HH:mm:ss");
      } else {
        this.startT = "";
        this.endT = "";
      }

      this.handleListApproveHistory();
    },
    show(index, type) {
      let data = [];

      switch (type) {
        case 0:
          data = this.tableData;
          break;
        case 1:
          data = this.tableData1;
          break;
        default:
          break;
      }
      this.$Modal.info({
        title: "查看详情",
        content: `车牌:${data[index].carNo}<br>
             司机名称:${data[index].driverName}<br>
        预检流水号:${data[index].preNo}<br>
        预检时间:${data[index].createTime}<br>
        预检重量:${data[index].amt}<br>
        精检操作员:${data[index].checkOper}`,
        // render
      });
    },

    handleListApproveHistory() {
      let data = {
        carNo: this.carNo ? this.carNo : null,
        lane: this.lane ? this.lane : null,
        limitAmt: this.limitAmt ? this.limitAmt : null,
        axisNum: this.axisNum ? this.axisNum : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        isOverAmt: this.isOverAmt ? this.isOverAmt : false,
        orgCode: this.orgCode ? this.orgCode : null,
      };

       if (data.axisNum != null) {
        data.axisNum = data.axisNum.toString();
      }

      getCheckDataList(this.current1, this.pageSize1, data)
        .then((res) => {
          const data = res.data.data;
          this.tableData1 = data.list;
          this.dataCount1 = data.total;
        })
        .catch((err) => {
          // console.info(err)
        });
    },

    changepage1(index) {
      this.current1 = index;
      this.handleListApproveHistory();
    },
    changePageSize1(size) {
      // console.info(size);
      this.pageSize1 = size;
      this.handleListApproveHistory();
    },
    rowClassName(row, index) {
      return "demo-table-info-row";
    },
    getAllCheckStation() {
      // 查询检测站

      // debugger
      const that = this;
      let rid = localStorage.getItem("roleId");
      if (rid == 1 || rid == "1") {
        // 拉取所有的检测站
        selectAllPerCheckOrg()
          .then((res) => {
            // debugger;
            // console.info(res.data.data);
            this.checkList = res.data.data;
            // 计算最大车道数

            // 置入编号和检测站名称键值对
            // 设置下拉框回显
            // let nowCode = localStorage.getItem("orgCode");
            // 设置车道map
            // this.getLaneMap(nowCode);

            // let max = 0;
            res.data.data.forEach((Element) => {
            //   if (Element.lane > max) {
            //     max = Element.lane;
            //   }
            //   if (Element.code == nowCode) {
            //     this.orgSelectName = Element.name;
            //   }
              that.orgMap[Element.code] = Element.name;
            });
            // this.maxLane = max;
          })
          .catch((err) => {
            console.info(err);
          });
      } else if (rid == 3 || rid == "3") {
        // 精检
        let checkCode = localStorage.getItem("orgCode");
        let checkCodeStr = checkCode.toString();
        // let datas={"checkCode":checkCode};
        selectPerOrgByCheck(checkCodeStr)
          .then((res) => {
            console.info(res.data.data);
            this.checkList = res.data.data;
            //  if(res.data.data.length==1)
            if (res.data.data.length > 0) {
              // let nowCode = res.data.data[0].code;

              // 置入编号和检测站名称键值对
              // 设置下拉框回显
              // 设置车道map
             // this.getLaneMap(nowCode);

            //   let max = 0;
              res.data.data.forEach((Element) => {
                // if (Element.lane > max) {
                //   max = Element.lane;
                // }
                // if (Element.code == nowCode) {
                //   this.orgSelectName = Element.name;
                // }
                that.orgMap[Element.code] = Element.name;
              });
            //   this.maxLane = max;
            }
          })
          .catch((err) => {});
      } else {
        let oCode = localStorage.getItem("orgCode");
        // 设置车道map
        this.getLaneMap(oCode);
        getOrgInfoByCode(oCode)
          .then((res) => {
            // debugger
            // this.checkList=res.data.data;
            let test = res.data.data;
            this.checkList[0] = test;
            this.orgName = res.data.data.name;
            this.orgName = res.data.data.name;
            this.maxLane = res.data.data.lane;
            this.orgMap[oCode] = res.data.data.name;
            this.orgSelectName = res.data.data.name;
          })
          .catch((err) => {
            console.info(err);
          });
      }

      //   this.$parent.handleCountRefresh();
    },
  },
  // 这个应该是加载事件  加载页面的时候就调用
  // mounted() {
  //   // 页面一加载就将数据给出给表格
  //   this.tableData = testData.histories;
  // },
  // created() {
  //     this.handlePreListApproveHistory();
  // },
  mounted() {
    /// /console.info(this.$parent.tablecolHeight);
    // this.tablecolHeight = this.$parent.tablecolHeight;
    // this.tableWidth =  this.$parent.tableWidth;;
  //  console.info("mounted!!!");
    this.getAllCheckStation();
    this.handleListApproveHistory();
  },
  destroyed() {
  //  console.info("destroyed!!!");
  }
};
</script>