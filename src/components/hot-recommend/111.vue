<template>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions, mapGetters} from 'vuex';
    import Scroll from 'base/scroll/scroll';
    import Loading from 'base/loading/loading';
    import {normalizeDotsTitle} from 'common/js/sortSong.js';
    // 滑动切换内容基础组件
    import SliderSwitch from 'base/slider-switch/slider-switch';

    // 分类歌单导航头部链接
    const TAG_URL_HEADER = 'https://y.gtimg.cn/music/photo/radio/track_radio_';

    export default {
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            /**
             * 获取分类歌单导航请求
             * */
            await store.dispatch('asyncAjax/getDissTag'); //
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
                 * 获取分类歌单歌单列表
                 * @types {Array}
                 * */
                // sortSongList: [],
                /*
                 * 其他分类歌单歌单列表
                 * @types {Array}
                 * */
                sortSongList: [{}, {}, {}, {}, {}],
                /*
                 * 左右滑动距离
                 * @type {Number}
                 * */
                scrollX: 0,
                /*
                 * 需要滑动到的页数
                 * @type {Number}
                 * */
                newPageIndex: 0,
                /*
                 * 当前显示的页面的分类歌单id
                 * @type {Number}
                 * */
                currentCategoryId: 0,
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
                errorImg: '../../../static/img/default.jpg'
            };
        },
        mounted () {
            // 获取分类歌单导航
            this.dissRouter = this._normalizeDissTag(this.dissNavigate.slice(1, 6));
            // 滑动切换头部导航标题
            this.dotsTitle = normalizeDotsTitle(this.dissNavigate).slice(0, 5);
            // 获取分类歌单歌单列表
//            this.sortSongList = this.sortSongData.list;
            this.sortSongList[0] = this.sortSongData;
            // 设置滚动时否有回弹效果
            this.bounce(true);
            // 设置上拉加载效果
            this.pullup(true);
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', ['dissNavigate']),
            // 获取歌单推荐列表信息数据
            ...mapGetters('asyncAjax', ['sortSongData'])
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
                // 滑动完成设置请求为false
                this.ajaxSortSongData = false;
                // 如果当前页数不是最后一页就可以向右滑动
                if (index === 4) {
                    this.touchRight = false;
                }
                else {
                    this.touchRight = true;
                }
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
            /*
             * 上拉加载更多歌单列表方法
             * */
            loadMoreSongListSort () {
                console.log(this.newPageIndex);
            },
            // 查看更多点击
            lookMore () {
            },
            /*
             *  歌单推荐列表切换滑动事件   手指开始滑动
             * */
            sliderTouchStart(e) {
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
            sliderTouchMove(e) {
                // 判断有没有触摸到有才执行下一步
                if (!this.touch.initiated) {
                    return;
                }
                // 获取移动的手指坐标
                const touch = e.touches[0];
                const deltaX = touch.pageX - this.touch.startX;
                const deltaY = touch.pageY - this.touch.startY;
                // 获取需要显示下一页的页数
                const nextPageIndex = Math.abs(5 - 5 - this.dotsTitleIndex);

                // 判断当前触摸的Y轴是否大于X 是就不执行下一步 如果当前是主页并且向右滑动就不执行 和 如果是最后一页向左滑动
                if (Math.abs(deltaY) > Math.abs(deltaX) || this.dotsTitleIndex === 0) {
                    return;
                }

                // 获取滑动的宽度
                const left = nextPageIndex === this.dotsTitleIndex ? 0 : -window.innerWidth;
                const offsetwidth = Math.max(-window.innerWidth, left + deltaX);

                // 手指向右滑动
                if (offsetwidth > window.innerWidth / 5) {
                    // 获取当前页面  dotsTitle数组中对应的 categoryId
                    this.dotsTitleIndex = this.dotsTitleIndex - 1;

                    // 当前页面对应的 categoryId 数组的位置 < 0 就直接返回不执行
                    if (this.dotsTitleIndex === -1) {
                        return;
                    }

                    // 获取当前页面  dotsTitle数组中对应的 categoryId
                    this.currentCategoryId = this.dotsTitle[this.dotsTitleIndex].categoryId;

                    // 如果当前的页面数据与 otherSortSongList中的数据不对应就重新请求
                    if (this.currentCategoryId !== this.otherSortSongList[this.dotsTitleIndex].categoryId) {
                        //  重新设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                        // 清空数据
                        this.otherSortSongList[this.dotsTitleIndex] = {};
                    }
                    // 判断如果当前页面没有数据就请求
                    else if (this.otherSortSongList[this.dotsTitleIndex].list) {
                        this.ajaxSortSongData = false;
                    }
                    else {
                        //  设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                    }
                }
                // 手指向左滑动
                else if (offsetwidth < -window.innerWidth / 5 && this.touchRight) {
                    // 获取当前页面  dotsTitle数组中对应的 categoryId
                    this.currentCategoryId = this.dotsTitle[this.dotsTitleIndex].categoryId;

                    // 如果当前的页面数据与 otherSortSongList中的数据不对应就重新请求
                    if (this.currentCategoryId !== this.otherSortSongList[this.dotsTitleIndex].categoryId) {
                        //  重新设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                        // 清空数据
                        this.otherSortSongList[this.dotsTitleIndex] = {};
                    }
                    // 判断如果当前页面没有数据就请求
                    else if (this.otherSortSongList[this.dotsTitleIndex].list) {
                        this.ajaxSortSongData = false;
                    }
                    else {
                        //  设置歌单推荐列表请求可以开始
                        this.ajaxSortSongData = true;
                    }
                }
            },
            /*
             *  歌单推荐列表切换滑动事件   手指滑动完成
             * */
            sliderTouchEnd() {
                // 滑动完成设置请求为false
                this.ajaxSortSongData = false;
            },
            /**
             * 计算播放量
             * @param {Number}
             */
            computedPlayNumber(playNumber) {
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
            // 设置主页头部导航是否显示
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            // 进行异步请求
            ...mapActions('asyncAjax', [
                'getSortSongData'
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
                'pullup'
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
                // 判断向那边滑动
//                if (this.movingDirectionX === -1) {
//                    this.dotsTitleIndex = this.dotsTitleIndex - 2;
//                }
//                else if (this.movingDirectionX === 1) {
//                    this.dotsTitleIndex = this.dotsTitleIndex - 1;
//                }

                // 设置每个其他歌单推荐的数据
                // 如果对应的数组中已经有数据了就不执行
                switch (this.dotsTitleIndex) {
                    case 1:
                        if (this.otherSortSongList[1].list) {
                            return;
                        }
                        this.otherSortSongList[1] = newData;
                        break;
                    case 2:
                        if (this.otherSortSongList[2].list) {
                            return;
                        }
                        this.otherSortSongList[2] = newData;
                        break;
                    case 3:
                        if (this.otherSortSongList[3].list) {
                            return;
                        }
                        this.otherSortSongList[3] = newData;
                        break;
                    case 4:
                        if (this.otherSortSongList[4].list) {
                            return;
                        }
                        this.otherSortSongList[4] = newData;
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

<style lang="stylus" rel="stylesheet/stylus">
</style>
