<template>
    <div class="loading">
        <div class="bg-color">
            <!--<img width="45" height="45" src="https://y.gtimg.cn/mediastyle/yqq/img/loading.gif"/>-->
            <v-icon class="audiotrack">audiotrack</v-icon>
            <v-progress-circular indeterminate class="green"></v-progress-circular>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {};
</script>

<style lang="scss" scoped>
    @import '../../common/sass/remAdaptive';
    @import '../../common/sass/variables';

    /*外层*/
    .loading {
        width: 100%;
        text-align: center;
    }

    /*背景颜色*/
    .bg-color {
        position: relative;
        margin: 0 auto;
        border-radius: 50%;
        background: $bg-color;
        width: px2rem(60px);
        height: px2rem(59px);
    }

    /*图标*/
    .audiotrack {
        position: absolute;
        padding: px2rem(12px);
        font-size: px2rem(40px);
        color: $audiotrack-color;
        z-index:1;
    }

    /*旋转圆圈*/
    .green {
        left: px2rem(-3px);
        top: px2rem(-3px);
        width: px2rem(66px) !important;
        height: px2rem(66px) !important;
        color: #57b45a;
    }
</style>