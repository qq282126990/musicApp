<template>
    <div class="wrapper">
        <div class="header" ref="header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--头部标题-->
            <div class="title">
                <span>分类歌单</span>
            </div>
        </div>
        <scroll class="scroll" :data="dissTag">
            <div>
                <!--热门歌单模块-->
                <div class="hot-songs">
                    <!--标题-->
                    <span class="title">热门歌单</span>
                    <!--内容-->
                    <div class="content">
                        <ul>
                            <li v-for="item in dissTag.slice(1,11)" :key="item.categoryId">
                                <img
                                    :src="`https://y.gtimg.cn/music/photo/radio/track_radio_${item.categoryId + 6}_10_3.jpg?max_age=2592000`"
                                    @error="tagErrorImg" :data-index="item.categoryId"/>
                                <span class="name">{{item.categoryName}}</span>
                            </li>
                        </ul>
                    </div>
                    <span class="look-more" @click="lookMore">【查看更多】</span>
                </div>
                <!--歌单推荐模块-->
                <div class="song-recommended">
                    <span class="title">歌单推荐</span>
                    <div class="conent">
                        <slider-switch>
                            <div>
                                <img class="slider-switch-item"
                                     src="https://p.qpic.cn/music_cover/bMoY206eicbphwEh4kRnrkahJLh7Y3LA1CtCB3abgQe3fqFiahYVm3YQ/300?n=1">
                            </div>
                            <div>
                                <img class="slider-switch-item"
                                     src="https://y.gtimg.cn/music/photo/radio/track_radio_167_10_3.jpg?max_age=2592000">
                            </div>

                        </slider-switch>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions} from 'vuex';
    import {getDissTag} from 'api/categorySong';
    import {ERR_OK} from 'api/config';
    import Scroll from 'base/scroll/scroll';
    // 滑动切换内容基础组件
    import sliderSwitch from 'base/slider-switch/slider-switch';

    // 分类歌单导航头部链接
    const TAG_URL_HEADER = 'https://y.gtimg.cn/music/photo/radio/track_radio_';

    export default {
        data () {
            return {
                /*
                 * 分类歌单导航
                 * @types {Array}
                 * */
                dissTag: [],
                // 图片丢失时的默认图
                errorImg: '../../../static/img/default.jpg'
            };
        },
        mounted () {
            // 获取分类歌单导航
            this.getDissTag();
        },
        methods: {
            // 返回按钮
            back() {
                this.$router.back();
            },
            // 歌单导航图片错误时显示的默认图片
            tagErrorImg (e) {
                // 设置错误图片
                switch (e.currentTarget.dataset.index) {
                    case '166':
                        e.currentTarget.src = `${TAG_URL_HEADER}${parseInt(e.currentTarget.dataset.index) + 1}_10_3.jpg?max_age=2592000`;
                        break;
                    case '204':
                        e.currentTarget.src = `${TAG_URL_HEADER}${parseInt(e.currentTarget.dataset.index) + 20}_10_3.jpg?max_age=2592000`;
                        break;
                    case '15':
                        e.currentTarget.src = `${TAG_URL_HEADER}${parseInt(e.currentTarget.dataset.index) + 135}_10_3.jpg?max_age=2592000`;
                        break;
                    case '6':
                        e.currentTarget.src = `${TAG_URL_HEADER}${parseInt(e.currentTarget.dataset.index) + 200}_10_3.jpg?max_age=2592000`;
                        break;
                    default:
                        // 默认错误图片
                        e.currentTarget.src = this.errorImg;
                }
            },
            // 获取分类歌单导航
            getDissTag() {
                getDissTag().then((res) => {
                    if (res.code === ERR_OK) {
                        this.dissTag = this.normalizeDissTag(res.data.categories.slice(1, 6));
                    }
                });
            },
            // 查看更多点击
            lookMore () {
            },
            // 初始化分类歌单导航数据
            normalizeDissTag(list) {
                let ret = [];

                list.forEach((item) => {
                    item.items.forEach((data) => {
                        ret.push(data);
                    });
                });

                return ret.slice(0, 11);
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ])
        },
        // 当组件激活的调用
        activated() {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        components: {
            sliderSwitch,
            Scroll
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .scroll {
        height: 100%;
        overflow: hidden;
    }

    /*外层*/
    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 110;
        background: $header-color;
    }

    /*头部*/
    .header {
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
            .icon-fanhui1-copy {
                display: block;
                padding: px2rem(20px);
                font-size: px2rem(44px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .title {
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

    /*标题*/
    .title {
        display: block;
        line-height: px2rem(60px);
        font-size: px2rem(32px);
        color: $title-color;
    }

    /*热门歌单模块*/
    .hot-songs {
        margin-top: px2rem(20px);
        box-sizing: border-box;
        width: 100%;
        min-height: px2rem(400px);
        /*内容*/
        .content {
            padding: 0 px2rem(20px);
            box-sizing: border-box;
            width: 100%;
            ul {
                display: flex;
                flex-wrap: wrap;
            }
            li {
                padding: px2rem(20px);
                flex-basis: 14%;
                img {
                    border-radius: 50%;
                    width: px2rem(102px);
                    height: px2rem(102px);
                }
                .name {
                    display: block;
                    margin-top: px2rem(10px);
                    font-size: px2rem(28px);
                    text-align: center;
                    width: px2rem(102px);
                    color: $title-color;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
        /*查看更多*/
        .look-more {
            display: block;
            line-height: px2rem(60px);
            font-size: px2rem(28px);
            color: $look-more-color;
        }
    }

    /*歌曲推荐模块*/
    .song-recommended {
        width: 100%;
        height: 900px;
        overflow: hidden;
        .conent {
            width: 100%;
            height: 100%;
        }
    }
</style>
