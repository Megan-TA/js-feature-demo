var express = require('express')
var fs = require('fs')
var path = require('path')
app = express()
app.use(express.static(__dirname + '/static'))

app.get('/index.html', (req, res) => {
 fs.readFile('./index.html', 'utf-8', (err, data) => {
  res.send(data)
 })
})

app.listen(8024, () => {
 console.log('已启动')
})