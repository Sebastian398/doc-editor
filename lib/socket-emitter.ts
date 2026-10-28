import { io } from 'socket.io-client'
const socket = io(
  'http://192.168.240.125:4000'
)

export function emitDashboardUpdated() {
  socket.emit('dashboard-updated')
}

export function emitRoomUpdated(
  roomId: string
) {

  socket.emit(
    'room-updated',
    roomId
  )

}

export function emitFlowUpdated() {
  socket.emit('flow-updated')
}