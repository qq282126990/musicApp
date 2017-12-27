<template>
    <div class="music-list">
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
        <div class="list-wrapper">
            <div class="bg-style">
                <!--背景图-->
                <div class="background">
                    <img width="100%" height="100%" :src="coverImage">
                </div>
                <!--专辑信息-->
                <div class="album">
                    <div class="cover">
                        <img :src="coverImage"
                             onerror="this.src='../../../static/img/default_avater.png';this.onerror=null;"/>
                    </div>
                    <div class="message">
                        <h1 class="album-name">{{albumName}}</h1>
                        <div class="author">
                            <img class="author-avatar" :src="authorAvatar"
                                 onerror="this.src='../../../static/img/default_avater.png';this.onerror=null;"/>
                            <div class="author-name">
                                <span>{{authorName}}</span>
                            </div>
                        </div>
                        <div class="desc" v-show="desc">
                            <p v-html="desc"></p>
                        </div>
                    </div>
                </div>
                <!--选项 信息-->
                <div class="itemMessage">
                    <ul>
                        <li class="like">

                        </li>
                        <li class="comment"></li>
                        <li class="share"></li>
                    </ul>
                </div>
                <!--背景滤镜效果-->
                <div class="filter"></div>
            </div>
            <!--歌曲列表-->
            <div class="list">
                <v-list>
                    <v-list-tile ripple @click="">
                        <v-icon>favorite_border</v-icon>
                    </v-list-tile>
                </v-list>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import BScroll from 'better-scroll';

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
                default: []
            }
        },
        data () {
            return {
                // 开启标题滚动
                carouselStart: false
            };
        },
        computed: {},
        methods: {
            back() {
                this.$router.back();
            }
        },
        activated () {
            this.carouselStart = false;
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*外层*/
    .music-list {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 110;
        background: rgba(19, 21, 33, 1);
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
            color: #fff;
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
    .list-wrapper {
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
        width: 100%;
        height: 100%;
        opacity: .6;
        object-fit: cover;
        filter: blur(px2rem(72px));
        background: rgba(0, 0, 0, 1);
        z-index: -1;
    }

    /*专辑背景*/
    .bg-style {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        background-size: cover;
        .background {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(px2rem(40px));
        }
    }

    /*专辑信息*/
    .album {
        display: flex;
        position: absolute;
        top: px2rem(118px);
        padding: 0 px2rem(32px);
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
        }
        /*专辑信息*/
        .message {
            display: block;
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
                p{
                    padding-right: px2rem(12px);
                }
            }
            .desc:after{
                content:"";
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
    .itemMessage{
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        height: px2rem(160px);
        padding: 0 px2rem(32px);
        ul{
            display: flex;
            width: 100%;
        }
        li{
            flex: 1;
        }
    }
    /*歌曲列表外层*/
    .list {
        position: relative;
        padding: 0;
        height: 100%;
        background: #fff;
        z-index: 100;
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