/**
 * @file app shell mutation types
 * @author jianzhongmin(282126990@qq.com)
 */

export const ENABLE_PAGE_TRANSITION = 'ENABLE_PAGE_TRANSITION';
export const DISABLE_PAGE_TRANSITION = 'DISABLE_PAGE_TRANSITION';
export const SET_PAGE_SWITCHING = 'SET_PAGE_SWITCHING';
export const SET_PAGE_TRANSITION_NAME = 'SET_PAGE_TRANSITION_NAME';
export const SET_APP_HEADER = 'SET_APP_HEADER';
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';
export const SAVE_SCROLLTOP = 'SAVE_SCROLLTOP';

// 滚动组件状态
export const SET_PROBETYPE = 'SET_PROBETYPE'; // 分发点击事件
export const SET_CLICK = 'SET_CLICK'; // 分发点击事件
export const SET_SCROLL_DATA = 'SET_SCROLL_DATA'; // 滚动组件外部传入的数据
export const SET_LISTEN_SCROLL = 'SET_LISTEN_SCROLL'; // scroll 要不要监听滚动事件
export const SET_PULLUP = 'SET_PULLUP'; // 是否开启滚动到到底部刷新
export const SET_BEFORE_SCROLL = 'SET_BEFORE_SCROLL'; // 是否开启滚动
export const SET_REFRESH_DELAY = 'SET_REFRESH_DELAY'; // 刷新延迟
export const SET_BOUNCE = 'SET_BOUNCE'; // 是否开启回弹效果
export const SET_BOUNCE_TIME = 'SET_BOUNCE_TIME'; // 回弹时间

// 主页状态
export const SET_HOME_SLIDER = 'SET_HOME_SLIDER'; // 获取主页轮播图
export const SET_HOME_RECOMMEND = 'SET_HOME_RECOMMEND'; // 获取主页热门推荐导航
export const SET_HOME_NEW_SONG_SPEED = 'SET_HOME_NEW_SONG_SPEED'; // 获取主页热门推荐导航
export const SET_HOME_FEATERED_RADIO = 'SET_HOME_FEATERED_RADIO'; // 获取主页精选电台导航
export const SET_SONG_ALBUM_MESSAGE = 'SET_SONG_ALBUM_MESSAGE'; // 获取歌单专辑信息

// 歌单页状态
export const SET_SONG_LIST = 'SET_SONG_LIST'; // 获取歌曲列表
