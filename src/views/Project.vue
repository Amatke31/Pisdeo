<template>
  <div>
    <div v-if="!isInit" class="mask">
      {{ $t("project.loading") }}<br />
      <button @click="goToStartPage" class="cancel btn-1">
        <span>cancel</span>
      </button>
    </div>
    <div v-else>
      <div class="nav">
        <div class="menu">
          <div class="left">
            <button
              class="item"
              v-for="label in menu"
              :key="label"
              @focus="menuOnFocus(label)"
              @blur="menuOnBlur(label)"
            >
              <a>{{ $t(label.label) }}</a>
            </button>
          </div>
          <div class="right"></div>
          <div class="submenu" v-show="submenuShow">
            <button
              class="item"
              v-for="rols in menu[0].submenu"
              :key="rols"
              @click="rols.click"
            >
              <a>{{ $t(rols.rols) }}</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  transition: 0.3s;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 1;
  overflow: hidden;
  z-index: 2000;
  backdrop-filter: blur(2px);
  background-color: rgba(50, 50, 50, 0.7);
  padding: 36px;
  font-size: 36px;
  .cancel {
    width: 130px;
    height: 40px;
    color: rgb(209, 209, 209);
    border-radius: 5px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    display: inline-block;
    outline: none;
    padding: 0;
    border: none;
    margin-top: 10px;
  }

  .cancel.btn-1 {
    line-height: 42px;
    background: rgb(37, 37, 37);
  }

  .cancel.btn-1 span {
    color: rgb(240, 240, 240);
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 20px;
  }

  .cancel.btn-1:hover {
    background: rgb(59, 59, 59);
    box-shadow: inset 2px 2px 2px 0px rgba(51, 51, 51, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  }
}
.nav {
  height: 28px;
  background-color: #222;

  .menu {
    display: flex;
    height: 100%;
    width: 100%;

    .left,
    .right {
      display: flex;

      .item {
        border: unset;
        font-size: 14px;
        background: rgb(43, 43, 43);
        padding: 6px;
        transition: 0.5s;
        width: 100%;
        height: 28px;
        text-align: left;
      }

      .item:hover {
        background: rgb(53, 53, 53);
      }

      .item:focus {
        background: rgb(63, 63, 63);
      }
    }

    .submenu {
      position: absolute;
      background: rgb(43, 43, 43);
      margin-top: 28px;
      display: flex;
      flex-direction: column;
      width: auto;
      padding: 2px;

      .item {
        border: unset;
        font-size: 14px;
        background: rgb(43, 43, 43);
        padding: 8px;
        transition: 0.5s;
        width: 100%;
        height: 28px;
        text-align: left;
      }

      .item:hover {
        background: rgb(53, 53, 53);
      }

      .item:focus {
        background: rgb(63, 63, 63);
      }
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      menuFocus: "",
      submenuShow: false,
    };
  },
  props: {
    isInit: {},
    menu: {},
  },
  mounted() {},
  methods: {
    goToStartPage: function () {
      this.$emit("goToStartPage");
    },
    menuOnFocus: function (label) {
      if (this.menuFocus == label.label && this.submenuShow) {
        this.submenuShow = false;
      } else {
        setTimeout(() => {
          this.submenuShow = true;
          this.menuFocus = label.label;
        }, 110);
      }
    },
    menuOnBlur: function (label) {
      setTimeout(() => {
        this.submenuShow = false;
      }, 100);
    },
  },
};
</script>