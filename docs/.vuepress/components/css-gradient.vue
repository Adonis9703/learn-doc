<template>
    <section style="margin: 20px 0; background: #f8fff2;">
        <div style="display: flex; justify-content: space-between">
            <div style="width: 220px;height: 220px;">
                <div class="gradient"></div>
            </div>
            <div style="width: 220px;height: 220px;">
                <div class="gradient2"></div>
            </div>
            <div style="width: 220px;height: 220px;">
                <div class="gradient3"></div>
            </div>
        </div>
        <div class="gradient-text">
            Css Gradient Text
        </div>
    </section>
</template>

<script>
  export default {
    name: "css-gradient"
  }
</script>

<style scoped>
    .gradient {
        height: inherit;
        background: linear-gradient(to bottom, transparent 29px, deepskyblue 30px),
        linear-gradient(to right, transparent 29px, deepskyblue 30px);
        background-size: 30px 30px;
    }
    .gradient2 {
        height: inherit;
        background: linear-gradient(to bottom, transparent 20px, rgba(110, 205, 255, 0.68) 20px),
        linear-gradient(to right, transparent 20px, rgba(255, 193, 113, 0.79) 20px);
        background-size: 40px 40px;
    }
    .gradient3 {
        height: inherit;
        background: radial-gradient(tan 30%, transparent 0), radial-gradient(tan 30%, transparent 0);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
    }
    .gradient-text {
        font-size: 40px;
        background: linear-gradient(90deg, #40ffbe, #ff00ff);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation-name: text;
        animation: text infinite 5s;
    }
    @keyframes text {
       from {
           filter: hue-rotate(0);
       }
        to  {
            filter: hue-rotate(-1turn);
        }
    }
</style>
