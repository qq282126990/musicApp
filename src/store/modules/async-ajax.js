import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
// 主页数据
import {getSlider, getMusicuMessage, getDigitalAlbum, getfeaturedRadio} from 'api/musician';
// 分类歌单数据接口
import {getDissTag, getSortSongData} from 'api/sortSong';
// 首页新歌速递导航数据
import {createNewSong} from 'common/js/new_song_speed';
// 获取新歌模块头部切换对应的歌曲列表
import {getSwitchNewSongList} from 'api/newSongModule';
// 获取全部数字专辑数据 获取更多数字专辑数据
import {getTotalDigitalAlbum, getMoreAlbumList, getDigitalAlbumMusicList} from 'api/totalDigitalAlbum';

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
 * @type {Object}
 */
let newSongList = [];

let state = {
    /**
     * 主页的渲染数据
     * @type {Array}
     */
    slider: [], // 轮播图
    recommend: [], // 热门推荐数据
    newSong: [], // 数据通过 newSongList 组合完传入
    featuredRadio: [], // 精选电台
    /*
     * 分类歌单的渲染数据
     * @type {Array} || {Boolean}
     * */
    dissNavigate: [], //  分类歌单导航
    sortSongData: [], // 获取分类歌单推荐信息
    setSortSongDataOK: false, // 设置分类歌单推荐信息请求是否完成
    /**
     * 新歌速递 新歌模块数据
     * @type {Array}
     */
    newSongList: [],
    /**
     * 新歌速递模块点击内容标题 对应type的数据
     * @type {Array}
     */
    switchNewSongList: [],
    /**
     * 获取全部数字专辑数据 音乐数字专辑相册
     * @type {Object}
     */
    musicDigitalAlbum: {},
    /*
    * 更多数字专辑数据
    * @type {Object}
    * */
    moreDigitalAlbum: {},
    /*
    * 获取数字专辑歌曲列表数据
    * @type {Object}
    * */
    digitalAlbumMusicList: {}
};

