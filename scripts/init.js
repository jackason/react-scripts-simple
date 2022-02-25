const chalk = require('chalk');
const { execSync } = require('child_process')
const path = require("path")
const fs = require("fs")

module.exports = function (
    appPath,
    appName,
    verbose,
    originalDirectory,
    templateName
) {
    console.log(chalk.gray("appPath: " + appPath))
    console.log(chalk.gray("appName: " + appName))
    console.log(chalk.gray("verbose: " + verbose))
    console.log(chalk.gray("originalDirectory: " + originalDirectory))
    console.log(chalk.gray("templateName: " + templateName))
    console.log()
    const templateSrc = path.join(__dirname, '../template')

    function gitInit() {
        console.log(chalk.gray("初始化git..."))
        try {
            execSync('git --version', { cwd: appPath, stdio: 'inherit' });
            execSync('git init', { cwd: appPath, stdio: 'inherit' });
        } catch (e) {
            console.warn('Git repo not initialized', e);
        }
        console.log()
    }

    function copy(src, dst) {
        //读取目录
        let paths = fs.readdirSync(src);

        paths.forEach(function (filePath) {
            const _src = src + '/' + filePath
            const _dst = dst + '/' + filePath

            // 读取文件类型是否是目录
            let st = fs.statSync(_src);
            if (st.isFile()) {
                let readable = fs.createReadStream(_src) // 创建读取流
                let writable = fs.createWriteStream(_dst) // 创建写入流
                readable.pipe(writable);
            } else if (st.isDirectory()) {
                exists(_src, _dst, copy)
            }
        });
    }

    function exists(src, dst, callback) {
        //测试某个路径下文件是否存在
        const exists = fs.existsSync(dst)
        if (exists) {
            callback(src, dst)
        } else {
            fs.mkdirSync(dst)
            callback(src, dst)
        }
    }

    // 判断时候使用自定义模板
    if (templateName) {
        console.log(chalk.gray("自定义模板: " + templateName))
        console.log(chalk.yellow("warning: 暂不支持自定义模板功能，已为您使用系统默认模板"))
        console.log()
    }


    // 生成文件模板
    console.log(chalk.gray("生成模板..."))
    exists(templateSrc, appPath, copy)
    console.log(chalk.gray("生成模板完成"))
    console.log()

    // 初始化git
    gitInit()

    // 读取package.json设置name
    const packageJsonSrc = appPath + '/package.json'

    console.log(chalk.gray("读取package.json配置..."))
    let content = fs.readFileSync(packageJsonSrc, 'utf-8')

    console.log(chalk.gray("重新写入package.json配置..."))
    let packageJson = JSON.parse(content)

    // 读取脚本目录
    let scripts = fs.readdirSync(path.join(__dirname, '../scripts'));
    packageJson.scripts = {}
    // 排除项
    let exclude = ["init", "file"]
    console.log(chalk.gray("生成可执行脚本..."))
    // 生成可执行脚本
    scripts.forEach(item => {
        const scriptsName = item.split(".")
        let name = scriptsName[0]
        if (!exclude.includes(name)) {
            packageJson.scripts[name] = `react-scripts ${name}`
        }
    })

    packageJson.license = 'MIT'
    packageJson.eslintConfig = { extends: ["react-app-simple"] }
    packageJson.browserslist = {
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
    }

    // 重新写入package.json
    fs.writeFileSync(packageJsonSrc, JSON.stringify(packageJson, "", "  "))
    console.log(chalk.gray("package.json配置写入完成"))

    // 安装依赖
    const relyons = ['less', 'typescript'];
    const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
    const displayedCommand = useYarn ? 'yarn' : 'npm';

    console.log();
    console.log(`使用 ${chalk.cyan(displayedCommand)} 执行安装依赖...`)
    console.log();

    // 模板生成后自动下载包
    const cmdInstall = useYarn ? 'yarn' : 'npm i'
    execSync(cmdInstall, { cwd: appPath, stdio: 'inherit' })
    // 安装所需要的依赖
    const cmdAdd = useYarn ? 'yarn add' : 'npm i -D'
    execSync(`${cmdAdd} ${relyons.join(' ')}`, { cwd: appPath, stdio: 'inherit' })

    console.log();
    console.log(chalk.cyan(`  cd ${appName}`))
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}start`));
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`));
    console.log();
};