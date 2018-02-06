<template>
    <div class="skeleton-wrapper">
        <section class="skeleton-block">
            <img width="100%" height="100%" src="/static/img/icons/startup.jpg">
        </section>
    </div>
</template>
c
<script>
import {mapActions} from 'vuex';

export default {
    name: 'skeleton',
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
            show: false
        });
        this.hideBottomNav();
    }
};
</script>

<style lang="stylus" scoped>

@import '~normalize.css';

.skeleton-wrapper
    overflow hidden
    .skeleton-header
        height $app-header-height
        background: $theme.primary
        box-shadow 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px rgba(0,0,0,.14), 0 1px 10px rgba(0,0,0,.12)

    .skeleton-block
        display flex
        flex-direction column
</style>
