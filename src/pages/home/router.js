/**
 * @file home router
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import Home from '@/pages/home/Home.vue';
import User from '@/pages/home/User.vue';

export default {
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/home/user',
            name: 'user',
            component: User
        }
    ]
};
