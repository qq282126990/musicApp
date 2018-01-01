import Vue from 'vue';
import {
    Vuetify,
    VBtn,
    VList,
    VIcon
} from 'vuetify';
import {createRouter} from './router';
import store from './store';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';
import Icon from 'vue-awesome/components/Icon.vue';

import './common/font/iconfont.scss';

// 图标库
Vue.component('icon', Icon);
// ui组件库
Vue.use(Vuetify, {
    components: {
        VBtn,
        VList,
        VIcon
    }
});

Vue.config.productionTip = false;

// 懒加载图片
Vue.use(VueLazyload, {
    error: require('common/image/default.jpg'),
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
