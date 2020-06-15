<template>
    <div class="buttons" v-if="!isAuthenticated">
      <router-link to="/login">
        <button @click="hideMenu" class="login">LOGOWANIE</button>
      </router-link>
      <router-link to="/register">
        <button @click="hideMenu" class="register">REJESTRACJA</button>
      </router-link>
    </div>
    <div class="buttons" v-else>
      <div class="link" v-if="newOffer" @click="seen">
        <router-link class="link" to="/panel">PRZEBITY!</router-link>
      </div>
      <router-link to="/chat">
        <img @click="hideDropdown" v-if="!newMessage" src="../assets/envelopeEmpty.png"/>
        <img @click="hideDropdown" v-else src="../assets/envelopeFull.png"/>
      </router-link>
      <div class="dropdown">
        <button class="dropButton" @click="dropDown">AUKCJE v</button>
        <div v-if="showDropdown" @click="hideDropdown" class="dropdownContent">
          <router-link class="link" to="/addAuction">DODAJ AUKCJĘ</router-link>
          <router-link class="link" to="/myAuctions">EDYTUJ AUKCJĘ</router-link>
          <router-link class="link" to="/history">MOJE AUKCJE</router-link>
          <router-link class="link" to="/panel">PANEL AUKCJOWANIA</router-link>
        </div>
      </div>
      <router-link to="/account">
        <button @click="hideDropdown">MOJE KONTO</button>
      </router-link>
      <button class="logout" @click="logout">WYLOGUJ SIĘ</button>
    </div>
</template>

<script>

export default {
  name: "Navigation",
  props: ["isAuthenticated", "newMessage", "newOffer"],
  data () {
      return{
          showDropdown: false
      }
  },
  methods: {
    logout (){
      this.$emit("logout");
    },
    dropDown() {
        this.showDropdown=!this.showDropdown;
    },
    hideDropdown() {
      this.showDropdown = false;
      this.hideMenu();
    },
    hideMenu() {
      this.$emit("hideMenu");
    },
    seen() {
      this.$emit("seen");
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
$breakpoint-tablet: 768px;
    .buttons {
      justify-self: end;
      align-self: center;
      display: flex;
      img{
        margin-top:5px;
        height: 30px;
      }
      button {
        height: 40px;
        width: 150px;
        background-color: $darkTeal;
        border: none;
        color: $wood;
        font-weight: bolder;
      }
      button:hover {
        background-color: $lighterTeal;
      }
      .dropdown{
        position: relative;
        display: inline-block;
        .dropdownContent {
          position: absolute;
          background-color: $wood;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1;
          .link{
            color: $darkTeal;
            font-weight: bolder;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
          }
        }
      }
    }

@media (max-width: 550px) {
    .loginGrid{
        .loginForm{
            width: 70%;
        }
    }
}
</style>
