<template>
    <div class="scroll-wrapper">
        <div class="singer-message">
            <!--榜单图片-->
            <div class="bg-image" :style="bgImage" ref="bgImage">
                <!--返回按钮-->
                <div class="back" @click="back">
                    <v-icon class="icon">arrow_back</v-icon>
                </div>
                <!--标题-->
                <h1 class="bg-image-title">{{getSingerMessage.name}}</h1>
                <!--粉丝数-->
                <p class="fans-number">{{computedPlayNumber(getSingerDetail.fans)}}粉丝</p>
            </div>
            <scroll class="content-scroll-wrapper" @scroll="scroll" ref="contentScrollWrapper">
                <div>
                    <!--内容-->
                    <slider-switch :dotsTitle="dotsTitle"
                                   @pageIndex="pageIndex"
                    >
                        <div v-for="(item, index) in dotsTitle" :key="index" v-if="dotsTitle.length">
                            <!--歌曲列表-->
                            <div class="singer-content" v-if="index === 0">
                                <song-list-play-all></song-list-play-all>
                                <song-list :totalSongNum="getSingerDetail.total"></song-list>
                            </div>
                            <!--详情-->
                            <div class="singer-content" v-if="index === 1">
                                <p v-html="getSingerDetail.SingerDesc" class="text"></p>
                            </div>
                        </div>
                    </slider-switch>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapActions, mapState} from 'vuex';
    // 对歌手歌曲数据做处理 normalizeSingerSongList
    import {normalizeSingerSongList} from 'common/js/songList';
    // 计算播放量 computedPlayNumber
    import {computedPlayNumber} from 'common/js/util';
    // 样式兼容方法
    import {prefixStyle} from 'common/js/dom';
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

    // transform 兼容
    const transform = prefixStyle('transform');

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
                 * 歌手粉丝数量
                 * @type {Number}
                 * */
                fansNumber: null,
                /*
                 * 获取Y轴滚动数值
                 * */
                scrollY: 0
            }
        },
        mounted () {
            // 如果没有数据就返回上一级
            if (!this.getSingerMessage.id) {
                this.$router.back();
            }

            // 获取歌手歌曲列表接口
            this.setSingerDetail(this.getSingerMessage.id);

            this.$nextTick(() => {
                // 一些初始化操作
                this._initSome();
            });
        },
        computed: {
            bgImage () {
                if (this.getSingerMessage.id) {
                    return `background-image:url(${this.getSingerMessage.avatar})`
                }
                return ''
            },
            ...mapGetters('appStore', {
                getSingerMessage: 'singerMessage'
            }),
            ...mapState('asyncAjax', {
                getSingerDetail: 'singerDetail'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome() {
                // 设置scroll组件要不要监听滚动事件
                this.setListenScroll(true);
                // 设置滚动的状态
                this.setProbeType(3);

                // 获取图片高度
                this.bgImageHeight = this.$refs.bgImage.clientHeight;
                // 设置歌曲列表的位置
                this.$refs.contentScrollWrapper.$el.style.transform = `translate3d(0,${this.bgImageHeight}px,0)`;
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
            scroll(pos) {
                this.scrollY = pos.y;
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
            })
        },
        watch: {
            // 监听歌手信息请求
            getSingerDetail(newSingerDetail) {
                console.log(normalizeSingerSongList(newSingerDetail.list));
                // 滚动组件外部传入的数据
                this.setScrollData(newSingerDetail);
                // 设置歌曲列表
                this.setSongList(normalizeSingerSongList(newSingerDetail.list));

                // 切换的头部
                this.dotsTitle = [{name: `歌曲 ${this.getSingerDetail.total}`}, {name: '详情'}];
            },
            // 监听Y轴滚动
            scrollY(newScrollY) {
                console.log(newScrollY);
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
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .singer-message {
        /*榜单图片*/
        .bg-image {
            position: relative;
            width: 100%;
            height: px2rem(548px);
            background-size: cover;
            background-position: center;
        }
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
    }

    /*内容*/
    .singer-content {
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
</style>
