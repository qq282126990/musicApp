<template>
    <div class="search-list" v-show="searchHistory.length">
        <transition-group name="list" tag="ul">
            <li class="search-item" v-for="(item, index) in searchHistory" @click="selectHistory(item)" :key="index">
                <!--名称-->
                <span class="item-text">{{item}}</span>
                <!--图标-->
                <v-icon class="icon" @click.stop="deletOne(item)">clear</v-icon>
            </li>
        </transition-group>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            /*
             * 获取搜索历史数据
             * @type {Array}
             * */
            searchHistory: {
                type: Array,
                default: []
            }
        },
        methods: {
            // 选择搜索历史
            selectHistory(item) {
                this.$emit('selectHistory', item);
            },
            // 删除搜索历史
            deletOne(item) {
                this.$emit('deleteHistory', item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .search-list {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .search-item {
            display: flex;
            align-items: center;
            overflow: hidden;
            padding-left: px2rem(30px);
            height: px2rem(88px);
            line-height: px2rem(88px);
            background: #fff;
            &.list-enter-active, &.list-leave-active {
                transition: all 0.1s;
            }
            &.list-enter, &.list-leave-to {
                height: 0;
            }
            /*名称*/
            .item-text {
                margin-left: px2rem(30px);
                margin-bottom: 0;
                text-align: left;
                flex: 1;
                font-size: px2rem(28px);
                border-bottom: px2rem(2px) solid #ededed;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            /*图标*/
            .icon{
                position: absolute;
                right: px2rem(30px);
                font-size: px2rem(28px);
                color: #999;
            }
        }
    }
</style>
