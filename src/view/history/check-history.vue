<template>
    <div>
        <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->
        <label prop="name">&nbsp;车牌：&nbsp;</label>
        <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
        <label prop="name">&nbsp;车道：&nbsp;</label>
        <Input v-model="lane" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
        <label prop="name">&nbsp;限重：&nbsp;</label>
        <Input v-model="limitAmt" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
        <label prop="name">&nbsp;轴数：&nbsp;</label>
        <Input v-model="axisNum" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;

        <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker type="daterange" v-model="datePicker" :options="options2" 
            placeholder="选择日期范围" style="width: 200px"></DatePicker>


        <Button @click="search" type="primary" class="input-search" icon="ios-search">查询</Button>&nbsp;&nbsp;
        <Button @click="cancel" type="error" icon="md-refresh" class="input-search">重置</Button>&nbsp;&nbsp;

        <Table :columns="columns1" :data="tableData1" size="small" ref="table" highlight-row :height="tablecolHeight"
            :width="tableWidth" :row-class-name="rowClassName" class="lll">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(index, 1)">查看</Button>
            </template>
        </Table>

        <div class="page-info">
            <div>
                <Page :total="dataCount1" :page-size="pageSize1" show-total show-elevator show-sizer :current="current1"
                    :page-size-opts="pageList" prev-text="上一页" next-text="下一页" @on-change="changepage1"
                    @on-page-size-change="changePageSize1"></Page>
            </div>
        </div>
    </div>
</template>


<script>
import { getCheckDataList } from '@/api/checkData'
import { dateFormat } from '@/libs/filters'


export default {
    name: "check_history_page",
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
            dataCount1: 1,
            //当前页数
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
                    width: 200,
                    align: "center",
                    key: "code"
                },
                {
                    title: "车牌",
                    align: "center",
                    width: 150,
                    key: "carNo"
                },

                {
                    title: "货物",
                    align: "center",
                    key: "goods"
                },
                {
                    title: "初检",
                    align: "center",

                    key: "amt"
                },
                {
                    title: "初检超载",
                    align: "center",
                     width: 80,
                    key: "overAmt"
                },

                {
                    title: "初检时间",
                    align: "center",
                    width: 240,
                    key: "createTime"
                },
                {
                    title: "初检员",
                    align: "center",
                   
                    key: "operName"
                },

                {
                    title: "复检",
                    align: "center",
                    key: "checkAmt"
                },
                {
                    title: "复检超载",
                    align: "center",
  width: 80,
                    key: "checkUnload"
                },
                {
                    title: "复检时间",
                    align: "center",
                    width: 240,
                    key: "checkTime"
                },
                {
                    title: "复检员",
                    align: "center",
                    width: 150,
                    key: "checkOper"
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
            tableData1: [],

            pageList: [30, 50, 100, 500],

            carNo: "",
            lane: "",
            limitAmt: "",
            axisNum: "",
            datePicker: [],
            startT:"",
            endT:"",
        };
    },
    // 方法
    methods: {
        ok() { },
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
            this.startT='';
            this.endT='';
            this.current = 1
            const start = this.datePicker[0];
            const end = this.datePicker[1];
            if (start && start !== '' && end && end !== '') {
                this.startT = dateFormat(start, "YYYY-MM-DD")
                this.endT = dateFormat(end, "YYYY-MM-DD")
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
                content: `车牌:${data[index].carNo}<br>车道:${data[index].lane}`
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
            };

            getCheckDataList(this.current1, this.pageSize1,data).then(res => {
                const data = res.data.data;
                this.tableData1 = data.list;
                this.dataCount1 = data.total;
            }).catch(err => {
                //console.info(err)
            })

        },




        changepage1(index) {
            this.current1 = index;
            this.handleListApproveHistory();
        },
        changePageSize1(size) {
            //console.info(size);
            this.pageSize1 = size;
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
    // created() {
    //     this.handlePreListApproveHistory();
    // },
    mounted() {
        ////console.info(this.$parent.tablecolHeight);
        // this.tablecolHeight = this.$parent.tablecolHeight;
        // this.tableWidth =  this.$parent.tableWidth;;
      //  this.handleListApproveHistory();

    },

};
</script>