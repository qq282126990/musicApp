import Categoryzone from '@/pages/categoryzone/Categoryzone.vue';

export default {
    routes: [
        {
            path: '/categoryzone/:name/:id',
            name: 'categoryzone',
            component: Categoryzone
        }
    ]
};
