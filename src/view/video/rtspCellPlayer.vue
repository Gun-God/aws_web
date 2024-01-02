<template>
  <div class="player">
    <!-- <object data="http://127.0.0.1:5500/cn/demo.html" width="1000px" height="1000px"></object> -->

    <video
      controls="controls"
      :id="'videoWin' + deviceId"
      preload="auto"
      muted
      autoplay
      :key="deviceId"
      :classId="deviceId"
      class="video"
    ></video>
    <div class="wenzi">
      {{deviceName}}
    </div>
  </div>
</template>
  <script>
import "./rtspCellPlayer.less";
import { connectWebsocket, closeWebsocket } from "@/libs/websocket";
import "@/libs/codebase/jquery-1.7.1.min.js";
import "@/libs/codebase/jsVideoPlugin-1.0.0.min.js";
import { WebVideoCtrl } from "@/libs/codebase/webVideoCtrl.js";
import flvjs from "flv.js";

// import VideoPlayer from 'vue-video-player'
export default {
  name: "videoCell",
  props: {
    src: {
      type: String,
      default: "",
    },
    deviceId: {
      type: Number,
      default: 1,
    },
    rtsp: {
      type: String,
      default:
        "rtsp://admin:admin12345@192.168.3.2:554/h264/ch1/main/av_stream",
    },
    deviceName: {
      type: String,
      default: "摄像机"
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
      },
    },
    windowNum: {
      type: Number,
      default: 1,
    },
  },
  // components: {
  //     VideoPlayer
  // },
  data() {
    return {
      isShow: false,
      hideen: false,
      socket: "",
      newId: "",
      videoTimer: null,
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
      newId: "divPlugin" + this.deviceId,
      errorTimes: 0,
      lastDecodedFrame: 0,
      interval: null,
    };
  },
  methods: {
    init() {},
    rebuild() {
      const that = this;
      if (this.flvPlayer) {
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy(); // ??????
        this.flvPlayer = null;
      }

      this.flvPlayer = flvjs.createPlayer({
        type: "flv",
        // 是否是实时流
        isLive: true,
        // 是否有音频
        hasAudio: false,
        // url: this.ipurl + websocketName,
        url: `ws://192.168.10.254:9996/rtsp/${that.deviceId}/?url=${that.rtsp}`,
        enableStashBuffer: false,
            // enableStashBuffer: true,
            enableWorker: true,
          },
          {
            cors: true,
            // cdeferLoadAfterSourceOpen: false,
            
            autoCleanupSourceBuffer: true,
            deferLoadAfterSourceOpen: true,
            stashInitialSize: 384,
            // stashInitialSize:4*1024,
            // stashInitialTime:0.2
          }
      );

      this.flvPlayer.on("error", (err) => {
        console.info("err", err);
      });
      // flvjs.getFeatureList();
      // this.newId = "videoWin" + this.deviceId;
      this.flvPlayer.attachMediaElement(
        document.getElementById("videoWin" + this.deviceId)
      );
      this.flvPlayer.load();
      this.flvPlayer.play();
    },
    playVideo() {
      // 尝试连接websocket
      // try {
      const that = this;
      const domId = document.getElementById("videoWin" + this.deviceId);
      console.info(this.deviceId);
      console.info(this.rtsp);
      // debugger
      if (this.flvPlayer) {
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy(); // ??????
      }

      this.flvPlayer = flvjs.createPlayer({
        type: "flv",
        // 是否是实时流
        isLive: true,
        // 是否有音频
        hasAudio: false,
        // url: this.ipurl + websocketName,
        url: `ws://192.168.10.254:9996/rtsp/${that.deviceId}/?url=${that.rtsp}`,
        // url: `ws://localhost:9996/rtsp/${that.deviceId}/?url=${that.rtsp}`,
        enableStashBuffer: false,
            // enableStashBuffer: true,
            enableWorker: true,
          },
          {
            cors: true,
            // cdeferLoadAfterSourceOpen: false,
            
            autoCleanupSourceBuffer: true,
            deferLoadAfterSourceOpen: true,
            stashInitialSize: 384,
            // stashInitialSize:4*1024,
            // stashInitialTime:0.2
          }
          );

      this.flvPlayer.on("error", (err) => {
        console.info("err!!!!!!!!!!!", err);
      });
      // flvjs.getFeatureList();
      // this.newId = "videoWin" + this.deviceId;
      this.flvPlayer.attachMediaElement(
        document.getElementById("videoWin" + this.deviceId)
      );
      this.flvPlayer.load();
      // this.flvPlayer.play();
      setTimeout(() => {
        // flvPlayer.play();

        this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
          // 播放失败重新播放
          console.info("!!!!!!!!!!!!!!!!!!!", errType, errDetail);
          if (this.errorTimes < 3) {
            // 播放失败次数小于3 就重新创建播放实例
            setTimeout(() => {
              // this.destroyFlvjsPlayer( this.flvPlayer)
              // this.createFlvjsPlayer(domId,url)
              this.rebuild();
              this.errorTimes++;
            }, 1000);
          } else {
            // 播放失败了
            // this.destroyFlvjsPlayer( this.flvPlayer)
            console.info("播放失败了！");
            this.errorTimes = 0;
          }
        });

        // 解决延时累加以及卡死
        this.flvPlayer.on("statistics_info", (res) => {
          // console.info(res);
      //     if (this.lastDecodedFrame == 0) {
      //    this.lastDecodedFrame = res.decodedFrames;
      //    return;
      //  }
      //  if (this.lastDecodedFrame != res.decodedFrames) {
      //    this.lastDecodedFrame = res.decodedFrames;
      //  } else {
      //      this.lastDecodedFrame = 0;
      //      if (this.player) {
      //        this.player.pause();
      //        this.player.unload();
      //        this.player.detachMediaElement();
      //        this.player.destroy();
      //        this.player= null;
      //        this.createPlayer(videoElement, this.url);
      //    }
       
      // }

          try {
          let end = this.flvPlayer.buffered.end(0); // 获取当前缓冲区末尾buffered值
          let delta = end - this.flvPlayer.currentTime; // 获取buffered与当前播放位置的差值
          // 跳帧
          if (delta > 10 || delta < 0) { // 差值大于10秒或者小于0秒
            this.flvPlayer.currentTime = this.flvPlayer.buffered.end(0) - 1;
            return;
          }
          // 追帧
          if (delta > 1) { // 差值在1到10秒之间
            domId.playbackRate = 1.2;
          } else {
            domId.playbackRate = 1;
          }
        } catch (error) {}
          // if (this.lastDecodedFrame == 0) {
          //   this.lastDecodedFrame = res.decodedFrames;
          // } else {
            
          //   if (this.lastDecodedFrame != res.decodedFrames) {
          //     this.lastDecodedFrame = res.decodedFrames;
          //   } else {
          //     this.lastDecodedFrame = 0;
          //     if (this.player) {
          //      this.rebuild();
          //     }
          //   }
          // }
        });
      }, 100);

      setTimeout(() => {
      //   this.flvPlayer.play();
      // this.handleStuck();

      }, 1000);

      return true;

      // 报错重连
      // this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
      //   console.info("errType", errType);
      //   console.info("errDetail", errDetail);
      //   if (this.flvPlayer.isLive) {
      //     this.destroyVideo();
      //     this.playVideo();
      //   }
      // });
      // console.info(this.flvPlayer);
      // let controller = this.flvPlayer._transmuxer._controller;
      // let wsLoader = controller._ioctl._loader;
      // var oldWsOnCompleteFunc = wsLoader._onComplete;
      // wsLoader._onComplete = function () {
      //   if (!controller._remuxer) {
      //     controller._remuxer = {
      //       flushStashedSamples: function () {
      //         _this.loadingVisiable = false;
      //         console.info("flushStashedSamples");
      //       },
      //     };
      //   }
      //   oldWsOnCompleteFunc();
      // };

      //  }
      // }
      // catch (error) {
      //   console.info("连接websocket异常", error);
      //   return false;
      // }
    },
