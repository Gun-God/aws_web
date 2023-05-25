<template>
    <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->
    <div style="overflow:auto;height: 100%;width: 100%;">
        <div class="left-content">
            <Tabs type="card">
                <!-- 预检历史数据展示 -->
                <TabPane label="预检历史数据" name="name2">
                    <label prop="name">&nbsp;车牌：&nbsp;</label>
                    <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;车道：&nbsp;</label>
                    <Input v-model="lane" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;限重：&nbsp;</label>
                    <Input v-model="limitAmt" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
                    <label prop="name">&nbsp;轴数：&nbsp;</label>
                    <Input v-model="axisNum" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
                    <Button @click="search" type="primary" icon="ios-search" class="input-search">查询</Button>&nbsp;&nbsp;
                    <Table :columns="columns" :data="tableData" size="small" ref="table" highlight-row
                        :height="tablecolHeight" :width="tableWidth">
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
                <TabPane label="精检历史数据" name="name3">
                    <checkHistory></checkHistory>
                </TabPane>

                <!-- 情报板历史数据展示 -->
                <TabPane label="情报板历史数据" name="name4">
                    <ledHistory></ledHistory>
                </TabPane>

                <!-- 车牌历史数据展示 -->
                <TabPane label="车牌历史数据展示" name="name5">
                    <carHistory></carHistory>
                </TabPane>
            </Tabs>
        </div>
        <count-msg></count-msg>

    </div>
</template>


<script>

import './pre-history.less';

import CountMsg from './count-msg.vue'
import { getPreCheckDataHistoryList } from '@/api/preCheckDataHistory'
import { getCheckDataList } from '@/api/checkData'
import { getLedList } from '@/api/led'
import checkHistory from './check-history.vue'
import ledHistory from './led-history.vue'
import carHistory from './car-no-history.vue'





export default {
    name: "prehis_page",
    components: {
        CountMsg,
        checkHistory,
        ledHistory,
        carHistory
    },
    data() {
        return {


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
            dataCount1: 1,
            dataCount2: 1,
            //当前页数
            current: 1,
            current1: 1,
            current2: 1,
            // 每页显示多少条
            pageSize: 30,
            pageSize1: 30,
            pageSize2: 30,
            // 设置table的表头
            columns: [
                // {
                //     title: "序号",
                //     type: "index",
                //     width: 70
                // },
                {
                    title: "流水号",
                    width: 200,
                    key: "preNo"
                },
                {
                    title: "车牌",
                    key: "carNo"
                },
                {
                    title: "自重(吨)",
                    key: "weight"
                },
                {
                    title: "限重(吨)",
                    key: "limitAmt"
                },
                {
                    title: "轴数",
                    key: "axisNum"
                },
                {
                    title: "车速(km/h)",
                    key: "speed"
                },
                {
                    title: "车道",
                    key: "lane"
                }
                ,
                {
                    title: "时间",
                    width: 200,
                    key: "createTime"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ],

            columns1: [
                // {
                //     title: "序号",
                //     type: "index",
                //     width: 70
                // },
                {
                    title: "流水号",
                    width: 150,
                    key: "code"
                },
                {
                    title: "车牌",
                    width: 150,
                    key: "carNo"
                },

                {
                    title: "货物",
                    key: "goods"
                },
                {
                    title: "初检",

                    key: "amt"
                },
                {
                    title: "初检超载",
                    // width: 200,
                    key: "overAmt"
                },

                {
                    title: "初检时间",
                    width: 200,
                    key: "createTime"
                },
                {
                    title: "初检员",
                    width: 150,
                    key: "operName"
                },

                {
                    title: "复检",
                    key: "checkAmt"
                },
                {
                    title: "复检超载",

                    key: "checkUnload"
                },
                {
                    title: "复检时间",
                    width: 200,
                    key: "checkTime"
                },
                {
                    title: "复检员",
                    width: 150,
                    key: "checkOper"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ],

            columns2: [
                {
                    title: "序号",
                    type: "index",
                    width: 70
                },
                // {
                //     title: "流水号",
                //     width: 200,
                //     key: "preNo"
                // },
                {
                    title: "名字",

                    key: "name"
                },
                {
                    title: "内容",
                    key: "content"
                },
                {
                    title: "时间",
                    width: 200,
                    key: "createTime"
                },
                {
                    title: "检测站",
                    key: "limitAmt"
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
            tableData: [],
            tableData1: [],
            tableData2: [],
            tablecolHeight: 0,
            tableWidth: 0,
            pageList: [30, 50, 100, 500],

            carNo: "",
            lane: "",
            limitAmt: "",
            axisNum: "",
        };
    },
    // 方法
    methods: {
        ok() { },
        cancel() { },
        // 查找按钮
        search() {
            this.current = 1
            this.handlePreListApproveHistory();

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
            };
            // let data={
            //     carNo:"323",
            //     lane:2
            // }
            getPreCheckDataHistoryList(this.current, this.pageSize, data).then(res => {
                const data = res.data.data;
                this.tableData = data.list;
                this.dataCount = data.total;
            }).catch(err => {
                console.info(err)
            })

        },


        handleListApproveHistory() {
            getCheckDataList(this.current1, this.pageSize1).then(res => {
                const data = res.data.data;
                this.tableData1 = data.list;
                this.dataCount1 = data.total;
            }).catch(err => {
                console.info(err)
            })

        },

        handleLedListApproveHistory() {
            getLedList(this.current2, this.pageSize2).then(res => {
                const data = res.data.data;
                this.tableData2 = data.list;
                this.dataCount2 = data.total;
            }).catch(err => {
                console.info(err)
            })

        },

        changepage(index) {
            this.current = index;
            this.handlePreListApproveHistory();
        },
        changePageSize(size) {
            console.info(size);
            this.pageSize = size;
            this.handlePreListApproveHistory();
        },
        changepage1(index) {
            this.current1 = index;
            this.handleListApproveHistory();
        },
        changePageSize1(size) {
            console.info(size);
            this.pageSize1 = size;
            this.handleListApproveHistory();
        },
        changepage2(index) {
            this.current2 = index;
            this.handleLedListApproveHistory();
        },
        changePageSize2(size) {
            console.info(size);
            this.pageSize2 = size;
            this.handleLedListApproveHistory();
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
        this.tablecolHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 255;
        this.tableWidth = (window.innerWidth * 0.65);
        this.handlePreListApproveHistory();
        this.handleListApproveHistory();
        this.handleLedListApproveHistory();
    },
    computed: {
        scrollerWidth: function () {
            return (window.innerWidth * 0.66) + "px";
        },
        scrollerHeight: function () {
            return (window.innerHeight * 0.88) + "px";
        }


    },
};
</script>