// src/stores/index.ts
// 引入Store定义函数
import { defineStore } from 'pinia'

// 定义Store实例并导出，useStore可以是任何东西，比如useUser, useCart
// 第一个参数，唯一不可重复，字符串类型，作为仓库ID 以区分仓库
// 第二个参数，以对象形式配置仓库的state,getters,actions
export const useStore = defineStore('main', {
    // state 推荐箭头函数，为了TS类型推断
    state: () => {
        return {
            name: '张三',
            counter: 2
        }
    },
    getters: {
        // 自动推导返回类型
        doubleCount(state) {
            return state.counter * 2
        },
        // 依赖getters返回参数，则需要显性的设置返回类型
        doublePlusOne(): number {
            return this.doubleCount + 1
        },
    },
    actions: {}
})
