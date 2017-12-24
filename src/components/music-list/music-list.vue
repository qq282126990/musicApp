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
            <div class="list-wrapper">
                <div class="bg-style">
                    <div class="background">
                        <img width="100%" height="100%" :src="coverImage">
                    </div>
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
                        </div>
                    </div>
                    <div class="filter"></div>
                </div>
                <div class="list">

                </div>
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

    .music-list {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 110;
        background: rgba(19, 21, 33, 1);
    }

    .header {
        width: 100%;
        height: px2rem(84px);
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
        .carousel {
            position: relative;
            display: block;
            animation: carousel 20s infinite linear;
        }
    }

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

    .list-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
    }

    .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: .6;
        object-fit: cover;
        filter: blur(36px);
        background: rgba(0, 0, 0, 1);
    }

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
            filter: blur(20px);
        }
    }

    .album {
        display: flex;
        position: absolute;
        top: px2rem(118px);
        padding: 0 16px;
        box-sizing: border-box;
        overflow: hidden;
        width: 100%;
        z-index: 50;
        .cover {
            display: block;
            position: relative;
            width: 125px;
            height: 125px;
            margin-right: 10px;
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
        .message {
            display: block;
            flex: 1;
            position: relative;
            .album-name {
                margin: 0;
                max-height: 47px;
                text-align: left;
                line-height: 1.3;
                font-size: 18px;
                font-weight: 300;
                overflow: hidden;
                color: $name-color;
            }
            .author {
                display: flex;
                margin-top: 8px;
                overflow: hidden;
                text-align: left;
                .author-avatar {
                    display: block;
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                    border-radius: 24px;
                }
                .author-name {
                    flex: 1;
                    span {
                        display: block;
                        width: 100%;
                        line-height: 24px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 14px;
                        color: $name-color;
                    }
                }
            }
        }
    }

    .list {
        position: relative;
        height: 100%;
        background: #fff;
        z-index: 100;
    }

    @keyframes carousel {
        0% {
            transform: translate3d(105%, 0, 0);
        }
        100% {
            transform: translate3d(-105%, 0, 0);
        }
    }
</style>