<template>
    <transition name="fade">
        <div class="search-box-wrapper">
            <!--头部-->
            <search-box></search-box>
            <div class="shortcut-wrapper">
                <scroll class="shortcut">
                    <div>
                        <div class="hot-key">
                            <h1 class="title">热门搜索</h1>
                            <ul>
                                <li class="item" v-for="item in hotKey">
                                    <span>{{item.k}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </scroll>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {mapActions} from 'vuex';
    // 搜索框
    import SearchBox from 'base/search-box/search-box'
    // 滚动组件
    import Scroll from 'base/scroll/scroll'

    export default {
        mounted() {
            this.setRefreshDelay(120);
        },
        methods: {
            ...mapActions('appStore', {
                /**
                 * 刷新延迟
                 * @type {Number}
                 */
                setRefreshDelay: 'refreshDelay'
            })
        },
        components: {
            SearchBox,
            Scroll
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .fade-enter{
        padding-top: px2rem(88px);
    }

    .search-box-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $search-box-wrapper-bgcolor;
    }
    .shortcut-wrapper{
        position: fixed;
        top: px2rem(120px);
        bottom: 0;
        width: 100%;
        .shortcut{
            height: 100%;
            overflow: hidden;
            .hot-key{
                margin: 0 px2rem(40px) px2rem(40px) px2rem(40px);
                .title{
                    font-size: px2rem(36px);
                    margin-bottom: px2rem(40px);
                    color: #999;
                }
            }
        }
    }
</style>
