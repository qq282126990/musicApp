<template>
    <!--最小化样式-->
    <transition name="mini">
        <div class="mini-player">
            <!--没有歌曲列表时显示-->
            <div class="no-play-list">
                <span>QQ音乐 听我想听得歌</span>
            </div>
            <!--播放按钮-->
            <div class="control">
                <v-icon class="play">
                    {{'play_circle_outline'}}
                </v-icon>
            </div>
            <!--播放列表按钮-->
            <div class="queue">
                <v-icon class="queue_music">queue_music</v-icon>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*有播放歌曲时组件出现的动画*/
    .playList-enter-active, .playList-leave-active {
        transition: all .5s
    }

    .playList-enter, .playList-leave-to {
        opacity: 0;
    }

    /*播放器放大时的动画*/
    .normal-enter-active, .normal-leave-active {
        transition: all .4s;
        .header, .bottom {
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
    }

    .normal-enter, .normal-leave-to {
        opacity: 0;
        .header {
            transform: translate3d(0, px2rem(-100px), 0)
        }
        .bottom {
            transform: translate3d(0, px2rem(100px), 0)
        }
    }

    /*播放器缩小时的动画*/
    .mini-enter-active, .mini-leave-active {
        transition: all .4s;
    }

    .mini-enter, .mini-leave-to {
        opacity: 0;
    }

    /*左右滑动wrapper*/
    .slide {
        overflow: hidden;
        display: -webkit-box;
        width: 100%;
    }

    /*没有歌曲列表时显示*/
    .no-play-list {
        display: flex;
        align-items: center;
        padding-left: px2rem(40px);
        font-size: px2rem(32px);
        width: 100%;
        color: $no-play-list-color;
    }

    /*播放器最小化时的样式*/
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(120px);
        box-shadow: 0 0 10px #999;
        background: $mini-player-color;
        /*播放的歌曲图片*/
        .avatar {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 px2rem(40px);
            img {
                display: block;
                border-radius: 50%;
            }
        }
        /*播放的歌曲标题和文字*/
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            text-align: left;
            line-height: px2rem(40px);
            .name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: px2rem(10px);
                font-size: px2rem(32px);
                color: $text-name-color;
            }
            .desc {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: px2rem(32px);
                color: $text-desc-color;
            }
        }
        /*播放和歌曲icon样式*/
        .control {
            flex: 0 0 px2rem(80px);
            padding: 0 px2rem(30px);
        }
        /*播放按钮图标*/
        .play {
            font-size: px2rem(70px);
            color: $play-color;
        }
        /*音乐列表图标*/
        .queue {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 0;
        }
        /*播放列表按钮*/
        .queue_music {
            font-size: px2rem(70px);
            color: $play-color;
        }
    }

    /*播放器放大时的样式*/
    .normal-player {
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $normal-player-bgcolor;
        /*背景*/
        .background {
            position: absolute;
            left: -50%;
            top: 0;
            width: 150%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px)
        }
        /*头部*/
        .header {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: px2rem(84px);
            z-index: 100;
            /*返回按钮*/
            .back {
                flex-basis: 20%;
                z-index: 50;
                i {
                    display: block;
                    padding: 0 px2rem(20px);
                    font-size: px2rem(84px);
                    line-height: px2rem(84px);
                    color: $icon-fanhui1-copy;
                }
            }
            /*标题*/
            .title {
                padding-left: px2rem(10px);
                width: 100%;
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
            /*菜单*/
            .menu {
                flex-basis: 25%;
                z-index: 50;
                width: px2rem(124px);
            }
        }
        /*内容*/
        .normal-player-content {
            padding-top: px2rem(20px);
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            overflow: hidden;
            /*歌手名称*/
            .sing-name {
                display: flex;
                justify-content: center;
                padding: 0 px2rem(40px);
                text-align: center;
                font-size: px2rem(30px);
                color: $sing-name-color;
                i {
                    font-size: px2rem(40px);
                }
                span {
                    padding: 0 px2rem(10px);
                }
            }
            /*切换 dot*/
            .dot-wrapper {
                padding-top: px2rem(50px);
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    &.active {
                        border-radius: 5px;
                        background: #fff
                    }
                }
            }
            /*中间内容*/
            .middle {
                position: fixed;
                /*margin-top: px2rem(30px);*/
                width: 100%;
                top: px2rem(240px);
                bottom: px2rem(340px);
                white-space: nowrap;
                font-size: 0;
                /*左边滑块*/
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    /*padding-top: 80%;*/
                    /*歌曲图片*/
                    .cd-wrapper {
                        /*position: absolute;*/
                        /*left: 10%;*/
                        /*top: 0;*/
                        margin: 0 auto;
                        /*width: px2rem(600px);*/
                        /*height: 100%;*/
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 10px solid rgba(0, 0, 0, 0.1);
                            border-radius: 50%;
                            &.play {
                                animation: rotate 20s linear infinite
                            }
                            &.pause {
                                animation-play-state: paused
                            }
                            .image {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                    /*小歌词*/
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: px2rem(40px) auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: px2rem(40px);
                            line-height: px2rem(40px);
                            font-size: px2rem(28px);
                            color: $playing-lyric-color;
                        }
                    }
                }
                /*右边滑块*/
                .middle-r {
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    /*自动校正歌词按钮*/
                    .auto-regulate-lyric {
                        display: block;
                        width: 100%;
                        line-height: px2rem(50px);
                        font-size: px2rem(30px);
                        color: #fff
                    }
                    /*歌词*/
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        /*内容*/
                        .text {
                            line-height: px2rem(64px);
                            font-size: px2rem(28px);
                            color: $lyric-text-color;
                            // 当前的歌词行
                            &.current {
                                color: $lyric-text-current-color;
                            }
                        }
                    }
                    // 背景
                    .middle-r-bg {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: px2rem(100px);
                        background: rgba(0, 0, 0, .5);
                    }
                }
            }
        }
        /*播放控制按钮*/
        .bottom {
            position: absolute;
            bottom: px2rem(50px);
            width: 100%;
            /*播发进度*/
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: px2rem(20px) 0;
                /*播放时间*/
                .time {
                    flex: 0 0 px2rem(60px);
                    line-height: px2rem(60px);
                    width: px2rem(60px);
                    font-size: px2rem(24px);
                    color: $time-color;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                /*进度条*/
                .progress-bar-wrapper {
                    flex: 1;
                }
            }
            /*切换歌曲等按钮*/
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    font-size: px2rem(70px);
                }
                /*没有收藏按钮*/
                .favorite_border {
                    color: $favorite_border;
                    font-size: px2rem(60px);
                }
                /*收藏按钮*/
                .favorite {
                    color: $favorite;
                    font-size: px2rem(60px);
                }
                /*回到上一个*/
                .skip-previous {
                    color: $kip-previous;
                }
                .skip-next {
                    color: $skip-next;
                }
                /*播放按钮*/
                .play {
                    flex: 1;
                    color: $play-color;
                    i {
                        font-size: px2rem(100px);
                    }
                }
                /*切换播放模式*/
                .play-mode {
                    margin-top: px2rem(10px);
                }
                .iconfont {
                    padding-top: px2rem(10px);
                    font-size: px2rem(65px);
                    color: $mode-color;
                }
                .icon-danquxunhuan {
                    margin-top: px2rem(-2px);
                    padding-top: 0;
                    font-size: px2rem(70px);
                }
                .i-left {
                    text-align: center;
                }
                .i-center {
                    padding: 0 px2rem(20px);
                    text-align: center;
                }
                .i-right {
                    text-align: right;
                }
            }
        }
    }

    @keyframes rotate {
        0% {
            transform: rotate(0);

        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
