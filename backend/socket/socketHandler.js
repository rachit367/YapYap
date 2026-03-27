const { Server } = require('socket.io')
const { redis } = require('../config/redis')
const jwt = require('jsonwebtoken')

let io

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URI,
            credentials: true
        }
    })

    io.use((socket, next) => {
        let token = socket.handshake.auth?.token
        if (!token && socket.handshake.headers.cookie) {
            const cookies = socket.handshake.headers.cookie.split(';')
            for (let cookie of cookies) {
                const parts = cookie.trim().split('=')
                if (parts[0] === 'token') {
                    token = parts[1]
                    break
                }
            }
        }

        if (!token) {
            return next(new Error('Authentication error: No token provided'))
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.user = decoded
            next()
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'))
        }
    })

    io.on('connection', async (socket) => {
        const userId = socket.user.user_id

        await redis.set(`user:${userId}:socket`, socket.id)
        await redis.sadd('online_users', userId)
        console.log(`User ${userId} connected`)

        const onlineUsers = await redis.smembers('online_users')
        io.emit('online_users', onlineUsers)

        socket.on('typing_start', async ({ receiverId }) => {
            const receiverSocketId = await getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', { userId, isTyping: true })
            }
        })

        socket.on('typing_stop', async ({ receiverId }) => {
            const receiverSocketId = await getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', { userId, isTyping: false })
            }
        })

        socket.on('disconnect', async () => {
            console.log(`User ${userId} disconnected`)
            await redis.del(`user:${userId}:socket`)
            await redis.srem('online_users', userId)

            const updatedOnlineUsers = await redis.smembers('online_users')
            io.emit('online_users', updatedOnlineUsers)
        })
    })

    return io
}

const getReceiverSocketId = async (receiverId) => {
    return await redis.get(`user:${receiverId}:socket`)
}

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized')
    }
    return io
}

module.exports = {
    initSocket,
    getReceiverSocketId,
    getIo
}
