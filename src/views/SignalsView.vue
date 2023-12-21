<template>
  <main class="flex flex-col gap-4">
    <PlotComponent
      :data="data"
    />
    <div class="flex flex-col">
      <v-switch
        v-model="getLight"
        label="Sine/Light"
      />
      <div class="flex flex-row gap-4">
        <v-slider
          v-model="currentWaveParams.amplitude"
          label="Amplitude"
          min="0"
          max="4000"
          step="1"
        />
        <v-label>
          {{ currentWaveParams.amplitude }}
        </v-label>
      </div>
      <div class="flex flex-row gap-4">
        <v-slider
          v-model="currentWaveParams.frequency"
          label="Frequency"
          min="0"
          max="50"
          step="1"
        />
        <v-label>
          {{ currentWaveParams.frequency + ' Hz' }}
        </v-label>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PlotComponent from '@/components/PlotComponent.vue'
import { ref, watch, computed } from 'vue'
import { useAnalogStore } from '@/stores/analog'
import { useWsStore } from '@/stores/ws'
const wsStore = useWsStore()

export type WaveParams = {
  amplitude: number
  frequency: number
}

const currentWaveParams = ref<WaveParams>({
  amplitude: 500,
  frequency: 1,
})
const currAmplitude = computed(() => currentWaveParams.value.amplitude)
const currFrequency = computed(() => currentWaveParams.value.frequency)

const getLight = ref(true)

watch(currAmplitude, (newAmp) => {
  wsStore.sendMessage({
    type: 'message',
    message: `amp: ${newAmp}\n`,
  }, 2)
})

watch(currFrequency, (newFreq) => {
  wsStore.sendMessage({
    type: 'message',
    message: `frq: ${newFreq}\n`,
  }, 2)
})

watch(getLight, (newLight) => {
  wsStore.sendMessage({
    type: 'message',
    message: newLight ? 'light\n' : 'sine\n',
  }, 3)
})


const analogStore = useAnalogStore()
const data = {
  ref: ref(analogStore.lastData),
}

</script>
