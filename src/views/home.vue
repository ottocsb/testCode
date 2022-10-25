<template>
  <div>
    <button @click='handleClick(5,"李四")'>修改状态数据</button>
    <!-- 模板内不需要加.value -->
    <p>{{ store.name }}</p>
    <!-- computed获取 -->
    <p>{{ name }}</p>
    <!-- 或者使用解构之后的 -->
    <p>{{ counter }}</p>
    <p>{{ store.doubleCount }}</p>
    <button @click='gaGame'>play-game</button>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import axios from '../utils/axios'
import { useStore } from '@/stores/index.ts'
// 使普通数据变响应式的函数
import { storeToRefs } from 'pinia'
import router from '../router'

const store = useStore()

// 结合computed获取
const name = computed(() => store.name)
// 解构并使数据具有响应式
const { counter } = storeToRefs(store)
//箭头函数 click事件
const handleClick = (res: number, name: string) => {
  // 修改状态
  console.log(res, name)
  store.$state = { counter: res, name: name }
}

const gaGame = () => {
  router.push('/game')
}

// 点击修改状态数据;
// function handleClick() {
//   //重置状态
//   store.$reset()
//   setTimeout(() => {
//     // 修改状态
//     store.$state = { counter: 999, name: '李四' }
//   }, 1000)
// }

let a: number = 1
let b: [number, string?] = [1, '2']
console.log(a, b)

axios
  .get('/users/XPoet')
  .then((res) => {
    console.log('res: ', res)
  })
  .catch((err) => {
    console.log('err: ', err)
  })
</script>

<style scoped></style>
