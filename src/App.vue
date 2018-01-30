<template>
    <div id="app">
        <div>
            <div class="app-shell">
                <app-header
                    class="app-shell-header"
                    :class="{'app-shell-header-zIndex': !maskLayer}"
                    @click-menu="handleClickHeaderMenu"
                    @click-back="handleClickHeaderBack"
                >
                </app-header>
                <app-sidebar
                    @hide-sidebar="handleHideSidebar"
                    @show-sidebar="handleShowSidebar"
                >
                </app-sidebar>
                <div class="app-view-wrapper">
                    <transition
                        :name="pageTransitionName === undefined ? null : pageTransitionName"
                        @before-enter="handleBeforeEnter"
                        @after-enter="handleAfterEnter">
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
                        @after-enter="handleAfterEnter">
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
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import AppHeader from '@/components/AppHeader';
    import AppSidebar from '@/components/AppSidebar';
    import Player from 'components/player/player';

    export default {
        name: 'app',
        components: {
            AppHeader,
            AppSidebar,
            Player
        },
        data() {
            return {};
        },
        computed: {
            ...mapState('appShell', [
                'appHeader',
                'pageTransitionName'
            ]),
            ...mapState('appStore', [
                // 获取遮罩层状态
                'maskLayer'
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
                this.setPageSwitching(false);
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
        }
    };
</script>

<style lang="stylus">
    #app
        font-family 'Avenir', Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
</style>

<style lang="scss" scoped>
    @import "common/sass/remAdaptive";
    @import "common/sass/variables";

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
        /*background: rgba(13, 12, 18, 1);*/
    }

    .app-shell-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }

    .app-shell-header-zIndex {
        z-index: 50;
    }

    .app-view-wrapper {
        flex: 1;
        position: relative;
        overflow: hidden;
        z-index: 10;
    }

    .app-view {
        position: absolute;
        top: 0;
        right: 0;
        bottom: px2rem(120px);
        left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        transition: transform 0.4s cubic-bezier(.55, 0, .1, 1);
        -webkit-overflow-scrolling: touch;
        // 隐藏掉scrollbar
        &::-webkit-scrollbar {
            width: 0px;
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
