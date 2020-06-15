<template>
    <div
      class="list-item"
      style="cursor: pointer"
      @click="selectConversation()">
      {{ usernameTo }} <div v-if="unread" class="dot"/>
    </div>
</template>

<script>
import axios from "axios";
const url = "api/conversation/";

export default {
    props: ["conversation"],
    data () {
        return {
            usernameTo: null,
            userIdFrom: null,
            usernameFrom: null,
            unread: false
        };
    },
    computed: {
    },
    methods: {
        selectConversation () {
            this.unread=false;
            this.$root.$emit("conversationSelected", this.conversation, this.usernameTo, this.userIdFrom, this.usernameFrom);
        }
    },
    created () {       
        axios.get(url + this.conversation._id, { withCredentials: true })
        .then(res => {
            this.usernameTo = res.data.username;
            this.userIdFrom = res.data.user.id;
            this.usernameFrom = res.data.user.username;
            this.unread = res.data.unread;
        })
        .catch(error => {
            this.error = error.response.data.message;
        });
    }
};
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
  @mixin element {
      height: 50px;
      color:$wood;
      background-color: $lightTeal;
      border-bottom: 2px solid $brown;
      font-weight: bolder;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: larger;
  }
  .list-item {
      @include element();
  }
  .dot {
      height: 10px;
      width: 10px;
      border-radius: 20px;
      background-color: $burgundy;
  }
</style>
