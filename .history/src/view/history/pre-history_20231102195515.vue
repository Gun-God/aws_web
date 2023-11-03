<template>
    <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->

    <div style="overflow:hidden;height: 100%;width: 100%;">
        <div class="left-content">
            <Tabs value="1" @on-click="changeTabs">
                <!-- 预检历史数据展示 -->
                <TabPane label="预检历史数据" name="1">
                    <label prop="name">&nbsp;车牌：&nbsp;</label>
                    <Input v-model="carNo" class="input-search input-dark" style="width: 120px"
                        placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;车道：&nbsp;</label>
                    <Input v-model="lane" class="input-search" type="number" style="width: 120px"
                        placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;限重：&nbsp;</label>
                    <Input v-model="limitAmt" class="input-search" type="number" style="width: 120px"
                        placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;轴数：&nbsp;</label>
                    <Input v-model="axisNum" class="input-search" type="number" style="width: 120px"
                        placeholder="请输入" />&nbsp;&nbsp;

                    <label prop="name">&nbsp;日期范围：&nbsp;</label>
                    <DatePicker type="daterange" v-model="datePicker" :options="options2" placeholder="选择日期范围"
                        style="width: 200px"></DatePicker>

                    <Button @click="search" type="primary" icon="ios-search" class="input-search">查询</Button>&nbsp;&nbsp;

                    <Button @click="cancel" type="error" icon="md-refresh" class="input-search">重置</Button>&nbsp;&nbsp;
                    <Table :columns="columns" :data="tableData" size="small" ref="table" highlight-row
                        :height="tablecolHeight" :width="tableWidth" :row-class-name="rowClassName" class="lll">
                        <!-- <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template> -->
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px"
                                @click="show(index, 0)">查看</Button>
                        </template>
                    </Table>

                    <div class="page-info">
                        <div>
                            <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer
                                :current="current" :page-size-opts="pageList" prev-text="上一页" next-text="下一页"
                                @on-change="changepage" @on-page-size-change="changePageSize"></Page>
                        </div>
                    </div>
                </TabPane>

                <!-- 精检历史数据展示 -->
                <TabPane label="精检历史数据" name="2">
                    <checkHistory :tablecolHeight="tablecolHeight" :tableWidth="tableWidth" ref="checkHistory">
                    </checkHistory>
                </TabPane>

                <!-- 情报板历史数据展示 -->
                <TabPane label="情报板历史数据" name="3">
                    <ledHistory :tablecolHeight="tablecolHeight" :tableWidth="tableWidth" ref="ledHistory"></ledHistory>
                </TabPane>

                <!-- 车牌历史数据展示 -->
                <TabPane label="车牌历史数据展示" name="4">
                    <carHistory :tablecolHeight="tablecolHeight" :tableWidth="tableWidth" ref="carHistory"></carHistory>
                </TabPane>
            </Tabs>
        </div>

        <count-msg></count-msg>

    </div>
</template>


<script>

import './pre-history.less';
import CountMsg from './count-msg.vue';
import { getPreCheckDataHistoryList } from '@/api/preCheckDataHistory';
import { getPerCheckDataByQuery } from '@/api/preCheckData';
// import { getCheckDataList } from '@/api/checkData'
// import { getLedList } from '@/api/led'
import checkHistory from './check-history.vue';
import ledHistory from './led-history.vue';
import carHistory from './car-no-history.vue';
import { dateFormat } from '@/libs/filters';





export default {
    name: "prehis_page",

    components: {
        CountMsg,
        checkHistory,
        ledHistory,
        carHistory,
    },
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


            // modal开始为false
            handleModal: false,
            //规则
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
                destination: ""
            },

            // 初始化信息总条数
            dataCount: 0,

            //当前页数
            current: 1,

            // 每页显示多少条
            pageSize: 50,

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
                    key: "preNo"
                },
                {
                    title: "车牌",
                    align: "center",
                    key: "carNo"
                },
                {
                    title: "自重(吨)",
                    align: "center",
                    key: "weight"
                },
                {
                    title: "限重(吨)",
                    align: "center",
                    key: "limitAmt"
                },
                {
                    title: "轴数",
                    align: "center",
                    key: "axisNum"
                },
                {
                    title: "车速(km/h)",
                    align: "center",
                    key: "speed"
                },
                {
                    title: "车道",
                    align: "center",
                    key: "lane"
                }
                ,
                {
                    title: "时间",
                    width: 240,
                    align: "center",
                    key: "createTime"
                },
                {
                    title: "图片",

                    align: "center",
                    className: 'img-custor',
                    key: "img",
                    render: (h, params) => {
                        const data = params.row.img
                        //console.info(data)
                        if (data && data.length !== 0)
                            return h('Icon', {
                                props: {
                                    type: 'md-image',
                                    size: 24,
                                },
                                on: {
                                    click: () => {
                                        this.ok(data)
                                    }
                                }
                            })
                        else
                            return h('span', '');
                    }

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

            tablecolHeight: 0,
            tableWidth: 0,
            pageList: [30, 50, 100, 500],

            carNo: "",
            lane: "",
            limitAmt: "",
            axisNum: "",
            datePicker: [],
            startT: "",
            endT: "",
        };
    },
    // 方法
    methods: {
        rowClassName(row, index) {

            return 'demo-table-info-row';

        },
        ok(index) {
            alert(index)
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
            this.handlePreListApproveHistory();

        },
        cancel() {
            this.carNo = "";
            this.lane = "";
            this.limitAmt = "";
            this.axisNum = "";
            this.datePicker = [];
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
                content: `车牌:${data[index].carNo}<br>车道:${data[index].lane}`
            });
        },

        // 分页
        handlePreListApproveHistory() {

            let data = {
                carNo: this.carNo ? this.carNo : null,
                lane: this.lane ? this.lane : null,
                limitAmt: this.limitAmt ? this.limitAmt : null,
                axisNum: this.axisNum ? this.axisNum : null,
                startT: this.startT ? this.startT : null,
                endT: this.endT ? this.endT : null,
            }


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


            getPreCheckDataHistoryList(this.current, this.pageSize, data).then(res => {
                const data = res.data.data;
                this.tableData = data.list;
                this.dataCount = data.total;
            
            }).catch(err => {
                //console.info(err)
            })
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
            //console.info(size);
            this.pageSize = size;
            this.handlePreListApproveHistory();
        },
        changeTabs(name) {
            if (name === '2')
                this.$refs.checkHistory.handleListApproveHistory();
            if (name === '3')
                this.$refs.ledHistory.handleLedListApproveHistory();
            if (name === '4')
                this.$refs.carHistory.handleLedListApproveHistory();

        }


    },
    mounted() {
        this.tablecolHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 260;
        this.tableWidth = (window.innerWidth * 0.65);
        console.log(11111111111111111);
        this.handlePreListApproveHistory();

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