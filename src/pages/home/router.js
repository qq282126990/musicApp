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
// import Home from '@/pages/home/home.vue';
// import Find from '@/pages/home/Find.vue';
// import My from '@/pages/home/My.vue';

// 新歌速递模块
import NewSongSpeed from 'components/new-song-speed/new-song-speed.vue';
// 数字专辑音乐列表
import DigitalAlbumMusicList from 'components/digital-album-music-list/digital-album-music-list.vue';
// 分类歌单
import CategorySongList from 'components/category-song-list/category-song-list.vue';
// 我的喜欢组件
import UserFavoriteList from 'components/user-favorite-list/user-favorite-list.vue';
// 最近播放组件
import RecentPlay from 'components/recent-play/recent-play.vue';
// 排行榜组件
import Ranking from 'components/ranking/ranking.vue';
// 排行榜歌曲列表组件
import RankingSongList from 'components/rankingSongList/rankingSongList.vue';
// 歌手组件
import Singer from 'components/singer/singer.vue';

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
            component: Find,
            alias: '/home/find'
        },
        {
            path: '/my',
            name: 'my',
            component: My,
            alias: '/home/my'
        },
        // 歌手模块
        {
            path: '/home/singer',
            name: 'singer',
            component: Singer
        },
        // 排行榜模块
        {
            path: '/home/ranking',
            name: 'ranking',
            component: Ranking,
        },
        // 排行榜歌曲列表组件
        {
            path: '/home/ranking/:id',
            name: 'rankingSongList',
            component: RankingSongList,
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
            path: '/home/categorySongList',
            name: 'categorySongList',
            component: CategorySongList,
            alias: '/home/homeRecommend'
        },
        // 我的喜欢模块
        {
            path: '/my/myFavorite',
            name: 'userFavoriteList',
            component: UserFavoriteList,
            alias: '/home/my/myFavorite'
        },
        // 最近播放模块
        {
            path: '/my/playHistory',
            name: 'recentPlay',
            component: RecentPlay,
            alias: '/home/my/playHistory'
        }
    ]
};
