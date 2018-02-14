import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
// 计算播放量方法 computedPlayNumber
import {computedPlayNumber} from 'common/js/util';
// 自定义首页新歌速递导航数据
import {createHomeNewSongSpeed} from 'common/js/homeNewSongSpeed';
// 获取主页选择对应歌单的数据
import {getSongSingle} from 'common/js/cache';
// 请求主页数据 getHomeMessage  主页精选电台导航 getHomeFeaturedRadio
import {getHomeMessage, getHomeFeaturedRadio} from 'api/homeAjax';
// 获取歌单专辑信息 getSongAlbumMessage
import {getSongAlbumMessage} from 'api/songAlbumMessage';
// 获取歌曲列表播放MP4地址方法
import {getSongListPlayingUrl} from 'api/songListPlayUrl';
// 对歌曲列表数据做处理
import {normalizeSongList} from 'common/js/songList';

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
    songList: []
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

        let res = await getSongAlbumMessage(dissid, songBegin);
        if (res.code === ERR_OK) {
            // 获取歌曲播放MP4地址
            actions.getSongListPlayingUrl({commit}, res.cdlist[0].songlist);

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
    },
    /**
     * 获取歌曲列表播放地址
     * @param {Function} commit
     */
    getSongListPlayingUrl({commit}, param) {
        getSongListPlayingUrl(param).then((res) => {
            if (res.code === ERR_OK) {
                console.log(normalizeSongList(param, res.url_mid.data));
                // 设置歌曲列表
                commit(types.SET_SONG_LIST, normalizeSongList(param, res.url_mid.data));
            }
        });
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
    }
};

let getters = {};

export default {
    namespaced: true,
    actions,
    mutations,
    getters,
    state
};
