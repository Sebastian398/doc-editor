import { Server } from 'socket.io'

const io = new Server(4000, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {

  console.log(`Cliente conectado: ${socket.id}`)

  socket.on(
    'dashboard-updated',
    () => {

      io.emit('dashboard-updated')

    }
  )

  socket.on(
    'join-room',
    (roomId) => {

      socket.join(roomId)

      console.log(`${socket.id} unido a sala ${roomId}`)

    }
  )

  socket.on(
    'room-updated',
    (roomId) => {

      io.to(roomId).emit(
        'room-updated',
        roomId
      )

    }
  )
 
  socket.on(
    'field-updated',
    (data) => {

      console.log(
        'FIELD UPDATED',
        data
      )

      socket.to(data.roomId).emit(
        'field-updated',
        data
      )

    }
  )

  socket.on(
    'flow-updated',
    () => {

      io.emit('flow-updated')

    }
  )

  socket.on(
    'disconnect',
    () => {

      console.log(`Cliente desconectado: ${socket.id}`)

    }
  )
})

console.log('Socket server iniciado en puerto 4000')