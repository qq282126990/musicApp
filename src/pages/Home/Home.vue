<template>
    <scroll :data="recommend">
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
                <list-menu :List="List"></list-menu>
            </div>
        </div>
    </scroll>
</template>

<script>
    import {getSlider, getMusicuMessage, getDigitalAlbum} from 'api/musician';
    import {ERR_OK} from 'api/config';
    import Song from 'common/js/newSong';

    import Silder from 'base/slider/slider';
    import ListMenu from 'base/list-menu/list-menu';
    import Scroll from 'base/scroll/scroll';
    import TabRouter from 'components/tabRouter/tabRouter';

    export default {
        data() {
            return {
                slider: [],
                recommend: [],
                newSong: [],
                digitalAlbum: [],
                big: [{'title': '新歌'}, {'title': '数字专辑'}, {'title': '新碟'}]
            };
        },
        created() {
            this._getSlider();
            this._getMusicuMessage();
            this._getDigitalAlbum();
        },
        computed: {
            List () {
                this.list = [
                    {recommend: [{'name': '热门推荐', 'data': this.recommend}]},
                    {recommend: [{'name': '新歌速递', 'data': this.newSong}]}
                ];
                console.log(this.list);
                return this.list;
            }
        },
        methods: {
            // 请求轮播图
            _getSlider() {
                getSlider().then((res) => {
                    if (res.code === ERR_OK) {
                        this.slider = res.data.slider;
                    }
                });
            },
            // 请求数字专辑
            _getDigitalAlbum() {
                getDigitalAlbum().then((res) => {
                    if (res.code === ERR_OK) {
                        this.digitalAlbum = res.data.content;
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
                        this.newSong[1] = this._newSonger([this.digitalAlbum[0].albumlist[1]]);
                        this.newSong[2] = this._newSonger([this.digitalAlbum[0].albumlist[1]]);
                    }
                });
            },
            _newSonger(list) {
                let items = {};

                list.forEach((item) => {
                    let id = item.album ? item.album.mid : item.album_mid;
                    let name = item.album ? item.album.name : item.album_name;
                    let singerName = item.album ? item.singer[0].name : item.singer_name;

                    items = (new Song({
                        id: id,
                        albumName: name,
                        singerName: singerName
                    }));
                });
                return items;
            }
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
</style>
