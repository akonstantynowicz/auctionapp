<template>
<div class="boughtAuctions">
  <h1 v-if="auctions.length">TWOJE TRWAJĄCE AUKCJE</h1>
  <h1 v-else>BRAK TRWAJĄCYCH AUKCJI</h1>
  <p class="error" v-if="error">{{ error }}</p>
   <div class="boughtAuctionsFor"
    v-for="(auction, index) in auctions"
    :auction="auction"
    :index="index"
    :key="auction._id">
    <router-link class="router" :to="{ name: 'auction', params: {id: auction._id } }">
    <div class="boughtAuction">
        <p class="name"> {{ auction.itemName }}</p>
        <div class="picture">
            <img :src="require('../assets/' + auction.picture)" :alt="auction.picture">
        </div>
        <p class="description">{{ auction.description }}</p>
        <p class="price" v-if="auction.isAuctionable">AKTUALNA CENA {{ auction.price }} zł</p>
        <p class="price" v-else>CENA {{ auction.price }} zł</p>
    </div>
    </router-link>
   </div>
</div>
</template>

<script>
import axios from "axios";
const url = "/api/auctions/current";

export default {
  name: "AuctionsComponent",
  data() {
    return{
      auctions: [],
      error: ""
    }
  },
  created() {
      axios.get(url, {withCredentials: true})
        .then((resp) => {
            this.auctions = resp.data.auctions;
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
  }
}
</script>

<style scoped lang=scss>
$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgba(245, 234, 214, 0.562);
$brown: rgb(57, 42, 28);
$grey: rgb(77, 97, 94);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);

.boughtAuctions{
    h1 {
        background-color: $lightWood;
        color: $lighterTeal;
    }
    .error{
        color: $burgundy;
        background-color: $lighterBurgundy;
        font-size: 30px;
        border-radius: 20px;
    }
    .boughtAuctionsFor{
        display: grid;
        grid-template-columns: 25% 50% 25%;
        .router {
            grid-area: 1 / 2 / span 1 / span 1;
            color: $darkTeal;
            .boughtAuction {
                background-color: $lightWood;
                display: grid;
                grid-template-columns: 40% 60%;
                grid-template-rows: 25% 50% 25%;
                padding-left: 10px;
                padding-right: 10px;
                margin-bottom: 5px;
                border: 1px solid $brown;
                .name {
                    grid-area: 1 / 1 / span 1 / span 2;
                    font-size:20px;
                    font-weight: bolder;
                }
                .picture {
                    grid-area: 2 / 1 / span 2 / span 1;
                    img{
                        height:200px;
                    }
                }
                .description {
                    grid-area: 2 / 2 / span 1 / span 1;

                }
                .price {
                    grid-area: 3 / 2 / span 1 / span 1;
                }

            }
        }
    }
}
@media (max-width: 550px) {
    .boughtAuctions{
        .boughtAuctionsFor{
            display: grid;
            grid-template-columns: 100%;
            .router {
                grid-area: 1 / 1 / span 1 / span 1;
                .boughtAuction{
                    display: grid;
                    grid-template-columns: 100%;
                    grid-template-rows: 20% 30% 30% 20%;
                    .name {
                        grid-area: 1 / 1 / span 1 / span 1;
                        font-size:20px;
                        font-weight: bolder;
                    }
                    .picture {
                        grid-area: 2 / 1 / span 1 / span 1;
                        img{
                            height:100px;
                        }
                    }
                    .description {
                        grid-area: 3 / 1 / span 1 / span 1;

                    }
                    .price {
                        grid-area: 4 / 1 / span 1 / span 1;
                    }
                }
            }
        }
    }
}
</style>
