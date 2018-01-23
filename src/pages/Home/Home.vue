<template>
    <div>
        <scroll class="scroll" :data="recommend" ref="scroll">
            <div>
                <!--轮播图-->
                <div class="silder-wrapper">
                    <div v-if="slider.length">
                        <Silder>
                            <div v-for="item in slider">
                                <a :href="item.linkUrl">
                                    <img :src="item.picUrl">
                                </a>
                            </div>
                        </Silder>
                    </div>
                </div>
                <!--主页导航-->
                <tab-router></tab-router>
                <div class="content-wrapper">
                    <!--其他导航列表-->
                    <list-menu :List="List" @clickTitle="clickTitle" @select="selectSinger"></list-menu>
                    <!--精选电台-->
                    <div class="featuredRadio-wrapper">
                        <div class="list-title">
                            <h1 class="name">精选电台</h1>
                            <i class="iconfont icon-prev_arrow-copy"></i>
                        </div>
                        <ul class="list-data">
                            <li v-for="(item, index) in featuredRadio" :key="index">
                                <img class="cover" v-lazy="item.radioImg"/>
                                <div class="title">
                                    <span>{{item.radioName}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import {setCookie} from 'common/js/cookie';
    // 自定义歌单推荐数据
    import {createSongTableMessage} from 'common/js/songTableMessage';
    // 轮播图
    import Silder from 'base/slider/slider';
    // 菜单模块导航
    import ListMenu from 'base/list-menu/list-menu';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // TabRouter导航
    import TabRouter from 'components/tabRouter/tabRouter';

    export default {
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('asyncAjax/getSlider'); // 轮播图请求
            await store.dispatch('asyncAjax/getMusicuMessage'); // 音乐数据接口请求
            await store.dispatch('asyncAjax/getfeaturedRadio'); // 精选电台接口请求
            await store.dispatch('asyncAjax/getDigitalAlbum'); // 数字专辑接口请求
        },
        data () {
            return {};
        },
        computed: {
            // 获取请求接口对应的数据
            ...mapState('asyncAjax', ['slider', 'recommend', 'newSong', 'featuredRadio']),
            // 主页类别  模块 数据
            List() {
                this.list = [
                    {recommend: [{'name': '热门推荐', 'title': 'hotRecommend', 'data': this.recommend}]},
                    {recommend: [{'name': '新歌速递', 'title': 'newSongList', 'data': this.newSong}]}
                ];
                return this.list;
            },
            // 获取歌曲播放的 guid !!!!!!!!!!!!!!!!!!!!!! 重要
            guid () {
                var date = new Date();
                return Math.round(2147483647 * Math.abs(Math.random() - 1) * date.getUTCMilliseconds() % 1e10);
            }
        },
        created () {
            // 获取cookie 获取歌曲播放的 guid
            // 设置guid 到cookie中 !!!!!!!!!!!!!!!!!!!!!! 重要
            setCookie('guid', this.guid, Infinity, '/');

            // 设置滚动列表不能回弹
            this.bounce(false);
        },
        methods: {
            // 点击标题 跳转页面
            clickTitle(data) {
                this.$router.push({
                    path: `/home/module/${data}`
                });
            },
            // 选择列表 中的模块 跳转页面
            selectSinger(singer) {
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (singer.content_id) {
                    // 把选中的专辑的数据存入 homeSonglist
                    this.homeSonglist(createSongTableMessage(singer));
                    // 跳转到专辑页面
                    this.$router.push({
                        path: `/home/${singer.content_id}`
                    });
                }
            },
            ...mapActions('appStore', [
                /*
                 * 主页选中的专辑数据
                 * type {Object}
                 */
                'homeSonglist',
                /**
                 * 歌曲列表接口一次请求的页数 一次 +15
                 * @type {Number}
                 */
                // 'songBegin',
                /**
                 * 歌曲列表信息
                 * @type {Object}
                 */
                'songListMessage',
                /**
                 * 歌曲列表
                 * @type {Array}
                 */
                'songList',
                /**
                 * 设置滚动列表不回弹
                 * @type {Boolean}
                 */
                'bounce'
            ]),
            ...mapActions('asyncAjax', [
                /*
                 * 主页请求的音乐模块的 数据
                 * type {Array}
                 */
                'getMusicuMessage'
            ])
        },
        activated() {
            setTimeout(() => {
                // 初始化歌曲列表全部数据
                // this.songBegin(0);
//                this.songListMessage({});
//                this.songList([]);
            }, 400);
        },
        // 监听错误
        errorCaptured(err) {
            console.log(err);
        },
        components: {
            Silder,
            ListMenu,
            Scroll,
            TabRouter
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .scroll {
        height: 100%;
        overflow: hidden;
    }

    .silder-wrapper {
        position: relative;

        overflow: hidden;

        width: 100%;
        height: px2rem(300px);
    }

    .content-wrapper {
        overflow: hidden;
        background: $content-bgcolor;
    }

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

    .list-data {
        padding: 0 px2rem(40px);
        display: flex;
        flex-wrap: wrap;
        min-height: px2rem(330px);
        li {
            flex: 1;
            flex-basis: 30%;
            width: 30%;
            .cover {
                border-radius: 50%;
                width: 100%;
                height: px2rem(215px);
            }
            .title {
                position: relative;
                padding: px2rem(20px) px2rem(10px) 0 px2rem(10px);
                text-align: center;
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
        }
    }

    li:nth-child(3n + 2) {
        margin: 0 px2rem(20px);
    }
</style>
