<template>
    <div>
        <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->
        <label prop="name">&nbsp;姓名：&nbsp;</label>
        <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
        <Button @click="search" type="primary" class="input-search" icon="ios-search">查询</Button>&nbsp;&nbsp;
        <Table :columns="columns1" :data="tableData1" size="small" ref="table" highlight-row :height="tablecolHeight"
            :width="tableWidth">
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


export default {
    name: "check_history_page",

    data() {
        return {
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
                    width: 150,
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
                    // width: 200,
                    key: "overAmt"
                },

                {
                    title: "初检时间",
                    align: "center",
                    width: 200,
                    key: "createTime"
                },
                {
                    title: "初检员",
                    align: "center",
                    width: 150,
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

                    key: "checkUnload"
                },
                {
                    title: "复检时间",
                    align: "center",
                    width: 200,
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
            getCheckDataList(this.current1, this.pageSize1).then(res => {
                const data = res.data.data;
                this.tableData1 = data.list;
                this.dataCount1 = data.total;
            }).catch(err => {
                console.info(err)
            })

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
        this.handleListApproveHistory();

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