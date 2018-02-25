<template>
    <transition name="fade">
        <div class="search-box-wrapper">
            <!--头部-->
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
            <div class="shortcut-wrapper">
                <scroll class="shortcut">
                    <div>
                        <!--热门搜索-->
                        <div class="hot-key">
                            <!--标题-->
                            <h1 class="hot-title">热门搜索</h1>
                            <!--内容-->
                            <ul>
                                <li class="item"
                                    :class="{'active': index === 0}"
                                    v-for="(item, index) in getSearchHot"
                                    :key="index"
                                    @click="addQuery(item.k)"
                                >
                                    <span>{{item.k}}</span>
                                </li>
                            </ul>
                        </div>
                        <!--搜索历史-->
                        <div class="search-history" v-show="getSearchHistory.length">
                            <h1 class="history-title">
                                <span class="text">搜索历史</span>
                                <!--清空历史按钮-->
                                <span class="clear" @click="showConfirm">清空历史</span>
                            </h1>
                           <search-list :searchHistory="getSearchHistory"
                                        @selectHistory="addQuery"
                                        @deleteHistory="setDeleteSearchHistory"></search-list>
                        </div>
                    </div>
                </scroll>
            </div>
            <!--搜索结果-->
            <div class="search-result" v-show="query" ref="searchResult">
                <!--搜索提示-->
                <div class="search-prompt">
                    <p>{{`搜索 "${query}"`}}</p>
                </div>
                <!--搜索列表-->
                <suggest @listScroll="blurInput" @saveSearch="saveSearch" :query="query"></suggest>
            </div>
            <confirm text="是否清空所有搜索历史"
                     @end="setClearSearchHistory"
                     ref="confirm" ></confirm>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 搜索框
    import SearchBox from 'base/search-box/search-box';
    // 搜索历史列表
    import SearchList from 'base/search-list/search-list';
    // 搜索列表
    import Suggest from 'components/suggest/suggest';
    // 弹出框
    import Confirm from 'base/confirm/confirm';

    export default {
        data() {
            return {
                query: ''
            }
        },
        mounted() {
            this.setRefreshDelay(120);
            // 获取热门搜索接口
            this.setSearchHot();
        },
        computed: {
            ...mapState('asyncAjax', {
                /*
                 * 获取热门搜索
                 * @type {Array}
                 * */
                getSearchHot: 'searchHot'
            }),
            ...mapState('appStore', {
                /*
                 * 获取搜索历史
                 * @type {Array}
                 * */
                getSearchHistory: 'searchHistory'
            })
        },
        methods: {
            addQuery(query) {
                this.$refs.searchBox.setQuery(query)
            },
            // 取消键盘焦点
            blurInput() {
                this.$refs.searchBox.blur();
            },
            onQueryChange(query) {
                this.query = query
            },
            // 保存搜索结果
            saveSearch() {
                this.setSaveSearchHistory(this.query)
            },
            // 清空历史搜索弹出框
            showConfirm() {
                this.$refs.confirm.show()
            },
            ...mapActions('asyncAjax', {
                /**
                 * 获取热门搜索接口
                 */
                setSearchHot: 'getSearchHot'
            }),
            ...mapActions('appStore', {
                /**
                 * 刷新延迟
                 * @type {Number}
                 */
                setRefreshDelay: 'refreshDelay',
                /**
                 * 滚动组件外部传入的数据
                 * @type {Array}
                 */
                setScrollData: 'scrollData',
                /**
                 * 把搜索结果保存在本地
                 * @type {Array}
                 */
                setSaveSearchHistory: 'saveSearch',
                /**
                 * 删除搜索历史
                 * @type {Array}
                 */
                setDeleteSearchHistory: 'deleteSearch',
                /**
                 * 清除全部搜索历史
                 * @type {Array}
                 */
                setClearSearchHistory: 'clearSearch'
            })
        },
        watch: {
            getSearchHot (searchHot) {
              // 滚动组件外部传入的数据
              this.setScrollData(searchHot);
            }
        },
        components: {
            SearchBox,
            Scroll,
            Suggest,
            SearchList,
            Confirm
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .fade-enter {
        padding-top: px2rem(88px);
    }

    .search-box-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $search-box-wrapper-bgcolor;
    }

    .shortcut-wrapper {
        position: fixed;
        top: px2rem(120px);
        bottom: 0;
        width: 100%;
        .shortcut {
            height: 100%;
            overflow: hidden;
            /*热门搜索*/
            .hot-key {
                margin: 0 px2rem(40px) px2rem(40px) px2rem(40px);
                .hot-title {
                    margin: 0;
                    padding-bottom: px2rem(30px);
                    text-align: left;
                    font-size: px2rem(28px);
                    color: $hot-key-color;
                }
                ul {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                }
                .item {
                    margin: 0 px2rem(20px) px2rem(20px) 0;
                    height: px2rem(60px);
                    line-height: px2rem(60px);
                    border-radius: px2rem(100px);
                    border: 1px solid $hot-key-color;
                    font-size: px2rem(24px);
                    span {
                        margin: 0 px2rem(20px);
                    }
                    &.active {
                        color: #37c37f;
                        border: 1px solid #37c37f;
                    }
                }
            }
            /*搜索历史*/
            .search-history{
                position: relative;
                .history-title{
                    margin: 0;
                    padding: 0 px2rem(40px);
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: px2rem(28px);
                    height: px2rem(80px);
                    line-height: px2rem(80px);
                    .text{
                        color: $hot-key-color;
                    }
                    .clear{
                        color: #3ac481;
                    }
                }
            }
        }
    }

    /*搜索结果*/
    .search-result{
        position: fixed;
        width: 100%;
        top: px2rem(72px);
        bottom: px2rem(208px);
        background: $search-result-bgcolor;
    }

    /*搜索提示*/
    .search-prompt{
        padding: 0 px2rem(30px);
        text-align: left;
        font-size: px2rem(28px);
        height: px2rem(88px);
        line-height: px2rem(88px);
        color: $search-prompt-color;
        background: $search-prompt-bgcolor;
        p{
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
