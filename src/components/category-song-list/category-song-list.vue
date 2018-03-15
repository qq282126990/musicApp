<template>
    <div class="wrapper">
        <div class="header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--头部标题-->
            <div class="header-title">
                <span>分类歌单</span>
            </div>
        </div>
        <scroll
            class="scroll"
            @pullingUp="pullingUp"
            ref="scroll"
        >
            <div>
                <!--热门分类-->
                <div class="hot-category" ref="hotCategory">
                    <!--标题-->
                    <span class="category-title">热门分类</span>
                    <!--内容-->
                    <div class="category-content" v-show="categoryNavigation.length">
                        <ul class="content-table">
                            <li>
                                <p v-for="(item, index) in categoryNavigation.slice(0,3)"
                                   :class="{'one': index== 0}"
                                   :key="item.categoryName"
                                   @click="selectCategoryNavigation(item)"
                                >
                                    <span class="name">{{item.categoryName}}</span>
                                </p>
                            </li>
                            <li>
                                <p v-for="(item, index) in categoryNavigation.slice(3,7)"
                                   :key="item.categoryName"
                                   @click="selectCategoryNavigation(item)"
                                >
                                    <span class="name">{{item.categoryName}}</span>
                                </p>
                            </li>
                            <li>
                                <p v-for="(item, index) in categoryNavigation.slice(7)"
                                   :key="item.categoryName"
                                   @click="selectCategoryNavigation(item)"
                                >
                                    <span class="name">{{item.categoryName}}</span>
                                </p>
                            </li>
                        </ul>
                        <div class="look-move">
                            <h2>查看全部分类</h2>
                            <i class="material-icons icon">keyboard_arrow_right</i>
                        </div>
                    </div>
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
        <!--loading-->
        <div class="loading-wrapper" v-show="!categoryNavigation.length">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';
    // 分类歌单专辑列表mixin
    import {chosenSongList} from 'common/js/mixin';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';
    // 分类歌单专辑列表
    import ChosenSongLlist from 'base/chosen-song-list/chosen-song-list';

    export default {
        mixins: [chosenSongList],
        data() {
            return {
                /*
                 * 分类歌单id
                 * @type {Number}
                 * @default 10000000
                 * */
                categoryId: 10000000,
                /*
                 * 获取分类歌单导航
                 * @types {Array}
                 * */
                categoryNavigation: [],
                /*
                 * loading显示的文字
                 * @type {String}
                 * */
                loadingText: '加载中...',
                /*
                 * 分类歌单专辑列表标题
                 * @type {String}
                 * */
                chosenTitle: '精选歌单'
            };
        },
        mounted() {
            // 一些初始化操作
            this._initSome();
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', {
                /*
                 * 获取分类歌单导航请求
                 * @type {Array}
                 * */
                getCategoryNavigation: 'categoryNavigation',
                /*
                 * 获取分类歌单歌曲信息
                 * @type {Array}
                 * */
                getSortSongData: 'sortSongData'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome() {
                // 获取分类歌单导航请求
                this.setCategoryNavigation();
            },
            // 返回按钮
            back() {
                this.$router.back();
            },
            // 选择歌单类型导航
            selectCategoryNavigation(nvigation) {
                console.log(nvigation);
                // 跳转到对应类别歌单
                this.$router.push({
                    path: `/categoryzone/${nvigation.categoryName}/${nvigation.categoryId}`
                });
            },
            /*
             * 自定义分类歌单导航数据
             * @param {Number}
             * */
            _normalizeCategoryNavigation(list) {
                let ret = [];

                list.forEach((item) => {
                    item.items.forEach((data) => {
                        ret.push(data);
                    });
                });

                return ret.slice(0, 11);
            },
            ...mapActions('asyncAjax', {
                /**
                 * 获取分类歌单导航请求
                 * */
                setCategoryNavigation: 'getCategoryNavigation'
            }),
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

            if (/^(\/home\/homeRecommend)/.test(this.$route.path)) {
                // 设置滚动位置
                this.$refs.scroll.scrollTo(0, -this.$refs.hotCategory.clientHeight);

                this.$refs.scroll.refresh();
            }
            else {
                // 设置滚动位置
                this.$refs.scroll.scrollTo(0, 0, 1000);
                this.$refs.scroll.refresh();
            }
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: false
            });
        },
        watch: {
            // 监听歌单导航数据
            getCategoryNavigation(newCategoryNavigation) {
                this.categoryNavigation = this._normalizeCategoryNavigation(newCategoryNavigation.slice(1, 6));
            },
            getSortSongData () {
                this.$nextTick(() => {
                    if (/^(\/home\/homeRecommend)/.test(this.$route.path)) {
                        // 设置滚动位置
                        this.$refs.scroll.scrollTo(0, -this.$refs.hotCategory.clientHeight, 1000);
                        this.$refs.scroll.refresh();
                    }
                    else {
                        // 设置滚动位置
                        this.$refs.scroll.scrollTo(0, 0);
                        this.$refs.scroll.refresh();
                    }
                });
            }
        },
        components: {
            Scroll,
            Loading,
            ChosenSongLlist
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*外层*/
    .wrapper {
        position: fixed;
        height: 100%;
        overflow: hidden;
        z-index: 110;
        background: $hot-recommend-bg-color;
    }

    .scroll {
        height: 100%;
        overflow: hidden;
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 30%;
        z-index: 10;
    }

    /*下拉加载时显示的Loading效果*/
    .has-more {
        padding: px2rem(60px) 0;
        width: 100%;
    }

    /*没有更多了*/
    .none-more {
        position: absolute;
        bottom: px2rem(-198px);
        width: 100%;
        line-height: px2rem(200px);
        height: px2rem(200px);
        color: #b6b6b6;
        background: $none-more;
        .more-title {
            font-size: px2rem(32px);
            vertical-align: middle;
        }
        .icon {
            font-size: px2rem(52px);
            color: #b6b6b6;
        }
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

    /*热门歌单*/
    .hot-category {
        box-sizing: border-box;
        width: 100%;
        height: px2rem(490px);
        /*标题*/
        .category-title {
            display: block;
            padding: px2rem(20px);
            text-align: left;
            line-height: px2rem(60px);
            font-size: px2rem(35px);
            color: $hot-songs-title-color;
        }
        /*内容*/
        .category-content {
            width: 100%;
            padding: 0 px2rem(10px) 0 px2rem(20px);
            .content-table {
                width: 100%;
                display: flex;
                li {
                    flex-basis: 33.3%;
                    p {
                        margin: 0;
                        padding: 0 px2rem(10px) px2rem(10px) 0;
                        font-size: px2rem(28px);
                        line-height: px2rem(68px);
                        height: px2rem(78px);
                        .name {
                            display: block;
                            border-radius: px2rem(5px);
                            background: #f8f8f8;
                        }
                    }
                }
                .one {
                    line-height: px2rem(146px);
                    height: px2rem(156px);
                }
            }
            .look-move {
                border-radius: px2rem(5px);
                background: #f8f8f8;
                line-height: px2rem(68px);
                height: px2rem(78px);
                h2 {
                    display: inline-block;
                    font-size: px2rem(28px);
                }
                .icon {
                    position: relative;
                    top: px2rem(2px);
                    display: inline-block;
                }
            }
        }
    }

    /*精选歌单*/
    .chosen-song-list {
        box-sizing: border-box;
        width: 100%;
        .chosen-header {
            display: flex;
            justify-content: space-between;
            padding: px2rem(20px);
            line-height: px2rem(60px);
        }
        .chosen-title {
            font-size: px2rem(35px);
            color: $hot-songs-title-color;
        }
        .chosen-heade-select {
            font-size: px2rem(28px);
            color: $hot-songs-title-color;
            p {
                margin: 0;
                padding: 0 px2rem(15px);
                display: inline-block;
            }
            p:last-child {
                padding-right: 0;
            }
            .active {
                color: $chosen-heade-select;
            }
        }
        .chosen-content {
            padding-bottom: px2rem(200px);
            width: 100%;
            overflow: hidden;
            ul {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
            li {
                position: relative;
                flex-basis: 50%;
                box-sizing: border-box;
                overflow: hidden;
                text-align: left;
                /*歌单图片*/
                .chosen-avatar {
                    display: block;
                    padding-right: px2rem(10px);
                    border-top-right-radius: px2rem(15px);
                    border-bottom-right-radius: px2rem(15px);
                    width: 100%;
                    min-width: px2rem(375px);
                    min-height: px2rem(375px);
                }
                /*歌单标题*/
                .name {
                    display: block;
                    padding: px2rem(16px) px2rem(20px);
                    text-align: left;
                    line-height: px2rem(40px);
                    font-size: px2rem(24px);
                    height: px2rem(76px);
                    max-height: px2rem(76px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: $content-name-color;
                }
                /*播放量*/
                .play-number-wrapper {
                    position: absolute;
                    margin-top: px2rem(-50px);
                    margin-left: px2rem(-10px);
                    padding: 0 px2rem(20px);
                    box-sizing: border-box;
                    display: flex;
                    align-items: flex-end;
                    width: 100%;
                    height: px2rem(50px);
                    color: $title-color;
                    background: $play-number-bgcolor;
                    z-index: 2;
                    /*播放量数字*/
                    .play-number {
                        display: flex;
                        flex: 1;
                        padding: 0 px2rem(20px) px2rem(10px) 0;
                        /*title*/
                        .number {
                            flex: 1;
                            padding-left: px2rem(15px);
                            font-size: px2rem(24px);
                            line-height: px2rem(32px);
                        }
                        /*icon*/
                        .icon-erji {
                            position: relative;
                            top: px2rem(2px);
                            flex: 0 0 px2rem(24px);
                            font-size: px2rem(24px);
                        }
                    }
                    /*播放按钮*/
                    .play {
                        padding-bottom: px2rem(4px);
                        font-size: px2rem(48px);
                    }
                }
                /*发布人*/
                .user-name {
                    display: flex;
                    align-items: flex-end;
                    padding: 0 px2rem(20px) px2rem(20px) px2rem(20px);
                    font-size: px2rem(24px);
                    color: $user-name-color;
                    span {
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .logo {
                        display: inline-block;
                        margin-left: px2rem(10px);
                        width: px2rem(24px);
                        height: px2rem(24px);
                    }
                }
            }
            li:nth-child(2n + 2) {
                .chosen-avatar {
                    padding-left: px2rem(10px);
                    padding-right: 0;
                    border-top-left-radius: px2rem(15px);
                    border-bottom-left-radius: px2rem(15px);
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                /*播放量*/
                .play-number-wrapper {
                    margin-left: px2rem(10px);
                    padding-left: 0;
                    /*播放量数字*/
                    .play-number {
                        /*icon*/
                        .icon-erji {
                            padding-left: px2rem(10px);
                        }
                    }
                    /*播放按钮*/
                    .play {
                        padding-right: px2rem(10px);
                    }
                }
            }
        }
    }
</style>
