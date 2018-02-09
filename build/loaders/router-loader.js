/**
 * @file router loader
 *
 * @desc 收集项目中使用的所有路由规则，向router.js中注入规则全集
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const INSERT_POSITION = 'const allRoutes = [';
const ROUTE_PATH_REG = /path:\s*\'([^\']*)\',/g;

/**
 * 从router.js文件中解析出路由路径
 *
 * @param {string} fileContent 文件内容
 * @return {Array} 结果数组
 */
function extractRoutePaths(fileContent) {
    let result;
    let routePaths = [];
    while ((result = ROUTE_PATH_REG.exec(fileContent)) !== null) {
        routePaths.push(`'${result[1]}'`);
    }
    return routePaths;
}

/**
 * 向字符串指定位置插入内容
 *
 * @param {string} origin 原始字符串
 * @param {string} str 新增内容
 * @param {number} pos 插入位置
 * @return {string} 结果字符串
 */
function insertAt(origin, str, pos) {
    return [
        origin.slice(0, pos),
        str,
        origin.slice(pos)
    ].join('');
}

module.exports = function (source) {
    let pos = source.indexOf(INSERT_POSITION) + INSERT_POSITION.length;
    let entryRouters = utils.getEntries('./src/pages', 'router.js');
    let routePaths = [];

    Object.keys(entryRouters).forEach(entryName => {

        let routerPath = path.resolve(__dirname, '../../', entryRouters[entryName]);
        let content = fs.readFileSync(routerPath, 'utf8');

        routePaths = routePaths.concat(extractRoutePaths(content));

        // 加入文件监听列表
        this.addDependency(routerPath);
    });

    return insertAt(source, routePaths.join(','), pos);
};
