<template>
    <div style="overflow:hidden;height: 100%;width: 100%;">
        <div class="right-div main-div">

            <div class="top">

                <div class="video">
                    <img :src="video" />
                </div>
                <div class="list" ref="list">
                    <Table :columns="columns1" :data="tableData" size="small" ref="table" highlight-row
                        :height="tableHeight" :row-class-name="rowClassName" class="lll">
                    </Table>
                </div>

            </div>

            <div class="down">
                <div class="box-div">
                    <p class="title">行车道</p>
                    <div class="pdiv">
                        <div class="car-time car-div">{{ slowLane.createTime }}</div>
                        <div :class="getClass(2)">{{ slowLane.carNo }}</div>
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
                            <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p>
                        </div>
                    </div>


                    <div class="car-img">
                        <img :src=imgPath+slowLane.img />

                    </div>
                    <div class="car-img">
                        <img :src=imgPath+slowLane.img />

                    </div>

                </div>
                <div class="box-div">
                    <p class="title">超车道</p>
                    <div class="pdiv">
                        <div class="car-time car-div">{{ fastLane.createTime }}</div>
                        <div :class="getClass(1)">{{ fastLane.carNo }}</div>
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
                            <p class="msg">(长{{ fastLane.length ? fastLane.length : 0 }}米 宽{{ fastLane.width ?
                                fastLane.width : 0 }}米 高{{ fastLane.height ? fastLane.height : 0 }}米)</p>
                        </div>
                    </div>

                    <div class="car-img">
                        <img :src=imgPath+fastLane.img />

                    </div>
                    <div class="car-img">
                        <img :src=imgPath+fastLane.img />

                    </div>
                </div>
                <!-- <div class="box-div">
                    <p class="title">超车道</p>
                    <div class="pdiv">
                        <div class="car-time car-div">{{ fastLane.createTime }}</div>
                        <div :class="getClass(1)">{{ fastLane.carNo }}</div>
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
                            <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ? slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p>
                        </div>
                    </div>

                     <div class="car-img">
                        <img :src="car2" />

                    </div>
                    <div class="car-img">
                        <img :src="car1" />

                    </div>
                </div> -->



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

import car1 from '@/assets/images/car/356-1.jpg'
import car2 from '@/assets/images/car/356-2.jpg'
import car3 from '@/assets/images/car/882-1.jpg'
import car4 from '@/assets/images/car/882-2.jpg'
//import video from '@/assets/images/car/video.png'
import video from '@/assets/images/car/3.png'


export default {
    name: "home_page",
    components: {
        CountMsg,

    },
    data() {//类似定义全局变量？？？
        return {
            imgPath:'http://localhost:7777/img/',
            car1,
            car2,
            car3,
            car4,
            video: video,
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
             this.fastLane.img="川KW5201/20231025173554.jpg";
            getNowPreCheckData().then(res => {
               
                const data = res.data.data
                console.info(data)
                if (data.length!=0) {
                    this.fastLane = data[0]
                    this.slowLane = data[1]
                   
                }

            }).catch(err => {
                console.log(err)
            })

        },
        rowClassName(row, index) {

            return 'demo-table-info-row';

        },
        getClass(color) {
              console.info(this.slowLane.color)
            // alert(color)
            if (color === 1) {
                return 'car-no car-div';
                // if (this.slowLane.color === 1)
                //     return 'car-no car-div';
                // else
                //     return 'car-no car-div lan';
            }
            else if (color === 2) {
                // if (this.fastLane.color === 1)
                //     return 'car-no car-div';
                // else
                    return 'car-no car-div lan';
            }

        }




    },


    mounted() {
        this.beforeDestroy();
        this.getCarTypeList();
        this.getNowPreCheckData();
        this.laneTimer = setInterval(() => {
            this.getNowPreCheckData();
        }, 10 * 1000)
        // this.tableData = testData.histories;
        //this.listenResizeF();
        this.tableHeight = this.$refs.list.offsetHeight;
        // this.tableHeight = (window.innerHeight * 0.45);
        // this.tableWidth = (window.innerWidth * 0.261);
    },
    destroyed() {

        this.beforeDestroy();
    },
}

</script>