'use strict';

const os = require('os');
const gulp = require('gulp');
const path = require('path');
const build = require('@microsoft/sp-build-web');
const bundleAnalyzer = require('webpack-bundle-analyzer');
const log = require('@microsoft/gulp-core-build').log;
const colors = require("colors");
const fs = require("fs");

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const buildConfig = {
    parallel: os.cpus().length - 1
};

const envCheck = build.subTask('environmentCheck', (gulp, config, done) => {
    if (!config.production) {
        //https://spblog.net/post/2019/09/18/spfx-overclockers-or-how-to-significantly-improve-your-sharepoint-framework-build-performance#h_296972879501568737888136
        log(`[${colors.cyan('configure-webpack')}] Turning off ${colors.cyan('tslint')}...`);
        build.tslintCmd.enabled = false;
    }
  
    build.configureWebpack.mergeConfig({
        additionalConfiguration: (generatedConfiguration) => {

            fs.writeFileSync("./temp/_webpack_config.json", JSON.stringify(generatedConfiguration, null, 2));

            // Bundle Analyzer
            if (config.production) {
                log(`[${colors.cyan('configure-webpack')}] Adding plugin ${colors.cyan('BundleAnalyzerPlugin')}...`);
                const lastDirName = path.basename(__dirname);
                const dropPath = path.join(__dirname, 'temp', 'stats');
                generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: 'static',
                reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
                generateStatsFile: true,
                statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
                logLevel: 'error'
                }));
            }

            // Optimize build times - https://www.eliostruyf.com/speed-sharepoint-framework-builds-wsl-2/
            if (!config.production) {
                for (const rule of generatedConfiguration.module.rules) {
                    // Add include rule for webpack's source map loader
                    if (rule.use && typeof rule.use === 'string' && rule.use.indexOf('source-map-loader') !== -1) {
                        rule.include = [
                            path.resolve(__dirname, 'lib')
                        ]
                    }

                    // Disable minification for css-loader
                    if (rule.use && rule.use instanceof Array && rule.use.length == 2 && rule.use[1].loader && rule.use[1].loader.indexOf('css-loader') !== -1) {
                        log(`[${colors.cyan('configure-webpack')}] Setting ${colors.cyan('css-loader')} to disable minification`);
                        rule.use[1].options.minimize = false;
                    }
                }
            }

            if (generatedConfiguration.optimization) {
                log(`[${colors.cyan('configure-webpack')}] Setting ${colors.cyan('minimizer')} to run ${colors.cyan(buildConfig.parallel)} processes in parallel and enabling cache...`);
                generatedConfiguration.optimization.minimizer[0].options.parallel = buildConfig.parallel;
                generatedConfiguration.optimization.minimizer[0].options.cache = true;
            }

            return generatedConfiguration; 
        }
    });

    done();
});

build.rig.addPreBuildTask(envCheck);

const argv = build.rig.getYargs().argv;
const useCustomServe = argv['custom-serve'];
const workbenchApi = require("@microsoft/sp-webpart-workbench/lib/api");

if (useCustomServe) {
  const ensureWorkbenchSubtask = build.subTask('ensure-workbench-task', function (gulp, buildOptions, done) {
    this.log('Creating workbench.html file...');
    try {
      workbenchApi.default["/workbench"]();
    } catch (e) { }

    done();
  });

  build.rig.addPostBundleTask(build.task('ensure-workbench', ensureWorkbenchSubtask));
}

build.initialize(require('gulp'));