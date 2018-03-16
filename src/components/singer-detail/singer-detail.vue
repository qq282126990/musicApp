<template>
    <div class="scroll-wrapper">
        <div class="singer-message" v-show="getSongList.length">
            <!--返回按钮-->
            <div class="back" @click="back" ref="back">
                <v-icon class="icon">arrow_back</v-icon>
            </div>
            <!--榜单图片-->
            <div class="bg-image" ref="bgImage">
                <img class="img" :alt="this.getSingerMessage.avatar" v-lazy="this.getSingerMessage.avatar">
                <!--标题-->
                <h1 class="bg-image-title">{{getSingerMessage.name ? getSingerMessage.name : getSingerMessage.singername}}</h1>
                <!--粉丝数-->
                <p class="fans-number">{{computedPlayNumber(getSingerDetail.fans)}}粉丝</p>
            </div>
            <!--背景滤镜效果-->
            <div class="filter" :style="{opacity: filterOpacity}" ref="filter">
                <img :alt="this.getSingerMessage.avatar" :src="this.getSingerMessage.avatar">
            </div>
            <!--滚动-->
            <scroll class="content-scroll-wrapper"
                    @scroll="scroll"
                    @pullingUp="pullingUp"
                    ref="contentScrollWrapper">
                <div>
                    <!--内容-->
                    <div class="singer-content">
                        <song-list-play-all></song-list-play-all>
                        <song-list :totalSongNum="getSingerDetail.total"
                                   @selectSong="selectSong"></song-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="loading-wrapper" v-show="!getSongList.length">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapActions, mapState} from 'vuex';
    // 对歌手歌曲数据做处理 normalizeSingerSongList
    import {normalizeSingerSongList} from 'common/js/songList';
    // 计算播放量 computedPlayNumber
    import {computedPlayNumber} from 'common/js/util';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';
    // 歌曲列表组件
    import SongList from 'base/song-list/song-list';
    // 滚动切换
    import SliderSwitch from 'base/slider-switch/slider-switch';
    // 歌曲列表播放全部模块
    import SongListPlayAll from 'base/songListPlayAll/songListPlayAll';

    export default {
        data () {
            return {
                /*
                 * 切换的头部
                 * @type {Array}
                 * */
                dotsTitle: [{name: `歌曲`}, {name: '详情'}],
                /*
                 * 当前页面的页数
                 * @type {Number}
                 * */
                newPageIndex: 0,
                /*
                 * 获取Y轴滚动数值
                 * */
                scrollY: 0,
                /*
                 * 图片模糊效果透明度
                 * @type {Number}
                 * */
                filterOpacity: 0,
                /*
                 * 歌手歌曲列表数量
                 * @type {Number}
                 * */
                songBegin: 30,
                /*
                 * 歌手粉丝数量
                 * @type {Number}
                 * */
                fansNumber: null,
                /*
                 * 判断当前是否重复点击歌曲列表
                 * @type {String}
                 * */
                oldSong: null,
                /*
                 * loading文字
                 * @type {String}
                 * */
                loadingText: '加载中...'
            }
        },
        mounted () {
            this.$nextTick(() => {
                // 一些初始化操作
                this._initSome();
            });
        },
        computed: {
            ...mapGetters('appStore', {
                /*
                 * 获取歌手ID
                 * @param {Object}
                 * */
                getSingerMessage: 'singerMessage',
                /**
                 * 获取当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong'
            }),
            ...mapState('asyncAjax', {
                /*
                 * 获取歌手歌曲列表
                 * @param {Object}
                 * */
                getSingerDetail: 'singerDetail',
                /*
                 * 获取歌曲列表
                 * @param {Object}
                 * */
                getSongList: 'songList'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome () {
                // 设置scroll组件要不要监听滚动事件
                this.setListenScroll(true);
                // 设置滚动的状态
                this.setProbeType(3);
                // 是否开启滚动到到底部刷新
                this.setPullUpLoad(true);

                // 获取图片高度
                this.bgImageHeight = this.$refs.bgImage.clientHeight;

                // 设置最小移动数 minTransalteY
                this.minTransalteY = -this.bgImageHeight + this.$refs.back.clientHeight;
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
            },
            scroll (pos) {
                this.scrollY = pos.y;
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
            // 上拉加载更多数字专辑方法
            pullingUp () {
                // 如果当前歌曲数量等于歌曲总数就不执行下拉操作
                if (this.getSingerDetail.total === this.getSongList.length) {
                    return;
                }

                // 页数每次+15
                this.songBegin += 15;


                if (this.getSingerMessage.id) {
                    // 获取歌手歌曲列表接口
                    this.setSingerDetail({
                        singerid: this.getSingerMessage.id,
                        num: this.songBegin
                    });
                }
                else {
                    // 获取歌手歌曲列表接口
                    this.setSingerDetail({
                        singerid: this.getSingerMessage.singerid,
                        num: this.songBegin
                    });
                }

            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            pullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.contentScrollWrapper.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.contentScrollWrapper.refresh();
            },
            /**
             * 计算播放量
             * @type {String}  playNumber
             */
            computedPlayNumber (playNumber) {
                // 如果当前播放量是1万才进行计算
                if (playNumber > 1e4) {
                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
                }
                return playNumber;
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                /*
                 * 获取歌手歌曲列表接口
                 * */
                setSingerDetail: 'getSingerDetail',
                /**
                 * 设置歌曲列表
                 * @param {Function} commit
                 */
                setSongList: 'songList'
            }),
            ...mapActions('appStore', {
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 设置scroll组件要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 设置滚动的状态
                 * @type {Number}
                 */
                setProbeType: 'probeType',
                /**
                 * 是否开启滚动到到底部刷新
                 * @type {Boolean}
                 */
                setPullUpLoad: 'pullUpLoad',
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay'
            })
        },
        // 组件激活
        activated () {
            // 设置首页头部导航
            this.setAppHeader({
                show: false
            });

            if (this.getSingerMessage.id) {
                // 获取歌手歌曲列表接口
                this.setSingerDetail({
                    singerid: this.getSingerMessage.id,
                    num: this.songBegin
                });
            }
            else {
                // 获取歌手歌曲列表接口
                this.setSingerDetail({
                    singerid: this.getSingerMessage.singerid,
                    num: this.songBegin
                });
            }
        },
        watch: {
            // 监听歌手信息请求
            getSingerDetail (newSingerDetail) {
                // 滚动组件外部传入的数据
                this.setScrollData(newSingerDetail);
                // 设置歌曲列表
                this.setSongList(normalizeSingerSongList(newSingerDetail.list));

                // 切换的头部
                this.dotsTitle = [{name: `歌曲 ${this.getSingerDetail.total}`}, {name: '详情'}];
            },
            // 监听Y轴滚动
            scrollY (newScrollY) {

                // 设置想上滚模糊层的透明度
                const percent = Math.abs(newScrollY / this.bgImageHeight);

                // 如果滚动距离小于this.minTransalteY就设置为0 大于this.minTransalteY就开始计算
                if (newScrollY < this.minTransalteY) {
                    // 初始化专辑内容的透明度
                    this.filterOpacity = 1;

                    this.$refs.filter.style.zIndex = 40;
                    this.$refs.filter.style.height = `${this.$refs.back.clientHeight}px`;
                    this.$refs.filter.style.top = '-1px';
                }
                else {
                    // 设置专辑内容的透明度
                    this.filterOpacity = Math.min(1, percent);
                }
            },
            // 监听歌曲列表变化
            getSongList () {
                // 页数大于15才执行
                if (this.songBegin > 0) {
                    // 上拉加载更多歌单列表完成后刷新数据方法
                    this.pullingUpRefresh();
                }
            }
        },
        components: {
            Scroll,
            Loading,
            SongList,
            SliderSwitch,
            SongListPlayAll
        }
    }
</script>

<style scoped lang="scss">
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

    .content-scroll-wrapper {
        position: fixed;
        top: px2rem(548px);
        bottom: px2rem(120px);
        left: 0;
        right: 0;
        z-index: 10;
    }

    /*歌手信息*/
    .singer-message {
        overflow: hidden;
        height: 100%;
        /*榜单图片*/
        .bg-image {
            position: relative;
            width: 100%;
            height: px2rem(548px);
            overflow: hidden;
            .img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            }
        }
        /*返回按钮*/
        .back {
            position: absolute;
            top: 0;
            line-height: px2rem(84px);
            height: px2rem(84px);
            z-index: 50;
            .icon {
                display: block;
                padding: 0 0 0 px2rem(20px);
                line-height: px2rem(84px);
                font-size: px2rem(60px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .bg-image-title {
            margin: 0;
            position: absolute;
            bottom: px2rem(120px);
            width: 100%;
            text-align: center;
            font-size: px2rem(50px);
            color: #fff;
        }
        /*粉丝量*/
        .fans-number {
            margin: 0;
            position: absolute;
            bottom: px2rem(70px);
            width: 100%;
            text-align: center;
            font-size: px2rem(28px);
            color: #fff;
        }
        /*过滤层*/
        .filter {
            position: absolute;
            top: 0;
            left: 0;
            height: px2rem(548px);
            width: 100%;
            overflow: hidden;
            object-fit: cover;
            filter: blur(px2rem(2px));
            background: #fff;
            z-index: 0;
            img {
                position: absolute;
                top: 0;
                left: 0;
                height: auto;
                width: 100%;
            }
        }
    }

    /*内容*/
    .singer-content {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-decoration: none;
        background: #fff;
        .text {
            margin: px2rem(30px) px2rem(20px) 0 px2rem(20px);
            margin-bottom: 0;
            font-size: px2rem(28px);
            text-align: left;
            color: #999;
            line-height: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            /* autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: no */
            overflow: hidden;
        }
    }
</style>
