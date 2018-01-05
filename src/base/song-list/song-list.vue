<template>
    <div class="list-wrapper">
        <!--歌曲列表-->
        <v-list class="list-content" v-show="songs">
            <v-list-tile ripple v-for="(item, index) in songs" @click="selectItem(item)" :key="index">
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
</template>

<script type="text/ecmascript-6">
    import Loading from 'base/loading/loading';
    import {mapGetters} from 'vuex';

    export default {
        props: {
            // 歌曲列表
//            songs: {
//                type: Array,
//                default: null
//            },
            // 设置是否能够加载更多
            hasMore: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                select: false
            };
        },
        computed: {
            ...mapGetters('appStore', {
                /*
                 * 歌曲列表
                 * @param {Array}
                 *
                 * */
                songs: 'songList'
            })
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item);
            }
        },
        components: {
            Loading
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
