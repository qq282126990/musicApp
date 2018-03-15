<template>
    <div>
        <div v-show="items.listData" v-for="items in listMenu">
            <div v-for="(listData, index) in items.listData" :key="listData.name">
                <div class="list-title" @click="clickListTitle(listData.title)">
                    <h1 class="name">{{listData.name}}</h1>
                    <i class="iconfont icon-prev_arrow-copy"></i>
                </div>
                <!--为你推荐歌单-->
                <transition-group tag="ul"
                                  name="fade"
                                  class="list-data"
                                  appear
                                  v-if="listData.data.length && listData.title === 'homeRecommend'">
                    <li class="data-li"
                        v-for="(data, index) in listData.data"
                        :key="index"
                        v-if="showLi && showfade"
                        @click="selectSongSingle(data)">
                        <img class="data-mark"
                             :alt="data.edge_mark"
                             v-lazy="data.edge_mark"
                             v-show="data.edge_mark"/>
                        <img class="data-cover"
                             :alt="data.cover"
                             v-lazy="data.cover"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <!--播放量数字-->
                            <div class="play-number" v-show="data.listen_num">
                                <i class="iconfont icon-erji"></i>
                                <span class="number">{{computedPlayNumber(data.listen_num)}}</span>
                            </div>
                            <!--播放按钮-->
                            <v-icon class="play">play_circle_outline</v-icon>
                        </div>
                        <!--歌单标题-->
                        <div class="data-title">
                            <span class="title-span" v-html="data.title"></span>
                        </div>
                    </li>
                </transition-group>
                <ul class="list-data" v-show="!showLi">
                    <!--加载图-->
                    <li class="data-li" v-for="item in loadingImg" :key="item">
                        <img class="data-cover"
                             alt="default"
                             src="../../../static/img/default.jpg"/>
                        <div class="data-title">
                            <hr>
                            <hr width="50%" align="left">
                        </div>
                    </li>
                </ul>
                <!--换一批-->
                <div class="replace-data"
                     v-show="listData.title === 'homeRecommend' && listData.data.length">
                    <div class="replace-button"
                         @click="clickReplaceData">
                        <v-icon class="icon" :class="{active: !showfade}">cached</v-icon>
                        <p class="name">换一批</p>
                    </div>
                </div>
                <!--新歌专辑-->
                <ul tag="ul" name="fade" class="list-data"
                    v-if="listData.data.length && listData.title === 'newSongSpeed'">
                    <li class="data-li"
                        v-for="(data, index) in listData.data"
                        :key="index"
                        @click="selectSongSingle(data)">
                        <img class="data-mark"
                             :alt="data.edge_mark"
                             v-lazy="data.edge_mark"
                             v-show="data.edge_mark"/>
                        <img class="data-cover"
                             :alt="data.cover"
                             v-lazy="data.cover"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <!--播放量数字-->
                            <div class="play-number" v-show="data.listen_num">
                                <i class="iconfont icon-erji"></i>
                                <span class="number">{{computedPlayNumber(data.listen_num)}}</span>
                            </div>
                            <!--播放按钮-->
                            <v-icon class="play">play_circle_outline</v-icon>
                        </div>
                        <!--歌单标题-->
                        <div class="data-title">
                            <span class="title-span" v-html="data.title"></span>
                        </div>
                    </li>
                </ul>
                <!--MV列表-->
                <transition-group tag="ul"
                                  name="fade"
                                  class="list-data-li-mv"
                                  appear
                                  v-if="listData.data.length && listData.title === 'newMV'">
                    <li class="data-li"
                        v-for="(data, index) in listData.data"
                        :key="index"
                        @click="selectSongSingle(data)">
                        <img class="mv-cover"
                             :alt="data.cover"
                             v-lazy="data.cover"/>
                        <!--播放量-->
                        <div class="play-number-wrapper">
                            <!--播放量数字-->
                            <div class="play-number">
                                <i class="iconfont icon-shipincopy"></i>
                                <span class="number">{{computedPlayNumber(data.listen_num)}}</span>
                            </div>
                        </div>
                        <!--歌单标题-->
                        <div class="data-title">
                            <span class="title-span" v-html="data.title"></span>
                            <span class="title-span" v-html="data.mvdesc"></span>
                        </div>
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';

    export default {
        props: {
            listMenu: {
                type: Array,
                default: null
            }
        },
        data () {
            return {
                /*
                * 加载图数量
                * @type {Number}
                * */
                loadingImg: ['a', 'b', 'c', 'd', 'e', 'f'],
                /*
                * 设置是否显示列表
                * @type {Boolean}
                * */
                showLi: true,
                /*
                 * 渐变显示
                 * @type {Boolean}
                 * */
                showfade: true
            };
        },
        computed: {
            ...mapState('asyncAjax', {
                getHomeRecommend: 'homeRecommend'
            })
        },
        mounted () {
            this.showLi = false;
            this.fade = false;
        },
        methods: {
            // 标题点击事件
            clickListTitle (data) {
                this.$emit('clickListTitle', data);
            },
            // 计算播放量
            computedPlayNumber (playNumber) {
                // 如果当前播放量是1万才进行计算
                if (playNumber > 1e4) {
                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
                }
                return playNumber;
            },
            // 选择歌单派发点击事件
            selectSongSingle (item) {
                if (this.listMenu) {
                    this.$emit('selectSongSingle', item);
                }
            },
            // 点击换一批按钮更换数据
            clickReplaceData () {
                // 设置随机数据
                let random = Math.floor(Math.random() * 10);

                // 请求刷新歌单推荐数据
                this.setReplaceHomeRecomPlaylist(random);
            },
            ...mapActions('asyncAjax', {
                // 请求刷新歌单推荐数据
                setReplaceHomeRecomPlaylist: 'getReplaceHomeRecomPlaylist'
            })
        },
        watch: {
            getHomeRecommend (newData) {
                if (!newData.length) {
                    return;
                }
                this.showLi = true;
                this.showfade = false;
                setTimeout(() => {
                    this.showfade = true;
                }, 200)
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-leave-to {
        opacity: 0;
    }

    /*列表外层*/
    .list-title {
        position: relative;
        display: flex;
        margin-left: px2rem(30px);
        margin-right: px2rem(40px);
        box-sizing: border-box;
        text-align: center;
        line-height: px2rem(80px);
        height: px2rem(80px);
        color: $list-title;
        /*大标题*/
        .name {
            flex: 1;
            display: inline-block;
            padding-left: px2rem(40px);
            margin: 0;
            letter-spacing: 5px;
            line-height: px2rem(80px);
            font-size: px2rem(32px);
        }
        /*icon*/
        .iconfont {
            position: absolute;
            right: 0;
            font-size: px2rem(40px);
            color: #999;
        }
    }

    /*歌单导航数据*/
    .list-data {
        padding: 0 px2rem(10px);
        display: flex;
        flex-wrap: wrap;
        min-height: px2rem(330px);
        .data-li {
            flex: 1;
            flex-basis: 30%;
            width: 30%;
        }
        .data-li:nth-child(3n + 2) {
            margin: 0 px2rem(5px);
        }
        /*歌单图片*/
        .data-cover {
            width: 100%;
            min-width: px2rem(237px);
            height: px2rem(244px);
        }
        /*播放量*/
        .play-number-wrapper {
            position: relative;
            margin-top: px2rem(-56px);
            padding: 0 px2rem(10px);
            box-sizing: border-box;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            width: 100%;
            height: px2rem(50px);
            color: $title-color;
            background: $play-number-bgcolor;
            z-index: 2;
            /*播放量数字*/
            .play-number {
                display: flex;
                flex: 1;
                padding: 0 0 px2rem(10px) 0;
                /*title*/
                .number {
                    flex: 1;
                    text-align: left;
                    padding-left: px2rem(10px);
                    font-size: px2rem(24px);
                    line-height: px2rem(32px);
                    white-space: nowrap;
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
                opacity: .7;
            }
        }
        /*歌单标题*/
        .data-title {
            position: relative;
            padding: px2rem(10px) px2rem(10px) 0 px2rem(10px);
            text-align: left;
            line-height: px2rem(32px);
            font-size: px2rem(24px);
            color: $list-title;
            height: px2rem(80px);
            -webkit-box-orient: vertical;
            /*标题*/
            .title-span {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
            }
            hr {
                margin-left: px2rem(-10px);
                height: px2rem(20px);
                border: 0;
                background: rgba(236, 236, 236, 0.95);
                &:last-child {
                    margin-top: px2rem(4px);
                }
            }
        }
        /*新歌速递标题*/
        .big-title {
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            overflow: visible;
            margin-top: px2rem(-70px);
            font-size: px2rem(40px);
            font-weight: bold;
            line-height: px2rem(60px);
            height: px2rem(60px);
            color: $list-data-title;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
        }
    }

    /*MV列表*/
    .list-data-li-mv {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        min-height: px2rem(330px);
        .data-li {
            flex-basis: 50%;
            box-sizing: border-box;
            overflow: hidden;
            text-align: left;
            /*歌单图片*/
            .mv-cover {
                padding-right: px2rem(2px);
                width: 100%;
                min-width: px2rem(237px);
                height: px2rem(210px);
            }
            /*播放量*/
            .play-number-wrapper {
                position: relative;
                margin: px2rem(-56px) px2rem(2px) 0 0;
                padding-left: px2rem(10px);
                box-sizing: border-box;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                height: px2rem(50px);
                color: $title-color;
                z-index: 2;
            }
            /*播放量数字*/
            .play-number {
                display: flex;
                flex: 1;
                padding: 0 0 px2rem(10px) 0;
                opacity: .8;
                /*title*/
                .number {
                    flex: 1;
                    text-align: left;
                    padding-left: px2rem(10px);
                    font-size: px2rem(24px);
                    line-height: px2rem(32px);
                    white-space: nowrap;
                }
                /*icon*/
                .icon-shipincopy {
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
                opacity: .7;
            }
        }

        .data-li:nth-child(2n + 2) {
            /*歌单图片*/
            .mv-cover {
                padding-left: px2rem(2px);
                padding-right: 0;
            }
            /*播放量*/
            .play-number-wrapper {
                margin: px2rem(-56px) 0 0 px2rem(2px);
            }
        }
        /*歌单标题*/
        .data-title {
            position: relative;
            padding: px2rem(10px);
            text-align: left;
            line-height: px2rem(32px);
            font-size: px2rem(24px);
            color: $list-title;
            -webkit-box-orient: vertical;
            /*标题*/
            .title-span {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
            }
            .title-span:last-child {
                color: #999;
                line-height: px2rem(50px);
            }
        }
    }

    /*最新*/
    .data-mark {
        position: absolute;
        width: px2rem(80px);
        border-radius: px2rem(10px) 0 0 0;
    }

    /*换一批*/
    .replace-data {
        width: 100%;
        .replace-button {
            position: relative;
            margin: px2rem(40px) auto;
            line-height: px2rem(50px);
            width: px2rem(220px);
            height: px2rem(50px);
            border-radius: px2rem(5px);
            border: px2rem(2px) solid rgba(152, 152, 152, .5);
        }
        .icon {
            position: absolute;
            left: px2rem(50px);
            line-height: 25px;
            font-size: px2rem(36px);
        }
        .name {
            margin-bottom: 0;
            padding-left: px2rem(80px);
            font-size: px2rem(24px);
        }
        .active {
            animation: rotate .5s;
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
