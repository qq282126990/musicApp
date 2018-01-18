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
        <scroll class="scroll" :data="dissRouter">
            <div>
                <!--热门歌单模块-->
                <div class="hot-songs">
                    <!--标题-->
                    <span class="title">热门歌单</span>
                    <!--内容-->
                    <div class="content">
                        <ul>
                            <li v-for="item in dissRouter.slice(1,11)" :key="item.categoryId">
                                <img
                                    :src="`https://y.gtimg.cn/music/photo/radio/track_radio_${item.categoryId + 6}_10_3.jpg?max_age=2592000`"
                                    :data-index="item.categoryId"
                                    @error="tagErrorImg"
                                    v-if="dissRouter"
                                />
                                <img :src="errorImg" v-else/>
                                <span class="name">{{item.categoryName}}</span>
                            </li>
                        </ul>
                    </div>
                    <span class="look-more" @click="lookMore">【查看更多】</span>
                </div>
                <!--歌单推荐模块-->
                <div class="song-recommended">
                    <!--标题-->
                    <span class="title">歌单推荐</span>
                    <!--内容-->
                    <div class="conent-wrapper">
                        <div>
                            <slider-switch :dotsTitle="dotsTitle"
                                           @scroll="scroll"
                                           @pageIndex="pageIndex"
                                           ref="sliderSwitch">
                                <!--全部-->
                                <div class="content">
                                    <ul  v-if="sortSongList.length">
                                        <li v-for="item in sortSongList" :key="item.listennum">
                                            <!--头像-->
                                            <img :src="item.imgurl"/>
                                        </li>
                                    </ul>
                                    <!--显示加载中效果-->
                                    <div class="loding-wrapper" v-else>
                                        <loading></loading>
                                    </div>
                                </div>
                                <!--其他-->
                                <div class="content"  v-for="item in dotsTitle" :key="dotsTitle.categoryName">
                                    <a>
                                        <img
                                            src="https://y.gtimg.cn/music/photo/radio/track_radio_167_10_3.jpg?max_age=2592000">
                                    </a>
                                </div>
                            </slider-switch>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions, mapGetters} from 'vuex';
    import Scroll from 'base/scroll/scroll';
    import Loading from 'base/loading/loading';
    // 滑动切换内容基础组件
    import SliderSwitch from 'base/slider-switch/slider-switch';

    // 分类歌单导航头部链接
    const TAG_URL_HEADER = 'https://y.gtimg.cn/music/photo/radio/track_radio_';

    export default {
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('asyncAjax/getDissTag'); // 获取分类歌单导航请求
            // await store.dispatch('asyncAjax/getSortSongData', {categoryId: this.categoryId, sin: this.sin, ein: this.ein}); // 获取分类歌单导航请求
        },
        data () {
            return {
                /*
                 * 获取分类歌单导航
                 * @types {Array}
                 * */
                dissRouter: [],
                /*
                 * 滑动切换头部导航标题
                 * @types {Object}
                 * */
                dotsTitle: [],
                /*
                 * 获取分类歌单歌单列表
                 * @types {Object}
                 * */
                sortSongList: [],
                /*
                 * 左右滑动距离
                 * @type {String}
                 * */
                scrollX: '',
                /*
                 * 滑动的当前页数
                 * @type {Number}
                 * */
                currentPageIndex: '',
                /*
                 * 分类歌单id
                 * @type {Number}
                 * @default 10000000
                 * */
                categoryId: 10000000,
                /*
                 * 分类歌单显示列表的起始位置
                 * @type {Number}
                 * @default 0
                 * */
                sin: 0,
                /*
                 * 分类歌单显示列表的结束位置
                 * @type {Number}
                 * @default 29
                 * */
                ein: 29,
                // 图片丢失时的默认图
                errorImg: '../../../static/img/default.jpg'
            };
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', ['dissNavigate']),
            ...mapGetters('asyncAjax', ['sortSongData'])
        },
        created () {
            // 请求分类歌单的歌单信息
            this._getSortSongData(this.categoryId, this.sin, this.ein);
        },
        mounted () {
            // 获取分类歌单导航
            this.dissRouter = this.normalizeDissTag(this.dissNavigate.slice(1, 6));

            // 滑动切换头部导航标题
            this.dotsTitle = this.randomDissTag(this.normalizeDissTag(this.dissNavigate.slice(1, 6))).slice(0, 4);

            // 设置滚动时否有回弹效果
            this.bounce(true);
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            // 监听滚动
            scroll (pos) {
                this.scrollX = pos.x;
            },
            // 监听左右滑动的页数
            pageIndex (index) {
                this.currentPageIndex = index;
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
            // 查看更多点击
            lookMore () {
            },
            _getSortSongData (categoryId, sin, ein) {
                this.getSortSongData({categoryId: categoryId, sin: sin, ein: ein});
            },
            // 随机显示分类歌单导航数据
            randomDissTag (data) {
                for (let i = data.length - 1; i >= 0; i--) {
                    let randomIndex = Math.floor(Math.random() * (i + 1));
                    let itemAtIndex = data[randomIndex];

                    data[randomIndex] = data[i];
                    data[i] = itemAtIndex;
                }

                return data;
            },
            // 初始化分类歌单导航数据
            normalizeDissTag (list) {
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
            ]),
            // 进行异步请求
            ...mapActions('asyncAjax', [
                'getSortSongData'
            ]),
            ...mapActions('appStore', [
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                'bounce'
            ])
        },
        // 当组件激活的调用
        activated () {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });
        },
        // 当组件停用时执行
        deactivated () {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        watch: {
            // 监听向右滑动
            scrollX (newScrollX) {
//                console.log(newScrollX);
            },
            // 监听左右滑动的页数
            currentPageIndex (index) {
                console.log(index);
            },
            // 监听分类歌单歌单列表变化
            sortSongData (newData) {
                this.sortSongList = newData.list;
            }
        },
        components: {
            SliderSwitch,
            Scroll,
            Loading
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
        height: 100%;
        overflow: hidden;
        z-index: 110;
        background: $hot-recommend-bg-color;
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
        padding-top: px2rem(20px);
        padding-bottom: px2rem(20px);
        box-sizing: border-box;
        width: 100%;
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
                    padding-top: px2rem(10px);
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
        overflow: hidden;
        .conent-wrapper {
            padding-top: px2rem(30px);
            width: 100%;
            .content {
                ul {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                li {
                    flex-basis: 50%;
                    box-sizing: border-box;
                    img {
                        margin-right: px2rem(10px);
                        border-top-right-radius: px2rem(15px);
                        border-bottom-right-radius: px2rem(15px);
                        width: 100%;
                    }
                }
                li:nth-child(2n + 2) {
                    img {
                        margin-left: px2rem(10px);
                        padding-right: 0;
                        border-top-left-radius: px2rem(15px);
                        border-bottom-left-radius: px2rem(15px);
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                }
            }
        }
    }

    /*加载中效果*/
    .loding-wrapper {
        padding-top: 50%;
        box-sizing: border-box;
        width: 100%;
        height: -webkit-fill-available;
    }
</style>
