<template>
    <transition name="list-fade">
        <div class="playlist" @click="hide" v-show="showFlag">
            <div class="list-wrapper" @click.stop>
                <!--列表头部-->
                <div class="list-header">
                    <!--播放模式-->
                    <i class="iconfont play-mode" :class="iconMode" @click="changeMode"></i>
                    <!--文本-->
                    <div class="text">
                        <!--当前播放模式名称-->
                        <span class="name">{{playModeText}}</span>
                        <!--歌曲数量-->
                        <span class="numer">({{getSequenceList.length}}首)</span>
                    </div>
                    <!--删除全部-->
                    <v-btn flat icon color="grey" class="delete-all" @click="showConfirm">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </div>
                <!--歌曲列表内容-->
                <scroll class="list-content" ref="listContent">
                    <transition-group name="list" tag="ul" ref="list">
                        <li class="item"
                            :key="item.id"
                            v-for="(item, index) in getSequenceList"
                            @click="selectItem(item,index)"
                        >
                            <!--歌曲名字-->
                            <span class="name" :class="_getCurrentSong(item)">{{item.name}}-{{item.singer}}</span>
                            <!--收藏歌曲-->
                            <span class="like">
                                    <v-icon :class="getFavoriteIcon(item)"
                                            @click.stop="toggleFavorite(item)"
                                    >
                                        {{getFavoriteIcon(item)}}
                                    </v-icon>
                                </span>
                            <!--删除歌曲-->
                            <span class="delete" @click.stop="deleteOne(item)">
                                    <v-btn flat icon color="grey" @click="">
                                       <v-icon>clear</v-icon>
                                    </v-btn>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm @end="confirmEnd"
                     text="确定清空所有歌曲?"
                     ref="confirm"></confirm>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {mapActions} from 'vuex';
    // 获取控制歌曲播放模式
    import {isPlayMode} from 'common/js/config';
    // 播放器mixin
    import {playerMixin} from 'common/js/mixin';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 弹出框
    import Confirm from 'base/confirm/confirm';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';

    export default {
        mixins: [playerMixin],
        data() {
            return {
                // 设置是否显示播放列表
                showFlag: false
            };
        },
        mounted() {
            // 设置滚动组件数据.
            this.setScrollData(this.getSequenceList);
            // 设置滚动组件刷新数据延迟
            this.setRefreshDelay(120);
        },
        computed: {
            // 当前播放模式显示的文字
            playModeText() {
                return this.getPlayMode === isPlayMode.sequence ? '顺序播放' : this.getPlayMode === isPlayMode.random ? '随机播放' : '单曲循环';
            }
        },
        methods: {
            // 显示播放列表
            show() {
                this.showFlag = true;
                setTimeout(() => {
                    // 刷新滚动组件
                    this.$refs.listContent.refresh();
                    // 自动滚动到当前播放歌曲的位置
                    this.scrollToCurrent(this.getCurrentSong);
                }, 20);
            },
            // 隐藏播放列表
            hide() {
                this.showFlag = false;
            },
            // 显示删除全部确认框
            showConfirm() {
                this.$refs.confirm.show();
            },
            // 点击弹出框确认按钮
            confirmEnd() {
                // 删除所有歌曲
                this.setDeleteSongList();
                // 隐藏弹出框
                this.hide();
            },
            // 设置自动滚动到当前播放歌曲的位置
            scrollToCurrent(currentSong) {
                // 寻找当前歌曲在播放列表中的位置
                const index = this.getSequenceList.findIndex((song) => {
                    return currentSong.id === song.id;
                });
                // 设置滚动到当前播放歌曲的位置
                this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300);
            },
            // 获取当前正在播放的歌曲
            _getCurrentSong(item) {
                if (this.getCurrentSong.id === item.id) {
                    return 'active';
                }
                return '';
            },
            // 选择播放歌曲
            selectItem(item, index) {
                // 如果当前是随机歌曲就寻找要播放的歌曲在随机歌曲列表中的索引
                if (this.getPlayMode === isPlayMode.random) {
                    index = this.getPlayList.findIndex((currentSong) => {
                        return currentSong.id === item.id;
                    });
                }

                console.log('11');
                // 设置当前要播放歌曲的索引进行播放
                this.setCurrentIndex(index);
                // 设置播放歌曲
                this.setPlaying(true);

                // 如果不是重复点击就初始化oldSong
                if (this.oldSong !== item.id) {
                    this.oldSong = null;
                }

                // 如果oldSong为空才执行
                if (!this.oldSong) {
                    this.oldSong = item.id;

                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }
            },
            // 删除当前歌曲按钮
            deleteOne(item) {
                // 删除歌曲
                this.setDeleteSong(item);

                if (this.getCurrentSong.id) {
                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }

                // 如果当前播放列表没有歌词就隐藏播放列表
                if (!this.getPlayList.length) {
                    this.hide();
                }
            },
            ...mapActions('appStore', {
                /*
                 * 设置滚动组件数据
                 * @type {Array}
                 * */
                setScrollData: 'scrollData',
                /*
                 * 设置滚动组件刷新数据延迟时间l
                 * @type {Array}
                 * */
                setRefreshDelay: 'refreshDelay',
                /*
                 * 删除当前歌曲
                 * @type {Array}
                 * */
                setDeleteSong: 'deleteSong',
                /*
                 * 删除全部歌曲
                 * @type {Boolean}
                 * */
                setDeleteSongList: 'deleteSongList'
            })
        },
        components: {
            Scroll,
            Confirm
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    // 播放列表出现动画
    .list-fade-enter-active, .list-fade-leave-active {
        transition: opacity 0.3s;
        .list-wrapper {
            transition: all 0.3s;
        }
    }

    .list-fade-enter, .list-fade-leave-to {
        opacity: 0;
        .list-wrapper {
            transform: translate3d(0, 100%, 0);
        }
    }

    /*外层*/
    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background: $playlist-bgcolor;
    }

    /*内容*/
    .list-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $list-wrapper-bgcolor;
    }

    /*列表头部*/
    .list-header {
        display: flex;
        align-items: center;
        position: relative;
        padding: px2rem(20px) px2rem(40px);
        border-bottom: 1px solid rgba(255, 255, 255, .2);
        background: $list-header-bgcolor;
        /*播放模式*/
        .play-mode {
            position: relative;
            top: px2rem(4px);
            margin-right: px2rem(20px);
            font-size: px2rem(50px);
            color: $list-header-play-mode;
        }
        /*文本*/
        .text {
            flex: 1;
            text-align: left;
            font-size: px2rem(30px);
            color: $list-header-text;
            .numer {
                color: $list-header-text-numer;
            }
        }
        /*删除全部按钮*/
        .btn--icon {
            width: px2rem(60px);
            height: px2rem(60px);
        }
        .delete-all {
            margin: 0;
            font-size: px2rem(50px);
            color: $list-header-icon;
        }
    }

    /*歌曲列表内容*/
    .list-content {
        height: px2rem(600px);
        overflow: hidden;
        background: $list-content-bgcolor;
        ul {
            padding: 0;
        }
        /*li*/
        .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: px2rem(80px);
            border-bottom: 1px solid rgba(255, 255, 255, .05);
            /*播放列表歌曲内容动画*/
            &.list-enter-active, &.list-leave-active {
                transition: all 0.1s
            }

            &.list-enter, &.list-leave-to {
                height: 0;
                .name {
                    height: 0;
                }
            }
            /*歌曲名称*/
            .name {
                flex: 1;
                text-align: left;
                padding-left: px2rem(40px);
                font-size: px2rem(24px);
                color: $list-content-name-color;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &.active {
                    color: $list-content-name-active-color;
                }
            }
            /*收藏按钮*/
            .like {
                position: relative;
                margin-right: px2rem(30px);
                /*没有收藏按钮*/
                .favorite_border {
                    color: $favorite_border;
                    font-size: px2rem(40px);
                }
                /*收藏按钮*/
                .favorite {
                    color: $favorite;
                    font-size: px2rem(40px);
                }
            }
            /*删除按钮*/
            .delete {
                padding-right: px2rem(40px);
                font-size: px2rem(40px);
                color: $list-header-icon;
            }
        }
    }

    /*关闭*/
    .list-close {
        text-align: center;
        line-height: px2rem(120px);
        font-size: px2rem(30px);
        color: $list-close-color;
        background: $list-close-bgcolor;
    }
</style>
