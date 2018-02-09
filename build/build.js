/**
 * @file 生产环境构建入口
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable no-console */

'use strict';

require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');

let spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), function (err) {
    if (err) {
        throw err;
    }
    webpack(webpackConfig, function (err, stats) {
        spinner.stop();
        if (err) {
            throw err;
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(''
            + '  Tip: built files are meant to be served over an HTTP server.\n'
            + '  Opening index.html over file:// won\'t work.\n'
        ));

        if (!process.env.npm_config_report) {
            process.exit();
        }
    });
});
