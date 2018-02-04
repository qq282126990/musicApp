<template>
    <div>
        <div v-for="item in albumList" v-show="item.data.length > 0 && item.title !== '专题栏目'">
            <!--标题-->
            <h2 class="title">
                <span class="txt">{{item.title === '热门推荐' ? '最新上架' : item.title}}</span>
                <i class="iconfont icon-prev_arrow-copy"></i>
            </h2>
            <!--列表-->
            <ul class="album-list">
                <li class="list-item" v-for="list in item.data" @click="selectAlbum(list)">
                    <div class="list-item-box">
                        <!--专辑图片-->
                        <div class="list-media-cd">
                            <img class="list-img"
                                 v-lazy="list.cover"/>
                        </div>
                        <!--专辑名称-->
                        <h3 class="list-text1">{{list.albumName}}</h3>
                        <!--歌手名称-->
                        <p class="list-text2">{{list.singerName}}</p>
                        <!--专辑价钱-->
                        <p class="money">免费</p>
                    </div>
                </li>
            </ul>
        </div>
        <!--专题栏目-->
        <div class="special-topic" v-for="item in albumList" v-show="item.data.length > 0 && item.title === '专题栏目'">
            <!--标题-->
            <h2 class="title">
                <span class="txt">{{item.title}}</span>
                <i class="iconfont icon-prev_arrow-copy"></i>
            </h2>
            <!--列表-->
            <ul class="special-topic-list">
                <li class="list-item" v-for="list in item.data">
                    <!--专辑图片-->
                    <div class="item-cove">
                        <img v-lazy="list.cover"/>
                    </div>
                    <!--专辑文字-->
                    <div class="text-wrapper">
                        <!--logo-->
                        <p>
                            <i class="text-1">{{list.tag}}</i>
                        </p>
                        <!--文字-->
                        <p class="text-2">{{list.title}}</p>
                        <!--评论和点赞数量-->
                        <div class="text-3">
                            <!--评论数量-->
                            <span class="comment">
                                <i class="iconfont icon-pinglun"></i>
                                {{list.commentCount}}
                            </span>
                            <!--点赞数量-->
                            <span class="like">
                                <i class="iconfont icon-dianzan"></i>
                                {{list.likeCount}}
                             </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            /*
             * 列表数据
             * @type {Array}
             * */
            albumList: {
                type: Array,
                default: []
            }
        },
        methods: {
            /*
             * 获取选择的专辑的数据
             * */
            selectAlbum (list) {
                this.$emit('selectAlbum', list);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*标题*/
    .title {
        position: relative;
        display: block;
        height: px2rem(110px);
        line-height: px2rem(110px);
        padding: 0 px2rem(80px);
        overflow: hidden;
        text-align: center;
        .txt {
            margin-left: px2rem(10px);
            overflow: hidden;
            line-height: 1.2;
            white-space: nowrap;
            letter-spacing: 5px;
            font-size: px2rem(36px);
        }
        .iconfont {
            position: absolute;
            top: px2rem(6px);
            right: 0;
            line-height: px2rem(110px);
            margin-right: px2rem(40px);
            font-size: px2rem(40px);
            color: #999;
        }
    }

    /*列表*/
    .album-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 3px;
    }

    .list-item {
        position: relative;
        overflow: hidden;
        flex: 33.3%;
        margin-bottom: 10px;
    }

    .list-item-box {
        display: block;
    }

    /*专辑图片*/
    .list-media-cd {
        position: relative;
        display: block;
        margin: 0 px2rem(4px) 0 px2rem(6px);
        &::before {
            content: "";
            position: absolute;
            z-index: 2;
            left: px2rem(-6px);
            top: px2rem(-2px);
            width: 100%;
            height: 100%;
            border-style: solid;
            border-width: 1px 1px 1px 3px;
            border-color: #e7c896;
        }
        &::after {
            content: "";
            display: block;
            padding-top: 100%;
        }
    }

    .list-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
    }

    /*专辑名称*/
    .list-text1 {
        overflow: hidden;
        margin: px2rem(10px) px2rem(10px) 0 px2rem(10px);
        line-height: px2rem(36px);
        text-align: left;
        font-size: px2rem(24px);
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*歌手名称*/
    .list-text2 {
        overflow: hidden;
        margin: 0 px2rem(10px);
        line-height: px2rem(36px);
        text-align: left;
        font-size: px2rem(24px);
        color: $list-text2-color;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /*专辑价钱*/
    .money {
        position: relative;
        margin: 0 px2rem(10px);
        line-height: px2rem(36px);
        text-align: left;
        font-size: px2rem(24px);
        color: $list-text2-color;
    }

    /*专题栏目*/
    .special-topic {
        /*标题*/
        .title {
            position: relative;
            display: block;
            height: px2rem(110px);
            line-height: px2rem(110px);
            padding: 0 px2rem(80px);
            overflow: hidden;
            text-align: center;
            .txt {
                margin-left: px2rem(10px);
                overflow: hidden;
                line-height: 1.2;
                white-space: nowrap;
                letter-spacing: 5px;
                font-size: px2rem(36px);
            }
            .iconfont {
                position: absolute;
                top: px2rem(6px);
                right: 0;
                line-height: px2rem(110px);
                margin-right: px2rem(40px);
                font-size: px2rem(40px);
                color: #999;
            }
        }
        /*列表*/
        .special-topic-list {
            display: flex;
            flex-direction: column;
            position: relative;
            margin-bottom: px2rem(32px);
            overflow: hidden;
        }
        .list-item {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            position: relative;
            margin: 0 0 px2rem(2px) 0;
            padding-right: px2rem(20px);
            height: px2rem(188px);
        }
        /*专辑图片*/
        .item-cove {
            flex: 0 0 px2rem(188px);
            margin-right: px2rem(20px);
            img {
                width: 100%;
            }
        }
        /*专辑文字*/
        .text-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            margin: px2rem(10px) 0;
            overflow: hidden;
            p {
                display: flex;
                text-align: left;
                width: fit-content;
            }
            /*logo*/
            .text-1 {
                flex: 1;
                position: relative;
                display: inline-block;
                margin: 0 px2rem(8px) 0 0;
                padding: 0 px2rem(6px);
                text-align: left;
                height: px2rem(32px);
                line-height: px2rem(36px);
                font-size: px2rem(24px);
                font-style: normal;
                color: $special-topic-logo;
                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    border-radius: px2rem(4px);
                    border: solid 1px $special-topic-logo;
                    pointer-events: none;
                    width: 100%;
                    height: inherit;
                }
            }
            /*文字*/
            .text-2 {
                flex: 1;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                -webkit-box-align: start;
                letter-spacing: px2rem(2px);
                margin-top: px2rem(8px);
                margin-bottom: px2rem(2px);
                font-size: px2rem(28px);
                text-align: justify;
                line-height: 1.3;
                white-space: normal;
            }
            /*评论和点赞数量*/
            .text-3 {
                flex: 1;
                display: -webkit-box;
                -webkit-box-align: center;
                padding-top: px2rem(16px);
                text-align: left;
                color: $comment-like-color;
                /*评论*/
                .comment, .like {
                    display: -webkit-box;
                    -webkit-box-align: center;
                    position: relative;
                    font-size: px2rem(24px);
                    margin-right: px2rem(8px);
                    width: px2rem(104px);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    .iconfont {
                        position: relative;
                        top: px2rem(2px);
                        font-size: px2rem(32px);
                    }
                }
                /*点赞*/
            }
        }
    }
</style>
