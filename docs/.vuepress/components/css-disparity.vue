<template>
    <div>
        <div style="font-weight: bold;padding: 20px 0;">perspective 实现</div>
        <section class="back">
            <div class="item1"></div>
            <div class="item2"></div>
            <div class="item3"></div>
        </section>
        <div style="font-weight: bold;padding: 20px 0;">background-attachment 实现</div>
        <section style="height: 300px; overflow: auto;background-color: #f8fff2;">
            <div class="att-back1">
                <div class="content">content</div>
            </div>
            <div style="height: 300px">
                content
            </div>
            <div class="att-back2">
                <div class="content">content</div>
            </div>
            <div style="height: 300px">
                content
            </div>
            <div class="att-back3">
                <div class="content">content</div>
            </div>
        </section>
    </div>
</template>

<script>
  export default {
    name: "css-disparity"
  }
</script>

<style scoped>
    .content {
        text-align: center;
        color: white;
        font-size: 30px;
        font-weight: bold;
    }
    .att-back1 {
        background-size: 100% 100%;
        background: url("../public/library.jpg") fixed center center;
        height: 300px;
    }

    .att-back2 {
        background-size: 100% 100%;
        background: url("../public/lake.jpg") fixed center center;
        height: 300px;
    }

    .att-back3 {
        background-size: 100% 100%;
        background: url("../public/playground.jpg") fixed center center;
        height: 300px;
    }

    .back {
        height: 300px;
        background-color: rgba(247, 255, 239, 0.8);
        overflow-x: hidden;
        overflow-y: auto;
        perspective: 1px;
    }

    .item1 {
        transform: translateZ(-1px) scale(1);
        width: 200px;
        height: 200px;
        background-color: #63e6eb;
    }

    .item2 {
        transform: translateZ(-2px) scale(1);
        width: 200px;
        height: 200px;
        background-color: rgba(62, 181, 255, 0.5);
    }

    .item3 {
        transform: translateZ(-3px) scale(1);
        width: 200px;
        height: 200px;
        background-color: rgba(50, 93, 255, 0.5);
    }
</style>
