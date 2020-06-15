<template>
    <div class="historyData">
        <h2 v-if="!isAuthenticated" class="title">Z A L O G U J <br> S I Ę</h2>
        <div v-else class="historical">
        <div class="buttonPanel">
            <button class="swiper" @click="showBought">AUKCJE WYGRANE/KUPIONE PRZEZ CIEBIE</button>
            <button class="swiper" @click="showYours">TWOJE AUKCJE</button>
        </div>
        <div v-if="bought">
            <Bought />
        </div>
        <div v-if="yours">
            <div class="buttonPanel">
            <button class="swiper" @click="showHistorical">ZAKOŃCZONE AUKCJE</button>
            <button class="swiper" @click="showCurrent">TRWAJĄCE AUKCJE</button>
            </div>
             <div v-if="historical">
                <Yours />
            </div>
            <div v-if="current">
                <Current />
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
const url = "api/historicalAuctions";
import Bought from "../components/Bought";
import MyAuctions from "../components/MyAuctions"
import MyCurrentAuctions from "../components/MyCurrentAuctions"

export default{
    name: "historicalAuctions",
    data() {
        return {
            isAuthenticated: null,
            user: null,
            error: null,
            yours: false,
            bought: true,
            historical:false,
            current: false
        }
    },
    components: {
        Bought,
        Yours: MyAuctions,
        Current: MyCurrentAuctions
    },
    created(){
        axios.get(url, {withCredentials: true})
        .then((resp) => {
            this.isAuthenticated = resp.data.isAuthenticated;
            this.user = resp.data.user;
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
    },
    methods: {
        showBought() {
            this.yours = false;
            this.historical=false;
            this.current=false;
            this.bought = true;
        },
        showYours () {
            this.bought = false;
            this.yours = true;
        },
        showHistorical() {
            this.current = false;
            this.historical = true;
        },
        showCurrent() {
            this.historical = false;
            this.current = true;
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
.historyData {
    background-image: radial-gradient($grey,$lightTeal);
    .title {
      color: $lighterTeal;
      background-color: $lightWood;
    }
    .historical {
        .buttonPanel {
            display: flex;
            justify-content: space-evenly;
            background-color: $wood;
            border-bottom: 3px solid $brown;
            .swiper {
                background-color: $wood;
                color: $brown;
                border: none;
                font-weight: bolder;
                height: 50px;
                width: 100%;
            }
            .swiper:hover {
                background-color: $lightWood;
            }
        }
        .title {
           color: $lighterTeal;
        }
        .error {
            color: $burgundy;
            background-color: $lighterBurgundy;
            border-radius: 20px;
        }
    }
}
</style>