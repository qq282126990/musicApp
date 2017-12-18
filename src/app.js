import Vue from 'vue';

import {createRouter} from './router';
import store from './store';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';
// import Icon from 'vue-awesome/components/Icon.vue';

import './common/font/iconfont.scss';

// Vue.component('icon', Icon);

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
    loading: require('common/image/default.jpg')
});

/* eslint-disable no-new */
export function createApp() {
    let router = createRouter();
    let app = new Vue({
        router,
        store,
        ...App
    });
    return {app, router, store};
}
