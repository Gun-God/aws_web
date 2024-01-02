<template>
  <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->

  <div>
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
        </Select>&nbsp;&nbsp;

        <label prop="name">&nbsp;车牌：&nbsp;</label>
        <Input
          v-model="carNo"
          class="input-search"
          style="width: 120px"
          placeholder="请输入"
        />&nbsp;&nbsp;

        <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker
          type="daterange"
          v-model="datePicker"
          :options="options2"
          placeholder="选择日期范围"
          style="width: 200px"
        >
        </DatePicker
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
                style="width: 110px"
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
                <Option value="1" key="1">黄色</Option>
               </Select
              >&nbsp;&nbsp;

        <Button
          @click="search"
          type="primary"
          icon="ios-search"
          class="input-search"
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
    </div>

    <Table
      :columns="columns2"
      :data="tableData2"
      size="small"
      ref="table"
      highlight-row
      :height="tablecolHeight"
      :width="tableWidth"
      :row-class-name="rowClassName"
      class="lll"                  @on-row-click="onRowClick"

    >
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
          @on-change="changepage2"
          @on-page-size-change="changepageSize"
        ></Page>
      </div>
    </div>

      <!-- <car-img :key="countRefreshKey" :carFrontImg="carFrontImg"></car-img> -->

  </div>
  
</template>

<script>
import { getCarNoDataList } from "@/api/carNo";
import { dateFormat } from "@/libs/filters";
import { selectAllOrg, getOrgInfoByCode, selectAllPerCheckOrg, selectPerOrgByCheck } from "@/api/nspOrg";
import defaultImg from "@/assets/images/no_img.jpg";
import carImg from "./car-img.vue";

export default {
 
  name: "car_page",
   comments: {
    // carImg
  },
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

      dataCount: 1,
      // 当前页数

      current: 1,
      // 每页显示多少条

      pageSize: 50,

      columns2: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 80,
        },
        // {
        //     title: "流水号",
        //     width: 200,
        //     key: "preNo"
        // },
        {
          title: "标识",
          align: "center",
          key: "code",
        },
        {
          title: "车牌",
          align: "center",
          key: "carNo",
        },
        {
          title: "时间",
          width: 240,
          align: "center",
          key: "createTime",
        },
        {
          title: "检测站",
          align: "center",
          key: "orgCode",
          width: 260,
          //   render: (h, params) => {
          //     let oName = this.orgMap[params.row.orgCode];
          //     return h(
          //       "span",
          //       {
          //         style: { width: "300px" },
          //       },
          //       oName
          //     );
          //   },
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
        //     title: "操作",
        //     slot: "action",
        //     align: "center"
        // }
      ],
      // 设置表格的数据
      // 这里需要设置原数据为空
      // 好像跟实例化一样  不然会出错的

      tableData2: [],

      pageList: [30, 50, 100, 500],
      carNo: "",
      datePicker: [],
      startT: "",
      endT: "",
      orgMap: [],
      orgName: "",
      maxLane: 4,
      checkList: [],
      orgCode: "",
      orgName: "",
      color: "",
      orgSelectName: "",
      carFrontImg: defaultImg 
    };
  },
  // 方法
  methods: {
    ok(index) {
      alert(index);
    },
    cancel() {
      this.carNo = "";
      this.datePicker = [];
      this.search();
    },
    // 查找按钮
    search() {
      this.startT = "";
      this.endT = "";
      const start = this.datePicker[0];
      const end = this.datePicker[1];
      if (start && start !== "" && end && end !== "") {
        this.startT = dateFormat(start, "YYYY-MM-DD");
        this.endT = dateFormat(end, "YYYY-MM-DD");
      }
      this.current = 1;
      this.handleLedListApproveHistory();
    },

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
        content: `车牌:${data[index].carNo}<br>
   
        `,
      });
    },

    handleLedListApproveHistory() {
      let data = {
        carNo: this.carNo ? this.carNo : null,
        startT: this.startT ? this.startT : null,
        endT: this.endT ? this.endT : null,
        color: this.color ? this.color : null,
        orgCode: this.orgCode ? this.orgCode : null
      };

      getCarNoDataList(this.current, this.pageSize, data)
        .then((res) => {
          const data = res.data.data;
          this.tableData2 = data.list;
          this.dataCount = data.total;
        })
        .catch((err) => {
          // console.info(err)
        });
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
            // this.getLaneMap(nowCode);

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
             // this.getLaneMap(nowCode);

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

    changepage2(index) {
      this.current = index;
      this.handleLedListApproveHistory();
    },
    changepageSize(size) {
      // console.info(size);
      this.pageSize = size;
      this.handleLedListApproveHistory();
    },
    rowClassName(row, index) {
      return "demo-table-info-row";
    },
     onRowClick(data, index) {
      console.info("data", data);
      let carFrontImg = data.img ? "car_img/" + data.img : defaultImg;
      // console.info("1111",this.$parent.$parent.$parent.changeCarImg());
    this.$parent.$parent.$parent.changeCarImg(carFrontImg);
      // this.$emit("changeCarImg", carFrontImg);
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
    this.handleLedListApproveHistory();
    this.getAllCheckStation();
  },
};
</script>