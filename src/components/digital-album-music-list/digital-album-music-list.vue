<template>
    <div class="wrapper">
        <!--返回按钮-->
        <div class="back" @click="back">
            <i class="iconfont icon-fanhui1-copy"></i>
        </div>
        <scroll class="scroll">
            <div v-show="albumMessage.cover">
                <!--专辑图片-->
                <div class="cover-wrapper">
                    <!--背景-->
                    <div class="background">
                        <img v-lazy="albumMessage.cover"/>
                    </div>
                    <!--模糊层-->
                    <div class="filter"></div>
                    <!--图片-->
                    <div class="cd-box">
                        <img class="cd-box-cove"
                             v-lazy="albumMessage.cover"/>
                        <span class="cd_ornament"></span>
                    </div>
                    <!--专辑标题-->
                    <h1 class="title">{{albumMessage.album_name}}</h1>
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
                        <div class="title">
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
                    <!--歌曲列表-->
                    <song-list @select="selectSong" :setStyle="setStyle"></song-list>
                </div>
            </div>
            <!--loading-->
            <div class="loading-wrapper" v-show="!albumMessage.cover">
                <loading></loading>
                <span class="text">加载中...</span>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapGetters, mapActions} from 'vuex';
    // 创建数字专辑歌曲列表信息
    import {createDigitalAlbumMusListMessage} from 'common/js/totalDigitalAlbum';
    // 应用mixins
    import {createdSongList} from 'common/js/mixin';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 歌曲列表
    import SongList from 'base/song-list/song-list';
    // Loading组件
    import Loading from 'base/loading/loading';

    export default {
        mixins: [createdSongList],
        data () {
            return {
                /*
                 * 数字专辑信息
                 * */
                albumMessage: {},
                /*
                 * 设置歌曲列表字体样式
                 * */
                setStyle: 'colorWhite'
            };
        },
        mounted () {
            // 如果没有id 就返回上一页
            if (!this.getHomeSonglist.id) {
                this.$router.back();
                // 设置新歌速递模块标题
                this.setNewSongListTitle('数字专辑');
            }

            // 是否开启回弹效果
            this.bounce(false);
        },
        computed: {
            ...mapGetters('appStore', {
                /*
                 * 选择的的歌曲列表数据
                 * @param {Object}
                 * */
                getHomeSonglist: 'homeSonglist',
                /*
                 * 获取歌曲列表
                 * @type {Object}
                 * */
                getSongList: 'songList'
            }),
            ...mapState('asyncAjax', [
                /*
                 * 获取数字专辑歌曲列表数据
                 * @type {Object}
                 * */
                'digitalAlbumMusicList'
            ])
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            // 选择要播放的歌曲
            selectSong(item, index) {
                this.setSelectPlay({
                    list: this.getSongList,
                    index
                });
            },

            ...mapActions('asyncAjax', [
                /*
                 * 获取数字专辑歌曲列表数据
                 * */
                'getDigitalAlbumMusicList'
            ]),
            ...mapActions('appStore', {
                /*
                 * 设置滚动组件数据
                 * @type {Array}
                 * */
                setScrollData: 'data',
                /**
                 * 是否开启回弹效果
                 * @type {Boolean}
                 */
                bounce: 'bounce',
                /*
                 * 设置新歌速递模块标题
                 * @type {String}
                 * */
                setNewSongListTitle: 'newSongListTitle',
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

            // 设置滚动组件数据
            this.setScrollData(this.getHomeSonglist);

            // 获取数字专辑音乐列表数据
            this.getDigitalAlbumMusicList(this.getHomeSonglist.id);
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        watch: {
            digitalAlbumMusicList (albumMessage) {
                if (!albumMessage.songlist) {
                    return;
                }

                // 获取专辑信息
                this.albumMessage = createDigitalAlbumMusListMessage(albumMessage);

                // 请求歌曲列表播放地址
                this.getSongPlayingUrl(albumMessage.songlist);
            }
        },
        components: {
            Scroll,
            SongList,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*滚动组件*/
    .scroll {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: px2rem(120px);
        box-sizing: border-box;
        overflow: hidden;
    }

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
            margin-bottom: px2rem(52px);
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
                border-image: url('../../common/image/cd_gold.png') 2 2 2 10;
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
                background: url("../../common/image/cd_ornament.png") no-repeat left center;
                background-size: auto 100%;
            }
        }
        /*专辑标题*/
        .title {
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
        .title {
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
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
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
    .list-wrapper {
        background: $digital-album-music-list-content;
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
