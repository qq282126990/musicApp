<template>
    <div>
        <!--头部-->
        <div class="singer-wrapper-header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <v-icon class="icon">arrow_back</v-icon>
            </div>
            <!--标题-->
            <div class="header-title">
                <span>歌手</span>
            </div>
        </div>
        <scroll class="scroll-wrapper" @scroll="scroll" v-show="getSingerList.length" ref="scroll">
            <ul class="singer-list-wrapper">
                <!--列表-->
                <li class="singer-list" v-for="list in getSingerList" ref="singerList">
                    <!--标题-->
                    <h2 class="list-title">{{list.title}}</h2>
                    <!--歌手列表-->
                    <ul>
                        <li class="list-singer-item"
                            v-for="item in list.items"
                            @click="selectSinger(item)">
                            <!--头像-->
                            <img class="avatar" :alt="item.avatar" v-lazy="item.avatar">
                            <!--名称-->
                            <span class="name">{{item.name}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <!--右侧导航-->
            <div class="singer-list-shortcut"
                 @touchstart.stop.prevent="onShortcutTouchStart"
                 @touchmove.stop.prevent="onShortcutTouchMove"
                 @touchend.stop>
                <ul>
                    <li class="shortcut-item"
                        v-for="(item, index) in shortcutList"
                        :data-index="index"
                        :class="{'active':currentIndex===index}"
                        ref="shortcutItem"
                    >
                        {{item}}
                    </li>
                </ul>
            </div>
            <!--浮动标题-->
            <div class="singer-list-fixed" ref="singerListFixed" v-show="fixedTitle">
                <div class="fixed-title">{{fixedTitle}}</div>
            </div>
        </scroll>
        <div class="loading-wrapper" v-show="!getSingerList.length">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 样式兼容方法 prefixStyle
    // 获取设置data getData
    import {prefixStyle, getData} from 'common/js/dom';
    // 滚动组件
    import Scroll from 'base/scroll/scroll'
    // loading组件
    import Loading from 'base/loading/loading';

    // transform 兼容
    const transform = prefixStyle('transform');

    export default {
        data () {
            return {
                /*
                 * 获取当前Y轴滚动数值
                 * @type {Number}
                 * */
                scrollY: -1,
                /*
                 * 当前的索引index
                 * @type {Number}
                 * */
                currentIndex: 0,
                /*
                 * 浮动标题离开时的位置
                 * @type {Number}
                 * */
                diff: -1,
                /*
                 * 记录触摸的位置
                 * @type {Object}
                 * */
                touch: {},
                /*
                 * 获取每个歌手类型的高度a-z
                 * */
                listHeight: [],
                /*
                 * loading文字
                 * @type {String}
                 * */
                loadingText: '加载中...'
            }
        },
        mounted () {
            // 获取歌手列表接口
            this.setSingerList();
            // 设置scroll组件要不要监听滚动事件
            this.setListenScroll(true);
            // 设置滚动的状态
            this.setProbeType(3);
        },
        computed: {
            // 设置悬浮标题
            fixedTitle () {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.getSingerList[this.currentIndex] ? this.getSingerList[this.currentIndex].title : ''
            },
            // 设置右侧导航数据
            shortcutList () {
                return this.getSingerList.map((item) => {
                    return item.title.substr(0, 1)
                })
            },
            ...mapState('asyncAjax', {
                getSingerList: 'singerList'
            })
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            // 获取滚动数值
            scroll (pos) {
                this.scrollY = pos.y
            },
            // 选择歌手
            selectSinger (singer) {
                // 重置歌手歌曲列表
                this.setSongList([]);

                // 跳转路由
                this.$router.push({
                    path: `/home/singer/${singer.id}`
                });

                // 设置歌手信息
                this.setSingerMessage(singer);
            },
            // 计算每个歌手分类的高度
            _calculateHeight () {
                this.listHeight = [];
                let height = 0;
                const singerList = this.$refs.singerList;

                // 初始化第一个高度
                this.listHeight.push(height);

                // 计算每个分类的高度push进入listHeight数组
                for (let i = 0; i < singerList.length; i++) {
                    let item = singerList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            // 手指开始移动
            onShortcutTouchStart (e) {
                // 设置索引
                let anchorIndex = getData(e.target, 'index');
                // 记录第一次触摸数值
                let firstTouch = e.touches[0];

                this.touch.y1 = firstTouch.pageY;
                this.touch.anchorIndex = anchorIndex;


                // 设置滚动位置
                this.scrollTo(anchorIndex);
            },
            // 手指移动中
            onShortcutTouchMove (e) {
                // 记录第一次移动数值
                let moveTouch = e.touches[0];
                this.touch.y2 = moveTouch.pageY;

                let delta = (this.touch.y2 - this.touch.y1) / this.$refs.shortcutItem[0].clientHeight | 0;
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

                // 设置滚动位置
                this.scrollTo(anchorIndex)
            },
            // 设置滚动位置
            scrollTo (index) {
                if (!index && index !== 0) {
                    return;
                }

                if (index < 0) {
                    index = 0;
                }
                else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2;
                }

                this.scrollY = -this.listHeight[index];
                // 滚动到对应的位置
                this.$refs.scroll.scrollToElement(this.$refs.singerList[index], 0);
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                    /*
                     * 获取歌手列表接口
                     * */
                    setSingerList: 'getSingerList',
                    /**
                     * 设置歌曲列表
                     * @param {Function} commit
                     */
                    setSongList: 'songList'
                }
            ),
            ...mapActions('appStore', {
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 设置scroll组件要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 设置滚动的状态
                 * @type {Number}
                 */
                setProbeType: 'probeType',
                /**
                 * 设置歌手信息
                 * @type {Number}
                 */
                setSingerMessage: 'singerMessage'
            })
        }
        ,
        // 组件激活
        activated () {
            // 设置首页头部导航
            this.setAppHeader({
                show: false
            });

            // 刷新滚动组件
            this.$refs.scroll.refresh();
        },
        watch: {
            // 监听歌手列表数据变化
            getSingerList (newSingerList) {
                // 滚动组件外部传入的数据
                this.setScrollData(newSingerList);

                setTimeout(() => {
                    this._calculateHeight();
                }, 20);
            }
            ,
            // 监听Y轴滚动
            scrollY (newY) {
                const listHeight = this.listHeight;
                // 当滚动到顶部，newY>0 当前的索引index = 0
                if (newY > 0) {
                    this.currentIndex = 0;
                    return;
                }
                // 中间部分滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i];
                    let height2 = listHeight[i + 1];

                    // 判断当前滚动的位置设置当前歌手分类索引
                    if (-newY >= height1 && -newY < height2) {
                        // 设置索引
                        this.currentIndex = i;
                        // 设置浮动标题离开时的位置
                        this.diff = height2 + newY;
                        return;
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            // 监听浮动标题离开时的位置
            diff (newVal) {
                let fixedTop = (newVal > 0 && newVal < this.$refs.singerListFixed.clientHeight) ? newVal - this.$refs.singerListFixed.clientHeight : 0;

                if (this.fixedTop === fixedTop) {
                    return;
                }
                this.fixedTop = fixedTop;
                this.$refs.singerListFixed.style[transform] = `translate3d(0,${fixedTop}px,0)`;
            }
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
        position: fixed;
        top: px2rem(82px);
        bottom: px2rem(120px);
        width: 100%;
        overflow: hidden;
    }

    /*歌手列表*/
    .singer-list {
        /*padding-bottom: px2rem(60px);*/
        /*标题*/
        .list-title {
            text-align: left;
            height: px2rem(60px);
            line-height: px2rem(60px);
            padding-left: px2rem(40px);
            font-size: px2rem(26px);
            color: $singer-list-title;
            background: #F0F0F0;
        }
        ul {
            position: relative;
            top: px2rem(-10px);
        }
        /*歌手列表*/
        .list-singer-item {
            display: flex;
            align-items: center;
            padding: 0 0 0 px2rem(30px);
            /*头像*/
            .avatar {
                width: px2rem(80px);
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

    /*右侧导航*/
    .singer-list-shortcut {
        position: fixed;
        right: px2rem(10px);
        top: 50%;
        transform: translateY(-50%);
        width: px2rem(40px);
        padding: px2rem(40px) 0;
        border-radius: px2rem(20px);
        text-align: center;
        z-index: 30;
        background: #F0F0F0;
        .shortcut-item {
            padding: px2rem(6px);
            line-height: 1;
            color: #858585;
            font-size: px2rem(24px);
            &.active {
                color: #37bd7d;
            }
        }
    }

    /*浮动标题*/
    .singer-list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: #fff;
        .fixed-title {
            text-align: left;
            height: px2rem(60px);
            line-height: px2rem(60px);
            padding-left: px2rem(40px);
            font-size: px2rem(26px);
            color: $singer-list-title;
        }
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

</style>
