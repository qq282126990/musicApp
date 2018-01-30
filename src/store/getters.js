/** 映射 **/

// 主页 选择的的歌曲列表
export const homeSonglist = state => state.homeSonglist;

// 设置遮罩层显示隐藏
export const maskLayer = state => state.maskLayer;

// 歌曲列表接口一次请求的页数 一次 +15
export const songBegin = state => state.songBegin;

// 歌曲列表信息
export const songListMessage = state => state.songListMessage;

// 歌曲列表
export const songList = state => state.songList;

/*********************/

/** 播放组件状态 **/
// 控制播发器放大缩小
export const fullScreen = state => state.fullScreen;

// 控制歌曲播放模式
export const playMode = state => state.playMode;

// 控制播放
export const playing = state => state.playing;

// 播放列表
export const playList = state => state.playList;

// 顺序播放列表
export const sequenceList = state => state.sequenceList;

// 当前播放索引
export const currentIndex = state => state.currentIndex;

// 当前歌曲
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {};
};

// 获取收藏列表
export const favoriteList = state => state.favoriteList;

/*********************/

/** 滚动组件状态 **/
// 滚动的状态
export const probeType = state => state.probeType;
// 分发点击事件
export const click = state => state.click;
// 外部传入的数据
export const data = state => state.data;
// croll 要不要监听滚动事件
export const listenScroll = state => state.listenScroll;
// 是否开启滚动到到底部刷新
export const pullup = state => state.pullup;
// 开始滚动
export const beforeScroll = state => state.beforeScroll;
// 刷新延迟
export const refreshDelay = state => state.refreshDelay;
// 是否开启回弹效果
export const bounce = state => state.bounce;
// 回弹时间
export const bounceTime = state => state.bounceTime;
/***************/

/** 新歌速递状态 **/
// 新歌速递模块数据
export const newSongList = state => state.newSongList;
// 新歌速递模块点击内容标题
export const newSongListTitle = state => state.newSongListTitle;
