<template>
    <div>
        <transition name="slide">
            <div v-show="show">
                <header class="app-header-wrapper">
                    <div class="app-header-left">
                        <!--右侧菜单-->
                        <div v-if="showMenu"
                             @click="handleClick('menu')" class="app-header-icon">
                            <i class="iconfont icon-zhankai"></i>
                        </div>
                        <!--返回上一页-->
                        <div v-if="showBack"
                             @click="handleClick('back')" class="app-header-icon">
                            <i class="iconfont icon-fanhui1-copy"></i>
                        </div>
                    </div>
                    <div class="app-header-middle" v-cloak>
                        <!--没有title时显示-->
                        <ul>
                            <li class="header-li">
                                <router-link to="/my" tag="span" class="myIndex">我的</router-link>
                            </li>
                            <router-link to="/home" tag="li" class="header-li">
                                <span class="musician">音乐馆</span>
                            </router-link>
                            <li class="header-li">
                                <router-link to="/find" tag="span" class="find">发现</router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="search">
                        <!--<i class="iconfont icon-sousuo2 search-icon"></i>-->
                    </div>
                </header>
                <!--搜索输入框-->
                <div class="search-input-wrapper" @click="clickShowSearch">
                    <transition name="search-fade">
                        <div class="search-content" v-show="!getShowSearch">
                            <div class="search-input">
                                <i class="iconfont icon-sousuo2 search-icon"></i>
                                <span>搜索</span>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
        <search v-show="getShowSearch"></search>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import EventBus from '@/event-bus';
    // 搜索框组件
    import Search from 'components/search/search';

    export default {
        name: 'appHeader',
        data() {
            return {
                /*
                * 设置是否显示搜索框
                * */
                showSearch: false
            }
        },
        computed: {
            ...mapState('appShell/appHeader', [
                'show',
                'showMenu',
                'showBack',
                'title',
                'actions'
            ]),
            ...mapState('appShell', [
                'isPageSwitching'
            ]),
            ...mapState('appStore', {
                getShowSearch: 'showSearch'
            })
        },
        methods: {
            /**
             * 处理按钮点击事件
             *
             * @param {string} source 点击事件源名称 menu/logo/action
             * @param {Object} data 随点击事件附带的数据对象
             */
            handleClick(source, {actionIdx, route} = {}) {

                // 页面正在切换中，不允许操作，防止滑动效果进行中切换
                if (this.isPageSwitching) {
                    return;
                }
                let eventData = {};

                // 点击右侧动作按钮，事件对象中附加序号
                if (source === 'action') {
                    eventData.actionIdx = actionIdx;
                }

                // 发送给父组件，内部处理
                this.$emit(`click-${source}`, eventData);

                // 发送全局事件，便于非父子关系的路由组件监听
                EventBus.$emit(`app-header:click-${source}`, eventData);

                // 如果传递了路由对象，进入路由
                if (route) {
                    this.$router.push(route);
                }
            },
            /*
            * 设置显示搜索框
            * */
            clickShowSearch() {
                this.setShowSeach(true);
            },
            ...mapActions('appStore', {
                /*
                 * 设置显示搜索框
                 * */
                setShowSeach: 'showSearch'
            })
        },
        components: {
            Search
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .slide-enter-active, .slide-leave-active {
        transition: transform 0.4s cubic-bezier(.55, 0, .1, 1);
    }

    .slide-enter {
        transform: translate3d(-100%, 0, 0);
        z-index: -1;
    }

    .slide-leave-active {
        transform: translate3d(-100%, 0, 0);
        z-index: -1;
    }

    .search-fade-enter-active, .search-fade-leave-active {
        transition: all .5s;
    }

    .search-fade-leave-to {
        padding: 0 px2rem(40px) !important;
    }

    /*激活当前导航按钮*/
    .router-link-active {
        color: $btn-color;
        line-height: px2rem($app-header-height);
        span {
            color: $btn-color;
        }
    }

    .app-header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: $app-header-bgcolor;
        color: $btn-color;
        padding: 0;
        transition: transform 0.3s ease-out;
        z-index: 20;
        & > div {
            display: flex;
            align-items: center;
        }
        .app-header-left {
            flex: 1;
            flex-basis: 20%;
        }
        .app-header-middle {
            display: flex;
            flex-wrap: nowrap;
            width: 100%;
            li:last-child {
                text-align: right;
                line-height: px2rem($app-header-height);
                font-size: px2rem(32px);
            }
            ul {
                /*padding-left: px2rem(10px);*/
                display: flex;
                width: 100%;
                height: px2rem($app-header-height);
            }
            .myIndex {
                float: right;
            }
            .musician {
                text-align: center;
            }
            .find {
                float: left;
            }
            .search {
                padding-right: px2rem(30px);
                float: right;
                line-height: px2rem($app-header-height);
                color: $btn-color;
            }
        }
    }

    // 改变 icon 大小
    .app-header-icon {
        line-height: px2rem($app-header-height);
        color: $btn-color;
        width: px2rem($app-header-height);
        height: px2rem($app-header-height);
        i {
            display: block;
        }
    }

    .iconfont {
        font-size: px2rem(32px);
    }

    /*头部导航列表*/
    .header-li {
        flex: 1;
        flex-basis: 20%;
        line-height: px2rem(88px);
        height: px2rem(88px);
        color: $header-li-color;
        span {
            display: block;
            text-align: center;
            font-size: px2rem(32px);
        }
        i {
            padding: 0;
            display: block;
        }
    }

    /*搜索按钮*/
    .search {
        padding: 0;
        flex: 1;
        flex-basis: 20%;
        line-height: px2rem(88px);
        height: px2rem(88px);
        color: $btn-color;
        .search-icon {
            padding: 0;
            margin: 0 auto;
            display: block;
        }
    }

    /*搜索框*/
    .search-input-wrapper {
        width: 100%;
        height: px2rem(66px);
        background: $search-wrapper-bgcolor;
        .search-content {
            padding: 0 px2rem(10px);
            box-sizing: content-box;
        }
        .search-input {
            display: block;
            text-align: center;
            line-height: px2rem(50px);
            font-size: px2rem(26px);
            width: 100%;
            height: px2rem(50px);
            border: none;
            border-radius: px2rem(6px);
            background: rgba(0, 0, 0, .2);
            color: $search-font-color;
            .search-icon {
                font-size: px2rem(26px);

            }
        }
    }

</style>
