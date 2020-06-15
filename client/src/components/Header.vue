<template>
<div class="routerView">
  <div class="header">
    <div class="appLogo">
      <router-link to="/">
        <img alt="App logo" src="../assets/logoNewer.png" />
      </router-link>
    </div>
      <Navigation class="normal" :isAuthenticated="isAuthenticated" :newMessage="newMessage" :newOffer="newOffer" v-on:seen="seen" v-on:logout="logout" />
      <div class="menu">
        <button @click="dropDown" class="button">MENU v</button>
        <div v-if="showDropdown" class="menuContent">
          <Navigation :isAuthenticated="isAuthenticated" :newMessage="newMessage" :newOffer="newOffer" v-on:logout="logout" v-on:seen="seen" v-on:hideMenu="hideMenu"/>
        </div>
      </div>
  </div>
    <router-view></router-view>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from "axios";
import Navigation from "./Navigation";
const url = "/api";
const logoutUrl = "/api/logout";
const socketUrl = window.location.host;
//const socketUrl = "https://localhost:3000"

export default {
  name: "Header",
  components: {
    Navigation
  },
  data() {
    return {
      isAuthenticated: null,
      user: null,
      error: null,
      showDropdown: false,
      socket: null,
      newMessage: false,
      newOffer: false
    };
  },
  created() {
    axios.get(url, { withCredentials: true })
      .then(res => {
        this.isAuthenticated = res.data.isAuthenticated;
        this.user = res.data.user;
        this.newMessage = res.data.newMessages;
        console.log(this.newMessage);
        

        if(this.isAuthenticated){
          this.socket = io(socketUrl);
          console.log(this.socket);
          console.log(this.isAuthenticated);
          
          this.socket.emit("online", this.user.username);
          this.socket.username = this.user.username;
          this.socket.on("newMessage", data => {
            console.log("newmessage!");
            this.newMessage = true;          
          });
          this.socket.on("betterOffer", data => {
            console.log("newoffer!");
            this.newOffer = true;          
          });
          this.socket.on("noMessages", data => {
            console.log("nomessages");
            if(this.newMessage>0){
              this.newMessage--;          
            }
          });
        }
      })
      .catch(error => {
        this.error = error.response.data.message;
      });
  },
  updated() {
    axios.get(url, { withCredentials: true })
      .then(res => {
        this.isAuthenticated = res.data.isAuthenticated;
        this.user = res.data.user;
        this.newMessage = res.data.newMessages;
        if(this.isAuthenticated && !this.socket){
          this.socket = io(socketUrl);
          this.socket.emit("online", this.user.username);
        }
      })
      .then(() => {
        if(this.isAuthenticated && this.socket){
          this.socket.on("newMessage", data => {
            console.log("newmessage!");
            this.newMessage = true;          
          });
          this.socket.on("betterOffer", data => {
            console.log("newoffer!");
            this.newOffer = true;          
          });
          this.socket.on("noMessages", data => {
            console.log("nomessages");
            if(this.newMessage>0){
              this.newMessage--;          
            }
          });
        }
      })
      .catch(error => {
        this.error = error.response.data.message;
      });
  },
  methods: {
    logout() {
      axios
        .get(logoutUrl, { withCredentials: true })
        .then(res => {
          this.isAuthenticated = res.data.isAuthenticated;
          this.user = res.data.user;
          this.showDropdown = false;
          console.log("logging out");
          console.log(this.socket);
          
          if(this.socket){
            console.log("disconnecting client");
            this.socket.disconnect();
          }
          this.$router.push("/");
        })
        .catch(error => {
          this.error = error.response.data.message;
        });
    },
    dropDown() {        
        this.showDropdown=!this.showDropdown;
        console.log(this.showDropdown);
    },
    hideMenu() {
      this.showDropdown=false;
    },
    seen() {
      this.newOffer=false;
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


.routerView{
  background-image:radial-gradient($grey,$lightTeal);
  height: inherit;
  .header {
    display: grid;
    grid-template-columns: 50% 50%;
    border-bottom: 2px solid $brown;
    background-color: $darkTeal;
    .appLogo {
      justify-self: start;
      align-self: center;
      display: flex;
      img {
        align-self: center;
        height: 85px;
        width: auto;
      }
    }
    .menu {
      display: none;
    }
  }
  .page {
    display: grid;
    grid-template-columns: 25% 50% 25%;
  }
}

@media (max-width: 700px) {
  .routerView{
    .header {
      .menu {
        position: relative;
        display: inline-block;
        .button {
          height: 40px;
          width: 150px;
          background-color: $darkTeal;
          border: none;
          color: $wood;
          font-weight: bolder;
        }
        .button:hover {
          background-color: $lighterTeal;
        }
        .menuContent {
          position: absolute;
          background-color: $darkTeal;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          .buttons {
            display: block;
          }
        }
      }
      .normal {
        display: none;
      }
    }
    .page {
      grid-template-columns: 10% 80% 10%;
    }
  }
}
</style>
