<style lang="less">
//设置那个查看的小窗口 后续可以改成修改模态框的全局设置
.ivu-modal-confirm-head-title {
  color: #2d8cf0 !important;
  font-size: 2vh;
}

.ivu-modal-confirm-body {
  color: #fff !important;
  font-size: 2vh;
}

.ivu-modal-confirm-footer {
  span {
    font-size: 2vh;
    letter-spacing: 1px;
  }
}
</style>

<template>
  <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->

  <div style="overflow: hidden; height: 100%; width: 100%">
    <div class="left-content">
      <Tabs value="1" @on-click="changeTabs">
        <!-- 预检历史数据展示 -->
        <TabPane label="预检历史数据" name="1">
          <div class="table-query">
            <div class="table-query-up">
              <label prop="name">&nbsp;检测站：&nbsp;</label>
              <Select
                filterable
                clearable
                :placeholder="orgSelectName"
                style="width: 180px"
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
              >&nbsp;&nbsp;&nbsp;

              <label prop="name">&nbsp;车牌：</label>
              <Input
                v-model="carNo"
                class="input-search input-dark"
                style="width: 130px"
                placeholder="请输入"
              />&nbsp;&nbsp;
              <label v-if="false" prop="name">&nbsp;流水号：&nbsp;</label>
              <Input
                v-if="false"
                v-model="preNo"
                class="input-search input-dark"
                style=""
                placeholder="请输入"
              />

              <label prop="name">&nbsp;日期范围：&nbsp;</label>
              <DatePicker
                type="datetime"
                v-model="startT"
                placeholder="开始日期"
                style="width: 140px"
                size="large"
              ></DatePicker>
              <label prop="name">&nbsp;至&nbsp;</label>
              <DatePicker
                type="datetime"
                v-model="endT"
                placeholder="结束日期"
                style="width: 140px"
                size="large"
              ></DatePicker
              >&nbsp;&nbsp;

              <label prop="name">&nbsp;超重：&nbsp;</label>
              <i-Switch v-model="isOverAmt" size="large">
                <!-- <template #open>
                  <span>超重</span>
                </template>
                <template #close>
                  <span>所有</span>
                </template> -->
              </i-Switch>

              <label v-if="false" prop="name">&nbsp;限重：&nbsp;</label>
              <Input
                v-if="false"
                v-model="limitAmt"
                class="input-search"
                type="number"
                style="width: 100px"
                placeholder="请输入"
              />

              <Button
                @click="search"
                type="primary"
                icon="ios-search"
                class="input-search"
                style="margin-left: 20px"
                >查询</Button
              >&nbsp;&nbsp;

              <Button
                @click="cancel"
                type="error"
                icon="md-refresh"
                class="input-search"
                >重置</Button
              >&nbsp;&nbsp;
            </div>
            <div class="table-query-down">
              <label prop="name">&nbsp;自重区间：</label>
              <Input
                v-model="preAmtStart"
                class="input-search"
                type="number"
                style="width: 65px"
                placeholder="输入"
              />&nbsp;
              <label prop="name">至&nbsp;</label>
              <Input
                v-model="preAmtEnd"
                class="input-search"
                type="number"
                style="width: 65px"
                placeholder="输入"
              />&nbsp;&nbsp;&nbsp;
              <label prop="name">&nbsp;车道：&nbsp;</label>
              <!-- <Input
            v-model="lane"
            class="input-search"
            type="number"
            style="width: 120px"
            placeholder="请输入"
          />&nbsp;&nbsp; -->
              <Select
                filterable
                clearable
                v-model="lane"
                style="width: 130px"
                :max-tag-count="0"
                placeholder="车道选择"
                multiple
              >
                <Option
                  v-for="count in maxLane"
                  :value="count"
                  :label="count"
                  :key="count"
                ></Option> </Select
              >&nbsp;&nbsp;

              <label prop="name">&nbsp;轴数：&nbsp;</label>
              <!-- <Input
            v-model="axisNum"
            class="input-search"
            type="number"
            style="width: 120px"
            placeholder="请输入"
          />&nbsp;&nbsp; -->
              <Select
                filterable
                clearable
                style="width: 133px"
                :max-tag-count="0"
                v-model="axisNum"
                placeholder="轴数选择"
                multiple
              >
                <Option
                  v-for="(item, index) in maxAxis"
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
              >&nbsp;&nbsp;

              <label prop="name">&nbsp;牌照颜色：&nbsp;</label>
              <!-- <Input
            v-model="axisNum"
            class="input-search"
            type="number"
            style="width: 120px"
            placeholder="请输入"
          />&nbsp;&nbsp; -->
              <Select
                filterable
                clearable
                style="width: 100px"
                v-model="color"
                placeholder="选择"
              >
                <!-- <Option
                v-for="item in deptList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              ></Option> -->
                <!-- 设置value -->
                <Option value="0" key="0">蓝色</Option>
                <Option value="1" key="1">黄色</Option> </Select
              >&nbsp;&nbsp;

              <label v-if="true" prop="name">&nbsp;导出：&nbsp;</label>
              <ButtonGroup v-if="true">
                <Button @click="downloadExcel" type="info" class="input-search"
                  >表格</Button
                >
                <Button @click="downloadImg" type="primary" class="input-search"
                  >图片</Button
                >
              </ButtonGroup>
              &nbsp;&nbsp;&nbsp;&nbsp;

              <div class="download-process">
                <Progress
                  v-if="isDownload"
                  :percent="myPercent"
                  :text-inside="false"
                  :stroke-width="5"
                />
                <a v-if="isOverDownload" @click="letDownLoad">点我下载</a>
              </div>

              <Poptip v-if="false" placement="bottom-end" width="400">
                <!-- <Button>下载任务</Button> -->
                <Button type="primary" shape="circle">下载任务</Button>

                <template #content>
                  <div class="downLoadTable">
                    <!-- <Table
                      :columns="downLoadTableColumns"
                      :data="downLoadData"
                      size="small"
                      highlight-row
                    ></Table> -->
                  </div>
                </template>
              </Poptip>
            </div>
          </div>

          <Table
            :columns="columns"
            :data="tableData"
            size="small"
            ref="table"
            highlight-row
            :height="tablecolHeight"
            :width="tableWidth"
            :row-class-name="rowClassName"
            @on-row-click="onRowClick"
            class="lll"
          >
            <!-- <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template> -->
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="show(index, 0)"
                >查看</Button
              >
            </template>
          </Table>

          <div class="page-info">
            <div>
              <Page
                :total="dataCount"
                :page-size="pageSize"
                show-total
                show-elevator
                show-sizer
                :current="current"
                :page-size-opts="pageList"
                prev-text="上一页"
                next-text="下一页"
                @on-change="changepage"
                @on-page-size-change="changePageSize"
              ></Page>
            </div>
          </div>
        </TabPane>

        <!-- 精检历史数据展示 -->
        <TabPane label="精检历史数据" name="2">
          <checkHistory
            :tablecolHeight="tablecolHeight"
            :tableWidth="tableWidth"
            ref="checkHistory"
          >
          </checkHistory>
        </TabPane>

        <!-- 情报板历史数据展示 -->
        <TabPane label="情报板历史数据" name="3">
          <ledHistory
            :tablecolHeight="tablecolHeight"
            :tableWidth="tableWidth"
            ref="ledHistory"
          ></ledHistory>
        </TabPane>

        <!-- 车牌历史数据展示 -->
        <TabPane label="车牌历史数据展示" name="4">
          <carHistory
            :tablecolHeight="tablecolHeight"
            :tableWidth="tableWidth"
            ref="carHistory"
          ></carHistory>
        </TabPane>
      </Tabs>
    </div>

    <!-- <Modal v-model="Modal" :closable="false" :mask-closable="false">111111111</Modal> -->

    <car-img :key="countRefreshKey" :carFrontImg="carFrontImg"></car-img>
  </div>
