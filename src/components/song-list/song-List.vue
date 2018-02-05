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
    // 获取歌曲列表 getSongList 获取专辑收藏量接口 getCollection
    import {getSongList, getCollection} from 'api/musicSongList';
    // 获取歌曲播放MP4地址方法
    import {getSongPlayingUrl} from 'api/songPlayingUrl';
    // 对list数据做处理创建歌曲列表方法
    import {createSong} from 'common/js/song';
    // 获取播放量方法
    import {computedPlayNumber} from 'common/js/util';
    // 歌曲播放接口
    import {crackedPlayingAjax} from 'common/js/cracked_ajax';
    // 新碟专辑歌曲列表接口
    import {getNewAlbumSongList} from 'api/newAlbum';
    import {ERR_OK} from 'api/config';
    // 音乐专辑组件
    import musicList from '../music-list/music-list.vue';

    export default {
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
                console.log(this.homeSonglist);

                // 判断如果没有 数据就回退上一页
                if (!this.homeSonglist.contentId) {
                    // 返回主页
                    this.$router.back();
                }
                else if (this.homeSonglist.start === 'newAlbum') {
                    getNewAlbumSongList(this.homeSonglist.mid).then((res) => {
                        if (res.code === ERR_OK) {
                            console.log(res);

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
            /**
             * 歌曲播放mp4 地址
             */
            getSongPlayingUrl(data) {
                // 对数据进行转换
                getSongPlayingUrl(this._Song_Playing_Mp4_Url(data)).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songPlayingUrl = res.url_mid.data;

                        // 歌曲数据
                        this.songs = this._normalizeSongs(data, this.songPlayingUrl);

                        // 把歌曲列表存入vuex
                        this.setSongList(this.songs);
                    }
                });
            },
            /**
             * 歌曲播放接口传入的data参数
             * @type {Object}  list
             */
            _Song_Playing_Mp4_Url(list) {
                let strMediaMid = [];
                let songtype = [];
                list.forEach((data) => {
                    if (data) {
                        strMediaMid.push(`${data.strMediaMid}`);
                        songtype.push(0);
                    }
                });
                return crackedPlayingAjax(strMediaMid, songtype);
            },
            /**
             *  获取更多歌曲列表
             *  @param {number} newSongBegin
             */
//            getSongListMore(newSongBegin) {
//                // 初始化设置还没有请求
//                this.ajax_ok = false;
//
//                // 如果没有更多就不执行
//                if (!this.hasMore) {
//                    return;
//                }
//
//                // 获取歌曲列表接口
//                getSongList(this.homeSonglist.content_id, newSongBegin).then((res) => {
//                    if (res.code === ERR_OK) {
//                        // this.data = res.cdlist[0];
//
//                        // 拼接更多歌曲列表
//                        this.songs = this.songs.concat(this._genResult(res.cdlist[0].songlist));
//
//                        // 把歌曲列表存入vuex
//                        this.setSongList(this.songs);
//
//                        // 如果歌曲列表总数小于15条和没有歌曲列表就不能加载更多
//                        this._checkMore(res.cdlist[0], newSongBegin);
//
//                        // 设置请求完成
//                        this.ajax_ok = true;
//                    }
//                });
//            },
            // 检查是否能够加载更多
//            _checkMore(data, newSongBegin) {
//                // 有歌曲列表，歌曲列表长度小于15，页数 等于歌曲列表总页数  就设置未不能加载更多
//                if (!data.songlist.length || data.songlist.length < 15 || newSongBegin === data.total_song_num) {
//                    this.hasMore = false;
//                }
//            },
            /**
             * 对list数据做处理
             * @type {Array}  list
             */
            _normalizeSongs(list, playingUrl) {
                let ret = [];

                list.forEach((musicData, index) => {
                    if (musicData) {
                        ret.push(createSong(musicData, playingUrl, index));
                    }
                });

                return ret;
            },
            /**
             * 对list数据进行拼接 上拉加载
             * @type {Array}  list
             */
//            _genResult(list) {
//                let ret = [];
//                if (list) {
//                    ret = ret.concat(this._normalizeSongs(list));
//                }
//                return ret;
//            },
            /**
             * 计算播放量
             * @type {String}  playNumber
             */
//            computedPlayNumber(playNumber) {
//                // 如果当前播放量是1万才进行计算
//                if (playNumber > 1e4) {
//                    playNumber = (playNumber / 1e4).toFixed(1) + '万';
//                }
//                return playNumber;
//            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
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
                setSongListMessage: 'songListMessage',
                /**
                 * 歌曲列表
                 * @type {Array}
                 */
                setSongList: 'songList'
            })
        },
        // 当组件激活的调用
        activated() {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });

            // 每次切换都重置一边歌曲列表
            // this.setSongList([]);
            // 初始化歌曲列表
            // this.songs = [];

            if (this.songs.length === 0 && !this.ajax_ok) {
                // 组件激活的时候调用接口 不应该放在created 或者mounted钩子里，
                // 如果放在created 或者mounted钩子里只会执行一次
                // 获取歌曲列表
                this.getSongList();

//                setTimeout(() => {
//                }, 400);
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
