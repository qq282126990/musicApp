import Vue from 'vue';
import Router from 'vue-router';
import Musician from 'components/musician/musician';
import 'common/font/iconfont.scss';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Musician',
      component: Musician
    }
  ]
});
