<template>
  <div class="dashboard">
    <div class="summery-block mlg:grid mlg:grid-cols-12 lg:!pl-0">
      <div class="xl:col-span-7 mlg:col-span-6 flex flex-col justify-between">
        <div class="stats grid xl:grid-cols-4 mlg:grid-cols-2 sm:grid-cols-2  grid-cols-2 ">
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'blocks' })">
            <h4>Blocks</h4>
            <h2>
              {{ this.stateData.blocks | formatHexToInt }}
            </h2>
            
          </div>
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'staking' })">
            <h4>Validators</h4>
            <h2>{{ this.stateData.validators | formatHexToInt }}</h2>
            
          </div>
          <div class="stats__block">
            <h4>Accounts</h4>
            <h2>{{ this.stateData.accounts | formatHexToInt }}</h2>
            
          </div>
          <div class="stats__block cursor-pointer" @click="$router.push({ name: 'transactions' })">
            <h4>Transactions</h4>
            <h2>{{ this.stateData.transactions | formatHexToInt }}</h2>
           
          </div>
        </div>
        <div class="txt-ad  lg:block hidden text-white">
          Daily Transactions
        </div>
      </div>

      <div class="chart xl:col-span-5 mlg:col-span-6">
        <apex-chart type="area" height="270" :options="chartOptions" :series="series"></apex-chart>
        <div class="text-white">
          Daily Transactions
        </div>
      </div>
    </div>

    <div class="grid mlg:grid-cols-2 gap-7 2xl:gap-10 mt-6">
      <latest-blocks :blockData="blockData" />
      <latest-transactions :transactions="transactionsData" />
    </div>

    <div class="total-skh-wrapper">
      <total-skh-burned />
    </div>
    <div class="grid-cols-2 gap-7 2xl:gap-10 mt-6 lg:grid hidden">
      <div class="my_ads_block">Ads</div>
      <div class="my_ads_block">Ads</div>
    </div>
  </div>
</template>

<script>
import LatestBlocks from "@/components/dashboard/LatestBlocks.vue";
import LatestTransactions from "@/components/dashboard/LatestTransactions.vue";
import TotalSkhBurned from "@/components/dashboard/TotalSKHBurned.vue";
// import AnimatedNumber from "animated-number-vue";
import gql from "graphql-tag";
import {
  timestampToDate,
  formatHash,
  numToFixed,
  formatNumberByLocale,
  formatHexToInt,
} from "@/filters";
import { WEIToSKH } from "@/utils/transactions";

const GET_SKH_LATEST_BLOCK_BURN_LIST = gql`
  query GetSkhLatestBlockBurnList($count: Int = 5) {
    skhLatestBlockBurnList(count: $count) {
      blockNumber
      timestamp
      skhValue
    }
  }
`;

const GET_TRANSACTIONS_LIST = gql`
  query TransactionList($cursor: Cursor, $count: Int!) {
    transactions(cursor: $cursor, count: $count) {
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      totalCount
      edges {
        cursor
        transaction {
          hash
          from
          to
          value
          gasUsed
          block {
            number
            timestamp
          }
        }
      }
    }
  }
`;

const GET_BLOCK_LIST = gql`
  query BlockList($cursor: Cursor, $count: Int!) {
    blocks(cursor: $cursor, count: $count) {
      totalCount
      pageInfo {
        first
        last
        hasNext
        hasPrevious
      }
      edges {
        block {
          hash
          number
          timestamp
          transactionCount
          gasUsed
        }
        cursor
      }
    }
  }
`;

const GET_TX_VOLUMES = gql`
  query TxVolumes($from: String, $to: String) {
    trxVolume(from: $from, to: $to) {
      day
      amount
      volume
    }
  }
`;

