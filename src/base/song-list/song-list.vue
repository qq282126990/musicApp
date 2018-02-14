<template>
    <div class="song-list">
        <!--歌曲列表-->
        <ul class="list-content">
            <li class="content-li" v-for="(item, index) in getSongList" @click="selectSong(item, index)" :key="index">
                <!--选中列表实出现-->
                <div class="selected">
                    <div></div>
                </div>
                <div class="content-wrapper">
                    <div class="content">
                        <!--歌曲名称-->
                        <h3 class="content-title">
                            <span>{{item.name}}</span>
                        </h3>
                        <!--歌手名称-->
                        <p class="text">
                            <span>{{item.singer}} · {{item.album}}</span>
                        </p>
                    </div>
                </div>
            </li>
            <!--没有更多了-->
            <div class="none-more" v-show="!hasMore && getSongList.length">
                <v-icon class="icon">sentiment_dissatisfied</v-icon>
                <span class="title">没有更多了</span>
            </div>
            <!--播放器-->
            <audio ref="audio"></audio>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState} from 'vuex';

    const musicList = [
        'http://dl.stream.qqmusic.qq.com/C200003p360d04gldH.m4a',
        'http://dl.stream.qqmusic.qq.com/C200003p360d04gldH.m4a'
    ]

    export default {
        props: {
            // 设置是否能够加载更多
            hasMore: {
                type: Boolean,
                default: false
            }
        },
        data (){
            return {
                index: 0
            }
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取歌曲列表
                 * @param {Object}
                 * */
                getSongList: 'songList'
            })
        },
        methods: {
            selectSong(item, index) {
                this.$emit('selectSong', item, index);

                this.index = (this.index + 1) % musicList.length;
                this.url = musicList[this.index];

                console.log(this.url);
                setTimeout(() => {
                    this.$refs.audio.src = this.url;
                    this.$refs.audio.play();
                }, 0);
            }
        },
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*歌曲列表外层*/
    .song-list {
        padding: 0;
        min-height: 100%;
        background: $list-bgcolor;
        z-index: 100;
    }

    /*列表内容*/
    .list-content {
        padding: 0;
        min-height: 100%;
        overflow: hidden;
        .content-li {
            display: flex;
            height: px2rem(124px);
        }
        /*选中*/
        .selected {
            flex: 0 0 px2rem(32px);
            padding: px2rem(20px) 0;
            box-sizing: border-box;
            width: px2rem(32px);
            height: px2rem(124px);
            .bg-color {
                display: -webkit-box;
                width: px2rem(10px);
                height: 100%;
                background: #30c17b;
            }
        }
        /*外层*/
        .content-wrapper {
            flex: 1;
            display: flex;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            height: px2rem(124px);
            border-bottom: px2rem(1px) solid rgba(227, 227, 227, 0.95);
        }
        /*内容*/
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: px2rem(20px) 0;
            box-sizing: border-box;
            text-align: left;
            overflow: hidden;
            height: px2rem(124px);
            color: $content-text-color;
            /*标题*/
            .content-title {
                display: -webkit-box;
                -webkit-box-align: center;
                flex: 1;
                font-size: px2rem(32px);
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: $content-title-color;
                font-weight: 300;
                span {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: normal;
                }
            }
            /*文本*/
            .text {
                margin: 0;
                display: -webkit-box;
                -webkit-box-align: center;
                flex: 1;
                font-size: px2rem(24px);
                span {
                    display: block;
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: normal;
                }
            }
        }
        /*更多 icon*/
        .more {
            padding-right: px2rem(32px);
            font-size: px2rem(42px);
            color: $more-color;
        }
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
        .title {
            font-size: px2rem(32px);
            vertical-align: middle;
        }
        .icon {
            font-size: px2rem(52px);
            color: #b6b6b6;
        }
    }
</style>
