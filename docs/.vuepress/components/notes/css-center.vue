<template>
    <section>
        <div v-if="type==1" class="center">♥</div>
        <div v-if="type==2" class="space-between">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
        <div v-if="type==3" class="space-around">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
    </section>
</template>

<script>
  export default {
    props: ["type"],
    name: "css-center",
    created() {
      console.log(this.type)
    }
  }
</script>

<style scoped>
    div {
        border-radius: 6px;
        background: beige;
        height: 150px;
        display: flex;
    }
    .center {
        align-items: center;
        justify-content: center;
    }

    .space-between {
        align-items: center;
        justify-content: space-between;
    }
    .space-around {
        align-items: center;
        justify-content: space-around;
    }
</style>
