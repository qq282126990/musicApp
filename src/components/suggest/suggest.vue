<template>
    <scroll class="suggest-scroll"
            @pullingUp="pullingUp"
            @beforeScroll="listScroll"
            ref="suggerstScroll">
        <!--搜索列表-->
        <ul v-show="result.length">
            <li class="suggest-item"
                v-for="(item, index) in result"
                :key="index"
                @click="selectItem(item)">
                <!--图标-->
                <v-icon class="item-icon">search</v-icon>
                <!--名字-->
                <p class="item-text" v-html="getDisplayName(item)"></p>
            </li>
            <!--下拉加载时显示的Loading效果-->
            <div class="has-more" v-show="hasMore">
                <loading :loadingText="loadingText"></loading>
            </div>
        </ul>
        <!--加载时显示的Loading效果-->
        <div class="loading-wrapper" v-show="!result.length && !noResult">
            <loading :loadingText="loadingText"></loading>
        </div>
        <!--没有搜索结果提示-->
        <div class="no-result-wrapper" v-show="!hasMore && noResult">
            <p class="no-title">抱歉，暂无搜索结果</p>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    // 搜索歌曲请求 searchSong
    import {searchSong} from 'api/search';
    // ERR_OK = 0
    import {ERR_OK} from 'api/config';
    // 创建歌曲列表 normalizeSongList
    import {normalizeSongList} from 'common/js/songList';
    // 创建歌手数据
    import Singer from 'common/js/singer';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';

    const TYPE_SINGER = 'singer';
    const perpage = 20;

    export default {
        props: {
            /*
             * 设置是否显示搜索歌手
             * @type {Boolean}
             * */
            showSinger: {
                type: Boolean,
                default: true
            },
            /*
             * 搜索的内容
             * @type {String}
             * */
            query: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                /*
                 * 搜索列表的页数
                 * @type {Number}
                 * */
                page: 1,
                /*
                 * 是否能加载更多
                 * @type {Boolean}
                 * */
                hasMore: false,
                /*
                 * 判断是否有搜索列表
                 * @type {String}
                 * */
                noResult: false,
                /*
                 * 判断当前是否重复点击歌曲列表
                 * @type {String}
                 * */
                oldSong: null,
                /*
                 * 搜索的结果
                 * @type {Array}
                 * */
                result: [],
                /*
                 * loading文字
                 * @type {String}
                 * */
                loadingText: '加载中...'
            }
        },
        mounted() {
            // 设置滚动组件开始滚动
            this.setBeforeScroll(true);
            // 设置是否开启上拉加载
            this.setPullUpLoad(true);
        },
        computed: {
            ...mapGetters('appStore', {
                /**
                 * 获取当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong'
            })
        },
        methods: {
            // 选择列表
            selectItem(item) {
                // 如果点击的是歌手就跳转到歌手页面
                if (item.type === TYPE_SINGER) {
//                    const singer = new Singer({
//                        id: item.singermid,
//                        name: item.singername
//                    })
//                    this.$router.push({
//                        path: `/search/${singer.id}`
//                    })
//                    this.setSinger(singer)
                }
                else {
                    // 点击搜索页面的歌曲发送状态
                    this.setInsertSong(item)

                    // 如果不是重复点击就初始化oldSong
                    if (this.oldSong !== item.id) {
                        this.oldSong = null;
                    }

                    // 如果oldSong为空才执行
                    if (!this.oldSong) {
                        this.oldSong = item.id;

                        // 发送选择歌曲的信息总线程
                        Bus.$emit('selectSong', this.getCurrentSong);
                    }
                }

                this.$emit('saveSearch', item)
            },
            searchSong (newQuery) {
                // 判断是否有搜索列表
                this.noResult = false;
                // 设置搜索列表的页数
                this.page = 1;
                // 重置滚动位置
                this.$refs.suggerstScroll.scrollTo(0, 0);
                // 搜索歌曲请求
                searchSong(newQuery, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        // 设置搜索的结果
                        this.result = this._getResult(res.data);
                        // 检查能否加载更多
                        this._checkMore(res.data);
                        // 滚动组件外部传入的数据
                        this.setScrollData(this.result);

                        // 判断是否有搜索列表
                        if (!this.result.length) {
                            this.noResult = true;
                        }
                    }
                });
            },
            // 加载更多搜索列表
            searchSongMore() {
                if (!this.hasMore) {
                    return;
                }
                this.page++;
                searchSong(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        // 拼接搜索的结果
                        this.result = this.result.concat(this._getResult(res.data));
                        // 检查能否加载更多
                        this._checkMore(res.data);
                    }
                })
            },
            // 上拉加载更多搜索列表
            pullingUp () {
                this.searchSongMore();
            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            pullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.suggerstScroll.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.suggerstScroll.refresh();
            },
            // 创建搜索结果
            _getResult(data) {
                let ret = [];
                if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}});
                }
                if (data.song) {
                    ret = ret.concat(normalizeSongList(data.song.list));
                }
                return ret;
            },
            // 检查能否加载更多
            _checkMore(data) {
                const song = data.song;
                if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
                    this.hasMore = false;
                }
                else {
                    this.hasMore = true;
                }
            },
            // 显示歌曲名称
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name}-${item.singer}`
                }
            },
            listScroll() {
                this.$emit('listScroll');
            },
            refresh() {
                this.$refs.suggerstScroll.refresh();
            },
            ...mapActions('appStore', {
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 滚动组件开始滚动
                 * @type {Boolean}
                 */
                setBeforeScroll: 'beforeScroll',
                /**
                 * 设置是否开启上拉加载
                 * @type {Boolean}
                 */
                setPullUpLoad: 'pullUpLoad',
                /**
                 * 点击搜索页面的歌曲发送状态
                 * @type {Array}
                 */
                setInsertSong: 'insertSong'
            })
        },
        watch: {
            query(newQuery) {
                this.searchSong(newQuery)
            },
            // 监听搜索列表数据变化
            result () {
                // 上拉加载更多歌单列表完成后刷新数据方法
                this.pullingUpRefresh();
            }
        },
        components: {
            Scroll,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .suggest-scroll {
        height: 100%;
        overflow: hidden;
        /*搜索列表*/
        .suggest-item {
            display: flex;
            align-items: center;
            padding-left: px2rem(30px);
            height: px2rem(88px);
            line-height: px2rem(88px);
            background: #fff;
            /*图标*/
            .item-icon {
                flex: 0 0 px2rem(50px);
                font-size: px2rem(50px);
                color: rgba(201, 201, 201, 1);
            }
            /*名称*/
            .item-text {
                margin-left: px2rem(30px);
                margin-bottom: 0;
                text-align: left;
                flex: 1;
                font-size: px2rem(28px);
                border-bottom: px2rem(2px) solid #ededed;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    /*没有搜索数据提示*/
    .no-result-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        line-height: px2rem(100px);
        top: px2rem(88px);
        background: #fff;
        .no-title {
            margin: 0;
            font-size: px2rem(28px);
            color: #999;
        }
    }

    .loading-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        padding-top: 50%;
        width: 100%;
        height: 100%;
    }

    /*下拉加载时显示的Loading效果*/
    .has-more {
        padding: px2rem(60px) 0;
        width: 100%;
        height: 100%;
        background: #fff;
    }
</style>
