<template>
    <div>
        <!--新歌速递头部-->
        <div class="song-speed-header">
            <!--返回按钮-->
            <div class="back" @click.stop="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--导航-->
            <div class="router-link">
                <div class="link-conent">
                    <div @click="newSongGO" class="title" :class="{'title-active': newSongListTitle === '新歌'}">
                        <span>新歌</span>
                    </div>
                    <div @click="digitalAlbumGO" class="title" :class="{'title-active': newSongListTitle === '数字专辑'}">
                        <span>数字专辑</span>
                    </div>
                    <div @click="newAlbumGO" class="title" :class="{'title-active': newSongListTitle === '新碟'}">
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
    // 新歌组件
    import newSong from 'components/newSong/newSong';
    // 新碟组件
    import newAlbum from 'components/newAlbum/newAlbum';
    // 数字专辑组件
    import digitalAlbum from 'components/digital-album/digital-album';

    export default {
        data() {
            return {
                componentId: 'newSong'
            };
        },
        computed: {
            ...mapGetters('appStore', ['newSongListTitle'])
        },
        methods: {
            // 切换新歌组件
            newSongGO() {
                this.setNewSongListTitle('新歌');

                this.componentId = 'newSong';
            },
            // 切换数字专辑组件
            digitalAlbumGO() {
                this.setNewSongListTitle('数字专辑');

                this.componentId = 'digitalAlbum';
            },
            // 切换新碟组件
            newAlbumGO() {
                this.setNewSongListTitle('新碟');

                this.componentId = 'newAlbum';
            },
            // 返回按钮
            back() {
                this.$router.back();
            },
            ...mapActions('appStore', {
                /*
                * 设置新歌速递模块标题
                * @type {String}
                * */
                setNewSongListTitle: 'newSongListTitle'
            }),
            ...mapActions('appShell/appHeader', [
                /*
                * 隐藏首页头部导航
                * @type {Boolean}
                * */
                'setAppHeader'
            ])
        },
        // 当组件激活的调用
        activated() {
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
            newSong,
            newAlbum,
            digitalAlbum
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*头部*/
    .song-speed-header {
        display: flex;
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
        box-shadow: 0 2px 10px #999;
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
            .title {
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

    .content {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        padding-top: px2rem(84px);
    }
</style>
