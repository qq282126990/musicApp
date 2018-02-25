<template>
    <div>
        <!--头部-->
        <div class="recent-play-header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--标题-->
            <div class="header-title">
                <span>最近播放</span>
            </div>
        </div>
        <!--歌曲列表-->
        <song-list-play-all :totalSongNum="getPlayHistory.length"></song-list-play-all>
        <scroll
            class="song-list-wrapper" ref="scroll">
            <song-list
                :totalSongNum="getPlayHistory.length"
                @selectSong="selectSong"
            ></song-list>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {songListMixin} from 'common/js/mixin';
    // 歌曲列表播放全部模块
    import SongListPlayAll from 'base/songListPlayAll/songListPlayAll';
    // 歌曲列表组件
    import SongList from 'base/song-list/song-list';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';

    export default {
        mixins: [songListMixin],
        mounted () {
            // 滚动组件传入的数据
            this.setScrollData(this.getPlayHistory);
            // 设置歌曲列表
            this.setSongList(this.getPlayHistory);
        },
        // 组件激活
        activated() {
            // 设置歌曲列表
            this.setSongList(this.getPlayHistory);
        },
        components: {
            SongListPlayAll,
            SongList,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /*头部*/
    .recent-play-header {
        display: flex;
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
        background: $header-color;
        /*返回按钮*/
        .back {
            position: absolute;
            top: 0;
            z-index: 50;
            .icon-fanhui1-copy {
                display: block;
                padding: px2rem(20px);
                font-size: px2rem(44px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .header-title {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            margin: 0;
            text-align: center;
            line-height: 1.12rem;
            font-size: 0.48rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
            z-index: 40;
        }
    }

    /*歌曲列表外层*/
    .song-list-wrapper {
        margin-top: px2rem(192px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
    }
</style>
