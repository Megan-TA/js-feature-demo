var express = require('express')
var fs = require('fs')
var path = require('path')
let https = require('https')
var app = express()
let os = require('os')
let portfinder = require('portfinder')
let chalk = require('chalk')
let privateKey = fs.readFileSync('./private.pem', 'utf-8')
let certificate = fs.readFileSync('./file.crt', 'utf-8')
const credentials = {
  key: privateKey,
  cert: certificate
}
const log = console.log


app.use(express.static(path.resolve(__dirname + '/static')))

app.get('/index.html', (req, res) => {
 fs.readFile('./index.html', 'utf-8', (err, data) => {
  res.send(data)
 })
})


portfinder.getPortPromise()
  .then(port => {
    const host = getLocalHost()
    let httpsServers = https.createServer(credentials, app)
    console.log(`本机主机地址：${host}`)
    httpsServers.listen(port, () => {
      log(chalk.green(`https://localhost:${port}/index.html 已启动`))
    })
    httpsServers.on('error', (err) => {
      log(chalk.red(err))
      httpsServers.close()
    })
  })
  .catch(err => {
    log(chalk.red(err))
  })

function getLocalHost () {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (const alias of iface) {
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}