import { io } from 'socket.io-client'

export const socket = io(
  'http://192.168.240.125:4000',
  {
    autoConnect: true,
  }
)
