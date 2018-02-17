<template>
    <div class="new-song-wrapper">
        <header-scroll
            :headerSelect="headerSelect"
            :newSongList="initNewSongList.type_info"
            @selectHeader="selectHeader"
        ></header-scroll>
        <!--loading-->
        <div class="loading-wrapper">
            <loading :loadingText="loadingText"></loading>
        </div>
        <div class="content-wrapper" v-show="getSongList.length > 0">
            <!--歌曲列表-->
            <transition name="slider">
                <scroll class="content-scroll" v-show="newSongListData[headerSelect]">
                    <div>
                        <!--歌曲列表头部-->
                        <song-list-play-all :totalSongNum="totalSongNum"></song-list-play-all>
                        <!--歌曲列表-->
                        <song-list
                            :totalSongNum="totalSongNum"
                            @selectSong="selectSong"
                        ></song-list>
                    </div>
                </scroll>
            </transition>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import {mapState, mapActions, mapGetters} from 'vuex';
    // 对list数据做处理
    import {normalizeSongList} from 'common/js/songList';
    // 获取一开始的新歌数据
    import {getInitNewSongList} from 'common/js/cache';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌曲列表播放全部模块
    import SongListPlayAll from 'base/songListPlayAll/songListPlayAll';
    // 歌曲列表
    import SongList from 'base/song-list/song-list';
    // loading组件
    import Loading from 'base/loading/loading';
    // 头部滚动组件
    import HeaderScroll from 'base/header-scroll/header-scroll';

    export default {
        data() {
            return {
                /*
                 * 获取一开始的新歌数据
                 * @type {Object}
                 * */
                initNewSongList: {},
                /*
                 * 歌曲列表数量开始长度
                 * @type {Number}
                 * */
                songlistSin: 0,
                /*
                 * 歌曲列表数量结束长度
                 * @type {Number}
                 * */
                songlistEin: 30,
                /*
                 * 设置头部导航那个激活了
                 * */
                headerSelect: 0,
                /*
                 * 新歌歌曲列表数据
                 * */
                newSongListData: [],
                /*
                 * 歌曲总数
                 * @type {Boolean}
                 * */
                totalSongNum: 0,
                /*
                 * loading显示的文字
                 * @type {String}
                 * */
                loadingText: '加载中...',
                /*
                 * 判断当前是否重复点击歌曲列表
                 * @type {String}
                 * */
                oldSong: null
            };
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList',
                /*
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Object}
                 * */
                getSwitchNewSongList: 'switchNewSongList'
            }),
            ...mapGetters('asyncAjax', {
                /*
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Object}
                 * */
                switchNewSongList: 'switchNewSongList',
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList'
            }),
            ...mapGetters('appStore', {
                /**
                 * 获取当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong',
            })
        },
        created() {
            // 初始化播放列表
            this.setSongList([]);
        },
        mounted() {
            // 初始化一些操作
            this._initSong();
        },
        methods: {
            // 初始化一些操作
            _initSong() {
                // 初始化播放列表
                this.setSongList([]);

                // 获取一开始的新歌数据
                this.initNewSongList = getInitNewSongList();

                // 设置头部导航那个激活了
                this.headerSelect = this.initNewSongList.type_info[0].id;

                // 创建新歌列表数据
                this._initNewSongListData(this.initNewSongList.type_info);

                setTimeout(() => {
                    // 请求新歌速递模块点击内容标题对应type的数据
                    this.setSwitchNewSongList(this.initNewSongList.type_info[0].id);
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
            // 选择头部导航
            selectHeader(item) {
                // 设置头部导航那个激活了
                this.headerSelect = item.id;

                // 判断是否已经请求过歌曲列表了
                if (this.newSongListData[this.headerSelect].length > 0) {
                    this.setSongList(this.newSongListData[this.headerSelect]);
                    return;
                }

                // 初始化播放列表
                this.setSongList([]);

                setTimeout(() => {
                    // 获取新歌速递模块点击内容标题 对应type的数据
                    this.setSwitchNewSongList(item.id);
                }, 1000);
            },
            // 选择歌曲列表
            selectSong(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });

                // 如果不是重复点击就初始化oldSong
                if (this.oldSong !== item.id) {
                    this.oldSong = null;
                }

                // 如果oldSong为空才执行
                if (!this.oldSong) {
                    this.oldSong = item.id;

                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }
            },
            ...mapActions('asyncAjax', {
                /**
                 * 请求新歌速递模块点击内容标题对应type的数据
                 * @type {Array}
                 */
                setSwitchNewSongList: 'getSwitchNewSongList',
                /**
                 * 设置歌曲列表
                 * @param {Function} commit
                 */
                setSongList: 'songList'
            }),
            ...mapActions('appStore', {
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay'
            })
        },
        // 组件激活时调用
        activated() {
            // 初始化一些操作
            this._initSong();

            if (this.initNewSongList.type_info) {
                // 延迟1秒执行
                setTimeout(() => {
                    // 默认请求最新歌曲列表
                    this.setSwitchNewSongList(this.initNewSongList.type_info[0].id);

                    // 设置头部导航那个激活了
                    this.headerSelect = this.initNewSongList.type_info[0].id;
                }, 1000);
            }
        },
        watch: {
            // 监听歌曲列表的变化
            switchNewSongList(switchNewSongList) {
                // 保存歌曲列表
                this.newSongListData[switchNewSongList.type] = normalizeSongList(switchNewSongList.song_list).splice(this.songlistSin, this.songlistEin);
                // 设置歌曲总数
                this.totalSongNum = 30;
                // 设置歌曲列表 前30首
                this.setSongList(normalizeSongList(switchNewSongList.song_list).splice(this.songlistSin, this.songlistEin));
                // 设置滚动组件传入的数据
                this.setScrollData(switchNewSongList);
            }
        },
        components: {
            HeaderScroll,
            SongListPlayAll,
            SongList,
            Scroll,
            Loading
        }
    };
</script>

<style scoped lang="scss">
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

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
        .slider-switch-item {
            position: relative;
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
        }
    }

    /*歌曲列表外层*/
    .content-scroll {
        margin-top: px2rem(174px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
        transition: transform 0.4s cubic-bezier(.55, 0, .1, 1);
        z-index: 20;
        &.slider-enter-active {
            transform: translate(100%, 0);
        }
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }
</style>
