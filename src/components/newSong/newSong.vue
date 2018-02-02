<template>
    <div class="new-song-wrapper">
        <!--头部导航-->
        <div class="header-router">
            <div ref="headerListWrapper">
                <ul ref="headerList">
                    <li class="item"
                        :class="{'active': headerSelect === index}"
                        v-for="(item,index) in newSongList.type_info" :key="item.title"
                        @click="selectHeader(item,index)"
                    >
                        <v-btn flat class="title" v-if="index === 0" @clic.stop="">
                            <span>最新</span>
                        </v-btn>
                        <v-btn flat class="title" v-else>
                            <span>{{item.title}}</span>
                        </v-btn>
                    </li>
                </ul>
            </div>
        </div>
        <!--显示的内容-->
        <div class="content" ref="sliderSwitch">
            <!--歌曲列表-->
            <div style="height: 100%;" v-for="(item, index) in newSongListData" v-if="headerSelect === index">
                <transition name="fade">
                    <scroll class="song-list" v-show="newSongListData[index]">
                        <div>
                            <div class="list-header">
                                <!--播放全部-->
                                <div class="play-all-wrapper">
                                    <v-icon class="play">play_circle_outline</v-icon>
                                    <h3 class="title">全部播放</h3>
                                    <span class="total-number">共{{totalSongNum}}首</span>
                                </div>
                                <!--下载-->
                                <div class="download">
                                    <i class="iconfont icon-xiazai"></i>
                                    <span class="title">下载</span>
                                </div>
                                <!--多选-->
                                <div class="multiple-select">
                                    <i class="iconfont icon-pingtaitubiao_duoxuan icon"></i>
                                    <span class="title">多选</span>
                                </div>
                            </div>
                            <song-list
                                @select="selectSong"
                                ref="SongListWrapper"
                            ></song-list>
                        </div>
                    </scroll>
                </transition>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import {mapState, mapActions, mapGetters} from 'vuex';
    // 对list数据做处理
    import {normalizeNewSongs} from 'common/js/song';
    // 滚动插件
    import BScroll from 'better-scroll';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌曲列表
    import SongList from 'base/song-list/song-list';
    import {addClass} from 'common/js/dom';

    export default {
        data() {
            return {
                /*
                 * 设置头部导航那个激活了
                 * */
                headerSelect: 0,
                /*
                * 歌曲总数
                * */
                totalSongNum: '',
                /*
                * 歌曲列表数据
                * */
                newSongListData: [{}, {}, {}, {}, {}, {}]
            };
        },
        computed: {
            ...mapState('asyncAjax', [
                /*
                 * 获取歌单速递数据
                 * @type {Object}
                 * */
                'newSongList'
            ]),
            ...mapGetters('asyncAjax', [
                /*
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Object}
                 * */
                'switchNewSongList'
            ]),
            ...mapGetters('appStore', {
                getSongList: 'songList'
            })
        },
        mounted() {
            // 设置滑动的宽度
            this.$nextTick(() => {
                // 初始化一些操作
                this._initSong();
            });
        },
        methods: {
            // 初始化一些操作
            _initSong() {
                // 设置头部滚动
                this._setHeaderScroll();

                // 设置内容总的宽度
                this._setSliderWidth();

                // 默认请求最新歌曲列表
                this.getSwitchNewSongList(0);

                // 设置滚动组件数据
                this.setScrollData(this.newSongList);
            },

            // 选择歌曲列表
            selectSong(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });

                // 默认请求最新歌曲列表
                this.getSwitchNewSongList(index);
            },
            // 选择头部导航
            selectHeader(item, index) {
                // 设置头部导航那个激活了
                this.headerSelect = index;

                // 判断是否已经请求过歌曲列表了
                if (this.newSongListData[index].length > 0) {
                    this.setSongList(this.newSongListData[index]);
                    return;
                }
                // 获取新歌速递模块点击内容标题 对应type的数据
                this.getSwitchNewSongList(index);
            },
            // 设置头部导航滑动的宽度
            _setHeaderScroll() {
                if (this.newSongList.type_info) {
                    // 获取所有内容标签
                    this.children = this.$refs.headerList.children;
                    // 初始化宽度
                    let width = 0;

                    // 循环选项
                    for (let i = 0; i < this.children.length; i++) {
                        // 获取每个
                        let headerListchild = this.children[i].clientWidth;

                        // 设置每个轮播图的宽度
                        width += headerListchild;
                    }

                    // 设置整个头部的宽度
                    this.$refs.headerList.style.width = width + 'px';


                    this.$nextTick(() => {
                        if (!this.headerScroll) {
                            this.headerScroll = new BScroll(this.$refs.headerListWrapper, {
                                // 设置X轴滚动
                                scrollX: true,
                                // 当设置 eventPassthrough 为 'vertical' 的时候 ScrollY无效
                                eventPassthrough: 'vertical'
                            });
                        }
                        else {
                            // 刷新头部滚动
                            this.headerScroll.refresh();
                        }
                    });
                }
            },
            // 设置滑动的宽度
            _setSliderWidth() {
                // 获取所有内容
                this.children = this.$refs.sliderSwitch.children;

                // 初始化宽度
                let width = 0;
                // 初始化当前的宽度为当前视图宽度
                let sliderSwitchWidth = this.$refs.sliderSwitch.clientWidth;

                // 循环内容
                for (let i = 0; i < this.children.length; i++) {
                    // 获取每个内容
                    let child = this.children[i];
                    // 为每个内容添加一个类
                    addClass(child, 'slider-switch-item');
                    // 设置每个内容的宽度 = 当前视图宽度
                    child.style.width = sliderSwitchWidth + 'px';
                    // 设置每个的宽度
                    width += sliderSwitchWidth;
                }

                // 设置整个内容区域的宽度
                this.$refs.sliderSwitch.style.width = width + 'px';
            },
            // 异步接口请求
            ...mapActions('asyncAjax', {
                /**
                 * 获取新歌速递模块点击内容标题 对应type的数据
                 * @type {Array}
                 */
                getSwitchNewSongList: 'getSwitchNewSongList'
            }),
            ...mapActions('appStore', {
                /**
                 * 设置滚动组件数据
                 * @type {Array}
                 */
                setScrollData: 'data',
                /**
                 * 歌曲列表
                 * @type {Array}
                 */
                setSongList: 'songList',
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay'
            })
        },
        watch: {
            // 监听歌曲列表的变化
            switchNewSongList(newList) {
                // 保存歌曲列表
                this.newSongListData[newList.type] = normalizeNewSongs(newList.song_list);
                // 设置歌曲列表
                this.setSongList(normalizeNewSongs(newList.song_list));
                // 设置歌曲数量
                this.totalSongNum = this.newSongList.size;
            }
        },
        components: {
            SongList,
            Scroll
        }
    };
