# Lavas MPA 模版

> 这是一个支持多页应用的 Vue 模版，解决了一些多页应用中遇到的常见问题

## 安装，开发及调试

``` bash
# 安装依赖
npm install

# 更新
npm update

# 启动开发服务器，默认打开localhost:8082/home
npm run dev

# 检查您的代码是否规范
npm run lint

# 生产环境构建
npm run build

# 生产环境构建并展示 bundle 信息
npm run build --report
```

## 文件结构

绝大部分结构和[ Lavas Appshell模版](https://github.com/lavas-project/lavas-template-vue-appshell)一致，只是`pages/`下存放各个页面文件夹而不是路由组件。
每个页面文件夹中包含该单页所需的各个文件。
``` bash
lavas-template-vue-mpa
    |---src
        |---pages 页面存放目录
            |---detail 详情页模块
                |--- Detail.skeleton.vue 构建时渲染的skeleton组件
                |--- Detail.vue 路由组件
                |--- entry-skeleton.js skeleton入口
                |--- entry.js entry入口
                |--- index.html 页面模版，供htmlWebpackPlugin使用
                |--- router.js 单页面使用的路由
            |---home 主页模块
            |---search 搜索页模块
        |---...省略其他目录
```

## 基本实现方式

与 Appshell 单页模版不同的是，使用 [multipage 插件](https://github.com/mutualofomaha/multipage-webpack-plugin)生成多个页面，同时在构建时预渲染各个页面对应的 skeleton 组件，将渲染结果插入最终页面 HTML 中。

> 如果您还不了解 skeleton 骨架屏组件，可以参考[这篇文章](https://xiaoiver.github.io/coding/2017/07/30/%E4%B8%BAvue%E9%A1%B9%E7%9B%AE%E6%B7%BB%E5%8A%A0%E9%AA%A8%E6%9E%B6%E5%B1%8F.html)

## 多页应用中特有问题

在多页应用中，有两个问题需要我们关注：
1. 各个单页路由跳转问题。
2. 单页应用中，Service Worker 查找当前路由对应的 HTML 页面很简单。多页中则不是。

## 各个单页间跳转

在单页应用中我们使用 vue-router 进行前端路由跳转，而多页应用可以看成多个单页应用，每个单页都可以有各自独立的路由，那么如何做到在各个单页之间进行跳转呢？

例如想从A页面跳转到B页面，发现目标路由规则并不在A页面的规则集中，此时肯定不能展示404页面，需要识别出这是一个有效的路由规则，通过`window.location.href`而非 vue-router 进行跳转。

这就要求我们在构建时收集所有页面使用的路由规则（由router-loader完成），形成一个项目中有效的路由规则全集。各个页面遇到不匹配的路由时，都需要去这个全集中查看，匹配了其中的某条规则才进行跳转，否则依然展示404页面。

具体实现如下：
```js
// src/router.js

// 各个页面的路由对象都通过这种方式创建
const router = new Router({
    mode: 'history',
    base: '/',
    routes: [
        ...routes,
        {
            path: '*',
            component: NotFound,
            beforeEnter(to, from, next) {
                if (validateRoute(to.fullPath)) { // 跳转到有效路由
                    window.location.href = to.fullPath;
                    return;
                }
                next(); // 继续展示404页面
            }
        }
    ]
});
```

关于 router-loader 的实现原理，可以参考[这篇文档](https://lavas.baidu.com/guide/vue/doc/vue/webpack/router-loader)。

下面让我们看看在服务端要做哪些配置。

### 服务端配置

和使用 HTML5 History 模式的单页应用一样，需要在服务端配置路由规则。
服务端只需要关心页面级别的重定向，以nginx为例：
```
// nginx.conf

server {
    # 省略其他配置

    location /home {
        try_files $uri $uri/ /home.html;
    }

    location /detail {
        try_files $uri $uri/ /detail.html;
    }

    location /search {
        try_files $uri $uri/ /search.html;
    }
}
```

其实在开发服务器 express 中，我们也做了一些简单的配置：
```js
// build/dev-server.js

var rewrites = Object.keys(utils.getEntries('./src/pages', 'entry.js'))
    .map(function (entry) {
        return {
            from: new RegExp(`/${entry}`),
            to: `/${entry}/index.html`
        };
});
app.use(require('connect-history-api-fallback')({
    htmlAcceptHeaders: ['text/html'],
    rewrites
}));
```

我们为什么不将 404 放在服务端配置，例如在 nginx 配置中最后写一条规则呢？
如果我们这么做，那么需要将前端所有路由规则在 nginx 中复制一份，这样才能保证不在路由规则全集中的请求落到 404 规则中。这样一来，每次前端路由发生变化，都需要在服务端同步修改。这也是我们将 404 放在前端判断的原因，这样服务端的配置将简单很多，只有新增页面级别的路由才需要修改。

## 缓存查找

我们需要对使用 sw-precache 插件生成的 Service Worker 文件进行一点修改。

默认在缓存中查找请求结果时，遵循以下规则按顺序查找：
1. 忽略参数，hash
2. 尝试拼上`index.html`
3. 使用缺省页面路径，通常传入`index.html`

这在单页应用中没有问题，只有一个页面嘛，缺省路径总是可以生效。但多页中就不行了。
我们需要在第三步之前增加一个判断，根据路径判断当前路由属于哪个页面。例如`/home/user`应该匹配到缓存中的`home.html`，当然这是根据默认的打包路径规则确定的。

```js
// config/sw.tmpl.js
var url = new URL(originalUrl);
// /home/user => home
var entryName = url.pathname.split('/')[1];
if (entryName) {
    url.pathname = '/' + entryName + '.html';
}
```

这样就能保证多页的离线可用了。

