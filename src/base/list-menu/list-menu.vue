<template>
    <div>
        <div v-show="items.listData" v-for="items in listMenu">
            <div v-for="(listData, index) in items.listData" :key="listData.name">
                <div class="list-title" @click="clickListTitle(listData.title)">
                    <h1 class="name">{{listData.name}}</h1>
                    <i class="iconfont icon-prev_arrow-copy"></i>
                </div>
                <ul class="list-data" v-if="listData.data">
                    <li class="data-li" v-for="(data, index) in listData.data" :key="index"
                        @click="selectSongSingle(data, bigTitle[index])">
                        <img class="data-mark"
                             :alt="data.edge_mark"
                             :src="data.edge_mark"
                             v-show="data.edge_mark"/>
                        <img class="data-cover"
                             :alt="data.cover"
                             v-lazy="data.cover"/>
                        <div class="data-title">
                            <span class="big-title" v-show="data.status">{{bigTitle[index]}}</span>
                            <span class="title-span" v-html="data.title"></span>
                        </div>
                    </li>
                </ul>
                <!--加载图-->
                <ul class="list-data" v-else>
                    <li class="data-li" v-for="item in loadingImg">
                        <img class="data-cover"
                             alt="default"
                             src="../../../static/img/default.jpg"/>
                        <div class="data-title">
                            <hr>
                            <hr width="50%" align="left">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions} from 'vuex';

    export default {
        props: {
            listMenu: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                loadingImg: [0, 1, 2, 3, 4, 5], // 加载图数量
                bigTitle: ['新歌', '数字专辑', '新碟'] // 新歌速递组件 大标题
            };
        },
        methods: {
            // 标题点击事件
            clickListTitle(data) {
                this.$emit('clickListTitle', data);
            },
            // 选择歌单派发点击事件
            selectSongSingle(item, bigTitle) {
                if (this.listMenu) {
                    this.$emit('selectSongSingle', item, bigTitle);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

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
            /*float: left;*/
            font-size: px2rem(32px);
        }
        /*icon*/
        .iconfont {
            position: absolute;
            right: 0;
            /*text-align: right;*/
            /*float: right;*/
            font-size: px2rem(40px);
            color: #999;
        }
    }

    /*歌单导航数据*/
    .list-data {
        padding: 0 5px;
        display: flex;
        flex-wrap: wrap;
        min-height: px2rem(330px);
        .data-li {
            flex: 1;
            flex-basis: 30%;
            width: 30%;
        }
        .data-li:nth-child(3n + 2) {
            margin: 0 px2rem(10px);
        }
    }

    /*最新*/
    .data-mark {
        position: absolute;
        width: px2rem(80px);
        border-radius: px2rem(10px) 0 0 0;
    }

    /*歌单图片*/
    .data-cover {
        border-radius: px2rem(10px);
        width: 100%;
        min-width: 118.5px;
        height: px2rem(244px);
    }

    /*歌单标题*/
    .data-title {
        position: relative;
        padding: 0 5px;
        text-align: left;
        line-height: px2rem(32px);
        font-size: px2rem(24px);
        color: $list-title;
        height: px2rem(80px);
        -webkit-box-orient: vertical;
        .title-span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
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
        hr{
            margin-left: px2rem(-10px);
            height: px2rem(20px);
            border: 0;
            background: rgba(236,236,236,0.95);
            &:last-child{
                margin-top: px2rem(4px);
            }
        }
    }
</style>
