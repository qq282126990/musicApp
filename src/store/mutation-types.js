/**
 * @file app shell mutation types
 * @author jianzhongmin(282126990@qq.com)
 */

export const ENABLE_PAGE_TRANSITION = 'ENABLE_PAGE_TRANSITION';
export const DISABLE_PAGE_TRANSITION = 'DISABLE_PAGE_TRANSITION';
export const SET_PAGE_SWITCHING = 'SET_PAGE_SWITCHING';
export const SET_PAGE_TRANSITION_NAME = 'SET_PAGE_TRANSITION_NAME';
export const SET_APP_HEADER = 'SET_APP_HEADER';
export const SET_APP_BOTTOM_NAV = 'SET_APP_BOTTOM_NAV';
export const ACTIVATE_APP_BOTTOM_NAV = 'ACTIVATE_APP_BOTTOM_NAV';
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';
export const SAVE_SCROLLTOP = 'SAVE_SCROLLTOP';

export const SET_HOME_SONG_LIST = 'SET_HOME_SONG_LIST';  // 歌曲列表数据
export const SET_SLIDER = 'SET_SLIDER'; // 轮播图数据
export const SET_DIGITAL_ALBUM = 'SET_DIGITAL_ALBUM'; // 数字专辑数据
export const SET_FEATERED_RADIO = 'SET_FEATERED_RADIO'; // 精选电台数据
export const SET_RECOMMEND = 'SET_RECOMMEND'; // 精选电台数据

export const SET_MASKLAYER = 'SET_MASKLAYER'; // 设置遮罩层显示隐藏
export const SET_SONG_BEGIN = 'SET_SONG_BEGIN'; // 歌曲列表接口一次请求的页数 一次 +15

// 滚动组件状态
export const SET_PROBETYPE = 'SET_PROBETYPE'; // 分发点击事件
export const SET_CLICK = 'SET_CLICK'; // 分发点击事件
export const SET_DATA = 'SET_DATA'; // 外部传入的数据
export const SET_LISTEN_SCROLL = 'SET_LISTEN_SCROLL'; // scroll 要不要监听滚动事件
export const SET_PULLUP = 'SET_PULLUP'; // 是否开启滚动到到底部刷新
export const SET_BEFORE_SCROLL = 'SET_BEFORE_SCROLL'; // 是否开启滚动
export const SET_REFRESH_DELAY = 'SET_REFRESH_DELAY'; // 刷新延迟
export const SET_BOUNCE = 'SET_BOUNCE'; // 是否开启回弹效果
export const SET_BOUNCE_TIME = 'SET_BOUNCE_TIME'; // 回弹时间

// 歌曲列表状态
export const SET_SONG_LIST_MESSAGE = 'SET_SONG_LIST_MESSAGE'; // 获取歌曲列表信息
export const SET_SONG_LIST = 'SET_SONG_LIST'; // 获取歌曲列表
