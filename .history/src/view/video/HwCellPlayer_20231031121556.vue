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
import './HwCellPlayer.less'
import { connectWebsocket, closeWebsocket } from '@/libs/websocket'
import flvjs from 'flv.js';

//import VideoPlayer from 'vue-video-player'
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
            playerOptions: {
                live: true,
                autoplay: true, // 如果true，浏览器准备好时开始播放
                muted: false, // 默认情况下将会消除任何音频
                loop: false, // 是否视频一结束就重新开始
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // controlBar: {
                //     timeDivider: false,
                //     durationDisplay: false,
                //     remainingTimeDisplay: false,
                //     currentTimeDisplay: false, // 当前时间
                //     volumeControl: false, // 声音控制键
                //     playToggle: false, // 暂停和播放键
                //     progressControl: false, // 进度条
                //     fullscreenToggle: true // 全屏按钮
                // },
                // techOrder: ['flash'], // 兼容顺序
                // flash: {
                //     hls: {
                //         withCredentials: false
                //     },
                //     // swf: SWF_URL
                // },
                controls: true,
                sources: [{
                    // type: 'rtmp/flv',
                    type: "application/x-mpegURL",

                    src: 'http://208.65.20.237/mjpg/video.mjpg' // 视频地址-改变它的值播放的视频会改变
                }],
                notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            }
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
        playVideo() {
            //尝试连接websocket
            try {
                if (flvjs.isSupported()) {
                    // 如果已经存在 flvPlayer 实例，先停止和销毁它
                // 
                if (this.flvPlayer) {
                    this.flvPlayer.pause()
                    this.flvPlayer.unload()
                    this.flvPlayer.detachMediaElement()
                    this.flvPlayer.destroy()
                    }
                              
                // 

                  //  let websocketName =
                   //     "/device/monitor/videoConnection/" + channelnum + device_value;
                  //  console.info("进入连接websocket", this.ipurl + websocketName);
                    this.flvPlayer = flvjs.createPlayer(
                        {
                            type: "flv",
                            //是否是实时流
                            isLive: true,
                            //是否有音频
                            hasAudio: false,
                            // url: this.ipurl + websocketName,
                            url: 'ws://localhost:8787/aws/websocket/' + this.deviceId,
                            enableStashBuffer: true,
                        },
                        {
                            // 
                            cors:true,

                            enableWorker:true,
                            autoCleanupSourceBuffer:true,
                            // 
                            // stashInitialSize: 128,
                            stashInitialSize:384
                        }
                    );
                    this.flvPlayer.on("error", (err) => {
                        console.log("err", err);
                    });
                    flvjs.getFeatureList();
                    this.flvPlayer.attachMediaElement(document.getElementById("videoWin"));
                    this.flvPlayer.load();
                    this.flvPlayer.play().catch(err);
                    return true;

                    //报错重连
                    this.flvPlayer.on(flvjs.Events.ERROR, (errType,errDetail) => {
                        console.log("errType", errType);
                        console.log("errDetail",errDetail);
                        if(this.flvPlayer.isLive)
                        {
                            this.destroyVideo();
                            this.playVideo();
                        }
                    }
                    );

                }
            } catch (error) {
                console.log("连接websocket异常", error);
                return false;
            }


        },
        destroyVideo()
        {
            if(this.flvPlayer)
            {
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = null;
            }
        }
        // open() {
        //     console.log("socket连接成功")
        // },
        // error() {
        //     console.log("连接错误")
        // },
        // getMessage(message) {
        //     console.log("收到消息");
        //     console.log(message);
        // },
        // close() {
        //     this.socket.close();
        //     console.log("连接关闭");
        // },
        ,
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
        //     this.init();
        // }, 500);
        this.playVideo();
        console.info("mounted")
        // this.init();
    },
    destroyed() {

        closeWebsocket(this.wsObj);
        console.info("销毁webscoket")
    },
    beforeDestroy() {
        this.destroyVideo();
    }
}
</script>


