class HomeNewSongSpeed {
    constructor({status, name, id, albumName, singerName}) {
        this.status = status;
        this.name = name;
        this.id = id; // 专辑id
        this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`;
        this.albumName = albumName; // 专辑名称
        this.singerName = singerName; // 歌手名
        this.title = this.albumName + ' - ' + this.singerName;
    }
};

// 主页新歌速递模块数据
export function createHomeNewSongSpeed(newSong, newAlbum) {
    let ret = [];
    let items = {};

    newSong.forEach((item) => {

        items = (new HomeNewSongSpeed({
            status: '歌单推荐',
            name: 'newSongSpeed',
            id: item.album.mid,
            albumName: item.album.name,
            singerName: filterSinger(item.singer)
        }));

        ret.push(items);
    });

    newAlbum.forEach((item) => {

        items = (new HomeNewSongSpeed({
            status: '数字专辑',
            name: 'digitalAlbum',
            id: item.album.mid,
            albumName: item.album.name,
            singerName: filterSinger(item.author)
        }));

        ret.push(items);
    });

    return ret;
}

/*
 * singer是一个数组  过滤出singer的name
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
}


// 创建主页歌单推荐刷新后的数据
class ReplaceHomeRecomPlaylist {
    constructor({album_pic_mid, content_id, cover, creator, edge_mark, listen_num, pic_mid, rcmdcontent, rcmdtemplate, title, username}) {
        this.album_pic_mid = album_pic_mid;
        this.content_id = content_id;
        this.cover = cover;
        this.creator = creator;
        this.edge_mark = '';
        this.listen_num = listen_num;
        this.pic_mid = pic_mid;
        this.rcmdcontent = rcmdcontent;
        this.rcmdtemplate = rcmdtemplate;
        this.title = title;
        this.username = username;
    }
};

// 歌单推荐刷新后的数据
export function createReplaceHomeRecomPlaylist(list) {
    let ret = [];
    let items = {};

    list.forEach((item) => {
        items = (new ReplaceHomeRecomPlaylist({
            album_pic_mid: item.album_pic_mid,
            content_id: item.tid,
            cover: item.cover_url_medium,
            creator: item.creator_uin,
            listen_num: item.access_num,
            pic_mid: item.pic_mid,
            rcmdcontent: `编辑推荐：${item.title}`,
            rcmdtemplate: "编辑推荐",
            title: item.title,
            username: item.creator_info.nick
        }));

        ret.push(items);
    });


    return ret;
}
