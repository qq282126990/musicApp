/**
 * 更改状态  同步操作
 */
import * as types from './mutation-types';

const mutations = {
    // state 获取当前状态设置的state  其他=参数
    [types.SET_HOME_SONG_LIST](state, homeSonglist) {
        state.homeSonglist = homeSonglist;
    }
};

export default mutations;
