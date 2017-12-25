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
                    <list-menu :List="List" @select="selectSinger"></list-menu>
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
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import {getMusicuMessage, getDigitalAlbum, getfeaturedRadio} from 'api/musician';
    import {ERR_OK} from 'api/config';
    import Song from 'common/js/newSong';

    import Silder from 'base/slider/slider';
    import ListMenu from 'base/list-menu/list-menu';
    import Scroll from 'base/scroll/scroll';
    import TabRouter from 'components/tabRouter/tabRouter';

    export default {
        data() {
            return {
                // slider: [], // 轮播图
                recommend: [], // 热门推荐数据
                newSong: [], // 新歌速递数据
                featuredRadio: [] // 精选电台
            };
        },
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('home/getSlider');
        },
        created() {
            // 异步操作挪到了 vuex actions 中完成
            // this._getSlider();
            this._getMusicuMessage();
            this._getDigitalAlbum();
            this._getfeaturedRadio();
        },
        computed: {
            // 从 store 中获取 home/slider
            ...mapState('home', ['slider']),
            // 热门推荐数据
            _recommend () {
                return this.recommend;
            },
            // 新歌速递数据
            _newSong () {
                return this.newSong;
            },
            // 列表数据
            List () {
                this.list = [
                    {recommend: [{'name': '热门推荐', 'data': this._recommend}]},
                    {recommend: [{'name': '新歌速递', 'data': this._newSong}]}
                ];
                return this.list;
            }
        },
        methods: {
            // 选择列表 中的模块 跳转页面
            selectSinger(singer) {
                // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
                if (singer.rcmdtemplate) {
                    this.$router.push({
                        path: `/home/${singer.content_id}`
                    });
                    this.homeSonglist(singer);
                    console.log(singer);
                }
            },
            // 请求轮播图
            // _getSlider() {
            //     getSlider().then((res) => {
            //         if (res.code === ERR_OK) {
            //             this.slider = res.data.slider;
            //         }
            //     });
            // },
            // 请求数字专辑
            _getDigitalAlbum() {
                getDigitalAlbum().then((res) => {
                    if (res.code === ERR_OK) {
                        this.newSong[1] = this._newSonger([res.data.content[0].albumlist[1]]);
                    }
                });
            },
            // 请求精选电台
            _getfeaturedRadio() {
                getfeaturedRadio().then((res) => {
                    if (res.code === ERR_OK) {
                        this.featuredRadio = res.data.data.groupList[0].radioList.slice(0, 3);
                    }
                });
            },
            // 请求主页信息
            _getMusicuMessage() {
                getMusicuMessage().then((res) => {
                    if (res.code === ERR_OK) {
                        // 传到 菜单组件的数据
                        this.recommend = res.recomPlaylist.data.v_hot.slice(0, 6);
                        this.newSong[0] = this._newSonger(res.new_song.data.song_list.slice(0, 1));
                        this.newSong[2] = this._newSonger([res.new_album.data.album_list[1]]);

                        this.$refs.scroll.refresh();
                    }
                });
            },
            _newSonger(list) {
                let items = {};

                list.forEach((item) => {
                    let id = item.album_mid;
                    let name = item.album_name;
                    let singerName = item.singer_name;

                    items = (new Song({
                        id: id,
                        albumName: name,
                        singerName: singerName
                    }));

                    if (item.singer) {
                        let id = item.album.mid;
                        let name = item.album.name;
                        let singerName = item.singer[0].name;

                        items = (new Song({
                            id: id,
                            albumName: name,
                            singerName: singerName,
                            edge_mark: null
                        }));
                    }

                    if (item.author) {
                        let id = item.album.mid;
                        let name = item.album.name;
                        let singerName = item.author[0].name;

                        items = (new Song({
                            id: id,
                            albumName: name,
                            singerName: singerName
                        }));
                    }
                });
                return items;
            },
            ...mapActions('appStore', [
                'homeSonglist'
            ])
        },
        // 监听错误
        errorCaptured (err, vm, info) {
            console.log(err);
            console.log(err === true);
            console.log(vm);
            console.log(info);
            this._getMusicuMessage();
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
        background: rgba(13, 12, 18, 0.95);
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
