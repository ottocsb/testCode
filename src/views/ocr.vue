<template>

</template>

<script setup>
import { createWorker } from 'tesseract.js'

const worker = createWorker({
  logger: m => console.log(m)
})
//异步请求
const startOcr = async () => {
  await worker.load()
  await worker.loadLanguage('chi_sim')
  await worker.initialize('chi_sim')
  let { data: { text } } = await worker.recognize(
    '/src/assets/test1.jpg'
  )
  await worker.terminate()
  console.log(text)

}
startOcr()
</script>

<style scoped>

</style>
