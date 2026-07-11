import { Server } from 'socket.io'

const io = new Server(4000, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {

  console.log(
    `Cliente conectado: ${socket.id}`
  )

  socket.on(
    'dashboard-updated',
    () => {

      io.emit(
        'dashboard-updated'
      )

    }
  )

  socket.on(
    'room-updated',
    () => {

      io.emit(
        'room-updated'
      )

    }
  )

  socket.on(
    'flow-updated',
    () => {

      io.emit(
        'flow-updated'
      )

    }
  )

  socket.on(
    'disconnect',
    () => {

      console.log(
        `Cliente desconectado: ${socket.id}`
      )

    }
  )
})

console.log(
  'Socket server iniciado en puerto 4000'
)