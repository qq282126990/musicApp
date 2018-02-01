<template>
    <div class="new-song-wrapper">
        <!--头部导航-->
        <div class="header-router">
            <scroll class="scroll" :scrollY="false" :scrollX="true">
                <div>
                    <ul>
                        <li class="item"
                            :class="{'active': headerSelect === index}"
                            v-for="(item,index) in newSongList.type_info" :key="item.title"
                            @click="select(item,index)">
                            <span class="title" v-if="index === 0">最新</span>
                            <span class="title" v-else>{{item.title}}</span>
                        </li>
                    </ul>
                </div>
            </scroll>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';

    export default {
        data () {
            return {
                /*
                 * 设置头部导航那个激活了
                 * */
                headerSelect: 0
            };
        },
        computed: {
            ...mapState('asyncAjax', [
                /*
                 * 获取歌单速递数据
                 * @type {Object}
                 * */
                'newSongList'
            ])
        },
        mounted () {
            console.log(this.newSongList);
            // 滚动组件传入的数据
            this.setScrollData(this.newSongList);

            // 设置滚动组件滚动的状态
            this.setprobeType(3);
            // scroll 组件 开启滚动监听
            this.setlistenScroll(true);
        },
        methods: {
            select (item, index) {
                // 设置头部导航那个激活了
                this.headerSelect = index;
                console.log(index);
            },
            ...mapActions('appStore', {
                /**
                 * 滚动组件传入的数据
                 * @type {Array}
                 */
                setScrollData: 'data',
                setprobeType: 'probeType',
                setlistenScroll: 'listenScroll'
            })
        },
        components: {
            Scroll
        }
    };
</script>

<style scoped lang="scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .new-song-wrapper {
        width: 100%;
        height: 100%;
        z-index: 100000;
    }

    .scroll {
        overflow: hidden;
        width: 100%;
    }

    /*头部导航*/
    .header-router {
        height: px2rem(90px);
        ul {
            width: 100%;
            display: -webkit-box;
            height: px2rem(90px);
        }
        .item {
            display: -webkit-box;
            -webkit-box-pack: center;
            -webkit-box-flex: 0;
            width: px2rem(136px);
            &.active {
                color: $new-song-header-active-color;
                ::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 2;
                    -webkit-box-sizing: border-box;
                    height: 0;
                    border-bottom: solid px2rem(8px);
                    background: $new-song-header-active-color;
                }
            }
            .title {
                position: relative;
                display: -webkit-box;
                -webkit-box-align: center;
                height: px2rem(90px);
                padding: 0 px2rem(16px);
                white-space: nowrap;
                font-size: px2rem(32px);
            }
        }
    }
</style>
