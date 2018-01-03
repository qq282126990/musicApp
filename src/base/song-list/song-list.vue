<template>
    <scroll :data="songs"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :bounce="bounce"
            :pullup="pullup"
            ref="SongList">
        <div class="list-wrapper">
            <div class="list-header">
                <!--播放全部-->
                <div class="play-all-wrapper">
                    <v-icon class="play">play_circle_outline</v-icon>
                    <h3 class="title">全部播放</h3>
                    <span class="total-number">共{{totalSongNum}}首</span>
                </div>
                <!--下载-->
                <div class="download">
                    <i class="iconfont icon-xiazai"></i>
                    <span class="title">下载</span>
                </div>
                <!--多选-->
                <div class="multiple-select">
                    <i class="iconfont icon-pingtaitubiao_duoxuan icon"></i>
                    <span class="title">多选</span>
                </div>
            </div>
            <!--歌曲列表-->
            <v-list class="list-content" v-show="songs">
                <v-list-tile ripple v-for="item in songs" @click="" :key="item.mid">
                    <!--选中列表实出现-->
                    <div class="selected">
                        <div class="bg-color" v-show="select"></div>
                    </div>
                    <!--内容-->
                    <div class="content-wrapper">
                        <div class="content">
                            <h3 class="title">
                                <span>{{item.name}}</span>
                            </h3>
                            <p class="text">
                                <span>{{item.singer}} · {{item.album}}</span>
                            </p>
                        </div>
                        <!--更多-->
                        <v-icon class="more">more_vert</v-icon>
                    </div>
                </v-list-tile>
                <!--下拉加载时显示的Loading效果-->
                <div class="has-more" v-show="hasMore && songs.length">
                    <loading></loading>
                </div>

                <!--没有更多了-->
                <div class="none-more" v-show="!hasMore && songs.length">
                    <v-icon class="icon">sentiment_dissatisfied</v-icon>
                    <span class="title">没有更多了</span>
                </div>
            </v-list>
            <!--加载中显示的效果-->
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import Loading from 'base/loading/loading';
    import Scroll from 'base/scroll/scroll';

    export default {
        props: {
            // 歌曲列表
            songs: {
                type: Array,
                default: null
            },
            // 歌曲列表总数
            totalSongNum: {
                type: Number,
                default: 0
            },
            // 设置是否能够加载更多
            hasMore: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                select: false,
                // 是否设置头部背景效果
                headerBg: false,
                // 开启回弹效果
                bounce: true,
                // 开启标题滚动
                carouselStart: false,
                // scroll 组件 开启滚动监听
                listenScroll: true,
                // 开启滚动底部刷新
                pullup: true,
                // 获取滚动Y轴坐标
                scrollY: 0,
                // scroll 组件 状态设置为3
                probeType: 3,
                // 歌曲列表显示页数 默认15 一次 *2
                songBegin: 0,
                // 获取图片背景的高度
                imageHeight: null
            };
        },
        mounted: {
            // 刷新滚动列表
            refresh() {
                this.$refs.SongList.refresh();
            }
        },
        components: {
            Loading,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*歌曲列表外层*/
    .list-wrapper {
        position: relative;
        padding: 0;
        min-height: 100%;
        background: $list-bgcolor;
        z-index: 100;
    }

    /* 列表头部*/
    .list-header {
        display: flex;
        padding: 0 px2rem(32px);
        border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        height: px2rem(108px);
    }

    /*播放全部*/
    .play-all-wrapper {
        flex: 1;
        position: relative;
        display: -webkit-box;
        -webkit-box-align: center;
        line-height: px2rem(108px);
        height: px2rem(108px);
        // 播放按钮
        .play {
            display: block;
            margin-right: px2rem(30px);
            font-size: px2rem(52px);
            color: $play-color;
        }
        .title {
            display: block;
            font-size: px2rem(28px);
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
        .icon-xiazai {
            display: block;
            font-size: px2rem(44px);
            color: $play-color;
        }
        .title {
            margin-left: px2rem(10px);
            display: block;
            font-size: px2rem(28px);
        }
    }

    /*多选*/
    .multiple-select {
        display: -webkit-box;
        -webkit-box-align: center;
        .icon {
            display: block;
            font-size: px2rem(44px);
            color: $play-color;
        }
        .title {
            margin-left: px2rem(10px);
            display: block;
            font-size: px2rem(28px);
        }
    }

    /*列表内容*/
    .list-content {
        padding: 0;
        min-height: 100%;
        overflow: hidden;
        li {
            display: flex;
            height: px2rem(124px);
        }
        /*选中*/
        .selected {
            flex: 0 0 px2rem(32px);
            padding: px2rem(20px) 0;
            box-sizing: border-box;
            width: px2rem(32px);
            height: px2rem(124px);
            .bg-color {
                display: -webkit-box;
                width: px2rem(10px);
                height: 100%;
                background: #30c17b;
            }
        }
        /*外层*/
        .content-wrapper {
            flex: 1;
            display: flex;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            height: px2rem(124px);
            border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        }
        .content-wrapper:last-child {
            border-bottom: none;
        }
        /*内容*/
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: px2rem(20px) 0;
            box-sizing: border-box;
            text-align: left;
            overflow: hidden;
            height: px2rem(124px);
            color: $content-text-color;
            /*标题*/
            .title {
                display: -webkit-box;
                -webkit-box-align: center;
                flex: 1;
                font-size: px2rem(32px);
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: $content-title-color;
                font-weight: 300;
                span {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: normal;
                }
            }
            /*文本*/
            .text {
                display: -webkit-box;
                -webkit-box-align: center;
                flex: 1;
                font-size: px2rem(24px);
                span {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: normal;
                }
            }
        }
        /*更多 icon*/
        .more {
            padding-right: px2rem(32px);
            font-size: px2rem(42px);
            color: $more-color;
        }
    }

    /*loading*/
    .loading-container {
        position: absolute;
        width: 100%;
        top: px2rem(208px);
        transform: translateY(-50%)
    }

    /*下拉加载时显示的Loading效果*/
    .has-more {
        padding: px2rem(60px) 0;
        width: 100%;
    }

    /*没有更多了*/
    .none-more {
        position: absolute;
        bottom: px2rem(-198px);
        width: 100%;
        line-height: px2rem(200px);
        height: px2rem(200px);
        color: #b6b6b6;
        background: $none-more;
        .title {
            font-size: px2rem(32px);
            vertical-align: middle;
        }
        .icon {
            font-size: px2rem(52px);
            color: #b6b6b6;
        }
    }
</style>
