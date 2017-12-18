<template>
    <div name="slide-down">
        <header class="app-header-wrapper" v-show="show">
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
                    <router-link to="/my" tag="li" class="header-li">
                        <span class="myIndex">我的</span>
                    </router-link>
                    <router-link to="/home" tag="li" class="header-li">
                        <span class="musician">音乐馆</span>
                    </router-link>
                    <router-link to="/find" tag="li" class="header-li">
                        <span class="find">发现</span>
                    </router-link>
                </ul>
                <!--有title时显示-->
                <slot name="title" v-if="title">
                    {{ title }}
                </slot>
            </div>
            <li class="header-li">
                <i class="iconfont icon-sousuo2 search"></i>
            </li>
            <!--<div class="app-header-right">-->
            <!--<slot name="actions"-->
            <!--v-for="(action, actionIdx) in actions"-->
            <!--:icon="action.icon"-->
            <!--:route="action.route">-->
            <!--<v-btn-->
            <!--icon-->
            <!--dark-->
            <!--@click.native="handleClick('action', {actionIdx, route: action.route})">-->
            <!--<icon v-if="action.svg" :name="action.svg" class="app-header-icon"></icon>-->
            <!--<v-icon v-else-if="action.icon" class="app-header-icon">{{ action.icon }}</v-icon>-->
            <!--</v-btn>-->
            <!--</slot>-->
            <!--</div>-->
        </header>
        <search></search>
    </div>
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
        background: rgba(49, 194, 124, 0.95);
        color: $btn-color;
        padding: 0;
        transition: transform 0.3s ease-out;
        & > div {
            display: flex;
            align-items: center;
        }
        .app-header-left{
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
        color: rgba(240, 239, 245, 0.95);
        span {
            display: block;

            text-align: center;
            font-size: px2rem(32px);
        }
        i{
            padding: 0;
            display: block;
        }
    }
</style>
