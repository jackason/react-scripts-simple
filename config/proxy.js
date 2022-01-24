const { proxy } = require('./path')

module.exports = function serverProxy() {
    try {
        const proxyConfig = require(proxy)
        return proxyConfig
    } catch (error) {
        return {}
    }
}