</script>

<style lang="stylus" scoped>
    @import '../../assets/styles/global.styl';

    .btn {
        margin: 0;
        min-width: inherit;
    }

</style>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .new-song-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .scroll {
        overflow: hidden;
        white-space: nowrap;
    }

    /*头部导航*/
    .header-router {
        position: relative;
        height: px2rem(90px);
        background: #fff;
        z-index: 1000;
        ul {
            padding: 0;
            display: -webkit-box;
            height: px2rem(90px);
        }
        .item {
            display: -webkit-box;
            -webkit-box-pack: center;
            -webkit-box-flex: 0;
            width: px2rem(136px);
            &.active {
                span {
                    color: $new-song-header-active-color;
                }
                ::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 2;
                    -webkit-box-sizing: border-box;
                    height: 0;
                    margin: 0 px2rem(28px);
                    border-bottom: solid px2rem(8px);
                    color: $new-song-header-active-color;
                }
            }
            .title {
                position: relative;
                display: -webkit-box;
                -webkit-box-align: center;
                height: px2rem(90px);
                white-space: nowrap;
                font-size: px2rem(32px) !important;
                width: 100%;
            }
        }
    }

    /* 歌曲列表头部*/
    .list-header {
        position: relative;
        //bottom: px2rem(-108px);
        background: $list-bgcolor;
        box-sizing: border-box;
        z-index: 100;
        display: flex;
        padding: 0 px2rem(32px);
        border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        height: px2rem(108px);
        width: 100%;
        /*播放全部*/
        .play-all-wrapper {
            flex: 1;
            position: relative;
            display: -webkit-box;
            -webkit-box-align: center;
            line-height: px2rem(108px);
            height: px2rem(108px);
            // 播放按钮
            .play {
                display: block;
                margin-right: px2rem(30px);
                font-size: px2rem(52px);
                color: $play-color;
            }
            .title {
                display: block;
                font-size: px2rem(28px);
                margin: 0;
            }
            // 歌曲总数
            .total-number {
                display: block;
                position: relative;
                top: px2rem(4px);
                margin-left: px2rem(20px);
                font-size: px2rem(24px);
                color: $total-number-color;
            }
        }

        /*下载*/
        .download {
            display: -webkit-box;
            -webkit-box-align: center;
            margin-right: px2rem(40px);
            .icon-xiazai {
                display: block;
                font-size: px2rem(44px);
                color: $play-color;
            }
            .title {
                margin-left: px2rem(10px);
                display: block;
                font-size: px2rem(28px);
            }
        }

        /*多选*/
        .multiple-select {
            display: -webkit-box;
            -webkit-box-align: center;
            .icon {
                display: block;
                font-size: px2rem(44px);
                color: $play-color;
            }
            .title {
                margin-left: px2rem(10px);
                display: block;
                font-size: px2rem(28px);
            }
        }
    }

    .content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .slider-switch-item {
            position: relative;
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
        }
    }

    /*歌曲列表外层*/
    .song-list {
        margin-top: px2rem(174px);
        padding: 0;
        position: fixed;
        top: 0;
        bottom: px2rem(120px);
        width: 100%;
        &.fade-enter-active, &.fade-leave-active {
            transition: opacity .5s;
        }

        &.fade-enter, &.fade-leave-to {
            opacity: 0;
        }
    }
</style>
