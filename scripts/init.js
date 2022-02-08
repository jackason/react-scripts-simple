const chalk = require('chalk');
const { execSync } = require('child_process')

module.exports = function (
    appPath,
    appName,
    verbose,
    originalDirectory,
    templateName
) {
    console.log("appPath---" + appPath)
    console.log("appName---" + appName)
    console.log("verbose---" + verbose)
    console.log("originalDirectory---" + originalDirectory)
    console.log("templateName---" + templateName)

    const path = require("path")
    const fs = require("fs")
    const templateSrc = path.join(__dirname, '../template')

    const copy = function (src, dst) {
        //读取目录
        fs.readdir(src, function (err, paths) {
            if (err) throw err
            paths.forEach(function (path) {
                const _src = src + '/' + path
                const _dst = dst + '/' + path
                fs.stat(_src, function (err, st) {
                    if (err) throw err

                    if (st.isFile()) {
                        if (path === 'package.json') {
                            // 读取package.json设置name
                            fs.readFile(_src, 'utf-8', function (err, content) {
                                if (err) throw err
                                let json = JSON.parse(content)
                                json.name = appName

                                // 重新写入package.json
                                fs.writeFile(_dst, JSON.stringify(json, "", "  "), function (err) {
                                    if (err) throw err
                                })
                            })
                        } else {
                            let readable = fs.createReadStream(_src) // 创建读取流
                            let writable = fs.createWriteStream(_dst) // 创建写入流
                            readable.pipe(writable);
                        }
                    } else if (st.isDirectory()) {
                        exists(_src, _dst, copy)
                    }
                });
            });
        });
    }

    const exists = function (src, dst, callback) {
        //测试某个路径下文件是否存在
        fs.exists(dst, function (exists) {
            if (exists) {
                callback(src, dst)
            } else {
                fs.mkdir(dst, function () {
                    callback(src, dst)
                })
            }
        })
    }

    exists(templateSrc, appPath, copy)

    // Change displayed command to yarn instead of yarnpkg
    const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
    const displayedCommand = useYarn ? 'yarn' : 'npm';
    execSync('yarn install', { cwd: appPath, stdio: 'inherit' })

    console.log(chalk.cyan(` cd ${appName}`))
    console.log();
    console.log(`Success! Created ${appName} at ${appPath}`);
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} start`));
    console.log('    Starts the development server.');
    console.log();
    console.log(
        chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
    );
    console.log('    Bundles the app into static files for production.');
};