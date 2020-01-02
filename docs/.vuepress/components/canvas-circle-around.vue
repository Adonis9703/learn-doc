<template>
    <div>
        <canvas id="canvas" width="740" height="250" class="canvas"></canvas>
    </div>
</template>

<script>
  export default {
    name: "canvas-circle-around",
    mounted() {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')

      function Circle(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.angle = 0
      }

      Circle.prototype.render = function () {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = 'skyblue'
        ctx.fill()
      }

      Circle.prototype.update = function () {
        this.x = canvas.width / 2 + Math.sin(this.angle) * 100
        this.y = canvas.height / 2 + Math.cos(this.angle) * 100
        this.angle += 0.01

      }
      let circle = new Circle(10, 10, 10)
      circle.render()
      setInterval(() => {
        ctx.clearRect(0, 0, 800, 600)
        circle.render()
        circle.update()
      }, 5)
    },
  }
</script>

<style scoped>
    .canvas {

    }
</style>
