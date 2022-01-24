const { get_path } = require('../utils')

// 入口地址
const entry = get_path('src/index.js')
// 出口地址
const output = get_path('build')
// html模板地址
const template = get_path('./public/index.html')
// 代理文件地址
const proxy = get_path('./proxy.config.js')
// env参数地址
const ENV = get_path('./.env')

module.exports = {
    entry,
    output,
    template,
    proxy,
    ENV
}