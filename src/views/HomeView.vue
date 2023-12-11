<template>
  <main class="flex flex-col gap-2">
    <JoystickPos />
    <CubeScene class="flex-grow"/>
  </main>
</template>

<script setup lang="ts">
import JoystickPos from '@/components/JoystickPos.vue'
import CubeScene from '@/components/CubeScene.vue'
</script>
