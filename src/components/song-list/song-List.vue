<template>
    <div>
        <transition name="slide">
            <music-list
                :collection="collection"
                :hasMore="hasMore"
            ></music-list>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import {mapActions, mapGetters} from 'vuex';
    // 应用mixins
    import {createdSongList} from 'common/js/mixin';
    // 获取歌曲列表 getSongList 获取专辑收藏量接口 getCollection
    import {getSongList, getCollection} from 'api/musicSongList';
    // 获取播放量方法
    import {computedPlayNumber} from 'common/js/util';
    // 新碟专辑歌曲列表接口
    import {getNewAlbumSongList} from 'api/newAlbum';
    import {ERR_OK} from 'api/config';
    // 音乐专辑组件
    import musicList from '../music-list/music-list.vue';

    export default {
        mixins: [createdSongList],
        data() {
            return {
                /*
                 * 歌曲数据
                 * @param {Object}
                 **/
                data: {},
                /*
                 * 歌曲列表
                 * @param {Array}
                 **/
                songs: [],
                /*
                 * 歌曲播放地址
                 * @param {Object}
                 **/
                songPlayingUrl: {},
                /*
                 * 设置是否有更多歌曲列表
                 * @param {Boolean}
                 **/
                hasMore: false,
                /*
                 * 判断请求是否完成
                 * @param {Boolean}
                 **/
                ajax_ok: false,
                /*
                 * 专辑收藏量
                 * @param {Number}
                 **/
                collection: 0
            };
        },
        computed: {
            // 获取音乐列表
            ...mapGetters('appStore', [
                /*
                 * 选择的的歌曲列表数据
                 * @param {Object}
                 * */
                'homeSonglist',
                /*
                 * 歌曲列表显示页数 默认是0  请求一次 + 15
                 * @param {Number}
                 * */
                'songBegin'
            ])
        },
        mounted() {
            // 初始化歌曲列表
            this.songs = [];
            // 初始化歌曲列表全部数据
            this.setSongListMessage({});
            this.setSongList([]);
        },
        methods: {
            /**
             *  获取歌曲列表
             */
            getSongList() {

                // 初始化设置还没有请求
                this.ajax_ok = false;

                // 判断如果没有 数据就回退上一页
                if (!this.homeSonglist.contentId) {
                    // 返回主页
                    this.$router.back();
                }
                // 判断如果是从新碟模块进入就请求新碟歌曲接口
                else if (this.homeSonglist.start === 'newAlbum') {
                    getNewAlbumSongList(this.homeSonglist.mid).then((res) => {
                        if (res.code === ERR_OK) {
                            // 获取歌曲播放MP4地址
                            this.getSongPlayingUrl(res.data.list);

                            //  ---------------歌曲列表的信息---------------------- //
                            // 简介
                            this.data.desc = '简介:' + res.data.desc;
                            // 专辑头像
                            this.data.authorAvatar = res.data.company_new.headPic;
                            // 专辑的小头像
                            this.data.smallAvatar = '';
                            // 播放量
                            this.data.playNumber = '';
                            // 歌曲列表总数
                            this.data.totalSongNum = res.data.total_song_num;
                            // 发布人
                            this.data.nickname = res.data.company;
                            // ------------------------------------------------- //
                            // 存入vuex的 songListMessage
                            this.setSongListMessage(this.data);

                            // 设置请求完成
                            this.ajax_ok = true;
                        }
                    });
                }
                else {
                    // 初始化歌曲列表显示的页数
                    this.setSongBegin(0);

                    // 设置加载更多
                    this.hasMore = false;

                    // 获取歌曲列表接口
                    // 下拉加载时传入的参数    this.songBegin
                    getSongList(this.homeSonglist.contentId || this.homeSonglist.dissid).then((res) => {
                        if (res.code === ERR_OK) {
                            // 获取歌曲播放MP4地址
                            this.getSongPlayingUrl(res.cdlist[0].songlist);

                            //  ---------------歌曲列表的信息---------------------- //
                            // 简介
                            this.data.desc = '简介:' + res.cdlist[0].desc;
                            // 专辑头像
                            this.data.authorAvatar = res.cdlist[0].headurl;
                            // 专辑的小头像
                            this.data.smallAvatar = res.cdlist[0].ifpicurl;
                            // 播放量
                            this.data.playNumber = computedPlayNumber(res.cdlist[0].visitnum);
                            // 歌曲列表总数
                            this.data.totalSongNum = res.cdlist[0].total_song_num;
                            // 发布人
                            this.data.nickname = res.cdlist[0].nickname;
                            // ------------------------------------------------- //
                            // 存入vuex的 songListMessage
                            this.setSongListMessage(this.data);

                            // 如果歌曲列表总数小于15条和没有歌曲列表就不能加载更多
                            // this._checkMore(res.cdlist[0], this.songBegin);

                            // 设置请求完成
                            this.ajax_ok = true;
                        }
                    });

                    // 获取专辑收藏量接口
                    getCollection(this.homeSonglist.contentId || this.homeSonglist.dissid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.collection = res.totalnum;
                        }
                    });
                }
            },
            ...mapActions('appStore', {
                /**
                 * 歌曲列表接口一次请求的页数 一次 +15
                 * @type {Number}
                 */
                setSongBegin: 'songBegin',
                /**
                 * 歌曲列表信息
                 * @type {Object}
                 */
                setSongListMessage: 'songListMessage'
            })
        },
        // 当组件激活的调用
        activated() {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });

            // 每次切换都重置一边歌曲列表
             this.setSongList([]);
            // 初始化歌曲列表
            // this.songs = [];

            if (this.songs.length === 0 && !this.ajax_ok) {
                // 组件激活的时候调用接口 不应该放在created 或者mounted钩子里，
                // 如果放在created 或者mounted钩子里只会执行一次
                // 获取歌曲列表
                this.getSongList();
            }
        },
        // 当组件停用时执行
        deactivated() {
            // 显示头部导航
            this.setAppHeader({
                show: true
            });
        },
        watch: {
            // 监听歌曲列表页数的变化
//            songBegin(newSongBegin) {
//                if (this.songs.length === this.data.totalSongNum) {
//                    return;
//                }
//                if (newSongBegin >= 15) {
//                    this.getSongListMore(newSongBegin);
//                }
//
//            }
        },
        components: {
            musicList
        }
    };
</script>

<style lang="scss" scoped>
    .slide-enter-active, .slide-leave-active {
        transition: all .3s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }
</style>
