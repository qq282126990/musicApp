<template>
    <div class="song-list">
        <!--歌曲列表-->
        <ul class="list-content">
            <li class="content-li" v-for="(item, index) in getSongList" @click="selectSong(item, index)" :key="index">
                <!--选中列表实出现-->
                <div class="selected">
                    <div :class="_getCurrentSong(item)"></div>
                </div>
                <div class="content-wrapper">
                    <div class="content" :class="setStyle">
                        <!--歌曲名称-->
                        <h3 class="content-title" :class="setStyle">
                            <span>{{item.name}}</span>
                        </h3>
                        <!--歌手名称-->
                        <p class="text">
                            <span>{{item.singer}} · {{item.album}}</span>
                        </p>
                    </div>
                    <!--更多-->
                    <v-icon class="more" :class="setStyle">more_vert</v-icon>
                </div>
            </li>
            <!--下拉加载时显示的Loading效果-->
            <div class="has-more"
                 v-show="totalSongNum && getSongList.length > 0 && totalSongNum !== getSongList.length">
                <loading :loadingText="loadingText"></loading>
            </div>
            <!--没有更多了-->
            <div class="none-more"
                 v-show="getSongList.length > 0 && totalSongNum && totalSongNum === getSongList.length">
                <v-icon class="icon">sentiment_dissatisfied</v-icon>
                <span class="more-title">没有更多了</span>
            </div>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapGetters} from 'vuex';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        props: {
            /*
             * 歌曲总数
             * @type {Number}
             * */
            totalSongNum: {
                type: Number,
                default: null
            },
            // 设置样式
            setStyle: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                loadingText: '加载中...'
            }
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取主页选择对应歌单的数据
                 * @type {Object}
                 * */
                getSongAlbumMessage: 'songAlbumMessage',
                /*
                 * 获取歌曲列表
                 * @param {Object}
                 * */
                getSongList: 'songList'
            }),
            ...mapGetters('appStore', {
                /**
                 * 当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong'
            })
        },
        methods: {
            selectSong(item, index) {
                this.$emit('selectSong', item, index);
            },
            // 获取当前正在播放的歌曲
            _getCurrentSong(item) {
                if (this.getCurrentSong.id === item.id) {
                    return 'bg-color';
                }
                return '';
            }
        },
        components: {
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*歌曲列表外层*/
    .song-list {
        padding: 0;
        min-height: 100%;
        background: $list-bgcolor;
        z-index: 100;
    }

    /*列表内容*/
    .list-content {
        padding: 0;
        min-height: 100%;
        overflow: hidden;
        .content-li {
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
            .content-title {
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
                margin: 0;
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
        .more-title {
            font-size: px2rem(32px);
            vertical-align: middle;
        }
        .icon {
            font-size: px2rem(52px);
            color: #b6b6b6;
        }
    }

    /*白色字体*/
    .colorWhite {
        color: #fff !important;
    }
</style>
