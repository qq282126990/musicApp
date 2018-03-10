// 自定义定义歌曲信息
export default class SongList {
    constructor ({id, mid, strMediaMid, singer, name, album, duration, image, url, spare,download, downloadSpare, vid, isonly}) {
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
        this.vid = vid;
        this.isonly = isonly
        this.download = download
        this.downloadSpare = downloadSpare
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
            image: ``,
            // 音乐链接
            // url: `http://dl.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`
            // url: `http://dl.stream.qqmusic.qq.com/${playingUrl.midurlinfo[index].purl}` || ''
            url: ``,
            // 第4个备用接口
            spare: ``,
            // 下载地址
            download: ``,
            // 下载备用地址
            downloadSpare: ``,
            // MV id
            vid: musicData.mv.vid,
            // 是否是独家
            isonly: musicData.isonly
        });
    }
    else if (musicData.strMediaMid) {
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
            url: ``,
            // 第4个备用接口
            spare: ``,
            // 下载地址
            download: ``,
            // 下载备用地址
            downloadSpare: ``,
            // MV id
            vid: musicData.vid,
            // 是否是独家
            isonly: musicData.isonly
        });
    }
    else {
        return new SongList({
            id: musicData.songid,
            mid: musicData.songmid,
            strMediaMid: musicData.songmid,
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
            url: ``,
            // 第4个备用接口
            spare: ``,
            // 下载地址
            download: ``,
            // 下载备用地址
            downloadSpare: ``,
            // 是否是独家
            isonly: musicData.isonly
        });
    }
};

// 创建排行榜歌曲列表
export function createRankSongList (musicData) {
        return new SongList({
            id: musicData.songid,
            mid: musicData.songmid,
            strMediaMid: musicData.songmid,
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
            url: ``,
            // 第4个备用接口
            spare:``,
            // 下载地址
            download: ``,
            // 下载备用地址
            downloadSpare: ``,
            // MV id
            vid: musicData.vid,
            // 是否是独家
            isonly: musicData.isonly
        });
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


/**
 * 对排行榜数据做处理
 * @type {Array}  list
 */
export function normalizeRankSongList (list, playingUrl) {
    let ret = [];

    list.forEach((item, index) => {
        // 保存item.data
        const musicData = item.data;
        // 数据中有id和名字才返回
        if (musicData.songid && musicData.albummid) {
            ret.push(createRankSongList(musicData, playingUrl, index));
        }
    });

    return ret;
}

/**
 * 对歌手歌曲数据做处理
 * @type {Array}  list
 */
export function normalizeSingerSongList (list, playingUrl) {
    let ret = [];

    list.forEach((item, index) => {
        let {musicData} = item;

        // 数据中有id和名字才返回
        if (musicData.songid && musicData.albummid) {
            ret.push(createSongList(musicData, playingUrl, index));
        }
    });

    return ret;
}
