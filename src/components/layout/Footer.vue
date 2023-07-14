<template>
  <footer id="main-footer">
    <p>©2023 SkyHigh</p>
  </footer>
</template>
  
<script>
export default {
  name: "main-footer",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#main-footer {
  height: 96px;
  // background: linear-gradient(
  //     0deg,
  //     rgba(49, 188, 60, 0.1),
  //     rgba(49, 188, 60, 0.1)
  //   ),
  //   #fcfcfc;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;

  p {
    margin: 0;
    // color: rgb(255 255 255 / 60%);
    font-weight: 500;
    font-size: 18px;
    color: rgb(56 217 209);
  }
}
</style>