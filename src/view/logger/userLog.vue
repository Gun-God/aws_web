<template>
    <div class="userLog-div">
        <!-- <label prop="name">&nbsp;姓名：&nbsp;</label>
      <Input v-model="companyName" id="pp" style="width: 120px" placeholder="请输入" />&nbsp;&nbsp;
      <Button @click="search" type="primary" icon="ios-search">查询</Button>&nbsp;&nbsp; -->
        <!-- <Button type="primary" @click="addBus" icon="ios-add-circle-outline">新增</Button> -->
        <Table border :columns="columns1" :data="tableData" size="small" ref="table" highlight-row :height="tableHeight"
            :row-class-name="rowClassName" class="lll">
        </Table>

        <div class="page-info">
            <div>
                <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
                    :page-size-opts="pageList" prev-text="上一页" next-text="下一页" @on-change="changepage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
        <!-- 分页控件 -->
        <!-- <div>
        <Page :total="page.total" :current="page.index" :page-size="page.size" :page-size-opts="[10, 20, 50, 100, 500]"
          size="small" prev-text="上一页" next-text="下一页" show-total show-elevator show-sizer @on-change="changeIndexPage"
          @on-page-size-change="changePageSize"></Page>
      </div> -->
        <!-- <div style="margin: 10px;overflow: hidden">
        <div style="float:left">
          <Page :total="dataCount" :page-size="pageSize" show-total show-elevator show-sizer :current="current"
            :page-size-opts="pageList"  prev-text="上一页" next-text="下一页" @on-change="changepage"
            @on-page-size-change="changePageSize"></Page>
        </div>
      </div> -->
    </div>
</template>
<script>

import Cookies from 'js-cookie';

import { getUserLogList } from '@/api/user'
import './userLog.less'

export default {
    name: 'user_logger_page',
    data() {
        return {

            // 设置table的表头
            columns1: [
                // {
                //   title: "序号",
                //   type: "index",
                //   width: 70
                // },
                {
                    title: "日志类型",
                    align: "type",
                    render: (h, params) => {
                        const data = params.row.type
                        // console.info(data)
                        if (data === 0) { return h('span', "登录日志") } else { return h('span', '操作日志'); }
                    }
                },
                {
                    title: "日志内容",
                    key: "content"
                },
                {
                    title: "日志时间",
                    key: "operTime"
                },

                {
                    title: "操作员",
                    key: "operName"
                },

            ],
            // 设置表格的数据
            // 这里需要设置原数据为空
            // 好像跟实例化一样  不然会出错的
            tableData: [],
            tableHeight: 0,
            // 初始化信息总条数
            dataCount: 0,

            // 当前页数
            current: 1,

            // 每页显示多少条
            pageSize: 50,
            pageList: [30, 50, 100, 500],

        };
    },
    // 方法
    methods: {
        getUserLogList() {
            getUserLogList(this.current, this.pageSize).then(res => {
                this.tableData = res.data.data.list;
                this.dataCount = res.data.data.total;
            }).catch(err => {
                // console.info(err)
            })
        },

        changepage(index) {
            this.current = index;
            this.getUserLogList();
        },
        changePageSize(size) {
            // console.info(size);
            this.pageSize = size;
            this.getUserLogList();
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
    created() {
        this.getUserLogList();
    },
    mounted() {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 70;
    }
};
</script>