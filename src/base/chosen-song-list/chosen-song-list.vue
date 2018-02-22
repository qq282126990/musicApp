<template>
    <!--分类歌单专辑列表-->
    <div class="chosen-song-list">
        <div class="chosen-header">
            <!--标题-->
            <span class="chosen-title">{{chosenTitle}}</span>
            <!--选择-->
            <div class="chosen-heade-select">
                <p :class="{'active': sortId === 2}" @click="selectNavigation(2)">最热</p>
                <p :class="{'active': sortId === 5}" @click="selectNavigation(5)">最新</p>
            </div>
        </div>
        <!--内容-->
        <div class="chosen-content">
            <ul v-show="getSortSongData.list">
                <li v-for="item in sortId === 2 ? sortSongData[0].list : sortSongData[1].list"
                    :key="item.dissname"
                    @click="selectSongList(item)"
                >
                    <!--头像-->
                    <img class="chosen-avatar"
                         :alt="item.imgurl"
                         :src="item.imgurl"/>
                    <!--播放量-->
                    <div class="play-number-wrapper">
                        <!--播放量数字-->
                        <div class="play-number">
                            <i class="iconfont icon-erji"></i>
                            <span class="number">{{computedPlayNumber(item.listennum)}}</span>
                        </div>
                        <!--播放按钮-->
                        <v-icon class="play">play_circle_outline</v-icon>
                    </div>
                    <!--歌单标题-->
                    <span class="name">{{item.dissname}}</span>
                    <!--发布人-->
                    <div class="user-name">
                        <span>{{item.creator.name}}</span>
                        <!--正则判断是否显示logo-->
                        <img class="logo"
                             src="https://y.gtimg.cn/music/common/upload/t_cm3_photo_publish/114042.png"
                             :alt="item.creator.encrypt_uin"
                             v-show="new RegExp('/*').test(`${item.creator.encrypt_uin}`)"/>
                    </div>
                </li>
                <!--下拉加载时显示的Loading效果-->
                <div class="has-more"
                     v-show="sortId === 2 ? sortSongData[0].sum !== sortSongData[0].list : sortSongData[1].sum !== sortSongData[1].list">
                    <loading :loadingText="loadingText"></loading>
                </div>
                <!--没有更多了-->
                <div class="none-more"
                     v-show="sortId === 2 ? sortSongData[0].sum === sortSongData[0].list : sortSongData[1].sum === sortSongData[1].list">
                    <v-icon class="icon">sentiment_dissatisfied</v-icon>
                    <span class="more-title">没有更多了</span>
                </div>
            </ul>
            <!--loading-->
            <div class="loading-wrapper" v-show="!getSortSongData.list">
                <loading :loadingText="loadingText"></loading>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';
    // loading组件
    import Loading from 'base/loading/loading';

    export default {
        props: {
            chosenTitle: {
                type: String,
                default: null
            },
            sortId: {
                type: Number,
                default: 2
            },
            sortSongData: {
                type: Array,
                default: [{}, {}]
            }
        },
        data () {
          return {
              /*
               * loading显示的文字
               * @type {String}
               * */
              loadingText: '加载中...'
          };
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', {
                /*
                 * 获取分类歌单歌曲信息
                 * @type {Array}
                 * */
                getSortSongData: 'sortSongData'
            })
        },
        methods: {
            // 选择歌单导航
            selectNavigation(sortId) {
                this.$emit('selectNavigation', sortId);
            },
            // 点击选择歌单
            selectSongList(singer) {
                this.$emit('selectSongList', singer);
            },
            /**
             * 计算播放量
             * @param {Number}
             */
            computedPlayNumber (playNumber) {
                // 如果当前播放量是1万才进行计算
                if (playNumber > 1e4) {
                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
                }
                return playNumber;
            }
        },
        components: {
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
        padding-top: 30%;
        z-index: 10;
    }

    /*下拉加载时显示的Loading效果*/
    .has-more {
        padding: px2rem(60px) 0 0 0;
        width: 100%;
    }

    /*没有更多了*/
    .none-more {
        position: absolute;
        bottom: px2rem(-198px);
        width: 100%;
        line-height: px2rem(200px);
        height: px2rem(200px);
        color: #b6b6b6;
        background: $none-more;
        .more-title {
            font-size: px2rem(32px);
            vertical-align: middle;
        }
        .icon {
            font-size: px2rem(52px);
            color: #b6b6b6;
        }
    }

    /*精选歌单*/
    .chosen-song-list {
        box-sizing: border-box;
        width: 100%;
        .chosen-header {
            display: flex;
            justify-content: space-between;
            padding: px2rem(20px);
            line-height: px2rem(60px);
        }
        .chosen-title {
            font-size: px2rem(35px);
            color: $hot-songs-title-color;
        }
        .chosen-heade-select {
            font-size: px2rem(28px);
            color: $hot-songs-title-color;
            p {
                margin: 0;
                padding: 0 px2rem(15px);
                display: inline-block;
            }
            p:last-child {
                padding-right: 0;
            }
            .active {
                color: $chosen-heade-select;
            }
        }
        .chosen-content {
            padding-bottom: px2rem(200px);
            width: 100%;
            overflow: hidden;
            ul {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
            li {
                position: relative;
                flex-basis: 50%;
                box-sizing: border-box;
                overflow: hidden;
                text-align: left;
                /*歌单图片*/
                .chosen-avatar {
                    display: block;
                    padding-right: px2rem(10px);
                    border-top-right-radius: px2rem(15px);
                    border-bottom-right-radius: px2rem(15px);
                    width: 100%;
                    min-width: px2rem(375px);
                    min-height: px2rem(375px);
                }
                /*歌单标题*/
                .name {
                    display: block;
                    padding: px2rem(16px) px2rem(20px);
                    text-align: left;
                    line-height: px2rem(40px);
                    font-size: px2rem(24px);
                    height: px2rem(76px);
                    max-height: px2rem(76px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: $content-name-color;
                }
                /*播放量*/
                .play-number-wrapper {
                    position: absolute;
                    margin-top: px2rem(-50px);
                    margin-left: px2rem(-10px);
                    padding: 0 px2rem(20px);
                    box-sizing: border-box;
                    display: flex;
                    align-items: flex-end;
                    width: 100%;
                    height: px2rem(50px);
                    color: $title-color;
                    background: $play-number-bgcolor;
                    z-index: 2;
                    /*播放量数字*/
                    .play-number {
                        display: flex;
                        flex: 1;
                        padding: 0 px2rem(20px) px2rem(10px) 0;
                        /*title*/
                        .number {
                            flex: 1;
                            padding-left: px2rem(15px);
                            font-size: px2rem(24px);
                            line-height: px2rem(32px);
                        }
                        /*icon*/
                        .icon-erji {
                            position: relative;
                            top: px2rem(2px);
                            flex: 0 0 px2rem(24px);
                            font-size: px2rem(24px);
                        }
                    }
                    /*播放按钮*/
                    .play {
                        padding-bottom: px2rem(4px);
                        font-size: px2rem(48px);
                    }
                }
                /*发布人*/
                .user-name {
                    display: flex;
                    align-items: flex-end;
                    padding: 0 px2rem(20px) px2rem(20px) px2rem(20px);
                    font-size: px2rem(24px);
                    color: $user-name-color;
                    span {
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .logo {
                        display: inline-block;
                        margin-left: px2rem(10px);
                        width: px2rem(24px);
                        height: px2rem(24px);
                    }
                }
            }
            li:nth-child(2n + 2) {
                .chosen-avatar {
                    padding-left: px2rem(10px);
                    padding-right: 0;
                    border-top-left-radius: px2rem(15px);
                    border-bottom-left-radius: px2rem(15px);
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                /*播放量*/
                .play-number-wrapper {
                    margin-left: px2rem(10px);
                    padding-left: 0;
                    /*播放量数字*/
                    .play-number {
                        /*icon*/
                        .icon-erji {
                            padding-left: px2rem(10px);
                        }
                    }
                    /*播放按钮*/
                    .play {
                        padding-right: px2rem(10px);
                    }
                }
            }
        }
    }
</style>
