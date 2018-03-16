// import Songsingle from '@/pages/songsingle/Songsingle.vue';
let Songsingle = () => import('@/pages/songsingle/Songsingle.vue');

export default {
    routes: [
        {
            path: '/songsingle/:id',
            name: 'songsingle',
            component: Songsingle
        }
    ]
};
