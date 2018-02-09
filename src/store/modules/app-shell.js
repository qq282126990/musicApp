/**
 * @file app shell store
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import * as types from '../mutation-types';

let state = {

    /**
     * 是否需要页面切换动画
     *
     * @type {boolean}
     */
    needPageTransition: true,

    /**
     * 多个页面是否处于切换中
     *
     * @type {boolean}
     */
    isPageSwitching: false,

    /**
     * 多个页面切换效果名称
     *
     * @type {string}
     */
    pageTransitionName: '',

    /**
     * 上个页面 scroll 的信息
     *
     * @type {Object}
     */
    historyPageScrollTop: {}
};

let actions = {

    /**
     * 开启页面切换动画
     *
     * @param {Function} commit commit
     */
    enablePageTransition({commit}) {
        commit(types.ENABLE_PAGE_TRANSITION, true);
    },

    /**
     * 关闭页面切换动画
     *
     * @param {Function} commit commit
     */
    disablePageTransition({commit}) {
        commit(types.DISABLE_PAGE_TRANSITION, false);
    },

    /**
     * 设置页面是否处于切换中
     *
     * @param {Function} commit commit
     * @param {boolean} isPageSwitching isPageSwitching
     */
    setPageSwitching({commit}, isPageSwitching) {
        commit(types.SET_PAGE_SWITCHING, isPageSwitching);
    },

    /**
     * 保存页面 scroll 高度
     *
     * @param {[type]} options.commit [description]
     * @param {string} options.path path
     * @param {number} options.scrollTop scrollTop
     */
    saveScrollTop({commit}, {path, scrollTop}) {
        commit(types.SAVE_SCROLLTOP, {path, scrollTop});
    }
};

let mutations = {
    [types.SET_PAGE_SWITCHING](state, isPageSwitching) {
        state.isPageSwitching = isPageSwitching;
    },
    [types.SET_PAGE_TRANSITION_NAME](state, {pageTransitionName}) {
        state.pageTransitionName = pageTransitionName;
    },
    [types.SAVE_SCROLLTOP](state, {path, scrollTop}) {
        state.historyPageScrollTop[path] = scrollTop;
    }
};

