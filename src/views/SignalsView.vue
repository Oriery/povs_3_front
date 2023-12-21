<template>
  <main class="flex flex-col gap-2">
    <PlotComponent :data="data" :key="updatePlot" />
  </main>
</template>

<script setup lang="ts">
import PlotComponent from '@/components/PlotComponent.vue'
import { ref } from 'vue'
import { useAnalogStore } from '@/stores/analog'
import { onMounted, onUnmounted } from 'vue';

const analogStore = useAnalogStore()
const data = {
  ref: ref(analogStore.lastData),
}

const updatePlot = ref(0)
let interval : number | undefined = undefined

onMounted(() => {
  interval = setInterval(() => {
    updatePlot.value++
  }, 50)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

</script>
