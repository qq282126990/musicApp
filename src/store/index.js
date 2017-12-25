/**
 * @file store index
 * @author jianzhongmin(282126990@qq.com)
 */

import Vue from 'vue';
import Vuex from 'vuex';
import appShell from './modules/app-shell';
import appStore from './modules/app-store';
import home from './modules/home';

import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

// 开启控制台警报
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        appShell,
        appStore,
        home,
        strict: debug,
        plugins: debug ? [createLogger()] : []
    }
});
