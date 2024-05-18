const express = require('express')
const app = express()
const rootRoute = require('./routes/rootRoute')

// appConfig
app.use(express.static(`${process.cwd()}/public`))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

// useRoutes
app.use('/', rootRoute)

const port = process.env.PORT || 7280
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`)
})
