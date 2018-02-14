import Songsingle from '@/pages/songsingle/songsingle.vue';
import Skeleton from '@/pages/songsingle/Songsingle.skeleton.vue'

export default {
    routes: [
        { // 插入骨架屏路由
            path: '/songsingle/skeleton',
            component: Skeleton
        },
        {
            path: '/songsingle/:id',
            name: 'songsingle',
            component: Songsingle
        }
    ]
};
