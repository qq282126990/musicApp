<template>
    <div id="app">
        <div class="app-shell app-shell-bottom-navigation">
            <app-header
                class="app-shell-header"
                @click-menu="handleClickHeaderMenu"
                @click-back="handleClickHeaderBack">
            </app-header>
            <app-sidebar @hide-sidebar="handleHideSidebar"
                         @show-sidebar="handleShowSidebar"
            >
            </app-sidebar>
            <div class="app-view-wrapper">
                <transition
                    :name="pageTransitionName"
                    @before-enter="handleBeforeEnter"
                    @after-enter="handleAfterEnter"
                    @before-leave="handleBeforeLeave">
                    <keep-alive>
                        <router-view
                            :key="$route.fullPath"
                            v-if="!$route.meta.notKeepAlive"
                            class="app-view"
                            :class="{
                                'app-view-with-header': appHeader.show,
                            }"></router-view>
                    </keep-alive>
                </transition>
                <transition
                    :name="pageTransitionName"
                    @before-enter="handleBeforeEnter"
                    @after-enter="handleAfterEnter"
                    @before-leave="handleBeforeLeave">
                    <router-view
                        :key="$route.fullPath"
                        v-if="$route.meta.notKeepAlive"
                        class="app-view"
                        :class="{
                            'app-view-with-header': appHeader.show,
                        }"></router-view>
                </transition>
            </div>
            <player></player>
            <login></login>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import AppHeader from 'components/app-header/app-header';
    import AppSidebar from 'components/app-sidebar/app-sidebar';
    // 播放器组件
    import Player from 'components/player/player';
    // 登录组件
    import Login from 'components/login/login';

    export default {
        name: 'app',
        data() {
            return {};
        },
        computed: {
            ...mapState('appShell', [
                'appHeader',
                'pageTransitionName'
            ])
        },
        methods: {
            ...mapActions('appShell', [
                'setPageSwitching'
            ]),
            ...mapActions('appShell/appSidebar', [
                'showSidebar',
                'hideSidebar'
            ]),
            handleBeforeEnter(el) {
                this.setPageSwitching(true);
            },
            handleAfterEnter(el) {
                el.scrollTop = el.dataset.scrollTop;
                this.setPageSwitching(false);
            },
            handleBeforeLeave(el) {
                el.dataset.scrollTop = el.scrollTop;
            },
            // 返回按钮
            handleClickHeaderBack() {
                this.$router.go(-1);
            },
            handleClickHeaderMenu() {
                this.showSidebar();
            },
            handleHideSidebar() {
                this.hideSidebar();
            },
            handleShowSidebar() {
                this.showSidebar();
            }
        },
        components: {
            AppHeader,
            AppSidebar,
            Player,
            Login
        }
    };
</script>

<style lang="scss" scoped>
    @import "assets/sass/remAdaptive";
    @import "assets/sass/variables";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

    .app-shell {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        transform: translate3d(0, 0, 0);
    }

    .app-shell-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 20;
    }

    .app-shell-header-zIndex {
        z-index: 50;
    }

    .app-view-wrapper {
        flex: 1;
        position: relative;
        /*overflow: hidden;*/
        z-index: 10;
    }

    .app-view {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        /*overflow-x: hidden;*/
        /*overflow-y: auto;*/
        transition: transform 0.4s cubic-bezier(.55, 0, .1, 1);
        -webkit-overflow-scrolling: touch;
        // 隐藏掉scrollbar
        &::-webkit-scrollbar {
            width: 0;
            background: transparent;
        }
        &.app-view-with-header {
            top: px2rem($app-header-height + 66px);
        }
        &.slide-left-enter {
            transform: translate(100%, 0);
        }
        &.slide-right-enter {
            transform: translate(-100%, 0);
        }
        &.slide-right-leave-active {
            transform: translate(100%, 0);
        }
        &.slide-left-leave-active {
            transform: translate(-100%, 0);
        }
    }
</style>
