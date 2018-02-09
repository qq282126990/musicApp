/**
 * @file 检查版本更新
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable no-console */

'use strict';

const chalk = require('chalk');
const semver = require('semver');
const packageConfig = require('../package.json');
const shell = require('shelljs');

function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim();
}

let versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node
    }
];


if (shell.which('npm')) {
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    });
}

module.exports = function () {
    let warnings = [];
    for (let i = 0, len = versionRequirements.length; i < len; i++) {
        let mod = versionRequirements[i];
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(mod.name + ': '
                + chalk.red(mod.currentVersion) + ' should be '
                + chalk.green(mod.versionRequirement)
            );
        }
    }

    if (warnings.length) {
        console.log(chalk.yellow('\nTo use this template, you must update following to modules:\n'));

        warnings.forEach(function (warning) {
            console.log('  ' + warning);
        });

        process.exit(1);
    }
};
