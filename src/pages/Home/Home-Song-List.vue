<template>
    <div>
        <transition name="slide">
            <music-list :title="title"
                        :carousel="carousel"
                        :coverImage="coverImage"
                        :albumName="albumName"
                        :authorAvatar="authorAvatar"
                        :smallAvatar="smallAvatar"
                        :authorName="authorName"
                        :desc="desc"
                        :songs="songs"
                        :collection="collection"
                        :playNumber="computedPlayNumber"
            ></music-list>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import {getSongList, getCollection} from 'api/musicSongList';
    import {ERR_OK} from 'api/config';
    import {createSong} from 'common/js/song';
    import musicList from '../../components/music-list/music-list.vue';

    export default {
        data () {
            return {
                // 歌曲数据
                data: [],
                // 歌曲列表
                songs: [],
                // 作者头像
                authorAvatar: '',
                // 作者头像下的小图标
                smallAvatar: '',
                // 简介
                desc: '',
                // 专辑收藏量
                collection: 0,
                // 播放量
                playNumber: '0'
            };
        },
        computed: {
            // 标题
            title () {
                return this.homeSonglist.rcmdtemplate;
            },
            // 滚动标题
            carousel () {
                return this.homeSonglist.title;
            },
            // 头部背景图片
            coverImage() {
                return this.homeSonglist.cover;
            },
            // 专辑名称
            albumName () {
                return this.homeSonglist.title;
            },
            // 作者名字
            authorName () {
                return this.homeSonglist.username;
            },
            // 计算播放量
            computedPlayNumber () {
                // 如果当前播放量是1万才进行计算
                if (this.playNumber > 1e4) {
                    this.playNumber = (this.playNumber / 1e4).toFixed(1) + '万';
                }
                return this.playNumber;
            },
            // 获取音乐列表
            ...mapGetters('appStore', [
                'homeSonglist'
            ])
        },
        methods: {
            /**
             *  获取歌曲列表
             */
            getSongList () {
                // 判断如果没有 数据就回退上一页
                if (!this.homeSonglist.content_id) {
                    // 返回主页
                     this.$router.back();
                }
                else {

                    // 获取歌曲列表接口
                    getSongList(this.homeSonglist.content_id).then((res) => {
                        if (res.code === ERR_OK) {
                            this.data = res.cdlist[0];
                            // 歌曲
                            this.songs = this._normalizeSongs(this.data.songlist);
                            // 简介
                            this.desc = '简介:' + this.data.desc;
                            // 专辑头像
                            this.authorAvatar = this.data.headurl;
                            // 专辑的小头像
                            this.smallAvatar = this.data.ifpicurl;
                            // 播放量
                            this.playNumber = this.data.visitnum;
                        }
                    });

                    // 获取专辑收藏量接口
                    getCollection(this.homeSonglist.content_id).then((res) => {
                        if (res.code === ERR_OK) {
                            this.collection = res.totalnum;
                        }
                    });
                }
            },
            /**
             * 对list数据做处理
             *
             * @type {Array}  list
             */
            _normalizeSongs(list) {
                let ret = [];
                list.forEach((musicData) => {
                    if (musicData) {
                        ret.push(createSong(musicData));
                    }
                });
                return ret;
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('appStore', [
                'maskLayer'
            ])
        },
        // 当组件激活的调用
        activated() {
            // 隐藏头部导航
            this.setAppHeader({
                show: false
            });

            // 组件激活的时候调用接口 不应该放在created 或者mounted钩子里，
            // 如果放在created 或者mounted钩子里只会执行一次
            // 获取歌曲列表
            this.getSongList();
        },
        // 当组件停用时执行
        deactivated () {
            this.setAppHeader({
                show: true
            });
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