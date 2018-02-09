<template>
    <div class="app-not-found-page">
        <div class="app-not-found-title text-xs-center">
            <div class="not-found-avatar">
                <v-icon class="not-found-avatar-icon">info</v-icon>
            </div>
            <p>页面未找到</p>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'notFound',
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'hideBottomNav'
        ])
    },
    activated() {
        this.setAppHeader({
            title: '页面未找到',
            show: true,
            showMenu: false,
            showBack: true,
            showLogo: false,
            actions: []
        });
        this.hideBottomNav();
    }
};
</script>

<style lang="stylus" scoped>

.app-not-found-title
    margin-top 50px
    color #666
    font-size 24px
    font-weight bold

.not-found-avatar-icon
    width 120px
    height 120px
    font-size 100px

</style>
