<template>
    <div>
        <div v-if="type == 1" class="panel">
            <div class="item" style="transform-origin: center;transform: rotate(20deg)"></div>
            <div class="item" style="transform-origin: left;transform: rotate(20deg)"></div>
            <div class="item" style="transform-origin: bottom;transform: rotate(20deg)"></div>
            <div class="item" style="transform-origin: 100px 100px 0;transform: rotate(20deg)"></div>
        </div>
        <div v-if="type == 2" class="panel">
            <div class="item" style="transform: perspective(200px) rotateX(60deg)"></div>
            <div class="item" style="transform: perspective(200px) rotateY(60deg)"></div>
            <div class="item" style="transform: perspective(200px) rotateZ(60deg)"></div>
        </div>
        <div v-if="type == 3" class="panel">
            <div class="item" style="transform: rotateX(60deg)"></div>
            <div class="item" style="transform: rotateY(60deg)"></div>
            <div class="item" style="transform: rotateZ(60deg)"></div>
        </div>
        <div v-if="type == 4" class="panel">
            <div class="item" style="transform: perspective(100px) translateZ(-20px)"></div>
            <div class="item" style="transform: perspective(100px) translateZ(20px)"></div>
            <div class="item" style="transform: perspective(100px) translateZ(40px)"></div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "css-animation",
    props: ['type']
  }
</script>

<style lang="scss" scoped>
    .panel {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: beige;
        min-height: 80px;
        border-right: 4px;
    }
    .item {
        width: 60px;
        height: 60px;
        background-color: #ffc171;
    }
</style>
