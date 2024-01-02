<template>
  <div class="player">

     <!-- <object data="http://127.0.0.1:5500/cn/demo.html" width="1000px" height="1000px"></object> -->
   
        <div id="videoWin2" class="video" ></div>
  
  <!-- 
    <div>
      <button @click="loginCmera">登录</button>
       <button @click="realPlay">预览</button>
     </div> -->
  </div>
  </template>
  
  <script>
  import "./CellPlayer.less";
  import { connectWebsocket, closeWebsocket } from "@/libs/websocket";
  import '@/libs/codebase/jquery-1.7.1.min.js'
  import "@/libs/codebase/jsVideoPlugin-1.0.0.min.js";
  import { WebVideoCtrl } from '@/libs/codebase/webVideoCtrl.js'
  
  import flvjs from "flv.js";
  
  // import VideoPlayer from 'vue-video-player'
  export default {
    name: 'videoCell',
    props: {
      src: {
        type: String,
        default: "",
      },
      deviceId: {
        type: Number,
        default: 1,
      },
      // camIp:{
      //   type: String,
      //   default: ""
      // },
      // camPort:{
      //   type: String,
      //   default: ""
      // },
      // camPassWord:{
      //   type: String,
      //   default: ""
      // },
      // camUserName:{
      // type: String,
      //   default: ""
      // },
      camInfo: {
        type: Array,
        default() {
          return [];
        }
      },
      windowNum: {
        type: Number,
        default: 1
      }
    },
    // components: {
    //     VideoPlayer
    // },
    data() {
      return {
        isShow: false,
        hideen: false,
        socket: "",
        //
        flvPlayer: null,
        //
        wsObj: null,
        // szIP : "192.168.3.2",
        //   szPort : "80",
        //   szUsername : "admin",
        //   szPassword : "admin12345",
        //   szDeviceIdentify:null
        szIP: this.camIp,
          szPort: this.camPort,
          szUsername: this.camUserName,
          szPassword: this.camPassWord,
          szDeviceIdentify: null,
          newId: "divPlugin" + this.deviceId
      };
    },
    methods: {
      init() {
          const that = this;
        console.info(1)
       window.I_InitPlugin({ 
        bWndFull: true, // 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: that.windowNum, // 改成2为4屏
          cbInitPluginComplete: function () {
            window.I_InsertOBJECTPlugin("videoWin2").then(
              () => {
             //   alert("初始化成功");
             console.info("初始化成功");
                // 检查插件是否最新
                window.I_CheckPluginVersion().then((bFlag) => {
                    if (bFlag) {
                        alert("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！");
                    }
                });
                // that.loginCmera();
                that.cam_LoginAndrealplay();
              },
              () => {
                alert("插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！");
              }
            );
          },
        });
      },
      cam_LoginAndrealplay() {
        const that = this;
        
        for (var i = 0; i<that.camInfo.length; i++) {
          // setTimeout(() => {
          //   that.loginCmera(that.camInfo[i].camIp,that.camInfo[i].camPort,that.camInfo[i].camUserName,that.camInfo[i].camPassWord,i);
          //      }, 1000);
          // 循环登录
          this.loginCmera(this.camInfo[i].camIp, this.camInfo[i].camPort, this.camInfo[i].camUserName, this.camInfo[i].camPassWord, i);
        }
      },      
      loginCmera(n_ip, n_port, n_uname, n_pwd, windIndex) {
        this.isShow = true;
        const that = this;
      //   const szIP = "192.168.3.4";
      //   const szPort = "80";
      //   const szUsername = "admin";
      //   const szPassword = "admin12345";
   console.info(2)
        // this.szDeviceIdentify = this.szIP + "_" + this.szPort;
       window.I_Login(n_ip, 1, n_port, n_uname, n_pwd, {
      //  window.I_Login("192.168.3.2", 1, "80", "admin", "admin12345", {
          timeout: 3000,
          success: function (xmlDoc) {
            console.info("登陆成功");
               setTimeout(() => {
              that.realPlay(n_ip, n_port, n_uname, n_pwd, windIndex);
               }, 1000);
           
            // $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
            // setTimeout(function () {
            //    $("#ip").val(szDeviceIdentify);
            //    setTimeout(function() {
            //        getChannelInfo();
            //    }, 1000);
            // getDevicePort();
            // }, 10);
          },
          error: function (oError) {
            if (ERROR_CODE_LOGIN_REPEATLOGIN === status) {
              // showOPInfo(szDeviceIdentify + " 已登录过！");
              console.info("已登录过");   
              this.realLogout();
            } else {
              // showOPInfo(
              //   szDeviceIdentify + " 登录失败！",
              //   oError.errorCode,
              //   oError.errorMsg
              // );
              console.info("登录失败！");
            }
          },
        });
      },
      realLogout() {
        const that = this;
        for (var i = 0; i<that.camInfo.length; i++) {
      //  window.I_Logout(this.szDeviceIdentify).then(
        window.I_Logout(that.camInfo[i].camIp + "_" + that.camInfo[i].camPort).then(
          () => {
          //   showOPInfo(szDeviceIdentify + " " + "退出成功！");
              console.info("退出成功");
          },
          () => {
          //   showOPInfo(szDeviceIdentify + " " + "退出失败！");
              console.info("退出失败");
          }
        );
      }
      },       
      realPlay(n_ip, n_port, n_uname, n_pwd, windIndex) {
        //  console.info(this.szDeviceIdentify)
        //   if(this.szDeviceIdentify==null)
        //       return;
          
          window.I_StartRealPlay(n_ip + "_" + n_port, { iWndIndex: windIndex,
              success: function () {
                  // szInfo = "开始预览成功！";
                  console.info("开始预览成功！");
                  // showOPInfo(szDeviceIdentify + " " + szInfo);               
              },
              error: function (oError) {
                  // showOPInfo(szDeviceIdentify + " 开始预览失败！", oError.errorCode, oError.errorMsg);
                  console.info("开始预览失败！", oError);
              }
          });
      },      
      stopPlay() {
        for (var i = 0; i<this.camInfo.length; i++) {
         window.I_Stop({ iWndIndex: i,
              success: function () {
                  // szInfo = "停止预览成功！";
                  // showOPInfo(oWndInfoszDeviceIdentify. + " " + szInfo);
                  console.info("停止预览成功！");
              },
              error: function (oError) {
                  // showOPInfo(szDeviceIdentify + " 停止预览失败！", oError.errorCode, oError.errorMsg);
                  console.info("停止预览失败！");
              }
          });
        }
      }, // ,
      // playVideo() {
      //   //尝试连接websocket
      //   try {
      //     console.info(this.deviceId);
      //     // if (flvjs.isSupported()) {
      //     // 如果已经存在 flvPlayer 实例，先停止和销毁它
      //     //  console.info(this.deviceId)
      //     //
      //     if (this.flvPlayer) {
      //       this.flvPlayer.pause();
      //       this.flvPlayer.unload();
      //       this.flvPlayer.detachMediaElement();
      //       this.flvPlayer.destroy(); //??????
      //     }
  
      //     //
  
      //     //  let websocketName =
      //     //     "/device/monitor/videoConnection/" + channelnum + device_value;
      //     //  console.info("进入连接websocket", this.ipurl + websocketName);
      //     this.flvPlayer = flvjs.createPlayer(
      //       {
      //         type: "flv",
      //         //是否是实时流
      //         isLive: true,
      //         //是否有音频
      //         hasAudio: false,
      //         // url: this.ipurl + websocketName,
      //         url: "ws://localhost:8787/aws/websocket/" + this.deviceId,
      //         enableStashBuffer: false,
      //       },
      //       {
      //         //
      //         cors: true,
      //         cdeferLoadAfterSourceOpen: false,
      //         // enableWorker:true,
      //         autoCleanupSourceBuffer: true,
      //         //
      //         // stashInitialSize: 128,
      //         stashInitialSize: 384,
      //       }
      //     );
  
      //     this.flvPlayer.on("error", (err) => {
      //       console.info("err", err);
      //     });
      //     flvjs.getFeatureList();
      //     this.flvPlayer.attachMediaElement(document.getElementById("videoWin"));
      //     this.flvPlayer.load();
  
      //     this.flvPlayer.play();
      //     return true;
  
      //     //报错重连
      //     this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
      //       console.info("errType", errType);
      //       console.info("errDetail", errDetail);
      //       if (this.flvPlayer.isLive) {
      //         this.destroyVideo();
      //         this.playVideo();
      //       }
      //     });
      //     console.info(this.flvPlayer);
      //     let controller = this.flvPlayer._transmuxer._controller;
      //     let wsLoader = controller._ioctl._loader;
      //     var oldWsOnCompleteFunc = wsLoader._onComplete;
      //     wsLoader._onComplete = function () {
      //       if (!controller._remuxer) {
      //         controller._remuxer = {
      //           flushStashedSamples: function () {
      //             _this.loadingVisiable = false;
      //             console.info("flushStashedSamples");
      //           },
      //         };
      //       }
      //       oldWsOnCompleteFunc();
      //     };
  
      //     //  }
      //   } catch (error) {
      //     console.info("连接websocket异常", error);
      //     return false;
      //   }
      // },
      // destroyVideo() {
      //   if (this.flvPlayer) {
      //     this.flvPlayer.pause();
      //     this.flvPlayer.unload();
      //     this.flvPlayer.detachMediaElement();
      //     this.flvPlayer.destroy();
      //     this.flvPlayer = null;
      //   }
      // },
      
      // open() {
      //     console.info("socket连接成功")
      // },
      // error() {
      //     console.info("连接错误")
      // },
      // getMessage(message) {
      //     console.info("收到消息");
      //     console.info(message);
      // },
      // close() {
      //     this.socket.close();
      //     console.info("连接关闭");
      // },
      mouseOverOne() {
        this.hideen = true;
      },
      mouseLeaveOne() {
        this.hideen = false;
      },
      fullscre() {
        //  alert(1)
        this.$emit("changeCount", 2);
      },
    },    
    mounted() {
    // setTimeout(() => {
     //    this.init();
  
    //  }, 100);
     console.info(this.camInfo); 
        // window.I_DestroyPlugin();
      setTimeout(() => {
         this.init();
      }, 100);
      
      console.info("mounted");
   
      // //this.playVideo();
      // console.info("mounted");
       // this.init();
    },
    destroyed() {
        this.isShow = false;
      this.stopPlay();
       this.realLogout();
      setTimeout(() => {
        window.I_DestroyPlugin();
      }, 500);
      this.realLogout();
       setTimeout(() => {
  
      }, 500);
      console.info("销毁webscoket");
    },
    beforeDestroy() {
       this.stopPlay();
       this.realLogout();
      setTimeout(() => {
        window.I_DestroyPlugin();
      }, 500);
      this.realLogout();
       setTimeout(() => {
  
      }, 500);
    },
  };
  </script>
