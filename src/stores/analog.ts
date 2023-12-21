import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalogStore = defineStore('analog', () => {
  const analogSignal = ref(0)

  const dataWidth = 1000
  const lastData = ref(new Array<number>(dataWidth).fill(0))

  function updateAnalogSignal(message: string) {
    const temp = message.split(/\s+/)
    const an = parseInt(temp[1], 10)
    if (an !== analogSignal.value) {
      analogSignal.value = an
    }

    lastData.value.shift()
    lastData.value.push(an)
  }

  return {
    analogSignal,
    updateAnalogSignal,
    lastData,
  }
})
