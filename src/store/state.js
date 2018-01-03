/**
 * 状态管理
 */
const state = {
    /**
     * 主页 选择的的歌曲列表
     *
     * @type {Object}
     */
    homeSonglist: {},
    /**
     * 设置遮罩层显示隐藏
     *
     * @type {Boolean}
     */
    maskLayer: false,
    /**
     * 歌曲列表接口一次请求的页数 一次 +15
     *
     * @type {Number}
     */
    songBegin: 0
};

export default state;
