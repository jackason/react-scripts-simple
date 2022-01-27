const { proxy } = require('./paths')

module.exports = function serverProxy() {
    try {
        const proxyConfig = require(proxy)
        return proxyConfig
    } catch (error) {
        return {}
    }
}