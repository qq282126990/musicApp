<template>
    <div class="loading">
        <div class="bg-color">
            <i class="material-icons audiotrack">audiotrack</i>
            <v-progress-circular indeterminate class="circular"></v-progress-circular>
        </div>
        <span class="name">{{loadingText}}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            loadingText: {
                type: String,
                default: null
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '../../assets/sass/remAdaptive';
    @import '../../assets/sass/variables';

    /*外层*/
    .loading {
        width: 100%;
        text-align: center;
    }

    /*名称*/
    .name {
        box-sizing: border-box;
        font-size: px2rem(30px);
        margin: px2rem(20px) 0 0 px2rem(20px);
    }

    /*背景颜色*/
    .bg-color {
        position: relative;
        margin: 0 auto;
        border-radius: 50%;
        /*background: url("/static/img/loading.png") no-repeat;*/
        /*background-position: 50%;*/
        /*background-size: cover;*/
        background: $bg-color;
        width: px2rem(60px);
        height: px2rem(59px);
        overflow: hidden;
    }

    /*图标*/
    .audiotrack {
        position: absolute;
        top: px2rem(5px);
        left: 0;
        right: 0;
        padding: px2rem(8px);
        font-size: px2rem(40px);
        color: $audiotrack-color;
        z-index: 1;
    }

    /*旋转圆圈*/
    .circular {
        left: px2rem(-3px);
        top: px2rem(-3px);
        width: px2rem(66px) !important;
        height: px2rem(66px) !important;
        color: $audiotrack-color;
    }
</style>
