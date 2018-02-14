<template>
    <div class="music-list-wrapper">
        <!--头部-->
        <div class="music-list-header" ref="header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--头部标题-->
            <div class="header-title">
                <!--未滚动的标题-->
                <transition name="fade">
                    <span v-if="!carouselStart">{{getSongSingle.rcmdtemplate}}</span>
                </transition>
                <!--滚动的标题-->
                <transition name="fade">
                    <span :class="{carousel: carouselStart}"
                          v-if="carouselStart"
                    >{{getSongSingle.title}}</span>
                </transition>
            </div>
        </div>
        <!--内容-->
        <div class="music-list-content">
            <!--歌单专辑背景图-->
            <div :class="setHeaderBg ? 'background-header-bgcolor' : 'background'" ref="background">
                <img width="100%" height="100%"
                     :alt="getSongSingle.cover"
                     v-lazy="getSongSingle.cover">
            </div>
            <!--背景滤镜效果-->
            <div :class="setHeaderBg ? 'filter-header-bgcolor' : 'filter'"></div>
            <div class="album-message-wrapper"
                 :style="{transform: bgImageY, overflow: overflow, paddingTop: paddingTop}"
            >
                <!--歌单专辑信息-->
                <div class="album-message" :style="{opacity: transparent}">
                    <!--歌单专辑图片-->
                    <div class="cover">
                        <img :alt="getSongSingle.cover"
                             v-lazy="getSongSingle.cover"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <div class="play-number">
                                <i class="iconfont icon-erji" v-show="getSongAlbumMessage.playNumber"></i>
                                <v-icon class="icon" v-show="getSongSingle.publicTime">query_builder</v-icon>
                                <span class="number">
                                    {{getSongAlbumMessage.playNumber || getSongSingle.publicTime}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!--专辑信息-->
                    <div class="message">
                        <!--专辑名称-->
                        <h1 class="album-name"
                            :class="{error: !getSongSingle.title}">
                            {{getSongSingle.title}}
                        </h1>
                        <!--作者头像-->
                        <div class="author">
                            <!--作者小头像-->
                            <img class="small-avatar"
                                 :alt="getSongAlbumMessage.smallAvatar"
                                 :src="getSongAlbumMessage.smallAvatar"/>
                            <!--作者大头像-->
                            <img class="author-avatar"
                                 :alt="getSongAlbumMessage.authorAvatar || avatarDefault"
                                 v-lazy="getSongAlbumMessage.authorAvatar || avatarDefault"/>
                            <!--作者名字-->
                            <div class="author-name"
                                 :class="{error: !getSongAlbumMessage.nickname}">
                                <span>{{getSongAlbumMessage.nickname}}</span>
                            </div>
                        </div>
                        <div class="desc"
                             :class="{error: !getSongAlbumMessage.desc}">
                            <p v-html="getSongAlbumMessage.desc"></p>
                        </div>
                    </div>
                </div>
                <!--选项信息-->
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
            <song-list-play-all
                :totalSongNum="getSongAlbumMessage.totalSongNum"
                :style="{transform: headerY}"
            ></song-list-play-all>
            <div class="bg-layer" ref="layer" :style="{transform: bgImageY}"></div>
            <!--歌曲列表-->
            <scroll
                class="song-list-wrapper"
                @scroll="scroll"
                ref="SongListScroll"
            >
                <song-list
                ></song-list>
            </scroll>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 获取主页选择对应歌单的数据
    import {getSongSingle} from 'common/js/cache';
    // 歌曲列表播放全部模块
    import SongListPlayAll from 'base/songListPlayAll/songListPlayAll';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌曲列表组件
    import SongList from 'base/song-list/song-list';

    export default{
        props: {
            // 专辑收藏数量
            collection: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                // 判断是否已经滚动了
                isScroll: false,
                // 是否设置头部背景效果
                headerBg: false,
                /*
                 * 开启标题滚动
                 * @type {Boolean}
                 * */
                carouselStart: false,
                /*
                 * 是否设置头部背景效果
                 * @type {Boolean}
                 * */
                setHeaderBg: false,
                /*
                 * 获取滚动的时候Y轴坐标
                 * @type {Number}
                 * */
                scrollY: 0,
                /*
                 * 专辑内容的透明度
                 * @type {Number}
                 * */
                transparent: 1,
                /*
                 * 滚动时设置专辑内容移动的距离
                 * @type {Number}
                 * */
                translateY: 0,
                /*
                 * 滚动时设置专辑内容超出内容隐藏
                 * @type {String}
                 * */
                overflow: 'visible',
                /*
                 * 滚动时设置专辑内容padding-top
                 * @type {String}
                 * */
                paddingTop: '70%',
                /*
                 * 没有图片是默认显示的图片
                 * @type {String}
                 * */
                avatarDefault: 'http://y.gtimg.cn/music/common/upload/t_taoge_mingren/51431.jpg'
            }
        },
        mounted () {
            this.$nextTick(() => {
                this._initSome();
            });
        },
        computed: {
            // 获取主页选择对应歌单的数据
            getSongSingle () {
                return getSongSingle();
            },
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
            ...mapState('asyncAjax', {
                /*
                 * 获取主页选择对应歌单的数据
                 * @type {Object}
                 * */
                getSongAlbumMessage: 'songAlbumMessage'
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
            // 一些初始化操作
            _initSome() {
                // 获取图片背景的高度
                this.imageHeight = this.$refs.background.clientHeight;

                // 把滚动位置重置为顶部
                this.$refs.SongListScroll.scrollTo(0, 0);

                // 设置歌曲列表的位置
                this.$refs.SongListScroll.$el.style.top = `${this.imageHeight}px`;

                // 获取头部高度
                this.header = this.$refs.header.clientHeight;
                // 设置最小移动数 minTransalteY
                this.minTransalteY = -this.imageHeight + this.header;

                // 设置滚动组件状态
                this.setScrollData(this.getSongAlbumMessage);
                this.setListenScroll(true);
                this.setProbeType(3);
                this.setBounce(true);
                this.setPullup(true);
            },
            ...mapActions('appStore', {
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * scroll 要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 滚动的状态
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
                    this.setHeaderBg = true;

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
                    this.setHeaderBg = false;

                    // 头部字体滚动
                    this.carouselStart = false;
                }
            }
        },
        components: {
            SongListPlayAll,
            SongList,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    // 头部文字渐变显示效果
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        position: absolute;
        left: 0;
        right: 0;
        opacity: 0;
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

    // 没有数据是显示的样式
    .error {
        background: $error;
    }

    /*外层*/
    .music-list-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        background: $music-list-bgcolor;
    }

    /*头部*/
    .music-list-header {
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
        .header-title {
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
            height: px2rem(84px);
        }
        /*滚动标题*/
        .carousel {
            position: relative;
            display: block;
            height: px2rem(84px);
            animation: carousel 20s infinite linear;
            box-shadow: none;
        }
    }

    /*内容*/
    .music-list-content {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
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
        /*歌单专辑信息*/
        .album-message-wrapper {
            position: relative;
            width: 100%;
            /*height: 0;*/
            /*overflow: hidden;*/
            padding-top: 70%;
            z-index: 100;
        }
        /*专辑信息*/
        .album-message {
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
                    .icon {
                        font-size: px2rem(36px);
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
                    max-height: px2rem(94px);
                    text-align: left;
                    line-height: 1.3;
                    font-size: px2rem(32px);
                    font-weight: 300;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
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
        /*选项信息  收藏 评论 分享*/
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
    }

    /*歌曲列表外层*/
    .song-list-wrapper {
        margin-top: px2rem(106px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
    }

    .bg-layer {
        position: relative;
        height: 100%;
        background: #fff;
    }
</style>
