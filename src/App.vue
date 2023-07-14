<!-- <template>
  <div id="app">
    <div>
      <Header />
      <div class="flex w-full lg:gap-9">
        <div>
          <navigation-menu />
        </div>
        <div class="main flex-grow-[2]">
          <router-view />
          <ads-component />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import AdsComponent from "./components/common/adsComponent.vue";
import Footer from "./components/layout/Footer.vue";
import Header from "./components/layout/Header.vue";
import NavigationMenu from "./components/layout/NavigationMenu.vue";
import gql from "graphql-tag";

export default {
  components: { Header, NavigationMenu, Footer, AdsComponent },
  name: "app",
  data() {
    return {};
  },
  apollo: {
    price: {
      query: gql`
        query Price($to: String!) {
          price(to: $to) {
            price
          }
        }
      `,

      result(_data) {
        if (!_data.data.price) {
          return;
        }

        let tokenPrice = parseFloat(_data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        this.$store.commit("setTokenPrice", tokenPrice);
      },

      variables() {
        return {
          to: "USD",
        };
      },
    },

    gasPrice: {
      query: gql`
        query GasPrice {
          gasPrice
        }
      `,

      result(_data) {
        const gasPrice = parseInt(_data.data.gasPrice);

        if (gasPrice) {
          this.$store.commit("setGasPrice", gasPrice);
        }
      },
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (this.$store.getters.nav) {
        this.$store.commit("set_nav", false);
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  justify-content: space-between;
}

.main {
  width: 100%;
  max-width: 1550px;
  margin-right: 40px;
  position: relative;
  top: -70px;
  z-index: 2;

  &::before {
    content: "";
    width: calc(100% - 30px);
    height: 265px;
    position: absolute;
    top: -18px;
    right: 10px;
    z-index: -1;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
  }
}

@media (min-width: "1960px") {
  .main {
    margin: 0px auto;
  }
}

@media (max-width: "1024px") {
  .main {
    top: -132px;

    &::before {
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

@media (max-width: "1024px") {
  .main {
    margin: 0px 19px;
  }
}
</style> -->




<template>
  <div id="app">
    <div>
      <Header />
      <div class="content-wrapper flex w-full lg:gap-9">
        <div class="side-menu">
          <navigation-menu />
        </div>
        <div class="main lg:h-[auto] h-[auto]" :class="{ classA: scrollPosition < 200, classB: scrollPosition > 1 }">
          <router-view />
          <ads-component />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import AdsComponent from "./components/common/adsComponent.vue";
import Footer from "./components/layout/Footer.vue";
import Header from "./components/layout/Header.vue";
import NavigationMenu from "./components/layout/NavigationMenu.vue";


export default {
  components: { Header, NavigationMenu, Footer, AdsComponent },
  name: "app",
  data() {
    return {
      scrollPosition: 235
    };
  },
  methods: {
    // updateScroll() {
    //   this.scrollPosition = window.scrollY
    // }
    scrollToSection(target) {
      // Scroll to the target section
      const targetElement = document.querySelector(target);
      const targetOffset = targetElement.offsetTop;

      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      });

      // Restore the original scroll position after a short delay
      setTimeout(() => {
        window.scrollTo({
          top: this.originalScrollPosition,
          behavior: 'auto'
        });
      }, 500); // Adjust this delay value as needed
    }
  },
  mounted() {
    // window.addEventListener('scroll', this.updateScroll);
    this.originalScrollPosition = window.pageYOffset;
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (this.$store.getters.nav) {
        this.$store.commit("set_nav", false);
      }
    },
  },
};
</script>

<!-- <script>
  const app = new Vue({
  
  el: '.main',
  
  data: {
    scrollPosition: 0
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


<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  justify-content: space-between;
  background: url("./assets/img/bg.jpg") no-repeat;
  background-size: cover;
  background-position: top left;
  position: relative;

  &:before {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
}

.side-menu {
  position: fixed;
  width: 20%;
  z-index: 99;
  top: 135px;
}

.main {
  width: 100%;
  max-width: 79%;
  margin-right: 40px;
  position: relative;
  top: 0px;
  z-index: 2;
  left: 20%;
  // min-height: 100vh;
  // &::before {
  //   content: "";
  //   width: calc(100% - 30px);
  //   height: 265px;
  //   position: absolute;
  //   top: -18px;
  //   right: 10px;
  //   z-index: -1;
  //   background: rgba(255, 255, 255, 0.5);
  //   border-radius: 12px;
  // }
}

@media (min-width: "1960px") {
  .main {
    margin: 0px auto;
  }
}

@media (max-width: "1200px") {
  .main {
    width: 100%;
    max-width: 96%;
    margin-right: 0;
    position: relative;
    top: 0px;
    z-index: 2;
    left: 0;
    right: 0;
    margin: auto;
  }

  .content-box {
    width: 97%;
    margin: 0 auto;
  }
}

@media (max-width: "1024px") {
  .main {
    top: 0px;

    &::before {
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

@media (max-width: "1024px") {
  .main {
    margin: 0px 19px;
  }
}

@media (max-width: "991px") {
  .main {
    top: 0px;
    margin: 0px 19px;
  }
}
</style>
