/**
 * @file app shell store
 * @author jianzhongmin(282126990@qq.com)
 */

import * as types from '../mutation-types';

let state = {

    /**
     * 是否需要页面切换动画
     * @type {boolean}
     */
    needPageTransition: true,

    /**
     * 多个页面是否处于切换中
     * @type {boolean}
     */
    isPageSwitching: false,

    /**
     * 多个页面切换效果名称
     * @type {string}
     */
    pageTransitionName: '',

    /**
     * 上个页面 scroll 的信息
     * @type {Object}
     */
    historyPageScrollTop: {}
};

let actions = {

    /**
     * 开启页面切换动画
     * @param {Function} commit commit
     */
    enablePageTransition({commit}) {
        commit(types.ENABLE_PAGE_TRANSITION, true);
    },
    homeSonglist({commit}, homeSonglist) {
        commit(types.SET_HOME_SONG_LIST, homeSonglist);
    },
    /**
     * 关闭页面切换动画
     * @param {Function} commit commit
     */
    disablePageTransition({commit}) {
        commit(types.DISABLE_PAGE_TRANSITION, false);
    },

    /**
     * 设置页面是否处于切换中
     * @param {Function} commit commit
     * @param {boolean} isPageSwitching isPageSwitching
     */
    setPageSwitching({commit}, isPageSwitching) {
        commit(types.SET_PAGE_SWITCHING, isPageSwitching);
    },

    /**
     * 保存页面 scroll 高度
     * @param {[type]} options.commit [description]
     * @param {string} options.path path
     * @param {number} options.scrollTop scrollTop
     */
    saveScrollTop({commit}, {path, scrollTop}) {
        commit(types.SAVE_SCROLLTOP, {path, scrollTop});
    },
    /**
     * 设置动画名称
     */
    setPageTransitionName({commit}, {pageTransitionName}) {
        commit(types.SET_PAGE_TRANSITION_NAME, {pageTransitionName});
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
    },
    [types.DISABLE_PAGE_TRANSITION](state, flg) {
        state.needPageTransition = flg;
    },
    [types.ENABLE_PAGE_TRANSITION](state, flg) {
        state.needPageTransition = flg;
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
         * @type {Object}
         */
        appHeader: {
            namespaced: true,
            state: {

                /**
                 * 是否展示顶部导航栏
                 * @type {boolean}
                 */
                show: true,

                /**
                 * 标题内容
                 * @type {string}
                 */
                title: '',
                /**
                 * logo图标名称
                 * @type {string}
                 */
                logoIcon: '',

                /**
                 * 是否展示左侧菜单图标
                 * @type {boolean}
                 */
                showMenu: true,

                /**
                 * 是否展示左侧返回图标
                 * @type {boolean}
                 */
                showBack: false,

                /**
                 * 是否展示左侧logo
                 * @type {boolean}
                 */
                showLogo: true,

                /**
                 * 右侧操作按钮数组
                 * @type {Array}
                 */
                actions: []
            },
            actions: {

                /**
                 * 设置顶部导航条
                 * @param {Function} commit commit
                 * @param {Object} appHeader appHeader
                 */
                setAppHeader({commit}, appHeader) {
                    commit(types.SET_APP_HEADER, appHeader);
                }
            },
            mutations: {
                [types.SET_APP_HEADER](state, appHeader) {
                    state = Object.assign(state, appHeader);
                }
            }
        },

        /**
         * 左侧侧边栏的数据
         * @type {Object}
         */
        appSidebar: {
            namespaced: true,
            state: {
                show: false, // 是否显示sidebar

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

                // 分块组
                blocks: [
                    {
                        // 子列表1
                        sublistTitle: 'Sublist1',
                        list: [
                            {
                                text: 'Detail Page 1'
                            },
                            {
                                text: 'Detail Page 2'
                            },
                            {
                                text: 'Detail Page 3'
                            }
                        ]
                    }
                ]
            },
            actions: {

                /**
                 * 展示侧边栏
                 * @param {Function} commit commit
                 */
                showSidebar({commit}) {
                    commit(types.SET_SIDEBAR_VISIBILITY, true);
                },

                /**
                 * 隐藏侧边栏
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
        }
    }
};
