<template>
    <div class="music-list-wrapper">
        <div class="header">
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <div class="title">
                <span>{{title}}</span>
                <!--滚动的标题-->
                <span v-if="carouselStart" :class="{carousel: carouselStart}" ref="carousel">{{carousel}}</span>
            </div>
        </div>
        <div class="music-list">
            <!--背景图-->
            <div class="background" ref="background">
                <img width="100%" height="100%" :src="coverImage">
            </div>
            <!--背景滤镜效果-->
            <div class="filter"></div>
            <!--专辑-->
            <div class="album-wrapper" ref="bgImage">
                <!--专辑信息-->
                <div class="album">
                    <!--专辑头像-->
                    <div class="cover">
                        <img :src="coverImage"
                             onerror="this.src='../../../static/img/default_avater.png';this.onerror=null;"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <div class="play-number">
                                <i class="iconfont icon-erji"></i>
                                <span class="number">{{playNumber}}</span>
                            </div>
                        </div>
                    </div>
                    <!--专辑信息-->
                    <div class="message">
                        <!--专辑名称-->
                        <h1 class="album-name" :class="{error: !albumName}">{{albumName}}</h1>
                        <!--作者头像-->
                        <div class="author">
                            <!--作者小头像-->
                            <img class="small-avatar" :src="smallAvatar"/>
                            <!--作者大头像-->
                            <img class="author-avatar" :src="authorAvatar"
                                 onerror="this.src='../../../static/img/default_avater.png';this.onerror=null;"/>
                            <!--作者名字-->
                            <div class="author-name" :class="{error: !authorName}">
                                <span>{{authorName}}</span>
                            </div>
                        </div>
                        <div class="desc" :class="{error: !desc}">
                            <p v-html="desc"></p>
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
            <!--歌曲列表-->
            <scroll :data="songs"
                    :listen-scroll="listenScroll"
                    :probe-type="probeType"
                    :bounce="bounce"
                    @scroll="scroll"
                    class="song-list"
                    ref="SongList">
                <song-list :songs="songs"></song-list>
            </scroll>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import BScroll from 'better-scroll';
    import Scroll from 'base/scroll/scroll';
    import SongList from 'base/song-list/song-list';

    export default {
        props: {
            // 标题
            title: {
                type: String,
                default: ''
            },
            // 滚动的文字
            carousel: {
                type: String,
                default: ''
            },
            // 头像图片
            coverImage: {
                type: String,
                default: ''
            },
            // 专辑名字
            albumName: {
                type: String,
                default: ''
            },
            // 作者头像
            authorAvatar: {
                type: String,
                default: ''
            },
            // 作者头像下面的小图标
            smallAvatar: {
                type: String,
                default: ''
            },
            // 作者名字
            authorName: {
                type: String,
                default: ''
            },
            // 简介
            desc: {
                type: String,
                default: ''
            },
            // 歌曲列表
            songs: {
                type: Array,
                default: null
            },
            // 专辑收藏数量
            collection: {
                type: Number,
                default: 0
            },
            // 播放量
            playNumber: {
                type: String,
                default: '0'
            }
        },
        data() {
            return {
                // 开启回弹效果
                bounce: true,
                // 开启标题滚动
                carouselStart: false,
                // 获取滚动Y轴坐标
                scrollY: 0,
                // scroll 组件 状态设置为3
                probeType: 3,
                // scroll 组件 开启滚动监听
                listenScroll: true
            };
        },
        mounted() {
            // 获取图片背景的高度
            this.imageHeight = this.$refs.background.clientHeight;
            // 设置歌曲列表的位置
            this.$refs.SongList.$el.style.top = `${this.imageHeight}px`;
        },
        methods: {
            back() {
                this.$router.back();
            },
            scroll(pos) {
                this.scrollY = pos.y;
            }
        },
        activated() {
            this.carouselStart = false;
        },
        watch: {
            scrollY(newVal) {
                console.log(newVal);
                this.$refs.bgImage.style.transform = `translate3d(0,${newVal}px,0)`;
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
        width: 100%;
        height: px2rem(84px);
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
        height: 0;
        overflow: hidden;
        padding-top: 70%;
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

    /*歌曲列表外层*/
    .song-list {
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
