import Songsingle from '@/pages/songsingle/songsingle.vue';

export default {
    routes: [
        {
            path: '/songsingle/:id',
            name: 'songsingle',
            component: Songsingle
        }
    ]
};
