// 自定义定义歌单信息
export default class SongTableMessage {
    constructor({contentId, cover, rcmdtemplate, title}) {
        // 歌单id
        this.contentId = contentId;
        // 歌单图片
        this.cover = cover;
        // 歌单头部标题
        this.rcmdtemplate = rcmdtemplate;
        // 歌单标题
        this.title = title;
    };
};

// 创建歌单信息
export function createSongTableMessage(data) {
    return new SongTableMessage({
        // 歌单id
        contentId: data.content_id || data.dissid,
        // 歌单图片
        cover: data.cover || data.imgurl,
        // 歌单头部标题
        rcmdtemplate: data.rcmdtemplate || '歌单推荐',
        // 歌单标题
        title: data.title || data.dissname
    });
};
