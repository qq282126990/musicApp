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
