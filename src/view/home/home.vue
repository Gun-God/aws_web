<template>
  <div style="overflow: hidden; height: 100%; width: 100%">
    <div class="right-div main-div">
      <div class="top">
        <!-- <div class="videoFrame"> -->
        <!-- <img :src="video" /> -->
        <!-- <videoCell></videoCell> -->
        <videoCell ref="child" style="" :camInfo="camInfo"></videoCell>
        <!-- </div> -->

        <div class="inputform" v-if="displayCheckForm">
          <card>
            <a slot="title"> 称重检测信息录入</a>
            <div class="inputFormBodyUp">
              <div class="inputFormBodyLeft">
                <!-- checkForm:{
        carNo:"",
        axisNum:"",
        carType:"",
        goodsCatagory:"",
        limitAmt:"",
        sumAmt:"",
        overAmt:"",
        driverName:""

      } -->
                <Form
                  ref="checkForm1"
                  :rules="checkValidateForm"
                  :model="checkForm"
                >
                  <FormItem label="车牌号：" prop="carNo">
                    <Select
                      filterable
                      :loading="loading1"
                      :remote-method="searchPerCheckMsg"
                      placeholder="请输入车牌号"
                      v-model="checkForm.carNo"
                      class="carNo-select"
                      @on-change="selectCarNo"
                      @on-query-change="searchCarNoMsg"
                    >
                      <Option
                        v-if="dependenceCarNoDisplay"
                        :label="dependenceCarNo"
                        value="myDefine"
                      >
                        {{ dependenceCarNo }}
                      </Option>
                      <Option
                        v-for="(item, index) in pcheckSList"
                        :value="item.id"
                        :label="item.carNo"
                        :key="index"
                      >
                        <span class="selectUp">{{ item.carNo }}</span>
                        <span class="selectDown">{{ item.createTime }}</span>
                        <span class="selectDown">预检：{{ item.preAmt }}</span>
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem label="车型：" prop="carType">
                    <Select
                      filterable
                      clearable
                      placeholder="请选择"
                      @on-open-change="focusCarType"
                      @on-change="selectCarType"
                      v-model="checkForm.carType"
                    >
                      <!-- <Option v-if="dependenceCarNoDisplay" :label="dependenceCarNo" :value="dependenceCarNo">
                     {{dependenceCarNo}}
                     </Option> -->
                      <Option
                        v-for="(item, indexs) in carTypeListByAxis"
                        :value="item.id"
                        :label="item.name"
                        :key="indexs"
                      ></Option>
                    </Select>
                  </FormItem>

                  <FormItem label="总重限重：" prop="limitAmt">
                    <Input
                      placeholder="总重限重"
                      type="number"
                      v-model="checkForm.limitAmt"
                      @on-change="limitAmtChange"
                    />
                  </FormItem>

                  <FormItem label="总重超重：" prop="overAmt">
                    <Input
                      placeholder="总重超重"
                      type="number"
                      v-model="checkForm.overAmt"
                    />
                  </FormItem>

                  <!-- <FormItem>
                    <Button @click="addPerson('employeeForm')">新增</Button>
                    <Button @click="resetForm">重置</Button>
                  </FormItem> -->
                </Form>
              </div>
              <div class="inputFormBodyRight">
                <Form
                  ref="checkForm2"
                  :rules="checkValidateForm2"
                  :model="checkForm"
                >
                  <FormItem label="轴数：" prop="axisNum">
                    <Input
                      placeholder="请输入轴数"
                      v-model="checkForm.axisNum"
                      @on-change="changeAxisNum"
                      type="number"
                    />
                  </FormItem>

                  <FormItem label="货物类别：" prop="goodsCatagory">
                    <!-- <Select
                      filterable
                      clearable
                      placeholder="请选择"
                      v-model="checkForm.goodsCatagory"
                    > -->
                    <Input
                      placeholder="请输入货物信息"
                      v-model="checkForm.goodsCatagory"   
                     
                    />
                      <!-- <Option label="水果" value="水果"> 水果 </Option>
                      <Option label="蔬菜" value="蔬菜"> 蔬菜 </Option> -->
                      <!-- <Option
                        v-for="item in deptList"
                        :value="item.value"
                        :label="item.label"
                        :key="item.value"
                      ></Option> -->
                    <!-- </Select> -->
                  </FormItem>

                  <FormItem label="车货总重：" prop="sumAmt">
                    <Input
                      placeholder="车货总重"
                      type="number"
                      v-model="checkForm.sumAmt"
                      @on-change="inputSumAmt"
                    />
                  </FormItem>

                  <FormItem label="驾驶员：" prop="driverName">
                    <Input
                      placeholder="驾驶员姓名"
                      v-model="checkForm.driverName"
                    />
                  </FormItem>

                  <!-- <FormItem>
                    <Button @click="addPerson('employeeForm')">新增</Button>
                    <Button @click="resetForm">重置</Button>
                  </FormItem> -->
                </Form>
              </div>
            </div>
            <div class="inputFormBodyBottom">
              <Form ref="checkForm" :model="checkForm">
                <FormItem>
                  <Button
                    type="error"
                    icon="ios-close-circle-outline"
                    @click="checkResetClick('checkForm')"
                    >重置</Button
                  >
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    icon="ios-checkmark-circle-outline"
                    @click="checkSumbitClick('checkForm')"
                    >提交</Button
                  >
                </FormItem>
                <!-- <FormItem>
                    <Button @click="checkClick('checkForm')">复检</Button>
                  </FormItem> -->
                <FormItem>
                  <Button
                    type="info"
                    icon="ios-settings"
                    @click="checkClick('checkForm')"
                    >抬杆</Button
                  >
                </FormItem>
                <FormItem>
                  <Button
                    type="info"
                    icon="ios-settings-outline"
                    @click="checkClick('checkForm')"
                    >放杆</Button
                  >
                </FormItem>
              </Form>
            </div>
          </card>
        </div>

        <div v-if="displayCarTypeList" class="list" ref="list">
          <Table
            :columns="columns1"
            :data="tableData"
            size="small"
            ref="table"
            highlight-row
            :height="tableHeight"
            :row-class-name="rowClassName"
            class="lll"
          >
          </Table>
        </div>

        <div v-if="displayLaneUp" class="backImg">
          <div class="box-div">
            <p class="title">{{ this.upLane.title }}</p>
            <div class="pdiv">
              <div class="pdiv-up">
                <div class="pdiv-up-pad"></div>
                <div class="car-time car-div">
                  <div class="car-time-pad"></div>
                  <div class="car-time-innnerText">
                    {{ this.upLane.createTime }}
                  </div>
                  <div class="car-time-pad"></div>
                </div>
                <div :class="getClass(this.upLane.color)">
                  <div class="car-no-innnerText"></div>
                  <div class="car-no-innnerText">
                    {{ this.upLane.carNo }}
                  </div>
                  <div class="car-no-innnerText"></div>
                </div>
                <div class="pdiv-up-pad"></div>
              </div>
              <div class="pdiv-down">
                <div class="car-msg car-div">
                  <div></div>
                  <div class="weight pmsg">
                    <p>{{ this.upLane.weight }}T</p>
                    <p>重量</p>
                  </div>

                  <div class="amt pmsg">
                    <p>{{ this.upLane.limitAmt }}T</p>
                    <p>限载</p>
                  </div>

                  <div class="axis pmsg">
                    <p>
                      {{ this.upLane.axisNum }}
                    </p>
                    <p>轴数</p>
                  </div>
                  <div></div>
                  <!-- <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                    slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p> -->
                </div>
              </div>
            </div>

            <!-- 这里还需要做个判读 img是否为空 -->
            <div class="car-img">
              <div class="car-img-pad"></div>
              <img :src="this.upLane.img" />
              <!-- <img :src="upLaneImg"/>  -->
              <!-- <img src='../../assets/images/no_img.jpg'  /> -->

              <div class="car-img-pad"></div>
            </div>
            <!-- <div class="car-img">
                            <img :src=slowLaneImg />
    
                        </div> -->
          </div>
        </div>
      </div>

      <div class="down">
        <!-- v-if="displayLane3" -->
        <div
          v-if="displayLaneDwon"
          v-for="(item, index) in nowCheckListDown"
          :key="index"
          class="box-div"
        >
          <p class="title">{{ item.title }}</p>
          <!-- <p class="title">第三车道</p> -->
          <div class="pdiv">
            <div class="pdiv-up">
              <div class="pdiv-up-pad"></div>
              <div class="car-time car-div">
                <div class="car-time-pad"></div>
                <div class="car-time-innnerText">
                  {{ item.createTime }}
                </div>
                <div class="car-time-pad"></div>
              </div>
              <div :class="getClass(item.color)">
                <div class="car-no-innnerText"></div>
                <div class="car-no-innnerText">
                  {{ item.carNo }}
                </div>
                <div class="car-no-innnerText"></div>
              </div>
              <div class="pdiv-up-pad"></div>
            </div>
            <div class="pdiv-down">
              <div class="car-msg car-div">
                <div></div>
                <div class="weight pmsg">
                  <p>{{ item.weight }}T</p>
                  <p>重量</p>
                </div>

                <div class="amt pmsg">
                  <p>{{ item.limitAmt }}T</p>
                  <p>限载</p>
                </div>

                <div class="axis pmsg">
                  <p>
                    {{ item.axisNum }}
                  </p>
                  <p>轴数</p>
                </div>
                <div></div>
                <!-- <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                    slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p> -->
              </div>
            </div>
          </div>

          <!-- 这里还需要做个判读 img是否为空 -->
          <div class="car-img">
            <div class="car-img-pad"></div>
            <img :src="item.img" />
            <!-- <img src='../../assets/images/no_img.jpg'  /> -->
            <div class="car-img-pad"></div>
          </div>
          <!-- <div class="car-img">
                            <img :src=slowLaneImg />
    
                        </div> -->
        </div>

        <div v-if="displayLane1" class="box-div">
          <p class="title"></p>
          <div class="pdiv">
            <div class="pdiv-up">
              <div class="pdiv-up-pad"></div>
              <div class="car-time car-div">
                <div class="car-time-pad"></div>
                <div class="car-time-innnerText">
                  {{ this.firSlowLane.createTime }}
                </div>
                <div class="car-time-pad"></div>
              </div>
              <div :class="getClass(this.firSlowLane.color)">
                <div class="car-no-innnerText"></div>
                <div class="car-no-innnerText">
                  {{ this.firSlowLane.carNo }}
                </div>
                <div class="car-no-innnerText"></div>
              </div>
              <div class="pdiv-up-pad"></div>
            </div>
            <div class="pdiv-down">
              <div class="car-msg car-div">
                <div></div>
                <div class="weight pmsg">
                  <p>{{ this.firSlowLane.weight }}T</p>
                  <p>重量</p>
                </div>

                <div class="amt pmsg">
                  <p>{{ this.firSlowLane.limitAmt }}T</p>
                  <p>限载</p>
                </div>

                <div class="axis pmsg">
                  <p>
                    {{ this.firSlowLane.axisNum }}
                  </p>
                  <p>轴数</p>
                </div>
                <div></div>
                <!-- <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                    slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p> -->
              </div>
            </div>
          </div>

          <!-- 这里还需要做个判读 img是否为空 -->
          <div class="car-img">
            <div class="car-img-pad"></div>
            <img :src="firSlowLaneImg" />
            <!-- <img src='../../assets/images/no_img.jpg'  /> -->

            <div class="car-img-pad"></div>
          </div>
          <!-- <div class="car-img">
                            <img :src=slowLaneImg />
    
                        </div> -->
        </div>
        <!-- displayLane1 -->
        <div v-if="displayLane2" class="box-div">
          <p class="title"></p>
          <div class="pdiv">
            <div class="pdiv-up">
              <div class="pdiv-up-pad"></div>
              <div class="car-time car-div">
                <div class="car-time-pad"></div>
                <div class="car-time-innnerText">
                  {{ this.secSlowLane.createTime }}
                </div>
                <div class="car-time-pad"></div>
              </div>
              <div :class="getClass(this.secSlowLane.color)">
                <div class="car-no-innnerText"></div>
                <div class="car-no-innnerText">
                  {{ this.secSlowLane.carNo }}
                </div>
                <div class="car-no-innnerText"></div>
              </div>
              <div class="pdiv-up-pad"></div>
            </div>
            <div class="pdiv-down">
              <div class="car-msg car-div">
                <div></div>
                <div class="weight pmsg">
                  <p>{{ this.secSlowLane.weight }}T</p>
                  <p>重量</p>
                </div>

                <div class="amt pmsg">
                  <p>{{ this.secSlowLane.limitAmt }}T</p>
                  <p>限载</p>
                </div>

                <div class="axis pmsg">
                  <p>
                    {{ this.secSlowLane.axisNum }}
                  </p>
                  <p>轴数</p>
                </div>
                <div></div>
                <!-- <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                    slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p> -->
              </div>
            </div>
          </div>

          <!-- 这里还需要做个判读 img是否为空 -->
          <div class="car-img">
            <div class="car-img-pad"></div>
            <img :src="secSlowLaneImg" />
            <!-- <img src='../../assets/images/no_img.jpg'  /> -->
            <div class="car-img-pad"></div>
          </div>
          <!-- <div class="car-img">
                            <img :src=slowLaneImg />
    
                        </div> -->
        </div>

        <div v-if="displayLane3" class="box-div">
          <p class="title"></p>
          <div class="pdiv">
            <div class="pdiv-up">
              <div class="pdiv-up-pad"></div>
              <div class="car-time car-div">
                <div class="car-time-pad"></div>
                <div class="car-time-innnerText">
                  {{ this.fastLane.createTime }}
                </div>
                <div class="car-time-pad"></div>
              </div>
              <div :class="getClass(this.fastLane.color)">
                <div class="car-no-innnerText"></div>
                <div class="car-no-innnerText">
                  {{ this.fastLane.carNo }}
                </div>
                <div class="car-no-innnerText"></div>
              </div>
              <div class="pdiv-up-pad"></div>
            </div>
            <div class="pdiv-down">
              <div class="car-msg car-div">
                <div></div>
                <div class="weight pmsg">
                  <p>{{ this.fastLane.weight }}T</p>
                  <p>重量</p>
                </div>

                <div class="amt pmsg">
                  <p>{{ this.fastLane.limitAmt }}T</p>
                  <p>限载</p>
                </div>

                <div class="axis pmsg">
                  <p>
                    {{ this.fastLane.axisNum }}
                  </p>
                  <p>轴数</p>
                </div>
                <div></div>
                <!-- <p class="msg">(长{{ slowLane.length ? slowLane.length : 0 }}米 宽{{ slowLane.width ?
                                    slowLane.width : 0 }}米 高{{ slowLane.height ? slowLane.height : 0 }}米)</p> -->
              </div>
            </div>
          </div>

          <!-- 这里还需要做个判读 img是否为空 -->
          <div class="car-img">
            <div class="car-img-pad"></div>
            <img :src="fastLaneImg" />

            <div class="car-img-pad"></div>
          </div>
          <!-- <div class="car-img">
                            <img :src=slowLaneImg />
    
                        </div> -->
        </div>
      </div>
    </div>
    <count-msg :key="countRefreshKey" :orgCheckList="checkList"></count-msg>
  </div>
