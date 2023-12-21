import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalogStore = defineStore('analog', () => {
  const dataWidth = 2000
  const lastData = ref(new Array<number>(dataWidth).fill(0))

  function updateAnalogSignal(message: string) {
    console.log(message)
    const temp = message.split(/\s+/)
    const an = parseInt(temp[1], 10)

    lastData.value.shift()
    lastData.value.push(an)
  }

  return {
    updateAnalogSignal,
    lastData,
  }
})
