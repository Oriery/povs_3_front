<template>
  <v-switch
    v-if="logorithmicScaleAllowed"
    label="Logorithmic scale"
    v-model="logorithmicScale"
    class="-mb-10"
  ></v-switch>
  <div ref="el"></div>
</template>

<script setup lang="ts">
import Plotly from 'plotly.js-dist-min'
import { ref, onMounted, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { PlotlyHTMLElement } from 'plotly.js-dist-min'

export type PlotData = Array<number> | number[]

const props = defineProps<{
  data: { ref: Ref<PlotData> }
  title?: string
  logorithmicScaleAllowed?: boolean
}>()

const el: Ref<HTMLDivElement> = ref(null as any)
const logorithmicScale = ref(false)

onMounted(drawData)

watch(props.data.ref, drawData)
watch(logorithmicScale, drawData)

const plot = ref(null as PlotlyHTMLElement | null)

async function drawData() {
  plot.value = await Plotly.newPlot(
    el.value,
    [
      {
        y: props.data.ref.value,
        type: 'scatter',
      },
    ],
    {
      title: props.title,
      yaxis: { type: logorithmicScale.value ? 'log' : undefined },
    },
    { responsive: true },
  )
}

async function updatePlotData(newData: PlotData) {
  if (!plot.value) return
  await Plotly.restyle(plot.value, { y: [newData] })
}

let interval : number | undefined = undefined

onMounted(() => {
  // @ts-ignore
  interval = setInterval(() => {
    updatePlotData(props.data.ref.value)
  }, 100)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

</script>
