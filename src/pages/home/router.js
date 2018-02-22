/**
 * @file router
 * @author jianzhongmin(282126990@qq.com)
 */

// 定义切割点，异步加载路由组
// 主页模块
let Home = () => import('@/pages/home/home.vue');
// 发现模块
let Find = () => import('./Find.vue');
// 我的模块
let My = () => import('./My.vue');
// 新歌速递模块
import NewSongSpeed from 'components/new-song-speed/new-song-speed.vue';
// 数字专辑音乐列表
import DigitalAlbumMusicList from 'components/digital-album-music-list/digital-album-music-list.vue';
// 分类歌单
import CategorySongList from 'components/category-song-list/category-song-list.vue';

export default {
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/find',
            name: 'find',
            component: Find
        },
        {
            path: '/my',
            name: 'my',
            component: My
        },
        // 新歌速递模块
        {
            path: '/home/newSongSpeed',
            name: 'newSongSpeed',
            component: NewSongSpeed
        },
        // 数字专辑模块
        {
            path: '/home/newSongSpeed/digitalAlbum/:id',
            name: 'digitalAlbumMusicList',
            component: DigitalAlbumMusicList
        },
        // 分类歌单模块
        {
            path: '/home/homeRecommend',
            name: 'categorySongList',
            component: CategorySongList
        }
    ]
};
