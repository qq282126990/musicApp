/**
 * @file store index
 * @author jianzhongmin(282126990@qq.com)
 */

import Vue from 'vue';
import Vuex from 'vuex';
import appShell from './modules/app-shell';
import appStore from './modules/app-store';
import asyncAjax from './modules/async-ajax';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        appShell,
        appStore,
        asyncAjax
    }
});
