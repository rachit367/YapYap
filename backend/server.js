const dotenv = require('dotenv')
const path = require('path')
const { app } = require('./app')
const http = require('http')
const { initSocket } = require('./socket/socketHandler')

dotenv.config({ path: path.join(__dirname, '.env') })

const httpServer = http.createServer(app)

initSocket(httpServer)

try {
    const PORT = process.env.PORT
    httpServer.listen(PORT, () => {
        console.log(`server running on ${PORT}`)
    })
} catch (err) {
    console.error('The server failed to start', err)
    process.exit(1)
}