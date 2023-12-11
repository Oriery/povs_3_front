import { defineStore } from 'pinia'
import { ref } from 'vue'

export type JoyStickPosition = {
  /**
   * -1 to 1
   */
  x: number
  /**
   * -1 to 1
   */
  y: number
}

export const useJoystickStore = defineStore('joystick', () => {
  const joystickPosition = ref<JoyStickPosition>({ x: 0, y: 0 })

  function updateJoystickPosition(message: string) {
    const temp = message.split(/\s+/)
    const [x, y] = temp
      .slice(3, 5)
      .map((value) => parseInt(value, 10))
      .map((value) => value / 100)
    if (x !== joystickPosition.value.x || y !== joystickPosition.value.y) {
      joystickPosition.value = { x, y }
    }
  }

  return {
    joystickPosition,
    updateJoystickPosition,
  }
})
