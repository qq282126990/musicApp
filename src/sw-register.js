/**
 * @file serviceworker register
 */

// 注册的地址为 sw-precache-webpack-pulgin 生成的 service-worker.js 或者自己手动维护的 service worker 文件
navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js').then(() => {
    navigator.serviceWorker.addEventListener('message', e => {

        // service-worker.js 如果更新成功会 postMessage 给页面，内容为 'sw.update'
        if (e.data === 'sw.update') {
            // 开发者这自定义处理函数，也可以使用默认提供的用户提示，引导用户刷新
            // 这里建议引导用户 reload 处理，详细查看项目具体文件
            // location.reload();
            location.reload();

            // let dom = document.createElement('div');
            // let themeColor = document.querySelector('meta[name=theme-color]');
            //
            // themeColor && (themeColor.content = '#000');
            //
            // /* eslint-disable max-len */
            // dom.innerHTML = `
            //     <style>
            //         .app-refresh{background:#000;height:0;line-height:52px;overflow:hidden;position:fixed;top:0;left:0;right:0;z-index:10001;padding:0 18px;transition:all .3s ease;-webkit-transition:all .3s ease;-moz-transition:all .3s ease;-o-transition:all .3s ease;}
            //         .app-refresh-wrap{display:flex;color:#fff;font-size:15px;}
            //         .app-refresh-wrap label{flex:1;}
            //         .app-refresh-show{height:52px;}
            //     </style>
            //     <div class="app-refresh" id="app-refresh">
            //         <div class="app-refresh-wrap" onclick="location.reload()">
            //             <label>已更新最新版本</label>
            //             <span>点击刷新</span>
            //         </div>
            //     </div>
            // `;
            // /* eslint-enable max-len */
            //
            // document.body.appendChild(dom);
            // setTimeout(() => document.getElementById('app-refresh').className += ' app-refresh-show', 16);
        }
    });
});
