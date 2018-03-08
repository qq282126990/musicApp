<template>
    <div>
        <scroll class="scroll-wrapper" @scroll="scroll" ref="scroll">
            <div>
                <!--用户信息-->
                <div class="user-message-wrapper" :class="{'active': scrollY > -10}">
                    <div class="user-message">
                        <!--头像-->
                        <img class="cove" src="../../../static/img/default_avater.png"/>
                        <!--用户名-->
                        <h2 class="user-name" @click="showLogin">{{getUserMessage.username || '立即登录，歌曲自动云同步'}}</h2>
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
                                    <v-icon class="timeIcon" @click="goPlayHistory">query_builder</v-icon>
                                    <p class="text">最近播放</p>
                                    <p class="number">{{getPlayHistory.length}}</p>
                                    <transition name="fade">
                                        <!--提示-->
                                        <div class="prompt" v-if="showPlayPrompt">
                                            <span>请先播放歌曲</span>
                                        </div>
                                    </transition>
                                </li>
                                <li class="router-nav-li">
                                    <v-icon class="likeIcon" @click="goFavorite">favorite_border</v-icon>
                                    <p class="text">我的喜欢</p>
                                    <p class="number">{{getFavoriteList.length}}</p>
                                    <transition name="fade">
                                        <!--提示-->
                                        <div class="prompt" v-if="showFavoritePrompt">
                                            <span>请先收藏歌曲</span>
                                        </div>
                                    </transition>
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
                                <!--歌单数量-->
                                <h3 class="text-1">0个歌单</h3>
                                <p>
                                    <!--添加按钮-->
                                    <v-icon class="icon">add</v-icon>
                                    <!--更多按钮-->
                                    <v-icon class="icon">format_list_bulleted</v-icon>
                                </p>
                            </div>
                            <!--歌单-->
                            <div class="song-list">
                                <ul>
                                    <!--没有歌单是显示-->
                                    <li class="no-list-item">
                                        <!--图标-->
                                        <div class="no-song-list">
                                            <v-icon class="noe-list-img-icon">add</v-icon>
                                        </div>
                                        <!--文字-->
                                        <p class="no-song-list-txt">新建歌单</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';

    export default {
        name: 'my',
        data () {
            return {
                /*
                 * 获取Y轴滚动
                 * @type {Number}
                 * */
                scrollY: 0,
                /*
                 * 设置显示提示
                 * @type {Boolean}
                 * */
                showFavoritePrompt: false,
                /*
                 * 设置显示提示
                 * @type {Boolean}
                 * */
                showPlayPrompt: false
            };
        },
        mounted () {
            // 设置滚动组件数据
            this.setScrollData([]);
            // 设置scroll组件 要不要监听滚动事件
            this.setListenScroll(true);
            // 设置滚动的状态
            this.setProbeType(3);
            // 设置滚动不回弹
            this.setBounce(false);
        },
        computed: {
            ...mapGetters('appStore', {
                /**
                 * 获取当前收藏列表
                 * @type {Array}
                 */
                getFavoriteList: 'favoriteList',
                /**
                 * 获取播放历史
                 * @type {Array}
                 */
                getPlayHistory: 'playHistory'
            }),
            ...mapGetters('asyncAjax', {
                /**
                 * 获取用户信息
                 * @type {Array}
                 */
                getUserMessage: 'userMessage',
            })
        },
        methods: {
            // 监听滚动
            scroll (pos) {
                this.scrollY = pos.y;
            },
            // 显示登录界面
            showLogin () {
                if (!this.getUserMessage.username) {
                    this.setShowLogin(true);
                }
            },
            // 跳转到我的喜欢路由
            goFavorite () {
                if (!this.getFavoriteList.length) {
                    this.showFavoritePrompt = true;
                    setTimeout(() => {
                        this.showFavoritePrompt = false;
                    }, 500);
                    return;
                }
                this.$router.push({
                    path: '/my/myFavorite'
                });
            },
            // 跳转到最近播放路由
            goPlayHistory () {
                if (!this.getPlayHistory.length) {
                    this.showPlayPrompt = true;
                    setTimeout(() => {
                        this.showPlayPrompt = false;
                    }, 500);
                    return;
                }

                this.$router.push({
                    path: '/my/playHistory'
                });
            },
            // 保存用户云歌曲
            setUserCloudSongList () {
                // 如果有喜欢列表 或者 播放历史才会去同步
                if (this.getFavoriteList.length || this.getPlayHistory.length) {
                    // 同步用户收藏歌曲和最近播放歌曲到数据库接口
                    let setUserSongList = {
                        'username': this.getUserMessage.username,
                        'favorite': this.getFavoriteList,
                        'playHistory': this.getPlayHistory
                    };
                    this.setUserSongList(setUserSongList);
                }
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('appStore', {
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 设置scroll组件 要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 滚动的状态
                 * @type {Number}
                 */
                setProbeType: 'probeType',
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                setBounce: 'bounce',
                /**
                 * 是否显示登录组件
                 * @type {Boolean}
                 */
                setShowLogin: 'showLogin',
                /**
                 * 覆盖收藏歌曲到本地
                 * @type {Array}
                 */
                setCoverUserMessageList: 'coverUserMessageList',
                /**
                 * 覆盖播放历史
                 * @type {Array}
                 */
                setCoverPlayHistorys: 'coverPlayHistorys'
            }),
            ...mapActions('asyncAjax', {
                /**
                 * 同步用户收藏歌曲和最近播放歌曲到数据库接口
                 * @type {Object}
                 */
                setUserSongList: 'getUserSongList'
            })
        },
        // 组件激活
        activated () {
            // 保存用户云歌曲
            this.setUserCloudSongList();


            // 设置首页头部导航
            this.setAppHeader({
                show: true
            });
            // 刷新滚动组件
            this.$refs.scroll.refresh();
            // 重置滚动位置
            this.$refs.scroll.scrollTo(0, 0);
        },
        watch: {
            // 监听用户数据变化
            getUserMessage (newUserMessage) {
                if (!newUserMessage.username) {
                    return;
                }

                if (newUserMessage) {
                    // 设置该用户的收藏歌曲列表
                    let getFavoriteList = JSON.parse(newUserMessage.favorite);
                    // 覆盖收藏收藏歌曲列表
                    this.setCoverUserMessageList(getFavoriteList);
                }

                if (newUserMessage.playHistory) {
                    // 设置用户最近播放列表
                    let getPlayHistory = JSON.parse(newUserMessage.playHistory);
                    // 覆盖用户最近播放列表
                    this.setCoverPlayHistorys(getPlayHistory);
                }
            }
        },
        components: {
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*提示显示时的动画*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    /*滚动层样式*/
    .scroll-wrapper {
        height: 100%;
        overflow: hidden;
        background: $app-header-bgcolor;
    }

    /*用户信息*/
    .user-message-wrapper {
        position: relative;
        padding-top: px2rem(20px);
        margin: 0 px2rem(20px);
        box-sizing: border-box;
        background: $tab-router-bgcolor;
        transition: all .2s;
        z-index: 2;
        &.active {
            box-shadow: 0 px2rem(2px) px2rem(3px) rgba(0, 0, 0, .1);
        }
        /*用户信息*/
        .user-message {
            display: flex;
            align-items: center;
            justify-content: center;
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
            margin-left: px2rem(20px);
            font-size: px2rem(28px);
            line-height: px2rem(80px);
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
                padding-top: px2rem(10px);
                margin: 0 auto;
                .iconfont {
                    padding-right: px2rem(10px);
                    font-size: px2rem(32px);
                }
                h1 {
                    margin-top: 0;
                    font-size: px2rem(28px);
                }
                p {
                    padding-top: px2rem(10px);
                    margin: 0;
                    font-size: px2rem(24px);
                    color: #999999;
                }
            }
            &::after {
                content: "";
                position: absolute;
                top: px2rem(24px);
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
                padding-top: px2rem(10px);
                margin: 0 auto;
                .iconfont {
                    padding-right: px2rem(10px);
                    font-size: px2rem(32px);
                }
                h1 {
                    margin-top: 0;
                    font-size: px2rem(28px);
                }
                p {
                    padding-top: px2rem(10px);
                    margin: 0;
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
            margin: 0;
            padding-top: px2rem(10px);
            padding-bottom: px2rem(10px);
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
            margin: 0;
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
                margin: 0;
                position: relative;
                padding-right: px2rem(30px);
                font-weight: 400;
                font-size: px2rem(28px);
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
                margin: 0;
                text-align: left;
                font-size: px2rem(28px);
                color: $customize-text-color;
            }
            p {
                margin: 0;
            }
            .icon {
                font-size: px2rem(50px);
                color: $created-song-list-icon-color;
            }
            .icon:last-child {
                padding-left: px2rem(40px);
            }
        }
        /*歌单列表*/
        .song-list {
            padding: 0 px2rem(20px);
            font-size: px2rem(32px);
            height: px2rem(300px);
            line-height: px2rem(300px);
            .list-item, .no-list-item {
                display: flex;
                width: 100%;
                height: px2rem(120px);
            }
            /*没有歌单列表时的歌单列表*/
            .no-song-list {
                position: relative;
                flex: 0 0 px2rem(120px);
                width: px2rem(120px);
                height: px2rem(120px);
                background: #f5f5f5;
            }
            /*没有歌单列表时的图片icon*/
            .noe-list-img-icon {
                position: absolute;
                padding: px2rem(36px);
                left: 0;
                color: #a9a9a9;
            }
            /*没有歌单列表时的文字*/
            .no-song-list-txt {
                flex: 1;
                margin: 0;
                padding-left: px2rem(20px);
                line-height: px2rem(120px);
                text-align: left;
                font-size: px2rem(28px);
            }
        }
    }

    /*提示*/
    .prompt {
        position: fixed;
        bottom: px2rem(100px);
        line-height: px2rem(50px);
        width: 50%;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: px2rem(50px);
        border-radius: px2rem(6px);
        background: rgba(0, 0, 0, .5);
        span {
            font-size: px2rem(26px);
            text-align: center;
            display: block;
            color: #fff;
        }
    }

</style>
