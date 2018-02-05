<template>
    <div class="new-song-wrapper">
        <header-scroll :headerSelect="headerSelect"
                       :newSongList="newSongList.type_info"
                       @selectHeader="selectHeader"
        ></header-scroll>
        <!--显示的内容-->
        <!--loading组件-->
        <div class="loading-one">
            <loading></loading>
            <span class="text">加载中...</span>
        </div>
        <div class="content-wrapper" v-show="getSongList.length > 0">
            <!--歌曲列表-->
            <transition name="slider">
                <scroll class="song-list" v-show="newSongListData[headerSelect]">
                    <div>
                        <div class="list-header">
                            <!--播放全部-->
                            <div class="play-all-wrapper">
                                <v-icon class="play" @click.stop="allPlay">play_circle_outline</v-icon>
                                <h3 class="title">全部播放</h3>
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
                        <song-list @select="selectSong"></song-list>
                    </div>
                </scroll>
            </transition>
            <!--loading组件-->
            <div class="loading-two" v-show="!newSongListData[headerSelect]">
                <loading></loading>
                <span class="text">加载中...</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import {mapState, mapActions, mapGetters} from 'vuex';
    // 对list数据做处理
    import {normalizeNewSongs} from 'common/js/song';
    // 添加类
    //    import {addClass} from 'common/js/dom';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌曲列表
    import SongList from 'base/song-list/song-list';
    // loading组件
    import Loading from 'base/loading/loading';
    // 头部滚动组件
    import HeaderScroll from 'base/header-scroll/header-scroll';

    export default {
        data() {
            return {
                // 歌曲列表数量开始长度
                songlistSin: 0,
                // 歌曲列表数量结束长度
                songlistEin: 29,
                /*
                 * 设置头部导航那个激活了
                 * */
                headerSelect: 0,
                /*
                 * 歌曲总数
                 * */
                totalSongNum: '',
                /*
                 * 歌曲列表数据
                 * */
                newSongListData: []
            };
        },
        computed: {
            ...mapState('asyncAjax', [
                /*
                 * 获取歌单速递数据
                 * @type {Object}
                 * */
                'newSongList'
            ]),
            ...mapGetters('asyncAjax', [
                /*
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Object}
                 * */
                'switchNewSongList'
            ]),
            ...mapGetters('appStore', {
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList'
            })
        },
        created() {
            // 初始化播放列表
            this.setSongList([]);
        },
        mounted() {
            // 设置滑动的宽度
            // 初始化一些操作
            this._initSong();
        },
        methods: {
            // 初始化一些操作
            _initSong() {
                // 设置滚动组件数据
                this.setScrollData(this.newSongList);

                // 设置头部导航那个激活了
                this.headerSelect = this.newSongList.type_info[0].id;

                // 创建新歌列表数据
                this._initNewSongListData(this.newSongList.type_info);

                setTimeout(() => {
                    // 默认请求最新歌曲列表
                    this.getSwitchNewSongList(this.newSongList.type_info[0].id);
                }, 1000);
            },
            // 播放全部按钮
            allPlay() {
                this.setAllPlay({
                    list: this.getSongList
                });
            },
            // 选择歌曲列表
            selectSong(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });
            },
            // 选择头部导航
            selectHeader(item) {
                // 设置头部导航那个激活了
                this.headerSelect = item.id;

                // 判断是否已经请求过歌曲列表了
                if (this.newSongListData[item.id].length > 0) {
                    this.setSongList(this.newSongListData[item.id]);
                    return;
                }

                // 初始化播放列表
                this.setSongList([]);

                setTimeout(() => {
                    // 获取新歌速递模块点击内容标题 对应type的数据
                    this.getSwitchNewSongList(item.id);
                }, 1000);
            },
            // 创建新歌列表数据
            _initNewSongListData (list) {
                let ret = [];

                let items = {};

                list.forEach(() => {
                    ret.push(items);
                });

                this.newSongListData = ret;
            },
            ...mapActions('asyncAjax', {
                /**
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Array}
                 */
                getSwitchNewSongList: 'getSwitchNewSongList'
            }),
            ...mapActions('appStore', {
                /**
                 * 设置滚动组件数据
                 * @type {Array}
                 */
                setScrollData: 'data',
                /**
                 * 设置歌曲列表
                 * @type {Array}
                 */
                setSongList: 'songList',
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay',
                /**
                 * 播放全部歌曲
                 * @type {Array}
                 */
                setAllPlay: 'allPlay'
            })
        },
        // 组件激活时调用
        activated() {
            // 初始化播放列表
            this.setSongList([]);

            if (this.newSongList.type_info) {
                // 延迟1秒执行
                setTimeout(() => {
                    // 默认请求最新歌曲列表
                    this.getSwitchNewSongList(this.newSongList.type_info[0].id);

                    // 设置头部导航那个激活了
                    this.headerSelect = this.newSongList.type_info[0].id;
                }, 1000);
            }
        },
        watch: {
            // 监听歌曲列表的变化
            switchNewSongList(newList) {
                // 保存歌曲列表
                this.newSongListData[newList.type] = normalizeNewSongs(newList.song_list);
                // 设置歌曲列表 前30首
                this.setSongList(normalizeNewSongs(newList.song_list).splice(this.songlistSin, this.songlistEin));
                // 设置歌曲数量
                this.totalSongNum = this.newSongList.size;
            }
        },
        components: {
            SongList,
            Scroll,
            Loading,
            HeaderScroll
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .new-song-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .scroll {
        overflow: hidden;
        white-space: nowrap;
    }

    /*loading组件*/
    /*加载中效果*/
    .loading-one {
        position: fixed;
        padding-top: 50%;
        box-sizing: border-box;
        width: 100%;
        z-index: 10;
        .text {
            box-sizing: border-box;
            font-size: px2rem(30px);
            margin: px2rem(20px) 0 0 px2rem(20px);
        }
    }

    .loading-two {
        position: relative;
        padding-top: 50%;
        box-sizing: border-box;
        width: 100%;
        .text {
            box-sizing: border-box;
            font-size: px2rem(30px);
            margin: px2rem(20px) 0 0 px2rem(20px);
        }
    }

    /* 歌曲列表头部*/
    .list-header {
        position: relative;
        //bottom: px2rem(-108px);
        background: $list-bgcolor;
        box-sizing: border-box;
        z-index: 100;
        display: flex;
        padding: 0 px2rem(32px);
        border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        height: px2rem(108px);
        width: 100%;
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
                margin: 0;
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
    }

    /*显示的内容*/
    .content-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 20;
        .slider-switch-item {
            position: relative;
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
        }
    }

    /*歌曲列表外层*/
    .song-list {
        margin-top: px2rem(174px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
        transition: transform 0.4s cubic-bezier(.55, 0, .1, 1);
        &.slider-enter-active {
            transform: translate(100%, 0);
        }
    }
</style>
