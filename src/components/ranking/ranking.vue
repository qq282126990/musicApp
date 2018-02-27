<template>
    <div>
        <!--头部-->
        <div class="ranking-header">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--标题-->
            <div class="header-title">
                <span>排行</span>
            </div>
        </div>
        <!--内容-->
        <div class="ranking-content" v-show="getRankingList.length">
            <!--滚动组件-->
            <scroll class="scroll" ref="scroll">
                <div>
                    <!--内容标题-->
                    <h1 class="content-title">QQ音乐巅峰榜</h1>
                    <ul>
                        <li class="item" v-for="item in getRankingList"
                            :key="item.picUrl"
                            @click="selectItem(item)"
                            v-if="item.id !== 201">
                            <!--图片-->
                            <div class="item-img">
                                <img width="100%" height="100%" v-lazy="item.picUrl" :alt="item.picUrl"/>
                                <!--播放量-->
                                <div class="listen-count">
                                    <v-icon class="small-icon">headset</v-icon>
                                    <span>{{computedPlayNumber(item.listenCount)}}</span>
                                    <v-icon class="listen-icon">play_circle_outline</v-icon>
                                </div>
                            </div>
                            <!--歌曲列表前3首-->
                            <ul class="songlist">
                                <li class="song" v-for="(song,index) in item.songList">
                                    <span>{{index + 1}}</span>
                                    <span>{{song.songname}} - </span><span class="singer">{{song.singername}}</span>
                                </li>
                            </ul>
                            <!--icon-->
                            <v-icon class="icon">navigate_next</v-icon>
                        </li>
                    </ul>
                </div>
            </scroll>
        </div>
        <!--loading-->
        <div class="loading-wrapper" v-show="!getRankingList.length">
            <loading :loadingText="loadingText"></loading>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        data () {
            return {
                /*
                 * loading显示的文字
                 * @type {String}
                 * */
                loadingText: '加载中...'
            }
        },
        mounted () {
            // 获取排行榜数据接口
            this.setRankingList()
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取排行榜数据
                 * @type {Array}
                 * */
                getRankingList: 'rankingList'
            })
        },
        methods: {
            back () {
                this.$router.back();
            },
            // 选择榜单
            selectItem (item) {
                this.$router.push({
                    path: `/home/ranking/${item.id}`
                })

                // 设置排行榜歌单id
                this.setRankingId(item);
            },
            /**
             * 计算播放量
             * @type {String}  playNumber
             */
            computedPlayNumber (playNumber) {
                // 如果当前播放量是1万才进行计算
                if (playNumber > 1e4) {
                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
                }
                return playNumber;
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', {
                /*
                 * 获取排行榜数据接口
                 * */
                setRankingList: 'getRankingList'
            }),
            ...mapActions('appStore', {
                /*
                 * 设置排行榜歌单id
                 * */
                setRankingId: 'rankingId',
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData'
            })
        },
        // 组件激活
        activated () {
            setTimeout(() => {
                this.$refs.scroll.refresh();
            }, 50);

            // 设置首页头部导航
            this.setAppHeader({
                show: false
            });
        },
        watch: {
            getRankingList (newRankingList) {
                this.setScrollData(newRankingList);
            }
        },
        components: {
            Scroll,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    /*loading*/
    .loading-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        padding-top: 50%;
        z-index: 10;
    }

    /*头部*/
    .ranking-header {
        display: flex;
        position: relative;
        width: 100%;
        height: px2rem(84px);
        z-index: 100;
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
        /*标题*/
        .header-title {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            margin: 0;
            text-align: center;
            line-height: 1.12rem;
            font-size: 0.48rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #fff;
            z-index: 40;
        }
    }

    /*内容*/
    .ranking-content {
        position: fixed;
        top: px2rem(84px);
        bottom: px2rem(120px);
        left: 0;
        right: 0;
        width: 100%;
        background: $ranking-content-bgcolor;
        /*内容标题*/
        .content-title {
            margin: 0;
            font-size: px2rem(36px);
            line-height: px2rem(84px);
            letter-spacing: px2rem(4px);
        }
        /*滚动组件*/
        .scroll {
            height: 100%;
            overflow: hidden;
            .item {
                display: flex;
                margin: 0 px2rem(20px) px2rem(20px) px2rem(20px);
                height: px2rem(200px);
                /*图片*/
                .item-img {
                    position: relative;
                    flex: 0 0 px2rem(200px);
                    width: px2rem(200px);
                    height: px2rem(200px);
                    /*播放量*/
                    .listen-count {
                        position: absolute;
                        bottom: px2rem(14px);
                        padding: 0 px2rem(10px);
                        box-sizing: border-box;
                        line-height: px2rem(24px);
                        font-size: px2rem(18px);
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        color: #fff;
                        opacity: 0.8;
                        span {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: 80%;
                            overflow: hidden;
                            padding-left: px2rem(6px);
                        }
                        .small-icon {
                            position: absolute;
                            left: px2rem(8px);
                            right: auto;
                            line-height: 0;
                            bottom: px2rem(14px);
                            font-size: px2rem(18px);
                            color: #fff;
                        }
                        .listen-icon {
                            position: absolute;
                            line-height: 0;
                            right: px2rem(10px);
                            bottom: px2rem(14px);
                            font-size: px2rem(46px);
                            color: #fff;
                        }
                    }
                }
                .songlist {
                    flex: 1;
                    display: flex;
                    text-align: left;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 px2rem(30px);
                    font-size: px2rem(30px);
                    height: px2rem(200px);
                    overflow: hidden;
                    background: #fff;
                    .song {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        line-height: px2rem(70px);
                    }
                    .singer {
                        color: rgba(0, 0, 0, .5);
                    }
                }
                /*icon*/
                .icon {
                    position: absolute;
                    right: px2rem(16px);
                    line-height: px2rem(200px);
                    font-size: px2rem(60px);
                    color: #b2b2b2;
                }
            }
        }
    }

</style>
