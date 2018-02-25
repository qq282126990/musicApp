<template>
    <div class="ranking-song-list">
        <!--榜单图片-->
        <div class="bg-image" :style="bgImage">
            <!--返回按钮-->
            <div class="back" @click="back">
                <i class="iconfont icon-fanhui1-copy"></i>
            </div>
            <!--标题-->
            <h1 class="bg-image-title">
                {{`${rankingTile} 第${rankingDate}天`}}
            </h1>
            <!--时间-->
            <p class="bg-image-time">{{`${rankingUpdate}更新`}}</p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState, mapGetters} from 'vuex';
    // 对歌曲列表数据做处理
    import {normalizeRankSongList} from 'common/js/songList';

    export default {
        data () {
            return {
                /*
                 * 榜单标题
                 * @type {String}
                 * */
                rankingTile: null,
                /*
                 * 榜单时间
                 * @type {String}
                 * */
                rankingDate: null,
                /*
                 * 榜单更新时间
                 * @type {String}
                 * */
                rankingUpdate: null,
                /*
                 * 榜单歌曲列表
                 * @type {Array}
                 * */
                rankingSongList: []
            }
        },
        computed: {
            bgImage() {
                if (this.rankingSongList.length) {
                    return `background-image:url(${this.rankingSongList[0].image})`
                }
                return ''
            },
            ...mapState('asyncAjax', {
                /*
                 * 排行榜歌单
                 * @type {Array}
                 * */
                getRankingSongList: 'rankingSongList'
            }),
            ...mapState('appStore', {
                /*
                 * 排行榜歌单
                 * @type {Array}
                 * */
                setRankingId: 'rankingId'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome () {
                // 榜单标题
                this.rankingTile = null;
                // 榜单时间
                this.rankingDate = null;
                // 榜单更新时间
                this.rankingUpdate = null;
                // 榜单歌曲列表
                this.rankingSongList = [];
            },
            // 返回按钮
            back() {
                this.$router.back();
            },
            ...mapActions('asyncAjax', {
                /*
                 * 获取排行榜歌曲数据接口
                 * */
                setRankingSongList: 'getRankingSongList'
            })
        },
        // 组件激活
        activated () {
            // 一些初始化操作
            this._initSome();
            // 获取排行榜歌曲数据接口
            this.setRankingSongList(this.setRankingId.id);
        },
        watch: {
            getRankingSongList (newSongList) {
                // 榜单标题
                this.rankingTile = newSongList.topinfo.ListName;
                // 榜单时间
                this.rankingDate = newSongList.day_of_year;
                // 榜单更新时间
                this.rankingUpdate = newSongList.update_time;
                // 榜单歌曲列表
                this.rankingSongList = normalizeRankSongList(newSongList.songlist);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .ranking-song-list {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        bottom: px2rem(120px);
        right: 0;
        /*返回按钮*/
        .back {
            position: absolute;
            top: px2rem(20px);
            z-index: 50;
            .icon-fanhui1-copy {
                display: block;
                padding: px2rem(20px);
                font-size: px2rem(44px);
                color: $icon-fanhui1-copy;
            }
        }
        /*标题*/
        .bg-image-title {
            margin: 0;
            position: absolute;
            bottom: px2rem(70px);
            width: 100%;
            text-align: center;
            font-size: px2rem(36px);
            color: #fff;
        }
        /*时间*/
        .bg-image-time {
            margin: 0;
            position: absolute;
            bottom: px2rem(20px);
            width: 100%;
            text-align: center;
            font-size: px2rem(24px);
            color: #fff;
        }
    }

    /*榜单图片*/
    .bg-image {
        position: relative;
        width: 100%;
        height: px2rem(548px);
        background-size: cover;
    }

</style>
