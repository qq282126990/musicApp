<template>
    <div>
        <div>
            <!--用户信息-->
            <div class="user-message-wrapper" :class="{'active': scrollY > -10}">
                <div class="user-message">
                    <!--头像-->
                    <img class="cove" src="../../../static/img/default_avater.png"/>
                    <!--用户名-->
                    <h2 class="user-name">未登录</h2>
                </div>
                <!--中心-->
                <div class="center">
                    <!--任务中心-->
                    <div class="task-center">
                        <div class="text">
                            <h1><i class="iconfont icon-renwu"></i>任务中心</h1>
                            <p>今日听歌0分钟</p>
                        </div>
                    </div>
                    <!--会员中心-->
                    <div class="member-center">
                        <div class="text">
                            <h1><i class="iconfont icon-vip"></i>会员中心</h1>
                            <p>千万专属曲库任性享</p>
                        </div>
                    </div>
                </div>
            </div>
            <!--内容-->
            <div class="content-wrapper">
                <div class="content">
                    <!--导航-->
                    <div class="router-nav">
                        <ul>
                            <li class="router-nav-li">
                                <i class="iconfont icon-iconfontyuleyinle"></i>
                                <p class="text">本地音乐</p>
                                <p class="number">0</p>
                            </li>
                            <li class="router-nav-li">
                                <i class="iconfont icon-xiazai"></i>
                                <p class="text">下载音乐</p>
                            </li>
                            <li class="router-nav-li">
                                <v-icon class="timeIcon">query_builder</v-icon>
                                <p class="text">最近播放</p>
                                <p class="number">0</p>
                            </li>
                            <li class="router-nav-li">
                                <v-icon class="likeIcon">favorite_border</v-icon>
                                <p class="text">我的喜欢</p>
                                <p class="number">0</p>
                            </li>
                            <li class="router-nav-li">
                                <v-icon class="timeIcon">album</v-icon>
                                <p class="text">已购音乐</p>
                            </li>
                            <li class="router-nav-li">
                                <v-icon class="timeIcon">directions_run</v-icon>
                                <p class="text">跑步电台</p>
                                <p class="number">QQ音乐 X Nike</p>
                            </li>
                        </ul>
                    </div>
                    <!--用户歌单-->
                    <div class="customize-song-list">
                        <!--头部-->
                        <div class="song-list-header">
                            <p class="text-1 active-header">自建歌单</p>
                            <p class="text-1">收藏歌单</p>
                        </div>
                        <!--创建歌单按钮-->
                        <div class="created-song-list">
                            <h3 class="text-1">未创建歌单</h3>
                            <p>
                                <v-icon class="icon">add</v-icon>
                                <v-icon class="icon">format_list_bulleted</v-icon>
                            </p>
                        </div>
                        <!--歌单-->
                        <div class="song-list">
                            工程师努力开发中....
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
//    import {mapActions} from 'vuex';

    export default {
        name: 'My',
        data() {
            return {
                /*
                 * 获取Y轴滚动
                 * @type {Number}
                 * */
                scrollY: 0
            };
        },
        mounted() {
//            // 设置滚动组件数据
//            this.setScrollData();
//
//            // 设置scroll组件 要不要监听滚动事件
//            this.setListenScroll(true);
//
//            // 设置滚动的状态
//            this.setProbeType(3);
//
//            // 设置滚动不回弹
//            this.setBounce(false);
        },
        methods: {
            // 监听滚动
            scroll(pos) {
                this.scrollY = pos.y;
            },
//            ...mapActions('appStore', {
//                /**
//                 * 滚动组件传入的数据
//                 * @type {Array}
//                 */
//                setScrollData: 'data',
//                /**
//                 * 设置scroll组件 要不要监听滚动事件
//                 * @type {Boolean}
//                 */
//                setListenScroll: 'listenScroll',
//                /**
//                 * 滚动的状态
//                 * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
//                 * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
//                 * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
//                 * @type {Number}
//                 */
//                setProbeType: 'probeType',
//                /**
//                 * 设置滚动列表不回弹
//                 * @type {Boolean}
//                 */
//                setBounce: 'bounce'
//            })
        },
        components: {}
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";
    /*滚动层样式*/
    .scroll-wrapper {
        height: 100%;
        overflow: hidden;
        background: $app-header-bgcolor;
        .scroll {
            height: 100%;
        }
    }

    /*用户信息*/
    .user-message-wrapper {
        position: relative;
        margin: 0 px2rem(20px);
        box-sizing: border-box;
        background: $tab-router-bgcolor;
        transition: all .2s;
        z-index: 2;
        &.active {
            box-shadow: 0 px2rem(4px) px2rem(16px) #999;
        }
        /*用户信息*/
        .user-message {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: px2rem(20px);
            box-sizing: border-box;
            height: px2rem(100px);
        }
        /*头像*/
        .cove {
            display: -webkit-box;
            -webkit-box-align: center;
            width: px2rem(60px);
            height: px2rem(60px);
            border-radius: 50%;
            vertical-align: middle;
        }
        /*用户名*/
        .user-name {
            margin-left: px2rem(40px);
            font-size: px2rem(28px);
            font-weight: 400;
            line-height: 50px;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: px2rem(100px);
            height: 100%;
        }
        /*中心*/
        .center {
            display: flex;
            padding-bottom: px2rem(20px);
            height: px2rem(100px);
        }
        /*任务中心*/
        .task-center {
            position: relative;
            flex-basis: 50%;
            .text {
                margin: 0 auto;
                .iconfont {
                    padding-right: px2rem(10px);
                    font-size: px2rem(32px);
                }
                h1 {
                    font-size: px2rem(28px);
                }
                p {
                    font-size: px2rem(24px);
                    color: #999999;
                }
            }
            &::after {
                content: "";
                position: absolute;
                top: px2rem(40px);
                right: px2rem(-3px);
                width: px2rem(5px);
                height: px2rem(40px);
                background: #999;
            }
        }
        /*会员中心*/
        .member-center {
            flex-basis: 50%;
            .text {
                margin: 0 auto;
                .iconfont {
                    padding-right: px2rem(10px);
                    font-size: px2rem(32px);
                }
                h1 {
                    font-size: px2rem(28px);
                }
                p {
                    font-size: px2rem(24px);
                    color: #999999;
                }
            }
        }
    }

    /*内容*/
    .content-wrapper {
        position: relative;
        left: 0;
        right: 0;
        top: 0;
        box-sizing: border-box;
        bottom: 0;
        z-index: 1;
        margin-top: px2rem(-200px);
        padding-top: px2rem(220px);
        background: $tab-router-bgcolor;
    }

    /*导航*/
    .router-nav {
        display: block;
        height: px2rem(400px);
        ul {
            display: flex;
            flex-wrap: wrap;
        }
    }

    /*导航列表*/
    .router-nav-li {
        position: relative;
        flex-basis: 33.3%;
        height: px2rem(200px);
        display: flex;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        i {
            font-size: px2rem(70px);
            color: $router-nav-icon-color;
        }
        .text {
            padding-top: px2rem(10px);
            font-size: px2rem(28px);
            font-weight: 400;
        }
        .icon-xiazai, .timeIcon {
            font-size: px2rem(80px);
        }
        .likeIcon {
            font-size: px2rem(70px);
        }
        .number {
            position: absolute;
            bottom: px2rem(8px);
            font-size: px2rem(24px);
            color: #999;
        }
    }

    /*用户歌单*/
    .customize-song-list {
        overflow: hidden;
        /*头部*/
        .song-list-header {
            line-height: px2rem(60px);
            height: px2rem(60px);
            display: flex;
            justify-content: center;
            .text-1 {
                position: relative;
                padding-right: px2rem(30px);
                font-weight: 400;
                font-size: px2rem(32px);
                color: $customize-song-list-header;
            }
            .text-1:last-child {
                padding-right: 0;
                padding-left: px2rem(30px);
                &::before {
                    content: "";
                    position: absolute;
                    top: px2rem(15px);
                    left: px2rem(-3px);
                    width: px2rem(4px);
                    height: px2rem(30px);
                    background: #999;
                }
            }
            .active-header {
                color: $customize-text-color;
            }
        }
        /*创建歌单按钮*/
        .created-song-list {
            padding: 0 px2rem(20px);
            line-height: px2rem(60px);
            height: px2rem(60px);
            display: flex;
            justify-content: space-between;
            .text-1 {
                text-align: left;
                font-size: px2rem(28px);
                color: $customize-text-color;
            }
            .icon {
                font-size: px2rem(60px);
                color: #999;
            }
            .icon:last-child {
                padding-left: px2rem(40px);
            }
        }
        /*歌单列表*/
        .song-list {
            font-size: px2rem(32px);
            height: px2rem(300px);
            line-height: px2rem(300px);
        }
    }
</style>