const STATE_QUERY = gql`
  query State {
    state {
      blocks
      transactions
      accounts
      validators
      sfcLockingEnabled
      sealedEpoch {
        id
        totalSupply
        baseRewardPerSecond
        __typename
      }
      __typename
    }
  }
`;
import { pollingMixin } from "@/mixins/polling";
export default {
  name: "dashboard-page",
  mixins: [pollingMixin],
  components: { LatestBlocks, LatestTransactions, TotalSkhBurned },
  mounted() {
    this._polling.start(
      "update-net-state",
      () => {
        this.updateChainState();
        this.updateData();
      },
      3300
    );
  },
  data() {
    return {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      chartOptions: {
        legend: {
          show: false,
        },
        chart: {
          height: "270px",
          type: "area",
          toolbar: {
            show: false
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        xaxis: {
          type: "date",
          categories: [
          ],
          labels: {
          style: {
            colors: '#fff' // Change this to your desired color
          }
        }
        },
        yaxis: {
        labels: {
          style: {
            colors: '#fff' // Change this to your desired color
          }
        }
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd",
          },
        },
      },
      transactionsData: [],
      blockData: [],
      trxVolumesData: [],
      stateData: [],
    };
  },
  apollo: {
    skhLatestBlockBurnList: {
      query: GET_SKH_LATEST_BLOCK_BURN_LIST,
      variables() {
        return {
          count: 5,
        };
      },
    },
    transactions: {
      query: GET_TRANSACTIONS_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.transactions && data.transactions.edges) {
          this.transactionsData = data.transactions.edges;
        }
      },
    },
    blocks: {
      query: GET_BLOCK_LIST,
      variables: {
        cursor: null,
        count: 10,
      },
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.blocks && data.blocks.edges) {
          this.blockData = data.blocks.edges;
        }
      },
    },
    state: {
      query: STATE_QUERY,
      fetchPolicy: "network-only",
      result({ data }) {
        if (data && data.state) {
          this.stateData = data.state;
        }
      },
    },
    trxVolume: {
      query: GET_TX_VOLUMES,
      variables() {
        return {
          from: "2023-04-23",
          to: null,
        };
      },
      result({ data }) {
        if (data && data.trxVolume) {
          this.trxVolumesData = data.trxVolume;
          const xAxisData = [];
          const yAxisData = [];
          for (let index = 0; index < data.trxVolume.length; index++) {
            const element = data.trxVolume[index];
            xAxisData.push(element.day);
            yAxisData.push(element.volume);
          }
          // tempData.push(5)
          // data.trxVolume.map((element) => {
          //   console.log(element.day)
          //   xAxisData.push(element.day);
          //   yAxisData.push(element.volume);
          // });
          this.$set(this.chartOptions.xaxis.categories, xAxisData);
          // this.chartOptions.xaxis.categories = xAxisData;
          this.series = [{ name: "trxVolume", data: yAxisData }];
        }
      },
    },
  },
  methods: {
    async fetchState() {
      const dataRes = await this.$apollo.query({
        query: gql`
          query State {
            state {
              blocks
              transactions
              accounts
              validators
              sfcLockingEnabled
              sealedEpoch {
                id
                totalSupply
                baseRewardPerSecond
              }
            }
          }
        `,
        fetchPolicy: "network-only",
      });
      if (dataRes && dataRes.data && dataRes.data.state) {
        this.stateData = dataRes.data.state;
      }
      return dataRes.data.state || {};
    },
    async updateChainState() {
      this.stateData = { ...(await this.fetchState()) };
    },
    async updateData() {

      try {
        const transactionRes = await this.$apollo.query({
          query: gql`
            query TransactionList($cursor: Cursor, $count: Int!) {
              transactions(cursor: $cursor, count: $count) {
                pageInfo {
                  first
                  last
                  hasNext
                  hasPrevious
                }
                totalCount
                edges {
                  cursor
                  transaction {
                    hash
                    from
                    to
                    value
                    gasUsed
                    block {
                      number
                      timestamp
                    }
                  }
                }
              }
            }
          `,
          variables: {
            cursor: null,
            count: 10,
          },
          fetchPolicy: "network-only",
        });
        this.transactionsData = transactionRes.data.transactions.edges;
      } catch (error) {
        console.log(error);
      }

      try {
        const blockData = await this.$apollo.query({
          query: gql`
            query BlockList($cursor: Cursor, $count: Int!) {
              blocks(cursor: $cursor, count: $count) {
                totalCount
                pageInfo {
                  first
                  last
                  hasNext
                  hasPrevious
                }
                edges {
                  block {
                    hash
                    number
                    timestamp
                    transactionCount
                    gasUsed
                  }
                  cursor
                }
              }
            }
          `,
          variables: {
            cursor: null,
            count: 10,
          },
          fetchPolicy: "network-only",
        });
        this.blockData = blockData.data.blocks.edges;
      } catch (error) {
        console.log(error);
      }
    },
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToSKH,
  },
};
</script>

<style lang="scss" scoped>
.my_ads_block {
  height: 116px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 206px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 32px;
  line-height: 41px;
  color: #d7d7d7;
  display: none;
}

@media screen and (max-width: 1500px) {
  .my_ads_block {
    font-size: 26px;
  }
}
</style>
