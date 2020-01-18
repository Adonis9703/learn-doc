<template>
    <div style="" @mouseover="checkMouse">
        <section class="back" >
            <div style="font-weight: bold;padding-bottom: 20px;">perspective共享</div>
            <div v-for="(item, index) of 15" class="item" :key="index"
                 :style="`transform: rotateY(${rotateY}deg);`+'background-color:' + `rgba(${120 + 15* (item+1)}, ${10 + 5* (item+1)}, ${15 + 12* (item+1)}, 0.8)`"></div>
        </section>
        <section class="back-origin" style="clear: both">
            <div style="font-weight: bold;padding: 20px 0;">perspective独立</div>
            <div v-for="(item, index) of 15" class="item-origin" :key="index"
                 :style="`transform: rotateY(${rotateY}deg);`+'background-color:' + `rgba(${255}, ${255 - 15* (item+1)}, ${200 - 12* (item+1)}, 0.8)`"></div>
        </section>
    </div>
</template>

<script>
  export default {
    name: "css-perspective",
    data() {
      return {
        rotateY: 0
      }
    },
    methods: {
      checkMouse(v) {
        this.rotateY = 0
        this.rotateY = (v.clientX - 742) * 0.5
      }
    }
  }
</script>

<style scoped>
    .back {
        width: 1000px;
        perspective: 600px;
    }

    .back-origin {
        width: 1000px;
    }
    .item {
        position: relative;
        float: left;
        /*background-color: rgba(71, 76, 255, 0.8);*/
        width: 50px;
        height: 50px;
        transition: all 1s;
        /*transform: rotateY(180deg);*/
    }

    .item-origin {
        position: relative;
        float: left;
        background-color: rgba(255, 93, 29, 0.8);
        width: 50px;
        height: 50px;
        transition: all 1s;
        perspective: 600px;
    }
</style>
