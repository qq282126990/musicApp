<template>
    <div id="app">
        <div class="app-shell app-shell-bottom-navigation">
            <app-header
                class="app-shell-header"
                @click-menu="handleClickHeaderMenu"
                @click-back="handleClickHeaderBack">
                <template slot="logo"></template>
            </app-header>
            <app-sidebar
                @hide-sidebar = "handleHideSidebar"
                @show-sidebar = "handleShowSidebar"
            >
                <template slot="logo"><span></span></template>
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
                                'app-view-with-footer': appBottomNavigator.show
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
                            'app-view-with-footer': appBottomNavigator.show
                        }"></router-view>
                </transition>
            </div>
            <app-bottom-navigator
                class="app-shell-footer"
                @click-nav="handleClickBottomNav">
            </app-bottom-navigator>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import AppBottomNavigator from '@/components/AppBottomNavigator';

export default {
    name: 'app',
    components: {
        AppHeader,
        AppSidebar,
        AppBottomNavigator
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('appShell', [
            'appHeader',
            'appBottomNavigator',
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
        ...mapActions('appShell/appBottomNavigator', [
            'activateBottomNav'
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
        },
        handleClickBottomNav({name}) {
            this.activateBottomNav(name);
        }
    }
};
</script>

<style lang="stylus">
body
    background-color: $material-theme.bg-color

#app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50
    position static

</style>

<style lang="stylus" scoped>
.app-shell
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%
    display flex
    flex-direction column
    transform translate3d(0, 0, 0)

    .app-shell-header
        position fixed
        top 0
        left 0
        right 0

    .app-shell-footer
        position fixed
        bottom 0
        left 0
        right 0

    .app-view-wrapper
        flex 1
        position relative
        overflow hidden

        .app-view
            position absolute
            top 0
            right 0
            bottom 0
            left 0
            overflow-x hidden
            overflow-y auto
            transition transform 0.4s cubic-bezier(.55, 0, .1, 1)
            background: $material-theme.bg-color
            color: $material-theme.text-color

            // 隐藏掉scrollbar
            &::-webkit-scrollbar
                width 0px
                background transparent

            &.app-view-with-header
                top $app-header-height

            &.app-view-with-footer
                bottom $app-footer-height

            &.slide-left-enter
                transform translate(100%, 0)

            &.slide-right-enter
                transform translate(-100%, 0)

            &.slide-right-leave-active
                transform translate(100%, 0)

            &.slide-left-leave-active
                transform translate(-100%, 0)
</style>
