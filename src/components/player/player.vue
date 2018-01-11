<template>
    <!--最小化样式-->
    <div class="mini-player">
        <!--有歌曲列表时显示-->
        <transition name="playList">
            <div class="slide" v-show="playList.length>0" :key="currentSong.id">
                <div class="avatar">
                    <img width="100%" height="100%" :src="currentSong.image"/>
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
            <v-icon class="play" @click.stop="togglePlaying">play_circle_outline</v-icon>
        </div>
        <!--播放列表按钮-->
        <div class="queue">
            <v-icon class="queue_music">queue_music</v-icon>
        </div>
        <!--播放器-->
        <audio ref="audio" :src="playUrl" @play="ready" @error="error"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import {getSinglePlayingUrl} from 'api/songPlayingUrl';
    import {getCookie} from 'common/js/cookie';
    import {ERR_OK} from 'api/config';

    export default {
        data() {
            return {
                /**
                 * 判断歌曲是否准备好播放了
                 * type {Boolean}
                 * */
                songReady: false,
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
                playUrl: null
            };
        },
        computed: {
            ...mapGetters('appStore', [
                /**
                 * 当前播放的歌曲信息
                 *
                 *
                 * @type {Object}
                 */
                'currentSong',
                /**
                 * 播放列表
                 *
                 *
                 * @type {Array}
                 */
                'playList',
                /**
                 * 控制歌曲播放
                 *
                 *
                 * @type {Boolean}
                 */
                'playing'
            ])
        },
        methods: {
            _getSinglePlayingUrl(songmid) {
                getSinglePlayingUrl(songmid).then((res) => {
                    if (res.code === ERR_OK) {
                        this.filename = res.data.items[0].filename;
                        this.vkey = res.data.items[0].vkey;

                        // 歌曲播放地址
                        this.playUrl = `https://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${this.vkey}&guid=${getCookie('guid')}&uin=0&fromtag=66`;
//                        this.playUrl = `https://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${this.vkey}&uin=0&fromtag=66`;

                        const audio = this.$refs.audio;
                        this.$nextTick(() => {
                            this.playUrl ? audio.play() : audio.pause();
                        });

                        console.log(this.playUrl);
                    }
                });
            },
            // 控制播放
            togglePlaying() {
                // 判断是否准备好播放
                if (!this.songReady) {
                    return;
                }
                // 设置歌曲播放状态
                this.setPlaying(!this.playing);
            },
            // 播放准备状态
            ready() {
                this.songReady = true;
            },
            // 播放器错误事件
            error() {
                console.log('出错了');
                this.songReady = false;
            },
            ...mapActions('appStore', {
                /**
                 * 控制歌曲播放
                 *
                 *
                 * @type {Boolean}
                 */
                setPlaying: 'playing'
            })
        },
        watch: {
            playing(newPlaying) {
                const audio = this.$refs.audio;
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause();
                });
            },
            currentSong(newCurrentSong) {
                this._getSinglePlayingUrl(newCurrentSong.mid);
                const audio = this.$refs.audio;
                this.$nextTick(() => {
                    newCurrentSong ? audio.play() : audio.pause();
                });
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
    }

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

    .queue_music {
        font-size: px2rem(70px);
        color: $play-color;
    }
</style>
