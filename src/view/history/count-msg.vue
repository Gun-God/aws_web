<template>
    <div class="right-content">
        <!-- :style="{ width: scrollerRightWidth, height: scrollerHeight }" -->
        <div class="top-content">


            <p class="right-title">
                超限车统计
            </p>

            <div class="car-count">
                <p class="right-left-title">
                    <Icon type="md-volume-up" size="24" />
                    当日车辆统计
                </p>
                <div class="car-liu">
                    <Icon type="md-car" size="36" />
                    <span class="cars">车流量(次) </span>
                    <span class="car-num">2554</span>
                </div>

                <div class="left-span content-span">
                    <p class="dg-title">
                        超载30%以上
                    </p>
                    <p class="dg-msg">
                        数量：3
                    </p>

                    <p class="dg-msg">
                        占比：23.51%
                    </p>
                </div>
                <div class="right-span content-span">

                    <p class="dg-title">
                        100t以上
                    </p>
                    <p class="dg-msg">
                        数量：3
                    </p>

                    <p class="dg-msg">
                        占比：23.51%
                    </p>
                </div>


            </div>


            <div class="pieChart" ref="pieChart" style="cursor: pointer;">

                <!-- <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card> -->
            </div>
            <div class="lineChart" id="lineChart" style="cursor: pointer;">


            </div>
        </div>



        <p class="right-left-title">
            <Icon type="md-volume-up" size="24" />
            检测点信息
        </p>

        <div class="center-content">
            <p class="right-title">
                {{ orgObject.name }}
            </p>
            <div class="car-lables">

                <div class="left-lable">
                    <p class="lables1">
                        位置: {{ orgObject.location }}
                    </p>
                    <p class="lables2">
                        桩号: {{ orgObject.pileNo }}
                    </p>
                    <p class="lables3">
                        所属高速: {{ orgObject.expressway }}
                    </p>
                </div>
                <div class="right-lable">
                    <p class="lables4">
                        车道数: {{ orgObject.lane }}
                    </p>
                    <p class="lables5">
                        上下行: {{ orgObject.direction === 1 ? "下行" : (orgObject.direction === 0 ? "上行" : "无") }}
                    </p>
                    <p class="lables6">
                        建成时间: {{ new Date(orgObject.buildTime) | dateFormat('YYYY年MM月DD日') }}
                    </p>
                </div>
            </div>
        </div>

        <p class="right-left-title">
            <Icon type="md-volume-up" size="24" />
            超限车列表
        </p>
        <div class="down-content" ref="carList">



            <Table :columns="columns1" :data="tableData" size="small" ref="table" highlight-row :height="tableHeight1">

            </Table>



        </div>

    </div>
</template>

<script>
import "./count-msg.less"
import { getPreCheckDataNewList } from '@/api/preCheckData'
import { getOrgInfoByCode } from '@/api/nspOrg'
import { ChartPie, ChartBar } from '_c/charts'

export default {
    name: 'count-msg',
    components: {
        ChartPie,
        ChartBar,
    },
    data() {
        return {
            handleModal: false,
            columns1: [
                {
                    title: "序号",
                    type: "index",
                },
                {
                    title: "车牌",
                    key: "carNo",
                    width: 150,
                },
                {
                    title: "自重",
                    key: "weight"
                },
                {
                    title: "限重",
                    key: "limitAmt"
                },
                {
                    title: "轴数",
                    key: "axisNum"
                },
                {
                    title: "车速",
                    key: "speed"
                },
                {
                    title: "车道",
                    key: "lane"
                },
                // {
                //     title: "时间",
                //     key: "createTime",
                //     width: 200,
                // }

            ],
            tableData: [],
            tableHeight1: 0,
            tableWidth1: 0,
            orgObject: [],
            lisTimer: null,
            orgCode: localStorage.getItem("orgCode"),
            pieData: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
            ],
            lineData: [
                13253,
                34235,
                26321,
                12340,
                24643,
                1322,
                1324
            ]
        };
    },
    computed: {
        // scrollerHeight: function () {
        //     return (window.innerHeight * 0.88) + 'px';
        // },
        // scrollerRightWidth: function () {
        //     return (window.innerWidth * 0.32) + 'px';
        // },

    },
    methods: {
        beforeDestroy() {
            clearInterval(this.laneTimer);

        },
        initPieCharts() {
            let myChart = this.$echarts.init(this.$refs.pieChart);
            //let myChart = this.$echarts.init(document.getElementById("pieChart"));

            // 绘制图表
            myChart.setOption({

                tooltip: {
                    show: true,
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.pieData
                    }
                ]
            });
        }, initLineCharts() {
            //let myChart = this.$echarts.init(this.$refs.lineChart);
            let myChart = this.$echarts.init(document.getElementById("lineChart"));
            // 绘制图表
            myChart.setOption({
                title: {
                    text: '当日24小时车流量趋势',
                    textStyle: {
                        fontSize: 15,
                    }
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: this.lineData,
                        type: 'line',
                        //设置面积区域为渐变效果
                        areaStyle: {
                            color: this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0.4,
                                    color: "#010C17",
                                },
                                {
                                    offset: 1,
                                    color: "#44E2F0",
                                },
                            ]),
                        },
                    }
                ]
            });
        },

        getPreList() {
            debugger
            getPreCheckDataNewList(this.orgCode).then(res => {
                this.tableData = res.data.data
            }).catch(err => {
                console.error(err)
            })

        },

        getOrgInfo() {
            getOrgInfoByCode(this.orgCode).then(res => {
                this.orgObject = res.data.data
            }).catch(err => {
                console.error(err)
            })

        }
    },
    mounted() {
        this.beforeDestroy();
        this.getPreList();
        this.getOrgInfo();
        this.lisTimer = setInterval(() => {
            this.getPreList();
        }, 3 * 60 * 1000)
        //  this.tableData = testData.histories;
        this.tableHeight1 = (window.innerHeight * 0.27);
        //this.tableHeight1 =this.$refs.carList.offsetHeight-3;
        // this.tableWidth = (window.innerWidth * 0.31);

        setTimeout(() => {
            this.initPieCharts();
            this.initLineCharts();
        }, 500);
    }
};

</script>