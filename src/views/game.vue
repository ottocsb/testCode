<template>
  <div v-if='isOver'>
    <button @click='switchThemes'>切换主题</button>
    <button @click='startGame'>开始游戏</button>
    <div style='margin-top: 10px'>
      <span v-if='maxScore>0'>历史最高分：{{ maxScore }}</span>
      <span v-else>分数：{{ score }}</span>
    </div>
  </div>

  <canvas></canvas>
  <el-dialog v-model='overGame' :close-on-click-modal='false' :close-on-press-escape='false' :show-close='false'
             title='提示'
             width='30%'>
    <h1>你的分数是：<span>{{ score }}</span></h1>
    <button @click='resGame'>重 新 开 始</button>
    <button @click='goHome'>回到首页</button>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import router from '../router'

const isDark = useDark()
let score = ref(0)
let isOver = ref(true)
let overGame = ref(false)
let maxScore = localStorage.getItem('maxScore')

const goHome = () => {
  router.push('/')
}
const switchThemes = () => {
  const toggleDark = useToggle(isDark)
  console.log(toggleDark())
}
// 禁止右键
document.oncontextmenu = function() {
  return false
}
// 让文字无法被选中
document.addEventListener('selectstart', function(e) {
  e.preventDefault()
})
// 开始游戏
const startGame = () => {
  isOver.value = false
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')
  // 设置canvas宽高
  let winW = window.innerWidth
  let winH = window.innerHeight
  canvas.width = winW
  canvas.height = winH

  // 通用属性
  class Item {
    constructor(x, y, radius, color, velocity) {
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.velocity = velocity
    };

    // 绘制
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.color
      ctx.fill()
    };

    // 移动
    ai() {
      this.draw()
      this.x = this.x + this.velocity.x
      this.y = this.y + this.velocity.y
    };
  }

  // 玩家
  class Player extends Item {
    constructor(x, y, radius, color) {
      super(x, y, radius, color)
      this.draw()
    };
  }

  // 敌人
  class Ele extends Item {
    constructor(x, y, radius, color, velocity) {
      super(x, y, radius, color, velocity)
    };
  }

  // 子弹
  class Bullet extends Item {
    constructor(x, y, radius, color, velocity) {
      super(x, y, radius, color, velocity)
    };
  }

  // 粒子效果
  class Particle extends Item {
    constructor(x, y, radius, color, velocity, friction) {
      super(x, y, radius, color, velocity)
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.velocity = velocity
      this.alpha = 1
      this.friction = friction
    };

    draw() {
      ctx.save()
      ctx.globalAlpha = this.alpha
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.color
      ctx.fill()
      ctx.restore()
    };

    ai() {
      this.draw()
      this.velocity.x *= this.friction
      this.velocity.y *= this.friction
      this.x = this.x + this.velocity.x
      this.y = this.y + this.velocity.y
      this.alpha -= 0.01
    };
  }

  let bulletArray = []
  let eleArray = []
  let particles = []


  let flag = true

  // 动画

  function animate() {
    if (flag) requestAnimationFrame(animate)
    // 填充背景颜色
    ctx.fillStyle = 'rgba(0, 0, 0, .1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 创建玩家
    let player = new Player(canvas.width / 2, canvas.height / 2, 20, 'white')
    // 遍历子弹
    bulletArray.map((item, index) => {
      console.log(item, index)
      item.ai()
      // 删除
      if (item.x <= 0 - item.radius || item.y <= 0 - item.radius || item.x >= canvas.width || item.y >= canvas.height) {
        bulletArray.splice(index, 1)
      }

      // 判断
      eleArray.map((ele, i) => {
        let dist = Math.hypot(ele.x - item.x, ele.y - item.y)
        // 添加粒子效果
        if (dist - item.radius - ele.radius < 1) {
          for (let i = 0; i < item.radius * 8; i++) {
            particles.push(new Particle(ele.x, ele.y, Math.random() * 4, ele.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6)
            }, 0.97))
          }

          // 打中后减小
          if (ele.radius - 16 > 10) {
            ele.radius -= 16
            bulletArray.splice(index, 1)
            score.value += 100
          } else {
            bulletArray.splice(index, 1)
            eleArray.splice(i, 1)
            score.value += 250
          }

        }

      })
    })
    // 遍历敌人
    eleArray.map((item) => {
      item.ai()
      // 判断玩家和敌人碰撞 游戏结束
      let dist = Math.hypot(player.x - item.x, player.y - item.y)
      if (dist - item.radius - player.radius < 1) {
        flag = false
        overGame.value = true
        console.log('游戏结束')
      }

    })
    particles.map((item, index) => {
      if (item.alpha <= 0) {
        particles.splice(index, 1)
      } else {
        item.ai()
      }

    })

  }

  animate()

  // 子弹
  window.addEventListener('mousedown', (e) => {
    if (!flag) return

    // 返回原点到点的线段与x轴正方向之间的平面角度
    let angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
    // 把角度转换
    let velocity = {
      x: Math.cos(angle) * 8,
      y: Math.sin(angle) * 8
    }
    // 添加到数组里
    bulletArray.push(new Bullet(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
  })
  let time = 0 // 计时器
  let num = 2000 // 初始间隔时间
  let blood = 20 // 初始血量基数
  const enemy = function() {
    clearInterval(interval)
    time++
    if (time === 20) {
      num /= 1.15
      blood += 7
      time = 0
    }
    console.log(num, time, blood)
    if (!flag) return
    // 随机大小
    let radius = Math.random() * (blood) + 15

    // 随机颜色
    let color = `hsl(${Math.random() * 360}, 50%, 50%)`
    let x, y
    // 随机位置
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height + radius
    } else {
      x = Math.random() * canvas.width + radius
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    let velocity = {
      x: Math.cos(angle) * 2.5,
      y: Math.sin(angle) * 2.5
    }
    eleArray.push(new Ele(x, y, radius, color, velocity))
    interval = setInterval(enemy, num)
  }

  let interval = setTimeout(enemy, num)

  // 敌人
  // setInterval(() => {
  //   if (!flag) return
  //   // 随机大小
  //   let radius = Math.random() * (35 - 15) + 15
  //   // 随机颜色
  //   let color = `hsl(${Math.random() * 360}, 50%, 50%)`
  //   let x, y
  //   // 随机位置
  //   if (Math.random() < 0.5) {
  //     x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
  //     y = Math.random() * canvas.height + radius
  //   } else {
  //     x = Math.random() * canvas.width + radius
  //     y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
  //   }
  //   let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
  //   let velocity = {
  //     x: Math.cos(angle) * 2.5,
  //     y: Math.sin(angle) * 2.5
  //   }
  //   eleArray.push(new Ele(x, y, radius, color, velocity))
  // }, 2000)

}
const resGame = () => {
  overGame.value = false
  if (localStorage.getItem('maxScore') < score.value) {
    localStorage.setItem('maxScore', score.value.toString())
  }
  score.value = 0
  startGame()
}


</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* From www.lingdaima.com */
button {
  --green: #1BFD9C;
  font-size: 15px;
  padding: 0.7em 2.7em;
  letter-spacing: 0.06em;
  position: relative;
  font-family: inherit;
  border-radius: 0.6em;
  overflow: hidden;
  transition: all 0.3s;
  line-height: 1.4em;
  border: 2px solid var(--green);
  background: linear-gradient(to right, rgba(27, 253, 156, 0.1) 1%, transparent 40%, transparent 60%, rgba(27, 253, 156, 0.1) 100%);
  color: var(--green);
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4), 0 0 9px 3px rgba(27, 253, 156, 0.1);
}

button:hover {
  color: #82ffc9;
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
}

button:before {
  content: "";
  position: absolute;
  left: -4em;
  width: 4em;
  height: 100%;
  top: 0;
  transition: transform .4s ease-in-out;
  background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.1) 40%, rgba(27, 253, 156, 0.1) 60%, transparent 100%);
}

button:hover:before {
  transform: translateX(15em);
}

</style>





