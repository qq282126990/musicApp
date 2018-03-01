/**
 * @file client entry
 */

import 'babel-polyfill';
import {createApp} from '@/app';
import pageRouter from './router';

const {app, router} = createApp(pageRouter);

router.onReady(() => app.$mount('#app'));
