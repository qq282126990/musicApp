/**
 * @file 开发环境客户端
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

require('eventsource-polyfill');
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload();
    }
});
