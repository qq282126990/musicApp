/** 异步更改 **/
import * as types from './mutation-types';

/**
 * 主页 选择的的歌曲列表
 *
 * @param {Function} commit
 * @param {Object} homeSonglist
 */
export const homeSonglist = function ({commit}, homeSonglist) {
    commit(types.SET_HOME_SONG_LIST, homeSonglist);
};

/**
 * 设置遮罩层显示隐藏
 *
 * @param {Function} commit
 * @param {Boolean} maskLayer
 */
export const maskLayer = function ({commit}, maskLayer) {
    commit(types.SET_MASKLAYER, maskLayer);
};


/**
 * 歌曲列表接口一次请求的页数 一次 +15
 *
 * @param {Function} commit
 * @param {Number} songBegin
 */
export const songBegin = function ({commit}, songBegin) {
    commit(types.SET_SONG_BEGIN, songBegin);
};
