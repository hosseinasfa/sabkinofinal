const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 3001

const app = express()

app.use(history())
app.use(serveStatic(__dirname + '/dist/pwa'))
app.listen(port)
