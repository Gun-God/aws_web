<template>
    <div class="player" >
        <!-- <img :src="src" /> -->
        <video autoplay controls id="videoWin" />

        <!-- <video-player ref="videoPlayer" :options="playerOptions">
        </video-player> -->
        <!-- <transition tag="div" name="fade">
            <div class="full-scren" v-show="hideen">
                <Icon type="ios-expand" size="26"
                    style="line-height: 2rem;float: right;margin-right: .5rem;cursor: pointer;" @click="fullscre"
                    title="全屏" />
            </div>
        </transition> -->
    </div>
</template>

<script>
import './HwCellPlayer2.less'
import { connectWebsocket, closeWebsocket } from '@/libs/websocket'
import flvjs from 'flv.js';
import wfsjs from 'wfs.js';

// import VideoPlayer from 'vue-video-player'
export default {

    props: {
        src: {
            type: String,
            default: ''
        },
        deviceId: {
            type: Number,
            default: 1
        }
    },
    // components: {
    //     VideoPlayer
    // },
    data() {
        return {
            hideen: false,
            socket: '',
            //
            flvPlayer: null,
            //
            wsObj: null,
           
        }
    },
    methods: {

        init() {
            // // 实例化socket
            // this.socket = new WebSocket('ws://localhost:8787/aws/getRealVideo',[getToken()]);
            // // 监听socket连接
            // this.socket.onopen = this.open
            // // 监听socket错误信息
            // this.socket.onerror = this.error
            // // 监听socket消息
            // this.socket.onmessage = this.getMessage
            // // 监听socket断开连接的消息
            // this.socket.close = this.close
            this.wsObj = connectWebsocket(
                // 测试地址
                'ws://localhost:8787/aws/websocket/' + this.deviceId,
                // 传递给后台的数据
                null,
                // { openexe: 'openexe' },
                // 成功拿到后台返回的数据的回调函数
                (data) => {
                    console.info('成功的回调函数, 接收到的data数据: ', data)
                },
                // websocket连接失败的回调函数
                (err) => {
                    console.info('失败的回调函数', err)
                }
            )
        },
        playVideo2() {
            console.info(this.deviceId)
            if (wfsjs.isSupported()) {
                var video1 = document.getElementById("videoWin");
                var wfs = new wfsjs();
                var socket_path = 'ws://localhost:8787/aws/websocket/' + this.deviceId;
                var socket = new WebSocket(socket_path);
                wfs.attachMedia(video1);
                wfs.attachWebsocket(socket);
            }
        },        
        playVideo() {
            // 尝试连接websocket
            try {
               console.info(this.deviceId)
               // if (flvjs.isSupported()) {
                    // 如果已经存在 flvPlayer 实例，先停止和销毁它
                  //  console.info(this.deviceId)
                // 
                if (this.flvPlayer) {
                    this.flvPlayer.pause()
                    this.flvPlayer.unload()
                    this.flvPlayer.detachMediaElement()
                    this.flvPlayer.destroy()// ??????
                    }
                              
                // 

                  //  let websocketName =
                   //     "/device/monitor/videoConnection/" + channelnum + device_value;
                  //  console.info("进入连接websocket", this.ipurl + websocketName);
                    this.flvPlayer = flvjs.createPlayer(
                        {
                            type: "flv",
                            // 是否是实时流
                            isLive: true,
                            // 是否有音频
                            hasAudio: false,
                            // url: this.ipurl + websocketName,
                            url: 'ws://localhost:8787/aws/websocket/' + this.deviceId,
                            enableStashBuffer: false,
                        },
                        {
                            // 
                            cors: true,
                        cdeferLoadAfterSourceOpen: false,
                            // enableWorker:true,
                            autoCleanupSourceBuffer: true,
                            // 
                            // stashInitialSize: 128,
                            stashInitialSize: 384
                        }
                    );
                   
                    this.flvPlayer.on("error", (err) => {
                        console.info("err", err);
                    });
                    flvjs.getFeatureList();
                    this.flvPlayer.attachMediaElement(document.getElementById("videoWin"));
                    this.flvPlayer.load();
                  
                    this.flvPlayer.play();
                    return true;

                    // 报错重连
                    this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                        console.info("errType", errType);
                        console.info("errDetail", errDetail);
                        if (this.flvPlayer.isLive) {
                            this.destroyVideo();
                            this.playVideo();
                        }
                    }
                    );
 console.info(this.flvPlayer)
                     let controller = this.flvPlayer._transmuxer._controller
                    let wsLoader = controller._ioctl._loader
                    var oldWsOnCompleteFunc = wsLoader._onComplete
                    wsLoader._onComplete = function() {
             if (!controller._remuxer) {
             controller._remuxer = {
      flushStashedSamples: function () {
        _this.loadingVisiable = false
        console.info("flushStashedSamples")
      }
    }
  }
  oldWsOnCompleteFunc()
}

              //  }
            } catch (error) {
                console.info("连接websocket异常", error);
                return false;
            }
        },
        destroyVideo() {
            if (this.flvPlayer) {
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = null;
            }
        }, // open() {
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
            this.hideen = true
        },
        mouseLeaveOne() {
            this.hideen = false
        },
        fullscre() {
            //  alert(1)
            this.$emit("changeCount", 2)
        }

    },
    mounted() {
        // setTimeout(() => {
           
        // }, 500);
        this.playVideo();
        console.info("mounted")
        // this.init();
    },
    destroyed() {
        closeWebsocket(this.wsObj);
        this.destroyVideo();
        console.info("销毁webscoket")
    },
    beforeDestroy() {
        // this.destroyVideo();
    }
}
</script>
