/**
 * @file store index
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import Vue from 'vue';
import Vuex from 'vuex';
import appShell from './modules/app-shell';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        appShell
    }
});
