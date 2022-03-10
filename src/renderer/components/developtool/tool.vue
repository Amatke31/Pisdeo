<template>
    <div id="codetool" ref="codetool">
        <div
            @click="showList = !showList"
            :class="showList ? 'suspension listopen' : 'suspension'"
        >
            <svg
                class="toolsvg"
                t="1643642583418"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4185"
                width="20"
                height="20"
            >
                <path
                    d="M1002.202138 791.322722L768.025007 557.145591c-46.195489-46.195489-115.188751-55.19461-170.783322-27.797285L384.062504 316.169124V191.981252L128.087501 0 0.1 127.987501l191.981252 255.975003h124.187872l213.179182 213.179181c-27.197344 55.594571-18.398203 124.587833 27.797285 170.783322l234.177131 234.177131c29.197149 29.197149 76.39254 29.197149 105.389708 0l105.389708-105.389708c28.997168-29.197149 28.997168-76.39254 0-105.389708zM663.435221 449.956059c56.594473 0 109.789278 21.997852 149.785373 61.993946l38.796211 38.796211c31.596914-13.798652 61.593985-32.996778 87.591446-58.994239 74.192755-74.192755 99.390294-178.58256 75.792599-273.373303-4.39957-17.998242-26.997364-24.197637-40.196075-10.998926l-148.78547 148.78547-135.78674-22.597793L668.034772 197.780685l148.78547-148.78547c13.198711-13.198711 6.799336-35.796504-11.398887-40.396055-94.790743-23.397715-199.180549 1.799824-273.173323 75.792599-56.994434 56.994434-83.791817 132.187091-82.391953 207.179767l164.183966 164.183967c16.198418-3.799629 32.996778-5.799434 49.395176-5.799434z m-207.779709 163.983986l-113.388927-113.388927L37.496348 805.521336c-49.995118 49.995118-49.995118 130.987208 0 180.982326s130.987208 49.995118 180.982326 0l247.175862-247.175862c-15.198516-39.796114-19.798067-83.191876-9.999024-125.387755zM128.087501 943.907822c-26.397422 0-47.995313-21.597891-47.995313-47.995313 0-26.597403 21.39791-47.995313 47.995313-47.995313s47.995313 21.39791 47.995313 47.995313c0 26.397422-21.39791 47.995313-47.995313 47.995313z"
                    p-id="4186"
                ></path>
            </svg>
        </div>
        <div v-if="showList" class="list">
            <p>Developer Tool</p>
            <div v-for="value in toolFunction" :key="value.label">
                <n-btn
                    v-if="value.type == 'btn'"
                    @click="
                        showList = false;
                        value.command();
                    "
                    >{{ value.label }}</n-btn
                >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    data() {
        return {
            showList: false,
        };
    },
    props: ["toolFunction"],
    mounted: function() {
        document.addEventListener("click", (e: any) => {
            if (!e.path.includes(this.$refs.codetool)) {
                this.showList = false;
            }
        });
    },
});
</script>
<style scoped>
#codetool {
    display: flex;
    position: fixed;
    z-index: 10000;
    top: 100px;
    left: 1vw;
}

#codetool * {
    box-sizing: border-box;
    transition: 0.2s;
    margin: 0;
    padding: 0;
}

#codetool .suspension {
    background-color: #222;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 14%) 0px 2px 4px 0px;
    padding: 9px;
}

#codetool .suspension .toolsvg {
    fill: currentColor;
    color: #fff;
}

#codetool .suspension.listopen {
    border-radius: 50% 0px 0 50%;
}

#codetool .list {
    background-color: #222;
    width: auto;
    height: auto;
    padding: 10px;
    box-shadow: rgb(0 0 0 / 14%) 0px 2px 4px 0px;
    border-radius: 4px;
}

#codetool .list p {
    color: #fff;
    margin-bottom: 10px;
}

#codetool .list div {
    display: flex;
}

#codetool .list .n-btn {
    margin: 5px 0;
    background-color: #555;
}
</style>
