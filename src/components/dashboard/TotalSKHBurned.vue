<template>
  <div class="total-skh-burned content-box px-[35px] py-[30px]">
    <div class="md:grid md:grid-cols-10">
      <div class="xl:col-span-4 md:col-span-5">
        <block-header>
          <template v-slot:title>
            <h3>Total SKH Burned</h3>
          </template>
        </block-header>

        <div class="skh-box">
          <div>
            <span class="num">0</span>
            <span>SKH</span>
          </div>
        </div>
      </div>
      <div class="xl:col-span-6 md:col-span-5 ml-8">
        <ul class="skh-list">
          <li v-for="(item, idx) in skh" :key="idx">
            <div class="skh-block">
              <img src="../../assets/img/flame-1.png" alt="" />
              <span>
                {{ item.block }}
              </span>
            </div>
            <div>
              <div class="name">{{ item.name }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script>
import BlockHeader from "../common/BlockHeader.vue";
export default {
  components: { BlockHeader },
  name: "total-skh-burned",
  data() {
    return {
      skh: [
        {
          name: "Block 9903",
          time: "About 2 hours ago",
          block: 0,
        },
        {
          name: "Block 9903",
          time: "About 2 hours ago",
          block: 0,
        },
        {
          name: "Block 9903",
          time: "About 2 hours ago",
          block: 0,
        },
        {
          name: "Block 9903",
          time: "About 2 hours ago",
          block: 0,
        },
        {
          name: "Block 9903",
          time: "About 2 hours ago",
          block: 0,
        },
      ],
    };
  },
};
</script>