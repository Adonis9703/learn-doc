<template>
    <section>
        <div v-if="type==1" class="flex justify-center">♥</div>
        <div v-if="type==2" class="flex justify-space-between">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
        <div v-if="type==3" class="flex justify-space-around">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
        <div v-if="type==4" class="flex justify-start">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
        <div v-if="type==5" class="flex justify-end">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
        </div>
        <div v-if="type==6" class="flex2 align-center">
            <div class="item1">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==7" class="flex2 align-baseline">
            <div class="item1">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==8" class="flex2 align-stretch">
            <div class="item1">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==9" class="flex2 align-start">
            <div class="item1">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==10" class="flex2 align-end">
            <div class="item1">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==11" class="flex3">
            <div class="item1" style="flex: 1;"></div>
            <div class="item2" style="flex: 2;"></div>
            <div class="item3" style="flex: 3;"></div>
        </div>
        <div v-if="type==12" class="flex2 align-center">
            <div class="item1" style="align-self: flex-start">♥</div>
            <div class="item2">♥</div>
            <div class="item3">♥</div>
        </div>
        <div v-if="type==13" class="flex2 align-center">
            <div class="item1">1</div>
            <div class="item2">2</div>
            <div class="item3">3</div>
        </div>
        <div v-if="type==14" class="flex2 align-center" style="flex-direction: column">
            <div class="item1">1</div>
            <div class="item2">2</div>
            <div class="item3">3</div>
        </div>
        <div v-if="type==15" class="flex2 align-center" style="flex-direction: row-reverse">
            <div class="item1">1</div>
            <div class="item2">2</div>
            <div class="item3">3</div>
        </div>
        <div v-if="type==16" class="flex2 align-center" style="flex-direction: column-reverse">
            <div class="item1">1</div>
            <div class="item2">2</div>
            <div class="item3">3</div>
        </div>
        <div v-if="type==17" class="wrap">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                    class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==18" class="wrap" style="flex-wrap: wrap">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==19" class="wrap" style="flex-wrap: wrap-reverse">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==20" class="wrap" style="flex-wrap: wrap; align-content: center">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==21" class="wrap" style="flex-wrap: wrap; align-content: space-around">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==22" class="wrap" style="flex-wrap: wrap; align-content: space-between">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==23" class="wrap" style="flex-wrap: wrap; align-content: flex-start">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==24" class="wrap" style="flex-wrap: wrap; align-content: flex-end">
            <div :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                 class="wrap-item" v-for="item of 20" :key="item">{{item}}</div>
        </div>
        <div v-if="type==25" class="wrap" style="flex-wrap: wrap; align-content: stretch">
            <div style="width: 50px" :style="'background-color:'+ `rgba(${120 + 15* (item+1)}, ${10 + 7* (item+1)}, ${15 + 12* (item+1)}, 1)`"
                  v-for="item of 20" :key="item">{{item}}</div>
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
    .wrap {
        border-radius: 6px;
        background: beige;
        display: flex;
        height: 160px;
    }

    .wrap-item {
        width: 50px;
        height: 50px;
    }

    .item1 {
        line-height: 20px;
        background-color: #82bdf9;
        width: 20px;
        text-align: center
    }

    .item2 {
        line-height: 40px;
        background-color: #f96281;
        width: 30px;
        text-align: center
    }

    .item3 {
        line-height: 60px;
        background-color: #f9792a;
        width: 40px;
        text-align: center
    }

    .flex {
        border-radius: 6px;
        background: beige;
        height: 80px;
        display: flex;
        align-items: center;
    }

    .flex2 {
        border-radius: 6px;
        background: beige;
        height: 80px;
        display: flex;
        justify-content: space-around;
    }

    .flex3 {
        border-radius: 6px;
        background: beige;
        height: 80px;
        display: flex;
    }

    .justify-center {
        justify-content: center;
    }

    .justify-space-between {
        justify-content: space-between;
    }

    .justify-space-around {
        justify-content: space-around;
    }

    .justify-start {
        justify-content: flex-start;
    }

    .justify-end {
        justify-content: flex-end;
    }

    .align-center {
        align-items: center;
    }

    .align-start {
        align-items: flex-start;
    }

    .align-end {
        align-items: flex-end;
    }

    .align-baseline {
        align-items: baseline;
    }

    .align-stretch {
        align-items: stretch;
    }
</style>
