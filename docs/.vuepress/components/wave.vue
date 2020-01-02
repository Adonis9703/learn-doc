<template>
    <div class="back">
        <div class="circle"></div>
    </div>
</template>

<script>
  export default {
    name: "wave"
  }
</script>

<style scoped>
    .back {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 740px;
        height: 200px;
        overflow: hidden;
        background: linear-gradient(#63e6eb, #474cff);
    }

    .circle {
        position: relative;
        display: inline-block;
    }

    .circle:before, .circle:after {
        content: "";
        position: absolute;
        width: 1700px;
        height: 1700px;
        left: -850px;
        background-color: white;
        animation-name: rotate;
        animation-duration: 10s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        transform: translate(0, -10px);
    }
    .circle:before {
        top: -1700px;
        border-radius: 47%;
    }
    .circle:after {
        opacity: .5;
        top: -1705px;
        animation-duration: 6s;
        border-radius: 45%;
    }

    @keyframes rotate {
        0% {
            transform: rotateZ(0deg) translate(0, -10px);
        }
        50% {
            transform: rotateZ(180deg) translate(0, -13px);
        }
        100% {
            transform: rotateZ(360deg) translate(0, -10px);
        }
    }
</style>
