<template>
    <div>
        <div v-for="items in List">
            <ul>
                <li v-for="(recommend, index) in items.recommend" :key="index">
                    <div class="list-title">
                        <h1 class="name">{{recommend.name}}</h1>
                        <i class="iconfont icon-prev_arrow-copy"></i>
                    </div>
                    <ul class="list-data" v-show="recommend.data.length">
                        <li v-for="(data, index) in recommend.data" :key="index" @click="selectItem(data)">
                            <img class="mark" :src="data.edge_mark" v-show="data.edge_mark"/>
                            <img class="cover" v-lazy="data.cover" v-show="data.cover"/>
                            <div class="title">
                                <span class="bigTitle" v-show="data.status">{{bigTitle[index]}}</span>
                                <span>{{data.title}}</span>
                            </div>
                        </li>
                    </ul>
                    <!--加载图-->
                    <ul class="list-data" v-show="!recommend.data.length">
                        <li v-for="item in loadingImg">
                            <img class="cover" src="../../common/image/default.jpg"/>
                            <div class="title"></div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            List: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                loadingImg: [0, 1, 2, 3, 4, 5],
                bigTitle: ['新歌', '数字专辑', '新碟']
            };
        },
        methods: {
            // 派发点击事件
            selectItem(item) {
                this.$emit('select', item);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/variables";
    @import "../../common/sass/remAdaptive";

    .list-title {
        margin-left: px2rem(30px);
        margin-right: px2rem(40px);
        text-align: left;
        line-height: px2rem(80px);
        height: px2rem(80px);
        color: $list-title;
        .name {
            display: inline-block;
            margin: 0;
            line-height: px2rem(80px);
            float: left;
            font-size: px2rem(32px);
        }
        .iconfont {
            float: right;
            font-size: px2rem(40px);
        }
    }

    ul {
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        min-height: px2rem(330px);
    }

    .list-data {
        padding: 0 5px;
    }

    li {
        flex: 1;
        flex-basis: 30%;
        width: 30%;
    }

    .mark {
        position: absolute;
        width: px2rem(80px);
        border-radius: px2rem(10px) 0 0 0;
    }

    .cover {
        border-radius: px2rem(10px);
        width: 100%;
        height: px2rem(244px);
    }

    .title {
        position: relative;
        padding: 0 5px;
        text-align: left;
        line-height: px2rem(32px);
        font-size: px2rem(24px);
        color: $list-title;
        height: px2rem(80px);
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
    }

    .bigTitle {
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        overflow: visible !important;
        margin-top: -30px;
        font-size: 20px;
        font-weight: bold;
    }

    li:nth-child(3n + 2) {
        margin: 0 px2rem(10px);
    }
</style>
