<template>
    <div class="music-list-wrapper">
        <div class="header" :class="{'header-bgcolor' : headerBg}" ref="header">
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <div class="title">
                <span>{{this.homeSonglist.rcmdtemplate}}</span>
                <!--滚动的标题-->
                <span v-if="carouselStart" :class="{carousel: carouselStart}"
                      ref="carousel">{{this.homeSonglist.title}}</span>
            </div>
        </div>
        <div class="music-list">
            <!--背景图-->
            <div class="background" ref="background">
                <img width="100%" height="100%" :src="this.homeSonglist.cover">
            </div>
            <!--背景滤镜效果-->
            <div class="filter"></div>
            <!--专辑-->
            <div class="album-wrapper" ref="bgImage">
                <!--专辑信息-->
                <div class="album" :style="{opacity: transparent}">
                    <!--专辑头像-->
                    <div class="cover">
                        <img :src="this.homeSonglist.cover ? this.homeSonglist.cover : this.default_avater"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <div class="play-number">
                                <i class="iconfont icon-erji"></i>
                                <span class="number">{{data.playNumber}}</span>
                            </div>
                        </div>
                    </div>
                    <!--专辑信息-->
                    <div class="message">
                        <!--专辑名称-->
                        <h1 class="album-name" :class="{error: !this.homeSonglist.title}">
                            {{this.homeSonglist.title}}</h1>
                        <!--作者头像-->
                        <div class="author">
                            <!--作者小头像-->
                            <img class="small-avatar" :src="data.smallAvatar"/>
                            <!--作者大头像-->
                            <img class="author-avatar"
                                 :src="data.authorAvatar ? data.authorAvatar : this.default_avater"/>
                            <!--作者名字-->
                            <div class="author-name" :class="{error: !this.homeSonglist.username}">
                                <span>{{this.homeSonglist.username}}</span>
                            </div>
                        </div>
                        <div class="desc" :class="{error: !data.desc}">
                            <p v-html="data.desc"></p>
                        </div>
                    </div>
                </div>
                <!--选项 信息-->
                <div class="itemMessage">
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
            <div class="list-header" ref="ListHeader">
                <!--播放全部-->
                <div class="play-all-wrapper">
                    <v-icon class="play">play_circle_outline</v-icon>
                    <h3 class="title">全部播放</h3>
                    <span class="total-number">共{{data.totalSongNum}}首</span>
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
            <div class="bg-layer" ref="layer"></div>
            <!--歌曲列表-->
            <scroll
                @scroll="scroll"
                @scrollToEnd="loadMore"
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
            },
            // 获取请求是否完成了
            ajax_ok: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 图片丢失的路径
                default_avater: '../../../static/img/default_avater.png',
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
                songBegin: 0,
                // 获取图片背景的高度
                imageHeight: null,
                // 专辑内容的透明度
                transparent: 1
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
                if (!this.songs) {
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
            ...mapGetters('appStore', {
                /*
                 * 歌曲列表信息
                 * @param {Object}
                 *
                 * */
                data: 'songListMessage',
                /*
                 * 歌曲列表
                 * @param {Array}
                 *
                 * */
                songs: 'songList',
                /*
                 * 选择的的歌曲列表数据
                 * @param {Object}
                 *
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
            // 上拉加载方法
            loadMore() {
                if (!this.hasMore) {
                    return;
                }

                // 请求完成时才执行上拉加载
                if (this.ajax_ok) {
                    // 页数小于 歌曲列表总数就执行
                    if (this.hasMore || this.songBegin <= this.data.totalSongNum) {

                        // 每次加15
                        this.songBegin = this.songBegin + 15;
                        this.setSongBegin(this.songBegin);
                    }
                }

            },
            // 选择歌曲列表
            select(event) {
                console.log(event);
                // 禁用 better-scroll
                // this.disable();

                // 开启 better-scroll
                setTimeout(() => {
                    // this.enable();
                }, 100);
            },
            // 初始化操作
            _initDom() {
                // 把滚动位置重置为顶部
                this.$refs.SongListScroll.scrollTo(0, 0);

                // 设置专辑区块的style
                this.$refs.bgImage.style.transform = `translate3d(0,0,0)`;

                // 把播放全部模块位置重置
                this.$refs.ListHeader.style.transform = `translate3d(0,0,0)`;

                // 初始化  layer
                this.$refs.layer.style.transform = `translate3d(0,0,0)`;

                // 组件激活时调用
                this.carouselStart = false;


                // 重置上拉加载的页数
                this.songBegin = 0;

                // 设置滚动组件状态
                this.setData(this.data);
                this.setListenScroll(this.listenScroll);
                this.setProbeType(this.probeType);
                this.setBounce(this.bounce);
                this.setPullup(this.pullup);

                // 初始化头部背景状态
                this.headerBg = false;

            },
            ...mapActions('appStore', {
                setSongBegin: 'songBegin',
                setData: 'data',
                setListenScroll: 'listenScroll',
                setProbeType: 'probeType',
                setBounce: 'bounce',
                setPullup: 'pullup'
            })
        },
        activated() {
            // 初始化操作
            this._initDom();
        },
        watch: {
            // 监听歌曲列表Y轴滚动
            scrollY(newScrollY) {
                console.log(newScrollY + '滚动了');

//                const offsetWidth = Math.min(0, Math.max(window.innerHeight, window.innerHeight + newScrollY));

                console.log(Math.max(window.innerHeight, window.innerHeight + newScrollY));


//                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
//                const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
//                this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
//                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
//                this.$refs.lyricList.$el.style[transitionDuration] = 0
//                this.$refs.middleL.style.opacity = 1 - this.touch.percent
//                this.$refs.middleL.style[transitionDuration] = 0

                let translateY = Math.max(this.minTransalteY, newScrollY);
                // 设置播放全部的位置
                this.$refs.ListHeader.style.transform = `translate3d(0,${translateY}px,0)`;


                // 如果滚动距离小于this.minTransalteY就设置为0 大于this.minTransalteY就开始计算
                if (newScrollY < this.minTransalteY) {

                    // 设置专辑区块的style
                    this.$refs.bgImage.style.transform = `translate3d(0,0,0)`;
                    this.$refs.bgImage.style.overflow = 'hidden';
                    this.$refs.bgImage.style.paddingTop = '0';

                    // 设置播放全部模块位置为初始值
                    this.$refs.ListHeader.style.transform = `translate3d(0,40px,0)`;

                    // 重置layer块的位置
                    this.$refs.layer.style.transform = `translate3d(0,0,0)`;

                    // 初始化专辑内容的透明度
                    this.transparent = 1;

                    // 显示头部背景状态
                    this.headerBg = true;

                }
                else {
                    // 设置专辑区块的style
                    this.$refs.bgImage.style.transform = `translate3d(0,${newScrollY}px,0)`;
                    this.$refs.bgImage.style.overflow = 'visible';
                    this.$refs.bgImage.style.paddingTop = '70%';

                    // 设置 layer块的位置
                    this.$refs.layer.style.transform = `translate3d(0,${newScrollY}px,0)`;

                    // 设置专辑内容的透明度
                    this.transparent = 1;

                    // 取消头部背景状态
                    this.headerBg = false;
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

    /*头部背景颜色*/
    .header-bgcolor {
        background: red;
    }

    /*音乐列表外层*/
    .music-list {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
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
        opacity: 0.6;
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
                    padding: 15px;
                    width: 10px;
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
        bottom: 0;
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
