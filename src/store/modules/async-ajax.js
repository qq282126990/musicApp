import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
// 请求主页数据
import {getHomeMessage} from 'api/homeAjax';


let state = {
    /*
    * 主页轮播图
    * @type {Array}
    * */
    homeSlider: [],
};

let actions = {
    /**
     * 获取主页信息
     * @param {Function} commit
     */
    async getHomeMessage({commit}) {
        let res = await getHomeMessage();
        if (res.code === ERR_OK) {
            console.log(res.focus.data.content);
            // 新歌速递---新歌模块数据
            commit(types.SET_HOME_SLIDER, {homeSlider: res.focus.data.content});
        }
        else {
            // 错误处理
        }
    }
};

let mutations = {
    // 获取主页轮播图
    [types.SET_HOME_SLIDER](state, {homeSlider}) {
        state.homeSlider = homeSlider;
    },
};

let getters = {};

export default {
    namespaced: true,
    actions,
    mutations,
    getters,
    state
};
