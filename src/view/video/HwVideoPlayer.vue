<template>
  <div class="cell" style="overflow: hidden">
    <!-- <div class="cell-tool">

            <ButtonGroup shape="circle">
                <Button @click="cellCount = 1">1屏</Button>
                <Button @click="cellCount = 2">2屏</Button>
                <Button @click="cellCount = 4">4屏</Button>
                <Button @click="cellCount = 6">6屏</Button>
                <Button @click="cellCount = 9">9屏</Button>
                <Button @click="cellCount = 16">16屏</Button>
            </ButtonGroup> 

            <ButtonGroup shape="circle" style="right: 0;">
                <Button type="primary" @click="cellCount = 1">
                    <Icon type="ios-arrow-back"></Icon>
                    1屏
                </Button>

                <Button type="primary" @click="cellCount = 4">
                    4屏
                    <Icon type="ios-arrow-forward"></Icon>
                </Button>

            </ButtonGroup>
        </div>-->
    <!-- 这里的deviceId就是机位几号位 不是数据库里的device_Id -->
    <!-- <div class="slideDiv">
         <Sider ref="side_r" collapsible :collapsed-width="80" v-model="isCollapsed" class="slideMenu" hide-trigger>
        <Row type="flex" justify="center" align="middle" class="code-row-bg">
            <p style="height: 75px"></p>
                <Col span="4">             
                    <Icon @click.native="collapsedSider" :class="rotateIcon"  type="ios-arrow-dropleft-circle" size="24" ></Icon>     
                </Col>
        </Row>                   
    </Sider> 
    </div> -->

    <div class="layout">
      <Layout :style="{ minHeight: '91vh' }">
        <Sider
          ref="leftside"
          hide-trigger
          collapsible
          :collapsed-width="78"
          v-model="isCollapsed"
        >
          <div class="sider-div">
            <div class="menu-div">
              <Menu
                active-name=""
                theme="dark"
                width="auto"
                :class="menuitemClasses"
              >
                <!-- <MenuItem v-for="(items,indexs) in orgAndScanList" :key="indexs" :name="items.code" @click.native="orgSelectCam(items.code)">
                 <Icon type="ios-people" />
                 <span>{{ items.name}}</span>
                  </MenuItem> -->
                <!-- <template slot="title">                            
                    <Icon type="ios-people" />
                    <span>{{ items.name}}</span>
                  </template> -->
                <!-- <MenuItem
                    v-for="(item, index) in titleList"
                    :key="index"
                    :title="item.title"
                  >
                    <Icon type="ios-more" /><span> {{ item.title }}</span>
                  </MenuItem> -->
                <!-- </MenuItem> -->

                <!-- ****** -->
                <Submenu
                  v-for="(items, indexs) in orgAndScanList"
                  :key="indexs"
                  :name="items.name"
                >
                  <template slot="title">
                    <Icon type="ios-people" />
                    <span>{{ items.name }}</span>
                  </template>
                  <MenuItem
                    :key="indexs"
                    :name="items.name"
                    title="分屏预览设备"
                    @click.native="orgSelectCam(items.data, 1)"
                  >
                    <Icon type="ios-more" />
                    <span> 预览画面</span>
                  </MenuItem>

                  <MenuItem
                    v-for="(i, index) in items.data"
                    :key="-(index + 1)"
                    :title="i.videoIp"
                    :name="i.code"
                    @click.native="orgSelectCam(i, 2)"
                  >
                    <Icon type="ios-more" />

                    <span v-if="nowPlayingFlag(i)" :class="playingClass(i)">
                      <!-- <span> -->
                      {{ i.laneName }}（正在播放）
                    </span>
                    <span v-if="!nowPlayingFlag(i)" :class="playingClass(i)">
                      <!-- <span> -->
                      {{ i.laneName }}
                    </span>
                  </MenuItem>
                </Submenu>

                <!-- ******* -->
                <!-- <Submenu name="3">
                        <template slot="title">
                            <Icon type="ios-people" />
                            <span> 检测站2</span>
                        </template>
                        <MenuItem v-for="(item, index) in titleList" :key="index" :title="item.title">
                            <Icon type="ios-more" /><span> {{ item.title }}</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="4">
                        <template slot="title">
                            <Icon type="ios-people" />
                            <span> 检测站3</span>
                        </template>
                        <MenuItem v-for="(item, index) in titleList" :key="index" :title="item.title">
                            <Icon type="ios-more" /><span> {{ item.title }}</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="5">
                        <template slot="title">
                            <Icon type="ios-people" />
                            <span> 检测站4</span>
                        </template>
                        <MenuItem v-for="(item, index) in titleList" :key="index" :title="item.title">
                            <Icon type="ios-more" /><span> {{ item.title }}</span>
                        </MenuItem>
                    </Submenu> -->
              </Menu>
            </div>

            <div class="collapsed-div">
              <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{ margin: '0px' }"
                type="md-menu"
                size="24"
              ></Icon>
              <!-- <Button>点我收缩</Button> -->
            </div>
          </div>
        </Sider>
        <Layout>
          <Header
            v-if="false"
            :style="{ padding: 0 }"
            class="layout-header-bar"
          >
            <Icon
              @click.native="collapsedSider"
              :class="rotateIcon"
              :style="{ margin: '0 20px' }"
              type="md-menu"
              size="24"
            ></Icon>
            <span>Demo</span>
          </Header>
          <div v-if="true" class="cell-player">
            <!-- <div :class="cellClass(index+1)" v-for="(item,index) in scanList" :key="index+1">
                <hw-cell-player  :deviceId=index+1 v-if="cellCount != 6" @changeCount="changeCount" :camIp=item.camIp :camPort=item.camPort :camUserName=item.camUserName :camPassWord=item.camPassword :camInfo=camInfo ></hw-cell-player> -->
            <!-- <hw-cell-player  :deviceId=i v-if="cellCount == 6 && i != 2 && i != 3"></hw-cell-player> -->
            <!-- <template v-if="cellCount == 6 && i == 2">
                    <div class="cell-player-6-2-cell">
                        <hw-cell-player  :deviceId=i></hw-cell-player>
                        <hw-cell-player  :deviceId=i></hw-cell-player>
                    </div>
                </template> -->
            <!-- </div> -->

            <!-- 用vif去判断海康和宇视 -->
            <!-- <div :class="cellClass(index+1)" v-for="(item,index) in scanList"  :key="index+1">
                <hw-cell-player  :deviceId=index+1 v-if="cellCount != 6" @changeCount="changeCount"  :camInfo=camInfo :windowNum=2></hw-cell-player> -->

            <div
              :class="cellClass(index + 1)"
              v-for="(item, index) in rtspArray"
              :key="index + videoKey"
            >
              <hw-cell-player
                :rtsp="item"
                :deviceId="index"
                :deviceName="nowPlaying[index].laneName"
                v-if="cellCount != 6"
                :key="videoKey + cellCount"
                @changeCount="changeCount"
              ></hw-cell-player>

              <hw-cell-player
                :deviceId="index"
                v-if="cellCount == 6 && index != 2 && index != 3"
              ></hw-cell-player>

              <template v-if="cellCount == 6 && index == 2">
                <div class="cell-player-6-2-cell">
                  <hw-cell-player :deviceId="index"></hw-cell-player>
                  <hw-cell-player :deviceId="index"></hw-cell-player>
                </div>
              </template>
              <hw-cell-player
                v-if="cellCount == 6 && index == 3"
                :deviceId="index"
              ></hw-cell-player>
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import "./HwVideoPlayer.less";
import HwCellPlayer from "./rtspCellPlayer.vue";
import video1 from "@/assets/images/car/1.png";
import video2 from "@/assets/images/car/2.png";
import video3 from "@/assets/images/car/3.png";
import video4 from "@/assets/images/car/4.jpg";

