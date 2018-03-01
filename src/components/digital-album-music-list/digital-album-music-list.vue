<template>
    <div class="wrapper">
        <!--返回按钮-->
        <div class="back" @click="back">
            <i class="iconfont icon-fanhui1-copy"></i>
        </div>
        <scroll class="scroll-warpper">
            <div v-show="albumMessage.cover">
                <!--专辑图片-->
                <div class="cover-wrapper">
                    <!--背景-->
                    <div class="background">
                        <img
                            :alt="albumMessage.cover"
                            v-lazy="albumMessage.cover"/>
                    </div>
                    <!--模糊层-->
                    <div class="filter"></div>
                    <!--图片-->
                    <div class="cd-box">
                        <img class="cd-box-cove"
                             :alt="albumMessage.cover"
                             v-lazy="albumMessage.cover"/>
                        <span class="cd_ornament"></span>
                    </div>
                    <!--专辑标题-->
                    <h1 class="album-title">{{albumMessage.album_name}}</h1>
                </div>
                <!--歌曲内容列表-->
                <div class="content">
                    <!--内容头部-->
                    <div class="content-header">
                        <span class="text">未开通</span>
                        <span class="text active">详情</span>
                        <span class="text">未开通</span>
                    </div>
                    <!--专辑介绍-->
                    <div class="introduction">
                        <div class="introduction-title">
                            <h2>简介</h2>
                        </div>
                        <div class="text">
                            <!--唱片公司-->
                            <p class="company">唱片公司：{{albumMessage.companyname}}</p>
                            <!--发行时间-->
                            <p class="time">发行时间：{{albumMessage.publictime}}</p>
                            <!--文字-->
                            <div class="txt">
                                <p v-html="albumMessage.desc"></p>
                            </div>
                            <!--展开全文-->
                            <span class="show-all">[展开全文]</span>
                        </div>
                    </div>
                    <song-list :setStyle="setStyle" @selectSong="selectSong"></song-list>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions, mapGetters} from 'vuex';
    // 创建数字专辑歌曲列表信息
    import {createDigitalAlbumSongListMessage} from 'common/js/totalDigitalAlbum';
    // 保存主页新歌模块跳转对应的模块的标题 saveNewSongSpeedTitle
    import {saveNewSongSpeedTitle} from 'common/js/cache';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';
    // 歌曲列表
    import SongList from 'base/song-list/song-list';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';

    export default {
        data () {
            return {
                /*
                 * 数字专辑信息
                 * */
                albumMessage: {},
                /*
                 * 设置歌曲列表字体样式
                 * */
                setStyle: 'colorWhite',
                /*
                 * 判断当前是否重复点击歌曲列表
                 * @type {String}
                 * */
                oldSong: null
            };
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取数字专辑歌曲列表数据
                 * @type {Object}
                 * */
                getDigitalAlbumSongList: 'digitalAlbumSongList'
            }),
            ...mapGetters('asyncAjax', {
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList'
            }),
            ...mapGetters('appStore', {
                /**
                 * 获取当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong',
            })
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();

                // 保存主页新歌模块跳转对应的模块的标题
                saveNewSongSpeedTitle('数字专辑');
            },
            // 选择要播放的歌曲
            selectSong(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });

                // 如果不是重复点击就初始化oldSong
                if (this.oldSong !== item.id) {
                    this.oldSong = null;
                }

                // 如果oldSong为空才执行
                if (!this.oldSong) {
                    this.oldSong = item.id;

                    // 设置播放器播放
                    document.getElementsByTagName('audio')[0].play();

                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                /*
                 * 获取数字专辑歌曲列表数据
                 * */
                setDigitalAlbumSongList: 'getDigitalAlbumSongList',
                /**
                 * 获取歌曲列表播放地址
                 */
                setSongListPlayingUrl: 'getSongListPlayingUrl'
            }),
            ...mapActions('appStore', {
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 选择播放的歌曲
                 * @type {Boolean}
                 */
                setSelectPlay: 'selectPlay'
            })
        },
        // 当组件激活的调用
        activated() {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });

            if (!this.getSongList.id) {
                this.$router.back();
            }
            // 获取数字专辑歌曲列表数据
            this.setDigitalAlbumSongList(this.getSongList.id);
        },
        watch: {
            getDigitalAlbumSongList (newSongList) {
                // 滚动组件传入的数据
                this.setScrollData(newSongList);

                if (!newSongList.songlist) {
                    return;
                }

                // 获取专辑信息
                this.albumMessage = createDigitalAlbumSongListMessage(newSongList);

                // 请求歌曲列表播放地址
                this.setSongListPlayingUrl(newSongList.songlist);
            }
        },
        components: {
            SongList,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .wrapper {
        height: 100%;
        overflow: hidden;
    }

    /*模糊层*/
    .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(600px);
        opacity: .2;
        object-fit: cover;
        filter: blur(0.96rem);
        background: black;
        z-index: 3;
    }

    /*背景图片*/
    .background {
        position: absolute;
        width: 100%;
        height: px2rem(600px);
        opacity: 0.65;
        filter: blur(0.53333rem);
        z-index: 0;
        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 165%;
        }
    }

    /*返回按钮*/
    .back {
        position: absolute;
        top: 0;
        z-index: 50;
        .icon-fanhui1-copy {
            display: block;
            padding: px2rem(20px);
            font-size: px2rem(44px);
            color: $icon-fanhui1-copy;
        }
    }

    /*滚动组件*/
    .scroll-warpper {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: px2rem(120px);
        box-sizing: border-box;
        overflow: hidden;
    }

    /*专辑图片*/
    .cover-wrapper {
        position: relative;
        padding: px2rem(72px) 0 px2rem(40px) 0;
        width: 100%;
        min-height: px2rem(600px);
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-orient: vertical;
        background: #000;
        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20%;
            background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, .6) 80%);
        }
        /*图片*/
        .cd-box {
            position: relative;
            left: px2rem(-20px);
            margin: 0 auto px2rem(52px) auto;
            width: px2rem(516px);
            height: px2rem(516px);
            z-index: 1;
            &::after {
                content: "";
                position: absolute;
                top: px2rem(-4px);
                left: px2rem(-20px);
                z-index: 2;
                width: 100%;
                height: 100%;
                border-style: solid;
                border-width: px2rem(4px) px2rem(4px) px2rem(4px) px2rem(20px);
                border-image: url('../../common/img/cd_gold.png') 2 2 2 10;
            }
            .cd-box-cove {
                display: block;
                width: 100%;
                height: 100%;
            }
            .cd_ornament {
                position: absolute;
                top: 0;
                right: px2rem(-96px);
                width: px2rem(96px);
                height: 100%;
                background: url("../../common/img/cd_ornament.png") no-repeat left center;
                background-size: auto 100%;
            }
        }
        /*专辑标题*/
        .album-title {
            position: relative;
            left: px2rem(-20px);
            margin: 0;
            line-height: px2rem(54px);
            z-index: 1;
            font-size: px2rem(36px);
            font-weight: 400;
            text-align: center;
            max-width: 90%;
            color: #fff;
        }
    }

    /*歌曲内容列表*/
    .content {
        display: block;
        overflow: hidden;
        color: $digital-album-music-list-content-text;
        background: $digital-album-music-list-content;
    }

    /*内容头部*/
    .content-header {
        display: flex;
        width: 100%;
        height: px2rem(80px);
        border-bottom: px2rem(2px) solid rgba(200, 199, 204, .2);
        .text {
            flex-basis: 33.3%;
            font-size: px2rem(32px);
            line-height: px2rem(80px);
            text-align: center;
        }
        .active {
            color: $digital-album-music-list-content-text-active;
            border-bottom: px2rem(4px) solid $digital-album-music-list-content-text-active;
        }
    }

    /*专辑介绍*/
    .introduction {
        padding: px2rem(64px) px2rem(20px);
        /*标题*/
        .introduction-title {
            position: relative;
            display: -webkit-box;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            -webkit-box-orient: vertical;
            margin: 0 px2rem(20px) px2rem(28px);
            h2 {
                display: block;
                font-size: px2rem(36px);
                font-weight: 400;
            }
        }
        /*文字*/
        .text {
            overflow: hidden;
            text-align: left;
            /*唱片公司*/
            .company {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: px2rem(28px);
                line-height: 1.6;
                text-align: justify;
                text-overflow: ellipsis;
            }
            /*发行时间*/
            .time {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: px2rem(28px);
                line-height: 1.6;
                text-align: justify;
                text-overflow: ellipsis;
            }
            /*文字*/
            .txt {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                width: 100%;
                height: px2rem(128px);
                p {
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    font-size: px2rem(28px);
                    line-height: 1.6;
                }
            }
            /*展开全文*/
            .show-all {
                display: table;
                margin: px2rem(28px) auto 0;
                font-size: px2rem(24px);
                color: $digital-album-music-list-content-text-active;
            }
        }
    }

    /*歌曲列表*/
    .song-list {
        background: $digital-album-music-list-content !important;
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
