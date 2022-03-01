const { ENV } = require('./paths')
const fs = require('fs')

function getENV() {
    let envObj = {}

    try {
        let data = fs.readFileSync(ENV, 'utf-8')
        if (data) {
            let nData = data.replace(/[\r]/g, '')
            let envs = nData.split('\n')

            // 获取env文件
            for (let i = 0; i < envs.length; i++) {
                const item = envs[i];
                let items = item.split("=")
                let key = items[0]
                let value = items[1]

                envObj[key] = ["true", "false"].includes(value) ? true : value
            }

            envObj.__DEV__ = Boolean(process.env.__DEV__)
            envObj.appName = process.env.npm_package_name
        }
    } catch (error) { }
    return envObj
}

function processEnv() {
    let env = getENV()
    for (key in env) {
        typeof env[key] !== 'boolean' && (env[key] = JSON.stringify(env[key]))
    }
    return env
}

module.exports = { getENV, processEnv }