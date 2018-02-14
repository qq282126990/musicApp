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
                    ref="tabRouter"></tab-router>
                <!--歌单导航列表-->
                <list-menu :listMenu="listMenu"
                           @clickListTitle="clickListTitle"
                           @selectSongSingle="selectSongSingle"></list-menu>
                <!--精选电台-->
                <div class="home-fr-wrapper">
                    <!--标题-->
                    <div class="fr-title">
                        <!--名称-->
                        <h1 class="name">精选电台</h1>
                        <!--icon-->
                        <i class="iconfont icon-prev_arrow-copy"></i>
                    </div>
                    <!--导航数据-->
                    <ul class="fr-data">
                        <li class="fr-data-li"
                            v-for="(frItem, index) in homeFeaturedRadio"
                            :key="index">
                            <!--icon-->
                            <v-icon class="li-icon">
                                play_arrow
                            </v-icon>
                            <!--电台图片-->
                            <img class="li-cover" :alt="frItem.radioImg" v-lazy="frItem.radioImg"/>
                            <!--电台标题-->
                            <div class="li-title">
                                <span>{{frItem.radioName}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
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
    // 保存主页选择对应歌单的数据到本地
    import {saveSongSingle} from 'common/js/cache';

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
                 * 设置标签导航信息
                 * @type {Array}
                 * */
                tebLi: [{
                    tab: [{'name': '歌手', 'iconfont': 'icon-maikefeng'},
                        {'name': '排行', 'iconfont': 'icon-paixingbang1'},
                        {'name': '主播电台', 'iconfont': 'icon-erji3'},
                        {'name': '数字专辑', 'iconfont': 'icon-zhuanjiguangpan'}
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
                            'data': this.homeRecommend
                        }]
                    },
                    {
                        listData: [{
                            'name': '新歌速递',
                            'title': 'newSongSpeed',
                            'data': this.homeNewSongSpeed
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
                'homeFeaturedRadio'
            ])
        },
        mounted () {
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
            // 点击歌单导航列表头部标题
            clickListTitle(data) {
//                this.$router.push({
//                    path: `/${data}`
//                });
            },
            // 选择歌单导航列表内容跳转页面
            selectSongSingle(singer, bigTitle) {
                // 清除 clickFeaturedRadio

                // this.clickFeaturedRadio = null;

                //跳转到对应的歌单页面
                if (singer.content_id) {
                    // 把选中的专辑的数据存入 localStorage多页通讯
                    saveSongSingle(createSongSingle(singer));

                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/songsingle/${singer.content_id}`
                    });
                }

                // 主页新歌模块跳转
//                if (singer.status && bigTitle) {
//                    this.newSongListTitle(bigTitle);
//                    this.$router.push({
//                        path: `/newSongSpeed`
//                    });
//                }
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
            }),
        },
        // 组件激活
        activated() {
            // 设置首页头部导航
            this.setAppHeader({
                show: true
            });
        },
        // 组件销毁
        destroyed () {
            // 设置首页头部导航
            this.setAppHeader({
                show: false
            });
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

    /*精选电台*/
    .home-fr-wrapper {
        padding-bottom: px2rem(120px);
        /*标题*/
        .fr-title {
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
        .fr-data {
            padding: 0 px2rem(40px);
            display: flex;
            flex-wrap: wrap;
            min-height: px2rem(330px);
            .fr-data-li {
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
