<template>
    <div>
        <transition name="fade">
            <scroll class="scroll" ref="scroll" @scroll="scroll" v-show="homeSlider.length">
                <div>
                    <!--轮播图-->
                    <div class="silder-wrapper">
                        <div v-if="homeSlider.length">
                            <home-slider>
                                <div v-for="item in homeSlider">
                                    <a>
                                        <img :alt="item.pic_info.url" :src="item.pic_info.url" v-show="item.pic_info.url">
                                    </a>
                                </div>
                            </home-slider>
                        </div>
                    </div>
                    <!--轮播图背景-->
                    <div class="silder-wrapper-bg" ref="silderWrapperBg" v-show="translateY !== 5"></div>
                    <!--主页导航-->
                    <div class="tab-router-wrapper">
                        <tab-router
                            :tebLi="tebLi"
                            @selectRouter="selectRouter"
                            ref="tabRouter"></tab-router>
                    </div>
                    <!--综合-->
                    <div class="complex-wrapper">
                        <!--个性电台-->
                        <div class="individuality-radio" @click="clickPersonalFeaturedRadio(99)" :key="99">
                            <!--icon-->
                            <i class="material-icons icon">
                                {{getPlaying && featuredRadioId === 99 ? 'pause' : 'play_arrow'}}
                            </i>
                            <span class="name">我的电台</span>
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
                                    <img class="recommend-img" :alt="item.cover" v-lazy="item.cover"/>
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
        </transition>
        <!--警告弹框-->
        <transition name="alert-prompt">
            <v-alert color="error" icon="warning" dismissible v-model="warningPrompt" v-show="warningPrompt"
                     class="alert-Prompt">
                {{warningPromptTxt}}
            </v-alert>
        </transition>
        <!--loading-->
        <div class="loading-wrapper" v-show="!homeSlider.length">
            <img class="loading"
                 src="data:image/png;base64,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"/>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex';
    // 标签导航导航
    import TabRouter from 'components/tab-router/tab-router';
    // 轮播图组件
    import HomeSlider from 'base/homeSlider/homeSlider';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌单导航列表导航
    import ListMenu from 'base/list-menu/list-menu';
    // 设置cookie setCookie  获取cookie getCookie
    import {setCookie, getCookie} from 'common/js/cookie';
    // 自定义歌单专辑数据
    import {createSongSingle} from 'common/js/songSingle';
    // 样式兼容方法
    import {prefixStyle} from 'common/js/dom';
    // 保存主页选择对应歌单的数据到本地 saveSongSingle
    // 保存主页新歌模块跳转对应的模块的标题 saveNewSongSpeedTitle
    import {saveSongSingle, saveNewSongSpeedTitle} from 'common/js/cache';
    // 保存当前播放歌曲链接 savePlayUrl
    import {savePlayUrl} from 'common/js/cache';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';

    // transform 兼容
    const transform = prefixStyle('transform');

    export default {
        name: 'home',
//        async asyncData ({store}) {
//            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
//            await store.dispatch('asyncAjax/getHomeMessage'); // 主页数据接口
//            await store.dispatch('asyncAjax/getHomeFeaturedRadio'); // 主页精选电台导航接口
//            await store.dispatch('asyncAjax/getNewMvList', 'all'); // 获取MV列表接口
//        },
        data () {
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
                /*
                 * 警告弹框
                 * @type {Boolean}
                 * */
                warningPrompt: false,
                /*
                 * 警告提示框文字
                 * @type {String}
                 * */
                warningPromptTxt: '您的用户已在别处登录,请重新登录'
            };
        },
        mounted () {
            // 一些初始化操作
            this._initSome();
        },
        computed: {
            // 歌单导航模块数据
            listMenu () {
                this.list = [
                    {
                        listData: [{
                            'name': '为你推荐歌单',
                            'title': 'homeRecommend',
                            'data': this.homeRecommend.slice(0, 6)
                        },
                            {
                                'name': '最新专辑',
                                'title': 'newSongSpeed',
                                'data': this.homeAlbum.slice(0, 6)
                            },
                            {
                                'name': '最新MV',
                                'title': 'newMV',
                                'data': this.mvList.slice(0, 6)
                            }]
                    }
                ];

                return this.list;
            },
            // 获取歌曲播放的 guid !!!!!!!!!!!!!!!!!!!!!! 重要
            guid () {
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
                 * 获取主页最新专辑
                 * @typ {Array}
                 * */
                'homeAlbum',
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
                'ordinaryFeaturedRadio',
                /*
                 * 获取MV列表
                 * @typ {Array}
                 * */
                'mvList',
                /*
                 * 获取用户uid
                 * @typ {Array}
                 * */
                'userUid'
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
            }),
            ...mapGetters('asyncAjax', {
                /**
                 * 获取用户信息
                 * @type {Array}
                 */
                getUserMessage: 'userMessage'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome () {
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
                this.$refs.tabRouter.$el.style[transform] = `translate3d(0, -${this.translateY}px, 0)`;
                this.$refs.tabRouter.$el.style.boxShadow = `0px ${this.translateY === 0 ? 0 : this.translateY - 3}px ${this.translateY}px #999`;
                // 把歌曲guid保存到cookie
                this.setGuid();

                // 获取该用户的uid判断是否在另一个地方登录接口
                if (this.getUserMessage.username) {
                    this.setUserUid({username: this.getUserMessage.username});
                }

                // 主页数据接口
                this.setHomeMessage();
                // 主页精选电台导航接口
                this.setHomeFeaturedRadio();
                // 获取MV列表接口
                this.setNewMvList('all');
            },
            // 把歌曲guid保存到cookie !!!!!!!!!!!!!!!!!!!!!! 重要 每天设置一次
            setGuid () {
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
            scroll (pos) {
                this.scrollY = pos.y;
            },
            // 标签导航
            selectRouter (item) {
                this.$router.push({
                    path: `/home/${item.title}`
                });
            },
            // 点击综合推荐
            selectRecommend (item) {
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
            selectSongSingle (singer) {
                //跳转到对应的歌单页面
                if (singer.content_id) {
                    // 把选中的专辑的数据存入 localStorage多页通讯
                    saveSongSingle(createSongSingle(singer));

                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/songsingle/${singer.content_id}`
                    });
                }

                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (singer.dissid) {
                    // 把选中的专辑的数据存入 localStorage多页通讯
                    saveSongSingle(createSongSingle(singer));

                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/songsingle/${singer.dissid}`
                    });
                }

                // 如果点击的是MV就跳转到获取对应MV的信息页面
                if (singer.start === 'mv') {
                    // 跳转到MV页面
                    this.$router.push({
                        path: `/mv/${singer.vid}`
                    });
                }
            },
            // 点击歌单导航列表头部标题
            clickListTitle (data) {
                if (data === 'newSongSpeed') {
                    // 保存主页新歌模块跳转对应的模块的标题
                    saveNewSongSpeedTitle('新碟');
                    this.$router.push({
                        path: '/home/newSongSpeed'
                    });
                }
                else {
                    this.$router.push({
                        path: `/home/${data}`
                    });
                }
            },
            // 点击个性电台播放歌曲
            clickPersonalFeaturedRadio (id) {
                savePlayUrl('');
                // 控制歌曲播放
                this.setPlaying(!this.getPlaying);

                // 获取点击的电台的id
                this.featuredRadioId = id;

                if (!this.getPlaying) {
                    return;
                }

                // 设置播放器播放
                document.getElementsByTagName('audio')[0].play();

                // 初始化电台歌曲列表
                this.featuredSongList = [];

                // 请求个性电台歌曲列表
                this.setPersonalFeaturedRadio();
            },
            // 点击普通电台播放歌曲
            clickOrdinaryFeaturedRadio (item) {
                savePlayUrl('');

                // 控制歌曲播放
                this.setPlaying(!this.getPlaying);

                // 获取点击的电台的id
                this.featuredRadioId = item.radioId;

                // 设置播放器播放
                document.getElementsByTagName('audio')[0].play();
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
                setOrdinaryFeaturedRadio: 'getOrdinaryFeaturedRadio',
                /**
                 * 获取该用户的uid判断是否在另一个地方登录接口
                 */
                setUserUid: 'getUserUid',
                /**
                 * 设置用户退出
                 * @type {Array}
                 */
                setExitUser: 'exitUser',
                /**
                 * 主页数据接口
                 * @type {Array}
                 */
                setHomeMessage: 'getHomeMessage',
                /**
                 * 主页精选电台导航接口
                 * @type {Array}
                 */
                setHomeFeaturedRadio: 'getHomeFeaturedRadio',
                /**
                 * 获取MV列表接口
                 * @type {Array}
                 */
                setNewMvList: 'getNewMvList'
            })
        },
        // 组件激活
        activated () {
            // 设置首页头部导航
            this.setAppHeader({
                show: true
            });

            // 初始化标题导航向上偏移的位置
            this.translateY = 5;
            // 初始化轮播图背景样式
            this.$refs.silderWrapperBg.style.opacity = 0;
            this.$refs.tabRouter.$el.style[transform] = `translate3d(0, -${this.translateY}px, 0)`;
            this.$refs.tabRouter.$el.style.boxShadow = `0px ${this.translateY === 0 ? 0 : this.translateY - 3}px ${this.translateY}px #999`;
            // 刷新滚动组件
            this.$refs.scroll.refresh();
            // 重置滚动位置
            this.$refs.scroll.scrollTo(0, 0);

            // 获取该用户的uid判断是否在另一个地方登录接口
            if (this.getUserMessage.username) {
                this.setUserUid({username: this.getUserMessage.username});
            }
        },
        watch: {
            userUid (newUserUid) {
                // 如果当前用户的uid发生了变化就把用户下线
                if (newUserUid.uid !== this.getUserMessage.uid) {
                    // 设置用户退出
                    this.setExitUser();

                    // 弹出警告框
                    this.warningPrompt = true;
                }
            },
            // 监听滚动
            scrollY (newScrollY) {
                if (newScrollY < 0 && newScrollY < -5) {
                    // 设置标题导航向上偏移的位置
                    this.translateY = 0;
                    // 设置轮播图背景
                    this.$refs.silderWrapperBg.style.opacity = Math.abs(newScrollY / 100);
                    this.$refs.tabRouter.$el.style[transform] = `translate3d(0, -${this.translateY}px, 0)`;
                    this.$refs.tabRouter.$el.style.boxShadow = `0px ${this.translateY === 0 ? 0 : this.translateY - 3}px ${this.translateY}px #999`;
                }
                else {
                    // 设置标题导航向上偏移的位置
                    this.translateY = 5;
                    // 设置轮播图背景
                    this.$refs.silderWrapperBg.style.opacity = 0;

                    this.$refs.tabRouter.$el.style[transform] = `translate3d(0, -${this.translateY}px, 0)`;
                    this.$refs.tabRouter.$el.style.boxShadow = `0px ${this.translateY === 0 ? 0 : this.translateY - 3}px ${this.translateY}px #999`;
                }
            },
            // 监听主页轮播图数据
            homeSlider (newHomeSlider) {
                this.setScrollData(newHomeSlider);
            },
            // 监听点击的电台的id
            featuredRadioId (item) {
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
            getCurrentIndex (newIndex) {
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
            ordinaryFeaturedRadio (newSongList) {
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
            personalFeaturedRadio (newSongList) {
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

    /*弹出框动画*/
    .alert-prompt-enter-active, .alert-prompt-leave-active {
        transition: all .5s;
    }

    .alert-prompt-enter, .alert-prompt-leave-to {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    /*滚动组件样式*/
    .scroll {
        height: 100%;
        overflow: hidden;
    }

    /*弹出提示框*/
    .alert-Prompt {
        position: absolute;
        top: px2rem(30px);
        left: 0;
        right: 0;
        margin: 0 px2rem(20px);
        padding: px2rem(20px);
        font-size: px2rem(30px);
        z-index: 200;
        border: none;
        border-radius: px2rem(10px);
    }

    /*loading*/
    .loading-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 30%;
        bottom: 0;
        text-align: center;
        z-index: 300;
        .loading {
            position: relative;
            width: px2rem(200px);
            height: px2rem(200px);
        }
    }

    /*轮播图*/
    .silder-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(300px);
        background: #999;
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

    /*导航外层*/
    .tab-router-wrapper{
        margin: 0 .26667rem;
        box-sizing: border-box;
        height: 2.13333rem;
        background: #fff;
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
            background-image: url(../../common/img/gexingdauntai.png);
            &::before {
                content: '';
                position: absolute;
                right: px2rem(-6px);
                width: px2rem(6px);
                top: 0;
                bottom: 0;
                margin: px2rem(10px) 0;
                box-sizing: border-box;
                background: rgba(199, 199, 199, 1);
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
                background: rgba(227, 227, 227, 1);
            }
            /*icon*/
            .icon {
                position: absolute;
                right: 0;
                left: 0;
                padding: px2rem(100px);
                color: #fff;
                opacity: .8;
            }
            /*名称*/
            .name{
                position: absolute;
                left: 0;
                right: 0;
                text-align: center;
                font-size: px2rem(24px);
                bottom: px2rem(20px);
                color: #fff;
                letter-spacing: px2rem(2px);
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
                        font-size: px2rem(30px);
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
            padding: px2rem(20px) px2rem(40px) 0 px2rem(40px);
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
                    opacity: .8;
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
