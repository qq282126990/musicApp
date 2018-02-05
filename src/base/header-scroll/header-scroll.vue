<template>
    <!--头部导航-->
    <div class="header-router">
        <div ref="headerListWrapper">
            <ul ref="headerList">
                <li class="item"
                    :class="{'active': headerSelect === item.id}"
                    v-for="(item, index) in newSongList" :key="item.title"
                    @click="selectHeader(item, index)"
                >
                    <v-btn flat class="title">
                        <span>{{item.title}}</span>
                    </v-btn>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 滚动插件
    import BScroll from 'better-scroll';

    export default {
        props: {
            /*
            * 头部数据
            * @type {Array}
            * */
            newSongList: {
                type: Array,
                default: []
            },
            /*
             * 设置头部导航那个激活了
             * @type {Number}
             * */
            headerSelect: {
                type: Number,
                default: 0
            }
        },
        mounted() {
            // 设置滑动的宽度
            this.$nextTick(() => {
                // 设置头部导航滑动的宽度
                this._setHeaderScroll();
            });
        },
        methods: {
            // 设置头部导航滑动的宽度
            _setHeaderScroll() {
                if (this.newSongList.length) {
                    // 获取所有内容标签
                    this.children = this.$refs.headerList.children;
                    // 初始化宽度
                    let width = 0;

                    // 循环选项
                    for (let i = 0; i < this.children.length; i++) {
                        // 获取每个
                        let headerListchild = this.children[i].clientWidth;

                        // 设置每个轮播图的宽度
                        width += headerListchild;
                    }

                    // 设置整个头部的宽度
                    this.$refs.headerList.style.width = width + 'px';

                    this.$nextTick(() => {
                        if (!this.headerScroll) {
                            this.headerScroll = new BScroll(this.$refs.headerListWrapper, {
                                // 设置X轴滚动
                                scrollX: true,
                                // 当设置 eventPassthrough 为 'vertical' 的时候 ScrollY无效
                                eventPassthrough: 'vertical'
                            });
                        }
                        else {
                            // 刷新头部滚动
                            this.headerScroll.refresh();
                        }
                    });
                }
            },
            // 发送头部点击事件
            selectHeader(item, index) {
                this.$emit('selectHeader', item, index);
            }
        },
        watch: {
            newSongList() {
                // 设置滑动的宽度
                this.$nextTick(() => {
                    // 设置头部导航滑动的宽度
                    this._setHeaderScroll();
                });
            }
        }
    };
</script>


<style lang="stylus" scoped>
    @import '../../assets/styles/global.styl';

    .btn {
        margin: 0;
        min-width: inherit;
    }

</style>


<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*头部导航*/
    .header-router {
        position: relative;
        height: px2rem(90px);
        background: #fff;
        z-index: 1000;
        ul {
            padding: 0;
            display: -webkit-box;
            height: px2rem(90px);
        }
        .item {
            display: -webkit-box;
            -webkit-box-pack: center;
            -webkit-box-flex: 0;
            width: px2rem(136px);
            &.active {
                span {
                    color: $new-song-header-active-color;
                }
                ::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 2;
                    -webkit-box-sizing: border-box;
                    height: 0;
                    margin: 0 px2rem(28px);
                    border-bottom: solid px2rem(8px);
                    color: $new-song-header-active-color;
                }
            }
            .title {
                position: relative;
                display: -webkit-box;
                -webkit-box-align: center;
                height: px2rem(90px);
                white-space: nowrap;
                font-size: px2rem(32px) !important;
                width: 100%;
            }
        }
    }
</style>
