import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
// 计算播放量方法 computedPlayNumber
import {computedPlayNumber} from 'common/js/util';
// 自定义首页新歌速递导航数据
import {createHomeNewSongSpeed} from 'common/js/homeNewSongSpeed';
// 获取主页选择对应歌单的数据 getSongSingle
// 保存一开始的新歌数据 saveInitNewSongList
import {getSongSingle, saveInitNewSongList} from 'common/js/cache';
// 请求主页数据 getHomeMessage  主页精选电台导航 getHomeFeaturedRadio
import {getHomeMessage, getHomeFeaturedRadio} from 'api/homeAjax';
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
import {getSwitchNewSongList, getNewAlbum, getNewAlbumSongList, getTotalDigitalAlbum, getMoreAlbumList, getDigitalAlbumSongList} from 'api/newSongSpeed';

// 拼接歌单专辑歌曲列表
let sliceSonglist = []

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
    digitalAlbumSongList: {}
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
            commit(types.SET_HOME_RECOMMEND, {homeRecommend: res.recomPlaylist.data.v_hot.slice(0, 6) || []});
            // 获取主页新歌导航
            commit(types.SET_HOME_NEW_SONG_SPEED, {homeNewSongSpeed: createHomeNewSongSpeed(res.new_song.data.song_list.slice(0, 3)) || []});
            // 新歌速递 - 新歌模块数据
            saveInitNewSongList(res.new_song.data);
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
            commit(types.SET_HOME_FEATERED_RADIO, {homeFeaturedRadio: res.data.data.groupList[0].radioList.slice(0, 3) || []});
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
    // 获取新歌速递模块点击内容标题 对应type的数据
    [types.SET_SWITCH_NEW_SONG_LIST_TITLE](state, {switchNewSongList}) {
        state.switchNewSongList = switchNewSongList;
    },
    // 获取新碟数据
    [types.SET_NEW_ALBUM](state, {newAlbum}) {
        state.newAlbum = newAlbum;
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
    [types.SET_DIGITAL_ALBUM_SONG_LIST](state, {digitalAlbumSongList}) {
        state.digitalAlbumSongList = digitalAlbumSongList;
    }
};

let getters = {
    switchNewSongList() {
        return state.switchNewSongList;
    },
    songList () {
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
