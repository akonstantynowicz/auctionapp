<template>
    <div class="editableData">
        <h2 v-if="!isAuthenticated" class="title">Z A L O G U J <br> S I Ę</h2>
        <div v-else class="editables">
            <p class="error" v-if="error">{{ error }}</p>
            <h2 v-if="!auctions.length">NIE MASZ AUKCJI, KTÓRE MOŻESZ EDYTOWAĆ</h2>
            <h2 v-else>OTO AUKCJE, KTÓRE MOŻESZ EDYTOWAĆ</h2>
            <auction
                v-for="(auction, index) in auctions"
                :auction="auction"
                :index="index"
                :key="auction._id"></auction>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Auction from "../components/Auction";
const url = "api/editAuctions";

export default{
    name: "editableAuctions",
    data() {
        return {
            isAuthenticated: null,
            user: null,
            error: null,
            message: null,
            auctions: []
        }
    },
    components: {
        Auction
    },
    created(){
        axios.get(url, {withCredentials: true})
        .then((resp) => {
            this.isAuthenticated = resp.data.isAuthenticated;
            this.user = resp.data.user;
            this.auctions = resp.data.auctions;
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
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
.editableData {
    h2 {
        color: $lighterTeal;
        background-color: $lightWood;
    }
    .editables {
        h2 {
            color: $lighterTeal;
            background-color: $lightWood;
        }
        .error {
            color: $burgundy;
            background-color: $lighterBurgundy;
            border-radius: 20px;
        }
    }
}
</style>