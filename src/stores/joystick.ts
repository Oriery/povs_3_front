import { defineStore } from 'pinia'
import { ref } from 'vue'

export type JoyStickPosition = {
  /**
   * -100 to 100
   */
  x: number
  /**
   * -100 to 100
   */
  y: number
}

export const useJoystickStore = defineStore('joystick', () => {
  const joystickPosition = ref<JoyStickPosition>({ x: 0, y: 0 })

  function updateJoystickPosition(message: string) {
    const temp = message.split(/\s+/)
    const [x, y] = temp.slice(3, 5).map((value) => parseInt(value, 10))
    if (x !== joystickPosition.value.x || y !== joystickPosition.value.y) {
      joystickPosition.value = { x, y }
    }
  }
  
  return {
    joystickPosition,
    updateJoystickPosition,
  }
})
