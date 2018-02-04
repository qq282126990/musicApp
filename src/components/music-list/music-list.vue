<template>
    <div class="music-list-wrapper">
        <div class="header" ref="header">
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <div class="title">
                <transition name="fade">
                    <span v-if="!carouselStart">{{homeSonglist.rcmdtemplate}}</span>
                </transition>
                <!--滚动的标题-->
                <transition name="fade">
                    <span :class="{carousel: carouselStart}"
                          v-if="carouselStart"
                          ref="carousel"
                    >{{homeSonglist.title}}</span>
                </transition>
            </div>
        </div>
        <div class="music-list">
            <!--背景图-->
            <div :class="headerBg ? 'background-header-bgcolor' : 'background'" ref="background">
                <img width="100%" height="100%" v-lazy="homeSonglist.cover">
            </div>
            <!--背景滤镜效果-->
            <div :class="headerBg ? 'filter-header-bgcolor' : 'filter'"></div>
            <!--专辑-->
            <div class="album-wrapper" ref="bgImage"
                 :style="{transform: bgImageY, overflow: overflow, paddingTop: paddingTop}">
                <!--专辑信息-->
                <div class="album" :style="{opacity: transparent}">
                    <!--专辑头像-->
                    <div class="cover">
                        <img v-lazy="homeSonglist.cover"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <div class="play-number">
                                <i class="iconfont icon-erji"></i>
                                <span class="number">{{getSongListMessage.playNumber}}</span>
                            </div>
                        </div>
                    </div>
                    <!--专辑信息-->
                    <div class="message">
                        <!--专辑名称-->
                        <h1 class="album-name" :class="{error: !homeSonglist.title}">
                            {{homeSonglist.title}}</h1>
                        <!--作者头像-->
                        <div class="author">
                            <!--作者小头像-->
                            <img class="small-avatar" :src="getSongListMessage.smallAvatar"/>
                            <!--作者大头像-->
                            <img class="author-avatar"
                                 v-lazy="getSongListMessage.authorAvatar"/>
                            <!--作者名字-->
                            <div class="author-name" :class="{error: !getSongListMessage.nickname}">
                                <span>{{getSongListMessage.nickname}}</span>
                            </div>
                        </div>
                        <div class="desc" :class="{error: !getSongListMessage.desc}">
                            <p v-html="getSongListMessage.desc"></p>
                        </div>
                    </div>
                </div>
                <!--选项 信息-->
                <div class="itemMessage" :style="{opacity: transparent}">
                    <ul>
                        <li class="like">
                            <v-icon>favorite_border</v-icon>
                            <span>{{collection}}</span>
                        </li>
                        <li class="comment">
                            <v-icon>chat</v-icon>
                            <span>0</span>
                        </li>
                        <li class="share">
                            <v-icon>open_in_new</v-icon>
                            <span>分享</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!--歌曲列表播放全部模块-->
            <div class="list-header" ref="ListHeader" :style="{transform: headerY}">
                <!--播放全部-->
                <div class="play-all-wrapper">
                    <v-icon class="play" @click.stop="allPlay">play_circle_outline</v-icon>
                    <h3 class="title">全部播放</h3>
                    <span class="total-number">共{{getSongListMessage.totalSongNum}}首</span>
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
            <div class="bg-layer" ref="layer" :style="{transform: bgImageY}"></div>
            <!--歌曲列表-->
            <scroll
                @scroll="scroll"
                class="song-list"
                ref="SongListScroll">
                <song-list
                    :hasMore="hasMore"
                    @select="select"
                    ref="SongListWrapper"
                ></song-list>
            </scroll>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import Scroll from 'base/scroll/scroll';
    import SongList from 'base/song-list/song-list';

    export default {
        props: {
            // 专辑收藏数量
            collection: {
                type: Number,
                default: 0
            },
            // 设置是否能够加载更多
            hasMore: {
                type: Boolean,
                default: false
            }
            // 获取请求是否完成了
//            ajax_ok: {
//                type: Boolean,
//                default: false
//            }
        },
        data() {
            return {
                // 判断是否已经滚动了
                isScroll: false,
                // 是否设置头部背景效果
                headerBg: false,
                // 开启标题滚动
                carouselStart: false,
                // ---------设置滚动组件的状态------- //
                // 开启回弹效果
                bounce: true,
                // scroll 组件 开启滚动监听
                listenScroll: true,
                // 开启滚动底部刷新
                pullup: true,
                // scroll 组件 状态设置为3
                probeType: 3,
                // -------------------------------- //
                // 获取滚动的时候Y轴坐标
                scrollY: 0,
                // 歌曲列表显示页数 默认15 一次 *2 需要存入vuex songBegin
                // songBegin: 0,
                // 获取图片背景的高度
                imageHeight: null,
                // 专辑内容的透明度
                transparent: 1,
                // 滚动时设置专辑内容移动的距离
                translateY: 0,
                // 滚动时设置专辑内容超出内容隐藏
                overflow: '',
                // 滚动时设置专辑内容padding-top
                paddingTop: ''
            };
        },
        mounted() {
            // 获取图片背景的高度
            this.imageHeight = this.$refs.background.clientHeight;

            // 设置歌曲列表的位置
            this.$refs.SongListScroll.$el.style.top = `${this.imageHeight}px`;

            // 获取头部高度
            this.header = this.$refs.header.clientHeight;

            // 设置最小移动数 minTransalteY
            this.minTransalteY = -this.imageHeight + this.header;

            // 自适应大小
            window.addEventListener('resize', () => {
                if (!this.getSongList) {
                    return;
                }

                // 初始化时清除定时器
                clearTimeout(this.resizeTimer);

                // 改变窗口时大小执行
                this.resizeTimer = setTimeout(() => {
                    // 获取图片背景的高度
                    this.imageHeight = this.$refs.background.clientHeight;
                    // 设置歌曲列表的位置
                    this.$refs.SongListScroll.$el.style.top = `${this.imageHeight}px`;
                }, 60);
            });
        },
        computed: {
            // 专辑内容移动的位置
            bgImageY() {
                return `translate3d(0,${this.translateY}px,0)`;
            },
            // 播放全部模块移动的位置
            headerY() {
                // 判断是否已经滚动了菜开始
                if (this.scrollY < this.minTransalteY && this.isScroll) {
                    return `translate3d(0,${this.header}px,0)`;
                }
                else {
                    let translateY = Math.max(this.minTransalteY, this.translateY);
                    return `translate3d(0,${translateY}px,0)`;
                }
            },
            ...mapGetters('appStore', {
                /*
                 * 歌曲列表信息
                 * @param {Object}
                 * */
                getSongListMessage: 'songListMessage',
                /*
                 * 歌曲列表
                 * @param {Array}
                 * */
                getSongList: 'songList',
                /*
                 * 选择的的歌曲列表数据
                 * @param {Object}
                 * */
                homeSonglist: 'homeSonglist'
            })
        },
        methods: {
            // 返回按钮
            back() {
                this.$router.back();
            },
            // 监听滚动
            scroll(pos) {
                this.scrollY = pos.y;
            },
            // 播放全部按钮
            allPlay () {
                this.setAllPlay({
                    list: this.getSongList
                });
            },
            // 刷新滚动列表
            refresh() {
                this.$refs.SongListScroll.refresh();
            },
            // 禁用 better-scroll
            disable() {
                this.$refs.SongListScroll.disable();
            },
            // 开启 better-scroll
            enable() {
                this.$refs.SongListScroll.enable();
            },
            // 选择歌曲列表
            select(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });
            },
            // 初始化操作
            _initDom() {
                // 把滚动位置重置为顶部
                this.$refs.SongListScroll.scrollTo(0, 0);

                // 初始化专辑区块的style
                this.translateY = 0;
                this.overflow = 'visible';
                this.paddingTop = '70%';
                this.transparent = 1;

                // 组件激活时调用
                this.carouselStart = false;
                // 初始化头部背景状态
                this.headerBg = false;
                // 判断是否已经滚动了
                this.isScroll = false;

                // 重置上拉加载的页数
                // this.songBegin = 0;

                // 设置滚动组件状态
                this.setData(this.data);
                this.setListenScroll(this.listenScroll);
                this.setProbeType(this.probeType);
                this.setBounce(this.bounce);
                this.setPullup(this.pullup);

                // 刷新滚动
                this.refresh();
            },
            ...mapActions('appStore', {
                /**
                 * 歌曲列表接口一次请求的页数 一次 +15
                 * @type {Number}
                 */
                // setSongBegin: 'songBegin',
                /**
                 * 外部传入的数据
                 * @type {Array}
                 */
                setData: 'data',
                /**
                 * scroll 要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 滚动的状态
                 * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
                 * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
                 * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
                 * @type {Number}
                 */
                setProbeType: 'probeType',
                /**
                 * 是否开启回弹效果
                 * @type {Boolean}
                 */
                setBounce: 'bounce',
                /**
                 * 是否开启滚动到到底部刷新
                 * @type {Boolean}
                 */
                setPullup: 'pullup',
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
        activated() {
            // 初始化操作
            this._initDom();
        },
        watch: {
            // 监听歌曲列表Y轴滚动
            scrollY(newScrollY) {
                // 判断是否已经滚动了
                this.isScroll = true;

                // 设置想上滚专辑信息区块的透明度
                const percent = Math.abs(newScrollY / this.imageHeight);

                // 如果滚动距离小于this.minTransalteY就设置为0 大于this.minTransalteY就开始计算
                if (newScrollY < this.minTransalteY) {

                    // 设置专辑区块的style
                    this.translateY = 0;
                    this.overflow = 'hidden';
                    this.paddingTop = '0';

                    // 初始化专辑内容的透明度
                    this.transparent = 1;

                    // 显示头部背景状态
                    this.headerBg = true;

                    // 头部字体滚动
                    this.carouselStart = true;
                }
                else {
                    // 设置专辑区块的style
                    this.translateY = newScrollY;
                    this.overflow = 'visible';
                    this.paddingTop = '70%';

                    // 设置专辑内容的透明度
                    this.transparent = Math.min(1, 1 - percent);

                    // 取消头部背景状态
                    this.headerBg = false;

                    // 头部字体滚动
                    this.carouselStart = false;
                }
            }
        },
        components: {
            SongList,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    // 头部文字渐变显示效果
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
        position: absolute !important;
        left: 0;
        right: 0;
    }

    // 没有数据是显示的样式+
    .error {
        background: $error;
    }

    .texterror {
        display: inline-block;
        width: 50px;
        height: px2rem(20px);
        background: $error;
    }

    /*外层*/
    .music-list-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 110;
        background: $music-list-bgcolor;
    }

    /*头部*/
    .header {
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
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
        .title {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            margin: 0;
            text-align: center;
            line-height: px2rem(84px);
            font-size: px2rem(36px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $title-color;
            z-index: 40;
        }
        /*滚动标题*/
        .carousel {
            position: relative;
            display: block;
            animation: carousel 20s infinite linear;
        }
    }

    /*音乐列表外层*/
    .music-list {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
    }

    /*过滤层头部背景颜色*/
    .filter-header-bgcolor {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 0;
        width: 100%;
        height: px2rem(84px);
        overflow: hidden;
        opacity: 0.75;
        object-fit: cover;
        filter: blur(0px);
        background: $filter-bgcolor;
        z-index: 15;
    }

    /*过滤层*/
    .filter {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 70%;
        width: 100%;
        height: 0;
        opacity: .6;
        object-fit: cover;
        filter: blur(px2rem(72px));
        background: $filter-bgcolor;
        z-index: 0;
    }

    /*背景图头部背景颜色*/
    .background-header-bgcolor {
        position: absolute;
        padding-top: 0;
        width: 100%;
        height: px2rem(84px);
        overflow: hidden;
        opacity: 1;
        filter: blur(0px);
        z-index: 15;
        img {
            position: absolute;
            bottom: 0;
            left: 0;
            height: auto;
        }
    }

    /*背景图*/
    .background {
        position: absolute;
        padding-top: 70%;
        width: 100%;
        height: 0;
        opacity: 0.65;
        filter: blur(px2rem(40px));
        z-index: 0;
        img {
            position: absolute;
            top: 0;
            left: 0;
            height: auto;
        }
    }

    /*专辑背景*/
    .album-wrapper {
        position: relative;
        width: 100%;
        /*height: 0;*/
        /*overflow: hidden;*/
        padding-top: 70%;
        z-index: 100;
    }

    /*专辑信息*/
    .album {
        display: flex;
        position: absolute;
        top: px2rem(118px);
        padding: 0 px2rem(40px);
        box-sizing: border-box;
        overflow: hidden;
        width: 100%;
        z-index: 50;
        /*专辑头像*/
        .cover {
            display: block;
            position: relative;
            width: px2rem(250px);
            height: px2rem(250px);
            margin-right: px2rem(20px);
            overflow: hidden;
            img {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .play-number-wrapper {
                display: flex;
                align-items: flex-end;
                position: relative;
                width: 100%;
                height: 100%;
                color: $title-color;
                background: $play-number-bgcolor;
                z-index: 2;
                .play-number {
                    display: flex;
                    padding-left: px2rem(16px);
                    height: px2rem(50px);
                    line-height: px2rem(50px);
                }
                .number {
                    padding-left: px2rem(15px);
                    line-height: px2rem(54px);
                    font-size: px2rem(24px);
                }
                .icon-erji {
                    font-size: px2rem(24px);
                }
            }
        }
        /*专辑信息*/
        .message {
            display: block;
            overflow: hidden;
            padding: px2rem(20px) 0;
            flex: 1;
            position: relative;
            color: $name-color;
            /*专辑名字*/
            .album-name {
                margin: 0;
                min-height: px2rem(94px);
                text-align: left;
                line-height: 1.3;
                font-size: px2rem(36px);
                font-weight: 300;
                overflow: hidden;
            }
            /*专辑作者外层*/
            .author {
                display: flex;
                margin-top: px2rem(16px);
                overflow: hidden;
                text-align: left;
                /*专辑作者头像*/
                .author-avatar {
                    display: block;
                    width: px2rem(48px);
                    height: px2rem(48px);
                    margin-right: px2rem(16px);
                    border-radius: px2rem(48px);
                }
                /*专辑作者头像下面的小图标*/
                .small-avatar {
                    position: absolute;
                    padding: px2rem(30px);
                    width: px2rem(20px);
                }
                /*专辑作者名字*/
                .author-name {
                    flex: 1;
                    span {
                        display: block;
                        width: 100%;
                        line-height: px2rem(48px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: px2rem(28px);
                    }
                }
            }
            /*专辑简介*/
            .desc {
                position: relative;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-align: left;
                text-overflow: ellipsis;
                margin-top: px2rem(16px);
                height: px2rem(36px);
                line-height: px2rem(36px);
                font-size: px2rem(24px);
                p {
                    padding-right: px2rem(12px);
                }
            }
            .desc:after {
                content: "";
                position: absolute;
                top: px2rem(10px);
                right: px2rem(4px);
                width: px2rem(12px);
                height: px2rem(12px);
                border-top: px2rem(4px) solid #ffffff;
                border-right: px2rem(4px) solid #ffffff;
                transform: rotate(45deg);
            }
        }
    }

    /*选项信息  收藏评论 分享*/
    .itemMessage {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        height: px2rem(160px);
        padding: 0 px2rem(40px);
        z-index: 4;
        ul {
            display: flex;
            width: 100%;
            height: px2rem(160px);
        }
        li {
            flex: 1;
            color: $icon-color;
            line-height: px2rem(160px);
            i {
                font-size: px2rem(52px);
            }
        }
        .like {
            text-align: left;
            font-size: px2rem(28px);
            i:first-child {
                position: relative;
                top: -1px;
            }
        }
        .comment {
            text-align: center;
            font-size: px2rem(28px);
        }
        .share {
            text-align: right;
            font-size: px2rem(28px);
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

    .bg-layer {
        position: relative;
        height: 100%;
        background: #fff;
    }

    /*歌曲列表外层*/
    .song-list {
        margin-top: px2rem(106px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
    }

    /*滚动条 animation*/
    @keyframes carousel {
        0% {
            transform: translate3d(105%, 0, 0);
        }
        100% {
            transform: translate3d(-105%, 0, 0);
        }
    }
</style>