export default {
    namespaced: true,
    /* eslint-disable */
    actions,
    mutations,
    state,
    /* eslint-enable */
    modules: {

        /**
         * 顶部导航栏的数据
         *
         * @type {Object}
         */
        appHeader: {
            namespaced: true,
            state: {

                /**
                 * 是否展示顶部导航栏
                 *
                 * @type {boolean}
                 */
                show: true,

                /**
                 * 标题内容
                 *
                 * @type {string}
                 */
                title: 'Lavas',

                /**
                 * logo图标名称
                 *
                 * @type {string}
                 */
                logoIcon: '',

                /**
                 * 是否展示左侧菜单图标
                 *
                 * @type {boolean}
                 */
                showMenu: true,

                /**
                 * 是否展示左侧返回图标
                 *
                 * @type {boolean}
                 */
                showBack: false,

                /**
                 * 是否展示左侧logo
                 *
                 * @type {boolean}
                 */
                showLogo: true,

                /**
                 * 右侧操作按钮数组
                 *
                 * @type {Array}
                 */
                actions: []
            },
            actions: {

                /**
                 * 设置顶部导航条
                 *
                 * @param {Function} commit commit
                 * @param {Object} appHeader appHeader
                 */
                setAppHeader({commit}, appHeader) {
                    commit(types.SET_APP_HEADER, appHeader);
                }
            },
            mutations: {
                [types.SET_APP_HEADER](state, appHeader) {
                    state.appHeader = Object.assign(state, appHeader);
                }
            }
        },

        /**
         * 左侧侧边栏的数据
         *
         * @type {Object}
         */
        appSidebar: {
            namespaced: true,
            state: {
                show: false, // 是否显示sidebar
                slideFrom: 'left', // 划出的方向

                // 头部条的相关配置
                title: {
                    imageLeft: '',
                    altLeft: '',
                    svgLeft: '',
                    iconLeft: 'home',
                    text: 'Home',
                    imageRight: '',
                    altRight: '',
                    svgRight: '',
                    iconRight: ''
                },

                // 最大宽度，可以是百分比，也可以以px为单位
                width: 0.75,

                // 滑动距离展示阈值
                showWidthThreshold: 0.25,

                // 分块组
                blocks: [
                    {
                        // 子列表1
                        sublistTitle: 'Sublist1',
                        list: [
                            {
                                text: 'Detail Page 1',
                                icon: 'sentiment_satisfied',
                                route: '/detail/1'
                            },
                            {
                                text: 'Detail Page 2',
                                image: 'https://github.com/google/material-design-icons/blob/master/social/2x_web/ic_mood_bad_black_48dp.png?raw=true',
                                alt: 'mood-bad',
                                route: '/detail/2'
                            },
                            {
                                text: 'Detail Page 3',
                                svg: 'svg-sentiment-very-satisfied',
                                route: '/detail/3'
                            }
                        ]
                    }
                ]
            },
            actions: {

                /**
                 * 展示侧边栏
                 *
                 * @param {Function} commit commit
                 */
                showSidebar({commit}) {
                    commit(types.SET_SIDEBAR_VISIBILITY, true);
                },

                /**
                 * 隐藏侧边栏
                 *
                 * @param {Function} commit commit
                 */
                hideSidebar({commit}) {
                    commit(types.SET_SIDEBAR_VISIBILITY, false);
                }
            },
            mutations: {
                [types.SET_SIDEBAR_VISIBILITY](state, sidebarVisibility) {
                    state.show = sidebarVisibility;
                }
            }
        },

        /**
         * app shell 底部导航栏的数据
         *
         * @type {Object}
         */
        appBottomNavigator: {
            namespaced: true,
            state: {

                /**
                 * 是否展示底部导航栏
                 *
                 * @type {boolean}
                 */
                show: true,

                /**
                 * 导航按钮列表
                 *
                 * @type {Array.<Object>}
                 */
                navs: [
                    {
                        // 按钮的名字
                        name: 'home',

                        // 显示的 icon
                        icon: 'home',

                        // 显示的文字
                        text: '主页',

                        // 是否是当前激活的
                        active: true,

                        // 路由
                        route: '/home'
                    },
                    {
                        // 按钮的名字
                        name: 'user',

                        // 显示的 icon
                        icon: 'person',

                        // 显示的文字
                        text: '个人中心',

                        // 路由信息
                        route: '/home/user'
                    }
                ]
            },
            actions: {

                /**
                 * 隐藏底部导航
                 *
                 * @param {Function} commit commit
                 */
                hideBottomNav({commit}) {
                    commit(types.SET_APP_BOTTOM_NAV, {show: false});
                },

                /**
                 * 显示底部导航
                 *
                 * @param {Function} commit commit
                 */
                showBottomNav({commit}) {
                    commit(types.SET_APP_BOTTOM_NAV, {show: true});
                },

                /**
                 * 激活底部导航
                 *
                 * @param {Function} commit commit
                 * @param {string} name name
                 */
                activateBottomNav({commit}, name) {
                    commit(types.ACTIVATE_APP_BOTTOM_NAV, name);
                }
            },
            mutations: {
                [types.ACTIVATE_APP_BOTTOM_NAV](state, name) {
                    state.navs = state.navs.map(nav => {
                        if (nav.name === name) {
                            nav.active = true;
                        }
                        else {
                            nav.active = false;
                        }
                        return nav;
                    });
                },
                [types.SET_APP_BOTTOM_NAV](state, appBottomNavigator) {
                    state = Object.assign(state, appBottomNavigator);
                }
            }
        }
    }
};
