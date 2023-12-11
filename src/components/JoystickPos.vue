<template>
  <div class="flex flex-col gap-2 p-1 w-min bg-blue-900 rounded">
    <p>Joystick:</p>
    <div class="grid grid-cols-2 w-[10rem] font-mono">
      <p>X: {{ toSignedFixed(joystickStore.joystickPosition.x, 2) }}</p>
      <p>Y: {{ toSignedFixed(joystickStore.joystickPosition.y, 2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJoystickStore } from '../stores/joystick.js'
const joystickStore = useJoystickStore()

function toSignedFixed(num: number, digits: number) {
  if (num >= 0) {
    return `+${num.toFixed(digits)}`
  } else {
    return `${num.toFixed(digits)}`
  }
}

</script>