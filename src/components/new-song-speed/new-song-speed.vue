<template>
    <div class="wrapper">
        <!--新歌速递头部-->
        <div class="song-speed-header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--导航-->
            <div class="router-link">
                <div class="link-conent">
                    <div @click="newSongGO" class="link-title" :class="{'title-active': newSongSpeedTitle === '新歌'}">
                        <span>新歌</span>
                    </div>
                    <div @click="digitalAlbumGO" class="link-title"
                         :class="{'title-active': newSongSpeedTitle === '数字专辑'}">
                        <span>数字专辑</span>
                    </div>
                    <div @click="newAlbumGO" class="link-title" :class="{'title-active': newSongSpeedTitle === '新碟'}">
                        <span>新碟</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <component :is="componentId"></component>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    // 获取主页新歌模块跳转对应的模块的标题 getNewSongSpeedTitle
    import {getNewSongSpeedTitle} from 'common/js/cache';
    // 新歌组件
    import NewSong from 'components/new-song/new-song';
    // 新碟组件
    import NewAlbum from 'components/new-album/new-album';
    // 数字专辑组件
    import DigitalAlbum from 'components/digital-album/digital-album';

    export default {
        data () {
            return {
                /*
                 * 主页新歌模块跳转对应的模块的标题
                 * @type {String}
                 * */
                newSongSpeedTitle: null,
                /*
                 * 要显示的组件
                 * @type {String}
                 * */
                componentId: ''
            }
        },
        methods: {
            // 进入页面判断需要切换到的组件
            switchComponent () {
                // 主页新歌模块跳转对应的模块的标题
                this.newSongSpeedTitle = getNewSongSpeedTitle();
                // 如果没有数据就返回上一页
                if (!this.newSongSpeedTitle) {
                    this.$router.back();
                }
                // 判断头部导航
                if (this.newSongSpeedTitle === '新歌') {
                    this.componentId = 'new-song';
                }
                else if (this.newSongSpeedTitle === '数字专辑') {
                    this.componentId = 'digital-album';
                }
                else if (this.newSongSpeedTitle === '新碟') {
                    this.componentId = 'newAlbum';
                }
            },
            // 切换新歌组件
            newSongGO() {
                // 设置对应的标题
                this.newSongSpeedTitle = '新歌';
                // 设置显示组件
                this.componentId = 'new-song';
            },
            // 切换数字专辑组件
            digitalAlbumGO() {
                // 设置对应的标题
                this.newSongSpeedTitle = '数字专辑';
                // 设置显示组件
                this.componentId = 'digital-album';
            },
            // 切换新碟组件
            newAlbumGO() {
                // 设置对应的标题
                this.newSongSpeedTitle = '新碟';
                // 设置显示组件
                this.componentId = 'newAlbum';
            },
            // 返回按钮
            back() {
                this.$router.back();
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ])
        },
        // 当组件激活的调用
        activated() {
            // 进入页面判断需要切换到的组件
            this.switchComponent();

            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        components: {
            NewSong,
            NewAlbum,
            DigitalAlbum
        }
    };
</script>


<style scoped lang="scss">
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .wrapper {
        overflow: hidden;
        height: 100%;
    }

    /*头部*/
    .song-speed-header {
        display: flex;
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
        box-shadow: 0 0 10px #999;
        background: $header-color;
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
        /*导航*/
        .router-link {
            flex: 1;
            display: flex;
            align-items: center;
            flex-direction: row;
            .link-conent {
                display: flex;
                overflow: hidden;
                margin: 0 auto;
                border-radius: px2rem(5px);
            }
            .link-title {
                display: inline-block;
                padding: px2rem(10px) px2rem(25px);
                font-size: px2rem(30px);
                color: #fff;
                border: 1px solid #fff;
                span {
                    line-height: px2rem(32px);
                }
            }
            /*标题激活*/
            .title-active {
                color: $song-speed-header-color;
                background: $song-speed-header-router-link-active-color;
                span {
                    color: $song-speed-header-color;
                }
            }
        }
    }

    /*内容*/
    .content {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        box-sizing: border-box;
        overflow: hidden;
        padding-top: px2rem(84px);
        padding-bottom: px2rem(120px);
        height: 100%;
    }
</style>
