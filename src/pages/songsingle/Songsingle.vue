<template>
    <div class="song-single-wrapper">
        <transition name="slide">
            <music-list :collection="collection" v-show="show">
            </music-list>
        </transition>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import {ERR_OK} from 'api/config';
    // 音乐专辑组件
    import MusicList from 'components/music-list/music-list';
    // 获取主页选择对应歌单的数据
    import {getSongSingle} from 'common/js/cache';
    // 获取专辑收藏量接口 getCollection
    import {getCollection} from 'api/songAlbumMessage';

    export default {
        name: 'songsingle',
        async asyncData({store}) {
            // 请求歌单专辑信息接口
            await store.dispatch('asyncAjax/getSongAlbumMessage', this.songBegin);
        },
        data() {
            return {
                /*
                 * 设置显示歌单列表
                 * @type {Boolean}
                 * */
                show: false,
                /*
                 * 专辑收藏量
                 * @type {Number}
                 **/
                collection: 0,
                /*
                 * 请求歌单专辑歌曲列表页数
                 * @type {Number}
                 * */
                songBegin: 0
            };
        },
        created () {
            // 设置首页头部导航隐藏
            this.setAppHeader({
                show: false
            });
        },
        mounted () {
            // 设置显示歌单列表
            this.show = true;

            // 获取歌单专辑信息
            this.songAlbumMessage();
        },
        computed: {
            // 获取主页选择对应歌单的数据
            getSongSingle () {
                return getSongSingle();
            }
        },
        methods: {
            // 获取歌单专辑信息
            songAlbumMessage() {
                // 判断如果没有 数据就回退上一页
                if (!this.getSongSingle.contentId) {
                    // 返回主页
                    this.$router.back();
                }
                else {
                    // 获取专辑收藏量接口
                    getCollection(this.getSongSingle.contentId || this.getSongSingle.dissid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.collection = res.totalnum;
                        }
                    });
                }
            },
            ...mapActions('appShell/appHeader', [
                'setAppHeader'
            ]),
            ...mapActions('asyncAjax', [
                /**
                 * 请求歌单专辑信息接口
                 * @type {Object}
                 */
                'getSongAlbumMessage'
            ])
        },
        activated() {
            // 设置首页头部导航隐藏
            this.setAppHeader({
                show: false
            });
        },
        components: {
            MusicList
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";

    .slide-enter-active, .slide-leave-active {
        transition: all .4s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }

    .song-single-wrapper {
        background: $mask-layer-bgcolor;
    }
</style>
