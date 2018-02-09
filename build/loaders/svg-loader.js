/**
 * @file svg loader
 *
 * @desc 向app.js中注入通过vue-awesome注册自定义svg的代码
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

'use strict';

const fs = require('fs');
const path = require('path');
const iconConfigPath = require.resolve('../../config/icon');

module.exports = function (source) {
    // 删除require缓存
    delete require.cache[iconConfigPath];

    const iconConfig = require(iconConfigPath);
    const svgDir = iconConfig.svgDir;
    const icons = iconConfig.icons;
    const prefix = iconConfig.prefix;

    // 验证`svg`文件夹
    try {
        if (!fs.statSync(svgDir).isDirectory()) {
            throw new Error(`Invalid directory of svg: ${svgDir}`);
        }
    }
    catch (err) {
        this.emitError(err);
        return source;
    }

    // 监听`svg`文件夹变化
    this.addContextDependency(svgDir);

    // 监听`config/icon.js`文件变化
    this.addDependency(iconConfigPath);

    // 从vue-awesome中导入
    if (icons) {
        source += icons.map(name => `import 'vue-awesome/icons/${name}';`).join('');
    }

    // 从svg文件夹中取
    fs.readdirSync(svgDir).forEach(file => {
        let svg = fs.readFileSync(path.resolve(svgDir, file), 'utf8');
        let sizeMatch = svg.match(/ viewBox="0 0 (\d+) (\d+)"/);
        let dMatch = svg.match(/ d="([^"]+)"/);
        let svgName = prefix + path.basename(file, path.extname(file));

        if (!sizeMatch || !dMatch) {
            return;
        }

        // 注册使用到的svg
        source += `Icon.register(
            {
                '${svgName}': {
                    width: ${parseInt(sizeMatch[1], 10)},
                    height: ${parseInt(sizeMatch[2], 10)},
                    d: '${dMatch[1]}'
                }
            });`;
    });

    return source;
};
