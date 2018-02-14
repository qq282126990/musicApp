/**
 * @file router
 * @author jianzhongmin(282126990@qq.com)
 */

// 定义切割点，异步加载路由组
// 主页模块
let Home = () => import('@/pages/home/home.vue');
// 发现模块
let Find = () => import('./Find.vue');
// 我的模块
let My = () => import('./My.vue');

export default {
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/find',
            name: 'Find',
            component: Find
        },
        {
            path: '/my',
            name: 'My',
            component: My
        },
    ]
};
