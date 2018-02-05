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
        <scroll class="scroll"
                :data="dissRouter"
                :pullUpLoad="pullUpLoad"
                @pullingUp="pullingUp"
                ref="scroll">
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
                <div class="song-recommended" ref="SongRecommended">
                    <!--标题-->
                    <span class="title">歌单推荐</span>
                    <!--内容-->
                    <div class="conent-wrapper">
                        <div @touchstart.prevent="sliderTouchStart"
                             @touchmove.prevent="sliderTouchMove"
                             @touchend="sliderTouchEnd">
                            <slider-switch :dotsTitle="dotsTitle"
                                           @scroll="scroll"
                                           @pageIndex="pageIndex"
                                           ref="sliderSwitch">
                                <div class="content" v-for="(item, index) in dotsTitle"
                                     :key="dotsTitle.categoryName">
                                    <!--判断当前需要显示的页面 otherSortSongList[index]-->
                                    <ul v-if="index === newPageIndex && sortSongList[index].list"
                                        :key="item.categoryId">
                                        <li v-for="item in sortSongList[index].list" @click="selectItem(item)">
                                            <!--头像-->
                                            <img class="avatar" :src="item.imgurl"/>
                                            <!--播放量-->
                                            <div class="play-number-wrapper">
                                                <!--播放量数字-->
                                                <div class="play-number">
                                                    <i class="iconfont icon-erji"></i>
                                                    <span class="number">{{computedPlayNumber(item.listennum)}}</span>
                                                </div>
                                                <!--播放按钮-->
                                                <v-icon class="play">play_circle_outline</v-icon>
                                            </div>
                                            <!--歌单标题-->
                                            <span class="name">{{item.dissname}}</span>
                                            <!--发布人-->
                                            <div class="user-name">
                                                <span>{{item.creator.name}}</span>
                                                <!--正则判断是否显示logo-->
                                                <img class="logo"
                                                     src="https://y.gtimg.cn/music/common/upload/t_cm3_photo_publish/114042.png"
                                                     v-show="new RegExp('/*').test(`${item.creator.encrypt_uin}`)"/>
                                            </div>
                                        </li>
                                    </ul>
                                    <!--显示加载中效果-->
                                    <div class="loding-wrapper" v-else>
                                        <loading></loading>
                                        <span class="title">加载中...</span>
                                    </div>
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
    // 一些处理数据的方法
    import {normalizeDotsTitle} from 'common/js/sortSong.js';
    // 自定义歌单推荐数据
    import {createSongTableMessage} from 'common/js/songTableMessage';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // Loading组件
    import Loading from 'base/loading/loading';
    // 滑动切换内容基础组件
    import SliderSwitch from 'base/slider-switch/slider-switch';

    // 错误图片显示的图片路径
    const TAG_URL_HEADER = 'https://y.gtimg.cn/music/photo/radio/track_radio_';

    export default {
        // 调用 vuex action，在异步操作完成之前有顶部进度条提示
        async asyncData ({store}) {
            /**
             * 获取分类歌单导航请求
             * */
            await store.dispatch('asyncAjax/getDissTag');
            /*
             * 获取歌单推荐数据
             * @default categoryId = 10000000
             *          sin = 0
             *          ein = 29
             * */
            await store.dispatch('asyncAjax/getSortSongData', {
                categoryId: 10000000,
                sin: 0,
                ein: 29
            });
        },
        data () {
            return {
                /*
                 * 创建手指触摸操作
                 * 用于歌单推荐左右滑动
                 * */
                touch: {},
                /*
                 * 获取分类歌单导航
                 * @types {Array}
                 * */
                dissRouter: [],
                /*
                 * 滑动切换头部导航标题
                 * @types {Array}
                 * */
                dotsTitle: [],
                /*
                 * 获取当前页面对应的 categoryId 数组的位置
                 * @type {Number}
                 * */
                dotsTitleIndex: 0,
                /*
                 * 当前页面的页数
                 * @type {Number}
                 * */
                newPageIndex: 0,
                /*
                 * 获取分类歌单歌单列表
                 * @types {Array}
                 * */
                sortSongList: [{}, {}, {}, {}, {}],
                /*
                 * 左右滑动距离
                 * @type {Number}
                 * */
                scrollX: 0,
                /*
                 * 分类歌单id
                 * @type {Number}
                 * @default 10000000
                 * */
                categoryId: 10000000,
                /*
                 * 当前显示的页面的分类歌单id
                 * @type {Number}
                 * */
                currentCategoryId: 0,
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
                /*
                 * 设置歌单推荐列表请求 是否可以开始状态
                 *  @type {Boolean}
                 * */
                ajaxSortSongData: false,
                /*
                 * 设置歌单推荐列表时否可以向右滑动状态
                 * @type {Boolean}
                 * */
                touchRight: true,
                /*
                 * 图片丢失时的默认图
                 * @type {String}
                 * */
                errorImg: '../../../static/img/default.jpg',
                /*
                 * 设置是否开启上拉加载
                 * @type {Boolean}
                 * */
                pullUpLoad: true
            };
        },
        mounted () {
            // 获取分类歌单导航
            this.dissRouter = this._normalizeDissTag(this.dissNavigate.slice(1, 6));
            // 滑动切换头部导航标题
            this.dotsTitle = normalizeDotsTitle(this.dissNavigate).slice(0, 5);
            // 设置分类歌单列表
            this.sortSongList[0] = this.sortSongData;
            // 设置滚动时否有回弹效果
            this.bounce(false);
            // 设置上拉加载效果
            this.pullup(true);
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', ['dissNavigate']),
            // 获取歌单推荐列表信息数据
            ...mapGetters('asyncAjax', {
                sortSongData: 'sortSongData',
                getSortSongDataOK: 'setSortSongDataOK'
            })
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            /*
             * 监听左右滑动的页数
             * @param {Number}
             * */
            pageIndex (index) {
                // 获取当前显示的页数
                this.newPageIndex = index;

                // 如果当前页数不是最后一页就可以向右滑动
                if (index === 4) {
                    this.touchRight = false;
                }
                else {
                    this.touchRight = true;
                }
            },
            // 查看更多点击
            lookMore () {
            },
            // 上拉加载更多歌单列表方法
            pullingUp () {
                // 如果当前列表的数量小于30就不能上拉加载
                if (this.sortSongList[this.dotsTitleIndex].list && this.sortSongList[this.dotsTitleIndex].list.length < 30) {
                    return;
                }

                // 先判断当前页面时否正确 请求完成时才执行上拉加载
                if (this.newPageIndex === this.dotsTitleIndex && this.sortSongList[this.dotsTitleIndex].list && this.getSortSongDataOK) {
                    this.sin += 30;
                    this.ein += 30;

                    // 请求更多歌单列表
                    this.getSortSongData({
                        categoryId: this.dotsTitle[this.newPageIndex].categoryId, sin: this.sin, ein: this.ein
                    });
                }

                this.setSortSongDataOK(false);
            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            PullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.scroll.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.scroll.refresh();
            },
            // 点击选择歌单
            selectItem (data) {
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (data.dissid) {
                    // 把选中的专辑的数据存入 homeSonglist
                    this.homeSonglist(createSongTableMessage(data));
                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/home/${data.dissid}`
                    });
                }
            },
            /*
             *  歌单推荐列表切换滑动事件   手指开始滑动
             * */
            sliderTouchStart (e) {
                // 设置状态
                this.touch.initiated = true;
                // 记录手指第一次触摸的位置
                const touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
            },
            /*
             *  歌单推荐列表切换滑动事件   手指滑动中
             * */
            sliderTouchMove (e) {
                // 判断有没有触摸到有才执行下一步
                if (!this.touch.initiated) {
                    return;
                }

                // 获取移动的手指坐标
                const touch = e.touches[0];
                const deltaX = touch.pageX - this.touch.startX;
                const deltaY = touch.pageY - this.touch.startY;
                // 获取需要显示下一页的页数
                const nextPageIndex = Math.ceil(Math.abs(5 - 5 - this.dotsTitleIndex));

                // 判断当前触摸的Y轴是否大于X 是就不执行下一步 如果当前是主页并且向右滑动就不执行 和 如果是最后一页向左滑动
                if (Math.abs(deltaY) > Math.abs(deltaX) || this.dotsTitleIndex === 0) {
                    return;
                }

                // 获取滑动的宽度
                const left = nextPageIndex === this.dotsTitleIndex ? 0 : -window.innerWidth;
                const offsetwidth = Math.max(-window.innerWidth, left + deltaX);

                // 手指向右滑动
                if (offsetwidth > window.innerWidth / 5) {
                    // 如果切换页面了就重置分类歌单请求列表的起始位置 并且  把滚动位置重置为顶部
                    if (this.dotsTitleIndex === nextPageIndex) {
                        // this.sortSongList[this.dotsTitleIndex] = {};
                        // 重置滚动条位置
                        this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);

                        this.sin = 0;
                        this.ein = 29;
                    }

                    // 获取当前页面 dotsTitle数组中对应的categoryId
                    this.currentCategoryId = this.dotsTitle[this.dotsTitleIndex - 1].categoryId;

                    // 如果当前的页面数据与 otherSortSongList中的数据不对应就重新请求
                    if (this.currentCategoryId !== this.sortSongList[this.dotsTitleIndex - 1].categoryId) {
                        //  重新设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                        // 清空数据
                        this.sortSongList[this.dotsTitleIndex] = {};
                    }
                    // 判断如果当前页面有数据就不请求
                    else if (this.sortSongList[this.dotsTitleIndex].list) {
                        this.ajaxSortSongData = false;
                    }
                    //  否则设置歌单推荐列表请求可以开始
                    else {
                        this.ajaxSortSongData = true;
                    }
                }
                // 手指向左滑动
                else if (offsetwidth < -window.innerWidth / 5 && this.touchRight) {
                    // 如果切换页面了就重置分类歌单请求列表的起始位置 并且  把滚动位置重置为顶部
                    if (this.dotsTitleIndex === nextPageIndex) {
                        // this.sortSongList[this.dotsTitleIndex] = {};
                        // 重置滚动条位置
                        this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);

                        this.sin = 0;
                        this.ein = 29;
                    }

                    // 获取当前页面 dotsTitle数组中对应的categoryId
                    this.currentCategoryId = this.dotsTitle[this.dotsTitleIndex].categoryId;

                    // 如果当前的页面数据与 otherSortSongList中的数据不对应就重新请求
                    if (this.currentCategoryId !== this.sortSongList[this.dotsTitleIndex].categoryId) {
                        //  重新设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                        // 清空数据
                        this.sortSongList[this.dotsTitleIndex] = {};
                    }
                    // 判断如果当前页面有数据就不请求
                    else if (this.sortSongList[this.dotsTitleIndex].list) {
                        this.ajaxSortSongData = false;
                    }
                    //  否则设置歌单推荐列表请求可以开始
                    else {
                        this.ajaxSortSongData = true;
                    }
                }
            },
            /*
             *  歌单推荐列表切换滑动事件   手指滑动完成
             * */
            sliderTouchEnd () {
                // 滑动完成设置请求为false
                this.ajaxSortSongData = false;
            },
            /*
             * 监听滚动
             * @param {Number}
             * pos 滑动的位置
             * movingDirectionX 判断滑动方向
             * */
            scroll (pos, movingDirectionX) {
                this.scrollX = pos.x;
                // 判断向左向右滑动
                this.movingDirectionX = movingDirectionX;
            },
            /**
             * 计算播放量
             * @param {Number}
             */
            computedPlayNumber (playNumber) {
                // 如果当前播放量是1万才进行计算
                if (playNumber > 1e4) {
                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
                }
                return playNumber;
            },
            /*
             * 初始化分类歌单导航数据
             * @param {Number}
             * */
            _normalizeDissTag (list) {
                let ret = [];

                list.forEach((item) => {
                    item.items.forEach((data) => {
                        ret.push(data);
                    });
                });

                return ret.slice(0, 11);
            },
            /*
             * 歌单导航图片错误时显示的默认图片
             * @param {Object}
             * */
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
            // 设置主页头部导航是否显示
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            // 进行异步请求
            ...mapActions('asyncAjax', [
                'getSortSongData',
                'setSortSongDataOK'
            ]),
            // 其他状态
            ...mapActions('appStore', [
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                'bounce',
                /**
                 * 设置开启上拉加载
                 * @type {Boolean}
                 */
                'pullup',
                /*
                 * 主页选中的专辑数据
                 * type {Object}
                 */
                'homeSonglist'
            ])
        },
        // 当组件激活的调用
        activated () {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });

            // 重置滚动位置
            this.$refs.scroll.scrollTo(0, 0);
        },
        // 当组件停用时执行
        deactivated () {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        watch: {
            /*
             * 监听左右滑动
             * @param {Number}
             * */
            scrollX (newScrollX) {
                // 获取当前的页面页数
                this.dotsTitleIndex = Math.ceil(Math.abs(Math.round(newScrollX) / window.innerWidth));
            },
            /*
             * 获取歌单推荐列表请求是否可以开始
             * @param {Boolean}
             * */
            ajaxSortSongData (Boolean) {
                if (Boolean === true) {
                    this.getSortSongData({categoryId: this.currentCategoryId, sin: this.sin, ein: this.ein});
                }
            },
            /*
             * 监听分类歌单歌单列表变化
             * @param {Object}
             * */
            sortSongData (newData) {
                // 设置每个其他歌单推荐的数据
                // 如果对应的数组中已经有数据了就不执行
                switch (this.dotsTitleIndex) {
                    case 0:
                        // 歌曲列表的数量大于30才能进行拼接
                        if (this.sortSongList[0].list && this.sortSongList[0].list.length < 30) {
                            return;
                        }
                        if (!newData.list) {
                            return;
                        }
                        // 上拉加载更多歌单列表完成后刷新数据方法
                        this.PullingUpRefresh();
                        this.sortSongList[0].list = this.sortSongList[0].list.concat(newData.list);
                        break;
                    case 1:
                        if (this.sortSongList[1].list && this.sortSongList[1].list.length >= 30) {
                            // 上拉加载更多歌单列表完成后刷新数据方法
                            this.PullingUpRefresh();

                            if (!newData.list) {
                                return;
                            }
                            this.sortSongList[1].list = this.sortSongList[1].list.concat(newData.list);
                        }
                        else {
                            // 重置滚动条位置
                            this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);
                            this.sortSongList[1] = newData;
                        }
                        break;
                    case 2:
                        if (this.sortSongList[2].list && this.sortSongList[2].list.length >= 30) {
                            // 上拉加载更多歌单列表完成后刷新数据方法
                            this.PullingUpRefresh();
                            if (!newData.list) {
                                return;
                            }
                            this.sortSongList[2].list = this.sortSongList[2].list.concat(newData.list);
                        }
                        else {
                            // 重置滚动条位置
                            this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);
                            this.sortSongList[2] = newData;
                        }
                        break;
                    case 3:
                        if (this.sortSongList[3].list && this.sortSongList[3].list.length >= 30) {
                            // 上拉加载更多歌单列表完成后刷新数据方法
                            this.PullingUpRefresh();
                            if (!newData.list) {
                                return;
                            }
                            this.sortSongList[3].list = this.sortSongList[3].list.concat(newData.list);
                        }
                        else {
                            // 重置滚动条位置
                            this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);
                            this.sortSongList[3] = newData;
                        }
                        break;
                    case 4:
                        if (this.sortSongList[4].list && this.sortSongList[4].list.length >= 30) {
                            // 上拉加载更多歌单列表完成后刷新数据方法
                            this.PullingUpRefresh();
                            if (!newData.list) {
                                return;
                            }
                            this.sortSongList[4].list = this.sortSongList[4].list.concat(newData.list);
                        }
                        else {
                            // 重置滚动条位置
                            this.$refs.scroll.scrollToElement(this.$refs.SongRecommended, 1500);
                            this.sortSongList[4] = newData;
                        }
                        break;
                }
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
        box-shadow: 0 2px 10px #999;
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
        color: $hot-songs-title-color;
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
                    color: $hot-songs-title-color;
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
            padding-top: px2rem(10px); // 30
            width: 100%;
            .content {
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
                    .avatar {
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
                        color: $content-name-color;
                    }
                    /*播放量*/
                    .play-number-wrapper {
                        position: absolute;
                        margin-top: px2rem(-50px);
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
                                line-height: px2rem(24px);
                            }
                            /*icon*/
                            .icon-erji {
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
                            padding-left: px2rem(10px);
                            width: px2rem(24px);
                            height: px2rem(24px);
                        }
                    }
                }
                li:nth-child(2n + 2) {
                    .avatar {
                        padding-left: px2rem(10px);
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
        .title {
            box-sizing: border-box;
            padding: px2rem(20px) 0 0 px2rem(20px);
        }
    }
</style>
