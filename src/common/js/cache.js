import storage from 'good-storage';

// key
const SONG_SINGLE_KEY = '__songsingle__';

// 保存主页选择对应歌单的数据到本地
export function saveSongSingle (currentSong) {
    return storage.set(SONG_SINGLE_KEY, currentSong);;
}

// 获取主页选择对应歌单的数据
export function getSongSingle () {
    return storage.get(SONG_SINGLE_KEY, []);
}
