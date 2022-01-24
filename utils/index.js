const path = require("path")
// 获取路径
function get_path(url) {
    const INIT_CWD = process.env.INIT_CWD
    return path.resolve(INIT_CWD, url)
}

module.exports = {
    get_path,
}