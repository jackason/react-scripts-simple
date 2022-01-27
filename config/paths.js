const { get_path } = require('../utils')

// src
const appSrc = get_path('src')
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

const node_modules = get_path('node_modules')

module.exports = {
    appSrc,
    entry,
    output,
    template,
    proxy,
    ENV,
    node_modules
}