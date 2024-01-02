<template>
  <div class="right-content">
    <!-- :style="{ width: scrollerRightWidth, height: scrollerHeight }" -->

    <div class="center-content">
      <!-- <p class="right-left-title">
            <Icon type="md-volume-up" size="24" />
            检测点信息
        </p> -->
      <div v-if="displaySelect" :key="update" class="header-select">
        <Dropdown @on-click="checkClick">
          <a>{{ orgName }}</a>

          <Icon :size="18" type="md-arrow-dropdown"></Icon>

          <DropdownMenu slot="list">
            <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
            <!-- <DropdownItem name="ALL">
              <a> 所有检测站 </a>
            </DropdownItem> -->
            <DropdownItem
              v-for="(item, index) in checkList"
              :key="index + 1"
              :name="index"
            >
              <a> {{ checkList[index].name }} </a>
            </DropdownItem>
            <!-- <DropdownItem name="">
          修改密码
        </DropdownItem>
        <DropdownItem name="">退出登录</DropdownItem> -->
          </DropdownMenu>
        </Dropdown>
      </div>

      <div class="org-content">
        <p class="org-title">
          {{ orgObject.name }}
        </p>
        <div class="org-title-pad"></div>
        <div class="car-lables">
          <div class="left-lable">
            <p class="lables1">位置: {{ orgObject.location }}</p>

            <p class="lables2">桩号: {{ orgObject.pileNo }}</p>
            <p class="lables3">所属高速: {{ orgObject.expressway }}</p>
          </div>
          <div class="right-lable">
            <p class="lables4">车道数: {{ orgObject.lane }}</p>
            <p class="lables5">
              方向:
              {{ orgObject.directionName }}
              <!-- {{
                orgObject.direction === 1
                  ? "下行"
                  : orgObject.direction === 0
                  ? "上行"
                  : "无"
              }} -->
            </p>
            <!-- <p class="lables6">
              建成时间:
              {{ new Date(orgObject.buildTime) | dateFormat("YYYY年MM月DD日") }}
            </p> -->
          </div>
        </div>
      </div>
    </div>

    <p v-if="displayCheckList" class="right-left-title">
      <Icon type="md-volume-up" size="24" />
      精检车列表
    </p>
    <div v-if="displayCheckList" class="checkList-content">
      <Table
        :columns="columns3"
        :data="checkDataList"
        size="small"
        ref="table2"
        highlight-row
        :height="tableHeight2"
        :row-class-name="rowClassNameCheck"
        class="lll"
      >
      </Table>
    </div>

    <p v-if="displayStatis" class="right-left-title">
      <Icon type="md-volume-up" size="24" />
      当日车辆统计
    </p>

    <div v-if="displayStatis" class="top-content">
      <div class="car-statis-up">
      <p class="right-title">超限车统计</p>
      </div>
      <div class="car-statis-mid">
      <div class="car-count">
        <!-- <p class="right-left-title" style="margin-top: -.5rem;">
                    <Icon type="md-volume-up" size="24" />
                    当日车辆统计
                </p> -->
        <div class="car-liu">
          <Icon type="md-car" size="36" />
          <span class="cars">车流量(次) </span>
          <span class="car-num">{{ carCount }}</span>
                    <!-- <span class="car-num">99999</span> -->

        </div>
        <div class="car-msg-content">
        <div class="left-span content-span">
          <p class="dg-title">超载30%以上</p>
          <p class="dg-msg">数量：{{ limitC }}</p>

          <p class="dg-msg">占比：{{ limitCPer }}%</p>
        </div>
        <div class="right-span content-span">
          <p class="dg-title">100t以上</p>
          <p class="dg-msg">数量：{{ limitB }}</p>

          <p class="dg-msg">占比：{{ limitBPer }}%</p>
        </div>
        </div>
      </div>

      <div class="pieChart" id="pieChart">
        <!-- <chart-pie style="height: 300px;" :value="pieData" text="当日车辆统计"></chart-pie> -->
        <!-- <Card shadow>
          
        </Card> -->
      </div>
      </div>
      <!-- <div class="car-statis-bottom"> -->
      <div class="lineChart" id="lineChart"></div>
      <!-- </div> -->
    </div>

    <p class="right-left-title">
      <Icon type="md-volume-up" size="24" />
      预检车列表
    </p>
    <div class="down-content" ref="carList">
      <Table
        v-if="!displayCheckList"
        :columns="columns1"
        :data="tableData"
        size="small"
        ref="table"
        highlight-row
        :height="tableHeight1"
        :row-class-name="rowClassName"
        class="lll"
      >
      </Table>
      <Table
        v-if="displayCheckList"
        :columns="columns2"
        :data="tableData"
        size="small"
        ref="table"
        highlight-row
        :height="tableHeight1"
        :row-class-name="rowClassName"
        class="lll"
      >
      </Table>
    </div>
  </div>