import { selectAllPerCheckOrg, selectPerOrgByCheck } from "@/api/nspOrg";
import { selectAllCamera, selectAllPreviewDevice } from "@/api/scan";
import { connectWebsocket, closeWebsocket } from "@/libs/websocket";
import { getToken } from "@/libs/util";

export default {
  components: { HwCellPlayer },
  data() {
    return {
      cellCount: 4,
      // video1: 'http://cam1.infolink.ru/mjpg/video.mjpg',
      // video2: 'http://edfmcam.dyndns.org/cgi-bin/faststream.jpg?stream=full&fps=60',
      // video3: 'http://skolten.info:8080/mjpg/video.mjpg',
      // video4: 'http://95.161.27.60/mjpg/video.mjpg',
      video1: video1,
      video2: video2,
      video3: video3,
      video4: video4,
      scanList: [
        {
          camIp: "192.168.3.2",
          camPort: "80",
          camUserName: "admin",
          camPassWord: "admin12345",
        },
      ],
      camInfo: [
        {
          camIp: "192.168.3.2",
          camPort: "80",
          camUserName: "admin",
          camPassWord: "admin12345",
        },
        {
          camIp: "192.168.3.3",
          camPort: "80",
          camUserName: "admin",
          camPassWord: "admin12345",
        },
        {
          camIp: "192.168.3.2",
          camPort: "80",
          camUserName: "admin",
          camPassWord: "admin12345",
        },
        {
          camIp: "192.168.3.3",
          camPort: "80",
          camUserName: "admin",
          camPassWord: "admin12345",
        },
      ],
      rtspArray: [
        // 'rtsp://admin:admin12345@192.168.3.2:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:admin12345@192.168.3.2:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:admin12345@192.168.3.3:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:123456@192.168.3.8:554/h264/ch1/main/av_stream'
        "rtsp://admin:admin12345@192.168.3.4:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.3.3:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.3.2:554/Streaming/Channels/102",
        "rtsp://admin:123456@192.168.3.8:554/video2",
      ],
      // rtspArrayNames:[],
      nowPlaying: [],
      rtspArray1: [
        // 'rtsp://admin:admin12345@192.168.3.2:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:admin12345@192.168.3.2:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:admin12345@192.168.3.3:554/h264/ch1/main/av_stream',
        // 'rtsp://admin:123456@192.168.3.8:554/h264/ch1/main/av_stream'
        "rtsp://admin:admin12345@192.168.3.4:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.3.3:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.3.2:554/Streaming/Channels/102",
        "rtsp://admin:123456@192.168.3.8:554/video2",
      ],
      rtspArray2: [
        "rtsp://admin:admin12345@192.168.7.4:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.7.3:554/Streaming/Channels/102",
        "rtsp://admin:admin12345@192.168.7.2:554/Streaming/Channels/102",
        "rtsp://admin:123456@192.168.7.8:554/video2",
      ],
      isCollapsed: false,
      titleList: [
        {
          index: 1,
          title: "标题标题标题标题标题标题标题标题标题标题标题标题1",
        },
        {
          index: 2,
          title: "标题2",
        },
        {
          index: 3,
          title: "标题3",
        },
      ],
      orgList: [],
      scanList: [],
      orgAndScanList: [],
      videoKey: 0,
    };
  },

  methods: {
    changeCount(params) {
      this.cellCount = params;
    },
    init() {},
    getCamMes() {
      // 获取摄像头信息
      // const scanData=[];
      this.scanList[0] = {
        camIp: "192.168.3.2",
        camPort: "80",
        camUserName: "admin",
        camPassword: "admin12345",
      };
      this.scanList[1] = {
        camIp: "192.168.3.3",
        camPort: "80",
        camUserName: "admin",
        camPassword: "admin12345",
      };
      this.scanList[2] = {
        camIp: "192.168.3.4",
        camPort: "80",
        camUserName: "admin",
        camPassword: "admin12345",
      };
      this.scanList[3] = {
        camIp: "",
        camPort: "",
        camUserName: "",
        camPassword: "",
      };
      // console.info(scanData);

      // scanData[0].camIp='192.168.3.2';
      // scanData[0].camPort='80';
      // scanData[0].camUserName='admin';
      // scanData[0].camPassword='admin12345';
      // scanData[1].camIp='192.168.3.3';
      // scanData[1].camPort='80';
      // scanData[1].camUserName='admin';
      // scanData[1].camPassword='admin12345';
      // scanData[2].camIp='192.168.3.4';
      // scanData[2].camPort='80';
      // scanData[2].camUserName='admin';
      // scanData[2].camPassword='admin12345';
      // scanData[3].camIp='';
      // scanData[3].camPort='';
      // scanData[3].camUserName='';
      // scanData[3].camPassword='';
      // this.scanList=scanData;
      console.info(this.scanList);
    },
    collapsedSider() {
      this.$refs.leftside.toggleCollapse();
    },
    getScanList(checkList) {
      // console.info(checkList);
      let roleId = localStorage.getItem("roleId");
      let orgCode = localStorage.getItem("orgCode");
      const that = this;
      selectAllPreviewDevice()
        .then((res) => {
          let scanLists = res.data.data;
          let realScanList = [];

          console.info(scanLists);
          // 填充设备表 判断是否为超级管理员。这里还应当剩一个精检 后面记得完善！！！
          if (roleId == 1 || roleId == "1") {
            realScanList = scanLists;
          } else if (roleId == 3 || roleId == "3") {
            for (let i = 0; i < scanLists.length; i++) {
              for (let j = 0; j < checkList.length; j++) {
                if (
                  scanLists[i].orgCode == checkList[j].code &&
                  scanLists[i].position != -1
                ) {
                  realScanList.push(scanLists[i]);
                  break;
                }
              }
            }
          } else {
            for (let i = 0; i < scanLists.length; i++) {
              if (
                scanLists[i].orgCode == orgCode &&
                scanLists[i].position != -1
              ) {
                realScanList.push(scanLists[i]);
              }
            }
          }

          // debugger
          if (roleId == 1 || roleId == "1" || roleId == 3 || roleId == '3') {
            for (let i = 0; i < checkList.length; i++) {
              // debugger;
              let temp = [];
              // 写双层循环
              for (let j = 0; j < realScanList.length; j++) {
                if (
                  realScanList[j].orgCode == checkList[i].code &&
                  realScanList[j].position != -1
                ) {
                  temp.push(realScanList[j]);
                }
              }
              if (temp.length == 0) {
                checkList[i].data = [];
              } else {
                checkList[i].data = temp;
              }
            }
            console.info(checkList);
            that.orgAndScanList = checkList;
          } else {
            checkList[0].data = realScanList;
            that.orgAndScanList.push(checkList[0]);
          }

          //  console.info(checkList);
          console.info(that.orgAndScanList);

          // 设置默认播放 播放rtsp流
          // 取当前的orgcode
          let orgcode = localStorage.getItem("orgCode");
          let oData = that.orgAndScanList.find((item) => item.code == orgcode);
          if (roleId == 3 || roleId == '3') {
            oData = that.orgAndScanList[0];
          }
          // console.info(oData);
          let len = 0;
          if (oData.data.length >= 4) {
            len = 4;
          } else if (oData.data.length >= 2) len = 2;
          else if (oData.data.length >= 1) len = 1;

          let rtsps = this.genRtspData(oData.data, len);
          // 生成rtsps-设备名称map
          this.cellCount = len;
          this.rtspArray = rtsps;
          // console.info(that.camInfo);
        })
        .catch((err) => {
          // console.info(err)
        });
    },
    getAllCheckStation() {
      // 查询检测站

      // debugger
      const that = this;
      let roleId = localStorage.getItem("roleId");
      let orgCode = localStorage.getItem("orgCode");
      if (roleId == 3 || roleId == "3") {
        selectPerOrgByCheck(orgCode)
          .then((res) => {
            if (res.data.code == 200) {
              console.info(res.data.data);
              this.orgList = res.data.data;
              let checkList = [];
              checkList = res.data.data;
              that.getScanList(checkList);
            }
          })
          .catch((err) => {
            console.info(err);
          });
      } else {
        // 拉取所有的检测站
        selectAllPerCheckOrg()
          .then((res) => {
            // debugger
            // console.info(res.data.data);

            this.orgList = res.data.data;
            let checkList = [];
            // debugger;

            if (roleId == 1 || roleId == "1") {
              checkList = res.data.data;
              //   console.info(checkList);
            } else {
              // 拉去当前orgcode的检测站
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].code == orgCode) {
                  checkList.push(res.data.data[i]);
                  break;
                }
              }
            }
            if (checkList.length >= 0) {
              //    console.info(checkList);
              that.getScanList(checkList);
            }
          })
          .catch((err) => {
            console.info(err);
          });
      }

      //   this.$parent.handleCountRefresh();
    },
    genRtspData(list, length) {
      // console.info(list);
      let rtsps = [];
      // this.rtspArrayNam//es=[];
      this.nowPlaying = [];
      // 宇视和海康的拼接规则不一样
      for (let i = 0; i < length; i++) {
        // 这里全部使用辅码流
        let str = "";
        if (list[i].factory == 2) {
          // hik
          str =
            "rtsp://" +
            list[i].userName +
            ":" +
            list[i].password +
            "@" +
            list[i].videoIp +
            ":554/Streaming/Channels/102";
        } else if (list[i].factory == 1) {
          // unv
          str =
            "rtsp://" +
            list[i].userName +
            ":" +
            list[i].password +
            "@" +
            list[i].videoIp +
            ":554/video2";
        }
        // this.rtspArrayNames.push(list[i].laneName);
        this.nowPlaying.push(list[i]);
        rtsps.push(str);
      }
      console.info(this.rtspArrayNames);
      console.info(rtsps);
      return rtsps;
    },
    orgSelectCam(list, flag) {
      if (flag == 1) {
        // 预览前四个
        console.info(list);

        let len = 0;
        if (list.length >= 4) {
          this.cellCount = 4;
          len = 4;
        } else if (list.length >= 2) {
          this.cellCount = 2;
          len = 2;
        } else if (list.length == 1) {
          this.cellCount = 1;
          len = 1;
        }
        let rtsps = this.genRtspData(list, len);
        this.rtspArray = rtsps;
      } else if (flag == 2) {
        // 单个预览
        console.info(list);

        let listArray = [];
        listArray.push(list);
        let rtsps = this.genRtspData(listArray, 1);
        this.rtspArray = [];
        this.rtspArray.push(rtsps[0]);
        this.cellCount = 1;
      }
      // console.info(111, name);
      // let orgCode = name;
      // if (orgCode == "028") {
      //   this.rtspArray = this.rtspArray2;
      // } else {
      //   this.rtspArray = this.rtspArray1;
      // }

      this.videoKey++;

      // 查询scan列表中相同org的设备

      // 拼接rtsp字符串
    },
    playingClass(item) {
      // 判断逻辑
      let b = this.nowPlaying.find((item1) => item1.id == item.id);
      if (b != undefined) {
        // this.nowPlayingFlag=true;
        return ["video-playing"];
      } else {
        //    this.nowPlayingFlag=false;
      }
    },
    nowPlayingFlag(item) {
      // 判断逻辑
      let b = this.nowPlaying.find((item1) => item1.id == item.id);
      if (b != undefined) {
        return true;
        // return ["video-playing"];
      } else {
        return false;
      }
    },
  },
  computed: {
    cellClass() {
      return function (index) {
        switch (this.cellCount) {
          case 1:
            return ["cell-player-1"];
          case 2:
            return ["cell-player-2"];
          case 4:
            return ["cell-player-4"];
          case 6:
            if (index == 1) return ["cell-player-6-1"];
            if (index == 2) return ["cell-player-6-2"];
            if (index == 3) return ["cell-player-6-none"];
            return ["cell-player-6"];
          case 9:
            return ["cell-player-9"];
          case 16:
            return ["cell-player-16"];
          default:
            break;
        }
      };
    },
    videoIndex() {
      return function (index) {
        //  console.info(index)
        switch (index) {
          case 1:
            //  console.info(this.video1)
            return this.video1;
          case 2:
            return this.video2;
          case 3:
            return this.video3;
          case 4:
            return this.video4;
          default:
            return this.video1;
        }
      };
    },

    rotateIcon() {
      // return ['menu-icon', this.isCollapsed ? 'rotate-icon' : ''];
      return ["menu-icon"];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    refresh() {
      this.$router.go(0);
    },
  },

  created() {
    // 创建vm实例后执行
    // 浏览器控制按钮前进后退触发函数
    // window.addEventListener('popstate', this.popstate, false);
    // this.getCamMes();
  },
  mounted() {
    // document.addEventListener('visibilitychange', this.handleVisiable)
    this.getAllCheckStation();
  },
  destroyed() {
    this.refresh();
  },
};
</script>
