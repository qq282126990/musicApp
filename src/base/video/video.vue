<template>
    <div class="video-wrapper">
        <video class="video"
               webkit-playsinline
               playsinline="true"
               preload="metadata"
               :src="mvPlayUrl"
               @play="ready"
               @error="error"
               @click.stop="togglePlaying"
               ref="video"
               v-show="mvPlayUrl"
        ></video>
        <!--播放按钮-->
        <v-icon class="play-icon">
            {{playing ? 'play_arrow' : 'pause'}}
        </v-icon>
    </div>
</template>

<script type="text/ecmascript-6">
    import VIcon from "vuetify/es5/components/VIcon/VIcon";
    export default {
        components: {VIcon},
        props: {
            /*
             * 视频播放链接
             * @type {String}
             * */
            mvPlayUrl: {
                type: null,
                default: null
            }
        },
        data () {
            return {
                /*
                 * 设置播放
                 * @type {Boolean}
                 * */
                playing: false,
                /*
                 * 设置播放准备状态
                 * @type {Boolean}
                 * */
                videoReady: false
            }
        },
        methods: {
            // 控制播放器播放
            togglePlaying () {
                // 设置播放切换
                this.playing = !this.playing
            },
            // 播放准备状态
            ready () {
                // 设置歌曲准备完成
                this.videoReady = true;
            },
            // 播放器错误事件
            error () {
                console.log('播放出错了');
                // 歌曲准备状态设置为false
                this.videoReady = false;
            },
            // 设置视频播放
            videoPlay (data) {
                const video = this.$refs.video;

                this.$nextTick(() => {
                    data ? video.play() : video.pause();
                });
            }
        },
        watch: {
            // 监听播放器播放
            playing (newPlaying) {
                if (!this.videoReady && !this.mvPlayUrl) {
                    return;
                }
                // 设置播放器播放
                this.videoPlay(newPlaying);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*播放器*/
    .video-wrapper {
        position: relative;
        width: 100%;
        height: px2rem(422px);
        background: #999999;
        .video {
            width: 100%;
            height: px2rem(422px);
        }
        /*播放按钮*/
        .play-icon{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: px2rem(180px);
            font-size: px2rem(60px);
            color: #fff;
        }
    }

</style>