</template>

<script>
import "./count-msg.less";
import {
  getPreCheckDataNewList,
  getCarCountCurrent,
  getCarOverLoadCurrent,
  getCarCountLast24H,
  getCarTypeCountCurrent,
} from "@/api/preCheckData";
import { getOrgInfoByCode, selectAllOrg, selectAllPerCheckOrg } from "@/api/nspOrg";
import { ChartPie, ChartBar } from "_c/charts";

import { getcheckDataNewList } from "@/api/checkData";
import { getAwsCarTypeList } from "@/api/awsCarType";
import { selectAllCamera } from "@/api/scan";
import * as echarts from "echarts";

export default {
  name: "count-msg",
  components: {
    ChartPie,
    ChartBar,
  },
  props: {
    orgCheckList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      orgName: "选择检测站",
      carCount: 0,
      limitC: 0,
      limitCPer: 0,
      limitB: 0,
      limitBPer: 0,
      handleModal: false,
      columns1: [
        // {
        //   title: "序号",
        //   type: "index",
        // },
        
        {
          title: "时间",
          key: "createTime",
          width: 200,
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
                style: { },
              },
              laneName
            );
          },
        },
        {
          title: "车牌",
          key: "carNo",
          width: 120,
        },
        {
          title: "轴数",
          key: "axisNum",
        },

        {
          title: "限重",
          key: "limitAmt",
          // width: 70,
        },
        {
          title: "预检",
          key: "preAmt",
          // width: 90,
        },

        {
          title: "车速",
          key: "speed",
          // width: 70,
        },

      ],
      columns2: [
                {
          title: "时间",
          key: "createTime",
          width: 200,
        },
        {
          title: "车牌",
          key: "carNo",
          width: 120,
        },

        {
          title: "限重",
          key: "limitAmt",
          // width: 70,
        },
        {
          title: "预检",
          key: "preAmt",
          // width: 90,
        },
        {
          title: "轴数",
          key: "axisNum",
          // width: 80,
        },

        {
          title: "超重",
          // key: "createTime",
          width: 100,
          render: (h, params) => {
             let precentData = 0;

            precentData =
              (params.row.preAmt - params.row.limitAmt) / params.row.limitAmt;
            
            if (precentData < 0) {
              precentData = 0;
            }
            let precent = precentData.toLocaleString(undefined, {
              style: "percent",
              minimumFractionDigits: 2,
            });
            return h(
              "span",
              {
                style: {},
              },
              precent
            );
          },
        },
      ],
      columns3: [
        {
          title: "时间",
          key: "checkTime",
          width: 200,
        },
        {
          title: "车牌",
          key: "carNo",
          width: 120,
        },

        {
          title: "轴数",
          // key: "axisNum",
          // width: 70,
             render: (h, params) => {
            let cid = parseInt(params.row.carTypeId);
            let aNum = this.carIdMap[cid].axisNum;

            return h(
              "span",
              {
                style: {},
              },
              aNum
            );
          },
        },

        {
          title: "复检",
          key: "checkAmt",
          // width: 80,
        },
       
          {
          title: "超重",
          key: "overAmt",
          // width: 120,
          //   render: (h, params) => {
          //   let cid=parseInt(params.row.carTypeId);
          //   let cartype=this.carIdMap[cid].name;

          //   return h(
          //     "span",
          //     {
          //       style: {},
          //     },
          //     cartype
          //   );
          // },
        },
        {
          title: "超重比例",
          key: "overAmt",
          width: 100,
          render: (h, params) => {
             let precentData = 0;
            if (params.row.overAmt != null && params.row.checkAmt != null) {
              if (params.row.checkAmt - params.row.overAmt == 0) {
                precentData = 1;
              } else {
             precentData =
              params.row.overAmt / (params.row.checkAmt - params.row.overAmt);
              }
            } else {
              precentData = 0;
            }
            // console.info()
            if (precentData < 0) {
              precentData = 0;
            }

            let precent = precentData.toLocaleString(undefined, {
              style: "percent",
              minimumFractionDigits: 2,
            });
            return h(
              "span",
              {
                style: {},
              },
              precent
            );
          },
        },
      ],
      tableData: [],
      tableHeight1: 0,
      tableHeight2: 0,
      tableWidth1: 0,
      checkList: [],
      orgObject: [],
      lisTimer: null,
      update: false,
      lisTimer1: null,
      displaySelect: true,
      orgCode: localStorage.getItem("orgCode"),
      checkDataList: [],
      laneMap: [],
      pieData: [
        { value: 335, name: "2轴18吨车型" },
        { value: 310, name: "3轴27吨车型" },
        { value: 234, name: "3轴25吨车型" },
        { value: 135, name: "4轴31吨车型" },
        { value: 156, name: "4轴36吨车型" },
        { value: 89, name: "5轴42吨车型" },
        { value: 254, name: "5轴43吨车型" },
        { value: 1548, name: "6轴及以上" },
      ],

      lineTitle: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24,
      ],
      lineData: [
        42, 132, 234, 264, 322, 221, 251, 215, 256, 125, 80, 105, 264, 235, 156,
        321, 152, 423, 125, 221, 98, 107, 21, 36,
      ],
      displayStatis: true,
      displayCheckList: false,
      carIdMap: [],
    };
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.lisTimer);
      clearInterval(this.lisTimer1);
    },
    initPieCharts() {
      // let myChart = this.$echarts.init(this.$refs.pieChart);
      let myChart = this.$echarts.init(document.getElementById("pieChart"));

      // 绘制图表
      myChart.setOption({
        title: {
          // text: '当日车辆统计',
          left: "center",
          textStyle: {
            fontSize: 20,
            color: "#e1e5ed",
          },
        },
        tooltip: {
          show: true,
          trigger: "item",
          //  confine: true,//限制tooltip在图表范围内展示
          // extraCssText: 'max-height:40%;overflow:scroll',//最大高度以及超出处理
          // enterable: true//鼠标可以进入tooltip区域，使用滚动条
        },
        legend: {
          top: "center",
          left: "0",
          orient: "vertical",
          textStyle: {
            color: "#e1e5ed",
          },
        },
        series: [
          {
            name: "车型",
            type: "pie",
            radius: ["50%", "80%"],
            left: "30",
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.pieData,
          },
        ],
      });
    },
    initLineCharts() {
      let myChart = this.$echarts.init(document.getElementById("lineChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "24小时车流量趋势",
          textStyle: {
            fontSize: 10,
            color: "#e1e5ed",
          },
        },
        textStyle: {
          color: "#e1e5ed",
        },
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "18%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,

          data: this.lineTitle,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
        },

        series: [
          {
            data: this.lineData,
            type: "line",
            // 设置面积区域为渐变效果
            lineStyle: {
              width: 1,
              color: "#44E2F0",
            },
            areaStyle: {
              color: "#44E2F0",
            },
          },
        ],
      });
    },

    getPreList() {
      console.info("监测站", this.orgCode);
      // debugger
      getPreCheckDataNewList(this.orgCode)
        .then((res) => {
          this.tableData = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getOrgInfo() {
      getOrgInfoByCode(this.orgCode)
        .then((res) => {
          this.orgObject = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    rowClassName(row, index) {
      // if(row.overAmt>0)
      if (row.preAmt>row.limitAmt) {
        if (row.axisNum >= 6) {
// warningColorRed
        return "demo-table-info-row warningColorRed";
        } else {
       return "warningColorYellow demo-table-info-row";
        }
      }

      return "demo-table-info-row";
    },
     rowClassNameCheck(row, index) {
      if (row.overAmt>0) {
        if (this.carIdMap[row.carTypeId].axisNum >= 6) {
        return "demo-table-info-row warningColorRed";
        } else {
        return "warningColorYellow demo-table-info-row";
        }
      }
      return "demo-table-info-row";
    },
    getCarCountCurrent() {
      var that = this;
      getCarCountCurrent()
        .then((res) => {
          //    console.info(res)
          //   debugger;
          that.carCount = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getCarOverLoadCurrent() {
      getCarOverLoadCurrent()
        .then((res) => {
          //  console.info(res)
          this.limitC = res.data.data[0];
          this.limitCPer = res.data.data[1];
          this.limitB = res.data.data[2];
          this.limitBPer = res.data.data[3];
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getCarCountLast24H() {
      if (this.displayCheckList) {
        return;
      }
      getCarCountLast24H()
        .then((res) => {
          //   console.info(res)
          this.lineData = res.data.data[0];
          this.lineTitle = res.data.data[1];
          this.initLineCharts();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getCarTypeCountCurrent() {
      if (this.displayCheckList) {
        return;
      }
      getCarTypeCountCurrent()
        .then((res) => {
          //  console.info(res)
          this.pieData = res.data.data;
          this.initPieCharts();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async checkClick(name) {
      // alert(name);
      if (name == "ALL") {
        // debugger
        await localStorage.setItem("orgCode", "9999");
        this.orgName = "所有检测站";
        this.remounted();
        //  this.$parent.handleCountRefresh();

        // this.$router.go(0);
        // window.location.reload(true);
      } else {
        let org_code = this.checkList[name].code;
        this.orgName = this.checkList[name].name;
        await localStorage.setItem("orgCode", org_code);
        //  this.$parent.handleCountRefresh();
        this.$parent.changeVideo(org_code);
        this.$parent.manPageLanePicDisplay(org_code);

        this.remounted();
        // this.$router.go(0);
        // location.reload();
        // window.location.reload(true);
      }
    },
    getAllCheckStation() {
      // 查询检测站

      // debugger
      //   const that = this;
      let rid = localStorage.getItem("roleId");
      let ocode = localStorage.getItem("orgCode");

      // 拉取所有的检测站
      selectAllPerCheckOrg()
        .then((res) => {
          // debugger
          console.info(res.data.data);
          let cList = res.data.data;
          // 判断roleid
          switch (rid) {
            case "1": // 大用户什么都不用干
              break;
            case "2": // 普通用户 只要当前orgcode
              cList = res.data.data.filter((item) => item.code == ocode);
              break;
            case "3": // 精检站用户
              //  cList=cList.filter(item=>item.code==oCode);
              break;
          }
          this.getLaneMap(ocode);
          console.info(cList);
          // this.checkList.push(cList[0]);
          this.checkList = cList;
          // this.checkList = res.data.data;
          // this.checklist=JSON.parse(JSON.stringify(this.checkList ));
        })
        .catch((err) => {
          console.info(err);
        });
      //   this.$parent.handleCountRefresh();
    },
    displaySelectCheck() {
      const that = this;
      let rid = localStorage.getItem("roleId");
      if (rid == 1 || rid == "1") {
        that.displaySelect = true;
      } else {
        that.displaySelect = false;
      }
    },
    ctrlDisplayCountMsg() {
      let rid = localStorage.getItem("roleId");
      if (rid == 3 || rid == "3") {
        this.displayStatis = false;
        this.displayCheckList = true;
      }
    },
    getCheckDataList() {
      getcheckDataNewList("")
        .then((res) => {
          // console.info("11111",res);
          this.checkDataList = res.data.data;
        })
        .catch((error) => {
          console.info(error);
        });
    },
    makeCarTypeMap() {
      getAwsCarTypeList()
        .then((res) => {
          // console.info(res.data.data);
          let maps = [];
          for (var i = 0; i<res.data.data.length; i++) {
            maps[res.data.data[i].id] = res.data.data[i];
          }
          this.carIdMap = maps;
          console.info(this.carTypeMap);
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
        for (let i = 0; i < scanOnlyOrgList.length; i++) {
          if (scanOnlyOrgList[i].direction == 1) {
            maps[scanOnlyOrgList[i].lane] = scanOnlyOrgList[i].showLane;
          }
        }

        this.laneMap = maps;
       // this.laneMapReverse = maps2;
        console.info(maps);
      });
      // 生成设备车道：展示车道map
    },

    remounted() {
      console.info(localStorage.getItem("orgCode"));

      this.beforeDestroy();
      this.getPreList();
      this.makeCarTypeMap();

      this.displaySelectCheck();
      this.ctrlDisplayCountMsg();

      this.getCarCountCurrent();
      this.getCarOverLoadCurrent();
      this.getCarCountLast24H();
      this.getCarTypeCountCurrent();
      this.getCheckDataList();

      this.getOrgInfo();
      this.lisTimer = setInterval(() => {
        this.getCarCountCurrent();
        this.getCarOverLoadCurrent();
        this.getCarCountLast24H();
        this.getCarTypeCountCurrent();
        this.getPreList();
        this.getCheckDataList();
        // this. getAllCheckStation();
        // }, 2 * 60 * 1000)
      }, 1 * 2 * 1000);
    },
  },
  created() {
    // this. getAllCheckStation();
  },
  mounted() {
    this.getAllCheckStation();
    this.remounted();
    //  this.tableData = testData.histories;
    // this.tableHeight1 = (window.innerHeight * 0.27);
    // this.tableHeight1 =window.innerHeight - this.$refs.table.$el.offsetTop - 21;
       this.tableHeight1 =
      window.innerHeight - this.$refs.table.$el.offsetTop - 21;
    this.tableHeight2 = window.innerHeight * 0.375;
    // (window.innerHeight - this.$refs.table2.$el.offsetTop);
    // this.tableWidth = (window.innerWidth * 0.31);
  },
  destroyed() {
    this.beforeDestroy();
  },
};
</script>