</template>
    
    <script>
import "./home.less";

import { getAwsCarTypeList } from "@/api/awsCarType";
import { getNowPreCheckData, getListByCarNo } from "@/api/preCheckData";
import { addCheckData } from "@/api/checkData";
import CountMsg from "../history/count-msg.vue";
import videoCell from "../video/HwCellPlayer.vue";
// import videoCell from './CellPlayer.vue'
import { selectAllCamera } from "@/api/scan";
import car1 from "@/assets/images/car/356-1.jpg";
import car2 from "@/assets/images/car/356-2.jpg";
import car3 from "@/assets/images/car/882-1.jpg";
import car4 from "@/assets/images/car/882-2.jpg";
// import video from '@/assets/images/car/video.png'
import video from "@/assets/images/car/3.png";
import defaultImg from "@/assets/images/no_img.jpg";
import { selectAllOrg, selectAllPerCheckOrg } from "@/api/nspOrg";

import "@/libs/codebase/jquery-1.7.1.min.js";
import "@/libs/codebase/jsVideoPlugin-1.0.0.min.js";
import { WebVideoCtrl } from "@/libs/codebase/webVideoCtrl.js";
import validator from "validator";
export default {
  name: "home_page",
  components: {
    CountMsg,
    videoCell,
  },
  data() {
    const carNoValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入车牌号"));
      }
    };
    const axisNumValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入轴数"));
      }
    };
    const carTypeValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("车型不能为空"));
      }
    };
    const goodsCatagoryValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("类别不能为空"));
      }
    };
    const limitAmtValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("限重不能为空"));
      }
    };
    const sumAmtValidateFun = (rule, value, callback) => {
      if (value != 0) {
 if (value == "") {
        callback(new Error("总重不能为空"));
      } 
}
    };
    const overAmtValidateFun = (rule, value, callback) => {
      if (value != 0) {
 if (value == "") {
        callback(new Error("超重不能为空"));
      } 
}
    };
    const driverNameValidateFun = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入驾驶员姓名"));
      }
    };
    // 类似定义全局变量？？？
    return {
      imgPath: "car_img/",
      firSlowLaneImg: defaultImg,
      secSlowLaneImg: defaultImg,
      thirdSlowLaneImg: defaultImg,
      fastLaneImg: defaultImg,
      upLaneImg: defaultImg,

      car1,
      car2,
      car3,
      car4,
      video: video,
      handleModal: false,
      columns1: [
        {
          title: "轴数",
          key: "axisNum",
        },
        {
          title: "车型",
          key: "name",
        },
        {
          title: "限载(吨)",
          key: "limitAmt",
        },
      ],
      tableData: [],
      tableHeight: 0,
      tableWidth: 0,
      fixedHeader: false,
      fastLane: [],
      firSlowLane: [],
      secSlowLane: [],
      thirdSlowLane: [],
      upLane: [],
      laneArray: [],
      displayLane1: false,
      displayLane2: false,
      displayLane3: false,
      displayLane4: false,
      displayLaneUp: false,
      displayCarTypeList: true,
      displayLaneDwon: true,
      displayCheckForm: false,
      // displayCarTypeList2: true,
      scanThisOrgList: [],
      nowCheckListDown: [],
      // nowCheckListUp: [],
      backNum: 0,
      frontNum: 0,
      checklist: [],
      countRefreshKey: 0,
      laneTimer: null,
      nowIp: "", // 用于实时退出登录
      nowPort: "",
      camInfo: [
        {
          camIp: "",
          camPort: "",
          camUserName: "",
          camPassWord: "",
        },
      ],
      checkForm: {
        carNo: "",
        axisNum: "",
        carType: "",
        goodsCatagory: "",
        limitAmt: "",
        sumAmt: "",
        overAmt: "",
        driverName: "",
      },
      checkValidateForm: {
        carNo: [
          {
            validator: carNoValidateFun,
            trigger: "blur",
          },
        ],
        carType: [
          {
            validator: carTypeValidateFun,
            trigger: "blur",
          },
        ],
        limitAmt: [
          {
            validator: limitAmtValidateFun,
            trigger: "blur",
          },
        ],
        overAmt: [
          {
            validator: overAmtValidateFun,
            trigger: "blur",
          },
        ],
      },
      checkValidateForm2: {
        axisNum: [
          {
            validator: axisNumValidateFun,
            trigger: "blur",
          },
        ],

        goodsCatagory: [
          {
            validator: goodsCatagoryValidateFun,
            trigger: "blur",
          },
        ],

        sumAmt: [
          {
            validator: sumAmtValidateFun,
            trigger: "blur",
          },
        ],

        driverName: [
          {
            validator: driverNameValidateFun,
            trigger: "blur",
          },
        ],
      },
      loading1: false,
      dependenceCarNo: "",
      pcheckSList: [],
      selectedPcheck: null,
      updateKey: 0,
      dependenceCarNoDisplay: true,
      selectedCarTypeId: "",
      carTypeList: [],
      carTypeListByAxis: [],
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
      // 退出nowip的登录
      // this.$refs.child.stopPlay();
      // this.$refs.child.realLogout(this.nowIp, this.nowPort);
      // window.I_DestroyPlugin();
      clearInterval(this.laneTimer);
    },
    getCarTypeList() {
      getAwsCarTypeList()
        .then((res) => {
          this.tableData = res.data.data;
          this.carTypeList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getNowPreCheckData() {
      //   this.fastLane.img="川KW5201/20231025173554.jpg";
      //   this.handleCountRefresh();
      const that = this;
      getNowPreCheckData()
        .then((res) => {
          const data = res.data.data;
          // 根据前向数量和后向数量的不同组合来解析数据
          if (data.length == 0) {
            that.displayLane1 = true;
            that.displayLane2 = true;
            that.displayLane3 = true;
            that.displayLaneUp = false;
            that.displayLaneDwon = false;
          } else {
            that.displayLaneDwon = true;
              that.displayLane1 = false;
            that.displayLane2 = false;
            that.displayLane3 = false;
            // 筛选出数组的每个车道数据
            // 根据车道数据去查设备表 控制显隐
            let orgScanList = this.scanThisOrgList;
            // 判断顺序
            let flag = 0;
            for (let i = 0; i < orgScanList.length; i++) {
              if (orgScanList[i].showLane != orgScanList[i].lane) {
                // 反序
                flag = 1;
              } else {
                flag = 0;
              }
            }
            // nowCheckListDown
            // this.nowCheckListDown = [];;
            let nowListDown = [];
            // 考虑是正序还是反序
            console.info(this.frontNum);
            switch (this.frontNum) {
              // debugger
              // 先考虑前向摄像头
              case 0:
                return;
                break;
              case 2:
                // debugger
                if (data.length > 2) {
                  nowListDown.push(data[0]);
                  nowListDown.push(data[1]);
                } else {
                  nowListDown = data;
                }
                // if(this.backNum>=1)
                // {
                // 获取最新的一张后向摄像头照片
                // 添加到nowCheckListDown
                // }
                break;
              case 3:
                if (data.length > 3) {
                  nowListDown.push(data[0]);
                  nowListDown.push(data[1]);
                  nowListDown.push(data[2]);
                } else {
                  nowListDown = data;
                }

                break;
              case 4:
                if (data.length >= 4) {
                  nowListDown.push(data[0]);
                  nowListDown.push(data[1]);
                  nowListDown.push(data[2]);

                  // 手动添加up位置
                  let upData = data[3];

                  if (upData.img && upData.img != "") { upData.img = that.imgPath + upData.img; } else upData.img = defaultImg;
                  for (let i = 0; i < orgScanList.length; i++) {
                    if (upData.lane == orgScanList[i].lane) {
                      upData.title = orgScanList[i].laneName;
                      break;
                    }
                  }
                  that.upLane = upData;
                }
                break;
              default:
                return;
                break;
            }
            // 寻找到对应设备车道的title 并添加title属性
            for (let j = 0; j < nowListDown.length; j++) {
              for (let i = 0; i < orgScanList.length; i++) {
                if (nowListDown[j].lane == orgScanList[i].lane) {
                  nowListDown[j].title = orgScanList[i].laneName;
                  break;
                }
              }
              if (nowListDown[j].img && nowListDown[j].img != "undefined") {
                nowListDown[j].img = that.imgPath + nowListDown[j].img;
              } else {
                nowListDown[j].img = defaultImg;
              }
            }
            console.info("nowListDown", nowListDown);
            that.nowCheckListDown = nowListDown;

            // 后端返回的必然是设备车道号从小到大
          }

          // if (data.length != 0) {
          //   that.firSlowLane = data[0];

          //   if (that.firSlowLane && typeof that.firSlowLane.img != "undefined")
          //     that.firSlowLaneImg = that.imgPath + this.firSlowLane.img;

          //   if (data.length == 2) {
          //     that.display = false;
          //     that.fastLaneImg = data[1];

          //     if (that.fastLaneImg && typeof that.fastLane.img != "undefined")
          //       that.fastLaneImg = that.imgPath + this.fastLane.img;
          //   } else if (data.length == 3) {
          //     that.display = true;
          //     that.secSlowLane = data[1];

          //     if (
          //       that.secSlowLane &&
          //       typeof that.secSlowLane.img != "undefined"
          //     )
          //       that.secSlowLaneImg = that.imgPath + this.secSlowLane.img;

          //     that.fastLane = data[2];
          //     // console.info(typeof(that.slowLane.img));

          //     if (typeof that.fastLane.img != "undefined")
          //       that.fastLaneImg = that.imgPath + this.fastLane.img;
          //   } else if (data.length == 4) {
          //     //  that.display=true;
          //     that.secSlowLane = data[1];
          //     if (
          //       that.secSlowLane &&
          //       typeof that.secSlowLane.img != "undefined"
          //     )
          //       that.secSlowLaneImg = that.imgPath + this.secSlowLane.img;

          //     that.thirdSlowLane = data[2];
          //     if (
          //       that.thirdSlowLane &&
          //       typeof that.thirdlowLane.img != "undefined"
          //     )
          //       that.thirdslowLaneImg = that.imgPath + this.thirdlowLane.img;

          //     that.fastLane = data[3];
          //     if (typeof that.fastLane.img != "undefined")
          //       that.fastLaneImg = that.imgPath + this.fastLane.img;
          //   }
          // }

          // if(data.length>0){
          // that.laneArray.push(data[0]);
          // that.laneArray.push(data[1]);
          // that.laneArray.push(data[2]);
          // for(var i=0;i<3;i++)
          // {
          //     if(that.laneArray[i] && typeof(that.laneArray[i].img)!='undefined')
          //     {
          //         // that.laneArray[i].img=that.imgPath+that.laneArray[i].img;
          //         switch(i)
          //         {
          //             case 0:
          //                 that.firSlowLaneImg=that.imgPath+that.laneArray[i].img;
          //                 break;
          //             case 1:
          //                 that.secSlowLaneImg=that.imgPath+that.laneArray[i].img;
          //                 break;
          //             case 2:
          //                 that.fastLaneImg=that.imgPath+that.laneArray[i].img;
          //                 break;
          //         }
          //     }

          // }

          // }
          // else{
          // that.laneArray.push({createTime:'null',limitAmt:'null',axisNum:'null',carNo:'null'});
          // that.laneArray.push({createTime:'null',limitAmt:'null',axisNum:'null',carNo:'null'});
          // that.laneArray.push({createTime:'null',limitAmt:'null',axisNum:'null',carNo:'null'});
          // }
          // if (data.length!=0) {
          //     that.fastLane = data[1]
          //     console.info(typeof(that.slowLane.img));

          //     if(typeof(that.fastLane.img)!='undefined')
          //        that.fastLaneImg=that.imgPath+this.fastLane.img;
          //     that.slowLane = data[0]
          //     if(that.slowLane&&typeof(that.slowLane.img)!='undefined')
          //        that.slowLaneImg=that.imgPath+this.slowLane.img;

          // }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    rowClassName(row, index) {
      return "demo-table-info-row";
    },
    getClass(color) {
      // console.info("颜色",this.slowLane.color)
      // alert(color)
      if (color === 0) {
        return "car-no car-div lan";
      } else if (color === 1) {
        // if (this.fastLane.color === 1)
        //     return 'car-no car-div';
        // else
        return "car-no car-div";
      }
      return "car-no car-div";
    },
    changeVideo(oCode) {
      // 修改video
      this.$refs.child.stopPlay();
      this.$refs.child.realLogout(this.nowIp, this.nowPort);
      // let nip = "192.168.3.4";
      // let nport = "80";
      // let admin = "admin";
      // let pword = "admin12345";
      let nip = "";
      let nport = "80";
      let admin = "";
      let pword = "";
      // 查询IP并登录
      selectAllCamera().then((res) => {
        let scanList = res.data.data;
        // 查询当前orgcode
        //    let thisOrg=[];
        let thisOrg = scanList.filter((item) => item.orgCode == oCode);

        if (thisOrg == null || thisOrg.length == 0) {
          nip = "";
          nport = "80";

          admin = "";
          pword = "";
        } else {
          for (let i = 0; i < thisOrg.length; i++) {
            if (thisOrg[i].lane == 2) {
              nip = thisOrg[i].videoIp;
              nport = "80";

              admin = thisOrg[i].userName;
              pword = thisOrg[i].password;
            }
          }
        }
        this.camInfo[0].camIp = nip;
        this.camInfo[0].camPort = "80";
        this.camInfo[0].camUserName = admin;
        this.camInfo[0].camPassWord = pword;
        this.nowIp = nip;
        this.nowPort = nport;
        setTimeout(() => {
          this.$refs.child.loginCmera(nip, nport, admin, pword, 0);
        }, 1500);
      });
      // setTimeout(function(){}
    },
    getScanList() {
      const that = this;
      let ocode = localStorage.getItem("orgCode");
      this.changeVideo(ocode);
      /* selectAllCamera()
        .then((res) => {
          let scanList = res.data.data;
          console.info(scanList);
          let orgcode = localStorage.getItem("orgCode");

          //debugger;
          let thisOrg = scanList.filter((item) => item.orgCode == orgcode);
          console.info("orgScan", thisOrg);
          if (thisOrg == null || thisOrg.length == 0) {
            that.camInfo[0].camIp = "";
            that.camInfo[0].camPort = "";
            that.nowIp = "";
            that.nowPort = "";
            that.camInfo[0].camUserName = "";
            that.camInfo[0].camPassWord = "";
          } else {
            console.info("here!!!!!!!!!!!!!!!!!");
            for (let i = 0; i < thisOrg.length; i++) {
              if (thisOrg[i].lane == 2) {
                that.camInfo[0].camIp = thisOrg[i].videoIp;
                that.camInfo[0].camPort = "80";
                that.nowIp = thisOrg[i].videoIp;
                that.nowPort = "80";
                that.camInfo[0].camUserName = thisOrg[i].userName;
                that.camInfo[0].camPassWord = thisOrg[i].password;
                break;
              }
            }
          }
          //  console.info("当前预览",that.camInfo);
        })
        .catch((err) => {
          //console.info(err)
        }); */
    },
    getAllCheckStation() {
      // 查询检测站
      let oCode = localStorage.getItem("orgCode");
      // this.manPageLanePicDisplay(oCode);

      // debugger
      //   const that = this;
      let rid = localStorage.getItem("roleId");
      // console.info(rid);
      // 拉取所有的检测站
      selectAllPerCheckOrg()
        .then((res) => {
          // debugger
          console.info(res.data.data);

          this.checkList = res.data.data;
          // this.checklist=JSON.parse(JSON.stringify(this.checkList ));
        })
        .catch((err) => {
          console.info(err);
        });
      //   this.$parent.handleCountRefresh();
    },
    handleCountRefresh() {
      this.countRefreshKey++;
    },
    refresh() {
      // debugger
      this.$router.go(0);
    },
    ctrlDisplay() {
      let orgcode = localStorage.getItem("orgCode");
      let rid = localStorage.getItem("roleId");
      this.manPageLanePicDisplay(orgcode);
      //  displayLane1: true,
      // displayLane2: true,
      // displayLane3: true,
      // displayLane4: false,
      // displayLaneUp: false,
      // displayCarTypeList: true,
      if (rid == "3" || rid == 3) {
        this.displayLaneUp = false;
        this.displayCarTypeList = false;
        this.displayLaneDwon = false;
        this.displayLane1 = true;
        this.displayLane2 = true;
        this.displayLane3 = true;
        this.displayCheckForm = true;
      }
      // this.displayLaneDwon=false;
      // this.carTypeList=false;
      // this.=false;
    },
    manPageLanePicDisplay(orgcode) {
      // debugger
      // let orgcode = localStorage.getItem("orgCode");
      let rid = localStorage.getItem("roleId");
      selectAllCamera().then((res) => {
        let scanList = res.data.data;
        let frontCount = 0;
        let backCount = 0;
        // 查询scan表中相应orgcode的设备
        // debugger
        let scanOnlyOrgList = scanList.filter(
          (item) => item.orgCode == orgcode
        );
        console.info(scanOnlyOrgList);
        this.scanThisOrgList = scanOnlyOrgList;
        // 获取到前向和后向的数量

        for (let i = 0; i < scanOnlyOrgList.length; i++) {
          if (
            scanOnlyOrgList[i].direction == 1 ||
            scanOnlyOrgList[i].direction == "1"
          ) {
            frontCount++;
          } else if (
            scanOnlyOrgList[i].direction == 2 ||
            scanOnlyOrgList[i].direction == "2"
          ) {
            backCount++;
          }
        }
        this.backNum = backCount;
        this.frontNum = frontCount;
        // 判断数量并进行组合
        switch (
          frontCount // 前向摄像头其实就表示了车道数
        ) {
          //
          case 2:
            // 前向车道为2时 后向只考虑一个摄像头
            if (backCount == 0) {
              this.displayLaneUp = false;
            } else if (backCount != 0) {
              this.displayLaneUp = false;
            }
            // this.displayCarTypeList=true;
            break;
          case 3:
            // 前向车道为3时 后向车道为0 1
            if (backCount == 0) {
              this.displayLaneUp = false;
              //  this.displayCarTypeList=true;
            } else if (backCount != 0) {
              this.displayLaneUp = true;
              //  this.displayCarTypeList=false;
            }

            break;
          case 4:
            // 前向车道为4时 不管后向了
            this.displayLaneUp = true;
            // this.displayCarTypeList=false;

            break;
        }
        if (rid == "3" || rid == 3) {
          // 针对精检站
          this.displayCarTypeList = false;
        } else {
          this.displayCarTypeList = !this.displayLaneUp;
        }
      });
    },
    checkClick(name) {
      console.info(this.checkForm);
    },
    checkSumbitClick(name) {
      // var params = JSON.parse(JSON.stringify(self.formValidate));
      // addCheckData
      // console.info( this.$refs['checkForm1']);
      const that = this;
      this.$refs["checkForm1"].validate((valid) => {
        // console.info(valid);
        if (!valid) {
          this.$Message.error("请将信息填写完整");
        } else {
          his.$Message.success("pass");
        }
      });
      this.$refs["checkForm2"].validate((valid) => {
        // console.info(valid);
        if (!valid) {
          this.$Message.error("请将信息填写完整");
        } else {
          this.$Message.success("pass");
        }
      });

      if (
        this.checkForm.carNo == "" ||
        this.checkForm.carNo == null ||
        // this.checkForm.carNo == undefined ||
        this.checkForm.axisNum < 0 ||
        this.checkForm.axisNum == null ||
        this.checkForm.axisNum == "" ||
       
        this.checkForm.carType == "" ||
        this.checkForm.carType == null ||
        // this.checkForm.carType == undefined ||
        this.checkForm.driverName == "" ||
        this.checkForm.driverName == null ||
        // this.checkForm.driverName == undefined ||
        this.checkForm.goodsCatagory == "" ||
        this.checkForm.goodsCatagory == null ||
        // this.checkForm.goodsCatagory == undefined ||
        this.checkForm.limitAmt <0 ||
        this.checkForm.limitAmt == "" ||
        this.checkForm.limitAmt == null ||
       
        this.checkForm.overAmt <0 ||
        this.checkForm.overAmt == null ||
        // this.checkForm.overAmt == ""||
        
        this.checkForm.sumAmt <0 || 
        this.checkForm.sumAmt == null ||
        this.checkForm.sumAmt == "" 
       
      ) {
        // debugger
        this.$Message.error("请将信息填写完整");
        console.info(this.checkForm.overAmt, "--111");
      } else {
        //  addCheckData
        //  var params = JSON.parse(JSON.stringify(this.checkForm));
        //  console.info(params);
        let params = this.checkForm;
        let data = {
          carNo: that.dependenceCarNo,
          axisNum: parseInt(params.axisNum),
          carTypeId: parseInt(that.selectedCarTypeId),
          driverName: params.driverName,
          goods: params.goodsCatagory,
          overAmt: parseFloat(params.overAmt),
          checkAmt: parseFloat(params.sumAmt),
          checkOrgCode: localStorage.getItem('orgCode'),
          lane: null,
          amt: null,
          createTime: null, // 预检时间
          img1: null,
          preNo: null,
          orgCode: null,
          operName: null,
        };
        // console.info(this.selectedPcheck);
        if (this.selectedPcheck != null) {
          data.carNo = this.selectedPcheck.carNo;
          data.lane = this.selectedPcheck.lane;
          data.amt = this.selectedPcheck.preAmt;
          data.createTime = this.selectedPcheck.createTime;
          data.img1 = this.selectedPcheck.img;
          data.preNo = this.selectedPcheck.preNo;
          data.orgCode = this.selectedPcheck.orgCode;
        }
        setTimeout(() => {
          addCheckData(data)
            .then((res) => {
              // if(res.data.code==-3){
              //   this.$Message.error("提交失败");
              //   }
              console.info(res);
              this.$Message.success("提交成功");
               that.$refs["checkForm2"].resetFields();
              that.$refs["checkForm1"].resetFields();
            })
            .catch((err) => {
              console.info(err);
            });
        }, 200);

        // this.checkResetClick('checkForm');
      }
    },
    checkResetClick(name) {
      // console.info( this.$refs[name]);
      // this.$refs['checkForm'].resetFields();
      this.$refs["checkForm2"].resetFields();
      this.$refs["checkForm1"].resetFields();
    },
    searchCarNoMsg(e) {
      // console.info(e);
      // this.pcheckSList.push(e)
    },
    searchPerCheckMsg(
      query // 用来读取车牌输入框
    ) {
      // console.info(query);
      if (query != "") {
        this.loading1 = true;
        this.dependenceCarNo = query;
        setTimeout(() => {
          this.loading1 = false;
          let data = { carNo: query };
          getListByCarNo(data)
            .then((res) => {
              // console.info(res);
              if (
                res.data.data.length == 1 &&
                res.data.data[0].carNo == query
              ) {
                this.dependenceCarNoDisplay = false;
              } else {
                this.dependenceCarNoDisplay = true;
              }
              this.pcheckSList = res.data.data;
            })
            .catch((err) => {
              console.info(err);
            });
        }, 200);
      } else {
        this.loading1 = false;
        this.pcheckSList = [];
      }
    },
    selectCarNo(value) {
      console.info(value);
      if (value == "myDefine") {
        this.selectedPcheck = null;
      } else {
      // this.selectedPcheck
      let datas = this.pcheckSList.find((item) => item.id == value);
      this.selectedPcheck = datas;
      console.info(this.selectedPcheck);
      this.checkForm.axisNum = datas.axisNum;
      }
    },
    changeAxisNum(value) {
      // console.info(value);
      this.checkForm.carType = "";
    },
    limitAmtChange(value) {
      // this.checkForm.overAmt="";
      
      if (this.checkForm.sumAmt != null && this.checkForm.sumAmt != "") {
        let samt = parseFloat(this.checkForm.sumAmt);
       let lamt = parseFloat(this.checkForm.limitAmt);
        
        if (samt>lamt) {
            this.checkForm.overAmt = parseFloat(samt) - parseFloat(lamt);
        } else {
          this.checkForm.overAmt = 0;
        }
      } else {
        this.checkForm.overAmt = null;
      }
    },
    focusCarType() {
      // console.info("focus");
      if (
        this.checkForm.axisNum == 0 ||
        this.checkForm.axisNum == null ||
        this.checkForm.axisNum == undefined
      ) {
        this.carTypeListByAxis = [];
        // this.$message.error("请选择轴数");
      } else {
        console.info(this.carTypeListByAxis);
        this.carTypeListByAxis = this.carTypeList.filter(
          (item) => item.axisNum == "" + this.checkForm.axisNum
        );
      }
    },
    selectCarType(value) {
      // console.info(value);
      let lamt = this.carTypeListByAxis.find((item) => item.id == value);
      this.selectedCarTypeId = lamt.id;
      this.checkForm.limitAmt = lamt.limitAmt;
    },
    inputSumAmt(value) {
      this.checkForm.sumAmt = parseFloat(this.checkForm.sumAmt);
      let samt = parseFloat(this.checkForm.sumAmt);
      if (this.checkForm.limitAmt != null && this.checkForm.limitAmt != "") {
       let lamt = parseFloat(this.checkForm.limitAmt);
        
        if (samt>lamt) {
          this.checkForm.overAmt = parseFloat(samt) - parseFloat(lamt);
        } else {
          this.checkForm.overAmt = 0;
        }
      } else {
        this.checkForm.overAmt = null;
      }
    }
  },

  mounted() {
    // this.init();
    // debugger
    // this.refresh();

    // window.I_DestroyPlugin();
    // this.manPageLanePicDisplay();
    this.ctrlDisplay();
    this.getAllCheckStation();
    this.getScanList();
    this.getCarTypeList();

    // this.handleCountRefresh();
    this.beforeDestroy();
    this.getNowPreCheckData();
    this.laneTimer = setInterval(() => {
      this.getNowPreCheckData();
    }, 2 * 1000);
    // this.tableData = testData.histories;
    // this.listenResizeF();
    this.tableHeight = this.$refs.list.offsetHeight;
    // this.tableHeight = (window.innerHeight * 0.45);
    // this.tableWidth = (window.innerWidth * 0.261);
  },
  destroyed() {
    // this.handleCountRefresh();
    this.beforeDestroy();
  },
};
</script>