let actions = {

    /**
     * 获取轮播图
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
        }
    },
    /**
     * 获取精选电台
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
     * @param {Function} commit
     */
    async getMusicuMessage({commit}) {
        let res = await getMusicuMessage();
        if (res.code === ERR_OK) {
            // 传入newSongList 进行组合
            newSongList[0] = createNewSong(res.new_song.data.song_list.slice(0, 1)) || defaultSong;
            newSongList[2] = createNewSong([res.new_album.data.album_list[1]]) || defaultSong;

            // 新歌速递---新歌模块数据
            commit(types.SET_NEW_SONG_LIST, {newSongList: res.new_song.data});
            // 推荐歌单数据
            commit(types.SET_RECOMMEND, {recommend: res.recomPlaylist.data.v_hot.slice(0, 6) || []});
            // 主页新歌速递数据
            commit(types.SET_DIGITAL_ALBUM, {newSong: newSongList || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取分类歌单导航信息
     * @param {Function} commit
     */
    async getDissTag({commit}) {
        let res = await getDissTag();
        if (res.code === ERR_OK) {
            commit(types.SET_DISS_NAVIGATE, {dissNavigate: res.data.categories || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取分类歌单歌曲信息
     * @param {Function} commit
     */
    async getSortSongData({commit}, param) {
        // 设置分类歌单推荐信息请求是否完成
        commit(types.SET_SORT_SONG_DATA_OK, false);

        let res = await getSortSongData(param);

        if (res.code === ERR_OK) {
            // 获取分类歌单歌曲信息
            commit(types.SET_SORT_SONG_DATA, {sortSongData: res.data || []});

            // 设置分类歌单推荐信息请求是否完成
            commit(types.SET_SORT_SONG_DATA_OK, true);
        }
        else {
            // 错误处理
        }
    },
    setSortSongDataOK({commit}, setSortSongDataOK) {
        commit(types.SET_SORT_SONG_DATA_OK, setSortSongDataOK);
    },
    /**
     * 获取新歌速递模块点击内容标题 对应type的数据
     * @param {Function} commit
     */
    async getSwitchNewSongList({commit}, type) {
        let res = await getSwitchNewSongList(type);
        if (res.code === ERR_OK) {
            commit(types.SET_SWITCH_NEW_SONG_LIST_TITLE, {switchNewSongList: res.new_song.data || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取全部数字专辑数据
     * @param {Function} commit
     */
    async getTotalDigitalAlbum({commit}, type) {
        let res = await getTotalDigitalAlbum(type);
        if (res.code === ERR_OK) {
            // 获取全部数字专辑数据 音乐数字专辑相册
            commit(types.SET_MUSIC_DIGITAL_ALBUM, {musicDigitalAlbum: res.MusicHallDigitalAlbum.data || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取更多数字专辑数据
     * @param {Function} commit
     */
    async getMoreAlbumList({commit}, start) {
        let res = await getMoreAlbumList(start);
        if (res.code === ERR_OK) {
            // 更多数字专辑数据
            commit(types.SET_DIGITAL_MORE_ALBUM, {moreDigitalAlbum: res.moreAlbum.data || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取数字专辑歌曲列表数据
     * @param {Function} commit
     */
    async getDigitalAlbumMusicList({commit}, id) {
        let res = await getDigitalAlbumMusicList(id);
        if (res.code === ERR_OK) {
            // 获取数字专辑歌曲列表数据
            commit(types.SET_DIGITAL_ALBUM_MUSIC_LIST, {digitalAlbumMusicList: res.data || []});
        }
        else {
            // 错误处理
        }
    }
};

let mutations = {
    // 获取轮播图
    [types.SET_SLIDER](state, {slider}) {
        state.slider = slider;
    },
    // 数据通过 newSongList 组合完传入
    [types.SET_DIGITAL_ALBUM](state, {newSong}) {
        state.newSong = newSong;
    },
    // 获取精选电台
    [types.SET_FEATERED_RADIO](state, {featuredRadio}) {
        state.featuredRadio = featuredRadio;
    },
    // 获取歌单模块数据
    [types.SET_NEW_SONG_LIST](state, {newSongList}) {
        state.newSongList = newSongList;
    },
    // 热门推荐数据
    [types.SET_RECOMMEND](state, {recommend}) {
        state.recommend = recommend;
    },
    // 分类歌单数据
    [types.SET_DISS_NAVIGATE](state, {dissNavigate}) {
        state.dissNavigate = dissNavigate;
    },
    // 获取分类歌单歌曲信息
    [types.SET_SORT_SONG_DATA](state, {sortSongData}) {
        state.sortSongData = sortSongData;
    },
    // 设置分类歌单推荐信息请求是否完成
    [types.SET_SORT_SONG_DATA_OK](state, setSortSongDataOK) {
        state.setSortSongDataOK = setSortSongDataOK;
    },
    // 获取新歌速递模块点击内容标题 对应type的数据
    [types.SET_SWITCH_NEW_SONG_LIST_TITLE](state, {switchNewSongList}) {
        state.switchNewSongList = switchNewSongList;
    },
    // 获取全部数字专辑数据 音乐数字专辑相册
    [types.SET_MUSIC_DIGITAL_ALBUM](state, {musicDigitalAlbum}) {
        state.musicDigitalAlbum = musicDigitalAlbum;
    },
    // 更多数字专辑数据
    [types.SET_DIGITAL_MORE_ALBUM](state, {moreDigitalAlbum}) {
        state.moreDigitalAlbum = moreDigitalAlbum;
    },
    // 获取数字专辑歌曲列表数据
    [types.SET_DIGITAL_ALBUM_MUSIC_LIST](state, {digitalAlbumMusicList}) {
        state.digitalAlbumMusicList = digitalAlbumMusicList;
    }
};

let getters = {
    sortSongData(state) {
        return state.sortSongData;
    },
    setSortSongDataOK(state) {
        return state.setSortSongDataOK;
    },
    newSongList(state) {
        return state.newSongList;
    },
    switchNewSongList () {
        return state.switchNewSongList;
    }
};

export default {
    namespaced: true,
    actions,
    mutations,
    getters,
    state
};
