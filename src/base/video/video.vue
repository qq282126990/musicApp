<template>
    <div class="video-wrapper">
        <video class="video"
               webkit-playsinline="true"
               playsinline="true"
               preload="auto"
               :poster="coverPic"
               :src="mvPlayUrl"
               @play="ready"
               @error="error"
               @click.stop="togglePlaying"
               ref="video"
        >
        </video>
        <!--播放按钮-->
        <v-icon class="play-icon">
            {{playing ? 'pause' : 'play_arrow'}}
        </v-icon>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState} from 'vuex';
    // 设置播放地址总线程
    import Bus from '../../event-bus';

    export default {
        props: {
            /*
             * 视频图片
             * @typ {String}
             * */
            coverPic: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                /*
                 * 视频播放链接
                 * @type {String}
                 * */
                mvPlayUrl: null,
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
        created () {
            // 监听MV播放地址
            Bus.$on('setMvPlayUrl', (mvPlayUrl) => {
                this.mvPlayUrl = mvPlayUrl;
            });
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取MV播放地址
                 * @type {Object}
                 * */
                getMvPlayUrl: 'mvPlayUrl'
            })
        },
        methods: {
            // 控制播放器播放
            togglePlaying () {
                // 设置播放切换
                this.playing = !this.playing;

                // 设置视频播放
                const video = this.$refs.video;
                this.playing ? video.play() : video.pause();
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
            }
        },
        watch: {
            // 监听播放链接数据
            getMvPlayUrl (newMvPlayUrl) {
                this.mvPlayUrl = `${newMvPlayUrl[3].url[0]}${newMvPlayUrl[3].cn}?vkey=${newMvPlayUrl[3].vkey}`;
                // 传入MV播放地址
                this.$emit('setMvPlayUrl', this.mvPlayUrl);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*播放器*/
    .video-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(422px);
        overflow: hidden;
        background: #999999;
        .video {
            display: block;
            width: 100%;
            height: px2rem(422px);
        }
        /*播放按钮*/
        .play-icon {
            position: absolute;
            top: px2rem(180px);
            margin-left: px2rem(-40px);
            font-size: px2rem(60px);
            color: #fff;
        }
    }

</style>
