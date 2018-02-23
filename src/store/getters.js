/** 映射 **/
// 保存当前播放的歌曲信息 saveCurrentSong
// 获取当前播放的歌曲信息 getCurrentSong
import {saveCurrentSong, getCurrentSong} from 'common/js/cache'

/** 播放组件状态 **/
// 歌曲列表
export const songList = state => state.songList;
// 顺序播放列表
export const sequenceList = state => state.sequenceList;
// 控制歌曲播放
export const playing = state => state.playing;
// 播放列表
export const playList = state => state.playList;
// 控制歌曲播放模式
export const playMode = state => state.playMode;
// 当前播放索引
export const currentIndex = state => state.currentIndex;
// 获取当前歌曲
export const currentSong = (state) => {
    // 保存当前播放的歌曲信息
    saveCurrentSong(state.playList[state.currentIndex] || {});
    return getCurrentSong();
};
// 获取收藏列表
export const favoriteList = state => state.favoriteList;
// 控制播发器放大缩小
export const fullScreen = state => state.fullScreen;
/***************/
