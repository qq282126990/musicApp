<template>
    <div v-show="getMvMessage">
        <!--返回按钮-->
        <div class="back" @click="back">
            <i class="iconfont icon-fanhui1-copy"></i>
        </div>
        <!--播放器-->
        <div class="video-wrapper">
            <video class="video"
                   webkit-playsinline
                   playsinline="true"
                   preload="metadata"
                   controls="controls"
                   :src="mvPlayUrl"></video>
        </div>
        <!--mv标题-->
        <div class="mv-title-wrapper">
            <p class="mv-title">{{getMvMessage.name}}</p>
            <!--歌手名-->
            <p class="mv-song-name">
                <!--图标-->
                <v-icon class="icon">perm_identity</v-icon>
                {{filterSinger(getMvMessage.singers)}}
            </p>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';

    export default {
        name: 'mv',
        data () {
            return {
                /*
                * MV播放链接
                * @type {String}
                * */
                mvPlayUrl: ''
            }
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                * 获取对应MV的信息
                * @type {Object}
                * */
                getMvMessage: 'mvMessage',
                /*
                * 获取MV播放地址
                * @type {Object}
                * */
                getMvPlayUrl: 'mvPlayUrl'
            })
        },
        methods: {
            // 返回按钮
            back () {
                this.$router.back();
            },
            // 过滤歌手名
            filterSinger (singer) {
                let ret = [];

                if (!singer) {
                    return '';
                }

                singer.forEach((s) => {
                    ret.push(s.name);
                });

                return ret.join('/');
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                // 获取对应MV的信息请求
                setMvMessage: 'getMvMessage',
                // 获取MV播放地址请求
                setMvPlayUrl: 'getMvPlayUrl'
            })
        },
        activated () {
            this.setAppHeader({
                show: false
            });

            // 获取对应MV的信息请求
            this.setMvMessage(this.$router.currentRoute.params.id);
        },
        watch: {
            // 监听MV信息请求数据
            getMvMessage (mvMessage) {
                // 获取MV播放地址请求
                this.setMvPlayUrl(mvMessage.fileid)
            },
            // 监听播放链接数据
            getMvPlayUrl (newMvPlayUrl) {
                this.mvPlayUrl = `${newMvPlayUrl[3].url[0]}${newMvPlayUrl[3].cn}?vkey=${newMvPlayUrl[3].vkey}`
                console.log(this.mvPlayUrl);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

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

    /*播放器*/
    .video-wrapper {
        width: 100%;
        height: px2rem(422px);
        .video{
            width: 100%;
            height: px2rem(422px);
        }
    }

    /*mv标题*/
    .mv-title-wrapper {
        padding: px2rem(30px);
        width: 100%;
        .mv-title {
            margin: 0;
            font-size: px2rem(30px);
            text-align: left;
        }
        /*歌手名*/
        .mv-song-name {
            margin: 0;
            padding-top: px2rem(20px);
            font-size: px2rem(24px);
            text-align: left;
            color: #999;
            /*图标*/
            .icon {
                position: relative;
                top: px2rem(-4px);
                font-size: px2rem(36px);
            }
        }
    }
</style>
