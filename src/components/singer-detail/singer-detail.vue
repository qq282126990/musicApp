<template>
    <div class="scroll-wrapper">
        <div class="singer-message" v-show="this.getSingerMessage.id">
            <!--榜单图片-->
            <div class="bg-image" :style="bgImage" ref="bgImage">
                <!--返回按钮-->
                <div class="back" @click="back">
                    <v-icon class="icon">arrow_back</v-icon>
                </div>
                <!--标题-->
                <h1 class="bg-image-title">{{this.getSingerMessage.name}}</h1>
                <!--粉丝数-->
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapActions} from 'vuex';

    // 设置歌曲信息总线程
    import Bus from '../../event-bus';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        mounted () {
            // 如果没有数据就返回上一级
            if (!this.getSingerMessage.id) {
                this.$router.back();
            }

            // 获取歌手歌曲列表接口
            this.setSingerDetail(this.getSingerMessage.id);
        },
        computed: {
            bgImage () {
                if (this.getSingerMessage.id) {
                    return `background-image:url(${this.getSingerMessage.avatar})`
                }
                return ''
            },
            ...mapGetters('appStore', {
                getSingerMessage: 'singerMessage'
            })
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            ...mapActions('asyncAjax', {
                /*
                * 获取歌手歌曲列表接口
                * */
                setSingerDetail: 'getSingerDetail'
            })
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

    .scroll-wrapper {
        height: 100%;
        overflow: hidden;
    }

    .singer-message {
        /*榜单图片*/
        .bg-image {
            position: relative;
            width: 100%;
            height: px2rem(548px);
            background-size: cover;
            background-position: center;
        }
        /*返回按钮*/
        .back {
            position: absolute;
            top: px2rem(20px);
            z-index: 50;
            .icon {
                display: block;
                padding: 0 px2rem(20px) px2rem(20px) px2rem(20px);
                font-size: px2rem(60px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .bg-image-title {
            margin: 0;
            position: absolute;
            bottom: px2rem(70px);
            width: 100%;
            text-align: center;
            font-size: px2rem(50px);
            color: #fff;
        }
    }
</style>
