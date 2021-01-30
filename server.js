const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { nanoid } = require('nanoid')

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (_req, res) => {
  res.render('hall', { rooms: [...io.sockets.adapter.rooms.keys()] })
})

// 새로운 방 만들기
app.get('/new', (_req, res) => {
  res.redirect(`/${nanoid()}`)
})

// 기존 방 접속
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
  // peer.js에서 id 발급 받은 후 실행됨
  socket.on('join-room', (roomId, userId) => {
    // 방 접속
    socket.join(roomId)
    // 방 유저에게 접속 알림
    socket.to(roomId).broadcast.emit('user-connected', userId)
    // 방 유저에게 퇴장 알림
    socket.on('disconnect', () =>
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    )
  })
})

server.listen(3000, () => console.log('server start at port 3000'))