//    handleStuck() {
//   let lastDecodedFrames = 0;
//   let stuckTime = 0;
 
//   this.interval && clearInterval(this.interval);
//   this.interval = setInterval(() => {
//     const decodedFrames = this.flvPlayer.statisticsInfo.decodedFrames;
//     if (!decodedFrames) return;
 
//     if (lastDecodedFrames === decodedFrames) {
//       // 可能卡住了，重载
//       stuckTime++;
//       if (stuckTime > 1) {
//         console.info(`%c 卡住，重建视频`, "background:red;color:#fff");
//         // 先destroy，再重建视频实例
//         this.rebuild();
//       }
//     } else {
//       lastDecodedFrames = decodedFrames;
//       stuckTime = 0;
//     }
//   }, 800);
// }
//     ,
    destroyVideo() {
      if (this.flvPlayer) {
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
      }
      clearInterval(this.videoTimer);
    },
    open() {
      console.info("socket连接成功");
    },
    error() {
      console.info("连接错误");
    },
    getMessage(message) {
      console.info("收到消息");
      console.info(message);
    },
    close() {
      this.socket.close();
      console.info("连接关闭");
    },
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
    console.info(this.camInfo);
    // this.playVideo();
    setTimeout(() => {
      // debugger;
      // this.init();
      this.playVideo();

      // this.setSeek();
    }, 500);

    console.info("mounted");

    // //this.playVideo();
    // console.info("mounted");
    // this.init();
  },
  destroyed() {
    this.isShow = false;
    this.destroyVideo();
    setTimeout(() => {
      console.log("销毁成功!!");
    }, 500);
  },
  beforeDestroy() {
    this.destroyVideo();

    setTimeout(() => {}, 500);
  },
};
</script>
