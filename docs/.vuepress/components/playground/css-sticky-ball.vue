<template>
    <section>
        <div class="stage">
            <div class="ball1"></div>
            <div class="ball2"></div>
        </div>
    </section>
</template>

<script>
  export default {
    name: "css-sticky-ball"
  }
</script>

<style lang="scss" scoped>
    .stage {
        padding: 10px;
        height: 300px;
        filter: contrast(10);
        background: white;
    }
    .ball1 {
        width:  100px;
        height: 100px;
        background: black;
        padding: 10px;
        border-radius: 50%;
        margin: 0 auto;
        z-index: 1;
        filter: blur(5px);
    }
    .ball2 {
        width: 60px;
        height: 60px;
        background: red;
        padding: 10px;
        border-radius: 50%;
        position: absolute;
        z-index: 2;
        filter:blur(5px) ;
        top: 30px;
        left: 200px;
        animation: move 6s infinite;
    }
    @keyframes move {
        0% {
            left: 200px;
        }
        50% {
            left: 460px;
        }
        100% {
            left: 200px;
        }
    }
</style>
