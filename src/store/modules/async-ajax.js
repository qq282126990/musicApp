import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
// 计算播放量方法 computedPlayNumber
import {computedPlayNumber} from 'common/js/util';
// 自定义首页新歌速递导航数据 createHomeNewSongSpeed
// 自定义主页歌单推荐刷新后的数据 createReplaceHomeRecomPlaylist
import {createHomeNewSongSpeed, createReplaceHomeRecomPlaylist} from 'common/js/home';
// 获取主页选择对应歌单的数据 getSongSingle
// 保存一开始的新歌数据 saveInitNewSongList
import {getSongSingle, saveInitNewSongList} from 'common/js/cache';
// 请求主页数据 getHomeMessage
// 主页精选电台导航 getHomeFeaturedRadio
// 主页歌单推荐数据 getHomeRecomPlaylist
import {getHomeMessage, getHomeFeaturedRadio, getReplaceHomeRecomPlaylist} from 'api/homeAjax';
// 获取歌单专辑信息 getSongAlbumMessage
import {getSongAlbumMessage} from 'api/songAlbumMessage';
// 获取歌曲列表播放MP4地址方法
import {getSongListPlayingUrl} from 'api/songListPlayUrl';
// 对歌曲列表数据做处理
import {normalizeSongList} from 'common/js/songList';
// 新歌速递模块点击内容标题对应type的数据 getSwitchNewSongList
// 新碟接口 getNewAlbum
// 新碟专辑歌曲列表接口 getNewAlbumSongList
// 全部数字专辑数据接口 getTotalDigitalAlbum
// 获取更多数字专辑数据 getMoreAlbumList
// 获取数字专辑歌曲列表 getDigitalAlbumSongList
import {
    getSwitchNewSongList,
    getNewAlbum,
    getNewAlbumSongList,
    getTotalDigitalAlbum,
    getMoreAlbumList,
    getDigitalAlbumSongList
} from 'api/newSongSpeed';

// 获取分类歌单导航 getCategoryNavigation
// 获取分类歌单数据接口 getSortSongData
import {getCategoryNavigation, getSortSongData} from 'api/categorySongList'
// 精选电台歌曲接口 getOrdinaryFeaturedRadio
// 个性电台歌曲接口 getPersonalFeaturedRadio
import {getOrdinaryFeaturedRadio, getPersonalFeaturedRadio} from 'api/featuredRadio';

// 拼接歌单专辑歌曲列表
let sliceSonglist = [];

let state = {
    /*
     * 获取主页轮播图
     * @type {Array}
     * */
    homeSlider: [],
    /*
     * 获取主页热门推荐导航
     * @type {Array}
     * */
    homeRecommend: [],
    /*
     * 获取主页新歌导航
     * @type {Array}
     * */
    homeNewSongSpeed: [],
    /*
     * 获取精选电台导航
     * @type {Array}
     * */
    homeFeaturedRadio: [],
    /**
     * 获取歌单专辑信息
     * @type {Object}
     */
    songAlbumMessage: {},
    /**
     * 获取歌曲列表
     * @type {Array}
     */
    songList: [],
    /**
     * 新歌速递模块点击内容标题 对应type的数据
     * @type {Array}
     */
    switchNewSongList: [],
    /*
     * 获取分类歌单推荐信息
     * @type {Array}
     * */
    sortSongData: [],
    /*
     * 获取新碟数据
     * @type {Object}
     * */
    newAlbum: {},
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
    digitalAlbumSongList: {},
    /*
     * 获取分类歌单导航
     * @type {Array}
     * */
    categoryNavigation: [],
    /*
     * 获取个性电台歌曲列表
     * @type {Object}
     * */
    personalFeaturedRadio: {},
    /*
     * 获取普通电台歌曲列表
     * @type {Object}
     * */
    ordinaryFeaturedRadio: {}
};

