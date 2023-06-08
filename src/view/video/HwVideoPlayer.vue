<template>
    <div class="cell">
        <div class="cell-tool">


            <ButtonGroup shape="circle">
                <Button @click="cellCount = 1">1屏</Button>
                <Button @click="cellCount = 2">2屏</Button>
                <Button @click="cellCount = 4">4屏</Button>
                <Button @click="cellCount = 6">6屏</Button>
                <Button @click="cellCount = 9">9屏</Button>
                <Button @click="cellCount = 16">16屏</Button>
            </ButtonGroup>

            <!-- <ButtonGroup shape="circle" style="right: 0;">
                <Button type="primary" @click="cellCount = 1">
                    <Icon type="ios-arrow-back"></Icon>
                    1屏
                </Button>
                
                <Button type="primary" @click="cellCount = 4">
                    4屏
                    <Icon type="ios-arrow-forward"></Icon>
                </Button>
                
            </ButtonGroup> -->
        </div>
        <div class="cell-player">
            <div :class="cellClass(i)" v-for="i in cellCount" :key="i">
                <hw-cell-player :src="video" v-if="cellCount != 6" :cellCount="cellCount"
                    @changeCount="changeCount"></hw-cell-player>
                <hw-cell-player :src="video" v-if="cellCount == 6 && i != 2 && i != 3"
                    :cellCount="cellCount"></hw-cell-player>
                <template v-if="cellCount == 6 && i == 2">
                    <div class="cell-player-6-2-cell">
                        <hw-cell-player :src="video" :cellCount="cellCount"></hw-cell-player>
                        <hw-cell-player :src="video" :cellCount="cellCount"></hw-cell-player>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import './HwVideoPlayer.less'
import HwCellPlayer from './HwCellPlayer.vue'
import video from '@/assets/images/car/video.png'


export default {
    components: { HwCellPlayer },
    data() {
        return {
            cellCount: 4,
            video,
            buttonSize: 'large'
        }
    },
    methods: {
        changeCount(params) {
            this.cellCount = params;
        }
    },
    computed: {
        cellClass() {
            return function (index) {
                switch (this.cellCount) {
                    case 1:
                        return ['cell-player-1']
                    case 2:
                        return ['cell-player-2']
                    case 4:
                        return ['cell-player-4']
                    case 6:
                        if (index == 1)
                            return ['cell-player-6-1']
                        if (index == 2)
                            return ['cell-player-6-2']
                        if (index == 3)
                            return ['cell-player-6-none']
                        return ['cell-player-6']
                    case 9:
                        return ['cell-player-9']
                    case 16:
                        return ['cell-player-16']
                    default:
                        break;
                }

            }
        },


    },
}
</script>

