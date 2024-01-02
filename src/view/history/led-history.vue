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
        <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;

        <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker type="daterange" v-model="datePicker" :options="options2" placeholder="选择日期范围" style="width: 200px">
        </DatePicker>

        <Button @click="search" type="primary" icon="ios-search" class="input-search">查询</Button>&nbsp;&nbsp;
        <Button @click="cancel" type="error" icon="md-refresh" class="input-search">重置</Button>&nbsp;&nbsp;
            </div>
        </div>
        <Table :columns="columns2" :data="tableData2" size="small" ref="table" highlight-row :height="tablecolHeight"
            :width="tableWidth" :row-class-name="rowClassName" class="lll">
            <!-- <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template> -->
            <!-- <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
                        </template> -->
        </Table>

        <div class="page-info">
            <div>
                <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
                    :page-size-opts="pageList" prev-text="上一页" next-text="下一页" @on-change="changepage2"
                    @on-page-size-change="changepageSize"></Page>
            </div>
        </div>

    </div>
</template>

<script>

import { getLedList } from '@/api/led'
import { dateFormat } from '@/libs/filters'
import {
  selectAllOrg,
  getOrgInfoByCode,
  selectAllPerCheckOrg,
  selectPerOrgByCheck,
} from "@/api/nspOrg";

export default {
    name: "led_page",
    props: ['tablecolHeight', 'tableWidth'],
    data() {
        return {

            options2: {
                shortcuts: [
                    {
                        text: '近一周',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        }
                    },
                    {
                        text: '近一个月',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        }
                    },
                    {
                        text: '近三个月',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            return [start, end];
                        }
                    }
                ]
            },

            formValidate: {
                name: "",
                flight: "",
                begin: "",
                destination: ""
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
                    width: 80,
                    type: "index",
                    align: "center",

                },
                // {
                //     title: "流水号",
                //     width: 200,
                //     key: "preNo"
                // },
                {
                    title: "名字",
                    align: "center",
                    key: "name"
                },
                {
                    title: "内容",
                    align: "center",
                    key: "content"
                },
                {
                    title: "时间",
                    align: "center",
                    width: 240,
                    key: "createTime"
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
            orgSelectName: "检测站",
            orgCode: "",
            checkList: [],
            orgMap: []
        };
    },
    // 方法
    methods: {
        ok() { },
        cancel() {
            this.carNo = "";
            this.datePicker = [];
            this.search();
        },
        // 查找按钮
        search() {
            this.startT = '';
            this.endT = '';
            const start = this.datePicker[0];
            const end = this.datePicker[1];
            if (start && start !== '' && end && end !== '') {
                this.startT = dateFormat(start, "YYYY-MM-DD")
                this.endT = dateFormat(end, "YYYY-MM-DD")
            }
            this.current = 1
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
                content: `车牌:${data[index].carNo}<br>车道:${data[index].lane}`
            });
        },

        handleLedListApproveHistory() {
            let data = {
                carNo: this.carNo ? this.carNo : null,
                startT: this.startT ? this.startT : null,
                endT: this.endT ? this.endT : null,
                orgCode: this.orgCode ? this.orgCode : null,
            };

            getLedList(this.current, this.pageSize, data).then(res => {
                const data = res.data.data;
                this.tableData2 = data.list;
                this.dataCount = data.total;
            }).catch(err => {
                // console.info(err)
            })
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
            //  this.getLaneMap(nowCode);

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
            return 'demo-table-info-row';
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
    }
};
</script>