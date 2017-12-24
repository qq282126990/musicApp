/** 异步更改 **/
import * as types from './mutation-types';

export const homeSonglist = function ({commit}, homeSonglist) {
    commit(types.SET_HOME_SONG_LIST, homeSonglist);
};
