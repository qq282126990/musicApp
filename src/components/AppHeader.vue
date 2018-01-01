<template>
    <transition name="slide">
        <div name="slide-down" v-show="show">
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
                    <ul v-if="!title">
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
                    <!--有title时显示-->
                    <slot name="title" v-if="title">
                        {{ title }}
                    </slot>
                </div>
                <div class="search">
                    <i class="iconfont icon-sousuo2 search"></i>
                </div>
            </header>
            <search></search>
            <div class="mask-layer" v-show="maskLayer"></div>
        </div>
    </transition>
</template>

<script>
    import {mapState} from 'vuex';
    import EventBus from '@/event-bus';
    import Search from './search/search';

    export default {
        name: 'appHeader',
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
            ...mapState('appStore', [
                'maskLayer'
            ])
        },
        methods: {

            /**
             * 处理按钮点击事件
             *
             * @param {string} source 点击事件源名称 list-menu/logo/action
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
            }
        },
        components: {
            Search
        }
    };
</script>

<style lang="scss" scoped>
    @import "../common/sass/remAdaptive";
    @import "../common/sass/variables";

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

    .router-link-active {
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
                padding-left: px2rem(10px);
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

    .search {
        padding: 0;
        flex: 1;
        flex-basis: 20%;

        line-height: px2rem(88px);
        height: px2rem(88px);
        color: $btn-color;
        i {
            padding: 0;
            margin: 0 auto;
            display: block;
        }
    }

    .mask-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: px2rem(154px);
        background: rgba(0, 0, 0, .5);
    }
</style>
