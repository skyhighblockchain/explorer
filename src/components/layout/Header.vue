<template v-if="header-templete">
  <!-- <div id="main-header" class="lg:h-[auto] h-[auto] " :class="{ classA: scrollPosition < 1, classB: scrollPosition > 1 }"> -->
  <div id="main-header">
    <div class="my-container flex justify-between items-center gap-8">
      <div class="logo-wrapper flex lg:flex-row flex-col items-center lg:gap-32 xl:gap-32 w-full">
        <div class="logo-inner flex items-center lg:mb-0 mb-7">
          <button @click="$store.commit('set_nav', true)" class="nav-toggle-btn mr-10">
            <img src="../../assets/icons/hamburger.svg" />
          </button>
          <div class="logo">
            <img src="../../assets/logo.png" alt="logo" />
          </div>
        </div>
        <div class="search lg:flex-grow-[2] w-full lg:w-auto max-w-full">
          <h3 class="lg:hidden font-semibold text-white text-2xl mb-3">
            The Skyhigh Chain Explorer
          </h3>
          <div class="search-input lg:ml-0 mx-auto">
            <img src="../../assets/icons/search_icon.svg" alt="" />
            <input type="search" placeholder="Search by addresses, transactions, and blocks" />
          </div>


        </div>
      </div>
      <div class="theme-switch lg:block hidden">
        <theme-switch />
      </div>
    </div>

  </div>
</template>

<script>
import ThemeSwitch from "../common/ThemeSwitch.vue";
export default {
  components: { ThemeSwitch },
  name: "main-header",
  data() {
    return {
      scrollPosition: 0
    };
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  },
  destroy() {
    window.removeEventListener('scroll', this.updateScroll)
  }
};
</script>

<style lang="scss">
#main-header {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: top center;
  margin-bottom: 10px;
  position: fixed;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 0px;
  width: 100%;
  z-index: 99;
}

@media screen and (max-width: 1024px) {
  #main-header {
    // background-image: url("../../assets/img/skh-header-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom left;
    margin-bottom: 10px;
  }


}
</style>




<!-- <script>
const app = new Vue({

  el: '#main-header',

  data: {
    scrollPosition: null
  },

  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    }
  },

  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  }

})

</script> -->
