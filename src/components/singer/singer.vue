<template>
    <div>
        <!--头部-->
        <div class="singer-wrapper-header">
            <!--返回按钮-->
            <div class="back">
                <v-icon class="icon">arrow_back</v-icon>
            </div>
            <!--标题-->
            <div class="header-title">
                <span>歌手</span>
            </div>
        </div>
        <scroll class="scroll-wrapper">
            <ul>
                <!--列表-->
                <li class="singer-list" v-for="list in getSingerList">
                    <!--标题-->
                    <h2 class="list-title">{{list.title}}</h2>
                    <!--歌手列表-->
                    <ul>
                        <li v-for="item in list.items" class="list-singer-item">
                            <!--头像-->
                            <img class="avatar" v-lazy="item.avatar">
                            <!--名称-->
                            <span class="name">{{item.name}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 滚动组件
    import Scroll from 'base/scroll/scroll'

    export default {
        computed: {
            ...mapState('asyncAjax', {
                getSingerList: 'singerList'
            })
        },
        mounted () {
            // 获取歌手列表接口
            this.setSingerList();
        },
        methods: {
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                /*
                * 获取歌手列表接口
                * */
                setSingerList: 'getSingerList'
            }),
            ...mapActions('appStore', {
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData'
            })
        },
        // 组件激活
        activated () {
            // 设置首页头部导航
            this.setAppHeader({
                show: false
            });
        },
        watch: {
            getSingerList (newSingerList) {
                this.setScrollData(newSingerList);
                console.log(newSingerList);
            }
        },
        components: {
            Scroll
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /*头部*/
    .singer-wrapper-header {
        display: flex;
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
        background: $header-color;
        /*返回按钮*/
        .back {
            position: absolute;
            top: 0;
            z-index: 50;
            .icon {
                display: block;
                padding: px2rem(10px);
                font-size: px2rem(60px);
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
            line-height: 1.12rem;
            font-size: 0.48rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
            z-index: 40;
        }
    }

    /*滚动组件*/
    .scroll-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    /*歌手列表*/
    .singer-list {
        padding-bottom: px2rem(60px);
        /*标题*/
        .list-title {
            text-align: left;
            height: px2rem(60px);
            line-height: px2rem(60px);
            padding-left: px2rem(40px);
            font-size: px2rem(26px);
            color: $singer-list-title;
        }
        /*歌手列表*/
        .list-singer-item {
            display: flex;
            align-items: center;
            padding: 0 0 0 px2rem(30px);
            /*头像*/
            .avatar {
                width: px2rem(80px);
                height: px2rem(80px);
                border-radius: 50%;
            }
            /*名称*/
            .name {
                line-height: px2rem(120px);
                margin-left: px2rem(40px);
                text-align: left;
                font-size: px2rem(28px);
                width: 100%;
                height: px2rem(120px);
                border-bottom: px2rem(1px) solid rgba(223, 223, 223, .8);
            }
        }
    }

</style>
