<template>
    <!--歌曲列表播放全部模块-->
    <div class="song-list-play-all">
        <!--播放全部-->
        <div class="play-all-wrapper">
            <i class="material-icons play">play_circle_outline</i>
            <h3 class="name">全部播放</h3>
            <span class="total-number" v-show="totalSongNum">共{{totalSongNum}}首</span>
        </div>
        <!--下载-->
        <div class="download">
            <i class="iconfont icon-xiazai"></i>
            <span class="name">下载</span>
        </div>
        <!--多选-->
        <div class="multiple-select">
            <i class="iconfont icon-pingtaitubiao_duoxuan icon"></i>
            <span class="name">多选</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            /*
            * 歌曲总数
            * @type {Number}
            * */
            totalSongNum: {
                type: Number,
                default: null
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /* 歌曲列表头部*/
    .song-list-play-all {
        position: relative;
        //bottom: px2rem(-108px);
        background: $list-bgcolor;
        box-sizing: border-box;
        z-index: 100;
        display: flex;
        justify-content: center;
        padding: 0 px2rem(32px);
        border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        height: px2rem(108px);
        width: 100%;
        .name {
            margin-left: px2rem(20px);
            display: block;
            font-size: px2rem(28px);
        }
        /*播放全部*/
        .play-all-wrapper {
            flex: 1;
            text-align: left;
            min-width: px2rem(405px);
            position: relative;
            display: -webkit-box;
            -webkit-box-align: center;
            line-height: px2rem(108px);
            height: px2rem(108px);
            // 播放按钮
            .play {
                display: block;
                font-size: px2rem(52px);
                color: $play-color;
            }
            // 歌曲总数
            .total-number {
                display: block;
                position: relative;
                top: px2rem(4px);
                margin-left: px2rem(20px);
                font-size: px2rem(24px);
                color: $total-number-color;
            }
        }
        /*下载*/
        .download {
            display: -webkit-box;
            -webkit-box-align: center;
            margin-right: px2rem(40px);
            min-width: px2rem(120px);
            .icon-xiazai {
                display: block;
                font-size: px2rem(44px);
                color: $play-color;
            }
        }
        /*多选*/
        .multiple-select {
            display: -webkit-box;
            -webkit-box-align: center;
            min-width: px2rem(120px);
            .icon {
                display: block;
                font-size: px2rem(44px);
                color: $play-color;
            }
        }
    }
</style>
