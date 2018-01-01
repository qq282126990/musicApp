import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
import {getSlider, getMusicuMessage, getDigitalAlbum, getfeaturedRadio} from 'api/musician';
import {createNewSong} from 'common/js/newSong';

/**
 * 新歌速递组件默认数据
 *
 * @type {Object}
 */
let defaultSong = {
    albumName: null,
    cover: null,
    id: null,
    singerName: null,
    status: null,
    title: '<hr><hr>'
};

/**
 * 新歌速递组件的数据
 *
 * @type {Object}
 */
let newSongList = [];

let state = {

    /**
     * 主页 的 渲染数据
     *
     * @type {Object}
     */
    slider: [], // 轮播图
    recommend: [], // 热门推荐数据
    newSong: [], // 数据通过 newSongList 组合完传入
    featuredRadio: [] // 精选电台
};

let actions = {

    /**
     * 获取轮播图
     *
     * @param {Function} commit
     */
    async getSlider({commit}) {
        let res = await getSlider();
        if (res.code === ERR_OK) {
            commit(types.SET_SLIDER, {slider: res.data.slider || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取数字专辑
     *
     * @param {Function} commit
     */
    async getDigitalAlbum({commit}) {
        let res = await getDigitalAlbum();
        if (res.code === ERR_OK) {
            // 传入newSongList 进行组合
            newSongList[1] = createNewSong([res.data.content[0].albumlist[1]]) || defaultSong;

            commit(types.SET_DIGITAL_ALBUM, {newSong: newSongList || []});
        }
        else {
            // 错误处理
            console.log(res.error);
        }
    },
    /**
     * 获取精选电台
     *
     * @param {Function} commit
     */
    async getfeaturedRadio({commit}) {
        let res = await getfeaturedRadio();
        if (res.code === ERR_OK) {
            commit(types.SET_FEATERED_RADIO, {featuredRadio: res.data.data.groupList[0].radioList.slice(0, 3) || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取主页信息
     *
     * @param {Function} commit
     */
    async getMusicuMessage({commit}) {
        let res = await getMusicuMessage();
        if (res.code === ERR_OK) {
            // 传入newSongList 进行组合
            newSongList[0] = createNewSong(res.new_song.data.song_list.slice(0, 1)) || defaultSong;
            newSongList[2] = createNewSong([res.new_album.data.album_list[1]]) || defaultSong;

            commit(types.SET_RECOMMEND, {recommend: res.recomPlaylist.data.v_hot.slice(0, 6) || []});
            commit(types.SET_DIGITAL_ALBUM, {newSong: newSongList || []});
        }
        else {
            // 错误处理
        }
    }
};

let mutations = {
    [types.SET_SLIDER](state, {slider}) {
        state.slider = slider;
    },
    [types.SET_DIGITAL_ALBUM](state, {newSong}) {
        state.newSong = newSong;
    },
    [types.SET_FEATERED_RADIO](state, {featuredRadio}) {
        state.featuredRadio = featuredRadio;
    },
    [types.SET_RECOMMEND](state, {recommend}) {
        state.recommend = recommend;
    }
};

export default {
    namespaced: true,
    actions,
    mutations,
    state
};
