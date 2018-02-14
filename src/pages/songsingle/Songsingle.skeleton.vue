<template>
    <div class="music-list-wrapper">
        <div class="music-list-header" ref="header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--头部标题-->
            <div class="header-title">
                <!--未滚动的标题-->
                <span></span>
            </div>
        </div>
        <div class="music-list-content">
            <div class="loading-wrapper">
                <loading :loadingText="loadingText"></loading>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import Loading from 'base/loading/loading';

    export default {
        name: 'skeleton',
        data () {
            return {
                loadingText: '加载中...'
            }
        },
        methods: {
            // 返回按钮
            back() {
                this.$router.back();
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ])
        },
        activated() {
            this.setAppHeader({
                show: false
            });
        },
        components: {
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*外层*/
    .music-list-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        background: $audiotrack-color;
    }

    /*头部*/
    .music-list-header {
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
        /*返回按钮*/
        .back {
            position: absolute;
            top: 0;
            z-index: 50;
            .icon-fanhui1-copy {
                display: block;
                padding: px2rem(20px);
                font-size: px2rem(44px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .header-title {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            margin: 0;
            text-align: center;
            line-height: px2rem(84px);
            font-size: px2rem(36px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $title-color;
            z-index: 40;
        }
    }

    /*内容*/
    .music-list-content {
        position: fixed;
        top: px2rem(84px);
        bottom: 0;
        width: 100%;
        background: #fff;
    }

    /*loading*/
    .loading-wrapper {
        padding-top: 50%;
    }
</style>
