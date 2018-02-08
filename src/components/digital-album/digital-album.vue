<template>
    <scroll class="scroll"
            :pullUpLoad="pullUpLoad"
            @pullingUp="pullingUp"
            ref="scroll">
        <div v-show="musicDigitalAlbum.focus">
            <!--轮播图-->
            <div class="silder-wrapper">
                <div v-if="musicDigitalAlbum.focus">
                    <slider :showDots="showDots">
                        <div v-for="item in musicDigitalAlbum.focus">
                            <a :href="item.jumpurl">
                                <img
                                    :alt="item.picurl"
                                    :src="item.picurl">
                            </a>
                        </div>
                    </slider>
                </div>
            </div>
            <!--导航-->
            <tab-router :tebLi="tebLi" ref="tabRouter"></tab-router>
            <!--内容-->
            <div class="content">
                <!--专辑列表内容-->
                <digital-album-list :albumList="albumList.slice(0, 3)" @selectAlbum="selectAlbum"></digital-album-list>
                <digital-album-list :albumList="albumList.slice(3)" @selectAlbum="selectAlbum"></digital-album-list>
                <!--加载更多专辑-->
                <digital-album-list :albumList="moreAlbum" @selectAlbum="selectAlbum"></digital-album-list>
            </div>
        </div>
        <!--loading-->
        <div class="loading-wrapper" v-show="!musicDigitalAlbum.focus">
            <loading></loading>
            <span class="text">加载中...</span>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 创建正常数字专辑列表数据 createDigitalAlbumList
    // 创建其他数字专辑列表数据 createOtherDigitalAlbumList
    // 创建数字专辑基础信息 createAlbumSongTableMessage
    import {createDigitalAlbumList, createOtherDigitalAlbumList, createAlbumSongTableMessage} from 'common/js/totalDigitalAlbum';
    // 轮播组件
    import Slider from 'base/slider/slider';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 数字专辑列表
    import DigitalAlbumList from 'base/digital-album-list/digital-album-list';
    // TabRouter导航
    import TabRouter from 'components/tabRouter/tabRouter';
    // Loading组件
    import Loading from 'base/loading/loading';

    export default {
        data () {
            return {
                /*
                 * 隐藏轮播图dots
                 * @type {Boolean}
                 * */
                showDots: false,
                /*
                 * 设置标签信息
                 * @type {Array}
                 * */
                tebLi: [{
                    tab: [{'name': '畅销榜', 'iconfont': 'icon-paixingbang1'},
                        {'name': '金唱片', 'iconfont': 'icon-changpianCD'},
                        {'name': '分类', 'iconfont': 'icon-leimupinleifenleileibie2'},
                        {'name': '已购', 'iconfont': 'icon-flyme_icon-'}
                    ]
                }],
                /*
                 * 专辑列表数据
                 * @type {Array}
                 * */
                albumList: [],
                /*
                 * 加载更多专辑数据
                 * @type {Array}
                 * */
                moreAlbum: [],
                /*
                 * 加载更多专辑列表
                 * @type {Array}
                 * */
                moreAlbumList: [],
                /*
                 * 加载更多专辑列表最大条数
                 * @type {Array}
                 * */
                moreAlbumMaxLength: null,
                /*
                 * 加载更多专辑列表数据开始坐标
                 * @type {Number}
                 * */
                start: 0,
                /*
                 * 设置是否开启上拉加载
                 * @type {Boolean}
                 * */
                pullUpLoad: true,
                /*
                 * 设置更多数字专辑是否请求完成
                 * @type {Boolean}
                 * */
                moreAlbumAjax: false
            };
        },
        computed: {
            ...mapState('asyncAjax', [
                /*
                 * 音乐数字专辑相册数据
                 * @type {Object}
                 * */
                'musicDigitalAlbum',
                /*
                 * 更多数字专辑数据
                 * @type {Object}
                 * */
                'moreDigitalAlbum'
            ])
        },
        mounted () {
            // 获取全部数字专辑数据异步接口
            this.getTotalDigitalAlbum();

            // 获取更多数字专辑数据
            this.getMoreAlbumList(this.start);

            // 初始化滚动条位置
            this.$refs.scroll.scrollTo(0, 0);
        },
        methods: {
            // 一些初始化操作
            _initData() {
                // 设置滚动组件数据
                this.setScrollData(this.musicDigitalAlbum);
                // scroll 组件 开启滚动监听
                this.listenScroll(true);
            },
            // 初始化专辑列表数据
            _normalizeAlbumList (data) {
                let items = {};

                data.forEach((item) => {
                    if (item.title === '专题栏目') {
                        items = {
                            title: item.title,
                            data: createOtherDigitalAlbumList(item.article_list)
                        };
                        this.albumList.push(items);
                    }
                    else {
                        items = {
                            title: item.title,
                            data: createDigitalAlbumList(item.album_list)
                        };
                        this.albumList.push(items);
                    }
                });
            },
            // 加载更多专辑列表
            _moreAlbumList (list) {
                let items = {};
                let ret = [];

                items = {
                    title: '更多专辑',
                    data: this.moreAlbumList = this.moreAlbumList.concat(createDigitalAlbumList(list.album_list))
                };

                ret.push(items);

                this.moreAlbum = ret;
            },
            // 寻找对应数据的位置
            findIndex (list, title) {
                return list.findIndex((item) => {
                    return item.title === title;
                });
            },
            // 获取选择专辑的id
            selectAlbum (list) {
                // 把选中的专辑的数据存入 homeSonglist
                this.setSonglist(createAlbumSongTableMessage(list));

                // 跳转到专辑页面
                this.$router.push({
                    path: `/newSongSpeed/digitalAlbumMusicList/${list.id}`
                });
            },
            // 上拉加载更多数字专辑方法
            pullingUp () {
                // 如果到达了最大条数就不执行
                if (this.start >= this.moreAlbumMaxLength) {
                    return;
                }

                // 如果更多专辑数据加载完成才执行
                if (this.moreAlbumAjax) {
                    // 设置加载更多专辑列表数据开始坐标
                    this.start += 9;
                    // 获取更多数字专辑数据
                    this.getMoreAlbumList(this.start);
                }

                // 设置更多专辑数据加载完成状态
                this.moreAlbumAjax = false;
            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            PullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.scroll.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.scroll.refresh();
            },
            ...mapActions('asyncAjax', [
                /*
                 * 获取全部数字专辑数据异步接口
                 * */
                'getTotalDigitalAlbum',
                /*
                 * 获取更多数字专辑数据
                 * */
                'getMoreAlbumList'
            ]),
            ...mapActions('appStore', {
                /*
                 * 设置滚动组件数据
                 * @type {Array}
                 * */
                setScrollData: 'data',
                /**
                 * 设置scroll组件 要不要监听滚动事件
                 * @type {Boolean}
                 */
                listenScroll: 'listenScroll',
                /*
                 * 选中的专辑数据
                 * type {Object}
                 */
                setSonglist: 'homeSonglist'
            })
        },
        watch: {
            // 监听数字专辑变化
            musicDigitalAlbum (newData) {
                // 一些初始化操作
                this._initData();

                // 初始化专辑列表数据
                this._normalizeAlbumList(newData.content);
            },
            // 监听更多专辑数据
            moreDigitalAlbum (newMore) {
                // 设置加载更多专辑列表最大条数
                this.moreAlbumMaxLength = newMore.total;

                // 如果start > 0 才执行
                if (this.start > 0) {
                    // 设置更多专辑数据
                    this._moreAlbumList(newMore);
                    // 上拉加载更多歌单列表完成后刷新数据方法
                    this.PullingUpRefresh();
                }
                else {
                    // 设置更多专辑数据
                    this._moreAlbumList(newMore);
                }

                // 设置更多专辑数据加载完成
                this.moreAlbumAjax = true;
            }
        },
        components: {
            Slider,
            Scroll,
            TabRouter,
            DigitalAlbumList,
            Loading
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*滚动组件*/
    .scroll {
        height: 100%;
        overflow: hidden;
    }

    /*轮播图*/
    .silder-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(300px);
    }

    /*导航*/
    .tab-Router {
        transform: translate3d(0, -5px, 0);
        box-shadow: 0px 2px 6px #999;
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        top: 50%;
        width: 100%;
        z-index: 10;
        .text {
            box-sizing: border-box;
            font-size: px2rem(30px);
            margin: px2rem(20px) 0 0 px2rem(20px);
        }
    }
</style>
