<template>
    <scroll class="scroll"
            @pullingUp="pullingUp"
            ref="scroll">
        <div>
            <div v-if="albumList.length">
                <!--轮播图-->
                <div class="silder-wrapper">
                    <div>
                        <home-slider :showDots="false">
                            <div v-for="item in getMusicDigitalAlbum.focus">
                                <a :href="item.jumpurl">
                                    <img :alt="item.picurl" v-lazy="item.picurl">
                                </a>
                            </div>
                        </home-slider>
                    </div>
                </div>
                <!--导航-->
                <tab-router :tebLi="tebLi"></tab-router>
                <!--内容-->
                <div>
                    <!--专辑列表内容-->
                    <digital-album-list :albumList="albumList.slice(0, 3)"
                                        @selectAlbum="selectAlbum"></digital-album-list>
                    <digital-album-list :albumList="albumList.slice(3)" @selectAlbum="selectAlbum"></digital-album-list>
                    <!--加载更多专辑-->
                    <digital-album-list :albumList="moreAlbum" @selectAlbum="selectAlbum"></digital-album-list>
                </div>
            </div>
        </div>
        <!--loading-->
        <div class="loading-wrapper" v-if="!getMusicDigitalAlbum.focus">
            <loading :loadingText="loadingText"></loading>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 创建正常数字专辑列表数据 createDigitalAlbumList
    // 创建其他数字专辑列表数据 createOtherDigitalAlbumList
    // 创建数字专辑基础信息 createAlbumSongTableMessage
    import {
        createDigitalAlbumList,
        createOtherDigitalAlbumList,
        createAlbumSongTableMessage
    } from 'common/js/totalDigitalAlbum';
    // 轮播组件
    import HomeSlider from 'base/homeSlider/homeSlider';
    // TabRouter导航
    import TabRouter from 'components/tab-router/tab-router';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 数字专辑列表
    import DigitalAlbumList from 'base/digital-album-list/digital-album-list';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        data () {
            return {
                /*
                 * 设置标签信息
                 * @type {Array}
                 * */
                tebLi: [{
                    tab: [{'name': '畅销榜', 'iconfont': 'icon-paixingbang'},
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
                 * 设置更多数字专辑是否请求完成
                 * @type {Boolean}
                 * */
                moreAlbumAjax: false,
                /*
                 * loading显示的文字
                 * @type {String}
                 * */
                loadingText: '加载中...'
            }
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 音乐数字专辑相册数据
                 * @type {Object}
                 * */
                getMusicDigitalAlbum: 'musicDigitalAlbum',
                /*
                 * 更多数字专辑数据
                 * @type {Object}
                 * */
                getMoreDigitalAlbum: 'moreDigitalAlbum'
            })
        },
        mounted () {
            // 一些初始化
            this._initSome();
        },
        methods: {
            // 一些初始化
            _initSome () {
                // 获取全部数字专辑数据异步接口
                this.setTotalDigitalAlbum();
                // 获取更多数字专辑数据
                this.setMoreAlbumList(this.start);

                // 初始化滚动条位置
                this.$refs.scroll.scrollTo(0, 0);
                // 开启滚动监听
                this.setListenScroll(true);
                // 设置开启上拉加载
                this.setPullUpLoad(true);
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
                    this.setMoreAlbumList(this.start);
                }

                // 设置更多专辑数据加载完成状态
                this.moreAlbumAjax = false;
            },
            // 上拉加载更多歌单列表完成后刷新数据方法
            pullingUpRefresh () {
                // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.$refs.scroll.finishPullUp();
                // 数据更新时刷新滚动列表数据
                this.$refs.scroll.refresh();
            },
            // 获取选择专辑的id
            selectAlbum (list) {
                this.setSongList(createAlbumSongTableMessage(list));

                // 跳转到专辑页面
                this.$router.push({
                    path: `/home/newSongSpeed/digitalAlbum/${list.id}`
                });
            },
            ...mapActions('appStore', {
                /*
                 * 设置滚动组件数据
                 * @type {Array}
                 * */
                setScrollData: 'scrollData',
                /**
                 * 设置scroll组件 要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /*
                 * 设置是否开启上拉加载
                 * @type {Boolean}
                 * */
                setPullUpLoad: 'pullUpLoad'
            }),
            ...mapActions('asyncAjax', {
                /*
                 * 获取全部数字专辑数据异步接口
                 * */
                setTotalDigitalAlbum: 'getTotalDigitalAlbum',
                /*
                 * 获取更多数字专辑数据
                 * */
                setMoreAlbumList: 'getMoreAlbumList',
                /**
                 * 设置歌曲列表
                 * @param {Function} commit
                 */
                setSongList: 'songList'
            })
        },
        // 组件激活
        activated () {
            // 刷新滚动列表数据
             this.$refs.scroll.refresh();
        },
        watch: {
            // 监听数字专辑变化
            getMusicDigitalAlbum (newData) {
                // 设置滚动组件数据
                this.setScrollData(newData);

                // 初始化专辑列表数据
                this._normalizeAlbumList(newData.content);
            },
            // 监听更多专辑数据
            getMoreDigitalAlbum (newMore) {

                // 设置加载更多专辑列表最大条数
                this.moreAlbumMaxLength = newMore.total;

                if (newMore.album_list.length < 3) {
                    return;
                }

                // 如果start > 0 才执行
                if (this.start > 0) {
                    // 设置更多专辑数据
                    this._moreAlbumList(newMore);
                    // 上拉加载更多歌单列表完成后刷新数据方法
                    this.pullingUpRefresh();
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
            DigitalAlbumList,
            HomeSlider,
            TabRouter,
            Scroll,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*滚动组件*/
    .scroll {
        height: 100%;
        overflow: hidden;
    }

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

    /*轮播图*/
    .silder-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(300px);
        background-color: #999;
    }

    /*导航*/
    .tab-router {
        transform: translate3d(0, -5px, 0);
        box-shadow: 0px 2px 6px #999;
    }

</style>
