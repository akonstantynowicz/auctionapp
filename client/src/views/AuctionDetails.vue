<template>
<div class="aContainer">
    <div class="auction">
        <p class="error" v-if="error">{{ error }}</p>
        <div class="user" v-if="!user || user.username!==username">
            <h2 class="username">SPRZEDAWCA {{username}}</h2>
            <img @click="sendMessage" src="../assets/blueEnvelope.png"/>
        </div>
        <div class= "user" v-else-if="user && user.username===username">
            <h2 class="username">TWOJA AUKCJA</h2>
        </div>
        <div v-if="auction">
        <AuctionContent v-if="!editable" :auction="auction"/>
        <div v-if="isAuthenticated && new Date(auction.beginTime) < new Date() && !auction.soldTo" class="buyingSection">
            <button class="buyNow" v-if="!auction.isAuctionable && user.username!==username" @click="buy">KUP TERAZ</button>
            <div v-else-if="auction.isAuctionable" class="socketAuction">
                <OfferChat v-if="offers" :offers="offers" :minPrice="auction.price+'.01'" :isOwner="user.username===username" v-on:sendNewOffer="sendOffer" />
            </div>
        </div>
        <h1 v-else-if="!isAuthenticated">ZALOGUJ SIĘ ABY<br>UCZESTNICZYĆ W AUKCJI</h1>
        <h1 v-else-if="user.username!==username && new Date(auction.beginTime) > new Date()">AUKCJA JESZCZE SIĘ NIE ROZPOCZĘŁA</h1>
        <button v-else-if="user.username===username && new Date(auction.beginTime) > new Date()" @click="edit">EDYTUJ</button>
        <h1 v-if="auction.soldTo">SPRZEDANE</h1>
        <EditAuctionForm v-if="editable" :auction="auction"/>
        </div>
        <h1 v-else>NIE MA TAKIEJ AUKCJI</h1>
    </div>
</div>
</template>

<script>
import axios from "axios";
import io from 'socket.io-client';
import Auction from "../components/Auction";
import EditAuctionForm from "../components/EditAuctionForm";
import OfferChat from "../components/OfferChat";
const socketUrl = window.location.host + "/api/auction/";
//const socketUrl = "https://localhost:3000/api/auction/";


const url = "/api/auction/"
const msgUrl = "/api/conversation"

export default {
    data: function () {
        return {
            isAuthenticated: null,
            user: null,
            auction: null,
            username: null,
            error: null,
            socket: null,
            offers: [],
            users: [],
            editable: 0
        };
    },
    components: {
        AuctionContent: Auction,
        OfferChat,
        EditAuctionForm
    },
    methods: {
        buy () {
            axios.patch(url + this.$route.params.id,{
                buy: true
            }, { withCredentials: true} )
            .then((resp) => {
                this.$router.push("/history");
            })
            .catch(error => {
                this.error = error.response.data.message;
            })
        },
        joinAuction () {
            this.socket.emit("joinAuction", this.$route.params.id, this.user.id);
            
        },
        fetchMessages () {
            this.socket.on("fetchOffers", data => {
                this.offers = data.offers.reverse();
            })
        },
        sendOffer (offer) {
            this.socket.emit("sendOffer", this.$route.params.id, offer, this.user.id);
        },
        sendMessage () {
            axios.get(msgUrl, {
                withCredentials:true,
                params: {
                    toUser: this.username,
                }
            })
            .then((resp) => {
                if(resp.data.conversation){
                    this.$router.push('/chat');
                }else{
                    let message = prompt("Jaką wiadomość chcesz wysłać?")
                     axios.post(msgUrl, {
                        message: message,
                        toUser: this.username
                    }, { withCredentials: true})
                    .then((resp) => {
                        this.$router.push("/chat");
                    })
                    .catch(error => {
                        this.error = error.response.data.message;
                    });
                }
            })
            .catch((error) => {
                this.error = error.response.data.message;
            })
        },
        edit () {
            this.editable = !this.editable;
        }
    },
    created () {
        axios.get(url + this.$route.params.id, {withCredentials: true})
        .then((resp) => {
            this.auction=resp.data.auction;
            this.username=resp.data.username;
            this.isAuthenticated = resp.data.isAuthenticated;  
            this.user = resp.data.user;
        }).then(() => {
            if(this.isAuthenticated && this.auction.isAuctionable){
                this.socket = io(socketUrl);
                this.joinAuction();
            }
        }).then(() => {
            if(this.isAuthenticated && this.auction.isAuctionable){
                this.fetchMessages();
                this.socket.on("offer", data => {
                    console.log("newoffer");
                    
                    this.offers.unshift(data.fullOffer);
                    this.auction.price = data.fullOffer.newPrice;
                })
                this.socket.on("myerror", errdata => {
                    this.error = errdata;
                })
            }
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
    },
    beforeDestroy () {
        if(this.socket){
            this.socket.disconnect();
        }
    }
};
</script>

<style lang="scss">
$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgb(228, 218, 200);
$brown: rgb(57, 42, 28);
$grey: rgb(190, 216, 202);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);
.aContainer{
    background-color: $wood;
    .auction{
        .error {
            color: $burgundy;
            background-color: $lighterBurgundy;
            border-radius: 20px;
        }
        .user{
            background-color: $wood;
            height: 50px;
            .username{
                color: $darkTeal;
                display: inline-block;
                margin-top: 10px;
                padding-right: 10px;
            }
            img {
                height: 30px;
            }
        }
        .buyingSection {
            display:grid;
            border-bottom: 2px solid $brown;
            .buyNow {
                justify-self: end;
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
        h1 {
            color: $lighterTeal;
        }
        button {
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
