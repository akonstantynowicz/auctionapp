<template>
    <div class="offerWindow">
        <div class="offers">
            <div class="offer" v-for="offer in offers" :key="offer.index">
                <div class="username">zaoferowano: </div>
                <div class="offerValue"> {{ offer.newPrice }} zł</div>
            </div>
        </div>
        <form v-if="!isOwner" @submit.prevent="sendOffer" class="offerContainer">
            <input type="number"  step="0.01" v-model="value" :min="minPrice">
            <button :disabled="!value">LICYTUJ</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "offerChat",
    props: ["offers", "minPrice","isOwner"],
    data() {
        return {
            value: "",
            localOffers: []
        };
    },
    methods: {
        sendOffer () {
            if(!this.value){
                alert("oferta nie może być pusta");
                return;
            }else{
                this.$emit("sendNewOffer", this.value);
                this.value = "";
                return;
            }
        }
    }
}
</script>

<style lang="scss">
$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgba(245, 234, 214, 0.562);
$brown: rgb(57, 42, 28);
$grey: rgb(190, 216, 202);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);
.offerWindow {
    display: grid;
    grid-template-columns: 60% 40%;
    .offers {
        color: $burgundy;
        font-weight: bolder;
        grid-area: 1 / 1 / span 1 / span 1;
        height: 150px;
        overflow: scroll;
        .offer {
            display: flex;
            border-bottom: 1px solid $brown;
            .username {
                width: 100px;
                margin-right: 15px;
            }
            .offerValue {
                flex: 1;
            }
        }
    }
    .offerContainer {
        grid-area: 1 / 2 / span 1 / span 1;
        display: flex;
        flex-direction: column;
        input {
            height:40px;
            margin-bottom: 10px;
        }
        button {
            align-self: center;
            background-color: $darkTeal;
            color: $wood;
            border: none;
            border-radius: 20px;
            height: 50px;
            width: 200px;
            font-weight: bolder;
            margin-bottom: 10px;
        }
    }
}
</style>