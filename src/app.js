import Vue from 'vue';
import {
    Vuetify,
    VBtn,
    VList,
    VIcon,
    VProgressCircular
} from 'vuetify';
import {createRouter} from './router';
import store from './store';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';
import Icon from 'vue-awesome/components/Icon.vue';

import './common/font/iconfont.scss';

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole';

// 图标库
Vue.component('icon', Icon);
// ui组件库
Vue.use(Vuetify, {
    components: {
        VBtn,
        VList,
        VIcon,
        VProgressCircular
    }
});

Vue.config.productionTip = false;

// 懒加载图片
Vue.use(VueLazyload, {
    error: require('../static/img/default.jpg'),
    loading: require('../static/img/default.jpg')
});

// hack for global nextTick
function noop() {
}

window.MessageChannel = noop;
window.setImmediate = noop;

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
