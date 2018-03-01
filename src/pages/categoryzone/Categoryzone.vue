<template>
    <div class="category-wrapper">
        <!--头部-->
        <div class="category-header" ref="header">
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
        <!--内容-->
        <scroll class="scroll"
                @pullingUp="pullingUp"
                ref="scroll"
        >
            <div class="category-content">
                <!--类别图片-->
                <div class="category-content-header">
                    <!--图片-->
                    <img class="category-img"
                         :alt="categoryImg"
                         :src="categoryImg"/>
                    <!--标题-->
                    <h1 class="category-header-title">{{categoryHeaderTitle}}</h1>
                </div>
                <!--歌单列表-->
                <chosen-song-llist :sortSongData="sortSongData"
                                   :sortId="sortId"
                                   :chosenTitle="chosenTitle"
                                   @selectNavigation="selectNavigation"
                                   @selectSongList="selectSongList"
                ></chosen-song-llist>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions} from 'vuex';
    // 分类歌单专辑列表mixin
    import {chosenSongList} from 'common/js/mixin';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 分类歌单专辑列表
    import ChosenSongLlist from 'base/chosen-song-list/chosen-song-list';

    export default {
        name: 'categoryzone',
        mixins: [chosenSongList],
        data() {
            return {
                /*
                 * 分类歌单id
                 * @type {Number}
                 * */
                categoryId: this.$router.currentRoute.params.id,
                /*
                * 歌单类别标题
                * @type {String}
                * */
                categoryHeaderTitle: this.$router.currentRoute.params.name,
                /*
                 * 分类歌单专辑列表标题
                 * @type {String}
                 * */
                chosenTitle: null,
                /*
                 * 歌单类别图片
                 * @type {String}
                 * */
                categoryImg: null
            };
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
            // 设置首页头部导航隐藏
            this.setAppHeader({
                show: false
            });
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: false
            });
        },
        watch: {
            // 监听分类歌单列表数据
            getSortSongData(newSortSongData) {
                if (!newSortSongData.list) {
                    return;
                }


                if (!this.categoryImg) {
                    // 设置歌单类别图片
                    this.categoryImg = newSortSongData.list[Math.floor(Math.random() * 10)].imgurl;
                }

                // 设置分类歌单专辑列表标题
                this.chosenTitle = `${this.$router.currentRoute.params.name}(${newSortSongData.sum})`;
            },
        },
        components: {
            Scroll,
            ChosenSongLlist
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .scroll {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        overflow: hidden;
    }

    /*外层*/
    .category-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /*头部*/
    .category-header {
        position: absolute;
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
    .category-content {
        width: 100%;
        .category-content-header {
            position: relative;
            width: 100%;
            height: px2rem(420px);
            overflow: hidden;
            background: url("../../common/img/category-header-defalut.png") no-repeat;
            background-size: cover;
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, .2);
            }
            /*图片*/
            .category-img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            }
            /*标题*/
            .category-header-title {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                margin-top: px2rem(-20px);
                margin-bottom: 0;
                line-height: 1;
                font-size: px2rem(72px);
                text-align: center;
                font-weight: 300;
                color: #fff;
                z-index: 3;
            }
        }
    }
</style>
