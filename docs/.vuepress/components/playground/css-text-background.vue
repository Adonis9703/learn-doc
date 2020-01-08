<template>
    <div>
        <div class="back">
            GOEN IN WON PNJGARG
        </div>
    </div>
</template>

<script>
  export default {
    name: "css-text-background"
  }
</script>

<style scoped>
    .back {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400px;
        background: url("../../public/sky.jpg") no-repeat;
        background-size: cover;
        -webkit-background-clip: text;
        font-size: 10px;
        font-weight: bold;
        width: 100%;
        -webkit-text-fill-color: transparent;
        animation: text 5s infinite forwards;
    }
    @keyframes text {
        from {
            letter-spacing: 0;
            font-size: 10px;
        }
        to {
            font-size: 50px;
            letter-spacing: 5px;
        }
    }

</style>
