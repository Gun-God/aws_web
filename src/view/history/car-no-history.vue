<template>
    <!-- :style="{width:scrollerWidth,height:scrollerHeight}" -->

    <div>
        <label prop="name">&nbsp;车牌：&nbsp;</label>
        <Input v-model="carNo" class="input-search" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;

        <label prop="name">&nbsp;日期范围：&nbsp;</label>
        <DatePicker type="daterange" v-model="datePicker" :options="options2"
            placeholder="选择日期范围" style="width: 200px"></DatePicker>


        <Button @click="search" type="primary" icon="ios-search" class="input-search">查询</Button>&nbsp;&nbsp;
        <Button @click="cancel" type="error" icon="md-refresh" class="input-search">重置</Button>&nbsp;&nbsp;

        <Table :columns="columns2" :data="tableData2" size="small" ref="table" highlight-row :height="tablecolHeight"
            :width="tableWidth">
            <!-- <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template> -->
            <!-- <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
                        </template> -->
        </Table>

        <div class="page-info">
            <div>
                <Page :total="dataCount2" :page-size="pageSize2" show-total show-elevator show-sizer :current="current2"
                    :page-size-opts="pageList" prev-text="上一页" next-text="下一页" @on-change="changepage2"
                    @on-page-size-change="changePageSize2"></Page>
            </div>
        </div>




    </div>
</template>


<script>


import { getCarNoDataList } from '@/api/carNo'
import { dateFormat } from '@/libs/filters'


export default {
    name: "car_page",
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

            dataCount2: 1,
            //当前页数

            current2: 1,
            // 每页显示多少条

            pageSize2: 30,

            columns2: [
                {
                    title: "序号",
                    type: "index",
                    align: "center",
                    width: 70
                },
                // {
                //     title: "流水号",
                //     width: 200,
                //     key: "preNo"
                // },
                {
                    title: "标识",
                    align: "center",
                    key: "code"
                },
                {
                    title: "车牌",
                    align: "center",
                    key: "carNo"
                },
                {
                    title: "时间",
                    width: 200,
                    align: "center",
                    key: "createTime"
                },

                {
                    title: "图片",
                    width: 200,
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
            startT:"",
            endT:"",
            
          
        };
    },
    // 方法
    methods: {
        ok(index) {
            alert(index)
        },
        cancel() { 
            this.carNo = "";
            this.datePicker = [];
            this.search();
        },
        // 查找按钮
        search() {
            this.startT='';
            this.endT='';
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
            };

            getCarNoDataList(this.current2, this.pageSize2,data).then(res => {
                const data = res.data.data;
                this.tableData2 = data.list;
                this.dataCount2 = data.total;
            }).catch(err => {
                //console.info(err)
            })

        },


        changepage2(index) {
            this.current2 = index;
            this.handleLedListApproveHistory();
        },
        changePageSize2(size) {
            //console.info(size);
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
        this.handleLedListApproveHistory();
    },
};
</script>