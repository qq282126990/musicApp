// 自定义定义歌曲信息
export default class SongList {
    constructor ({id, mid, strMediaMid, singer, name, album, duration, image, url, spare}) {
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
};

// 创建歌曲列表
export function createSongList (musicData) {
    if (musicData.album) {
        return new SongList({
            id: musicData.id,
            mid: musicData.mid,
            strMediaMid: musicData.mid,
            // 歌手名称
            singer: filterSinger(musicData.singer),
            // 歌名
            name: musicData.name,
            // 专辑名称
            album: musicData.album.name,
            // 播放时间
            duration: musicData.interval,
            // 专辑图片
            image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
            // 音乐链接
            // url: `http://dl.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`
            // url: `http://dl.stream.qqmusic.qq.com/${playingUrl.midurlinfo[index].purl}` || ''
            url: `http://isure.stream.qqmusic.qq.com/C100${musicData.mid}.m4a`,
            // 第4个备用接口
            spare: `http://dl.stream.qqmusic.qq.com/C100${musicData.mid}.m4a`
        });
    }
    else {
        return new SongList({
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
    }
};

/*
 * musicData.singer是一个数组  过滤出singer的name
 * @type {String}
 * */
export function filterSinger (singer) {
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
export function normalizeSongList (list, playingUrl) {
    let ret = [];

    list.forEach((musicData, index) => {
        if (musicData) {
            ret.push(createSongList(musicData, playingUrl, index));
        }
    });

    return ret;
}
