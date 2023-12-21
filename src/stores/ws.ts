import { ref, watch } from 'vue'
import { storeToRefs, defineStore } from 'pinia'
import { useJoystickStore } from '../stores/joystick.js'
import { useAnalogStore } from './analog.js'

export type WsMessage = {
  type: 'ping' | 'log' | 'info' | 'pong' | 'error' | 'message'
  message: string
}

const wsUrl = import.meta.env.VITE_WS_URL

export const useWsStore = defineStore('ws', () => {
  const joystickStore = useJoystickStore()
  const analogStore = useAnalogStore()

  const ws = ref(null as WebSocket | null)
  const isConnectedToServer = ref(false)
  let intervalForReconnect: Parameters<typeof clearInterval>[0] | undefined = undefined
  let showedDisconnectionError = false

  function connect() {
    console.log('Trying to connect to WebSocket server')

    if (!ws.value) {
      ws.value = new WebSocket(wsUrl)

      ws.value.addEventListener('open', () => {
        console.log('Connected to WebSocket server')

        clearInterval(intervalForReconnect)

        if (showedDisconnectionError) {
          pushNotify.info({
            title: 'Connection restored',
            duration: 1000,
          })
        }
        showedDisconnectionError = false
        isConnectedToServer.value = true

        sendMessage({ type: 'log', message: 'Hello from client' })
      })

      ws.value.addEventListener('message', (event) => {
        let data
        try {
          data = JSON.parse(event.data)
        } catch (error) {
          console.error('Invalid JSON', error)
          return
        }
        onMessage(data)
      })

      ws.value.addEventListener('close', () => {
        console.log('Disconnected from WebSocket server')
        isConnectedToServer.value = false
        ws.value = null

        connect()

        clearInterval(intervalForReconnect)
        intervalForReconnect = setInterval(() => {
          connect()
        }, 5000)
      })

      ws.value.addEventListener('error', (event) => {
        isConnectedToServer.value = false

        // if already showed error, do not show it again
        if (showedDisconnectionError) return

        console.error('WebSocket error', event)

        // wait a little in case connection is quickly reastablished
        setTimeout(() => {
          // if already connected, do not show alert
          if (isConnectedToServer.value) return

          showedDisconnectionError = true

          pushNotify.error({
            title: 'Connection lost',
            duration: 10000,
          })
        }, 1000)
      })
    }
  }

  function disconnect() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
  }

  function sendMessage(message: WsMessage, multisend = 1) {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      for (let i = 0; i < multisend; i++) {
        ws.value.send(JSON.stringify(message))
      }
      console.log('Sent message to server: ' + JSON.stringify(message))
    } else {
      console.error('Cannot send message: WebSocket is not open')
    }
  }

  function onMessage(message: WsMessage) {
    switch (message.type) {
      case 'log': {
        console.log('log from server: ' + message.message)
        break
      }
      case 'error': {
        console.error(`error from server: ` + message.message)
        pushNotify.error({
          title: 'Error',
          value: message.message,
          duration: 10000,
        })
        break
      }
      case 'message': {
        onMessageMessage(message.message)
        break
      }
      default:
        console.error('Unknown message type: ' + JSON.stringify(message))
    }
  }

  function onMessageMessage(message: string) {
    const type = message.split(' ')[0]
    switch (type) {
      case 'JS:': {
        joystickStore.updateJoystickPosition(message)
        break
      }
      case 'An:': {
        analogStore.updateAnalogSignal(message)
        break
      }
      default:
        console.error('Unknown message type: ' + JSON.stringify(message))
    }
  }

  return { connect, disconnect, sendMessage, isConnectedToServer }
})
