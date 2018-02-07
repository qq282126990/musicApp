// import {getLyric} from 'api/songPlayingUrl';
// import {ERR_OK} from 'api/config';
// // 用base64解析歌词数据
// import {Base64} from 'js-base64';

// 自定义定义歌曲信息
export default class Song {
    constructor({id, mid, strMediaMid, singer, name, album, duration, image, url, spare}) {
        this.id = id;
        this.mid = mid;
        this.strMediaMid = strMediaMid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
        this.spare = spare;
    };

    // // 获取歌曲歌词
    // getLyric() {
    //     if (this.lyric) {
    //         return Promise.resolve(this.lyric);
    //     }
    //
    //     return new Promise((resolve, reject) => {
    //         getLyric(this.mid).then((res) => {
    //             if (res.retcode === ERR_OK) {
    //                 this.lyric = Base64.decode(res.lyric);
    //                 resolve(this.lyric);
    //             }
    //             else {
    //                 const error = 'no lyric';
    //                 reject(error);
    //             }
    //         });
    //     });
    // }
};

// 创建歌曲列表
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        strMediaMid: musicData.strMediaMid,
        // 歌手名称
        singer: filterSinger(musicData.singer),
        // 歌名
        name: musicData.songname,
        // 专辑名称
        album: musicData.albumname,
        // 播放时间
        duration: musicData.interval,
        // 专辑图片
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // 音乐链接
        // url: `http://dl.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`
        // url: `http://dl.stream.qqmusic.qq.com/${playingUrl.midurlinfo[index].purl}` || ''
        url: `http://isure.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`,
        // 第4个备用接口
        spare: `http://dl.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`
    });
};

/*
* musicData.singer是一个数组  过滤出singer的name
* @type {String}
* */
export function filterSinger(singer) {
    let ret = [];

    if (!singer) {
        return '';
    }

    singer.forEach((s) => {
        ret.push(s.name);
    });

    return ret.join('/');
};


/**
 * 对list数据做处理
 * @type {Array}  list
 */
export function normalizeSongs(list, playingUrl) {
    let ret = [];

    list.forEach((musicData, index) => {
        if (musicData) {
            ret.push(createSong(musicData, playingUrl, index));
        }
    });

    return ret;
}

/************************************************/
// 新歌模块显示的数据
class NewSong {
    constructor({id, mid, strMediaMid, singer, name, album, duration, image, url}) {
        this.id = id;
        this.mid = mid;
        this.strMediaMid = strMediaMid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    };
}

// 创建新歌模块歌曲列表
export function createNewSong(musicData) {
    return new NewSong({
        id: musicData.id,
        mid: musicData.mid,
        strMediaMid: musicData.mid,
        // 歌手名称
        singer: filterSinger(musicData.singer),
        // 歌名
        name: musicData.title,
        // 专辑名称
        album: musicData.album.name,
        // 播放时间
        duration: musicData.interval,
        // 专辑图片
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
        // 音乐链接
        url: `http://dl.stream.qqmusic.qq.com/C100${musicData.file.media_mid}.m4a`
    });
};

/**
 * 对新歌list数据做处理
 * @type {Array}  list
 */
export function normalizeNewSongs(list, playingUrl) {
    let ret = [];

    list.forEach((musicData, index) => {
        if (musicData) {
            ret.push(createNewSong(musicData, playingUrl, index));
        }
    });

    return ret;
}
