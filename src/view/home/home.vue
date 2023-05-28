<template>
    <div style="overflow:hidden;height: 100%;width: 100%;">
        <div class="right-div">

            <div class="top">

                <div class="video">
                    监控视频画面

                </div>
                <div class="list" ref="list">
                    <Table :columns="columns1" :data="tableData" size="small" ref="table" highlight-row
                        :height="tableHeight">
                    </Table>
                </div>

            </div>

            <div class="down">
                <div class="left box-div">
                    <p class="title">行车道</p>
                    <div class="pdiv">
                        <div class="car-time car-div">{{ slowLane.createTime }}</div>
                        <div class="car-no car-div">{{ slowLane.carNo }}</div>
                        <div class="car-msg car-div">
                            <div class="weight pmsg">
                                <p>
                                    {{ slowLane.weight }}T
                                </p>
                                <p>
                                    重量
                                </p>
                            </div>
                            <div class="amt pmsg">
                                <p>
                                    {{ slowLane.limitAmt }}T
                                </p>
                                <p>
                                    限载
                                </p>

                            </div>
                            <div class="axis pmsg">
                                <p>
                                    {{ slowLane.axisNum }}
                                </p>
                                <p>
                                    轴数
                                </p>
                            </div>
                            <p class="msg">(长{{ slowLane.length }}米 宽{{ slowLane.width }}米 高{{ slowLane.height }}米)</p>
                        </div>
                    </div>


                    <div class="car-img">
                        图片1
                    </div>
                    <div class="car-img">
                        图片2
                    </div>

                </div>
                <div class="right box-div">
                    <p class="title">超车道</p>
                    <div class="pdiv">
                        <div class="car-time car-div">{{ fastLane.createTime }}</div>
                        <div class="car-no car-div hc">{{ fastLane.carNo }}</div>
                        <div class="car-msg car-div">
                            <div class="weight pmsg">
                                <p>
                                    {{ fastLane.weight }}T
                                </p>
                                <p>
                                    重量
                                </p>
                            </div>
                            <div class="amt pmsg">
                                <p>
                                    {{ fastLane.limitAmt }}T
                                </p>
                                <p>
                                    限载
                                </p>

                            </div>
                            <div class="axis pmsg">
                                <p>
                                    {{ fastLane.axisNum }}
                                </p>
                                <p>
                                    轴数
                                </p>
                            </div>
                            <p class="msg">(长{{ fastLane.length }}米 宽{{ fastLane.width }}米 高{{ fastLane.height }}米)</p>
                        </div>
                    </div>

                    <div class="car-img">
                        图片1
                    </div>
                    <div class="car-img">
                        图片2
                    </div>
                </div>

            </div>

        </div>
        <count-msg></count-msg>
    </div>
</template>

<script>

import './home.less'

import { getAwsCarTypeList } from '@/api/awsCarType'
import { getNowPreCheckData } from '@/api/preCheckData'
import CountMsg from '../history/count-msg.vue'

export default {
    name: "home_page",
    components: {
        CountMsg,
    },
    data() {
        return {
            handleModal: false,
            columns1: [
                {
                    title: "轴数",
                    key: "axisNum"
                },
                {
                    title: "车型",
                    key: "name"
                },
                {
                    title: "限载(吨)",
                    key: "limitAmt"
                },

            ],
            tableData: [],
            tableHeight: 0,
            tableWidth: 0,
            fixedHeader: false,
            fastLane: [],
            slowLane: [],
            laneTimer: null,


        };
    },
    // created(){
    //     this.listenResizeF();
    // },

    methods: {
        // listenResizeF(){
        //   this.tableHeight =  document.body.scrollHeight-200;
        // }
        beforeDestroy() {
            clearInterval(this.laneTimer);

        },
        getCarTypeList() {
            getAwsCarTypeList().then(res => {
                this.tableData = res.data.data
            }).catch(err => {
                console.log(err)
            })

        },
        getNowPreCheckData() {
            getNowPreCheckData().then(res => {
                const data = res.data.data
                this.fastLane = data[0]
                this.slowLane = data[1]
            }).catch(err => {
                console.log(err)
            })

        },




    },


    mounted() {
        this.beforeDestroy();
        this.getCarTypeList();
        this.getNowPreCheckData();
        this.laneTimer = setInterval(() => {
            this.getNowPreCheckData();
        }, 30 * 1000)
        // this.tableData = testData.histories;
        //this.listenResizeF();
        this.tableHeight = this.$refs.list.offsetHeight;
        // this.tableHeight = (window.innerHeight * 0.45);
        // this.tableWidth = (window.innerWidth * 0.261);
    }
}

</script>