</template>

<script>
import "./pre-history.less";
import carImg from "./car-img.vue";
import {
  getPreCheckDataHistoryList,
  exportPreCheckDataHistoryList,
  exportPreCheckDataHistoryListImg,
} from "@/api/preCheckDataHistory";
import { getAwsCarTypeList } from "@/api/awsCarType";
import { selectAllCamera } from "@/api/scan";
import { getPerCheckDataByQuery } from "@/api/preCheckData";
// import { getCheckDataList } from '@/api/checkData'
// import { getLedList } from '@/api/led'
import checkHistory from "./check-history.vue";
import ledHistory from "./led-history.vue";
import carHistory from "./car-no-history.vue";
import { getDownloadListByUser, getnewDownload } from "@/api/downloadLog";
import { dateFormat } from "@/libs/filters";
import ImagePreview, { Alert } from "iview";
import {
  selectAllOrg,
  getOrgInfoByCode,
  selectAllPerCheckOrg,
  selectPerOrgByCheck,
} from "@/api/nspOrg";
import defaultImg from "@/assets/images/no_img.jpg";
export default {
  name: "prehis_page",

  components: {
    carImg,
    checkHistory,
    ledHistory,
    carHistory,
  },
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

      // modal开始为false
      handleModal: false,
      // 规则
      // ruleValidate: {
      //     name: [{ required: true, message: "姓名不能为空！", trigger: ['blur','change'] }],
      //     age: [{ required: true, message: "年龄不能为空！", trigger: ['blur','change'] }],
      //     address: [
      //         { required: true, message: "地址不能为空！", trigger: ['blur','change'] }
      //     ],
      //     sex: [{ required: true, message: "性别不能为空！", trigger: ['blur','change'] }]
      // },
      //  这个对应form里面的数据不能少  名字不规范我就不改了
      // columns1 和formvalidate 里面的命名要一样 别乱了
      formValidate: {
        name: "",
        flight: "",
        begin: "",
        destination: "",
      },

      // 初始化信息总条数
      dataCount: 0,

      // 当前页数
      current: 1,

      // 每页显示多少条
      pageSize: 50,
      countRefreshKey: 0,
      displaySelect: false,
      downLoadData: [],
      myPercent: 0,
      downLoadTableColumns: [
        {
          title: "序号",
          type: "index",
          align: "center",
        },
        {
          title: "进度",
          align: "center",
          key: "percent",
          // order:1
        },
        {
          title: "完成",
          align: "center",
          key: "state",
        },
        // {
        //   title: "时间",
        //   align: "center",
        //   key: "operTime",
        // },
        {
          title: "类型",
          align: "center",
          key: "type",
          // render: (h, params) => {
          //   let laneName = this.laneMap[params.row.lane];
          //   //                   // let laneName=this.laneMap[3];
          //   if (laneName == undefined || laneName == null) {
          //     laneName = 4;
          //   }

          //   return h(
          //     "span",
          //     {
          //       style: { width: "300px" },
          //     },
          //     laneName
          //   );
          // },
        },
      ],

      // 设置table的表头
      columns: [
        // {
        //     title: "序号",
        //     type: "index",
        //     width: 70
        // },
        {
          title: "流水号",
          align: "center",
          width: 200,
          key: "preNo",
          // order:1
        },

        {
          title: "时间",
          width: 260,
          align: "center",
          key: "createTime",
        },
        {
          title: "车道",
          align: "center",
          key: "lane",
          render: (h, params) => {
            let laneName = this.laneMap[params.row.lane];
            //                   // let laneName=this.laneMap[3];
            if (laneName == undefined || laneName == null) {
              laneName = 4;
            }

            return h(
              "span",
              {
                style: { width: "300px" },
              },
              laneName
            );
          },
        },
        {
          title: "车牌",
          align: "center",
          width: 160,
          key: "carNo",
          // order:3
        },
        {
          title: "轴数",
          align: "center",
          key: "axisNum",
        },
        {
          title: "限重(吨)",
          align: "center",
          key: "limitAmt",
        },
        {
          title: "预检(吨)",
          align: "center",
          key: "preAmt",
        },
        {
          title: "车速(km/h)",
          align: "center",
          key: "speed",
        },

        {
          title: "检测站",
          align: "center",
          key: "orgCode",
          width: 260,
          render: (h, params) => {
            let oName = this.orgMap[params.row.orgCode];
            return h(
              "span",
              {
                style: { width: "300px" },
              },
              oName
            );
          },
        },
        {
          title: "图片",

          align: "center",
          className: "img-custor",
          key: "img",
          render: (h, params) => {
            const data = params.row.img;
            // console.info(data)
            if (data && data.length !== 0) {
 return h("viewer", [
                h("img", {
                  style: {
                    width: "28px",
                    height: "28px",
                    // lineHeight:'32px'
                  },

                  attrs: {
                    // src:'https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750'
                    src: "car_img/" + data,
                  },
                }),
              ]); 
} else return h("span", "");
          },
        },
        // {
        //   title: "操作",
        //   slot: "action",
        //   align: "center",
        // },
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的
      tableData: [],
      isDownload: false,
      isOverDownload: false,
      tablecolHeight: 0,
      tableWidth: 0,
      pageList: [30, 50, 100, 500],

      carNo: "",
      lane: [],
      limitAmt: "",
      axisNum: [],
      datePicker: [],
      checkList: [],
      startT: "",
      endT: "",
      preAmtStart: "",
      preAmtEnd: "",
      preNo: "",
      orgCode: "",
      color: "",
      maxAxis: 0,
      maxLane: 10,
      // carFrontImg: defaultImg,
      carFrontImg: defaultImg,
      // 检测站键值对
      orgMap: [],
      laneMap: [],
      laneMapReverse: [],
      orgSelectName: "检测站",
      isOverAmt: false,
      downloadTimer: null,
      downloadMsg: null,
      downLoadId: -1,
      downloadFlag: 0, // 0无下载任务 1有下载任务
    };
  },
  // 方法
  methods: {
    rowClassName(row, index) {
      // console.info(row);
      let axis = row.axisNum;
      let liAmt = row.limitAmt;
      let preAmt = row.preAmt;
      // debugger

      if (preAmt > liAmt && axis < 6) {
        return "demo-table-info-row-warn";
      } else if (preAmt > liAmt && axis >= 6) {
        return "demo-table-info-row-danger";
      } else {
        return "demo-table-info-row";
      }
      return "demo-table-info-row";
    },
    ok(index) {
      console.info("img", ImagePreview);
      // alert(index)
      // debugger
      this.$ImagePreview.show({
        previewList: ["../../assets/images/logo.jpg"],
      });
    },
    changeCarImg(img) {
      // console.info("click parent!");
      this.carFrontImg = img;
    },
    onRowClick(data, index) {
      console.info("data", data);
      this.carFrontImg = data.img ? "car_img/" + data.img : defaultImg;
      //  let carFront = data.img ? "car_img/" + data.img : defaultImg;
      //  this.changeCarImg(carFront);
    },
    us_differ_day(date1, date2) {
      // console.log("us_differ_day="+date1)
      // let sdate = new Date((date1));
      //  let edate = new Date((date2));
      let sd = dateFormat(date1, "YYYY-MM-DD");
      let ed = dateFormat(date2, "YYYY-MM-DD");
      //   console.info(sd,ed);
      date1 = new Date(sd);
      date2 = new Date(ed);
      let datespan = date1 - date2;
      datespan = Math.abs(datespan);
      let idays = Math.floor(datespan / (24 * 3600 * 1000));
      return idays;
    },
    // 查找按钮
    search() {
      const start = this.startT;
      const end = this.endT;
      // console.info("start", start);
      // console.info("end", end);
      // this.startT = "";
      // this.endT = "";

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
      this.current = 1;
      this.handlePreListApproveHistory();
    },
    cancel() {
      this.carNo = "";
      this.lane = "";
      this.limitAmt = "";
      this.axisNum = "";
      this.datePicker = [];
      this.preAmtStart = "";
      this.preAmtEnd = "";
      this.preNo = "";
      this.startT = "";
      this.endT = "";
      this.isOverAmt = false;
      (this.orgCode = ""), (this.color = "");
      this.search();
    },
    // 新增按钮的单击事件
    // addBus() {
    //     this.handleModal = true;
    //     this.modalTitle = "新增";
    // },
    // 新增数据
    // handleSubmit(name) {
    //     var self = this;
    //     self.$refs[name].validate(valid => {
    //         if (valid) {
    //             var params = JSON.parse(JSON.stringify(self.formValidate));
    //             if (self.modalTitle == "新增") {
    //                 // 获取需要渲染到页面中的数据
    //                 self.$Message.success("新增成功!");
    //                 self.tableData.push(params);
    //             }
    //             else {
    //                 this.$set(self.tableData, self.itemIndex, params);
    //                 self.$Message.success("修改成功!");
    //             }
    //             self.handleModal = false;
    //         }
    //         else {
    //             if (self.modalTitle == "新增") {
    //                 self.$Message.error("新增失败!");
    //             }
    //             else {
    //                 self.$Message.error("修改失败!");
    //             }
    //         }
    //     });
    // },
    // 修改方法
    // editBus(item, index) {
    //     this.handleModal = true;
    //     this.modalTitle = "修改";
    //     this.itemIndex = index;
    //     this.formValidate = JSON.parse(JSON.stringify(item));
    // },
    // 删除一条数据
    // remove(index) {
    //     this.tableData.splice(index, 1);
    //     // on-click  方法 冒泡提示确定
    //     this.$Message.success("删除成功");
    // },
    // cancel1() {
    //     this.$Message.info("取消删除");
    // },
    // 清除文本框  重置
    // handleReset(name) {
    //     this.$refs[name].resetFields();
    // },
    // 详情显示
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
        content: `车牌:${data[index].carNo}<br>车道:${data[index].lane}`,

        // ,
        //  render: (h,params)=>{
        //     return h("div",{
        //              style:{
        //             width:'128px',
        //             height:'128px',
        //             color:'white'
        //             // lineHeight:'32px'
        //         }}
        //         ,
        //       //  `车牌:${data[index].carNo}`

        //         )
        //         }
      });
    },

    // 分页
    handlePreListApproveHistory() {
      // let  aNum=this.axisNum ? this.axisNum : null;
      // let lanes=this.lane ? this.lane : null;
      // if(aNum!=null)
      console.info(this.lane);

      let data = {
        carNo: this.carNo ? this.carNo : null,
        lane: this.lane ? this.lane : null,
        limitAmt: this.limitAmt ? this.limitAmt : null,
        axisNum: this.axisNum ? this.axisNum : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        preAmtStart: this.preAmtStart ? this.preAmtStart : null,
        preAmtEnd: this.preAmtEnd ? this.preAmtEnd : null,
        preNo: this.preNo ? this.preNo : null,
        orgCode: this.orgCode ? this.orgCode : null,
        color: this.color ? this.color : null,
        isOverAmt: this.isOverAmt ? this.isOverAmt : false,
      };
      // let lane=this.lane ? this.lane : null;
      // let aNum=this.axisNum ? this.axisNum : null;
      //  data.lane

      console.info(data);
      if (data.lane != null) {
        // data.lane=JSON.stringify(data.lane);
        // 重新映射lane查询参数
        //  for(let i=0;i<data.lane.length;i++)
        //  {
        //    data.lane[i]=this.laneMapReverse[data.lane[i]];

        // }
        data.lane = data.lane.toString();

        // console.info(this.laneMapReverse);
        // console.info(data.lane);
      }
      if (data.axisNum != null) {
        data.axisNum = data.axisNum.toString();
      }

      console.info(data);
      // let data={
      //     carNo:"323",
      //     lane:2
      // }
      // var tableData_pre;
      // var tableData_pre_history;
      // var data_pre;
      // var data_pre_history;
      // var dataCount_pre;
      // var dataCount_pre_history;

      // getPerCheckDataByQuery(this.current,this.pageSize,data).then(res=>{
      //     const data = res.data.data;
      //     this.tableData = data.list;
      //     this.dataCount = data.total;
      // }).catch(err => {
      //     //console.info(err)
      // })
      // debugger

      getPreCheckDataHistoryList(this.current, this.pageSize, data)
        .then((res) => {
          // 重新设置map
          if (this.orgCode) this.getLaneMap(this.orgCode);

          const data = res.data.data;
          this.tableData = data.list;
          this.dataCount = data.total;
          console.info(data);
        })
        .catch((err) => {
          console.info(err);
        });
      // var data1={carNo:"323",lane:2}
      // data=data+data1;
      // console.log("here!");
      // console.log(data);
    },

    changepage(index) {
      this.current = index;
      this.handlePreListApproveHistory();
    },
    changePageSize(size) {
      // console.info(size);
      this.pageSize = size;
      this.handlePreListApproveHistory();
    },
    changeTabs(name) {
      if (name == "1") {
        this.handlePreListApproveHistory();
      }
      if (name === "2") this.$refs.checkHistory.handleListApproveHistory();
      if (name === "3") this.$refs.ledHistory.handleLedListApproveHistory();
      if (name === "4") this.$refs.carHistory.handleLedListApproveHistory();
    },
    handleCountRefresh() {
      this.countRefreshKey++;
    },
    async checkClick(name) {
      // alert(name);
      if (name == "ALL") {
        // debugger
        await localStorage.setItem("orgCode", "9999");
        this.orgName = "所有检测站";
        // this.remounted();
      } else {
        let org_code = this.checkList[name].code;
        this.orgName = this.checkList[name].name;
        await localStorage.setItem("orgCode", org_code);
        // this.remounted();
        //  this.$parent.handleCountRefresh();
        // this.remounted();
        // this.$router.go(0);
        // location.reload();
        // window.location.reload(true);
      }
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
            console.info(res.data.data);
            this.checkList = res.data.data;
            // 计算最大车道数

            // 置入编号和检测站名称键值对
            // 设置下拉框回显
            let nowCode = localStorage.getItem("orgCode");
            // 设置车道map
            this.getLaneMap(nowCode);

            let max = 0;
            res.data.data.forEach((Element) => {
              if (Element.lane > max) {
                max = Element.lane;
              }
              if (Element.code == nowCode) {
                this.orgSelectName = Element.name;
              }
              that.orgMap[Element.code] = Element.name;
            });
            this.maxLane = max;
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
              let nowCode = res.data.data[0].code;

              // 置入编号和检测站名称键值对
              // 设置下拉框回显
              // 设置车道map
              this.getLaneMap(nowCode);

              let max = 0;
              res.data.data.forEach((Element) => {
                if (Element.lane > max) {
                  max = Element.lane;
                }
                if (Element.code == nowCode) {
                  this.orgSelectName = Element.name;
                }
                that.orgMap[Element.code] = Element.name;
              });
              this.maxLane = max;
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
    displaySelectCheck() {
      const that = this;
      let rid = localStorage.getItem("roleId");
      if (rid == 1 || rid == "1") {
        that.displaySelect = true;
      }
    },
    getcarType() {
      getAwsCarTypeList()
        .then((res) => {
          // debugger
          let carIds = res.data.data;
          let max = 0;
          carIds.forEach((element) => {
            if (element.axisNum > max) {
              max = element.axisNum;
            }
          });

          this.maxAxis = max;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    remounted() {
      // this.displaySelectCheck();
      this.handlePreListApproveHistory();
      this.getAllCheckStation();
    },
    exportExcel() {
      let data = {
        carNo: this.carNo ? this.carNo : null,
        lane: this.lane ? this.lane : null,
        limitAmt: this.limitAmt ? this.limitAmt : null,
        axisNum: this.axisNum ? this.axisNum : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        preAmtStart: this.preAmtStart ? this.preAmtStart : null,
        preAmtEnd: this.preAmtEnd ? this.preAmtEnd : null,
        preNo: this.preNo ? this.preNo : null,
        orgCode: this.orgCode ? this.orgCode : null,
        color: this.color ? this.color : null,
        isOverAmt: this.isOverAmt ? this.isOverAmt : false,
      };

      console.info(data);
      if (data.lane != null) {
        data.lane = data.lane.toString();
      }
      if (data.axisNum != null) {
        data.axisNum = data.axisNum.toString();
      }

      if (
        this.startT == null ||
        this.endT == null ||
        this.startT == "" ||
        this.endT == "" ||
        this.startT == undefined ||
        this.endT == undefined
      ) {
        alert("日期范围不能为空！");
        return;
      }

      exportPreCheckDataHistoryList(1, -1, data)
        .then((res) => {
          if (res.data.code == 200) {
            // 这里现在可以得到一个id
            this.downLoadId = res.data.data;
            this.ctrlDownloadStatusDisplay(res.data.data);
            this.downloadFlag = 1;
          }

          // alert("导出成功！");
          console.info(res);
          // const a=document.createElement('a');
          let url = "pre_excel/" + res.data.data;
          // console.info(url);
          // a.setAttribute('download','');
          // a.setAttribute('href',url);
          // a.click();
          // a.remove();
          // try {
          //   let elementIFtrame = document.createElement("iframe");
          //   elementIFtrame.src = url;
          //   elementIFtrame.style.display = "none";
          //   document.body.appendChild(elementIFtrame);
          //   // 1s之后删除
          //   setTimeout(() => {
          //     elementIFtrame.remove();
          //   }, 1000);
          // } catch (error) {
          //   console.info(error);
          // }
        })
        .catch((error) => {
          console.info(error);
        });
    },
    downloadExcel() {
      if (this.downloadFlag == 1) {
        alert("已有任务在导出 请稍后 ");
        return;
      }

      const start = this.startT;
      const end = this.endT;
      if (start && start !== "" && end && end !== "") {
        this.startT = dateFormat(start, "YYYY-MM-DD HH:mm:ss");
        this.endT = dateFormat(end, "YYYY-MM-DD HH:mm:ss");
      } else {
        this.startT = "";
        this.endT = "";
      }
      // this.current = 1;
      this.exportExcel();
    },
    exportImg() {
      let data = {
        carNo: this.carNo ? this.carNo : null,
        lane: this.lane ? this.lane : null,
        limitAmt: this.limitAmt ? this.limitAmt : null,
        axisNum: this.axisNum ? this.axisNum : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        preAmtStart: this.preAmtStart ? this.preAmtStart : null,
        preAmtEnd: this.preAmtEnd ? this.preAmtEnd : null,
        preNo: this.preNo ? this.preNo : null,
        orgCode: this.orgCode ? this.orgCode : null,
        color: this.color ? this.color : null,
        isOverAmt: this.isOverAmt ? this.isOverAmt : false,
      };
      // let lane=this.lane ? this.lane : null;
      // let aNum=this.axisNum ? this.axisNum : null;
      //  data.lane
      console.info(data);
      if (data.lane != null) {
        //   for(let i=0;i<data.lane.length;i++)
        //   {
        //     data.lane[i]=this.laneMapReverse[data.lane[i]];

        //  }
        data.lane = data.lane.toString();
      }
      if (data.axisNum != null) {
        data.axisNum = data.axisNum.toString();
      }

      if (
        this.startT == null ||
        this.endT == null ||
        this.startT == "" ||
        this.endT == "" ||
        this.startT == undefined ||
        this.endT == undefined
      ) {
        alert("日期范围不能为空！");
        return;
      }

      exportPreCheckDataHistoryListImg(1, -1, data)
        .then((res) => {
          // alert("导出成功！");
          console.info(res);
          let url = "picExport/" + res.data.data;
          // console.info(url);
          // try {
          //   let elementIFtrame = document.createElement("iframe");
          //   elementIFtrame.src = url;
          //   elementIFtrame.style.display = "none";
          //   document.body.appendChild(elementIFtrame);
          //   // 1s之后删除
          //   setTimeout(() => {
          //     elementIFtrame.remove();
          //   }, 1000);
          // } catch (error) {
          //   console.info(error);
          // }
          window.open(url);
        })
        .catch((error) => {
          console.info(error);
        });
    },
    downloadImg() {
      // return;
      if (this.downloadFlag != 0) {
        alert("已有下载任务 请等待！");
        return;
      }

      const start = this.startT;
      const end = this.endT;
      if (start && start !== "" && end && end !== "") {
        let diff = this.us_differ_day(start, end);
        console.info("diff=" + diff);
        if (diff > 3) {
          alert("只能导出间隔三天的数据");
          return;
        }

        this.startT = dateFormat(start, "YYYY-MM-DD HH:mm:ss");
        this.endT = dateFormat(end, "YYYY-MM-DD HH:mm:ss");
      } else {
        this.startT = "";
        this.endT = "";
      }
      if (
        this.startT == null ||
        this.endT == null ||
        this.startT == "" ||
        this.endT == "" ||
        this.startT == undefined ||
        this.endT == undefined
      ) {
        alert("日期范围不能为空！");
      } else {
        //  this.exportImg();
        this.exportImg2();
      }
      // this.current = 1;
    },
    exportImg2() {
      let data = {
        carNo: this.carNo ? this.carNo : null,
        lane: this.lane ? this.lane : null,
        limitAmt: this.limitAmt ? this.limitAmt : null,
        axisNum: this.axisNum ? this.axisNum : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        preAmtStart: this.preAmtStart ? this.preAmtStart : null,
        preAmtEnd: this.preAmtEnd ? this.preAmtEnd : null,
        preNo: this.preNo ? this.preNo : null,
        orgCode: this.orgCode ? this.orgCode : null,
        color: this.color ? this.color : null,
        isOverAmt: this.isOverAmt ? this.isOverAmt : false,
      };
      // let lane=this.lane ? this.lane : null;
      // let aNum=this.axisNum ? this.axisNum : null;
      //  data.lane
      console.info(data);
      if (data.lane != null) {
        data.lane = data.lane.toString();
      }
      if (data.axisNum != null) {
        data.axisNum = data.axisNum.toString();
      }

      if (
        this.startT == null ||
        this.endT == null ||
        this.startT == "" ||
        this.endT == "" ||
        this.startT == undefined ||
        this.endT == undefined
      ) {
        alert("日期范围不能为空！");
        return;
      }

      exportPreCheckDataHistoryListImg(1, -1, data)
        .then((res) => {
          // alert("导出成功！");
          console.info(res);
          // 提交任务后
          if (res.data.code == 200) {
            // 这里现在可以得到一个id
            this.downLoadId = res.data.data;
            this.ctrlDownloadStatusDisplay(res.data.data);
            this.downloadFlag = 1;
          }

          // let url = "picExport/" + res.data.data;
          // window.open(url);
        })
        .catch((error) => {
          console.info(error);
        });
    },
    ctrlDownloadStatusDisplay(did) {
      // this.isOverDownload=true;
      // 创建定时器
      this.queryDownLoad(did);

      this.downloadTimer = setInterval(() => {
        this.queryDownLoad(did);
      }, 1000);
      // 设置定时任务
    },
    queryDownLoad(did) {
      const that = this;
      getnewDownload(did)
        .then((res) => {
          if (res.data.code == 200) {
            that.isDownload = true;
            that.downloadMsg = res.data.data;
            that.myPercent = parseInt(res.data.data.percent * 100);
            console.info(that.myPercent);
            if (that.downloadMsg.state == 1) {
              that.isOverDownload = true;
            }

            // if(res.data.data)
          } else if (res.data.code == -5) {
            // 如果不存在数据
            that.downloadMsg = null;
            that.isDownload = false;
            that.isOverDownload = false;
            clearInterval(that.downloadTimer);
          }
        })
        .catch((error) => {
          console.info(error);
        });
    },
    getLaneMap(oCode) {
      // 得到当前org的检测站
      // let orgcode = this.orgCode;
      selectAllCamera().then((res) => {
        let scanList = res.data.data;
        // 查询scan表中相应orgcode的设备
        // debugger
        let scanOnlyOrgList = scanList.filter((item) => item.orgCode == oCode);
        let maps = [];
        let maps2 = [];
        for (let i = 0; i < this.maxLane; i++) {
          //  if(maps[i]==undefined || maps[i]==null)
          //   maps[i]=0;
          //  if(maps2[i]==undefined || maps2[i]==null)
          //   maps2[i]=0;
        }

        for (let i = 0; i < scanOnlyOrgList.length; i++) {
          if (scanOnlyOrgList[i].direction == 1) {
            maps[scanOnlyOrgList[i].lane] = scanOnlyOrgList[i].showLane;
            maps2[scanOnlyOrgList[i].showLane] = scanOnlyOrgList[i].lane;
          }
        }

        this.laneMap = maps;
        this.laneMapReverse = maps2;
        // console.info(maps);
      });
      // 生成设备车道：展示车道map
    },
    laneChange() {
      console.info(this.lane);
    },
    getDownLoadList() {
      getDownloadListByUser()
        .then((res) => {
          // console.info(res);
          this.downLoadData = res.data.data;
        })
        .catch((err) => {
          console.info(err);
        });
    },
    letDownLoad() {
      // console.info("a click!");
      // 开启下载
      clearInterval(this.downloadTimer);
      let url = "picExport/" + this.downloadMsg.fileName;
      window.open(url);
      this.isDownload = false;
      this.isOverDownload = false;
      this.downloadFlag = 0;
    },
  },

  mounted() {
    // this.tablecolHeight =
    //   window.innerHeight - this.$refs.table.$el.offsetTop - 240;
    this.tablecolHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 200;
    this.tableWidth = window.innerWidth * 0.7;
    // this.ctrlDownloadStatusDisplay();
    this.getcarType();
    this.getAllCheckStation();
    this.getDownLoadList();
    const that = this;
    setTimeout(function () {
      that.handlePreListApproveHistory();
    }, 100);
    // this.displaySelectCheck();
  },
  beforeDestroy() {
    // this.downloadTimer=null;
    // clearInterval(this.downloadTimer);
  },
  destroyed() {
    clearInterval(this.downloadTimer);
  },
  computed: {
    // scrollerWidth: function () {
    //     return (window.innerWidth * 0.66) + "px";
    // },
    // scrollerHeight: function () {
    //     return (window.innerHeight * 0.88) + "px";
    // }
  },
};
</script>