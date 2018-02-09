/**
 * @file 页面骨架
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import Vue from 'vue';
import Skeleton from './Home.skeleton.vue';

export default new Vue({
    components: {
        Skeleton
    },
    template: '<skeleton />'
});
