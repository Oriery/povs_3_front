<template>
  <div class="flex flex-col gap-2">
    Joystick:
    <div class="flex flex-col gap-2">
      X: {{ joystickStore.joystickPosition.x }}
      Y: {{ joystickStore.joystickPosition.y }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJoystickStore } from '../stores/joystick.js'
const joystickStore = useJoystickStore()

</script>