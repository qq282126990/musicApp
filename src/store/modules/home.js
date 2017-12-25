/**
 * @file app shell store
 * @author jianzhongmin(282126990@qq.com)
 */

import * as types from '../mutation-types';
import {ERR_OK} from 'api/config';
import {getSlider} from 'api/musician';

let state = {

    /**
     * 上个页面 scroll 的信息
     *
     * @type {Object}
     */
    slider: []
};

let actions = {

    /**
     * 获取轮播图
     *
     * @param {[type]} options.commit [description]
     */
    async getSlider({commit}) {
        let res = await getSlider();
        if (res.code === ERR_OK) {
            commit(types.SET_SLIDER, {slider: res.data.slider || []});
        }
        else {
            // 错误处理
        }
    }
};

let mutations = {
    [types.SET_SLIDER](state, {slider}) {
        state.slider = slider;
    }
};

export default {
    namespaced: true,
    actions,
    mutations,
    state
};
