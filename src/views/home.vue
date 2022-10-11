<template>
  <div>
    <button @click="handleClick">修改状态数据</button>
    <!-- 模板内不需要加.value -->
    <p>{{ store.name }}</p>
    <!-- computed获取 -->
    <p>{{ name }}</p>
    <!-- 或者使用解构之后的 -->
    <p>{{ counter }}</p>
    <p>{{ store.doubleCount }}</p>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import axios from '../utils/axios'
import {useStore} from '@/stores/index.ts'
// 使普通数据变响应式的函数
import {storeToRefs} from "pinia";

const store = useStore()

// 结合computed获取
const name = computed(() => store.name)
// 解构并使数据具有响应式
const {counter} = storeToRefs(store);

// 点击修改状态数据;
function handleClick() {
  //重置状态
  store.$reset()
  setTimeout(() => {
    // 修改状态
    store.$state = {counter: 999, name: '李四'}
  }, 1000)

}

axios.get('/users/XPoet')
    .then((res) => {
      console.log('res: ', res)
    })
    .catch((err) => {
      console.log('err: ', err)
    })

</script>

<style scoped>

</style>
