<template>
    <div>
        <!--放大样式-->
        <div class="normal-player" v-show="fullScreen">
            <!--头部-->
            <div class="header">
                <!--返回按np钮-->
                <div class="back" @click="back">
                    <v-icon>keyboard_arrow_down</v-icon>
                </div>
                <!--头部标题-->
                <div class="title">
                    <span>小红帽 (Live)</span>
                </div>
                <!--menu-->
                <div class="menu">
                </div>
            </div>
            <!--内容-->
            <div class="normal-player-content">
                <!--歌手名称-->
                <div class="sing-name">
                    <v-icon>more_horiz</v-icon>
                    <span>朱亚文</span>
                    <v-icon>more_horiz</v-icon>
                </div>
                <!--切换 dot-->
                <div class="dot-wrapper">
                    <span class="dot active"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>
        <!--最小化样式-->
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <!--有歌曲列表时显示-->
            <transition name="playList">
                <div class="slide" v-show="playList.length>0" :key="currentSong.id">
                    <div class="avatar">
                        <img width="100%" height="100%" v-lazy="currentSong.image"/>
                    </div>
                    <div class="text">
                        <h2 class="name" v-html="currentSong.name"></h2>
                        <p class="desc" v-html="currentSong.singer"></p>
                    </div>
                </div>
            </transition>
            <!--没有歌曲列表时显示-->
            <div class="no-play-list" v-show="playList.length === 0">
                <span>QQ音乐 听我想听得歌</span>
            </div>
            <!--播放按钮-->
            <div class="control">
                <v-icon class="play" @click.stop="togglePlaying">
                    {{playing ? 'pause_circle_outline' : 'play_circle_outline'}}
                </v-icon>
            </div>
            <!--播放列表按钮-->
            <div class="queue">
                <v-icon class="queue_music">queue_music</v-icon>
            </div>
            <!--播放器-->
            <audio ref="audio" :src="playUrl" @play="ready" @error="error"></audio>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import {getSinglePlayingUrl} from 'api/songPlayingUrl';
    import {getCookie} from 'common/js/cookie';
    import {ERR_OK} from 'api/config';

    // 歌曲链接地址头部
    const URL_HEAD = `https://dl.stream.qqmusic.qq.com/`;

    export default {
        data () {
            return {
                /**
                 * 判断歌曲是否准备好播放了
                 * type {Boolean}
                 * */
                songReady: false,
                /**
                 * 歌曲播放错误
                 * type {Boolean}
                 * */
                playError: false,
                /**
                 * 播放歌曲Url接口 filename
                 * type {String}
                 * */
                filename: '',
                /**
                 * 播放歌曲Url接口 vkey
                 * type {String}
                 * */
                vkey: '',
                /**
                 * 播放歌曲链接地址 mp4
                 * type {String}
                 * */
                playUrl: null
            };
        },
        computed: {
            ...mapGetters('appStore', [
                /*
                 * 控制播发器放大缩小
                 * @type {Boolean}
                 * */
                'fullScreen',
                /**
                 * 当前播放的歌曲信息
                 * @type {Object}
                 */
                'currentSong',
                /**
                 * 播放列表
                 * @type {Array}
                 */
                'playList',
                /**
                 * 控制歌曲播放
                 * @type {Boolean}
                 */
                'playing'
            ])
        },
        methods: {
            // 切换到缩小的播放器
            back () {
                this.setFullScreen(false);
            },
            // 切换到放大的播放器
            open () {
                // 如果没有播放歌曲就不能点击放大播放器
//                if (this.playList.length === 0) {
//                    return;
//                }
                this.setFullScreen(true);
            },
            // 获取播放歌曲的播放链接
            _getSinglePlayingUrl (songmid, strMediaMid) {
                // 两种情况 如果请求找不到歌曲就执行以下个接口
                // 默认播放器没有错误
                if (!this.playError) {
                    getSinglePlayingUrl(strMediaMid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.filename = res.data.items[0].filename;
                            this.vkey = res.data.items[0].vkey;
                            // 歌曲播放地址
                            this.playUrl = `${URL_HEAD}/${this.filename}?vkey=${this.vkey}&guid=${getCookie('guid')}&uin=0&fromtag=66`;

                            // 设置播放器播放
                            this.audioPlay(this.playUrl);
                        }
                    });
                }
                else {
                    // 备用接口
                    getSinglePlayingUrl(songmid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.filename = res.data.items[0].filename;
                            this.vkey = res.data.items[0].vkey;

                            // 歌曲播放地址
                            this.playUrl = `${URL_HEAD}/${this.filename}?vkey=${this.vkey}&guid=${getCookie('guid')}&uin=0&fromtag=66`;

                            // 设置播放器播放
                            this.audioPlay(this.playUrl);
                        }
                    });
                }
            },
            // 设置播放器播放
            audioPlay (data) {
                this.$nextTick(() => {
                    const audio = this.$refs.audio;
                    data ? audio.play() : audio.pause();
                });
            },
            // 控制播放
            togglePlaying () {
                // 判断是否准备好播放
                if (!this.songReady) {
                    return;
                }
                // 设置歌曲播放状态
                this.setPlaying(!this.playing);
            },
            // 播放准备状态
            ready () {
                this.songReady = true;
            },
            // 播放器错误事件
            error () {
                // 歌曲准备状态设置为false
                this.songReady = false;

                // 设置播放器错误
                this.playError = true;
            },
            ...mapActions('appStore', {
                /*
                 * 控制播发器放大缩小
                 * @type {Boolean}
                 * */
                setFullScreen: 'fullScreen',
                /**
                 * 控制歌曲播放
                 * @type {Boolean}
                 */
                setPlaying: 'playing'
            })
        },
        watch: {
            // 监听播放器错误
            playError (newPlayError) {
                // 如果播放器错误就请求备用接口
                if (newPlayError) {
                    this._getSinglePlayingUrl(this.currentSong.mid);
                }
            },
            // 监听播放器播放
            playing (newPlaying) {
                // 设置播放器播放
                this.audioPlay(newPlaying);
            },
            // 监听歌曲改变
            currentSong (newCurrentSong) {
                // 默认播放没有错误
                this.playError = false;

                // 请求歌曲地址 传入 songmid = mid
                this._getSinglePlayingUrl(newCurrentSong.mid, this.currentSong.strMediaMid);

                // 设置播放器播放
                this.audioPlay(newCurrentSong);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*有播放歌曲时组件出现的动画*/
    .playList-enter-active, .playList-leave-active {
        transition: all .5s
    }

    .playList-enter, .playList-leave-to {
        opacity: 0;
    }

    /*左右滑动wrapper*/
    .slide {
        overflow: hidden;
        display: -webkit-box;
        width: 100%;
    }

    /*没有歌曲列表时显示*/
    .no-play-list {
        display: flex;
        align-items: center;
        padding-left: px2rem(40px);
        font-size: px2rem(32px);
        width: 100%;
        color: $no-play-list-color;
    }

    /*播放器最小化时的样式*/
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(120px);
        background: $mini-player-color;
        /*播放的歌曲图片*/
        .avatar {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 px2rem(40px);
            img {
                display: block;
                border-radius: 50%;
            }
        }
        /*播放的歌曲标题和文字*/
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            text-align: left;
            line-height: px2rem(40px);
            .name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: px2rem(10px);
                font-size: px2rem(32px);
                color: $text-name-color;
            }
            .desc {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: px2rem(32px);
                color: $text-desc-color;
            }
        }
        /*播放和歌曲icon样式*/
        .control {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(20px);
        }
        /*播放按钮图标*/
        .play {
            font-size: px2rem(70px);
            color: $play-color;
        }
        /*音乐列表图标*/
        .queue {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 0;
        }
        /*播放列表按钮*/
        .queue_music {
            font-size: px2rem(70px);
            color: $play-color;
        }
    }

    /*播放器放大时的样式*/
    .normal-player {
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $normal-player-bgcolor;
        /*头部*/
        .header {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: px2rem(84px);
            z-index: 100;
            /*返回按钮*/
            .back {
                flex-basis: 20%;
                z-index: 50;
                i {
                    display: block;
                    padding: 0 px2rem(20px);
                    font-size: px2rem(84px);
                    color: $icon-fanhui1-copy;
                }
            }
            /*标题*/
            .title {
                /*position: absolute;*/
                /*top: 0;*/
                /*left: px2rem(124px);*/
                padding-left: px2rem(10px);
                width: 100%;
                margin: 0;
                text-align: center;
                line-height: px2rem(84px);
                font-size: px2rem(36px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $title-color;
                z-index: 40;
            }
            /*菜单*/
            .menu {
                flex-basis: 20%;
                z-index: 50;
                width: px2rem(124px);
            }
        }
        /*内容*/
        .normal-player-content {
            padding-top: px2rem(20px);
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            overflow: hidden;
            /*歌手名称*/
            .sing-name {
                display: block;
                text-align: center;
                font-size: px2rem(30px);
                color: #999;
                i {
                    font-size: px2rem(40px);
                }
            }
            /*切换 dot*/
            .dot-wrapper {
                padding-top: px2rem(50px);
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    &.active {
                        border-radius: 5px;
                        background: #fff
                    }
                }
            }
        }
    }

</style>
