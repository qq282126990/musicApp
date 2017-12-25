<template>
    <div>
        <transition name="slide">
            <music-list :title="title"
                        :carousel="carousel"
                        :coverImage="coverImage"
                        :albumName="albumName"
                        :authorAvatar="authorAvatar"
                        :authorName="authorName"
                        :songs="songs"></music-list>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    import {getSongList} from 'api/musicSongList';
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
                authorAvatar: ''
            };
        },
        created () {
            this.getSongList();
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
            // 获取音乐列表
            ...mapGetters('appStore', [
                'homeSonglist'
            ])
        },
        // 当组件激活的调用
        activated() {
            this.setAppHeader({
                show: false
            });
        },
        methods: {
            getSongList () {
                // 判断如果没有 数据就回退上一页
                if (!this.homeSonglist.content_id) {
                    this.$router.back();
                }
                getSongList(this.homeSonglist.content_id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.data = res.cdlist[0];
                        this.songs = this._normalizeSongs(this.data.songlist);
                        this.authorAvatar = this.data.headurl;
                        console.log(this.songs);
                        console.log(this.data.songlist);
                    }
                });
            },
            // 对list数据做处理
            _normalizeSongs(list) {
                let ret = [];
                list.forEach((musicData) => {
                    console.log(musicData);
                    if (musicData) {
                        ret.push(createSong(musicData));
                    }
                });
                return ret;
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ])
        },
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
