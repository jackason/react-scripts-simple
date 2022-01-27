const path = require("path")
const { execSync } = require('child_process')

let cmd = 'yarn build'
execSync(cmd, { cwd: `${path.join(__dirname, `../`)}`, stdio: 'inherit' })
