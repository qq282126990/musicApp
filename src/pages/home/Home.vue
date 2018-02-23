<template>
    <div>
        <scroll class="scroll" ref="scroll" @scroll="scroll">
            <div>
                <!--轮播图-->
                <div class="silder-wrapper">
                    <div v-if="homeSlider.length">
                        <home-slider>
                            <div v-for="item in homeSlider">
                                <a>
                                    <img :alt="item.pic_info.url" :src="item.pic_info.url">
                                </a>
                            </div>
                        </home-slider>
                    </div>
                </div>
                <!--轮播图背景-->
                <div class="silder-wrapper-bg" ref="silderWrapperBg" v-show="translateY !== 5"></div>
                <!--主页导航-->
                <tab-router
                    :tebLi="tebLi"
                    :style="{transform: `translate3d(0, -${translateY}px, 0)`,
                             boxShadow: `0px ${translateY === 0 ? 0 : translateY - 3}px ${translateY}px #999`}"
                    @selectRouter="selectRouter"
                    ref="tabRouter"></tab-router>
                <!--综合-->
                <div class="complex-wrapper">
                    <!--个性电台-->
                    <div class="individuality-radio" @click="clickPersonalFeaturedRadio(99)">
                        <!--icon-->
                        <i class="material-icons icon">
                            {{getPlaying && featuredRadioId === 99 ? 'pause' : 'play_arrow'}}
                        </i>
                    </div>
                    <!--推荐-->
                    <div class="recommend-wrapper">
                        <ul>
                            <li class="recommend-content"
                                v-for="item in homeNewSongSpeed"
                                :key="item.status"
                                @click.stop="selectRecommend(item)"
                            >
                                <div class="recommend-title">
                                    <h1 class="name">{{item.status}}</h1>
                                    <p class="txt">{{item.title}}</p>
                                </div>
                                <img class="recommend-img" v-lazy="item.cover"/>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--歌单导航列表-->
                <list-menu :listMenu="listMenu"
                           @clickListTitle="clickListTitle"
                           @selectSongSingle="selectSongSingle"></list-menu>
                <!--精选电台-->
                <div class="home-radio-wrapper">
                    <!--标题-->
                    <div class="radio-title">
                        <!--名称-->
                        <h1 class="name">精选电台</h1>
                        <!--icon-->
                        <i class="iconfont icon-prev_arrow-copy"></i>
                    </div>
                    <!--导航数据-->
                    <ul class="radio-data">
                        <li class="radio-data-li"
                            v-for="(item, index) in homeFeaturedRadio"
                            :key="index"
                            @click.stop="clickOrdinaryFeaturedRadio(item)"
                        >
                            <!--icon-->
                            <v-icon class="li-icon">
                                {{getPlaying && featuredRadioId === item.radioId ? 'pause' : 'play_arrow'}}
                            </v-icon>
                            <!--电台图片-->
                            <img class="li-cover" :alt="item.radioImg" v-lazy="item.radioImg"/>
                            <!--电台标题-->
                            <div class="li-title">
                                <span>{{item.radioName}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex';
    // 轮播图组件
    import HomeSlider from 'base/homeSlider/homeSlider';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 标签导航导航
    import TabRouter from 'components/tab-router/tab-router';
    // 歌单导航列表导航
    import ListMenu from 'base/list-menu/list-menu';
    // 设置cookie setCookie  获取cookie getCookie
    import {setCookie, getCookie} from 'common/js/cookie';
    // 自定义歌单专辑数据
    import {createSongSingle} from 'common/js/songSingle';
    // 保存主页选择对应歌单的数据到本地 saveSongSingle
    // 保存主页新歌模块跳转对应的模块的标题 saveNewSongSpeedTitle
    import {saveSongSingle, saveNewSongSpeedTitle} from 'common/js/cache';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';

    export default {
        name: 'Home',
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('asyncAjax/getHomeMessage'); // 主页数据接口
            await store.dispatch('asyncAjax/getHomeFeaturedRadio'); // 主页精选电台导航接口
        },
        data() {
            return {
                /*
                 * 获取Y轴滚动距离
                 * @type {Number}
                 * */
                scrollY: 0,
                /*
                 * 设置标题导航向上偏移的位置
                 * @type {Number}
                 * */
                translateY: 5,
                /*
                * 获取点击的电台的id
                * @type {Number}
                * */
                featuredRadioId: null,
                /*
                * 保存当前电台歌曲列表
                * @type {Array}
                * */
                featuredSongList: [],
                /*
                 * 保存当前的歌曲index
                 * @type {Array}
                 * */
                saveCurrentSongIndex: 0,
                /*
                 * 设置标签导航信息
                 * @type {Array}
                 * */
                tebLi: [{
                    tab: [{'name': '歌手', 'iconfont': 'icon-maikefeng', 'title': 'singer'},
                        {'name': '排行', 'iconfont': 'icon-paixingbang', 'title': 'ranking'},
                        {'name': '分类歌单', 'iconfont': 'icon-fenlei', 'title': 'categorySongList'},
                        {'name': '电台', 'iconfont': 'icon-ziyuan', 'title': 'radio'},
                        {'name': '视频', 'iconfont': 'icon-shipincopy', 'title': 'video'}
                    ]
                }],
            };
        },
        computed: {
            // 歌单导航模块数据
            listMenu() {
                this.list = [
                    {
                        listData: [{
                            'name': '为你推荐歌单',
                            'title': 'homeRecommend',
                            'data': this.homeRecommend.slice(0, 6)
                        }]
                    }
                ];

                return this.list;
            },
            // 获取歌曲播放的 guid !!!!!!!!!!!!!!!!!!!!!! 重要
            guid() {
                let date = new Date();
                return Math.round(2147483647 * Math.abs(Math.random() - 1) * date.getUTCMilliseconds() % 1e10);
            },
            ...mapState('asyncAjax', [
                /*
                 * 获取主页轮播图
                 * @type{Object}
                 * */
                'homeSlider',
                /*
                 * 获取主页热门推荐导航
                 * @typ {Array}
                 * */
                'homeRecommend',
                /*
                 * 获取主页新歌导航
                 * @typ {Array}
                 * */
                'homeNewSongSpeed',
                /*
                 * 主页精选电台导航数据
                 * @typ {Array}
                 * */
                'homeFeaturedRadio',
                /*
                 * 获取个性电台歌曲列表
                 * @typ {Array}
                 * */
                'personalFeaturedRadio',
                /*
                 * 普通电台歌曲列表
                 * @typ {Array}
                 * */
                'ordinaryFeaturedRadio'
            ]),
            ...mapGetters('appStore', {
                /**
                 * 获取歌曲是否播放
                 * @type {Boolean}
                 */
                getPlaying: 'playing',
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getPlayList: 'playList',
                /**
                 * 当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong',
                /**
                 * 当前播放歌曲索引
                 * @type {Number}
                 */
                getCurrentIndex: 'currentIndex'
            })
        },
        mounted() {
            // 一些初始化操作
            this._initSome();
        },
        methods: {
            // 一些初始化操作
            _initSome() {
                // 设置滚动组件滚动的状态
                this.setProbeType(3);
                // scroll组件开启滚动监听
                this.setListenScroll(true);
                // 设置滚动列表不能回弹
                this.setBounce(false);

                // 初始化标题导航向上偏移的位置
                this.translateY = 5;
                // 初始化轮播图背景样式
                this.$refs.silderWrapperBg.style.opacity = 0;

                // 把歌曲guid保存到cookie
                this.setGuid();
            },
            // 把歌曲guid保存到cookie !!!!!!!!!!!!!!!!!!!!!! 重要 每天设置一次
            setGuid() {
                let d = new Date();
                let n = d.getHours();
                // 如果没有guid就设置guid
                if (!getCookie('guid')) {
                    setCookie('guid', this.guid, Infinity, '/');
                }
                // 如果有guid每天重置一次
                else if (n === 0) {
                    setCookie('guid', this.guid, Infinity, '/');
                }
            },
            // 监听滚动
            scroll(pos) {
                this.scrollY = pos.y;
            },
            // 标签导航
            selectRouter (item) {
                this.$router.push({
                    path: `/home/${item.title}`
                });
            },
            // 点击综合推荐
            selectRecommend(item) {
                if (item.name === 'newSongSpeed') {
                    // 保存主页新歌模块跳转对应的模块的标题
                    saveNewSongSpeedTitle('新歌');
                }
                else if (item.name === 'digitalAlbum') {
                    // 保存主页新歌模块跳转对应的模块的标题
                    saveNewSongSpeedTitle('数字专辑');
                }

                this.$router.push({
                    path: '/home/newSongSpeed'
                });
            },
            // 选择歌单导航列表内容跳转页面
            selectSongSingle(singer) {
                //跳转到对应的歌单页面
                if (singer.content_id) {
                    // 把选中的专辑的数据存入 localStorage多页通讯
                    saveSongSingle(createSongSingle(singer));

                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/songsingle/${singer.content_id}`
                    });
                }
            },
            // 点击歌单导航列表头部标题
            clickListTitle(data) {
                this.$router.push({
                    path: `/home/${data}`
                });
            },
            // 点击个性电台播放歌曲
            clickPersonalFeaturedRadio(id) {
                // 控制歌曲播放
                this.setPlaying(!this.getPlaying);

                // 获取点击的电台的id
                this.featuredRadioId = id;

                if (!this.getPlaying) {
                    return;
                }

                // 初始化电台歌曲列表
                this.featuredSongList = [];

                // 请求个性电台歌曲列表
                this.setPersonalFeaturedRadio();
            },
            // 点击普通电台播放歌曲
            clickOrdinaryFeaturedRadio(item) {
                // 控制歌曲播放
                this.setPlaying(!this.getPlaying);

                // 获取点击的电台的id
                this.featuredRadioId = item.radioId;

                // 如果停止了播放就不执行下面操作
                if (!this.getPlaying) {
                    return;
                }
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('appStore', {
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                setBounce: 'bounce',
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 设置scroll组件 要不要监听滚动事件
                 * @type {Boolean}
                 */
                setListenScroll: 'listenScroll',
                /**
                 * 滚动的状态
                 * @type {Number}
                 */
                setProbeType: 'probeType',
                /*
                 * 设置主页选择对应歌单的数据
                 * type {Object}
                 */
                setSongsingle: 'songsingle',
                /**
                 * 控制歌曲播放
                 * @type {Boolean}
                 */
                setPlaying: 'playing',
                /**
                 * 设置播放列表数据
                 * @type {Boolean}
                 */
                setPlayList: 'playList',
                /**
                 * 设置播放全部歌曲
                 * @type {Boolean}
                 */
                setAllPlay: 'allPlay',
                /**
                 * 设置当前播放歌曲索引
                 * @type {Boolean}
                 */
                setCurrentIndex: 'currentIndex'
            }),
            ...mapActions('asyncAjax', {
                /**
                 * 个性电台歌曲接口
                 */
                setPersonalFeaturedRadio: 'getPersonalFeaturedRadio',
                /**
                 * 普通电台歌曲接口
                 */
                setOrdinaryFeaturedRadio: 'getOrdinaryFeaturedRadio'
            })
        },
        // 组件激活
        activated() {
            // 设置首页头部导航
            this.setAppHeader({
                show: true
            });

            // 初始化标题导航向上偏移的位置
            this.translateY = 5;
            // 初始化轮播图背景样式
            this.$refs.silderWrapperBg.style.opacity = 0;
        },
        watch: {
            // 监听滚动
            scrollY(newScrollY) {
                if (newScrollY < 0 && newScrollY < -5) {
                    // 设置标题导航向上偏移的位置
                    this.translateY = 0;
                    // 设置轮播图背景
                    this.$refs.silderWrapperBg.style.opacity = Math.abs(newScrollY / 100);
                }
                else {
                    // 设置标题导航向上偏移的位置
                    this.translateY = 5;
                    // 设置轮播图背景
                    this.$refs.silderWrapperBg.style.opacity = 0;
                }
            },
            // 监听主页轮播图数据
            homeSlider(newHomeSlider) {
                this.setScrollData(newHomeSlider);
            },
            // 监听点击的电台的id
            featuredRadioId(item) {
                // 控制歌曲播放
                this.setPlaying(!this.getPlaying);

                // 初始化电台歌曲列表
                this.featuredSongList = [];

                // 如果不是点击个性电台就请求正常电台播放歌曲列表
                if (item.radioId !== 99) {
                    // 请求普通电台歌曲接口
                    this.setOrdinaryFeaturedRadio(this.featuredRadioId);
                }
            },
            // 监听当前播放歌曲的index
            getCurrentIndex(newIndex) {
                // 如果没有点击电台就不执行下面逻辑
                if (!this.featuredRadioId) {
                    return;
                }

                // 获取歌曲是否播放
                if (!this.getPlaying) {
                    return;
                }


                // 如果歌曲已经播放到最后一首就重新请求一次接口
                if (newIndex === this.getPlayList.length - 1 && this.clickFeaturedRadio !== 99) {
                    // 保存当前歌曲的index;
                    this.saveCurrentSongIndex = newIndex;

                    // 请求电台歌曲列表
                    this.setOrdinaryFeaturedRadio(this.featuredRadioId);
                }
                else if (newIndex === this.getPlayList.length - 1 && this.featuredRadioId === 99) {
                    // 保存当前歌曲的index;
                    this.saveCurrentSongIndex = newIndex;

                    // 请求个性电台歌曲列表
                    this.setPersonalFeaturedRadio();
                }
            },
            // 监听精选电台接口返回的数据
            ordinaryFeaturedRadio(newSongList) {
                // 拼接歌曲列表
                this.featuredSongList = this.featuredSongList.concat(newSongList);

                // 设置歌曲列表
                this.setPlayList(this.featuredSongList);

                if (newSongList.length > 0) {
                    // 播放全部
                    this.setAllPlay({
                        list: this.getPlayList
                    });
                }

                // 如果歌曲列表长度大于 10 才设置当前歌曲索引
                if (this.featuredSongList.length > 5) {
                    // 设置当前播放歌曲索引
                    this.setCurrentIndex(this.saveCurrentSongIndex);
                }

                // 发送选择歌曲的信息总线程
                Bus.$emit('selectSong', this.getCurrentSong);
            },
            // 监听个性电台接口返回的数据
            personalFeaturedRadio(newSongList) {
                // 拼接歌曲列表
                this.featuredSongList = this.featuredSongList.concat(newSongList);

                // 设置歌曲列表
                this.setPlayList(this.featuredSongList);

                if (newSongList.length > 0) {
                    // 播放全部
                    this.setAllPlay({
                        list: this.getPlayList
                    });
                }

                // 如果歌曲列表长度大于 10 才设置当前歌曲索引
                if (this.featuredSongList.length > 5) {
                    // 设置当前播放歌曲索引
                    this.setCurrentIndex(this.saveCurrentSongIndex);
                }

                // 发送选择歌曲的信息总线程
                Bus.$emit('selectSong', this.getCurrentSong);
            }
        },
        components: {
            HomeSlider,
            TabRouter,
            ListMenu,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    // 滚动组件样式
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

    /*轮播图背景*/
    .silder-wrapper-bg {
        position: absolute;
        top: 0;
        width: 100%;
        height: px2rem(300px);
        opacity: 0;
        background: #000000;
        z-index: 100;
    }

    /*综合*/
    .complex-wrapper {
        display: flex;
        margin: px2rem(20px) 0;
        padding: 0 px2rem(20px);
        width: 100%;
        height: px2rem(240px);
        /*个性电台*/
        .individuality-radio {
            position: relative;
            flex: 0 0 px2rem(240px);
            height: px2rem(240px);
            background-size: cover;
            background-image: url(https://y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1462268549229011500.jpg?max_age=2592000);
            &::before {
                content: '';
                position: absolute;
                right: px2rem(-6px);
                width: px2rem(6px);
                top: 0;
                bottom: 0;
                margin: px2rem(10px) 0;
                box-sizing: border-box;
                background: rgba(199,199,199,1);
            }
            &::after {
                content: '';
                position: absolute;
                right: px2rem(-12px);
                width: px2rem(6px);
                top: 0;
                bottom: 0;
                margin: px2rem(20px) 0;
                box-sizing: border-box;
                background: rgba(227,227,227,1);
            }
            /*icon*/
            .icon {
                position: absolute;
                right: 0;
                left: 0;
                padding: px2rem(100px);
                color: #fff
            }
        }
        /*推荐*/
        .recommend-wrapper {
            margin-left: px2rem(30px);
            flex: 1;
            .recommend-content {
                display: flex;
                margin-bottom: px2rem(20px);
                width: 100%;
                height: px2rem(110px);
                background: #f5f5f5;
                /*标题*/
                .recommend-title {
                    flex: 1;
                    flex-direction: column;
                    padding: px2rem(20px);
                    text-align: left;
                    display: flex;
                    h1 {
                        margin: 0;
                    }
                    p {
                        margin: 0;
                    }
                    .name {
                        font-size: px2rem(34px);
                        color: #000;
                    }
                    .txt {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        line-height: px2rem(48px);
                        font-size: px2rem(24px);
                        color: #999;
                        width: px2rem(290px);
                    }
                }
                /*图片*/
                .recommend-img {
                    flex: 0 0 px2rem(110px);
                    height: 100%;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    /*精选电台*/
    .home-radio-wrapper {
        padding-bottom: px2rem(120px);
        /*标题*/
        .radio-title {
            position: relative;
            display: flex;
            margin-left: px2rem(30px);
            margin-right: px2rem(40px);
            box-sizing: border-box;
            text-align: center;
            line-height: px2rem(80px);
            height: px2rem(80px);
            color: $list-title;
            /*名称*/
            .name {
                flex: 1;
                display: inline-block;
                padding-left: px2rem(40px);
                margin: 0;
                letter-spacing: 5px;
                line-height: px2rem(80px);
                /*float: left;*/
                font-size: px2rem(32px);
            }
            /*icon*/
            .iconfont {
                position: absolute;
                right: 0;
                font-size: px2rem(40px);
                color: #999;
            }
        }
        /*导航数据*/
        .radio-data {
            padding: 0 px2rem(40px);
            display: flex;
            flex-wrap: wrap;
            min-height: px2rem(330px);
            .radio-data-li {
                flex: 1;
                flex-basis: 30%;
                width: 30%;
                /*图标*/
                .li-icon {
                    position: absolute;
                    padding: px2rem(80px);
                    color: #fff;
                }
                .li-cover {
                    border-radius: 50%;
                    width: 100%;
                    /*height: px2rem(215px);*/
                }
                .li-title {
                    position: relative;
                    padding-top: px2rem(20px);
                    text-align: center;
                    line-height: px2rem(32px);
                    font-size: px2rem(24px);
                    color: $list-title;
                    height: px2rem(80px);
                    span {
                        text-align: center;
                        display: block;
                    }
                }
                &:nth-child(3n + 2) {
                    margin: 0 px2rem(20px);
                }
            }
        }
    }
</style>
