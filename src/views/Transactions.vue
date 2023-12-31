<template>
  <div class="transaction content-box xl:pt-[45px] pt-[30px] pb-[20px] xl:px-[48px] px-[32px]">
    <block-header>
      <template v-slot:title>
        <h2>Transactions <span class="data-count">{{ totalTransactions | formatHexToInt }}</span></h2>
      </template>
      <template v-slot:actions>
        <div class="instruction">Scroll down to see more</div>
      </template>
    </block-header>

    <div class="mt-8">
      <table class="transaction-table with-header">
        <thead class="thead">
          <tr>
            <td class="thead" :data-th="th.value" v-for="(th, idx) in theadData" :key="'th-' + idx">
              {{ th.value }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in tableData" :key="idx">
            <td :data-th="theadData[idx2].value" v-for="(i, idx2) in item" :key="'td-' + idx2"
              @click="$router.push({ name: 'transactionDetails', query: { id: item[0].value } })">
              <template v-if="i.key == 'has' || i.key == 'from' || i.key == 'to'">
                {{ i.value | formatHash }}
              </template>
              <template v-else-if="i.key == 'timeStamp'">
                <timeago :datetime="timestampToDate(i.value)" :auto-update="1"
                  :converter-options="{ includeSeconds: true }">
                </timeago>
              </template>
              <template v-else-if="i.key == 'value'">
                {{ formatNumberByLocale(numToFixed(WEIToSKH(i.value), 2), 2) }}
              </template>
              <template v-else-if="i.key == 'gasUsed'">
                {{ i.value | formatHexToInt }}
              </template>
              <template v-else>
                {{ i.valkue }}
              </template>
            </td>
          </tr>
        </tbody>
        <tr v-if="tableData?.length < 1" class="mlg:hidden">
          <td :data-th="th.value" v-for="(th, idx) in theadData" :key="'noItem-' + idx" class="!text-[#1E1E1E]">
            no items
          </td>
        </tr>
      </table>
      <div class="no-items" v-if="tableData?.length < 1">No items</div>
    </div>
  </div>
</template>

<script>
import BlockHeader from "@/components/common/BlockHeader.vue";
import gql from 'graphql-tag';


const GET_TRANSACTION_LIST = gql`
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
          tokenTransactions {
            trxIndex
            tokenAddress
            tokenName
            tokenSymbol
            tokenType
            tokenId
            tokenDecimals
            type
            sender
            recipient
            amount
          }
        }
      }
    }
  }
`;
import { timestampToDate, formatHash, numToFixed, formatNumberByLocale, formatHexToInt } from "@/filters";
import { WEIToSKH } from '@/utils/transactions'
export default {
  components: { BlockHeader },
  name: "transaction-page",
  data() {
    return {
      theadData: [
        { value: "TX Hash" },
        { value: "Time" },
        { value: "Form" },
        { value: "To" },
        { value: "Gas Used" },
        { value: "Amount" },
      ],
      transactionsData: [],
      tableData: [],
      totalTransactions: 0,
      bold: true,
    };
  },
  apollo: {
    transactions: {
      query: GET_TRANSACTION_LIST,
      variables() {
        return {
          cursor: null,
          count: 40,
        };
      },
      result({ data }) {
        // const vueApp = this
        if (data && data.transactions && data.transactions.edges) {
          // this.transactionsData = data.transactions.edges;
          this.totalTransactions = data.transactions.totalCount
          const tempTransactionData = []
          data.transactions.edges.forEach(element => {
            tempTransactionData.push([
              { value: element.transaction.hash, key: 'has' },
              { value: element.transaction.block.timestamp, key: 'timeStamp' },
              { value: element.transaction.from, key: 'from' },
              { value: element.transaction.to, key: 'to' },
              { value: element.transaction.gasUsed, key: 'gasUsed' },
              { value: element.transaction.value, key: 'value' },
            ])
          });
          this.tableData = tempTransactionData
        }
      },
    },
  },
  methods: {
    formatHex(hexString) {
      const firstDigits = hexString.slice(0, 8); // Extract the first 5 digits
      const lastDigits = hexString.slice(-6); // Extract the last 4 digits
      const middleDots = " ... "; // Dots to represent omitted middle digits
      // Construct the formatted string
      const formattedHex = firstDigits + middleDots + lastDigits;

      return formattedHex;
    },
    timestampToDate,
    formatHash,
    numToFixed,
    formatNumberByLocale,
    formatHexToInt,
    WEIToSKH

  },
};
</script>