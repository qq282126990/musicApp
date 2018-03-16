// import Mv from '@/pages/mv/Mv.vue';
let Mv = () => import('@/pages/mv/Mv.vue');

export default {
    routes: [
        {
            path: '/mv/:id',
            name: 'mv',
            component: Mv
        }
    ]
};
