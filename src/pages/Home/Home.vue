<template>
    <div>
        <scroll class="scroll" @scroll="scroll" ref="scroll">
            <div>
                <!--轮播图-->
                <div class="silder-wrapper">
                    <div v-if="slider.length">
                        <Slider>
                            <div v-for="item in slider">
                                <a :href="item.linkUrl">
                                    <img :src="item.picUrl">
                                </a>
                            </div>
                        </Slider>
                    </div>
                </div>
                <!--轮播图背景-->
                <div class="silder-wrapper-bg" ref="silderWrapperBg" v-show="translateY !== 5"></div>
                <!--主页导航-->
                <tab-router
                    :tebLi="tebLi"
                    :style="{transform: `translate3d(0, -${translateY}px, 0)`, boxShadow: `0px ${translateY === 0 ? 0 : translateY - 3}px ${translateY}px #999`}"
                    ref="tabRouter"></tab-router>
                <div class="content-wrapper">
                    <!--其他导航列表-->
                    <list-menu :List="List" @clickTitle="clickTitle" @select="selectSinger"></list-menu>
                    <!--精选电台-->
                    <div class="featuredRadio-wrapper">
                        <div class="list-title">
                            <h1 class="name">精选电台</h1>
                            <i class="iconfont icon-prev_arrow-copy"></i>
                        </div>
                        <ul class="list-data">
                            <li v-for="(item, index) in featuredRadio" :key="index"
                                @click.stop="playFeaturedRadio(item)">
                                <v-icon class="icon">{{getSongPlaying && clickFeaturedRadio === item.radioId? 'pause' : 'play_arrow'}}</v-icon>
                                <img class="cover" v-lazy="item.radioImg"/>
                                <div class="title">
                                    <span>{{item.radioName}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex';
    import {setCookie} from 'common/js/cookie';
    // 自定义歌单推荐数据
    import {createSongTableMessage} from 'common/js/songTableMessage';
    // 对list数据做处理
    import {normalizeNewSongs} from 'common/js/song';
    // 轮播图
    import Slider from 'base/slider/slider';
    // 菜单模块导航
    import ListMenu from 'base/list-menu/list-menu';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // TabRouter导航
    import TabRouter from 'components/tabRouter/tabRouter';

    export default {
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('asyncAjax/getSlider'); // 轮播图请求
            await store.dispatch('asyncAjax/getMusicuMessage'); // 音乐数据接口请求
            await store.dispatch('asyncAjax/getfeaturedRadio'); // 精选电台接口请求
            await store.dispatch('asyncAjax/getDigitalAlbum'); // 数字专辑接口请求
        },
        data() {
            return {
                /*
                 * 获取Y轴滚动
                 * @type {Number}
                 * */
                scrollY: 0,
                /*
                 * 设置tab-router向上偏移的位置
                 * @type {Number}
                 * */
                translateY: 5,
                /*
                * 获取点击的电台的id
                * @type {Number}
                * */
                clickFeaturedRadio: null,
                /*
                 * 设置标签信息
                 * @type {Array}
                 * */
                tebLi: [{
                    tab: [{'name': '歌手', 'iconfont': 'icon-maikefeng'},
                        {'name': '排行', 'iconfont': 'icon-paixingbang1'},
                        {'name': '主播电台', 'iconfont': 'icon-erji3'},
                        {'name': '数字专辑', 'iconfont': 'icon-zhuanjiguangpan'}
                    ]
                }],
                /*
                * 保存当前的歌曲列表
                * @type {Array}
                * */
                featuredSongList: [],
                /*
                * 保存当前的歌曲index
                * @type {Array}
                * */
                saveCurrentSongIndex: 0
            };
        },
        computed: {
            ...mapState('asyncAjax', [
                /*
                * 轮播图请求返回的数据
                * @typ {Array}
                * */
                'slider',
                /*
                * 热门推荐数据
                * @typ {Array}
                * */
                'recommend',
                /*
                * 新歌导航
                * @typ {Array}
                * */
                'newSong',
                /*
                * 主页精选电台导航数据
                * @typ {Array}
                * */
                'featuredRadio',
                /*
                * 获取精选电台歌曲列表
                * @typ {Array}
                * */
                'featuredRadioSongList',
                /*
                * 获取个性电台歌曲列表
                * @typ {Array}
                * */
                'personalFeaturedRadio'
            ]),
            ...mapGetters('appStore', {
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList',
                /**
                 * 当前播放歌曲索引
                 * @type {Number}
                 */
                getCurrentIndex: 'currentIndex',
                /**
                 * 获取歌曲是否播放
                 * @type {Boolean}
                 */
                getSongPlaying: 'playing'
            }),
            // 主页类别  模块 数据
            List() {
                this.list = [
                    {
                        recommend: [{
                            'name': '为你推荐歌单',
                            'title': 'hotRecommend',
                            'data': this.recommend
                        }]
                    },
                    {
                        recommend: [{
                            'name': '新歌速递',
                            'title': 'newSongSpeed',
                            'data': this.newSong
                        }]
                    }
                ];
                return this.list;
            },
            // 获取歌曲播放的 guid !!!!!!!!!!!!!!!!!!!!!! 重要
            guid() {
                let date = new Date();
                return Math.round(2147483647 * Math.abs(Math.random() - 1) * date.getUTCMilliseconds() % 1e10);
            }
        },
        created() {
            // 获取cookie 获取歌曲播放的 guid
            // 设置guid 到cookie中 !!!!!!!!!!!!!!!!!!!!!! 重要 每天设置一次
            let d = new Date();
            let n = d.getHours();
            if (n === 0) {
                setCookie('guid', this.guid, Infinity, '/');
            }

            // 设置滚动列表不能回弹
            this.bounce(false);
        },
        mounted() {
            // 一些初始化操作
            this._initDom();
        },
        methods: {
            // 一些初始化操作
            _initDom() {
                // 设置滚动组件滚动的状态
                this.probeType(3);
                // scroll 组件 开启滚动监听
                this.listenScroll(true);

                // 初始化轮播图样式
                this.translateY = 5;
                this.$refs.silderWrapperBg.style.opacity = 0;
            },
            // 点击标题 跳转页面
            clickTitle(data) {
                this.newSongListTitle('新歌');

                this.$router.push({
                    path: `/${data}`
                });
            },
            // 点击精选电台播放歌曲
            playFeaturedRadio(item) {
                // 控制歌曲播放
                this.setPlaying(!this.getSongPlaying);

                if (!this.getSongPlaying) {
                    return;
                }

                // 获取点击的电台的id
                this.clickFeaturedRadio = item.radioId;
                // 初始化电台歌曲列表
                this.featuredSongList = [];

                // 如果不是点击个性电台就请求正常电台播放歌曲列表
                if (item.radioId !== '99') {
                    // 获取点击的电台的id
                    // 请求电台歌曲列表
                    this.getFeaturedRadio(this.clickFeaturedRadio);
                }
                else {
                    // 请求个性电台歌曲列表
                    this.getPersonalFeaturedRadio();
                }
            },
            // 监听滚动
            scroll(pos) {
                this.scrollY = pos.y;
            },
            // 选择列表 中的模块 跳转页面
            selectSinger(singer, bigTitle) {
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (singer.content_id) {
                    // 把选中的专辑的数据存入 homeSonglist
                    this.homeSonglist(createSongTableMessage(singer));
                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/home/${singer.content_id}`
                    });
                }

                if (singer.status && bigTitle) {
                    this.newSongListTitle(bigTitle);
                    this.$router.push({
                        path: `/newSongSpeed`
                    });
                }
            },
            ...mapActions('appStore', {
                /*
                 * 主页选中的专辑数据
                 * type {Object}
                 */
                homeSonglist: 'homeSonglist',
                /**
                 * 歌曲列表接口一次请求的页数 一次 +15
                 * @type {Number}
                 */
                // 'songBegin',
                /**
                 * 歌曲列表信息
                 * @type {Object}
                 */
                songListMessage: 'songListMessage',
                /**
                 * 设置歌曲列表
                 * @type {Array}
                 */
                setSongList: 'songList',
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                bounce: 'bounce',
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                data: 'data',
                /**
                 * 设置scroll组件 要不要监听滚动事件
                 * @type {Boolean}
                 */
                listenScroll: 'listenScroll',
                /**
                 * 滚动的状态
                 * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
                 * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
                 * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
                 * @type {Number}
                 */
                probeType: 'probeType',
                /*
                 * 新歌速递模块点击内容标题
                 * @type {String}
                 * */
                newSongListTitle: 'newSongListTitle',
                /**
                 * 播放全部歌曲
                 * @type {Array}
                 */
                allPlay: 'allPlay',
                /**
                 * 设置当前播放歌曲索引
                 * @type {Boolean}
                 */
                setCurrentIndex: 'currentIndex',
                /**
                 * 控制歌曲播放
                 * @type {Boolean}
                 */
                setPlaying: 'playing'
            }),
            ...mapActions('asyncAjax', [
                /*
                 * 主页请求的音乐模块的数据
                 * type {Array}
                 */
                'getMusicuMessage',
                /*
                 * 精选电台歌曲接口请求
                 * type {Array}
                 */
                'getFeaturedRadio',
                /*
                 * 个性电台歌曲接口请求
                 * type {Array}
                 */
                'getPersonalFeaturedRadio'
            ])
        },
        // 组件激活时调用
        activated() {
            // 初始化轮播图样式
            this.translateY = 5;
            this.$refs.silderWrapperBg.style.opacity = 0;
        },
        watch: {
            // 监听滚动
            scrollY(newScrollY) {
                if (newScrollY < 0 && newScrollY < -5) {
                    this.translateY = 0;
                    this.$refs.silderWrapperBg.style.opacity = Math.abs(newScrollY / 100);
                }
                else {
                    this.translateY = 5;
                    this.$refs.silderWrapperBg.style.opacity = 0;
                }
            },
            // 监听推荐歌单歌曲变化
            recommend(newRecommend) {
                this.data(newRecommend);
            },
            // 监听当前播放歌曲的index
            getCurrentIndex(newIndex) {
                // 获取歌曲是否播放
                if (!this.getSongPlaying) {
                    return;
                }

                // 如果歌曲已经播放到最后一首就重新请求一次接口
                if (newIndex === this.getSongList.length - 1 && this.clickFeaturedRadio !== '99') {
                    // 保存当前歌曲的index;
                    this.saveCurrentSongIndex = newIndex;

                    // 请求电台歌曲列表
                    this.getFeaturedRadio(this.clickFeaturedRadio);
                }
                else if (newIndex === this.getSongList.length - 1 && this.clickFeaturedRadio === '99') {
                    // 保存当前歌曲的index;
                    this.saveCurrentSongIndex = newIndex;

                    // 请求个性电台歌曲列表
                    this.getPersonalFeaturedRadio();
                }
            },
            // 监听精选电台接口返回的数据
            featuredRadioSongList(newSongList) {
                // 拼接歌曲列表
                this.featuredSongList = this.featuredSongList.concat(normalizeNewSongs(newSongList));
                // 设置歌曲列表
                this.setSongList(this.featuredSongList);

                if (newSongList.length > 0) {
                    // 播放全部
                    this.allPlay({
                        list: this.getSongList
                    });
                }

                // 如果歌曲列表长度大于 10 才设置当前歌曲索引
                if (this.featuredSongList.length > 10) {
                    // 设置当前播放歌曲索引
                    this.setCurrentIndex(this.saveCurrentSongIndex);
                }
            },
            // 监听个性电台接口返回的数据
            personalFeaturedRadio(newSongList) {
                // 拼接歌曲列表
                this.featuredSongList = this.featuredSongList.concat(normalizeNewSongs(newSongList));
                // 设置歌曲列表
                this.setSongList(this.featuredSongList);

                if (newSongList.length > 0) {
                    // 播放全部
                    this.allPlay({
                        list: this.getSongList
                    });
                }

                // 如果歌曲列表长度大于 10 才设置当前歌曲索引
                if (this.featuredSongList.length > 5) {
                    // 设置当前播放歌曲索引
                    this.setCurrentIndex(this.saveCurrentSongIndex);
                }
            }
        },
        components: {
            Slider,
            ListMenu,
            Scroll,
            TabRouter
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .scroll {
        height: 100%;
        overflow: hidden;
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

    /*轮播图*/
    .silder-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(300px);
    }

    .content-wrapper {
        overflow: hidden;
        background: $content-bgcolor;
    }

    .list-title {
        position: relative;
        display: flex;
        margin-left: px2rem(30px);
        margin-right: px2rem(40px);
        box-sizing: border-box;
        text-align: center;
        line-height: px2rem(80px);
        height: px2rem(80px);
        color: $list-title;
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
        .iconfont {
            position: absolute;
            right: 0;
            font-size: px2rem(40px);
            color: #999;
        }
    }

    .list-data {
        padding: 0 px2rem(40px);
        display: flex;
        flex-wrap: wrap;
        min-height: px2rem(330px);
        li {
            flex: 1;
            flex-basis: 30%;
            width: 30%;
            /*图标*/
            .icon {
                position: absolute;
                padding: px2rem(80px);
                color: #fff;
            }
            .cover {
                border-radius: 50%;
                width: 100%;
                height: px2rem(215px);
            }
            .title {
                position: relative;
                padding: px2rem(20px) px2rem(10px) 0 px2rem(10px);
                text-align: center;
                line-height: px2rem(32px);
                font-size: px2rem(24px);
                color: $list-title;
                height: px2rem(80px);
                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }
        }
    }

    li:nth-child(3n + 2) {
        margin: 0 px2rem(20px);
    }
</style>
