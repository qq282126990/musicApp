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
                            <!--歌曲是否有MV-->
                            <i class="icon-mv" v-show="item.vid" title="MV"></i>
                            <!--歌曲是否有独家-->
                            <i class="icon-isonly" v-show="item.isonly === 1" title="isonly"></i>
                        </h3>
                        <!--歌手名称-->
                        <p class="text">
                            <span>{{item.singer}} · {{item.album}}</span>
                        </p>
                    </div>
                    <!--更多-->
                    <v-icon class="more" :class="setStyle" @click.stop="clickShowMore(item)">more_vert</v-icon>
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
    import {mapState, mapGetters, mapActions} from 'vuex';
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
                /*
                * loading文字
                * @type {String}
                * */
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
                getCurrentSong: 'currentSong',
                /**
                 * 获取显示更多按钮
                 * @type {Object}
                 */
                getShowMore: 'showMore'
            })
        },
        methods: {
            // 选择歌曲播放
            selectSong (item, index) {
                this.$emit('selectSong', item, index);
            },
            // 显示更多
            clickShowMore (item) {
                // 设置是否显示更多按钮
                this.setShowMore({
                    start: true,
                    currentSong: item
                });
            },
            // 获取当前正在播放的歌曲
            _getCurrentSong (item) {
                if (this.getCurrentSong.id === item.id) {
                    return 'bg-color';
                }
                return '';
            },
            ...mapActions('appStore', {
                /**
                 * 设置是否显示更多按钮
                 * @type {Object}
                 */
                setShowMore: 'showMore'
            })
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
                    margin-right: px2rem(16px);
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: normal;
                }
                /*歌曲是否有MV*/
                .icon-mv {
                    display: inline-block;
                    width: 33px;
                    height: 16px;
                    vertical-align: middle;
                    background-image: -webkit-image-set(url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de) 1x, url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite@2x.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de&v=3a0fcc184bba8d368416bde830573668) 2x);
                    background-position: -40px -280px;
                }
                /*歌曲是否是独家*/
                .icon-isonly {
                    display: inline-block;
                    width: 34px;
                    height: 16px;
                    vertical-align: middle;
                    background-position: -80px -280px;
                    background-image: -webkit-image-set(url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de) 1x, url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite@2x.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de&v=3a0fcc184bba8d368416bde830573668) 2x);
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

    /*更多列表*/
    .more-list {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: red;
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
