<template>
    <div class="player" @mouseover="mouseOverOne" @mouseleave="mouseLeaveOne">
        <img :src="src" />
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
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        cellCount: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            hideen: false
        }
    },
    methods: {
        mouseOverOne() {
            this.hideen = true
        },
        mouseLeaveOne() {
            this.hideen = false
        },
        fullscre() {
          //  alert(1)
           this.$emit("changeCount",2)
        }

    }
}
</script>


