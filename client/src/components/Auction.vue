<template>
<router-link class="router" :to="{ name: 'auction', params: {id: auction._id } }">
    <div class="auction" @click="selectAuction()">
    <p class="name"> {{ auction.itemName }}</p>
    <div class="picture">
        <img :src="require('../assets/' + auction.picture)" alt="halo">
    </div>
    <p class="description">{{ auction.description }}</p>
    <p class="timeLeft">{{ toEnding }} dni do końca</p>
    <p class="price">{{ auction.price }} zł</p>
  </div>
</router-link>
</template>

<script>
export default {
    props: ["auction"],
    data () {
        return {
            toEnding: null
        };
    },
    methods: {
        selectAuction() {
            this.$root.$emit("auctionSelected", this.server);
        }
    },
    created(){
        this.toEnding = Math.round((new Date(this.auction.endTime) - new Date(this.auction.beginTime))/86400000);
    }
};
</script>

<style lang=scss>

$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgba(245, 234, 214, 0.562);
$brown: rgb(57, 42, 28);
$grey: rgb(77, 97, 94);

.router{
    text-decoration: none;
    .auction{
        background-color:$lightWood;
        display: grid;
        grid-template-rows: 30% 40% 30%;
        grid-template-columns: 40% 60%;
        border-top: 2px solid $brown;
        border-bottom: 2px solid $brown;
        padding-left: 10px;
        padding-right: 10px;
        color: $darkTeal;
        margin-bottom: 5px;
        .name{
            grid-area: 1 / 1 / span 1 / span 1;
            justify-self: start;
            align-self: center;
            font-size: 30px;
            font-weight: bolder;
        }
        .picture{
            grid-area: 2 / 1 / span 2 / span 1;
            img {
                max-height: 150px;
            }
        }
        .description{
            grid-area: 2 / 2 / span 1 / span 1;
            justify-self: end;
            font-size: 20px;
        }
        .price{
            grid-area: 3 / 2 / span 1 / span 1;
            justify-self: end;
            font-size: 25px;
            font-weight: bolder;
        }
        .timeLeft{
            grid-area: 1 / 2 / span 1 / span 1;
            justify-self: end;
        }

    }
}
@media (max-width: 500px) {
    .router{
    text-decoration: none;
        .auction{
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 10% 20% 30% 20% 20%;
            .name{
                grid-area: 2 / 1 / span 1 / span 1;
            }
            .picture{
                grid-area: 3 / 1 / span 1 / span 1;
            }
            .description{
                grid-area: 4 / 1 / span 1 / span 1;
            }
            .price{
                grid-area: 5 / 1 / span 1 / span 1;
            }
            .timeLeft{
                grid-area: 1 / 1 / span 1 / span 1;
            }
        }
    }
}
</style>
