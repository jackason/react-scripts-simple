const path = require("path")
const { execSync } = require('child_process')

let cmd = 'yarn start'
execSync(cmd, { cwd: `${path.join(__dirname, `../`)}`, stdio: 'inherit' })
