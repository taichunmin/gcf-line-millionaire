require('dotenv').config() // init dotenv

const _ = require('lodash')
const express = require('express')
const getenv = require('./lib/getenv')
const http = require('http')
const morgan = require('morgan')

const app = express()
const PORT = getenv('PORT', 3000)

app.use(morgan('combined'))
app.use(express.json())
app.use('/', require('./index').main)
app.set('port', PORT)

const server = http.createServer(app)
server.listen(PORT)

server.on('error', err => {
  if (err.syscall !== 'listen') throw err
  const bind = `${_.isString(PORT) ? 'Pipe' : 'Port'} ${PORT}`
  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      return process.exit(1)

    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      return process.exit(1)

    default:
      throw err
  }
})

server.on('listen', () => {
  const addr = server.address()
  const bind = _.isString(addr) ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listen on ${bind}`)
})
