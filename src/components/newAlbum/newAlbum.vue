<template>
    <div class="new-album-wrapper">
        <header-scroll :headerSelect="headerSelect"
                       :newSongList="headerScrollData"
                       @selectHeader="selectHeader"
        ></header-scroll>
        <transition name="slide">
            <scroll class="song-list" v-show="listData.length">
                <ul>
                    <li v-for="item in listData" @click="selectItem(item)">
                        <!--头像-->
                        <img class="avatar"
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
        <!--loading组件-->
        <div class="loading-wrapper" v-show="!listData.length">
            <loading></loading>
            <span class="text">加载中...</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import {mapActions, mapState} from 'vuex';
    // 头部滚动组件
    import HeaderScroll from 'base/header-scroll/header-scroll';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';
    // 对新碟数据列表做处理
    import {listNewAlbum} from 'common/js/newAlbum';
    // 自定义歌单推荐数据
    import {createSongTableMessage} from 'common/js/songTableMessage';

    export default {
        data() {
            return {
                /*
                * 设置初始化完成
                * */
                _init: false,
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
                 * 设置头部导航显示的数据
                 * @type {Array}
                 * */
                headerScrollData: [],
                /*
                * 设置新碟列表数据
                * @type {Array}
                * */
                newAlbumListData: [],
                listData: [],
                /*
                * 设置新碟列表数据开始坐标
                * @type {Array}
                * */
                listSin: 0
            };
        },
        mounted() {
            // 设置初始化完成
            this.init = true;

            setTimeout(() => {
                // 获取新碟数据
                this.getNewAlbum({
                    'area': this.headerSelect,
                    'sin': this.listSin
                });
            }, 1000);
        },
        computed: {
            ...mapState('asyncAjax', {
                newAlbum: 'newAlbum'
            })
        },
        methods: {
            // 选择头部导航
            selectHeader(item, index) {
                this.listData = [];
                // 设置头部导航那个激活了
                this.headerSelect = item.id;

                // 设置头部导航的index索引
                this.currentHeader = index;

                setTimeout(() => {
                    // 判断是否已经请求过歌曲列表了
                    if (this.newAlbumListData[this.currentHeader].length > 0) {
                        this.listData = this.newAlbumListData[this.currentHeader];
                        return;
                    }

                    this.getNewAlbum({
                        'area': item.id,
                        'sin': this.listSin
                    });
                }, 1000);
            },
            // 点击选择歌单
            selectItem(data) {
                console.log(data);
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (data.dissid) {
                    // 把选中的专辑的数据存入 homeSonglist
                    this.setHomeSonglist(createSongTableMessage(data));
                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/home/${data.dissid}`
                    });
                }
            },
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
            ...mapActions('asyncAjax', [
                /*
                * 获取新碟数据
                * @type {Object}
                * */
                'getNewAlbum'
            ]),
            ...mapActions('appStore', {
                /**
                 * 设置滚动组件数据
                 * @type {Array}
                 */
                setScrollData: 'data',
                /*
                 * 主页选中的专辑数据
                 * type {Object}
                 */
                setHomeSonglist: 'homeSonglist'
            })
        },
        // 组件激活时调用
        activated() {
            // 设置初始化完成
            this.init = true;
        },
        watch: {
            newAlbum(data) {
                if (this.init) {
                    // 对头部导航数据做处理
                    this._normalizeSongs(data.tags.area);

                    // 创建新碟列表数据
                    this._initNewAlbumListData(data.tags.area);
                }
                this.init = false;

                // 设置新碟列表数据
                this.newAlbumListData[this.currentHeader] = listNewAlbum(data.list);
                this.listData = this.newAlbumListData[this.currentHeader];

                // 设置滚动组件数据
                this.setScrollData(data);
            }
        },
        components: {
            HeaderScroll,
            Scroll,
            Loading
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .slide-enter-active, .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate(100%, 0);
    }

    .new-album-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .scroll {
        overflow: hidden;
        white-space: nowrap;
    }

    /*显示的内容*/
    .song-list {
        position: fixed;
        top: px2rem(174px);
        bottom: px2rem(120px);
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 20;
        padding: 0;
        ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        li {
            position: relative;
            flex-basis: 50%;
            box-sizing: border-box;
            overflow: hidden;
            text-align: left;
            /*歌单图片*/
            .avatar {
                display: block;
                padding-right: px2rem(10px);
                border-top-right-radius: px2rem(15px);
                border-bottom-right-radius: px2rem(15px);
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
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            /*播放量*/
            .play-number-wrapper {
                position: absolute;
                margin-top: px2rem(-50px);
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
        li:nth-child(2n + 2) {
            .avatar {
                padding-left: px2rem(10px);
                padding-right: 0;
                border-top-left-radius: px2rem(15px);
                border-bottom-left-radius: px2rem(15px);
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
    }

    /*loading组件*/
    .loading-wrapper {
        position: fixed;
        top: 50%;
        box-sizing: border-box;
        width: 100%;
        z-index: 10;
        .text {
            box-sizing: border-box;
            font-size: px2rem(30px);
            margin: px2rem(20px) 0 0 px2rem(20px);
        }
    }

    /*歌曲列表外层*/
    .song-list {

    }
</style>
