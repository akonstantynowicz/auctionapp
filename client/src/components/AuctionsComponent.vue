<template>
<div class="auctions">
  <h1>A U K C J E</h1>
  <p class="error" v-if="error">{{ error }}</p>
   <auction
    v-for="(auction, index) in auctions"
    :auction="auction"
    :index="index"
    :key="auction._id"/>
<infinite-loading spinner="waveDots" @infinite="infiniteHandler">
  <div slot="no-more">Nie ma więcej aukcji</div>
</infinite-loading>
</div>
</template>

<script>
import Auction from "./Auction.vue";
import axios from "axios";
const url = "/api/auctions/";
export default {
  name: "AuctionsComponent",
  data() {
    return{
      page: 0,
      auctions: [],
      error: ""
    }
  },
  components: {
    Auction
  },
  methods: {
    infiniteHandler($state) {
      axios.get(url, {
        params: {
          page: this.page
      }
      }, {withCredentials: true})
      .then(res =>{
        if (res.data.page>1) {
          if(this.page===0){
            this.page = res.data.page;
            this.page = this.page-1;
          }else if(this.page===1){
            this.page = -1;
          }else{
            this.page = this.page-1;
          }
            this.auctions.push(...res.data.auctions);
            $state.loaded();
        } else {
          this.auctions.push(...res.data.auctions);
          $state.complete();
        }
      })
      .catch(error => {
        this.error = error.response.data.message;
      });
  }
  }
}
</script>

<style scoped lang=scss>
$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgb(223, 206, 174);
$brown: rgb(57, 42, 28);
$grey: rgb(77, 97, 94);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);

.auctions{
  display: grid;
  grid-area: 1 / 2 / span 1 / span 1;
  background-color: $wood;
  h1 {
    margin: 20px 20px 20px 20px;
    color: $lighterTeal;
  }
  .error{
    color: $burgundy;
    background-color: $lighterBurgundy;
    font-size: 30px;
    border-radius: 20px;
  }
}
</style>
