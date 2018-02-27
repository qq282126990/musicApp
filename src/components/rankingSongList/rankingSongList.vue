<template>
    <div>
        <scroll class="scroll-wrapper" ref="scroll" v-if="rankingSongList.length">
            <div class="ranking-song-list">
                <!--榜单图片-->
                <div class="bg-image" :style="bgImage" ref="bgImage">
                    <!--返回按钮-->
                    <div class="back" @click="back">
                        <v-icon class="icon">arrow_back</v-icon>
                    </div>
                    <!--标题-->
                    <h1 class="bg-image-title">
                        {{rankingTile}}{{rankingDate ? ` 第${rankingDate}天` : ''}}
                    </h1>
                    <!--时间-->
                    <p class="bg-image-time">{{`${rankingUpdate}更新`}}</p>
                </div>
                <!--内容-->
                <div class="ranking-content">
                    <slider-switch :dotsTitle="dotsTitle"
                                   @pageIndex="pageIndex"
                    >
                        <div v-for="(item, index) in dotsTitle" :key="index">
                            <!--歌曲列表-->
                            <div class="content" v-if="index === 0">
                                <song-list-play-all></song-list-play-all>
                                <song-list :totalSongNum="rankingSongList.length"
                                           @selectSong="selectSong"
                                ></song-list>
                            </div>
                            <!--详情-->
                            <div class="content" v-if="index === 1">
                                <p v-html="info" class="text"></p>
                            </div>
                        </div>
                    </slider-switch>
                </div>
            </div>
        </scroll>
        <!--loading-->
        <div class="loading-wrapper" v-if="!rankingSongList.length">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState, mapGetters} from 'vuex';
    // 对歌曲列表数据做处理
    import {normalizeRankSongList} from 'common/js/songList';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';
    // 滚动切换
    import SliderSwitch from 'base/slider-switch/slider-switch';
    // 歌曲列表播放全部模块
    import SongListPlayAll from 'base/songListPlayAll/songListPlayAll';
    // 歌曲列表组件
    import SongList from 'base/song-list/song-list';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        data () {
            return {
                /*
                 * 榜单标题
                 * @type {String}
                 * */
                rankingTile: null,
                /*
                 * 榜单时间
                 * @type {String}
                 * */
                rankingDate: null,
                /*
                 * 榜单更新时间
                 * @type {String}
                 * */
                rankingUpdate: null,
                /*
                 * 判断当前是否重复点击歌曲列表
                 * @type {String}
                 * */
                oldSong: null,
                /*
                * 详情信息
                * @type {String}
                * */
                info: null,
                /*
                 * 榜单歌曲列表
                 * @type {Array}
                 * */
                rankingSongList: [],
                /*
                 * 切换的头部
                 * @type {Array}
                 * */
                dotsTitle: [{name: '歌曲'}, {name: '详情'}],
                /*
                 * 当前页面的页数
                 * @type {Number}
                 * */
                newPageIndex: 0,
                /*
                * loading显示的文字
                * @type {String}
                * */
                loadingText: '加载中...'
            }
        },
        computed: {
            bgImage () {
                if (this.rankingSongList.length) {
                    return `background-image:url(${this.rankingSongList[0].image})`
                }
                return ''
            },
            ...mapState('asyncAjax', {
                /*
                 * 排行榜歌单
                 * @type {Array}
                 * */
                getRankingSongList: 'rankingSongList',
                /*
               * 获取歌曲列表
               * @param {Object}
               * */
                getSongList: 'songList'
            }),
            ...mapState('appStore', {
                /*
                 * 排行榜歌单
                 * @type {Array}
                 * */
                setRankingId: 'rankingId'
            }),
            ...mapGetters('appStore', {
                /**
                 * 获取当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome () {
                // 如果没有id就返回上一页
                if (!this.setRankingId.id) {
                    this.$router.back();
                }
                // 榜单标题
                this.rankingTile = null;
                // 榜单时间
                this.rankingDate = null;
                // 榜单更新时间
                this.rankingUpdate = null;
                // 榜单歌曲列表
                this.rankingSongList = [];
            },
            // 返回按钮
            back () {
                this.$router.back();
            },
            /*
           * 监听左右滑动的页数
           * @param {Number}
           * */
            pageIndex (index) {
                // 获取当前显示的页数
                this.newPageIndex = index;

                this.$refs.scroll.refresh();
            },
            // 选择歌曲列表
            selectSong (item, index) {
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

                    // 设置播放器播放
                    document.getElementsByTagName('audio')[0].play();

                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }
            },
            ...mapActions('asyncAjax', {
                /*
                 * 获取排行榜歌曲数据接口
                 * */
                setRankingSongList: 'getRankingSongList',
                /**
                 * 设置歌曲列表
                 * @param {Function} commit
                 */
                setSongList: 'songList'
            }),
            ...mapActions('appStore', {
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay',
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData'
            })
        },
        // 组件激活
        activated () {
            // 一些初始化操作
            this._initSome();
            // 获取排行榜歌曲数据接口
            this.setRankingSongList(this.setRankingId.id);
        },
        watch: {
            // 监听榜单歌曲列表数据变化
            getRankingSongList (newSongList) {
                // 榜单标题
                this.rankingTile = newSongList.topinfo.ListName;
                // 榜单时间
                this.rankingDate = newSongList.day_of_year;
                // 榜单更新时间
                this.rankingUpdate = newSongList.update_time;
                // 榜单歌曲列表
                this.rankingSongList = normalizeRankSongList(newSongList.songlist);
                // 详情信息
                this.info = newSongList.topinfo.info;
                // 设置歌曲列表
                this.setSongList(this.rankingSongList);
                // 滚动组件外部传入的数据
                this.setScrollData(newSongList);
            }

        },
        components: {
            SliderSwitch,
            SongListPlayAll,
            SongList,
            Scroll,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

    .scroll-wrapper {
        height: 100%;
        overflow: hidden;
    }

    .ranking-song-list {
        /*返回按钮*/
        .back {
            position: absolute;
            top: px2rem(20px);
            z-index: 50;
            .icon {
                display: block;
                padding: 0 px2rem(20px) px2rem(20px) px2rem(20px);
                font-size: px2rem(60px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .bg-image-title {
            margin: 0;
            position: absolute;
            bottom: px2rem(70px);
            width: 100%;
            text-align: center;
            font-size: px2rem(36px);
            font-weight: 100;
            color: #fff;
        }
        /*时间*/
        .bg-image-time {
            margin: 0;
            position: absolute;
            bottom: px2rem(20px);
            width: 100%;
            text-align: center;
            font-size: px2rem(24px);
            font-weight: 100;
            color: #fff;
        }
    }

    /*榜单图片*/
    .bg-image {
        position: relative;
        width: 100%;
        height: px2rem(548px);
        background-size: cover;
    }

    /*内容*/
    .ranking-content {
        .content {
            display: block;
            width: 100%;
            height: 100%;
            overflow: hidden;
            text-decoration: none;
            .text {
                padding: 0 px2rem(30px) px2rem(400px) px2rem(30px);
                margin-bottom: 0;
                font-size: px2rem(28px);
                text-align: left;
                color: #999;
                line-height: 20px;
            }
        }
    }
</style>
