const { ENV } = require('./path')
const fs = require('fs')

let env_obj = {}
let data = fs.readFileSync(ENV, 'utf-8')
if (data) {
    let nData = data.replace(/[\r]/g, '')
    let envs = nData.split('\n')

    for (let i = 0; i < envs.length; i++) {
        const item = envs[i];
        let items = item.split("=")
        let key = items[0]
        let value = items[1]
        env_obj[key] = value
    }
}

module.exports = env_obj