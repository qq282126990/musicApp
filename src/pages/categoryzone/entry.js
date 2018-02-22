/**
 * @file client entry
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import 'babel-polyfill';
import {createApp} from '@/app';
import pageRouter from './router';

const {app, router} = createApp(pageRouter);

router.onReady(() => app.$mount('#app'));
