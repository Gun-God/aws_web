<template>
    <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->

    <div>

       
                    <label prop="name">&nbsp;姓名：&nbsp;</label>
                    <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
                    <Button @click="search" type="primary" icon="ios-search" class="input-search">查询</Button>&nbsp;&nbsp;
                    <Table :columns="columns2" :data="tableData2" size="small" ref="table" highlight-row
                        :height="tablecolHeight" :width="tableWidth">
                        <!-- <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template> -->
                        <!-- <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
                        </template> -->
                    </Table>

                    <div class="page-info">
                        <div>
                            <Page :total="dataCount2" :page-size="pageSize2" show-total show-elevator show-sizer
                                :current="current2" :page-size-opts="pageList" prev-text="上一页" next-text="下一页"
                                @on-change="changepage2" @on-page-size-change="changePageSize2"></Page>
                        </div>
                    </div>


    

    </div>
</template>


<script>


import { getLedList } from '@/api/led'


export default {
    name: "led_page",
    data() {
        return {


         
            formValidate: {
                name: "",
                flight: "",
                begin: "",
                destination: ""
            },

            // 初始化信息总条数
           
            dataCount2: 1,
            //当前页数
           
            current2: 1,
            // 每页显示多少条
           
            pageSize2: 30,
         
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
            getLedList(this.current2, this.pageSize2).then(res => {
                const data = res.data.data;
                this.tableData2 = data.list;
                this.dataCount2 = data.total;
            }).catch(err => {
                console.info(err)
            })

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