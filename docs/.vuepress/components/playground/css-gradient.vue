<template>
    <section style="margin: 20px 0; background: #f8fff2;">
        <div style="background-color: black; padding: 60px 0;">
            <div class="gradient-text">
                fushigi no monogatari
            </div>
        </div>
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
    </section>
</template>

<script>
  export default {
    name: "css-gradient"
  }
</script>

<style lang="scss" scoped>
    @import url(https://fonts.googleapis.com/css?family=Lato);

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
        letter-spacing: 4px;
        font-family: Lato;
        text-transform: uppercase;
        text-align: center;
        font-size: 30px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(0, 0, 0, 1) 100%);
        background-clip: text;
        background-size: 80%;
        -webkit-text-fill-color: transparent;
        animation-name: text;
        background-repeat: no-repeat;
        animation: text infinite 3s linear;
    }

    @keyframes text {
        /*from {*/
        /*filter: hue-rotate(0);*/
        /*}*/
        /*to  {*/
        /*filter: hue-rotate(-1turn);*/
        /*}*/
        from {
            background-position: -500%;
        }
        to {
            background-position: 500%;
        }
    }


</style>
