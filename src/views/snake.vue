<template>
  <div>得分：{{ score }}</div>

  <div class='can'>
    <!-- 游戏界面 -->
    <div v-if='show' class='content'>
      <div class='snake-grassland'>
        <div
          v-for='(item, index) in snake'
          :key='`snake${index}`'
          :style='location(item.x, item.y)'
          class='snake'
        ></div>
        <div
          v-for='(item, index) in foods'
          :key='`food${index}`'
          :style='location(item.x, item.y)'
          class='food'
        ><img alt='' src='../assets/苹果.png' /></div>
              style='width: 16px;height: 16px' /></div>
      </div>


      <!-- 结束面板 -->
      <div v-if='showFail' class='fail'>
        <div class='fail-title'>游戏结束!</div>
        <div class='total-score'>score:{{ score }}</div>
        <el-button type='danger' @click='reStart'>重新开始</el-button>
        <el-button type='danger' @click='exitGame'>退出游戏</el-button>
      </div>
    </div>
  </div>
  <div style='margin-top: 20px'>
    <div v-if='showLogin'>
      <button @click='active'>开始游戏</button>
    </div>
    <div v-else>
      <el-row>
        <el-col :push='9' :span='6'>
          <el-button @click='wasd(0)'>上</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :push='3' :span='12'>
          <el-button @click='wasd(2)'>左</el-button>
        </el-col>
        <el-col :pull='3' :span='12'>
          <el-button @click='wasd(3)'>右</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :push='9' :span='6'>
          <el-button @click='wasd(1)'>下</el-button>
        </el-col>
      </el-row>

    </div>
  </div>
</template>
<script setup>

let score = $ref(0)  // 得分
let showLogin = $ref(true)
let show = $ref(true)
let showFail = $ref(false)
let foods = $ref([])
let direction = $ref(3) //初始方向向右
let timer = $ref(null)
let snake = $ref([
  { x: 0, y: 0 }, //蛇尾
  { x: 1, y: 0 },
  { x: 2, y: 0 } //蛇头
])//(x, y) 组成蛇的每一块儿的位置
let xStep = $ref(1)
let yStep = $ref(1)
// 随机生成食物
const generateFoods = (total) => {
  const foods = []
  for (let i = 0; i < total; i++) {
    //食物的随机x轴坐标，也就是第几行
    const foodX = Math.floor(Math.random() * 50)
    //食物的随机x轴坐标，也就是第几列
    const foodY = Math.floor(Math.random() * 50)
    foods.push({ x: foodX, y: foodY })
  }
  return foods
}
foods = generateFoods(3)


window.addEventListener('keyup', (event) => {
  // event.key = ArrowUp 上
  switch (event.key) {
    case 'ArrowUp':
      direction = 0
      snakeMove()
      break
    case 'ArrowDown':
      direction = 1
      snakeMove()
      break
    case 'ArrowLeft':
      direction = 2
      snakeMove()
      break
    case 'ArrowRight':
      direction = 3
      snakeMove()
      break
    default:
      break
  }
})

// 重新开始
const reStart = () => {
  showFail = false
  snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ] //(x, y) 组成蛇的每一块儿的位置
  foods = generateFoods(3)
  direction = 3
  score = 0
  timer = setInterval(() => {
    snakeMove()
  }, 200)
}

//退出游戏
const exitGame = () => {
  showFail = false
  showLogin = !showLogin
  show = !show
  score = 0
  clearInterval(timer) //清除了定时器
  timer = null //清除了timer的内存占用
}

//碰撞检测是否吃到食物
const isEat = () => {
  // 小蛇移动就是除头部以外的部分向前移动一个身位,即前一个状态的最后一个身位丢弃
  let head = snake[snake.length - 1]
  let isEat = false
  // 消除吃掉的食物
  foods = foods.filter((food) => {
    if (head.x === food.x && head.y === food.y) {
      isEat = true
      eat() // 加长蛇身
      //碰撞一次加10分
      score += 10
      return false
    }
    return true
  })
  // 添加一个新食物，使食物总量保持不变
  if (isEat) {
    foods.push(...generateFoods(1))
  }
}

// 吃食物
const eat = () => {
  let tail = snake[0]
  xStep = 0
  yStep = 0

  if (direction === 0) {
    yStep = -1
  } else if (direction === 1) {
    yStep = 1
  } else if (direction === 2) {
    xStep = -1
  } else if (direction === 3) {
    xStep = 1
  }
  //添加到数组的开头
  snake.unshift({ x: tail.x - xStep, y: tail.y - yStep })
}

// 开始游戏
const active = () => {
  console.log('开始游戏')
  show = true
  showLogin = false
  snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ] //(x, y) 组成蛇的每一块儿的位置
  foods = generateFoods(3)
  direction = 3
  timer = setInterval(() => {
    snakeMove()
  }, 200)
}


// 获取位置
const location = (x, y) => {
  return {
    left: x * 16 + 'px',
    top: y * 16 + 'px'
  }
}

//蛇开始动 判断是否超出界限 head表示贪吃蛇的头部，当头部超过地图的范围时
//先获取下一步数据，坐标值，判断坐标值是否非法，如果不非法就可以动了
const move = (xStep, yStep) => {
  //定义蛇的头部位置
  let head = snake[snake.length - 1]
  //需要监听蛇头的方向而且判断
  if (
    (direction == 2 && head.x <= 0) ||
    (direction == 0 && head.y <= 0) ||
    (direction == 3 && head.x >= 49) ||
    (direction == 1 && head.y >= 49)
  ) {
    clearInterval(timer)
    timer = null
    endGame()
  } else {
    snake.push({ x: head.x + xStep, y: head.y + yStep })
    snake.shift()
  }

}

//结束游戏
const endGame = () => {
  showFail = true
}

// 改变方向
const changeDirection = (direction) => {
  direction = direction
  snakeMove()
}
//方向键控制蛇的移动
const wasd = (event) => {
  direction = event
  snakeMove()
}
// 控制蛇的方向
const snakeMove = () => {
  switch (direction) {
    case 0: // 上  网上移动就是列的改变，列减1行
      move(0, -1)
      break
    case 1: // 下
      move(0, 1)
      break
    case 2: // 左
      move(-1, 0)
      break
    case 3: // 右
      move(1, 0)
      break
    default:
      break
  }
  isEat()
}


</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}

.can {
  height: 800px;
}

.content {
  width: 800px;
  height: 800px;

  position: relative;
  border: 1px solid gainsboro;
  display: flex;
}

.snake-grassland {
  position: relative;
  background-color: #4a72af;
  width: 800px;
  height: 800px;
}

.snake-grassland .snake {
  background-color: #000;
  position: absolute;
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
}

.snake-grassland .food {
  position: absolute;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
}

.fail {
  position: absolute;
  width: 400px;
  height: 300px;
  background-color: rgb(207, 202, 224);
  top: 250px;
  left: 200px;
  border: 1px solid black;
  border-radius: 25px;
}

.fail-title {
  margin: 20px auto;
  font-size: 28px;
  font-weight: bold;
}

.total-score {
  margin: 40px auto 20px;
  font-size: 28px;
  font-weight: bold;
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

