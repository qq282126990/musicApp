<template>
    <transition name="more-fade">
        <div class="more-button-wrapper" v-if="getShowMore.start" @click.stop="clickExit">
            <div class="more-button" @click.stop>
                <!--头部信息-->
                <div class="header-message">
                    <!--歌曲信息-->
                    <div class="song">
                        <!--歌名-->
                        <p class="song-name">{{getShowMore.currentSong.name}}</p>
                        <!--歌手名称-->
                        <p class="singer-name">{{getShowMore.currentSong.album}}</p>
                    </div>
                    <!--一些信息-->
                    <div class="message">
                        <!--歌曲是否有独家-->
                        <i class="icon-isonly" title="isonly"></i>
                        <p class="message-txt">此歌曲免费畅听</p>
                    </div>
                </div>
                <!--内容-->
                <div class="more-content">
                    <ul>
                        <li class="item" v-for="item in moreButton" @click="selectItem(item.name)">
                            <p class="icon-wrapper">
                                <v-icon class="icon">{{item.icon}}</v-icon>
                            </p>
                            <span class="name">{{item.name}}</span>
                        </li>
                    </ul>
                </div>
                <!--退出按钮-->
                <div class="exit" @click.stop="clickExit">
                    <p class="txt">取消</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import {isPlayMode} from 'common/js/config';
    // 下载文件方法 downloadFile
    import {downloadFile} from 'common/js/util';
    // 设置歌曲信息总线程
    import Bus from '../../event-bus';

    export default {
        data () {
            return {
                moreButton: [{icon: 'keyboard_tab', name: '下一首播放'},
                    {icon: 'add', name: '添加到歌单 '},
                    {icon: 'file_download', name: '下载'},
                    {icon: 'open_in_new', name: '分享'},
                    {icon: 'person_outline', name: '查看歌手'},
                    {icon: 'album', name: '查看专辑'}
                ]
            }
        },
        computed: {
            ...mapGetters('appStore', {
                /**
                 * 获取显示更多按钮
                 * @type {Object}
                 */
                getShowMore: 'showMore',
                /**
                 * 播放列表
                 * @type {Array}
                 */
                getPlayList: 'playList',
                /**
                 * 当前播放歌曲索引
                 * @type {Number}
                 */
                getCurrentIndex: 'currentIndex',
                /**
                 * 当前播放的歌曲信息
                 * @type {Object}
                 */
                getCurrentSong: 'currentSong',
                /**
                 * 顺序播放列表
                 * @type {Array}
                 */
                getSequenceList: 'sequenceList'
            })
        },
        methods: {
            // 退出按钮
            clickExit () {
                this.setShowMore([]);
            },
            // 点击对应的选项执行对应的内容
            selectItem (name) {
                switch (name) {
                    case '下载': {
                        try {
                            // 下载文件方法
                            downloadFile(this.getShowMore.currentSong.download, `${this.getShowMore.currentSong.name}.mp3`);
                        }
                        catch (e) {
                            downloadFile(this.getShowMore.currentSong.downloadSpare, `${this.getShowMore.currentSong.name}.mp3`);
                        }

                    }
                        break;
                    case '下一首播放': {
                        this.nextSong();
                    }
                }
            },
            // 播放下一首歌曲
            nextSong () {
                // 判断如果只有一首歌曲
                if (this.getPlayList.length === 1) {
                    // 设置为循环播放
                    this.loopPlay();
                }
                // 否则设置播放下一首
                else {
                    let index = this.getCurrentIndex + 1;
                    if (index === this.getPlayList.length) {
                        index = 0;
                    }
                    // 设置下一首歌曲的索引
                    this.setCurrentIndex(index);

                    // 设置歌曲播放状态
                    this.setPlaying(true);

                    // 设置播放器播放
                    document.getElementsByTagName('audio')[0].play();

                    // 发送选择歌曲的信息总线程
                    Bus.$emit('selectSong', this.getCurrentSong);
                }

                // 设置播放模式
                this.setPlayMode(isPlayMode.sequence);
                // 重新设置当前播放歌曲
                this.resetCurrentIndex(this.getSequenceList);
                // 重新设置播放列表
                this.setPlayList(this.getSequenceList);

                // 设置是否显示更多按钮
                this.setShowMore({
                    start: true,
                    currentSong: this.getCurrentSong
                });
            },
            // 重置当前播放歌曲
            resetCurrentIndex(list) {
                // 获取当前歌曲索引
                let index = list.findIndex((item) => {
                    return item.id === this.getCurrentSong.id;
                });

                // 设置当前播放歌曲索引
                this.setCurrentIndex(index);
            },
            // 单曲循环模式执行的播放方法
            loopPlay () {
                // 重置当前播放时间
                document.getElementsByTagName('audio')[0].currentTime = 0;
                // 设置播放器播放
                document.getElementsByTagName('audio')[0].play();

                // 设置歌曲播放状态
                this.setPlaying(true);
            },
            ...mapActions('appStore', {
                /**
                 * 控制歌曲播放
                 * @type {Boolean}
                 */
                setPlaying: 'playing',
                /**
                 * 设置是否显示更多按钮
                 * @type {Object}
                 */
                setShowMore: 'showMore',
                /**
                 * 设置当前播放歌曲索引
                 * @type {Boolean}
                 */
                setCurrentIndex: 'currentIndex',
                /**
                 * 设置是否显示更多按钮
                 * @type {Object}
                 */
                setShowMore: 'showMore',
                /**
                 * 控制歌曲播放模式
                 * @type {Boolean}
                 */
                setPlayMode: 'playMode',
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*更多列表*/
    .more-fade-enter-active, .more-fade-leave-active {
        transition: opacity .3s;
        .more-button {
            transition: all .3s;
        }
    }

    .more-fade-enter, .more-fade-leave-to {
        opacity: 0;
        .more-button {
            transform: translate3d(0, 100%, 0);
        }
    }

    .more-button-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 300;
    }

    .more-button {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: $more-bottom-bgcolor;
        z-index: 301;
        /*头部信息*/
        .header-message {
            display: flex;
            flex-direction: column;
            padding: px2rem(24px) px2rem(20px) px2rem(10px) px2rem(40px);
            border-bottom: px2rem(1px) solid rgba(0, 0, 0, .2);
            width: 100%;
            height: px2rem(130px);
            /*歌曲信息*/
            .song {
                flex: 1;
                display: flex;
                align-items: flex-start;
                font-size: px2rem(28px);
            }
            /*一些信息*/
            .message {
                flex: 1;
                display: flex;
                align-items: center;
                font-size: px2rem(24px);
            }
            .message-txt {
                margin: 0;
                padding-left: px2rem(15px);
                color: #999;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            /*歌曲是否是独家*/
            .icon-isonly {
                display: inline-block;
                width: 34px;
                height: 16px;
                vertical-align: middle;
                background-position: -80px -280px;
                background-image: -webkit-image-set(url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de) 1x, url(https://y.gtimg.cn/mediastyle/yqq/img/icon_sprite@2x.png?max_age=2592000&v=f5857796791605d0757c4a057644a4de&v=3a0fcc184bba8d368416bde830573668) 2x);
            }
            /*歌名*/
            .song-name {
                margin: 0;
                padding-right: px2rem(20px);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            /*歌手名称*/
            .singer-name {
                flex: 1;
                margin: 0;
                text-align: left;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: #999;
            }
        }
        /*内容*/
        .more-content {
            padding: px2rem(40px) 0 0 0;
            width: 100%;
            ul {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
            }
            .item {
                width: 25%;
            }
            .icon-wrapper {
                margin: 0 auto;
                display: block;
                line-height: px2rem(90px);
                width: px2rem(100px);
                height: px2rem(100px);
                background: #f3f3f3;
                border-radius: px2rem(16px);
            }
            .icon {
                color: rgba(0, 0, 0, .7);
                font-size: px2rem(70px);
            }
            .name {
                padding-top: px2rem(30px);
                padding-bottom: px2rem(40px);
                letter-spacing: px2rem(2px);
                display: block;
                font-size: px2rem(24px);
            }
        }
        /*退出按钮*/
        .exit {
            width: 100%;
            height: px2rem(100px);
            line-height: px2rem(100px);
            border-top: px2rem(1px) solid rgba(0, 0, 0, .2);
            .txt {
                margin: 0;
                font-size: px2rem(34px);
            }
        }
    }
</style>
