<template>
    <div>
        <ul>
            <li data-text="中文">中文</li>
            <li data-text="English" class="stroke">English</li>
            <li data-text="Deutsch" class="stroke">Deutsch</li>
        </ul>
        <div style="clear: both"></div>
    </div>
</template>

<script>
  export default {
    name: "css-custom-nav"
  }
</script>

<style scoped>
    li {
        cursor: pointer;
        margin: 0 20px;
        list-style: none;
        float: left;
        font-weight: bold;
        font-size: 60px;
        color: white;
        -webkit-text-stroke: 4px #b6a1ea;
        transition: all .3s;
    }

    li[data-text]::after {
        content: attr(data-text);
        transform: translateX(-100%);
        z-index: 1;
        transition: .3s all;
        position: absolute;
        -webkit-text-stroke: 4px #c895ab;
    }
    li[data-text]:hover::after {
        z-index: 1;
        content: attr(data-text);
        transform: translateX(-90%) translateY(-10px);
        transition: .3s all;
        position: absolute;
        -webkit-text-stroke: 4px #c895ab;
    }

    li[data-text]::before {
        content: attr(data-text);
        transition: .3s all;
        position: absolute;
        z-index: 2;
        -webkit-text-stroke: 4px #ff00a6;
    }

    li[data-text]:hover::before {
        content: attr(data-text);
        transform: translateX(20%) translateY(-20px);
        z-index: 2;
        transition: .3s all;
        position: absolute;
        -webkit-text-stroke: 4px #ff00a6;
    }

    .stroke {

    }
</style>
