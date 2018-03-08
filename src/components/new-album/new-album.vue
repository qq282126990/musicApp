<template>
    <div class="new-album-wrapper">
        <header-scroll
            :headerSelect="headerSelect"
            :newSongList="headerScrollData"
            @selectHeader="selectHeader"
        ></header-scroll>
        <transition name="slide">
            <scroll class="new-album-scroll"
                    v-show="copeNewAlbumListData.length > 0"
                    @pullingUp="pullingUp"
                    ref="scroll">
                <ul class="new-album-ul">
                    <li class="new-album-li" v-for="item in copeNewAlbumListData" @click="selectItem(item)">
                        <!--头像-->
                        <img class="li-avatar"
                             :alt="item.cover"
                             v-lazy="item.cover"/>
                        <!--发行时间-->
                        <div class="play-number-wrapper">
                            <!--发行时间-->
                            <div class="play-number">
                                <v-icon class="icon">query_builder</v-icon>
                                <span class="number">{{item.publicTime}}</span>
                            </div>
                            <!--播放按钮-->
                            <v-icon class="play">play_circle_outline</v-icon>
                        </div>
                        <!--专辑名称-->
                        <span class="name">{{item.title}}</span>
                        <!--歌手名称-->
                        <div class="user-name">
                            <span>{{item.singerName}}</span>
                        </div>
                    </li>
                </ul>
            </scroll>
        </transition>
        <!--loading-->
        <div class="loading-wrapper">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 对新碟list数据做处理 initNewAlbumList
    import {initNewAlbumList} from 'common/js/newSongSpeed';
    // 自定义歌单专辑数据
    import {createSongSingle} from 'common/js/songSingle';
    // 保存主页选择对应歌单的数据到本地 saveSongSingle
    import {saveSongSingle} from 'common/js/cache';
    // 头部滚动组件
    import HeaderScroll from 'base/header-scroll/header-scroll';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        data () {
            return {
                /*
                 * 设置初始化是否完成
                 * */
                initState: false,
                /*
                 * 设置头部导航显示的数据
                 * @type {Array}
                 * */
                headerScrollData: [],
                /*
                 * 设置新碟列表数据
                 * @type {Array}
                 * */
                newAlbumListData: [],
                /*
                 * 拷贝新碟列表数据
                 * @type {Array}
                 * */
                copeNewAlbumListData: [],
                /*
                 * loading显示的文字
                 * @type {String}
                 * */
                loadingText: '加载中...',
                /*
                 * 设置头部导航那个激活了
                 * @type {Number}
                 * */
                headerSelect: 7,
                /*
                 * 设置头部导航的index索引
                 * @type {Number}
                 * */
                currentHeader: 0,
                /*
                 * 设置新碟列表数据开始坐标
                 * @type {Array}
                 * */
                listSin: 0
            };
        },
        mounted() {
            // 设置开启上拉加载
            this.setPullUpLoad(true);

            // 设置初始化完成
            this.initState = true;
            setTimeout(() => {
                // 新碟数据请求
                this.setNewAlbum({
                    'area': this.headerSelect,
                    'sin': this.listSin
                });
            }, 1000);
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取新碟数据
                 * @type {Object}
                 * */
                getNewAlbum: 'newAlbum'
            })
        },
        methods: {
            /**
             * 对头部导航数据做处理
             * @type {Array}  list
             */
            _normalizeSongs(list) {
                let ret = [];

                list.forEach((data) => {
                    ret.push({
                        id: data.id,
                        title: data.name
                    });
                });

                // 设置头部导航显示的数据
                this.headerScrollData = ret;
            },
            // 创建新碟列表数据
            _initNewAlbumListData(list) {
                let ret = [];
                let items = {};

                list.forEach(() => {
                    ret.push(items);
                });

                this.newAlbumListData = ret;
            },
            // 选择头部导航
            selectHeader (item, index) {
                this.copeNewAlbumListData = [];
                // 设置头部导航那个激活了
                this.headerSelect = item.id;

                // 设置头部导航的index索引
                this.currentHeader = index;

                // 重置新碟列表数据开始坐标
                this.listSin = 0;

                // 延迟1秒避免被封
                setTimeout(() => {
                    // 判断是否已经请求过歌曲列表了
                    if (this.newAlbumListData[this.currentHeader].length > 0) {
                        this.copeNewAlbumListData = this.newAlbumListData[this.currentHeader];
                        return;
                    }

                    // 新碟数据请求
                    this.setNewAlbum({
                        'area': item.id,
                        'sin': this.listSin
                    });
                }, 1000);
            },
            // 点击选择歌单
            selectItem(singer) {
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (singer.dissid) {
                    // 把选中的专辑的数据存入 localStorage多页通讯
                    saveSongSingle(createSongSingle(singer));

                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/songsingle/${singer.dissid}`
                    });
                }
            },
            // 上拉加载更多歌单列表方法
            pullingUp () {
                // 设置新碟列表数据开始坐标
                this.listSin += 20;

                if (this.getNewAlbum.total <= 50) {
                    return;
                }

                // 新碟数据请求
                this.setNewAlbum({
                    'area': this.headerSelect,
                    'sin': this.listSin
                });
            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            pullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.scroll.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.scroll.refresh();
            },
            ...mapActions('asyncAjax', {
                /*
                 * 获取新碟数据请求
                 * @type {Object}
                 * */
                setNewAlbum: 'getNewAlbum'
            }),
            ...mapActions('appStore', {
                /**
                 * 设置滚动组件数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /*
                 * 设置是否开启上拉加载
                 * @type {Boolean}
                 * */
                setPullUpLoad: 'pullUpLoad'
            })
        },
        // 组件激活时调用
        activated() {
            // 设置初始化完成
            this.initState = true;
        },
        watch: {
            getNewAlbum (newNewAlbum) {
                // 设置滚动组件数据
                this.setScrollData(newNewAlbum);

                if (this.initState) {
                    // 对头部导航数据做处理
                    this._normalizeSongs(newNewAlbum.tags.area);

                    // 设置头部导航那个激活了
                    this.headerSelect = newNewAlbum.tags.area[0].id;

                    // 创建新碟列表数据
                    this._initNewAlbumListData(newNewAlbum.tags.area);
                }
                this.initState = false;

                // 设置新碟列表数据
                this.newAlbumListData[this.currentHeader] = initNewAlbumList(newNewAlbum.list).slice(0, 20);
                this.copeNewAlbumListData = this.copeNewAlbumListData.concat(this.newAlbumListData[this.currentHeader]);

                // 如果数据长度大于20 设置上拉加载更多歌单列表完成后刷新数据方法
                if (this.copeNewAlbumListData.length >= 20) {
                    this.newAlbumListData[this.currentHeader] = this.copeNewAlbumListData;
                    this.pullingUpRefresh();
                }
            }
        },
        components: {
            HeaderScroll,
            Scroll,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .slide-enter-active, .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate(100%, 0);
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

    /*外层*/
    .new-album-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .new-album-scroll {
        position: fixed;
        top: px2rem(174px);
        bottom: px2rem(120px);
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        z-index: 20;
        background: #fff;
        .new-album-ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        .new-album-li {
            position: relative;
            flex-basis: 50%;
            box-sizing: border-box;
            overflow: hidden;
            text-align: left;
            /*歌单图片*/
            .li-avatar {
                display: block;
                padding-right: px2rem(5px);
                /*border-top-left-radius: px2rem(15px);*/
                /*border-bottom-left-radius: px2rem(15px);*/
                /*border-top-right-radius: 0;*/
                /*border-bottom-right-radius: 0;*/
                width: 100%;
                min-width: px2rem(375px);
                min-height: px2rem(375px);
            }
            /*歌单标题*/
            .name {
                padding: px2rem(16px) px2rem(20px) 0 px2rem(20px);
                text-align: left;
                line-height: px2rem(40px);
                font-size: px2rem(24px);
                max-height: px2rem(76px);
                color: $content-name-color;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: block;
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
                    .icon {
                        position: relative;
                        top: px2rem(-2px);
                        flex: 0 0 px2rem(24px);
                        font-size: px2rem(32px);
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
                padding: px2rem(8px) px2rem(20px) px2rem(20px) px2rem(20px);
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
        .new-album-li:nth-child(2n + 2) {
            /*歌单图片*/
            .li-avatar {
                padding-left: px2rem(5px);
                padding-right: 0;
                /*border-top-left-radius: 0;*/
                /*border-bottom-left-radius: 0;*/
                /*border-top-right-radius: px2rem(15px);*/
                /*border-bottom-right-radius: px2rem(15px);*/
            }
            /*播放量*/
            .play-number-wrapper {
                margin-left: px2rem(10px);
                padding-left: 0;
                /*播放量数字*/
                .play-number {
                    /*icon*/
                    .icon {
                       padding-left: px2rem(10px);
                    }
                }
                /*播放按钮*/
                .play {
                    padding-right: px2rem(20px);
                }
            }
        }
    }
</style>