let actions = {
    /**
     * 获取主页请求信息
     * @param {Function} commit
     */
    async getHomeMessage({commit}) {
        let res = await getHomeMessage();
        if (res.code === ERR_OK) {
            // 获取主页轮播图
            commit(types.SET_HOME_SLIDER, {homeSlider: res.focus.data.content});
            // 获取主页热门推荐导航
            commit(types.SET_HOME_RECOMMEND, {homeRecommend: res.recomPlaylist.data.v_hot || []});
            // 获取主页新歌导航
            commit(types.SET_HOME_NEW_SONG_SPEED, {homeNewSongSpeed: createHomeNewSongSpeed(res.new_song.data.song_list.slice(0, 1), res.new_album.data.album_list.slice(0, 1))});
            // 新歌速递 - 新歌模块数据
            saveInitNewSongList(res.new_song.data);
        }
        else {
            // 错误处理
        }
    },
    /**
     * 点击换一批刷新歌单推荐数据
     * @param {Function} commit
     */
    async getReplaceHomeRecomPlaylist({commit}, param) {
        let res = await getReplaceHomeRecomPlaylist(param);
        if (res.code === ERR_OK) {
            if (!res.playlist.data.v_playlist.length) {
                return;
            }
            // 获取主页热门推荐导航
            commit(types.SET_HOME_RECOMMEND, {homeRecommend: createReplaceHomeRecomPlaylist(res.playlist.data.v_playlist) || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取精选电台导航
     * @param {Function} commit
     */
    async getHomeFeaturedRadio({commit}) {
        let res = await getHomeFeaturedRadio();
        if (res.code === ERR_OK) {
            // 获取主页精选电台导航
            commit(types.SET_HOME_FEATERED_RADIO, {homeFeaturedRadio: res.data.data.groupList[0].radioList.slice(1, 4) || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取歌单专辑信息
     * @param {Function} commit
     */
    async getSongAlbumMessage({commit}, songBegin) {
        // 获取歌单dssid
        let dissid = getSongSingle().contentId || getSongSingle().dissid;

        let mid = getSongSingle().mid;

        // 判断如果是从新碟模块进入就请求新碟歌曲接口
        if (getSongSingle().start === 'newAlbum') {
            let res = await getNewAlbumSongList(mid);
            if (res.code === ERR_OK) {
                sliceSonglist = sliceSonglist.concat(res.data.list);
                // 获取歌曲播放MP4地址
                actions.getSongListPlayingUrl({commit}, sliceSonglist);

                let message = {};
                // 简介
                message.desc = '简介:' + res.data.desc;
                // 专辑头像
                message.authorAvatar = res.data.company_new.headPic;
                // 专辑的小头像
                message.smallAvatar = null;
                // 播放量
                message.playNumber = null;
                // 歌曲列表总数
                message.totalSongNum = res.data.total_song_num;
                // 发布人
                message.nickname = res.data.company;

                // 设置歌单专辑信息
                commit(types.SET_SONG_ALBUM_MESSAGE, message);
            }
        }
        else {
            let res = await getSongAlbumMessage(dissid, songBegin);
            if (res.code === ERR_OK) {
                sliceSonglist = sliceSonglist.concat(res.cdlist[0].songlist);
                // 获取歌曲播放MP4地址
                actions.getSongListPlayingUrl({commit}, sliceSonglist);

                let message = {};
                // 简介
                message.desc = '简介:' + res.cdlist[0].desc;
                // 专辑头像
                message.authorAvatar = res.cdlist[0].headurl;
                // 专辑的小头像
                message.smallAvatar = res.cdlist[0].ifpicurl;
                // 播放量
                message.playNumber = computedPlayNumber(res.cdlist[0].visitnum);
                // 歌曲列表总数
                message.totalSongNum = res.cdlist[0].total_song_num;
                // 发布人
                message.nickname = res.cdlist[0].nickname;

                // 设置歌单专辑信息
                commit(types.SET_SONG_ALBUM_MESSAGE, message);
            }
            else {
                // 错误处理
            }
        }
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
     * 获取新碟数据
     * @param {Function} commit
     */
    async getNewAlbum({commit}, param) {
        let res = await getNewAlbum(param);
        if (res.code === ERR_OK) {
            // 获取数字专辑歌曲列表数据
            commit(types.SET_NEW_ALBUM, {newAlbum: res.albumlib.data || []});
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
     * 获取数字专辑歌曲列表
     * @param {Function} commit
     */
    async getDigitalAlbumSongList({commit}, id) {
        let res = await getDigitalAlbumSongList(id);
        if (res.code === ERR_OK) {
            // 获取数字专辑歌曲列表数据
            commit(types.SET_DIGITAL_ALBUM_SONG_LIST, {digitalAlbumSongList: res.data || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取分类歌单导航信息
     * @param {Function} commit
     */
    async getCategoryNavigation({commit}) {
        let res = await getCategoryNavigation();
        if (res.code === ERR_OK) {
            commit(types.SET_CATEGORY_NAVIGATION, res.data.categories);
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
        let res = await getSortSongData(param);
        if (res.code === ERR_OK) {
            // 获取分类歌单歌曲信息
            commit(types.SET_SORT_SONG_DATA, res.data);
        }
        else {
            // 错误处理
        }
    },
    /**
     * 个性电台歌曲接口
     * @param {Function} commit
     */
    async getPersonalFeaturedRadio({commit}) {
        let res = await getPersonalFeaturedRadio();
        if (res.code === ERR_OK) {
            // 获取个性电台歌曲列表
            commit(types.SET_PERSONAL_FEATURED_RADIO_SONG_LIST, {personalFeaturedRadio: normalizeSongList(res.songlist) || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 普通电台歌曲接口
     * @param {Function} commit
     */
    async getOrdinaryFeaturedRadio({commit}, param) {
        let res = await getOrdinaryFeaturedRadio(param);
        if (res.code === ERR_OK) {
            // 获取精选电台歌曲列表
            commit(types.SET_ORDINARY_FEATURED_RADIO_SONG_LIST, {ordinaryFeaturedRadio: normalizeSongList(res.songlist.data.track_list) || []});
        }
        else {
            // 错误处理
        }
    },
    /**
     * 获取歌曲列表播放地址
     * @param {Function} commit
     */
    getSongListPlayingUrl({commit}, param) {
        getSongListPlayingUrl(param).then((res) => {
            if (res.code === ERR_OK) {
                // 设置歌曲列表
                commit(types.SET_SONG_LIST, normalizeSongList(param, res.url_mid.data));
            }
        });
    },
    // 设置歌曲列表
    songList({commit}, songList) {
        // 设置歌曲列表
        commit(types.SET_SONG_LIST, songList);
    },
    // 设置分类歌单歌曲信息
    sortSongData({commit}, sortSongData) {
        // 设置歌曲列表
        commit(types.SET_SORT_SONG_DATA, sortSongData);
    }
};

let mutations = {
    /*
     * 获取主页轮播图
     * @param {Array}
     * */
    [types.SET_HOME_SLIDER](state, {homeSlider}) {
        state.homeSlider = homeSlider;
    },
    /*
     * 获取主页热门推荐导航
     * @param {Array}
     * */
    [types.SET_HOME_RECOMMEND](state, {homeRecommend}) {
        state.homeRecommend = homeRecommend;
    },
    /*
     * 获取主页热门推荐导航
     * @param {Array}
     * */
    [types.SET_HOME_NEW_SONG_SPEED](state, {homeNewSongSpeed}) {
        state.homeNewSongSpeed = homeNewSongSpeed;
    },
    /*
     * 获取精选电台导航
     * @param {Array}
     * */
    [types.SET_HOME_FEATERED_RADIO](state, {homeFeaturedRadio}) {
        state.homeFeaturedRadio = homeFeaturedRadio;
    },
    /*
     * 获取歌单专辑信息
     * @param {Array}
     * */
    [types.SET_SONG_ALBUM_MESSAGE](state, songAlbumMessage) {
        state.songAlbumMessage = songAlbumMessage;
    },
    /*
     * 获取歌曲列表
     * @param {Array}
     * */
    [types.SET_SONG_LIST](state, songList) {
        state.songList = songList;
    },
    /*
     * 获取新歌速递模块点击内容标题 对应type的数据
     * @param {Object}
     * */
    [types.SET_SWITCH_NEW_SONG_LIST_TITLE](state, {switchNewSongList}) {
        state.switchNewSongList = switchNewSongList;
    },
    /*
     * 获取新碟数据
     * @param {Object}
     * */
    [types.SET_NEW_ALBUM](state, {newAlbum}) {
        state.newAlbum = newAlbum;
    },
    /*
     * 获取全部数字专辑数据 音乐数字专辑相册
     * @param {Object}
     * */
    [types.SET_MUSIC_DIGITAL_ALBUM](state, {musicDigitalAlbum}) {
        state.musicDigitalAlbum = musicDigitalAlbum;
    },
    /*
     * 更多数字专辑数据
     * @param {Object}
     * */
    [types.SET_DIGITAL_MORE_ALBUM](state, {moreDigitalAlbum}) {
        state.moreDigitalAlbum = moreDigitalAlbum;
    },
    /*
     * 获取数字专辑歌曲列表数据
     * @param {Object}
     * */
    [types.SET_DIGITAL_ALBUM_SONG_LIST](state, {digitalAlbumSongList}) {
        state.digitalAlbumSongList = digitalAlbumSongList;
    },
    /*
     * 获取分类歌单导航信息
     * @param {Array}
     * */
    [types.SET_CATEGORY_NAVIGATION](state, categoryNavigation) {
        state.categoryNavigation = categoryNavigation;
    },
    /*
     * 获取分类歌单歌曲信息
     * @param {Array}
     * */
    [types.SET_SORT_SONG_DATA](state, sortSongData) {
        state.sortSongData = sortSongData;
    },
    // 获取个性电台歌曲列表
    [types.SET_PERSONAL_FEATURED_RADIO_SONG_LIST](state, {personalFeaturedRadio}) {
        state.personalFeaturedRadio = personalFeaturedRadio;
    },
    // 普通个性电台歌曲列表
    [types.SET_ORDINARY_FEATURED_RADIO_SONG_LIST](state, {ordinaryFeaturedRadio}) {
        state.ordinaryFeaturedRadio = ordinaryFeaturedRadio;
    }
};

let getters = {
    switchNewSongList() {
        return state.switchNewSongList;
    },
    songList() {
        return state.songList;
    }
};

export default {
    namespaced: true,
    actions,
    mutations,
    getters,
    state
};
