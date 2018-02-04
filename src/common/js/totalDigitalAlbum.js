// 正常专辑数据
class DigitalAlbumList {
    constructor ({id, mid, albumName, singerName}) {
        this.id = id; // 专辑id
        this.mid = mid; // 专辑mid
        this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`;
        this.albumName = albumName; // 专辑名称
        this.singerName = singerName; // 歌手名
    }
}

// 其他专辑数据
class OtherDigitalAlbumList {
    constructor ({cover, tag, title, composer, commentCount, likeCount}) {
        this.cover = cover; // 图片
        this.tag = tag; // 标签
        this.title = title; // 文字
        this.composer = composer; // 歌手
        this.commentCount = commentCount; // 评论量
        this.likeCount = likeCount; // 点赞量
    }
}

// 其他专辑数据
class DigitalAlbumMusListMessage {
    constructor ({cover, albumName, companyname, publictime, desc, songlist}) {
        this.cover = cover; // 图片
        this.albumName = albumName; // 专辑名称
        this.companyname = companyname; // 唱片公司名称
        this.publictime = publictime; // 发行时间
        this.desc = desc; // 专辑简介文字
        this.songlist = songlist; // 专辑歌曲列表
    }
}

// 创建正常数字专辑列表数据
export function createDigitalAlbumList (list) {
    let ret = [];

    let items = {};
    list.forEach((item) => {
        items = (new DigitalAlbumList({
            id: item.album_id,
            mid: item.album_mid,
            albumName: item.album_name,
            singerName: filterSinger(item.singers)
        }));

        ret.push(items);
    });

    return ret;
}

// 创建其他数字专辑列表数据
export function createOtherDigitalAlbumList (list) {
    let ret = [];

    let items = {};
    list.forEach((item) => {
        items = (new OtherDigitalAlbumList({
            cover: item.pic,
            tag: item.tag,
            title: item.title,
            composer: item.composer,
            commentCount: item.comment_count,
            likeCount: item.like_count
        }));

        ret.push(items);
    });

    return ret;
}

// 更多数字专辑
export function createMoreAlbumList (list) {
    let ret = [];

    let items = {};
    list.forEach((item) => {
        items = (new OtherDigitalAlbumList({
            cover: item.pic,
            tag: item.tag,
            title: item.title,
            composer: item.composer,
            commentCount: item.comment_count,
            likeCount: item.like_count
        }));

        ret.push(items);
    });

    return ret;
}

// 创建数字专辑基础信息
export function createAlbumSongTableMessage (data) {
    return new DigitalAlbumList({
        id: data.id,
        mid: data.mid,
        albumName: data.albumName,
        singerName: data.singerName
    });
}

// 创建数字专辑歌曲列表信息
export function createDigitalAlbumMusListMessage (data) {
    return new DigitalAlbumMusListMessage({
        cover: data.headpiclist[0].picurl, // 图片
        albumName: data.album_name, // 专辑名称
        companyname: data.companyname, // 唱片公司名称
        publictime: data.publictime, // 发行时间
        desc: data.desc, // 专辑简介文字
        songlist: data.songlist // 专辑歌曲列表
    });
}

/*
 * 过滤出singer
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
