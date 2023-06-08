<template>
    <div style="height: 100%;width: 100%;">
        <div class="top-left video-div">
            <img  :src="video" />
        </div>
        <div class="top-right video-div">
            <img  :src="video" />
        </div>
        <div class="down-left video-div">
            <img  :src="video" />
        </div>
        <div class="down-right video-div">
            <img  :src="video" />
        </div>




</div>


</template>



<script>
import './video.less'
import video from '@/assets/images/car/video.png'

export default {

    data() {
        return {
            video,
        }
    }


};
</script>