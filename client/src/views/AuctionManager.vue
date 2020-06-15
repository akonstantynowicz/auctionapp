<template>
    <div class="manager">
        <h2 v-if="!isAuthenticated" class="title">Z A L O G U J <br> S I Ę</h2>
        <div v-else class="panel">
            <p class="error" v-show="visible" v-if="error">{{ error }}</p>
            <h2 v-if="!auctions.length">NIE MASZ LICYTACJI W KTÓRYCH BIERZESZ UDZIAŁ</h2>
            <h2 v-else>LICYTACJE, W KTÓRYCH UCZESTNICZYSZ</h2>
            <div class="gridPanel">
                <div class="auctionables" v-for="(auction, index) in auctions" :key="auction._id" :index="index">
                    <h3>{{auction.itemName}}</h3>
                    <p>{{auction.description}}</p>
                    <h4>aktualnie: {{ auction.price }} zł</h4>
                    <input type="number" :min="auction.price+'.01'" v-model="offer[index]"/>
                    <button @click="sendOffer(auction._id, index)">ZAOFERUJ</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import io from 'socket.io-client';
const url = "api/auctions/participating";
const socketUrl = window.location.host + "/api/auction/";
//const socketUrl = "https://localhost:3000/api/auction/";


export default{
    name: "historicalAuctions",
    data() {
        return {
            isAuthenticated: null,
            user: null,
            error: null,
            message: null,
            auctions: [],
            offer: [],
            socket: null,
            visible: false
        }
    },
    created(){
        axios.get(url, {withCredentials: true})
        .then((resp) => {
            this.isAuthenticated = resp.data.isAuthenticated;
            this.user = resp.data.user;
            this.auctions = resp.data.auctions;         
        })
        .then(() => {
            if(this.isAuthenticated && this.auctions.length){
                console.log(socketUrl);
                this.socket = io(socketUrl);
                for(let i=0; i<this.auctions.length; i++){
                    this.socket.emit("joinAuction", this.auctions[i]._id, this.user.id);
                }
            }
        })
        .then(() => {
            this.socket.on("offer", data => {
                    this.auctions[this.findAuctionIndex(data.auctionRoom)].price = data.fullOffer.newPrice;
                })
            this.socket.on("myerror", errdata => {
                this.error = errdata;
                this.visible = true;
            })
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
    },
    updated () {
        setTimeout(() => this.visible = false, 4000);
    },
    methods: {
        sendOffer(auctionId, index){
            console.log(index);
            console.log(this.offer[index]);
            this.socket.emit("sendOffer", auctionId, this.offer[index], this.user.id);
            this.offer[index]="";
        },
        findAuctionIndex(auctionId){
            for(let i=0; i<this.auctions.length; i++){
                if(this.auctions[i]._id===auctionId){
                    return i;
                }
            }
        }
    },
    beforeDestroy () {
        if(this.socket){
            this.socket.disconnect();
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

.manager {
    h2 {
      color: $lighterTeal;
      background-color: $lightWood;
    }
    .panel {
        .gridPanel{
            display: grid;
            grid-template-columns: repeat(4,25%);
            .auctionables {
                background-color: $wood;
                color: $brown;
                border-left: 1px solid $brown;
                border-right: 1px solid $brown;
                input {
                    border: none;
                    background-color: $lightWood;
                    border-radius: 20px;
                    height: 30px;
                    width: 100%;
                    text-align: center;
                }
                button {
                    background-color: $darkTeal;
                    color: $wood;
                    border: none;
                    border-radius: 20px;
                    font-weight: bolder;
                    height: 30px;
                }
            }
        }
        .error {
            color: $burgundy;
            background-color: $lighterBurgundy;
            border-radius: 20px;
        }
    }
}
</style>