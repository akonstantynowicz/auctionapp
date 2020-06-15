<template>
    <div class="conversation-list" v-if="conversations">
        <conversation
            v-for="(conversation, index) in conversations"
            :conversation="conversation"
            :key="index">
        </conversation>
    </div>
</template>

<script>
import axios from "axios";
import Conversation from "./Conversation.vue";
const url = "api/conversations";

export default {
    data: function () {
        return {
            conversations: null
        };
    },
    components: {
        Conversation
    },
    created () {
         axios.get(url, { withCredentials: true })
        .then(res => {
            this.conversations = res.data.conversations;
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

.conversation-list {
  grid-area: 1 / 1 / span 1 / span 1;
  background-color: $wood;
}

</style>
